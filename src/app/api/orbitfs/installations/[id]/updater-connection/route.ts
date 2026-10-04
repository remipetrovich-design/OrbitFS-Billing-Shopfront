import {httpError,loadInstallation,requireOrbitUser} from "@/lib/orbitfs-deployment";
import {licenseDb} from "@/lib/license-api";
import {vercelApi} from "@/lib/orbitfs-deployment";

function expectedEngineProjectName(installationId:string){
  const suffix=String(installationId||"").toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,10)||"host";
  return ("orbitfs-engine-"+suffix).slice(0,100);
}
function publicUrl(value:unknown){
  const raw=String(value||"").trim().replace(/^https?:\/\//i,"").replace(/\/$/,"");
  return raw?"https://"+raw:"";
}
function deploymentMeta(deployment:any){
  return deployment?.meta&&typeof deployment.meta==="object"?deployment.meta:{};
}
function isInnerDeployerDeployment(deployment:any,installationId:string){
  const meta=deploymentMeta(deployment);
  return String(meta.orbitfsInstallationId||"").trim()===String(installationId||"").trim() &&
    /^\d+$/.test(String(meta.orbitfsEngineDeployerProtocol||"").trim()) &&
    String(meta.installationRoute||"").trim().length>0 &&
    String(meta.orbitfsDistribution||"").trim().length>0;
}
async function clearUnverifiedConnection(install:any){
  const metadata=install.metadata&&typeof install.metadata==="object"?{...install.metadata}:{};
  const current=metadata.updaterConnection&&typeof metadata.updaterConnection==="object"?metadata.updaterConnection:null;
  if(!current)return;
  if(current.provenance==="inner-deployer-v1"&&current.autoVerified===true)return;
  delete metadata.updaterConnection;
  await licenseDb().from("orbitfs_installations").update({metadata,updated_at:new Date().toISOString()}).eq("id",install.id).eq("auth_user_id",install.auth_user_id);
}

export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {user}=await requireOrbitUser(req);
    const {id}=await params;
    const install=await loadInstallation(id,user.id);
    const installationId=String(install.installation_id||"").trim();
    if(!installationId)throw Object.assign(new Error("OrbitFS installation identity is missing"),{status:409,code:"INSTALLATION_ID_MISSING"});

    const expectedName=expectedEngineProjectName(installationId);
    let project:any=null;
    try{
      project=await vercelApi(user.id,"/v9/projects/"+encodeURIComponent(expectedName));
    }catch(error:any){
      if(Number(error?.status||0)!==404)throw error;
    }
    if(!project?.id||String(project.name||"")!==expectedName){
      await clearUnverifiedConnection(install);
      return Response.json({eligible:false,reason:"INNER_DEPLOYER_ENGINE_NOT_FOUND",connection:null},{headers:{"cache-control":"no-store"}});
    }

    const deploymentResponse:any=await vercelApi(user.id,
      "/v6/deployments?projectId="+encodeURIComponent(String(project.id))+"&target=production&limit=20");
    const deployments=Array.isArray(deploymentResponse?.deployments)?deploymentResponse.deployments:[];
    const verified=deployments.find((row:any)=>isInnerDeployerDeployment(row,installationId));
    if(!verified){
      await clearUnverifiedConnection(install);
      return Response.json({eligible:false,reason:"INNER_DEPLOYER_PROVENANCE_REQUIRED",connection:null},{headers:{"cache-control":"no-store"}});
    }

    const aliases=Array.isArray(verified.alias)?verified.alias:[];
    const engineHostUrl=publicUrl(aliases[0]||project.alias?.[0]||expectedName+".vercel.app");
    if(!engineHostUrl)throw Object.assign(new Error("Inner Deployer Engine Host URL could not be resolved"),{status:409,code:"ENGINE_HOST_URL_MISSING"});

    const previous=install.metadata?.updaterConnection&&typeof install.metadata.updaterConnection==="object"?install.metadata.updaterConnection:{};
    const now=new Date().toISOString();
    const connection={
      ...previous,
      linked:true,
      autoVerified:true,
      provenance:"inner-deployer-v1",
      engineHostUrl,
      engineProjectId:String(project.id),
      engineProjectName:expectedName,
      engineDeploymentId:String(verified.uid||verified.id||"")||null,
      engineDeployerProtocol:Number(deploymentMeta(verified).orbitfsEngineDeployerProtocol||0)||null,
      installationRoute:String(deploymentMeta(verified).installationRoute||""),
      distribution:String(deploymentMeta(verified).orbitfsDistribution||""),
      linkedAt:previous.linkedAt||now,
      verifiedAt:now,
      updatedAt:now
    };
    const metadata={...(install.metadata&&typeof install.metadata==="object"?install.metadata:{}),updaterConnection:connection};
    const {data,error}=await licenseDb().from("orbitfs_installations").update({metadata,updated_at:now})
      .eq("id",install.id).eq("auth_user_id",user.id).select().single();
    if(error)throw error;
    return Response.json({eligible:true,autoLinked:true,connection:data.metadata?.updaterConnection||connection},{headers:{"cache-control":"no-store"}});
  }catch(error){return httpError(error)}
}

export async function POST(){
  return Response.json({ok:false,code:"MANUAL_UPDATER_LINK_DISABLED",error:"Updater linking is automatic and only available for Shared Engine Hosts created by the Inner Deployer."},{status:405,headers:{allow:"GET"}});
}
export async function DELETE(){
  return Response.json({ok:false,code:"MANUAL_UPDATER_UNLINK_DISABLED",error:"Updater linking is managed automatically from verified Inner Deployer deployment provenance."},{status:405,headers:{allow:"GET"}});
}

import {httpError,loadInstallation,requireOrbitUser} from "@/lib/orbitfs-deployment";
import {licenseDb} from "@/lib/license-api";

function httpsOrigin(value:unknown){
  const raw=String(value||"").trim();
  try{
    const parsed=new URL(raw);
    if(parsed.protocol!=="https:"||parsed.username||parsed.password||parsed.search||parsed.hash)throw new Error();
    return parsed.origin;
  }catch{throw Object.assign(new Error("Engine Host URL must be a public HTTPS origin"),{status:400,code:"UPDATER_ENGINE_URL_INVALID"})}
}
function projectId(value:unknown){
  const raw=String(value||"").trim();
  if(!/^prj_[A-Za-z0-9]+$/.test(raw))throw Object.assign(new Error("A valid Vercel Engine project id is required"),{status:400,code:"UPDATER_ENGINE_PROJECT_INVALID"});
  return raw;
}

export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {user}=await requireOrbitUser(req);
    const {id}=await params;
    const install=await loadInstallation(id,user.id);
    const connection=install.metadata?.updaterConnection&&typeof install.metadata.updaterConnection==="object"?install.metadata.updaterConnection:null;
    return Response.json({connection:connection||null},{headers:{"cache-control":"no-store"}});
  }catch(error){return httpError(error)}
}

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {user}=await requireOrbitUser(req);
    const {id}=await params;
    const install=await loadInstallation(id,user.id);
    const body=await req.json().catch(()=>({}));
    const engineHostUrl=httpsOrigin(body.engineHostUrl);
    const engineProjectId=projectId(body.engineProjectId);
    const engineProjectName=String(body.engineProjectName||"").trim().slice(0,100)||null;
    const previous=install.metadata?.updaterConnection&&typeof install.metadata.updaterConnection==="object"?install.metadata.updaterConnection:{};
    const connection={
      ...previous,
      linked:true,
      engineHostUrl,
      engineProjectId,
      engineProjectName,
      linkedAt:previous.linkedAt||new Date().toISOString(),
      updatedAt:new Date().toISOString()
    };
    const metadata={...(install.metadata&&typeof install.metadata==="object"?install.metadata:{}),updaterConnection:connection};
    const {data,error}=await licenseDb().from("orbitfs_installations").update({metadata,updated_at:new Date().toISOString()}).eq("id",install.id).eq("auth_user_id",user.id).select().single();
    if(error)throw error;
    return Response.json({ok:true,connection:data.metadata?.updaterConnection||connection},{headers:{"cache-control":"no-store"}});
  }catch(error){return httpError(error)}
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {user}=await requireOrbitUser(req);
    const {id}=await params;
    const install=await loadInstallation(id,user.id);
    const metadata={...(install.metadata&&typeof install.metadata==="object"?install.metadata:{})};
    delete metadata.updaterConnection;
    const {error}=await licenseDb().from("orbitfs_installations").update({metadata,updated_at:new Date().toISOString()}).eq("id",install.id).eq("auth_user_id",user.id);
    if(error)throw error;
    return Response.json({ok:true},{headers:{"cache-control":"no-store"}});
  }catch(error){return httpError(error)}
}

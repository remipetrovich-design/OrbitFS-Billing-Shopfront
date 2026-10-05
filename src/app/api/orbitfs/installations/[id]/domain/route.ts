import {checkInstallationVercelDomainAvailability,configureInstallationDomain,httpError,installationDomainStatus,loadInstallation,removeInstallationCustomDomain,requireOrbitUser} from "@/lib/orbitfs-deployment";

export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {user}=await requireOrbitUser(req);
    const {id}=await params;
    const install=await loadInstallation(id,user.id);
    return Response.json({domain:await installationDomainStatus(install)},{headers:{"cache-control":"no-store"}});
  }catch(error){return httpError(error)}
}

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {user}=await requireOrbitUser(req);
    const {id}=await params;
    const install=await loadInstallation(id,user.id);
    const body=await req.json().catch(()=>({}));
    const action=String(body.action||"save").trim().toLowerCase();
    if(action==="remove"){
      return Response.json({domain:await removeInstallationCustomDomain(install,body.domain)},{headers:{"cache-control":"no-store"}});
    }
    if(action==="check-vercel"){
      return Response.json({availability:await checkInstallationVercelDomainAvailability(install,body.domain)},{headers:{"cache-control":"no-store"}});
    }
    const result=await configureInstallationDomain(install,{mode:body.mode,domain:body.domain});
    return Response.json(result,{headers:{"cache-control":"no-store"}});
  }catch(error){return httpError(error)}
}

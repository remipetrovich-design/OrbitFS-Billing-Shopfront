import {requireOrbitUser} from "@/lib/orbitfs-deployment";
import {userRpc} from "@/lib/paymentServer";

export async function requireOrbitDeploymentAdmin(req:Request){
  const auth=await requireOrbitUser(req);
  const allowed=await userRpc(auth.token,"has_permission",{p_permission:"licenses.manage"});
  if(allowed!==true)throw Object.assign(new Error("Deployment actions require licenses.manage"),{status:403});
  return auth;
}

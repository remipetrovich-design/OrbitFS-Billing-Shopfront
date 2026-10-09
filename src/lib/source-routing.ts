// Fallback storefront navigations return to MAIN when its Production
// deployment is verified READY by the central License Manager.
const AUTHORITY='https://incendiarynetworks.cc/api/v1/source-routing';
const FALLBACK_HOST='orbitfs-billing-fallback.vercel.app';
const MAIN_STORE='https://orbitfsstore.vercel.app';
export function eligibleStoreNavigation(url:string,method:string,accept:string):boolean{
  const current=new URL(url);
  return current.hostname.toLowerCase()===FALLBACK_HOST &&
    method==='GET' &&
    accept.toLowerCase().includes('text/html') &&
    !/^\/(?:api|_next|\.well-known)(?:\/|$)/.test(current.pathname);
}
export async function standbyStoreUrl(
  url:string,
  method:string,
  accept:string,
  get:typeof fetch=fetch
):Promise<string|undefined>{
  if(!eligibleStoreNavigation(url,method,accept))return;
  try{
    const response=await get(AUTHORITY,{
      cache:'no-store',signal:AbortSignal.timeout(3500),
      headers:{accept:'application/json'}
    });
    if(!response.ok)return;
    const state=await response.json() as {
      mode?:string;ready?:{billing?:boolean};targets?:{billing?:string}
    };
    if(state.mode!=='main'||state.ready?.billing!==true||
      state.targets?.billing!==MAIN_STORE)return;
    const source=new URL(url),target=new URL(MAIN_STORE);
    target.pathname=source.pathname;
    target.search=source.search;
    return target.toString();
  }catch{return;}
}

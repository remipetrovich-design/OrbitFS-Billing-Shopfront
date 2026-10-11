const DEFAULT_STORE_ORIGIN=process.env.NEXT_PUBLIC_ORBITFS_STORE_URL||process.env.NEXT_PUBLIC_SITE_URL||process.env.SITE_URL||"";
const SUPABASE_URL=process.env.NEXT_PUBLIC_SUPABASE_URL||"";
const SUPABASE_KEY=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||"";

function normalizeOrigin(value:string){
  try{return new URL(value).origin.replace(/\/$/,"")}catch{return ""}
}

async function configuredStoreOrigin(){
  if(SUPABASE_URL&&SUPABASE_KEY){
    try{
      const endpoint=new URL(`${SUPABASE_URL}/rest/v1/app_settings`);
      endpoint.searchParams.set("key","eq.site.public_url");
      endpoint.searchParams.set("select","value");
      endpoint.searchParams.set("limit","1");
      const response=await fetch(endpoint,{headers:{apikey:SUPABASE_KEY},cache:"no-store"});
      if(response.ok){
        const rows=await response.json().catch(()=>[]);
        const configured=normalizeOrigin(String(rows?.[0]?.value||""));
        if(configured)return configured;
      }
    }catch{}
  }
  return normalizeOrigin(DEFAULT_STORE_ORIGIN);
}

// requestUrl is retained for compatibility with existing callers but is never
// used as an origin. Production URLs come only from configured Store settings.
export async function orbitfsStoreOrigin(_requestUrl?:string){
  const origin=await configuredStoreOrigin();
  if(!origin)throw new Error("SITE_URL or NEXT_PUBLIC_ORBITFS_STORE_URL is required");
  return origin;
}

export async function orbitfsStoreUrl(path="",requestUrl?:string){
  const origin=await orbitfsStoreOrigin(requestUrl);
  if(!path)return origin;
  return `${origin}${path.startsWith("/")?path:`/${path}`}`;
}

export const ORBITFS_STORE_ORIGIN=DEFAULT_STORE_ORIGIN;

// OAuth must return to the storefront that started the connection. The shared
// database's canonical public storefront URL is not an OAuth callback origin.
// Only the known fallback production host is overridden here: untrusted Host
// headers and arbitrary preview hosts cannot become OAuth redirect destinations.
export async function orbitfsProviderOAuthOrigin(requestUrl:string){
  const request=new URL(requestUrl);
  if(request.hostname==="orbitfs-billing-fallback.vercel.app"&&request.protocol==="https:")
    return "https://orbitfs-billing-fallback.vercel.app";
  return orbitfsStoreOrigin(requestUrl);
}

export async function orbitfsProviderOAuthUrl(path:string,requestUrl:string){
  const origin=await orbitfsProviderOAuthOrigin(requestUrl);
  return new URL(path,origin).toString();
}

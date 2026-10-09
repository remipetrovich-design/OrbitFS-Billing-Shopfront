import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {standbyStoreUrl} from './lib/source-routing';

// Next.js 16 proxy only handles browser documents. The fallback domain
// returns to MAIN on a future source switch; no API requests are redirected.
export async function proxy(request:NextRequest){
  const destination=await standbyStoreUrl(
    request.url,request.method,request.headers.get('accept')||''
  );
  if(destination)return NextResponse.redirect(destination,307);
  return NextResponse.next();
}
export const config={
  matcher:['/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)'],
};

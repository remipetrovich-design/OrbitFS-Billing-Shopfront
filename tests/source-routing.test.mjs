import test from 'node:test';
import assert from 'node:assert/strict';
import {eligibleStoreNavigation,standbyStoreUrl} from '../src/lib/source-routing.ts';
const home='https://orbitfs-billing-fallback.vercel.app/cart?q=one';
test('standby navigation ignores APIs, POST, assets and MAIN',()=>{
 assert.equal(eligibleStoreNavigation(home,'GET','text/html'),true);
 assert.equal(eligibleStoreNavigation('https://orbitfsstore.vercel.app/','GET','text/html'),false);
 assert.equal(eligibleStoreNavigation('https://orbitfs-billing-fallback.vercel.app/api/checkout','GET','text/html'),false);
 assert.equal(eligibleStoreNavigation(home,'POST','text/html'),false);
});
test('MAIN READY redirects browser navigation back to Main Store',async()=>{
 const redirected=await standbyStoreUrl(home,'GET','text/html',async()=>new Response(JSON.stringify({
  mode:'main',ready:{billing:true},targets:{billing:'https://orbitfsstore.vercel.app'}
 })));
 assert.equal(redirected,'https://orbitfsstore.vercel.app/cart?q=one');
});
test('inactive or unready MAIN cannot redirect Fallback',async()=>{
 for(const state of [
  {mode:'fallback',ready:{billing:true},targets:{billing:'https://orbitfsstore.vercel.app'}},
  {mode:'main',ready:{billing:false},targets:{billing:'https://orbitfsstore.vercel.app'}},
 ])assert.equal(await standbyStoreUrl(home,'GET','text/html',async()=>new Response(JSON.stringify(state))),undefined);
});

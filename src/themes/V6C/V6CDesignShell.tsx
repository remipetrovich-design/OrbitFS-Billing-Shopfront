"use client";

import Link from "next/link";
import type {ReactNode} from "react";

type Props={
  path:string;
  children:ReactNode;
  canAccessAdmin?:boolean;
  loggingOut?:boolean;
  onLogout?:()=>void;
  tools?:ReactNode;
};

const nav=[
  ["Dashboard","/portal"],
  ["Store","/portal/products"],
  ["Billing","/portal/orders"],
  ["Support","/portal/support"],
  ["Settings","/portal/settings"],
] as const;

type RouteInfo={key:string;eyebrow:string;title:string;description:string};
function routeInfo(path:string):RouteInfo|null{
  if(path==="/portal")return {key:"dashboard",eyebrow:"COMPLETE PLATFORM",title:"Your OrbitFS, all in one place.",description:"Billing, support, products, deployments, licences and updates in one consistent customer portal."};
  if(path.startsWith("/portal/products")||path.startsWith("/portal/basket")||path.startsWith("/portal/checkout"))return {key:"store",eyebrow:"ORBITFS STORE",title:"Build your OrbitFS setup.",description:"Choose your core system, add the components you need and manage checkout from the same platform."};
  if(path.startsWith("/portal/support"))return {key:"support",eyebrow:"SUPPORT CENTRE",title:"Help when you need it.",description:"Open and track support requests, review conversations and browse the OrbitFS knowledge base."};
  if(path.startsWith("/portal/settings"))return {key:"settings",eyebrow:"MY ACCOUNT",title:"Account settings.",description:"Manage your profile, billing details, Wallet, preferences and security."};
  if(path.startsWith("/portal/orbitfs/license"))return {key:"license",eyebrow:"MY ORBITFS · LICENCE",title:"License Controller",description:"View your authoritative licence state, entitlements and permitted customer actions."};
  if(path.startsWith("/portal/orbitfs/channels"))return {key:"channels",eyebrow:"MY ORBITFS · RELEASE CHANNELS",title:"Release Channels",description:"Choose how early you receive OrbitFS releases and manage access to restricted channels."};
  return null;
}

function active(label:string,path:string){
  if(label==="Dashboard")return path==="/portal";
  if(label==="Store")return path.startsWith("/portal/products")||path.startsWith("/portal/basket")||path.startsWith("/portal/checkout");
  if(label==="Billing")return path.startsWith("/portal/orders")||path.startsWith("/portal/invoices");
  if(label==="Support")return path.startsWith("/portal/support");
  if(label==="My OrbitFS")return path.startsWith("/portal/orbitfs");
  if(label==="Settings")return path.startsWith("/portal/settings");
  return false;
}

export default function V6CDesignShell({path,children,canAccessAdmin=false,loggingOut=false,onLogout,tools}:Props){
  const info=routeInfo(path);
  const orbitfs=path.startsWith("/portal/orbitfs");
  const routeKey=info?.key ?? ((path.startsWith("/portal/orders")||path.startsWith("/portal/invoices"))?"billing":path.startsWith("/portal/orbitfs/releases")?"updates":path==="/portal/orbitfs"?"base":"page");
  return <div className="v6c-screen">
    <header className="v6c-appbar">
      <Link className="v6c-mark" href="/portal" aria-label="OrbitFS home"><span/><b>OrbitFS</b></Link>
      <nav className="v6c-globalnav" aria-label="Customer Portal">
        {nav.map(([label,href])=><Link key={href} href={href} className={active(label,path)?"is-active":""}>{label}{(label==="Store"||label==="Billing")&&<span>⌄</span>}</Link>)}
        <details className={"v6c-nav-dropdown "+(path.startsWith("/portal/orbitfs")?"is-active":"")}>
          <summary>My OrbitFS <span>⌄</span></summary>
          <div className="v6c-nav-menu">
            <Link href="/portal/orbitfs">Base Deployment</Link>
            <Link href="/portal/orbitfs/releases">Update Release System</Link>
            <Link href="/portal/orbitfs/license">License Controller</Link>
            <Link href="/portal/orbitfs/channels">Release Channels</Link>
          </div>
        </details>
      </nav>
      <div className="v6c-appbar-spacer"/>
      <div className="v6c-app-search">⌕ <span>Search anything...</span></div>
      <div className="v6c-app-tools">
        {tools}
        <Link className="v6c-system" href="/portal"><i/>System Online <span>⌄</span></Link>
        {canAccessAdmin&&<Link className="v6c-admin-button" href="/admin">Admin ↗</Link>}
        <Link className="v6c-account-button" href="/portal/settings">Account</Link>
        {onLogout&&<button className="v6c-logout-button" type="button" onClick={onLogout} disabled={loggingOut}>{loggingOut?"…":"Logout"}</button>}
      </div>
    </header>
    <main className={"v6c-content v6c-route-"+routeKey}>
      {orbitfs&&<nav className="v6c-orbit-subnav" aria-label="My OrbitFS sections">
        <Link className={path==="/portal/orbitfs"?"is-active":""} href="/portal/orbitfs">Base Deployment</Link>
        <Link className={path.startsWith("/portal/orbitfs/releases")?"is-active":""} href="/portal/orbitfs/releases">Update Release System</Link>
        <Link className={path.startsWith("/portal/orbitfs/license")?"is-active":""} href="/portal/orbitfs/license">License Controller</Link>
        <Link className={path.startsWith("/portal/orbitfs/channels")?"is-active":""} href="/portal/orbitfs/channels">Release Channels</Link>
      </nav>}
      {info&&<section className="v6c-context-hero">
        <div>
          <span className="v6c-context-badge">{info.eyebrow}</span>
          <h1>{info.title}</h1>
          <p>{info.description}</p>
        </div>
        <div className={"v6c-context-art art-"+info.key} aria-hidden="true"><i/><b/><span/></div>
      </section>}
      {children}
    </main>
  </div>;
}

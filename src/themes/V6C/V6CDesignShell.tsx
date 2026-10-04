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
  ["My OrbitFS","/portal/orbitfs"],
  ["Settings","/portal/settings"],
] as const;

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
  return <div className="v6c-screen">
    <header className="v6c-appbar">
      <Link className="v6c-mark" href="/portal" aria-label="OrbitFS home"><span/><b>OrbitFS</b></Link>
      <nav className="v6c-globalnav" aria-label="Customer Portal">
        {nav.map(([label,href])=><Link key={href} href={href} className={active(label,path)?"is-active":""}>{label}<span>⌄</span></Link>)}
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
    <main className="v6c-content">{children}</main>
  </div>;
}

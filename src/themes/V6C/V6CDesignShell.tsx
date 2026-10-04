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

const primaryNav=[
  ["Dashboard","/portal"],
  ["Store","/portal/products"],
  ["Billing","/portal/invoices"],
  ["Support Centre","/portal/support"],
  ["My OrbitFS","/portal/orbitfs"],
  ["Account Settings","/portal/settings"],
] as const;

function navActive(label:string,path:string){
  if(label==="Dashboard")return path==="/portal";
  if(label==="Store")return path.startsWith("/portal/products")||path.startsWith("/portal/basket")||path.startsWith("/portal/checkout");
  if(label==="Billing")return path.startsWith("/portal/invoices")||path.startsWith("/portal/orders");
  if(label==="Support Centre")return path.startsWith("/portal/support");
  if(label==="My OrbitFS")return path.startsWith("/portal/orbitfs");
  if(label==="Account Settings")return path.startsWith("/portal/settings");
  return false;
}

export default function V6CDesignShell({path,children,canAccessAdmin=false,loggingOut=false,onLogout,tools}:Props){
  return <div className="v6c-screen">
    <aside className="v6c-side">
      <Link className="v6c-logo" href="/portal">OrbitFS</Link>
      <nav aria-label="Customer Portal">
        {primaryNav.map(([label,href])=><Link key={href} href={href} className={"v6c-nav-item "+(navActive(label,path)?"is-active":"")}>
          <span>{label}</span><b>›</b>
        </Link>)}
      </nav>
      <div className="v6c-side-bottom">
        {canAccessAdmin&&<Link className="v6c-admin-button" href="/admin"><span>Admin Portal</span><b>↗</b></Link>}
        <div className="v6c-online"><i/>System Online<span>⌄</span></div>
      </div>
    </aside>

    <div className="v6c-main">
      <header className="v6c-top">
        <div className="v6c-search">Search anything...</div>
        <div className="v6c-tools">
          {tools}
          <Link className="v6c-account-button" href="/portal/settings">Account</Link>
          {onLogout&&<button className="v6c-logout-button" type="button" onClick={onLogout} disabled={loggingOut}>{loggingOut?"…":"Logout"}</button>}
        </div>
      </header>
      <main className="v6c-content">{children}</main>
    </div>
  </div>;
}

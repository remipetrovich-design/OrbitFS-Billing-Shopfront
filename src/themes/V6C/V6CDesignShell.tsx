"use client";

type Props={path:string};

const nav=["Dashboard","Clients","Billing","Products","Updates","Deployments","Settings"];

function Frame({section,children}:{section:string;children:React.ReactNode}){
  return <div className="v6c-screen">
    <aside className="v6c-side">
      <div className="v6c-logo">OrbitFS</div>
      <nav>{nav.map(item=><div key={item} className={"v6c-nav-item "+(item===section?"is-active":"")}>{item}<span>⌄</span></div>)}</nav>
      <div className="v6c-online"><i/>System Online<span>⌄</span></div>
    </aside>
    <div className="v6c-main">
      <header className="v6c-top"><div className="v6c-search">Search anything...</div><div className="v6c-tools"><span>●</span><span>◎</span><b>LK</b></div></header>
      <div className="v6c-content">{children}</div>
    </div>
  </div>;
}

function Billing(){
  const rows=[
    ["Northstar Hosting","INV-1087","Pro Infrastructure","$1,200.00","Apr 22, 2025","Overdue"],
    ["Cedar Labs","INV-1086","Team Plan","$1,200.00","Apr 28, 2025","Unpaid"],
    ["Beacon Digital","INV-1085","Business Pro","$450.00","Apr 15, 2025","Paid"],
    ["Northstar Hosting","INV-1084","Starter Plan","$200.00","Apr 10, 2025","Paid"],
    ["Cedar Labs","INV-1083","Enterprise","$12,000.00","Apr 01, 2025","Paid"],
  ];
  return <Frame section="Billing">
    <section className="v6c-title"><span>● CLIENT BILLING</span><h1>Manage invoices, resolve<br/>payments, keep your clients<br/>running.</h1></section>
    <section className="v6c-metrics">
      <article><b>12</b><span>Total Invoices</span><small>↑ 20% vs. last 30 days</small></article>
      <article><b>1</b><span>Overdue</span><small>requires attention</small></article>
      <article><b>2</b><span>Outstanding</span><small>awaiting payment</small></article>
      <article><b>9</b><span>Paid</span><small>↑ 50%</small></article>
    </section>
    <section className="v6c-card">
      <div className="v6c-card-head"><h2>All Invoices</h2><div className="v6c-filters"><span>● Overdue</span><span>● Unpaid</span><span>Search by client or invoice...</span><span>Last 30 days ⌄</span></div></div>
      <div className="v6c-table"><div className="v6c-row head"><span>CLIENT</span><span>INVOICE</span><span>SUBSCRIPTION</span><span>AMOUNT</span><span>DUE DATE</span><span>STATUS</span></div>{rows.map(r=><div className="v6c-row" key={r[1]}>{r.map((c,i)=><span key={i} className={i===5?"v6c-status "+c.toLowerCase():""}>{c}</span>)}</div>)}</div>
    </section>
  </Frame>;
}

function Deployment(){
  const fields=[["Target Environment","Select target infrastructure","staging-eu-02"],["Base System Version","Choose the base system to deploy","Core Base 3.0"],["Server Connection","Select an existing server connection or create a new one.","staging-eu-02-connection"],["Domain","The domain for your base system","staging.cedarlabs.example"],["Database Credentials","Use stored credentials for the application database.","cedarlabs-prod-db (Stored)"]];
  return <Frame section="Deployments">
    <section className="v6c-title row-title"><div><span>● BASE DEPLOYMENT</span><h1>Deploy Core Base 3.0</h1><p>Set up the target environment and connection details for your base system.</p></div><em>System Online ·</em></section>
    <section className="v6c-columns">
      <article className="v6c-card v6c-form"><h2><i>1</i>Deployment Configuration</h2>{fields.map(f=><label key={f[0]}><b>{f[0]}</b><small>{f[1]}</small><div>{f[2]}<span>⌄</span></div></label>)}</article>
      <article className="v6c-card v6c-checks"><h2><i>2</i>Validation & Readiness</h2>{["Connectivity Check","Resource Check","Permission Check"].map(x=><div className="v6c-check" key={x}><i>✓</i><p><b>{x}</b><small>Passed</small></p></div>)}<div className="v6c-ready"><b>All prerequisites verified</b><small>Your environment is ready for deployment.</small></div><button>Authorize Deployment</button></article>
    </section>
  </Frame>;
}

function Release(){
  return <Frame section="Updates">
    <section className="v6c-title row-title"><div><span>← BACK TO UPDATES</span><h1>Prepare Core Platform <strong>v2.5.0</strong></h1><p>Stable Channel</p></div><em>● Stable Channel</em></section>
    <section className="v6c-steps"><article className="is-active"><b>1</b><div><strong>Package & Release Notes</strong><small>Add update package and version details</small></div></article><article><b>2</b><div><strong>Validation & Checks</strong><small>Verify integrity and compatibility</small></div></article><article><b>3</b><div><strong>Review & Publish</strong><small>Save draft or approve for publication</small></div></article></section>
    <section className="v6c-columns release">
      <article className="v6c-card v6c-release-form"><h2>Update Package</h2><p>Attach the signed package for Core Platform v2.5.0.</p><div className="v6c-file"><div><b>core-platform-v2.5.0.zip</b><small>248.6 MB · Valid package</small></div><button>Replace</button></div><h2>Release Notes</h2><div className="v6c-textarea">Describe the changes in this release. These notes will be visible to your users.</div><h2>Release Channel</h2><div className="v6c-channels"><div>Canary<small>Limited rollout to early adopters</small></div><div>Staging<small>Internal testing and validation.</small></div><div className="selected">Stable<small>Full rollout to eligible installations.</small></div></div><div className="v6c-actions"><button>Save Draft</button><button>Approve & Publish</button></div></article>
      <article className="v6c-card v6c-checks"><h2>Checksum Verification <mark>Verified</mark></h2><dl><dt>Algorithm</dt><dd>SHA-256</dd><dt>Expected</dt><dd>3f4a8e2c9d7b6e1f...</dd><dt>Actual</dt><dd>3f4a8e2c9d7b6e1f...</dd></dl><h2>Compatibility Checks <mark>All checks passed</mark></h2>{["Operating system compatibility","Database version compatibility","Required services","Configuration schema"].map(x=><div className="v6c-check" key={x}><i>✓</i><p><b>{x}</b><small>Supported</small></p></div>)}</article>
    </section>
  </Frame>;
}

function Placeholder({path}:{path:string}){
  const name=path==="/portal"?"Dashboard":path.split("/").filter(Boolean).pop()?.replaceAll("-"," ")||"Dashboard";
  return <Frame section={name==="Dashboard"?"Dashboard":""}><section className="v6c-title"><span>● ORBITFS CUSTOMER PORTAL</span><h1>{name}</h1><p>V6C visual surface reserved for this page.</p></section><section className="v6c-card v6c-empty"><div/></section></Frame>;
}

export default function V6CDesignShell({path}:Props){
  if(path.startsWith("/portal/orbitfs/releases"))return <Release/>;
  if(path==="/portal/orbitfs"||path.startsWith("/portal/orbitfs/deployer"))return <Deployment/>;
  if(path.startsWith("/portal/orders")||path.startsWith("/portal/invoices")||path.startsWith("/portal/checkout"))return <Billing/>;
  return <Placeholder path={path}/>;
}

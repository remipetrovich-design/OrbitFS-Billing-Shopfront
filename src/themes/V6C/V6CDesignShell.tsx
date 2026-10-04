"use client";

type Props={path:string};

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
  if(label==="Store")return path.startsWith("/portal/products")||path.startsWith("/portal/basket");
  if(label==="Billing")return path.startsWith("/portal/invoices")||path.startsWith("/portal/orders")||path.startsWith("/portal/checkout");
  if(label==="Support Centre")return path.startsWith("/portal/support");
  if(label==="My OrbitFS")return path.startsWith("/portal/orbitfs");
  if(label==="Account Settings")return path.startsWith("/portal/settings");
  return false;
}

function Frame({path,children}:{path:string;children:React.ReactNode}){
  return <div className="v6c-screen">
    <aside className="v6c-side">
      <div className="v6c-logo">OrbitFS</div>
      <nav>
        {primaryNav.map(([label,href])=><a key={href} href={href} className={"v6c-nav-item "+(navActive(label,path)?"is-active":"")}>{label}<span>⌄</span></a>)}
      </nav>
      <div className="v6c-online"><i/>System Online<span>⌄</span></div>
    </aside>
    <div className="v6c-main">
      <header className="v6c-top">
        <div className="v6c-search">Search anything...</div>
        <div className="v6c-tools"><span>●</span><span>◎</span><b>LK</b></div>
      </header>
      <div className="v6c-content">{children}</div>
    </div>
  </div>;
}

function Dashboard({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-dashboard-hero">
      <div>
        <span className="v6c-kicker">● CUSTOMER PORTAL</span>
        <h1>Your OrbitFS.<br/>One place to manage it.</h1>
        <p>Billing, support, deployments, licences and updates — organised around your OrbitFS account.</p>
        <div className="v6c-hero-actions"><span>Open My OrbitFS</span><span>View Billing</span></div>
      </div>
      <div className="v6c-orbit-art">
        <div className="v6c-orbit-ring ring-one"/><div className="v6c-orbit-ring ring-two"/><div className="v6c-orbit-core"/>
        <span className="orb orb-a"/><span className="orb orb-b"/><span className="orb orb-c"/>
      </div>
    </section>

    <section className="v6c-health-strip">
      <article><small>BILLING</small><b>Account Active</b><span>All billing services available</span></article>
      <article><small>BASE SYSTEM</small><b>Deployment Healthy</b><span>Production instance online</span></article>
      <article><small>UPDATES</small><b>1 Update Ready</b><span>Stable channel</span></article>
      <article><small>LICENCE</small><b>Licence Active</b><span>Runtime validation healthy</span></article>
    </section>

    <section className="v6c-dashboard-grid">
      <article className="v6c-card v6c-feature-card">
        <div className="v6c-feature-icon">↻</div><span className="v6c-kicker">MY ORBITFS</span><h2>Update Release System</h2>
        <p>Review available updates, release notes, validation results and deployment readiness.</p>
        <div className="v6c-feature-footer"><b>v2.5.0</b><span>Stable · Ready</span><em>→</em></div>
      </article>
      <article className="v6c-card v6c-feature-card">
        <div className="v6c-feature-icon">◇</div><span className="v6c-kicker">MY ORBITFS</span><h2>Base Deployments</h2>
        <p>Manage the customer deployment workflow and current OrbitFS installation.</p>
        <div className="v6c-feature-footer"><b>Production</b><span>Healthy</span><em>→</em></div>
      </article>
      <article className="v6c-card v6c-feature-card">
        <div className="v6c-feature-icon">▣</div><span className="v6c-kicker">BILLING</span><h2>Invoices & Payments</h2>
        <p>View invoices, payment history, account billing information and payment status.</p>
        <div className="v6c-feature-footer"><b>12 invoices</b><span>1 requires attention</span><em>→</em></div>
      </article>
      <article className="v6c-card v6c-feature-card">
        <div className="v6c-feature-icon">✓</div><span className="v6c-kicker">SUPPORT CENTRE</span><h2>Support</h2>
        <p>Open tickets, follow existing conversations and find customer support information.</p>
        <div className="v6c-feature-footer"><b>2 open tickets</b><span>Support online</span><em>→</em></div>
      </article>
    </section>
  </Frame>;
}

function Store({path}:{path:string}){
  const products=[
    ["OrbitFS Base System","Core Platform","The foundation of your OrbitFS environment.","From $299","CORE"],
    ["Update Engine","System Add-on","Keep eligible OrbitFS installations current through approved releases.","Included","UPDATE"],
    ["OrbitFS Studio","Add-on","Extended tools and workspace capabilities for your OrbitFS setup.","From $79","STUDIO"],
    ["Support Plus","Service","Priority customer support and assisted deployment coverage.","From $49","SUPPORT"],
  ];
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>● ORBITFS STORE</span><h1>Build your OrbitFS setup.</h1><p>Choose your base system, then add only the services and components you need.</p></div><em>Basket · 0</em></section>
    <section className="v6c-store-spotlight">
      <div><span className="v6c-kicker">CORE SYSTEM</span><h2>OrbitFS Base System</h2><p>The starting point for every OrbitFS customer environment. Deploy the core platform first, then expand it with supported components.</p><div className="v6c-pill-row"><span>Customer deployment</span><span>Release-ready</span><span>Licence controlled</span></div></div>
      <div className="v6c-store-price"><small>BASE SYSTEM</small><b>$299</b><span>one-time starting price</span><button>View product</button></div>
    </section>
    <div className="v6c-section-head"><div><span className="v6c-kicker">CATALOGUE</span><h2>Products & services</h2></div><div className="v6c-filters"><span>All products</span><span>Search store...</span></div></div>
    <section className="v6c-product-grid">{products.map(([name,type,desc,price,badge])=><article className="v6c-card v6c-product" key={name}><div className="v6c-product-mark">{badge}</div><small>{type}</small><h3>{name}</h3><p>{desc}</p><div><b>{price}</b><button>View details</button></div></article>)}</section>
  </Frame>;
}

const billingTabs=[
  ["Overview","/portal/invoices"],
  ["Invoices","/portal/invoices"],
  ["Payment History","/portal/orders"],
  ["Payment Methods","/portal/settings?tab=billing"],
  ["Billing Settings","/portal/settings?tab=billing"],
] as const;

function BillingTabs({active}:{active:string}){return <nav className="v6c-subnav">{billingTabs.map(([label,href])=><a key={label} href={href} className={label===active?"is-active":""}>{label}</a>)}</nav>}

function Billing({path,view="Overview"}:{path:string;view?:string}){
  const rows=[
    ["Northstar Hosting","INV-1087","Pro Infrastructure","$1,200.00","Apr 22, 2025","Overdue"],
    ["Cedar Labs","INV-1086","Team Plan","$1,200.00","Apr 28, 2025","Unpaid"],
    ["Beacon Digital","INV-1085","Business Pro","$450.00","Apr 15, 2025","Paid"],
    ["Northstar Hosting","INV-1084","Starter Plan","$200.00","Apr 10, 2025","Paid"],
    ["Cedar Labs","INV-1083","Enterprise","$12,000.00","Apr 01, 2025","Paid"],
  ];
  return <Frame path={path}>
    <BillingTabs active={view}/>
    <section className="v6c-title"><span>● CLIENT BILLING</span><h1>Manage invoices, resolve<br/>payments, keep your account<br/>running.</h1></section>
    <section className="v6c-metrics">
      <article><b>12</b><span>Total Invoices</span><small>↑ 20% vs. last 30 days</small></article>
      <article><b>1</b><span>Overdue</span><small>requires attention</small></article>
      <article><b>2</b><span>Outstanding</span><small>awaiting payment</small></article>
      <article><b>9</b><span>Paid</span><small>↑ 50% vs. last 30 days</small></article>
    </section>
    <section className="v6c-card">
      <div className="v6c-card-head"><h2>{view==="Payment History"?"Payment History":"All Invoices"}</h2><div className="v6c-filters"><span>● Overdue</span><span>● Unpaid</span><span>Search by invoice...</span><span>Last 30 days ⌄</span></div></div>
      <div className="v6c-table"><div className="v6c-row head"><span>ACCOUNT</span><span>INVOICE</span><span>SUBSCRIPTION</span><span>AMOUNT</span><span>DUE DATE</span><span>STATUS</span></div>{rows.map(r=><div className="v6c-row" key={r[1]}>{r.map((c,i)=><span key={i} className={i===5?"v6c-status "+c.toLowerCase():""}>{c}</span>)}</div>)}</div>
    </section>
  </Frame>;
}

function Deployment({path}:{path:string}){
  const fields=[["Target Environment","Select target infrastructure","staging-eu-02"],["Base System Version","Choose the base system to deploy","Core Base 3.0"],["Server Connection","Select an existing server connection or create a new one.","staging-eu-02-connection"],["Domain","The domain for your base system","staging.cedarlabs.example"],["Database Credentials","Use stored credentials for the application database.","cedarlabs-prod-db (Stored)"]];
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>● BASE DEPLOYMENT</span><h1>Deploy Core Base 3.0</h1><p>Set up the target environment and connection details for your base system.</p></div><em>System Online ·</em></section>
    <section className="v6c-columns">
      <article className="v6c-card v6c-form"><h2><i>1</i>Deployment Configuration</h2>{fields.map(f=><label key={f[0]}><b>{f[0]}</b><small>{f[1]}</small><div>{f[2]}<span>⌄</span></div></label>)}</article>
      <article className="v6c-card v6c-checks"><h2><i>2</i>Validation & Readiness</h2>{["Connectivity Check","Resource Check","Permission Check"].map(x=><div className="v6c-check" key={x}><i>✓</i><p><b>{x}</b><small>Passed</small></p></div>)}<div className="v6c-ready"><b>All prerequisites verified</b><small>Your environment is ready for deployment.</small></div><button>Authorize Deployment</button></article>
    </section>
  </Frame>;
}

function Release({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>← BACK TO UPDATES</span><h1>Prepare Core Platform <strong>v2.5.0</strong></h1><p>Stable Channel</p></div><em>● Stable Channel</em></section>
    <section className="v6c-steps"><article className="is-active"><b>1</b><div><strong>Package & Release Notes</strong><small>Add update package and version details</small></div></article><article><b>2</b><div><strong>Validation & Checks</strong><small>Verify integrity and compatibility</small></div></article><article><b>3</b><div><strong>Review & Publish</strong><small>Save draft or approve for publication</small></div></article></section>
    <section className="v6c-columns release">
      <article className="v6c-card v6c-release-form"><h2>Update Package</h2><p>Attach the signed package for Core Platform v2.5.0.</p><div className="v6c-file"><div><b>core-platform-v2.5.0.zip</b><small>248.6 MB · Valid package</small></div><button>Replace</button></div><h2>Release Notes</h2><div className="v6c-textarea">Describe the changes in this release. These notes will be visible to your users.</div><h2>Release Channel</h2><div className="v6c-channels"><div>Canary<small>Limited rollout to early adopters</small></div><div>Staging<small>Internal testing and validation.</small></div><div className="selected">Stable<small>Full rollout to eligible installations.</small></div></div><div className="v6c-actions"><button>Save Draft</button><button>Approve & Publish</button></div></article>
      <article className="v6c-card v6c-checks"><h2>Checksum Verification <mark>Verified</mark></h2><dl><dt>Algorithm</dt><dd>SHA-256</dd><dt>Expected</dt><dd>3f4a8e2c9d7b6e1f...</dd><dt>Actual</dt><dd>3f4a8e2c9d7b6e1f...</dd></dl><h2>Compatibility Checks <mark>All checks passed</mark></h2>{["Operating system compatibility","Database version compatibility","Required services","Configuration schema"].map(x=><div className="v6c-check" key={x}><i>✓</i><p><b>{x}</b><small>Supported</small></p></div>)}</article>
    </section>
  </Frame>;
}

function Placeholder({path,title,section}:{path:string;title:string;section:string}){
  return <Frame path={path}><section className="v6c-title"><span>● {section.toUpperCase()}</span><h1>{title}</h1><p>V6C desktop surface ready for the next design pass.</p></section><section className="v6c-card v6c-empty"><div/></section></Frame>;
}

export default function V6CDesignShell({path}:Props){
  if(path==="/portal")return <Dashboard path={path}/>;
  if(path.startsWith("/portal/products")||path.startsWith("/portal/basket"))return <Store path={path}/>;
  if(path.startsWith("/portal/orbitfs/releases"))return <Release path={path}/>;
  if(path==="/portal/orbitfs"||path.startsWith("/portal/orbitfs/deployer"))return <Deployment path={path}/>;
  if(path.startsWith("/portal/invoices"))return <Billing path={path} view="Invoices"/>;
  if(path.startsWith("/portal/orders")||path.startsWith("/portal/checkout"))return <Billing path={path} view="Payment History"/>;
  if(path.startsWith("/portal/support"))return <Placeholder path={path} title="Support Centre" section="Support Centre"/>;
  if(path.startsWith("/portal/orbitfs/license"))return <Placeholder path={path} title="License Controller" section="My OrbitFS"/>;
  if(path.startsWith("/portal/orbitfs/channels"))return <Placeholder path={path} title="Release Channels" section="My OrbitFS"/>;
  if(path.startsWith("/portal/settings"))return <Placeholder path={path} title="Account Settings" section="Account"/>;
  return <Placeholder path={path} title="Customer Portal" section="OrbitFS"/>;
}

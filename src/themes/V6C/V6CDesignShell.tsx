"use client";

import {createContext,useContext,type ReactNode} from "react";

type Props={path:string;canAccessAdmin?:boolean};
const V6CAdminAccess=createContext(false);

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

function Frame({path,children}:{path:string;children:ReactNode}){
  const canAccessAdmin=useContext(V6CAdminAccess);
  return <div className="v6c-screen">
    <aside className="v6c-side">
      <div className="v6c-logo">OrbitFS</div>
      <nav>
        {primaryNav.map(([label,href])=><a key={href} href={href} className={"v6c-nav-item "+(navActive(label,path)?"is-active":"")}>{label}<span>⌄</span></a>)}
      </nav>
      <div className="v6c-side-bottom">{canAccessAdmin&&<a className="v6c-admin-button" href="/admin"><span>Admin Portal</span><b>↗</b></a>}<div className="v6c-online"><i/>System Online<span>⌄</span></div></div>
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



function ProductDetail({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>← ORBITFS STORE · CORE SYSTEM</span><h1>OrbitFS Base System</h1><p>The foundation of your OrbitFS environment, ready for customer deployment and supported releases.</p></div><em>Core Platform</em></section>
    <section className="v6c-product-detail">
      <article className="v6c-card v6c-product-showcase">
        <div className="v6c-product-visual"><div className="v6c-orbit-core"/><div className="v6c-orbit-ring ring-one"/><div className="v6c-orbit-ring ring-two"/></div>
        <div className="v6c-product-copy"><span className="v6c-kicker">WHAT YOU GET</span><h2>Core customer platform</h2><p>Everything required to establish the customer-facing OrbitFS Base environment before adding supported components and services.</p><div className="v6c-feature-list"><span>✓ Customer deployment workflow</span><span>✓ Licence-managed activation</span><span>✓ Stable release support</span><span>✓ Update-ready foundation</span></div></div>
      </article>
      <aside className="v6c-card v6c-buybox">
        <span className="v6c-kicker">PURCHASE</span><small>Starting price</small><b>$299.00</b><p>One-time base purchase. Add-ons and support services can be added later.</p>
        <label><small>DEPLOYMENT TYPE</small><div>Standard customer deployment <span>⌄</span></div></label>
        <label><small>REGION</small><div>Australia / Sydney <span>⌄</span></div></label>
        <button>Add to basket</button><span className="v6c-buy-note">Secure checkout · AUD</span>
      </aside>
    </section>
  </Frame>;
}

function CheckoutFlow({path}:{path:string}){
  const basket=path.startsWith("/portal/basket");
  return <Frame path={path}>
    <section className="v6c-title"><span>● ORBITFS STORE · {basket?"BASKET":"CHECKOUT"}</span><h1>{basket?"Review your basket.":"Complete your order."}</h1><p>{basket?"Confirm the products and configuration before checkout.":"Review billing details, payment method and order total."}</p></section>
    <section className="v6c-checkout-grid">
      <article className="v6c-card v6c-checkout-main">
        <div className="v6c-cart-item"><div className="v6c-product-mark">CORE</div><div><small>ORBITFS CORE</small><h2>OrbitFS Base System</h2><p>Standard customer deployment · Australia / Sydney</p></div><strong>$299.00</strong></div>
        {!basket&&<><div className="v6c-checkout-section"><span className="v6c-kicker">BILLING DETAILS</span><div className="v6c-field-grid"><label><small>NAME</small><div>Lucas Kerim</div></label><label><small>EMAIL</small><div>customer@example.com</div></label><label className="wide"><small>BILLING ADDRESS</small><div>Customer billing address</div></label></div></div><div className="v6c-checkout-section"><span className="v6c-kicker">PAYMENT METHOD</span><div className="v6c-payment-choice selected"><i>●</i><div><b>Card / secure payment</b><small>Continue through the configured payment provider.</small></div></div><div className="v6c-payment-choice"><i>○</i><div><b>OrbitFS Wallet</b><small>Use available account credit where eligible.</small></div></div></div></>}
      </article>
      <aside className="v6c-card v6c-order-summary"><span className="v6c-kicker">ORDER SUMMARY</span><div><span>OrbitFS Base System</span><b>$299.00</b></div><div><span>Subtotal</span><b>$299.00</b></div><div><span>Tax</span><b>$0.00</b></div><div className="total"><span>Total</span><b>$299.00 AUD</b></div><button>{basket?"Continue to checkout":"Place order"}</button><small>Orders and payment status will appear in Billing.</small></aside>
    </section>
  </Frame>;
}

function InvoiceDetail({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>← BILLING · INVOICE</span><h1>Invoice INV-1087</h1><p>Created April 1, 2025 · Due April 22, 2025</p></div><em>Overdue</em></section>
    <section className="v6c-ticket-meta"><article><small>STATUS</small><b>Overdue</b></article><article><small>TOTAL</small><b>$1,200.00</b></article><article><small>PAID</small><b>$0.00</b></article><article><small>AMOUNT DUE</small><b>$1,200.00</b></article></section>
    <section className="v6c-invoice-grid">
      <article className="v6c-card v6c-invoice-doc"><div className="v6c-invoice-head"><div><strong>OrbitFS</strong><small>Customer Billing</small></div><div><span>INVOICE</span><b>INV-1087</b></div></div><div className="v6c-billto"><small>BILL TO</small><b>Customer Account</b><span>customer@example.com</span></div><div className="v6c-invoice-lines"><div className="head"><span>DESCRIPTION</span><span>QTY</span><span>UNIT PRICE</span><span>AMOUNT</span></div><div><span>OrbitFS Business / Pro Infrastructure</span><span>1</span><span>$1,200.00</span><b>$1,200.00</b></div></div><div className="v6c-invoice-totals"><span>Subtotal <b>$1,200.00</b></span><span>Tax <b>$0.00</b></span><span className="total">Total <b>$1,200.00</b></span><span>Balance <b>$1,200.00</b></span></div></article>
      <aside className="v6c-card v6c-pay-panel"><span className="v6c-kicker">PAYMENT</span><h2>Pay this invoice</h2><p>Choose an available payment method to settle the outstanding balance.</p><label><small>PAYMENT METHOD</small><div>Card / secure payment <span>⌄</span></div></label><label><small>COUPON CODE</small><div>Enter coupon code</div></label><button>Pay $1,200.00</button><div className="v6c-ready"><b>Invoice payment</b><small>Payment status will update here after confirmation.</small></div></aside>
    </section>
  </Frame>;
}

function MyOrbitFSHome({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-title"><span>● MY ORBITFS</span><h1>Your systems,<br/>releases and licence.</h1><p>Everything technical about your OrbitFS account lives here — deployment, updates, licensing and release access.</p></section>
    <section className="v6c-orbitfs-overview">
      <article className="v6c-card v6c-orbitfs-primary"><div><span className="v6c-kicker">CURRENT INSTALLATION</span><h2>Production</h2><p>OrbitFS Base System · v3.0.0</p></div><strong>HEALTHY</strong><div className="v6c-orbitfs-meta"><span><small>DOMAIN</small><b>production.orbitfs.example</b></span><span><small>CHANNEL</small><b>Stable</b></span><span><small>LAST CHECK</small><b>4 minutes ago</b></span></div></article>
      <article className="v6c-card v6c-orbitfs-status"><span className="v6c-kicker">SYSTEM STATUS</span><div><i/>Base Deployment<b>Healthy</b></div><div><i/>Update Authority<b>Available</b></div><div><i/>Licence Validation<b>Healthy</b></div><div><i/>Release Channel<b>Stable</b></div></article>
    </section>
    <section className="v6c-orbitfs-grid">
      <a href="/portal/orbitfs/deployer" className="v6c-card v6c-feature-card"><div className="v6c-feature-icon">◇</div><span className="v6c-kicker">BASE DEPLOYMENTS</span><h2>Deploy & manage Base</h2><p>Set up, verify and manage your customer Base installation.</p><div className="v6c-feature-footer"><b>Production</b><span>Healthy</span><em>→</em></div></a>
      <a href="/portal/orbitfs/releases" className="v6c-card v6c-feature-card"><div className="v6c-feature-icon">↻</div><span className="v6c-kicker">UPDATE RELEASE SYSTEM</span><h2>Updates</h2><p>Review published updates and follow authorized update execution.</p><div className="v6c-feature-footer"><b>v2.5.0</b><span>1 update ready</span><em>→</em></div></a>
      <a href="/portal/orbitfs/license" className="v6c-card v6c-feature-card"><div className="v6c-feature-icon">▣</div><span className="v6c-kicker">LICENSE CONTROLLER</span><h2>Licence</h2><p>View current licence status, entitlements, bindings and validation state.</p><div className="v6c-feature-footer"><b>Business</b><span>Active</span><em>→</em></div></a>
      <a href="/portal/orbitfs/channels" className="v6c-card v6c-feature-card"><div className="v6c-feature-icon">◎</div><span className="v6c-kicker">RELEASE CHANNELS</span><h2>Channels</h2><p>See Stable, Staging and Canary access available to your licence.</p><div className="v6c-feature-footer"><b>Stable</b><span>Current</span><em>→</em></div></a>
    </section>
  </Frame>;
}

function SupportCentre({path}:{path:string}){
  const tickets=[
    ["#4821","Update installation failed after validation","Waiting on Support","High","Today, 9:42 PM"],
    ["#4798","Billing receipt missing from account","Open","Normal","Yesterday"],
    ["#4710","Release channel access request","Resolved","Normal","Sep 28"],
  ];
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>● SUPPORT CENTRE</span><h1>Help when you need it.</h1><p>Open a ticket, follow existing conversations, or find answers in the OrbitFS Knowledge Base.</p></div><em>Support Online ·</em></section>
    <section className="v6c-support-actions">
      <article className="v6c-card"><div className="v6c-feature-icon">＋</div><h2>Open a support ticket</h2><p>Send an issue directly to the appropriate OrbitFS support team.</p><button>New ticket</button></article>
      <article className="v6c-card"><div className="v6c-feature-icon">?</div><h2>Knowledge Base</h2><p>Browse customer guidance for billing, deployments, licences and troubleshooting.</p><button>Browse articles</button></article>
      <article className="v6c-card"><div className="v6c-feature-icon">◎</div><h2>Service status</h2><p>Current customer support and OrbitFS platform availability.</p><div className="v6c-status-line"><i/>All systems operational</div></article>
    </section>
    <section className="v6c-card v6c-support-table">
      <div className="v6c-card-head"><div><span className="v6c-kicker">YOUR SUPPORT</span><h2>Recent tickets</h2></div><div className="v6c-filters"><span>Current</span><span>Closed</span><span>Search tickets...</span></div></div>
      <div className="v6c-ticket-list">{tickets.map(t=><div className="v6c-ticket" key={t[0]}><div><b>{t[0]}</b><strong>{t[1]}</strong></div><span>{t[2]}</span><span>{t[3]}</span><small>{t[4]}</small><em>→</em></div>)}</div>
    </section>
  </Frame>;
}


function SupportTicket({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>← SUPPORT CENTRE · TICKET #4821</span><h1>Update installation failed<br/>after validation.</h1><p>Technical Support · High priority · Waiting on Support</p></div><em>Waiting on Support</em></section>
    <section className="v6c-ticket-meta"><article><small>STATUS</small><b>Waiting on Support</b></article><article><small>PRIORITY</small><b>High</b></article><article><small>DEPARTMENT</small><b>Technical Support</b></article><article><small>UPDATED</small><b>Today, 9:42 PM</b></article></section>
    <section className="v6c-ticket-layout">
      <article className="v6c-card v6c-conversation"><div className="v6c-card-head"><div><span className="v6c-kicker">CONVERSATION</span><h2>Ticket activity</h2></div></div>
        <div className="v6c-message customer"><div><b>You</b><small>Today · 8:58 PM</small></div><p>The update completed validation but stopped before deployment. The installation is still on the previous release.</p></div>
        <div className="v6c-message support"><div><b>OrbitFS Support</b><small>Today · 9:18 PM</small></div><p>We can see the failed deployment attempt. The validation result itself is healthy; we are reviewing the deployment authorization record.</p></div>
        <div className="v6c-message customer"><div><b>You</b><small>Today · 9:31 PM</small></div><p>Thanks. No manual changes have been made since the failed attempt.</p></div>
        <div className="v6c-reply-box"><small>REPLY</small><div>Write your reply...</div><span>Add attachment</span><button>Send reply</button></div>
      </article>
      <aside className="v6c-card v6c-ticket-side"><span className="v6c-kicker">TICKET DETAILS</span><div><small>RELATED SERVICE</small><b>Update Release System</b></div><div><small>INSTALLATION</small><b>Production</b></div><div><small>RELEASE</small><b>v2.5.0</b></div><div><small>OPENED</small><b>Today, 8:58 PM</b></div><button>Close ticket</button></aside>
    </section>
  </Frame>;
}

function KnowledgeBase({path}:{path:string}){
  const articles=[
    ["Updates","Preparing an OrbitFS update","What to check before applying an approved update."],
    ["Deployments","Connecting your Base deployment","Understand the required customer deployment connection details."],
    ["Licensing","How licence validation works","Customer-facing explanation of licence state and validation."],
    ["Billing","Understanding invoice status","Paid, unpaid, overdue and processing invoice states."],
    ["Release Channels","Stable, Staging and Canary","How OrbitFS customer release channels differ."],
    ["Support","What to include in a support ticket","Information that helps Support resolve an issue faster."],
  ];
  return <Frame path={path}>
    <section className="v6c-title"><span>● SUPPORT CENTRE · KNOWLEDGE BASE</span><h1>Find the answer<br/>before you need a ticket.</h1><p>Customer guidance for OrbitFS billing, deployments, licences, updates and support.</p></section>
    <section className="v6c-kb-search"><div>Search setup, billing, licences, troubleshooting...</div><span>All categories ⌄</span></section>
    <section className="v6c-kb-grid">{articles.map(a=><article className="v6c-card" key={a[1]}><small>{a[0]}</small><h2>{a[1]}</h2><p>{a[2]}</p><span>Read article →</span></article>)}</section>
  </Frame>;
}

function LicenseController({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>● MY ORBITFS · LICENSE CONTROLLER</span><h1>Licence control,<br/>without the noise.</h1><p>See the licence attached to your OrbitFS environment, current entitlements and runtime validation state.</p></div><em>● Licence Active</em></section>
    <section className="v6c-license-grid">
      <article className="v6c-card v6c-license-primary">
        <span className="v6c-kicker">CURRENT LICENCE</span><div className="v6c-license-name"><div><h2>OrbitFS Business</h2><p>Customer production licence</p></div><strong>ACTIVE</strong></div>
        <div className="v6c-license-key"><small>LICENCE KEY</small><b>ORBIT-••••-••••-92AF</b></div>
        <div className="v6c-license-meta"><div><small>VALIDATION</small><b>Healthy</b><span>Last validated 4 minutes ago</span></div><div><small>EXPIRES</small><b>12 Months</b><span>October 4, 2027</span></div><div><small>BOUND INSTALLATION</small><b>Production</b><span>1 active binding</span></div></div>
      </article>
      <article className="v6c-card v6c-entitlements"><span className="v6c-kicker">ENTITLEMENTS</span><h2>Included capabilities</h2>{["Base System","Update Engine","Stable Release Channel","Customer Support","Rollback Authorization"].map((x,i)=><div key={x}><i>✓</i><span>{x}</span><b>{i===1?"v2.x":"Enabled"}</b></div>)}</article>
    </section>
    <section className="v6c-card v6c-runtime"><div><span className="v6c-kicker">RUNTIME VALIDATION</span><h2>Validation & binding state</h2></div><div className="v6c-runtime-grid"><article><small>VALIDATION STATE</small><b>Healthy</b><span>Runtime checks passing</span></article><article><small>GRACE POLICY</small><b>Available</b><span>Per licence policy</span></article><article><small>PULSE</small><b>Connected</b><span>Last response 4m ago</span></article><article><small>ACTIVATIONS</small><b>1 / 1</b><span>Production bound</span></article></div></section>
  </Frame>;
}

function ReleaseChannels({path}:{path:string}){
  const channels=[
    ["Stable","Production-ready releases for standard customer environments.","Current","v2.5.0","Open"],
    ["Staging","Pre-production releases for validation before stable rollout.","Available","v2.6.0-rc2","Open"],
    ["Canary","Early releases for controlled testing and rapid feedback.","Restricted","v2.6.0-canary.18","Request"],
  ];
  return <Frame path={path}>
    <section className="v6c-title row-title"><div><span>● MY ORBITFS · RELEASE CHANNELS</span><h1>Choose how your OrbitFS<br/>receives releases.</h1><p>See your current channel, available channels and access state for preview releases.</p></div><em>Current · Stable</em></section>
    <section className="v6c-channel-grid">{channels.map((x,i)=><article className={"v6c-card v6c-channel "+(i===0?"is-current":"")} key={x[0]}><div className="v6c-channel-top"><div><span className="v6c-kicker">{x[2]}</span><h2>{x[0]}</h2></div><b>{x[4]}</b></div><p>{x[1]}</p><dl><dt>Latest release</dt><dd>{x[3]}</dd><dt>Access</dt><dd>{i===2?"Approval required":"Customer eligible"}</dd><dt>Update policy</dt><dd>{i===0?"Recommended":"Optional"}</dd></dl><button>{i===0?"Current channel":i===2?"Request access":"Switch channel"}</button></article>)}</section>
    <section className="v6c-card v6c-channel-note"><div><span className="v6c-kicker">CHANNEL AUTHORITY</span><h2>Access follows your OrbitFS licence.</h2><p>Channel eligibility and access are controlled by the License Manager. This page only presents your available customer choices.</p></div><span>Licence Controller →</span></section>
  </Frame>;
}

function AccountSettings({path}:{path:string}){
  return <Frame path={path}>
    <section className="v6c-title"><span>● ACCOUNT SETTINGS</span><h1>Your account,<br/>your details.</h1><p>Manage customer details, billing information, Wallet preferences and account security.</p></section>
    <nav className="v6c-subnav"><a className="is-active">Profile</a><a>Billing Details</a><a>Wallet</a><a>Preferences</a><a>Security</a></nav>
    <section className="v6c-settings-grid">
      <article className="v6c-card v6c-settings-form"><span className="v6c-kicker">PROFILE</span><h2>Personal details</h2><p>Used across your OrbitFS customer account and billing records.</p><div className="v6c-field-grid"><label><small>FIRST NAME</small><div>Lucas</div></label><label><small>LAST NAME</small><div>Kerim</div></label><label className="wide"><small>DISPLAY NAME</small><div>Lucas Kerim</div></label><label><small>COMPANY</small><div>—</div></label><label><small>PHONE</small><div>—</div></label><label className="wide"><small>EMAIL</small><div>customer@example.com</div></label></div><div className="v6c-settings-save"><span>Customer ID · ORB-CUST-001</span><button>Save changes</button></div></article>
      <article className="v6c-card v6c-account-summary"><span className="v6c-kicker">ACCOUNT</span><h2>Customer summary</h2><div><small>STATUS</small><b className="good">Active</b></div><div><small>WALLET</small><b>$0.00 AUD</b></div><div><small>DEFAULT CURRENCY</small><b>AUD</b></div><div><small>SECURITY</small><b>Password protected</b></div></article>
    </section>
  </Frame>;
}

function Placeholder({path,title,section}:{path:string;title:string;section:string}){
  return <Frame path={path}><section className="v6c-title"><span>● {section.toUpperCase()}</span><h1>{title}</h1><p>V6C desktop surface ready for the next design pass.</p></section><section className="v6c-card v6c-empty"><div/></section></Frame>;
}

export default function V6CDesignShell({path,canAccessAdmin=false}:Props){
  let content:ReactNode;
  if(path==="/portal") content=<Dashboard path={path}/>;
  else if(/^\/portal\/products\/[^/]+$/.test(path)) content=<ProductDetail path={path}/>;
  else if(path.startsWith("/portal/basket")||path.startsWith("/portal/checkout")) content=<CheckoutFlow path={path}/>;
  else if(path.startsWith("/portal/products")) content=<Store path={path}/>;
  else if(path.startsWith("/portal/orbitfs/releases")) content=<Release path={path}/>;
  else if(path==="/portal/orbitfs") content=<MyOrbitFSHome path={path}/>;
  else if(path.startsWith("/portal/orbitfs/deployer")) content=<Deployment path={path}/>;
  else if(/^\/portal\/invoices\/[^/]+$/.test(path)) content=<InvoiceDetail path={path}/>;
  else if(path.startsWith("/portal/invoices")) content=<Billing path={path} view="Invoices"/>;
  else if(path.startsWith("/portal/orders")) content=<Billing path={path} view="Payment History"/>;
  else if(path.startsWith("/portal/support/knowledge-base")) content=<KnowledgeBase path={path}/>;
  else if(/^\/portal\/support\/[^/]+$/.test(path)) content=<SupportTicket path={path}/>;
  else if(path.startsWith("/portal/support")) content=<SupportCentre path={path}/>;
  else if(path.startsWith("/portal/orbitfs/license")) content=<LicenseController path={path}/>;
  else if(path.startsWith("/portal/orbitfs/channels")) content=<ReleaseChannels path={path}/>;
  else if(path.startsWith("/portal/settings")) content=<AccountSettings path={path}/>;
  else content=<Placeholder path={path} title="Customer Portal" section="OrbitFS"/>;
  return <V6CAdminAccess.Provider value={canAccessAdmin}>{content}</V6CAdminAccess.Provider>;
}

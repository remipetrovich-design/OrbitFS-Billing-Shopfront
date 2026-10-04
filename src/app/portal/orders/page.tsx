"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

const money = (cents: number, currency = "AUD") => new Intl.NumberFormat("en-AU", { style: "currency", currency }).format(Number(cents || 0) / 100);

export default function OrdersAndInvoices() {
  const sb = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const [o, i] = await Promise.all([
        sb.from("orders").select("id,order_number,status,payment_status,fulfillment_status,total_cents,currency,created_at").eq("auth_user_id", user.id).order("created_at", { ascending: false }),
        sb.from("invoices").select("id,invoice_number,status,total_cents,paid_cents,currency,due_at,created_at").eq("auth_user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setOrders(o.data || []);
      setInvoices(i.data || []);
    })();
  }, []);

  const invoiceRows=invoices.map(i=>({...i,balance:Math.max(0,Number(i.total_cents||0)-Number(i.paid_cents||0))}));
  const paidCount=invoiceRows.filter(i=>i.balance===0||String(i.status).toLowerCase()==="paid").length;
  const outstandingCount=invoiceRows.filter(i=>i.balance>0).length;
  const overdueCount=invoiceRows.filter(i=>i.balance>0&&i.due_at&&new Date(i.due_at).getTime()<Date.now()).length;
  const selectedInvoice=invoiceRows[0]||null;

  return <main className="portalPage recordsPage">
    <section className="v6c-billing">
      <aside className="v6c-billing-nav">
        <Link className="is-active" href="/portal/orders"><span>▣</span>Client Billing</Link>
        <Link href="/portal/invoices"><span>▤</span>Invoices</Link>
        <Link href="/portal/orders"><span>◴</span>Payment History</Link>
        <Link href="/portal/settings"><span>▰</span>Subscriptions</Link>
        <Link href="/portal/settings"><span>⚙</span>Settings</Link>
      </aside>
      <div className="v6c-billing-main">
        <header className="v6c-billing-hero">
          <div>
            <span className="v6c-badge">◆ Client Billing</span>
            <h1>Manage invoices, resolve payments, keep your billing running.</h1>
            <p>View your invoices, track due dates and payment history, and keep every OrbitFS purchase in one place.</p>
          </div>
          <div className="v6c-billing-art" aria-hidden="true"><i/><b>＄</b><span/><em/></div>
        </header>

        <div className="v6c-billing-metrics">
          <article><i>▤</i><div><small>Total Invoices</small><b>{invoices.length}</b><span>{invoices.length?"Billing records loaded":"No invoices yet"}</span></div></article>
          <article><i>◷</i><div><small>Overdue</small><b>{overdueCount}</b><span>{overdueCount?"requires attention":"nothing overdue"}</span></div></article>
          <article><i>＄</i><div><small>Outstanding</small><b>{outstandingCount}</b><span>{outstandingCount?"awaiting payment":"all clear"}</span></div></article>
          <article><i>✓</i><div><small>Paid</small><b>{paidCount}</b><span>{paidCount?"settled invoices":"no paid invoices"}</span></div></article>
        </div>

        <section className="v6c-billing-table">
          <div className="v6c-billing-tabs"><b>All Invoices</b><span>Overdue</span><span>Unpaid</span></div>
          <div className="v6c-billing-filters"><span>⌕ Search invoice...</span><span>▣ Last 30 days⌄</span></div>
          <div className="v6c-billing-row head"><span>INVOICE</span><span>ORDER</span><span>AMOUNT</span><span>DUE DATE</span><span>STATUS</span><span>ACTIONS</span></div>
          {invoiceRows.map(i=><Link href={"/portal/invoices/"+i.id} className="v6c-billing-row" key={i.id}>
            <div><b>{i.invoice_number}</b><small>{new Date(i.created_at).toLocaleDateString()}</small></div>
            <span>{orders.find(o=>String(o.id)===String(i.order_id))?.order_number||"OrbitFS"}</span>
            <b>{money(i.total_cents,i.currency||"AUD")}</b>
            <span>{i.due_at?new Date(i.due_at).toLocaleDateString():"—"}</span>
            <span className={"v6c-bill-status "+(i.balance===0?"paid":i.due_at&&new Date(i.due_at).getTime()<Date.now()?"overdue":"unpaid")}>{i.balance===0?"Paid":i.due_at&&new Date(i.due_at).getTime()<Date.now()?"Overdue":"Unpaid"}</span>
            <strong>View ↗</strong>
          </Link>)}
          {!invoiceRows.length&&<div className="v6c-billing-empty">No invoices yet.</div>}
        </section>

        {selectedInvoice&&<section className="v6c-billing-detail">
          <div><span className="v6c-bill-status "+(selectedInvoice.balance===0?"paid":"unpaid")>{selectedInvoice.balance===0?"Paid":"Open"}</span><h2>{selectedInvoice.invoice_number}</h2><small>{new Date(selectedInvoice.created_at).toLocaleDateString()}</small></div>
          <dl><dt>Invoice total</dt><dd>{money(selectedInvoice.total_cents,selectedInvoice.currency||"AUD")}</dd><dt>Balance</dt><dd>{money(selectedInvoice.balance,selectedInvoice.currency||"AUD")}</dd></dl>
          <Link href={"/portal/invoices/"+selectedInvoice.id}>View invoice →</Link>
        </section>}
      </div>
    </section>
    <header className="portalTop recordsHeader">
      <div>
        <p className="eyebrow">PURCHASES & BILLING</p>
        <h1>Orders & Invoices</h1>
        <p className="muted">Your purchases and billing records together in one place.</p>
      </div>
    </header>

    <div className="recordsSplit">
      <section className="recordsSection panel">
        <div className="recordsSectionHead">
          <div>
            <p className="eyebrow">ORDERS</p>
            <h2>Orders</h2>
            <p className="muted">Track purchase status, payment and fulfilment.</p>
          </div>
          <span className="recordsCount">{orders.length}</span>
        </div>
        <div className="recordsCompactHead"><span>Order</span><span>Status</span><span>Total</span></div>
        <div className="recordsCompactList">
          {orders.map(o => <Link className="recordCompactRow" href={`/portal/orders/${o.id}`} key={o.id}>
            <div className="recordPrimary"><b>#{o.order_number}</b><span>{new Date(o.created_at).toLocaleString()}</span></div>
            <div className="recordStatus"><span className="recordBadge">{o.status}</span><small>{o.payment_status} · {o.fulfillment_status}</small></div>
            <div className="recordAmount"><b>{money(o.total_cents, o.currency || "AUD")}</b><span>View order →</span></div>
          </Link>)}
          {!orders.length && <p className="muted recordsEmpty">No orders yet.</p>}
        </div>
      </section>

      <section className="recordsSection panel">
        <div className="recordsSectionHead">
          <div>
            <p className="eyebrow">INVOICES</p>
            <h2>Invoices</h2>
            <p className="muted">Review totals, balances and payment status.</p>
          </div>
          <span className="recordsCount">{invoices.length}</span>
        </div>
        <div className="recordsCompactHead"><span>Invoice</span><span>Status</span><span>Balance</span></div>
        <div className="recordsCompactList">
          {invoices.map(i => {
            const due = Math.max(0, Number(i.total_cents || 0) - Number(i.paid_cents || 0));
            return <Link className="recordCompactRow" href={`/portal/invoices/${i.id}`} key={i.id}>
              <div className="recordPrimary"><b>{i.invoice_number}</b><span>{i.due_at ? `Due ${new Date(i.due_at).toLocaleDateString()}` : new Date(i.created_at).toLocaleDateString()}</span></div>
              <div className="recordStatus"><span className="recordBadge">{i.status}</span><small>{money(i.total_cents, i.currency || "AUD")} total</small></div>
              <div className="recordAmount"><b>{money(due, i.currency || "AUD")}</b><span>{due > 0 ? "Amount due" : "Paid"} →</span></div>
            </Link>;
          })}
          {!invoices.length && <p className="muted recordsEmpty">No invoices yet.</p>}
        </div>
      </section>
    </div>
  </main>;
}

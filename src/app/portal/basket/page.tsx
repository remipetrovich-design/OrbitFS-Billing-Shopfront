"use client";

import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {createClient} from "@/lib/supabase";
import {trackCustomerActivity} from "@/lib/customer-activity";
import StoreFlowNav from "@/components/StoreFlowNav";

const money=(cents:number,currency="AUD")=>new Intl.NumberFormat("en-AU",{style:"currency",currency}).format(Number(cents||0)/100);

export default function Basket(){
  const sb=useMemo(()=>createClient(),[]);
  const [cart,setCart]=useState<any>(null);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState("");

  async function load(){
    const {data,error}=await sb.rpc("cart_summary");
    if(error){setMessage(error.message);return}
    setCart(data||{items:[],item_count:0,subtotal_cents:0,discount_cents:0,total_cents:0});
  }
  useEffect(()=>{void load()},[]);

  async function remove(id:string){
    setBusy(id);
    const {error}=await sb.rpc("remove_from_cart",{p_item_id:id});
    if(error)setMessage(error.message);
    else{setMessage("Removed from basket.");await trackCustomerActivity("cart.item_removed",{entityType:"cart_item",entityId:id});await load()}
    setBusy("");
  }

  async function clear(){
    if(!confirm("Clear your basket?"))return;
    setBusy("clear");
    const {error}=await sb.rpc("clear_cart");
    if(error)setMessage(error.message);
    else{setMessage("Basket cleared.");await trackCustomerActivity("cart.cleared",{entityType:"cart"});await load()}
    setBusy("");
  }

  if(!cart)return <main className="portalPage v6c-store-step"><StoreFlowNav/><section className="v6c-store-state">Loading basket…</section></main>;
  const currency=cart.items?.[0]?.currency||"AUD";

  return <main className="portalPage v6c-store-step">
    <StoreFlowNav count={cart.item_count||0}/>
    <header className="v6c-store-step-head"><div><span>BASKET</span><h1>Review your OrbitFS order.</h1><p>Check products, quantities and totals before moving to payment.</p></div><Link href="/portal/products">Continue shopping →</Link></header>

    <div className="v6c-store-step-grid">
      <section className="v6c-store-items">
        <div className="v6c-store-panel-head"><div><small>YOUR ITEMS</small><h2>Basket</h2></div>{cart.item_count>0&&<button className="secondary" type="button" disabled={!!busy} onClick={()=>void clear()}>{busy==="clear"?"Clearing…":"Clear basket"}</button>}</div>
        {cart.items?.length?cart.items.map((item:any)=><article className="v6c-store-item" key={item.id}>
          <div><b>{item.name}</b><span>Qty {item.quantity}{item.configuration?.gift_recipient_email?" · Gift for "+item.configuration.gift_recipient_email:""}</span></div>
          <strong>{money(item.line_total_cents,item.currency||currency)}</strong>
          <button className="danger" type="button" disabled={!!busy} onClick={()=>void remove(item.id)}>{busy===item.id?"Removing…":"Remove"}</button>
        </article>):<div className="v6c-store-empty"><b>Your basket is empty.</b><span>Add a product from the Store to continue.</span><Link href="/portal/products">Browse Store →</Link></div>}
        {message&&<p className="v6c-store-message">{message}</p>}
      </section>

      <aside className="v6c-store-summary">
        <small>ORDER SUMMARY</small>
        <div><span>Subtotal</span><b>{money(cart.subtotal_cents,currency)}</b></div>
        <div><span>Discount</span><b>-{money(cart.discount_cents,currency)}</b></div>
        {Number(cart.tax_cents||0)>0&&<div><span>Tax</span><b>{money(cart.tax_cents,currency)}</b></div>}
        <div className="total"><span>Total</span><strong>{money(cart.total_cents,currency)}</strong></div>
        {cart.item_count>0?<Link className="buttonlink" href="/portal/checkout">Continue to checkout →</Link>:<Link className="buttonlink secondary" href="/portal/products">Open Store</Link>}
      </aside>
    </div>
  </main>;
}

"use client";

import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {createClient} from "@/lib/supabase";
import {trackCustomerActivity} from "@/lib/customer-activity";
import StoreFlowNav from "@/components/StoreFlowNav";

const money=(cents:number,currency="AUD")=>new Intl.NumberFormat("en-AU",{style:"currency",currency}).format(Number(cents||0)/100);

export default function Checkout(){
  const sb=useMemo(()=>createClient(),[]);
  const [cart,setCart]=useState<any>(null);
  const [gateways,setGateways]=useState<any[]>([]);
  const [gateway,setGateway]=useState("");
  const [coupon,setCoupon]=useState("");
  const [allowCoupons,setAllowCoupons]=useState(true);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  async function load(){
    const [{data:cartData,error:cartError},{data:cfgRows}]=await Promise.all([
      sb.rpc("cart_summary"),
      sb.from("app_settings").select("key,value").in("key",["products.allow_coupons"])
    ]);
    if(cartError){setMessage(cartError.message);return}
    const next=cartData||{items:[],item_count:0,subtotal_cents:0,discount_cents:0,total_cents:0};
    setCart(next);
    setCoupon(next.coupon_code||"");
    const cfg=Object.fromEntries((cfgRows||[]).map((x:any)=>[x.key,x.value]));
    setAllowCoupons(cfg["products.allow_coupons"]!==false);
    const currency=next.items?.[0]?.currency||"AUD";
    const {data:g,error:gError}=await sb.rpc("checkout_payment_gateways",{p_currency:currency});
    if(gError)setMessage(gError.message);
    setGateways(g||[]);
    if(g?.length)setGateway(current=>current||g[0].code);
  }
  useEffect(()=>{void load()},[]);

  async function applyCoupon(){
    const {error}=await sb.rpc("set_cart_coupon",{p_code:coupon});
    if(error){setMessage(error.message);return}
    setMessage(coupon.trim()?"Coupon applied.":"Coupon removed.");
    await trackCustomerActivity(coupon.trim()?"cart.coupon_applied":"cart.coupon_removed",{entityType:"cart",detail:{coupon:coupon.trim()||null}});
    await load();
  }

  async function sendCustomerEvent(eventKey:string,relatedId:string){
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.access_token)throw new Error("Authentication expired.");
    const response=await fetch("/api/mail/customer-event",{method:"POST",keepalive:true,headers:{authorization:"Bearer "+session.access_token,"content-type":"application/json"},body:JSON.stringify({eventKey,relatedId})});
    const body=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(body.error||eventKey+" email failed.");
  }

  async function fulfilGifts(orderId:string){
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.access_token)throw new Error("Authentication expired.");
    const response=await fetch("/api/gifts/fulfill",{method:"POST",headers:{authorization:"Bearer "+session.access_token,"content-type":"application/json"},body:JSON.stringify({order_id:orderId})});
    const body=await response.json();
    if(!response.ok)throw new Error(body.error||"Gift delivery could not finish.");
  }

  async function externalHandoff(attemptId:string){
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.access_token)throw new Error("Authentication expired.");
    const response=await fetch("/api/payments/start",{method:"POST",headers:{authorization:"Bearer "+session.access_token,"content-type":"application/json"},body:JSON.stringify({attempt_id:attemptId})});
    const body=await response.json();
    if(!response.ok||!body.url)throw new Error(body.error||"Payment gateway could not start.");
    void trackCustomerActivity("payment.handoff_started",{entityType:"payment_attempt",entityId:attemptId}).catch(()=>{});
    location.href=body.url;
  }

  async function placeOrder(){
    if(!cart?.item_count||busy)return;
    setBusy(true);setMessage("Creating order and invoice…");
    const {data,error}=await sb.rpc("checkout_cart",{p_pay_with_credit:false});
    if(error){void trackCustomerActivity("checkout.failed",{entityType:"cart",success:false,detail:{error:error.message}}).catch(()=>{});setBusy(false);setMessage(error.message);return}
    void trackCustomerActivity("checkout.order_created",{entityType:"order",entityId:data?.order_id,detail:{order_number:data?.order_number,invoice_id:data?.invoice_id,paid:!!data?.paid}}).catch(()=>{});
    void Promise.allSettled([sendCustomerEvent("order.created",data?.order_id),sendCustomerEvent("invoice.created",data?.invoice_id)]);
    if(data?.paid){
      void Promise.allSettled([sendCustomerEvent("order.paid",data?.order_id),sendCustomerEvent("invoice.paid",data?.invoice_id)]);
      if(data?.contains_gifts){try{await fulfilGifts(data.order_id)}catch(e:any){setMessage("Order paid, but gift delivery is waiting: "+e.message);setBusy(false);return}}
      location.href="/portal/orders/"+data.order_id;return;
    }
    if(!gateway){location.href="/portal/invoices/"+data.invoice_id;return}
    const payment=await sb.rpc("start_invoice_payment",{p_invoice_id:data.invoice_id,p_gateway_code:gateway});
    if(payment.error){setBusy(false);setMessage("Invoice "+data.invoice_number+" was created, but payment could not start: "+payment.error.message);setTimeout(()=>location.href="/portal/invoices/"+data.invoice_id,1200);return}
    if(payment.data?.status==="action_required"){
      try{await externalHandoff(payment.data.attempt_id)}catch(e:any){setBusy(false);setMessage("Payment could not open: "+e.message);setTimeout(()=>location.href="/portal/invoices/"+data.invoice_id,1400)}
      return;
    }
    if(payment.data?.status==="pending"){setMessage(payment.data.instructions||"Payment is pending.");setTimeout(()=>location.href="/portal/invoices/"+data.invoice_id,1200);return}
    setTimeout(()=>location.href="/portal/orders/"+data.order_id,400);
  }

  if(!cart)return <main className="portalPage v6c-store-step"><StoreFlowNav/><section className="v6c-store-state">Loading checkout…</section></main>;
  const currency=cart.items?.[0]?.currency||"AUD";

  return <main className="portalPage v6c-store-step">
    <StoreFlowNav count={cart.item_count||0}/>
    <header className="v6c-store-step-head"><div><span>CHECKOUT</span><h1>Finish your order.</h1><p>Apply a coupon, choose a payment method and create the final OrbitFS order and invoice.</p></div><Link href="/portal/basket">← Back to basket</Link></header>

    {!cart.item_count?<section className="v6c-store-empty standalone"><b>Your basket is empty.</b><span>Add a product before checking out.</span><Link href="/portal/products">Open Store →</Link></section>:<div className="v6c-store-step-grid checkout">
      <section className="v6c-checkout-main">
        <div className="v6c-store-panel-head"><div><small>PAYMENT</small><h2>Checkout details</h2></div></div>
        {allowCoupons&&<label className="v6c-checkout-field"><span>Coupon code</span><div className="couponApply"><input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code"/><button className="secondary" type="button" onClick={()=>void applyCoupon()}>Apply</button></div></label>}
        <div className="v6c-checkout-field"><span>Payment method</span>{gateways.length?<div className="storeGatewayList">{gateways.map((g:any)=><label className={"storeGateway "+(gateway===g.code?"active":"")} key={g.code}><input type="radio" name="gateway" checked={gateway===g.code} onChange={()=>setGateway(g.code)}/><span><b>{g.name}</b><small>{g.description}</small></span></label>)}</div>:<div className="notice"><b>No online payment method enabled</b><span>You can still create the invoice and pay it later.</span></div>}</div>
        {message&&<p className="v6c-store-message">{message}</p>}
      </section>

      <aside className="v6c-store-summary">
        <small>ORDER SUMMARY</small>
        <div className="v6c-checkout-items">{cart.items.map((item:any)=><div key={item.id}><span>{item.name} × {item.quantity}</span><b>{money(item.line_total_cents,item.currency||currency)}</b></div>)}</div>
        <div><span>Subtotal</span><b>{money(cart.subtotal_cents,currency)}</b></div>
        <div><span>Discount</span><b>-{money(cart.discount_cents,currency)}</b></div>
        {Number(cart.tax_cents||0)>0&&<div><span>Tax</span><b>{money(cart.tax_cents,currency)}</b></div>}
        <div className="total"><span>Total</span><strong>{money(cart.total_cents,currency)}</strong></div>
        <button type="button" disabled={busy||!cart.item_count} onClick={()=>void placeOrder()}>{busy?"Processing…":gateway?"Place order & pay":"Create invoice"}</button>
        <small>Checkout creates one order and one invoice containing every selected OrbitFS product.</small>
      </aside>
    </div>}
  </main>;
}

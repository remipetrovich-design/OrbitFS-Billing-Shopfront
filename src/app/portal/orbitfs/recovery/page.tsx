"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {createClient} from "@/lib/supabase";

export default function OrbitFSRecoveryPage(){
  const sb=useMemo(()=>createClient(),[]);
  const [install,setInstall]=useState<any>(null);
  const [applied,setApplied]=useState<any>(null);
  const [reason,setReason]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState("");

  async function headers(){
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.access_token)throw Error("Your session has expired. Sign in again.");
    return {Authorization:"Bearer "+session.access_token};
  }
  async function load(){
    setBusy("load");setMessage("");
    try{
      const res=await fetch("/api/orbitfs/status?view=bootstrap",{headers:await headers(),cache:"no-store"});
      const body=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(body.error||"Could not load OrbitFS recovery state.");
      const binding=(body.bindings||[]).find((value:any)=>value.license_product_key==="orbitfs_base"||value.components?.orbitfs_base||value.components?.orbitfs_panel);
      const current=(body.installations||[]).find((value:any)=>String(value.license_binding_id)===String(binding?.id))||(body.installations||[])[0]||null;
      setInstall(current);
      setApplied(current?.metadata?.appliedUpdate||body?.normalUpdate?.applied||null);
    }catch(error:any){setMessage(error?.message||"Could not load recovery state.")}finally{setBusy("")}
  }
  useEffect(()=>{void load()},[]);

  async function reapply(){
    if(!install?.id||!applied?.releaseId||!applied?.version)return;
    if(!confirm("Reapply this published Update through the standalone Updater?"))return;
    setBusy("reapply");setMessage("");
    try{
      const res=await fetch("/api/orbitfs/installations/"+encodeURIComponent(String(install.id))+"/deploy",{
        method:"POST",headers:{...(await headers()),"content-type":"application/json"},
        body:JSON.stringify({action:"update",version:"update:"+String(applied.version),releaseId:String(applied.releaseId),channel:String(applied.channel||install.release_channel||"stable"),reason:"recovery_reapply"})
      });
      const body=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(body.error||"Update reapply failed.");
      setMessage("Update re-applied successfully.");await load();
    }catch(error:any){setMessage(error?.message||"Update reapply failed.")}finally{setBusy("")}
  }

  async function rollback(){
    if(!install?.id||!applied?.version||!reason.trim())return;
    if(!confirm("Roll back the installed Update? Forward-compatible database migrations remain applied."))return;
    setBusy("rollback");setMessage("");
    try{
      const res=await fetch("/api/orbitfs/installations/"+encodeURIComponent(String(install.id))+"/rollback-update",{
        method:"POST",headers:{...(await headers()),"content-type":"application/json"},
        body:JSON.stringify({reason:reason.trim()})
      });
      const body=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(body.error||"Update rollback failed.");
      setReason("");setMessage("Update rollback completed.");await load();
    }catch(error:any){setMessage(error?.message||"Update rollback failed.")}finally{setBusy("")}
  }

  return <main className="portalOverviewV2 orbitV5Updater">
    <header className="orbitV5UpdateHero">
      <div><p className="eyebrow">MY ORBITFS · RECOVERY</p><h1>Recovery</h1><p>Repair or roll back an installed Update without running the Inner Deployer.</p></div>
      <div className="orbitV5UpdateHeroActions"><Link className="buttonlink secondary" href="/portal/orbitfs/releases">Updates</Link><Link className="buttonlink secondary" href="/portal/orbitfs/configuration">Updater configuration</Link></div>
    </header>
    {message&&<section className="orbitV5UpdateMessage" role="status">{message}</section>}
    <section className="panel orbitV5UpdatePanel">
      <h2>Installed Update</h2>
      {!install?<p>No OrbitFS installation is available.</p>:!applied?<p>No Update is currently recorded for this installation.</p>:<>
        <div className="orbitV5UpdateFacts">
          <div><small>VERSION</small><b>v{String(applied.version||"—")}</b></div>
          <div><small>CHANNEL</small><b>{String(applied.channel||"—")}</b></div>
          <div><small>COMPONENTS</small><b>{Array.isArray(applied.components)?applied.components.join(", "):"—"}</b></div>
          <div><small>UPDATER</small><b>{install?.metadata?.updaterConnection?.linked===true?"Linked":"Not linked"}</b></div>
        </div>
        <div className="orbitV5UpdateActions">
          <button type="button" disabled={!!busy||install?.metadata?.updaterConnection?.linked!==true} onClick={()=>void reapply()}>{busy==="reapply"?"Reapplying…":"Repair / reapply Update"}</button>
        </div>
        <label>Rollback reason<textarea rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason for rollback"/></label>
        <div className="orbitV5UpdateActions"><button type="button" className="secondary" disabled={!!busy||!reason.trim()} onClick={()=>void rollback()}>{busy==="rollback"?"Rolling back…":"Rollback Update"}</button></div>
      </>}
    </section>
  </main>;
}

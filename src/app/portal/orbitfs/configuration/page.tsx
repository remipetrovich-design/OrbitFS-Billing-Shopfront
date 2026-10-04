"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {createClient} from "@/lib/supabase";

export default function OrbitFSConfigurationPage(){
  const sb=useMemo(()=>createClient(),[]);
  const [install,setInstall]=useState<any>(null);
  const [hostUrl,setHostUrl]=useState("");
  const [projectId,setProjectId]=useState("");
  const [projectName,setProjectName]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  async function headers(){
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.access_token)throw Error("Your session has expired. Sign in again.");
    return {Authorization:"Bearer "+session.access_token};
  }
  async function load(){
    setBusy(true);setMessage("");
    try{
      const h=await headers();
      const res=await fetch("/api/orbitfs/status?view=bootstrap",{headers:h,cache:"no-store"});
      const body=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(body.error||"Could not load OrbitFS installation.");
      const binding=(body.bindings||[]).find((value:any)=>value.license_product_key==="orbitfs_base"||value.components?.orbitfs_base||value.components?.orbitfs_panel);
      const current=(body.installations||[]).find((value:any)=>String(value.license_binding_id)===String(binding?.id))||(body.installations||[])[0]||null;
      setInstall(current);
      const c=current?.metadata?.updaterConnection||{};
      setHostUrl(String(c.engineHostUrl||""));
      setProjectId(String(c.engineProjectId||""));
      setProjectName(String(c.engineProjectName||""));
    }catch(error:any){setMessage(error?.message||"Could not load configuration.")}finally{setBusy(false)}
  }
  useEffect(()=>{void load()},[]);

  async function save(){
    if(!install?.id)return;
    setBusy(true);setMessage("");
    try{
      const res=await fetch("/api/orbitfs/installations/"+encodeURIComponent(String(install.id))+"/updater-connection",{
        method:"POST",headers:{...(await headers()),"content-type":"application/json"},
        body:JSON.stringify({engineHostUrl:hostUrl,engineProjectId:projectId,engineProjectName:projectName})
      });
      const body=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(body.error||"Could not link Updater.");
      setMessage("Updater linked to this installation.");
      await load();
    }catch(error:any){setMessage(error?.message||"Could not link Updater.")}finally{setBusy(false)}
  }

  async function unlink(){
    if(!install?.id||!confirm("Unlink the Update Release System from this Shared Engine Host?"))return;
    setBusy(true);setMessage("");
    try{
      const res=await fetch("/api/orbitfs/installations/"+encodeURIComponent(String(install.id))+"/updater-connection",{method:"DELETE",headers:await headers()});
      const body=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(body.error||"Could not unlink Updater.");
      setHostUrl("");setProjectId("");setProjectName("");setMessage("Updater unlinked.");
      await load();
    }catch(error:any){setMessage(error?.message||"Could not unlink Updater.")}finally{setBusy(false)}
  }

  return <main className="portalOverviewV2">
    <header className="orbitV5UpdateHero">
      <div><p className="eyebrow">MY ORBITFS · CONFIGURATION</p><h1>Updater connection</h1>
      <p>Link the Update Release System to the already-deployed Shared Engine Host. This does not run the Inner Deployer.</p></div>
      <div className="orbitV5UpdateHeroActions"><Link className="buttonlink secondary" href="/portal/orbitfs/releases">Back to Updates</Link></div>
    </header>
    {message&&<section className="orbitV5UpdateMessage" role="status">{message}</section>}
    <section className="panel orbitV5UpdatePanel">
      <h2>Shared Engine Host</h2>
      <p className="muted">Use the project created by the Inner Deployer. The Updater will reuse this existing project for future Engine/addon updates.</p>
      {!install?<p>No OrbitFS installation is available.</p>:<>
        <label>Engine Host URL<input value={hostUrl} onChange={e=>setHostUrl(e.target.value)} placeholder="https://orbitfs-engine-....vercel.app" /></label>
        <label>Vercel Engine project ID<input value={projectId} onChange={e=>setProjectId(e.target.value)} placeholder="prj_..." /></label>
        <label>Vercel Engine project name<input value={projectName} onChange={e=>setProjectName(e.target.value)} placeholder="orbitfs-engine-..." /></label>
        <div className="orbitV5UpdateHeroActions">
          <button type="button" disabled={busy||!hostUrl||!projectId||!projectName} onClick={()=>void save()}>{busy?"Saving…":"Link Updater"}</button>
          {install?.metadata?.updaterConnection?.linked&&<button type="button" className="secondary" disabled={busy} onClick={()=>void unlink()}>Unlink</button>}
        </div>
      </>}
    </section>
  </main>;
}

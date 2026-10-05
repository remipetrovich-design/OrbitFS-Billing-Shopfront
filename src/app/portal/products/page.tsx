
  if (!cart) return <main className="portalPage">Loading OrbitFS Store…</main>;

  const baseFeatures = Array.isArray(base?.metadata?.store_features) ? base.metadata.store_features : [];

  return <main className="portalPage storePage">
    <StoreFlowNav count={cart.item_count||0}/>
    <header className="storeHero">
      <div><p className="eyebrow">{storeText.hero_eyebrow || "ORBITFS STORE"}</p><h1>{storeText.hero_title || "Build your OrbitFS setup"}</h1><p className="storeLead">{storeText.hero_lead || "Start with OrbitFS Base System, then add the components you need."}</p></div>
      <Link className="storeCartJump secondary" href="/portal/basket">Basket · {cart.item_count || 0}</Link>
    </header>
    {msg&&<p className="v6c-store-message v6c-store-catalog-message">{msg}</p>}

    {base && <section className="storeBaseFeature">
      <div className="storeBaseCopy"><span className="pill">{base.metadata?.store_badge || "Core system"}</span><h2>{base.name}</h2><p>{base.description}</p>{baseFeatures.length>0&&<div className="storeBasePoints">{baseFeatures.map((x:string)=><span key={x}>{x}</span>)}</div>}</div>
      <div className="storeBaseAction"><small>{storeText.base_action_label || "Base system"}</small><strong>{productPrice(base)}</strong>{hasOptions(base)?<Link className="buttonlink" href={`/portal/products/${base.slug}`}>Configure {base.name}</Link>:<button onClick={()=>directAdd(base)}>Add to basket</button>}<Link href={`/portal/products/${base.slug}`}>Product details / gift →</Link></div>
    </section>}

    {!!addons.length && <section className="storeSection"><div className="storeSectionHead"><div><p className="eyebrow">{storeText.addons_eyebrow || "EXPAND ORBITFS"}</p><h2>{storeText.addons_title || "Add-ons"}</h2><p className="muted">{storeText.addons_lead || "Add only the capabilities you want."}</p></div></div>
      <div className="storeAddonList">{addons.map(p => <article className="storeAddonCard" key={p.slug}><div><span className="pill">{p.metadata?.store_badge || "Add-on"}</span><h3>{p.name}</h3><p>{p.description}</p></div><div className="storeAddonMeta"><strong>{productPrice(p)}</strong>{hasOptions(p)?<Link className="buttonlink" href={`/portal/products/${p.slug}`}>Configure & add</Link>:<button onClick={()=>directAdd(p)}>Add to basket</button>}<Link href={`/portal/products/${p.slug}`}>Details / gift →</Link></div></article>)}</div>
    </section>}
  </main>;
}

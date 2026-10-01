# OrbitFS Store / Master Services UI

Design/prototype repository for the split OrbitFS Store, Customer Panel, Admin Panel, Master Licensing and Release services.

This repository is intentionally separate from `OrbitFS-Website`. The production repository is **read-only source material for the design project**; the final UI/design work is delivered here.

## Full rescan completed

A second, full rescan of `lucaskerim123/OrbitFS-Website` was completed on 2026-09-10 after the first design pass was found to be incomplete.

The expanded scope now accounts for the real Website architecture across:

- Public storefront/catalogue
- Product configuration/options/artifacts
- Basket and checkout
- Customers/accounts
- Orders and order items
- Invoices, payments and refunds
- Payment gateways/runtime/webhooks
- Coupons
- Wallet/account credit/recharge
- Gift purchase and delivery
- Customer Portal
- Licences and licence components
- Master licence control/enforcement
- Licence API/runtime health
- Panel/Engine release system and release bundles
- Customer deployment/download surfaces
- Support, departments, claims and escalation
- Guest/basic support
- Knowledge Base and premade messages
- Notifications and transactional mail
- News/content
- Staff/roles/permissions
- Alerts, analytics and audit
- Account enforcement/restricted payment behaviour
- Themes and responsive UI

## Canonical licence products

- OrbitFS Base System — `orbitfs_base`
- OrbitFS MCP — `orbitfs_mcp`
- OrbitFS Apex System — `orbitfs_apex`
- OrbitFS Studio — `orbitfs_studio`

Historic aliases are retained only for compatibility in the source system.

## Critical design rule

Commerce state and licence state are separate. The UI must distinguish order/payment/fulfilment from licence desired state, remote state and enforcement state.

Required billing language:

- Unpaid / Pending Payment
- Overdue / Pending Payment
- Paid / Active
- APAID / Active
- Suspended / Suspended
- Canceled / Terminated

## Prototype focus

The prototype is an operational control plane, not a marketing SaaS dashboard. It should demonstrate the real system hierarchy and enough representative states to design the complete Website, Customer Portal and MASTER Admin experience.

See `DESIGN_SPEC.md` for the complete rescan-derived specification, route/state inventory, subsystem map, security rules and 12ui workflow.

## Run

Open `index.html` directly, or serve the repository with any static HTTP server.

## Current split architecture — 2026-09-10

The current prototype is deliberately split into independent application/service surfaces:

- **Public Store** — public catalogue, purchasing, accounts and commercial entry point.
- **Customer Panel** — customer-owned experience for licences, the external License Controller and the external Deployer.
- **Admin Panel** — customer/order/payment/invoice/fulfilment administration. It can request licence operations through the connector but does not own licence state.
- **Master Licensing** — external authoritative licence service: issue, reissue, validate, bind, control, suspend, terminate, API/runtime and enforcement.
- **Release System** — external authoritative software delivery service: generate drafts, validate packages, authorise, publish and prepare deployment releases.
- **Service Connector** — integration boundary between the Store/Customer applications and the external Master services. It is not a shared database.
- **Audit** — correlated operational history across the boundaries.

### Hard separation

Billing state is not licence state. Licence state is not release state. Publishing a release does not issue a licence. A paid order creates commercial eligibility/fulfilment context; the external Master Licensing service creates and controls the actual licence. The external Release System creates and publishes the package that may be delivered when the customer is entitled.

### Intended flow

`Customer → Public Store → purchase → commercial fulfilment → Service Connector → Master Licensing → licence`

`Customer → Customer Panel → License Controller → Master Licensing`

`Customer → Customer Panel → External Deployer → Release System → customer deployment target`

`Admin Panel → Service Connector → Master Licensing / Release System`

The prototype intentionally keeps these surfaces visually separate so the final product can be implemented as separate applications/services that integrate cleanly rather than as one large Website backend.

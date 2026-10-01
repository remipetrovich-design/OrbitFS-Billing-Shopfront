# OrbitFS Master UI — Full Website / Billing / Master Licence Design Specification

## 1. Purpose

This repository is the **design and prototype target only** for the OrbitFS Website commercial/control plane. It must represent the real system in `lucaskerim123/OrbitFS-Website`, not a generic SaaS dashboard.

The production repository is the source of truth for existing product areas, routes, workflows, state models and security boundaries. **Do not modify the production repository as part of this UI project.** All final UI/design work belongs in `UIDesign`.

The Website is the commercial/control plane for OrbitFS: storefront/catalog, customers, orders, payment state, invoices, fulfilment/licence orchestration, customer portal, support, wallet, downloads/releases, MASTER administration, audit/reporting and the licence service boundary.

## 2. Full system surfaces discovered

### Public/storefront

- Home/store landing surface
- Billing/store catalogue
- Product catalogue
- Product detail/configuration
- Product options/configuration deltas
- Free-product handling
- Add to basket
- Basket
- Checkout
- Account creation/login/reset/verification
- Public news/newsroom
- Public support
- Guest/basic support access

### Customer Portal

- Portal overview/dashboard
- Account/profile/settings
- Orders list
- Order detail
- Order cancellation/refund flows
- Invoices list
- Invoice detail
- Invoice payment flow
- Invoice/payment/refund history
- Licences
- Licence detail/activation-related information
- Downloads
- OrbitFS/customer deployment/release surfaces
- Products/catalogue
- Product purchase/configuration
- Gift purchase/delivery
- Support tickets
- Knowledge base/support
- Wallet balance
- Wallet ledger
- Wallet recharge
- Wallet used against invoices/orders
- Customer notifications
- Customer-facing mail/preferences
- Account restriction/blocked state

### MASTER Admin

The admin shell currently separates these operational areas:

1. **Dashboard / Overview**
2. **Customers**
   - Customers
   - Customer detail/history
   - Cancellations
3. **Orders & Billing**
   - Orders
   - Order detail/edit/audit reason
   - Invoices
   - Invoice detail
   - Invoice notes
   - Invoice payments
   - Invoice refunds
   - Billing/invoice creation
   - Coupons
   - Payments
   - Payment gateway setup
4. **Licence System**
   - OrbitFS Release Panel System
   - Licences
   - Licence detail
   - Master licence control / enforcement
   - Licence API settings
   - Licence settings
5. **Products & Content**
   - Products/configuration
   - Product options/artifacts
   - Downloads
   - News/content
6. **Support**
   - Tickets
   - Ticket detail
   - Create ticket
   - Knowledge Base
   - Premade messages
   - Support settings
7. **System**
   - Staff
   - Staff groups/permissions/departments
   - Alert system
   - Themes
   - Analytics
   - Audit log
   - General/settings
   - Commerce/billing settings
   - Product settings
   - Invoice settings
   - Payment settings
   - Licence settings
   - Support settings
   - Mail settings

## 3. Licence component model

The canonical licence components discovered in the production source are:

- `orbitfs_base` — **OrbitFS Base System**; historic alias `orbitfs_panel`
- `orbitfs_mcp` — **OrbitFS MCP**
- `orbitfs_apex` — **OrbitFS Apex System**; historic alias `orbitfs_sorter`
- `orbitfs_studio` — **OrbitFS Studio**

The UI must use the canonical names/codes while retaining awareness that legacy aliases exist for compatibility. The Website licence system is its own Supabase-backed control system and does not depend directly on the legacy Cloudflare/D1 implementation.

## 4. Commerce model — critical separation

The UI must never collapse these into one generic “status”:

**Order state** → **payment state** → **fulfilment state** → **licence state** → **remote enforcement state**.

Orders expose payment and fulfilment information. Invoices have their own lifecycle. A successful payment may trigger fulfilment/licence issuance, but payment does not itself equal licence health.

The production system also supports an administrative paid override (`APAID`). This must remain visibly distinct from normal payment settlement and must be auditable.

Required customer/admin language:

- **Unpaid / Pending Payment**
- **Overdue / Pending Payment**
- **Paid / Active**
- **APAID / Active**
- **Suspended / Suspended**
- **Canceled / Terminated**

Do not invent alternative labels that obscure these states.

## 5. Billing and payment system

The scan found a real payment runtime rather than a static checkout concept.

The design must account for:

- Payment attempts
- Invoice payment start
- Payment return/success handling
- Payment cancellation
- Stripe Checkout
- PayPal Checkout
- OrbitFS account credit
- Manual bank transfer
- Payment gateway configuration
- Gateway enable/disable state
- Gateway canonical sync/autoconfiguration
- Stripe webhook/event handling
- PayPal return/callback handling
- Wallet payment flows
- Restricted-account payment blocking
- Manual invoice payment recording
- Refunds
- Partial refunds
- Refund destination/credit handling
- Invoice/payment reconciliation
- Payment auditability

Payment UI should show the provider, attempt state, transaction/reference identifiers where appropriate, invoice/order relationship, amount/currency, timestamps and resulting state.

## 6. Invoice system

Invoices are a first-class subsystem, not merely an order display.

Required UI coverage:

- Invoice list/filtering
- Attention/overdue filtering
- Invoice number/status/customer/order
- Invoice line items
- Invoice totals/subtotal/discounts
- Due dates
- Payment history
- Refund history
- Notes
- Manual payment recording
- Refund workflow
- Standalone invoice billing-state management
- Invoice lifecycle settings
- Automatic invoice creation settings
- Numbering/prefix settings
- Due-date/reminder configuration
- Overdue enforcement timing

The UI must preserve the distinction between invoice status, payment status and order/licence status.

## 7. Products/catalogue/fulfilment

Products are configurable commercial entities, not just cards on a storefront.

The design must represent:

- Product name/slug/description
- Price/currency
- Free products
- Product metadata
- Product component classification
- Base vs add-on presentation
- Product options
- Option price deltas
- Product configuration
- Fulfilment/payment rules
- Product artifacts/downloadable outputs
- Ownership checks
- “Already own” behaviour
- Gift purchase path
- Product settings
- Catalogue/content controls

Store presentation should make the OrbitFS component ecosystem understandable without turning the website into a marketing-only site.

## 8. Gift purchasing/delivery

Gift functionality was missed in the first scan and is now explicitly included.

The design must support:

- Buying a product as a gift
- Recipient email
- Gift-specific configuration
- Gift delivery/fulfilment
- Recipient lookup
- Gift account creation/temporary access handling where applicable
- Gift delivery status
- Gift orders remaining connected to the source order/item

Gift fulfilment must not be visually confused with the purchaser's own licence ownership.

## 9. Master licence control

This is the most important operational surface.

The Master licence console must expose enough information to operate the real licence system:

- Licence key/identifier
- Licence product/component
- Customer/account
- Order/invoice relationship
- Binding
- Installation/device information
- Installation limits
- API source
- Desired state
- Remote state
- Service status
- Suspension reason
- Enforcement queue
- Last sync/verification information
- Runtime configuration/health
- Admin override state
- Audit history

Core actions:

- Issue
- Reissue
- Unblock
- Suspend
- Sync
- Verify
- Terminate
- Inspect binding/installations
- Inspect enforcement queue

**Suspend** is reversible service enforcement.

**Terminate** is a stronger lifecycle action that blocks/archives the licence and must be treated as destructive/high-risk.

The UI should use confirmations and explicit impact summaries for high-risk operations.

## 10. Licence API/runtime boundary

The production Website exposes a server-side licence adapter/API layer with routes including health, activation, registration, validation, revision, public-key and release-related endpoints.

The design must communicate service health without exposing secrets.

Never place these in browser-facing UI:

- private signing keys
- licence service tokens
- billing/admin secrets
- server-only credentials

The interface may expose safe operational facts such as configured/ready state, endpoint health, signing configuration status and last verification, but secrets remain server-side.

## 11. Release Panel / Engine / deployment control plane

The full scan found more than ordinary licensing. The Website also contains release/deployment orchestration.

Relevant systems include:

- Panel release metadata
- Engine release metadata
- Engine release manifest validation
- Engine release draft submission
- Engine release publishing
- Panel release publishing
- Release analysis
- OrbitFS release bundles
- Admin release-bundle management
- Release-system administration
- Authorisation for release publishers

The release UI should therefore be treated as a **commercial/service delivery subsystem**, not a random developer page.

The design must clearly distinguish:

**Licence entitlement** → customer access

**Release availability** → software/package version

**Release publishing** → administrative operation

**Customer deployment/download** → delivery operation

## 12. Customer support system

Support is substantially larger than a contact form.

Discovered functionality includes:

- Customer tickets
- Guest/basic support
- General Support and Sales guest routing
- Access codes for guest support
- Ticket departments
- Staff departments
- Support role hierarchy
- Senior Support
- Administrator
- Superadmin
- Ticket assignment/claim
- Department handoff/transfer
- Escalation
- Escalation guards
- Claim-required rules
- Customer/admin ticket creation
- Knowledge Base
- Premade messages
- Support settings
- Ticket/customer context
- Related orders/invoices/licences
- Support attachments
- Support mail events
- Automatic/worker ticket behaviour

The admin UI must make department, ownership, escalation and permissions visible rather than presenting every ticket as an undifferentiated inbox row.

## 13. Wallet/account credit

The customer account includes a wallet/account-credit subsystem.

Required surfaces:

- Available balance
- Ledger/history
- Recharge
- Recharge payment attempt
- Stripe/PayPal return handling for wallet recharge
- Wallet credit applied to invoice
- Wallet credit/refund destination
- Wallet-related settings
- Wallet restrictions

Wallet money must remain visually distinct from ordinary order totals and payment-provider transactions.

## 14. Customer account/enforcement controls

The system contains account-level enforcement and restricted-account payment guards.

The UI needs distinct concepts for:

- Normal account
- Restricted/blocked account
- Payment blocked
- Licence suspended
- Licence terminated
- User/account enforcement

Do not imply that a blocked customer account and a suspended licence are the same operation.

## 15. Notifications, mail and communications

The production system includes a shared notification centre and outbound mail architecture.

Required design coverage:

- Customer notifications
- Admin notifications
- Notification preferences
- Notification centre
- Transactional mail
- Support-event mail
- Order/invoice mail
- Account/password-reset mail
- Admin quick-send mail
- Mail templates
- Mail queue/operations
- Mail settings
- Sender identity/branding

Recent production work explicitly established one shared backend with separate Admin and Customer notification panels.

## 16. News/content

Public news is also part of the commercial website:

- Product updates
- Announcements
- Newsroom
- Draft/publish/schedule workflow
- Pinned/featured content
- Homepage visibility
- CTA links
- SEO metadata

This belongs in the Products & Content area, but must not dominate the operational MASTER console.

## 17. Staff, permissions and administration

The admin navigation is permission-driven. The design must retain that principle.

Important permission areas include:

- Admin access
- Customers
- Orders
- Invoices
- Coupons
- Payments/gateways
- Licences
- Enforcement
- Licence API
- Products
- News/downloads
- Support
- Staff
- Settings
- Analytics
- Audit
- Mail

Staff roles/groups/departments must be visually and functionally separate from customer accounts.

## 18. Alerts, analytics and audit

System operations include:

- Alert system
- Conditional alert targeting
- Customer/product/service/licence conditions
- Analytics
- Audit log
- Administrative mutation history
- Attention/queue states

The dashboard should surface actionable attention items without turning every metric into a decorative card.

## 19. Themes and UI system

The production Website already contains multiple generations of admin/customer styling and a runtime theme system, including V3A/V3C and compact-density/palette variants.

The new UIDesign target should be a coherent replacement design direction, not a pile of another CSS layer on top of the old layers.

Preserve the ability to represent:

- Admin vs customer surfaces
- Desktop vs mobile
- Compact operational density
- Clear status colours
- Accessible contrast
- Theme/runtime configuration where appropriate

## 20. Route/state map for the prototype

The UIDesign prototype should eventually be able to demonstrate at least these states:

### Store

`/`
`/billing`
`/products/[slug]`
`/portal/basket`
`/portal/checkout`

### Customer

`/portal`
`/portal/orders`
`/portal/orders/[id]`
`/portal/invoices`
`/portal/invoices/[id]`
`/portal/licenses`
`/portal/products`
`/portal/products/[slug]`
`/portal/downloads`
`/portal/support`
`/portal/settings`
`/portal/orbitfs`

### MASTER

`/admin`
`/admin/customers`
`/admin/customers/[id]`
`/admin/customers/cancellations`
`/admin/orders`
`/admin/orders/[id]`
`/admin/billing/create`
`/admin/invoices`
`/admin/invoices/[id]`
`/admin/invoices/[id]/payments`
`/admin/invoices/[id]/refund`
`/admin/invoices/[id]/notes`
`/admin/payments`
`/admin/payments/setup`
`/admin/coupons`
`/admin/licenses/release-panel`
`/admin/licenses/manage`
`/admin/licenses/manage/[id]`
`/admin/licenses/api`
`/admin/licenses/settings`
`/admin/enforcement`
`/admin/products`
`/admin/downloads`
`/admin/news`
`/admin/support`
`/admin/support/[id]`
`/admin/support/new`
`/admin/support/knowledge-base`
`/admin/support/premade-messages`
`/admin/support/settings`
`/admin/settings`
`/admin/settings/staff`
`/admin/settings/themes`
`/admin/analytics`
`/admin/audit`
`/admin/alerts`

The prototype does not need to literally reproduce every production route as a separate HTML file immediately, but the final design architecture must account for all of them.

## 21. API/service inventory

The scan also found substantial server-side API surface covering:

- Account
- Admin
- Auth
- Cron/background work
- Gifts
- Licence API v1
- Mail
- OrbitFS/release operations
- Payments
- Setup
- Support
- Wallet

The UI architecture must therefore be designed around real workflows and states, not static screenshots.

## 22. Database/control-plane signals discovered

The repository contains substantial Supabase migration history covering, among other areas:

- Orders/order items
- Invoices/invoice items/payments/refunds
- Payment gateways and payment runtime
- Licence bindings/enforcement
- Account enforcement
- Licence runtime snapshots
- Superadmin licence overrides
- Support system v2
- Support routing/departments/claims/escalation
- Guest support access codes
- Staff department/role controls
- Notification centre
- Mail cleanup/queue
- Password reset
- Alert system
- Wallet/recharge flows
- Product/catalogue configuration
- OrbitFS Studio component standardisation

This confirms the UI is sitting on a mature operational system rather than a simple storefront.

## 23. Security and audit rules

The browser must never receive billing/admin secrets or licence service tokens. Server routes call sensitive services through server-only adapters.

Administrative mutations should show:

- what is being changed
- affected customer/order/licence
- current state
- new state
- reason where required
- destructive/reversible warning
- audit result

The interface must not imply that a visual button press itself is the source of truth; the backend/database operation remains authoritative.

## 24. Visual direction

**Target:** professional, technical, operational, compact, high-information, calm.

Use:

- Strong page hierarchy
- Dense but readable tables
- Clear state pills
- Persistent context
- Detail drawers/panels where appropriate
- Useful split views
- Operational timelines
- Explicit destructive actions
- Responsive layouts
- Consistent component grammar

Avoid:

- Generic SaaS dashboard templates
- Giant KPI cards as the main interface
- Excessive whitespace
- Marketing-style gradients everywhere
- Decorative charts with no operational purpose
- Flattening every subsystem into one menu
- Hiding critical state behind excessive tabs
- Inventing functionality not present in the production system

## 25. 12ui implementation rule

This is an existing-system redesign. Use 12ui **Improve**, not a generic new-product draft.

Workflow:

1. Capture an authenticated, actually-rendered Website/Billing/Master screen.
2. Generate multiple materially different candidates.
3. Inspect the real candidate images.
4. Explicitly pick the strongest direction.
5. Expand the approved direction to the necessary Website/Admin/Portal states.
6. Apply the resulting implementation kit to **UIDesign only**.
7. Close the implementation against the approved design at relevant widths.

Do not manually approximate a 12ui candidate with unrelated CSS before the candidate has been selected.

## 26. Source scan record — 2026-09-10

The full rescan covered:

- `ARCHITECTURE.md`
- `web/src/app` route tree
- `web/src/app/admin` route tree
- `web/src/app/portal` route tree
- public/store/product/billing routes
- licence API routes
- payment routes and payment runtime
- wallet routes/runtime
- gift fulfilment
- support routes/capability definitions
- notification/mail components and migrations
- product/catalogue code
- invoice/payment/refund code
- licence components/API/runtime
- engine/panel/release bundle code
- database migrations relevant to commerce/licensing/support/account enforcement
- recent merged PR history

Recent merged work confirms that the production repository has also accumulated:

- V3A/V3C admin/customer theme system
- Notification centre deployment policy
- Outbound mail service
- OrbitFS Release Panel System/customer deployment control plane
- Azure deployment work

## 27. Repository boundary

**ONLY `lucaskerim123/UIDesign` is the destination for this UI project.**

Do not modify `lucaskerim123/OrbitFS-Website` as part of the design work.

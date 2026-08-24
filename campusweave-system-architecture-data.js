(function () {
  const technologies = [
    { id: 1, name: "React 19 · TypeScript · Vite PWA", group: "Client", color: "#b45309", purpose: "Responsive parent, school, vendor and platform-admin web applications with installable PWA delivery." },
    { id: 2, name: "Amazon Route 53 · CloudFront · S3", group: "Edge", color: "#9a3412", purpose: "DNS, CDN and versioned static frontend hosting with instant web releases." },
    { id: 3, name: "AWS WAF · Application Load Balancer", group: "Edge", color: "#c2410c", purpose: "TLS termination, request filtering, rate controls and healthy API routing." },
    { id: 4, name: "Amazon Cognito · OIDC/OAuth 2.1", group: "Identity", color: "#7c3aed", purpose: "Parent OTP/social sign-in, school workforce identity and standards-based tokens." },
    { id: 5, name: "Amazon ECS Fargate · ECR", group: "Compute", color: "#2563eb", purpose: "Portable OCI containers without Kubernetes operations for the initial scale." },
    { id: 6, name: "Java 25 LTS · Spring Boot 4", group: "Application", color: "#1d4ed8", purpose: "One deployable modular monolith with domain boundaries and extraction paths." },
    { id: 7, name: "Spring Security · OpenAPI 3.1", group: "Application", color: "#0369a1", purpose: "Tenant-aware authorization, validated contracts and generated client interfaces." },
    { id: 8, name: "Amazon RDS PostgreSQL · PostGIS · pgvector", group: "Data", color: "#047857", purpose: "Transactional system of record, five-kilometre geo-search and governed vector retrieval." },
    { id: 9, name: "Amazon ElastiCache for Redis", group: "Data", color: "#0f766e", purpose: "Short-lived cache, rate limits and idempotency acceleration; never the system of record." },
    { id: 10, name: "Amazon SQS · EventBridge Scheduler", group: "Async", color: "#0e7490", purpose: "Durable jobs, retries, dead letters, reminders and scheduled follow-ups." },
    { id: 11, name: "Amazon S3 · KMS · presigned transfer", group: "Documents", color: "#15803d", purpose: "Private documents, encrypted object versions and time-limited upload/download." },
    { id: 12, name: "SES · Web Push · Meta WhatsApp · MSG91", group: "Communication", color: "#be185d", purpose: "Email, browser/mobile push, WhatsApp and India SMS delivery behind adapters." },
    { id: 13, name: "Razorpay · bank/EMI adapters", group: "Payments", color: "#a21caf", purpose: "Hosted checkout, signed callbacks, refunds, reconciliation and optional EMI routing." },
    { id: 14, name: "Gemini API · provider-neutral AI gateway", group: "AI", color: "#6d28d9", purpose: "Context-aware assistance and document extraction proposals without direct data writes." },
    { id: 15, name: "Google Maps Platform", group: "Location", color: "#0f766e", purpose: "Address geocoding and map display; PostGIS remains authoritative for radius filtering." },
    { id: 16, name: "OpenTelemetry · CloudWatch", group: "Operations", color: "#475569", purpose: "Traces, logs, metrics, alerts, SLO evidence and incident investigation." },
    { id: 17, name: "GitHub Actions · Terraform", group: "Delivery", color: "#334155", purpose: "Tested builds, environment promotion and reproducible AWS infrastructure." },
    { id: 18, name: "AWS Secrets Manager · KMS · CloudTrail", group: "Security", color: "#991b1b", purpose: "Credential rotation, encryption keys and infrastructure access evidence." }
  ];

  const masterLayers = [
    { title: "Experience channels", caption: "Installable web experiences; no business authority in the browser.", nodes: [
      { title: "Public discovery", text: "School search, comparison, reviews and appointment entry.", tech: [1] },
      { title: "Parent PWA", text: "Family, children, appointments, admissions, academics, purchases and AI.", tech: [1] },
      { title: "School PWA", text: "Campus operations, counsellors, admissions, academics, finance and reporting.", tech: [1] },
      { title: "Vendor & platform admin", text: "Assigned fulfilment plus tenant, capability and provider administration.", tech: [1] }
    ]},
    { title: "Edge, identity and API ingress", caption: "One protected entry path establishes actor, tenant, campus and request context.", nodes: [
      { title: "DNS, CDN & static release", text: "Globally cached, immutable frontend assets with safe rollback.", tech: [2] },
      { title: "Web application firewall", text: "TLS, bot/rate rules and load-balanced API routing.", tech: [3] },
      { title: "Identity provider", text: "Parent OTP/social identity and school workforce OIDC.", tech: [4] },
      { title: "API contract & policy", text: "Versioned contracts, token validation and tenant-scoped authorization.", tech: [7] }
    ]},
    { title: "CampusWeave application runtime", caption: "A modular monolith first—not a premature microservice estate.", nodes: [
      { title: "Spring application", text: "Portable container, independently scalable from all frontend releases.", tech: [5, 6] },
      { title: "Directory & family", text: "Schools, campuses, search projections, parents, children, relationships and consent.", tech: [6, 8, 15] },
      { title: "Appointments & admissions", text: "Booking, QR enquiry, follow-up, application, payment evidence and admission gates.", tech: [6, 8, 10] },
      { title: "Academics & services", text: "Attendance, assessments, activities, transport, food and school configuration.", tech: [6, 8] },
      { title: "Commerce & billing", text: "Eligibility, catalogues, orders, fees, checkout, payment and vendor fulfilment.", tech: [6, 8, 13] },
      { title: "Communication, documents & AI", text: "Durable notifications, private evidence and approval-bound AI proposals.", tech: [10, 11, 12, 14] }
    ]},
    { title: "Data and asynchronous runtime", caption: "Canonical transactions commit before external work is attempted.", nodes: [
      { title: "Relational system of record", text: "Tenant keys, constraints, PostGIS search, pgvector retrieval, outbox and audit.", tech: [8] },
      { title: "Ephemeral acceleration", text: "Cache, session hints and rate/idempotency keys with bounded lifetime.", tech: [9] },
      { title: "Queues & schedules", text: "Retry-safe notifications, scans, reconciliation, indexing and reminders.", tech: [10] },
      { title: "Encrypted object evidence", text: "Private documents and exports with purpose-bound signed transfer.", tech: [11, 18] }
    ]},
    { title: "Providers and operations", caption: "Every external system sits behind a replaceable, observable adapter.", nodes: [
      { title: "Communication providers", text: "Channel policy selects Web Push, email, WhatsApp or SMS.", tech: [12] },
      { title: "Payments & banking", text: "Signed webhooks and reconciliation; provider status never directly admits a child.", tech: [13] },
      { title: "Maps & AI", text: "Geocoding plus context-scoped guidance and extraction proposals.", tech: [14, 15] },
      { title: "Delivery, security & telemetry", text: "Infrastructure as code, progressive deployment, secrets, audit and observability.", tech: [16, 17, 18] }
    ]}
  ];

  const flows = {
    discovery: {
      title: "School discovery and appointment flow", short: "Discovery → appointment", summary: "A parent provides exactly one origin; PostGIS enforces the five-kilometre boundary before OTP registration and appointment creation.",
      file: "campusweave-flow-discovery-appointment.html", image: "campusweave-flow-discovery-appointment.png", actors: "Parent · Public portal · School appointment team", tech: [1,2,3,4,5,6,7,8,9,10,12,15,16],
      stages: [
        { lane: "Client", title: "Search and compare", text: "Address, pincode or consented browser location; syllabus, school type and recent-review filters.", tech: [1,2,15] },
        { lane: "API", title: "Normalize request", text: "WAF and Spring validate one origin, resolve coordinates and attach correlation context.", tech: [3,6,7,15] },
        { lane: "Domain", title: "Find eligible campuses", text: "PostGIS radius query applies ≤5 km, nearest-first order and campus availability.", tech: [6,8,9] },
        { lane: "Identity", title: "Verify parent", text: "Cognito phone OTP creates or links the parent identity before booking.", tech: [4,7] },
        { lane: "Domain", title: "Book appointment", text: "Appointment and contact snapshot commit with an outbox event in one transaction.", tech: [6,8] },
        { lane: "Async", title: "Notify both parties", text: "Queue workers deliver confirmations and reminders; school inbox reads the canonical booking.", tech: [10,12,16] }
      ], decisions: ["Geocoder accuracy and fallback policy", "Review-source provenance and ranking policy", "Appointment slot ownership and cancellation SLA"]
    },
    admissions: {
      title: "Enquiry-to-admission flow", short: "Enquiry → admission", summary: "Source-attributed QR enquiries progress through counsellor, application, payment and admission gates without forcing parents to re-enter captured data.",
      file: "campusweave-flow-admissions.html", image: "campusweave-flow-admissions.png", actors: "Parent · Counsellor · School admissions · Finance", tech: [1,2,3,4,5,6,7,8,10,11,12,13,16,18],
      stages: [
        { lane: "Entry", title: "Open attributed QR link", text: "Campaign and location codes identify WhatsApp, email, Facebook, advertisement or counsellor walk-in.", tech: [1,2,3] },
        { lane: "Domain", title: "Create enquiry", text: "Family and child matching proposes possible duplicates; counsellors decide merge or closure.", tech: [6,7,8] },
        { lane: "Workflow", title: "Counsellor follow-up", text: "Owner, outcome, failure reason and next-follow-up schedule remain auditable.", tech: [6,8,10,12] },
        { lane: "Workflow", title: "Create application", text: "Existing details prefill a versioned application; class rules control fields such as previous school.", tech: [1,6,8] },
        { lane: "Evidence", title: "Upload and pay", text: "Private documents use signed S3 transfer; Razorpay callback is verified and reconciled.", tech: [11,13,18] },
        { lane: "Gate", title: "Admit student", text: "Admission requires linked enquiry/application, verified prerequisites and authorized school action.", tech: [6,7,8,10,12,16] }
      ], decisions: ["School-configurable admission prerequisites", "Duplicate merge authority and recovery", "Application numbering and financial reconciliation ownership"]
    },
    academics: {
      title: "Academics and parent visibility flow", short: "Academics", summary: "School staff publish tenant-, campus-, child- and term-scoped academic records; parents can only read information for verified relationships.",
      file: "campusweave-flow-academics.html", image: "campusweave-flow-academics.png", actors: "Teacher · Centre head · Parent", tech: [1,2,3,4,5,6,7,8,10,12,16],
      stages: [
        { lane: "Identity", title: "Establish role and context", text: "Cognito authenticates; Spring resolves tenant, campus, class, child and academic year.", tech: [1,4,7] },
        { lane: "School", title: "Record academic activity", text: "Attendance, assessment, timetable, announcements and activities enter draft state.", tech: [1,6,8] },
        { lane: "Domain", title: "Validate and publish", text: "Module rules enforce class/term ownership and retain corrections with provenance.", tech: [6,7,8] },
        { lane: "Async", title: "Project and notify", text: "Outbox events refresh parent read models and enqueue policy-based communication.", tech: [8,10,12] },
        { lane: "Parent", title: "Read child record", text: "Explicit child and school context prevents sibling or cross-school leakage.", tech: [1,6,7,8] },
        { lane: "Operations", title: "Audit correction", text: "Actor, before/after state and correlation trail remain available for investigation.", tech: [8,16] }
      ], decisions: ["Assessment model and grading configuration", "Teacher/course/class assignment source", "Correction, acknowledgement and dispute workflow"]
    },
    commerce: {
      title: "Commerce and vendor fulfilment flow", short: "Commerce → vendor", summary: "A child’s school and enrolment determine catalogue eligibility; paid orders split into least-privilege vendor fulfilments.",
      file: "campusweave-flow-commerce-vendors.html", image: "campusweave-flow-commerce-vendors.png", actors: "Parent · School commerce · Vendor", tech: [1,2,3,4,5,6,7,8,10,12,13,16],
      stages: [
        { lane: "School", title: "Publish eligible catalogue", text: "Books, clothing, accessories, transport, food and activities are versioned by school and term.", tech: [1,6,8] },
        { lane: "Parent", title: "Select child and items", text: "Server resolves enrolment eligibility, current prices, variants and service constraints.", tech: [1,4,6,7,8] },
        { lane: "Checkout", title: "Create authoritative order", text: "Spring calculates totals and commits order, payable charges and outbox atomically.", tech: [6,8] },
        { lane: "Payment", title: "Collect and verify", text: "Hosted Razorpay flow returns a signed callback; reconciliation confirms the financial state.", tech: [13,6,8] },
        { lane: "Async", title: "Assign fulfilment", text: "Queue consumer creates vendor-scoped work only for items assigned to that vendor.", tech: [10,6,8] },
        { lane: "Vendor", title: "Update fulfilment", text: "Status events update the parent and school while preserving order history.", tech: [1,7,8,10,12,16] }
      ], decisions: ["Inventory, invoicing and tax ownership", "Returns, substitutions and partial fulfilment", "Vendor settlement and service-level policy"]
    },
    payments: {
      title: "Fees, payment and EMI flow", short: "Payments & EMI", summary: "The server owns every payable amount. Signed provider callbacks update payment attempts, while separate business gates decide admission or fulfilment.",
      file: "campusweave-flow-payments-emi.html", image: "campusweave-flow-payments-emi.png", actors: "Parent · School finance · Razorpay/bank/EMI provider", tech: [1,3,4,5,6,7,8,10,12,13,16,18],
      stages: [
        { lane: "Client", title: "Request checkout", text: "Parent selects eligible fees, services or order items; displayed totals are never authoritative.", tech: [1,4] },
        { lane: "Billing", title: "Price on server", text: "Billing resolves fee plans, discounts, immediate-payment rules and school-enabled EMI.", tech: [6,7,8] },
        { lane: "Provider", title: "Create payment intent", text: "Adapter sends an idempotent hosted-checkout request without exposing provider secrets.", tech: [13,18] },
        { lane: "Webhook", title: "Verify callback", text: "WAF/API validates signature, amount, currency, external reference and dedupe key.", tech: [3,6,7,13] },
        { lane: "Ledger", title: "Commit outcome", text: "Payment attempt, settlement state and outbox event commit transactionally.", tech: [8,6] },
        { lane: "Async", title: "Reconcile and communicate", text: "Workers handle delayed settlement, exceptions, refunds and receipts.", tech: [10,12,13,16] }
      ], decisions: ["Gateway, bank and EMI provider contracts", "Ledger/accounting system boundary", "Refund, dispute and settlement ownership"]
    },
    communications: {
      title: "Notification and document flow", short: "Notifications & documents", summary: "Domain transactions emit durable work; private documents and paid communication channels remain purpose-, consent- and tenant-scoped.",
      file: "campusweave-flow-notifications-documents.html", image: "campusweave-flow-notifications-documents.png", actors: "Parent · School · Background workers · Channel providers", tech: [1,3,5,6,7,8,10,11,12,14,16,18],
      stages: [
        { lane: "Domain", title: "Commit state and outbox", text: "Appointment, follow-up, admission, academic or commerce event commits with its business record.", tech: [6,8] },
        { lane: "Queue", title: "Claim durable work", text: "SQS retries with bounded backoff and moves poison messages to a dead-letter queue.", tech: [10,16] },
        { lane: "Policy", title: "Choose channel", text: "Consent, template approval, school policy, quiet hours and paid-channel rules are evaluated.", tech: [6,7,8] },
        { lane: "Delivery", title: "Send and audit", text: "Web Push, SES, WhatsApp or MSG91 response is recorded without treating delivery as business completion.", tech: [12,16] },
        { lane: "Documents", title: "Transfer private evidence", text: "Authorized presigned S3 upload/download uses KMS encryption, version metadata and scan status.", tech: [11,18] },
        { lane: "Extraction", title: "Propose extracted fields", text: "Gemini produces evidence-linked suggestions; a person approves before canonical data changes.", tech: [14,6,8,16] }
      ], decisions: ["Message-provider contracts and India DLT compliance", "Retention and legal hold per document type", "Malware scanning and extraction quality thresholds"]
    },
    ai: {
      title: "Context-aware AI and analytics flow", short: "AI & analytics", summary: "The assistant receives a deterministic tenant, role, child, school and screen context; retrieval is permission-filtered and writes require review.",
      file: "campusweave-flow-ai-analytics.html", image: "campusweave-flow-ai-analytics.png", actors: "Parent · School staff · CampusWeave data/AI team", tech: [1,3,4,5,6,7,8,10,11,14,16,18],
      stages: [
        { lane: "Client", title: "Ask in current context", text: "PWA sends the selected child, school, section and user question—not an unrestricted data dump.", tech: [1,4] },
        { lane: "Policy", title: "Authorize context envelope", text: "Spring Security resolves purpose and allowed records before retrieval.", tech: [6,7,8] },
        { lane: "Retrieval", title: "Find governed evidence", text: "PostgreSQL/pgvector returns tenant-filtered structured facts and permitted document excerpts.", tech: [8,11] },
        { lane: "AI gateway", title: "Generate answer or proposal", text: "Provider-neutral gateway calls Gemini with redaction, limits and trace metadata.", tech: [14,18] },
        { lane: "Review", title: "Validate before action", text: "Deterministic validators and explicit user approval protect every durable write.", tech: [6,7,8] },
        { lane: "Evaluation", title: "Measure safety and quality", text: "Evidence use, cost, latency, hallucination and hard safety failures are evaluated separately.", tech: [10,16] }
      ], decisions: ["Model routing and data-processing agreement", "Evaluation datasets and hard safety thresholds", "Which proposed actions require school versus parent approval"]
    },
    platform: {
      title: "Platform security, delivery and recovery flow", short: "Platform & security", summary: "Tenant isolation, immutable delivery, observability and rehearsed recovery surround every business flow rather than being added after launch.",
      file: "campusweave-flow-platform-security.html", image: "campusweave-flow-platform-security.png", actors: "CampusWeave platform admin · Engineering · Security operations", tech: [2,3,4,5,6,7,8,9,10,11,16,17,18],
      stages: [
        { lane: "Delivery", title: "Build and promote", text: "GitHub Actions runs tests, builds signed frontend/container artifacts and applies reviewed Terraform.", tech: [17,5] },
        { lane: "Edge", title: "Protect ingress", text: "Route 53, CloudFront, WAF and ALB provide TLS, rate rules, health checks and controlled routing.", tech: [2,3] },
        { lane: "Identity", title: "Enforce tenant boundary", text: "Token identity is combined with server-resolved membership, role, campus and capability policy.", tech: [4,7] },
        { lane: "Runtime", title: "Run and scale application", text: "Fargate scales stateless Spring tasks; Redis and SQS remove avoidable synchronous pressure.", tech: [5,6,9,10] },
        { lane: "Evidence", title: "Observe and audit", text: "OpenTelemetry correlates request, domain event and provider call; CloudTrail records AWS access.", tech: [16,18] },
        { lane: "Recovery", title: "Restore and verify", text: "RDS point-in-time recovery, S3 versions and infrastructure code support rehearsed RPO/RTO tests.", tech: [8,11,17,18] }
      ], decisions: ["Approved availability, RPO and RTO targets", "Production account and environment isolation", "Security audit, incident SLA and disaster-recovery cadence"]
    }
  };

  window.CW_SYSTEM_ARCHITECTURE = { version: "1.0", selectedAt: "24 August 2026", technologies, masterLayers, flows };
}());

(function () {
  const areas = [
    {
      id: "public-discovery", title: "Public discovery portal", layer: "Experience", owner: "CampusWeave product",
      paths: ["parent", "platform"], icon: "⌕", summary: "Unauthenticated school and campus discovery with one-location search, five-kilometre results, review signals and comparison entry points.",
      steps: ["Accept one location", "Resolve coordinates", "Search within 5 km", "Sort nearest first", "Apply school filters", "Open campus or comparison"],
      responsibilities: ["Address, pincode or explicit browser-location entry", "Toddler, syllabus, school type, review and recent-review filters", "Campus-specific result cards and comparison selection", "Clear distinction between school claims, verified facts and parent reviews"],
      records: ["Anonymous search session", "Normalized search origin", "Campus search result", "Comparison selection"],
      interfaces: ["Geocoding adapter", "Directory and geo-search API", "Review aggregate API", "Appointment availability API"],
      controls: ["Never accept typed and browser locations simultaneously", "Do not persist precise location without consent", "Stable distance ordering and five-kilometre hard boundary", "Rate-limit automated scraping and abusive searches"],
      events: ["SearchPerformed", "CampusViewed", "ComparisonStarted", "AppointmentIntentStarted"],
      decisions: ["Geocoding provider and accuracy SLA", "Anonymous analytics consent", "Review ranking policy and sponsored-result rules"]
    },
    {
      id: "parent-experience", title: "Parent application", layer: "Experience", owner: "Family product team",
      paths: ["parent", "commerce"], icon: "♙", summary: "Authenticated family workspace spanning children, appointments, applications, admissions, academics, purchases, payments and notifications.",
      steps: ["Register or sign in", "Select child", "Select school context", "Complete task", "Review consent or payment", "Track outcome"],
      responsibilities: ["One parent profile with multiple children", "Different schools and enrolments per child", "Context-aware navigation and AI assistance", "Appointment, admission, academic and commerce journeys", "Document upload/download and notification inbox"],
      records: ["Parent profile", "Child profile", "Parent-child relationship", "School access grant", "Session preference"],
      interfaces: ["Identity/access API", "Family API", "Admissions API", "Academics API", "Commerce and billing APIs", "Notification inbox"],
      controls: ["Selected child and selected school are explicit context", "No cross-child or cross-school data leakage", "Sensitive changes require re-authentication or confirmation", "AI proposals never bypass deterministic permissions"],
      events: ["ChildContextSelected", "ConsentGranted", "ParentTaskCompleted", "ParentSupportRequested"],
      decisions: ["Account recovery policy", "Child relationship verification", "Shared custody and delegated guardian rules"]
    },
    {
      id: "school-experience", title: "School and centre dashboard", layer: "Experience", owner: "School operations product",
      paths: ["school", "platform"], icon: "▦", summary: "Tenant-scoped workspace for appointments, counselling, admissions, academics, finance, services and operational reporting.",
      steps: ["Authenticate staff", "Resolve school and campus", "Load role workspace", "Process assigned queue", "Approve exception", "Audit outcome"],
      responsibilities: ["Appointment inbox and counsellor assignment", "Enquiry-to-admission operations", "Academic and activity management", "Fee, order and vendor exception handling", "Centre and school reporting"],
      records: ["Staff identity", "Tenant membership", "Role assignment", "Campus assignment", "Work queue preference"],
      interfaces: ["Authorization API", "Appointment API", "Admissions API", "Academic API", "Billing and fulfilment APIs", "Analytics API"],
      controls: ["School and campus scope on every request", "Role-specific field and action permissions", "Maker-checker approval for sensitive finance/configuration changes", "Immutable audit for overrides"],
      events: ["WorkAssigned", "AppointmentConfirmed", "AdmissionApproved", "ExceptionEscalated"],
      decisions: ["Role matrix and approval thresholds", "Cross-campus access policy", "School-configurable workflow boundaries"]
    },
    {
      id: "platform-control", title: "CampusWeave control plane", layer: "Experience", owner: "CampusWeave operations",
      paths: ["platform"], icon: "◆", summary: "Platform-only administration for schools, campuses, capabilities, platform roles, provider configuration and operational governance.",
      steps: ["Create school tenant", "Create campuses", "Provision school admin", "Enable capabilities", "Configure provider boundary", "Monitor tenant health"],
      responsibilities: ["School and campus lifecycle", "Capability entitlements", "Source links and QR issuance", "Platform moderation and provider setup", "Cross-tenant operational health without routine record access"],
      records: ["School tenant", "Campus", "Capability entitlement", "Platform administrator", "Provider configuration reference"],
      interfaces: ["Tenant provisioning API", "Identity administration adapter", "QR/source service", "Operations dashboard", "Audit export"],
      controls: ["Separate control-plane roles from school roles", "No routine family-record browsing", "Dual approval for tenant deletion or provider-secret rotation", "Recoverable configuration history"],
      events: ["TenantProvisioned", "CapabilityChanged", "SchoolAdminInvited", "ProviderConfigRotated"],
      decisions: ["Support impersonation policy", "Tenant suspension and export procedure", "Capability billing model"]
    },
    {
      id: "vendor-experience", title: "Vendor fulfilment surface", layer: "Experience", owner: "Commerce operations",
      paths: ["commerce", "school"], icon: "◇", summary: "Minimal vendor portal or API for assigned books, clothing, accessories, food, transport and activity orders.",
      steps: ["Authenticate vendor", "Load assigned items", "Accept or reject fulfilment", "Update status", "Attach delivery evidence", "Close or escalate"],
      responsibilities: ["Assigned-order visibility", "Availability acknowledgement", "Fulfilment and delivery status", "Exception communication", "Settlement reference visibility when permitted"],
      records: ["Vendor", "Vendor user", "Vendor assignment", "Fulfilment", "Delivery evidence"],
      interfaces: ["Vendor API or portal", "Order API", "Notification API", "Settlement export"],
      controls: ["No student academic or unrelated family access", "Minimum contact disclosure", "Vendor-specific row scope", "Attachment malware scanning and retention policy"],
      events: ["FulfilmentAccepted", "FulfilmentStatusChanged", "DeliveryCompleted", "VendorExceptionRaised"],
      decisions: ["Portal, API, email or batch integration", "Inventory ownership", "Returns and replacement responsibility"]
    },
    {
      id: "edge-security", title: "API edge and session boundary", layer: "Access and policy", owner: "Platform engineering",
      paths: ["parent", "school", "commerce", "platform"], icon: "⛨", summary: "Single controlled entry boundary for sessions, request validation, rate limits, correlation, versioning and routing.",
      steps: ["Terminate secure connection", "Validate request shape", "Resolve session", "Apply rate limit", "Attach correlation context", "Route to domain"],
      responsibilities: ["API version and contract enforcement", "Session/cookie/token validation", "Request size and abuse controls", "Correlation IDs and safe error envelopes", "Routing without domain business rules"],
      records: ["Session reference", "Rate-limit key", "Idempotency key", "Correlation ID"],
      interfaces: ["Identity service", "Authorization policy", "All domain APIs", "Observability pipeline"],
      controls: ["No provider secrets in browsers", "Explicit CORS and CSRF policy", "Bounded uploads and timeouts", "Deny malformed or replayed requests"],
      events: ["RequestRejected", "RateLimitExceeded", "SessionRevoked", "ContractVersionObserved"],
      decisions: ["Session versus token model", "Public/private API split", "API lifecycle and compatibility policy"]
    },
    {
      id: "identity-access", title: "Identity, OTP and authorization", layer: "Access and policy", owner: "Security and identity",
      paths: ["parent", "school", "commerce", "platform"], icon: "◎", summary: "Provider-neutral authentication with CampusWeave-owned users, relationships, tenant memberships, roles and consent evidence.",
      steps: ["Create challenge", "Send OTP or redirect", "Verify provider response", "Resolve internal identity", "Resolve tenant and role", "Issue scoped session"],
      responsibilities: ["Parent mobile OTP registration", "School staff authentication", "Vendor and platform-admin authentication", "Role and tenant authorization", "Recovery, revocation and consent evidence"],
      records: ["User", "External identity", "Identity challenge", "Tenant membership", "Role grant", "Consent"],
      interfaces: ["OTP provider adapter", "OIDC/OAuth provider adapter", "Policy engine", "Audit service"],
      controls: ["OTP expiry, attempt limit and resend throttling", "Provider verifies identity; CampusWeave assigns roles", "Step-up authentication for sensitive operations", "Fail closed when tenant or child context is ambiguous"],
      events: ["OTPRequested", "IdentityVerified", "RoleGranted", "SessionRevoked", "RecoveryCompleted"],
      decisions: ["OTP and school identity providers", "MFA requirements by role", "Account linking and recovery evidence"]
    },
    {
      id: "directory-comparison", title: "Directory, reviews and comparison", layer: "Business domains", owner: "Discovery domain",
      paths: ["parent", "platform"], icon: "⌖", summary: "Canonical school/campus facts, geo-search, review aggregates, freshness, filters and side-by-side comparison.",
      steps: ["Load verified campus facts", "Resolve geo candidates", "Attach review aggregates", "Apply dynamic filters", "Rank nearest first", "Build comparison projection"],
      responsibilities: ["School/campus profile and syllabus", "Fees, ratios, class strength, transport and facilities", "Review provenance, moderation and recency", "Five-kilometre geo query", "Up-to-three-campus comparison"],
      records: ["School", "Campus", "Campus location", "Syllabus", "School claim", "Fee structure", "Facility", "Review", "Review aggregate"],
      interfaces: ["Geo-search index", "Review source/moderation adapter", "School profile administration", "Public discovery projection"],
      controls: ["Every fact carries source, owner and last verification", "Do not rank a one-review sample as reliable", "Sponsored placement cannot masquerade as organic ranking", "Campus facts never inherit blindly from school level"],
      events: ["CampusProfilePublished", "ClaimExpired", "ReviewModerated", "ReviewAggregateChanged"],
      decisions: ["Review source and ranking formula", "Fact verification SLA", "Comparison field governance"]
    },
    {
      id: "appointments", title: "Appointments and visit scheduling", layer: "Business domains", owner: "Appointment domain",
      paths: ["parent", "school"], icon: "□", summary: "OTP-gated parent appointment requests, campus slot policy, school work queues, status history and reminders.",
      steps: ["Select campus", "Capture parent and child details", "Verify mobile OTP", "Check slot policy", "Create idempotent request", "Notify campus and parent"],
      responsibilities: ["Appointment slots and campus policy", "Parent/child intake", "Requested, confirmed, rescheduled, completed, cancelled and no-show states", "Counsellor assignment", "Reminder and outcome capture"],
      records: ["Appointment slot", "Appointment", "Appointment participant", "Appointment event", "Assignment"],
      interfaces: ["Identity/OTP", "Campus directory", "Family service", "Notification service", "School appointment inbox"],
      controls: ["Verified mobile required before submission", "One idempotency key per booking attempt", "Prevent overbooking under concurrency", "Timezone and reschedule rules are explicit"],
      events: ["AppointmentRequested", "AppointmentConfirmed", "AppointmentRescheduled", "AppointmentCompleted", "AppointmentNoShow"],
      decisions: ["Instant confirmation versus school approval", "Slot capacity and waitlist", "Cancellation/no-show policy"]
    },
    {
      id: "family-child", title: "Family and child identity", layer: "Business domains", owner: "Family domain",
      paths: ["parent", "school"], icon: "♧", summary: "Stable child identity, parent/guardian relationships, contact points, enrolment history and purpose-bound school access.",
      steps: ["Create parent", "Create or match child", "Verify relationship", "Create purpose context", "Grant minimum school access", "Retain history"],
      responsibilities: ["Multiple children per parent", "Different schools per child", "Reusable contacts and addresses", "Duplicate-child candidate detection", "School-change disclosure grants and provenance"],
      records: ["Parent", "Child", "Parent-child relationship", "Contact", "Address", "Enrolment", "School access grant", "Disclosure packet"],
      interfaces: ["Identity service", "Appointments", "Admissions", "Documents", "School-transfer workflow"],
      controls: ["Phone/email are contact points, not child identifiers", "School sees only active purpose/enrolment/disclosure scope", "Duplicate merge needs review", "Relationship changes are audited"],
      events: ["ChildCreated", "RelationshipVerified", "PossibleDuplicateDetected", "SchoolAccessGranted", "DisclosureRevoked"],
      decisions: ["Relationship proof", "Shared/delegated guardianship", "Cross-school transfer scope and expiry"]
    },
    {
      id: "admissions", title: "Enquiry-to-admission pipeline", layer: "Business domains", owner: "Admissions domain",
      paths: ["parent", "school"], icon: "→", summary: "Traceable source-to-enrolment workflow covering QR enquiry, qualification, follow-up, application, payment evidence and admission.",
      steps: ["Capture enquiry", "Qualify and deduplicate", "Schedule follow-up", "Convert to application", "Verify application payment", "Admit and place in batch"],
      responsibilities: ["Source-specific QR and attribution", "Enquiry CRUD and duplicate closure", "Counsellor follow-ups and non-conversion reasons", "Application data continuity", "Admission gate, numbering and capacity"],
      records: ["Enquiry source", "Enquiry", "Follow-up", "Application", "Application payment evidence", "Batch", "Admission"],
      interfaces: ["Family service", "Appointment conversion", "Document service", "Billing/payment reconciliation", "Notification service"],
      controls: ["No direct admission without enquiry/application", "Concurrency-safe numbers and last-seat allocation", "Source attribution survives every stage", "Duplicate callbacks and conversions are idempotent"],
      events: ["EnquiryCaptured", "FollowUpDue", "ApplicationCreated", "ApplicationPaymentVerified", "StudentAdmitted", "EnquiryLost"],
      decisions: ["Numbering schemes", "Capacity/waitlist rules", "Mandatory documents and previous-school applicability"]
    },
    {
      id: "academics-activities", title: "Academics and activities", layer: "Business domains", owner: "Academic domain",
      paths: ["parent", "school", "commerce"], icon: "✦", summary: "Future post-admission capability for attendance, academics, timetable, performance, activities and parent-centre communication.",
      steps: ["Resolve active enrolment", "Authorize teacher/class", "Record academic event", "Review or approve", "Publish parent projection", "Notify relevant family"],
      responsibilities: ["Attendance and timetable", "Academic progress and performance", "Extracurricular, sports, coaching and cultural activities", "Teacher/class assignments", "Parent-visible summaries"],
      records: ["Academic year", "Class", "Section", "Teacher assignment", "Attendance", "Assessment", "Activity enrolment", "Progress record"],
      interfaces: ["Family/enrolment", "School roles", "Notification service", "Commerce for activity accessories", "Analytics"],
      controls: ["Only active enrolments participate", "Teacher access is class/subject scoped", "Published versus draft state", "Corrections retain provenance"],
      events: ["AttendancePublished", "AssessmentPublished", "ActivityOffered", "ActivityEnrolled", "AcademicCorrectionRequested"],
      decisions: ["Assessment model", "Attendance correction workflow", "School-configurable academic structures"]
    },
    {
      id: "commerce-fulfilment", title: "Commerce and vendor fulfilment", layer: "Business domains", owner: "Commerce domain",
      paths: ["parent", "school", "commerce"], icon: "▣", summary: "School-approved catalogues and service opt-ins for books, clothing, accessories, transport, food and activities, routed to assigned vendors.",
      steps: ["Publish school catalogue", "Select child and eligible items", "Build versioned cart", "Checkout", "Split vendor fulfilments", "Track delivery or service activation"],
      responsibilities: ["School/catalogue eligibility", "Products, variants and service options", "Child-specific cart and order", "Vendor assignment and fulfilment", "Returns, replacement and service status"],
      records: ["Catalogue", "Product", "Variant", "Service option", "Cart", "Order", "Order item", "Vendor assignment", "Fulfilment"],
      interfaces: ["Family/enrolment eligibility", "Billing/payment", "Vendor portal/API", "Notifications", "School administration"],
      controls: ["Server owns catalogue price/version", "Vendor sees assigned items only", "Accessories require immediate payment when configured", "Order changes create auditable adjustments"],
      events: ["CataloguePublished", "OrderSubmitted", "FulfilmentAssigned", "FulfilmentCompleted", "ReturnRequested"],
      decisions: ["Inventory ownership", "Tax/invoice responsibility", "Returns and partial fulfilment policy"]
    },
    {
      id: "billing-payments", title: "Fees, checkout, payment and EMI", layer: "Business domains", owner: "Billing domain",
      paths: ["parent", "school", "commerce"], icon: "₹", summary: "Server-priced fee and order checkout, gateway/bank integration, school-enabled EMI, reconciliation, refunds and financial audit.",
      steps: ["Resolve payable items", "Calculate authoritative total", "Apply immediate/EMI rule", "Create payment intent", "Verify signed provider callback", "Reconcile and publish outcome"],
      responsibilities: ["Fee plans and service charges", "Payment intents and attempts", "Razorpay/bank/provider adapters", "EMI offers when enabled", "Settlement, refund, dispute and reconciliation"],
      records: ["Fee plan", "Charge", "Payment intent", "Payment attempt", "Payment", "Settlement", "Refund", "Dispute", "EMI plan"],
      interfaces: ["Admissions", "Commerce", "Payment gateway/bank", "Finance dashboard", "Notification service"],
      controls: ["Client total never authorizes payment", "Signed callbacks, idempotency and amount/currency match", "Payment does not directly admit a child", "CampusWeave does not underwrite EMI credit"],
      events: ["PaymentIntentCreated", "PaymentAuthorized", "PaymentSettled", "PaymentFailed", "RefundCompleted", "ReconciliationExceptionRaised"],
      decisions: ["Gateway and bank", "Settlement and refund owner", "EMI provider and eligibility", "Accounting integration boundary"]
    },
    {
      id: "communications", title: "Notifications and communication", layer: "Business domains", owner: "Communication domain",
      paths: ["parent", "school", "commerce", "platform"], icon: "✉", summary: "Durable in-app, Web Push, email, WhatsApp and SMS delivery driven by domain events, consent and school policy.",
      steps: ["Receive domain event", "Write transactional outbox", "Schedule/claim job", "Evaluate policy and consent", "Render approved template", "Deliver, retry and audit"],
      responsibilities: ["In-app inbox", "Web Push subscriptions", "Email, WhatsApp and SMS adapters", "Scheduling, quiet hours and preferences", "Template, retry and delivery audit"],
      records: ["Notification event", "Template", "Preference", "Push subscription", "Delivery attempt", "Dead-letter item"],
      interfaces: ["Domain outbox", "Queue/scheduler", "Channel providers", "Deep-link router", "Operations dashboard"],
      controls: ["Minimal lock-screen PII", "Consent and template check before paid channels", "Stable dedupe keys and bounded retries", "Expired/revoked endpoints removed safely"],
      events: ["NotificationQueued", "NotificationSent", "NotificationDelivered", "NotificationClicked", "NotificationFailed"],
      decisions: ["Provider contracts and sender ownership", "Delivery SLA", "Escalation and paid-channel policy"]
    },
    {
      id: "documents", title: "Documents and evidence", layer: "Business domains", owner: "Document domain",
      paths: ["parent", "school", "platform"], icon: "▤", summary: "Private uploads, metadata, verification, extraction proposals, authorized downloads, retention and evidence provenance.",
      steps: ["Authorize upload purpose", "Validate type and size", "Store private object", "Scan/extract asynchronously", "Review metadata", "Authorize time-limited download"],
      responsibilities: ["Student/application/order document metadata", "Private object storage", "Verification and expiry", "Optional OCR/extraction proposals", "Retention, export and deletion workflows"],
      records: ["Document", "Document version", "Verification", "Extraction proposal", "Access event", "Retention rule"],
      interfaces: ["Object storage adapter", "Malware scanner", "AI extraction adapter", "Admissions/family/commerce", "Audit service"],
      controls: ["No public bucket access", "Purpose and tenant scope on every read", "Time-limited signed transfer", "Extraction never overwrites canonical data without review"],
      events: ["DocumentUploaded", "DocumentScanCompleted", "DocumentVerified", "ExtractionProposed", "DocumentAccessed"],
      decisions: ["Scanning/extraction providers", "Retention by document type", "Archival and legal-hold policy"]
    },
    {
      id: "analytics-ai", title: "Analytics and context-aware AI", layer: "Business domains", owner: "Data and AI product",
      paths: ["parent", "school", "platform"], icon: "✧", summary: "Cohort-correct operational analytics and AI guidance scoped to tenant, role, child, school and current workflow context.",
      steps: ["Consume approved events", "Build governed metrics", "Resolve user context", "Retrieve authorized evidence", "Generate guidance/proposal", "Require deterministic validation/approval"],
      responsibilities: ["Admissions funnel and source attribution", "Appointments, conversion, payments and fulfilment metrics", "Context-aware parent/school assistant", "Document extraction proposals", "Cost, quality and safety evaluation"],
      records: ["Metric definition", "Aggregate", "AI session", "Context envelope", "Retrieval evidence", "Proposal", "Evaluation result"],
      interfaces: ["Event/analytics pipeline", "Authorization service", "Search/retrieval", "AI provider adapter", "Approval surfaces"],
      controls: ["Every metric declares cohort and denominator", "AI cannot cross tenant/child/school scope", "No durable write without explicit reviewed tool action", "Prompt-injection and data-exfiltration defenses"],
      events: ["MetricMaterialized", "AIQuestionAsked", "EvidenceRetrieved", "AIProposalCreated", "AIProposalApproved"],
      decisions: ["Metric ownership", "Evaluation thresholds", "AI provider/model routing", "Human-review requirements"]
    },
    {
      id: "data-platform", title: "Transactional data platform", layer: "Data and runtime", owner: "Data engineering",
      paths: ["parent", "school", "commerce", "platform"], icon: "◫", summary: "Relational system of record, tenant isolation, migrations, backups, read models and controlled data lifecycle.",
      steps: ["Validate command", "Begin transaction", "Apply tenant/domain invariants", "Write records and outbox", "Commit atomically", "Project read model"],
      responsibilities: ["Canonical relational records", "Unique identifiers and sequences", "Tenant and campus partition keys", "Reviewed schema migrations", "Backup, restore and data lifecycle"],
      records: ["All domain aggregates", "Outbox", "Migration history", "Backup evidence", "Data-retention action"],
      interfaces: ["Domain repositories", "Read projections", "Backup/restore tooling", "Analytics export"],
      controls: ["Tenant scope is mandatory and tested", "Foreign keys and unique constraints back domain invariants", "Expand/migrate/contract changes", "Recovery is rehearsed, not assumed"],
      events: ["TransactionCommitted", "MigrationApplied", "BackupCompleted", "RestoreVerified", "RetentionActionCompleted"],
      decisions: ["Database/provider after NFR review", "Tenant isolation level", "RPO/RTO and retention"]
    },
    {
      id: "geo-search", title: "Geo-search and discovery index", layer: "Data and runtime", owner: "Discovery engineering",
      paths: ["parent", "platform"], icon: "⊕", summary: "Normalized campus coordinates and search projections supporting accurate radius queries, filters and nearest-first ordering.",
      steps: ["Geocode campus/address", "Validate confidence", "Store normalized coordinate", "Build search projection", "Run radius query", "Return distance and freshness"],
      responsibilities: ["Campus coordinates", "Geocoding confidence and provenance", "Five-kilometre radius query", "Distance calculation", "Filterable search projection"],
      records: ["Geocode result", "Campus coordinate", "Search document/projection", "Index version"],
      interfaces: ["Maps/geocoding adapter", "Directory data", "Public search API", "Index rebuild job"],
      controls: ["One origin per query", "Reject low-confidence geocodes for publication", "Coordinate/version audit", "Index lag and fallback behavior are visible"],
      events: ["CampusGeocoded", "GeoConfidenceRejected", "SearchProjectionUpdated", "SearchIndexRebuilt"],
      decisions: ["Geospatial engine", "Geocoding provider", "Index freshness SLA and fallback"]
    },
    {
      id: "event-jobs", title: "Events, queues and scheduled jobs", layer: "Data and runtime", owner: "Platform engineering",
      paths: ["parent", "school", "commerce", "platform"], icon: "↻", summary: "Transactional event hand-off, durable asynchronous work, retries, schedules, deduplication and dead-letter operations.",
      steps: ["Write outbox in domain transaction", "Publish idempotently", "Claim work atomically", "Execute bounded task", "Record attempt", "Retry or dead-letter"],
      responsibilities: ["Outbox publication", "Queues and schedulers", "Idempotent consumers", "Retry and backoff", "Dead-letter inspection and replay"],
      records: ["Outbox event", "Queue message", "Scheduled job", "Job attempt", "Dead-letter item"],
      interfaces: ["All domain publishers", "Notification workers", "Document workers", "Payment reconciliation", "Analytics consumers"],
      controls: ["Stable event IDs and consumer dedupe", "Lease/visibility timeout", "Poison messages do not block queues", "Replay is permissioned and audited"],
      events: ["OutboxPublished", "JobClaimed", "JobSucceeded", "JobRetryScheduled", "JobDeadLettered"],
      decisions: ["Queue/scheduler provider", "Ordering requirements", "Replay ownership and retention"]
    },
    {
      id: "audit-observability", title: "Audit, security and observability", layer: "Data and runtime", owner: "Security and operations",
      paths: ["school", "commerce", "platform"], icon: "◉", summary: "Immutable business audit, operational telemetry, security evidence, alerts, traces and incident response.",
      steps: ["Attach actor and correlation", "Record business audit", "Emit logs/metrics/traces", "Detect policy/SLA breach", "Alert owner", "Investigate and retain evidence"],
      responsibilities: ["Actor/entity/action audit", "Structured logs and traces", "Business and platform metrics", "Alert routing", "Incident and security evidence"],
      records: ["Audit event", "Security event", "Log", "Metric", "Trace", "Alert", "Incident"],
      interfaces: ["All domains", "Identity and edge", "Monitoring provider", "Security operations", "Compliance export"],
      controls: ["Audit is append-only and tenant-aware", "Sensitive values are redacted", "Operational logs cannot substitute for business audit", "Access to telemetry is role-controlled"],
      events: ["AuditRecorded", "SLOBreached", "SecurityAlertRaised", "IncidentOpened", "IncidentClosed"],
      decisions: ["Audit retention", "SLOs and alert ownership", "Security monitoring and incident SLA"]
    },
    {
      id: "external-integrations", title: "External provider adapters", layer: "External ecosystem", owner: "Integration engineering",
      paths: ["parent", "school", "commerce", "platform"], icon: "⇄", summary: "Replaceable boundaries for maps, OTP/identity, messaging, payments/banks/EMI, reviews, AI and school/vendor systems.",
      steps: ["Translate canonical request", "Attach provider idempotency", "Call provider", "Validate response/signature", "Map canonical outcome", "Reconcile asynchronously"],
      responsibilities: ["Provider-neutral contracts", "Credential isolation and rotation", "Timeout/retry/circuit policy", "Signed webhook verification", "Provider health and cost telemetry"],
      records: ["Provider configuration", "External reference", "Webhook receipt", "Integration attempt", "Reconciliation exception"],
      interfaces: ["Maps/geocoding", "OTP/OIDC", "Email/Web Push/WhatsApp/SMS", "Razorpay/banks/EMI", "Review sources", "AI", "Vendors/accounting"],
      controls: ["No provider payload becomes canonical without validation", "Secrets stay server-side", "Callbacks are signed and idempotent", "Provider failure degrades safely and visibly"],
      events: ["ProviderCallFailed", "WebhookVerified", "ProviderDegraded", "ReconciliationRequired", "CredentialRotated"],
      decisions: ["Providers chosen only after architecture/NFR review", "Fallback requirements", "Data residency and contractual SLA"]
    }
  ];

  window.CW_ARCHITECTURE = {
    version: "0.1",
    reviewedAt: "21 August 2026",
    paths: {
      all: { label: "Entire system", description: "Every experience, domain, platform and provider boundary." },
      parent: { label: "Parent journey", description: "Discovery through appointment, admission, academics, purchases and communication." },
      school: { label: "School operations", description: "Tenant setup, appointment handling, admissions, academics, finance and reporting." },
      commerce: { label: "Commerce and vendors", description: "Eligible catalogue, checkout, payment/EMI, fulfilment and status." },
      platform: { label: "Platform operations", description: "Tenant control, providers, data, asynchronous work, security and audit." }
    },
    journey: [
      { label: "Search", area: "public-discovery" },
      { label: "Compare", area: "directory-comparison" },
      { label: "Verify", area: "identity-access" },
      { label: "Book", area: "appointments" },
      { label: "Enquire", area: "admissions" },
      { label: "Apply", area: "admissions" },
      { label: "Pay", area: "billing-payments" },
      { label: "Admit", area: "admissions" },
      { label: "Learn & buy", area: "academics-activities" },
      { label: "Notify & measure", area: "analytics-ai" }
    ],
    layers: [
      { id: "experience", title: "People and experience channels", caption: "What each actor sees", areas: ["public-discovery", "parent-experience", "school-experience", "platform-control", "vendor-experience"] },
      { id: "access", title: "Access, trust and routing", caption: "Who can do what, in which tenant and context", areas: ["edge-security", "identity-access"] },
      { id: "domains", title: "Business capability layer", caption: "Durable CampusWeave domain boundaries", areas: ["directory-comparison", "appointments", "family-child", "admissions", "academics-activities", "commerce-fulfilment", "billing-payments", "communications", "documents", "analytics-ai"] },
      { id: "runtime", title: "Data, asynchronous work and operations", caption: "Transactional truth, search, jobs and evidence", areas: ["data-platform", "geo-search", "event-jobs", "audit-observability"] },
      { id: "external", title: "External ecosystem", caption: "Replaceable providers behind canonical adapters", areas: ["external-integrations"] }
    ],
    areas
  };
})();

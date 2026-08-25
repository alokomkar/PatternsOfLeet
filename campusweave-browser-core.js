(function (global) {
  const required = ["firstName", "dob", "className", "contactName", "mobile", "followUpAt", "source"];
  const normalizeMobile = (value = "") => String(value).replace(/\D/g, "").slice(-10);
  const nextCode = (prefix, records, year = "26") => {
    const largest = records.reduce((max, record) => {
      const match = String(record.code || "").match(new RegExp(`^${prefix}-${year}-(\\d+)$`));
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${prefix}-${year}-${String(largest + 1).padStart(4, "0")}`;
  };
  function createEnquiry(input, existing = []) {
    const missing = required.filter((field) => !String(input[field] || "").trim());
    if (missing.length) return { ok: false, error: "missing_fields", fields: missing };
    const mobile = normalizeMobile(input.mobile);
    if (mobile.length !== 10) return { ok: false, error: "invalid_mobile" };
    const comparable = (value) => String(value || "").trim().toLowerCase();
    const duplicate = existing.find((record) => {
      const sameChild = comparable(record.firstName) === comparable(input.firstName) && comparable(record.lastName) === comparable(input.lastName) && comparable(record.dob) === comparable(input.dob) && (!record.gender || !input.gender || comparable(record.gender) === comparable(input.gender));
      return sameChild && !["lost", "admitted", "duplicate"].includes(record.status);
    });
    if (duplicate) return { ok: false, error: "duplicate", duplicate };
    return { ok: true, record: { ...input, mobile, code: nextCode("ENQ", existing), status: "new", createdAt: new Date().toISOString() } };
  }
  function matchesEnquiry(record, query = "", status = "all statuses", source = "all sources") {
    const haystack = [record.firstName, record.lastName, record.contactName, record.mobile, record.code, record.status].join(" ").toLowerCase();
    const normalizedQuery = query.trim().toLowerCase(), mobileQuery = normalizeMobile(query);
    return (!normalizedQuery || haystack.includes(normalizedQuery) || (mobileQuery.length >= 4 && normalizeMobile(record.mobile).includes(mobileQuery))) && (status === "all statuses" || record.status === status.toLowerCase()) && (source === "all sources" || record.source === source);
  }
  function convertToApplication(enquiry, applications = []) {
    if (!enquiry?.code) return { ok: false, error: "missing_enquiry" };
    const existing = applications.find((application) => application.enquiryCode === enquiry.code);
    if (existing) return { ok: true, record: existing, reused: true };
    return { ok: true, record: { code: nextCode("APP", applications), enquiryCode: enquiry.code, studentName: [enquiry.firstName, enquiry.lastName].filter(Boolean).join(" "), className: enquiry.className, contactName: enquiry.contactName, relationship: enquiry.relationship, mobile: enquiry.mobile, source: enquiry.source, status: "draft" } };
  }
  function admissionEligibility(identifier, enquiries = [], applications = []) {
    const id = identifier.trim().toUpperCase(), application = applications.find((record) => record.code === id);
    if (application) return { ok: application.status === "paid", application, reason: application.status === "paid" ? null : "payment_not_verified" };
    const enquiry = enquiries.find((record) => record.code === id);
    if (!enquiry) return { ok: false, reason: "not_found" };
    const linked = applications.find((record) => record.enquiryCode === enquiry.code);
    return linked ? { ok: linked.status === "paid", application: linked, reason: linked.status === "paid" ? null : "payment_not_verified" } : { ok: false, reason: "application_required" };
  }
  global.CampusWeaveCore = { createEnquiry, matchesEnquiry, convertToApplication, admissionEligibility };
}(window));

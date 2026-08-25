const text = (value) => String(value ?? "").trim();
const mobile = (value) => String(value ?? "").replace(/\D/g, "").slice(-10);

export function nextJourneyCode(prefix, records = [], year = new Date().getFullYear()) {
  const largest = records.reduce((max, record) => {
    const match = text(record.code).match(new RegExp(`^${prefix}-${String(year).slice(-2)}-(\\d+)$`));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix}-${String(year).slice(-2)}-${String(largest + 1).padStart(4, "0")}`;
}

export function createJourneyEnquiry(appointment = {}, input = {}, existing = [], now = new Date()) {
  const required = ["className", "relationship", "followUpAt", "consent"];
  const errors = Object.fromEntries(required.filter((field) => !text(input[field])).map((field) => [field, "Required"]));
  if (!text(appointment.code) || !text(appointment.childName) || !text(appointment.parentName)) errors.appointment = "A verified appointment is required";
  const followUp = new Date(input.followUpAt);
  if (input.followUpAt && (!Number.isFinite(followUp.getTime()) || followUp < now)) errors.followUpAt = "Choose a future follow-up";
  const names = text(appointment.childName).split(/\s+/), firstName = names.shift() || "", lastName = names.join(" ");
  const duplicate = existing.find((record) => text(record.appointmentCode) === text(appointment.code)
    || (text(record.firstName).toLowerCase() === firstName.toLowerCase() && text(record.lastName).toLowerCase() === lastName.toLowerCase() && text(record.dob) === text(appointment.childDob) && !["lost", "duplicate"].includes(record.status)));
  if (duplicate) errors.duplicate = `Existing enquiry ${duplicate.code}`;
  if (Object.keys(errors).length) return { ok: false, errors, duplicate };
  return { ok: true, record: {
    code: nextJourneyCode("ENQ", existing, now.getFullYear()), appointmentCode: appointment.code,
    firstName, lastName, dob: appointment.childDob, gender: appointment.gender, className: text(input.className),
    contactName: appointment.parentName, relationship: text(input.relationship), mobile: mobile(appointment.mobile), email: text(appointment.email),
    source: "CampusWeave appointment QR", sourceDetail: `${appointment.schoolName} · ${appointment.campusName}`,
    schoolSlug: appointment.schoolSlug, schoolName: appointment.schoolName, campusName: appointment.campusName,
    followUpAt: input.followUpAt, notes: text(input.notes), consent: true, status: "new", createdAt: now.toISOString(),
  } };
}

export function validateParentApplication(input = {}) {
  const required = ["className", "address", "city", "postal", "primaryCommunication", "birthDocument", "photoDocument", "addressDocument", "paymentMode", "transactionId", "confirm"];
  const errors = Object.fromEntries(required.filter((field) => !text(input[field])).map((field) => [field, "Required"]));
  if (input.postal && !/^\d{6}$/.test(text(input.postal))) errors.postal = "Enter a six-digit pincode";
  if (input.transactionId && text(input.transactionId).length < 6) errors.transactionId = "Enter at least six characters";
  if (!["Playgroup", "Nursery", "LKG", "UKG"].includes(input.className)) errors.className = "Choose a supported class";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateParentAdmission(input = {}) {
  const required = ["primaryCommunication", "preferredBatch", "consent"];
  const errors = Object.fromEntries(required.filter((field) => !text(input[field])).map((field) => [field, "Required"]));
  return { valid: Object.keys(errors).length === 0, errors };
}

export function deriveParentJourney(appointmentCode, stores = {}) {
  const appointment = (stores.appointments || []).find((record) => record.code === appointmentCode) || null;
  const enquiry = appointment ? (stores.enquiries || []).find((record) => record.appointmentCode === appointment.code) || null : null;
  const application = enquiry ? (stores.applications || []).find((record) => record.enquiryCode === enquiry.code) || null : null;
  const admission = application ? (stores.admissions || []).find((record) => record.applicationCode === application.code) || null : null;
  const stage = !appointment ? "missing" : !enquiry ? "enquiry" : !application ? "qualification" : !application.parentSubmittedAt ? "application" : application.admissionFormStatus !== "submitted" ? "admission-form" : !admission ? "school-decision" : "admitted";
  return { stage, appointment, enquiry, application, admission };
}

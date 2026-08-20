export function normalizePhone(value = "") {
  return String(value).replace(/\D/g, "").slice(-10);
}

export function validateParentProfile(input) {
  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const rawPhone = String(input.phone || "").trim();
  const phone = normalizePhone(rawPhone);
  const errors = {};
  if (name.length < 2) errors.name = "Enter at least 2 characters for the parent or guardian name.";
  else if (name.length > 100) errors.name = "Keep the parent or guardian name within 100 characters.";
  else if (!/\p{L}/u.test(name)) errors.name = "Enter a name containing letters.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter a valid email address.";
  if (!/^[-+\d\s()]+$/.test(rawPhone) || !/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  return { ok: Object.keys(errors).length === 0, errors, value: { ...input, name, email, phone } };
}

const CHILD_RELATIONSHIPS = new Set(["Mother", "Father", "Guardian"]);
const CHILD_GENDERS = new Set(["Female", "Male", "Non-binary", "Prefer not to say"]);
const CHILD_CLASSES = new Set(["Playgroup", "Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3"]);

export function validateChildLinkInput(input, children = [], expectedCode = "ARJUN-2026") {
  const code = String(input.code || "").trim().toUpperCase();
  const relationship = String(input.relationship || "").trim();
  const errors = {};
  if (!code) errors.code = "Enter the invitation code supplied by the school.";
  else if (code !== expectedCode) errors.code = "This invitation code is not recognised.";
  if (!CHILD_RELATIONSHIPS.has(relationship)) errors.relationship = "Select your relationship to the child.";
  if (!input.confirmed) errors.confirmed = "Confirm that you recognise this child and school.";
  if (children.some((child) => child.id === "arjun")) errors.duplicate = "Arjun is already linked to this account.";
  return { ok: Object.keys(errors).length === 0, errors, value: { code, relationship, confirmed: Boolean(input.confirmed) } };
}

export function validateChildEnrollmentProfile(input, children = [], today = new Date()) {
  const name = String(input.name || "").trim().replace(/\s+/g, " ");
  const dateOfBirth = String(input.dateOfBirth || "").trim();
  const gender = String(input.gender || "").trim();
  const schoolId = String(input.schoolId || "").trim();
  const schoolName = String(input.schoolName || "").trim();
  const className = String(input.className || "").trim();
  const academicYear = String(input.academicYear || "").trim();
  const relationship = String(input.relationship || "").trim();
  const previousSchool = className === "Playgroup" ? "" : String(input.previousSchool || "").trim();
  const errors = {};
  if (name.length < 2) errors.name = "Enter the child’s full name.";
  else if (name.length > 100) errors.name = "Keep the child’s name within 100 characters.";
  else if (!/\p{L}/u.test(name)) errors.name = "Enter a child name containing letters.";
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ? new Date(`${dateOfBirth}T00:00:00Z`) : null;
  const todayKey = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  if (!parsed || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateOfBirth) errors.dateOfBirth = "Select a valid date of birth.";
  else if (parsed.getTime() >= todayKey) errors.dateOfBirth = "The date of birth must be before today.";
  if (!CHILD_GENDERS.has(gender)) errors.gender = "Select the child’s gender option.";
  if (!schoolId || !schoolName) errors.school = "Choose the school the child is interested in.";
  if (!CHILD_CLASSES.has(className)) errors.className = "Choose the class the child is applying for.";
  if (!/^20\d{2}[–-]\d{2}$/.test(academicYear)) errors.academicYear = "Choose a valid academic year.";
  if (!CHILD_RELATIONSHIPS.has(relationship)) errors.relationship = "Select your relationship to the child.";
  if (!input.confirmed) errors.confirmed = "Confirm that the details can be sent to the selected school for review.";
  const duplicate = children.some((child) => child.id !== input.childId && child.name?.trim().toLowerCase() === name.toLowerCase() && (child.profile?.dateOfBirthIso || child.dateOfBirth) === dateOfBirth);
  if (duplicate) errors.duplicate = "A child with this name and date of birth is already in your family account.";
  return { ok: Object.keys(errors).length === 0, errors, value: { name, dateOfBirth, gender, schoolId, schoolName, className, academicYear, relationship, previousSchool, confirmed: Boolean(input.confirmed) } };
}

export function validateAttendanceCorrection(input, today = new Date()) {
  const date = String(input.date || "").trim();
  const reason = String(input.reason || "").trim();
  const errors = {};
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null;
  if (!parsed || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    errors.date = "Select a valid attendance date.";
  } else {
    const todayKey = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    if (parsed.getTime() > todayKey) errors.date = "Attendance corrections cannot use a future date.";
  }
  if (reason.length < 10) errors.reason = "Explain the correction in at least 10 characters.";
  else if (reason.length > 500) errors.reason = "Keep the correction reason within 500 characters.";
  return { ok: Object.keys(errors).length === 0, errors, value: { date, reason } };
}

export function validateTransactionReference(value) {
  const reference = String(value || "").trim();
  if (!reference) return { ok: false, error: "Enter the payment transaction or reference ID.", value: reference };
  if (reference.length < 6 || reference.length > 40) return { ok: false, error: "Use 6 to 40 characters for the payment reference.", value: reference };
  if (!/^[A-Za-z0-9][A-Za-z0-9_\-/]*$/.test(reference)) return { ok: false, error: "Use only letters, numbers, hyphens, underscores or slashes.", value: reference };
  return { ok: true, value: reference };
}

export function validateDocumentUpload(file) {
  if (!file) return { ok: false, error: "Choose a PDF, JPG or PNG document." };
  const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
  if (!allowedTypes.has(file.type)) return { ok: false, error: "Only PDF, JPG and PNG files are accepted." };
  if (!Number.isFinite(file.size) || file.size <= 0) return { ok: false, error: "The selected file is empty or unreadable." };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: "The file must be 5 MB or smaller." };
  return { ok: true, value: { name: String(file.name || "document"), type: file.type, size: file.size } };
}

export function validateAIMessage(value) {
  const message = String(value || "").trim();
  if (!message) return { ok: false, error: "Enter a question for Campus AI.", value: message };
  if (message.length > 500) return { ok: false, error: "Keep the question within 500 characters.", value: message };
  return { ok: true, value: message };
}

const APPOINTMENT_TYPES = new Set(["In person", "Video call", "Phone call"]);

export function validateAppointmentRequest(input, today = new Date()) {
  const date = String(input.date || "").trim();
  const slot = String(input.slot || "").trim();
  const meetingType = String(input.meetingType || "").trim();
  const agenda = String(input.agenda || "").trim();
  const errors = {};
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null;
  const todayKey = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  if (!parsed || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) errors.date = "Select a valid appointment date.";
  else if (parsed.getTime() <= todayKey) errors.date = "Choose a future appointment date.";
  if (!slot) errors.slot = "Choose an available appointment slot.";
  if (!APPOINTMENT_TYPES.has(meetingType)) errors.meetingType = "Choose how you want to meet.";
  if (agenda.length < 10) errors.agenda = "Describe the meeting agenda in at least 10 characters.";
  else if (agenda.length > 300) errors.agenda = "Keep the meeting agenda within 300 characters.";
  return { ok: Object.keys(errors).length === 0, errors, value: { date, slot, meetingType, agenda } };
}

export function validateFeedback(input) {
  const kind = String(input.kind || "").trim();
  const rating = Number(input.rating);
  const remarks = String(input.remarks || "").trim();
  const errors = {};
  if (!["School review", "Staff appreciation"].includes(kind)) errors.kind = "Choose school review or staff appreciation.";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Choose a rating from 1 to 5.";
  if (remarks.length < 10) errors.remarks = "Enter at least 10 characters of useful feedback.";
  else if (remarks.length > 500) errors.remarks = "Keep feedback within 500 characters.";
  return { ok: Object.keys(errors).length === 0, errors, value: { kind, rating, remarks } };
}

const TRANSFER_SCOPES = new Set(["identity", "guardian_contacts", "documents", "learning_summary"]);

export function validateSchoolTransferRequest(input, child) {
  const targetSchoolId = String(input.targetSchoolId || "").trim();
  const targetSchoolName = String(input.targetSchoolName || "").trim();
  const scopes = [...new Set(Array.isArray(input.scopes) ? input.scopes.filter((scope) => TRANSFER_SCOPES.has(scope)) : [])];
  const errors = {};
  if (!targetSchoolId || !targetSchoolName) errors.school = "Choose the verified CampusWeave school receiving the request.";
  if (targetSchoolId && child?.currentEnrollment?.schoolId === targetSchoolId) errors.school = "Choose a school different from the current school.";
  if (!scopes.length) errors.scopes = "Choose at least one information category to share.";
  if (!input.confirmed) errors.confirmed = "Confirm the school and information-sharing request.";
  return { ok: Object.keys(errors).length === 0, errors, value: { targetSchoolId, targetSchoolName, scopes, confirmed: Boolean(input.confirmed) } };
}

export function createSchoolTransferRequest(child, input, now = new Date()) {
  const validation = validateSchoolTransferRequest(input, child);
  if (!validation.ok) return validation;
  return {
    ok: true,
    request: {
      id: `transfer-${child.id}-${now.getTime()}`,
      studentId: child.id,
      sourceEnrollmentId: child.currentEnrollment?.id || null,
      sourceSchoolId: child.currentEnrollment?.schoolId || null,
      targetSchoolId: validation.value.targetSchoolId,
      targetSchoolName: validation.value.targetSchoolName,
      scopes: validation.value.scopes,
      status: "pending_school_review",
      consentedAt: now.toISOString(),
    },
  };
}

export function acceptChildInvitation(invitation, relationship) {
  if (!invitation || invitation.status !== "pending") return { ok: false, error: "invalid_invitation" };
  if (!CHILD_RELATIONSHIPS.has(String(relationship || "").trim())) return { ok: false, error: "relationship_required" };
  return {
    ok: true,
    child: { ...invitation.child, relationship, accessStatus: "active" },
    invitation: { ...invitation, relationship, status: "accepted", acceptedAt: new Date().toISOString() },
  };
}

export function capabilitySummary(child) {
  const actions = child.actions || child.admission?.actions || [];
  return {
    actions: actions.filter((action) => action.status === "open").length,
    attendance: child.attendance?.percentage ?? null,
    feeDue: child.fees?.filter((fee) => fee.status === "due").reduce((sum, fee) => sum + fee.amount, 0) || 0,
    unread: child.announcements?.filter((announcement) => !announcement.read).length || 0,
    documents: child.documents?.filter((document) => document.status !== "verified").length || 0,
  };
}

export function markAnnouncementRead(children, childId, announcementId) {
  return children.map((child) => child.id !== childId ? child : {
    ...child,
    announcements: child.announcements.map((announcement) =>
      announcement.id === announcementId ? { ...announcement, read: true } : announcement
    ),
  });
}

export function recordFeePayment(children, childId, feeId, transactionId) {
  const reference = validateTransactionReference(transactionId);
  if (!reference.ok) return { ok: false, error: reference.error, children };
  let found = false;
  const updated = children.map((child) => {
    if (child.id !== childId) return child;
    let paidFee = null;
    const fees = child.fees.map((fee) => {
      if (fee.id !== feeId || fee.status !== "due") return fee;
      found = true;
      paidFee = fee;
      return { ...fee, status: "paid", transactionId: reference.value, paidAt: new Date().toISOString() };
    });
    if (!paidFee) return child;
    const feeSummary = child.feeSummary ? {
      ...child.feeSummary,
      paid: child.feeSummary.paid + paidFee.amount,
      balance: Math.max(0, child.feeSummary.balance - paidFee.amount),
    } : child.feeSummary;
    const transaction = {
      id: reference.value,
      receipt: "Pending school receipt",
      date: new Date().toLocaleDateString("en-IN"),
      mode: "Demo evidence",
      type: paidFee.label,
      amount: paidFee.amount,
      status: "Pending verification",
    };
    return { ...child, fees, feeSummary, feeTransactions: [...(child.feeTransactions || []), transaction] };
  });
  return found ? { ok: true, children: updated } : { ok: false, error: "fee_not_payable", children };
}

const PARENT_AI_SECTIONS = {
  home: "Family home",
  admission: "Admission",
  schooling: "School history",
  profile: "Child profile",
  health: "Health & care",
  attendance: "Attendance",
  learning: "Learning & growth",
  schedule: "Timetable",
  fees: "Fees",
  transport: "Transport",
  updates: "Updates",
  documents: "Documents",
  activities: "Activities",
  media: "Media",
  store: "Books & food",
  connect: "Connect with school",
  settings: "Family & privacy",
};

export function createParentAIContext(child, screen = "home") {
  if (!child?.id) return null;
  const safeScreen = PARENT_AI_SECTIONS[screen] ? screen : "home";
  return {
    childId: child.id,
    childName: child.name || "Selected child",
    school: child.school || "School",
    className: child.className || "Class not set",
    screen: safeScreen,
    sectionLabel: PARENT_AI_SECTIONS[safeScreen],
  };
}

export function parentAIResponse(prompt, child, screen = "home") {
  const context = createParentAIContext(child, screen);
  if (!context) return "Select a linked child before asking Campus AI.";
  const query = String(prompt || "").trim().toLowerCase();
  const firstName = context.childName.split(" ")[0];
  const summary = capabilitySummary(child);
  const sectionReplies = {
    home: `${firstName} has ${summary.actions} open action(s), ${summary.unread} unread update(s), ₹${summary.feeDue.toLocaleString("en-IN")} due, and ${summary.documents} document(s) needing attention.`,
    admission: `${firstName}'s admission is ${child.admission?.status || "not available"}. Admission number: ${child.admission?.number || "not assigned"}. ${summary.actions ? `${summary.actions} action(s) remain.` : "No admission actions remain."}`,
    schooling: `${firstName} has ${child.enrollments?.length || 0} school enrolment record(s). A new CampusWeave school receives only parent-approved categories through a reviewed transfer request; prior-school operational records are not exposed by default.`,
    profile: `${firstName}'s child profile includes ${child.guardians?.length || 0} authorised guardian or escort record(s), ${child.achievements?.length || 0} achievement(s), and ${child.certificates?.length || 0} issued certificate(s).`,
    health: `${firstName}'s school health view has ${child.health?.vaccinations?.length || 0} vaccination record(s). Health data is sensitive and remains scoped to this child and authorised school context.`,
    attendance: `${firstName}'s recorded attendance is ${child.attendance?.percentage ?? "not available"}%. You can use Request correction if a school day is inaccurate.`,
    learning: `${firstName}'s latest learning view includes ${child.academics?.length || 0} published area(s) and ${child.improvement?.length || 0} improvement plan(s). Teacher-authored notes remain the source of truth.`,
    schedule: `${firstName}'s next listed item is ${child.schedule?.[0]?.[1] || "not available"}${child.schedule?.[0]?.[0] ? ` at ${child.schedule[0][0]}` : ""}.`,
    fees: summary.feeDue ? `${firstName} has ₹${summary.feeDue.toLocaleString("en-IN")} due. Use the fee card to review the item before recording payment evidence.` : `${firstName} has no fee marked due in this demo.`,
    transport: `${firstName}'s transport is ${child.transport?.route || "not assigned"}, stop ${child.transport?.stop || "not assigned"}. Use Request change for school review.`,
    updates: `${firstName} has ${summary.unread} unread school update(s). Open an update before marking it read.`,
    documents: `${firstName} has ${summary.documents} document(s) missing or awaiting verification. Parent uploads do not become verified until the school reviews them.`,
    activities: `${firstName} has ${child.activities?.filter((item) => item[2] === "Enrolled").length || 0} enrolled activity or activities and ${child.activities?.filter((item) => item[2] === "Available").length || 0} available option(s).`,
    media: child.media?.length ? `${firstName} has ${child.media.length} authorised media item(s). Access is time-bound and should be audited.` : `No media is currently shared for ${firstName}.`,
    store: `${firstName}'s class list contains ${child.store?.length || 0} book or store item(s), with ${child.food?.length || 0} published menu day(s).`,
    connect: `${firstName} has ${child.appointments?.length || 0} appointment request(s). Booking, feedback and referral actions stay tied to ${context.school}.`,
    settings: `This section controls the parent's communication preferences and relationship-scoped access for ${firstName}. Another adult should use an independent verified account.`,
  };
  if (!query) return `Ask me about ${context.sectionLabel} for ${context.childName}.`;
  if (query.includes("who") || query.includes("context") || query.includes("child")) return `I am using ${context.childName}, ${context.className} at ${context.school}, and the ${context.sectionLabel} section.`;
  if (query.includes("help") || query.includes("what") || query.includes("attention") || query.includes("summary")) return sectionReplies[context.screen];
  return `For ${context.childName}, I am answering within ${context.sectionLabel}. ${sectionReplies[context.screen]}`;
}

export function normalizePhone(value = "") {
  return String(value).replace(/\D/g, "").slice(-10);
}

export function validateParentProfile(input) {
  const email = String(input.email || "").trim().toLowerCase();
  const phone = normalizePhone(input.phone);
  const errors = {};
  if (!String(input.name || "").trim()) errors.name = "Enter the parent or guardian name.";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";
  if (phone.length !== 10) errors.phone = "Enter a valid 10-digit mobile number.";
  return { ok: Object.keys(errors).length === 0, errors, value: { ...input, email, phone } };
}

export function acceptChildInvitation(invitation, relationship) {
  if (!invitation || invitation.status !== "pending") return { ok: false, error: "invalid_invitation" };
  if (!String(relationship || "").trim()) return { ok: false, error: "relationship_required" };
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
  if (!String(transactionId || "").trim()) return { ok: false, error: "transaction_required", children };
  let found = false;
  const updated = children.map((child) => child.id !== childId ? child : {
    ...child,
    fees: child.fees.map((fee) => {
      if (fee.id !== feeId || fee.status !== "due") return fee;
      found = true;
      return { ...fee, status: "paid", transactionId: transactionId.trim(), paidAt: new Date().toISOString() };
    }),
  });
  return found ? { ok: true, children: updated } : { ok: false, error: "fee_not_payable", children };
}

const PARENT_AI_SECTIONS = {
  home: "Family home",
  admission: "Admission",
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
    settings: `This section controls the parent's communication preferences and relationship-scoped access for ${firstName}. Another adult should use an independent verified account.`,
  };
  if (!query) return `Ask me about ${context.sectionLabel} for ${context.childName}.`;
  if (query.includes("who") || query.includes("context") || query.includes("child")) return `I am using ${context.childName}, ${context.className} at ${context.school}, and the ${context.sectionLabel} section.`;
  if (query.includes("help") || query.includes("what") || query.includes("attention") || query.includes("summary")) return sectionReplies[context.screen];
  return `For ${context.childName}, I am answering within ${context.sectionLabel}. ${sectionReplies[context.screen]}`;
}

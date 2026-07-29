export const seedShakti = {
  online: false,
  language: "kn",
  jobs: [
    { id: "SF-2418", customer: "Anita Rao", area: "JP Nagar", appliance: "Washing machine", issue: "Stops during spin cycle", slot: "10:30–12:00", owner: null, status: "awaiting", evidence: [] },
    { id: "SF-2417", customer: "Vijay Kumar", area: "HSR Layout", appliance: "Refrigerator", issue: "Not cooling", slot: "14:00–15:30", owner: "Ravi M.", status: "accepted", evidence: [] },
  ],
  outbox: [],
  events: [],
};

export function assignJob(state, jobId, technician) {
  return updateJob(state, jobId, (job) => {
    if (!job.customer || !job.area || !job.issue || !job.slot) throw new Error("Incomplete jobs cannot be assigned");
    return { ...job, owner: technician, status: "sent" };
  }, "assignment_sent");
}

export function acceptJob(state, jobId, technician) {
  const next = updateJob(state, jobId, (job) => {
    if (job.owner !== technician) throw new Error("Only the assigned technician can accept the job");
    return { ...job, status: "accepted" };
  }, "job_accepted");
  return queue(next, { type: "acceptance", jobId, technician });
}

export function completeJob(state, jobId, evidence) {
  const required = ["photoReference", "customerConfirmation", "serviceNote"];
  if (required.some((field) => !evidence[field])) throw new Error("Completion evidence is incomplete");
  const next = updateJob(state, jobId, (job) => ({ ...job, status: "completed", evidence: [{ ...evidence, capturedAt: evidence.capturedAt ?? new Date().toISOString() }] }), "job_completed");
  return queue(next, { type: "completion", jobId });
}

export function setConnectivity(state, online) {
  return { ...state, online, outbox: online ? [] : state.outbox, events: [...state.events, { type: online ? "synchronized" : "offline", count: online ? state.outbox.length : 0 }] };
}

export function addJob(state, input) {
  if (!input.customer || !input.area || !input.issue || !input.slot) throw new Error("Customer, area, issue, and slot are required");
  return { ...state, jobs: [{ id: `SF-${2400 + state.jobs.length + 1}`, appliance: input.appliance || "Service visit", owner: null, status: "awaiting", evidence: [], ...input }, ...state.jobs] };
}

function updateJob(state, id, change, event) {
  const index = state.jobs.findIndex((job) => job.id === id);
  if (index < 0) throw new Error("Job not found");
  const jobs = [...state.jobs]; jobs[index] = change(jobs[index]);
  return { ...state, jobs, events: [...state.events, { type: event, jobId: id }] };
}
function queue(state, operation) { return state.online ? state : { ...state, outbox: [...state.outbox, operation] }; }

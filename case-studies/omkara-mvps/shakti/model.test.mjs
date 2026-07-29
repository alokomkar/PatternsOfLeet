import assert from "node:assert/strict";
import test from "node:test";
import { acceptJob, addJob, assignJob, completeJob, seedShakti, setConnectivity } from "./model.mjs";

test("runs assignment through offline completion and synchronization", () => {
  let state = structuredClone(seedShakti);
  state = assignJob(state, "SF-2418", "Ravi M.");
  state = acceptJob(state, "SF-2418", "Ravi M.");
  state = completeJob(state, "SF-2418", { photoReference: "photo-1", customerConfirmation: "confirmed", serviceNote: "Spin belt reseated" });
  assert.equal(state.jobs[0].status, "completed");
  assert.equal(state.outbox.length, 2);
  state = setConnectivity(state, true);
  assert.equal(state.outbox.length, 0);
});

test("refuses incomplete jobs and incomplete completion evidence", () => {
  assert.throws(() => addJob(seedShakti, { customer: "A" }), /required/);
  assert.throws(() => completeJob(seedShakti, "SF-2418", { serviceNote: "No photo" }), /incomplete/);
});

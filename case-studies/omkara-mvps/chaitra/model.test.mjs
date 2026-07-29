import assert from "node:assert/strict";
import test from "node:test";
import { createAccountantExport, createBooking, recordReturnToShop, seedChaitra } from "./model.mjs";

test("books an available unique asset and creates a linked ledger record", () => {
  const state = createBooking(structuredClone(seedChaitra), { assetId: "SET-KD-018", customer: "Nandini", district: "Bengaluru Urban", mode: "delivery", startDate: "2026-08-10" });
  assert.equal(state.assets[0].status, "reserved");
  assert.equal(state.bookings[0].id, state.ledger[0].bookingId);
  assert.match(createAccountantExport(state).disclaimer, /accountant review/);
});

test("blocks unsupported delivery and overlapping unique-asset booking", () => {
  assert.throws(() => createBooking(seedChaitra, { assetId: "SET-KD-018", customer: "A", district: "Mysuru", mode: "delivery" }), /not supported/);
  assert.throws(() => createBooking(seedChaitra, { assetId: "SET-DM-011", customer: "A", district: "Bengaluru Urban", mode: "delivery" }), /not available/);
});

test("preserves custody evidence when undelivered jewellery returns", () => {
  const state = recordReturnToShop(structuredClone(seedChaitra), "SET-DM-011", "Chaitra");
  assert.equal(state.assets[2].custody, "Jayanagar shop");
  assert.equal(state.custodyEvents.at(-1).type, "returned_to_shop");
});

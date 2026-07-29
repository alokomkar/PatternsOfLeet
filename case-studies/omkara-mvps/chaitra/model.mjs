export const supportedDistricts = ["Bengaluru Urban", "Bengaluru Rural", "Ramanagara"];
export const seedChaitra = {
  assets: [
    { id: "SET-KD-018", name: "Mysore Kundan Bridal Set", category: "Kundan", price: 6500, deposit: 12000, status: "available", custody: "Jayanagar shop" },
    { id: "SET-TM-032", name: "Antique Temple Necklace", category: "Temple", price: 4800, deposit: 9000, status: "available", custody: "Jayanagar shop" },
    { id: "SET-DM-011", name: "Rose Diamond-look Choker", category: "Contemporary", price: 3900, deposit: 7500, status: "undelivered", custody: "Courier CR-19" },
  ],
  bookings: [],
  ledger: [],
  custodyEvents: [{ assetId: "SET-DM-011", type: "delivery_failed", custody: "Courier CR-19" }],
};

export function createBooking(state, input) {
  const asset = state.assets.find((item) => item.id === input.assetId);
  if (!asset || asset.status !== "available") throw new Error("The unique asset is not available");
  if (input.mode === "delivery" && !supportedDistricts.includes(input.district)) throw new Error("Delivery district is not supported");
  if (!["delivery", "shop_visit"].includes(input.mode)) throw new Error("A valid fulfilment mode is required");
  const id = `BK-${1285 + state.bookings.length}`;
  const booking = { id, ...input, status: input.mode === "delivery" ? "confirmed_for_delivery" : "visit_confirmed", total: asset.price, deposit: asset.deposit };
  const assets = state.assets.map((item) => item.id === asset.id ? { ...item, status: "reserved", custody: "Jayanagar shop" } : item);
  const invoice = { id: `INV-2026-${442 + state.ledger.length}`, bookingId: id, type: "rental_invoice", amount: asset.price, taxCode: "ACCOUNTANT_REVIEW", status: "recorded" };
  return { ...state, assets, bookings: [...state.bookings, booking], ledger: [...state.ledger, invoice] };
}

export function recordReturnToShop(state, assetId, actor) {
  const asset = state.assets.find((item) => item.id === assetId);
  if (!asset || asset.status !== "undelivered") throw new Error("Only undelivered assets can be returned");
  return {
    ...state,
    assets: state.assets.map((item) => item.id === assetId ? { ...item, status: "available", custody: "Jayanagar shop" } : item),
    custodyEvents: [...state.custodyEvents, { assetId, type: "returned_to_shop", custody: "Jayanagar shop", actor }],
  };
}

export function createAccountantExport(state) {
  return {
    generatedAt: new Date().toISOString(),
    disclaimer: "Business records only; tax treatment requires accountant review.",
    rows: state.ledger.map((row) => ({ ...row })),
    totals: { rentalIncome: state.ledger.filter((row) => row.type === "rental_invoice").reduce((sum, row) => sum + row.amount, 0) },
  };
}

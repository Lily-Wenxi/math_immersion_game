(function (global) {
  const equipmentCatalog = [
    { id: "pencil_plus", name: "Pencil+", effect: "Hint cooldown mindset boost", cost: 20 },
    { id: "focus_goggles", name: "Focus Goggles", effect: "Better concentration for multi-step problems", cost: 35 },
    { id: "fraction_blade", name: "Fraction Blade", effect: "Fraction simplification confidence", cost: 45 },
    { id: "algebra_shield", name: "Algebra Shield", effect: "Equation solving defense", cost: 60 },
    { id: "geometry_compass", name: "Geometry Compass", effect: "Geometry visualization boost", cost: 70 },
  ];

  function getCatalog() {
    return equipmentCatalog.map((item) => ({ ...item }));
  }

  function purchaseEquipment(score, ownedIds, itemId) {
    const owned = Array.isArray(ownedIds) ? [...ownedIds] : [];
    const item = equipmentCatalog.find((it) => it.id === itemId);

    if (!item) {
      return { ok: false, score, owned, message: "Item not found." };
    }

    if (owned.includes(itemId)) {
      return { ok: false, score, owned, message: "Already owned." };
    }

    if (score < item.cost) {
      return { ok: false, score, owned, message: "Not enough points." };
    }

    owned.push(itemId);
    return {
      ok: true,
      score: score - item.cost,
      owned,
      message: `Purchased ${item.name}!`,
    };
  }

  const api = { getCatalog, purchaseEquipment };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.ShopLogic = api;
})(typeof window !== "undefined" ? window : globalThis);

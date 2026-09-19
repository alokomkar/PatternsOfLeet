const zeroOrderZone = document.querySelector("#zero-order-zone");
const zeroInitialOrder = zeroOrderZone ? Array.from(zeroOrderZone.querySelectorAll(".drag-item")).map((item) => item.cloneNode(true)) : [];
let zeroDraggedItem = null;
let zeroSelectedItem = null;

function wireZeroDragItems() {
  document.querySelectorAll("#zero-order-zone .drag-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#zero-order-zone .drag-item").forEach((candidate) => candidate.classList.remove("selected"));
      zeroSelectedItem = item;
      item.classList.add("selected");
    });
    item.addEventListener("dragstart", () => {
      zeroDraggedItem = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      zeroDraggedItem = null;
    });
  });
}

function zeroAfterElement(container, y) {
  const items = [...container.querySelectorAll(".drag-item:not(.dragging)")];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

wireZeroDragItems();

zeroOrderZone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  const afterElement = zeroAfterElement(zeroOrderZone, event.clientY);
  if (!zeroDraggedItem) return;
  if (afterElement == null) zeroOrderZone.appendChild(zeroDraggedItem);
  else zeroOrderZone.insertBefore(zeroDraggedItem, afterElement);
});

document.querySelector('[data-zero-check="stack"]')?.addEventListener("click", () => {
  const inputs = [...document.querySelectorAll('[data-zero-quiz="stack"] input')];
  const correct = inputs.every((input) => (input.value === "correct") === input.checked);
  document.querySelector("#zero-stack-feedback").textContent = correct
    ? "Correct. UI, async work, and dependency creation have separate responsibilities."
    : "Not yet. The ViewModel should receive dependencies; it should not build the whole graph itself.";
});

document.querySelector('[data-zero-check="order"]')?.addEventListener("click", () => {
  const values = [...document.querySelectorAll("#zero-order-zone .drag-item")].map((item) => Number(item.dataset.order));
  const correct = values.every((value, index) => value === index + 1);
  document.querySelector("#zero-order-feedback").textContent = correct
    ? "Correct MVVM flow."
    : "Not yet. Think event -> ViewModel -> repository -> state -> recomposition.";
});

document.querySelector('[data-zero-reset="order"]')?.addEventListener("click", () => {
  zeroOrderZone.innerHTML = "";
  zeroInitialOrder.forEach((item) => zeroOrderZone.appendChild(item.cloneNode(true)));
  zeroSelectedItem = null;
  wireZeroDragItems();
  document.querySelector("#zero-order-feedback").textContent = "";
});

document.querySelector('[data-zero-move="up"]')?.addEventListener("click", () => {
  if (!zeroSelectedItem || !zeroSelectedItem.previousElementSibling) return;
  zeroOrderZone.insertBefore(zeroSelectedItem, zeroSelectedItem.previousElementSibling);
});

document.querySelector('[data-zero-move="down"]')?.addEventListener("click", () => {
  if (!zeroSelectedItem || !zeroSelectedItem.nextElementSibling) return;
  zeroOrderZone.insertBefore(zeroSelectedItem.nextElementSibling, zeroSelectedItem);
});

document.querySelector('[data-zero-check="match"]')?.addEventListener("click", () => {
  const expected = { state: "stateflow", legacy: "livedata", shared: "kmp", ml: "ml" };
  const correct = Object.entries(expected).every(([key, value]) => document.querySelector(`[data-zero-match="${key}"]`).value === value);
  document.querySelector("#zero-match-feedback").textContent = correct
    ? "Correct. You are matching each tool to the job it is best suited for."
    : "Not yet. Revisit StateFlow, LiveData, KMP, and LiteRT sections.";
});

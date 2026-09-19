const modernOrderZone = document.querySelector("#modern-order-zone");
const modernInitialOrder = modernOrderZone ? Array.from(modernOrderZone.querySelectorAll(".drag-item")).map((item) => item.cloneNode(true)) : [];
let modernDraggedItem = null;
let modernSelectedItem = null;

function wireModernDragItems() {
  document.querySelectorAll("#modern-order-zone .drag-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#modern-order-zone .drag-item").forEach((candidate) => candidate.classList.remove("selected"));
      modernSelectedItem = item;
      item.classList.add("selected");
    });
    item.addEventListener("dragstart", () => {
      modernDraggedItem = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      modernDraggedItem = null;
    });
  });
}

function modernAfterElement(container, y) {
  const items = [...container.querySelectorAll(".drag-item:not(.dragging)")];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

wireModernDragItems();

modernOrderZone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  const afterElement = modernAfterElement(modernOrderZone, event.clientY);
  if (!modernDraggedItem) return;
  if (afterElement == null) modernOrderZone.appendChild(modernDraggedItem);
  else modernOrderZone.insertBefore(modernDraggedItem, afterElement);
});

document.querySelector('[data-modern-check="responsibility"]')?.addEventListener("click", () => {
  const inputs = [...document.querySelectorAll('[data-modern-quiz="responsibility"] input')];
  const correct = inputs.every((input) => (input.value === "correct") === input.checked);
  document.querySelector("#modern-responsibility-feedback").textContent = correct
    ? "Correct. UI, data, reducer, and DI responsibilities are separated."
    : "Not yet. Repository code should not call UI, and ViewModels should receive dependencies.";
});

document.querySelector('[data-modern-check="order"]')?.addEventListener("click", () => {
  const values = [...document.querySelectorAll("#modern-order-zone .drag-item")].map((item) => Number(item.dataset.order));
  const correct = values.every((value, index) => value === index + 1);
  document.querySelector("#modern-order-feedback").textContent = correct
    ? "Correct MVI loop."
    : "Not yet. The loop is user event, intent, reducer, state emission, recomposition.";
});

document.querySelector('[data-modern-reset="order"]')?.addEventListener("click", () => {
  modernOrderZone.innerHTML = "";
  modernInitialOrder.forEach((item) => modernOrderZone.appendChild(item.cloneNode(true)));
  modernSelectedItem = null;
  wireModernDragItems();
  document.querySelector("#modern-order-feedback").textContent = "";
});

document.querySelector('[data-modern-move="up"]')?.addEventListener("click", () => {
  if (!modernSelectedItem || !modernSelectedItem.previousElementSibling) return;
  modernOrderZone.insertBefore(modernSelectedItem, modernSelectedItem.previousElementSibling);
});

document.querySelector('[data-modern-move="down"]')?.addEventListener("click", () => {
  if (!modernSelectedItem || !modernSelectedItem.nextElementSibling) return;
  modernOrderZone.insertBefore(modernSelectedItem.nextElementSibling, modernSelectedItem);
});

document.querySelector('[data-modern-check="match"]')?.addEventListener("click", () => {
  const expected = { state: "stateflow", legacy: "livedata", shared: "kmp", classifier: "ml" };
  const correct = Object.entries(expected).every(([key, value]) => document.querySelector(`[data-modern-match="${key}"]`).value === value);
  document.querySelector("#modern-match-feedback").textContent = correct
    ? "Correct. Tool choice matches the problem."
    : "Not yet. Revisit StateFlow, LiveData, KMP, and LiteRT sections.";
});

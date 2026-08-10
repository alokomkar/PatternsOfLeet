const p2OrderZone = document.querySelector("#p2-order-zone");
const p2InitialOrder = p2OrderZone ? Array.from(p2OrderZone.querySelectorAll(".drag-item")).map((item) => item.cloneNode(true)) : [];
let p2DraggedItem = null;
let p2SelectedItem = null;

function wirePhase2DragItems() {
  document.querySelectorAll("#p2-order-zone .drag-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#p2-order-zone .drag-item").forEach((candidate) => candidate.classList.remove("selected"));
      p2SelectedItem = item;
      item.classList.add("selected");
    });
    item.addEventListener("dragstart", () => {
      p2DraggedItem = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      p2DraggedItem = null;
    });
  });
}

function p2AfterElement(container, y) {
  const items = [...container.querySelectorAll(".drag-item:not(.dragging)")];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

wirePhase2DragItems();

p2OrderZone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  const afterElement = p2AfterElement(p2OrderZone, event.clientY);
  if (!p2DraggedItem) return;
  if (afterElement == null) p2OrderZone.appendChild(p2DraggedItem);
  else p2OrderZone.insertBefore(p2DraggedItem, afterElement);
});

document.querySelector('[data-check="p2-multi"]')?.addEventListener("click", () => {
  const inputs = [...document.querySelectorAll('[data-quiz="p2-multi"] input')];
  const correct = inputs.every((input) => (input.value === "correct") === input.checked);
  document.querySelector("#p2-multi-feedback").textContent = correct
    ? "Correct. Blank screens are not acceptable app states."
    : "Not yet. A real app needs visible loading, empty, and error behavior.";
});

document.querySelector('[data-check="p2-order"]')?.addEventListener("click", () => {
  const values = [...document.querySelectorAll("#p2-order-zone .drag-item")].map((item) => Number(item.dataset.order));
  const correct = values.every((value, index) => value === index + 1);
  document.querySelector("#p2-order-feedback").textContent = correct
    ? "Correct route flow."
    : "Not yet. Think: tap row, pass id, load detail, return to prior list.";
});

document.querySelector('[data-reset="p2-order"]')?.addEventListener("click", () => {
  p2OrderZone.innerHTML = "";
  p2InitialOrder.forEach((item) => p2OrderZone.appendChild(item.cloneNode(true)));
  p2SelectedItem = null;
  wirePhase2DragItems();
  document.querySelector("#p2-order-feedback").textContent = "";
});

document.querySelector('[data-p2-move="up"]')?.addEventListener("click", () => {
  if (!p2SelectedItem || !p2SelectedItem.previousElementSibling) return;
  p2OrderZone.insertBefore(p2SelectedItem, p2SelectedItem.previousElementSibling);
});

document.querySelector('[data-p2-move="down"]')?.addEventListener("click", () => {
  if (!p2SelectedItem || !p2SelectedItem.nextElementSibling) return;
  p2OrderZone.insertBefore(p2SelectedItem.nextElementSibling, p2SelectedItem);
});

document.querySelector('[data-check="p2-match"]')?.addEventListener("click", () => {
  const expected = { language: "datastore", favourites: "room", catalogue: "network", sort: "datastore" };
  const correct = Object.entries(expected).every(([key, value]) => document.querySelector(`[data-p2-match="${key}"]`).value === value);
  document.querySelector("#p2-match-feedback").textContent = correct
    ? "Correct. Preferences, structured records, and fresh server data have different storage needs."
    : "Not yet. Revisit the local storage tutorial.";
});

document.querySelector('[data-check="p2-code"]')?.addEventListener("click", () => {
  document.querySelector("#p2-code-feedback").textContent = "The empty branch hides the problem from the user. Show an empty state with the current search/filter context and a clear reset action.";
});

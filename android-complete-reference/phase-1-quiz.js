const orderInitial = Array.from(document.querySelectorAll("#order-zone .drag-item")).map((item) => item.cloneNode(true));

let draggedItem = null;
let selectedDragItem = null;

function wireDragItems() {
  document.querySelectorAll(".drag-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".drag-item").forEach((candidate) => candidate.classList.remove("selected"));
      selectedDragItem = item;
      item.classList.add("selected");
    });
    item.addEventListener("dragstart", () => {
      draggedItem = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      draggedItem = null;
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".drag-item:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

wireDragItems();

const orderZone = document.querySelector("#order-zone");
if (orderZone) {
  orderZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(orderZone, event.clientY);
    if (!draggedItem) return;
    if (afterElement == null) {
      orderZone.appendChild(draggedItem);
    } else {
      orderZone.insertBefore(draggedItem, afterElement);
    }
  });
}

document.querySelector('[data-check="multi"]')?.addEventListener("click", () => {
  const inputs = [...document.querySelectorAll('[data-quiz="multi"] input')];
  const correct = inputs.every((input) => (input.value === "correct") === input.checked);
  document.querySelector("#multi-feedback").textContent = correct
    ? "Correct. State drives UI; events change state."
    : "Not yet. Select the statements where state is the source of truth.";
});

document.querySelector('[data-check="order"]')?.addEventListener("click", () => {
  const values = [...document.querySelectorAll("#order-zone .drag-item")].map((item) => Number(item.dataset.order));
  const correct = values.every((value, index) => value === index + 1);
  document.querySelector("#order-feedback").textContent = correct
    ? "Correct order."
    : "Not yet. Think: create project, edit code, run app, observe behavior.";
});

document.querySelector('[data-reset="order"]')?.addEventListener("click", () => {
  orderZone.innerHTML = "";
  orderInitial.forEach((item) => orderZone.appendChild(item.cloneNode(true)));
  selectedDragItem = null;
  wireDragItems();
  document.querySelector("#order-feedback").textContent = "";
});

document.querySelector('[data-move="up"]')?.addEventListener("click", () => {
  if (!selectedDragItem || !selectedDragItem.previousElementSibling) return;
  orderZone.insertBefore(selectedDragItem, selectedDragItem.previousElementSibling);
});

document.querySelector('[data-move="down"]')?.addEventListener("click", () => {
  if (!selectedDragItem || !selectedDragItem.nextElementSibling) return;
  orderZone.insertBefore(selectedDragItem.nextElementSibling, selectedDragItem);
});

document.querySelector('[data-check="match"]')?.addEventListener("click", () => {
  const expected = { activity: "entry", gradle: "build", remember: "state", column: "layout" };
  const correct = Object.entries(expected).every(([key, value]) => document.querySelector(`[data-match="${key}"]`).value === value);
  document.querySelector("#match-feedback").textContent = correct
    ? "Correct. You can distinguish app structure, build system, state, and layout."
    : "Not yet. Revisit app anatomy, Compose UI, and state tutorials.";
});

document.querySelector('[data-check="code"]')?.addEventListener("click", () => {
  document.querySelector("#code-feedback").textContent = "The count variable is a plain local variable. Use remember { mutableStateOf(0) } so Compose keeps the value across recomposition.";
});

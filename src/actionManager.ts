import { createActionButton } from "./actionButton";
import type { Action } from "./types";

export function createActionElement(itemId: string, action: Action) {
  const container = document.createElement("div");

  // =========================
  // ⚔️ AÇÃO SIMPLES
  // =========================
  if (action.options.length === 1) {
    container.className = "action-group simple";

    const opt = action.options[0];

    const btn = createActionButton(
      itemId,
      `${action.icon ?? ""} ${action.name} ${opt.cost} ${opt.label}`,
      opt.cost,
      opt.counter
    );

    container.appendChild(btn);
    return container;
  }

  // =========================
  // 🧠 AÇÃO COMPOSTA
  // =========================
  container.className = "action-group complex";

  const title = document.createElement("div");
  title.className = "action-title";
  title.textContent = `${action.icon ?? ""} ${action.name}`;

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "action-options";

  action.options.forEach(opt => {
    const btn = createActionButton(
      itemId,
      `${opt.label}`,
      opt.cost,
      opt.counter
    );

    optionsContainer.appendChild(btn);
  });

  container.append(title, optionsContainer);

  return container;
}
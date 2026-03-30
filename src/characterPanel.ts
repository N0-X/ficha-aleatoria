import OBR from "@owlbear-rodeo/sdk";
import type { Item } from "@owlbear-rodeo/sdk";
import { createCounterBox } from "./counterBox";
import { ACTIONS } from "./actionList";
import { createActionElement } from "./actionManager";
import { getCombatState } from "./combatTracker";

const ID = "com.tutorial.initiative-tracker";

// 🔥 controle de render
let currentRenderedId: string | null = null;

export async function renderCharacterPanel(item: Item) {
    const panel = document.querySelector("#characterPanel") as HTMLDivElement;

    const isSameCharacter =
        currentRenderedId === item.id &&
        panel.children.length > 0;

    // 🔄 só limpa se for OUTRO personagem
    if (!isSameCharacter) {
        panel.innerHTML = "";
        currentRenderedId = item.id;
    }

    const items = await OBR.scene.items.getItems();
    const updatedItem = items.find((i) => i.id === item.id);

    if (!updatedItem) {
        panel.textContent = "Token não encontrado";
        return;
    }

    const rawData = updatedItem.metadata?.[`${ID}/metadata`] as any;

    if (!rawData) {
        panel.textContent = "Token não está na iniciativa";
        return;
    }

    const data = {
        initiative: rawData.initiative ?? 0,
        counters: {
            counter1: {
                current: rawData.counters?.counter1?.current ?? 0,
                max: rawData.counters?.counter1?.max ?? 0
            },
            counter2: {
                current: rawData.counters?.counter2?.current ?? 0,
                max: rawData.counters?.counter2?.max ?? 0
            }
        }
    };

    // =========================
    // 🔄 ATUALIZAÇÃO LEVE (SEM REBUILD)
    // =========================

    if (isSameCharacter) {
        // 🏷️ Atualiza nome
        const nameEl = panel.querySelector("h2");

        if (nameEl) {
            if ("text" in updatedItem) {
                const text = updatedItem.text as { plainText?: string };
                nameEl.textContent = text?.plainText || item.name;
            } else {
                nameEl.textContent = "Token";
            }
        }

        // 🔢 Atualiza counters
        const inputs = panel.querySelectorAll("input");

        if (inputs.length >= 4) {
            (inputs[0] as HTMLInputElement).value = String(data.counters.counter1.current);
            (inputs[1] as HTMLInputElement).value = String(data.counters.counter1.max);
            (inputs[2] as HTMLInputElement).value = String(data.counters.counter2.current);
            (inputs[3] as HTMLInputElement).value = String(data.counters.counter2.max);
        }

        return;
    }

    // =========================
    // 🎯 TURNO ATIVO
    // =========================

    const state = await getCombatState();
    const isActiveTurn = state.currentTurnId === updatedItem.id;

    let turnBanner: HTMLDivElement | null = null;

    if (isActiveTurn) {
        turnBanner = document.createElement("div");
        turnBanner.className = "turn-banner";
        turnBanner.textContent = "🔥 Seu turno!";
    }

    if (isActiveTurn) {
        panel.classList.add("active-character");
    } else {
        panel.classList.remove("active-character");
    }

    // =========================
    // 🖼️ IMAGEM
    // =========================

    const img = document.createElement("img");

    if ("image" in updatedItem) {
        const image = updatedItem.image as { url?: string };
        img.src = image?.url ?? "";
    } else {
        img.src = "";
    }

    img.style.width = "64px";
    img.style.height = "64px";

    // =========================
    // 🏷️ NOME
    // =========================

    const name = document.createElement("h2");

    if ("text" in updatedItem) {
        const text = updatedItem.text as { plainText?: string };
        name.textContent = text?.plainText || item.name;
    } else {
        name.textContent = "Token";
    }

    // =========================
    // 📦 HEADER
    // =========================

    const header = document.createElement("div");
    header.className = "character-header";
    header.append(img, name);

    // =========================
    // 🎛️ COUNTERS
    // =========================

    const counter1 = createCounterBox(
        updatedItem.id,
        "counter1",
        "PA",
        data.counters.counter1.current,
        data.counters.counter1.max
    );
    counter1.className = "PACounter"

    const counter2 = createCounterBox(
        updatedItem.id,
        "counter2",
        "AP",
        data.counters.counter2.current,
        data.counters.counter2.max
    );
    counter2.className = "APCounter"

    // =========================
    // ⚔️ AÇÕES
    // =========================

    const actions = document.createElement("div");
    actions.className = "action-buttons";

    const simpleContainer = document.createElement("div");
    simpleContainer.className = "actions-simple";

    const complexContainer = document.createElement("div");
    complexContainer.className = "actions-complex";

    const simpleActions = ACTIONS.filter(a => a.options.length === 1);
    const complexActions = ACTIONS.filter(a => a.options.length > 1);

    // ⚔️ Simples
    simpleActions.forEach(action => {
        const el = createActionElement(updatedItem.id, action);
        simpleContainer.appendChild(el);
    });

    // 🧠 Compostas
    complexActions.forEach(action => {
        const el = createActionElement(updatedItem.id, action);
        complexContainer.appendChild(el);
    });

    // =========================
    // 🧩 MONTAGEM FINAL
    // =========================

    actions.append(simpleContainer, complexContainer);

    panel.append(
        turnBanner ?? document.createElement("div"),
        header,
        counter1,
        counter2,
        actions
    );
}

export function resetCharacterPanel() {
    currentRenderedId = null;
}
import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./contextMenu";
import { createItemCard, updateCard } from "./itemCard";
import { nextTurn, previousTurn, getCombatState } from "./combatTracker";
import { showInitiative } from "./screens";
import { renderCharacterPanel } from "./characterPanel";
import { getCurrentCharacter } from "./state";

const ID = "com.tutorial.initiative-tracker";

const app = document.querySelector("#app") as HTMLDivElement;

app.innerHTML = `

  <div id="initiativeScreen">

    <div id="itemList"></div>

    <div id="roundTracker">
      <button id="prevTurn"><</button>
      <span id="roundText">Rodada 1</span>
      <button id="nextTurn">></button>
    </div>

  </div>

  <div id="characterScreen" class="hidden">
    <button id="backButton">← Voltar</button>
    <div id="characterPanel"></div>
  </div>
`;

document
  .querySelector("#backButton")!
  .addEventListener("click", showInitiative);

const list = document.querySelector("#itemList") as HTMLDivElement;
const roundText = document.querySelector("#roundText") as HTMLSpanElement;

const renderedCards = new Map<string, HTMLElement>();

function sortTracked(items: any[]) {
  return items
    .filter((i) => i.metadata[`${ID}/metadata`])
    .sort(
      (a, b) =>
        b.metadata[`${ID}/metadata`].initiative -
        a.metadata[`${ID}/metadata`].initiative
    );
}

function updateWindowHeight(trackedCount: number) {
  const baseHeight = 180;
  const perItem = 45;
  const maxItems = 6;

  const visibleItems = Math.min(trackedCount, maxItems);

  const newHeight = baseHeight + (visibleItems * perItem);

  OBR.action.setHeight(newHeight);
}

async function updateHighlight() {
  const state = await getCombatState();

  document.querySelectorAll(".item-card").forEach((c) =>
    c.classList.remove("active-turn")
  );

  if (!state.currentTurnId) return;

  const active = renderedCards.get(state.currentTurnId);
  active?.classList.add("active-turn");
}

async function updateRound() {
  const state = await getCombatState();
  roundText.textContent = `Rodada ${state.round}`;
}

async function syncUI(items: any[]) {
  const tracked = sortTracked(items);
  const existingIds = new Set(renderedCards.keys());

  for (let item of tracked) {
    if (!renderedCards.has(item.id)) {
      const card = createItemCard(item);
      if (!card) continue;
      renderedCards.set(item.id, card);
      list.appendChild(card);
    } else {
      updateCard(renderedCards.get(item.id)!, item);
    }
    
    existingIds.delete(item.id);
  }

  // remover os que saíram
  for (let id of existingIds) {
    const card = renderedCards.get(id);
    card?.remove();
    renderedCards.delete(id);
  }

  // reordenar visualmente
  tracked.forEach((item) => {
    const card = renderedCards.get(item.id)!;
    list.appendChild(card);
  });

  updateHighlight();

  updateWindowHeight(tracked.length);
}

OBR.onReady(async () => {
  setupContextMenu();

  document
    .querySelector("#nextTurn")!
    .addEventListener("click", async () => {
      await nextTurn();
    });

  document
    .querySelector("#prevTurn")!
    .addEventListener("click", async () => {
      await previousTurn();
    });

    const items = await OBR.scene.items.getItems();
      await syncUI(items);
      await updateRound();
      await updateHighlight();

  OBR.scene.items.onChange(async (items) => {

  await syncUI(items);

  const currentCharacterId = getCurrentCharacter();

  if (currentCharacterId) {

    const updated = items.find(i => i.id === currentCharacterId);

    if (updated) {
      await renderCharacterPanel(updated);
    }

  }

});

  setupContextMenu();

  OBR.action.setHeight(360);
  OBR.action.setWidth(260);

  OBR.scene.items.onChange(async (items) => {
    await syncUI(items);

    const currentCharacterId = getCurrentCharacter();

    if (currentCharacterId) {
      const updated = items.find(i => i.id === currentCharacterId);
      if (updated) {
        await renderCharacterPanel(updated);
      }
    }
  });

  OBR.scene.onMetadataChange(() => {
    updateRound();
    updateHighlight();
  });
});


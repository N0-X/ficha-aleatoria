import OBR from "@owlbear-rodeo/sdk";
import { showCharacter } from "./screens";
import { renderCharacterPanel } from "./characterPanel";
import { setCurrentCharacter } from "./state";
import { resetCharacterPanel } from "./characterPanel";

const ID = "com.tutorial.initiative-tracker";

export function updateCard(card: HTMLElement, item: any) {
    const nameEl = card.querySelector(".card-name") as HTMLDivElement;
    const initInput = card.querySelector(".initiative") as HTMLInputElement;

    nameEl.textContent = item.text?.plainText || item.name;

    const data = item.metadata?.[`${ID}/metadata`];


    if (data && initInput) {
        initInput.value = data.initiative;
    }
}

export function createItemCard(item: any) {
    const container = document.createElement("div");
    container.className = "item-card";
    container.dataset.id = item.id;

    const data = item.metadata?.[`${ID}/metadata`];
    if (!data) return null;

    // ===== CRIANDO AS COLUNAS =====

    const left = document.createElement("div");
    left.className = "card-left";

    const header = document.createElement("div");
    header.className = "card-header"; // Coisa do left

    const right = document.createElement("div");
    right.className = "card-right";

    // ===== FOTO =====
    const img = document.createElement("img");
    img.src = item.image?.url ?? "";
    img.className = "item-image";

    // Linha nome + iniciativa
    const nameRow = document.createElement("div");
    nameRow.className = "name-row";

    // Nome
    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = item.text?.plainText || item.name;

    // Iniciativa
    const initInput = document.createElement("input");
    initInput.type = "number";
    initInput.className = "initiative";
    initInput.value = data.initiative;

    initInput.onchange = () => {
        OBR.scene.items.updateItems([item.id], (items) => {
            const item = items[0];

            const data = item.metadata[`${ID}/metadata`] ?? {
            initiative: 0,
            counters: {
                counter1: { current: 0, max: 0 },
                counter2: { current: 0, max: 0 }
            }
            };

            item.metadata = {
            ...item.metadata,
            [`${ID}/metadata`]: {
                ...data,
                initiative: Number(initInput.value)
            }
            };
        });
    };

    // Monta linha
    header.append(img, name);

    // Monta coluna esquerda
    left.append(header);

    // Cria o botão para o characterPanel
    const details = document.createElement("button");

    details.textContent = ">>";

    details.onclick = () => {

        setCurrentCharacter(item.id);

        resetCharacterPanel();

        renderCharacterPanel(item); // desenha a tela do personagem
        showCharacter();            // troca para a tela 2

    };

    right.append(initInput, details)

    // ===== MONTA CARD =====
    container.append(left, right);

    return container;
}
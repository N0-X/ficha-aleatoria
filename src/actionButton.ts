import OBR from "@owlbear-rodeo/sdk";
import type { ItemMetadata } from "./types";

const ID = "com.tutorial.initiative-tracker";

export function createActionButton(
    itemId: string,
    label: string,
    cost: number,
    counter: "counter1" | "counter2"
) {
    const btn = document.createElement("button");

    btn.innerHTML = `
    <span class="action-label">${label}</span>
    <span class="action-cost">${cost}</span>
    `;

    btn.className = "action-button";

    btn.textContent = `${label}`;

    async function updateButtonState() {
        const items = await OBR.scene.items.getItems();
        const item = items.find(i => i.id === itemId);

        const data = item?.metadata?.[`${ID}/metadata`] as ItemMetadata;
        if (!data) return;

        const current = data.counters[counter].current;

        // 🔥 DESABILITA SE NÃO TIVER RECURSO
        btn.disabled = current < cost;
    }

    btn.addEventListener("click", async () => {
        await OBR.scene.items.updateItems([itemId], (items) => {
            const item = items[0];

            const data = item.metadata?.[`${ID}/metadata`] as ItemMetadata;
            if (!data) return;

            const current = data.counters[counter].current;
            const newValue = Math.max(0, current - cost);

            item.metadata = {
                ...item.metadata,
                [`${ID}/metadata`]: {
                    ...data,
                    counters: {
                        ...data.counters,
                        [counter]: {
                            ...data.counters[counter],
                            current: newValue
                        }
                    }
                }
            };
        });

        // 🔄 Atualiza estado após gastar
        updateButtonState();
    });

    // 🔄 Atualiza sempre que a cena muda
    OBR.scene.items.onChange(() => {
        updateButtonState();
    });

    // 🔥 inicial
    updateButtonState();

    return btn;
}
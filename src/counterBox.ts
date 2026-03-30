import OBR from "@owlbear-rodeo/sdk";
import type { ItemMetadata } from "./types";

const ID = "com.tutorial.initiative-tracker";

export function createCounterBox(
  itemId: string,
  key: "counter1" | "counter2",
  label: string,
  current: number,
  max: number
) {
  const container = document.createElement("div");

  container.innerHTML = `
    <div class="counterback">
      <strong>${label}</strong><br/>
      <button class="minus">-</button>
      <input class="current" type="number" value="${current}" />
      /
      <input class="max" type="number" value="${max}" />
      <button class="plus">+</button>
    </div>
  `;

  const minus = container.querySelector(".minus") as HTMLButtonElement;
  const plus = container.querySelector(".plus") as HTMLButtonElement;
  const currentInput = container.querySelector(".current") as HTMLInputElement;
  const maxInput = container.querySelector(".max") as HTMLInputElement;

  async function update(newCurrent: number, newMax: number) {
    await OBR.scene.items.updateItems([itemId], (items) => {
      const item = items[0];

      const data =
        (item.metadata[`${ID}/metadata`] as ItemMetadata) ?? {
          initiative: 0,
          counters: {
            counter1: { current: 0, max: 0 },
            counter2: { current: 0, max: 0 }
          }
        };

      const newMetadata: ItemMetadata = {
        ...data,
        counters: {
          ...data.counters,
          [key]: {
            current: newCurrent,
            max: newMax
          }
        }
      };

      item.metadata = {
        ...item.metadata,
        [`${ID}/metadata`]: newMetadata
      };
    });
  }

  minus.onclick = () => {
    let val = Number(currentInput.value);
    if (val > 0) {
      val--;
      currentInput.value = String(val);
      update(val, Number(maxInput.value));
    }
  };

  plus.onclick = () => {
    let val = Number(currentInput.value);
    const maxVal = Number(maxInput.value);
    if (val < maxVal) {
      val++;
      currentInput.value = String(val);
      update(val, maxVal);
    }
  };

  currentInput.onchange = () =>
    update(Number(currentInput.value), Number(maxInput.value));

  maxInput.onchange = () =>
    update(Number(currentInput.value), Number(maxInput.value));

  return container;
}
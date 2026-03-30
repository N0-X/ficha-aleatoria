import OBR from "@owlbear-rodeo/sdk";
import type { ItemMetadata } from "./types";

const ID = "com.tutorial.initiative-tracker";
const COMBAT_KEY = `${ID}/combat`;

export interface CombatState { 
    round: number;
    currentTurnId: string | null;
}

interface TrackedMetadata {
    initiative: number;
}

export async function getCombatState(): Promise<CombatState> {
    const metadata = await OBR.scene.getMetadata();

    const state = metadata[COMBAT_KEY] as CombatState | undefined;

    return {
        round: state?.round ?? 1,
        currentTurnId: state?.currentTurnId ?? null,
    };
}

    export async function setCombatState(state: any) {
    await OBR.scene.setMetadata({
        [COMBAT_KEY]: state,
    });
    }

    async function getSortedTrackedItems() {
    const items = await OBR.scene.items.getItems();

    return items
        .filter((i) => i.metadata[`${ID}/metadata`])
        .sort((a, b) => {
            const metaA = a.metadata[`${ID}/metadata`] as TrackedMetadata;
            const metaB = b.metadata[`${ID}/metadata`] as TrackedMetadata;

            return metaB.initiative - metaA.initiative;
});
    }

    export async function nextTurn() {
    const tracked = await getSortedTrackedItems();
    if (tracked.length === 0) return;

    const state = await getCombatState();
    let index = tracked.findIndex((i) => i.id === state.currentTurnId);

    if (index === -1) {
        await setCombatState({ round: 1, currentTurnId: tracked[0].id });
        return;
    }

    let nextIndex = index + 1;
    let round = state.round;
    let newRound = false;

    if (nextIndex >= tracked.length) {
        nextIndex = 0;
        round += 1;
        newRound = true;
    }

    await setCombatState({
        round,
        currentTurnId: tracked[nextIndex].id,
    });

    if (newRound) {
        await resetAllCounters();
    }
}

async function resetAllCounters() {
    const items = await OBR.scene.items.getItems();

    await OBR.scene.items.updateItems(
        items.map(i => i.id),
        (items) => {
            for (let item of items) {
                const data = item.metadata?.[`${ID}/metadata`] as ItemMetadata;;
                if (!data) continue;

                item.metadata = {
                    ...item.metadata,
                    [`${ID}/metadata`]: {
                        ...data,
                        counters: {
                            counter1: {
                                current: data.counters.counter1.max,
                                max: data.counters.counter1.max
                            },
                            counter2: {
                                current: data.counters.counter2.max,
                                max: data.counters.counter2.max
                            }
                        }
                    }
                };
            }
        }
    );
}

export async function previousTurn() {
    const tracked = await getSortedTrackedItems();
    if (tracked.length === 0) return;

    const state = await getCombatState();
    let index = tracked.findIndex((i) => i.id === state.currentTurnId);

    if (index === -1) {
        await setCombatState({ round: 1, currentTurnId: tracked[0].id });
        return;
    }

    let prevIndex = index - 1;
    let round = state.round;

    if (prevIndex < 0) {
        prevIndex = tracked.length - 1;
        round = Math.max(1, round - 1);
    }

    await setCombatState({
        round,
        currentTurnId: tracked[prevIndex].id,
    });
}
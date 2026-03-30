export interface CounterData {
    current: number;
    max: number;
    }

export interface ItemMetadata {
    initiative: number;
    counters: {
        counter1: CounterData;
        counter2: CounterData;
    };
}

export type CounterKey = "counter1" | "counter2";

export interface ActionOption {
    label: string;
    cost: number;
    counter: CounterKey;
}

export interface Action {
    name: string;
    icon?: string;
    options: ActionOption[];
}
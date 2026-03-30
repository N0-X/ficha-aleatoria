import type { Action } from "./types";

export const ACTIONS: Action[] = [
    {
        name: "Andar",
        icon: "",
        options: [{ label: "PA", cost: 2, counter: "counter1" }]
    },
    {
        name: "Passo de Ajuste",
        icon: "",
        options: [{ label: "PA", cost: 1, counter: "counter1" }]
    },
    {
        name: "Arremessar",
        icon: "",
        options: [{ label: "PA", cost: 2, counter: "counter1" }]
    },
    {
        name: "Teste Ativo",
        icon: "",
        options: [{ label: "PA", cost: 2, counter: "counter1" }]
    },
    {
        name: "Atacar",
        icon: "",
        options: [{ label: "PA", cost: 3, counter: "counter1" }]
    },
    {
        name: "Recarregar",
        icon: "",
        options: [{ label: "PA", cost: 1, counter: "counter1" }]
    },
    {
        name: "Ataque de Oportunidade",
        icon: "",
        options: [{ label: "PA", cost: 1, counter: "counter1" }]
    },
    {
        name: "Sacar e Ingerir do inventario",
        icon: "",
        options: [
        { label: "1 PA", cost: 1, counter: "counter1" },
        { label: "1 AP", cost: 1, counter: "counter2" }
        ]
    },
    {
        name: "Alterar postura fora do Turno",
        icon: "",
        options: [
        { label: "1 PA", cost: 1, counter: "counter1" },
        { label: "2 AP", cost: 2, counter: "counter2" }
        ]
    },
    {
        name: "Pegar do inventario",
        icon: "",
        options: [
        { label: "1 PA", cost: 1, counter: "counter1" },
        { label: "1 AP", cost: 1, counter: "counter2" }
        ]
    },
    {
        name: "Entregar ou Receber Item",
        icon: "",
        options: [
        { label: "1 PA", cost: 1, counter: "counter1" },
        { label: "2 AP", cost: 2, counter: "counter2" }
        ]
    },
    {
        name: "Teste Passivo",
        icon: "",
        options: [
        { label: "1 PA", cost: 1, counter: "counter1" },
        { label: "1 AP", cost: 1, counter: "counter2" }
        ]
    }
];
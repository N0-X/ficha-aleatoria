export function showInitiative() {
    document.querySelector("#initiativeScreen")?.classList.remove("hidden");
    document.querySelector("#characterScreen")?.classList.add("hidden");
    }

export function showCharacter() {
    document.querySelector("#initiativeScreen")?.classList.add("hidden");
    document.querySelector("#characterScreen")?.classList.remove("hidden");
}
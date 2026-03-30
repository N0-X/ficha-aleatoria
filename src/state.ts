let currentCharacterId: string | null = null;

export function setCurrentCharacter(id: string) {
    currentCharacterId = id;
}

export function getCurrentCharacter() {
    return currentCharacterId;
}
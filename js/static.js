export const RUNE_ARCHITECTURES = ["Enhancing", "Transmutation", "Emission", "Manipulation", "Conjuration", "Specialization"]; // confined to only these
export const RUNE_COMPONENTS = [
    "Lightning", "Fire", "Air", "Water",
    "Advanced Locking", "Necromancy", "Earth",
    "Illusionary", "Space", "Nature", "Monde",
    "Instantiate", "Sealing", "Psychic", "Protecting",
    "Harming", "Shadow", "Holy", "Unholy", "Explosion",
    "Metal", "Cold", "Oil", "Literature", "Locking", 
    "Light", "Dark", "Sound", "Time", "Force", "Life"
]; // more to be added
export const CATEGORIES = [
    "Combat", "Utility", "Healing", "Buff", "Debuff", "Control"
]; // more to be added


// Icons; emoji or svg
export const ICONS = {
    "Default": "❓",

    "Lightning": "⚡",
    "Fire": "🔥",
    "Air": "💨",
    "Water": "💧",
    "Advanced Locking": "🔒",
    "Necromancy": "💀",
    "Earth": "🌍",
    "Illusionary": "👻",
    "Space": "🌌",
    "Nature": "🌿",
    "Monde": "🌙",
    "Instantiate": "🌀",
    "Sealing": "🔏",
    "Psychic": "🌀",
    "Protecting": "🛡️",
    "Harming": "💥",
    "Shadow": "🌑",
    "Holy": "🌟",
    "Unholy": "👿",
    "Explosion": "💥",
    "Metal": "🔩",
    "Cold": "❄️",
    "Oil": "⛽",
    "Literature": "📚",
    "Locking": "🔒",
    "Light": "💡",
    "Dark": "🌚",
    "Sound": "🔊",
    "Time": "⏳",
    "Force": "💪",
    "Life": "🌱",
}


export const g = (tag, args = {classes: [], id: "", children: [], exist: () => {true}, onclick: () => {}}) => {
    if (args.exist != undefined && !args.exist()) return null;
    const element = document.createElement(tag);
    if (args.classes != undefined) element.classList.add(...args.classes);
    if (args.id != undefined) element.id = args.id;
    if (args.children != undefined) args.children.forEach((child) => {
        if (child != null) element.appendChild(child);
    });
    if (args.onclick != undefined) element.addEventListener("click", args.onclick);
    return element;
}

"".__proto__.upperWords = function() {
    return this.split(" ").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
}

var ALL_SPELLS = {}; // {spellId: {name: "", desc: [], categories: [], components: [], architecture: ""}}
var RUNE_COMPONENTS = ["Fire", "Water", "Earth", "Air", "Life", "Death", "Order", "Chaos", "Illusion", "Necromancy"]; // more to be added
var RUNE_ARCHITECTURES = ["Enhancing", "Transmutation", "Emission", "Manipulation", "Conjuration", "Specialization"]; // confined to only these
var CATEGORIES = ["Combat", "Utility", "Healing", "Buff", "Debuff", "Control"];


const readLocalSpellData = async () => {
    // Read allSpells.json and put it into ALL_SPELLS
    let response = await fetch("allSpells.json");
    let s = await response.text();
    
    ALL_SPELLS = JSON.parse(s);
}

const exportSpellData = async () => {
    // log to console
    console.log(JSON.stringify(ALL_SPELLS));
}


const showAllSpells = () => {
    let spellList = document.getElementById("spell-list");

    for (let spellId in ALL_SPELLS) {
        let spell = ALL_SPELLS[spellId];
        let spellDiv = document.createElement("div");
        spellDiv.classList.add("spell");
        spellDiv.innerHTML = `
            <h3>${spell.name}</h3>
            <p>${spell.desc[0]}</p>
        `;

        spellDiv.addEventListener("click", () => {
            showSpell(spellId);
        });

        spellList.appendChild(spellDiv);
    }

}

const main = async () => {
    await readLocalSpellData();
    showAllSpells();
}

main();

import "../static.js";
import { Spell } from "../spells.js";


const showAllSpells = () => {
    const spellList = document.getElementById("spell-list");

    Spell.all().forEach((spell) => {
        const div = spell.createDivCompact();
        div.addEventListener("click", () => {
            openSpellDetails(spell.id);
        });
        spellList.appendChild(div);
    });

}

const closeSpellDetails = () => {
    const spellList = document.getElementById("spell-list");
    const spellDetails = document.getElementById("spell-details");

    spellList.style.display = "block";
    spellDetails.style.display = "none";
}

const openSpellDetails = (id) => {
    const spellList = document.getElementById("spell-list");
    const spellDetails = document.getElementById("spell-details");

    const spell = Spell.find(id);

    const div = spell.createDivDetailed(closeSpellDetails);
    spellDetails.innerHTML = "";
    spellDetails.appendChild(div);
    spellDetails.style.display = "flex";

    spellList.style.display = "none";

}

const showAddSpellButton = async () => {
    const addButton = document.getElementById("add-button");
    addButton.style.display = "none";
    try {
        await fetch("http://localhost:3000/spells");
        document.getElementById("add-button").style.display = "block";
    } catch (error) {
        return
    }
}

const main = async () => {
    showAddSpellButton();

    await Spell.initialize();
    showAllSpells();
    
    const spellList = document.getElementById("spell-list");
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
        spellList.innerHTML = "";
        Spell.all().filter((spell) => {
            return spell.name.toLowerCase().includes(searchInput.value.toLowerCase());
        }).forEach((spell) => {
            const div = spell.createDivCompact();
            div.addEventListener("click", () => {
                openSpellDetails(spell.id);
            });
            spellList.appendChild(div);
        });
    });
}

main();

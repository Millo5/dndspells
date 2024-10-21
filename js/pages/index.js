
import "../static.js";
import { CATEGORIES, g } from "../static.js";
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

let selectedCategories = [];

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

    const filterButton = document.getElementById("filter-button");
    const filterOptions = document.getElementById("filter-options");
    filterButton.addEventListener("click", () => {
        // I want toggling to slide it up and down
        if (filterOptions.style.top === "70px") {
            filterOptions.style.top = "-100px";
        } else {
            filterOptions.style.top = "70px";
        }
    });

    window.addEventListener("scroll", () => {
        filterOptions.style.top = "-100px";
    });

    const filterCategories = document.getElementById("filter-categories");
    CATEGORIES.forEach((category) => {
        const div = g("div", {
            classes: ["selectable"],
            children: [g("p", {children: [document.createTextNode(category)]})]
        });
        div.addEventListener("click", () => {
            if (selectedCategories.includes(category)) {
                selectedCategories = selectedCategories.filter((c) => c !== category);
                div.classList.remove("selected");
            } else {
                selectedCategories.push(category);
                div.classList.add("selected");
            }

            updateSpellList();
        });
        filterCategories.appendChild(div);
    });
}

const updateSpellList = () => {
    const spellList = document.getElementById("spell-list");
    spellList.innerHTML = "";
    // spell.categories
    Spell.all().filter((spell) => {
        return selectedCategories.length === 0 || selectedCategories.some((category) => spell.categories.includes(category));
    }).forEach((spell) => {
        const div = spell.createDivCompact();
        div.addEventListener("click", () => {
            openSpellDetails(spell.id);
        });
        spellList.appendChild(div);
    });
}

main();

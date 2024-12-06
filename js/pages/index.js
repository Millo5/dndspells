
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

let filter = {
    categories: [],
    time: null
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

    // Filter by categories
    const filterButton = document.getElementById("filter-button");
    const filterOptions = document.getElementById("filter-options");
    filterButton.addEventListener("click", () => {
        // I want toggling to slide it up and down
        if (filterOptions.style.top === "70px") {
            filterOptions.style.top = "-200px";
        } else {
            filterOptions.style.top = "70px";
        }
    });

    window.addEventListener("scroll", () => {
        filterOptions.style.top = "-200px";
    });

    const filterCategories = document.getElementById("filter-categories");
    CATEGORIES.forEach((category) => {
        const div = g("div", {
            classes: ["selectable"],
            children: [g("p", {children: [document.createTextNode(category)]})]
        });
        div.addEventListener("click", () => {
            if (filter.categories.includes(category)) {
                filter.categories = filter.categories.filter((c) => c !== category);
                div.classList.remove("selected");
            } else {
                filter.categories.push(category);
                div.classList.add("selected");
            }

            updateSpellListFiltered();
        });
        filterCategories.appendChild(div);
    });


    // Filter by time
    filterCategories.appendChild(g("hr", {}));

    ["Action", "Bonus Action", "Reaction", "Other", "Ritual", "Concentration"].forEach((time) => {
        const div = g("div", {
            classes: ["selectable", "time"],
            children: [g("p", {children: [document.createTextNode(time)]})]
        });
        div.addEventListener("click", () => {
            if (filter.time === time) {
                filter.time = null;
                div.classList.remove("selected");
            } else {
                document.querySelectorAll(".time").forEach((div) => {
                    div.classList.remove("selected");
                });
                filter.time = time;
                div.classList.add("selected");
            }
            updateSpellListFiltered();
        });
        filterCategories.appendChild(div);
    });

}

const updateSpellListFiltered = () => {
    const spellList = document.getElementById("spell-list");
    spellList.innerHTML = "";

    const timeMapping = {
        "Action": (spell) => spell.casting_time.includes("action"),
        "Bonus Action": (spell) => spell.casting_time.includes("bonus"),
        "Reaction": (spell) => spell.casting_time.includes("reaction"),
        "Ritual": (spell) => spell.ritual,
        "Concentration": (spell) => spell.concentration,
        "Other": (spell) => !spell.casting_time.includes("action") && !spell.casting_time.includes("bonus") && !spell.casting_time.includes("reaction")
    }

    // spell.categories
    Spell.all().filter((spell) => {
        // Filter by time
        console.log(spell);
        // if (filter.time !== null && spell.time !== filter.time) return false;
        if (filter.time !== null && !timeMapping[filter.time](spell)) return false;
        // Filter by categories
        return filter.categories.length === 0 || filter.categories.some((category) => spell.categories.includes(category));
    }).forEach((spell) => {
        const div = spell.createDivCompact();
        div.addEventListener("click", () => {
            openSpellDetails(spell.id);
        });
        spellList.appendChild(div);
    });
}

main();

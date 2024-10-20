import { CATEGORIES, RUNE_COMPONENTS, RUNE_ARCHITECTURES } from "../static.js";
import { Spell } from "../spells.js";

var selectedComponents = [];
var selectedCategories = [];
var selectedArchitecture = "";

var currentSpell = Spell.create("new-spell");

const componentsContainer = document.getElementById("components");
const categoriesContainer = document.getElementById("categories");
const architecturesContainer = document.getElementById("architecture");


const main = () => {
    // Initialize the add spell page, start by adding id, components, categories, and architecture.
    // Check if the spell id provided is in the dnd5e database, if it is, fill in the details.
    // then edit the details and save it to the local database.

    console.log(RUNE_COMPONENTS)
    console.log(CATEGORIES)
    console.log(RUNE_ARCHITECTURES)


    // Components
    RUNE_COMPONENTS.forEach((component) => {
        const componentDiv = document.createElement("div");
        componentDiv.innerHTML = component;
        componentDiv.classList.add("selectable");
        componentDiv.addEventListener("click", () => {
            if (selectedComponents.includes(component)) {
                selectedComponents = selectedComponents.filter((c) => c !== component);
                componentDiv.classList.remove("selected");
            } else {
                selectedComponents.push(component);
                componentDiv.classList.add("selected");
            }
        });
        componentsContainer.appendChild(componentDiv);
    });

    // Architecture
    RUNE_ARCHITECTURES.forEach((architecture) => {
        const architectureDiv = document.createElement("div");
        architectureDiv.innerHTML = architecture;
        architectureDiv.classList.add("selectable");
        architectureDiv.addEventListener("click", () => {
            selectedArchitecture = architecture;
            architecturesContainer.querySelectorAll(".selectable").forEach((a) => a.classList.remove("selected"));
            architectureDiv.classList.add("selected");
        });
        architecturesContainer.appendChild(architectureDiv);
    });

    // Categories
    CATEGORIES.forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = category;
        categoryDiv.classList.add("selectable");
        categoryDiv.addEventListener("click", () => {
            if (selectedCategories.includes(category)) {
                selectedCategories = selectedCategories.filter((c) => c !== category);
                categoryDiv.classList.remove("selected");
            } else {
                selectedCategories.push(category);
                categoryDiv.classList.add("selected");
            }
        });
        categoriesContainer.appendChild(categoryDiv);
    });

}

// Search for components
const componentSearch = document.getElementById("component-search");
componentSearch.addEventListener("input", () => {
    const componentsContainer = document.getElementById("components");

    componentsContainer.querySelectorAll(".selectable").forEach((componentDiv) => {
        if (componentDiv.innerHTML.toLowerCase().includes(componentSearch.value.toLowerCase())) {
            componentDiv.style.display = "block";
        } else {
            componentDiv.style.display = "none";
        }
    });
});


// Check spell
const checkButton = document.getElementById("check-spell");
checkButton.addEventListener("click", () => {
    // Validation check
    checkButton.disabled = true;
    document.getElementById("spell-id").classList.remove("error");
    componentsContainer.classList.remove("error");
    categoriesContainer.classList.remove("error");
    architecturesContainer.classList.remove("error");

    const spellId = document.getElementById("spell-id").value;

    if (!spellId || selectedComponents.length === 0 || selectedCategories.length === 0 || !selectedArchitecture) {
        if (!spellId) document.getElementById("spell-id").classList.add("error");
        if (selectedComponents.length === 0) componentsContainer.classList.add("error");
        if (selectedCategories.length === 0) categoriesContainer.classList.add("error");
        if (!selectedArchitecture) architecturesContainer.classList.add("error");

        checkButton.disabled = false;
        return;
    }


    // /getSpell can return 404 if spell not found
    fetch("http://localhost:3000/getSpell", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: spellId,
        }),
    })
        .then((res) => {
            if (res.status === 404) {
                throw new Error("Spell not found");
            }
            return res.json();
        })
        .then((res) => {
            console.log(res);
            currentSpell = Spell.fromJSON(res);
            console.log(currentSpell);

            const currentSpellKeys = Object.keys(currentSpell);
            var spellDiff = Object.keys(res).filter((key) => {
                return !currentSpellKeys.includes(key);
            });

            console.log(spellDiff);

            openDetailsOptions();
        })
        .catch((error) => {
            
            currentSpell = Spell.create(spellId)
                .setName(spellId.split("-").join(" ").upperWords())
                .setCastingTime("1 action")
                .setRange("Self")
                .setDuration("Instantaneous")
                .setComponents("V,S,M");

            openDetailsOptions();
        });
});

const openDetailsOptions = () => {
    checkButton.disabled = false;

    const spellDetails = document.getElementById("spell-details");
    spellDetails.style.display = "flex";
    spellDetails.innerHTML = "";

    // const options = Spell.getOptions();
    const options = ["name", "desc", "higher_level", "level", "casting_time", "range", "duration", "concentration", "ritual", "components"];
    const optionFields = {
        name: "text",
        desc: "textarea",
        higher_level: "text",
        level: "number",
        casting_time: "text",
        range: "text",
        duration: "text",
        concentration: "checkbox",
        ritual: "checkbox",
        components: "text",
    };

    options.forEach((option) => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option");

        const label = document.createElement("label");
        label.innerHTML = option.replace("_", " ").upperWords();
        optionDiv.appendChild(label);

        if (option === "desc") {
            const textarea = document.createElement("textarea");
            textarea.value = currentSpell[option].join("\n\n");
            textarea.addEventListener("input", () => {
                currentSpell[option] = textarea.value.split("\n\n");
            });
            optionDiv.appendChild(textarea);
        } else {
            const input = document.createElement("input");
            input.type = optionFields[option];
            input.value = currentSpell[option];
            input.addEventListener("input", () => {
                currentSpell[option] = input.value;
            });
            optionDiv.appendChild(input);
        }

        spellDetails.appendChild(optionDiv);
    });


    const saveButton = document.createElement("button");
    saveButton.innerHTML = "Save";
    saveButton.addEventListener("click", () => {
        saveSpell();
    });
    spellDetails.appendChild(saveButton);
    
};

const saveSpell = () => {
    const spell = currentSpell;
    spell.setCategories(selectedCategories);
    spell.setRuneComponents(selectedComponents);
    spell.setRuneArchitecture(selectedArchitecture);
    spell.setId(document.getElementById("spell-id").value);

    console.log(JSON.stringify(spell));


    fetch("http://localhost:3000/addSpell", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spell),
    })
        .then((res) => {
            if (res.status === 400) {
                return res.text();
            }
            return res.text();
        })
        .then((res) => {
            console.log(res);
        });
};

main();

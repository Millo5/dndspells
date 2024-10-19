import { CATEGORIES, RUNE_COMPONENTS, RUNE_ARCHITECTURES } from "./static.js";



var selectedComponents = [];
var selectedCategories = [];
var selectedArchitecture = "";

const main = () => {
    console.log(RUNE_COMPONENTS)
    console.log(CATEGORIES)
    console.log(RUNE_ARCHITECTURES)

    const componentsContainer = document.getElementById("components");
    const categoriesContainer = document.getElementById("categories");
    const architecturesContainer = document.getElementById("architecture");

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


var currentSpellInfo = null;


const checkButton = document.getElementById("check-spell");
checkButton.addEventListener("click", () => {
    checkButton.disabled = true;

    const spellId = document.getElementById("spell-id").value;

    if (!spellId || selectedComponents.length === 0 || selectedCategories.length === 0 || !selectedArchitecture) {
        console.log("Please fill in all fields");
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
            currentSpellInfo = res;
            openDetailsOptions();
        })
        .catch((error) => {
            currentSpellInfo = {
                index: spellId,
                name: spellId.split("-").join(" "),
                desc: ["Description not found"],
                level: 0,

                casting_time: "1 action",
                range: "Self",
                duration: "Instantaneous",
                
                concentration: false,
                ritual: false,
                components: "V,S,M",
            }
            openDetailsOptions();
        });
});

const openDetailsOptions = () => {
    checkButton.disabled = false;

    const spellDetails = document.getElementById("spell-details");
    spellDetails.style.display = "flex";
    spellDetails.innerHTML = "";

    const options = ["name", "desc", "level", "casting_time", "range", "duration", "concentration", "ritual", "components"];
    const optionFields = {
        name: "text",
        desc: "textarea",
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
        label.innerHTML = option;
        optionDiv.appendChild(label);

        if (option === "desc") {
            const textarea = document.createElement("textarea");
            // textarea.value = currentSpellInfo[option][0];
            // textarea.addEventListener("input", () => {
            //     currentSpellInfo[option][0] = textarea.value;
            // });
            textarea.value = currentSpellInfo[option].join("\n\n");
            textarea.addEventListener("input", () => {
                currentSpellInfo[option] = textarea.value.split("\n\n");
            });
            optionDiv.appendChild(textarea);
        } else {
            const input = document.createElement("input");
            input.type = optionFields[option];
            input.value = currentSpellInfo[option];
            input.addEventListener("input", () => {
                currentSpellInfo[option] = input.value;
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
    const spell = currentSpellInfo;

    spell.categories = selectedCategories;
    spell.components = selectedComponents;
    spell.architecture = selectedArchitecture;
    spell.id = spell.index;

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

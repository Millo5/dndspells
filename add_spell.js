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


main();

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



const addButton = document.getElementById("add-spell");
addButton.addEventListener("click", () => {
    const spellId = document.getElementById("spell-id").value;
    // const spell = getSpell(spellId);

    console.log(spellId);

    if (!spellId || selectedComponents.length === 0 || selectedCategories.length === 0 || !selectedArchitecture) {
        alert("Please fill in all fields");
        return;
    }

    fetch("/addSpell", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: spellId,
            name: "testname",
            desc: ["testdesc"],
            components: selectedComponents,
            categories: selectedCategories,
            architecture: selectedArchitecture,
        }),
    })
        .then((res) => res.text())
        .then((res) => {
            alert(res);
            // window.location.href = "./index.html";
        });
});

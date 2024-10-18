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
}


main();


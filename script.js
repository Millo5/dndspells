var ALL_SPELLS = {};

/*

{"id":"fireball","name":"Fireball","desc":["A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.","The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried."],"categories":["Combat"],"components":["Fire"],"architecture":"Emission","level":3,"casting_time":"1 action","range":"150 feet","duration":"Instantaneous","concentration":false,"ritual":false}

*/

const readLocalSpellData = async () => {
    // Read allSpells.json and put it into ALL_SPELLS
    let response = await fetch("allSpells.json");
    ALL_SPELLS = await response.json();
}

const g = (tag, args = {classes: [], id: "", children: [], exist: () => {true}, onclick: () => {}}) => {
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

const showAllSpells = () => {
    const spellList = document.getElementById("spell-list");

    for (const i in ALL_SPELLS) {
        const spell = ALL_SPELLS[i];
        const name = spell.name;
        const categories = spell.categories;
        const level = spell.level;
        const castingTime = spell.casting_time;

        const spellDiv = g("div", {classes: ["spell"], id: spell.id, children: [
            g("div", {classes: ["left"], children: [
                g("div", {classes: ["spell-header"], children: [
                    g("span", {classes: ["icon"], children: [document.createTextNode(spell.icon)], exist: () => spell.icon != undefined}),
                    g("span", {classes: ["level"], children: [document.createTextNode(`${level}`)]}),
                    g("h3", {children: [document.createTextNode(name)]})
                ]}),
                g("div", {classes: ["categories"], children: categories.map((category) => {
                    return g("span", {children: [document.createTextNode(category)]});
                })})
            ]}),
            g("div", {classes: ["right"], children: [
                g("span", {classes: ["casting-time"], children: [document.createTextNode(`${castingTime}`)]})
            ]})
        ]});

        spellDiv.addEventListener("click", () => {
            openSpellDetails(spell.id);
        });

        spellList.appendChild(spellDiv);
    }

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

    const spell = ALL_SPELLS.find((spell) => spell.id == id);

    const div = g("div", {classes: ["spell-details"], children: [
        g("div", {classes: ["spell-header"], children: [
            g("span", {classes: ["icon"], children: [document.createTextNode(spell.icon)], exist: () => spell.icon != undefined}),
            g("span", {classes: ["level"], children: [document.createTextNode(`${spell.level}`)]}),
            g("h3", {children: [document.createTextNode(spell.name)]})
        ]}),
        g("div", {classes: ["categories"], children: spell.categories.map((category) => {
            return g("span", {children: [document.createTextNode(category)]});
        })}),
    ]});

    spellDetails.innerHTML = "";
    spellDetails.appendChild(
        g("button", {classes: ["close"], children: [document.createTextNode("Close")], exist: () => true, onclick: closeSpellDetails}),
    );
    spellDetails.appendChild(div);
    spellDetails.style.display = "flex";

    spellList.style.display = "none";
}

const main = async () => {
    await readLocalSpellData();
    showAllSpells();

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
        const spellList = document.getElementById("spell-list");
        
        Array.from(spellList.children).forEach((spellDiv) => {
            spellDiv.style.display = "none";
        });
    });

}

main();

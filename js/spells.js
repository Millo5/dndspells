
var ALL_SPELLS = [];

import { g } from "./static.js";

const loadSpells = async () => {
    let response = await fetch("allSpells.json");
    let spells = await response.json();

    ALL_SPELLS = [];
    spells.forEach(spell => {
        ALL_SPELLS.push(Spell.fromJSON(spell));
    });
}


export class Spell {
    static initialize = () => loadSpells();
    static all = () => ALL_SPELLS;
    static find = (id) => ALL_SPELLS.find((spell) => spell.id == id);
    static getFieldInputs = () => {
        return {
            name: "text",
            desc: "textarea",
            higher_level: "textarea",
            level: "number",
            casting_time: "text",
            range: "text",
            duration: "text",
            concentration: "checkbox",
            ritual: "checkbox",
            components: "text",
            icon: "text",
        }
    }
    static isValid = (spell) => { // returns an array of missing fields
        const fields = Object.keys(new Spell());
        console.log(fields);
        const missing = [];
        fields.forEach((field) => {
            if (spell[field] === undefined) missing.push(field);
        });
        return missing;
    }

    constructor(id) {

        this.id = id;
        this.name = "";
        this.desc = [];
        this.higher_level = "";
        this.level = 0;
        this.casting_time = "";
        this.range = "";
        this.duration = "";
        this.concentration = false;
        this.ritual = false;
        this.components = "";
        this.icon = "";

        this.rune_components = [];
        this.rune_architecture = "";

        this.categories = [];
    }

    setId               = (id)                  => { this.id = id; return this; };
    setName             = (name)                => { this.name = name; return this; };
    setDesc             = (desc)                => { this.desc = desc; return this; };
    setHigherLevel      = (higher_level)        => { this.higher_level = higher_level; return this; };
    setLevel            = (level)               => { this.level = level; return this; };
    setCastingTime      = (casting_time)        => { this.casting_time = casting_time; return this; };
    setRange            = (range)               => { this.range = range; return this; };
    setDuration         = (duration)            => { this.duration = duration; return this; };
    setConcentration    = (concentration)       => { this.concentration = concentration; return this; };
    setRitual           = (ritual)              => { this.ritual = ritual; return this; };
    setComponents       = (components)          => { this.components = components; return this; };
    setIcon             = (icon)                => { this.icon = icon; return this; };
    setCategories       = (categories)          => { this.categories = categories; return this; };
    setRuneComponents   = (rune_components)     => { this.rune_components = rune_components; return this; };
    setRuneArchitecture = (rune_architecture)   => { this.rune_architecture = rune_architecture; return this; };


    static create = (id) => new Spell(id);
    static fromJSON(json) {
        return new Spell(json.id)
            .setName(json.name)
            .setDesc(json.desc)
            .setHigherLevel(json.higher_level)
            .setLevel(json.level)
            .setCastingTime(json.casting_time)
            .setRange(json.range)
            .setDuration(json.duration)
            .setConcentration(json.concentration)
            .setRitual(json.ritual)
            .setComponents(json.components + (json.material ? ` (${json.material})` : ""))
            .setIcon(json.icon)
            .setCategories(json.categories)
            .setRuneComponents(json.rune_components)
            .setRuneArchitecture(json.rune_architecture);
    }



    /*
    *   Only contains the name, level, icon, categories and casting time
    */
    createDivCompact() {
        return g("div", {classes: ["spell"], id: this.id, children: [
            g("div", {classes: ["left"], children: [
                g("div", {classes: ["spell-header"], children: [
                    g("span", {classes: ["level"], children: [document.createTextNode(`${this.level}`)]}),
                    g("span", {classes: ["icon"], children: [document.createTextNode(this.icon)], exist: () => this.icon != undefined}),
                    g("h3", {children: [document.createTextNode(this.name)]})
                ]}),
                g("div", {classes: ["categories"], children: this.categories.map((category) => {
                    return g("span", {children: [document.createTextNode(category)]});
                })})
            ]}),
            g("div", {classes: ["right"], children: [
                g("span", {classes: ["casting-time"], children: [document.createTextNode(`${this.casting_time}`)]})
            ]})
        ]});
    }

    createDivDetailed(closeFunction) {
        return g("div", {classes: ["spell-details"], children: [
            g("button", {classes: ["close"], children: [document.createTextNode("Close")], exist: () => true, onclick: closeFunction}),

            g("div", {classes: ["spell-header"], children: [
                g("span", {classes: ["level"], children: [document.createTextNode(`${this.level}`)]}),
                g("span", {classes: ["icon"], children: [document.createTextNode(this.icon)], exist: () => this.icon != undefined}),
                g("h3", {children: [document.createTextNode(this.name)]})
            ]}),

            g("div", {classes: ["categories"], children: this.categories.map((category) => {
                return g("span", {children: [document.createTextNode(category)]});
            })}),

            g("div", {classes: ["details"], children: 
                ["casting_time", "range", "components", "duration"].map((key) => {
                    return g("span", {classes: [key], children: [
                        g("span", {classes: ["label"], children: [document.createTextNode(key.replace("_", " ").upperWords()+":")]}),
                        document.createTextNode(` ${this[key]}`)
                    ]});
                })
            }),

            g("div", {classes: ["description"], children: this.desc.map((desc) => {
                return g("p", {children: [document.createTextNode(desc)]});
            })}),
            g("div", {classes: ["higher-level"], children: [
                g("span", {classes: ["label"], children: [document.createTextNode("At Higher Levels:")]}),
                g("p", {children: [document.createTextNode(this.higher_level)]})
            ], exist: () => this.higher_level && this.higher_level.length > 0}),

            g("div", {classes: ["rune"], children: [
                g("span", {children: [document.createTextNode(this.rune_architecture)]}),
                g("div", {classes: ["rune-components"], children: this.rune_components.map((component) => {
                    return g("span", {children: [document.createTextNode(component)]});
                }
                )})
            ]}),

            g("button", {classes: ["edit"], children: [document.createTextNode("Edit")], onclick: () => {
                window.location.href = `editSpell.html?id=${this.id}`;
            }})
        ]});
    }

}

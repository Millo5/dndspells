// This is a simple server that serves the dndspells app.
// it serves and modifies static files
// it also serves the spells.json file


// allSpells.json:
// [{id: "", name: "", desc: [], categories: [], components: [], architecture: ""}]

const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client')));

const getSpells = () => fs.readFileSync(path.join(__dirname, '../allSpells.json'));

const isSpellValid = (spell) => {
    const check = ['id', 'name', 'desc', 'categories', 'components', 'architecture'];
    const invalid = check.filter((key) => !spell[key]);
    return invalid;
};

app.get('/spells', (req, res) => {
    const spells = getSpells();
    res.json(JSON.parse(spells));
});

app.get('/spells/:spellId', (req, res) => {
    const spells = JSON.parse(getSpells());
    const spell = spells.find((spell) => spell.id === req.params.spellId);
    if (!spell) {
        res.status(404).send('Spell not found');
        return;
    }
    res.json(spell);
});

app.post('/addSpell', (req, res) => {
    const spell = req.body;

    const wrong = isSpellValid(spell);
    if (wrong.length > 0) {
        res.status(400).send('Spell is invalid; missing: ' + wrong.join(', '));
        return;
    }
    const spells = JSON.parse(getSpells());
    spells.push(spell);
    fs.writeFileSync(path.join(__dirname, '../allSpells.json'), JSON.stringify(spells));
    res.status(200).send('Spell added successfully');
});

app.post('/removeSpell', (req, res) => {
    const spellId = req.body.id;
    const spells = JSON.parse(getSpells());
    const newSpells = spells.filter((spell) => spell.id !== spellId);
    fs.writeFileSync(path.join(__dirname, '../allSpells.json'), JSON.stringify(newSpells));
    res.status(200).send('Spell removed successfully');
});

app.post('/updateSpell', (req, res) => {
    const spell = req.body;
    const spells = JSON.parse(getSpells());
    const newSpells = spells.map((s) => {
        if (s.id === spell.id) {
            return spell;
        }
        return s;
    });
    fs.writeFileSync(path.join(__dirname, '../allSpells.json'), JSON.stringify(newSpells));
    res.status(200).send('Spell updated successfully');
});



// get spell from dnd5e.wikidot.com
const getSpell = async (spellId) => {
    // let spell = {
    //     name: "",
    //     desc: [],
    // };

    // let response = await fetch(`https://dnd5e.wikidot.com/spell:${spellId}`);
    // let s = await response.text();

    // let temp = document.createElement("div");
    // temp.innerHTML = s;

    // let content = temp.querySelector("#page-content");
    
    // spell.name = spellId.split("-").join(" ").toUpperCase();
    // content.querySelectorAll("p").forEach(p => {
    //     spell.desc.push(p.innerText);
    // });

    // return spell;

    let response = await fetch(`https://dnd5e.wikidot.com/spell:${spellId}`);
    let s = await response.text();

    return s;
}
app.post('/getSpell', async (req, res) => {
    const spellId = req.body.id;
    const spell = await getSpell(spellId);
    res.json(spell);
});


/*
example of how to add a spell

fetch('http://localhost:3000/addSpell', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: 'spell-id',
        name: 'spellName',
        desc: ['spell description'],
        categories: ['Combat'],
        components: ['Lightning'],
        architecture: 'Enhancing',
    }),
})

// Access to fetch at 'http://localhost:3000/addSpell' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

// fix:
// add this to the fetch request
// mode: 'cors'
// or
// mode: 'no-cors'


*/


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



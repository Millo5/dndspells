// This is a simple server that serves the dndspells app.
// it serves and modifies static files
// it also serves the spells.json file


// allSpells.json:
// [{id: "", name: "", desc: [], categories: [], components: [], architecture: ""}]

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client')));

const getSpells = () => fs.readFileSync(path.join(__dirname, '../allSpells.json'));
const isSpellValid = (spell) => {
    // return what is invalid
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
    if (wrong) {
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
    
*/


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



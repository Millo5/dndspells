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
    const check = ['id', 'name', 'desc', 'categories', 'rune_components', 'rune_architecture', 'level', 'casting_time', 'range', 'duration', 'concentration', 'ritual'];
    const invalid = check.filter((key) => spell[key] === undefined);
    return invalid;
};

app.get('/spells', (req, res) => {
    console.log(`${req.ip} requested all spells`);
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
    console.log(req.body);
    const spell = req.body;

    const wrong = isSpellValid(spell);
    if (wrong.length > 0) {
        console.log('Spell is invalid; missing: ' + wrong.join(', '));
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
    let spell = req.body;
    let replace = spell.id;

    console.log(req.body)

    if (req.body.replace !== undefined) {
        replace = req.body.replace;
        spell = req.body.with;
    }

    const spells = JSON.parse(getSpells());
    const newSpells = spells.map((s) => {
        if (s.id === replace) return spell;
        return s;
    });
    // fs.writeFileSync(path.join(__dirname, '../allSpells.json'), JSON.stringify(newSpells));
    res.status(200).send('Spell updated successfully');

});



// get spell from dnd5e api
const getSpell = async (spellId) => {
    let response = await fetch(`https://www.dnd5eapi.co/api/spells/${spellId}`);
    if (response.status !== 200) {
        return null;
    }
    return await response.json();
}
app.post('/getSpell', async (req, res) => {
    const spellId = req.body.id;
    const spell = await getSpell(spellId);
    if (!spell) {
        res.status(404).send('Spell not found');
        return;
    }
    res.json(spell);
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



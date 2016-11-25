'use strict';
let express = require('express');
let api = express();
const fs = require('fs');

let resource = './resources/exerciseCatalog.json';

let exercises = fs.readFileSync(resource, 'utf8');
exercises = JSON.parse(exercises);

api.get('/', (req, res) => {
    res.json(exercises);
});

api.put('/', (req, res) => {
    fs.writeFile(resource, exercises, (err, data) => {
        res.status(500).send({ error: 'Unimplemented' });
    });
});

exports.default = api;
'use strict';
let routes = require('express').Router();
const fs = require('fs');

let resource = './resources/exerciseCatalog.json';

let exercises = fs.readFileSync(resource, 'utf8');
exercises = JSON.parse(exercises);

routes.get('/', (req, res) => {
    res.json(exercises);
});

routes.put('/', (req, res) => {
    fs.writeFile(resource, exercises, (err, data) => {
        res.status(500).send({ error: 'Unimplemented' });
    });
});

exports.default = routes;
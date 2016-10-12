'use strict';
let express = require('express');
let api = express();
const fs = require('fs');

let resource = './resources/workoutHistory.json';

let workouts = JSON.parse(fs.readFileSync(resource, 'utf8'));
let nextId = workouts[workouts.length-1].id + 1;

api.get('/', (req, res) => {
    res.send(workouts);
});

api.post('/', (req, res) => {
    let workout = req.body;
    let errorMessage = null;
    if (!workout.notes) {
        errorMessage = 'Missing notes property';
    } else if (workout.exercises.length <= 0) {
        errorMessage = 'Missing exercises property';
    }

    if (errorMessage) {
        res.status(500).send({ error: errorMessage });
    } else {
        workout.id = nextId++;
        workout.date = Date.now();
        workouts.push(workout);
        fs.writeFileSync(resource, JSON.stringify(workouts));
        res.send(workout);
    }
});

exports.default = api;
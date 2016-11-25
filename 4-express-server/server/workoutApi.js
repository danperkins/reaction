'use strict';
let express = require('express');
let api = express();
const fs = require('fs');

let resource = './resources/workoutHistory.json';

let workouts = JSON.parse(fs.readFileSync(resource, 'utf8'));
let nextId = parseInt(workouts[workouts.length-1].id) + 1;
if (!nextId) {
    nextId = Date.now();
}

api.get('/', (req, res) => {
    res.json(workouts);
});

api.delete('/:workoutId', (req, res) => {
    let newWorkouts = workouts.filter((w) => w.id !== req.params.workoutId);

    if (newWorkouts.length < workouts.length) {
        workouts = newWorkouts;
        fs.writeFile(resource, JSON.stringify(workouts), (err, data) => {
            if (err) {
                var error = {
                    code: 'InternalServerError',
                    message: err
                };
                res.status(500).send({ error: error });
            }
            res.status(204).end();        
        });
    } else {
        res.status(404).send({
            error: {
                code: 'NotFound',
                message: 'Workout ID not found'
            }
        });
    }
});

api.post('/', (req, res) => {
    let workout = req.body;
    let error = null;
    if (!workout.notes) {
        error = {
            code: 'BadArgument',
            message: 'Notes property must not be empty',
            target: 'notes'
        };
    } else if (workout.exercises.length <= 0) {
        error = {
            code: 'BadArgument',
            message: 'Exercises property must not be empty',
            target: 'exercises'
        };
    }

    if (error) {
        res.status(400).send({ error: error });
    } else {
        workout.id = (nextId++).toString();
        workout.date = Date.now();
        workouts.push(workout);
        fs.writeFile(resource, JSON.stringify(workouts, null, 4), (err, data) => {
            if (err) {
                error = {
                    code: 'InternalServerError',
                    message: err
                };
                res.status(500).send({ error: error });
            } else {
                res.status(201).json(workout);
            }
        });
    }
});

exports.default = api;
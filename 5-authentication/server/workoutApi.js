'use strict';
let routes = require('express').Router();
const fs = require('fs');
//const authRequired = require('./auth').required;
const axios = require('axios');
const auth = require('./auth');
const passport = require('passport');

let resource = './resources/workoutHistory.json';

let workouts = JSON.parse(fs.readFileSync(resource, 'utf8'));

routes.get('/', auth.validateJwt, (req, res) => {
    res.json(workouts[req.userId]);
});

routes.delete('/:workoutId', auth.validateJwt, (req, res) => {
    let notFound = true;
    const userWorkouts = workouts[req.userId];
    if (userWorkouts) {
        let newWorkouts = userWorkouts.filter((w) => w.id !== req.params.workoutId);
        
        if (newWorkouts.length < userWorkouts.length) {
            workouts[req.userId] = newWorkouts;
            notFound = false;
            fs.writeFile(resource, JSON.stringify(workouts, null, 4), (err, data) => {
                if (err) {
                    var error = {
                        code: 'InternalServerError',
                        message: err
                    };
                    res.status(500).send({ error: error });
                }
                res.status(204).end();        
            });  
        }
    }

    if (notFound) {
        res.status(404).send({
            error: {
                code: 'NotFound',
                message: 'Workout ID not found'
            }
        });
    }
});

routes.post('/', auth.validateJwt, (req, res) => {
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
    } else if (req.userId) {
        const now = Date.now();
        workout.id = now.toString();
        workout.date = now;
        if (!workouts[req.userId]) {
            workouts[req.userId] = [];
        }
        workouts[req.userId].push(workout);
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

exports.default = routes;
'use strict';
let express = require('express');
let api = express();

api.use('/exercises', require('./exerciseApi').default);
api.use('/workouts', require('./workoutApi').default);

exports.default = api;
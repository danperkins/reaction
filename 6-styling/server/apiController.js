'use strict';
let routes = require('express').Router();

routes.use('/exercises', require('./exerciseApi').default);
routes.use('/workouts', require('./workoutApi').default);

exports.default = routes;
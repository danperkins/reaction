'use strict';
let express = require('express');
let api = express();

api.use('/exercise', require('./exerciseApi').default);
api.use('/workout', require('./workoutApi').default);

exports.default = api;
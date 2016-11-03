'use strict';
let express = require('express');
const fs = require('fs');
let bodyParser = require('body-parser');
const pug = require('pug');

let app = express();
app.use(bodyParser.json());
app.use(express.static('dist'));
app.set('view engine', 'pug');

let apiController = require('./server/apiController').default;
app.use('/api', apiController);


let compiledTemplate = pug.compileFile('./views/index.pug');
app.get('/', (req, res) => {
    res.send(compiledTemplate({ title: 'PUG Workout Tracker' }));
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});

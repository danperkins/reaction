const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const pug = require('pug');
const compiledTemplate = pug.compileFile('./views/index.pug');

app.use(express.static('dist'));

const apiController = require('./server/apiController').default;
app.use('/api', apiController);

app.get('/', (req, res) => {
    res.send(compiledTemplate({ title: 'PUG Compiled Workout Tracker' }));
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});

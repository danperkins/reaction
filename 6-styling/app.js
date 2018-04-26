const express = require('express');
const passport = require('passport');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const compression = require('compression');
app.use(compression({ threshold: 0 }));

app.use(passport.initialize());

const pug = require('pug');
const compiledTemplate = pug.compileFile('./views/index.pug');

app.use(express.static('dist'));

const apiController = require('./server/apiController').default;
app.use('/api', apiController);

const auth = require('./server/auth');
app.use(auth.router);

app.get('/', (req, res) => {
    res.send(compiledTemplate({ title: 'Workout Planner' }));
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});

'use strict';
let express = require('express');
const fs = require('fs');
let bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());

app.use(express.static('dist'));

let apiController = require('./server/apiController').default;

app.use('/api', apiController);

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Setup</title>
        </head>
        <body>
            <div id="appRoot"></div>
            <script src="index.js"></script>
        </body>
    </html>      
    `);
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});

/*var admin = express();

admin.get('/', function (req, res) {
  console.log(admin.mountpath); // [ '/adm*n', '/manager' ]
  res.send('Admin Homepage');
});

var secret = express();
secret.get('/', function (req, res) {
  console.log(secret.mountpath); // /secr*t
  res.send('Admin Secret');
});

admin.use('/secr*t', secret); // load the 'secret' router on '/secr*t', on the 'admin' sub app
app.use(['/adm*n', '/manager'], admin); // load the 'admin' router on '/adm*n' and '/manager', on the parent app

/*app.use(function (req, res) {
    res.send("Everything else");
});

var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
}); */
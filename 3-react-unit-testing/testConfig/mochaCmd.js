// This file is used for running tests through Mocha from the command line/gulp task
var jsdom = require('jsdom').jsdom;
var g = global;
g.document = jsdom('<html><body></body></html>');
g.window = document.defaultView;
g.navigator = {
    userAgent: 'node.js'
};

// This line is here to fix mocking HTTP requests in JSDOM
g.XMLHttpRequest = g.window.XMLHttpRequest;

// This is a link to the webpacked bundle of tests
require('../test.js');
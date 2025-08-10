const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    app.set('view engine', 'ejs'); // set view engine to ejs 
    app.set('views', path.join('./src', 'views')); // set views directory using path module
    app.use(express.static(path.join('./src', 'public'))); // set static files directory using path module
}

module.exports = configViewEngine;
const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'views'));
    app.use(express.static(path.join(__dirname, '..', 'src', 'public')));
}

module.exports = configViewEngine;
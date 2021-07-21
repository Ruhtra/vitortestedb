const express = require('express')

module.exports = (app) => {
    app.use(express.static('./src/public'))
    app.set('view engin', 'ejs')
    app.set('views', './src/views')
    app.set('view cache', true);
}
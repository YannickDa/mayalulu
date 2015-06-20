"use strict";

var $ = require('jquery');

module.exports = {
    app: require('./src/application'),
    model: require('./src/model'),
    component: require('./src/component'),
    view: require('./src/view'),
    routes: require('./src/routes'),
    $: $
};

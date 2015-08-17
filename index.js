"use strict";

var $ = require('jquery');

module.exports = {
    app: require('./src/application'),
    model: require('./src/model'),
    collection: require('./src/collection'),
    component: require('./src/component'),
    view: require('./src/view'),
    routes: require('./src/routes'),
    $: $
};

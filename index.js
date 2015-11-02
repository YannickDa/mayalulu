"use strict";

var $ = require('jquery');
require('jquery-ui');

var Backbone = require('backbone');
Backbone.$ = $;

require('./src/plugins/backbone.tojson');
require('./src/plugins/jquery.serializeObject');
require('./src/plugins/jquery.displayErrorMessages');

module.exports = {
    app: require('./src/application'),
    model: require('./src/model'),
    controller: require('./src/controller'),
    collection: require('./src/collection'),
    component: require('./src/component'),
    view: require('./src/view'),
    viewCollection: require('./src/view_collection'),
    routes: require('./src/routes'),
    $: $
};

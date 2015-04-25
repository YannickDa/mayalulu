"use strict";

var Backbone = require("backbone");
var model = require("./model");

var Collection = Backbone.Collection.extend({
    model: model
});

module.exports = Collection;


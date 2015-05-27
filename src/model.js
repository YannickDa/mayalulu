"use strict";

var Backbone = require("backbone");

var Model = Backbone.Model.extend({
    idAttribute: '_id',

    hasValue: function (value) {
        return value !== undefined && value !== null;
    }
});

module.exports = Model;

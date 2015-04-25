"use strict";

var Backbone = require("backbone");

var Model = Backbone.Model.extend({
    remove: function () {
        this.trigger("destroy", this);
        this.off();
        this.stopListening();
    }
});

module.exports = Model;

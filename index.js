"use strict";

var Backbone = require("backbone");
var jQuery   = require("jquery");
var promise  = require("promisejs");

Backbone.$ = jQuery;

var Mayalulu = (function () {

    var Mayalulu = Backbone.Model.extend({
        defaults: {
            currentPage: null
        },

        constructor: function () {
            this.router = new Backbone.Router();
        },

        navigate: function (url) {
            if (this.get("currentPage")) {
                return this.get("currentPage").hide().then(function () {
                    return this.router.navigate(url, {trigger: true});
                }, this);
            }
            else {
                return this.router.navigate(url, {trigger: true});
            }
        },

        start: function (initAll) {
            console.log("Init app");
            promise.join(initAll).then(function () {
                console.log("Start history");
                Backbone.history.start({
                    pushState: true
                });
            }, this);
        },

        Component:  require("./src/component"),
        Model:      require("./src/model"),
        Collection: require("./src/collection"),
        View:       require("./src/view"),
        Popup:      require("./src/popup"),

        $: jQuery,

        promise: promise
    });

    return new Mayalulu();
})();

module.exports = Mayalulu; 

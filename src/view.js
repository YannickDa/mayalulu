"use strict";

var Backbone = require("backbone");
var _        = require("underscore");
var promise  = require("promisejs");

var View = Backbone.View.extend({
    constructor: function (options) {
        Backbone.View.apply(this, arguments);

        options = options || {};

        this.data = options.data || {};
        if (this.id && document.getElementById(this.id + "Data")) {
            this.data = _.extend(this.data, JSON.parse(document.getElementById(this.id + "Data")));
        }

        this.parent = options.parent || null;

        if (this.init) {
            this.init();
        }
    },

    setParent: function (view) {
        this.parent = view;
    },

    hide: function () {
        var p = new promise.Promise();

        this.$el.stop().fadeOut('fast', function () {
            Backbone.$(this).remove();
            p.done();
        });

        return p;
    },

    render: function (data) {
        var elementsJQuery = {};
        if (this.model && !data) {
            this.data = this.model.toJSON();
        }
        else {
            this.data = data || {};
        }

        _(data).forEach(function (val, key) {
            if (val instanceof Backbone.View) {
                elementsJQuery[key] = val.$el;
                delete this.data[key];
            }
            else if (val instanceof Backbone.$) {
                elementsJQuery[key] = val;
                delete this.data[key];
            }
        }, this);

        this.$el.html(this.template(this.data));

        _(elementsJQuery).forEach(function (jq, key) {
            this.$el.find("." + key + ", #" + key).html(jq);
        }, this);

        if (this.parent) {
            this.parent.$el.appendChild(this.$el);
            this.parent.render();
        }
        else if (!this.noAutoInsert) {
            Backbone.$("#page").html(this.$el);
        }

        return this;
    },

    template: function () { },

    remove: function () {
        Backbone.View.prototype.remove.call(this, arguments);
        if (this.model) {
            this.model.remove();
            this.model = null;
        }

        if (this.parent) {
            this.parent.remove();
        }
    }
});

module.exports = View;

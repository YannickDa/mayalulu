'use strict';

var Backbone = require('backbone');
var $        = require('jquery');
var _        = require('underscore');
var promise  = require('promisejs');

var View = Backbone.View.extend({
    childViews: {},

    remove: function () {
        _(this.childViews).forEach(function (view) {
            view.remove();
        });

        Backbone.View.prototype.remove.call(this);
    },

    hide: function () {
        var p = new promise.Promise();

        this.$el.stop().fadeOut('fast', function () {
            $(this).remove();
            p.done();
        });

        return p;
    },

    render: function () {
        var data = {};
        if (this.model) {
            data = this.model.toJSON ? this.model.toJSON():this.model;
        }

        this.$el.html(this.template(data));

        return this;
    },

    template: function () {
        return '';
    }
});

module.exports = View;

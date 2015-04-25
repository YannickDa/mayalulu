"use strict";

var Backbone = require("backbone");
var _        = require("underscore");

var Popup = Backbone.View.extend({
    tagName: 'div',
    className: 'popup',

    render: function (data) {
        var content = '';

        if (this.template) {
            content = this.template(data);
        }

        this.$el.html(this._template({
            content: content
        }));
    },

    _template: _.template(
        '<div class="popup-content">' +
            '<%= content %>' +
        '</div>'
    )
});

module.exports = Popup;

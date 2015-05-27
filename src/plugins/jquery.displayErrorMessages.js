'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var ErrorElement = Backbone.View.extend({
    tagName: 'div',
    className: 'error',

    show: function () {
        this.$el.slideDown('fast');
    },

    render: function (message) {
        this.$el.html(message);
        this.$el.hide();
    }
});



var errors = [];

$.fn.displayErrorMessages = function (messagesOrReset) {
    if (_.isObject(messagesOrReset)) {
        var form = this,
            first = true;

        _(messagesOrReset).forEach(function (message, field) {
            var item = new ErrorElement();
            item.render(message);

            var $input = $('[name="' + field + '"]', form);
            if (!$input.length) {
                $input = $('#' + field, form);
            }
            if (!$input.length) {
                $input = $('.' + field, form);
            }
        
            if ($input.length) {
                if ($input.closest('div.control').length) {
                    $input.closest('div.control').append(item.$el);
                }
                else if ($input.closest('fieldset').length) {
                    $input.closest('fieldset').append(item.$el);
                }
                else {
                    if ($input.is('div, span, ul, li, p')) {
                        $input.append(item.$el);
                    }
                    else {
                        $input.after(item.$el);
                    }
                }

                item.show();

                if ($input.is('input, textarea') && first === true) {
                    first = false;
                    $input.focus();
                }

                errors.push(item);
            }
        }, this);
    }
    else {
        _(errors).forEach(function (item) {
            item.remove();
        });

        errors = [];
    }
};

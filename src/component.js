'use strict';

var Backbone = require('backbone');
var promise  = require('promisejs');
var _        = require('underscore');

var Component = Backbone.Model.extend({
    init: function () {
        var p = new promise.Promise();

        var viewObjects = this.viewObjects || {};

        if (this.modelClass && !this.model) {
            this.model = new this.modelClass();
        }

        if (this.collectionClass && !this.collection) {
            this.collection = new this.collectionClass();
        }

        if (this.viewClass && !this.view) {
            var viewOptions = this.viewOptions || {};

            if (this.model) {
                viewOptions.model = this.model;
            }

            if (this.collection) {
                viewOptions.collection = this.collection;
            }

            this.view = new this.viewClass(viewOptions);
        }
        else if (this.view) {
            this.view.delegateEvents();
        }

        if (viewObjects && _.size(viewObjects) > 0) {
            _(viewObjects).forEach(function (obj, key) {
                this.view[key] = obj;
            }, this);
        }

        p.done();
        return p;
    },

    open: function ($toElement, position, animate) {
        var p = new promise.Promise();

        position = position || 'html';
        animate = animate || 'fade';

        this.init().then(function () {
            if (this.view && !document.contains(this.view.el)) {
                if (this.view.init) {
                    this.view.init();
                }

                this.view.render();

                if ($toElement) {
                    if (position && position === 'append') {
                        $toElement.append(this.view.$el.hide());
                    }
                    else {
                        $toElement.html(this.view.$el.hide());
                    }

                    if (animate && animate === 'fade') {
                        this.view.$el.fadeIn('fast', _.bind(function () {
                            p.done(this);
                        }, this));
                    }
                    else if (animate && animate === 'slide') {
                        this.view.$el.slideDown('fast', _.bind(function () {
                            p.done(this);
                        }, this));
                    }
                    else {
                        this.view.$el.show();
                        p.done(this);
                    }
                }
                else {
                    p.done(this);
                }
            }
            else {
                if (this.view.init) {
                    this.view.init();
                }

                p.done(this);
            }
        }, this);

        return p;
    },

    close: function () {
        var p = new promise.Promise();

        if (this.view) {
            this.view.$el.fadeOut('fast', _.bind(function () {
                this.view.remove();
                this.view = null;
                p.done();
            }, this));
        }
        else {
            p.done();
        }

        return p;
    }
});

module.exports = Component;

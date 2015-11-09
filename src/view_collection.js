'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var View = require('./view');

var ViewCollection = View.extend({
    collectionView: null,

    childViews: null,

    rendered: false,

    initialize: function () {
        this.childViews = {};
        this.listenTo(this.collection, 'add', this.addChild);
        this.listenTo(this.collection, 'remove', this.removeChild);
    },

    addChild: function (model) {
        var childView = new this.collectionView({
            model: model
        });

        childView.render();

        this.childViews[model.id] = childView;

        if (this.rendered) {
            this.renderChild(childView);
        }
    },

    renderChild: function (view) {
        this.$el.append(view.el);
    },

    removeChild: function (modelOrView) {
        var model = modelOrView;
        if (modelOrView instanceof Backbone.View) {
            model = modelOrView.model;
        }

        if (this.childViews[model.id]) {
            this.childViews[model.id].remove();
            delete this.childViews[model.id];
        }
    },

    removeChilds: function () {
        _(this.childViews).forEach(function (view) {
            this.removeChild(view);
        }, this);
    },

    remove: function () {
        this.removeChilds();
        View.prototype.remove.apply(this);
    },

    render: function () {
        View.prototype.render.apply(this);
        this.rendered = true;

        this.collection.forEach(function (model) {
            this.addChild(model);
        }, this);
    }
});

module.exports = ViewCollection;

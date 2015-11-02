'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var View = require('./view');

var ViewCollection = View.extend({
    collectionView: null,

    collectionViews: {},

    rendered: false,

    initialize: function () {
        this.collection.forEach(function (model) {
            this.addChild(model);
        }, this);

        this.listenTo(this.collection, 'add', this.addChild);
        this.listenTo(this.collection, 'remove', this.removeChild);
    },

    addChild: function (model) {
        var childView = new this.collectionView({
            model: model
        });

        childView.render();

        this.collectionViews[model.id] = childView;

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

        if (this.collectionViews[model.id]) {
            this.collectionViews[model.id].remove();
            delete this.collectionViews[model.id];
        }
    },

    removeChilds: function () {
        _(this.collectionViews).forEach(function (view) {
            this.removeChild(view);
        }, this);
    },

    remove: function () {
        this.removeChilds();
        View.prototype.remove.apply(this);
    },

    render: function () {
        View.prototype.render.apply(this);

        _(this.collectionViews).forEach(function (view) {
            this.renderChild(view);
        }, this);

        this.rendered = true;
    }
});

module.exports = ViewCollection;

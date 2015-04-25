"use strict";

var Backbone = require("backbone");
var Model = require("./model");
var View = require("./view");

var Component = Backbone.Model.extend({
    constructor: function (options) {
        options = options || {};

        this._initModel(options);
        this._initView(options);

        if (options.parent) {
            this.parent = options.parent;
            this._view.setParent(this.parent.getView());
        }

        Backbone.Model.apply(this, arguments);
    },

    _initModel: function (options) {
        var modelOptions = options.modelOptions || {};

        if (options.model) {
            this._model = options.model;
        }
        else if (options.modelClass) {
            this._model = new options.modelClass(modelOptions);
        }
        else {
            this._model = new Model(modelOptions);
        }
    },

    _initView: function (options) {
        var viewOptions = options.viewOptions || {};

        viewOptions.model = this._model;

        if (options.view) {
            this._view = options.view;
        }
        else if (options.viewClass) {
            this._view = new options.viewClass(viewOptions);
        }
        else {
            this._view = new View(viewOptions);
        }
    },

    getView: function () {
        return this._view;
    },

    setView: function (view) {
        if (this._view) {
            this._view.remove();
        }

        this._view = view;
        return this;
    },

    getModel: function () {
        return this._model;
    },

    destroy: function () {
        if (this._view) {
            this._view.remove();
            this._view = null;
        }

        if (this._model) {
            this._model.remove();
            this._model = null;
        }
    },

    hide: function () {
        return this.getView().hide();
    }
});


module.exports = Component;

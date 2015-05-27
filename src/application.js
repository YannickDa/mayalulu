'use strict';

var $ = require('jquery');
require('jquery-ui');

var Backbone = require('backbone');
Backbone.$ = $;
require('./plugins/backbone.tojson');
require('./plugins/jquery.serializeObject');
require('./plugins/jquery.displayErrorMessages');

var _        = require('underscore');
var promise  = require('promisejs');

var Application = Backbone.Router.extend({
    services: {},
    models: {},
    collections: {},
    components: {},
    controllersClass: {},

    controllers: {},
    currentPage: null,

    initialize: function () {
        this.currentPage = null;
    },

    initializeControllers: function () {
        this.router = new Backbone.Router();

        _(this.controllersClass).forEach(function (controller, name) {
            this.controllers[name] = controller(this.router);
        }, this);

        Backbone.history.start({
            pushState: true
        });
    },

    closeCurrentPage: function () {
        var p = new promise.Promise();

        if (this.currentPage) {
            console.log('close current page');
            this.currentPage.close().then(function () {
                console.log('current page closed');
                p.done();
            });
        }
        else {
            p.done();
        }

        return p;
    },

    navigate: function (url) {
        this.closeCurrentPage().then(function () {
            this.router.navigate(url, {trigger: true});
        }, this);
    },

    open: function (page) {
        console.log('open page ', page);
        if (_.isString(page)) {
            page = this.getComponent(page);
        }

        return this.closeCurrentPage().then(function () {
            console.log('display new page');
            this.currentPage = page;
            return this.currentPage.open(Backbone.$('div.page'));
        }, this);
    },

    start: function () {
        console.log("Start application");
        $(_.bind(function () {
            this.initializeControllers();
        }, this));
    },

    getService: function (name) {
        return this.services[name];
    },

    getModel: function (name) {
        return this.models[name];
    },

    getCollection: function (name) {
        return this.collections[name];
    },

    getComponent: function (name) {
        return this.components[name];
    }
});

module.exports = Application;

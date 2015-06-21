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

    initialize: function (attrs, options) {
        this.currentPage = null;
    },

    initializeControllers: function () {
        console.log('Create global router');
        this.router = new Backbone.Router();

        console.log('load ' + _.size(this.controllersClass) + ' controllers');
        _(this.controllersClass).forEach(function (controller, name) {
            console.log('Load ' + name + ' controller');
            this.controllers[name] = controller(this.router);
            console.log('Controller loaded');
        }, this);

        console.log('All controllers are loaded');

        console.log('Start Router');
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

    start: function (options) {
        this.services = options.serives || {};
        this.models = options.models || {};
        this.collections = options.collections || {};
        this.components = options.components || {};
        this.controllersClass = options.controllersClass || {};

        console.log("Start application");
        $(_.bind(function () {
            console.log('Initialize controllers');
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

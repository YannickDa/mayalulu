'use strict';

var Backbone = require('backbone');
var _        = require('underscore');
var promise  = require('promisejs');

var Application = Backbone.Router.extend({
    currentPage: null,
    states: null,

    initialize: function (attrs, options) {
        this.currentPage = null;
        this.states = new Backbone.Model();
    },

    initializeControllers: function (controllers = []) {
        console.log('Create global router');
        this.router = new Backbone.Router();

        console.log('load ' + controllers.length + ' controllers');
        _(controllers).forEach(function (controller, name) {
            console.log('Load ' + name + ' controller');
            controller(this.router);
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

        return this.closeCurrentPage().then(function () {
            console.log('display new page');
            this.currentPage = page;
            return this.currentPage.open(Backbone.$('div.page'));
        }, this);
    },

    start: function (options) {
        console.log("Start application");
        $(_.bind(function () {
            console.log('Initialize controllers');
            this.initializeControllers(options.controllers);
        }, this));
    }
});

module.exports = Application;

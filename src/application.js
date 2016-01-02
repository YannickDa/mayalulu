'use strict';

var Backbone = require('backbone');
var _        = require('underscore');
var promise  = require('promisejs');

var Application = Backbone.Router.extend({
    currentPage: null,
    states: null,
    hooks: {
        beforeOpen: [],
        afterOpen: [],
        beforeClose: [],
        afterClose: []
    },

    initialize: function (attrs, options) {
        this.currentPage = null;
        this.routesHit = 0;
        this.states = new Backbone.Model();
    },

    initializeControllers: function (controllers) {
        controllers = controllers || [];

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

        Backbone.history.on('route', function () {
            this.routesHit++;
        });

        Backbone.history.start({
            pushState: true
        });
    },

    closeCurrentPage: function () {
        var p = new promise.Promise();

        this.executeHooks('beforeClose');

        if (this.currentPage) {
            console.log('close current page');
            this.currentPage.close().then(function () {
                console.log('current page closed');

                this.executeHooks('afterClose');

                p.done();
            }, this);
        }
        else {
            this.executeHooks('afterClose');

            p.done();
        }

        return p;
    },

    navigate: function (url) {
        this.router.navigate(url, {trigger: true});
    },

    open: function (page, action, options) {
        console.log('open page ', page);

        this.executeHooks('beforeOpen');

        if (this.currentPage === page) {
            var p = new promise.Promise();
            if (action) {
                this.currentPage[action](options);
            }

            this.executeHooks('afterOpen');

            p.done();
            return p;
        }
        else {
            return this.closeCurrentPage().then(function () {
                console.log('display new page');
                this.currentPage = page;
                var p = this.currentPage.open(Backbone.$('div.page'));

                if (action) {
                    p.then(function () {
                        this.currentPage[action](options);

                        this.executeHooks('afterOpen');
                    }, this);
                }

                return p;
            }, this);
        }
    },

    start: function (options) {
        console.log("Start application");
        $(_.bind(function () {
            console.log('Initialize controllers');
            this.initializeControllers(options.controllers);
        }, this));
    },

    addHook: function(when, hook) {
        var availableHooks = _.keys(this.hooks);
        if (!~availableHooks.indexOf(when)) {
            throw "No hook "  + when + " exists";
        }

        this.hooks[when].push(hook);
    },

    executeHooks: function (hookName) {
        var availableHooks = _.keys(this.hooks);
        if (!~availableHooks.indexOf(hookName)) {
            throw "No hook "  + hookName + " exists";
        }

        if (this.hooks[hookName].length) {
            var hook;
            while ((hook = this.hooks[hookName].shift())) {
                hook.call(this);
            }
        }
    },

    back: function () {
        const haveHistory = this.routesHit > 1;
        if (haveHistory) {
            window.history.back();
        }

        return haveHistory;
    }
});

module.exports = Application;

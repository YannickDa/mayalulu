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
        Backbone.history.start({
            pushState: true
        });
    },

    closeCurrentPage: function () {
        var p = new promise.Promise();

        if (this.hooks.beforeClose.length) {
            this.hooks.beforeClose.forEach(function (hook) {
                hook.call(this);
            }, this);
        }

        if (this.currentPage) {
            console.log('close current page');
            this.currentPage.close().then(function () {
                console.log('current page closed');

                if (this.hooks.afterClose.length) {
                    this.hooks.afterClose.forEach(function (hook) {
                        hook.call(this);
                    }, this);
                }

                p.done();
            }, this);
        }
        else {
            if (this.hooks.afterClose.length) {
                this.hooks.afterClose.forEach(function (hook) {
                    hook.call(this);
                }, this);
            }

            p.done();
        }

        return p;
    },

    navigate: function (url) {
        this.router.navigate(url, {trigger: true});
    },

    open: function (page, action) {
        console.log('open page ', page);

        if (this.hooks.beforeOpen.length) {
            this.hooks.beforeOpen.forEach(function (hook) {
                hook.call(this);
            }, this);
        }

        if (this.currentPage === page) {
            var p = new promise.Promise();
            if (action) {
                this.currentPage[action]();
            }

            if (this.hooks.afterOpen.length) {
                this.hooks.afterOpen.forEach(function (hook) {
                    hook.call(this);
                }, this);
            }

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
                        this.currentPage[action]();

                        if (this.hooks.afterOpen.length) {
                            this.hooks.afterOpen.forEach(function (hook) {
                                hook.call(this);
                            }, this);
                        }
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

    addHook(when, hook) {
        var availableHooks = _.keys(this.hooks);
        if (!~availableHooks.indexOf(when)) {
            throw "No hook "  + when + " exists";
        }

        this.hooks[when].push(hook);
    }
});

module.exports = Application;

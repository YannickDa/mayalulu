'use strict';

var _ = require('underscore');

var Routes = function (obj) {
    this.routes = obj;
    this.compiledRoutes = null;
};

Routes.prototype = {
    getAll: function () {
        if (!this.compiledRoutes) {
            var routes = {};

            var lang = App && App.lang ? App.lang:'';

            _(this.routes).forEach(function (action, url) {
                routes[lang + url] = action;
                routes[url.replace(/^\/(.*)/g, '$1')] = action;
            });

            this.compiledRoutes = routes;
        }

        return this.compiledRoutes;
    }
};

module.exports = function (routes) {
    return new Routes(routes);
};

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

Backbone.Model.prototype.toJSON = function() {
    if (this._isSerializing) {
        return this.id || this.cid;
    }
    
    this._isSerializing = true;
    var json = _.clone(this.attributes);
    _.each(json, function(value, name) {
        !_.isNull(value) && _.isFunction(value.toJSON) && (json[name] = value.toJSON());
    });
    
    this._isSerializing = false;
    return json;
};

'use strict';

var $ = require('jquery');

var rsubmittable = /^(?:input|select|textarea|keygen)/i,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rCRLF = /\r?\n/g,
    rcheckableType = (/^(?:checkbox|radio)$/i);

$.fn.serializeObject = function () {
    var object = {};

    this.map(function() {
        // Can add propHook for "elements" to filter or add form elements
        var elements = $.prop( this, "elements" );
        return elements ? $.makeArray( elements ) : this;
    })
    .filter(function() {
        var type = this.type;
        // Use .is(":disabled") so that fieldset[disabled] works
        return this.name && !$( this ).is( ":disabled" ) &&
            rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
            ( this.checked || !rcheckableType.test( type ) );
    })
    .map(function( i, elem ) {
        var val = $( this ).val();

        if (val == null) {
            return null;
        }
        else {
            var obj = {};
            if ($.isArray(val)) {
                obj = $.map( val, function( val ) {
                    var o = {};
                    o[elem.name] = val.replace( rCRLF, "\r\n" );
                });
            }
            else {
                obj[elem.name] = val.replace( rCRLF, "\r\n" )
            }
            return obj;
        }
    }).each(function (key, val) {
        $.extend(object, val);
    });

    return object;
};

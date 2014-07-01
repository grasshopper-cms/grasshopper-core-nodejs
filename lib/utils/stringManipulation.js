(function(){
    'use strict';

    module.exports = {
        base64urlDecode : base64urlDecode,
        base64urlUnescape : base64urlUnescape
    };

    function base64urlDecode(str) {
        return new Buffer(base64urlUnescape(str), 'base64').toString();
    }

    function base64urlUnescape(str) {
        str += Array(5 - str.length % 4).join('=');
        return str.replace(/\-/g, '+').replace(/_/g, '/');
    }
})();
(function(){
    "use strict";

    var config = {},
        internal = {},
        path = require("path"),
        config = (require((process.argv.length == 3 && process.argv[2] == 'test') ? './configuration.test.json' : './configuration.json'));

    internal.config = config;

    config.get = function(moduleName){
        return internal.config[moduleName];
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = config;
    }
})();


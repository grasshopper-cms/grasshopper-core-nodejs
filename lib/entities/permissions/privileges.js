module.exports = (function(){
    "use strict";

    var privileges = {};

    privileges.available = {
        ADMIN: 0,
        EDITOR: 1,
        AUTHOR: 2,
        READER: 3,
        EXTERNAL: 3,
        NONE: 4
    };


    return privileges;
})();
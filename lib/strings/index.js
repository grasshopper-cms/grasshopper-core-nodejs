/**
 * Module that will load a resource file based off of a local
 * @param local Default should be 'en'
 */
var strings = function(local){
    var languages = {
        en: require('./en')
    },
    lang = languages[local];

    this.group = function(name) {
        return lang[name];
    };
};

module.exports = strings;
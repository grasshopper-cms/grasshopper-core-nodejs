---
title: Events
uuid: api_events-example
language: javascript

---

// Event examples
grasshopper.core.event.channel('/type/*')
    .on('save', function(kontx, next) {
        memoize.clearCache();
        next();
    });
grasshopper.core.event.channel('/type/' + constants.ids.recipes)
    .on('parse', function(payload, next) {
        // do stuff
        next();
    });
grasshopper.core.event.channel('/system/db')
    .on('start', function(payload, next){
        logger.debug('starting grasshopper');
        next();
    });    
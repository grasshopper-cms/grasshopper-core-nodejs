/**
 * Module used for move a pre-loaded content object from the private kontx object over to the
 * payload field. This will return it back as a response.
 * @param kontx
 * @param next
 */
module.exports = function setContentPayload(kontx, next){
    'use strict';
    kontx.payload = kontx._content;
    next();
};
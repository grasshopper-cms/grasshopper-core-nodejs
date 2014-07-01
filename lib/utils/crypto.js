(function(){

    'use strict';

    var crypto = {},
        config = require('../config').crypto,
        CryptoJS = require('crypto-js'),
        StringManipulation = require('./stringManipulation'),
        AES = require('crypto-js/aes'),
        passphrase= config.secret_passphrase,
        JsonFormatter = {
            stringify: function (cipherParams) {
                // create json object with ciphertext
                var jsonObj = {
                    ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
                };

                // optionally add iv and salt
                if (cipherParams.iv) {
                    jsonObj.iv = cipherParams.iv.toString();
                }
                if (cipherParams.salt) {
                    jsonObj.s = cipherParams.salt.toString();
                }

                // stringify json object
                return JSON.stringify(jsonObj);
            },

            parse: function (jsonStr) {
                // parse json string
                var jsonObj = JSON.parse(jsonStr),
                    cipherParams = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
                });

                // optionally extract iv and salt
                if (jsonObj.iv) {
                    cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
                }
                if (jsonObj.s) {
                    cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
                }

                return cipherParams;
            }
        };

    crypto.createSalt = function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    };

    crypto.createHash = function(plainText, salt){
        return CryptoJS.HmacSHA256(plainText, salt).toString();
    };

    crypto.encrypt = function(value){
        return AES.encrypt(value, passphrase, { format: JsonFormatter }).toString();
    };

    crypto.decrypt = function(value){
        var decrypted = (AES.decrypt(value, passphrase, { format: JsonFormatter }));
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    crypto.decodeJwt = function(jwt) {
        var segments = jwt.split('.'),
            headerSeg, payloadSeg, signatureSeg,
            header, payload;

        if (segments.length !== 3) {
            throw new Error('Not enough or too many segments');
        }

        // All segment should be base64
        headerSeg = segments[0];
        payloadSeg = segments[1];
        signatureSeg = segments[2];

        // base64 decode and parse JSON
        header = JSON.parse(StringManipulation.base64urlDecode(headerSeg));
        payload = JSON.parse(StringManipulation.base64urlDecode(payloadSeg));

        return {
            header: header,
            payload: payload,
            signature: signatureSeg
        };
    };

    module.exports = crypto;
})();


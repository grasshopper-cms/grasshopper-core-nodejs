'use strict';

var AES = require('crypto-js/aes'),
    CryptoJS = require('crypto-js'),
    config = require('../config').crypto,
    passphrase= config.secret_passphrase,
    JsonFormatter = {},
    crypto = {};

module.exports = {
    createSalt : createSalt,
    createHash : createHash,
    encrypt : encrypt,
    decrypt : decrypt
};


JsonFormatter.stringify = function (cipherParams) {
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
};

JsonFormatter.parse = function (jsonStr) {
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
};

function createSalt() {
    return Math.round(new Date().valueOf() * Math.random()) + '';
}

function createHash(plainText, salt){
    return CryptoJS.HmacSHA256(plainText, salt).toString();
}

function encrypt(value){
    return AES.encrypt(value, passphrase, { format: JsonFormatter }).toString();
}

function decrypt(value){
    var decrypted = (AES.decrypt(value, passphrase, { format: JsonFormatter }));
    return decrypted.toString(CryptoJS.enc.Utf8);
}
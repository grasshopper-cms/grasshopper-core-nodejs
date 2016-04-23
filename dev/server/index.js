/* jshint node:true */
'use strict';
console.log('starting');
var express = require('express'),
    app = express(),
    api = require('grasshopper-api'),
    PORT = process.env.PORT || 3000;

api = api(require('./ghapi.json'));
app.use(api.router);
app.use(express.static(__dirname + '/public/admin'));

app.get('/admin*?', function(request, response) {
    response.sendFile(__dirname + '/public/admin/index.html');
});

app.listen(PORT, function(){
    console.log('Listening on: ' + PORT);
});

'use strict';
var express = require('express');
var app     = express();
var path    = require('path');

var fs = require('fs');
var lobFactory = require('./lib/index.js');
var Lob = new lobFactory('test_fd34e1b5ea86a597ec89f7f2e46940c874d');

// Read letter.html template
var file = fs.readFileSync(__dirname + '/static/html/letter.html').toString();

// Set static folder
app.use(express.static(__dirname + '/static'));

// Root route
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

// Catch the send request
app.get('/send', function(req, res) {
	console.log(10);
})


var repContact = function() {
	
}

app.listen(8000);
console.log("Running at Port 8000");

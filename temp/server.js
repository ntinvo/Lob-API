'use strict';
var express = require('express');
var app     = express();
var path    = require('path');
var bodyParser	= require('body-parser');
var fs = require('fs');
var lobFactory = require('./lib/index.js');
var Lob = new lobFactory('test_fd34e1b5ea86a597ec89f7f2e46940c874d');

// Read letter.html template
var file = fs.readFileSync(__dirname + '/static/html/letter.html').toString();

// Set static folder
app.use(express.static(__dirname + '/static'));

// Parse body
app.use(bodyParser.json());

// Root route
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

// Catch the send request
app.post('/send', function(req, res) {
	var repContact = getRepContact(req.body)
});

var getRepContact = function(userInfo) {
	var address1 = userInfo.address1 == undefined ? "" : userInfo.address1;
	var address2 = userInfo.address2 == undefined ? "" : userInfo.address2;
	var city = userInfo.city == undefined ? "" : userInfo.city;
	var state = userInfo.state == undefined ? "" : userInfo.state;
	var zipcode = userInfo.zipcode == undefined ? "" : userInfo.zipcode;	
	var url = address1 + "+" + address2 + "+" + city + "+" + state + "+" + zipcode;
	url = url.replace("++", "+").replace(" ", "+");

	console.log(url);
};

// Listen on port 8000
app.listen(8000);
console.log("Running at Port 8000");

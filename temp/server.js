'use strict';
var express = require('express');
var app     = express();
var path    = require('path');
var bodyParser	= require('body-parser');
var request = require('request');
var fs = require('fs');

// Lob
var lobFactory = require('./lib/index.js');
var Lob = new lobFactory('test_fd34e1b5ea86a597ec89f7f2e46940c874d');

// Google API
var google_api_key = "AIzaSyBH7ovb41j8HaaYhJqolwW4Ury5dfAL_e0";

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

// Get rep's information
var getRepContact = function(userInfo) {
	var address1 = userInfo.address1 == undefined ? "" : userInfo.address1;
	var address2 = userInfo.address2 == undefined ? "" : userInfo.address2;
	var city = userInfo.city == undefined ? "" : userInfo.city;
	var state = userInfo.state == undefined ? "" : userInfo.state;
	var zipcode = userInfo.zipcode == undefined ? "" : userInfo.zipcode;	
	var url = address1 + "+" + address2 + "+" + city + "+" + state + "+" + zipcode;
	url = url.split("++").join("+");
	url = url.split(" ").join("+");

	url = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + url + "&key=" + google_api_key
	console.log(url);
};

// Listen on port 8000
app.listen(8000);
console.log("Running at Port 8000");

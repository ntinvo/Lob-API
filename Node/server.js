'use strict';
var express = require('express');
var app     = express();
var path    = require('path');
var bodyParser	= require('body-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');

// States
var states = {
	'ALABAMA':'AL',
	'ALASKA':'AK',
	'ARIZONA':'AZ',
	'ARKANSAS':'AR',
	'CALIFORNIA':'CA',
	'COLORADO':'CO',
	'CONNECTICUT':'CT',
	'DELAWARE':'DE',
	'FLORIDA':'FL',
	'GEORGIA':'GA',
	'HAWAII':'HI',
	'IDAHO':'ID',
	'ILLINOIS':'IL',
	'INDIANA':'IN',
	'IOWA':'IA',
	'KANSAS':'KS',
	'KENTUCKY':'KY',
	'LOUISIANA':'LA',
	'MAINE':'ME',
	'MARYLAND':'MD',
	'MASSACHUSETTS':'MA',
	'MICHIGAN':'MI',
	'MINNESOTA':'MN',
	'MISSISSIPPI':'MS',
	'MISSOURI':'MO',
	'MONTANA':'MT',
	'NEBRASKA':'NE',
	'NEVADA':'NV',
	'NEW HAMPSHIRE':'NH',
	'NEW JERSEY':'NJ',
	'NEW MEXICO':'NM',
	'NEW YORK':'NY',
	'NORTH CAROLINA':'NC',
	'NORTH DAKOTA':'ND',
	'OHIO':'OH',
	'OKLAHOMA':'OK',
	'OREGON':'OR',
	'PENNSYLVANIA':'PA',
	'RHODE ISLAND':'RI',
	'SOUTH CAROLINA':'SC',
	'SOUTH DAKOTA':'SD',
	'TENNESSEE':'TN',
	'TEXAS':'TX',
	'UTAH':'UT',
	'VERMONT':'VT',
	'VIRGINIA':'VA',
	'WASHINGTON':'WA',
	'WEST VIRGINIA':'WV',
	'WISCONSIN':'WI',
	'WYOMING':'WY'
}

var stateArrb = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN',
                 'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
                 'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',
                 'TX','UT','VT','VA','WA','WV','WI','WY'];

// Lob
var lobFactory = require('./lib/index.js');
var Lob = new lobFactory('test_fd34e1b5ea86a597ec89f7f2e46940c874d');

// Google API
var google_api_key = "AIzaSyBXcjOL1eor5k2Xiiuo_myO4D_Ih0ZiF1E";

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
	var repContact = getRepContact(req.body);
	var state = getState(req.body.state);

	if(repContact == null || state == undefined) {
		res.json("[ERROR] : Please Check Your Inputs!!!");
	}
	createLetter(req.body, repContact);
});


// Create letter
var createLetter = function(fromAddress, toAddress) {
	var state = getState(fromAddress.state);
	file = file.replace("message", fromAddress.message);

	console.log(file);
	Lob.addresses.create({
		name: toAddress.name,
		address_line1: toAddress.address1,
		address_line2: toAddress.address2,
		address_city:  toAddress.city,
		address_state: toAddress.state,
		address_zip: toAddress.zip
	})
	.then(function (address) {
		return Lob.letters.create({
			description: 'My First Letter',
			to: address.id,
			from: {
				name: fromAddress.name,
				address_line1: fromAddress.address1,
				address_line2: fromAddress.address2,
				address_city: fromAddress.city,
				address_state: state,
				address_zip: fromAddress.zip
			},
			file: file,
			color: false
		});
	})
	.then(function (letter) {
		console.log('The Lob API responded with this letter object: ', letter.url);
	})
	.catch(function (err) {
		console.log(err);
	});
}


// Get the two characters of state
var getState = function(state) {
	if(state.length == 2) {
		return state;
	} 
	if(state.length != 2 && states[state.toUpperCase()] != undefined) {
		return states[state.toUpperCase()];
	}
	return undefined;
}


// Get rep's information
var getRepContact = function(userInfo) {
	var address1 = userInfo.address1 == undefined ? "" : userInfo.address1;
	var address2 = userInfo.address2 == undefined ? "" : userInfo.address2;
	var city = userInfo.city == undefined ? "" : userInfo.city;
	var state = userInfo.state == undefined ? "" : userInfo.state;
	var zip = userInfo.zip == undefined ? "" : userInfo.zip;	
	var url = address1 + "+" + address2 + "+" + city + "+" + state + "+" + zip;
	url = url.split("++").join("+");
	url = url.split(" ").join("+");
	url = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + url + "&key=" + google_api_key
console.log(url);
	var xhr = new XMLHttpRequest();
    xhr.open( "GET", url, false );
    xhr.send( null );

	if(xhr.status == 200) {
		var temp = JSON.parse(xhr.responseText).officials;
		console.log(temp[0].address);
		var contact = {
			name : temp[0].name,
			address1 : temp[0].address[0].line1,
			address2 : temp[0].address[0].line2,
			city : temp[0].address[0].city,
			state : temp[0].address[0].state,
			zip : temp[0].address[0].zip
		};
		return contact;
    } else {
    	return null;
    }
};

// Listen on port 8000
app.listen(8000);
console.log("Running at Port 8000");

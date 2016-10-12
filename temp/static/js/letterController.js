var app = angular.module('sendLetterApp', []);


// main app controller
app.controller('mainCtrl', function($scope, $http) {
	$scope.sendLetter = function() {
		// send GET request to the server
		$http.get('/send').success(function(res) {
			console.log("Done");
		});
	};
});
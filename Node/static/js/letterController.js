var app = angular.module('sendLetterApp', []);


// main app controller
app.controller('mainCtrl', function($scope, $http) {
	$scope.sendLetter = function(req, res) {
		$http.post('/send', $scope.user).success(function(res) {
			console.log(res);
		});
	};
});
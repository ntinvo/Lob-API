var app = angular.module('sendLetterApp', []);


// main app controller
app.controller('mainCtrl', function($scope, $http) {
	$scope.sendLetter = function(req, res) {
		
		$http.post('/send', $scope.user).success(function(res) {
			$scope.output = res;
			if(res == '[ERROR] : Please Check Your Inputs!!!') {
				$scope.error = true;
				$scope.correct = false;
			} else {
				$scope.error = false;
				$scope.correct = true;
			}
		});
	};
});
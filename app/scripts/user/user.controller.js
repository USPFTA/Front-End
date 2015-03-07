;(function (){

	'use strict';

	angular.module('FlagTag')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location){

			// Get User

			// Register User
			$scope.registerUser = function (userInfo){
				if($scope.user.password !== $scope.user.password_confirmation){
					alert('passwords have to match');
				} else {
					UserFactory.register(userInfo);
				}
			};

			// Login User
			$scope.loginUser = function (userInfo){
				UserFactory.login(userInfo);
			};

			// Routing
			$rootScope.$on('user:loggedin', function (){
				$location.path('/');
			});

			$rootScope.$on('user:loggedout', function (){
				$location.path('/');
			});

		}

	]);

}());
;(function (){

	'use strict';

	angular.module('FlagTag')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location){

			// Get User
			var user = UserFactory.user();
			if(user){
				$location.path('/profile');
			}

			// Register User
			$scope.registerUser = function (userInfo){
					UserFactory.register({ user: userInfo});
			};

			// Login User
			$scope.loginUser = function (userInfo){
				UserFactory.login({user: userInfo});
			};

			// Routing
			$rootScope.$on('user:loggedin', function (){
				$location.path('/profile');
			});

			$rootScope.$on('user:loggedout', function (){
				$location.path('/');
			});

			$rootScope.$on('user:registered', function (){
				$location.path('/login');
			});

		}

	]);

}());
;(function (){

	'use strict';

	angular.module('FlagTag')

	.controller('GameController', ['$scope', '$rootScope', 'UserFactory', 'uiGmapGoogleMapApi',
		function ($scope, $rootScope, UserFactory, uiGmapGoogleMapApi){

			//Display Your Email
			var user = UserFactory.user();
			if(user){
				// console.log(user);
				$scope.userProfile = user.email;
			}

			// Create a Game
			$scope.createGame = function(){
			};

			// Invite Users to Game

			// Create Map
			$scope.map = { center: { latitude: 33.75, longitude: -84.4 }, zoom: 12 };
			
		}

	]);

}());
;(function (){

	'use strict';

	angular.module('FlagTag')

	.factory('GameFactory', ['$http', 'HEROKU', '$rootScope', '$cookieStore', '$location', 'UserFactory',
		function ($http, HEROKU, $rootScope, $cookieStore, $location, UserFactory) {

			// Get current User
			var user = UserFactory.user();

			// Create a game

			return{

			};

		}

	]);

}());
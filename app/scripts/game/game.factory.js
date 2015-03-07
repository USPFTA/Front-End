;(function (){

	'use strict';

	angular.module('FlagTag')

	.factory('GameFactory', ['$http', 'HEROKU', '$rootScope', '$cookieStore', '$location', 'UserFactory',
		function ($http, HEROKU, $rootScope, $cookieStore, $location, UserFactory) {

			// Get current User
			var user = UserFactory.user();

			// Create a game
			var createGame = function (gameInfo){
				$http.post(HEROKU.URL + 'games/new', gameInfo, HEROKU.CONFIG)
					.success( function (response){
						console.log(response);
					}
				);
			};

			// Get All Available Users
			var getUsers = function (users){
				return $http({
					headers: HEROKU.CONFIG.headers,
					url: HEROKU.URL + 'invitations',
					method: 'GET'
				}).success( function (data){
					console.log(data.players);
				});
			};

			return{
				grabUsers: getUsers
			};

		}

	]);

}());
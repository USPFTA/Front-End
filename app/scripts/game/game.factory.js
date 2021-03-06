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
						console.log(response.game.id);
						$rootScope.gameId = response.game.id;
						$rootScope.$broadcast('game:created', response.game.id);
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

			//Invite Users From List
			var inviteUsers = function (invObj){
				$http.post(HEROKU.URL + 'invitations', invObj, HEROKU.CONFIG)
					.success( function (response){
						console.log(response);
					}
				);
			};

			var grabGame = function (gameId){
				return $http({
					headers: HEROKU.CONFIG.headers,
					url: HEROKU.URL + 'games/' + gameId + '/admin',
					method: 'GET'
				}).success( function (data){
					$rootScope.$broadcast('game:got', gameId);
				});
			};


			return{
				grabUsers: getUsers,
				create: createGame,
				invite: inviteUsers,
				grab: grabGame
			};

		}

	]);

}());
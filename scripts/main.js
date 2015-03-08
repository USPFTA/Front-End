;(function (){

	'use strict';

	angular.module('FlagTag', ['ngRoute', 'ngCookies', 'uiGmapgoogle-maps'])

	.constant('HEROKU', {
		URL: 'https://tiy-hackathon.herokuapp.com/',
		CONFIG: {
			headers: {
				'Content-Type': 'application/json'
			}
		}
	})

	.config( function ($routeProvider, uiGmapGoogleMapApiProvider){

		$routeProvider.when('/', {
			templateUrl: 'scripts/welcome/welcome.tpl.html'
		})

		.when('/login', {
			templateUrl: 'scripts/user/login.tpl.html',
			controller: 'UserController'
		})

		.when('/register', {
			templateUrl: 'scripts/user/register.tpl.html',
			controller: 'UserController'
		})

		.when('/profile', {
			templateUrl: 'scripts/profile/profile.tpl.html',
			controller: 'GameController'
		})

		.when('/game/:id', {
			templateUrl: 'scripts/game/game.tpl.html',
			controller: 'GameController'
		})

		.when('/create-game', {
			templateUrl: 'scripts/game/create-game.tpl.html',
			controller: 'GameController'
		})

		.when('/game/invite/:id', {
			templateUrl: 'scripts/game/invite.tpl.html',
			controller: 'GameController'
		})

		.otherwise({
			reirectTo: '/'
		});

		// Google Maps
		uiGmapGoogleMapApiProvider.configure({
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });

	})

	.run([ '$rootScope', 'UserFactory', 'HEROKU',
		function ($rootScope, UserFactory, HEROKU){
			$rootScope.$on('$routeChangeStart', function (){

			});
		}
	]);
}());
;(function (){

	'use strict';

	angular.module('FlagTag')

	.controller('NavController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location){

			var user = UserFactory.user();
			
			if(user){
				$scope.loggedin = true;
				$scope.user = user;
			} else {
				$scope.loggedin = false;
			}

			$scope.logout = function (){
				UserFactory.logout();				
			};

			$scope.$on('user:loggedout', function (){
				$scope.loggedin = false;
			});

			$scope.$on('user:loggedin', function (){
				$scope.loggedin = true;
			});

		}

	]);

}());
;(function (){

	'use strict';

	angular.module('FlagTag')

	.controller('GameController', ['$scope', '$log', '$timeout', '$rootScope', 'UserFactory', 'uiGmapGoogleMapApi', 'GameFactory', '$location', '$routeParams',
		function ($scope, $log, $timeout, $rootScope, UserFactory, uiGmapGoogleMapApi, GameFactory, $location, $routeParams){

			//Display Your Email
			var user = UserFactory.user();
			if(user){
				console.log(user.authentication_token);
				$scope.userProfile = user.email;
				$scope.createrId = user.id;
			}

			// Check Authentication
			var status = UserFactory.status();

			// Create a Game
			$scope.createGame = function(gameInfo){
				GameFactory.create({ game: gameInfo });
				console.log(gameInfo);
			};

			// Create Map
			$scope.map = { center: { latitude: 33.75, longitude: -84.4 }, zoom: 14 };

			// Create Marker
			var marker = $scope.marker = {
	      id: 0,
	      coords: {
	        latitude: 33.75,
	        longitude: -84.4
	      },
	      options: { draggable: true },
	      events: {
	        dragend: function (marker, eventName, args) {
	          $log.log('marker dragend');
	          var lat = marker.getPosition().lat();
	          var lon = marker.getPosition().lng();
	          $log.log(lat);
	          $log.log(lon);

	          $scope.marker.options = {
	            draggable: true,
	          };

	          $scope.$apply();
	        }
	      }
	    };
	    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
	      if (_.isEqual(newVal, oldVal))
	        return;
	      $scope.coordsUpdates++;
	    });

	    // Create the Circle
	     var circle = $scope.circles = [
	      {
	          id: 1,
	          center: {
	              latitude: $scope.marker.coords.latitude,
	              longitude: $scope.marker.coords.longitude
	          },
	          radius: 1000,
	          stroke: {
	              color: '#08B21F',
	              weight: 2,
	              opacity: 1
	          },
	          fill: {
	              color: '#08B21F',
	              opacity: 0.3
	          },
	          geodesic: true, // optional: defaults to false
	          draggable: true, 
	          clickable: false, 
	          editable: true, 
	          visible: true, 
	          control: {}
	      }
      ];

      // circle.bindTo('center', marker, 'position');


      // Get all Available Users
      GameFactory.grabUsers().success(function (data){
      	$scope.userCol = data.players;
      });
    

    	//Change Class to note Invite & Send Invite to User
    	$scope.inviteUser = function (invObj){
    		$(event.target).toggleClass('active');
    		console.log($scope.createrId);    		
    		console.log($scope.userCol);
    		console.log(invObj);
    		GameFactory.invite({ inviter_id: $scope.createrId, invited_id: invObj, game_id: $routeParams.id });
    	};

    	// Grab Current Game 
    	$scope.grabGame = function (gameObj){
    		GameFactory.grab($routeParams.id)
    			.success( function (data){
    				// console.log(data);
    				$scope.currentCol = data.users;
    				// console.log($scope.currentCol);
    				$scope.scoreCol = data.players;
    				$scope.flagCol = data.flags;
    				console.log($scope.flagCol);
    				$scope.currentGame = data.game;
    				console.log($scope.currentGame);

    				$scope.gameLatLong = { latitude: parseFloat(data.game.center_lat), longitude: parseFloat(data.game.center_long) };
    				$scope.markerCoors = { latitude: parseFloat(data.game.center_lat), longitude: parseFloat(data.game.center_long) };
    				$scope.circleCoors = { latitude: parseFloat(data.game.center_lat), longitude: parseFloat(data.game.center_long) };
    			}
    		);
    	};

    	// If we are on a game page, with an ID... grab the Game
    	if ($routeParams.id && $location.path().indexOf('/game/invite/') === -1) {
    		$scope.grabGame();
    	}
    	


    	$rootScope.$on('game:created', function (event, gameId){
				$location.path('/game/invite/' + gameId);
			});

			$rootScope.$on('game:got', function (event, gameId){
				$location.path('/game/' + gameId);
			});
	
		}

	]);

}());
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
;(function (){

	'use strict';

	angular.module('FlagTag')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location){

			// Get User
			var user = UserFactory.user();
			if(user){
				// console.log(user.authentication_token);
			}

			var getStatus = UserFactory.status();

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
;(function (){

	'use strict';

	angular.module('FlagTag')

	.factory('UserFactory', ['$http', 'HEROKU', '$rootScope', '$cookieStore',
		function ($http, HEROKU, $rootScope, $cookieStore){

			// Get Current User
			var currentUser = function (){
				return $cookieStore.get('FTCookie');
			};

			// Get Status of User
			var checkLoginStatus = function  () {
				var user = currentUser();
				if(user){
					// console.log(user.user.authentication_token);
					HEROKU.CONFIG.headers['authentication-token'] = user.authentication_token;
				}
			};

			// Register
			var registerUser = function (userInfo) {
				$http.post(HEROKU.URL + 'users', userInfo, HEROKU.CONFIG)
					.success( function (response){
						console.log(response);
					}
				);
			};

			// Login
			var loginUser = function (userInfo) {
					$http.post(HEROKU.URL + 'users/sign_in', userInfo, HEROKU.CONFIG)
						.success( function (response){
							// console.log(response);
							$cookieStore.put('FTCookie', response.user);
							$rootScope.$broadcast('user:loggedin');
					}
				);
			};

			// Logout
			var logoutUser = function (userInfo) {
				$cookieStore.remove('FTCookie');
				$rootScope.$broadcast('user:loggedout');
			};


			return {
				register: registerUser,
				login: loginUser,
				logout: logoutUser,
				user: currentUser,
				status: checkLoginStatus
			};

		}

	]);

}());
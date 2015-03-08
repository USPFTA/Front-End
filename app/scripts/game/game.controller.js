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
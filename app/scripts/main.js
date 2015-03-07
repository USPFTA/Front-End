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

		.when('/game', {
			templateUrl: 'scripts/game/game.tpl.html',
			controller: 'GameController'
		})

		.when('/create-game', {
			templateUrl: 'scripts/game/create-game.tpl.html',
			controller: 'GameController'
		})

		.when('/game/invite', {
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
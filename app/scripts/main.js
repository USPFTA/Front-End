;(function (){

	'use strict';

	angular.module('FlagTag', ['ngRoute', 'ngCookies'])

	.constant('heroku', {
		url: 'https://tiy-hackathon.herokuapp.com/',
		config: {
			headers: {
				'Content-Type': 'application/json'
			}
		}
	})

	.config( function ($routeProvider){

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

		.otherwise({
			reirectTo: '/'
		});

	})

	.run([ '$rootScope', 'UserFactory', 'heroku',
		function ($rootScope, UserFactory, heroku){
			$rootScope.$on('$routeChangeStart', function (){

			});
		}
	]);
}());
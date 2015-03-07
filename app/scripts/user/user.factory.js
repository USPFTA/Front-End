;(function (){

	'use strict';

	angular.module('FlagTag')

	.factory('UserFactory', ['$http', '$rootScope', '$cookieStore', 'heroku',
		function ($http, $rootScope, $cookieStore, heroku){

			// Get Current User

			// Get Status of User

			// Register
			var registerUser = function (userInfo) {
				$http.post(heroku.url + 'auth', userInfo, heroku.config)
					.success( function (response){
						console.log(response);
					}
				);
			};

			// Login
			var loginUser = function (userInfo) {
					$http.post(heroku.url + 'auth/sign_in', userInfo, heroku.config)
						.success( function (response){
							console.log(response);
							$rootScope.$broadcast('user:loggedin');
					}
				);
			};

			// Logout
			var logoutUser = function (userInfo) {

				$rootScope.$broadcast('user:loggedout');
			};


			return {
				register: registerUser,
				login: loginUser,
				logout: logoutUser
			};

		}

	]);

}());
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
angular.module('citizen-engagement').factory('AuthService', function(store) {

	var service = {};

	service.authToken = store.get('authToken');

	service.setAuthToken = function(token) {
		service.authToken = token;
		store.set('authToken', token);
	}

	service.unsetAuthToken = function() {
		service.authToken = null;
		store.remove('authToken');
	}

	service.setUserId = function(id){
		service.userId = id;
		store.set('userId', id);
	}

	service.unsetUserId = function() {
		service.userId = null;
		store.remove('userId');
	}

	return service;
});

angular.module('citizen-engagement').factory('LoginService', function(apiUrl, AuthService, $ionicLoading, $ionicHistory, $http, $state) {

	var service = {};

	service.login = function(user){

		$ionicLoading.show({
			template: 'Logging in...',
			delay: 750
		});

		return $http({
			method: 'POST',
			url: apiUrl + '/auth',
			data: user
		}).then(function(res) {

			AuthService.setAuthToken(res.data.token);
			AuthService.setUserId(res.data.user.id);

			$ionicLoading.hide();

			$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});

			$state.go('tab.issueList');

			return res;
		});

	}

	return service;
});

angular.module('citizen-engagement').factory('AuthInterceptor', function(AuthService) {
	return {

		// The request function will be called before all requests.
		// In it, you can modify the request configuration object.
		request: function(config) {

			// If the user is logged in, add the X-User-Id header.
			if (AuthService.authToken) {
				config.headers.Authorization = 'Bearer ' + AuthService.authToken;
			}

			return config;
		}
	};
});

angular.module('citizen-engagement').controller('LoginCtrl', function(apiUrl, LoginService, AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
	var loginCtrl = this;

	$scope.$on('$ionicView.beforeEnter', function() {
		loginCtrl.user = {};
	});

	loginCtrl.logIn = function(){

		delete loginCtrl.error;

		LoginService.login(loginCtrl.user).catch(function(res){
			$ionicLoading.hide();
			loginCtrl.error = res;
		});
	};
});

angular.module('citizen-engagement').controller('LogoutCtrl', function(AuthService, $state) {
	var logoutCtrl = this;

	logoutCtrl.logOut = function() {
		AuthService.unsetAuthToken();
		AuthService.unsetUserId();
		$state.go('login');
	};
});
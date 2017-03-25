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
			template: 'Connexion...',
			delay: 750
		});

		return $http({
			method: 'POST',
			url: apiUrl + '/auth',
			data: user
		}).then(function(res) {

			AuthService.setAuthToken(res.data.token);
			AuthService.setUserId(res.data.user.id);

			$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});
			$ionicLoading.hide();
			return res;
		})

	}

	return service;
});

angular.module('citizen-engagement').factory('AuthInterceptor', function(AuthService) {
	return {
		request: function(config) {
			if (AuthService.authToken && !config.headers.Authorization) {
				config.headers.Authorization = 'Bearer ' + AuthService.authToken;
			}

			return config;
		}
	};
});

angular.module('citizen-engagement').controller('LoginCtrl', function(AuthService, LoginService, $state, $scope, $ionicLoading) {
	var ctrl = this;
	$scope.$on('$ionicView.beforeEnter', function() {
		ctrl.user = {};
	});

	ctrl.logIn = function(){
		LoginService.login(ctrl.user).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err;
			throw new Error("Une erreur est survenue lors de la connexion");
		}).then(function(){
			$state.go('tab.issueList');
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
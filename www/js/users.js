angular.module('citizen-engagement').factory('usersService', function($http, $ionicLoading, $ionicHistory, $state, apiUrl) {
	var service = {};

	service.getMe = function(){
		return $http.get(apiUrl + '/me').then(function(res) {
			return res.data;
		});
	}

	service.getMeIssues = function(){
		return $http.get(apiUrl + '/me/issues').then(function(res) {
			return res.data;
		});
	}

	service.postUser = function(user){

		$ionicLoading.show({
			template: 'Logging in...',
			delay: 750
		});

		user.roles = ["citizen"];
		return $http({
			method: 'POST',
			url: apiUrl + '/users',
			data: user
		}).then(function(res) {

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

angular.module('citizen-engagement').controller('profilCtrl', function(usersService) {
	var ctrl = this;
	usersService.getMe().then(function(data) {
		ctrl.me = data;
	});
});

angular.module('citizen-engagement').controller('addUserCtrl', function(usersService, LoginService, $ionicLoading) {
	var ctrl = this;
	ctrl.addUser = function(){
		usersService.postUser(ctrl.user).then(function(res){

			delete ctrl.error;
			LoginService.login(ctrl.user);

		}).catch(function(res){

			$ionicLoading.hide();
			ctrl.error = res;

		});
	};
});
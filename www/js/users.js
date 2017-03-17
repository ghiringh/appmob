angular.module('citizen-engagement').factory('usersService', function($http, $state, apiUrl, $ionicHistory, $ionicLoading) {
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

	service.postUser = function(user, ctrl){

		$ionicLoading.show({
			template: 'Creating profile...',
			delay: 750
		});

		user.roles = ["citizen"];
		return $http({
			method: 'POST',
			url: apiUrl + '/users',
			data: user
		}).then(function(res) {

			delete ctrl.error;
			
			$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});
			$ionicLoading.hide();
			return ctrl.user;
		}).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err;
			throw new Error("There was a problem during user's creation");
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

angular.module('citizen-engagement').controller('addUserCtrl', function(usersService, LoginService, $state) {
	var ctrl = this;
	ctrl.addUser = function(){
		usersService.postUser(ctrl.user, ctrl).then(LoginService.login).then(function(){
			$state.go('tab.issueList');
		});
	};
});
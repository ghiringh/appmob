angular.module('citizen-engagement').factory('usersService', function($http, apiUrl) {
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
		user.roles = ["citizen"];
		return $http({
			method: 'POST',
			url: apiUrl + '/users',
			data: user
		})
	}

	return service;
});

angular.module('citizen-engagement').controller('profilCtrl', function(usersService) {
	var ctrl = this;
	usersService.getMe().then(function(data) {
		ctrl.me = data;
	});
});

angular.module('citizen-engagement').controller('addUserCtrl', function(usersService) {
	var ctrl = this;
	ctrl.addUser = function(){
		usersService.postUser(ctrl.user).then(function(res){

		}).catch(function(){

		});
	}
});
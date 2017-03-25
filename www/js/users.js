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

	service.getUsers = function(){
		return $http.get(apiUrl + '/users').then(function(res) {
			return res.data;
		});
	}

	service.getUser = function(id){
		return $http.get(apiUrl + '/users/' + id).then(function(res) {
			return res.data;
		});
	}

	service.postUser = function(user, ctrl){

		$ionicLoading.show({
			template: 'Création du profil...',
			delay: 750
		});
		if(user.roles == undefined){
			user.roles = ["citizen"];
		}
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
			throw new Error("Une erreur est survenue lors de la création du profil");
		});
	}

	service.patchUser = function(id, user, ctrl){

		$ionicLoading.show({
			template: 'Mise à jour du profil...',
			delay: 750
		});

		return $http({
			method: 'PATCH',
			url: apiUrl + '/users/' + id,
			data: user
		}).then(function(res) {

			delete ctrl.error;
			
			$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});
			$ionicLoading.hide();
			return res;
		}).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err;
			throw new Error("Une erreur est survenue lors de la mise à jour du profil");
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

angular.module('citizen-engagement').controller('addUserCtrl', function(usersService, LoginService, $state, $ionicLoading) {
	var ctrl = this;
	ctrl.addUser = function(){
		usersService.postUser(ctrl.user, ctrl).then(LoginService.login).then(function(){
			$state.go('help');
		}).catch(function(err){$ionicLoading.hide(); ctrl.error = err});
	};
});
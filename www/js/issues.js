angular.module('citizen-engagement').factory('issuesService', function($http, apiUrl, qimgUrl, qimgToken, $ionicHistory, $ionicLoading, $ionicPopup) {
	var service = {};

	service.getIssues = function(){
		return $http({
			method: 'GET',
			url: apiUrl + '/issues',
			params:{
				include : 'issueType'
			}
		}).then(function(res) {
			return res.data;
		});
	}

	service.getIssue = function(id){
		return $http({
			method: 'GET',
			url: apiUrl + '/issues/' + id,
			params:{
				include : 'issueType'
			}
		}).then(function(res) {
			return res.data;
		});
	}

	service.getIssueComments = function(id){
		return $http({
			method: 'GET',
			url: apiUrl + '/issues/' + id +'/comments',
			params:{include : 'author'}
		}).then(function(res) {
			return res.data;
		});
	}

	service.postIssueComments = function(id, ctrl){

		$ionicLoading.show({
			template: 'Envoi du commentaire...',
			delay: 750
		});

		return $http({
			method: 'POST',
			url: apiUrl + '/issues/' + id +'/comments',
			data: {
				text : ctrl.newComment
			}
		}).then(function(res) {

			delete ctrl.error;
			$ionicLoading.hide();
			return res;
		}).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err;
			throw new Error("Une erreur est survenue lors de l'ajout du commentaire");
		});
	}

	service.getIssuesSearch = function(page, state, search) {
		page = page || 1;

		console.log(search);

		var requestData = {};

		if (state) {
			requestData.state = state;
		}
		if (search) {
			requestData.description = {$regex:search};
		}
		return $http({
			method: 'POST',
			url: apiUrl + '/issues/searches',
			params: {
				include : 'issueType',
				page: page
			},
			data: requestData
		}).then(function(res) {
			return res.data;
		});
	};

	service.getIssueTypes = function getAllIssueTypes(page, types) {
		
		$ionicLoading.show({
			template: 'Chargement des types de problèmes...',
			delay: 750
		});

		page = page || 1;
		types = types || [];

		return $http({
			method: 'GET',
			url: apiUrl + '/issueTypes',
			params: {
				page: page
			}
		}).then(function(res) {
			if (res.data.length) {
					types = types.concat(res.data);
				return getAllIssueTypes(page + 1, types);
				}

				$ionicHistory.nextViewOptions({
				disableBack: true,
				historyRoot: true
			});
			$ionicLoading.hide();

			return types;
		}).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err;
			throw new Error("Une erreur est survenue lors de l'obtention des types de problèmes");
		});
	}

	service.uploadPicture = function(pictureData, ctrl){
		$ionicLoading.show({
			template: 'Enregistrement de la photo...',
			delay: 750
		});

		return $http({
			method: 'POST',
			headers: {'Authorization' : 'Bearer ' + qimgToken},
			url: qimgUrl + '/images',
			data: {
				data : pictureData
			}
		}).then(function(res){
			ctrl.issue.imageUrl = res.data.url;
			$ionicLoading.hide();
		}).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err
			throw new Error("Impossible d'obtenir un lien pour la photo");
		});
	}

	service.postIssue = function(issue, ctrl){

		$ionicLoading.show({
			template: 'Enregistrement du problème...',
			delay: 750
		});

		if(issue.location == undefined){
			issue.location = {};
			issue.location.type = "Point";
			issue.location.coordinates = [ctrl.latitude, ctrl.longitude];
		}

		if(issue.tags == undefined && ctrl.tags !== undefined){
			issue.tags = [];
			ctrl.tags.forEach(function(tag){
				issue.tags.push(tag.text);
			})
			console.log(issue.tags);
		}

		return $http({
			method: 'POST',
			url: apiUrl + '/issues',
			data: issue
		}).then(function(res) {

			delete ctrl.error;
			
			$ionicLoading.hide();
			return ctrl.issue;
		}).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err;
			throw new Error("Une erreur est survenue lors de l'enregistrement du problème");
		});
	}

	return service;
});

angular.module('citizen-engagement').factory('mapService', function(geolocation, issuesService, mapBoxToken) {
	var service = {};

	service.center = {
		lat: 46.780690,
		lng: 6.647260,
		zoom: 14
	};

	geolocation.getLocation().then(function(data){
			service.center.lat = data.coords.latitude;
			service.center.lng = data.coords.longitude;
		});

	var mapboxAccessToken = mapBoxToken;
	var mapboxTileLayerUrl ="https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token="
	service.mapboxTileLayerUrl = mapboxTileLayerUrl + mapboxAccessToken;

	service.markers = [];

	issuesService.getIssues().then(function(data){
		data.forEach(function(issue){
			var msg = "<a href='#/tab/issueDetails/" + issue.id + "''>";
			msg += "<h4>" + issue.issueType.name + "</h4>"
			msg += issue.description;
			msg += "<img src='"+ issue.imageUrl +"' style='width:100%'>"
			msg += "</a>";
			service.markers.push({
				lat: issue.location.coordinates[1],
				lng: issue.location.coordinates[0],
				message: msg
			});
		});
	});

	return service;
});

angular.module('citizen-engagement').controller('newIssueCtrl', function(geolocation, issuesService, CameraService, $log, $ionicPopup, $scope, $state) {
	var ctrl = this;
	ctrl.issue = {};
	geolocation.getLocation().then(function(data){
		ctrl.latitude = data.coords.latitude;
		ctrl.longitude = data.coords.longitude;
	}).catch(function(err) {
		$log.error('Could not get location because: ' + err.message);
	});
	issuesService.getIssueTypes().then(function(data){
		ctrl.issueTypes = data;
	});
	ctrl.addIssue = function(){
		issuesService.postIssue(ctrl.issue, ctrl).then(function(){
			$state.go('tab.issueList');
		}).catch(function(err){
			$ionicLoading.hide();
			ctrl.error = err;
			throw new Error("Une erreur est survenue lors de l'enregistrement du problème");
		});
	};

	ctrl.takePicture = function() {
			
		if (!CameraService.isSupported()) {
			return $ionicPopup.alert({
				title: 'Non pris en charge',
				template: 'Vous ne pouvez pas utiliser l\'appareil photo sur cette plateforme' 
			});
		}
			
		CameraService.getPicture().then(function(result) {
			ctrl.pictureData = result;
			issuesService.uploadPicture(result, ctrl);
		});
	};
});

angular.module('citizen-engagement').controller('issueListCtrl', function(issuesService) {
	var ctrl = this;
	var page =  1;
	issuesService.getIssues().then(function(data) {
		ctrl.issues = data;
	});
	ctrl.update = function(){
		page = 1;
		issuesService.getIssuesSearch(page,ctrl.state,ctrl.search).then(function(data){
			ctrl.issues = data;
		});
	};
	ctrl.loadMore = function(){
		page = page + 1;
		issuesService.getIssuesSearch(page,ctrl.state,ctrl.search).then(function(data){
			ctrl.issues = ctrl.issues.concat(data);
		});
	}
});

angular.module('citizen-engagement').controller('issueListElementCtrl', function() {
	var ctrl = this;
});

angular.module('citizen-engagement').controller('issueDetailsCtrl', function(usersService, issuesService, $stateParams) {
	var ctrl = this;
	issuesService.getIssue($stateParams.issueId).then(function(data) {
		ctrl.issue = data;
	});
	issuesService.getIssueComments($stateParams.issueId).then(function(data) {
		ctrl.comments = data;
	});
	ctrl.postComment = function(){
		issuesService.postIssueComments($stateParams.issueId,ctrl);
	}
});

angular.module('citizen-engagement').controller('issueMapCtrl', function($scope, mapBoxToken, mapService) {
	var ctrl = this;
	ctrl.markers = mapService.markers;
	ctrl.center = mapService.center;
	ctrl.defaults = {
		tileLayer: mapService.mapboxTileLayerUrl
	};
});

angular.module('citizen-engagement').component('issueListElement', {
	templateUrl: 'templates/issueListElement.html',
	bindings: {
		issue: '<'
	},
	controller: 'issueListElementCtrl',
	controllerAs: 'issueListElementCtrl'
});

angular.module('citizen-engagement').component('issueComment', {
	templateUrl: 'templates/issueComment.html',
	bindings: {
		comment: '<'
	},
	controller: 'issueDetailsCtrl',
	controllerAs: 'issueDetailsCtrl'
});
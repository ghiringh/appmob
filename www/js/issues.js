angular.module('citizen-engagement').factory('issuesService', function($http, apiUrl) {
	var service = {};

	service.getIssues = function(){
		return $http.get(apiUrl + '/issues').then(function(res) {
			return res.data;
		});
	}

	service.getIssue = function(id){
		return $http.get(apiUrl + '/issues/' + id).then(function(res) {
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

	return service;
});

angular.module('citizen-engagement').factory('mapService', function(geolocation, issuesService, mapBoxToken) {
	var service = {};

	service.center = {
		lat: 46.780690,
		lng: 6.647260,
		zoom: 14
	};

	var mapboxAccessToken = mapBoxToken;
	var mapboxTileLayerUrl ="https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token="
	service.mapboxTileLayerUrl = mapboxTileLayerUrl + mapboxAccessToken;

	service.markers = [];

	issuesService.getIssues().then(function(data){
		data.forEach(function(issue){
			var msg = "<a href='#/tab/issueDetails/" + issue.id + "''>";
			msg += issue.description;
			msg += "<img src='"+ issue.imageUrl +"' style='width:100%'>"
			msg += "</a>";
			service.markers.push({
				lat: issue.location.coordinates[1],
				lng: issue.location.coordinates[0],
				message: msg,
				getIssueHref: function() {
					var scope = $scope.$new();
					scope.issueHref = 'issueDetails/' + issue.id;
					return scope;
				}
			});
		});

		console.log(service.markers);
		
	});

	geolocation.getLocation().then(function(data){
		service.center.lat = data.coords.latitude;
		service.center.lng = data.coords.longitude;
	});

	return service;
});

angular.module('citizen-engagement').controller('newIssueCtrl', function(geolocation, $log, $scope) {
	var ctrl = this;
	geolocation.getLocation().then(function(data){
		ctrl.latitude = data.coords.latitude;
		ctrl.longitude = data.coords.longitude;
	}).catch(function(err) {
		$log.error('Could not get location because: ' + err.message);
	});
});

angular.module('citizen-engagement').controller('issueListCtrl', function(issuesService) {
	var ctrl = this;
	issuesService.getIssues().then(function(data) {
		ctrl.issues = data;
	});
});

angular.module('citizen-engagement').controller('issueDetailsCtrl', function(usersService, issuesService, $stateParams) {
	var ctrl = this;
	issuesService.getIssue($stateParams.issueId).then(function(data) {
		ctrl.issue = data;
	});
	issuesService.getIssueComments($stateParams.issueId).then(function(data) {
		ctrl.comments = data;
	});
});

angular.module('citizen-engagement').controller('issueMapCtrl', function($scope, mapBoxToken, mapService) {
	var ctrl = this;
	ctrl.defaults = {};
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
	controller: 'issueListCtrl',
	controllerAs: 'issueListCtrl'
});

angular.module('citizen-engagement').component('issueComment', {
	templateUrl: 'templates/issueComment.html',
	bindings: {
		comment: '<'
	},
	controller: 'issueDetailsCtrl',
	controllerAs: 'issueDetailsCtrl'
});
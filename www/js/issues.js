angular.module('citizen-engagement').factory('issuesService', function($http, apiUrl) {
	var service = {};

	service.getIssues = function(){
		return $http.get(apiUrl + '/issues').then(function(res) {
			return res.data;
		});
	}

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

	$scope.tags = [
		{ text: 'just' },
		{ text: 'some' },
		{ text: 'cool' },
		{ text: 'tags' }
	];
});

angular.module('citizen-engagement').controller('issueListCtrl', function(issuesService) {
	var ctrl = this;
	issuesService.getIssues().then(function(data) {
		ctrl.issues = data;
	});
});

angular.module('citizen-engagement').controller('issueMapCtrl', function($scope, mapBoxToken) {
	var ctrl = this;
	ctrl.defaults = {};
	ctrl.markers = [];
	ctrl.center = {
		lat: 51.48,
		lng: 0,
		zoom: 14
	};
	var record = {
		title: 'Lorem ipsum'
	};
	var mapboxMapId = 'mapbox.satellite';
	var mapboxAccessToken = mapBoxToken;
	var mapboxTileLayerUrl = 'http://api.tiles.mapbox.com/v4/' + mapboxMapId;
	mapboxTileLayerUrl = mapboxTileLayerUrl + '/{z}/{x}/{y}.png';
	mapboxTileLayerUrl = mapboxTileLayerUrl + '?access_token=' + mapboxAccessToken;
	ctrl.defaults = {
		tileLayer: mapboxTileLayerUrl
	};
	var msg = '<p>Hello World!</p>';
	msg += '<p>{{ record.title }}</p>';
	ctrl.markers.push({
		lat: 51.48,
		lng: 0,
		message: msg,
		getMessageScope: function() {
			var scope = $scope.$new();
			scope.record = record;
			return scope;
		}
	});
});

angular.module('citizen-engagement').component('issueListElement', {
	templateUrl: 'templates/issueListElement.html',
	bindings: {
		issue: '<'
	},
	controller: function($scope) {
		var issueListElementCtrl = this;
	},
	controllerAs: 'issueListElementCtrl'
});
angular.module('citizen-engagement', ['ionic', 'angular-storage','geolocation','leaflet-directive','ngTagsInput']);

angular.module('citizen-engagement').run(function($ionicPlatform, AuthService, $rootScope, $state) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});

	$rootScope.$on('$stateChangeStart', function(event, toState) {
		if (!AuthService.authToken && toState.name != 'login' && toState.name != 'addUser') {
			event.preventDefault();
			$state.go('login');
		}
	});
})

angular.module('citizen-engagement').config(function($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {

	$stateProvider

	.state('login', {
		url: '/login',
		controller: 'LoginCtrl',
		controllerAs: 'loginCtrl',
		templateUrl: 'templates/login.html'
	})
	
	.state('addUser', {
		url: '/addUser',
		controller: 'addUserCtrl',
		controllerAs: 'addUserCtrl',
		templateUrl: 'templates/addUser.html'
	})

	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	})

	.state('tab.newIssue', {
		url: '/newIssue',
		controller: 'newIssueCtrl',
		controllerAs: 'newIssueCtrl',
		views: {
			'tab-newIssue': {
				templateUrl: 'templates/newIssue.html'
			}
		}
	})

	.state('tab.issueMap', {
		url: '/issueMap',
		views: {
			'tab-issueMap': {
				controller: 'issueMapCtrl',
				controllerAs: 'issueMapCtrl',
				templateUrl: 'templates/issueMap.html'
			}
		}
	})

	.state('tab.issueList', {
		url: '/issueList',
		controller: 'issueListCtrl',
		controllerAs: 'issueListCtrl',
		views: {
			'tab-issueList': {
				templateUrl: 'templates/issueList.html'
			}
		}
	})

	.state('tab.profil', {
		url: '/profil',
		controller: 'profilCtrl',
		controllerAs: 'profilCtrl',
		views: {
			'tab-profil': {
				templateUrl: 'templates/profil.html'
			}
		}
	})

	.state('tab.issueDetails', {
		url: '/issueDetails/:issueId',
		controller: 'issueDetailsCtrl',
		controllerAs: 'issueDetailsCtrl',
		views: {
			'tab-issueList': {
		templateUrl: 'templates/issueDetails.html'
			}
		}
	});

	$urlRouterProvider.otherwise(function($injector) {
		$injector.get('$state').go('tab.issueList');
	});

	$logProvider.debugEnabled(false);
	$httpProvider.interceptors.push('AuthInterceptor');
});
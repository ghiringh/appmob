angular.module('citizen-engagement').factory('issueListService', function($http, apiUrl) {
  var service = {};

  service.getIssues = function(){
    return $http.get(apiUrl + '/issues').then(function(res) {
      return res.data;
    });
  }

  return service;
});

angular.module('citizen-engagement').controller('issueListCtrl', function(issueListService) {
  var ctrl = this;
  issueListService.getIssues().then(function(data) {
    ctrl.issues = data;
  });
});

angular.module('citizen-engagement').component('issueListElement', {
  templateUrl: 'templates/issueListElement.html',
  bindings: {
    issue: '<'
  },
  controller: function($scope) {
    console.log($scope);
    var issueListElementCtrl = this;
  },
  controllerAs: 'issueListElementCtrl'
});
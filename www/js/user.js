angular.module('citizen-engagement').factory('userService', function($http, apiUrl) {
  var service = {};

  service.getUser = function(){
    return $http.get(apiUrl + '/me').then(function(res) {
      return res.data;
    });
  }

  return service;
});

angular.module('citizen-engagement').controller('userCtrl', function(userService) {
  var ctrl = this;
  userService.getUser().then(function(data) {
    ctrl.user = data;
  });
});

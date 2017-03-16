angular.module('citizen-engagement').factory('profilService', function($http, apiUrl) {
  var service = {};

  service.getMe = function(){
    return $http.get(apiUrl + '/me').then(function(res) {
      return res.data;
    });
  }

  return service;
});

angular.module('citizen-engagement').controller('profilCtrl', function(profilService) {
  var ctrl = this;
  userService.getMe().then(function(data) {
    ctrl.me = data;
  });
});

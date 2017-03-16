angular.module('citizen-engagement').factory('usersService', function($http, apiUrl) {
  var service = {};

  service.getMe = function(){
    return $http.get(apiUrl + '/me').then(function(res) {
      return res.data;
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

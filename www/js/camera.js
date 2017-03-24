angular.module('citizen-engagement').factory('CameraService', function($q) {
  
  var service = {
    isSupported: function() {
      return navigator.camera !== undefined;
    },
    
    getPicture: function() {
      var deferred = $q.defer();
      var options = { // Return the raw base64 PNG data
        destinationType: navigator.camera.DestinationType.DATA_URL,
        correctOrientation: true
      };
      navigator.camera.getPicture(function(result) {
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      }, options);
      return deferred.promise;
    }
  };
  return service;
});
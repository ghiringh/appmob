angular.module('citizen-engagement').controller('NewIssueController', function(CameraService, $log) {
  var newIssueCtrl = this;
    
  newIssueCtrl.takePicture = function() {
      
       if (!CameraService.isSupported()) {
      return $ionicPopup.alert({
        title: 'Not supported',
        template: 'You cannot use the camera on this platform'
      });
    }
      
    CameraService.getPicture().then(function(result) {
      $log.debug('Picture taken!');
      newIssueCtrl.pictureData = result;
    }).catch(function(err) {
      $log.error('Could not get picture because: ' + err.message);
    });
  };
});


app

.controller('DashboardCtrl', function($scope,$ionicModal,$rootScope,$state,$ionicHistory) {
  $scope.goParking=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.parkinglots');
  };

  $scope.goQuery=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.query');
  };

  $scope.goTickets=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.tickets');
  };






  
})
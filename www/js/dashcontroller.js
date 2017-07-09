app

.controller('DashboardCtrl', function($scope,$ionicModal,$rootScope,$state,$ionicHistory) {
  $scope.goParking=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.parkinglots');
    $rootScope.setGauge($rootScope.maxCapacity,0,$rootScope.parkingAvaible,"#0c0569");
    $rootScope.startCounter();
  };

  $scope.goQuery=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.query');
  };

  $scope.goUsers=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.users');
  };

  







  
})
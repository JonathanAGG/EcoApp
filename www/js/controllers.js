angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$rootScope, $ionicModal, $timeout,$timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal


  $scope.enterParkinglot = function (placa){    
    if (placa==""||placa==" "|| placa==null) {
      $rootScope.showAlert("Verifique la placa");
    } else {
      var dateIn = new Date().valueOf();
      $rootScope.userCurrentParkingRef.set({
        "placa":placa,
        "in":dateIn,
        "out":0
      });

      try{
        window.QRScanner.show();  
      }
      catch(err){
        console.log(err);
      }
      

      $rootScope.inGateRef.set(true);
      $rootScope.inGateRef.on("value",function(snapshot) {  // LIST OF ALL PRODUCTS OF THE COMPANY
        var snap = snapshot.val();  
        $timeout(function() {
          $rootScope.inGateRef.set(false);                       
        }, 2000); 

      });
    }
  };

  $scope.leaveParkinglot=function(){
    $rootScope.userCurrentParkingRef.set({
      "placa":" ",
      "in":0,
      "out":0
    });

  };



})



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


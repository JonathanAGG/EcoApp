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
      try{
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            if(!result.cancelled){
              if (result.text=="entrada") {     //Setea la hora de inicio y placa & abre la puerta de entrada
                  var dateIn = new Date().valueOf();
                  $scope.startCounter();
                  $rootScope.userCurrentParkingRef.set({
                    "placa":placa,
                    "in":dateIn,
                    "out":0
                  });
                
                $rootScope.inGateRef.set(true);
                $rootScope.inGateRef.on("value",function(snapshot) {  
                  var snap = snapshot.val();  
                  $timeout(function() {$rootScope.inGateRef.set(false);}, 5000); 
                });
              }else{    //Se ha leido otro codigo
                $rootScope.showAlert("Código QR inválido!!");
              }
            }
            else
            {
              console.log("You have cancelled scan");
            }
          },
          function (error) {
            $rootScope.showAlert("Error al leer Código de QR, intentar de nuevo");
            //console.log("Scanning failed: " + error);
          }
        );
      }
      catch(err){
        console.log(err);
      }
    }
  };

  $scope.leaveParkinglot=function(){
    try{
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if(!result.cancelled){
            if (result.text=="salida") {     //Setea la hora de inicio y placa & abre la puerta de salida
                var dateOn = new Date().valueOf();
                $rootScope.userCurrentParkingRef.child("out").set(dateOn);

              $rootScope.outGateRef.set(true);
              $rootScope.outGateRef.on("value",function(snapshot) {  
                var snap = snapshot.val();  
                $timeout(function() {$rootScope.outGateRef.set(false);}, 5000); 
              });
            }else{    //Se ha leido otro codigo
              $rootScope.showAlert("Código QR inválido!!");
            }
          }
          else
          {
            console.log("You have cancelled scan");
          }
        },
        function (error) {
            console.log("Scanning failed: " + error);
        }
      );
    }
    catch(err){
      console.log(err);
    }



    $rootScope.userCurrentParkingRef.set({
      "placa":" ",
      "in":0,
      "out":0
    });

  };

  function cronometro () {
    if ($rootScope.cents < 99) {
      $rootScope.cents++;
      if ($rootScope.cents < 10) { $rootScope.cents = "0"+$rootScope.cents }
      $rootScope.cents.innerHTML = ":"+$rootScope.cents;
    }
    if ($rootScope.cents == 99) {
      $rootScope.cents = -1;
    }
    if ($rootScope.cents == 0) {
      $rootScope.secs ++;
      if ($rootScope.secs < 10) { $rootScope.secs = "0"+$rootScope.secs }
      $rootScope.secs.innerHTML = ":"+$rootScope.secs;
    }
    if ($rootScope.secs == 59) {
      $rootScope.secs = -1;
    }
    if ( ($rootScope.cents == 0)&&($rootScope.secs == 0) ) {
      $rootScope.mins++;
      if ($rootScope.mins < 10) { $rootScope.mins = "0"+$rootScope.mins }
      $rootScope.mins.innerHTML = ":"+$rootScope.mins;
    }
    if ($rootScope.mins == 59) {
      $rootScope.mins = -1;
    }
    if ( ($rootScope.cents == 0)&&($rootScope.secs == 0)&&($rootScope.mins == 0) ) {
      $rootScope.hours ++;
      if ($rootScope.hours < 10) { $rootScope.hours = "0"+$rootScope.hours }
      $rootScope.hours.innerHTML = $rootScope.hours;
    }

    $rootScope.$digest();
  };

  $scope.startCounter= function(){
    $rootScope.cents = 0;
    $rootScope.secs = 0;
    $rootScope.mins = 0;
    $rootScope.hours = 0;

    setInterval(cronometro(),10);




    // if ($rootScope.currenParking.isIn){
    //   var currentDate= new Date();
    //   var difference= currentDate - $rootScope.currenParking.inHourValue;
    //   var hours = difference/3600000;
    //   var min = difference/60000
    //   var sec = difference/1000
    //   console.log(hours.toString().concat(":".concat(min.toString().concat(":".concat(sec.toString())))));
    // }

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

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.map.setCenter(new google.maps.LatLng(9.856021, -83.913601)); // Centra el mapa en una posicion inicial
    
    var transitLayer = new google.maps.TransitLayer();  //Habilita la capa de trafico
    transitLayer.setMap(map);
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: true
    });

    navigator.geolocation.getCurrentPosition(function (pos) {      
      var myLatLng = {lat: pos.coords.latitude, lng: pos.coords.longitude}; // Obtiene las coordenandas del navegador      
     

     
      console.log(myLatLng.lat,myLatLng.lng);                                   

      $scope.map.setCenter(new google.maps.LatLng(myLatLng.lat, myLatLng.lng)); //Centra el mapa en esa posicion
      
 
      var map = new google.maps.Map(document.getElementById('map'), { //Obtienen el mapa
        zoom: 16,
        center: myLatLng
      });

      var marker = new google.maps.Marker({     // Crea un marcador en la posicion indicada
        position: myLatLng,
        map: map,
        draggable:true,
        title: 'Aquí esta un estudianTEC',
        label: 'TEC'
      });

      var infoWindow = new google.maps.InfoWindow({map: map});    // Crea un infoWindow 
      infoWindow.setPosition(myLatLng);
      infoWindow.setContent('Aquí esta un estudianTEC');


      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };





  
})


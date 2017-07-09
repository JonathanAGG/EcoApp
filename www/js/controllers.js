angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$rootScope, $ionicModal, $timeout,$timeout,$state,$ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  if ($state.current.name=="app.parkinglots") {
    //console.log('app.parkinglots');
  } 

  $rootScope.setGauge =function (maxLevel,minLevel,value,color){  
    console.log(maxLevel,minLevel,value) ;
    console.log(typeof minLevel);
    var opts = {
      lines: 12, // The number of lines to draw
      angle: 0.3, // The span of the gauge arc
      lineWidth: 0.1, // The line thickness
      pointer: {
        length: 0.9, // The radius of the inner circle
        strokeWidth: 0.5, // The thickness
        color: '#000000' // Fill color
      },
      limitMax: false,     // If true, the pointer will not go past the end of the gauge
      colorStart: "#30b253",   // Colors
      colorStop: color,    // just experiment with them
      strokeColor: '#FFFFFF',  // to see which ones work best for you
      //generateGradient: true,
      highDpiSupport: true     // High resolution support
    };
    //var target = document.getElementById('gauge'); // your canvas elemen
    //$rootScope.target = document.getElementsByClassName("canvasID");
    var target = $rootScope.target;
    console.log(target);
    var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
    if (minLevel!=null){gauge.setMinValue(0);}else{gauge.setMinValue(0);};
    
    gauge.maxValue = maxLevel; // set max gauge value
    gauge.animationSpeed = 32; // set animation speed (32 is default value)
    gauge.set(value); // set actual value
  };

  $rootScope.parkingInit = function (){
    $rootScope.target = document.getElementById('gauge'); // your canvas elemen
    $rootScope.setGauge($rootScope.maxCapacity,0,$rootScope.parkingAvaible,"#32ab20");

  };

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
                  $rootScope.currenParking.placa=placa;
                  $rootScope.userCurrentParkingRef.set({
                    "placa":placa,
                    "in":dateIn,
                    "out":0
                  });
                
                $rootScope.inGateRef.set(true);
                $rootScope.showAlert("¡Bienvenido(a)!");
                $rootScope.inGateRef.on("value",function(snapshot) {  
                  var snap = snapshot.val();  
                  $timeout(function() {$rootScope.inGateRef.set(false);}, 5000); 
                });
              }else{    //Se ha leido otro codigo
                $rootScope.showAlert("¡Código QR inválido!");
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
      console.log("open QR");
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if(!result.cancelled){
            if (result.text=="salida") {     //Setea la hora de inicio y placa & abre la puerta de salida
                var outHourValue = new Date().valueOf();
                $rootScope.userCurrentParkingRef.child("out").set(outHourValue);
                console.log("seteando salida");
                $rootScope.outGateRef.set(true);
                $rootScope.showAlert("¡Gracias por su preferencia, buen viaje!");
                $rootScope.outGateRef.on("value",function(snapshot) {  
                  var snap = snapshot.val();  
                  $timeout(function() {$rootScope.outGateRef.set(false);}, 5000); 
                });
                
                $rootScope.userHistoryParkingRef.push({
                  "placa":$rootScope.currenParking.placa,
                  "in":$rootScope.currenParking.inHourValue,
                  "out":outHourValue,
                  "total":outHourValue-$rootScope.currenParking.inHourValue
                });

            }else{    //Se ha leido otro codigo
              $rootScope.showAlert("¡Código QR inválido!");
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




  $rootScope.goParkingHistory = function(){
    $state.go('app.parkinghistory');
  };


  $rootScope.goPolicy = function(){
    $state.go('app.policy');
  };

  $rootScope.goDelinquency = function(){
    $state.go('app.delinquency');
  };

  $rootScope.goBoats = function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.boats');
  };

  $rootScope.goTickets=function(){    
    $state.go('app.tickets');
  };


  $rootScope.fichas = [
    { 
      "numero":1,
      "nombre":"Esteban Martínez "
    },
    { 
      "numero":2,
      "nombre":"Gabriel Fernandez"
    },
    { 
      "numero":3,
      "nombre":"Stephanie Williams"
    },
    { 
      "numero":4,
      "nombre":"Ilena Zheng"
    },
    { 
      "numero":5,
      "nombre":"Jonathan Granados"
    }
  ]

  

  $rootScope.cronometro =function () {
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


    $rootScope.secsH = $rootScope.pad($rootScope.secs,2);
    $rootScope.minsH = $rootScope.pad($rootScope.mins,2);
    $rootScope.hoursH = $rootScope.pad($rootScope.hours,2);
    

    console.log($rootScope.secs);

    $rootScope.$digest();
  };

  $rootScope.startCounter= function(){
    $rootScope.cents = 0;
    $rootScope.secs = 0;
    $rootScope.mins = 0;
    $rootScope.hours = 0;

    setInterval(function(){ 
      $rootScope.cronometro();
    }, 10);

    //setInterval(,10);




    // if ($rootScope.currenParking.isIn){
    //   var currentDate= new Date();
    //   var difference= currentDate - $rootScope.currenParking.inHourValue;
    //   var hours = difference/3600000;
    //   var min = difference/60000
    //   var sec = difference/1000
    //   console.log(hours.toString().concat(":".concat(min.toString().concat(":".concat(sec.toString())))));
    // }

  };


  $rootScope.getDate = function (value){
    var date = new Date(value);
    return date.toLocaleDateString();
  };

  $rootScope.getDuration = function (duration){

    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds ;    
  };




})






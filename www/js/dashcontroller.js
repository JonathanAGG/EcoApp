app

.controller('DashboardCtrl', function($scope,$ionicModal,$rootScope,$state,$ionicHistory) {
  $scope.goParking=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.parkinglots');
    $rootScope.setGauge(500,0,480,"#53fa3b");
  };

  $scope.goQuery=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.query');
  };

  $scope.goTickets=function(){
    $ionicHistory.nextViewOptions({disableAnimate: false,disableBack: false});
    $state.go('app.tickets');
  };

$rootScope.setGauge =function (maxLevel,minLevel,value,color){   
        var opts = {
          lines: 12, // The number of lines to draw
          angle: 0.3, // The span of the gauge arc
          lineWidth: 0.1, // The line thickness
          pointer: {
            length: 0.9, // The radius of the inner circle
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
          },
          limitMax: false,     // If true, the pointer will not go past the end of the gauge
          colorStart: '#30b253',   // Colors
          colorStop: color,    // just experiment with them
          strokeColor: '#FFFFFF',  // to see which ones work best for you
          generateGradient: true,
          highDpiSupport: true     // High resolution support
        };
        var target = document.getElementById('gauge'); // your canvas element
        var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
        if (minLevel!=null){gauge.setMinValue(0);}else{gauge.setMinValue(0);};
        
        gauge.maxValue = maxLevel; // set max gauge value
        gauge.animationSpeed = 32; // set animation speed (32 is default value)
        gauge.set(value); // set actual value
      };





  
})
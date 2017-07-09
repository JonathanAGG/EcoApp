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
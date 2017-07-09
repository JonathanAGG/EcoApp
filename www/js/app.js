// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform,$ionicLoading,$rootScope,$state,$ionicModal,$ionicPopup,$ionicHistory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });


  if($rootScope.currenParking==null){ $rootScope.currenParking={};}

  var StartFirebase = function (){  
    $ionicLoading.show();
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBpComDs6HSo3NSfEyUmQbkG7QT7aggjQg",
      authDomain: "ecoapp-303b4.firebaseapp.com",
      databaseURL: "https://ecoapp-303b4.firebaseio.com",
      projectId: "ecoapp-303b4",
      storageBucket: "ecoapp-303b4.appspot.com",
      messagingSenderId: "194004909087"

    };
    firebase.initializeApp(config);
    $rootScope.host=config.authDomain;

    

    
    /**************************** REFERENSES TO THE DATABASE IN FIREBASE***************************/
    $rootScope.databaseRef = firebase.database().ref();    
    $rootScope.usersRef = firebase.database().ref('/users');     
    $rootScope.inGateRef = firebase.database().ref('/inGate'); 
    $rootScope.outGateRef = firebase.database().ref('/outGate'); 
    $rootScope.currentParkingRef = firebase.database().ref('/currentParking'); 
    $rootScope.maxCapacityRef = firebase.database().ref('/maxCapacity'); 

    
    

    $rootScope.parkingBillRef = firebase.database().ref('/parkingBill'); 


    $rootScope.fichasRef = firebase.database().ref('/convoFichas'); 
    $rootScope.fichasRef = firebase.database().ref('/listaSocios  '); 
   
    
    //$rootScope.canjesRef = firebase.database().ref('/canjees'); //premios Firebase Reference
    $rootScope.connectedRef = firebase.database().ref('.info/connected');    
    /**************************** REFERENCES TO STORAGE IN FIREBASE***************************/

    $rootScope.storageRef = firebase.storage().ref();    
    $rootScope.imgUsersRef = firebase.storage().ref('/users');
    $rootScope.imgProductsRef = firebase.storage().ref('/products');

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

    

    // Maneja la situacion cuando se desconecta la base de datos  
    try{
      $ionicLoading.show(); 
      $rootScope.connectedRef.on('value', function(snap) {
      if (snap.val() === true) {  //Esta CONECTADO!!
            if(firebase.auth().currentUser!=null){              
              $rootScope.myConnectionsRef = firebase.database().ref('/ConnectedUsers/'+firebase.auth().currentUser.uid+'/connections');
              $rootScope.lastOnlineRef = firebase.database().ref('/ConnectedUsers/'+firebase.auth().currentUser.uid+'/connections');// stores the timestamp of my last disconnect (the last time I was seen online)
              console.log("connected to Database "); 
            }
          if (firebase.auth().currentUser!=null){   //HAY SESION ACTIVA
            var con = $rootScope.myConnectionsRef.push(true);
            $rootScope.connectionKey= con.key;
            con.onDisconnect().remove(); // when I disconnect, remove this device                
            $rootScope.lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP); // when I disconnect, update the last time I was seen online                                    
          }     
          else{ //NO HAY SESION ACTIVA
            $state.go('login');
          }
        }else{ //Esta DESCONECTADO!
          if ($rootScope.currentUser!=undefined){ 
            console.log("disconnected to Database ");
          }
        }        
      }); 
      // CREA EL EVENT HANDLER CUANDO CAMBIA EL ESTADO DE LA SESION
      
      firebase.auth().onAuthStateChanged(function(user) {                
        if (user) {// User is signed in.        
          $rootScope.currentUser = firebase.auth().currentUser;                           
          console.log("UID:",firebase.auth().currentUser.uid);

          $rootScope.usersRef.child(user.uid).on("value",function(snapshot) {  // LIST OF ALL PRODUCTS OF THE COMPANY
            var snap = snapshot.val();              
            $rootScope.currentUser.ID=snap.ID;
            $rootScope.currentUser.phone=snap.phone;
            $rootScope.currentUser.role=snap.role;
            $ionicHistory.nextViewOptions({disableAnimate: true,disableBack: true});
            $state.go('app.dashboard');                 
          });              
          $rootScope.userHistoryParkingRef = firebase.database().ref('/historyParking').child(user.uid);
          $rootScope.userCurrentParkingRef = firebase.database().ref('/currentParking/'+user.uid); 
          $rootScope.userCurrentParkingRef.on("value",function(snapshot) {  // LIST OF ALL PRODUCTS OF THE COMPANY
            var snap = snapshot.val();              
            
            if (snap==null){
              $rootScope.userCurrentParkingRef.set({
                "placa":" ",
                "in":0,
                "out":0
              });
              $rootScope.currenParking.isIn=false;
            }else{
              //console.log(snap);
              if (snap.in==0) {
                $rootScope.currenParking.isIn=false;
              }else{                
                $rootScope.currenParking.isIn=true;
                var date = new Date(snap.in);    
                $rootScope.currenParking.inHourValue = date;
                $rootScope.currenParking.inHourString = date.getHours().toString().concat(":".concat(date.getMinutes().toString()));
              } //Asigna el scope para parkinlots.html
            }

          });              
                   
          $rootScope.myConnectionsRef = firebase.database().ref('/ConnectedUsers/'+$rootScope.currentUser.uid+'/connections');
          $rootScope.lastOnlineRef = firebase.database().ref('/ConnectedUsers/'+$rootScope.currentUser.uid+'/connections');// stores the timestamp of my last disconnect (the last time I was seen online)
          $rootScope.userDataRef = firebase.database().ref('/ConnectedUsers/'+$rootScope.currentUser.uid+'/data');
          $rootScope.userDataRef.set({"email":$rootScope.currentUser.email,"displayName":$rootScope.currentUser.displayName});                           
                    
        } else {    // No user is signed in.                    
          console.log("No user is signed in.");      
          $state.go("login");
        }
      });
    }
    finally{
      $ionicLoading.hide(); 
    }

    $rootScope.maxCapacityRef.on("value",function(snapshot){
      $rootScope.maxCapacity = snapshot.val();      
    });

    $rootScope.currentParkingRef.on("value",function(snapshot) {  // Cuenta la cantidad de 
      var snap = snapshot.val();
      var onUse=0;
      if(snap!=null){$rootScope.currentParkings = Object.keys(snap).map(function(k) { var aux = snap[k]; aux.key = k; return aux });}else {$rootScope.currentParkings=[];}$rootScope.$digest();           

      for (var i = $rootScope.currentParkings.length - 1; i >= 0; i--) {
        if ($rootScope.currentParkings[i].in!=0) {onUse++;}
      }
      $rootScope.parkingAvaible = $rootScope.maxCapacity - onUse;

      console.log($state.current.name);
      if ($state.current.name!="app.dashboard") {
        $state.go('app.dashboard');
      }
      
       

      $rootScope.setGauge(500,0,480,"#53fa3b");
      
      
    });
      
    

  // $rootScope.parqueosRef.on("value",function(snapshot) {  // LIST OF ALL PRODUCTS OF THE COMPANY
  //   var snap = snapshot.val();  
  //   if(snap!=null){$rootScope.currentProductos = Object.keys(snap).map(function(k) { var aux = snap[k]; aux.key = k; return aux });}else {$rootScope.currentProductos=[];}$state.reload();           
  // });


    

  };

  StartFirebase();



  $rootScope.logOut = function(){      
    $ionicLoading.show();
    firebase.auth().signOut().then(function() {        
        $ionicLoading.hide();
        $state.go('login');
    }, function(error) {        
        $ionicLoading.hide();
        $rootScope.showAlert("Error");
    });    
  };



  $rootScope.showAlert = function(mensaje) {
    var confirmPopup = $ionicPopup.confirm({
         title: 'SkyPuntos ',
         template: mensaje,
         buttons:[
          {text:'Ok',type:'button-positive',onTap: function(e) {return true;}},          
         ]
    });     
  };

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    id: '1', // We need to use and ID to identify the modal that is firing the event!
    scope: $rootScope,
    backdropClickToClose: true,
    animation: 'slide-in-up'   
  }).then(function(modal) {
    $rootScope.signupModal = modal;
  });

  

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

 
  .state('login', {
    url: '/login',    
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  })

  .state('app.parkinglots', {
    url: '/parkinglots',
    views: {
      'menuContent': {
        templateUrl: 'templates/parkinglots.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.query', {
    url: '/query',
    views: {
      'menuContent': {
        templateUrl: 'templates/query.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.tickets', {
    url: '/tickets',
    views: {
      'menuContent': {
        templateUrl: 'templates/tickets.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.users', {
    url: '/users',
    views: {
      'menuContent': {
        templateUrl: 'templates/users.html',
        controller: 'AppCtrl'
      }
    }
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});

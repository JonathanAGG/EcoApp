// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform,$ionicLoading,$rootScope,$state,$ionicModal,$ionicPopup) {
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

  var StartFirebase = function (){  
    $ionicLoading.show();

    //Configura la aplicación con firebase   
    
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
    $rootScope.usuariosRef = firebase.database().ref('/usuarios');     
    $rootScope.parqueosRef = firebase.database().ref('/parqueos'); 
    $rootScope.fichasRef = firebase.database().ref('/facturasParqueo'); 
    $rootScope.fichasRef = firebase.database().ref('/convoFichas'); 
    $rootScope.fichasRef = firebase.database().ref('/listaSocios  '); 
   
    
    //$rootScope.canjesRef = firebase.database().ref('/canjees'); //premios Firebase Reference
    $rootScope.connectedRef = firebase.database().ref('.info/connected');    
    /**************************** REFERENCES TO STORAGE IN FIREBASE***************************/

    $rootScope.storageRef = firebase.storage().ref();    
    $rootScope.imgUsersRef = firebase.storage().ref('/users');
    $rootScope.imgProductsRef = firebase.storage().ref('/products');

    

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
          $rootScope.currentUser= firebase.auth().currentUser;                           
          console.log("UID:",firebase.auth().currentUser.uid);
          firebase.database().ref('SkyAdventures/intros/'+user.uid).on("value",function(snapshot) {  // el valor de la intro del usuario
            var snap = snapshot.val();  
            $rootScope.intro=snap;
            //console.log("Intro:",snap);
            if(snap==null || snap==false){
              //$rootScope.goIntro();   
              $rootScope.goDasshboard();
              $timeout(function() {
                               
                }, 2000);                             
            }else{$rootScope.goDasshboard();}
          });

          //console.log($rootScope.telefonoFired);
          firebase.database().ref('SkyAdventures/uTelefonos/'+user.uid).on("value",function(snapshot) {            
            var telefono=snapshot.val();//console.log(telefono);            
            var timeout;
            if ((telefono==null)||(telefono=='')){              
              $rootScope.currentUser.telefono='';
              //console.log(telefono);
              if ($rootScope.intro){timeout=10000;}
              else{timeout=10000;/*timeout=60000;*/}
              if($rootScope.telefonoFired==false){
                $rootScope.telefonoFired=true;
                $timeout(function() {
                  $rootScope.goCuenta(true);
                  $rootScope.showAlert('Agrega tu número de teléfono, para notificarte cuando tus premios esten listos!');
                }, timeout);                              
              }
            }else{$rootScope.currentUser.telefono=telefono;}
          });


          $rootScope.loadUserInfo(user.uid);

          
          $rootScope.myConnectionsRef = firebase.database().ref('/ConnectedUsers/'+$rootScope.currentUser.uid+'/connections');
          $rootScope.lastOnlineRef = firebase.database().ref('/ConnectedUsers/'+$rootScope.currentUser.uid+'/connections');// stores the timestamp of my last disconnect (the last time I was seen online)
          $rootScope.userDataRef = firebase.database().ref('/ConnectedUsers/'+$rootScope.currentUser.uid+'/data');
          $rootScope.userDataRef.set({"email":$rootScope.currentUser.email,"displayName":$rootScope.currentUser.displayName});                           
          
          firebase.database().ref('SkyAdventures/canjees/'+user.uid).on("value",function(snapshot) {  // carga los canjes del usuario
            var snap = snapshot.val();  
            if(snap!=null){$rootScope.currentCanjees = Object.keys(snap).map(function(k) { var aux = snap[k]; aux.key = k; return aux });}else {$rootScope.currentCanjees=[];}$state.reload();                       
          });

        } else {    // No user is signed in.                    
          console.log("No user is signed in.");      
          $state.go("login");
        }
      });
    }
    finally{
      $ionicLoading.hide(); 
    }
      
    

    $rootScope.parqueosRef.on("value",function(snapshot) {  // LIST OF ALL PRODUCTS OF THE COMPANY
      var snap = snapshot.val();  
      if(snap!=null){$rootScope.currentProductos = Object.keys(snap).map(function(k) { var aux = snap[k]; aux.key = k; return aux });}else {$rootScope.currentProductos=[];}$state.reload();           
    });


    

  };

  StartFirebase();







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

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
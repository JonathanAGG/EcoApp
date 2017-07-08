app
.controller('LoginCtrl', function($scope,$rootScope, $ionicModal, $timeout,$ionicLoading,$state,$ionicPlatform) {
  //***********SE INICIALIZAN LAS VARIABLES**********************//
  $scope.loginData = {}; //Para el login con Email

 /* $ionicPlatform.registerBackButtonAction(function () {    
    console.log("back button");    
  }, 100);*/

  //Revisa cuando es de facebook o google e inicia elloadin
  //$ionicLoading.show();
  
  // firebase.auth().getRedirectResult().then(function(result) {
  //   //console.log(result);
  //   //console.log($state.$current.name);
  //   $ionicLoading.hide();    
  //   //var user = result.user;
  //   //$rootScope.currentUser=user;    
  //   if (firebase.auth().currentUser!=null){/*$state.go('app.dashboard');*/}
  //   else {$state.go('login');}
  // },function(error) {// Handle Errors here.    
  //   var errorCode = error.code;
  //   var errorMessage = error.message;  // The email of the user's account used.    
  //   var email = error.email; // The firebase.auth.AuthCredential type that was used.    
  //   var credential = error.credential;            
  // });

  /********************************************************************/

  $scope.loginData = {};

  



  $scope.updateUserProfile = function(user,email){//user is a firebase object
    if (user.photoURL==(''||null)) {
      user.updateProfile({photoURL: user.picture})
      .then(function() { console.log("Foto actualizada!");          
      }, function(error) {console.log(error);
      });
    }
    if (user.displayName==(''||null)) {
      user.updateProfile({displayName: user.name})
      .then(function() {console.log("Nombre actualizado!");            
      }, function(error) {console.log(error);
      });
    }
    if (user.email==(''||null)) {
      user.updateEmail(email).then(function() { console.log("Email actualizado!");           
      }, function(error) {console.log(error);
      });  
    }
  };

  //************FUNCIONES PARA LOGIN CON EMAIL**************//
 
  $scope.verifyEmailLogin = function(loginData){
    console.log(loginData);
    try{
      if(loginData.email==""||loginData.email==" "||loginData.email==null){$rootScope.showAlert("Verifique el Email");}
      else if(loginData.password==""||loginData.password==" "||loginData.password==null){$rootScope.showAlert("Verifique la Contraseña");}
      else {
        //$ionicLoading.show();
        firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password).then(function(user) {
          //console.log(user);//Sign In correcto!!    
          $rootScope.currentUser=user;
          $scope.primera = 0;          
          $state.go('app.dashboard');  
          $ionicLoading.hide();
        }, function(err) {
          //console.log(err);
          var code = err.code;              
          if (code == 'auth/user-not-found'){
            $rootScope.showAlert("Usuario no encontrado, verificar Email");
          }else if (code == 'auth/invalid-email'){
            $rootScope.showAlert("Formato de Email invalido");
          }else if (code == 'auth/wrong-password'){
            $rootScope.showAlert("Contraseña incorrecta");
          }
          else {
            $rootScope.showAlert("Error en la autenticacion");
          }
          $scope.primera = 0;  
          $ionicLoading.hide();         
        });  
      }
    }
    catch(err){ 
      console.log(err.message);      
    }
  };

  
    
  $scope.createUserDatabase = function (uid,dataUser){
    dataUser.uid = uid;       //Add the UID to the data model User
    dataUser.photoURL='img/No_Profile.svg';
    $rootScope.usuariosRef.push(dataUser)
      .then(function(x){    
        })
      .catch(function(error) {
        console.log("Error:", error);        
        $rootScope.showAlert(error.message);
    });
  };


})

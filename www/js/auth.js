app
.controller('LoginCtrl', function($scope,$rootScope, $ionicModal, $timeout,$ionicLoading,$state,$ionicPlatform,$state,$filter) {
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
  $scope.signupData = {};

  
  $scope.doLogin =function(loginData){
     if(loginData.ID==""||loginData.ID==" "||loginData.ID==null){$rootScope.showAlert("Verifique el Número de Cédula");}
     else{
      if ($scope.help){ //Buscar correo por numero de cedula
        $rootScope.usersRef.on("value",function(snapshot) {  // LIST OF ALL PRODUCTS OF THE COMPANY
          var snap = snapshot.val();  
          console.log(snapshot);
          if(snap!=null){$rootScope.currentUsers = Object.keys(snap).map(function(k) { var aux = snap[k]; aux.key = k; return aux });}else {$rootScope.currentUsers=[];}$state.reload();                     
          //var filter = $filter('filter')($rootScope.currentUsers,{"ID":loginData.ID});
          //console.log(filter);

        });

      }      
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


  $rootScope.verifyEmailSignup = function(signupData){
    

    try{      
      if(signupData.name==""||signupData.name==" "||signupData.name==null){$rootScope.showAlert("Verifique el Nombre");}
      else if(signupData.lastname==""||signupData.lastname==" "||signupData.lastname==null){$rootScope.showAlert("Verifique los Apellidos");}
      else if(signupData.ID==""||signupData.ID==" "||signupData.ID==null){$rootScope.showAlert("Verifique el Número de Cédula");}
      else if(signupData.email==""||signupData.email==" "||signupData.email==null){$rootScope.showAlert("Verifique el Correo Electrónico");}      
      else if(signupData.phone==""||signupData.phone==" "||signupData.phone==null){$rootScope.showAlert("Verifique número de teléfóno");}      
      else if(signupData.password==""||signupData.password==" "||signupData.password==null){$rootScope.showAlert("Verifique Contraseña");}
      else if(signupData.password.length<6){$rootScope.showAlert("Contraseña debe tener minimo 6");}
      else if(signupData.password != signupData.password2){$rootScope.showAlert("Las contraseñas no coinciden");}
      else {
        $ionicLoading.show();
        var user = firebase.auth().createUserWithEmailAndPassword(signupData.email, signupData.password)
        .then(function(x){        
          //console.log("Auth created:",x);
          $scope.createUserDatabase(x.uid,signupData); //Create User to Database Firebase, with give UID             
          x.sendEmailVerification();
          $rootScope.showAlert("Registro Exitoso! Por favor, revise su correo.");
          $rootScope.signupModal.hide();
          x.updateProfile({
            displayName: (signupData.name + ' ' + signupData.lastname)            
          }).then(function(x){            
            $ionicLoading.hide();  
          }, function(error) {
            console.log(error.code);
            console.log(error.message);
            $rootScope.showAlert(error.message);     
            $ionicLoading.hide();            
          });

          
        }).catch(function(error) {
          console.log(error.code);
          console.log(error.message);        
          $rootScope.showAlert(error.message);  
          $ionicLoading.hide();  
        });

      }
    }
    catch(err){ 
       console.log(err);      
    }
  };

  $scope.createUserDatabase = function (uid,signupData){        
    //console.log(signupData);
    var firebaseData={      
      "ID":signupData.ID,
      "name":signupData.name,
      "lastname":signupData.lastname,
      "phone":signupData.phone,
      "email":signupData.email,
      "role":"USER",
      "uid":uid
    };
    //console.log(firebaseData);
      
    //signupData.photoURL='img/No_Profile.svg';
    
    $rootScope.usersRef.push(firebaseData)
      .then(function(x){    
        })
      .catch(function(error) {
        console.log("Error:", error);        
        $rootScope.showAlert(error.message);
    });
  };


  






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


  
    
  

})

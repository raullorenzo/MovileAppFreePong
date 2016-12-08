
// var socket = io ({forceNew: true});
var socket = io.connect('http://147.83.7.158:3000', {'forceNew': true});
var _base = "http://147.83.7.158:3000";
angular.module('freepong', ['ionic', 'freepong.controllers', 'freepong.routes', 'freepong.services', 'freepong.directives', 'ngCordovaOauth', 'ngCordova', 'pickadate'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $location, $timeout) {
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
  })
  $rootScope.authktd = false;
  $rootScope.showLoading = function (msg) {
    $ionicLoading.show({
      template: msg || 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
  }
  $rootScope.hideLoading = function () {
    $ionicLoading.hide();
  };
  $rootScope.toast = function (msg) {
    $rootScope.showLoading(msg);
    $timeout(function () {
      $rootScope.hideLoading();
    }, 2000);
  };
  $rootScope.toast2 = function (msg) {
    $rootScope.showLoading(msg);
    $timeout(function () {
      $rootScope.hideLoading();
    }, 1000);
  };
})

.factory('API', ['$http', function ($http) {
    var _api = {
    	//GET GROUP
    	getUsuarios: function () {
	        return $http.get(_base + '/usuario/ObtenerUsuarios/');
	    },
	    getUsuario: function (id) {
	    	console.log(id);
	        return $http.get(_base + '/usuario/ObtenerUsuarioPorID/' + id);
	    },
	    getPartidas: function () {
	        return $http.get(_base + '/partida/ObtenerPartidas');
	    },
      getPartidasPorFechaID: function (id, fecha){
          console.log("id mesa api: " + id);
          console.log("fecha api: " + fecha);
          console.log("query api: " + '/partida/ObtenerPartidaPorFechaymesa/' + id + '/' + fecha + '/');
          return $http.get(_base + '/partida/ObtenerPartidaPorFechaymesa/' + id + '/' + fecha + '/');
      },
      getMesas: function () {
          return $http.get(_base + '/mesa/ObtenerMesas');
      },
	    //DELETE GROUP
	    deleteUsuario: function (id) {
	        return $http.delete(_base + '/usuario/EliminarUsuarioPorID/' + id);
	    },
      //LOG IN & SIGN UP
      signup_twitter: function (usuario) {
        return $http.post(_base + '/usuario/twitter/', usuario);
      },
      login: function (usuario) {
          return $http.post(_base + '/usuario/Login/', usuario);
      },
      signup: function (usuario) {
          return $http.post(_base + '/usuario/CrearUsuario', usuario);
      },
    };
    return _api;
}])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    // $state.reload();
    // $state.go($state.current, {}, {reload: true});
    // var idusuario = window.localStorage['idusuario'];
    // var login = window.localStorage['login'];
    // var apellidos = window.localStorage['apellidos'];
    // var saldo = window.localStorage['saldo'];
    // var nombre = window.localStorage['nombre'];
    // var email = window.localStorage['email'];
    // var telefono = window.localStorage['telefono'];
    // var urlfoto = window.localStorage['urlfoto'];
    // var created = window.localStorage['created'];
    // $scope.id = idusuario;
    // $scope.login = login;
    // $scope.nombre = nombre;
    // $scope.apellidos = apellidos;
    // $scope.email = email;
    // $scope.telefono = telefono;
    // $scope.saldo = saldo;
    // $scope.urlfoto = urlfoto;
    // $scope.created = created;
    // console.log("idusuario: "+idusuario);
    // console.log("id: "+$scope.id);
    // console.log("login: "+$scope.login);
})

.controller('MiPerfilController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) {
  $scope.$on('$ionicView.beforeEnter', function(){
    //Guardar datos en local Storage//
    var idusuario = window.localStorage['idusuario'];
    var login = window.localStorage['login'];
    var apellidos = window.localStorage['apellidos'];
    var saldo = window.localStorage['saldo'];
    var nombre = window.localStorage['nombre'];
    var email = window.localStorage['email'];
    var password = window.localStorage['password'];
    var telefono = window.localStorage['telefono'];
    var urlfoto = window.localStorage['urlfoto'];
    var created = window.localStorage['created'];
    var puntuacion = window.localStorage['puntuacion'];
    $scope.id = idusuario;
    $scope.login = login;
    $scope.nombre = nombre;
    $scope.apellidos = apellidos;
    $scope.telefono = telefono;
    $scope.email = email;
    $scope.saldo = saldo;
    $scope.urlfoto = urlfoto;
    $scope.created = created;
    $scope.puntuacion = puntuacion;
    console.log("idusuario: "+idusuario);
    console.log("id: "+$scope.id);
    console.log("id: "+$scope.login);
    console.log("PATH urlfoto: ",urlfoto);
    console.log("puntuacion: "+$scope.puntuacion);
    $scope.editarPerfil = function(){
      console.log(idusuario);
      $state.go('freepong.editarperfil', {
          id:idusuario
      });
    };
  });
}])

.controller('EditarPerfilController', ['$rootScope', '$state', '$stateParams', '$scope', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $stateParams, $scope, $http, $ionicModal, $ionicHistory) {
  var id = $stateParams.id;
  var usuario = {};
  console.log(id);
  $http.get(_base + '/usuario/ObtenerUsuarioPorID/' + id).success(function (data) {
      $rootScope.toast2('Cargando Perfil');
      usuario = data;
      $scope.usuario = usuario;
      console.log("usuario: ", usuario);
      console.log("usuario.nombre: ", $scope.usuario.nombre);
      console.log("usuario.apellidos: ", usuario.apellidos);
    }).error(function(data){
  })
  $scope.editarPerfil = function(usuario){
      usuario.nombre = usuario.nombre;
      usuario.apellidos = usuario.apellidos;
      usuario.email = usuario.email;
      usuario.login = usuario.login;
      usuario.telefono = usuario.telefono;
      usuario.password = usuario.password;
      usuario.urlfoto = usuario.urlfoto;
      console.log("Usuario: "+usuario);
      $http.put(_base + '/usuario/ModificarUsuarioPorID/' + id, usuario).success(function (data) {
        $rootScope.toast2('Perfil Editado!');
        $http.get(_base + '/usuario/ObtenerUsuarioPorID/' + id).success(function (data) {
            usuario = data;
            $scope.usuario = usuario;
            window.localStorage['nombre'] = usuario.nombre;
            window.localStorage['apellidos'] = usuario.apellidos;
            window.localStorage['email'] = usuario.email;
            window.localStorage['password'] = usuario.password;
            window.localStorage['telefono'] = usuario.telefono;
            $rootScope.nombre = usuario.nombre;
            $rootScope.apellidos = usuario.apellidos;
            $rootScope.password = usuario.password;
            $scope.id = idusuario;
            $scope.login = login;
            $scope.nombre = nombre;
            $scope.apellidos = apellidos;
            $scope.telefono = telefono;
            $scope.email = email;
            $scope.saldo = saldo;
            $scope.urlfoto = urlfoto;
            console.log("usuario: ", usuario);
            console.log("usuario.nombre: ", $scope.usuario.nombre);
            console.log("usuario.apellidos: ", usuario.apellidos);
          }).error(function(data){
        })
      }).error(function(data){
    })
  }
}])

.controller('InicioController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) {
    $scope.login = function (){
      $state.go('login');
    }
    $scope.registro = function (){
      $state.go('registro');
    }
}])

.controller('LogoutController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) {
    $scope.signout = function () {
      // window.localStorage['idusuario'] = '';
      // window.localStorage['login'] = '';
      // window.localStorage['saldo'] = '';
      // window.localStorage['nombre'] = '';
      // window.localStorage['apellidos'] = '';
      // window.localStorage['email'] = '';
      // window.localStorage['telefono'] = '';
      // window.localStorage['urlfoto'] = '';
      // window.localStorage['created'] = '';
      localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go('inicio');
    }
}])

.controller('CrearPartidaController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) {
    //Guardar datos en local Storage//
    $scope.verHorarios=false;
    $scope.verPartida=false;
    var partida = new Object();
    var idusuario = window.localStorage['idusuario'];
    var login = window.localStorage['login'];
    $scope.login = login;
    var FechaPartida = '';
    var h = '';
    var IDmesa = '';
    var IDpartida = '';
    $scope.partidaLoc = {
          usuarioID: '',
          usuarioLogin: '',
          fecha: '',
          mesaID: '',
          mesaNombre: '',
          mesaLoc: '',
          horario: ''
    };
    console.log(idusuario);
    console.log(login);
    console.log("El Usuario creador de la partida es: "+login+" con id: "+idusuario);
    $scope.verusuario ="Local: "+login+" id: "+idusuario;
    $scope.partidaLoc.usuarioID = idusuario; 
    $scope.partidaLoc.usuarioLogin = login;
    $ionicModal.fromTemplateUrl('templates/datemodal.html', 
        function(modal) {
            $scope.datemodal = modal;
        },
        {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope, 
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
        }
    );
    $scope.opendateModal = function() {
      $scope.datemodal.show();
    };
    $scope.closedateModal = function(modal) {
      $scope.datemodal.hide();
      $scope.datepicker ="Fecha: "+modal;
      $scope.partidaLoc.fecha = modal;
      FechaPartida = modal;
      console.log(modal);
      console.log("la fecha es: "+modal);
    };
    api.getMesas().success(function (data) {
        console.log(data);
        $scope.mesas = data;
        // console.log(mesas);
      }).error(function(data){
    })  
    $ionicModal.fromTemplateUrl('templates/datemodalmesas.html', 
        function(mesa) {
            $scope.datemodalM = mesa;
        },
        {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope, 
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
        }
    );
    $scope.opendateModalM = function() {
      $scope.datemodalM.show();
    };
    $scope.closedateModalM = function(mesa) {
      $scope.datemodalM.hide();
      $scope.vermesas = mesa.nombre+" - "+mesa.localizacion;
      $scope.partidaLoc.mesaNombre = mesa.nombre;
      $scope.partidaLoc.mesaLoc = mesa.localizacion;
      $scope.partidaLoc.mesaID = mesa._id;
      IDmesa = mesa._id;
      console.log("La mesa es: "+mesa.nombre);
      console.log(mesa);
    };
    $scope.obtenerHorarios = function(){
      var mesaID = $scope.partidaLoc.mesaID;
      var fecha = $scope.partidaLoc.fecha;
      var login = $scope.partidaLoc.usuarioLogin;
      api.getPartidasPorFechaID(mesaID, fecha).success(function (data) {
        $rootScope.toast2('Cargando horarios...');
        partida=data[0];
        $scope.partida=partida;
        $scope.verHorarios=false;
        $scope.verPartida=true;
      })
    }
    $scope.crearPartida = function(h){
      //$state.reload();
      $http.get(_base+'/partida/ObtenerPartidaPorFechaymesa/' + IDmesa + '/' + FechaPartida).success(function (data) {
        if(data == ''){
          console.log('No hay partidas para esta fecha!');
          var box = 
          ({
            IDmesa: IDmesa, 
            FechaPartida: FechaPartida, 
            IDcreador: idusuario, 
            login: login, 
            horario: h
          });
          console.log('_____________________________________');
          console.log('|');
          console.log('| IDmesa: '+box.IDmesa);
          console.log('| FechaPartida: '+box.FechaPartida);
          console.log('| IDcreador: '+box.IDcreador);
          console.log('| login creador: '+box.login);
          console.log('| horario: '+box.horario);
          console.log('|_____________________________________');
          $http.post(_base+'/partida/CrearPartida', box).success(function (data) {
            console.log('Entramos en PUT/ crearPartida');
            console.log(data);
            partida = data;
            $scope.partida = partida;
          });
        }
        else {
          partida = data[0];
          console.log('Hay partidas creadas ya en esa fecha!');
          console.log('Partida seleccionada: '+data);
          console.log('IDpartida: '+partida._id);
          IDpartida = partida._id;
          var box1 = 
          ({
            IDcreador: idusuario, 
            login: login, 
            horario: h
          });
          console.log('_____________________________________');
          console.log('|');
          console.log('| IDmesa: '+IDmesa);
          console.log('| FechaPartida: '+FechaPartida);
          console.log('| IDcreador: '+box1.IDcreador);
          console.log('| login creador: '+box1.login);
          console.log('| horario: '+box1.horario);
          console.log('|_____________________________________');
          $http.put(_base+'/partida/AsignarHoraPartidaporID/' + IDpartida, box1).success(function (data) {
            // console.log('Entramos en PUT/ AsignarHoraPartidaporID');
            // console.log(data);
            // partida = data;
            // $scope.partida = partida;
            api.getPartidasPorFechaID(IDmesa, FechaPartida).success(function (data) {
              partida=data[0];
              $scope.partida=partida;
            })
          });
        }
      });
    }
    $scope.unirseapartida = function (h) {
      $http.get(_base+'/partida/ObtenerPartidaPorFechaymesa/' + IDmesa + '/' + FechaPartida).success(function (data) {
        p = data[0];
        IDpartida = p._id;
        console.log(h);
        var box2 = ({
            IDinvitado: idusuario, 
            login: login, 
            horario: h
        });
        console.log('_____________________________________');
        console.log('|');
        console.log('| IDmesa: '+IDmesa);
        console.log('| FechaPartida: '+FechaPartida);
        console.log('| IDinvitado: '+box2.IDinvitado);
        console.log('| login creador: '+box2.login);
        console.log('| horario: '+box2.horario);
        console.log('|_____________________________________');
        console.log('IDpartida: '+IDpartida);
        console.log('partida._id: '+p._id);
        $http.put(_base+'/partida/UnirsePartida/' + IDpartida, box2).success(function (data) {
            // console.log('Entramos en PUT/ unirseapartida');
            // console.log(data);
            // partida = data;
            // $scope.partida = partida;
            api.getPartidasPorFechaID(IDmesa, FechaPartida).success(function (data) {
              partida=data[0];
              $scope.partida=partida;
            })
        });
      });
    };
}])

.controller('ResultadosController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) {
    $scope.$on('$ionicView.beforeEnter', function(){  
      datosOK=true;    
      var idusuario = window.localStorage['idusuario'];
      var login = window.localStorage['login'];
      var partidas = new Object();//
      $scope.login=login;
      $rootScope.toast2('Cargando Partidas...');
      $http.get(_base+'/partida/ObtenerPartidasconestadodos/' + login).success(function (data) {
        partidas=data;
        if(partidas[0]==null){
          $scope.datosOK = false;
        }else{
          $scope.datosOK = true;
        }
        console.log(partidas);
        $scope.partidas=partidas;
      });
      $scope.insertarresultados= function (h, id, juegoscreador, juegosinvitado){
          console.log(h, id, juegoscreador, juegosinvitado);
          var box = 
          ({
            juegoscreador: juegoscreador, 
            juegosinvitado: juegosinvitado, 
            horario: h
          });
          if((box.juegoscreador == null)||(box.juegosinvitado == null)){
            $rootScope.toast2('Introduce los resultados!');
          }
          else {
              console.log(box);
              $http.put(_base+'/partida/insertartarresultados/'+id, box).success(function (data){
              var res='2';
              $scope.resul='1';
              console.log($scope.resul);
              $http.get(_base+'/partida/ObtenerPartidasconestadodos/'+login).success(function (data) {
                $rootScope.toast('Resultado Enviado!');
                partidas=data;
                if(partidas[0]==null){
                  $scope.datosOK = false;
                }else{
                  $scope.datosOK = true;
                }
                console.log(partidas);
                $scope.partidas=partidas;
              });
            });
        }
      };
    });
}])

// .controller('HistorialController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) {
//     var box2 = ({
//         login: window.localStorage['login']
//         //login: $rootScope.login
//     });
//     // historial={};
//     // historiales=[];
//     console.log(box2);
//     var historiales = {}
//     $http.get(_base+'/historial/ObtenerHistorialesLogin',box2).success(function (data) {
//       historiales=data;
//       console.log(historiales);
//       console.log(historiales[0]);
//       $scope.historiales=historiales;
//     });
// }])

.controller('HistorialController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) { 
    var login = window.localStorage['login'];
    var id = window.localStorage['idusuario'];
    var adversario = [];
    // usuarioCreador = {};
    var usuarioCreador = new Object();
    // usuarioInvitado = {};
    var usuarioInvitado = new Object();
    $scope.login = login;
    // $http.get(_base+'/historial/ObtenerusuarioporLogin/' + login).success(function (data) {
    //   usuarioCreador = data[0];
    //   $scope.usuarioCreador = usuarioCreador;
    //   console.log("creador: ", usuarioCreador);
    // });
    $http.get(_base+'/usuario/ObtenerUsuarioPorID/'+id).success(function (data) {
      usuario = data;
      $scope.usuario = usuario;
    });
    $http.get(_base+'/historial/ObtenerHistorialesLogin/'+login).success(function (data) {
      historiales=data;
      console.log(historiales);
      console.log(historiales[0]);
      $scope.historiales=historiales;
      $scope.obtenerInvitado = function(creador, invitado) {
        console.log("creador: ",creador);
        console.log("invitado: ",invitado);
        $http.get(_base+'/historial/ObtenerusuarioporLogin/' + creador).success(function (data) {
          usuarioCreador = data[0];
          $scope.usuarioCreador = usuarioCreador;
          console.log("creador: ", usuarioCreador);
        });
        $http.get(_base+'/historial/ObtenerusuarioporLogin/' + invitado).success(function (data) {
          usuarioInvitado = data[0];
          $scope.usuarioInvitado = usuarioInvitado;
          console.log("invitado: ", usuarioInvitado);
        });
      };
      // for (var i=0, l=historiales.length; i<l; i++ ){
      //   adversario=historiales[i].logininvitado;
      //   console.log(adversario);
      //   $http.get(_base+'/historial/ObtenerusuarioporLogin/'+adversario).success(function (data) {
      //     usuarioInvitado = data[0];
      //     $scope.usuarioInvitado = usuarioInvitado;
      //     console.log("invitado: ", usuarioInvitado);
      //     //console.log("foto invitado: ", usuarioInvitado[0].urlfoto);
      //     //$scope.fotoInvitado = usuarioCreador[0].urlfoto;
      //   });
      // }

      // for (var i=0, l=historiales.length; i<l; i++ ){
      //     // $scope.students=students;
      //     if (historiales[i].resultadocreador > historiales[i].resultadoinvitado){
      //       $scope.ganado = true;
      //       $scope.nulo = false;
      //       console.log("ganado SI: ",$scope.ganado);
      //     }
      //     else if (historiales[i].resultadocreador < historiales[i].resultadoinvitado){
      //       $scope.ganado=false;
      //       $scope.nulo = false;
      //       console.log("ganado NO: ",$scope.ganado);
      //     }
      //     else {
      //       $scope.nulo = true;
      //       console.log("nulo: ",$scope.nulo);
      //     }
      // }  
      $scope.doRefresh = function() {
        $http.get(_base+'/historial/ObtenerHistorialesLogin/'+login)
         .success(function(newItems) {
            $scope.historiales = newItems;
         })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
        });
      };
    });
}])

// .controller('HistorialController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) { 
//     var login = window.localStorage['login'];
//     var adversario = '';
//     // usuarioCreador = {};
//     var usuarioCreador = new Object();
//     // usuarioInvitado = {};
//     var usuarioInvitado = new Object();
//     // var historiales = [{
//     //   logincreador: '',
//     //   logininvitado: '',
//     //   ganador: '',
//     //   fecha: '',
//     //   resultadocreador: '',
//     //   resultadoinvitado: '',
//     //   nombremesa: '',
//     //   fotourl: ''
//     // }]
//     // $scope.historiales = historiales;
//     $scope.login = login;
//     $http.get(_base+'/historial/ObtenerusuarioporLogin/' + login).success(function (data) {
//       usuarioCreador = data[0];
//       $scope.usuarioCreador = usuarioCreador;
//       console.log("creador: ", usuarioCreador);
//       //console.log("fot creador: ", usuarioCreador[0].urlfoto);
//       //$scope.fotoCreador = usuarioCreador[0].urlfoto;
//     });
//     $http.get(_base+'/historial/ObtenerHistorialesLogin/'+login).success(function (data) {
//       historiales=data;
//       console.log(historiales);
//       console.log(historiales[0]);
//       $scope.historiales=historiales;
//       for (var i=0, l=historiales.length; i<l; i++){
//         adversario=historiales[i].logininvitado;
//         console.log(adversario);
//         $http.get(_base+'/historial/ObtenerusuarioporLogin/'+adversario).success(function (data) {
//           usuarioInvitado = data[0];
//           $scope.usuarioInvitado = usuarioInvitado;
//           // historiales.fotourl = usuarioInvitado.urlfoto;
//           // $scope.historiales = historiales;
//           // console.log("88888",historiales.fotourl);
//           console.log("invitado: ", usuarioInvitado);
//           //console.log("foto invitado: ", usuarioInvitado[0].urlfoto);
//           //$scope.fotoInvitado = usuarioCreador[0].urlfoto;
//         });
//       }

//       // for (var i=0, l=historiales.length; i<l; i++ ){
//       //     // $scope.students=students;
//       //     if (historiales[i].resultadocreador > historiales[i].resultadoinvitado){
//       //       $scope.ganado = true;
//       //       $scope.nulo = false;
//       //       console.log("ganado SI: ",$scope.ganado);
//       //     }
//       //     else if (historiales[i].resultadocreador < historiales[i].resultadoinvitado){
//       //       $scope.ganado=false;
//       //       $scope.nulo = false;
//       //       console.log("ganado NO: ",$scope.ganado);
//       //     }
//       //     else {
//       //       $scope.nulo = true;
//       //       console.log("nulo: ",$scope.nulo);
//       //     }
//       // }  
//     });
// }])

.controller('LoginController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$ionicHistory', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $ionicHistory) {
  $scope.log = {
      login: '',
      password: ''
  }
  $scope.registro = function (){
      $state.go('registro');
  }
  $scope.loginUser = function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      if (($scope.log.login == '') && ($scope.log.password == '')) {
        $rootScope.toast('Campo username y password vacíos');
      }
      else if ($scope.log.login == '') {
        $rootScope.toast('Campo username vacío');
      }
      else if ($scope.log.password == '') {
        $rootScope.toast('Campo password vacío');
      }
      else {
        var usuario = {};
        $rootScope.toast2("Autenticando..");
        api.login($scope.log).success(function (data) {
          var id = data.usuario[0]._id;
          window.localStorage['idusuario'] = data.usuario[0]._id;
          window.localStorage['login'] = data.usuario[0].login;
          console.log("id: "+id);
          api.getUsuario(id).success(function (data) {
              usuario = {};
              $scope.usuario = data;
              console.log("data: "+data._id);
              console.log("data: "+data.nombre);
              console.log("data: "+data.urlfoto);
              console.log("usuario: "+$scope.usuario);
              console.log("usuario2: "+$scope.usuario.nombre);
              window.localStorage['saldo'] = data.saldo;
              window.localStorage['nombre'] = data.nombre;
              window.localStorage['apellidos'] = data.apellidos;
              window.localStorage['email'] = data.email;
              window.localStorage['password'] = data.password;
              window.localStorage['telefono'] = data.telefono;
              window.localStorage['urlfoto'] = data.urlfoto;
              window.localStorage['created'] = data.created;
              window.localStorage['puntuacion'] = data.puntuacion;
              $rootScope.login = data.login;
              $rootScope.urlfoto = data.urlfoto;
              $rootScope.nombre = data.nombre;
              $rootScope.apellidos = data.apellidos;
              $rootScope.password = data.password;
              $rootScope.puntuacion = data.puntuacion;
            }).error(function(data){
          })
            // $rootScope.toast('bienvenido ' + usuario.login);
            //Guardar datos en local Storage//
            // window.localStorage['iduser'] = data.usuario[0]._id;
            // window.localStorage['username'] = data.usuario[0].login;
            // window.localStorage['saldo'] = data.usuario[0].saldo;
            // window.localStorage['nombre'] = data.usuario[0].nombre;
            // window.localStorage['apellidos'] = data.usuario[0].apellidos;
            // window.localStorage['email'] = data.usuario[0].email;
            // window.localStorage['telefono'] = data.usuario[0].telefono;
              
            // usuario.id = data.usuario[0]._id;
            // usuario.nombre = data.usuario[0].nombre;
            // usuario.apellidos = data.usuario[0].apellidos;
            // usuario.login = data.usuario[0].login;
            // usuario.email = data.usuario[0].email;
            // usuario.telefono = data.usuario[0].telefono;
            // usuario.saldo = data.usuario[0].saldo;
            // socket.emit('newUser', usuario, function (data) {
            // });
            $ionicHistory.nextViewOptions({
              disableBack: true 
            });
            $scope.log = {}
            $state.go('freepong.home');
            // $state.go('freepong.usuarios', {}, {reload: true});
          }).error(function (data) {
            $rootScope.toast('Usuario o password incorrecto');
        })
      }
    }
    // $scope.twitterLogin = function () {
    //   $cordovaOauth.twitter("tWqQ3nPA0aULUz7Z7c9H6hTZM", "HlmYdbkX3NaRIgkh2YTsjffqe6f1gUj3stdXXugxZcsHb0dauA").then(function (user) {
    //     api.signup_twitter(user).success(function (data) {
    //       window.localStorage['idusuario'] = data._id;
    //       window.localStorage['login'] = data.login;
    //     }).error(function (data) {
    //     })
    //     $state.go('freepong.usuarios');
    //   }, function (error) {
    //     console.log(JSON.stringify(error));
    //   });
    // };
    //  $scope.facebookLogin1 = function() {
    //    console.log ("hola");
    //    $cordovaOauth.facebook("203907273328129", ["displayName"], {"auth_type": "rerequest"}).then(function (result) {
    //       $localStorage.accessToken = result.access_token;
    //       console.log(JSON.stringify(result));
    //       $rootScope.tipologin = "facebook";
    //       $state.go('freepong.home');
    //     },  
    //     function (error) {
    //       console.log(JSON.stringify(error));
    //     });
    //  }
    //  $scope.facebookLogin = function () {
    //     $cordovaOauth.facebook("203907273328129", ["email", "user_location"]).then(function (result) {
    //         $localStorage.accessToken = result.access_token;
    //         console.log(result);
    //         $rootScope.tipologin = "facebook";
    //         $state.go('freepong.home');
    //     }, function (error) {
    //         alert("There was a problem signing in!  See the console for logs");
    //         console.log(error);
    //     });
    // };
    // $scope.twitterLogin = function () {
    //     var api_key = "tWqQ3nPA0aULUz7Z7c9H6hTZM";
    //     var api_secret = "HlmYdbkX3NaRIgkh2YTsjffqe6f1gUj3stdXXugxZcsHb0dauA";
    //     $cordovaOauth.twitter(api_key, api_secret, ["email"]).then(function (user) {
    //             $rootScope.usuariotwitternombre = user.screen_name;
    //             $rootScope.usuariotwitterid = user.user_id;
    //             console.log(user);
    //             $rootScope.tipologin = "twitter";
    //             $state.go('freepong.home');
    //         },
    //         function (error) {
    //           alert("There was a problem signing in!  See the console for logs");
    //             console.log(error);
    //         });
    // };
    // $scope.twitterLogin = function () {
    //   $cordovaOauth.twitter("tWqQ3nPA0aULUz7Z7c9H6hTZM", "HlmYdbkX3NaRIgkh2YTsjffqe6f1gUj3stdXXugxZcsHb0dauA").then(function (usuario) {
    //     api.signup_twitter(usuario).success(function (data) {
    //       window.localStorage['idusuario'] = data._id;
    //       window.localStorage['login'] = data.login;
    //     }).error(function (data) {
    //     })
    //     $state.go('freepong.home');
    //   }, function (error) {
    //     console.log(JSON.stringify(error));
    //   });
    // };
    // $scope.registro = function () {
    //   $state.go('freepong.registro');
    // }
    $scope.facebookLogin1 = function() {
       console.log ("hola");
       $cordovaOauth.facebook("203907273328129", ["displayName"], {"auth_type": "rerequest"}).then(function (result) {
          $localStorage.accessToken = result.access_token;
          console.log(JSON.stringify(result));
          $rootScope.tipologin = "facebook";
          $state.go('freepong.home');
        },  
        function (error) {
          console.log(JSON.stringify(error));
        });
     }
     $scope.facebookLogin = function () {
        $cordovaOauth.facebook("203907273328129", ["email", "user_location"]).then(function (result) {
            $localStorage.accessToken = result.access_token;
            console.log(result);
            $rootScope.tipologin = "facebook";
            $state.go('freepong.home');
        }, function (error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };

    // $scope.twitterLogin = function () {
    //     var usuariot = {};
    //     var api_key = "tWqQ3nPA0aULUz7Z7c9H6hTZM";
    //     var api_secret = "HlmYdbkX3NaRIgkh2YTsjffqe6f1gUj3stdXXugxZcsHb0dauA";
    //     $cordovaOauth.twitter(api_key, api_secret, ["email"]).then(function (usuario) {
    //             $rootScope.login = usuario.screen_name;
    //             $rootScope._id = usuario.user_id;
    //             console.log(usuario);
    //             $rootScope.tipologin = "twitter";
    //             var user = {};
    //             user.login = usuario.screen_name;
    //             api.signup(user).success(function (data) {
    //                 usuariot = data;
    //                 console.log(data);
    //                 console.log(data);
    //               }).error(function (data) {
    //                 api.loginTwitter(usuariot).success(function (data) {
    //                   var id = data.usuario[0]._id;
    //                   window.localStorage['idusuario'] = data.usuario[0]._id;
    //                   window.localStorage['login'] = data.usuario[0].login;
    //                   console.log("id: "+id);
    //                   api.getUsuario(id).success(function (data) {
    //                       usuario = {};
    //                       $scope.usuario = data;
    //                        window.localStorage['login'] = data.login;
    //                     }).error(function(data){
    //                   })
    //                 })
    //             })
    //             /// Logeamos
    //             api.loginTwitter(usuariot).success(function (data) {
    //               var id = data.usuario._id;
    //               window.localStorage['idusuario'] = data.usuario._id;
    //               window.localStorage['login'] = data.usuario.login;
    //               console.log("id: "+id);
    //               api.getUsuario(id).success(function (data) {
    //                   usuario = {};
    //                   $scope.usuario = data;
    //                    window.localStorage['login'] = data.login;
    //                 }).error(function(data){
    //               })
    //             })
    //             $state.go('freepong.home');
    //         },
    //         function (error) {
    //           alert("There was a problem signing in!  See the console for logs");
    //             console.log(error);
    //         });
    // };
    $scope.twitterLogin = function () {
      $cordovaOauth.twitter("tWqQ3nPA0aULUz7Z7c9H6hTZM", "HlmYdbkX3NaRIgkh2YTsjffqe6f1gUj3stdXXugxZcsHb0dauA").then(function (usuario) {
        api.signup_twitter(usuario).success(function (data) {
          window.localStorage['idusuario'] = data._id;
          window.localStorage['login'] = data.login;
          var idusuario = window.localStorage['idusuario'];
          var login = window.localStorage['login'];
          $rootScope.login = login;
          $rootScope.idusuario = idusuario;
          console.log()
        }).error(function (data) {
        })
        $state.go('freepong.home');
      }, function (error) {
        console.log(JSON.stringify(error));
      });
    };
}])

.controller('registroxxController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal) {
   
  // $ionicModal.fromTemplateUrl('my-modal.html', {
  //     scope: $scope,
  //     animation: 'slide-in-up'
  //   }).then(function (modal) {
  //     $scope.modal = modal;
  //   }); 
    var nombre;
    var apellidos;
    var login;
    var telefono;
    var saldo;
    var password;
    var email;
    var saldo;
    var urlfoto;

    // $scope.usuario = {
    //       nombre: '',
    //       apellidos: '',
    //       email: '',
    //       telefono: '',
    //       login: '',
    //       password: '',
    //       saldo: ''
    // }
    $scope.usuario = {}
    $scope.registerUser = function () {
      $rootScope.hideLoading();
      api.signup($scope.usuario).success(function (data) {
        $scope.usuario.login = data.login;
        loginloc = data.login
        $rootScope.toast('Registrándote en FreePong...');
        console.log(data);
        console.log(data);
        console.log(loginloc);
        $state.go('login');
        $scope.usuario = {}
        $scope.modal.show();
      }).error(function (data) {
        $rootScope.hideLoading();
        $rootScope.toast('El usuario ya existe');
        $scope.usuario = {}
      })
    }
    // $scope.obtenerFoto = function () {
    //   navigator.camera.getPicture(correcto, error, {
    //     quality:100,
    //     allowEdit:false
    // });
    // function correcto (rutaImagen){
    //   document.getElementById("ImgCamara").src = rutaImagen;
    //   fichero = rutaImagen;
    // }
    // function error (message){
    //   alert("Error"+message);
    // }
    // function enviarDatos (){
    //   var options = new FileUploadOptions();
    //   options.fileKey = "file";
    //   options.fileName = fichero.substr(fichero.lastIndexOf('/')+1);
    //   options.mimeType = "image/jpg";
    //   options.chunkedMode = true;

    //   var params = new Object();
    //   params.descripcion = document.getElementById("descripcion").value;
    //   options.params = params;

    //   var ft = new FileTransfer();
    //   var percentageUpload = 0;
    //   ft.upload(fichero, "http://147.83.7.158:3000/public/images", win, fail, options);
    // }
    // function win (r){
    //   alert ("Respuesta servidor =" + r.Respuesta);
    // }
    // function fail (error){
    //   alert ("upload error source " + error.source);
    //   alert ("upload error target =" + error.target);
    //   alert ("Ha ocurrido un error =" + error.code);
    // }

    $scope.addFoto = function () {
      console.log("hola");
      navigator.camera.getPicture(uploadPhoto, function (message) {
          $rootScope.toast('Error al obtener la foto');
        }, 
        {
          quality: 50,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        }
      );
    }
    function uploadPhoto(urlfoto) {
      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = "image.jpg";
      options.mimeType = "image/jpg";
      var params = new Object();
      params.value1 = "test";
      params.value2 = "param";
      options.params = params;
      options.chunkedMode = false;
      var ft = new FileTransfer();
      ft.upload(urlfoto, _base + "/usuario/upload/" + loginloc, win, fail, options);
    }
    function win(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
      $scope.modal.hide();
      $state.go ('login');
    }
    function fail(error) {
      console.log(error);
      alert(error.code);
    }
    $scope.closeRegister = function () {
      $scope.modal.hide();
      $state.go("login");
    }
}])

.controller('registroController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$cordovaCamera', '$cordovaFileTransfer', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $cordovaCamera, $cordovaFileTransfer, $timeout) {
   
  // $ionicModal.fromTemplateUrl('my-modal.html', {
  //     scope: $scope,
  //     animation: 'slide-in-up'
  //   }).then(function (modal) {
  //     $scope.modal = modal;
  //   }); 
    var nombre;
    var apellidos;
    var login;
    var telefono;
    var saldo;
    var password;
    var email;
    var saldo;
    var urlfoto;  
    var bool = false;
    var targetPath = '';

  
    // $scope.usuario = {
    //       nombre: '',
    //       apellidos: '',
    //       email: '',
    //       telefono: '',
    //       login: '',
    //       password: '',
    //       saldo: ''
    // }
    $scope.usuario = {}
    $scope.registerUser = function () {
      $rootScope.hideLoading();
      api.signup($scope.usuario).success(function (data) {
        $scope.usuario.login = data.login;
        login = data.login;
        loginloc = data.login;
        $rootScope.toast('Registrándote en FreePong...');
        console.log("data: ",data);
        console.log("login: ",login);
        console.log("loginloc: ",loginloc);
        //$state.go('login');
        $scope.usuario = {}
      }).error(function (data) {
        $rootScope.hideLoading();
        $rootScope.toast('El usuario ya existe');
        $scope.usuario = {}
      })
    }

    $scope.takePhoto = function () {
        var options = {
          quality: 75,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };
   
          $cordovaCamera.getPicture(options).then(function (imageData) {
              urlfoto = imageData;
              $scope.imgURI = "data:image/jpeg;base64," + imageData;
              console.log('$scope.imgURI: ',$scope.imgURI);
              console.log('imageData: ',imageData);
          }, function (err) {
            // An error occured. Show a message to the user
          });
    }

    // $scope.choosePhoto = function () {
    //       var options = {
    //       quality: 75,
    //       destinationType: Camera.DestinationType.DATA_URL,
    //       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    //       allowEdit: true,
    //       encodingType: Camera.EncodingType.JPEG,
    //       targetWidth: 300,
    //       targetHeight: 300,
    //       popoverOptions: CameraPopoverOptions,
    //       saveToPhotoAlbum: false
    //     };
   
    //       $cordovaCamera.getPicture(options).then(function (imageData) {
    //           urlfoto = imageData;
    //           $scope.imgURI = "data:image/jpeg;base64," + imageData;
    //           console.log('$scope.imgURI: ',$scope.imgURI);
    //           console.log('imageData: ',imageData);
    //       }, function (err) {
    //         // An error occured. Show a message to the user
    //       });
    // }

    $scope.choosePhoto = function () {

      navigator.camera.getPicture(uploadPhoto, function (message) {
          $rootScope.toast('Error al obtener la foto');
        }, {
          quality: 75,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        }
      );

    }

    function uploadPhoto(imageURI) {

      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = "image.jpg";
      options.mimeType = "image/jpg";

      var params = new Object();
      params.value1 = "test";
      params.value2 = "param";

      options.params = params;
      options.chunkedMode = false;
      // $scope.imageURI = imageURI;
      // console.log("imageURI ",imageURI);
      var ft = new FileTransfer();
     

      ft.upload(imageURI, _base + "/usuario/uploadionic/" + login, win, fail, options);
    }

    function win(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
    }

    function fail(error) {
      alert(error.code);
      console.log(error);
    }
    // $scope.obtenerFoto = function () {
    //   navigator.camera.getPicture(correcto, error, {
    //     quality:100,
    //     allowEdit:false
    // });
    // function correcto (rutaImagen){
    //   document.getElementById("ImgCamara").src = rutaImagen;
    //   fichero = rutaImagen;
    // }
    // function error (message){
    //   alert("Error"+message);
    // }
    // function enviarDatos (){
    //   var options = new FileUploadOptions();
    //   options.fileKey = "file";
    //   options.fileName = fichero.substr(fichero.lastIndexOf('/')+1);
    //   options.mimeType = "image/jpg";
    //   options.chunkedMode = true;

    //   var params = new Object();
    //   params.descripcion = document.getElementById("descripcion").value;
    //   options.params = params;

    //   var ft = new FileTransfer();
    //   var percentageUpload = 0;
    //   ft.upload(fichero, "http://147.83.7.158:3000/public/images", win, fail, options);
    // }
    // function win (r){
    //   alert ("Respuesta servidor =" + r.Respuesta);
    // }
    // function fail (error){
    //   alert ("upload error source " + error.source);
    //   alert ("upload error target =" + error.target);
    //   alert ("Ha ocurrido un error =" + error.code);
    // }
    // $scope.takePhoto = function () {
    //     var options = {
    //       quality: 75,
    //       destinationType: Camera.DestinationType.DATA_URL,
    //       sourceType: Camera.PictureSourceType.CAMERA,
    //       allowEdit: true,
    //       encodingType: Camera.EncodingType.JPEG,
    //       targetWidth: 300,
    //       targetHeight: 300,
    //       popoverOptions: CameraPopoverOptions,
    //       saveToPhotoAlbum: false
    //     };
   
    //       $cordovaCamera.getPicture(options).then(function (imageData) {
    //           urlfoto = imageData;
    //           $scope.imgURI = "data:image/jpeg;base64," + imageData;
    //           console.log('$scope.imgURI: ',$scope.imgURI);
    //           console.log('imageData: ',imageData);
    //       }, function (err) {
    //         // An error occured. Show a message to the user
    //       });
    // }
                
    // $scope.choosePhoto = function () {
    //       var options = {
    //       quality: 75,
    //       destinationType: Camera.DestinationType.DATA_URL,
    //       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    //       allowEdit: true,
    //       encodingType: Camera.EncodingType.JPEG,
    //       targetWidth: 300,
    //       targetHeight: 300,
    //       popoverOptions: CameraPopoverOptions,
    //       saveToPhotoAlbum: false
    //     };
   
    //       $cordovaCamera.getPicture(options).then(function (imageData) {
    //           urlfoto = imageData;
    //           $scope.imgURI = "data:image/jpeg;base64," + imageData;
    //           console.log('$scope.imgURI: ',$scope.imgURI);
    //           console.log('imageData: ',imageData);
    //       }, function (err) {
    //         // An error occured. Show a message to the user
    //       });
    // }

    // $scope.takePhoto = function () {
    //     var options = {
    //       quality: 75,
    //       destinationType: Camera.DestinationType.FILE_URI,
    //       sourceType: Camera.PictureSourceType.CAMERA,
    //       allowEdit: true,
    //       encodingType: Camera.EncodingType.JPEG,
    //       targetWidth: 300,
    //       targetHeight: 300,
    //       popoverOptions: CameraPopoverOptions,
    //       saveToPhotoAlbum: false
    //     };
   
    //       $cordovaCamera.getPicture(options).then(function (imageData) {
              
    //           $scope.imgURI =  imageData;
    //           console.log('$scope.imgURI: ',$scope.imgURI);
              
    //       }, function (err) {
    //         // An error occured. Show a message to the user
    //       });
    // }
                
    // $scope.choosePhoto = function () {
    //       var options = {
    //         quality: 75,
    //         destinationType: Camera.DestinationType.FILE_URI,
    //         sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    //         allowEdit: true,
    //         encodingType: Camera.EncodingType.JPEG,
    //         targetWidth: 300,
    //         targetHeight: 300,
    //         popoverOptions: CameraPopoverOptions,
    //         saveToPhotoAlbum: false
    //     };
   
    //       $cordovaCamera.getPicture(options).then(function (imageData) {
              
    //           $scope.imgURI = imageData;
    //           console.log('$scope.imgURI: ',$scope.imgURI);
              
    //       }, function (err) {
    //         // An error occured. Show a message to the user
    //       });
    // }

    // $scope.subirFoto = function () {
    //  function win(r) {
    //       console.log("Code = " + r.responseCode);
    //       console.log("Response = " + r.response);
    //       console.log("Sent = " + r.bytesSent);
    //       console.log("r =" + r);
    //   }

    //   function fail(error) {
    //       alert("An error has occurred: Code = " + error.code);
    //       console.log("upload error source " + error.source);
    //       console.log("upload error target " + error.target);
    //       console.log("error = " + error);
    //   }

    //   var uri = encodeURI(_base+"/usuario/upload/"+loginloc);
    //   console.log("uri = " + uri);

    //   var options = new FileUploadOptions();
    //   options.fileKey="file";
    //   options.fileName="image.jpg";
    //   options.mimeType="image/jpg";

    //   var params = new Object();
    //   params.value1 = "test";
    //   params.value2 = "param";

    //   options.params = params;
    //   options.chunkedMode = false;

    //   var ft = new FileTransfer();
    //   ft.onprogress = function(progressEvent) {
    //       if (progressEvent.lengthComputable) {
    //           loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
    //       } else {
    //           loadingStatus.increment();
    //       }
    //   };
    //   ft.upload(fileURL, uri, win, fail, options);



    // }
    // $scope.addFoto = function () {
    //   console.log("hola");
    //   navigator.camera.getPicture(uploadPhoto, function (message) {
    //       $rootScope.toast('Error al obtener la foto');
    //     }, 
    //     {
    //       quality: 50,
    //       destinationType: navigator.camera.DestinationType.FILE_URI,
    //       sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    //     }
    //   );
    // }
    // function uploadPhoto(urlfoto) {
    //   var options = new FileUploadOptions();
    //   options.fileKey = "file";
    //   options.fileName = "image.jpg";
    //   options.mimeType = "image/jpg";
    //   var params = new Object();
    //   params.value1 = "test";
    //   params.value2 = "param";
    //   options.params = params;
    //   options.chunkedMode = false;
    //   var ft = new FileTransfer();
    //   ft.upload(urlfoto, _base + "/usuario/upload/" + loginloc, win, fail, options);
    // }
    // function win(r) {
    //   console.log("Code = " + r.responseCode);
    //   console.log("Response = " + r.response);
    //   console.log("Sent = " + r.bytesSent);
    //   $scope.modal.hide();
    //   $state.go ('login');
    // }
    // function fail(error) {
    //   console.log(error);
    //   alert(error.code);
    // }
    // $scope.closeRegister = function () {
    //   $scope.modal.hide();
    //   $state.go("login");
    // }
}])

.controller('registrodosController', ['$rootScope', '$state', '$scope', '$cordovaOauth', 'API', '$http', '$ionicModal', '$cordovaCamera', '$cordovaFileTransfer', function ($rootScope, $state, $scope, $cordovaOauth, api, $http, $ionicModal, $cordovaCamera, $cordovaFileTransfer) {
    var picture = '';
    $scope.newUser = {};
    // $timeout(function() {
    //     $scope.$parent.hideHeader();
    // }, 0);
    //ionicMaterialInk.displayEffect();
    $scope.takePicture = function(options){
        var options = {
            quality: 80,
            sourceType: 1
        }
        $cordovaCamera.getPicture(options).then(function(imageData){
            picture=imageData;
        }, function(err){
            console.log(err);
        })
    }
    $scope.getPicture = function(options){
        var options = {
            quality: 80,
            sourceType: 0
        }
        $cordovaCamera.getPicture(options).then(function(imageData){
            picture=imageData;
            console.log("picture: ",picture);
        }, function(err){
            console.log(err);
        })
    }
    $scope.crearUser = function () {
        console.log($scope.newUser);
        var UsuarioLocalNuevo = new FormData();
        UsuarioLocalNuevo.append('nombre', $scope.newUser.nombre);
        UsuarioLocalNuevo.append('apellidos', $scope.newUser.apellidos);
        UsuarioLocalNuevo.append('email', $scope.newUser.email);
        UsuarioLocalNuevo.append('telefono', $scope.newUser.telefono);
        UsuarioLocalNuevo.append('login', $scope.newUser.login);
        UsuarioLocalNuevo.append('password', $scope.newUser.password);
        
        $http.post(_base + '/usuario/CrearUsuario',UsuarioLocalNuevo)
            .success(function (data) {
            $state.go('app.login');
        }).error(function (err) {
            console.log(err);
            $ionicPopup.alert({
                title: 'Fill the fields correctly ',
                content: err
            });

        });
    }
    $scope.User = function () {
        var options ={
        fileKey: "file",
        fileName: 'filename.jpg',
        mimeType: 'image/jpeg',
        chunkedMode:false,
        params: { 
            nombre: $scope.newUser.nombre,
            apellidos: $scope.newUser.apellidos,
            email: $scope.newUser.email,
            telefono: $scope.newUser.telefono,
            login: $scope.newUser.login,
            password: $scope.newUser.password,
            }
        };
        $cordovaFileTransfer.upload(_base+'/usuario/signup/',picture,options).then(
        function (data){
            $state.go('login');
        }, function (err){
            console.log(err);
        });
    }
    
}])
            //   api.getUsuarios().success(function (data) {
            // ****$scope.usuarios.splice(0,1);  //= data;
            // }).error(function(data){
            // })
       
.controller('UsuariosController', ['$rootScope', '$scope', '$http', '$state', 'API', '$stateParams', function($rootScope, $scope, $http, $state, api, $stateParams) {
  $scope.$on('$ionicView.beforeEnter', function(){      
    api.getUsuarios().success(function (data) {
  			$rootScope.toast2('Cargando usuarios...');
  			$scope.usuarios = data;
  		}).error(function(data){
  	})
    $scope.deleteUser = function(id){
      $rootScope.toast2('Borrando usuario...');
      $http.delete(_base+'/usuario/EliminarUsuarioPorID/' + id).success(function (data){
            api.getUsuarios().success(function (data) {
              $scope.usuarios = data;
            }).error(function(data){
          })
        }).error(function (data) {
      })
    };
  	$scope.vistaPerfil = function(id){
      //window.localStorage['id'] = id;
  		console.log(id);
      $state.go('freepong.perfil', {
          id:id
      });
  	};
  });
}])

.controller('ChatController', ['$rootScope', '$scope', '$http', '$state', 'API', '$stateParams', function($rootScope, $scope, $http, $state, api, $stateParams) {
    var idusuario = window.localStorage['idusuario'];
    var login = window.localStorage['login'];
    console.log(idusuario);
    console.log(login);
    var mensajes = [];
    $http.get(_base+'/usuario/ObtenerUsuarioPorID/' + idusuario).success(function (data) {$scope.userlocal=data;});
    console.log('nuevo socket')
    socket.emit('nuevo usuario', idusuario);
    socket.emit('dameusuriaosactivos');
    socket.on('actualizarusuariosactivos', function (data){
        console.log(data);
        $scope.$applyAsync(function ()
        {
            $scope.usuariosactivos = data;
        });
    });
    $scope.enviarmensaje=function(text){
        console.log('entro enviar');
        if($scope.text==""){
            $rootScope.toast2('Mensaje vacío!');
        }
        else{
            var mensaje = (
            {
                msg:text,
                login: login,
                timestamp:Math.floor(new Date() / 1000)
            });
            console.log('entro ');
            socket.emit('enviar mensaje', mensaje);
        }
    };
    socket.on('recibir mensaje',function(mensaje){
      if (mensaje.msg != ''){
        mensajes.push(mensaje);
      }
      console.log(mensaje);
      $scope.$applyAsync(function () {
          $scope.mensajes = mensajes;
      });
    });    
}])

// .controller('ChatController', ['$rootScope', '$scope', '$http', '$state', 'API', '$stateParams', function($rootScope, $scope, $http, $state, api, $stateParams) {
//     var idusuario = window.localStorage['idusuario'];
//     var login = window.localStorage['login'];
//     console.log(idusuario);
//     console.log(login);
//     var mensajes=  [];
//     $http.get(_base+'/usuario/ObtenerUsuarioPorID/' + idusuario).success(function (data) {
//       userlocal = data;
//       $scope.userlocal = userlocal;
//     });
//     console.log('nuevo socket');
//     socket.emit('nuevo usuario', idusuario);
//     socket.emit('dameusuriaosactivos');
//     socket.on('actualizarusuariosactivos', function (data){
//         console.log(data);
//         $scope.$applyAsync(function (){
//             $scope.usuariosactivos = data;
//         });
//     });
//     $scope.enviarmensaje=function(text){
//       // mensaje.msg = text;
//       // mensaje.login = login;
//       // mensaje.timestamp = Math.floor(new Date() / 1000);
//       var mensaje = (
//         {
//           msg:text,
//           login: login,
//           timestamp:Math.floor(new Date() / 1000)
//         });
//         console.log('entramos en enviar');
//         socket.emit('enviar mensaje', mensaje);
//     };
//     socket.on('recibir mensaje',function(mensaje){
//         mensajes.push(mensaje);
//         console.log(mensaje);
//         $scope.$applyAsync(function () {
//             $scope.mensajes = mensajes;
//         });
//     });
// }])

.controller('PartidasController', ['$rootScope', '$scope', '$http', '$state', 'API', function($rootScope, $scope, $http, $state, api) {	
  api.getPartidas().success(function (data) {
  		$rootScope.toast2('Cargando partidas...');
  		$scope.partidas = data;
      $scope.doRefresh = function() {
        api.getPartidas()
         .success(function(newItems) {
           $scope.partidas = newItems;
         })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
      };
  	}).error(function(data){
  })
}])

.controller('PerfilMesaController', ['$rootScope', '$scope', '$http', '$state', 'API', '$stateParams', 'NgMap', function($rootScope, $scope, $http, $state, api, $stateParams, NgMap) {
  var id = $stateParams.id;
  console.log(id);
  $scope.$on('$ionicView.beforeEnter', function(){
    $http.get(_base+'/mesa/ObtenerMesaporID/' + id).success(function (data) {
      var mesa = data;
      $scope.mesa = mesa;
    });
    $scope.crearPartida = function(){
      $state.go('freepong.crearPartida', {
      });
    };
    $scope.image = {
      url: 'img/pala.png',
      size: [32, 32],
      origin: [0,0],
      anchor: [0, 32]
    };
    // $scope.shape = {
    //   coords: [1, 1, 1, 20, 18, 20, 18 , 1],
    //   type: 'poly'
    // };
    NgMap.getMap().then(function (map) {
      $http.get(_base+'/mesa/ObtenerMesaporID/' + id).success(function (data) {
            var mesa = data;
            console.log("mesa: ",mesa);
            $scope.mesa = mesa;
            console.log(map);
        });
        $scope.showCustomMarker = function (event, nombre) {
            console.log(nombre);
            map.customMarkers[nombre].setVisible(true);
            map.customMarkers[nombre].setPosition(this.getPosition());
        };
        $scope.closeCustomMarker = function (evt) {
            this.style.display = 'none';
        };
    });
  }); 
}])

.controller('MesasController', ['$rootScope', '$scope', '$http', '$state', 'API', '$stateParams', function($rootScope, $scope, $http, $state, api, $stateParams) {
  $scope.$on('$ionicView.beforeEnter', function(){   
    api.getMesas().success(function (data) {
        $rootScope.toast2('Cargando mesas...');
        $scope.mesas = data;
      }).error(function(data){
    })
    $scope.vistaPerfil = function(id){
      //window.localStorage['id'] = id;
      console.log(id);
      $state.go('freepong.perfilmesa', {
          id:id
      });
    };
  });  
}])

.controller('HomeController', ['$rootScope', '$scope', '$http', '$state', 'API', function($rootScope, $scope, $http, $state, api) {
  $scope.$on('$ionicView.beforeEnter', function(){
    
  }); 
}])

.controller('RankController', ['$rootScope', '$scope', '$http', '$state', 'API', function($rootScope, $scope, $http, $state, api) {
  $scope.$on('$ionicView.beforeEnter', function(){
    api.getUsuarios().success(function (data) {
        $rootScope.toast2('Cargando Ranking...');
        $scope.usuarios = data;
      }).error(function(data){
    })
    $scope.vistaPerfil = function(id){
      //window.localStorage['id'] = id;
      console.log(id);
      $state.go('freepong.perfil', {
          id:id
      });
    };
  });
}])

.controller('UbicacionMesasController', ['$rootScope', '$scope', '$http', '$state', 'API', '$stateParams', 'NgMap', function($rootScope, $scope, $http, $state, api, $stateParams, NgMap) {
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.image = {
      url: 'img/Pala1.png',
      size: [32, 32],
      origin: [0,0],
      anchor: [0, 32]
    };
    // $scope.shape = {
    //   coords: [1, 1, 1, 20, 18, 20, 18 , 1],
    //   type: 'poly'
    // };
    NgMap.getMap().then(function (map) {
        $http.get(_base+'/mesa/ObtenerMesas').success(function (data) {
            var mesas = data;
            console.log("mesas: ",mesas);
            $scope.mesas = mesas;
            console.log(map);
        });
        $scope.showCustomMarker = function (event, nombre) {
            console.log(nombre);
            map.customMarkers[nombre].setVisible(true);
            map.customMarkers[nombre].setPosition(this.getPosition());
        };
        $scope.closeCustomMarker = function (evt) {
            this.style.display = 'none';
        };
        $scope.vistaPerfil = function(id){
          console.log(id);
          $state.go('freepong.perfilmesa', {
              id:id
          });
        };
    });
  }); 
}])

.controller('PosicionController', function ($scope, $cordovaGeolocation, $ionicLoading) {
    ionic.Platform.ready(function () {
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Buscando localización'
      });
      var posOptions = {
        enableHighAccuracy: true,
        timeout: 17000,
        maximumAge: 0
      };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var myLatlng = new google.maps.LatLng(lat, long);
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map = map;
        $ionicLoading.hide();
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {
          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: myLatlng
          });
          var infoWindow = new google.maps.InfoWindow({
            content: "Estás aquí!"
          });
          google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open($scope.map, marker);
          });
        });
      }, function (err) {
        $ionicLoading.hide();
        console.log(err);
      });
    });
})

.controller('PerfilController', ['$rootScope', '$scope', '$http', '$state', 'API', '$stateParams','$window', function($rootScope, $scope, $http, $state, api, $stateParams, $window) {
	//var id = window.localStorage['id'];
  var id = $stateParams.id;
	api.getUsuario(id).success(function (data) {
			$rootScope.toast2('Cargando el perfil de ' + data.login);
			$scope.usuario = data;
      // $rootScope.toast2('Cargando perfil...');
      // $scope.nombre = data.nombre;
      // $scope.apellidos = data.apellidos;
      // $scope.email = data.email;
      // $scope.telefono = data.telefono;
      // $scope.login = data.login;
      // $scope.password = data.password;
      // $scope.saldo = data.saldo;
		}).error(function(data){
	})
  $scope.call = function () {
    console.log('tel: ',$scope.usuario.telefono);
    $window.open('tel:' + $scope.usuario.telefono, '_system');
  };
  $scope.mail = function () {
    console.log('mailto: ',$scope.usuario.email);
    $window.open('mailto:' + $scope.usuario.email, '_system');
  };
}]);


////////////http://www.citronlab.com/programacion/ionic-ejemplo-de-aplicacion-tipo-tabs/

// angular.module('starter.services', [])
 
// .factory('Tareas', ['$http', '$q', function($http, $q){
 
//   /* 
//     json con tareas de ejemplo precargadas 
//   */
//   var jsonTareas = [
//     {"id": 0, "titulo": "Ir a la compra","texto": "Refrescos, Patatas fritas"},
//     {"id": 1, "titulo": "Arreglar estantería baño","texto": "Se caen los botes de champú"}, 
//     {"id": 2, "titulo": "Cortar pelo perro","texto": "Parece una oveja"}
//   ];
 
//   return {
//     /* 
//       devuelve todas las tareas 
//     */
//     tareasListado: function() {
//       return jsonTareas;
//     },
 
//     /* 
//       borra la tarea del json que se indique 
//     */
//     tareasBorrar: function(tarea) {
//       jsonTareas.splice(jsonTareas.indexOf(tarea), 1);
//     },
 
     
//       recorre el json de tareas hasta dar con la que tiene el 
//       nodo id igual que el proporcionado y lo devuelve 
    
//     tareasDetalle: function(tareaId) {
//       for (var i = 0; i < jsonTareas.length; i++) {
//         if (jsonTareas[i].id === parseInt(tareaId)) {
//           return jsonTareas[i];
//         }
//       }
//       return null;
//     },
 
//     /* 
//       crea una nueva tarea en el json en base a los 
//       parámetros porporcionados 
//     */
//     tareasNueva: function(titulo,texto) {
//       jsonTareas.push({"id": this.tareasNextId(), "titulo": titulo, "texto": texto});
//     },
 
//     /* 
//       averigua el maximo "id" y devuelve un valor 
//        superior para el alta de una nueva tarea 
//     */
//     tareasNextId: function() {
//       var maxValue=0;
//       for (var i = 0; i < jsonTareas.length; i++) {
//         if (jsonTareas[i].id > maxValue) {
//           maxValue=jsonTareas[i].id;
//         }
//       }
//       return maxValue+1;
//     },
 
//   };
//   return this;
//   }
// ])



// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
        //$rootScope.showLoading();
        if(toState.name != 'giris' && toState.name != 'kayit_ol' && !$rootScope.girisYapildi){
            e.preventDefault();
        }
    });
    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {
        //$rootScope.hideLoading();
    });
    $rootScope.showLoading = function() {
        $ionicLoading.show({
          template: '<img src="img/loading.gif"/>',
          showBackdrop : true
        });
    };
    $rootScope.hideLoading = function(){
        $ionicLoading.hide();
    };
    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
  .state('menu', {
    url: "/menu",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller : 'menuController'
  })
  .state('menu.anasayfa', {
    url: "/anasayfa",
    views : {
        menuContent : {
            templateUrl: "templates/anasayfa.html",
            controller : 'anasayfaController'
        }
    },
    cache : false
  })
  .state('menu.ilanekle', {
    url: "/ilan_ekle",
    views : {
        menuContent : {
            templateUrl: "templates/ilan_ekle.html",
            controller : 'ilanEkleController'
        }
    }
  })
  .state('menu.ilanekle_2', {
    url: "/ilan_ekle_2",
    views : {
        menuContent : {
            templateUrl: "templates/ilan_ekle_2.html",
            controller : 'ilanEkleController2'
        }
    },
    cache : false
  })
  .state('giris', {
    url: "/giris",
    templateUrl: "templates/giris.html",
    controller : 'girisController',
    cache : false
  })
  .state('kayit_ol', {
    url: "/kayit_ol",
    templateUrl: "templates/kayit_ol.html",
    controller : 'kayitController',
    cache : false
  });
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/giris');
});

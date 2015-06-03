app.controller('girisController', ['$scope', '$state', 'wsCall', '$rootScope', 'Session', '$window', function($scope, $state, wsCall, $rootScope, Session, $window){
    $scope.kullanici = {};
    $scope.temp = {};
    $rootScope.gecmis_kullanici = $window.localStorage['gecmis_kullanici'];
    if($rootScope.gecmis_kullanici != undefined){
        $rootScope.gecmis_kullanici = JSON.parse($rootScope.gecmis_kullanici);
        $scope.temp.beni_hatirla = true;
        $scope.kullanici.email = $rootScope.gecmis_kullanici.email;
        $scope.kullanici.sifre = $rootScope.gecmis_kullanici.sifre;
    }
    $scope.girisYap = function(){
        $rootScope.showLoading();
        var kullanici = $scope.kullanici;
        wsCall.wsPost('/hesap/mobil_giris', kullanici)
        .success(function(response, status, headers, config) {
            if(!response.state){
                alert('Kullanici bulunamadi.');
                return;
            }
            Session.kullaniciEkle(response.response);
            Session.girisYap();
            $rootScope.kullaniciIsim = Session.data.kullanici.isim;
            $rootScope.kullaniciSoyisim = Session.data.kullanici.soyisim;
            $rootScope.girisYapildi = Session.data.girisYapildi;
            
            if($scope.temp.beni_hatirla){
                $window.localStorage['gecmis_kullanici'] = JSON.stringify({email : Session.data.kullanici.email, sifre : Session.data.kullanici.sifre});
            }
            $rootScope.hideLoading();
            $state.go('menu.anasayfa', {}, {reload: true});
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
    }
    
    $scope.kayit_ol_git = function (){
        $state.go('kayit_ol');
    }
}]);
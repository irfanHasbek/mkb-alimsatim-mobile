app.controller('ilanEkleController', function($rootScope, $scope, $state, Session, Kamera, wsCall){
    $scope.ilan = {};
    $scope.sehirListesi = [];
    $scope.ilceListesi = [];
    $scope.ilan.kategori = "Bilgisayar";
    $scope.ilan.oncelik = "1";
    $scope.ilan.sahibiId = Session.data.kullanici._id;
    Session.data.ilan = {};
    $scope.ileri = function (){
        Session.data.ilan = $scope.ilan;
        $state.go('menu.ilanekle_2', {}, {reload: true});
    }
    
    wsCall.wsGet("/sehir/listele")
        .success(function(response, status, headers, config) {
            if(!response.state){
                alert('Sehirler listelenemedi.');
                return;
            }
            $scope.sehirListesi = response.data;
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
    
    $scope.ilceYukle = function (){
        if($scope.ilan.sehir != "Seciniz"){
           $rootScope.showLoading();
           for(var i = 0; i < $scope.sehirListesi.length; i++){
               if($scope.ilan.sehir == $scope.sehirListesi[i].sehir){
                   $scope.ilceListesi= $scope.sehirListesi[i].ilceler;
               }  
           }
        }
        $rootScope.hideLoading();
    }
});
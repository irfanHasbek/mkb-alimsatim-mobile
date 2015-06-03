app.controller('anasayfaController', ['$scope', '$state', '$http', '$rootScope', 'Session', "wsCall", "$ionicLoading", function($scope, $state, $http, $rootScope, Session, wsCall, $ionicLoading ){
    $scope.ilanlar = [];
    $scope.ilanVarmi = false;
    $scope.yuklemeTamamlandi = false;
    $scope.ilanGuncelle = function (){
        $rootScope.showLoading();
        wsCall.wsPost('/ilan/ara', {kriter : {sahibiId : Session.data.kullanici._id}})
        .success(function(response, status, headers, config) {
            if(!response.state){
                alert('Kullanici bulunamadi.');
                return;
            }
            
            //Kapatirsan infinite scroll calisir
            if($scope.ilanlar.length == response.data.length)
                $scope.yuklemeTamamlandi = true;
            
            var response = response.data;
            $scope.ilanlar = response;
            for(var i = 0; i < $scope.ilanlar.length; i++){
                $scope.ilanlar[i].tarih = kisaTarihHesapla($scope.ilanlar[i].tarih);   
            }
            
            if($scope.ilanlar.length > 0)
                $scope.ilanVarmi = true;
            
            $rootScope.hideLoading();
        }).error(function(response, status, headers, config) {               
            alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
        });
        console.log("Guncellendi.");
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    
    $scope.ilanGuncelle();
}]);
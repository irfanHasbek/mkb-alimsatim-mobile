app.controller('ilanEkleController2', function($rootScope, $scope, $state, Session, Kamera, $ionicModal, $cordovaFileTransfer, $ionicPlatform, wsCall, $ionicViewService){
    Session.data.ilan.fotografListesi = [];
    $scope.ilan = Session.data.ilan;
    for(var i = 1; i <= 6; i++){
        $scope["resim" + i] = false;
        $scope["src" + i] = Config.defaultImageUrl;
        $scope["yuklemeIlerleme" + i] = {};
    }
    //console.log('s-2 ilan : ' + JSON.stringify($scope.ilan));
    
    $scope.kaydet = function (){
        $rootScope.showLoading();
        for(var i = 1; i <= 6; i++){
            if($scope["resim" + i]){
                var resim = {
                    dosyaAdi : "resim" + i,
                    dosyaYolu : $scope.ilan.fotografListesi["resim" + i]
                }
                $scope.ilan.fotografListesi.push(resim);
            }
        }
        //alert(JSON.stringify($scope.ilan));
        Session.data.ilan = $scope.ilan;
        wsCall.wsPost('/ilan/ekle', Session.data.ilan)
            .success(function(response, status, headers, config) {
                if(!response.state){
                    alert('Ilan eklendi.');
                    return;
                }
                //alert(JSON.stringify(response));
                Session.data.ilan = null;
                $scope.ilan = null;
                for(var i = 1; i <= 6; i++){
                    $scope["resim" + i] = false;
                    $scope["src" + i] = Config.defaultImageUrl;
                    $scope["yuklemeIlerleme" + i] = {};
                }
                $ionicViewService.nextViewOptions({
                    disableBack: true
                });
                $rootScope.hideLoading();
                $state.go('menu.anasayfa', {}, {reload: true}); 
            }).error(function(response, status, headers, config) {               
                alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
            });
    }
    
    $scope.resimAc = function (event){
        var resimIndex = event.target.id.substring(5);
        if($scope["resim" + resimIndex] == false){
            kamera_ac(Kamera, function(state, data){
                if(!state){
                    //alert("Kamera hata verdi.");
                    return;
                }
                $scope['resim' + resimIndex] = true;
                $scope['src' + resimIndex] = data;
                $scope.resim_yukle(resimIndex);
            });   
        }else{
            $scope.secilenResim = event.target.id;
            $scope.resimModalSrc = $scope["src" + $scope.secilenResim.substring(5) + ""];
            $scope.resim_modal.show(); 
        }
    }
    
    $scope.resmiSil = function (){
        $rootScope.showLoading();
        $scope.resim_modal.hide();
        $scope.resimModalSrc = "";
        var resimId = $scope.secilenResim.substring(5);
        $scope["" + $scope.secilenResim + ""] = false;
        $scope["src" + resimId + ""] = Config.defaultImageUrl;
        $scope["yuklemeIlerleme" + resimId].ilerleme = 0;
        wsCall.wsPost("/diger/dosya_sil", {dosya_yolu : $scope.ilan.fotografListesi["resim" + resimId]})
            .success(function(response, status, headers, config) {
                if(!response.state){
                    //alert('Dosya Silinemedi.');
                    return;
                }
                $scope.ilan.fotografListesi["resim" + resimId] = null;
                //alert(JSON.stringify(response));
                $rootScope.hideLoading();
            }).error(function(response, status, headers, config) {               
                alert('Webservis hatasi : ' + response + ', Status : ' + status + ', header : ' + headers + ',config : ' + config);
            });
    }
    
    $ionicModal.fromTemplateUrl('templates/resim_modal.html', function($ionicModal) {
        $scope.resim_modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        animation: 'slide-in-up'
    }); 
    
    $scope.resim_yukle = function(id) {
        var options = {
            fileKey: "resim",
            fileName: Session.data.kullanici._id + new Date() + ".png",
            chunkedMode: false,
            mimeType: "image/png"
        };
        $ionicPlatform.ready(function() {
            $scope.ilanEkleAktif = false;
            $cordovaFileTransfer.upload(Config.host + "/yukleme/resim_yukle", encodeURI($scope['src' + id]), options).then(function(result) {
                var response = JSON.parse(result.response);
                $scope.ilan.fotografListesi["resim" + id] = response.fotografListesi;
                $scope.ilanEkleAktif = true;
            }, function(err) {
                alert("Fotograf yuklenemedi.")
                $scope.ilanEkleAktif = true;
            }, function (progress) {
                if(progress. lengthComputable){
                    $scope["yuklemeIlerleme" + id].ilerleme = (progress.loaded / progress.total) * 100;
                }else{
                    $scope["yuklemeIlerleme" + id].ilerleme = "Yukleniyor..."
                }
            });
        });
    }
});

function kamera_ac(Kamera, cb){
    Kamera.resimCek().then(function(imageURI) {
        cb(true, imageURI);
    }, function(err) {
        cb(false, null);
        console.err(err);
    });
}
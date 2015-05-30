app.factory('wsCall', ['$http', function($http) {
    var wsCall = {};
    
    wsCall.wsPost = function(url, data){
        return $http.post(Config.host + url, data);   
    }
    
    wsCall.wsGet = function(url){
        return $http.get(Config.host + url);   
    }
    
    return wsCall;
}]);
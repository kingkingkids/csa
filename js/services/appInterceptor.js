/**
 * Created by dcampus on 2016/3/21.
 */
angular.module("appInterceptor", [])
    .factory("appInterceptor", appInterceptor);
appInterceptor.$inject = ["$q", "$rootScope"];
function appInterceptor($q, $rootScope) {
    return {
        // optional method
        'request': function (config) {
            if (config.url == "tpls/login.html") {
                $rootScope.$broadcast("interceptor.login");//如果当前模板是login.html,则返回一个广播
            }
            return config;
        },

        // optional method
        'requestError': function (rejection) {
            // do something on error
            return $q.reject("requestError");
        },


        // optional method
        'response': function (response) {
            //console.log(response);
            // do something on success
            return response;
        },

        // optional method
        'responseError': function (rejection) {
            // do something on error
            return $q.reject(rejection);
        }
    };
}
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
            if (response.config.url == "tpls/login.html") {
                $rootScope.$broadcast("tpls.login");//如果当前模板是login.html,则返回一个广播事件
            }
            return response;
        },

        // optional method
        'responseError': function (rejection) {
            // do something on error
            return $q.reject(rejection);
        }
    };
}
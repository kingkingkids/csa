/**
 * Created by dcampus2011 on 16/1/26.
 */
{
    angular
        .module("httpRequest", [])
        .factory("httpRequest.sendRequest", sendRequest)
        .factory("httpRequest.errorManage", errorManage);
    sendRequest.$inject = ["$http", "httpRequest.errorManage", "global.constant"];
    errorManage.$inject = ["$rootScope"];
    function sendRequest($http, errorManage, constant) {
        return function (action, paramData) {
            let req = {
                method: 'POST',
                url: constant.config.sitePath + action,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }
            if (typeof(paramData) === 'string') {
                req.data = paramData;
            } else {
                req.params = paramData || {};
            }

            let promise = $http(req).success(function () {

            }).error(function (data) {
                errorManage(data);
            });
            return promise;
        }
    }

    function errorManage($rootScope) {
        return function (status) {
            /**当拦截器拦截到错误代码是480，则会跳到登录页，并设置登录状态为false**/
            if (status == undefined) {
                return;
            }
            if (status.code == 480) {
                $rootScope.$broadcast("status:logout");//如果错误码是480，则表示所有请求超时
            } else {
                console.log("其他错误");
            }
        }
    }
}
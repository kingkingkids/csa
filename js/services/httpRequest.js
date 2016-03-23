/**
 * Created by dcampus2011 on 16/1/26.
 */
angular
    .module("httpRequest", [])
    .factory("httpRequest.sendRequest", sendRequest)
    .factory("httpRequest.errorManage", errorManage);
sendRequest.$inject = ["$http", "httpRequest.errorManage", "global.constant"];
errorManage.$inject = ["$rootScope"];
function sendRequest($http, errorManage, constant) {
    return function (action, paramData) {
        var req = {
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
        return $http(req)
            .success(function () {

            })
            .error(function (data) {
                errorManage(data);
            });
    }
}
function errorManage(scope) {
    return function (status) {
        /**当拦截器拦截到错误代码是480，则会跳到登录页，并设置登录状态为false**/
        if (status.code == 480) {
            scope.$broadcast("status.logout");//如果错误码是480，则表示所有请求超时
        } else {
            console.log("其他错误");
        }
    }
}
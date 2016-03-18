/**
 * Created by dcampus2011 on 16/1/26.
 */
angular
    .module("httpRequest", [])
    .factory("httpRequest.sendRequest", sendRequest)
    .factory("httpRequest.errorManage", errorManage);

sendRequest.$inject = ["$http", "httpRequest.errorManage", "$rootScope", "$q"];
errorManage.$inject = [];

function sendRequest($http, errorManage, $rootScope) {
    return function (action, paramData) {
        var req = {
            method: 'POST',
            url: $rootScope.config.sitePath + action,
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
            .success(function (data, status, headers, config) {
            })
            .error(function (data, status, headers, config) {
                errorManage(data);
            });
    }
}
function errorManage() {
    return function (status, data) {
        if (status == 500) {
            alert(data.detail);
        } else {
            alert("其他错误");
        }
    }
}
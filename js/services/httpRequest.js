/**
 * Created by dcampus2011 on 16/1/26.
 */
angular.module("httpRequest", [])
    .factory("httpRequest.sendRequest", ["$http", "httpRequest.errorManage", "$rootScope", function ($http, errorManage, $rootScope) {
        return function (action, paramData, successFunc, errorFunc) {
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
                    if (successFunc) {
                        successFunc(data, status, headers, config);
                    }
                })
                .error(function (data, status, headers, config) {
                    if (errorFunc) {
                        errorFunc(data, status, headers, config);
                    } else {
                        errorManage(status, data);
                    }
                });
        }
    }])
    .factory("httpRequest.errorManage", function () {
        return function (status, data) {
            if (status == 500) {
                alert(data.detail);
            } else {
                alert("其他错误");
            }
        }
    });
/**
 * Created by dcampus2011 on 15/9/11.
 */

angular.module("keepAlive", [])
    .factory("keepAlive", keepAlive);

keepAlive.$inject = ["httpRequest.sendRequest", "$interval"];

function keepAlive(sendRequest, $interval) {

    var keepAlive = function () {
        sendRequest("/user/alive.action", "",
            function (data, status, headers, config) {

            },
            function (data, status, headers, config) {

            });
    }
    var promise;
    var t = 5;
    return {
        start: function () {
            if (!promise) {
                promise = $interval(keepAlive, t);
            }
        },
        stop: function () {
            if (promise) {
                $interval.cancel(promise);
                promise = null;
            }
        }
    }
}
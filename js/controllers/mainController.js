/**
 * Created by dcampus2011 on 16/2/17.
 */
angular.module("MainModule", ["httpRequest", "keepAlive"])


    .controller("MainController", ["$scope", "global.staticInfo", "global.currentInfo", "httpRequest.sendRequest", "$state", "keepAlive",
        function ($scope, staticInfo, currentInfo, sendRequest, $state, keepAlive) {
            console.log("MainController");
            $scope.getStatus = function () {
                sendRequest("/user/status.action", null,
                    function (data, status, headers, config) {
                        if (data.status == "login") {
                            currentInfo.account = data.account;
                            currentInfo.userName = data.name;
                            currentInfo.personGroupId = data.personGroupId;
                            keepAlive.start();
                        } else {
                            $state.go("login");
                            keepAlive.stop();
                        }
                    });
            };
            $scope.getStatus();
        }
    ]);
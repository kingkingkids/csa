/**
 * Created by dcampus2011 on 16/1/26.
 */
angular.module("LoginModule", ["httpRequest"])


    .controller("LoginController", ["$rootScope", "$scope", "httpRequest.sendRequest", "$state",
        function ($rootScope, $scope,  sendRequest, $state) {
            $scope.login = function () {
//                var paramsStr="account="+$scope.loginInfo.username+"&password="+$scope.loginInfo.password;
                var paramsObj = {
                    "account": $scope.loginInfo.username,
                    "password": encodeURIComponent($scope.loginInfo.password)
                };
                sendRequest($rootScope.path.authenticate, paramsObj,
                    function (data, status, headers, config) {
                        var paramsStr = "memberId=" + data.members[0].id;
                        sendRequest($rootScope.path.selectMember, paramsStr,
                            function (data, status, headers, config) {
                                $state.go("tabs.home");
                            });
                    });
            };
            $scope.loginInfo = {};
            $scope.loginInfo.username = "";
            $scope.loginInfo.password = "";
        }
    ]);
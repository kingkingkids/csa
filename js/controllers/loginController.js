/**
 * Created by dcampus2011 on 16/1/26.
 */
angular
    .module("LoginModule", ["httpRequest"])
    .controller("LoginController", LoginController);

LoginController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest", "$state"];

function LoginController($rootScope, $scope, sendRequest, $state) {
    $scope.login = function () {
        let paramsObj = {
            "account": $scope.loginInfo.username,
            "password": encodeURIComponent($scope.loginInfo.password)
        };
        sendRequest($rootScope.path.authenticate, paramsObj,
            function (data) {
                let paramsStr = "memberId=" + data.members[0].id;
                sendRequest($rootScope.path.selectMember, paramsStr,
                    function (data) {
                        $state.go("tabs.home");
                    });
            });
    };
    $scope.loginInfo = {};
    $scope.loginInfo.username = "";
    $scope.loginInfo.password = "";
}
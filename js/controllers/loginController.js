/**
 * Created by dcampus2011 on 16/1/26.
 */
angular
    .module("LoginModule", ["httpRequest"])
    .controller("LoginController", LoginController);

LoginController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest", "$state", "$q"];

function LoginController($rootScope, $scope, sendRequest, $state, $q) {
    let vm = this;
    vm.login = function () {
        let paramsObj = {
            "account": vm.loginInfo.username,
            "password": encodeURIComponent(vm.loginInfo.password)
        };
        sendRequest($rootScope.path.authenticate, paramsObj).success(function (data) {
            let paramsStr = "memberId=" + data.members[0].id;
            sendRequest($rootScope.path.selectMember, paramsStr).success(function (data) {
                $state.go("tabs.home");
            });
        });
        //sendRequest($rootScope.path.authenticate, paramsObj).success(function (data) {
        //    let paramsStr = "memberId=" + data.members[0].id;
        //
        //    sendRequest($rootScope.path.selectMember, paramsStr).success(function (data) {
        //        $state.go("tabs.home");
        //    });
        //});

    };
    vm.loginInfo = {};
    vm.loginInfo.username = "";
    vm.loginInfo.password = "";
}
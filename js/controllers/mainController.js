/**
 * Created by dcampus2011 on 16/2/17.
 */
angular
    .module("MainModule", ["httpRequest", "keepAlive"])
    .controller("MainController", MainController);

MainController.$inject = ["$scope", "global.currentInfo", "httpRequest.sendRequest", "$state", "keepAlive"];

function MainController($scope, currentInfo, sendRequest, $state, keepAlive) {
    /**接收到由appInterceptor过来的事件**/
    $scope.$on("tpls.login", function () {
        if (currentInfo.isAnouymus) {
            $state.go("tabs.home");//如果当前已经登录，则回跳到登录页
        }
    });
    let vm = this;
    vm.onTabSelected = function () {
        $scope.$broadcast("loadFavEvent");//重载一次收藏列表
    }
    vm.getStatus = function () {
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
    vm.getStatus();
}

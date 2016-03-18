/**
 * Created by dcampus2011 on 16/2/26.
 */
angular
    .module("favModule", ["httpRequest"])
    .controller("favController", favController);

favController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest"];

function favController($rootScope, $scope, sendRequest) {
    let vm = this;
    vm.func = {
        loadFavList: function () {
            let paramsObj = {"type": "resource"}
            sendRequest($rootScope.path.getWatches, paramsObj).success(function(data){
                vm.watchesList = data.watches;
            });
        }
    }
    vm.func.loadFavList();
    $scope.$on("loadFavEvent", function () {
        vm.func.loadFavList();
    });
}
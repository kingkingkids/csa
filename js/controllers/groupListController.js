/**
 * Created by dcampus2011 on 16/2/26.
 */
angular
    .module("GroupListModule", ["httpRequest"])
    .controller("GroupListController", GroupListController);

GroupListController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest", "$stateParams"];

function GroupListController($rootScope, $scope, sendRequest, $stateParams) {
    $scope.groupList = [];
    console.log($stateParams);
    $scope.title = $stateParams.title;
    $scope.loadGroups = function () {
        sendRequest($rootScope.path.trees, "containPersonGroup=false&containAblumCategory=false&categoryId=" + $stateParams.groupId,
            (data)=> {
                var {children} = data;
                $scope.groupList = children;
            })
    }
    $scope.loadGroups();
}
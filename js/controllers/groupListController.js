/**
 * Created by dcampus2011 on 16/2/26.
 */
angular
    .module("GroupListModule", ["httpRequest"])
    .controller("GroupListController", GroupListController);

GroupListController.$inject = ["$rootScope", "httpRequest.sendRequest", "$stateParams"];

function GroupListController($rootScope, sendRequest, $stateParams) {
    let vm = this;
    vm.groupList = [];
    vm.title = $stateParams.title;
    vm.loadGroups = ()=> {
        sendRequest($rootScope.path.trees, "containPersonGroup=false&containAblumCategory=false&categoryId=" + $stateParams.groupId)
            .success(function (data) {
                console.log(data);
                let {children} = data;
                vm.groupList = children;
            });
    }
    vm.loadGroups();
}
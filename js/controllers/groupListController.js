/**
 * Created by dcampus2011 on 16/2/26.
 */
angular
    .module("GroupListModule", ["httpRequest"])
    .controller("GroupListController", GroupListController);

GroupListController.$inject = ["$stateParams", "request.group", "$rootScope"];

function GroupListController($stateParams, group, $rootScope) {
    let collect = {
        groupList: [],
        title: $stateParams.title,
        loadGroups: ()=> {
            group.getList($stateParams.groupId).then((res)=> {
                let {children} = res.data;
                this.collect.groupList = children;
            });
        },
        loadResources: function () {
            $rootScope.$broadcast("event:loadResources");
        }
    }
    collect.loadGroups();
    this.collect = collect;
}
/**
 * Created by dcampus2011 on 16/2/26.
 */
angular
    .module("GroupListModule", ["httpRequest"])
    .controller("GroupListController", GroupListController);

GroupListController.$inject = ["$stateParams", "request.group"];

function GroupListController($stateParams, group) {
    let collect = {
        groupList: [],
        title: $stateParams.title,
        loadGroups: ()=> {
            group.getList($stateParams.groupId).then((res)=> {
                let {children} = res.data;
                this.collect.groupList = children;
            });
        }
    }
    collect.loadGroups();
    this.collect = collect;
}
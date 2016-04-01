/**
 * Created by dcampus2011 on 16/2/26.
 */
{

    angular
        .module("GroupListModule", ["httpRequest"])
        .controller("GroupListController", GroupListController);

    GroupListController.$inject = ["$stateParams", "request.group", "$rootScope"];

    function GroupListController($stateParams, group, $rootScope) {
        let collect = {
            groupList: [],
            title: $stateParams.title,
            loadGroups: function () {
                group.getList($stateParams.groupId).then((res)=> {
                    let {children} = res.data;
                    this.groupList = children;
                });
            },
            doRefresh: function () {
                group.getList($stateParams.groupId).then((res)=> {
                    let {children} = res.data;
                    this.groupList = children;
                }).finally(function () {
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
            }
        }
        collect.loadGroups();
        this.collect = collect;
    }
}
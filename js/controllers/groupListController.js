/**
 * Created by dcampus2011 on 16/2/26.
 */
{

    angular
        .module("GroupListModule", ["httpRequest"])
        .controller("GroupListController", GroupListController);

    GroupListController.$inject = ["$stateParams", "request.group", "$rootScope", "global.constant"];

    function GroupListController($stateParams, group, $rootScope, constant) {
        let collect = {
            groupList: [],
            title: $stateParams.title,
            path: constant.config.sitePath,
            defaultPic: 'img/default.gif',
            isBooksList: false,
            active: function () {
                if ($stateParams.type == "books") {
                    this.isBooksList = true;
                } else {
                    this.isBooksList = false;
                }
            },
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
        collect.active();
        collect.loadGroups();
        this.collect = collect;
    }
}
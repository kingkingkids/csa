/**
 * Created by dcampus2011 on 16/2/17.
 */

{
    angular
        .module("HomeModule", ["httpRequest"])
        .controller("HomeController", HomeController);

    HomeController.$inject = ["$state", "$timeout", "global.constant"];

    function HomeController($state, $timeout, constant) {
        let collect = {
            journalID: constant.config.journalID,
            goFar: ()=> {
                $state.go('tabs.groupList');
                $timeout(()=> {
                    $state.go('tabs.resourceList');
                });
            },
            goToList: function (_id, title) {
                $state.go('tabs.groupList', {groupId: _id, title: title});
            }
        }
        this.collect = collect;
    }
}
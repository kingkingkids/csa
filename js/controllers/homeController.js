/**
 * Created by dcampus2011 on 16/2/17.
 */

{
    angular
        .module("HomeModule", ["httpRequest"])
        .controller("HomeController", HomeController);

    HomeController.$inject = ["$state", "$timeout", "global.constant", "$scope"];

    function HomeController($state, $timeout, constant, $scope) {
        let collect = {
            journalID: constant.config.journalID,
            active: function () {
                $scope.$on('event:favToResourcesLIst', (_scope, _data)=> {
                    let {parentId,title,type} = _data;
                    $timeout(()=> {
                        $state.go('tabs.resourceList', {parentId: parentId, title: title, type: type});
                    });
                });
            }
        }
        collect.active();
        this.collect = collect;
    }
}
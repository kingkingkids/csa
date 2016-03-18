/**
 * Created by dcampus2011 on 16/2/17.
 */

angular
    .module("HomeModule", ["httpRequest"])
    .controller("HomeController", HomeController);

HomeController.$inject = ["$state", "$timeout", "$rootScope"];

function HomeController($state, $timeout, $rootScope) {
    let vm = this;
    vm.goFar = ()=> {
        $state.go('tabs.groupList');
        $timeout(()=> {
            $state.go('tabs.resourceList');
        })
    }
    $rootScope.goToList = (_id, title)=> {
        $state.go('tabs.groupList', {groupId: _id, title: title});
    }

}
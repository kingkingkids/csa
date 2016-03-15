/**
 * Created by dcampus2011 on 16/2/17.
 */

angular.module("HomeModule", ["httpRequest"])
    .controller("HomeController", ["$scope", "global.staticInfo", "global.currentInfo", "httpRequest.sendRequest", "$state", "$timeout", "$rootScope",
        ($scope, staticInfo, currentInfo, sendRequest, $state, $timeout, $rootScope) => {
            $scope.goFar = ()=> {
                console.log("goFar");
                $state.go('tabs.groupList');
                $timeout(()=> {
                    $state.go('tabs.resourceList');
                })
            }
            $rootScope.goToList = (_id, title)=> {
                $state.go('tabs.groupList', {groupId: _id, title: title});
            }
        }
    ]);
/**
 * Created by dcampus2011 on 16/2/17.
 */

angular.module("HomeModule", ["httpRequest"])
    .controller("HomeController", ["$scope", "global.staticInfo", "global.currentInfo", "httpRequest.sendRequest", "$state", "$timeout", "$rootScope",
        function ($scope, staticInfo, currentInfo, sendRequest, $state, $timeout, $rootScope) {
            console.log("HomeController");
            $scope.goFar = function () {
                console.log("goFar");
                $state.go('tabs.groupList');
                $timeout(function () {
                    $state.go('tabs.resourceList');
                })

            }
            $rootScope.navToJournal = function (_id) {
                console.log(_id);
                if (_id == undefined) {
                    _id = $rootScope.config.journalID;
                    console.log(_id);
                }
                $state.go('tabs.groupList', {groupId: _id});
            }
        }
    ]);
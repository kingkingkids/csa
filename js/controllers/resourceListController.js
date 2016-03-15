/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ["$scope", "global.staticInfo", "global.currentInfo", "httpRequest.sendRequest", "$state", "$stateParams",
        ($scope, staticInfo, currentInfo, sendRequest, $state, $stateParams) => {
            $scope.resourceList = [];
            $scope.title = $stateParams.title;
            $scope.loadGroups = ()=> {
                sendRequest("/group/getResources.action", "type=all&limit=100&start=0&parentId=" + $stateParams.parentId,
                    (data, status, headers, config) => {
                        $scope.resourceList = data.resources;
                    })
            }
            $scope.loadGroups();
        }
    ]);
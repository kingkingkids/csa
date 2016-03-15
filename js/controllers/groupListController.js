/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("GroupListModule", ["httpRequest"])


    .controller("GroupListController", ["$scope", "global.staticInfo", "global.currentInfo", "httpRequest.sendRequest", "$state", "$stateParams",
        ($scope, staticInfo, currentInfo, sendRequest, $state, $stateParams) => {

            $scope.groupList = [];
            console.log($stateParams);
            $scope.title = $stateParams.title;
            $scope.loadGroups = function () {
                sendRequest("/group/trees.action", "containPersonGroup=false&containAblumCategory=false&categoryId=" + $stateParams.groupId,
                    (data, status, headers, config)=> {
                        var {children} = data;
                        $scope.groupList = children;
                    })
            }
            $scope.loadGroups();
        }
    ]);
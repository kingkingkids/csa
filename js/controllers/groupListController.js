/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("GroupListModule", ["httpRequest"])


    .controller("GroupListController", ["$scope", "global.staticInfo", "global.currentInfo", "httpRequest.sendRequest", "$state", "$stateParams",
        function ($scope, staticInfo, currentInfo, sendRequest, $state, $stateParams) {

            $scope.groupList = [];
            console.log($stateParams);
            $scope.loadGroups = function () {
                sendRequest("/group/trees.action", "containPersonGroup=false&containAblumCategory=false&categoryId=" + $stateParams.groupId,
                    function (data, status, headers, config) {
                        console.log(data);
                        $scope.groupList = data.children;
                    })
            }
            $scope.loadGroups();
        }
    ]);
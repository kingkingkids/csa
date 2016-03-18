/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ResourceListController);
ResourceListController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest",
    "$stateParams", "$ionicPopup"];
function ResourceListController($rootScope, $scope, sendRequest, $stateParams, $ionicPopup) {
    $scope.resourceList = [];
    $scope.title = $stateParams.title;
    $scope.init = function () {
        $scope.func.loadGroups();
        $scope.onHold = (id)=> {
            $scope.func.showPopup(id);
        }
    }
    $scope.func = {
        loadGroups: function () {
            sendRequest($rootScope.path.getResources, "type=all&limit=100&start=0&parentId=" + $stateParams.parentId).success(function (data) {
                $scope.resourceList = data.resources;

            });
        },
        showPopup: function (id) {
            $scope.data = {};

            // An elaborate, custom popup
            let popup = $ionicPopup.show({
                template: '',
                title: '收藏资源',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {text: '返回'},
                    {
                        text: '<b>收藏</b>',
                        type: 'button-positive',
                        onTap: (e)=> {

                            return id;
                        }
                    }
                ]
            });
            popup.then((id)=> {
                if (id != undefined) {
                    let paramsObj = {"type": "resource", "id": id};
                    sendRequest($rootScope.path.addWatch, paramsObj).success(function (data) {
                        if (data.success) {
                            console.log("收藏成功");
                        }
                    });

                }
            });
        }
    }
    $scope.init();
}
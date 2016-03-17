/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ["$rootScope", "$scope", "global.currentInfo", "httpRequest.sendRequest", "$state",
        "$stateParams", "$timeout", "$ionicNavBarDelegate", "$ionicPopup",
        ($rootScope, $scope, currentInfo, sendRequest, $state, $stateParams, $timeout, $ionicNavBarDelegate, $ionicPopup) => {


            $scope.resourceList = [];
            $scope.title = $stateParams.title;
            $scope.init = function () {
                $scope.func.loadGroups();
                $scope.onHold = function () {
                    $scope.func.showPopup(arguments);
                }
            }
            $scope.func = {
                loadGroups: ()=> {
                    sendRequest($rootScope.path.getResources, "type=all&limit=100&start=0&parentId=" + $stateParams.parentId,
                        (data, status, headers, config) => {
                            $scope.resourceList = data.resources;
                        });
                },
                showPopup: function () {
                    $scope.data = {};
                    let id = arguments.length && arguments[0];
                    // An elaborate, custom popup
                    var popup = $ionicPopup.show({
                        template: '',
                        title: '收藏资源',
                        subTitle: '',
                        scope: $scope,
                        buttons: [
                            {text: '返回'},
                            {
                                text: '<b>收藏</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    return id[0];
                                }
                            }
                        ]
                    });
                    popup.then((id)=> {
                        if (id != undefined) {
                            let paramsObj = {"type": "resource", "id": id}
                            sendRequest($rootScope.path.addWatch, paramsObj,
                                function (data, status, headers, config) {
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
    ])
;
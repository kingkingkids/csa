/**
 * Created by dcampus2011 on 16/2/26.
 */

angular.module("favModule", ["httpRequest"])
    .controller("favController", ["$rootScope", "$scope", "global.currentInfo", "httpRequest.sendRequest", "$state", "$stateParams",
        ($rootScope, $scope, currentInfo, sendRequest, $state, $stateParams) => {
            $scope.func = {
                loadFavList: function () {
                    let paramsObj = {"type": "resource"}
                    sendRequest($rootScope.path.getWatches, paramsObj,
                        (data, status, headers, config) => {
                            $scope.watchesList = data.watches;
                        });
                }
            }
            $scope.func.loadFavList();
            $scope.$on("loadFavEvent", function () {
                $scope.func.loadFavList();
            })
        }
    ]);
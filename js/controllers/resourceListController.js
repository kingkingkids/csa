/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ResourceListController);
ResourceListController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest",
    "$stateParams", "$ionicPopup", "request.fav", "request.resources"];
function ResourceListController($rootScope, $scope, sendRequest, $stateParams, $ionicPopup, fav, resources) {
    var vm = this;
    vm.resourceList = [];
    vm.title = $stateParams.title;
    vm.init = function () {
        vm.func.loadGroups();
        vm.onHold = (id)=> {
            vm.func.showPopup(id);
        }
    }
    vm.func = {
        loadGroups: function () {
            resources.getList($stateParams.parentId).then((res)=> {
                vm.resourceList = res.data.resources;
            });
        },
        showPopup: function (id) {
            vm.data = {};
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
                    fav.addFav(id).then((res)=> {
                        if (res.data.success) {
                            console.log("收藏成功");
                        }
                    });

                }
            });
        }
    }
    vm.init();
}
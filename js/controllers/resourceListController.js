/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ResourceListController);
ResourceListController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest",
    "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal", "$sce", "global.constant"];
function ResourceListController($rootScope, $scope, sendRequest, $stateParams, $ionicPopup, fav, resources, $ionicModal, $sce, constant) {

    let collect = {
        resourceList: [],
        title: $stateParams.title,
        modalTitle: "",
        frameSrc: "",
        init: function () {
            this.loadGroups();
            this.onHold = (id)=> {
                this.showPopup(id);
            };
            $ionicModal.fromTemplateUrl("./tpls/modal/view.html", {
                scope: $scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false
            }).then((modal)=> {
                $scope.modal = modal;
            });
        },
        loadGroups: function () {
            resources.getList($stateParams.parentId).then((res)=> {
                this.resourceList = res.data.resources;
            });
        },
        showPopup: function () {
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
        },
        openModal: function (id, title) {
            this.modalTitle = title;
            this.frameSrc = $sce.trustAsResourceUrl("http://211.66.86.101:8080" + constant.path.downloadResource + "?disposition=inline&id=" + id);
            //this.frameSrc = $sce.trustAsResourceUrl("1.pdf");
            $scope.modal.show();
        },
        hideModal: function () {
            $scope.modal.hide();
        }
    }
    collect.init();
    this.collect = collect;
}
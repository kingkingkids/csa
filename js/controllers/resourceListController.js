/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ResourceListController);
ResourceListController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest",
    "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal", "$sce", "global.constant", "$timeout"];
function ResourceListController($rootScope, $scope, sendRequest, $stateParams, $ionicPopup, fav, resources, $ionicModal, $sce, constant, $timeout) {

    let collect = {
        resourceList: [],
        title: $stateParams.title,
        modalTitle: "",
        frameSrc: "",
        defaultViewer: null,
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
            this.content = "";
            //this.frameSrc = $sce.trustAsResourceUrl(constant.config.sitePath + constant.path.downloadResource + "?disposition=inline&id=" + id);
            $timeout(()=> {
                sendRequest(constant.path.downloadResource + "?disposition=inline&id=" + id).then(res=> {
                    this.content = $sce.trustAsHtml(res.data);

                });
            }, 500);

            //this.frameSrc = $sce.trustAsResourceUrl("1.pdf");
            $scope.modal.show();
        },
        hideModal: function () {
            this.content = "";
            $scope.modal.hide();
        },
        more: function () {
            try {
                this.defaultViewer = new global.pdf2htmlEX({});
                this.defaultViewer.rescale(2.0);
            } catch (e) {
            }
        }
    }
    collect.init();
    this.collect = collect;
}
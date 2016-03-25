/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ResourceListController);
ResourceListController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest",
    "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal", "$sce", "global.constant", "$timeout", "$ionicScrollDelegate"];
function ResourceListController($rootScope, $scope, sendRequest, $stateParams, $ionicPopup, fav, resources, $ionicModal, $sce, constant, $timeout, $ionicScrollDelegate) {
    let collect = {
        resourceList: [],
        title: $stateParams.title,
        modalTitle: "",
        frameSrc: "",
        defaultViewer: null,
        showZoom: false,
        zoomNum: 1,
        showFrame: false,
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
            //this.frameSrc = $sce.trustAsResourceUrl(constant.config.sitePath + constant.path.downloadResource + "?disposition=inline&id=" + id);
            this.content = "";
            $timeout(()=> {
                sendRequest(constant.path.downloadResource + "?disposition=inline&id=" + id).then(res=> {
                    this.content = $sce.trustAsHtml(res.data);
                    $timeout(()=> {
                        try {
                            this.defaultViewer = new pdf2htmlEX({});
                        } catch (e) {
                        }

                        this.showZoom = true;
                    }, 1);

                    res.data = null;
                });
            }, 500);

            //this.frameSrc = $sce.trustAsResourceUrl("1.pdf");
            $scope.modal.show();
            //let _viewFrame = document.querySelector(".viewFrame");
            //angular.element(_viewFrame).bind("load", function () {
            //    $scope.$emit("event:frameload");
            //
            //});
            //$scope.$on("event:frameload", ()=> {
            //
            //
            //    try {
            //        angular.element(_viewFrame)[0].style.height = angular.element(_viewFrame).contents()[0].querySelector("#page-container").clientHeight + "px";
            //        $timeout(()=> {
            //            $ionicScrollDelegate.resize();
            //            this.showZoom = true;
            //        }, 500);
            //    } catch (e) {
            //
            //    }
            //
            //    _viewFrame = null;
            //});
        },
        hideModal: function () {
            this.content = "";
            this.defaultViewer = null;
            this.showZoom = false;
            this.frameSrc = "";
            $scope.modal.hide();
        },
        more: function () {


        },
        zoom: function (scale) {
            if (scale == 'big') {
                if (this.zoomNum > 2)
                    return;
                this.zoomNum = this.zoomNum + 1;
                this.defaultViewer.rescale(this.zoomNum);
            } else {
                if (this.zoomNum == 1)
                    return;
                this.zoomNum = this.zoomNum - 1;

                this.defaultViewer.rescale(this.zoomNum);
            }
        }
    }
    collect.init();
    this.collect = collect;
}
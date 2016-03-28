/**
 * Created by dcampus2011 on 16/2/26.
 */
angular.module("ResourceListModule", ["httpRequest"])
    .controller("ResourceListController", ResourceListController);
ResourceListController.$inject = ["$state", "$rootScope", "$scope", "httpRequest.sendRequest",
    "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal", "$sce", "global.constant", "$timeout", "$ionicScrollDelegate"];
function ResourceListController($state, $rootScope, $scope, sendRequest, $stateParams, $ionicPopup, fav, resources, $ionicModal, $sce, constant, $timeout, $ionicScrollDelegate) {
    let collect = {
        resourceList: [],
        title: $stateParams.title,
        modalTitle: "",
        frameSrc: "",
        defaultViewer: null,
        showZoom: false,
        zoomNum: 1,
        showFrame: false,
        start: 0,//当前页码
        limit: 10,//每页显示的条数
        totalCount: 1,//总条数
        init: function () {
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

            $scope.modal.show();
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
        },
        loadResources: function () {
            this.start = 0;
            resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                let {resources,totalCount} = res.data;
                this.resourceList = resources;
                this.start = this.limit + this.start;
                this.totalCount = totalCount;
            });
        },
        doRefresh: function () {
            this.start = 0;
            resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                let {resources,totalCount} = res.data;
                this.resourceList = resources;
                this.start = this.limit + this.start;
                this.totalCount = totalCount;
            }).finally(function () {
                $rootScope.$broadcast('scroll.refreshComplete');
            });
        },
        loadMore: function () {
            if (this.start >= this.totalCount) {
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
                return;
            }
            resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                this.resourceList = this.resourceList.concat(res.data.resources);
                this.start = this.limit + this.start;

            }).finally(function () {
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    }
    collect.loadResources();
    collect.init();
    this.collect = collect;
}
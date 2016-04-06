/**
 * Created by dcampus2011 on 16/2/26.
 */
{
    angular.module("ResourceListModule", ["httpRequest"])
        .controller("ResourceListController", ResourceListController);
    ResourceListController.$inject = ["$state", "$rootScope", "$scope",
        "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal",
        "$sce", "global.constant", "$timeout", "global.Common"];
    function ResourceListController($state, $rootScope, $scope, $stateParams,
                                    $ionicPopup, fav, resources, $ionicModal, $sce, constant, $timeout, Common) {
        let collect = {
            resourceList: [],
            title: $stateParams.title,
            modalTitle: "",
            defaultViewer: null,
            showZoom: false,
            start: 0,//当前页码
            limit: 10,//每页显示的条数
            totalCount: 0,//总条数
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
            showPopup: function (id) {
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
                Common.loading.show();
                $scope.modal.show();
                $timeout(()=> {
                    resources.getView(id).then(res=> {
                        $rootScope.$broadcast('event:openModel', res.data);//传递一个事件给pdf预览指令
                        this.showZoom = true;
                    });
                }, 100);
            },
            hideModal: function () {
                $rootScope.$broadcast('event:closeModel');//传递一个事件给pdf预览指令
                this.showZoom = false;
                $scope.modal.hide();
            },
            more: function () {
            },
            zoom: function (scale) {
                if (scale == 'big') {
                    $rootScope.$broadcast('event:scale:big');//传递一个事件给pdf预览指令
                } else {
                    $rootScope.$broadcast('event:scale:small');//传递一个事件给pdf预览指令
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
}
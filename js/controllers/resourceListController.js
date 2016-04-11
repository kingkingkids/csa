/**
 * Created by dcampus2011 on 16/2/26.
 */
{
    angular.module("ResourceListModule", ["httpRequest"])
        .controller("ResourceListController", ResourceListController);
    ResourceListController.$inject = ["$state", "$rootScope", "$scope",
        "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal",
        "$sce", "global.constant", "$timeout", "global.Common", "$ionicActionSheet"];
    function ResourceListController($state, $rootScope, $scope, $stateParams,
                                    $ionicPopup, fav, resources, $ionicModal, $sce, constant, $timeout, Common,
                                    $ionicActionSheet) {
        let collect = {
            resourceList: [],
            title: $stateParams.title,
            modalTitle: "",
            defaultViewer: null,
            showZoom: false,
            start: 0,//当前页码
            limit: 12,//每页显示的条数
            totalCount: 0,//总条数
            listCss: false,
            articleCss: false,
            defaultPic: 'img/default.gif',
            listLength: 0,
            watchId: 0,
            id: 0,
            init: function () {
                if ($stateParams.type == 'folder') {
                    this.limit = 12;
                    this.listCss = true;
                } else if ($stateParams.type == 'list') {
                    this.limit = 10;
                    this.articleCss = true;
                }
                this.onHold = (id, event)=> {
                    this.showPopup(id, event);
                };
                $ionicModal.fromTemplateUrl("./tpls/modal/view.html", {
                    scope: $scope,
                    animation: 'slide-in-up',
                    hardwareBackButtonClose: false
                }).then((modal)=> {
                    $scope.modal = modal;
                });
            },
            showPopup: function (id, event) {
                //angular.element(event.currentTarget).data("rel", id)
                //
                //console.log(angular.element(event.currentTarget).data("rel"));
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
            openModal: function (id, title, watchId) {
                this.watchId = watchId;
                this.id = id;
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
            actionSheet: function () {
                console.log(this.watchId);
                let watchText = this.watchId == 0 ? '添加收藏' : '取消收藏';

                $ionicActionSheet.show({
                    buttons: [
                        {text: watchText},
                    ],
                    //destructiveText: 'Delete',
                    titleText: '',
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: index=> {
                        switch (index) {
                            case 0:
                                if (this.watchId != 0) {
                                    fav.removeFav(this.watchId).then((res)=> {
                                        if (res.data.success) {
                                            Common.Alert('', '成功移除收藏');
                                            this.watchId = 0;
                                        }
                                    });
                                } else {
                                    fav.addFav(this.id).then((res)=> {
                                        if (res.data.success) {
                                            Common.Alert('', '收藏成功');
                                        }
                                    });
                                }
                                break;
                        }
                        return true;
                    }
                });
            },
            zoom: function (scale) {
                if (scale == 'big') {
                    $rootScope.$broadcast('event:scale:big');//传递一个事件给pdf预览指令
                } else {
                    $rootScope.$broadcast('event:scale:small');//传递一个事件给pdf预览指令
                }
            },
            chunk: function (arr, size) {
                let newArr = [];
                for (let i = 0; i < arr.length; i += size) {
                    newArr.push(arr.slice(i, i + size));
                }
                return newArr;
            },
            loadResources: function () {
                this.start = 0;
                resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                    let {resources,totalCount} = res.data;

                    if ($stateParams.type == 'folder') {
                        this.resourceList = this.chunk(resources, 3);
                        this.listLength = this.resourceList.length;
                    } else if ($stateParams.type == 'list') {
                        this.resourceList = resources;
                    }
                    this.start = this.limit + this.start;
                    this.totalCount = totalCount;
                });
            },
            doRefresh: function () {
                this.start = 0;
                resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                    let {resources,totalCount} = res.data;

                    if ($stateParams.type == 'folder') {
                        this.resourceList = this.chunk(resources, 3);
                        this.listLength = this.resourceList.length;
                    } else if ($stateParams.type == 'list') {
                        this.resourceList = resources;
                    }
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
                    if ($stateParams.type == 'folder') {
                        this.resourceList = this.resourceList.concat(this.chunk(res.data.resources, 3));
                        this.listLength = this.resourceList.length;
                    } else if ($stateParams.type == 'list') {
                        this.resourceList = this.resourceList.concat(res.data.resources);
                    }
                    this.start = this.limit + this.start;
                }).finally(function () {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
        }
        collect.init();
        collect.loadResources();
        this.collect = collect;
    }
}
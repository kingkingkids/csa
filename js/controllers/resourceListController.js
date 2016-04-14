/**
 * Created by dcampus2011 on 16/2/26.
 */
{
    angular.module("ResourceListModule", ["httpRequest"])
        .controller("ResourceListController", ResourceListController);
    ResourceListController.$inject = ["$rootScope", "$scope","$stateParams"
        ,"$ionicPopup", "request.fav", "request.resources", "$timeout", "global.Common", "request.search"];
    function ResourceListController($rootScope, $scope, $stateParams,$ionicPopup, fav, resources, $timeout, Common, search) {
        let collect = {
            resourceList: [],
            title: $stateParams.title,
            modalTitle: "",
            defaultViewer: null,
            start: 0,//当前页码
            limit: 12,//每页显示的条数
            totalCount: 0,//总条数
            listCss: false,
            articleCss: false,
            defaultPic: 'img/default.gif',
            listLength: 0,
            watchId: 0,
            id: 0,
            targetItem: null,
            init: function () {
                if ($stateParams.type == 'folder') {
                    this.limit = 12;
                    this.listCss = true;
                } else if ($stateParams.type == 'list') {
                    this.limit = 10;
                    this.articleCss = true;
                }
                this.onHold = (id, watchId, event)=> {
                    this.showPopup(id, watchId, event);
                };
            },
            showPopup: function (id, watchId, event) {
                this.targetItem = angular.element(event.currentTarget);//把列表当前event赋值给一个变量
                let watchText = '添加收藏';
                if (this.targetItem.data('watchId') == 0) {
                    watchText = '添加收藏'
                } else if (this.targetItem.data('watchId') != undefined
                    || watchId > 0) {
                    watchText = '取消收藏'
                }
                let popup = $ionicPopup.show({
                    template: '',
                    title: '收藏资源',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        {text: '返回'},
                        {
                            text: '<b>' + watchText + '</b>',
                            type: 'button-positive',
                            onTap: (e)=> {
                                return {'id': id, 'watchId': watchId, 'text': watchText};
                            }
                        }
                    ]
                });
                popup.then((obj)=> {
                    if (obj != undefined) {
                        if (obj.text == '添加收藏') {
                            fav.addFav(obj.id).then((res)=> {
                                this.targetItem.data('watchId', res.data.watch[0].watchId);// 用列表临时记录是否已经收藏的状态，不刷新
                                Common.Alert('', "收藏成功");
                            });
                        } else {
                            fav.removeFav(obj.watchId).then(res=> {
                                if (res.data.type == "success") {
                                    Common.Alert('', '成功取消收藏');
                                    this.targetItem.data('watchId', 0);
                                    this.watchId = 0;
                                }
                            });
                        }
                    }
                });
            },
            openModal: function (id, title, watchId, event) {
                this.targetItem = angular.element(event.currentTarget);//set 当前element
                this.id = id;//set资源ID
                this.watchId = watchId;//set关注ID
                if (this.targetItem.data('watchId') >= 0 && this.targetItem.data('watchId') != undefined)
                    this.watchId = this.targetItem.data('watchId');
                $rootScope.$emit("params:watched", {'watchId': this.watchId, 'id': id});//向上传送参数给mainController
                $rootScope.pdfViewTitle = title;// 这支pdfView的Title
                $rootScope.pdfModal.show();
                $timeout(()=> {
                    Common.loading.show();
                    resources.getView(id).then(res=> {
                        $rootScope.$broadcast('event:openModel', res.data);//传递一个事件给pdf预览指令
                        $rootScope.showZoom = true;
                        console.log($rootScope.showZoom)
                    });
                }, 300);
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
                } else {
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

            },
            search: function () {
                search.openSearchModal($scope, -$stateParams.parentId);
            }
        }

        /**pdf预览modal关闭时触发**/
        $scope.$on('event:pdfModalClose', function () {
            if (search.isOpenSearhModal) {
                search.openSearchModal($scope);
            } else {
                collect.targetItem.data('watchId', collect.watchId);//关闭view后给当前列表设置一个临时的data
            }
            $rootScope.$broadcast('event:closeModel');//传递一个事件给pdf预览指令，执行关闭前的操作
            $rootScope.showZoom = false;
        });
        /**接收由mainController传过来的参数**/
        $scope.$on('params:fromMain', function (_scope, _id) {
            collect.watchId = _id;
        });
        collect.init();
        collect.loadResources();
        this.search = search;//向模板输出search
        this.collect = collect;
    }
}
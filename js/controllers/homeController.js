/**
 * Created by dcampus2011 on 16/2/17.
 */

{
    angular
        .module("HomeModule", ["httpRequest"])
        .controller("HomeController", HomeController);

    HomeController.$inject = ["$state", "$timeout", "global.constant", "$scope", "request.resources", "global.Common", 'request.search', "$rootScope", "$ionicTabsDelegate"];

    function HomeController($state, $timeout, constant, $scope, resources, Common, search, $rootScope, $ionicTabsDelegate) {
        let collect = {
            journalID: constant.config.journalID,
            totalCount: 0,
            isArticleTab: true,
            isBooksTab: false,
            searchList: [],
            limit: 10,
            start: 0,
            hasResult: false,
            type: null,
            active: function () {
                $scope.$on('event:favToResourcesLIst', (_scope, _data)=> {
                    let {parentId,title,type} = _data;
                    $timeout(()=> {
                        $state.go('tabs.resourceList', {parentId: parentId, title: title, type: type});
                    });
                });
            },
            openSearchModal: function () {
                search.searchModal($scope).then(modal=> {
                    $scope.searchModal = modal;
                    $scope.searchModal.show();
                });
            },
            closeSearchModal: function () {
                $scope.searchModal.hide();
            },
            submitSearch: function (form) {
                if (!form.queryWords.$valid) {
                    Common.Alert('', '请输入关键字');
                }
                if (form.$valid) {
                    this.start = 0;
                    this.tabToLoadArticle();
                }
            },
            loadSearch: function (paramObj, type, more) {
                paramObj.type = type;
                if (more) {
                    search.search(paramObj).then(res=> {
                        let {resources,totalCount} = res.data;
                        if (totalCount == 0) {
                            this.hasResult = true;
                        } else {
                            this.hasResult = false;
                            this.totalCount = totalCount;
                            this.searchList = this.searchList.concat(resources);
                            this.start = this.limit + this.start;
                        }
                    }).finally(function () {
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    });
                } else {
                    search.search(paramObj).then(res=> {
                        let {resources,totalCount} = res.data;
                        if (totalCount == 0) {
                            this.hasResult = true;
                        } else {
                            this.hasResult = false;
                            this.totalCount = totalCount;
                            this.searchList = resources;
                            this.start = this.limit + this.start;
                        }
                    });
                }
            },
            loadMore: function () {
                if (this.start >= this.totalCount) {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                this.fetch(this.type, true);
            },
            fetch: function (type, more) {
                if (this.query == undefined || this.query == "")
                    return;
                let paramObj = {
                    categoryId: 0,
                    queryWords: this.query,
                    groupId: 0,
                    limit: this.limit,
                    start: this.start
                }
                this.loadSearch(paramObj, type, more);//获取数据
            },
            tabToLoadArticle: function () {
                //点击文章TAB的操作
                this.isArticleTab = true;
                this.isBooksTab = false;
                this.type = 'FILE';
                this.start = 0;
                this.totalCount = 0;
                this.searchList = ""
                this.fetch(this.type);
            },
            tabToLoadBooks: function () {
                //点击期刊TAB的操作
                this.isArticleTab = false;
                this.isBooksTab = true;
                this.type = 'DIRECTORY';
                this.start = 0;
                this.totalCount = 0;
                this.searchList = ""
                this.fetch(this.type);
            },
            openModal: function (id, title, watchId, event) {
                this.closeSearchModal();
                //this.watchId = watchId;//set关注ID
                //if (this.targetItem.data('watchId') >= 0 && this.targetItem.data('watchId') != undefined)
                //    this.watchId = this.targetItem.data('watchId');
                Common.loading.show();
                $rootScope.pdfModal.show();
                $rootScope.$emit("params:watched", {'watchId': 0, 'id': id});//向上传送参数给mainController
                resources.getView(id).then(res=> {
                    $rootScope.pdfViewTitle = title;
                    $rootScope.$broadcast('event:openModel', res.data);//传递一个事件给pdf预览指令
                    this.showZoom = true;
                });
            },
            readBooks: function (id, title) {
                this.closeSearchModal();
                $timeout(function () {
                    $ionicTabsDelegate.select(0);
                    $timeout(function () {
                        $rootScope.$broadcast('event:favToResourcesLIst', {parentId: id, title: title, type: 'list'});
                    }, 100);
                }, 100);
            }
        }
        /**pdf预览modal关闭时触发**/
        $scope.$on('event:pdfModalClose', function () {
            if ($state.is('tabs.home')) {
                collect.openSearchModal();
            }
            //collect.targetItem.data('watchId', collect.watchId);//关闭view后给当前列表设置一个临时的data
            $rootScope.$broadcast('event:closeModel');//传递一个事件给pdf预览指令，执行关闭前的操作
            collect.showZoom = false;
        });
        collect.active();
        this.collect = collect;
    }
}
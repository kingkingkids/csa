search.$inject = ["httpRequest.sendRequest", "global.constant", "$ionicModal", 'request.resources', '$rootScope', 'global.Common', '$timeout', '$ionicTabsDelegate', "$state"];

function search(send, constant, $ionicModal, resources, $rootScope, Common, $timeout, $ionicTabsDelegate, $state) {

    return {
        totalCount: 0,
        isArticleTab: true,
        isBooksTab: false,
        searchList: [],
        limit: 10,
        start: 0,
        hasResult: false,
        type: null,
        inQuery: '',
        scope: null,
        groupId: 0,
        isOpenSearhModal: false,
        searchModal: function (scope) {
            return $ionicModal.fromTemplateUrl("./tpls/modal/search.html", {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false
                //,focusFirstInput: true
            });
        },
        openSearchModal: function (scope, groupId) {
            this.scope = scope;
            this.groupId = groupId;
            this.isOpenSearhModal = true;
            this.searchModal(scope).then(modal=> {
                scope.searchModal = modal;
                scope.searchModal.show();
                this.tabToLoadArticle();
            });
        },
        closeSearchModal: function () {
            this.isOpenSearhModal = false;
            this.scope.searchModal.hide();
            this.searchList = [];
            this.query = '';
            this.inQuery = '';
        },
        search: function (paramObj) {
            return send(constant.path.searchResources, paramObj);
        },
        submitSearch: function (form) {
            if (!form.queryWords.$valid) {
                Common.Alert('', '请输入关键字');
            }
            if (form.$valid) {
                this.start = 0;
                this.inQuery = this.query;
                this.tabToLoadArticle();
            }
        },
        fetch: function (type, more) {
            if (this.inQuery == undefined || this.inQuery == "")
                return;
            console.log(this.groupId);
            let paramObj = {
                categoryId: 0,
                queryWords: this.inQuery,
                groupId: this.groupId,
                limit: this.limit,
                start: this.start
            }
            this.loadSearch(paramObj, type, more);//获取数据
        },
        loadSearch: function (paramObj, type, more) {
            paramObj.type = type;
            if (more) {
                this.search(paramObj).then(res=> {
                    let {resources,totalCount} = res.data;
                    this.hasResult = false;
                    this.totalCount = totalCount;
                    this.searchList = this.searchList.concat(resources);
                    this.start = this.limit + this.start;
                }).finally(function () {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            } else {
                this.search(paramObj).then(res=> {
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
                return false;
            } else {
                this.fetch(this.type, true);
            }

        },
        tabToLoadArticle: function () {
            //点击文章TAB的操作
            this.isArticleTab = true;
            this.isBooksTab = false;
            this.type = 'FILE';
            this.start = 0;
            this.totalCount = 0;
            this.searchList = ""
            this.fetch(this.type, false);
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
        readBooks: function (id, title) {
            this.scope.searchModal.hide();
            $timeout(()=> {
                if (this.groupId != 0) {
                    /**列表中的搜索**/
                    $timeout(function () {
                        $state.go('tabs.resourceList', {parentId: id, title: title, type: 'list'});
                    }, 100);
                } else {
                    /**首页的搜索**/
                    $ionicTabsDelegate.select(0);
                    $timeout(function () {
                        $rootScope.$broadcast('event:favToResourcesLIst', {parentId: id, title: title, type: 'list'});
                    }, 100);
                }
            }, 100);
        },
        openModal: function (id, title, watchId, event) {
            this.scope.searchModal.hide();
            //this.watchId = watchId;//set关注ID
            //if (this.targetItem.data('watchId') >= 0 && this.targetItem.data('watchId') != undefined)
            //    this.watchId = this.targetItem.data('watchId');
            Common.loading.show();
            $rootScope.pdfModal.show();
            $rootScope.$emit("params:watched", {'watchId': 0, 'id': id});//向上传送参数给mainController
            resources.getView(id).then(res=> {
                $rootScope.pdfViewTitle = title;
                $rootScope.$broadcast('event:openModel', res.data);//传递一个事件给pdf预览指令
                $rootScope.showZoom = true;
            });
        }
    }
}

module.exports = search;
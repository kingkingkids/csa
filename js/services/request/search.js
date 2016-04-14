search.$inject = ["httpRequest.sendRequest", "global.constant", "$ionicModal", 'request.resources', '$rootScope', 'global.Common', '$timeout', '$ionicTabsDelegate'];

function search(send, constant, $ionicModal, resources, $rootScope, Common, $timeout, $ionicTabsDelegate) {
    return {
        totalCount: 0,
        isArticleTab: true,
        isBooksTab: false,
        searchList: [],
        limit: 10,
        start: 0,
        hasResult: false,
        type: null,
        query: '',
        scope: null,
        searchModal: function (scope) {
            return $ionicModal.fromTemplateUrl("./tpls/modal/search.html", {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false,
                focusFirstInput: true
            });
        },
        openSearchModal: function (scope) {
            this.scope = scope;
            this.searchModal(scope).then(modal=> {
                scope.searchModal = modal;
                scope.searchModal.show();
            });
        },
        closeSearchModal: function () {
            this.scope.searchModal.hide();
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
                this.tabToLoadArticle();
            }
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
        loadSearch: function (paramObj, type, more) {
            paramObj.type = type;
            if (more) {
                this.search(paramObj).then(res=> {
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
                return;
            }
            this.fetch(this.type, true);
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
            this.closeSearchModal();
            $timeout(function () {
                $ionicTabsDelegate.select(0);
                $timeout(function () {
                    $rootScope.$broadcast('event:favToResourcesLIst', {parentId: id, title: title, type: 'list'});
                }, 100);
            }, 100);
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
                //this.showZoom = true;
            });
        }
    };
}

module.exports = search;
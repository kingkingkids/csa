/**
 * Created by dcampus2011 on 16/2/26.
 */
{


    angular
        .module("favModule", ["httpRequest"])
        .controller("favController", favController);

    favController.$inject = ["$rootScope", "$scope", "request.fav", "global.Common",
        "request.resources", "$ionicModal", "$timeout", "$ionicTabsDelegate", "$state"];

    function favController($rootScope, $scope, fav, Common, resources, $ionicModal,
                           $timeout, $ionicTabsDelegate, $state) {
        let collect = {
            watchesList: [],
            booksList: [],
            isArticleTab: true,
            isBooksTab: false,
            showZoom: false,
            a_limit: 10,
            a_start: 0,
            a_totalCount: 0,
            b_limit: 10,
            b_start: 0,
            b_totalCount: 0,
            loadFavList: function () {
                /**访问文章**/
                let paramObj = {
                    "type": "resource",
                    resourceType: 2,
                    limit: this.a_limit,
                    start: this.a_start
                }
                fav.getList(paramObj).then((res)=> {
                    let {totalCount,watches} = res.data;
                    this.a_totalCount = totalCount;
                    this.watchesList = watches;
                    this.a_start = this.a_limit + this.a_start;
                });
            },
            loadMoreArticles: function () {
                if (this.a_start >= this.a_totalCount) {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                let paramObj = {
                    "type": "resource",
                    resourceType: 2,
                    limit: this.a_limit,
                    start: this.a_start
                }
                fav.getList(paramObj).then((res)=> {
                    let {totalCount,watches} = res.data;
                    this.watchesList = this.watchesList.concat(watches);
                    this.a_start = this.a_limit + this.a_start;
                });
            },
            loadBooksList: function () {
                let paramObj = {
                    "type": "resource",
                    resourceType: 1,
                    limit: this.b_limit,
                    start: this.b_start
                }
                /**访问书本**/
                fav.getList(paramObj).then((res)=> {
                    let {totalCount,watches} = res.data;
                    this.booksList = watches;
                    this.b_totalCount = totalCount;
                    this.b_start = this.b_limit + this.b_start;

                });
            },
            loadMoreBooks: function () {
                if (this.b_start >= this.b_totalCount) {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                let paramObj = {
                    "type": "resource",
                    resourceType: 2,
                    limit: this.b_limit,
                    start: this.b_start
                }
                fav.getList(paramObj).then((res)=> {
                    let {totalCount,watches} = res.data;
                    this.booksList = this.booksList.concat(watches);
                    this.b_start = this.b_limit + this.b_start;
                });
            },
            removeFavList: function (id, type) {
                fav.removeFav(id).then(res=> {
                    if (res.data.type == "success") {
                        if (type == 'article') {
                            this.watchesList = "";
                            collect.loadFavList();
                        } else {
                            this.booksList = "";
                            collect.loadBooksList();
                        }
                    }
                });
            },
            articleTab: function () {
                this.isArticleTab = true;
                this.isBooksTab = false;
            },
            booksTab: function () {
                this.isArticleTab = false;
                this.isBooksTab = true;
                if (this.booksList.length == 0) {
                    this.loadBooksList();
                }
            },
            openModal: function (id, title,watchId) {
                Common.loading.show();
                $rootScope.pdfModal.show();
                $rootScope.$emit("params:watched", {'watchId': watchId, 'id': id});//向上传送参数给mainController
                resources.getView(id).then(res=> {
                    $rootScope.pdfViewTitle = title;
                    $rootScope.$broadcast('event:openModel', res.data);//传递一个事件给pdf预览指令
                    this.showZoom = true;
                });
            },
            zoom: function (scale) {
                if (scale == 'big') {
                    $rootScope.$broadcast('event:scale:big');//传递一个事件给pdf预览指令
                } else {
                    $rootScope.$broadcast('event:scale:small');//传递一个事件给pdf预览指令
                }
            },
            readBooks: function (id, title) {
                $timeout(function () {
                    $ionicTabsDelegate.select(0);
                    $timeout(function () {
                        $rootScope.$broadcast('event:favToResourcesLIst', {parentId: id, title: title, type: 'list'});
                    }, 100);
                }, 100);
            }
        }
        $rootScope.$on('event:pdfModalClose', function () {
            $rootScope.$broadcast('event:closeModel');//传递一个事件给pdf预览指令
            collect.showZoom = false;
        });
        collect.loadFavList();
        this.collect = collect;
    }
}
/**
 * Created by dcampus2011 on 16/2/26.
 */
{


    angular
        .module("favModule", ["httpRequest"])
        .controller("favController", favController);

    favController.$inject = ["$rootScope", "$scope", "request.fav", "global.Common", "request.resources", "$ionicModal", "$timeout", "$ionicTabsDelegate", "$state"];

    function favController($rootScope, $scope, fav, Common, resources, $ionicModal, $timeout, $ionicTabsDelegate, $state) {

        let collect = {
            watchesList: [],
            booksList: [],
            isArticleTab: true,
            isBooksTab: false,
            showZoom: false,
            active: function () {
                $ionicModal.fromTemplateUrl("./tpls/modal/view.html", {
                    scope: $scope,
                    animation: 'slide-in-up',
                    hardwareBackButtonClose: false
                }).then((modal)=> {
                    $scope.modal = modal;
                });
            },
            loadFavList: function () {
                /**访问文章**/
                fav.getList(2).then((res)=> {
                    this.watchesList = res.data.watches;
                });
            },
            loadBooksList: function () {
                /**访问书本**/
                fav.getList(1).then((res)=> {
                    this.booksList = res.data.watches;
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
            openModal: function (id, title) {
                console.log(title);
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
            zoom: function (scale) {
                if (scale == 'big') {
                    $rootScope.$broadcast('event:scale:big');//传递一个事件给pdf预览指令
                } else {
                    $rootScope.$broadcast('event:scale:small');//传递一个事件给pdf预览指令
                }
            },
            hideModal: function () {
                $rootScope.$broadcast('event:closeModel');//传递一个事件给pdf预览指令
                this.showZoom = false;
                $scope.modal.hide();
            },
            readBooks: function (id, title) {
                $timeout(function () {
                    $ionicTabsDelegate.select(0);
                    $rootScope.$broadcast('event:favToResourcesLIst', {parentId: id, title: title, type: 'list'});
                }, 100);
            }

        }
        collect.active();
        collect.loadFavList();
        this.collect = collect;
        // this.func = func;//exports
    }
}
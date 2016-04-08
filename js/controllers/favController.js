/**
 * Created by dcampus2011 on 16/2/26.
 */
{


    angular
        .module("favModule", ["httpRequest"])
        .controller("favController", favController);

    favController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest", "request.fav"];

    function favController($rootScope, $scope, sendRequest, fav) {
        let collect = {
            watchesList: [],
            booksList: [],
            isArticleTab: true,
            isBooksTab: false,
            loadFavList: function () {
                fav.getList(2).then((res)=> {
                    this.watchesList = res.data.watches;
                });
            },
            loadBooksList: function () {
                fav.getList(1).then((res)=> {
                    this.booksList = res.data.watches;
                });
            },
            removeFavList: function (id,type) {
                fav.removeFav(id).then(res=> {
                    if (res.data.type == "success") {
                        if(type == 'article') {
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
            }
        }
        collect.loadFavList();
        this.collect = collect;
        // this.func = func;//exports
    }
}
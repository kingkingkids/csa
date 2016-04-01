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
            loadFavList: ()=> {
                fav.getList().then((res)=> {
                    this.watchesList = res.data.watches;
                });
            },
            removeFavList: id=> {
                fav.removeFav(id).then(res=> {
                    if (res.data.type == "success") {
                        this.watchesList = "";
                        collect.loadFavList();
                    }
                });
            }
        }
        collect.loadFavList();
        this.collect = collect;
        // this.func = func;//exports
    }
}
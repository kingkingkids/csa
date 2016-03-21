/**
 * Created by dcampus2011 on 16/2/26.
 */
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
        }
    }
    collect.loadFavList();
    $scope.$on("loadFavEvent", ()=> {
        collect.loadFavList();
    });
   // this.func = func;//exports
}
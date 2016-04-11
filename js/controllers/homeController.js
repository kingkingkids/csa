/**
 * Created by dcampus2011 on 16/2/17.
 */

{
    angular
        .module("HomeModule", ["httpRequest"])
        .controller("HomeController", HomeController);

    HomeController.$inject = ["$state", "$timeout", "global.constant", "$scope", "request.resources", "global.Common"];

    function HomeController($state, $timeout, constant, $scope, resources, Common) {
        let collect = {
            journalID: constant.config.journalID,
            totalCount: 0,
            isArticleTab: true,
            isBooksTab: false,
            searchList: [],
            active: function () {
                $scope.$on('event:favToResourcesLIst', (_scope, _data)=> {
                    let {parentId,title,type} = _data;
                    $timeout(()=> {
                        $state.go('tabs.resourceList', {parentId: parentId, title: title, type: type});
                    });
                });
            },
            openSearchModal: function () {
                resources.searchModal($scope).then(modal=> {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            },
            closeSearchModal: function () {
                $scope.modal.hide();
            },
            submitSearch: function (form) {
                if (!form.queryWords.$valid) {
                    Common.Alert('', '请输入关键字');
                }
                if (form.$valid) {
                    let paramObj = {
                        categoryId: 0,
                        queryWords: this.qurey,
                        groupId: 0,
                        limit: 10,
                        start: 0,
                        type: 'DIRECTORY'
                    }
                    this.loadSearch(paramObj);
                }
            },
            loadSearch: function (paramObj) {
                resources.search(paramObj).then(res=> {
                    console.log(res.data);
                });
            },
            loadMore: function () {
                //if (this.start >= this.totalCount) {
                //    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                //    return;
                //}
                //resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                //    this.resourceList = this.resourceList.concat(res.data.resources);
                //    this.start = this.limit + this.start;
                //}).finally(function () {
                //    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                //});
            },
            loadArticle: function () {
                this.isArticleTab = true;
                this.isBooksTab = false;
            },
            loadBooks: function () {
                this.isArticleTab = false;
                this.isBooksTab = true;

            }
        }
        collect.active();
        this.collect = collect;
    }
}
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
            active: function () {
                $scope.$on('event:favToResourcesLIst', (_scope, _data)=> {
                    let {parentId,title,type} = _data;
                    $timeout(()=> {
                        $state.go('tabs.resourceList', {parentId: parentId, title: title, type: type});
                    });
                });
            },
            openSearchModal: function () {
                search.openSearchModal($scope);
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
        $scope.openModal = search.openModal;
        this.search = search;//向模板输出search
        this.collect = collect;
    }
}
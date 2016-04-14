/**
 * Created by dcampus on 2016/3/23.
 */
{

    angular
        .module("infoModule", [])
        .controller("infoController", infoController);

    infoController.$inject = ["request.message", "global.session", "$rootScope", "request.resources", "$scope", "global.Common", "$ionicTabsDelegate", "$timeout"];

    function infoController(message, session, $rootScope, resources, $scope, Common, $ionicTabsDelegate, $timeout) {
        let collect = {
            limit: 10,
            totalCount: 0,
            items: [],
            getMessage: function () {
                this.start = 0;
                message.getList(session.getSession().memberId, this.start, this.limit).then(res=> {
                    let {resources,totalCount} = res.data;
                    this.items = resources;
                    this.start = this.limit + this.start;
                    this.totalCount = totalCount;
                });
            },
            doRefresh: function () {
                this.start = 0;
                message.getList(session.getSession().memberId, this.start, this.limit).then(res=> {
                    let {resources,totalCount} = res.data;
                    this.items = resources;
                    this.start = this.limit + this.start;
                    this.totalCount = totalCount;
                }).finally(function () {
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
            },
            loadMore: function () {
                if (this.start >= this.totalCount) {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                message.getList(session.getSession().memberId, this.start, this.limit).then(res=> {
                    let {resources} = res.data;
                    this.items = this.items.concat(resources);
                    this.start = this.limit + this.start;
                }).finally(function () {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            },
            removeMessage: function (id) {
                message.removeMessage(id).then(res=> {
                    if (res.data.type == "success") {
                        this.items = "";
                        this.getMessage();
                    }
                });
            },
            openModal: function (id, title, watchId, event) {
                //this.targetItem = angular.element(event.currentTarget);//set 当前element
                //this.watchId = watchId;//set关注ID
                //if (this.targetItem.data('watchId') >= 0 && this.targetItem.data('watchId') != undefined)
                //    this.watchId = this.targetItem.data('watchId');
                Common.loading.show();
                $rootScope.pdfModal.show();
                $rootScope.$emit("params:watched", {'watchId': this.watchId, 'id': id, 'isShowWatch': false});//向上传送参数给mainController
                resources.getView(id).then(res=> {
                    $rootScope.pdfViewTitle = title;
                    $rootScope.$broadcast('event:openModel', res.data);//传递一个事件给pdf预览指令
                    $rootScope.showZoom = true;
                });
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
        /**关闭pdfview的时候触发**/
        $scope.$on('event:pdfModalClose', function () {
            $rootScope.$broadcast('event:closeModel');//传递一个事件给pdf预览指令
            //collect.targetItem.data('watchId', collect.watchId);//关闭view后给当前列表设置一个临时的data
            $rootScope.showZoom = false;
        });
        collect.getMessage();
        this.collect = collect;
    }
}
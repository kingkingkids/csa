/**
 * Created by dcampus on 2016/3/23.
 */
{

    angular
        .module("infoModule", [])
        .controller("infoController", infoController);

    infoController.$inject = ['request.message', "global.session", "$rootScope"];

    function infoController(message, session, $rootScope) {
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
                    let {resources,totalCount} = res.data;
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
            }
        }
        collect.getMessage();
        this.collect = collect;
    }
}
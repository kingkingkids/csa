/**
 * Created by dcampus2011 on 16/2/26.
 */
{
    let VerEx = require("verbal-expressions");
    let Swiper = require("swiper");
    let pdf2htmlEX = require("../../lib/pdf2htmlEX/pdf2htmlEX.js");
    angular.module("ResourceListModule", ["httpRequest"])
        .controller("ResourceListController", ResourceListController);
    ResourceListController.$inject = ["$state", "$rootScope", "$scope",
        "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal",
        "$sce", "global.constant", "$timeout", "global.Common"];
    function ResourceListController($state, $rootScope, $scope, $stateParams,
                                    $ionicPopup, fav, resources, $ionicModal, $sce, constant, $timeout, Common) {
        const regExp = {
            styleReg: VerEx().then("<style").anythingBut('').then('</style>')//过滤style的正则
            , bodyReg: VerEx().find("<body").anythingBut('').endOfLine().anythingBut('').then('body>')//过滤body的正则
            , pageReg: function (start, end) {
                end = end || start;
                return VerEx().then('<div id="' + start).anythingBut('').find('<div id="' + end + '"');//找到当前page正则
            }
            , lastPageReg: function (end) {
                return VerEx().find('<div id="' + end).anythingBut('').then('<div class="loading')//找到最后一page正则;
            }
            , pageIdReg: VerEx().find('id="pf').anythingBut('"')//获取页id正则
        }

        let collect = {
            resourceList: [],
            title: $stateParams.title,
            modalTitle: "",
            frameSrc: "",
            defaultViewer: null,
            showZoom: false,
            zoomNum: 1,
            showFrame: false,
            start: 0,//当前页码
            limit: 10,//每页显示的条数
            totalCount: 0,//总条数
            items: [],
            init: function () {
                this.onHold = (id)=> {
                    this.showPopup(id);
                };
                $ionicModal.fromTemplateUrl("./tpls/modal/view.html", {
                    scope: $scope,
                    animation: 'slide-in-up',
                    hardwareBackButtonClose: false
                }).then((modal)=> {
                    $scope.modal = modal;
                });
            },

            showPopup: function (id) {
                // An elaborate, custom popup
                let popup = $ionicPopup.show({
                    template: '',
                    title: '收藏资源',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        {text: '返回'},
                        {
                            text: '<b>收藏</b>',
                            type: 'button-positive',
                            onTap: (e)=> {
                                return id;
                            }
                        }
                    ]
                });
                popup.then((id)=> {
                    if (id != undefined) {
                        fav.addFav(id).then((res)=> {
                            if (res.data.success) {
                                console.log("收藏成功");
                            }
                        });
                    }
                });
            },
            openModal: function (id, title) {
                this.modalTitle = title;
                this.content = "";
                Common.loading.show();
                this.showZoom = true;
                $scope.$broadcast('event:openModel', id);
                $scope.modal.show();
            },
            hideModal: function () {
                $scope.$broadcast('event:hideModel');
                $scope.modal.hide();
            },
            more: function () {
            },
            zoom: function (scale) {
                if (scale == 'big') {
                    $scope.$broadcast('event:scale:big');
                } else {
                    $scope.$broadcast('event:scale:small');
                }
            },
            loadResources: function () {
                this.start = 0;
                resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                    let {resources,totalCount} = res.data;
                    this.resourceList = resources;
                    this.start = this.limit + this.start;
                    this.totalCount = totalCount;
                });
            },
            doRefresh: function () {
                this.start = 0;
                resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                    let {resources,totalCount} = res.data;
                    this.resourceList = resources;
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
                resources.getList($stateParams.parentId, this.limit, this.start).then((res)=> {
                    this.resourceList = this.resourceList.concat(res.data.resources);
                    this.start = this.limit + this.start;

                }).finally(function () {
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
        }
        collect.loadResources();
        collect.init();
        this.collect = collect;
    }
}
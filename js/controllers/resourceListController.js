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
            swiper: null,
            items: [],
            htmlCode: '',
            index: 0,
            styleOutLine: "",
            style: "",
            body: "",
            pageArray: [],
            pageArrayLength: 0,
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
                $scope.$on('ngRepeatFinished', ()=> {
                    if (!this.swiper) {
                        this.swiper = new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            paginationClickable: false,
                            paginationType: 'progress',
                            onInit: e=> {
                                e.slides[0].innerHTML = this.getHtml(0);
                                this.defaultViewer = new pdf2htmlEX({});
                            }
                        });
                        this.swiper.on('onSlideChangeStart', e=> {
                            this.defaultViewer = null;

                            $timeout(()=> {
                                let activeIndex = e.activeIndex;
                                this.index = activeIndex;
                                if (activeIndex != 0 && this.pageArrayLength != (activeIndex + 1)) {
                                    e.slides[activeIndex].innerHTML = this.getHtml(activeIndex);
                                    e.slides[activeIndex - 1].innerHTML = '<div class="spinner">加载中...</div>';
                                    e.slides[activeIndex + 1].innerHTML = '<div class="spinner">加载中...</div>';
                                } else if (this.pageArrayLength == (activeIndex + 1)) {
                                    e.slides[activeIndex].innerHTML = this.getHtml(activeIndex);
                                    e.slides[activeIndex - 1].innerHTML = '<div class="spinner">加载中...</div>';
                                } else {
                                    e.slides[activeIndex + 1].innerHTML = '<div class="spinner">加载中...</div>';
                                    e.slides[activeIndex].innerHTML = this.getHtml(activeIndex);
                                }
                                this.defaultViewer = new pdf2htmlEX({});
                            }, 150);

                        });
                    } else {
                        this.swiper.slideTo(0);
                        this.swiper.update(true);
                        this.swiper.slides[0].innerHTML = this.getHtml(0);
                    }
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

                $timeout(()=> {
                    resources.getView(id).then(res=> {
                        this.htmlCode = res.data;
                        this.style = this.htmlCode.match(regExp.styleReg)[0];
                        this.body = this.htmlCode.match(regExp.bodyReg)[0];
                        this.pageArray = this.body.match(regExp.pageIdReg)
                            .map(function (value) {
                                return value.replace(/(?:id\=")/gm, "");
                            });
                        this.pageArrayLength = this.pageArray.length;
                        this.styleOutLine = "";
                        this.styleOutLine = $sce.trustAsHtml(this.style);
                        this.getHtml(this.index);
                        res.data = null;
                        this.htmlCode = null;
                    });
                }, 100);
                $scope.modal.show();
            },
            getHtml: function (index) {
                let pageContent
                    , matchBody = this.body.match(regExp.pageReg(this.pageArray[index], this.pageArray[index + 1]));
                this.items = this.pageArray;

                if (matchBody != null) {
                    pageContent = matchBody[0];
                    pageContent = pageContent.substring(0, pageContent.length - 11 - (this.pageArray[index + 1]).length);
                } else {
                    pageContent = this.body.match(regExp.lastPageReg(this.pageArray[index]))[0];
                    pageContent = pageContent.substring(0, pageContent.length - 19);
                }
                Common.loading.hide();
                return '<div id="page-container">' + $sce.trustAsHtml(pageContent) + '</div>';
            },
            hideModal: function () {
                this.content = "";
                this.defaultViewer = null;
                this.showZoom = false;
                this.frameSrc = "";
                this.items = [];
                this.body = "";
                this.style = "";
                $scope.modal.hide();
            },
            more: function () {
            },
            zoom: function (scale) {
                if (scale == 'big') {
                    if (this.defaultViewer.scale == 2.3)
                        return;
                    this.defaultViewer.rescale(2.3);
                    this.content = $sce.trustAsHtml(this.swiper.slides[this.index].innerHTML);
                    document.querySelector('.swiper-container').style.display = "none";
                } else {
                    if (this.defaultViewer.scale == 1)
                        return;
                    this.content = "";
                    this.defaultViewer.rescale(1);
                    document.querySelector('.swiper-container').style.display = "block";
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
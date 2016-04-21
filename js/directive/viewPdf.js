/**
 * Created by dcampus on 2016/4/1.
 */
{
    let VerEx = require("verbal-expressions");
    let Swiper = require("swiper");
    let pdf2htmlEX = require("../../lib/pdf2htmlEX/pdf2htmlEX.js");
    angular.module('directivesModule')
        .directive('onFinished', onFinished)
        .directive('viewPdf', viewPdf);
    viewPdf.$inject = ["$sce", "$timeout", "global.Common", "$ionicGesture", "$ionicScrollDelegate"];
    function onFinished() {
        return {
            restrict: 'A',
            scope: true,
            require: '^?viewPdf',
            link: function (scope, element, attrs, ctrl) {
                if (scope.$last) {
                    ctrl.initSwipe();//渲染结束后调用初始化Swiper
                }
            }
        }
    }

    function viewPdf($sce, $timeout, Common, $ionicGesture, $ionicScrollDelegate) {
        let regExp = {
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
        let swiper = null;
        let defaultViewer = null;
        let slidesArr;
        return {
            restrict: 'E',
            templateUrl: './js/directive/view.html',
            scope: {
                items: '@'
            },
            link: function (scope, element, attrs, ctrl) {
                //console.log(onFinishRenderCtrl);
                scope.$on('event:openModel', openCallback);
                scope.$on('event:closeModel', closeCallback);

                /** 正则规则**/
                scope.index = 0;//定义一个全局的分页索引，方便外部调用
                scope.items = [];
                scope.regExp = regExp;
                scope.clientWidth = document.querySelector('body').clientWidth;
                scope.maxWidth = 400;
                scope.minScale = 1;
                if (scope.clientWidth > scope.maxWidth) {
                    scope.minScale = 1.25;
                } else {
                    scope.minScale = 1;
                }
                function openCallback(_scope, _data) {

                    /**输出内容**/
                    scope.style = _data.match(regExp.styleReg)[0];//用正则匹配出style
                    scope.body = _data.match(regExp.bodyReg)[0];//匹配body中的内容
                    scope.pageArray = scope.body.match(regExp.pageIdReg)
                        .map(function (value) {
                            return value.replace(/(?:id\=")/gm, "");
                        });//输出页码数组
                    scope.pageArrayLength = scope.pageArray.length;//计算数组长度
                    scope.styleOutLine = $sce.trustAsHtml(scope.style);
                    scope.items = scope.pageArray;
                    _data = null;
                    scope.style = null;

                    //let $view_pdf = angular.element(document.querySelector('view-pdf'));//获取需要添加两指操作区域
                    ////let releaseGenture = false;//设置释放开关
                    ///**监听两指操作**/
                    //$ionicGesture.on('pinchout', function (e) {
                    //    alert(JSON.stringify(e.gesture.srcEvent.scale));
                    //    //releaseGenture = true;
                    //}, $view_pdf);
                    //console.log($view_pdf)
                    ///**释放手之后的监听事件**/
                    //releaseGenture = $ionicGesture.on('release', function (e) {
                    //    if (releaseGenture) {
                    //        let scrollDelegate = $ionicScrollDelegate.$getByHandle('zoom-pdf');
                    //        let view = scrollDelegate.getScrollView();
                    //        let scale = view.__zoomLevel;//获取放大等级
                    //        $timeout(function () {
                    //            //swiper.lockSwipes();
                    //            //angular.element(document.querySelector(".zoom-pane").children[0]).attr("style", "translate3d(0px,0px,0px) scale(1)");
                    //            //
                    //            //document.querySelector(".zoom-pane").children[0].style.zoom = scale * 100 + "%";
                    //        }, 500);
                    //        releaseGenture = false;
                    //    }
                    //}, $view_pdf);

                }

                function closeCallback() {
                    defaultViewer = null;
                    if (swiper.slides == null)
                        return;
                    for (let i = 0; i < swiper.slides.length; i++) {
                        swiper.slides[i].innerHTML = "";
                    }
                    scope.styleOutLine = "";//清空样式
                    scope.content = "";
                    defaultViewer = null;
                    scope.showZoom = false;
                    scope.items = [];
                    scope.body = "";
                    scope.style = "";
                    scope.index = 0;

                }
            },
            controller: function ($scope, $element, $attrs) {
                /**以下为初始化Swiper及设值**/
                this.initSwipe = function () {
                    if (!swiper) {
                        swiper = new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            paginationClickable: false,
                            paginationType: 'progress',
                            onInit: e=> {
                                e.slides[0].innerHTML = getHtml(0);
                                defaultViewer = new pdf2htmlEX({});
                                if ($scope.clientWidth > $scope.maxWidth) {
                                    defaultViewer.rescale($scope.minScale);
                                }
                                slidesArr = document.querySelectorAll('.swiper-slide');
                            }
                        });
                    } else {
                        swiper.update(true);
                        swiper.slideTo(0);
                        swiper.slides[0].innerHTML = getHtml(0);
                        slidesArr = document.querySelectorAll('.swiper-slide');
                        defaultViewer = new pdf2htmlEX({});
                        if ($scope.clientWidth > $scope.maxWidth) {
                            defaultViewer.rescale($scope.minScale);
                        }
                    }
                    swiper.on('onSlideChangeEnd', e=> {
                        let activeIndex = e.activeIndex;
                        $scope.index = activeIndex;
                        if (activeIndex != 0 && $scope.pageArrayLength != (activeIndex + 1)) {
                            slidesArr[activeIndex].innerHTML = getHtml(activeIndex);
                            slidesArr[activeIndex - 1].innerHTML = '<div class="spinner">加载中...</div>';
                            slidesArr[activeIndex + 1].innerHTML = '<div class="spinner">加载中...</div>';
                        } else if ($scope.pageArrayLength == (activeIndex + 1)) {
                            slidesArr[activeIndex].innerHTML = getHtml(activeIndex);
                            slidesArr[activeIndex - 1].innerHTML = '<div class="spinner">加载中...</div>';
                        } else {
                            slidesArr[activeIndex + 1].innerHTML = '<div class="spinner">加载中...</div>';
                            slidesArr[activeIndex].innerHTML = getHtml(activeIndex);
                        }
                        defaultViewer = new pdf2htmlEX({});
                        if ($scope.clientWidth >= $scope.maxWidth) {
                            defaultViewer.rescale($scope.minScale);
                        }
                    });
                }
                function getHtml(index) {
                    let pageContent
                        , matchBody = $scope.body.match(regExp.pageReg($scope.pageArray[index], $scope.pageArray[index + 1]));
                    $scope.items = $scope.pageArray;
                    if (matchBody != null) {
                        pageContent = matchBody[0];
                        pageContent = pageContent.substring(0, pageContent.length - 11 - ($scope.pageArray[index + 1]).length);
                    } else {
                        pageContent = $scope.body.match(regExp.lastPageReg($scope.pageArray[index]))[0];
                        pageContent = pageContent.substring(0, pageContent.length - 19);
                    }
                    Common.loading.hide();
                    matchBody = null;
                    return '<div id="page-container">' + $sce.trustAsHtml(pageContent) + '</div>' + (pageContent = '');
                }

                $scope.$on('event:scale:big', function () {
                    if (defaultViewer.scale == 2.5)
                        return;
                    defaultViewer.rescale(2.5);
                    $scope.content = $sce.trustAsHtml(swiper.slides[$scope.index].innerHTML);
                    document.querySelector('.swiper-container').style.display = "none";
                });
                $scope.$on('event:scale:small', function () {
                    if (defaultViewer.scale == $scope.minScale)
                        return;
                    $scope.content = "";
                    defaultViewer.rescale($scope.minScale);
                    document.querySelector('.swiper-container').style.display = "block";
                });
            }
        }

    }
}
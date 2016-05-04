/**
 * Created by dcampus on 2016/4/1.
 */
{
    let VerEx = require("verbal-expressions");
    let Swiper = require("swiper");
    let pdf2htmlEX = require("../../lib/pdf2htmlEX/pdf2htmlEX.js");
    let detectZoom = require("../../lib/detectZoom.js");
    ;
    angular.module('directivesModule')
        .directive('onFinished', onFinished)
        .directive('viewPdf', viewPdf);
    viewPdf.$inject = ["$sce", "$timeout", "global.Common", "$ionicGesture", "$ionicScrollDelegate", "$rootScope"];
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

    function viewPdf($sce, $timeout, Common, $ionicGesture, $ionicScrollDelegate, $rootScope) {
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
                scope.isLoadHtml = false;
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

                    if (window.screen != undefined)
                        window.screen.unlockOrientation();
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
                    let $view_pdf = angular.element(document.querySelector('view-pdf'));//获取需要添加两指操作区域
                    let $pdfZoomView = angular.element(document.querySelector('#pdfZoomView'));
                    /**监听两指操作**/
                    let isGesture = false;
                    $ionicGesture.on('pinchout', function (e) {
                        isGesture = false;
                        if (!scope.isLoadHtml)
                            return;
                        let _swiperPagination = document.querySelector('.swiper-pagination');
                        if (_swiperPagination.style.display != "none") {
                            _swiperPagination.style.display = "none";
                            $rootScope.$broadcast('event:scale:big');
                        }
                    }, $view_pdf);

                    //function getDistance(touch1, touch2) {
                    //    var x = touch2.pageX - touch1.pageX,
                    //        y = touch2.pageY - touch1.pageY;
                    //    return Math.sqrt((x * x) + (y * y));
                    //}
                    //
                    //function getScale(start, end) {
                    //    // need two fingers...
                    //    if (start.length >= 2 && end.length >= 2) {
                    //        return getDistance(end[0], end[1]) /
                    //            getDistance(start[0], start[1]);
                    //    }
                    //    return 1;
                    //}

                    $ionicGesture.on('pinchout', function (e) {
                        console.log(1)
                        console.log(detectZoom.zoom())
                        isGesture = false;
                    }, $pdfZoomView);
                    $ionicGesture.on('pinchin', function (e) {
                        console.log(2)
                        console.log(detectZoom.zoom())
                        let zoom = detectZoom.zoom();
                        if (zoom <= 1.01 || zoom == 1) {
                            isGesture = true;
                        }
                    }, $pdfZoomView);
                    $ionicGesture.on('release', function (e) {
                        $timeout(function () {
                            if (!isGesture)
                                return;
                            let zoom = detectZoom.zoom();

                            if (zoom < 1.01) {
                                $timeout(function () {
                                    $rootScope.$broadcast('event:scale:small');
                                }, 50)
                            }
                        }, 1);
                    }, $pdfZoomView);
                }

                function closeCallback() {

                    if (window.screen != undefined)
                        window.screen.lockOrientation('portrait');
                    scope.isLoadHtml = false
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
                                $scope.isLoadHtml = true;
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
                        $scope.isLoadHtml = true;
                        if ($scope.clientWidth > $scope.maxWidth) {
                            defaultViewer.rescale($scope.minScale);
                        }
                    }
                    swiper.on('onSlideChangeEnd', e=> {
                        $scope.isLoadHtml = false;
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
                        $scope.isLoadHtml = true;
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
                    document.querySelector('ion-tabs').style.display = "none";
                    document.querySelector("#pdfZoomView").style.display = "block";//显示全屏
                    angular.element(document.querySelectorAll('.modal-backdrop')).addClass('hide');
                    angular.element(document.querySelector('body')).removeClass("modal-open");
                    let viewport = document.querySelector("meta[name='viewport']");
                    viewport.setAttribute("content", "initial-scale=1,maximum-scale=3,user-scalable=yes,width=device-width");
                    $timeout(function () {
                        document.querySelector("#pdfZoomView").innerHTML = $sce.trustAsHtml(swiper.slides[$scope.index].innerHTML);
                        $timeout(function () {
                            if (window.plugins != undefined)
                                window.plugins.toast.showLongBottom("已进入全屏模式，双击返回");
                        }, 500);
                    }, 5);
                });
                $scope.$on('event:scale:small', function () {
                    let viewport = document.querySelector("meta[name='viewport']");
                    viewport.setAttribute("content", "initial-scale=1,maximum-scale=1,user-scalable=no,width=device-width");
                    angular.element(document.querySelectorAll('.modal-backdrop.active ')).removeClass('hide');
                    $timeout(function () {
                        document.querySelector("#pdfZoomView").innerHTML = "";
                        document.querySelector("#pdfZoomView").style.display = "none";
                        document.querySelector('.swiper-pagination').style.display = "block";
                        document.querySelector('ion-tabs').style.display = "block";
                        angular.element(document.querySelector('body')).addClass("modal-open");
                    }, 100);
                });
            }
        }

    }
}
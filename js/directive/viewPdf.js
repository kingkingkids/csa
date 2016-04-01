/**
 * Created by dcampus on 2016/4/1.
 */
{
    let VerEx = require("verbal-expressions");
    let Swiper = require("swiper");
    let pdf2htmlEX = require("../../lib/pdf2htmlEX/pdf2htmlEX.js");
    angular.module('directivesModule')
        .directive('viewPdf', viewPdf);
    viewPdf.$inject = ["$state",
        "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal",
        "$sce", "global.constant", "$timeout", "global.Common"];
    function viewPdf($state, $stateParams,
                     $ionicPopup, fav, resources, $ionicModal, $sce, constant, $timeout, Common) {
        return {
            restrict: 'E',
            templateUrl: './js/directive/view.html',
            scope: true,
            link: function (scope, element, attrs) {

            },
            controller: function ($scope, $element, $attrs) {
                $scope.showZoom = false;
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
                $scope.index = 0;
                $scope.$on('event:openModel', function (evt, next, current) {
                    $scope.showZoom = true;
                    $timeout(()=> {
                        resources.getView(next).then(res=> {
                            $scope.htmlCode = res.data;
                            $scope.style = $scope.htmlCode.match(regExp.styleReg)[0];
                            $scope.body = $scope.htmlCode.match(regExp.bodyReg)[0];
                            $scope.pageArray = $scope.body.match(regExp.pageIdReg)
                                .map(function (value) {
                                    return value.replace(/(?:id\=")/gm, "");
                                });
                            $scope.pageArrayLength = $scope.pageArray.length;
                            $scope.styleOutLine = "";
                            $scope.styleOutLine = $sce.trustAsHtml($scope.style);
                            $scope.getHtml($scope.index);
                            res.data = null;
                        });
                    }, 100);
                });

                $scope.$on('event:hideModel', function () {
                    $scope.content = "";
                    $scope.defaultViewer = null;
                    $scope.showZoom = false;
                    $scope.frameSrc = "";
                    $scope.items = [];
                    $scope.body = "";
                    $scope.style = "";
                });

                $scope.$on('ngRepeatFinished', ()=> {
                    if (!$scope.swiper) {
                        $scope.swiper = new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            paginationClickable: false,
                            paginationType: 'progress',
                            onInit: e=> {
                                e.slides[0].innerHTML = $scope.getHtml(0);
                                $scope.defaultViewer = new pdf2htmlEX({});
                            }
                        });
                        $scope.swiper.on('onSlideChangeStart', e=> {
                            $scope.defaultViewer = null;
                            $timeout(()=> {
                                let activeIndex = e.activeIndex;
                                $scope.index = activeIndex;
                                if (activeIndex != 0 && $scope.pageArrayLength != (activeIndex + 1)) {
                                    e.slides[activeIndex].innerHTML = $scope.getHtml(activeIndex);
                                    e.slides[activeIndex - 1].innerHTML = '<div class="spinner">加载中...</div>';
                                    e.slides[activeIndex + 1].innerHTML = '<div class="spinner">加载中...</div>';
                                } else if ($scope.pageArrayLength == (activeIndex + 1)) {
                                    e.slides[activeIndex].innerHTML = $scope.getHtml(activeIndex);
                                    e.slides[activeIndex - 1].innerHTML = '<div class="spinner">加载中...</div>';
                                } else {
                                    e.slides[activeIndex + 1].innerHTML = '<div class="spinner">加载中...</div>';
                                    e.slides[activeIndex].innerHTML = $scope.getHtml(activeIndex);
                                }
                                $scope.defaultViewer = new pdf2htmlEX({});
                            }, 100);

                        });
                    } else {
                        $scope.swiper.slideTo(0);
                        $scope.swiper.update(true);
                        $scope.swiper.slides[0].innerHTML = $scope.getHtml(0);
                    }
                });


                $scope.getHtml = function (index) {
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
                    return '<div id="page-container">' + $sce.trustAsHtml(pageContent) + '</div>';
                }
                $scope.$on('event:scale:big', function () {
                    if ($scope.defaultViewer.scale == 2.5)
                        return;
                    $scope.defaultViewer.rescale(2.5);
                    $scope.content = $sce.trustAsHtml($scope.swiper.slides[$scope.index].innerHTML);
                    document.querySelector('.swiper-container').style.display = "none";
                });
                $scope.$on('event:scale:small', function () {
                    if ($scope.defaultViewer.scale == 1)
                        return;
                    $scope.content = "";
                    $scope.defaultViewer.rescale(1);
                    document.querySelector('.swiper-container').style.display = "block";
                });
            }
        }
    }
}
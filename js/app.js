// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('dcMagazine', ['ionic', 'global', 'LoginModule', 'personalModule', 'MainModule', 'HomeModule', 'GroupListModule', 'ResourceListModule'])
    .config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.navBar.alignTitle('center');//覆盖默认Android的标题居左的设计
        if (ionic.Platform.isAndroid()) {
            //$ionicConfigProvider.scrolling.jsScrolling(true);
            $ionicConfigProvider.views.transition('none');
            $ionicConfigProvider.tabs.position("bottom");
        }
        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    "wrap": {
                        templateUrl: "tpls/login.html",
                        controller: "LoginController"
                    }
                }
            })
            .state('tabs', {
                url: '/tabs',
                abstract: true,
                cache: false,
                views: {
                    "wrap": {
                        templateUrl: "tpls/tabs.html",
                        controller: "MainController"
                    }
                }
            })
            .state('tabs.home', {
                url: '/home',
                views: {
                    'home-tab': {
                        templateUrl: "tpls/home.html",
                        controller: "HomeController"
                    }
                }
            })
            .state('tabs.favorite', {
                url: '/favorite',
                views: {
                    'favorite-tab': {
                        templateUrl: "tpls/favorite.html"
                    }
                }
            }).state('tabs.info', {
            url: '/info',
            views: {
                'info-tab': {
                    templateUrl: "tpls/info.html"
                }
            }
        }).state('tabs.personal', {
            url: '/personal',
            views: {
                'personal-tab': {
                    templateUrl: "tpls/personal.html",
                    controller: "personalController"
                }
            }
        }).state('tabs.groupList', {
            url: '/groupList/:groupId/:title',
            views: {
                'home-tab': {
                    templateUrl: "tpls/groupList.html",
                    controller: "GroupListController"
                }
            }
        }).state('tabs.resourceList', {
            url: '/resourceList/:parentId/:title',
            views: {
                'home-tab': {
                    templateUrl: "tpls/resourceList.html",
                    controller: "ResourceListController"
                }
            }
        });
        $urlRouterProvider.otherwise('/login');
    }])
    .run(["$ionicPlatform", "$rootScope", function ($ionicPlatform, $rootScope) {
        //配置项
        $rootScope.path = {
            trees: "/group/trees.action"//获取分类
            ,getResources:"/group/getResources.action"// 获取柜子资源
        }
        $rootScope.config = {
            sitePath: "http://localhost/csaProxy",
            currentGroupId: 0,
            journalID: 374 //期刊ID
        }
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }]);

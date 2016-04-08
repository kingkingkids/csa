{
    // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
    angular.module('dcMagazine', ['ionic', 'global', 'LoginModule', 'personalModule',
        'MainModule', 'HomeModule', 'GroupListModule', 'ResourceListModule',
        'favModule', 'request.doHttpRequest', 'appInterceptor', 'editModule',
        'infoModule', 'directivesModule']).config(appConfig).run(appRun);
    appConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", "$httpProvider"];
    appRun.$inject = ["$ionicPlatform", "$rootScope"];
    function appConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        {
            //$httpProvider.interceptors.push('appInterceptor');
            $ionicConfigProvider.navBar.alignTitle('left');//覆盖默认Android的标题居左的设计
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
                            controller: "LoginController",
                            controllerAs: "vm"
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
                            controller: "MainController",
                            controllerAs: "vm"
                        }
                    }
                })
                .state('tabs.home', {
                    url: '/home',
                    views: {
                        'home-tab': {
                            templateUrl: "tpls/home.html",
                            controller: "HomeController",
                            controllerAs: "vm"
                        }
                    }
                })
                .state('tabs.favorite', {
                    url: '/favorite',
                    views: {
                        'favorite-tab': {
                            templateUrl: "tpls/favorite.html",
                            controller: "favController",
                            controllerAs: 'vm'

                        }
                    }
                }).state('tabs.info', {
                url: '/info',
                views: {
                    'info-tab': {
                        templateUrl: "tpls/info.html",
                        controller: "infoController",
                        controllerAs: "vm"
                    }
                }
            }).state('tabs.personal', {
                url: '/personal',
                views: {
                    'personal-tab': {
                        templateUrl: "tpls/personal.html",
                        controller: "personalController",
                        controllerAs: 'vm'
                    }
                }
            }).state('tabs.edit', {
                url: '/personal/edit/:type',
                views: {
                    'personal-tab': {
                        templateUrl: "tpls/personalEdit.html",
                        controller: "editController",
                        controllerAs: "vm"

                    }
                }
            }).state('tabs.groupList', {
                url: '/groupList/:groupId/:title',
                views: {
                    'home-tab': {
                        templateUrl: "tpls/groupList.html",
                        controller: "GroupListController",
                        controllerAs: 'vm'
                    }
                }
            }).state('tabs.resourceList', {
                url: '/resourceList/:parentId/:type/:title',
                views: {
                    'home-tab': {
                        templateUrl: "tpls/resourceList.html",
                        controller: "ResourceListController",
                        controllerAs: "vm"
                    }
                }
            });
            $urlRouterProvider.otherwise('/tabs/home');
        }
    }

    function appRun($ionicPlatform, $rootScope) {

        /**基本配置**/
        $rootScope.config = {
            sitePath: "http://localhost/csaProxy",//地址
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
    }
}
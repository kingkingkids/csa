/**
 * Created by dcampus2011 on 15/8/24.
 */

{
    angular
        .module("global", [])
        .factory("global.session", session)
        .factory("global.Common", Common)
        .constant("global.constant", {
            path: {
                authenticate: "/login/authenticate.action"//用户登录
                , selectMember: "/login/selectMember.action"//选择马甲
                , trees: "/group/trees.action"//获取分类
                , getResources: "/group/getResources.action"// 获取柜子资源
                , modifyAccount: "/user/modifyAccount.action"//获取用户修改信息
                , addWatch: "/user/addWatch.action"//收藏
                , getWatches: "/user/getWatches.action"//收藏列表
                , getAccount: "/user/getAccount.action"//获取账号
                , getStatus: "/user/status.action"
                , keepAlive: "/user/alive.action"
                , downloadResource: "/group/downloadResource.action"
                , logout: "/login/logout.action"
                , modifyLoginUser: "/user/modifyLoginUser.action"//单个用户信息修改
                , modifyPassword: "/user/modifyPassword.action"
                , deleteWatch: "/user/deleteWatch.action"
                , getMyReceiveResources: "/group/getMyReceiveResources.action"
                , deleteReceivedResource: "/group/deleteReceivedResource.action"
                , findPassword: '/webmail/findPassword.action'
                , searchResources: '/group/searchResources.action'

            },
            config: {
                sitePath: "http://211.66.86.97/csaProxy",//地址
                //sitePath: "http://58.248.25.234:8080/",
                currentGroupId: 0,
                journalID: 379, //期刊ID,
                booksID: 378,
                guestAccount: ['guest', 'guest!@#']
            }
        });
    Common.$inject = ["$ionicPopup", "$ionicLoading"];
    function session() {
        return {
            setSession: function (paramObj) {
                localStorage.session = JSON.stringify(paramObj);
            },
            getSession: function () {
                return JSON.parse(localStorage.session);
            },
            removeSession: function () {
                localStorage.removeItem('session');
            }

        }
    }

    function Common($ionicPopup, $ionicLoading) {
        return {
            Alert: function (title, content) {
                title = title || "温馨提示";
                return $ionicPopup.alert({
                    title: title,
                    template: content
                });
            },
            loading: {
                show: function () {
                    $ionicLoading.show({
                        template: '加载中....'
                    });
                },
                hide: function () {
                    $ionicLoading.hide();
                }
            }
        }
    }
}
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
                //sitePath: "http://211.66.86.97/csaProxy",//地址
                sitePath: "http://58.248.25.234:8080/",
                currentGroupId: 0,
                journalID: 379, //期刊ID,
                booksID: 378,
                guestAccount: ['guest', 'guest!@#']
            },
            majors: [
                {name: '牙体牙髓病学'},
                {name: '口腔颌面外科'},
                {name: '口腔修复学'},
                {name: '口腔正畸'},
                {name: '预防口腔医学'},
                {name: '口腔病理学'},
                {name: '牙周病学'},
                {name: '口腔种植'},
                {name: '口腔黏膜病'},
                {name: '儿童口腔医学'},
                {name: '老年口腔医学'},
                {name: '口腔颌面放射'},
                {name: '颞下颌关节病学及牙合学'},
                {name: '口腔材料'},
                {name: '口腔修复工艺学'},
                {name: '口腔医学教育'},
                {name: '口腔麻醉学'},
                {name: '口腔医学计算机'},
                {name: '中西医结合'},
                {name: '全科口腔医学'},
                {name: '口腔生物医学'},
                {name: '民营口腔医疗'},
                {name: '口腔医疗服务'},
                {name: '口腔医学设备器材'},
                {name: '口腔药学'},
                {name: '口腔颌面修复'},
                {name: '口腔护理'},
                {name: '口腔美学'},
                {name: '中国唇腭裂诊治联盟（Sinocleft）'},
                {name: '口腔急诊'},
                {name: '镇静镇痛'},
                {name: '口腔激光'},
                {name: '口腔医学科研管理'}
            ]
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
                        noBackdrop: true,
                        template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                },
                hide: function () {
                    $ionicLoading.hide();
                }
            }
        }
    }
}
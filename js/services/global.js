/**
 * Created by dcampus2011 on 15/8/24.
 */

angular
    .module("global", [])
    .factory("global.session", session)
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
        },
        config: {
            sitePath: "http://localhost/csaProxy",//地址
            currentGroupId: 0,
            journalID: 374 //期刊ID
        }
    });
function session() {
    return {
        setSession: function (paramObj) {
            localStorage.session = JSON.stringify(paramObj);
        },
        getSession: function () {
            return JSON.parse(localStorage.session);
        },
        removeSession: function () {
            localStorage.clear(localStorage.session);
        }
    }
}

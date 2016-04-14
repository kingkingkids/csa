let Base64 = require('js-base64').Base64;
account.$inject = ["httpRequest.sendRequest", "$rootScope", "$interval", "$ionicModal", "$q", "global.constant", "global.session", 'global.Common'];
function account(send, scope, interval, $ionicModal, $q, constant, session, Common) {
    return {
        doLogin: function (paramsObj) {
            let defered = $q.defer();
            send(constant.path.authenticate, paramsObj).error(function (err) {
                if (err.code == 300) {
                    Common.Alert('', '密码或用户名有误');
                }
            }).then((res)=> {
                let paramsStr = {
                    'memberId': res.data.members[0].id
                }
                this.selectMember(paramsStr).then((res)=> {
                    this.getStatus().then(res=> {
                        let {account,isAdmin,memberId,name,personGroupId,status} = res.data;
                        session.setSession({account, isAdmin, memberId, name, personGroupId, status});//设置应用session
                    })
                    defered.resolve(res);
                });
            });
            return defered.promise;
        },
        selectMember: function (paramsStr) {
            return send(constant.path.selectMember, paramsStr)
        },
        /**获取用户信息**/
        getAccount: function () {
            return send(constant.path.getAccount, null);
        },
        getStatus: function () {
            return send(constant.path.getStatus);
        },
        keepAlive: {
            promise: null,
            start: function () {
                if (!this.promise) {
                    this.promise = interval(()=> {
                        send(constant.path.keepAlive);
                        send(constant.path.getMyReceiveResources, {start: 0, limit: 1}).then(res=> {
                            let {resources,totalCount} = res.data;
                            scope.$broadcast('event:messages', {resources, totalCount});
                        });
                    }, .1 * 1000 * 60);
                }
            },
            stop: function () {
                if (this.promise) {
                    interval.cancel(this.promise);
                    this.promise = null;
                }
            }
        },
        loginModal: function (scope) {
            if (localStorage.saveUserInfo != undefined && localStorage.session == undefined) {
                let usrInfoArr = localStorage.saveUserInfo.split(',')
                    , paramsObj = {
                    "account": Base64.decode(usrInfoArr[0]),
                    "password": Base64.decode(usrInfoArr[1])
                };
                this.doLogin(paramsObj);
                return;
            }

            $ionicModal.fromTemplateUrl("./tpls/modal/login.html", {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false
                //,focusFirstInput: true
            }).then((modal)=> {
                scope.loginModal = modal;
                this.getStatus().then((res)=> {
                    if (res.data.status == "guest") {
                        scope.loginModal.show();
                        session.removeSession();
                    }
                });
            });
        },
        forgetPasswordModal: function (scope) {
            return $ionicModal.fromTemplateUrl("./tpls/modal/forgetPassword.html", {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false
            });
        },
        logout: function () {
            return send(constant.path.logout);
        },
        saveUserInfo: function (key, value) {
            let paramsStr = key + "=" + value;
            return send(constant.path.modifyLoginUser, paramsStr);
        },
        savePassword: function (oValue, value) {
            let paramObj = {
                'password': oValue,
                newPassword: 'value'
            }
            return send(constant.path.modifyPassword, paramObj);
        },
        findPassword: function (email) {
            let paramObj = {
                'account': email
            }
            return send(constant.path.findPassword, paramObj);
        }
    }
}

module.exports = account;
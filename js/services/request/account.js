account.$inject = ["httpRequest.sendRequest", "$rootScope", "$interval", "$ionicModal", "$q", "global.constant", "global.session"];
function account(send, scope, interval, $ionicModal, $q, constant, session) {
    return {
        doLogin: function (paramsObj) {
            let defered = $q.defer();
            send(constant.path.authenticate, paramsObj).then((res)=> {
                let paramsStr = "memberId=" + res.data.members[0].id;
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
                    }, 5 * 1000 * 60);
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
            $ionicModal.fromTemplateUrl("./tpls/modal/login.html", {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false
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
        logout: function () {
            return send(constant.path.logout);
        },
        saveUserInfo: function (key, value) {
            let paramsStr = key + "=" + value;
            return send(constant.path.modifyLoginUser, paramsStr);
        },
        savePassword: function (oValue, value) {
            return send(constant.path.modifyPassword, "password=" + oValue + "&newPassword=" + value);
        }
    }
}

module.exports = account;
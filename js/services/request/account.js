account.$inject = ["httpRequest.sendRequest", "$rootScope", "global.currentInfo", "$interval"];
function account(send, scope, currentInfo, interval) {
    return {
        doLogin: function (paramsObj) {
            return send(scope.path.authenticate, paramsObj).success(()=> {
                currentInfo.isAnouymus = true;
            });
        },
        selectMember: function (paramsStr) {
            return send(scope.path.selectMember, paramsStr)
        },
        /**获取用户信息**/
        getAccount: function () {
            return send(scope.path.getAccount, null);
        },
        getStatus: function () {
            return send(scope.path.getStatus);
        },
        keepAlive: {
            promise: null,
            start: function () {
                if (!this.promise) {
                    this.promise = interval(()=> {
                        send(scope.path.keepAlive);
                    }, 5 * 1000 * 60);
                }
            },
            stop: function () {
                if (this.promise) {
                    interval.cancel(this.promise);
                    this.promise = null;
                }
            }
        }
    }
}
module.exports = account;
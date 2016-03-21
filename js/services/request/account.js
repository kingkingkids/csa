account.$inject = ["httpRequest.sendRequest", "$rootScope", "global.currentInfo"];
function account(send, scope, currentInfo) {
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
        }
    }
}
module.exports = account;
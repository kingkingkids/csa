/**
 * Created by dcampus2011 on 16/1/26.
 */
{

    angular
        .module("LoginModule", ["httpRequest"])
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$state", "request.account", "global.session"];

    function LoginController($state, account, session) {
        let collect = {
            login: function () {
                let paramsObj = {
                    "account": loginInfo.username,
                    "password": encodeURIComponent(loginInfo.password)
                };
                account.doLogin(paramsObj).then((res)=> {
                    let paramsStr = "memberId=" + res.data.members[0].id;
                    account.selectMember(paramsStr).then((res)=> {
                        $state.go("tabs.home");
                        paramsStr = null;
                    });
                    paramsObj = null;
                });
            }
        }
        let loginInfo = {
            username: "",
            password: ""
        }
        this.loginInfo = loginInfo;
        this.collect = collect;
    }
}
/**
 * Created by dcampus2011 on 16/1/26.
 */
angular
    .module("LoginModule", ["httpRequest"])
    .controller("LoginController", LoginController);

LoginController.$inject = ["$state", "request.account"];

function LoginController($state, account) {
    let collect = {
        login: ()=> {
            let paramsObj = {
                "account": this.loginInfo.username,
                "password": encodeURIComponent(this.loginInfo.password)
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
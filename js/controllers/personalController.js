/**
 * Created by dcampus2011 on 16/1/29.
 */
{

    angular
        .module("personalModule", ["httpRequest"])
        .controller("personalController", personalController);

    personalController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest", "$state", "$ionicPopup", "request.account", "global.session"];

    function personalController(root, scope, sendRequest, $state, $ionicPopup, account, session) {
        let accountInfo = {};

        let collect = {
            getAccount: ()=> {
                account.getAccount().then((res)=> {
                    let {account,company,department,email,im,mobile,name,phone,position} = res.data;
                    this.accountInfo = {
                        account: account,
                        name: name,
                        company: company,
                        department: department,
                        mobile: mobile,
                        email: email,
                        im: im
                    }
                });
            },
            logout: function () {
                account.logout().then(res=> {
                    root.$emit("event:logout");
                    localStorage.removeItem('saveUserInfo');
                });
            }
        }
        collect.getAccount();
        this.collect = collect;
    }

}
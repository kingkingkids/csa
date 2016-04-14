/**
 * Created by dcampus2011 on 16/1/29.
 */
{

    angular
        .module("personalModule", ["httpRequest"])
        .controller("personalController", personalController);

    personalController.$inject = ["$rootScope", "request.account"];

    function personalController($rootScope, account) {
        let collect = {
            accountInfo: {},
            getAccount: ()=> {
                account.getAccount().then((res)=> {
                    let {account,company,department,email,im,mobile,name} = res.data;
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
                    $rootScope.$emit("event:logout");
                    localStorage.removeItem('saveUserInfo');
                });
            }
        }
        collect.getAccount();
        this.collect = collect;
    }

}
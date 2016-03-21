/**
 * Created by dcampus2011 on 16/1/29.
 */
angular
    .module("personalModule", ["httpRequest"])
    .controller("personalController", personalController);

personalController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest", "$state", "$ionicPopup", "request.account"];

function personalController($rootScope, $scope, sendRequest, $state, $ionicPopup, account) {
    let vm = this;
    vm.accountInfo = {};
    vm.getAccount = ()=> {
        account.getAccount().then((res)=>{
            let {account,company,department,email,im,mobile,name,phone,position} = res.data;
            vm.accountInfo = {
                account: account,
                name: name,
                company: company,
                department: department,
                mobile: mobile,
                email: email
            }
        });



    }
    vm.modifyAccount = ()=> {
        let _info = vm.accountInfo;
        let paramsObj = {
            "account": _info.account,
            "name": _info.name,
            "company": _info.company,
            "department": _info.department,
            "mobile": _info.mobile,
            "email": _info.email
        };
        sendRequest($rootScope.path.modifyAccount, paramsObj).success(function (data) {
            let alertPopup = $ionicPopup.alert({
                title: '修改账号信息',
                template: '保存成功！'
            });
        });

    }
    vm.getAccount();
}

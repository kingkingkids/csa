/**
 * Created by dcampus2011 on 16/1/29.
 */
angular
    .module("personalModule", ["httpRequest"])
    .controller("personalController", personalController);

personalController.$inject = ["$rootScope", "$scope", "httpRequest.sendRequest", "$state", "$ionicPopup"];

function personalController($rootScope, $scope, sendRequest, $state, $ionicPopup) {
    $scope.accountInfo = {};
    $scope.getAccount = function () {
        sendRequest("/user/getAccount.action", null,
            (data, status, headers, config) => {
                $scope.accountInfo.account = data.account;
                $scope.accountInfo.name = data.name;
                $scope.accountInfo.company = data.company;
                $scope.accountInfo.department = data.department;
                $scope.accountInfo.position = data.position;
                $scope.accountInfo.email = data.email;
            })
    }

    $scope.modifyAccount = ()=> {
        let paramsObj = {
            "account": $scope.accountInfo.account,
            "name": $scope.accountInfo.name,
            "company": $scope.accountInfo.company,
            "department": $scope.accountInfo.department,
            "position": $scope.accountInfo.position,
            "email": $scope.accountInfo.email
        };
        sendRequest($rootScope.path.modifyAccount, paramsObj,
            (data, status, headers, config)=> {
                let alertPopup = $ionicPopup.alert({
                    title: '修改账号信息',
                    template: '修改成功！'
                });
            })
    }

    $scope.getAccount();
}

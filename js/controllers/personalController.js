/**
 * Created by dcampus2011 on 16/1/29.
 */
angular.module("personalModule",["httpRequest"])

    .controller("personalController" ,["$scope","global.staticInfo","httpRequest.sendRequest","$state","$ionicPopup",
        function ($scope,staticInfo,sendRequest,$state,$ionicPopup) {
            $scope.accountInfo={};
            $scope.getAccount=function(){
                sendRequest("/user/getAccount.action",null,
                    function(data, status, headers, config){
                        $scope.accountInfo.account=data.account;
                        $scope.accountInfo.name=data.name;
                        $scope.accountInfo.company=data.company;
                        $scope.accountInfo.department=data.department;
                        $scope.accountInfo.position=data.position;
                        $scope.accountInfo.email=data.email;
                    })
            }

            $scope.modifyAccount=function(){
                var paramsObj={
                    "account":$scope.accountInfo.account,
                    "name":$scope.accountInfo.name,
                    "company":$scope.accountInfo.company,
                    "department":$scope.accountInfo.department,
                    "position":$scope.accountInfo.position,
                    "email":$scope.accountInfo.email
                };
                sendRequest("/user/modifyAccount.action",paramsObj,
                    function(data, status, headers, config){
                        var alertPopup = $ionicPopup.alert({
                            title: '修改账号信息',
                            template: '修改成功！'
                        });
                    })
            }

            $scope.getAccount();
        }
    ]);
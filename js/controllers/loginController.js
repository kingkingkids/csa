/**
 * Created by dcampus2011 on 16/1/26.
 */
angular.module("LoginModule",["httpRequest"])


    .controller("LoginController" ,["$scope","global.staticInfo","httpRequest.sendRequest","$state",
        function ($scope,staticInfo,sendRequest,$state) {
            $scope.login=function(){


//                var paramsStr="account="+$scope.loginInfo.username+"&password="+$scope.loginInfo.password;
                var paramsObj={"account":$scope.loginInfo.username,"password":$scope.loginInfo.password};
                sendRequest("/login/authenticate.action",paramsObj,
                    function(data, status, headers, config){
                        var paramsStr="memberId="+data.members[0].id;
                        sendRequest("/login/selectMember.action",paramsStr,
                            function(data, status, headers, config){
                                $state.go("tabs.home");

                            });
                    });
            };

            $scope.loginInfo={};
            $scope.loginInfo.username="";
            $scope.loginInfo.password="";
        }
    ]);
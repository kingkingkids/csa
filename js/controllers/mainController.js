/**
 * Created by dcampus2011 on 16/2/17.
 */
{

    angular
        .module("MainModule", ["httpRequest"])
        .controller("MainController", MainController);

    MainController.$inject = ["$rootScope", "$scope", "$state", "request.account", "global.session", "$ionicHistory"];

    function MainController(root, scope, state, account, session, $ionicHistory) {
        /**接收到由httpRequest传过来的事件,退出时调用**/
        root.$on("status:logout", ()=> {
            collect.logoutFunc();
        });
        root.$on("event:logout", ()=> {
            collect.logoutFunc();
        });
        account.loginModal(scope);//判断是否登录,否则显示登录窗口
        let collect = {
            init: function () {
                account.keepAlive.start();//进入首页后开始调用保持链接,5分钟加载一次
            },
            loginModal: {
                show: function () {
                    scope.loginModal.show();
                },
                hide: function () {
                    scope.loginModal.hide();
                }
            },
            login: ()=> {
                let paramsObj = {
                    "account": this.loginInfo.username,
                    "password": encodeURIComponent(this.loginInfo.password)
                };
                account.doLogin(paramsObj).then(res=> {
                    this.collect.loginModal.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: false
                    });
                });

            },
            logoutFunc: ()=> {
                this.collect.loginModal.show();
                account.keepAlive.stop();//停止keepAlive调用
                session.removeSession();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                state.go("tabs.home")
                $ionicHistory.clearHistory();
            }
        };
        let loginInfo = {
            username: null,
            password: null
        }
        collect.init();
        this.collect = collect;//外部调用
        this.loginInfo = loginInfo;
    }

}
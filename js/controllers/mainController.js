/**
 * Created by dcampus2011 on 16/2/17.
 */
angular
    .module("MainModule", ["httpRequest"])
    .controller("MainController", MainController);

MainController.$inject = ["$rootScope", "$scope", "global.currentInfo", "$state", "request.account", "$ionicModal"];

function MainController(root, scope, currentInfo, state, account, $ionicModal) {
    /**接收到由appInterceptor过来的事件,当加载到登录页时的判断**/
    root.$on("interceptor.login", function () {
        if (currentInfo.isAnouymus) {
            state.go("tabs.home");//如果当前已经登录，则回跳到首页
        }
    });
    /**接收到由httpRequest传过来的事件,退出时调用**/
    root.$on("status.logout", ()=> {
        //state.go("login");//返回登录页
        this.collect.loginModal.show();
        state.go("tabs.home");
        currentInfo.isAnouymus = false;//当前登录状态为false
        account.keepAlive.stop();//停止keepAlive调用
    });
    account.loginModal(scope);//判断是否登录,否则显示登录窗口
    let collect = {
        init: function () {
            account.keepAlive.start();//进入首页后开始调用保持链接,5分钟加载一次
        },
        onTabSelected: ()=> {
            scope.$broadcast("loadFavEvent");//重载一次收藏列表
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
            });

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

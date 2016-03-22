/**
 * Created by dcampus2011 on 16/2/17.
 */
angular
    .module("MainModule", ["httpRequest"])
    .controller("MainController", MainController);

MainController.$inject = ["$rootScope", "$scope", "global.currentInfo", "$state", "request.account"];

function MainController(root, scope, currentInfo, state, account) {
    /**接收到由appInterceptor过来的事件,当加载到登录页时的判断**/
    root.$on("interceptor.login", function () {
        if (currentInfo.isAnouymus) {
            state.go("tabs.home");//如果当前已经登录，则回跳到首页
        }
    });
    /**接收到由httpRequest传过来的事件,退出时调用**/
    root.$on("status.logout", function () {
        state.go("login");//返回登录页
        currentInfo.isAnouymus = false;//当前登录状态为false
        account.keepAlive.stop();//停止keepAlive调用
    });
    let collect = {
        init: function () {
            account.keepAlive.start();//进入首页后开始调用保持链接,5分钟加载一次
        },
        onTabSelected: ()=> {
            scope.$broadcast("loadFavEvent");//重载一次收藏列表
        }
    };
    collect.init();
    this.collect = collect;//外部调用
}

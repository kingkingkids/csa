/**
 * Created by dcampus2011 on 16/2/17.
 */
{
    let Base64 = require('js-base64').Base64;
    angular
        .module("MainModule", ["httpRequest"])
        .controller("MainController", MainController);

    MainController.$inject = ["$rootScope", "$scope", "$state", "request.account",
        "global.session", "$ionicHistory", 'global.constant', 'global.Common', '$ionicModal',
        '$ionicActionSheet', 'request.fav'];

    function MainController(root, scope, state, account, session,
                            $ionicHistory, constant, Common, $ionicModal, $ionicActionSheet, fav) {
        let loginInfo = {
            username: null,
            password: null,
            remberMe: null
        }
        /**接收到由httpRequest传过来的事件,退出时调用**/
        root.$on("status:logout", ()=> {
            collect.logoutFunc();
        });
        root.$on("event:logout", ()=> {
            collect.logoutFunc();
        });
        /** 接收由列表传递过来的关注的参数**/
        root.$on('params:watched', (_scope, _data)=> {
            collect.watchId = _data.watchId;
            collect.resourceId = _data.id;
        });
        account.loginModal(scope);//判断是否登录,否则显示登录窗口
        let collect = {
            watchId: 0,
            resourceId: 0,
            init: function () {
                if (localStorage.saveUserInfo != undefined) {
                    loginInfo.remberMe = true;
                    let usrInfoArr = localStorage.saveUserInfo.split(',');
                    loginInfo.username = Base64.decode(usrInfoArr[0]);
                    loginInfo.password = Base64.decode(usrInfoArr[1]);

                }
                account.keepAlive.start();//进入首页后开始调用保持链接,5分钟加载一次
                /**创建全局的pdfModal**/
                $ionicModal.fromTemplateUrl("./tpls/modal/view.html", {
                    scope: scope,
                    animation: 'slide-in-up',
                    hardwareBackButtonClose: false
                }).then((modal)=> {
                    root.pdfModal = modal;
                });
            },
            closePdfModal: function () {
                root.pdfModal.hide();
                root.$broadcast('event:pdfModalClose');
            },
            actionSheet: function () {
                let watchText = this.watchId == 0 ? '添加收藏' : '取消收藏'; //根据watchId判断是否已添加收藏
                $ionicActionSheet.show({
                    buttons: [
                        {text: watchText},
                    ],
                    //destructiveText: 'Delete',
                    titleText: '',
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: index=> {
                        switch (index) {
                            case 0:
                                if (this.watchId != 0) {
                                    fav.removeFav(this.watchId).then((res)=> {
                                        if (res.data.success) {
                                            this.watchId = 0;
                                            root.$broadcast('params:fromMain',this.watchId);
                                            Common.Alert('', '成功取消收藏');
                                        }
                                    });
                                } else {
                                    fav.addFav(this.resourceId).then((res)=> {
                                        this.watchId = res.data.watch[0].watchId;
                                        root.$broadcast('params:fromMain',this.watchId);
                                        Common.Alert('', '收藏成功');
                                    });
                                }
                                break;
                        }
                        return true;
                    }
                });
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
                    "password": this.loginInfo.password
                };
                account.doLogin(paramsObj).then(res=> {
                    this.collect.loginModal.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: false
                    });
                    if (loginInfo.remberMe) {
                        let usr = Base64.encode(this.loginInfo.username)
                            , psw = Base64.encode(this.loginInfo.password);
                        localStorage.saveUserInfo = [usr, psw];
                    }
                    loginInfo = {
                        username: null,
                        password: null,
                        remberMe: null
                    }
                });

            },
            guestLogin: ()=> {
                let paramsObj = {
                    "account": constant.config.guestAccount[0],
                    "password": constant.config.guestAccount[1]
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

                this.loginInfo.remberMe = false;
                this.loginInfo.username = '';
                this.loginInfo.password = '';

            }
            , forget: function () {
                account.forgetPasswordModal(scope).then(modal=> {
                    scope.forgetPasswordModal = modal;
                    scope.forgetPasswordModal.show();
                    this.modalForgetTitle = '找回密码';
                });
            },
            hideForgetModal: function () {
                scope.forgetPasswordModal.hide();
            },
            sendEmail: function () {
                let reg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
                if (this.findPasswordMail == "" || this.findPasswordMail == undefined) {
                    Common.Alert('', '邮箱为空，请填写邮箱');
                    return;
                }
                if (!reg.test(this.findPasswordMail)) {
                    Common.Alert('', '邮箱格式有误，请重新填写');
                    return;
                }
                account.findPassword(this.findPasswordMail).then(res=> {
                    if (res.data.errorCode == '404') {
                        Common.Alert('', '您输入的邮箱不存在，请重新输入');
                    } else if (res.data.errorCode == "0") {
                        Common.Alert('', '发送成功').then(res=> {
                            this.findPasswordMail = "";
                            scope.forgetPasswordModal.hide();
                        });
                    }
                });
            }
        };

        collect.init();
        this.collect = collect;//外部调用
        this.loginInfo = loginInfo;
    }

}
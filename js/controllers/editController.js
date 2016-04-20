/**
 * Created by dcampus on 2016/3/23.
 */
{
    angular
        .module("editModule", [])
        .controller("editController", editController);

    editController.$inject = ["request.account", "$stateParams", "$scope", "$state", "global.Common", "global.constant"];

    function editController(account, $stateParams, $scope, $state, Common, constant) {
        console.log(constant.majors)
        let vm = this;
        let userInfo = {
            account: null,
            userName: null,
            company: null,
            department: null,
            email: null,
            confirmMail: null,
            mobile: null,
            password: null,
            confirmPassword: null,
            oldPassword: null,
            majors: constant.majors,
            activate: activate//进controller就执行
        }
        let collect = {
            isName: false,
            isCompany: false,
            isEmail: false,
            isMobile: false,
            isPassword: false,
            isDepartment: false,
            isIm: false,
            title: "",
            showLabel: showLabel,
            save: save
        }
        userInfo.activate();//读取用户信息
        collect.showLabel();
        $scope.$on("event:" + $stateParams.type, verifyAndSave);
        this.userInfo = userInfo;
        this.collect = collect;
        function activate() {
            account.getAccount().then((res)=> {
                let {account,company,department,im,mobile,name} = res.data;
                vm.userInfo.account = account;
                vm.userInfo.userName = name;
                vm.userInfo.company = company;
                vm.userInfo.department = department;
                vm.userInfo.mobile = mobile;
                vm.userInfo.im = im;
            });
        }

        function showLabel() {
            switch ($stateParams.type) {
                case "userName":
                    this.isName = true;
                    this.title = "姓名";
                    break;
                case "company":
                    this.isCompany = true;
                    this.title = "单位";
                    break;
                case "email":
                    this.isEmail = true;
                    this.title = "邮箱";
                    break;
                case "mobile":
                    this.isMobile = true;
                    this.title = "手机";
                    break;
                case "password":
                    this.isPassword = true;
                    this.title = "密码";
                    break;
                case "department":
                    this.isDepartment = true;
                    this.title = "地址";
                    break;
                case "im":
                    this.isIm = true;
                    this.title = "专业"
                    break;
            }
        }

        function save() {
            $scope.$emit("event:" + $stateParams.type);
        }

        function verifyAndSave() {
            let reg, _value, _oldValue, _key = $stateParams.type, isVerify = false;
            switch ($stateParams.type) {
                case "userName":
                    _value = vm.userInfo.userName;
                    isVerify = true
                    break;
                case "company":
                    _value = vm.userInfo.company;
                    isVerify = true
                    break;
                case "email":
                    reg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
                    _value = vm.userInfo.email;
                    if (_value) {
                        if (!reg.test(_value)) {
                            Common.Alert("", "邮箱格式有误，请重新填写");
                        } else {
                            !vm.userInfo.confirmEmail ? Common.Alert("温馨提示", "请填写确认邮箱！")
                                : vm.userInfo.confirmEmail == _value
                                ? isVerify = true : Common.Alert("", "两次输入不一致");
                        }
                    }
                    break;
                case "mobile":
                    reg = new RegExp(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/);
                    _value = vm.userInfo.mobile;
                    reg.test(_value) ? isVerify = true : Common.Alert("", "手机号码格式有误，请重新填写");
                    break;
                case "password":
                    _oldValue = vm.userInfo.oldPassword;
                    _value = vm.userInfo.password;
                    if (_value) {
                        vm.userInfo.password == "" ? Common.Alert("", "请填写新密码")
                            : vm.userInfo.password == vm.userInfo.confirtPassword
                            ? isVerify = true : Common.Alert("", "两次输入不一致");
                    } else {
                        Common.Alert("", "请输入原密码");
                    }
                    break;
                case "department":
                    _value = vm.userInfo.department;
                    isVerify = true;
                    break;
                case "im":
                    _value = vm.userInfo.im;
                    isVerify = true;

                    break;
            }
            if (isVerify) {
                if (_key == "password") {
                    account.savePassword(_oldValue, _value).then(res=> {
                        if (res.data.result) {
                            $state.go("tabs.personal");
                        } else {
                            Common.Alert("", "原密码有误，请重新输入");
                        }
                    });
                } else {
                    account.saveUserInfo(_key, _value).then(res=> {
                        if (res.data.type == "success") {
                            $state.go("tabs.personal");
                        }
                    });
                }
            }
        }
    }
}

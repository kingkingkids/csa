/**
 * Created by dcampus on 2016/3/23.
 */
angular
    .module("editModule", [])
    .controller("editController", editController);

editController.$inject = ['request.account', "$stateParams"];

function editController(account, $stateParams) {
    account.getAccount().then((res)=> {
        let {account,company,department,email,mobile,name} = res.data;
        this.account = account;
        this.name = name;
        this.company = company;
        this.department = department;
        this.email = email;
        this.mobile = mobile;
    });
    let collect = {
        isName: false,
        isCompany: false,
        isEmail: false,
        isMobile: false,
        isPassword: false,
        isDepartment: false,
        title: "",
        showLabel: function () {
            switch ($stateParams.type) {
                case "name":
                    this.isName = true;
                    this.title = "姓名";
                    break;
                case "company":
                    this.isCompany = true;
                    this.title = "公司";
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
                    this.title = "部门";
                    break;
            }
        }
    }
    collect.showLabel();
    this.collect = collect;
}
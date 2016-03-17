/**
 * Created by dcampus2011 on 15/8/24.
 */
angular
    .module("global", [])
    .factory("global.currentInfo", currentInfo);

function currentInfo() {
    return {
        userName: ""
    };
}
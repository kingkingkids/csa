/**
 * Created by dcampus2011 on 15/8/24.
 */
angular.module("global", [])
    .factory("global.staticInfo", function () {
        return {
            sitePath: "http://localhost/csaProxy",
            journaryCategoryId: 371
        };
    })
    .factory("global.currentInfo", function () {
        return {
            userName: ""
        };
    }).factory("Common", function () {
    return {
        hello: function () {
            alert(13);
        }
    }
});
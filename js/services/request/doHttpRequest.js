/**
 * Created by dcampus2011 on 15/8/24.
 */
let group = require("./group.js")
    , resources = require("./resources.js")
    , fav = require("./fav.js")
    , account = require("./account");

angular
    .module("request.doHttpRequest", [])
    .factory("request.group", group)
    .factory("request.resources", resources)
    .factory("request.fav", fav)
    .factory("request.account", account);



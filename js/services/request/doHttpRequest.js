/**
 * Created by dcampus2011 on 15/8/24.
 */
{

    let group = require("./group.js")
        , resources = require("./resources.js")
        , fav = require("./fav.js")
        , account = require("./account")
        , message = require("./message")
        , search = require("./search")
        , sqlite = require("./sqlite");

    angular
        .module("request.doHttpRequest", [])
        .factory("request.group", group)
        .factory("request.resources", resources)
        .factory("request.fav", fav)
        .factory("request.account", account)
        .factory("request.message", message)
        .factory("request.search", search)
        .factory("request.sqlite", sqlite);
}


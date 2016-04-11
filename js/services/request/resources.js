resources.$inject = ["httpRequest.sendRequest", "global.constant", "$ionicModal"];

function resources(send, constant, $ionicModal) {
    return {
        getList: function (id, _limit, _start) {
            return send(constant.path.getResources, "type=all&limit=" + _limit + "&start=" + _start + "&parentId=" + id);
        },
        getView: function (id) {
            return send(constant.path.downloadResource + "?disposition=inline&id=" + id)
        },
        searchModal: function (scope) {
            return $ionicModal.fromTemplateUrl("./tpls/modal/search.html", {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false
            });
        },
        search: function (paramObj) {
            return send(constant.path.searchResources, paramObj);
        }
    }
}

module.exports = resources;

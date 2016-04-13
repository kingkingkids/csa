resources.$inject = ["httpRequest.sendRequest", "global.constant", "$ionicModal"];

function resources(send, constant, $ionicModal) {
    return {
        getList: function (id, _limit, _start) {
            return send(constant.path.getResources, "type=all&limit=" + _limit + "&start=" + _start + "&parentId=" + id);
        },
        getView: function (id) {
            return send(constant.path.downloadResource + "?disposition=inline&id=" + id)
        }
    }
}

module.exports = resources;

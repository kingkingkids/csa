resources.$inject = ["httpRequest.sendRequest", "global.constant"];

function resources(send, constant) {
    return {
        getList: function (id, _limit, _start) {
            return send(constant.path.getResources, "type=all&limit=" + _limit + "&start=" + _start + "&parentId=" + id);
        },
        getView: function (id) {
            return send(constant.path.downloadResource + "?disposition=inline&id=" + id);
        },
        getResourceInfo: function (id) {
            return send(constant.path.getResourceInfo, {resourceId: id});
        }
    }
}

module.exports = resources;

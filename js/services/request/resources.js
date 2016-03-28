resources.$inject = ["httpRequest.sendRequest", "global.constant"];

function resources(send, constant) {
    return {
        getList: function (id, _limit, _start) {
            return send(constant.path.getResources, "type=all&limit=" + _limit + "&start=" + _start + "&parentId=" + id);
        }
    }
}
module.exports = resources;
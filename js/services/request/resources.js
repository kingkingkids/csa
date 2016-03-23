resources.$inject = ["httpRequest.sendRequest", "global.constant"];

function resources(send, constant) {
    return {
        getList: function (id) {
            return send(constant.path.getResources, "type=all&limit=100&start=0&parentId=" + id);
        }
    }
}
module.exports = resources;
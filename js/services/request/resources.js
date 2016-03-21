resources.$inject = ["httpRequest.sendRequest", "$rootScope"];

function resources(send, scope) {
    return {
        getList: function (id) {
            return send(scope.path.getResources, "type=all&limit=100&start=0&parentId=" + id);
        }
    }
}
module.exports = resources;
group.$inject = ["httpRequest.sendRequest", "$rootScope"];
function group(send, scope) {
    return {
        getList: function (id) {
            return send(scope.path.trees, "containPersonGroup=false&containAblumCategory=false&categoryId=" + id);
        }
    }
}
module.exports = group;
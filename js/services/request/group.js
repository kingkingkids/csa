group.$inject = ["httpRequest.sendRequest", "global.constant"];
function group(send, constant) {
    return {
        getList: function (id) {
            return send(constant.path.trees, "containPersonGroup=false&containAblumCategory=false&categoryId=" + id);
        }
    }
}
module.exports = group;
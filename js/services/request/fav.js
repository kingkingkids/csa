fav.$inject = ["httpRequest.sendRequest", "$rootScope"];

function fav(send, scope) {
    return {
        /** 获取收藏列表**/
        getList: function () {
            return send(scope.path.getWatches, {"type": "resource"});
        },
        /**添加收藏**/
        addFav: function (id) {
            let paramsObj = {"type": "resource", "id": id};
            return send(scope.path.addWatch, paramsObj);
        }
    };
}
module.exports = fav;
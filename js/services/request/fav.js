fav.$inject = ["httpRequest.sendRequest", "global.constant"];

function fav(send, constant) {
    return {
        /** 获取收藏列表**/
        getList: function (_type) {
            if (_type == undefined) {
                _type = 1;
            }
            return send(constant.path.getWatches + '', {"type": "resource", resourceType: _type});
        },
        /**添加收藏**/
        addFav: function (id) {
            let paramsObj = {"type": "resource", "id": id};
            return send(constant.path.addWatch, paramsObj);
        },
        /**移除收藏**/
        removeFav: function (id) {
            return send(constant.path.deleteWatch, {id: id});
        }
    };
}

module.exports = fav;
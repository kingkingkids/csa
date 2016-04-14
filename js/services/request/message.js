message.$inject = ["httpRequest.sendRequest", "global.constant"];

function message(send, constant) {
    return {
        /** 获取消息列表**/
        getList: function (memberId, start, limit) {
            return send(constant.path.getMyReceiveResources, {
                "memberId": memberId,
                "start": start,
                "limit": limit
            });
        },

        removeMessage: function (id) {
            return send(constant.path.deleteReceivedResource, {id: id});
        }
    };
}

module.exports = message;

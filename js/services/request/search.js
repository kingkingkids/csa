search.$inject = ["httpRequest.sendRequest", "global.constant", "$ionicModal"];

function search(send, constant, $ionicModal) {
    return {
        searchModal: function (scope) {
            return $ionicModal.fromTemplateUrl("./tpls/modal/search.html", {
                scope: scope,
                animation: 'slide-in-up',
                hardwareBackButtonClose: false,
                focusFirstInput: true
            });
        },
        search: function (paramObj) {
            return send(constant.path.searchResources, paramObj);
        }
    };
}

module.exports = search;
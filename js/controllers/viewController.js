/**
 * Created by dcampus on 2016/3/23.
 */
angular
    .module("viewModule", [])
    .controller("viewController", viewController);

viewController.$inject = ["$scope", "httpRequest.sendRequest",
    "$sce", "global.constant", "$timeout", "$stateParams"];

function viewController($scope, sendRequest, $sce, constant, $timeout, $stateParams) {
    let collect = {
        title: "",
        frameSrc: "",
        defaultViewer: null,
        showZoom: false,
        zoomNum: 1,
        showFrame: false,
        title: $stateParams.title,
        init: function () {
            $timeout(()=> {
                sendRequest(constant.path.downloadResource + "?disposition=inline&id=" + $stateParams.id).then(res=> {
                    this.content = $sce.trustAsHtml(res.data);
                    $timeout(()=> {
                        try {
                            this.defaultViewer = new pdf2htmlEX({});
                        } catch (e) {
                        }
                        this.showZoom = true;
                    }, 1);

                    res.data = null;
                });
            }, 500);
        },
        hideModal: function () {
            this.content = "";
            this.defaultViewer = null;
            this.showZoom = false;
            this.frameSrc = "";
            $scope.modal.hide();
        },
        more: function () {


        },
        zoom: function (scale) {
            if (scale == 'big') {
                if (this.zoomNum > 2)
                    return;
                this.zoomNum = this.zoomNum + 1;
                this.defaultViewer.rescale(this.zoomNum);
            } else {
                if (this.zoomNum == 1)
                    return;
                this.zoomNum = this.zoomNum - 1;

                this.defaultViewer.rescale(this.zoomNum);
            }
        },
        back: function () {
            this.content = "";
            this.defaultViewer = null;
            this.showZoom = false;
            this.frameSrc = "";
            history.go(-1);
        }
    }
    collect.init();
    this.collect = collect;
}
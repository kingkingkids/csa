/**
 * Created by dcampus on 2016/4/1.
 */
{
    angular.module('directivesModule')
        .directive('onJournalRender', onJournalRender)
    onJournalRender.$inject = ["$state",
        "$stateParams", "$ionicPopup", "request.fav", "request.resources", "$ionicModal",
        "$sce", "global.constant", "$timeout", "global.Common"];
    function onJournalRender($timeout, $q) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {
                if (scope.$index == 0) {
                    element.prepend('<div class="bookBg">');
                }
                if (scope.$index % 3 == 2) {
                    element.after('</div><div class="bookBg">');
                }
                if (scope.$last) {
                    element.after("</div>");
                }
            }
        }
    }
}
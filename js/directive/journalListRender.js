/**
 * Created by dcampus on 2016/4/1.
 */
{
    angular.module('directivesModule')
        .directive('onJournalRender', onJournalRender)
    function onJournalRender() {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element) {
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
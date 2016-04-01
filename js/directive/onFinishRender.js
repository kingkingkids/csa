/**
 * Created by dcampus on 2016/3/31.
 */
{
    angular
        .module('directivesModule', [])
        .directive('onFinishRender', function ($timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit('ngRepeatFinished');
                        });
                    }
                }
            }
        });
}

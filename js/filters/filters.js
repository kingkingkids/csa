/**
 * Created by dcampus on 2016/4/12.
 */
angular
    .module("filterModule", [])
    .filter('displayNameFilter', displayNameFilter);
function displayNameFilter() {
    return function (item) {
        item = item.replace(/(?:(?:&nbsp;))|(?:(?:&amp;nbsp;))/gm, ' ');
        return item;
    }
}
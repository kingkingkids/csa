/**
 * Created by dcampus on 2016/4/12.
 */
angular
    .module("filterModule", [])
    .filter('displayNameFilter', displayNameFilter)
    .filter('barTitleFilter', barTitleFilter)
    .filter('searchArticleFilter', searchArticleFilter);
function displayNameFilter() {
    return function (item) {
        if (item == undefined)
            return;
        item = item.replace(/(?:(?:(?:(?:\.mp4))|(?:(?:\.html))|(?:(?:&nbsp;))|(?:(?:&amp;nbsp;))))/gm, ' ');
        return item;
    }
}
function barTitleFilter() {
    return function (item) {
        if (item == undefined)
            return;
        let ellips = '';
        if (item.length > 15)
            ellips = '...';
        item = item.substring(0, 15) + ellips;
        return item;
    }
}

function searchArticleFilter() {
    return function (item,id) {
        //resources.getResourceInfo()
        return item;
    }
}
/**
 * Created by ASUS on 2016/1/22.
 */
require("../lib/ionic/css/ionic.css");
//require("../node_modules/ngprogress/ngProgress.css");
//require("../css/iconfont.css");


require("../lib/ionic/js/ionic.bundle.js");
require("../node_modules/swiper/dist/css/swiper.min.css");
require("../css/animate.css");
require("../css/style.css");

require("./app.js");
require("./services/global.js");
require("./services/httpRequest.js");
//require("./services/appInterceptor.js");
require("./services/request/doHttpRequest.js");
require("./controllers/loginController.js");
require("./controllers/personalController.js");//个人设置
require("./controllers/mainController.js");//tab主控制器
require("./controllers/homeController.js");//首页控制器
require("./controllers/groupListController.js");//柜子列表控制器
require("./controllers/resourceListController.js");//资源列表控制器
require("./controllers/booksListController.js");//资源列表控制器
require("./controllers/favController.js");//资源列表控制器
require("./controllers/editController.js");//资源列表控制器
require("./filters/filters.js");//资源列表控制器
//require("./controllers/viewController.js");
require("./controllers/infoController.js");
require("./directive/directives.js");
require("./directive/viewPdf.js");
require("./directive/journalListRender.js");
require("./controllers/pdfViewController.js")
//require("../node_modules/ngprogress/build/ngProgress.js");










/**
 * Created by My on 2017/5/18.
 */
/**
 * 应用层入口
 * v0.4、增加参数定制弹框的大小位置
 * v0.5 定义参数接口json格式
 */


require.config({
    paths: {
        "jquery": 'jquery-1.8.3',
        "window": "window"
    }
});

//这样就有了依赖关系回调函数参数（$,w）依赖前面的jQuery和window
require(['jquery', 'window'], function ($, w) {
    $("#a").click(function () {
       /* this.cfg = {
            width: 500,
            height: 300,
            content: "",
            handler: null
    }*/
        //依照window中cfg参数对象的字典格式进行传参数
        new w.Window().alert({
            content:"welcome!",
            handler: function () {
                alert("you click!")
            },
            width: 300,
            height: 150,
            y: 50//top 距离顶部50px
        })
    })
});


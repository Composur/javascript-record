/**
 * Created by My on 2017/5/18.
 */
/**
 * 应用层入口
 * 1、增加参数定制弹框的大小位置
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
        //  alert:function (content,handler,cfg)
        new w.Window().alert("welcome!", function () {
            alert("you click!")
        }, {
            width: 300,
            height: 150,
            y: 50//top 距离顶部50px
        })
    })
});


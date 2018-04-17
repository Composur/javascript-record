/**
 * Created by My on 2017/5/18.
 */
/**
 * 应用层入口
 */


require.config({
    paths:{
        "jquery":'jquery-1.8.3',
        "window":"window"
    }
});

//这样就有了依赖关系回调函数参数（$,w）依赖前面的jQuery和window
require(['jquery','window'],function ($,w) {
    $("#a").click(function () {
        new w.Window().alert("welcome!")
    })
});


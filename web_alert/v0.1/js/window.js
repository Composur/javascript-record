/**
 * Created by My on 2017/5/18.
 */

/**
 * 弹窗
* */
define(function () {
    //define一个window模块
    function Window() {
        
    }

    //设计了几个接口
    Window.prototype={
        alert:function () {

        },
        confirm:function () {

        },
        prompt:function () {
            
        }
    };
    //最后把Window类暴露出来
    return {
        Window:Window
    }

});
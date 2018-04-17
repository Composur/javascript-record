/**
 * Created by My on 2017/5/18.
 */

/**
 * 弹窗
* */
define(["jquery"],function () {
    //define一个window模块
    function Window() {
        
    }

    //设计了几个接口
    Window.prototype={
        //接受了一个参数通过jQuery创建了一个div
        alert:function (content,handler) {
            // console.log("fe");
            var boundingBox=$('<div class="window_boundBoxing"></div>');
            //添加到body上去
            boundingBox.appendTo("body");
            //设置的内容就来自于alert接受的参数
            boundingBox.html(content);
            var btn=$("<input type='button' value='确定'>");
            btn.appendTo(boundingBox);
            btn.click(function () {
                //如果传入了第二个参数那就执行handler()
                handler&&handler();
                boundingBox.remove();
            })
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

/**
 * Created by My on 2017/5/18.
 */

/**
 * 弹窗
 * v0.4 定制宽高
* */
define(["jquery"],function () {
    //define一个window模块
    function Window() {
        this.cfg={
            width:500,
            height:300
        }
    }

    //设计了几个接口
    Window.prototype={
        //接受了一个参数通过jQuery创建了一个div
        alert:function (content,handler,cfg) {
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
            });
            //接收第三个参数进行处理，合并传入的cfg和默认的this.cfg
            $.extend(this.cfg,cfg);
            boundingBox.css({
                width:this.cfg.width+"px",
                height:this.cfg.height+"px",
                //innerWidth是元素的content大小
                left:(this.cfg.x||(window.innerWidth-this.cfg.width)/2+"px"),
                top:(this.cfg.y||(window.innerHeight-this.cfg.height)/2+"px")
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

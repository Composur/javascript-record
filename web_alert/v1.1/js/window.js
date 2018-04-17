/**
 * Created by My on 2017/5/18.
 */

/**
 * 弹窗
 * v0.4 定制宽高
 * v0.5 定制接口把alert的参数content和handler定义到Window构造函数 有了默认值可以不传参
 * v0.6 添加tittle属性值在window构造函数中
 * v0.7 添加关闭按钮 添加事件监听（handler的点击事件）
 * v0.8 添加一套皮肤 window_skin_a
 * v1.0 定制按钮的text
 * v1.1 模态弹窗
 * */
define(["jquery"], function () {
    //define一个window模块
    function Window() {
        //默认参数
        this.cfg = {
            width: 500,
            height: 300,
            content: "",
            title: "系统消息",
            hasCloseBtn: false,
            handler4AlertBtn: null,
            handler4CloseBtn: null,
            skinClassName:null,
            /*定制按钮的text*/
            text4AlertBtn:null,
            /*模态弹窗*/
            hasMask:null

        }
    }

    //设计了几个接口
    Window.prototype = {
        //接受了一个参数通过jQuery创建了一个div
        alert: function (cfg) {
            var CFG = $.extend(this.cfg, cfg);
            var boundingBox = $('<div class="window_boundBoxing">' +
                '<div class="window_header">' + CFG.title + '</div>' +
                '<div class="window_body">' + CFG.content + '</div>' +
                '<div class="window_footer"><input type="button" value='+CFG.text4AlertBtn+' class="window_alertBtn"></div>' +
                '</div>');
            var btn = boundingBox.find(".window_alertBtn");
            var mask=null;
            if(CFG.hasMask){
                mask=$('<div class="window_mask"></div>');
                mask.appendTo('body');
            }
            boundingBox.appendTo("body");
            btn.click(function () {
                //如果传入了第二个参数那就执行handler()
                CFG.handler4AlertBtn && CFG.handler4AlertBtn();
                boundingBox.remove();
                mask&&mask.remove();
            });
            //接收第三个参数进行处理，合并传入的cfg和默认的this.cfg
            boundingBox.css({
                width: CFG.width + "px",
                height: CFG.height + "px",
                //innerWidth是元素的content大小
                left: (CFG.x || (window.innerWidth - CFG.width) / 2 + "px"),
                top: (CFG.y || (window.innerHeight - CFG.height) / 2 + "px")
            });
            if (CFG.hasCloseBtn) {
                var closeBtn = $("<span class='window_closeBtn'>X</span>");
                closeBtn.appendTo(boundingBox);
                closeBtn.click(function () {
                    CFG.handler4CloseBtn && CFG.handler4CloseBtn();
                    boundingBox.remove();
                    mask&&mask.remove();
                });
            }
            if(CFG.skinClassName){
                boundingBox.addClass(CFG.skinClassName);
            }

        },
        confirm: function () {

        },
        prompt: function () {

        }
    };
    //最后把Window类暴露出来
    return {
        Window: Window
    }

});

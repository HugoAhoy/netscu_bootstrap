$.fn.extend({
   animateCss: function (animationName) {
   var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
   this.addClass('animated ' + animationName).one(animationEnd, function() {
          $(this).removeClass('animated ' + animationName);
     });
   }
 });


/**
 * 显示模态框方法
 * @param targetModel 模态框选择器，jquery选择器
 * @param animateName 弹出动作
 * @ callback 回调方法
 */
modalShow = function(){
    console.log("modalshow")
    var targetModel = "#bigModal";
    var animateName = "fadeInUp";
    console.log(targetModel + " " + animateName);
    $(targetModel).show().animateCss(animateName);
    //callback.apply(this);
}
/**
 * 隐藏模态框方法
 * @param targetModel 模态框选择器，jquery选择器
 * @param animateName 隐藏动作
 * @ callback 回调方法
 */
var modalHide = function(targetModel, animateName){
    // var animationOut = ["bounceOut","bounceOutDown","bounceOutLeft","bounceOutRight","bounceOutUp",
    //     "fadeOut", "fadeOutDown", "fadeOutLeft", "fadeOutRight", "fadeOutUp",
    //      "fadeOutDownBig", "fadeOutLeftBig", "fadeOutRightBig", "fadeOutUpBig","flipOutX","flipOutY",
    // "lightSpeedOut","rotateOut","rotateOutDownLeft","rotateOutDownRight","rotateOutUpLeft","rotateOutUpRight",
    //     "zoomOut","zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp",
    //     "zoomOut","zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp","slideOutDown","slideOutLeft",
    //     "slideOutRight", "slideOutUp","rollOut"];
    if(!animateName || animationOut.indexOf(animateName)==-1){
        // console.log(animationOut.length);
        // var intRandom =  Math.floor(Math.random()*animationOut.length);
        // animateName = animationOut[intRandom];
        animateName = "fadeOutDown";
    }
    $(targetModel).children().click(function (e) {
        e.stopPropagation()
    });
    $(targetModel).animateCss(animateName);
    $(targetModel).delay(900).hide(1,function(){
        $(this).removeClass('animated ' + animateName);
    });
    //callback.apply(this);
}
var modalDataInit = function(info){
    //alert(info);
    //填充数据，对弹出模态框数据样式初始化或修改
}

$(function(){

navbar_height=parseInt($('.navbar').height());
toolbar_height=parseInt($('.toolbar').height());
w_height=parseInt($(window).height());
$('.jinsom-topic-show-form').height(w_height-(navbar_height+toolbar_height));


//论坛大厅 tab点击	
$('.jinsom-bbs-tab-post-header>li').click(function(event){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children().eq($(this).index()).show().siblings().hide();
});


//首页sns点击切换
$('.jinsom-home-sns-subnavbar .jinsom-home-menu li').click(function(event){
if($(this).index()==0){
$('.jinsom-mobile-home-sns-top').show();
}else{
$('.jinsom-mobile-home-sns-top').hide();	
}
});


//话题中心切换
$(document).on('click','.jinsom-topic-show-form .left>li',function(){
$(this).parent().next().animate({scrollTop: 0 },0);
$(this).addClass('on').siblings().removeClass('on').parent().next().children().eq($(this).index()).show().siblings().hide();
});

//与我相关-消除红点
$("body").on("click",'.jinsom-chat .jinsom-chat-user-list li,.jinsom-notice-tips-content .jinsom-chat-user-list li', function(e){
$(this).find('.item-media').find('span').remove();
});

//全站滚动事件
if($('.jinsom-right-bar').length>0){
$('.page-content').scroll(function(){
$('.jinsom-right-bar').addClass('right-bar-hidden');
clearTimeout($.data(this,'scrollTimer'));
$.data(this,'scrollTimer',setTimeout(function(){
$('.jinsom-right-bar').removeClass('right-bar-hidden');
},800));
});
}


//点击底部tab返回顶部
$(document).on('click','.tabbar a.active',function(){
// console.log('aaa');
if($('.view.active .page-content').scrollTop()>100){
$('.view.active .page-content').animate({scrollTop:0},200);	
if($('.jinsom-home-menu li.on').length>0){
if($('.jinsom-home-menu li.on').attr('waterfall')!=1){
type=$('.jinsom-home-menu li.on').attr('type');
jinsom_post(type,'pull','.jinsom-home-menu li.on');
}
}

jinsom_index_notice_js_load();

}
}); 


//点击隐藏图片
$(document).on('click','.jinsom-post-images-list a.blur',function(){
console.log(1);
$(this).parents('.jinsom-post-images-list').prev().children('.jinsom-btn').click();
});


//自动滑动菜单
$(document).on('click','.jinsom-home-menu li,.jinsom-member-menu li,.jinsom-topic-menu li,.jinsom-bbs-menu li,.jinsom-bbs-tab-post-header>li',function(){
menu_width=0;
for(var i=0;i<$(this).index();i++){
menu_width+=$(this).parent().children('li').eq(i).outerWidth(true);
}
$(this).parent().animate({
scrollLeft:menu_width-$(window).width()/2+$(this).outerWidth()
});
});





});
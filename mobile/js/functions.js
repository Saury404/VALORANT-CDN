function jinsom_msg(content){
layer.open({content:content,skin:'msg',time:2});
}

//置顶内容：全局置顶==板块置顶==主页置顶==推荐==加精
function jinsom_sticky(post_id,bbs_id,type,obj){
layer.closeAll();
layer.open({
content: '你确定要'+$(obj).children('p').html()+'吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/commend-post.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1||msg.code==2){
$(obj).html(msg.html);
}else if(msg.code==3){//打开开通会员页面
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
}
}
});
layer.close(index);
}
});
}



//删除动态内容
function jinsom_delete_post(post_id,obj,type){
layer.closeAll();
layer.open({
content: '你要删除这个内容吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/delete/post.php",
data: {post_id:post_id,type:'post'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
if(type=='single'){
history.back(-1);
}
$('.jinsom-post-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});

}
}
});

layer.close(index);
}
});
}

//刷新内容时间
function jinsom_reload_post(post_id){
layer.closeAll();
layer.open({
content: '你确定要刷新该内容吗？<br><font style="color: #f44336;">刷新之后，内容的时间变更为当前的时间</font>'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/reload-post.php",
data: {post_id:post_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
}
});
layer.close(index);
}
});
}


//采纳答案
function jinsom_answer_adopt(obj,post_id){
this_dom=$(obj);
comment_id=$(obj).attr('data');
layer.open({
content: '你要采纳这个答案吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/answer.php",
data: {comment_id:comment_id,post_id:post_id,type:'adopt'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function a(){layer.closeAll();}setTimeout(a,2000); 
this_dom.parent().siblings('.content').prepend('<i class="jinsom-icon jinsom-yicaina"></i>');
$('.jinsom-single-comment-list-'+post_id+' .footer span.answer').remove();
// $('.jinsom-bbs-single-footer .add').remove();
$('.jinsom-post-'+post_id+' h1 .jinsom-bbs-post-type-answer').addClass('ok').html('');
}	
}
});
}
});
}

//删除帖子内容
function jinsom_delete_bbs_post(post_id,bbs_id,obj,type){
layer.closeAll();
layer.open({
content: '你要删除这个内容吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/delete/post.php",
data: {post_id:post_id,bbs_id:bbs_id,type:'bbs'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
if(type=='single'){
history.back(-1);	
}
$('.jinsom-post-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});

}
}
});

layer.close(index);
}
});
}

//删除动态评论
function jinsom_delete_post_comments(comment_id,obj){//我的评论页面
layer.open({
content: '你确定要删除该评论？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:  jinsom.jinsom_ajax_url+"/delete/comment.php",
data: {comment_id:comment_id,type:'post'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){//成功
comment_dom=$(obj).parent('.footer');
comment_dom.siblings('.jinsom-comment-image-list').remove();
comment_dom.siblings('.content').html(msg.delete_content);
$(obj).remove();
}
}
});
}
}); 
}

//删除一级/二级回帖
function jinsom_delete_bbs_post_comments(comment_id,bbs_id,type,obj){
layer.open({
content: '你确定要删除该评论？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:  jinsom.jinsom_ajax_url+"/delete/comment.php",
data: {comment_id:comment_id,type:type,bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).parents('.jinsom-comment-'+comment_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function() {
$(this).remove();
});
});
}
}
});
}
}); 
}



//喜欢内容
function jinsom_like(post_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

like_num=$('.jinsom-post-'+post_id+' .footer .like_num');
like_dom=$('.jinsom-post-'+post_id).children('.footer').find('i.like');
user_id=jinsom.user_id;
avatar=jinsom.avatar;

if($(obj).children('i').hasClass('had')){
like_num.html(parseInt(like_num.html())-1); 
like_dom.removeClass('jinsom-xihuan1 had').addClass('jinsom-xihuan2');   
$('.jinsom-post-'+post_id+' .footer').next('.jinsom-post-like').children('#had_like_'+user_id).remove();

}else{
audio=document.getElementById('jinsom-like-up-music');
audio.play();
like_num.html(parseInt(like_num.html())+1); 
like_dom.removeClass('jinsom-xihuan2').addClass('jinsom-xihuan1 had');   
$('.jinsom-post-'+post_id+' .footer').next('.jinsom-post-like').prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+'</a>');  
layer.open({content:'喜欢成功！',skin:'msg',time:2});
}

$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},
success: function(msg){
if(msg.author_id){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"like_post","notice_user_id":"'+msg.author_id+'","do_user_id":"'+jinsom.user_id+'"}');

}
}
}); 

}


function jinsom_select_like(post_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

like_num=$(obj).children('span');
if($(obj).children('i').hasClass('had')){
like_num.text(parseInt(like_num.text())-1); 
$(obj).children('i').removeClass('jinsom-xihuan1 had').addClass('jinsom-xihuan2'); 
}else{
like_num.text(parseInt(like_num.text())+1); 
$(obj).children('i').removeClass('jinsom-xihuan2').addClass('jinsom-xihuan1 had');
}

$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},
success: function(msg){
if(msg.author_id){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"like_post","notice_user_id":"'+msg.author_id+'"}');

}
}
});

}




//打开@链接
function jinsom_post_link(obj){
type=$(obj).attr('type');
if(type=='at'){
user_id=$(obj).attr('user_id');
if(user_id==jinsom.user_id){
myApp.getCurrentView().router.loadPage(jinsom.theme_url+'/mobile/templates/page/member-mine.php?author_id='+user_id);
}else{
myApp.getCurrentView().router.loadPage(jinsom.theme_url+'/mobile/templates/page/member-other.php?author_id='+user_id);    
}
}else if(type=='link'){
window.open($(obj).attr('data'));  
}
}


//喜欢音乐
function jinsom_like_music(obj){
post_id=$('.jinsom-player-footer-btn .play').attr('post_id');

like_num=$('.jinsom-post-'+post_id+' .footer .like_num');
like_dom=$('.jinsom-post-'+post_id).children('.footer').find('i.like');
user_id=jinsom.user_id;
avatar=jinsom.avatar;

if($(obj).hasClass('jinsom-xihuan2')){
$(obj).removeClass('jinsom-xihuan2').addClass('jinsom-xihuan1');

like_num.html(parseInt(like_num.html())+1); 
like_dom.removeClass('jinsom-xihuan2').addClass('jinsom-xihuan1 had');   
$('.jinsom-post-'+post_id+' .footer').next().prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+'</a>'); 
layer.open({content:'喜欢成功！',skin:'msg',time:2});
}else{
$(obj).removeClass('jinsom-xihuan1').addClass('jinsom-xihuan2');    

like_num.html(parseInt(like_num.html())-1); 
like_dom.removeClass('jinsom-xihuan1 had').addClass('jinsom-xihuan2');   
$('.jinsom-post-'+post_id+' .footer').next().children('#had_like_'+user_id).remove();
}

$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/like-post.php",
type:'POST',   
data:{post_id:post_id},    
success:function(results){}   
});
}



//签到
function jinsom_sign(obj,ticket,randstr){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/sign.php",
data: {sign:1,ticket:ticket,randstr:randstr},
dataType:'json',
success: function(msg){ 
myApp.hideIndicator();
if(msg.code==0){//签到失败
layer.open({content:msg.msg,skin:'msg',time:2});
}else if(msg.code==1||msg.code==2){//已经签到|签到成功
audio=document.getElementById('jinsom-sign-music');
audio.play();
layer.open({
content:'<div class="jinsom-sign-success-form">'+msg.content+'</div>'
});

$(obj).addClass('had').html(msg.text_mobile);
$(obj).parent().prev().find('span').html(msg.sign_c);
month_day=parseInt($('.jinsom-sign-page-month-days span').text());
$('.jinsom-sign-page-month-days span').html(month_day+1);
$('.jinsom-mine-page .list-block li.sign .item-after').html('累计'+msg.sign_c+'天');
$('.jinsom-sign-page-content tbody td.today').removeClass('no-sign').addClass('had-sign').children('span').append('<i class="jinsom-icon jinsom-dagou"></i>');
$('#sign-1').after($('#sign-1').clone());
$('.jinsom-sign-header .right .btn.had').first().remove();
}else if(msg.code==8){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==9){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
});
}


//补签表单
function jinsom_sign_add_form(day){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/sign-add.php",
data:{day:day},
success: function(msg){
myApp.hideIndicator();
layer.open({
content:'<div class="jinsom-sign-add-form">'+msg+'</div>'
});
}
});
}

//补签
function jinsom_sign_add(day){
if(!jinsom.is_login){
layer.closeAll();
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/sign-add.php",
data:{day:day},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({
content:'<div class="jinsom-sign-success-form">'+msg.content+'</div>'
});

//前端渲染
$('.jinsom-sign-header .left p:first-child span').text(msg.sign_c);
$('.jinsom-mine-page .list-block li.sign .item-after').html('累计'+msg.sign_c+'天');
$('.jinsom-sign-page-all-days span').html(msg.sign_c);
month_day=parseInt($('.jinsom-sign-page-month-days span').text());
$('.jinsom-sign-page-month-days span').html(month_day+1);
$('#jinsom-sign-day-'+day).removeClass('no-sign').addClass('had-sign').children('span').html(day+'<i class="jinsom-icon jinsom-dagou"></i>');

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});
}


//查看签到宝箱
function jinsom_sign_treasure_form(number){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/sign-treasure.php",
data:{number:number},
success: function(msg){
myApp.hideIndicator();
layer.open({
content:'<div class="jinsom-sign-treasure-form">'+msg+'</div>'
});
}
});	
}


//领取宝箱奖励
function jinsom_sign_treasure(number,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/sign-treasure.php",
data:{number:number},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
audio=document.getElementById('jinsom-sign-music');
audio.play();
layer.open({
content:'<div class="jinsom-sign-success-form">'+msg.content+'</div>'
});

//前端渲染
$(obj).addClass('had').html('已领取').removeAttr('onclick');
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});
}








//关注
function jinsom_follow(author_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/follow.php",
data: {author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
follow_dom=$('.jinsom-follow-'+author_id);
if(msg.code==1){//取消关注
follow_dom.removeClass('had');  
follow_dom.html('<i class="jinsom-icon jinsom-guanzhu"></i>关注');

}else if(msg.code==2||msg.code==3){
if(msg.code==2){//关注成功
audio=document.getElementById('jinsom-follow-music');
audio.play();
follow_dom.addClass('had');
follow_dom.html('<i class="jinsom-icon jinsom-yiguanzhu"></i>已关');

if($(obj).hasClass('follow-see')){
function d(){window.open($(obj).attr('data'),'_self');}setTimeout(d,1000);
}
}
if(msg.code==3){//相互关注成功
audio=document.getElementById('jinsom-follow-music');
audio.play();
follow_dom.addClass('had');
follow_dom.html('<i class="jinsom-icon jinsom-xianghuguanzhu"></i>互关');    
}

if(msg.author_id){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"follow","notice_user_id":"'+msg.author_id+'"}');

}

}

}
}); 
}



//动态播放视频
function jinsom_play_video(post_id,video_url,obj){
post_id=parseInt(Math.random() * (999999 - 9999 + 1) + 9999);
$(obj).before('<div id="jinsom-video-'+post_id+'" post_id="'+post_id+'"></div>');
$(obj).remove();
video_type=jinsom_video_type(video_url);
window['video_'+post_id]=new window[video_type]({
id:'jinsom-video-'+post_id,
url:video_url,
'x5-video-player-type': 'h5',
'x5-video-player-fullscreen': false,
playbackRate: [0.5,1,1.5,2,6],
fitVideoSize:'fixWidth',
playsinline: true,
autoplay:true,
ignores: ['volume','pc'],
closeVideoTouch: true,
rotate:{
innerRotate: true, //只旋转内部video
clockwise: false // 旋转方向是否为顺时针
}
});
window['video_'+post_id].on('play',function(){
if($('.jinsom-video-playing').length>0){
current_post_id=$('.jinsom-video-playing').attr('post_id');
window['video_'+current_post_id].pause();
}

$('#jinsom-video-'+post_id).addClass('jinsom-video-playing');
})
window['video_'+post_id].on('pause',function(){
$('#jinsom-video-'+post_id).removeClass('jinsom-video-playing');
})
}

//获取视频播放类型
function jinsom_video_type(video_url){
var index1=video_url.lastIndexOf(".");
var index2=video_url.length;
var type=video_url.substring(index1,index2);
if(type=='.m3u8'){
return 'HlsJsPlayer';
}else if(type=='.flv'){
return 'FlvJsPlayer';
}else{
return 'Player';	
}
}




//拉黑
function jinsom_add_blacklist(type,author_id,obj){
layer.closeAll();
if(type=='add'){
title='你要将对方加入黑名单吗？';	
}else{
title='你要将对方移出黑名单吗？';		
}
layer.open({
content:title
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/add-blacklist.php",
data: {author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).html('拉黑').attr('onclick','jinsom_add_blacklist("add",'+author_id+',this)');	
}else if(msg.code==2){
$(obj).html('取消拉黑').attr('onclick','jinsom_add_blacklist("remove",'+author_id+',this)');	
}
}
});
}
});

}


//最近消息标为已读
function jinsom_chat_set_hadread(author_id,obj){
$(obj).parent().prev().find('.tips').remove();
jinsom_update_notice_tips();//同步消息数
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/read-msg.php",
type:'POST',   
data:{author_id:author_id},    
});
}

//最近消息 删除
function jinsom_recently_list_del(chat_id,chat_type){
$.ajax({   
url:jinsom.jinsom_ajax_url+"/chat/chat-recently-delete.php",
type:'POST',   
data:{chat_id:chat_id,chat_type:chat_type},    
});
}


//查看密码动态
function jinsom_post_password(post_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.prompt('请输入查看密码', 
function (password){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/password-post.php",
data: {post_id:post_id,password:password},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function d(){window.open(msg.url,'_self');}setTimeout(d,1500);
}
}
});
}
);
}


//购买付费内容
function jinsom_buy_post_form(post_id){
if(!jinsom.is_login){
myApp.closeModal();
jinsom_login_page();  
return false;
}
myApp.closeModal();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/post-buy.php?post_id='+post_id});
}


//查看全文
function jinsom_moren_content(obj){
if($(obj).prev().hasClass('hidden')){
$(obj).prev().removeClass('hidden');
$(obj).html("收起内容");
}else{
$(obj).prev().addClass('hidden');
$(obj).html("查看全文");
}
}


//购买付费内容
function jinsom_pay_for_visible(post_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/pay-for-visible.php",
dataType:'json',
data: {post_id:post_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).removeAttr('onclick');
function a(){history.back(-1);}setTimeout(a,1000);

ws.send('{"from_url":"'+jinsom.home_url+'","type":"buy","notice_user_id":"'+msg.author_id+'","do_user_id":"'+jinsom.user_id+'"}');

myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/post/hidden-content.php",
dataType:'json',
data: {post_id:post_id,type:'pay'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
if(msg.video_url){//视频
$('.jinsom-post-'+post_id+' .jinsom-video-tips').after('<div onclick=\'jinsom_play_video("'+post_id+'-single","'+msg.video_url+'",this)\' class="jinsom-video-img" style="background-image: url('+msg.video_cover+');"><i class="jinsom-icon jinsom-bofang-"></i></div>');
$('.jinsom-post-'+post_id+' .jinsom-video-tips').remove();
}else{//动态、文章、帖子
if(msg.hidden){
$('.jinsom-tips-'+post_id).after('<div class="jinsom-hide-content"><p>'+msg.hidden+'</p></div>');
}
$('.jinsom-tips-'+post_id).remove();
if(msg.img){
$('.jinsom-post-'+post_id+' .jinsom-post-images-list').html(msg.img);
}
if(msg.dowmload){ //下载
$('.jinsom-bbs-download-box-'+post_id+' .tips').remove();
$('.jinsom-bbs-download-box-'+post_id).html(msg.dowmload);
}
}

// 当前活动页面重载
// function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,500);
}
}
});


}else if(msg.code==3){//弹出金币充值窗口
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});
}else if(msg.code==8){//弹出余额充值窗口
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-money.php'});
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
});    
}

//关注论坛
function jinsom_bbs_like(bbs_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/bbs-like.php",
data: {bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){//关注成功
audio=document.getElementById('jinsom-follow-music');
audio.play();
$(obj).removeClass('no').addClass('had');
$(obj).html('<i class="jinsom-icon jinsom-yiguanzhu"></i> 已关');  


if($('.jinsom-bbs-like-content.publish').length>0){//如果在发表界面

html='<li id="jinsom-bbs-like-'+bbs_id+'">\
<div class="item-content">\
<div class="item-media">\
<a href=\'javascript:jinsom_publish_power("bbs",'+bbs_id+',"")\' class="link">\
'+msg.bbs_avatar+'\
</a>\
</div>\
<div class="item-inner">\
<div class="item-title">\
<a href=\'javascript:jinsom_publish_power("bbs",'+bbs_id+',"")\' class="link">\
<div class="name">'+msg.bbs_name+'</div>\
<div class="desc">'+msg.bbs_desc+'</div>\
</a>\
</div></div></div>\
</li>';

if($('.jinsom-bbs-like-content.publish .jinsom-empty-page').length>0){
$('.jinsom-bbs-like-content.publish').html('<div class="jinsom-chat-user-list bbs-commend list-block">'+html+'</div>');
}else{
$('.jinsom-bbs-like-content.publish .jinsom-chat-user-list').prepend(html);
}
}//如果在发表界面

//消息界面实时添加
$('#jinsom-chat-tab-group .jinsom-chat-user-list').prepend('<li class="swipeout chat jinsom-chat-group-'+bbs_id+'" id="jinsom-chat-group-'+bbs_id+'">\
<div class="swipeout-content item-content" onclick="jinsom_open_group_chat('+bbs_id+')">\
<div class="item-media">'+msg.bbs_avatar+'</div>\
<div class="item-inner">\
<div class="item-title">\
<div class="name">'+msg.im_name+'</div>\
<div class="desc">'+msg.im_notice+'</div>\
</div>\
</div>\
</div>\
<div class="swipeout-actions-right"><a href="#" class="swipeout-delete">取消关注</a></div>\
</li>');

}else{//取消关注
$(obj).removeClass('had').addClass('no');  
$(obj).html('<i class="jinsom-icon jinsom-guanzhu"></i> 关注');  

$('#jinsom-bbs-like-'+bbs_id).remove();//移除我关注的论坛
$('.jinsom-chat-group-'+bbs_id).remove();//移除消息里面我关注的论坛

}
}
}); 
}


//打赏
function jinsom_reward(post_id,type,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
number=$(obj).attr('data');
myApp.showIndicator();
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/reward.php",
type:'POST',   
data:{number:number,post_id:post_id,type:type},    
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){


ws.send('{"from_url":"'+jinsom.home_url+'","type":"reward","notice_user_id":"'+msg.author_id+'","do_user_id":"'+jinsom.user_id+'"}');


function d(){history.back(-1);}setTimeout(d,1000);	
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,1600);



// myApp.getCurrentView().router.back();

// comment_num=$('.jinsom-post-'+post_id+' .footer .comment_number');
// comment_num.html(parseInt(comment_num.html())+1); 
// $('.jinsom-post-'+post_id).next('.jinsom-single-comment').children('.header').find('span').html(parseInt(comment_num.html()));
// $('.jinsom-post-'+post_id).parent().prev().find('.number').html(parseInt(comment_num.html())+'条评论');
// comment_list=$('.jinsom-single-comment-list-'+post_id);
// comment_list.prepend('\
// <div class="jinsom-comment-'+msg.id+'">\
// <div class="up" onclick="jinsom_comment_up('+msg.id+',this)"><i class="fa fa-thumbs-o-up"></i><m>0</m></div>\
// <div class="header clear">\
// <div class="avatarimg">'+jinsom.avatar+jinsom.verify+'</div>\
// <div class="info">\
// <div class="name">'+jinsom.nickname+jinsom.lv+jinsom.vip+'</div>\
// <div class="from"><span class="time">刚刚</span><span>手机端</span></div>\
// </div>\
// </div>\
// <div class="content"><m class="reward"><span class="jinsom-redbag-icon"></span>打赏了'+number+jinsom.credit_name+'。</m></div>\
// <div class="footer clear">\
// <span class="comment">\
// <a href="'+jinsom.theme_url+'/mobile/templates/page/comment.php?post_id='+post_id+'&name='+jinsom.nickname_base+'" class="link">回复</a>\
// </span>\
// </div>\
// </div>\
// ');



}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
});
}



//提交卡密兑换
function jinsom_keypay(){
key=$('#jinsom-pop-key').val();
if(key==''){
layer.open({content:'请输入卡密！',skin:'msg',time:2});
return false;	
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/key-use.php",
data:{key:key},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#jinsom-pop-key').val('');
myApp.getCurrentView().router.back();
if(msg.type=='credit'){
current_credit=parseInt($('.jinsom-mywallet-header .number span').html());
recharge_credit=parseInt(msg.number);
$('.jinsom-mywallet-header .number span').html(current_credit+recharge_credit);
}
}
}
});	
}



//大转盘
function jinsom_lottery(obj){
if($(obj).hasClass('on')){
return false;
}

number=$('#jinsom-lottery-money').val();
if(number==''){
layer.open({content:'请输入下注金额！',skin:'msg',time:2});
return false;	
}
$(obj).addClass('on').html('抽奖中...');

//点击抽奖，然后ajax后台获取json数据，返回来抽奖的角度。
$.ajax({   
url:jinsom.mobile_ajax_url+"/action/lottery.php",
dataType:'json',
type:'POST',   
data:{number:number},    
success:function(msg){

if(msg.code==0){
$(obj).removeClass('on').html('开始翻倍');
layer.open({content:msg.msg,skin:'msg',time:2});	
}else{

$('.jinsom-lottery-arrow').rotate({
duration:5000,//转动时间
angle: 0,//起始角度
animateTo:1440+msg.rand,//结束的角度
callback: function(){
$(obj).removeClass('on').html('开始翻倍');
layer.open({content:msg.msg,skin:'msg',time:2});//简单的弹出获奖信息

lottery_times=parseInt($('.jinsom-lottery-info .times span').html());
$('.jinsom-lottery-info .times span').html(lottery_times-1);

count_money=parseInt($('.jinsom-lottery-info .credit span').html());
$('.jinsom-lottery-info .credit span,.jinsom-mywallet-header .number span,.jinsom-mine-list-credit').html(count_money+msg.count-number);


}
});
}


}   
});


}

//====================================设置类===================

//上传头像菜单
function jinsom_upload_avatar_menu(obj,user_id){
var buttons1 = [{text: '查看头像',onClick:function(){

avatar_url=$(obj).find('img').attr('src');
show_avatar = myApp.photoBrowser({
photos : [avatar_url],
toolbar:false,
exposition:false,
swipeToClose:false,
});
show_avatar.open();	
}},
{text: '上传头像',onClick:function(){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/upload-avatar.php?user_id='+user_id});
}}];
var buttons2 = [{text: '取消',color:'red'}
];
var groups = [buttons1, buttons2];
myApp.actions(groups);
}





//查看二维码
function jinsom_show_user_code(user_id){
url=jinsom.member_url_permalink+jinsom.referral_link_name+'='+user_id;
html='<div class="popup jinsom-publish-type-form profile-qrcode"><div class="page-content"><div id="jinsom-qrcode"></div><p class="tips">扫码加关注我</p><div class="close"><a href="#" class="link icon-only close-popup"><i class="jinsom-icon jinsom-xiangxia2"></i></a></div>';
myApp.popup(html);
jinsom_qrcode('jinsom-qrcode',200,200,url);
}

//修改昵称
function jinsom_update_nickname_form(author_id,obj){
myApp.prompt('', function (value) {
myApp.showIndicator();
$.ajax({
type:"POST",
url:jinsom.jinsom_ajax_url+"/update/nickname.php",
data:{nickname:value,author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).find('.value').html(msg.nickname);

if(msg.self){//管理团队修改自己资料或者普通用户修改自己资料
if($('.jinsom-mine-page .list-block li .item-title .name font').length>0){
$('.jinsom-mine-page .list-block li .item-title .name font').html(msg.nickname);	
}else{
$('.jinsom-mine-page .list-block li .item-title .name').html(msg.nickname);	
}
}

}
}
});	
});
$('.modal-text-input').val($(obj).find('.value').html()).focus();
}

//修改靓号
function jinsom_update_liang_form(author_id,obj){
myApp.prompt('', function (value) {
myApp.showIndicator();
$.ajax({
type:"POST",
url:jinsom.jinsom_ajax_url+"/update/liang.php",
data:{liang:value,author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).find('.value m').html(msg.liang);

if(msg.self){//管理团队修改自己资料或者普通用户修改自己资料

}

}else if(msg.code==2){
$('.jinsom-setting-box li.liang').remove();
}
}
});	
});
$('.modal-text-input').val($(obj).find('.value m').html()).focus();
}


//修改资料==管理员
//update_type=='admin' 管理员修改
function jinsom_update_profile(author_id,type,obj,update_type){
if(update_type=='admin'){
url='profile-admin.php';
}else{
url='profile.php';
}
myApp.prompt('', function (value) {
myApp.showIndicator();
$.ajax({
type:"POST",
url:jinsom.mobile_ajax_url+"/setting/"+url,
data:{value:value,author_id:author_id,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).find('.value').html(value);
}
}
});	
});
$('.modal-text-input').val($(obj).find('.value').html()).focus();	
}

//修改个人说明
function jinsom_update_desc(author_id){
description=$('#jinsom-setting-desc').val();
myApp.showIndicator();
$.ajax({
type:"POST",
url:jinsom.jinsom_ajax_url+"/update/profile.php",
data:{author_id:author_id,description:description,mobile:1},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('.jinsom-setting-box li.desc .value').html(description);
history.back(-1);//返回上一页
}
}
});	
}




//搜索
function jinsom_search(keyword){
search_loading = false;
search_page=2;
keyword=$.trim(keyword);
if(keyword==''){
layer.open({content:'请输入搜索关键词！',skin:'msg',time:2});	
return false;
}
type=$('.jinsom-search-post-list').attr('type');
$('.jinsom-search-tab').show();
$('.jinsom-search-content').addClass('result');
$('.jinsom-search-hot,.jinsom-pop-search-bbs,.jinsom-pop-search-topic,.jinsom-search-custom-html').remove();
$('#jinsom-search').val(keyword);
jinsom_search_js(keyword,type);
}

//搜索
function jinsom_search_post(type,obj){
search_loading = false;
search_page=2;
$(obj).addClass('on').siblings().removeClass('on');
keyword=$.trim($('#jinsom-search').val());
if(keyword==''){
layer.open({content:'请输入搜索关键词！',skin:'msg',time:2});	
return false;
}
$('.page-content').animate({ scrollTop: 0 },0);
list.attr('type',type);

jinsom_search_js(keyword,type);
}


function jinsom_search_js(keyword,type){
data_=$('.jinsom-search-tab li.on').attr('data');
list=$('.jinsom-search-post-list');
list.prepend(jinsom.loading_post);
$.ajax({
type:"POST",
url:jinsom.mobile_ajax_url+"/post/search.php",
data:{keyword:keyword,type:type,page:1,data_:data_},
success: function(msg){
if(msg!=0){
list.html(msg);
}else{
list.html('<div class="jinsom-empty-page">没有更多内容</div>');	
}
}
});	


//加载更多
search_loading = false;
search_page=2;
search_post_list=$('.jinsom-search-post-list');
$('.jinsom-search-content.infinite-scroll').on('infinite',function(){
search_type=$('.jinsom-search-tab li.on').attr('type');
if(!search_type){search_type='all';}
if(search_type=='user'||search_type=='forum'||search_type=='topic') return;
if (search_loading) return;
search_loading = true;
search_post_list.after(jinsom.loading_post);
keyword=$.trim($('#jinsom-search').val());
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/post/search.php",
data: {keyword:keyword,type:search_type,page:search_page,data_:data_},
success: function(msg){
if(msg!=0){
search_post_list.append(msg);
search_loading = false; 
search_page++;
}else{
search_loading = true; 
}
$('.jinsom-load-post').remove();
}
});


});


}


//关注话题
function jinsom_topic_like(topic_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
n=parseInt($(".jinsom-topic-page-header .info .number span:nth-child(2) i").html());
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/topic-like.php",
data: {topic_id:topic_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
audio=document.getElementById('jinsom-follow-music');
audio.play();
$(obj).addClass("had").html('<i class="jinsom-icon jinsom-yiguanzhu"></i> 已 关');
n++;	
}else if(msg.code==2){
$(obj).removeClass("had").html('<i class="jinsom-icon jinsom-guanzhu"></i> 关 注');
n--;	
}
$(".jinsom-topic-page-header .info .number span:nth-child(2) i").text(n); 
}
});

}


//打开赠送礼物页面
function jinsom_send_gift_page(author_id,post_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/send-gift.php?author_id='+author_id+'&post_id='+post_id});
}


//送礼物
function jinsom_send_gift(author_id,post_id){
if($('.jinsom-send-gift-form li.on').length==0){
layer.open({content:'请选择需要赠送的礼物！',skin:'msg',time:2});	
return false;
}
name=$('.jinsom-send-gift-form li.on .top .name').text();

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/send-gift.php",
data: {name:name,author_id:author_id,post_id:post_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"gift","notice_user_id":"'+author_id+'","notice_user_name":"'+msg.notice_user_name+'","do_user_id":"'+jinsom.user_id+'","do_user_name":"'+msg.do_user_name+'","do_user_avatar":"'+msg.do_user_avatar+'","content":"'+msg.content+'","message":"'+msg.gift_name+'"}');

if(post_id){
function d(){history.back(-1);}setTimeout(d,1000);	
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,1600);
}else{
function c(){history.back(-1);}setTimeout(c,2000);
}
}
}
});
}

//投票
function jinsom_bbs_vote(post_id){
i=0;
data = [];
$(".jinsom-bbs-vote-form input").each(function(){
if($(this).is(':checked')){
data.push(i+1);	
}
i++;
});

if(data.length>0){
data_arr = data.join(",");
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/vote.php",
data: {post_id:post_id,vote:data_arr},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
myApp.getCurrentView().router.refreshPage();
//function d(){window.location.reload();}setTimeout(d,1500);	
}

}
});
}else{ //判断是否选择了投票选项
layer.open({content:'请至少选择一项进行投票！',skin:'msg',time:2});
}
}


//清除未读消息===
function jinsom_clear_notice(){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/notice-clear.php",
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});	
if(msg.code==1){
$('.jinsom-chat .tips,.toolbar .tips,.jinsom-mine-box li.notice .tips').remove();
}
}
});
}

//提交选择头衔
function jinsom_use_honor(user_id){
dom=$('.jinsom-user_honor-select-form .list li.on');
if(dom.length==0){
layer.open({content:'请选择要使用的头衔！',skin:'msg',time:2});	
return false;
}
honor=dom.text();
myApp.showIndicator();
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/use-honor.php",
type:'POST', 
data:{user_id:user_id,honor:honor},
success:function(msg){
myApp.hideIndicator();
if(msg.code==1){
$('.jinsom-setting-box li.honor .value').text(msg.honor);
function d(){window.location.reload();}setTimeout(d,1500);
layer.open({content:msg.msg,skin:'msg',time:2});	
}else{
layer.open({content:msg.msg,skin:'msg',time:2});	
}
}   
});
}


//每日领取成长值
function jinsom_get_vip_number(obj){
myApp.showIndicator();
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/get-vip-number.php",
type:'POST', 
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).addClass('had').html('今日已领取成长值');
}else if(msg.code==2){
$(obj).addClass('had').html('今日已领取成长值');	
old_number=parseInt($('.jinsom-vip-page-header-card .info span m').text());
new_number=parseInt(msg.number)+old_number;
$('.jinsom-vip-page-header-card .info span m').text(new_number);
}
}   
});

}


//报名
function jinsom_activity(post_id){
if($(".jinsom-activity-form-list li").children('.item').val()==''){
layer.open({content:'内容不能为空！',skin:'msg',time:2});
return false;	
}
// if($(".jinsom-activity-form-list li").children('.upload').val()==''){
// layer.open({content:'请上传内容！',skin:'msg',time:2});
// return false;	
// }

data='<div class="jinsom-bbs-comment-activity">';
$(".jinsom-activity-form-list li").each(function(){
data+='<li>';
data+='<label>'+$(this).children('label').html()+'</label>';
value=$(this).children('.item').val();
if($(this).children('.item').hasClass('upload')){
data+='<div class="content"><a href="'+value+'" target="_blank" download="" class="jinsom-post-link"><i class="fa fa-link"></i> 附件下载</a></div>';
}else{
data+='<div class="content">'+value+'</div>';	
}
data+='</li>';
});
data+='</div>';

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/activity.php",
data: {content:data,post_id:post_id},
success: function(msg){	
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
myApp.getCurrentView().router.back();
// myApp.getCurrentView().router.refreshPage();
$('.jinsom-post-'+post_id+' .jinsom-bbs-activity-btn').addClass('no').removeAttr('onClick').html('你已经参与');
}else if(msg.code==2){//没有绑定手机号
function d(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});}setTimeout(d,2000);
}
}
});

}


//获取文件后缀
function jinsom_get_file_type(filename){
var index1=filename.lastIndexOf(".");
var index2=filename.length;
var type=filename.substring(index1,index2);
return type;
}


//内容更多操作
function jinsom_post_more_form(post_id,bbs_id,type){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/stencil/post-more.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){	
myApp.hideIndicator();
layer.open({
type: 1,
content:msg,
anim: 'up',
style:'position:fixed;bottom:2vw;left:2vw;width:96vw;border:none;box-sizing:border-box;border-radius:2vw;padding:2vw;'
});	

//复制侧栏分享链接
var clipboard = new ClipboardJS('#jinsom-copy-share-link');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});

}
});
}


//切换排行榜数据
function jinsom_leaderboard_data(post_id,obj){
$(obj).addClass('on').siblings().removeClass('on');
$('.jinsom-leaderboard-content').prepend(jinsom.loading_post);
$('.jinsom-leaderboard-page-content').animate({scrollTop: 0 },0);
number=$(obj).index();
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/stencil/leaderboard.php",
data: {post_id:post_id,number:number},
success: function(msg){	
audio=document.getElementById('jinsom-reload-music');
audio.play();
$('.jinsom-leaderboard-content').html(msg);
}
});
}

//快捷回复
function jinsom_quick_reply(a,obj){
content=$(obj).parent().next().children('textarea');
content.val(content.val()+a);
}

//快捷插入表情
function jinsom_add_smile(a,type,obj){//普通
if(type=='im-one'){//单聊
content=$('#jinsom-msg-content');
}else if(type=='im-group'){//群聊
content=$('#jinsom-msg-group-content');
}else{
content=$('.jinsom-smile-textarea');	
}
content.val(content.val()+a);
layer.closeAll();
}

//保释黑名单用户
function jinsom_blacklist_bail(author_id,credit,obj){
layer.open({
content: '你确定要花费'+credit+'保释吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/blacklist-bail.php",
data:{author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).parents('li').remove();
}
}
}); 
layer.close(index);
}
});	
}

//幸运抽奖
function jinsom_luck_start(post_id,text,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
$(obj).text('抽奖中...');
$.ajax({
type: "POST",
dataType:'json',
url:jinsom.jinsom_ajax_url+"/action/luck-draw.php",
data:{post_id:post_id},
success: function(msg){
layer.open({content:msg.msg,skin:'msg',time:2});
$(obj).text('开始抽奖 ('+text+')');
if(msg.code==1){

if(msg.author_id){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"luck_draw","notice_user_id":"'+msg.author_id+'","do_user_id":"'+msg.author_id+'","content":"'+msg.content+'"}');

}

$('.jinsom-luck-draw-current-credit .credit span').html(msg.credit);
$('.jinsom-luck-draw-current-credit .ticket span').html(msg.ticket);
if($('.jinsom-luck-draw-list .a .jinsom-empty-page').length>0){
$('.jinsom-luck-draw-list .a').empty();
}
$('.jinsom-luck-draw-list .a').prepend("<li><span class='img' style='background-image:url("+msg.cover+")'></span><span class='name'>"+msg.name+"</span></li>");
$('.jinsom-luck-draw-cover .img').css('background-image','url('+msg.cover+')');
$('.jinsom-luck-draw-cover .img .name').html(msg.name);
}else if(msg.code==5){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-money.php'});//余额不足弹窗
}else if(msg.code==6){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});//金币不足弹窗
}
}
});
}


//提现
function jinsom_cash(cash_type){
number=$('#jinsom-cash-number').val();
type=$('.jinsom-cash-form-content .type m.on').attr('type');
name=$('#jinsom-cash-name').val();
alipay=$('#jinsom-cash-alipay-phone').val();
wechat=$('#jinsom-cash-wechat-phone').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/cash.php",
data:{number:number,type:type,name:name,alipay:alipay,wechat:wechat,cash_type:cash_type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('.jinsom-cash-form-content').html('<div class="jinsom-cash-form-end"><i class="jinsom-icon jinsom-zhifuchenggong"></i><p>已提交申请，等待审核中</p></div>');
}
}
});
}

//打开转发页面
function jinsom_reprint_form(post_id){
layer.closeAll();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/reprint.php?post_id='+post_id});
}

//转发
function jinsom_reprint(post_id){
content = $('#jinsom-reprint-value').val();
comment_a=$('#jinsom-reprint-check-a').is(':checked');
comment_b=$('#jinsom-reprint-check-b').is(':checked');
if($('#jinsom-reprint-check-b').length>0){
type='b';
}else{
type='a';
}

if(content==''){content='转发了';}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/reprint.php",
data: {content:content,post_id:post_id,comment_a:comment_a,comment_b:comment_b,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,2000);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}
}
});

}


//抢红包
function jinsom_get_redbag(post_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/get-redbag.php?post_id='+post_id});
$('.jinsom-redbag-'+post_id).find('.tips').addClass('no').text('已打开');
}


//切换马甲
function jinsom_exchange_majia(majia_user_id){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/majia.php",
data:{majia_user_id:majia_user_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
}

//领取任务奖励
function jinsom_task_finish(task_id,type,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/task.php",
data:{task_id:task_id,type:type},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
audio=document.getElementById('jinsom-sign-music');
audio.play();
$(obj).addClass('had').removeClass('on').text('已领取');
$('.jinsom-task-form-header .header .number n').text(msg.task);
$('.jinsom-mine-page .list-block li.task .item-after n').text(msg.task);
}

}
});
}

//打开宝箱
function jinsom_task_treasure_form(task_id){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/task-treasure.php?task_id='+task_id});	
}

//打开宝箱任务
function jinsom_task_treasure(task_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/task-treasure.php",
data:{task_id:task_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
audio=document.getElementById('jinsom-sign-music');
audio.play();
$(obj).addClass('had').text('已领取');
}
}
});
}


//访问密码论坛，输入密码
function jinsom_bbs_visit_password(bbs_id){
pass=$('#jinsom-bbs-visit-psssword').val();
if(pass==''){
layer.open({content:'请输入访问密码！',skin:'msg',time:2});
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.module_url+"/action/bbs-visit-password.php",
data: {bbs_id:bbs_id,pass:pass,visit:1},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({content:msg.msg,skin:'msg',time:2});
function d(){window.location.reload();}setTimeout(d,2000);
}else if(msg.code==3){
jinsom_login_page(); 
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});
}

//更换语言
function jinsom_change_language(obj,type){
$(obj).addClass('on').siblings().removeClass('on');
SetCookie('lang',type);
window.location.reload();
}


//付费访问论坛
function jinsom_bbs_visit_pay(bbs_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
layer.open({
content: '你确定要支付吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/bbs-visit-pay.php",
data:{bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==3){
function c(){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});
}
setTimeout(c,1500);
}else if(msg.code==5){
function c(){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-money.php'});
}
setTimeout(c,1500);
}
}
});
}
});
}


//生成二维码
function jinsom_qrcode(dom,width,height,link){
$('#'+dom).qrcode({
width:width,
height:height,
text:link
});
}

//打开海报页面
function jinsom_content_playbill_page(post_id,url){
layer.closeAll();
myApp.getCurrentView().router.load({
url:jinsom.theme_url+'/mobile/templates/page/playbill-content.php?post_id='+post_id,
query:{url:url}
});	
}

//打开推广海报页面
function jinsom_referral_playbill_page(url){
layer.closeAll();
myApp.getCurrentView().router.load({
url:jinsom.theme_url+'/mobile/templates/page/playbill-referral.php',
query:{url:url}
});	
}

//直播评论互动
function jinsom_comment_live(post_id){
content=$.trim($('#jinsom-live-comment-content').val());
myApp.showIndicator();
$.ajax({
type:"POST",
dataType:'json',
url:jinsom.jinsom_ajax_url+"/action/comment-live.php",
data: {content:content,post_id:post_id},
success: function(msg) {
myApp.hideIndicator();
if(msg.code==1){//成功
$('#jinsom-live-comment-content').val('');
comment_html='\
<li>\
<div class="left">'+msg.avatar+'</div>\
<div class="right">\
<div class="name">'+msg.nickname+'</div>\
<div class="content">'+msg.content+'</div>\
</div>\
</li>\
';
if($('.jinsom-live-page-nav-list ul.comment-list .jinsom-empty-page').length>0){
$('.jinsom-live-page-nav-list ul.comment-list').html(comment_html);
}else{
$('.jinsom-live-page-nav-list ul.comment-list').append(comment_html);
}
$('.jinsom-live-page-nav-list').scrollTop($('.jinsom-live-page-nav-list')[0].scrollHeight);//互动评论向下啦
count=parseInt($('.jinsom-live-content').attr('count'));
$('.jinsom-live-content').attr('count',count+1);


}else if(msg.code==2){//没有绑定手机号
layer.open({content:msg.msg,skin:'msg',time:2});
function d(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});}setTimeout(d,2000);
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
},
});
}


//直播精彩视频切换
function jinsom_live_jingcai_video_play(url,obj){
$(obj).addClass('on').siblings().removeClass('on');
if($('.jinsom-no-video-live').length>0){
$('.jinsom-no-video-live').before('<div id="jinsom-video-live"></div>');
$('.jinsom-no-video-live').remove();
}
$('#jinsom-video-live').empty();
video_type=jinsom_video_type(url);
new window[video_type]({
id: 'jinsom-video-live',
url: url,
autoplay: true,
playsinline: true,
'x5-video-player-type': 'h5',
'x5-video-player-fullscreen': false,
});
}



//打赏界面
function jinsom_reward_form(post_id,type){
jinsom_page('reward.php?post_id='+post_id+'&type='+type,1,'page');
}


//生成推广地址
function jinsom_referral_url(obj){
$(obj).append('<i class="fa fa-spinner fa-spin"></i>');
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/referral-url.php",
success: function(msg){
myApp.hideIndicator();
$(obj).children('i').remove();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('.jinsom-referral-url').show();
$('#jinsom-referral-url-cover').html(msg.url);
// $(obj).remove();
}
}
});
}


//首页sns模块
function jinsom_index_sns_js_load(){
jinsom_lightbox();//图片灯箱

//首页下拉刷新
var ptrContent = $('.jinsom-sns-page-content.pull-to-refresh-content');
ptrContent.on('refresh', function (e) {
myApp.pullToRefreshDone();
// $('.jinsom-home-menu li.on').click();
type=$('.jinsom-home-menu li.on').attr('type');
if(!type){
type='all';
}
jinsom_post(type,'pull','.jinsom-home-menu li.on');
if($('[id^=jinsom-view-notice]').length>0&&jinsom.is_login){
jinsom_index_notice_js_load();//加载消息页面
}

if($('.jinsom-mine-box li.notice').length>0&&$('.toolbar .notice').length==0){//如果我的里面开启了消息、并且tab没有开启消息
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/notice-all.php",
type:'POST',    
success:function(msg){
if($.trim(msg)){
$('.jinsom-mine-box li.notice i,.navbar i.tips').html('<m class="badge bg-red tips">'+msg+'</m>');
$('.toolbar .mine m').remove();
$('.toolbar .mine').prepend('<m class="badge bg-red tips">'+msg+'</m>');	
$('.navbar .notice-tips').html(msg);
}
}
});	
}


});



//首页加载更多内容
sns_loading = false;
sns_page = 2;
index_post_list=$('.jinsom-post-list');
$('.jinsom-sns-page-content.infinite-scroll').on('infinite',function(){
if(sns_loading) return;
sns_loading = true;
index_post_list.after(jinsom.loading_post);
type=$('.jinsom-home-menu li.on').attr('type');
data=$('.jinsom-home-menu li.on').attr('data');
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/post/data.php",
data: {page:sns_page,type:type,load_type:'more',data:data,index:$('.jinsom-home-menu li.on').index()},
success: function(msg){
$('.jinsom-load-post').remove();
if(msg==0){
sns_loading = true; 
}else{

index_post_list.append(msg);


jinsom_lightbox()
sns_page++;
sns_loading = false;  

if($('.jinsom-home-menu li.on').attr('waterfall')==1){//瀑布流渲染
var grid=$('.jinsom-post-list-sns').masonry({
itemSelector:'li',
gutter:0,
transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});
}


} 
}
});
}); 
}

//消息页面js加载
function jinsom_index_notice_js_load(){
$.ajax({   
url:jinsom.mobile_ajax_url+"/stencil/notice-page.php",
type:'POST',    
success:function(msg){
$('.jinsom-chat').html(msg);

jinsom_update_notice_tips();//同步消息数

$('.jinsom-chat-notice li').click(function(event){//消除红点
$(this).children('.tips').remove();
jinsom_update_notice_tips();//同步消息数
});

}
});
}

//我的页面js加载
function jinsom_index_mine_js_load(){
$.ajax({   
url:jinsom.mobile_ajax_url+"/stencil/mine-page.php",
type:'POST',    
success:function(msg){
$('.jinsom-mine-page').html(msg);

if($('.jinsom-mine-box li.notice').length>0&&$('.toolbar .notice').length==0){
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/notice-all.php",
type:'POST',    
success:function(msg){
if($.trim(msg)){
$('.jinsom-mine-box li.notice i').html('<span class="badge bg-red tips">'+msg+'</span>');	
$('.toolbar .mine m').remove();
$('.toolbar .mine').prepend('<m class="badge bg-red tips">'+msg+'</m>');	
}
}
});	
}

if($('.jinsom-mine-box li.notice').length>0&&$('.toolbar .notice').length>0&&$('.toolbar .notice m').length>0){
count_tips=parseInt($('.toolbar .notice m').text());
$('.jinsom-mine-box li.notice i').html('<span class="badge bg-red tips">'+count_tips+'</span>');	
$('.toolbar .mine m').remove();
$('.toolbar .mine').prepend('<m class="badge bg-red tips">'+count_tips+'</m>');		
}

}
});
}

//内容管理页面js加载
function jinsom_content_manage_js_load(type){
$('#jinsom-manage-tab-'+type).prepend(jinsom.loading_post);
$.ajax({
url:jinsom.mobile_ajax_url+"/stencil/content-manage.php",
type:'POST',
data: {type:type,page:1},
success:function(msg){
if(msg==0){
$('#jinsom-manage-tab-'+type).html('<div class="jinsom-empty-page">没有更多内容</div>');
}else{
$('#jinsom-manage-tab-'+type).html(msg);
}
}
});
}

//通过审核
function jinsom_content_management_agree(post_id,obj){
layer.open({
content: '你要通过该内容吗?',
btn: ['确定', '取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'agree'},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
$(obj).parent().html('<m style="color:#5fb878">已通过</m>');
}
}
});
}
});
}

//驳回内容
//where: 无效
function jinsom_content_management_refuse(post_id,bbs_id,where,obj){
layer.closeAll();
myApp.prompt('请输入驳回的原因', function (reason) {
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,bbs_id:bbs_id,type:'refuse',reason:reason,where:1},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
if(where=='single'){
history.back(-1);
}else{
$(obj).parent().html('<m style="color:#f00">已驳回</m>');
}
$('.jinsom-post-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});
}
}
});
});
}

//取消审核
function jinsom_content_management_pending_refuse(post_id,obj){
layer.open({
content: '取消的内容将显示在驳回列表，你确定吗?',
btn: ['确定', '取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'pending_refuse'},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
$(obj).parent().html('<m style="color:#f00">已取消</m>');
}
}
});
}
});
}

//查看驳回原因
function jinsom_content_management_reason_form(post_id){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'read_reason'},
success: function(msg){
myApp.hideIndicator();
myApp.alert(msg);
}
});
}


//视频专题后加载js
function jinsom_index_video_special_js_load(obj){
var video_loading = false;
var video_page = 2;
$(obj+' .infinite-scroll').on('infinite',function(){
if (video_loading) return;
video_loading = true;

video_list=$(obj+' .jinsom-video-special-list');
number=video_list.attr('number');
video_list.after(jinsom.loading_post);
topic=$('.jinsom-video-special-menu li.on').attr('data');

if(video_list.hasClass('waterfall')){
waterfall=1;
}else{
waterfall=0
}

$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/post/video-special.php",
data: {topic:topic,page:video_page,number:number,type:'more',waterfall:waterfall},
success: function(msg){
if(msg==0){ 
video_list.append('<div class="jinsom-empty-page">没有更多内容</div>'); 
video_loading = true; 
}else{
video_list.append(msg);
video_page++;
video_loading = false;  

if(video_list.hasClass('waterfall')){//瀑布流渲染
var grid=$('.jinsom-video-special-list').masonry({
itemSelector:'.waterfall',
gutter:0,
transitionDuration:0
});
grid.masonry('reloadItems'); 
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
}); 
}

}
$('.jinsom-load-post').remove();
}
});

}); 
}



//点击广告
function jinsom_click_ad(){
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/click-ad.php",
});	
}

//出售宠物
function jinsom_pet_sell(id,number,obj,ticket,randstr){
myApp.showIndicator();
$.ajax({   
url:jinsom.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{id:id,type:'sell',ticket:ticket,randstr:randstr},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
//$(obj).after('<div class="jinsom-pet-nest-btn" onclick="jinsom_pet_store('+number+')">'+msg.text+'</div>').remove();
$(obj).remove();
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).find('a').attr('href','javascript:jinsom_pet_store('+number+')');
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).find('.pet_img').remove();
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).find('.green').text(msg.text);
$('.jinsom-pet-nest-list.single .pet_img').remove();
$('.navbar-on-center .center').text('');
function d(){history.back(-1);}setTimeout(d,1200);
}

}
});
}

//偷宠物
function jinsom_pet_steal(id,number,obj,ticket,randstr){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({   
url:jinsom.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{id:id,type:'steal',ticket:ticket,randstr:randstr},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
$(obj).remove();
$('.jinsom-pet-content.other .jinsom-pet-nest-list li').eq(number).find('.pet_img').remove();
$('.jinsom-pet-content.other .jinsom-pet-nest-list li').eq(number).find('.green').text(msg.text);
$('.jinsom-pet-content.other .jinsom-pet-nest-list li').eq(number).children('a').removeAttr('href');
$('.jinsom-pet-nest-list.single .pet_img').remove();
$('.jinsom-pet-nest-list.single li .nest p').text(msg.text).addClass('green');
// function d(){history.back(-1);}setTimeout(d,1500);
}

}
});
}



//购买窝、解锁窝
function jinsom_pet_buy_nest(number,obj){
myApp.showIndicator();
$.ajax({   
url:jinsom.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{number:number,type:'deblocking'},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).after('<div class="jinsom-pet-nest-btn" onclick="jinsom_pet_store('+number+')">'+msg.text+'</div>').remove();
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).removeClass('gray');
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).find('.no').text(msg.text).addClass('green');
$('.jinsom-pet-nest-list.single li').removeClass('gray');
}

}
});
}

//购买宠物蛋
function jinsom_pet_buy(number,iiii){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({   
url:jinsom.mobile_ajax_url+"/action/pet.php",
type:'POST',    
data:{number:number,iiii:iiii,type:'buy'},
success:function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
// $('.jinsom-pet-nest-btn').remove();
// $('.jinsom-pet-nest-list.single li .animal').html('<img class="egg_img" src="'+msg.img_egg+'">');
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).find('.animal').html('<img class="egg_img" src="'+msg.img_egg+'">');
// $('.jinsom-pet-nest-list.single li .nest').append('<p>'+msg.text+' '+msg.hatch_time+'</p>');
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).find('.green').text(msg.text+' '+msg.hatch_time).removeClass('green');
$('.jinsom-pet-content.mine .jinsom-pet-nest-list li').eq(number).find('a').attr('href','');
// $('.navbar-on-center').prev().children('.center').text(msg.pet_name);
history.back(-1);
// function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,700);
}

}
});	
}

//打开商店界面
function jinsom_pet_store(number){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/pet-store.php?number='+number});	
}



//收藏内容
function jinsom_collect(post_id,type,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
if(type=='img'){
url=$(obj).parent().siblings('.fancybox-stage').find('img').attr('src');
}else{
url='';	
}


$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/collect.php",
type:'POST',   
data:{post_id:post_id,type:type,url:url},  
success:function(msg){
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==2){//取消收藏
$('.collect-post-'+post_id).children('i').addClass('jinsom-shoucang1').removeClass('jinsom-shoucang');
$('.collect-post-'+post_id).children('p').text(msg.text);
if($(obj).hasClass('fancybox-button')){
$(obj).children('i').addClass('jinsom-shoucang1').removeClass('jinsom-shoucang');
}
}else if(msg.code==1){//收藏
$('.collect-post-'+post_id).children('i').addClass('jinsom-shoucang').removeClass('jinsom-shoucang1');
$('.collect-post-'+post_id).children('p').text(msg.text);
if($(obj).hasClass('fancybox-button')){
$(obj).children('i').addClass('jinsom-shoucang').removeClass('jinsom-shoucang1');
}
}


}
}); 
}


//图片灯箱
function jinsom_lightbox(){
$("[data-fancybox]").fancybox({
// loop : true,
arrows : false,
protect:false,
buttons : ['collect','download','thumbs','close'],
btnTpl: {
collect:
'<a  onclick=\'jinsom_collect("","img",this)\' class="fancybox-button fancybox-button--collect" href="javascript:;"><i class="jinsom-icon jinsom-shoucang1"></i></a>'
},
mobile:{
clickSlide: function(current, event){
return "close";
},
clickContent: function(current, event){
return "close";
},
},
hash:false,
afterShow: function(instance,current){
window.history.pushState(null,null,window.location.href+'#'+Math.random().toString(36).substr(2,5));
// console.log($.fancybox.getInstance().current.src);

$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/collect-is.php",
type:'POST',   
data:{url:$.fancybox.getInstance().current.src}, 
success:function(msg){ 
if(msg.code==1){
$('.fancybox-button--collect i').addClass('jinsom-shoucang').removeClass('jinsom-shoucang1');
}else{
$('.fancybox-button--collect i').addClass('jinsom-shoucang1').removeClass('jinsom-shoucang');	
}
} 
}); 


},
});	
}


//评论置顶
function jinsom_up_comment(comment_id,bbs_id,obj){
title=$(obj).text();
layer.open({
content: '你确定要'+title+'吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
dataType:'json',
url:  jinsom.jinsom_ajax_url+"/action/up-comment.php",
data: {comment_id:comment_id,bbs_id:bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
$(obj).text(msg.name);
if(msg.code==1){//成功
$(obj).parents('.jinsom-single-comment-list').find('.up-comment').remove();	
$(obj).parents('.jinsom-comment-li').find('.time').before('<span class="up-comment">'+title+'</span>');
$(obj).parents('.jinsom-single-comment-list').prepend($(obj).parents('.jinsom-comment-li'));
$(obj).parents('.jinsom-comment-li').siblings().find('.comment-up').text(title);
}
}
});
}
}); 
}


//表情
function jinsom_smile_form(obj){
layer.open({
type: 1,
content: $(obj).next().html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;height:50vh;border:none;'
});	
$('.jinsom-smile-form .header li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children('ul').eq($(this).index()).show().siblings().hide();
});
}



//排序
function jinsom_sort(){
sort_type=GetCookie('sort');
if(!sort_type){
sort_type=jinsom.sort;
}
buttons=[
{text:'最新发布',onClick:function(){SetCookie('sort','normal');$('.jinsom-home-menu li.on').click();}},
{text:'最新回复',onClick:function(){SetCookie('sort','comment');$('.jinsom-home-menu li.on').click();}},
{text:'随机内容',onClick:function(){SetCookie('sort','rand');$('.jinsom-home-menu li.on').click();}},
{text:'本月热门',onClick:function(){SetCookie('sort','comment_count_month');$('.jinsom-home-menu li.on').click();}},
{text:'所有热门',onClick:function(){SetCookie('sort','comment_count');$('.jinsom-home-menu li.on').click();}},
{text:'取消',color: 'red'},
];
if(sort_type=='comment'){
buttons[1]['bold']=true;	
}else if(sort_type=='rand'){
buttons[2]['bold']=true;	
}else if(sort_type=='comment_count_month'){
buttons[3]['bold']=true;	
}else if(sort_type=='comment_count'){
buttons[4]['bold']=true;	
}else{
buttons[0]['bold']=true;
}
myApp.actions(buttons);
}

//评论排序
function jinsom_comment_sort(type){
if(type=='bbs'){
cookie_name='comment_sort_bbs';
}else{
cookie_name='comment_sort';	
}

sort_type=GetCookie(cookie_name);
if(!sort_type){
if(type=='bbs'){
sort_type='ASC';
}else{
sort_type='DESC';//倒序
}
}

buttons=[
{text:'正序（旧 -> 新）',onClick:function(){
SetCookie(cookie_name,'ASC');
dom='.page-on-center .jinsom-single-comment-list';
jinsom_comment_data(1,$(dom).attr('post_id'),$(dom).attr('type'),$(dom).attr('bbs_id'),dom);
$('.jinsom-single-comment>.header .sort span').text('正序');
}},
{text:'倒序（新 ->旧 ）',onClick:function(){
SetCookie(cookie_name,'DESC');
dom='.page-on-center .jinsom-single-comment-list';
jinsom_comment_data(1,$(dom).attr('post_id'),$(dom).attr('type'),$(dom).attr('bbs_id'),dom);
$('.jinsom-single-comment>.header .sort span').text('倒序');
}},
{text:'取消',color: 'red'},
];

if(sort_type=='DESC'){//倒序
buttons[1]['bold']=true;	
}else{
buttons[0]['bold']=true;
}

myApp.actions(buttons);
}

//返回顶部
function jinsom_totop(){
current=myApp.getCurrentView().selector;
if($(current+' .page-on-center').length>0){
$('.page-on-center .page-content').animate({scrollTop:0},500);
}else{
$(current+' .page-content').animate({scrollTop:0},500);
}	
}

//收起/展开右侧悬浮按钮
function jinsom_hide_right_bar(){
if($('.jinsom-right-bar').hasClass('hidden')){
$('.jinsom-right-bar').removeClass('hidden');
$('.jinsom-right-bar li.close').siblings().show();
number=$('[data-page="jinsom-mine-page"] .jinsom-right-bar li').length;
height=(number-1)*17-5;
$('.jinsom-right-bar').css('height',height+'vw');
$('.jinsom-right-bar li.close i').addClass('jinsom-guanbi').removeClass('jinsom-mulu1');
}else{
$('.jinsom-right-bar').addClass('hidden');
$('.jinsom-right-bar li.close').siblings().hide();	
$('.jinsom-right-bar').css('height','5vw');
$('.jinsom-right-bar li.close i').removeClass('jinsom-guanbi').addClass('jinsom-mulu1');
}
$('.jinsom-right-bar li.music').hide();
}


//喜欢秘密 匿名
function jinsom_like_secret(post_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

if(!$(obj).hasClass('had')){
audio=document.getElementById('jinsom-like-up-music');
audio.play();
$(obj).addClass('had');
like_num=parseInt($(obj).children('n').text())+1;
$(obj).children('n').text(like_num);
$.ajax({
type: "POST",
dataType:'json',
url:  jinsom.mobile_ajax_url+"/action/secret.php",
data: {post_id:post_id,type:'like'},
success: function(msg){
if(msg.code==1){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"secret_like","notice_user_id":"'+msg.author_id+'","do_user_id":"'+jinsom.user_id+'"}');

}
}
});
}
}

//删除秘密
function jinsom_delete_secret(post_id){
layer.closeAll();
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type:"POST",
url:jinsom.mobile_ajax_url+"/action/secret.php",
data:{post_id:post_id,type:'delete'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
history.back(-1);	
$('#jinsom-secret-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});

}
}
});

layer.close(index);
}
});
}

//评论私密
function jinsom_secret_comment(){
post_id=$('.jinsom-post-secret-list.single').attr('data');
content=$('#jinsom-secret-comment-content').val();
myApp.showIndicator();
$.ajax({
type:"POST",
url:jinsom.mobile_ajax_url+"/action/secret.php",
data:{post_id:post_id,content:content,type:'comment'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#jinsom-secret-comment-content').val('');
$('.jinsom-secret-comment-list').prepend(msg.html);

ws.send('{"from_url":"'+jinsom.home_url+'","type":"secret_comment","notice_user_id":"'+msg.author_id+'","do_user_id":"'+jinsom.user_id+'"}');

}
}
});
}

//删除秘密评论
function jinsom_secret_comment_delete(comment_id){
layer.closeAll();
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){

post_id=$('.jinsom-post-secret-list.single').attr('data');
myApp.showIndicator();
$.ajax({
type:"POST",
url:jinsom.mobile_ajax_url+"/action/secret.php",
data:{comment_id:comment_id,post_id:post_id,type:'comment-delete'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#jinsom-secret-comment-'+comment_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});
}
}
});
layer.close(index);
}
});
}


//打开页面
function jinsom_is_page_repeat(page_name,url){
if($('.pages [data-page='+page_name+']').length>0){
history.back(-1);
}else{
myApp.getCurrentView().router.load({url:url});
}
}


/*
加载评论
page：页数
post_id：文章id
type：如果是帖子填：bbs，否则留空
bbs_id：论坛ID
dom：列表dom
*/
function jinsom_comment_data(page,post_id,type,bbs_id,dom){
$(dom).prepend(jinsom.loading_post);
comment_loading=false;
comment_page=2;
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/post/comment.php",
data: {page:page,post_id:post_id,type:type,bbs_id:bbs_id},
success: function(msg){
$('.jinsom-load-post').remove();
if(msg==0){
$(dom).html(jinsom.empty); 
}else{
$(dom).html(msg); 
jinsom_lightbox();//灯箱
} 
}
});	
}


//iframe弹窗
function jinsom_iframe(url,title){
myApp.closeModal();//关闭弹窗
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/url.php?link='+url+'&type=iframe&title='+title});
}

//弹窗
function jinsom_popup(e){
myApp.popup(e);
history.pushState('','','#'+Math.random().toString(36).substr(2,5));
}

//打开页面
function jinsom_page(url,login,type){
if(login){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
}
if(type=='page'){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/'+url});
}else{
myApp.getCurrentView().router.load({url:url});
}
}

//清除阅读历史记录
function jinsom_history_single_clear(obj){
layer.open({
content: '你确定要清空吗？'
,btn: ['确定', '取消']
,yes: function(index){
$('.jinsom-history-single-content').html(jinsom.empty);
layer.open({content:'已经清空！',skin:'msg',time:2});
DelCookie('history_single');
$(obj).text('').removeAttr('onclick');
}
});	
}

//清除历史搜索
function jinsom_history_search_clear(){
layer.open({
content: '你确定要清除历史搜索吗？'
,btn: ['确定', '取消']
,yes: function(index){
$('.jinsom-search-hot.history').remove();
layer.open({content:'已经清除！',skin:'msg',time:2});
DelCookie('history-search');
}
});	
}

//下载次数
function jinsom_download_times(post_id){
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/download-times.php",
type:'POST',   
data:{post_id:post_id},  
}); 
}

//申请论坛
function jinsom_apply_bbs(){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
data=$('#jinsom-apply-bbs-form').serialize();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/apply-bbs.php",
data:data,
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
function d(){history.back(-1);}setTimeout(d,1500);
}
}
});
}

//打开登录注册页面
function jinsom_load_login_page(name){
layer.closeAll();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/login/'+name+'.php'});
function d(){myApp.closeModal();}setTimeout(d,300);
}


//显示注册类型
function jinsom_reg_type_form(){
layer.open({
type: 1,
content: $('.jinsom-reg-type-form').html(),
anim: 'up',
className:'jinsom-reg-type-form-content',
style: 'position:fixed;bottom:2vw;left:2vw;width:96vw;border:none;box-sizing:border-box;border-radius:2vw;padding:2vw;'
});	
}

//记录社交登录 返回地址 登录返回 登录回调
function jinsom_login_back_url(){
url=window.location.href;
document.cookie="login_back="+url;
}


//获取get参数
function jinsom_get_para(name){
var query = window.location.search.substring(1);
var vars = query.split("&");
for (var i=0;i<vars.length;i++) {
var pair = vars[i].split("=");
if(pair[0] == name){return pair[1];}
}
return(false);
}

//获取域名的带参数部分
function jinsom_GetUrlPara(){
var url = document.location.toString();
var arrUrl = url.split("?");
var para = arrUrl[1];
return para;
}


//第三方地址的更多功能
function jinsom_url_page_more(url){
var buttons1 = [{text: '新窗口打开',onClick:function(){
window.open(url);
}},
{text: '复制地址',onClick:function(){
var clipboard = new ClipboardJS('.actions-modal-button:last-child');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});

}}];
var buttons2 = [{text: '取消',color:'red'}
];
var groups = [buttons1, buttons2];
myApp.actions(groups);
$('.actions-modal-button:last-child').attr('data-clipboard-text',url);
}



//评论艾特aite@好友
function jinsom_comment_aite_user_js(){
$('.jinsom-publish-aite-popup').on('opened',function (){//打开
if($('.jinsom-load-post').length>0){
return false;	
}
if($('.jinsom-publish-aite-form .list.aite li').length==0){
$('.jinsom-publish-aite-form .list.aite').prepend(jinsom.loading_post);
$.ajax({
type: "POST",
url: jinsom.mobile_ajax_url+"/user/following.php",
success: function(msg){
if(msg.code==1){
html='';
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li onclick="jinsom_aite_selete_user(this)" data="'+msg.data[i].nickname+'">\
<div class="avatarimg">'+msg.data[i].avatar+msg.data[i].verify+'</div>\
<div class="name">'+msg.data[i].name+msg.data[i].vip+'</div>\
</li>';
}
}else{
html=jinsom.empty;
}
$('.jinsom-publish-aite-form .list.aite').html(html);
}
}); 

}
});
}


//发起挑战
function jinsom_challenge(){
type=$('.jinsom-publish-challenge-content .type>li.on').attr('data');
value=$('.jinsom-publish-challenge-content .shitou li.on p').text();
price=$('.jinsom-publish-challenge-content .price li.on').index();
desc=$('.jinsom-publish-challenge-content .desc textarea').val();
if(!value){
layer.open({content:'请选择你要出的！',skin:'msg',time:2});
return false;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.mobile_ajax_url+"/action/challenge.php",
data:{type:type,value:value,price:price,desc:desc},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
type=$('.jinsom-challenge-menu li.on').attr('type');
jinsom_challenge_data(type,this);
if(msg.code==1){
function d(){history.back(-1);}setTimeout(d,1500);
}
}
}); 	
}

//参与挑战
function jinsom_challenge_join(id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
value=$('.jinsom-challenge-content.join .shitou li.on p').text();
if(!value&&$('.jinsom-challenge-content .shitou').length>0){
layer.open({content:'请选择你要出的！',skin:'msg',time:2});
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.mobile_ajax_url+"/action/challenge-join.php",
data:{id:id,value:value},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code!=0){
$('.jinsom-challenge-content.join .price').after(msg.html);
$('.jinsom-challenge-content.join .btn,.jinsom-challenge-content.join .shitou,.jinsom-challenge-content.join .tips').remove();
$('#jinsom-challenge-'+id).find('.btn').children('a').addClass('no').text('已结束');
}
}
}); 	
}

//切换挑战数据
function jinsom_challenge_data(type,obj){
$(obj).addClass('on').siblings().removeClass('on');
$('.jinsom-challenge-content').animate({scrollTop: 0 },0);
challenge_post_list=$('.jinsom-challenge-post-list');
challenge_loading=false;
challenge_page=2;
challenge_post_list.before(jinsom.loading_post);
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/post/challenge.php",
data: {page:1,type:type},
success: function(msg){
$('.jinsom-load-post').remove();
challenge_post_list.html(msg);
}
});
}

//我的订单数据
function jinsom_order_data(type,link_type,obj){
$(obj).addClass('on').siblings().removeClass('on');
$('.jinsom-shop-order-mine-content').animate({scrollTop: 0 },0);
order_list=$('.jinsom-shop-order-mine-list');
order_loading=false;
order_page=2;
order_list.before(jinsom.loading_post);
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/post/order.php",
data: {page:1,type:type,link_type:link_type},
success: function(msg){
$('.jinsom-load-post').remove();
order_list.html(msg);
}
});
}

//插入商品应用
function jinsom_publish_add_application_shop(obj){
post_id=$(obj).parent().attr('data');
title=$(obj).find('.title').text();
history.back(-1);
$('.jinsom-publish-words-form .add-application .left span').text(title);
$('.jinsom-publish-words-form .add-application .left i').removeAttr('class').addClass('jinsom-icon jinsom-shangcheng');
$('#jinsom-publish-application-type').val('shop');
$('#jinsom-publish-application-value').val(post_id);
}

//插入网址链接
function jinsom_publish_add_application_link(){
layer.closeAll();
myApp.prompt('', function (value) {

var Expression =/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/; 

var objExp=new RegExp(Expression);

if(objExp.test(value) != true){
layer.open({content:'请输入一个合法的url链接！',skin:'msg',time:2});
return false; 
} 

$('.jinsom-publish-words-form .add-application .left span').text(value);
$('.jinsom-publish-words-form .add-application .left i').removeAttr('class').addClass('jinsom-icon jinsom-tuiguang');
$('#jinsom-publish-application-type').val('url');
$('#jinsom-publish-application-value').val(value);
});
$('.modal-text-input').focus();
}

//插入我的挑战
function jinsom_publish_add_application_challenge(obj){
layer.closeAll();
application_name=$(obj).children('span').text();
$('.jinsom-publish-words-form .add-application .left span').text(application_name);
$('.jinsom-publish-words-form .add-application .left i').removeAttr('class').addClass('jinsom-icon jinsom-jirou');
$('#jinsom-publish-application-type').val('challenge');
}
//插入我的宠物
function jinsom_publish_add_application_pet(obj){
name=$(obj).children('p').text();
img=$(obj).children('img').attr('src');
history.back(-1);
application_name=$(obj).attr('data');
$('.jinsom-publish-words-form .add-application .left span').text(application_name+'-['+name+']');
$('.jinsom-publish-words-form .add-application .left i').removeAttr('class').addClass('jinsom-icon jinsom-chongwu');
$('#jinsom-publish-application-type').val('pet');
$('#jinsom-publish-application-value').val(name+','+img);
}
//插入我的摇钱树
function jinsom_publish_add_application_tree(obj){
layer.closeAll();
application_name=$(obj).children('span').text();
$('.jinsom-publish-words-form .add-application .left span').text(application_name);
$('.jinsom-publish-words-form .add-application .left i').removeAttr('class').addClass('jinsom-icon jinsom-yaoqianshu');
$('#jinsom-publish-application-type').val('tree');
}


//打开移动版块页面
function jinsom_open_change_bbs_form(post_id,bbs_id){
layer.closeAll();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/change-bbs.php?post_id='+post_id+'&bbs_id='+bbs_id});	
}

//提交移动版块
function jinsom_change_bbs(post_id,bbs_id){
new_bbs_id='';
$('.jinsom-change-bbs-content li input:checkbox:checked').each(function (index, item) {
new_bbs_id+=$(this).val()+',';
});

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/change-bbs.php",
data:{post_id:post_id,bbs_id:bbs_id,new_bbs_id:new_bbs_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){window.open(msg.url,'_self');}setTimeout(c,2000);
}
});
}


//打开举报页面
function jinsom_report_page(type,report_id){
layer.closeAll();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/report.php?type='+type+'&report_id='+report_id});
}

//提交举报
function jinsom_report(report_id,from){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
reason=$('#jinsom-report-reason').val();
type=$('#jinsom-report-type').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/report.php",
data:{report_id:report_id,reason:reason,type:type,from:from},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,1500);	
}
}
});
}

//摇钱树 摇一下
function jinsom_tree_yao(obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
time=parseInt($('.jinsom-tree-btn .yao m').text());
if(time){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/tree.php",
data:{type:'yao'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
$('.jinsom-tree-btn .yao m').text(time-1);//次数
health=parseInt($('.jinsom-tree-name .health span m').text());
yao_health=parseInt($('.jinsom-tree-name .health').attr('b'));//每次消耗健康值
$('.jinsom-tree-name .health span m').text(health-yao_health);
$('.jinsom-tree-icon img').addClass('yaohuang');
audio=document.getElementById('jinsom-tree-yao-music');
audio.play();
function d(){$('.jinsom-tree-icon img').removeClass('yaohuang');}setTimeout(d,2000);
}
}
});
}else{
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}
}

//浇水
function jinsom_tree_jiao(obj,author_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
time=parseInt($('.jinsom-tree-btn .jiao m').text());
if(time){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/tree.php",
data:{type:'jiao',author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
audio=document.getElementById('jinsom-tree-jiao-music');
audio.play();

$('.jinsom-tree-btn .jiao m').text(time-1);//次数
health=parseInt($('.other .jinsom-tree-name .health span m').text());
health_max=parseInt($('.other .jinsom-tree-name .health span n').text());
jiao_health=parseInt($('.other .jinsom-tree-name .health').attr('c'));//每次浇水恢复的健康值

if(health+jiao_health>health_max){
hui_health=health_max;
}else{
hui_health=health+jiao_health;
}

$('.other .jinsom-tree-name .health span m').text(hui_health);
}
}
});
}else{
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}
}

//破坏
function jinsom_tree_po(obj,author_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
time=parseInt($('.jinsom-tree-btn .po m').text());
if(time){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/tree.php",
data:{type:'po',author_id:author_id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
audio=document.getElementById('jinsom-tree-po-music');
audio.play();

$('.jinsom-tree-btn .po m').text(time-1);//次数
$('.other .jinsom-tree-name .health span m').text(msg.health);
}
}
});
}else{
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}
}


//治疗
function jinsom_tree_help(obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
if(parseInt($('.jinsom-tree-name .health span m').text())>=parseInt($('.jinsom-tree-name .health span n').text())){
layer.open({content:$(obj).attr('no'),skin:'msg',time:2});
}else{
help_credit=parseInt($(obj).attr('a'));
n=parseInt($('.jinsom-tree-name .health span n').text());
m=parseInt($('.jinsom-tree-name .health span m').text());
need_credit=(n-m)*help_credit;

if(need_credit){//如果需要金币恢复健康值
layer.open({
content: '<font style="color:#f00;">'+$(obj).attr('tips')+need_credit+jinsom.credit_name+'</font>'
,btn: ['确定', '取消']
,yes: function(index){

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/tree.php",
data:{type:'help'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
$('.jinsom-tree-main .help').show();
audio=document.getElementById('jinsom-tree-help-music');
audio.play();
$('.jinsom-tree-name .health span m').text(msg.health);
function d(){$('.jinsom-tree-main .help').hide();}setTimeout(d,3000);	
}

}
});

}
});

}else{

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/tree.php",
data:{type:'help'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});

if(msg.code==1){
$('.jinsom-tree-main .help').show();
audio=document.getElementById('jinsom-tree-help-music');
audio.play();
$('.jinsom-tree-name .health span m').text(msg.health);
function d(){$('.jinsom-tree-main .help').hide();}setTimeout(d,3000);	
}

}
});

}


}
}

//打开邻居页面
function jinsom_tree_list_page(){
layer.closeAll();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/tree-list.php'});
}

//打开升级页面
function jinsom_tree_update_page(){
layer.closeAll();
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/tree-update.php'});
}

//升级摇钱树
function jinsom_tree_update(obj){
if($(obj).hasClass('no')){
return false;
}
$(obj).addClass('no');
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/tree.php",
data:{type:'update'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
history.back(-1);
audio=document.getElementById('jinsom-tree-update-music');
audio.play();
$(obj).removeClass('no');
function d(){layer.open({content:msg.msg,skin:'msg',time:2});}setTimeout(d,500);
function c(){
$('.jinsom-tree-icon img').attr('src',msg.img);
$('.jinsom-tree-name .name').text(msg.name);
$('.jinsom-tree-name .health span').html('<m>'+msg.health+'</m> / <n>'+msg.health+'</n>');
$('.jinsom-tree-name .income span').text(msg.income+jinsom.credit_name+' / 次');
$('.jinsom-tree-btn .yao m').text(msg.yao);//重置摇的次数
}setTimeout(c,1500);	
}else if(msg.code==2){
audio1=document.getElementById('jinsom-tree-update-fail-music');
audio1.play();
layer.open({content:msg.msg,skin:'msg',time:2});
audio1.addEventListener('ended', function(){$(obj).removeClass('no');},false);	
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
$(obj).removeClass('no');
}
}
});

}


//弹出登录框=====后面版本移除----请不要使用
function jinsom_login_form(){
jinsom_login_page();
}

//转换表情
function jinsom_content_to_smile(content){
smile_add_arr=$.parseJSON(jinsom.smile_add);
if(smile_add_arr){
content=content.replace(/\[s\-(\d+)\]/g,'<img src="'+jinsom.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content=content.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+jinsom.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}
return content;
}


//同步消息数量
function jinsom_update_notice_tips(){
notice=0;

if($('.toolbar .notice').length>0){//底部tab开启了消息
$("[data-page='jinsom-notice-page'] .jinsom-chat .tips").each(function(){
if($(this).text()){
notice+=parseInt($(this).text());
}
});
}else if($('.jinsom-mine-box li.notice').length>0){//我的里面开启了消息
if($("[data-page='notice']").length>0){
$("[data-page='notice'] .jinsom-chat .tips").each(function(){
if($(this).text()){
notice+=parseInt($(this).text());
}
});
}else{
notice+=parseInt($('.toolbar .mine m').text());
}
}

if(notice){
if($('.toolbar .notice').length>0){
$('.toolbar .notice m').remove();
$('.toolbar .notice').prepend('<m class="badge bg-red tips">'+notice+'</m>');
}
if($('.jinsom-mine-box li.notice').length>0){
$('.toolbar .mine m,.jinsom-mine-box li.notice .tips').remove();
$('.toolbar .mine,.jinsom-mine-box li.notice i').prepend('<m class="badge bg-red tips">'+notice+'</m>');	
}
}else{
$('.jinsom-chat .tips,.toolbar .tips,.jinsom-mine-box li.notice .tips').remove();	//清除所有消息
}
}

//监控聊天正在输入
function jinsom_chat_input_ing(author_id,obj){
if($(obj).val()){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"input-ing","notice_user_id":"'+author_id+'","do_user_id":"'+jinsom.user_id+'","do_user_name":"'+jinsom.nickname_base+'"}');
}
}


//打开登录页面
function jinsom_login_page(){
jinsom_page('login/login.php',0,'page');
}


//打开标记内容页面
function jinsom_add_post_mark_form(post_id,bbs_id){
layer.closeAll();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/add-post-mark.php?post_id='+post_id+'&bbs_id='+bbs_id});	
}

//提交标记内容
function jinsom_add_post_mark(post_id,bbs_id){
mark_name=$('#jinsom-post-mark-name-val').val();
mark_color=$('#jinsom-post-mark-color-val').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/add-post-mark.php",
data:{bbs_id:bbs_id,post_id:post_id,mark_name:mark_name,mark_color:mark_color},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){window.open(msg.url,'_self');}setTimeout(c,1000);
}
}
});
}


//靓号摇号类型选择
function jinsom_liang_yao_select(obj){
var yao_credit=$('.liang-select option:selected').attr('credit');
var yao_money=$('.liang-select option:selected').attr('money');
// console.log(yao_credit,yao_money);
if(yao_money){
pay_text=yao_money+$('.liang-select option:selected').attr('b');
}else if(yao_credit){
pay_text=yao_credit+$('.liang-select option:selected').attr('a');	
}else{
pay_text='免费';
}
pay_text='（'+pay_text+'）';
$('.liang-btn n').text(pay_text);
}

//靓号选择 选号
function jinsom_liang_yao_use(obj){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/liang-select.php",
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).remove();
function c(){window.open('/','_self');}setTimeout(c,1000);
}else if(msg.code==5){//余额
function a(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-money.php'});}setTimeout(a,500);
}else if(msg.code==6){//金币
function a(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});}setTimeout(a,500);	
}else if(msg.code==8){//VIP
function a(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(a,500);	
}
}
});
}


//靓号商城添加靓号
function jinsom_liang_shop_add(){
number=$('.jinsom-liang-shop-add-content li.number input').val();
credit=$('.jinsom-liang-shop-add-content li.credit input').val();
money=$('.jinsom-liang-shop-add-content li.money input').val();
cat=$('.jinsom-liang-shop-add-content li.cat select').val();
tag=$('.jinsom-liang-shop-add-content li.tag input').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/liang-shop-add.php",
data:{number:number,credit:credit,money:money,cat:cat,tag:tag},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function d(){history.back(-1);}setTimeout(d,1000);	
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,1600);
}
}
});
}

//靓号商城编辑靓号
function jinsom_liang_shop_edit(id){
number=$('.jinsom-liang-shop-add-content li.number input').val();
credit=$('.jinsom-liang-shop-add-content li.credit input').val();
money=$('.jinsom-liang-shop-add-content li.money input').val();
cat=$('.jinsom-liang-shop-add-content li.cat select').val();
tag=$('.jinsom-liang-shop-add-content li.tag input').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/action/liang-shop-edit.php",
data:{number:number,credit:credit,money:money,cat:cat,tag:tag,id:id},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function d(){history.back(-1);}setTimeout(d,1000);	
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,1600);
}
}
});
}

//靓号商城 购买靓号/操作
function jinsom_liang_shop_do(obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

if(jinsom.is_admin){//管理员操作
var buttons1=[{text:'编辑靓号',onClick:function(){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/liang-shop-edit.php?id='+$(obj).attr('data')});
}},
{text:'将靓号设置为售罄',onClick:function(){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/action/liang-shop-do.php",
data: {id:$(obj).attr('data'),type:'no'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
myApp.getCurrentView().router.refreshPage();//刷新当前页面
}
}
});
}},
{text:'删除靓号',onClick:function(){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/action/liang-shop-do.php",
data: {id:$(obj).attr('data'),type:'delete'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('#liang-'+$(obj).attr('data')).remove();
}
}
});
}}
];
var buttons2=[{text: '取消',color:'red'}
];
var groups=[buttons1, buttons2];
myApp.actions(groups);
}else{
if($(obj).hasClass('liang-status-1')){//提示售罄
layer.open({content:'该靓号已售罄，请换一个号码吧！',skin:'msg',time:2});
}else{//提示购买操作
layer.open({
content: '你确定购买靓号[<font style="color:#2196f3">'+$(obj).attr('liang')+'</font>]吗？<br><font style="color:#f00">购买之后，原有的靓号将被替换</font>'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.mobile_ajax_url+"/action/liang-shop-do.php",
data: {id:$(obj).attr('data'),type:'buy'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){window.open('/','_self');}setTimeout(c,1000);
}else if(msg.code==5){//余额
function a(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-money.php'});}setTimeout(a,500);
}else if(msg.code==6){//金币
function a(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});}setTimeout(a,500);	
}else if(msg.code==7){//靓号被购买 设置为使用 刷新
myApp.getCurrentView().router.refreshPage();//刷新当前页面
}else if(msg.code==8){//VIP
function a(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(a,500);	
}
}
});
layer.close(index);
}
});
}
}
}



function jinsom_htmlspecialchars_decode(str){
str=str.replace(/&amp;/g,'&');
str=str.replace(/&lt;/g,'<');
str=str.replace(/&gt;/g,'>');
str=str.replace(/&quot;/g,'"');
str=str.replace(/&#039;/g,"'");
str=str.replace(/\n/g,"<br>");
return str;
}

function jinsom_htmlspecialchars(str){
str = str.replace(/&/g, '&amp;');  
str = str.replace(/</g, '&lt;');  
str = str.replace(/>/g, '&gt;');  
str = str.replace(/"/g, '&quot;');  
str = str.replace(/'/g, '&#039;');  
return str; 
}

//设置cookie
function SetCookie(name,value){
var Days = 30*12*10;//十年
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//获取cookie
function GetCookie(name){
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg)){
return unescape(arr[2]);
}else{
return null;
}
}

//删除cookie
function DelCookie(name){
var exp = new Date();
exp.setTime(exp.getTime() - 1);
var cval=GetCookie(name);
if(cval!=null){
document.cookie= name + "="+cval+";expires="+exp.toGMTString();
} 
}


//判断是否小程序内
function is_miniprogram(){
var userAgent = navigator.userAgent;
var isMini = /miniProgram/i.test(userAgent);
if(isMini){
return true;
}else{
return false;
}
}

//附件下载次数
function jinsom_file_download_time(filename,post_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/file-download.php",
data:{filename:filename,post_id:post_id},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
if(is_miniprogram()){
// 微信小程序下载 直接复制到剪切板
layer.open({
content: '小程序内不支持直接下载,请复制链接到浏览器进行下载',
btn: ['复制链接', '取消'],
yes: function(index){
clipboard = new ClipboardJS('[yes][type="1"]');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'链接复制成功！',skin:'msg',time:2});
});
layer.close(index);
}
});
$('[yes][type="1"]').attr('data-clipboard-text',msg.url);
}else{
window.open(msg.url,'_self');
}
}else if(msg.code==2){
jinsom_msg(msg.msg);
jinsom_file_pay(filename,post_id,$('.btn-' + filename));
}else if(msg.code==4){
jinsom_pay_tips_confirm(msg.msg,msg.name,jinsom_recharge_extcredits_form);
}else{
jinsom_msg(msg.msg);
function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,2000);
}
}
});
}

//附件付费
function jinsom_file_pay(filename,post_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
type = $(obj).attr('data-type');
value = $(obj).attr('data-value');
layer.open({
content: '下载该文件需要支付'+$(obj).siblings('.info').find('font').text(),
btn: ['确定', '取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/file-pay.php",
data:{filename:filename,type:type,value:value,post_id:post_id},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
jinsom_file_download_time(filename,post_id);
}else if(msg.code==2){
jinsom_pay_tips_confirm(msg.msg,msg.name,jinsom_recharge_credit_form);
}else if(msg.code==3){
jinsom_pay_tips_confirm(msg.msg,msg.name,jinsom_recharge_money_form);
}else if(msg.code==4){
jinsom_pay_tips_confirm(msg.msg,msg.name,jinsom_recharge_extcredits_form);
}
}
});
}
});
}

//附件下载记录
function jinsom_file_download_note(filename,post_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/file-download-note.php",
data:{filename:filename,post_id:post_id},
success: function(msg){
myApp.hideIndicator();
if(msg==0){
layer.open({
content: '你好，记录购买后可查看',
btn: ['确定', '取消'],
yes: function(index){
jinsom_file_pay(filename,post_id,$('.btn-' + filename));
}
});
}else if(msg==1){
layer.open({
content: '你好，你的付费已经过期，记录重新购买后可查看',
btn: ['确定', '取消'],
yes: function(index){
jinsom_file_pay(filename,post_id,$('.btn-' + filename));
}
});
}else{
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/file-download-note.php?filename='+filename+'&post_id='+post_id});
}
}
});
}

//附件付费提醒弹窗封装
function jinsom_pay_tips_confirm(msg,name,callback){
layer.open({
content: msg,
btn: [name+'充值', '我的钱包'],
yes: function(index){
layer.closeAll();
$.isFunction(callback) && callback();
},
no: function(index){
layer.closeAll();
jinsom_page('mywallet/mywallet.php',1,'page');
}
});
}

//退还附件扣费
function jinsom_file_download_refund(filename,post_id,user_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
layer.open({
content: '你确定要'+$(obj).html()+'吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/file-download-refund.php",
data:{filename:filename,post_id:post_id,user_id:user_id},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
$(obj).parents('td').prev('td').text('已退还');
$(obj).parents('td').remove();
}
}
});
}
});
}

//金币兑换积分
function jinsom_extcredits_exchange(){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
number=$('#jinsom-extcredits-exchange-number').val();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/exchange-extcredits.php",
data:{number:number},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
my_extcredits = parseInt($('.jinsom-mywallet-box.extcredits .number').text());
$('.jinsom-mywallet-box.extcredits .number').text(my_extcredits+msg.num)
function c(){history.back(-1);}setTimeout(c,2000);
}else if(msg.code==2){//弹出金币充值窗口
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});}setTimeout(c,1500);
}
}
});
}

//转账
function jinsom_transfer_one(){
nickname=$('#jinsom-pop-nickname').val();
if(nickname==''){
jinsom_msg('请输入需要转账用户的昵称！');
return false;
}
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/transfer-one.php",
data:{nickname:nickname},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
jinsom_transfer_go(msg.author_id);
}else{
jinsom_msg(msg.msg);
}
}
});
}

// 进入转账页面
function jinsom_transfer_go(author_id){
jinsom_page(jinsom.theme_url+'/mobile/templates/page/mywallet/transfer-confirm.php?author_id='+author_id,1,'');
}

// 确定转账
function jinsom_transfer_confirm() {
author_id=$('.jinsom-transfer-confirm').attr('data');
number=$('#jinsom-pop-transfer-number').val();
mark=$('#jinsom-pop-transfer-mark').val();
if(number==''){
jinsom_msg('请输入转账金额！');
return false;
}
transfer_type=$('.jinsom-transfer-confirm .type>m.on').attr('type');
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/transfer-confirm.php",
data:{author_id:author_id,number:number,mark:mark,transfer_type:transfer_type},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
if($('.jinsom-mycredit-form').length>0){
recharge_number=parseInt(msg.transfer_number);
if(transfer_type=='credit'){
credit=parseInt($('.jinsom-mywallet-header .number span').html());
credit_count=credit-recharge_number;
$('.jinsom-mywallet-header .number span').html(credit_count);
}else if(transfer_type=='money'){
money=parseFloat($('.jinsom-mywallet-header .yuan span').html());
money_count=money-recharge_number;
$('.jinsom-mywallet-header .yuan span').html(money_count);
}else if(transfer_type=='extcredits'){
extcredits=parseInt($('.jinsom-mywallet-box.extcredits .number').html());
extcredits_count=extcredits-recharge_number;
$('.jinsom-mywallet-box.extcredits .number').html(extcredits_count);
}
}
function c(){history.back(-1);}setTimeout(c,2000);
}
}
});
}

//充值积分
function jinsom_recharge_extcredits_form(){
jinsom_page('mywallet/extcredits-recharge.php',1,'page');
}

//充值金币
function jinsom_recharge_credit_form(){
jinsom_page('mywallet/recharge-credit.php',1,'page');
}

//充值余额
function jinsom_recharge_money_form(){
jinsom_page('mywallet/recharge-money.php',1,'page');
}

//内容限流
function jinsom_limit_post(post_id,type){
layer.closeAll();
myApp.prompt('请输入限流的原因', function (reason) {
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/limit-post.php",
data:{post_id:post_id,reason:reason},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
if(type=='single'){
history.back(-1);	
}
$('.jinsom-post-'+post_id).fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function(){
$(this).remove();
});
});
}
}
});
});
}

//内容限流-取消
function jinsom_cancel_limit_post(post_id){
layer.closeAll();
layer.open({
content: '你确定要取消该内容的限流吗？',
btn: ['确定', '取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/limit-post-cancel.php",
data:{post_id:post_id},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,2000);
}
}
});
layer.close(index);
}
});
}

//锁帖--禁止删除，禁止修改，禁止评论
function jinsom_lock_post(post_id,bbs_id,type){
layer.closeAll();
layer.open({
content: '你确定要锁帖吗？这将会禁止该内容修改/删除/评论',
btn: ['确定', '取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/action/post-lock.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,2000);
}
}
});
layer.close(index);
}
});
}

//解锁帖子
function jinsom_unlock_post(post_id,bbs_id,type){
layer.closeAll();
layer.open({
content: '你确定要解锁帖子吗？',
btn: ['确定', '取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/action/post-unlock.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,2000);
}
}
});
layer.close(index);
}
});
}

//追加悬赏
function jinsom_add_bbs_answer_number(post_id){
layer.closeAll();
myApp.prompt('请输入要追加的'+jinsom.credit_name+'数量', function (reason) {
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/answer.php",
data: {number:reason,post_id:post_id,type:'add'},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,2000);
}
}
});

});	
}

//设置为风险用户
function jinsom_blacklist_setting(author_id){
layer.open({
content: '你确定要解锁帖子吗？',
btn: ['确定', '取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/blacklist-user.php",
data:{author_id:author_id},
success: function(msg){
myApp.hideIndicator();
jinsom_msg(msg.msg);
if(msg.code==1){
function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,2000);
}
}
});
}
});
}
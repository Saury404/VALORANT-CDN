
//打开发布内容表单
function jinsom_publish_power(type,bbs_id,topic,m_bbs_data){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

if(jinsom.publish_is_phone&&!jinsom.is_phone){
myApp.closeModal();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
return false;
}
if(jinsom.publish_is_email&&!jinsom.is_email){
myApp.closeModal();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
return false;
}

if(type=='custom'){
myApp.popup('.jinsom-publish-type-form');
return false;	
}


if($('.jinsom-topic-page-header').length>0){
topic=$('.jinsom-topic-page-header').attr('topic');
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/publish/power.php",
data:{type:type,bbs_id:bbs_id},
success: function(msg){
if(msg.code==0){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
}else if(msg.code==1){

if(type=='follow-bbs'||type=='commend-bbs'||type=='m_bbs'){
jinsom_publish_multiple_bbs(type,m_bbs_data);
return false;	
}

myApp.closeModal();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/publish/'+type+'.php?topic='+topic+'&type='+type+'&bbs_id='+bbs_id});
myApp.hideIndicator();
}else if(msg.code==3){//打开开通会员页面
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
myApp.closeModal();
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
}
}
});
}


//移除照片
function jinsom_remove_image(max,obj){
$(obj).parents('li').remove();
img_count=$('#jinsom-publish-images-list li').length;
if(img_count<max){
$('.jinsom-publish-words-form .add').show();
}
jinsom_lightbox();
}


//@用户搜索用户
var aite_user_search=null;
function jinsom_pop_aite_user_search(){
if(aite_user_search){aite_user_search.abort();}//终止事件
key=$.trim($('#jinsom-aite-user-input').val());
if(key==''){
return false;
}
// $('.jinsom-publish-aite-form .list.aite').html(jinsom.loading);
aite_user_search=$.ajax({
type: "POST",
async: false,
url: jinsom.mobile_ajax_url+"/search/user.php",
data:{key:key},
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
$('.jinsom-publish-aite-form .list.aite').html(html);
}else{
$('.jinsom-publish-aite-form .list.aite').html(msg.content);	
}
}
});
}

//发布 搜索@用户  选择用户
function jinsom_aite_selete_user(obj){
myApp.closeModal();
if($('.jinsom-publish-words-form .content textarea').length>0){
textarea=$('.jinsom-publish-words-form .content textarea');	//发表
}else{
textarea=$('.jinsom-comment-content-main textarea');//评论
}

if($('.jinsom-publish-words-form').hasClass('single')||$('.jinsom-publish-words-form').hasClass('bbs')){
tinymce.get('jinsom-publish-single-textarea').insertContent(' @'+$(obj).attr('data')+' ');
}else{
textarea.val(textarea.val()+' @'+$(obj).attr('data')+' ');
}

}

//发布 选择话题
function jinsom_publish_topic_selete(obj){
topic_name=$(obj).attr('data');
//判断插入的话题是否和已经选择的话题一样
$('.jinsom-publish-words-form .topic span').each(function(){
if($(this).attr('data')==topic_name){
$(this).remove();
}
});

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/publish/topic-power.php",
data:{topic_name:topic_name},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
myApp.closeModal();
$('.jinsom-publish-words-form .topic').append('<span onclick="$(this).remove();" data="'+topic_name+'">#'+topic_name+'#</span>');
$('.jinsom-publish-aite-form .search.topic input').val('');
}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});


}



//话题搜索
var topic_search=null;
function jinsom_pop_topic_search(){
if(topic_search){topic_search.abort();}//终止事件
key=$.trim($('#jinsom-search-topic-input').val());
if(key==''){
return false;
}
// $('.jinsom-publish-aite-form .list.topic').html(jinsom.loading);
topic_search=$.ajax({
type: "POST",
url: jinsom.mobile_ajax_url+"/search/topic.php",
data:{key:key},
success: function(msg){
if(msg.code==1){
html=msg.new;
for (var i = msg.data.length - 1; i >= 0; i--){
html+='\
<li class="search" onclick="jinsom_publish_topic_selete(this)" data="'+msg.data[i].name+'">\
<div class="avatarimg">'+msg.data[i].avatar+'</div>\
<div class="name">#'+msg.data[i].name+'#</div>\
<div class="hot"><i class="jinsom-icon jinsom-huo"></i> '+msg.data[i].hot+'</div>\
</li>';
}
$('.jinsom-publish-aite-form .list.topic').html(html);
}else{
$('.jinsom-publish-aite-form .list.topic').html(msg.new);	
}
}
});
}



//发布选择评论权限开关
function jinsom_publish_select_comment_power(obj){
if($(obj).children('i').hasClass('jinsom-quxiaojinzhi-')){
$(obj).children('i').removeClass('jinsom-quxiaojinzhi-').addClass('jinsom-jinzhipinglun-');	
$('#jinsom-pop-comment-status').val('closed');
$(obj).children('p').text('关闭评论');
layer.open({content:'已关闭评论',skin:'msg',time:2});
}else{
$(obj).children('i').removeClass('jinsom-jinzhipinglun-').addClass('jinsom-quxiaojinzhi-');	
$('#jinsom-pop-comment-status').val('open');	
$(obj).children('p').text('评论');
layer.open({content:'已开启评论',skin:'msg',time:2});
}
}

//发布帖子回复隐私开关
function jinsom_publish_select_comment_private(obj){
if($(obj).children('i').hasClass('jinsom-kaisuo')){
$(obj).children('i').removeClass('jinsom-kaisuo').addClass('jinsom-suo');	
$('#jinsom-pop-comment-private').val('closed');
layer.open({content:'仅仅作者可查看评论内容',skin:'msg',time:2});
}else{
$(obj).children('i').removeClass('jinsom-suo').addClass('jinsom-kaisuo');	
$('#jinsom-pop-comment-private').val('open');	
layer.open({content:'所有人都可查看评论内容',skin:'msg',time:2});
}
}


//设置位置 城市
function jinsom_publish_city(obj){
if($(obj).hasClass('no')){
$(obj).removeClass('no');
$('#jinsom-pop-city').val($(obj).children('m').html());
}else{
$(obj).addClass('no');
$('#jinsom-pop-city').val('');
}
}


//发布动态
function jinsom_publish_words(ticket,randstr){

power=$('#jinsom-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($('.jinsom-publish-words-form .power-content .price').val()==''){
layer.open({content:'请输入售价！',skin:'msg',time:2});
return false;	
}
}
if(power==2){
if($.trim($('.jinsom-publish-words-form .power-content .password').val())==''){
layer.open({content:'请输入密码！',skin:'msg',time:2});
return false;	
}
}
}

data=$("#jinsom-publish-form").serialize();
if($('.jinsom-publish-words-form .topic span').length>0){
topic='&topic=';
$('.jinsom-publish-words-form .topic span').each(function(){
topic_str=$(this).attr('data');
topic_str=topic_str.replace(RegExp("&","g"),"#!");
topic+=topic_str+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}


if($('#jinsom-publish-images-list li').length>0){
img='&img=';
img_thum='&img_thum=';
$('#jinsom-publish-images-list li').each(function(){
img+=$(this).children('a').attr('href')+',';
img_thum+=$(this).find('img').attr('src')+',';
});
img=img.substr(0,img.length-1);
img_thum=img_thum.substr(0,img_thum.length-1);
data=data+img+img_thum;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/publish/words.php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('[data-page="publish"] .right a').removeAttr('onclick');

$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容

function d(){myApp.getCurrentView().router.back();}setTimeout(d,2500);
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,3000);


ws.send('{"from_url":"'+jinsom.home_url+'","type":"new_posts","do_user_id":"'+jinsom.user_id+'"}');
if(msg.at_user_id){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"at","notice_user_id":"'+msg.at_user_id+'","do_user_id":"'+jinsom.user_id+'"}');
}


}else if(msg.code==5){
function a(){jinsom_publish_add_topic_form();}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}else if(msg.code==3){//打开开通会员页面
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
}

}
});  

}


//发布文章
function jinsom_publish_single(ticket,randstr){
if($.trim($(".jinsom-publish-words-form .title input").val())==''){
layer.open({content:'请输入标题！',skin:'msg',time:2});
return false;	
}
content=tinymce.get('jinsom-publish-single-textarea').getContent();
content=content.replace(RegExp("&","g"),"!`!");
// console.log(content);

power=$('#jinsom-pop-power').val();
if(power==1||power==2||power==4||power==5||power==6||power==7||power==8){
if(power==1){
if($('.jinsom-publish-words-form .power-content .price').val()==''){
layer.open({content:'请输入售价！',skin:'msg',time:2});
return false;	
}
}
if(power==2){
if($.trim($('.jinsom-publish-words-form .power-content .password').val())==''){
layer.open({content:'请输入密码！',skin:'msg',time:2});
return false;	
}
}


hide_content=tinymce.get('jinsom-publish-single-hide-textarea').getContent();
hide_content=hide_content.replace(RegExp("&","g"),"!`!");

if($.trim(hide_content)==''){
layer.open({content:'请输入隐藏内容！',skin:'msg',time:2});
return false;		
}
}
data=$("#jinsom-publish-form").serialize();
if($('.jinsom-publish-words-form .topic span').length>0){
topic='&topic=';
$('.jinsom-publish-words-form .topic span').each(function(){
topic_str=$(this).attr('data');
topic_str=topic_str.replace(RegExp("&","g"),"#!");
topic+=topic_str+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}
if($('#jinsom-publish-images-list li').length>0){
img='&img=';
$('#jinsom-publish-images-list li').each(function(){
img+=$(this).children('a').html()+'</br>';
});
data=data+img;
}

data+='&content='+content;
if(power==1||power==2||power==4||power==5||power==6||power==7||power==8){
data+='&hide-content='+hide_content;	
}

// console.log(data);

myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/publish/single.php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

$('[data-page="publish"] .navbar .right a').removeAttr('onclick');
window.localStorage.removeItem('single_autosave_draft');
window.localStorage.removeItem('single_hide_autosave_draft');
window.localStorage.removeItem('single_autosave_time');
window.localStorage.removeItem('single_hide_autosave_time');

ws.send('{"from_url":"'+jinsom.home_url+'","type":"new_posts","do_user_id":"'+jinsom.user_id+'"}');
if(msg.at_user_id){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"at","notice_user_id":"'+msg.at_user_id+'","do_user_id":"'+jinsom.user_id+'"}');
}

$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容

function d(){myApp.getCurrentView().router.back();}
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,3000);
setTimeout(d,2500);
}else if(msg.code==5){
function a(){jinsom_publish_add_topic_form();}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}else if(msg.code==3){//打开开通会员页面
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
}

}
});  
}


//发布视频 | 音乐
function jinsom_publish_music_video(publish_type,ticket,randstr){

power=$('#jinsom-pop-power').val();
if(power==1||power==2||power==4||power==5){
if(power==1){
if($('.jinsom-publish-words-form .power-content .price').val()==''){
layer.open({content:'请输入售价！',skin:'msg',time:2});
return false;	
}
}
if(power==2){
if($.trim($('.jinsom-publish-words-form .power-content .password').val())==''){
layer.open({content:'请输入密码！',skin:'msg',time:2});
return false;	
}
}
}

video_url=$("#jinsom-video-url").val();
if(video_url==''){
if(publish_type=='video'){
layer.open({content:'请上传视频！',skin:'msg',time:2});
}else{
layer.open({content:'请上传音频或填写音频地址！',skin:'msg',time:2});
}
return false;	
}

data=$("#jinsom-publish-form").serialize();
if($('.jinsom-publish-words-form .topic span').length>0){
topic='&topic=';
$('.jinsom-publish-words-form .topic span').each(function(){
topic_str=$(this).attr('data');
topic_str=topic_str.replace(RegExp("&","g"),"#!");
topic+=topic_str+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/publish/"+publish_type+".php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"new_posts","do_user_id":"'+jinsom.user_id+'"}');
if(msg.at_user_id){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"at","notice_user_id":"'+msg.at_user_id+'","do_user_id":"'+jinsom.user_id+'"}');
}

$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容

function d(){myApp.getCurrentView().router.back();}setTimeout(d,2500);
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,3000);
}else if(msg.code==5){
function a(){jinsom_publish_add_topic_form();}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}else if(msg.code==3){//打开开通会员页面
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
}

}
});  

}




//发布帖子、发帖
function jinsom_publish_bbs(ticket,randstr){
type=$('input[name="post-type"]').val();

if(type=='activity'||type=='vote'){
layer.open({content:'移动端暂未开启投票/活动类型！',skin:'msg',time:2});
return false;
}

if($.trim($(".jinsom-publish-words-form .title input").val())==''){
layer.open({content:'请输入标题！',skin:'msg',time:2});
return false;	
}

content=tinymce.get('jinsom-publish-single-textarea').getContent();
content=content.replace(RegExp("&","g"),"!`!");


if($('.jinsom-publish-select-cat').length>0&&$('input[name="bbs_child_id"]').val()==0){
layer.open({content:'请选择分类！',skin:'msg',time:2});
return false; 
} 

if(type=='pay_see'){
price=$('.jinsom-publish-words-form .power-content .price').val();
if(!price){
layer.open({content:'请输入内容售价！',skin:'msg',time:2});
return false;		
}
}
if(type=='answer'){
price=$('.jinsom-publish-words-form .power-content .answer-price').val();
if(!price){
layer.open({content:'请输入悬赏金额！',skin:'msg',time:2});
return false;		
}
}
if((type=='pay_see'||type=='vip_see'||type=='login_see'||type=='comment_see') && $('.jinsom-publish-words-form .download-box').length==0){
hide_content=tinymce.get('jinsom-publish-single-hide-textarea').getContent();
hide_content=hide_content.replace(RegExp("&","g"),"!`!");
if(hide_content==''){
layer.open({content:'请输入隐藏的内容！',skin:'msg',time:2});
return false;
}
}



data=$("#jinsom-publish-form").serialize();
if($('.jinsom-publish-words-form .topic span').length>0){
topic='&topic=';
$('.jinsom-publish-words-form .topic span').each(function(){
topic_str=$(this).attr('data');
topic_str=topic_str.replace(RegExp("&","g"),"#!");
topic+=topic_str+',';
});
topic=topic.substr(0,topic.length-1);
data=data+topic;
}

if($('#jinsom-publish-images-list li').length>0){
img='&img=';
$('#jinsom-publish-images-list li').each(function(){
img+=$(this).children('a').html()+'</br>';
});
data=data+img;
}


//下载
if($('.jinsom-publish-words-form .download-box').length>0){
download_data='';
$('.download-box .li').each(function(){
download_data+=$(this).find('.download-url').val()+'|';
download_data+=$(this).find('.download-pass-a').val()+'|';
download_data+=$(this).find('.download-pass-b').val()+',';
});
download_data=download_data.substring(0,download_data.length-1);
data=data+'&download_data='+download_data;
}

data+='&content='+content;
if(type=='pay_see'||type=='vip_see'||type=='login_see'||type=='comment_see'){
if($('#jinsom-publish-single-hide-textarea').length>0){
data+='&hide-content='+hide_content;
}
}

// console.log(data);
myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/publish/bbs.php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

$('[data-page="publish"] .navbar .right a').removeAttr('onclick');
window.localStorage.removeItem('single_autosave_draft');
window.localStorage.removeItem('single_hide_autosave_draft');
window.localStorage.removeItem('single_autosave_time');
window.localStorage.removeItem('single_hide_autosave_time');

ws.send('{"from_url":"'+jinsom.home_url+'","type":"new_posts","do_user_id":"'+jinsom.user_id+'"}');
if(msg.at_user_id){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"at","notice_user_id":"'+msg.at_user_id+'","do_user_id":"'+jinsom.user_id+'"}');
}

$(".jinsom-publish-words-form .content textarea").val('');
$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容
function d(){myApp.getCurrentView().router.back();}setTimeout(d,2500);
function e(){myApp.getCurrentView().router.refreshPage();}setTimeout(e,3000);
}else if(msg.code==5){
function a(){jinsom_publish_add_topic_form();}setTimeout(a,1500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}else if(msg.code==3){//打开开通会员页面
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);
}

}
});  


}



//参与话题
function jinsom_join_topic(topic_name){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
//添加唯一标识
$('.jinsom-publish-type-form').addClass('topic-publish');

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/publish/topic-power.php",
data:{topic_name:topic_name},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
myApp.popup('.jinsom-publish-type-form');

}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});

//移除唯一标识
$('.jinsom-publish-type-form').on('popup:close', function () {
function d(){
if(!$('.jinsom-publish-type-form').hasClass('modal-in')){
$('.jinsom-publish-type-form').removeClass('topic-publish');
}
}setTimeout(d,450);
});


}


//提交发红包
function jinsom_publish_redbag(){
credit=$('#jinsom-publish-redbag-credit').val();
number=$('#jinsom-publish-redbag-number').val();
type=$('.jinsom-publish-redbag-form .type>li.on').attr('data');
content=$('#jinsom-publish-redbag-content').val();
redbag_cover=$('.jinsom-publish-redbag-form .img-list li.on').index();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/publish/redbag.php",
data:{credit:credit,number:number,type:type,content:content,redbag_cover:redbag_cover},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"new_posts","do_user_id":"'+jinsom.user_id+'","content":"redbag"}');

$('.jinsom-home-menu li.on').addClass('no-voice').click();//重新加载内容
function d(){myApp.getCurrentView().router.back();}
setTimeout(d,2500);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}
}
}); 


}




//发布匿名
function jinsom_publish_secret(ticket,randstr){
if($.trim($(".jinsom-publish-words-form .content textarea").val())==''){
layer.open({content:'请输入内容！',skin:'msg',time:2});
return false;	
}
data=$("#jinsom-publish-form").serialize();

//标签
if($('.jinsom-publish-secret-type-list li.on').length>0){
topic='&topic='+$('.jinsom-publish-secret-type-list li.on').text();
data=data+topic;
}


myApp.showIndicator();
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/publish/secret.php",
data:data+'&ticket='+ticket+'&randstr='+randstr,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$('.jinsom-publish-words-form .content textarea').val('');
type=$('.jinsom-secret-menu li.on').attr('type');
jinsom_secret_post(type,'reload',this);
function d(){myApp.getCurrentView().router.back();}setTimeout(d,1800);
}else if(msg.code==2){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-phone.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-email.php'});
}else if(msg.code==3){
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,2000);
}

}
});  

}



//发布权限
function jinsom_publish_power_form(){
layer.open({
type: 1,
content: $('.jinsom-publish-power-list-form').html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;border:none;border-radius: 2vw 2vw 0 0;'
});	
}

//添加应用
function jinsom_publish_add_application(){
layer.open({
type: 1,
content: $('.jinsom-publish-add-application-form').html(),
anim: 'up',
style: 'position:fixed;bottom:0;left:0;width:100%;border:none;border-radius: 2vw 2vw 0 0;'
});	
}

//发表添加话题
function jinsom_publish_add_topic_form(){
myApp.popup('.jinsom-publish-topic-popup');	
}


//打开多个论坛发布的合集
function jinsom_publish_multiple_bbs(type,data){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
if(type=='follow-bbs'||type=='commend-bbs'||type=='m_bbs'){
myApp.closeModal();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/bbs-publish-list.php?type='+type+'&data='+data});
return false;
}
}
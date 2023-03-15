

//打开单人聊天模式
function jinsom_open_user_chat(user_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}

$('.jinsom-group-user-info').remove();//资料卡片打开IM聊天

//计算提醒数量
if($(obj).children('.jinsom-chat-list-tips').length>0){
current_tips=parseInt($(obj).children('.jinsom-chat-list-tips').text());
all_tips=parseInt($('.jinsom-right-bar-im .number').text());
last_tips=all_tips-current_tips;
if(last_tips>0){
$('.jinsom-right-bar-im .number').text(last_tips);
}else{
$('.jinsom-right-bar-im .number').remove();	
}
$(obj).children('.jinsom-chat-list-tips').remove();//移除提醒
}

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/chat-info.php",
data: {author_id:user_id,type:'one'},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
status=msg.status;	
name=msg.nickname;
desc=msg.desc;
avatar=msg.avatar;

if($('.jinsom-chat-user-window').length==0){//防止重复打开窗口
layer.open({
type:1,
anim: 5,
skin: 'jinsom-chat-user-window',
area: ['600px', '540px'],
title: ' ',
shade: 0,
maxmin: true,
// zIndex: layer.zIndex,
resizing: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
$('.jinsom-chat-message-list').css('height',content_height);
},
full: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
$('.jinsom-chat-message-list').css('height',content_height);	
},
restore: function(layero){
$('.jinsom-chat-user-window').css({"top":"50px","bottom":"0","height":540});
$('.jinsom-chat-message-list').css('height',250);

},
content: msg.main

});  
}




//==================渲染=========================
$('.jinsom-chat-windows-footer-bar.one').html(msg.tool);

//上传图片
// $('.jinsom-chat-windows-footer-bar.one .image').remove();//先移除原始模块
// $('.jinsom-chat-windows-footer-bar.one .smile').after('<span class="image jinsom-icon jinsom-tupian1"></span>');//重新添加模块
jinsom_im_upload_one(user_id);

$('.jinsom-chat-user-window .jinsom-chat-windows-user-header').remove();
$('.jinsom-chat-user-window').append('<div class="jinsom-chat-windows-user-header chat-one" data="'+user_id+'"><div class="jinsom-chat-windows-user-avatar"><a href="'+msg.user_link+'" target="_blank">'+avatar+'</a></div><div class="jinsom-chat-windows-user-info"><div class="jinsom-chat-windows-user-name">'+name+'</div><span class="jinsom-chat-online-status">'+status+'</span><div class="jinsom-chat-windows-user-desc">'+desc+'</div>	</div></div>');
$('.jinsom-chat-message-list').html(msg.messages_list); 
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight); 

//图片加载完毕执行
$(".jinsom-chat-message-list-content img").on('load',function(){
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight);
} );


$('.jinsom-chat-message-list').scroll(function(){
contentH =$(this).get(0).scrollHeight;//内容高度
scrollTop =$(this).scrollTop();//滚动高度
// console.log(contentH-scrollTop);
if(contentH-scrollTop>1000){
$('.jinsom-msg-tips').show();
}else{
$('.jinsom-msg-tips').hide();	
}
if(contentH-scrollTop<400){
$('.jinsom-msg-tips').text('底部');	
}
});



}else{
layer.msg(msg.msg);
}
}
});//获取IM聊天信息





}





//打开群组聊天模式
function jinsom_open_group_chat(bbs_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
	
$('#jinsom-chat-group-'+bbs_id+'.top .jinsom-chat-list-tips').remove();//移除消息提醒

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/chat-info.php",
data: {bbs_id:bbs_id,type:'group'},
success: function(msg){
layer.closeAll('loading');

if(msg.code==1){
notice=msg.notice;
name=msg.name;
desc=msg.desc;
avatar=msg.avatar;
number=msg.number;

if($('.jinsom-chat-group-window').length==0){//防止重复打开窗口
layer.open({
type:1,
anim: 5,
skin: 'jinsom-chat-group-window',
area: ['750px', '540px'],
title: ' ',
shade: 0,
maxmin: true,
resizing: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
right_height=459+add_height;
$('.jinsom-chat-windows-right').css('height',right_height);
$('.jinsom-chat-message-group-list').css('height',content_height);
},
full: function(layero){
chat_window_height=layero.height();
add_height=chat_window_height-540;
content_height=250+add_height;
right_height=459+add_height;
$('.jinsom-chat-windows-right').css('height',right_height);
$('.jinsom-chat-message-group-list').css('height',content_height);	
},
restore: function(layero){
$('.jinsom-chat-group-window').css({"top":"50px","bottom":"0","height":540});
$('.jinsom-chat-message-group-list').css('height',250);
$('.jinsom-chat-windows-right').css('height',459);
},
end: function(layero){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat_group_back","do_user_id":"'+jinsom.user_id+'","bbs_id":"'+bbs_id+'","do_user_name":"'+jinsom.nickname_base+'"}');
},
content: 
'<div class="jinsom-chat-windows-left">'+
'<div class="jinsom-chat-message-group-list" data-no-instant></div>'+
'<div class="jinsom-chat-windows-footer"><div class="jinsom-msg-tips" onclick=\'jinsom_im_tips(this,"group")\'>底部</div>'+
'<div class="jinsom-chat-windows-footer-bar group clear">'+
'<span onclick=\'jinsom_smile(this,"im-group","")\' class="jinsom-icon smile jinsom-weixiao-"></span>'+
'<span class="image jinsom-icon jinsom-tupian1"></span>'+
'<span class="jinsom-upload-group-img-loading"></span>'+
'</div>'+
'<textarea class="jinsom-chat-textarea-group"></textarea>'+
'<div class="jinsom-chat-windows-footer-send clear">'+
'<div class="jinsom-chat-send-message-btn-group opacity" onclick="jinsom_send_group_msg()">发送</div>'+
'</div></div></div>'+
'<div class="jinsom-chat-windows-right">'+
'<div class="jinsom-chat-group-notice">'+
'<div class="jinsom-chat-group-notice-title">群公告</div>'+
'<div class="jinsom-chat-group-notice-desc"></div>'+
'</div>'+
'<div class="jinsom-chat-group-user">'+
'<div class="jinsom-chat-group-user-number">群成员 <span></span></div>'+
'<div class="jinsom-chat-group-user-list"></div>'+
'</div></div>'
});  

}




//上传图片
$('.jinsom-chat-windows-footer-bar.group .image').remove();//先移除原始模块
$('.jinsom-chat-windows-footer-bar.group .smile').after('<span class="image jinsom-icon jinsom-tupian1"></span>');//重新添加模块
jinsom_im_upload_group(bbs_id);



$('.jinsom-chat-group-window .jinsom-chat-windows-user-header').remove();
$('.jinsom-chat-group-window').append('<div class="jinsom-chat-windows-user-header chat-group" data="'+bbs_id+'"><div class="jinsom-chat-windows-user-avatar">'+avatar+'</div><div class="jinsom-chat-windows-user-info"><div class="jinsom-chat-windows-user-name">'+name+'</div><div class="jinsom-chat-windows-user-desc">'+desc+'</div>	</div></div>');
$('.jinsom-chat-group-notice-desc').html(notice);
$('.jinsom-chat-group-user-number span').html('（'+number+'人）');
$('#jinsom-upload-group-bbs-id').val(bbs_id);



$('.jinsom-chat-message-group-list').html(msg.messages_list); 
$('.jinsom-chat-message-group-list').scrollTop($('.jinsom-chat-message-group-list')[0].scrollHeight);

//图片加载完毕执行
$(".jinsom-chat-message-list-content img").on('load',function(){
$('.jinsom-chat-message-group-list').scrollTop($('.jinsom-chat-message-group-list')[0].scrollHeight);
});


$('.jinsom-chat-group-user-list').html(msg.user_list);//右侧栏用户列表


$('.jinsom-chat-message-group-list').scroll(function(){
contentH =$(this).get(0).scrollHeight;//内容高度
scrollTop =$(this).scrollTop();//滚动高度
// console.log(contentH-scrollTop);
if(contentH-scrollTop>1000){
$('.jinsom-msg-tips').show();
}else{
$('.jinsom-msg-tips').hide();	
}
if(contentH-scrollTop<400){
$('.jinsom-msg-tips').text('底部');	
}
});


ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat_group_join","do_user_id":"'+jinsom.user_id+'","bbs_id":"'+bbs_id+'","do_user_name":"'+jinsom.nickname_base+'","chat_group_join_text":"'+jinsom.chat_group_join_text+'"}');



}else{
layer.msg(msg.msg);
}


}


});//获取群聊信息


}





//群聊显示用户资料卡片
function jinsom_chat_group_show_user_info(author_id,obj){
this_dom=obj;
if($('.jinsom-group-user-info').length==0){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.module_url+"/stencil/info-card.php",
data: {author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type:1,
zIndex: 9999999999,
area: ['375px', '265px'],
shade: 0,
skin: 'jinsom-group-user-info',
move: '.jinsom-info-card-bg',
content: msg
}); 
}
});	
}else{
layer.closeAll('loading');
layer.msg('请关闭另外一个资料卡');
return false;	
}
}


//加入群聊
function jinsom_join_group_chat(bbs_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
if(jinsom.is_black){
layer.msg('你是黑名单用户，禁止互动操作！');	
return false;
}
$(obj).html('<i class="fa fa-spinner fa-spin"></i> 进入中...');
$.ajax({
type: "POST",
url:jinsom.module_url+"/jinsom-join-group-chat.php",
data: {bbs_id:bbs_id},
success: function(msg){
$(obj).html('加入群聊');
if(msg==1){
jinsom_open_group_chat(bbs_id);
}else if(msg==2){
layer.msg('请先关注'+jinsom.bbs_name+'才允许加入群聊！');	
}else if(msg==3){
jinsom_pop_login_style();
}
}
});	
}


//发送单对单聊天消息
function jinsom_send_msg(){
author_id=$('.jinsom-chat-windows-user-header.chat-one').attr('data');
content= $('.jinsom-chat-textarea').val();
if($.trim(content)==''){
layer.msg('请输入内容！');
return false;  
}

smile_add_arr=$.parseJSON(jinsom.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+jinsom.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+jinsom.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}
$('.jinsom-chat-message-list').append('<li class="myself"><div class="jinsom-chat-message-list-user-info avatarimg-'+jinsom.user_id+'">'+jinsom.avatar+'</div><div class="jinsom-chat-message-list-content">'+content_a+'</div></li>');
$('.jinsom-chat-textarea').val('');
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight);
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/msg.php",
data: {author_id:author_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.jinsom-chat-message-list .myself').last().children('.jinsom-chat-message-list-content').prepend('<i class="jinsom-icon error jinsom-shibai" title="'+msg.msg+'"></i>');
$('.jinsom-chat-message-list').append('<p class="jinsom-chat-message-list-join error"><span>'+msg.msg+'</span></p>');
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight);
if(msg.code==3){//弹窗开通会员
function c(){jinsom_recharge_vip_form();}setTimeout(c,1500);
}
}else if(msg.code==1){//聊天隐私


ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_name":"'+jinsom.nickname_base+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');

if($('.jinsom-chat-content-recent-user #jinsom-chat-'+author_id).length>0){//当前会话置顶
$('.jinsom-chat-content-recent-user .jinsom-group-top-br').after($('.jinsom-chat-content-recent-user #jinsom-chat-'+author_id));
$('#jinsom-chat-'+author_id+' .msg').text(content);
}

if(msg.im_privacy==1){
$('.jinsom-chat-message-list').append('<p class="jinsom-chat-message-list-join error"><span>'+msg.im_privacy_tips+'</span></p>');
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight);
}
}
}
});
}


//发送群聊消息
function jinsom_send_group_msg(){
bbs_id=$('.jinsom-chat-group-window .jinsom-chat-windows-user-header').attr('data');
content= $('.jinsom-chat-textarea-group').val();
if($.trim(content)==''){
layer.msg('请输入内容！');
return false;  
}
smile_add_arr=$.parseJSON(jinsom.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+jinsom.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+jinsom.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}
$('.jinsom-chat-message-group-list').append('<li class="myself"><div class="jinsom-chat-message-list-user-info avatarimg-'+jinsom.user_id+'">'+jinsom.avatar+'</div><div class="jinsom-chat-message-list-content">'+content_a+'</div></li>');
$('.jinsom-chat-textarea-group').val('');
$('.jinsom-chat-message-group-list').scrollTop($('.jinsom-chat-message-group-list')[0].scrollHeight);
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/msg-group.php",
data: {bbs_id:bbs_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.jinsom-chat-message-group-list .myself').last().children('.jinsom-chat-message-list-content').prepend('<i class="jinsom-icon error jinsom-shibai" title="'+msg.msg+'"></i>');
$('.jinsom-chat-message-group-list').append('<p class="jinsom-chat-message-list-join error"><span>'+msg.msg+'</span></p>');
$('.jinsom-chat-message-group-list').scrollTop($('.jinsom-chat-message-group-list')[0].scrollHeight);
if(msg.code==3){//弹窗开通会员
function c(){jinsom_recharge_vip_form();}setTimeout(c,1500);
}
}else if(msg.code==1){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat_group","do_user_id":"'+msg.do_user_id+'","bbs_id":"'+msg.bbs_id+'","group_type":"'+msg.group_type+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'","notice_user_name":"'+jinsom.nickname_base+'"}');

//机器人
if(msg.rebot_name){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat_group","do_user_id":"'+msg.rebot_user_id+'","bbs_id":"'+bbs_id+'","message":"'+jinsom_htmlspecialchars_decode(msg.rebot_message)+'","do_user_avatar":"'+msg.rebot_avatar+'","do_user_name":"'+msg.rebot_name+'","content":"'+msg.rebot_insert_id+'"}');
}

}	
}
});	
}


// IM发送图片==单对单
function jinsom_im_upload_one(author_id){
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.jinsom-chat-windows-footer-bar.one .image',
url:jinsom.jinsom_ajax_url+'/upload/im-one.php',
data:{author_id:author_id},
multiple:true,
accept:'file',
before: function(obj){
layer.load(1);
},
done: function(msg, index, upload){
layer.closeAll('loading');
if(msg.code == 1){
$('.jinsom-chat-message-list').append('<li class="myself"><div class="jinsom-chat-message-list-user-info avatarimg-'+jinsom.user_id+'">'+jinsom.avatar+'</div><div class="jinsom-chat-message-list-content">'+msg.img+'</div></li>');
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight);
//图片加载完毕执行
$(".jinsom-chat-message-list-content img").on('load',function(){
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight);
});


ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_name":"'+jinsom.nickname_base+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');

if($('#jinsom-chat-'+author_id).length>0){//当前会话置顶
$('.jinsom-chat-content-recent-user .jinsom-group-top-br').after($('#jinsom-chat-'+author_id));
$('#jinsom-chat-'+author_id+' .msg').text('[图片]');
}

}else if(msg.code == 4){
jinsom_msg(msg.msg);
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(msg.code == 5){
jinsom_msg(msg.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else{
layer.msg(msg.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
layer.closeAll('loading');
}
});
});
}

// IM发送图片==群组
function jinsom_im_upload_group(bbs_id){
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.jinsom-chat-windows-footer-bar.group .image',
url:jinsom.jinsom_ajax_url+'/upload/im-group.php',
data:{bbs_id:bbs_id},
multiple:true,
accept:'file',
before: function(obj){
layer.load(1);
},
done: function(msg, index, upload){
layer.closeAll('loading');
if(msg.code == 1){
$('.jinsom-chat-message-group-list').append('<li class="myself"><div class="jinsom-chat-message-list-user-info avatarimg-'+jinsom.user_id+'">'+jinsom.avatar+'</div><div class="jinsom-chat-message-list-content">'+msg.img+'</div></li>');
$('.jinsom-chat-message-group-list').scrollTop($('.jinsom-chat-message-group-list')[0].scrollHeight);
//图片加载完毕执行
$(".jinsom-chat-message-list-content img").on('load',function(){
$('.jinsom-chat-message-group-list').scrollTop($('.jinsom-chat-message-group-list')[0].scrollHeight);
});


ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat_group","do_user_id":"'+msg.do_user_id+'","bbs_id":"'+msg.bbs_id+'","group_type":"'+msg.group_type+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'","notice_user_name":"'+jinsom.nickname_base+'"}');


}else if(msg.code == 4){
jinsom_msg(msg.msg);
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(msg.code == 5){
jinsom_msg(msg.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else{
layer.msg(msg.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
layer.closeAll('loading');
}
});
});
}


//下拉
function jinsom_im_tips(obj,type){
$(obj).hide().html('底部');
if(type=='one'){
$('.jinsom-chat-message-list').scrollTop($('.jinsom-chat-message-list')[0].scrollHeight);
}else{
$('.jinsom-chat-message-group-list').scrollTop($('.jinsom-chat-message-group-list')[0].scrollHeight);
}
}



//打开右侧IM列表
function jinsom_open_im_list(){
$(".jinsom-chat").animate({right:'0px'},280);
if($('.jinsom-chat-content-recent-user').hasClass('had')){return false;}
$('.jinsom-chat-content-recent-user,.jinsom-chat-content-follow-user,.jinsom-chat-content-group').html(jinsom.loading_post);
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/chat-list.php",
data:{type:'all'},
success: function(msg){
if(msg.code==1){
$('.jinsom-chat-content-recent-user').html(msg.recent).addClass('had');  
$('.jinsom-chat-content-group').html(msg.group); 
$('.jinsom-chat-content-follow-user').html(msg.follow); 
}
}
});
}

//关闭右侧IM列表
function jinsom_close_im_list(){
$(".jinsom-chat").animate({right:'-280px'},280);
}
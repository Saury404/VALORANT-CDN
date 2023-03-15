var jinsom_user_chat_ajax = null,jinsom_user_chat_group_ajax = null; 

//点击发送消息-单对单
function jinsom_send_msg(author_id){
content= $('#jinsom-msg-content').val();
if($.trim(content)==''){
$('#jinsom-msg-content').val('');
return false;  
}
content_a=content;
smile_add_arr=$.parseJSON(jinsom.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+jinsom.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+jinsom.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}

content_a=content_a.replace(/\n/g,"<br/>");

$('.jinsom-chat-list').append('<li class="myself"><div class="jinsom-chat-message-list-user-info avatarimg-'+jinsom.user_id+'">'+jinsom.avatar+'</div><div class="jinsom-chat-message-list-content">'+content_a+'</div></li>');
$('#jinsom-msg-content').val('');
$('.jinsom-chat-list-content').scrollTop($('.jinsom-chat-list-content')[0].scrollHeight);

$('.messagebar.messagebar-init').css('height','12vw');
$('#jinsom-msg-content').css('height','8vw');
$('.jinsom-msg-tips').hide();

$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/msg.php",
data: {author_id:author_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.jinsom-chat-list .myself').last().children('.jinsom-chat-message-list-content').prepend('<i class="jinsom-icon jinsom-shibai error"></i>');
$('.jinsom-chat-list').append('<p class="jinsom-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.jinsom-chat-list-content').scrollTop($('.jinsom-chat-list-content')[0].scrollHeight);
if(msg.code==3){
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);	
}
}else if(msg.code==1){//发送成功

ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_name":"'+jinsom.nickname_base+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');

//更新最近列表
$('#jinsom-chat-user-'+author_id).remove();
$('.jinsom-group-top-br').after(msg.notice_list);



if(msg.im_privacy==1){//聊天隐私
$('.jinsom-chat-list').append('<p class="jinsom-chat-message-tips error"><span>'+msg.im_privacy_tips+'</span></p>');
$('.jinsom-chat-list-content').scrollTop($('.jinsom-chat-list-content')[0].scrollHeight);
}
}
}
});

}



//打开单对单聊天
function jinsom_open_user_chat(author_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

// if(author_id==jinsom.user_id){
// layer.open({content:'你不能给自己发起聊天！',skin:'msg',time:2});
// return false;	
// }


if($('[data-page="chat-one"]').length>0){
layer.open({content:'只能同时打开一个单人聊天，请返回！',skin:'msg',time:2});
return false;	
}


if($(obj).attr('goods')){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/chat-one.php?author_id='+author_id+'&goods='+$(obj).attr('goods')});
}else{
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/chat-one.php?author_id='+author_id});
}
}

//打开群聊
function jinsom_open_group_chat(bbs_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
if($('[data-page="chat-group"]').length>0){
layer.open({content:'只能同时打开一个群聊，请返回！',skin:'msg',time:2});
return false;	
}
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/chat-group.php?bbs_id='+bbs_id});
$('#jinsom-chat-group-'+bbs_id+' .tips').remove();
}


//打开购买入场特效界面
function jinsom_open_group_chat_join_buy(){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/chat-group-join-buy.php'});
}

//购买入场特效
function jinsom_group_join_buy(id,obj){
layer.open({
content: '你确定要购买吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/chat/group-join-do.php",
data: {id:id,type:'buy'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
jinsom.chat_group_join_text=msg.content;
$(obj).removeAttr('onclick').text('已购买').addClass('had');
}else if(msg.code==3){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});
}else if(msg.code==4){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});
}
}
});
layer.close(index);
}
});
}

//使用入场特效
function jinsom_group_join_use(id,obj){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/chat/group-join-do.php",
data: {id:id,type:'use'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
$(obj).text('使用中').addClass('had').parents('li').siblings().find('.btn').removeClass('had').text('使用');
jinsom.chat_group_join_text=msg.content;
}
}
});
}


//点击发送消息-群聊
function jinsom_send_msg_group(bbs_id){
content= $('#jinsom-msg-group-content').val();
if($.trim(content)==''){
$('#jinsom-msg-group-content').val('');
return false;  
}

smile_add_arr=$.parseJSON(jinsom.smile_add);
if(smile_add_arr){
content_a=content.replace(/\[s\-(\d+)\]/g,'<img src="'+jinsom.smile_url+smile_add_arr[0]['smile_url']+'/$1.png" class="wp-smiley">');
content_a=content_a.replace(/\[s\-(\d+)\-(\d+)\]/g,function(){var args=arguments;return '<img src="'+jinsom.smile_url+smile_add_arr[(args[1]-1)]['smile_url']+'/'+args[2]+'.png" class="wp-smiley">'});
}else{
content_a=content;
}
content_a=content_a.replace(/\n/g,"<br/>");//换行

$('.jinsom-chat-group-list').append('<li class="myself ing"><div class="jinsom-chat-message-list-user-info avatarimg-'+jinsom.user_id+'">'+jinsom.avatar+'</div><div class="jinsom-chat-message-list-content" copy="'+content+'">'+content_a+'</div></li>');
$('#jinsom-msg-group-content').val('');
$('.jinsom-chat-group-list-content').scrollTop($('.jinsom-chat-group-list-content')[0].scrollHeight);

$('.messagebar.messagebar-init').css('height','12vw');
$('#jinsom-msg-group-content').css('height','8vw');
$('.jinsom-msg-tips').hide();

$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/msg-group.php",
data: {bbs_id:bbs_id,content:content},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.jinsom-chat-group-list .myself').last().children('.jinsom-chat-message-list-content').prepend('<i class="jinsom-icon jinsom-shibai error"></i>');
$('.jinsom-chat-group-list').append('<p class="jinsom-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.jinsom-chat-group-list-content').scrollTop($('.jinsom-chat-group-list-content')[0].scrollHeight);
if(msg.code==3){
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);	
}
$('.jinsom-chat-group-list .ing').first().removeClass('ing');
}else if(msg.code==1){
$('.jinsom-chat-group-list .ing').first().attr('id','jinsom-chat-content-'+msg.id);
$('.jinsom-chat-group-list .ing').first().find('.jinsom-chat-message-list-content').attr('onclick','jinsom_chat_content_more('+msg.id+','+jinsom.user_id+','+bbs_id+')');
$('.jinsom-chat-group-list .ing').first().removeClass('ing');
ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat_group","do_user_id":"'+msg.do_user_id+'","bbs_id":"'+msg.bbs_id+'","group_type":"'+msg.group_type+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'","content":"'+msg.id+'","notice_user_name":"'+jinsom.nickname_base+'"}');

//机器人
if(msg.rebot_name){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat_group","do_user_id":"'+msg.rebot_user_id+'","bbs_id":"'+bbs_id+'","message":"'+jinsom_htmlspecialchars_decode(msg.rebot_message)+'","do_user_avatar":"'+msg.rebot_avatar+'","do_user_name":"'+msg.rebot_name+'","content":"'+msg.rebot_insert_id+'","notice_user_name":"'+msg.rebot_name_base+'"}');
}

}

}
});

}



//加入群聊
function jinsom_join_group_chat(bbs_id,obj){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
if(jinsom.is_black){
layer.open({content:'你是黑名单用户，禁止互动操作！',skin:'msg',time:2});
return false;
}
$.ajax({
type: "POST",
url:jinsom.module_url+"/jinsom-join-group-chat.php",
data: {bbs_id:bbs_id},
success: function(msg){
if(msg==1){
jinsom_open_group_chat(bbs_id);
}else if(msg==2){
layer.open({content:'请先关注'+jinsom.bbs_name+'才允许加入群聊！',skin:'msg',time:2});
}else if(msg==3){
jinsom_login_page();
}
}
});	
}



//发送商品消息
function jinsom_send_msg_goods(post_id,author_id,obj){
if(!$(obj).hasClass('had')){
$(obj).addClass('had').text('已发送');
content_a='商品：<a class="back">'+$(obj).prev().children('.title').text()+'</a>';
$('.jinsom-chat-list').append('<li class="myself"><div class="jinsom-chat-message-list-user-info avatarimg-'+jinsom.user_id+'">'+jinsom.avatar+'</div><div class="jinsom-chat-message-list-content">'+content_a+'</div></li>');
$('.jinsom-chat-list-content').scrollTop($('.jinsom-chat-list-content')[0].scrollHeight);
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/msg.php",
data: {post_id:post_id,author_id:author_id},
success: function(msg){
if(msg.code==0||msg.code==3){
$('.jinsom-chat-list .myself').last().children('.jinsom-chat-message-list-content').prepend('<i class="jinsom-icon jinsom-shibai error"></i>');
$('.jinsom-chat-list').append('<p class="jinsom-chat-message-tips error"><span>'+msg.msg+'</span></p>');
$('.jinsom-chat-list-content').scrollTop($('.jinsom-chat-list-content')[0].scrollHeight);
if(msg.code==3){
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});}setTimeout(c,1500);	
}
}else if(msg.code==1){//聊天隐私


ws.send('{"from_url":"'+jinsom.home_url+'","type":"chat","notice_user_id":"'+author_id+'","do_user_id":"'+msg.do_user_id+'","do_user_avatar":"'+msg.do_user_avatar+'","do_user_name":"'+msg.do_user_name+'","content":"'+msg.content+'","message":"'+msg.message+'","do_user_avatar":"'+msg.do_user_avatar+'"}');


if(msg.im_privacy==1){
$('.jinsom-chat-list').append('<p class="jinsom-chat-message-tips error"><span>'+msg.im_privacy_tips+'</span></p>');
$('.jinsom-chat-list-content').scrollTop($('.jinsom-chat-list-content')[0].scrollHeight);
}
}
}
});
}
}


//撤回 复制
function jinsom_chat_content_more(id,user_id,bbs_id){
buttons=[
{text:'复制',onClick:function(){

clipboard = new ClipboardJS('#jinsom-chat-copy');
clipboard.on('success', function(e) {
e.clearSelection();
layer.open({content:'复制成功！',skin:'msg',time:2});
});

}},
{text:'@Ta',onClick:function(){

name=$('#jinsom-chat-content-'+id).find('font').text();
if(name){
content=$("#jinsom-msg-group-content");
content.val(content.val()+'@'+name+' ').focus();	
}

}},
{text:'撤回',onClick:function(){

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/chat-do.php",
data:{id:id,bbs_id:bbs_id,type:'che'},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
name=$('#jinsom-chat-content-'+id).find('font').text();
if(user_id==jinsom.user_id){
$('#jinsom-chat-content-'+id).after('<p class="jinsom-chat-message-tips"><span><n>你</n>撤回了一条消息</span></p>');
$('#jinsom-chat-content-'+id).remove();
}else{
$('#jinsom-chat-content-'+id).after('<p class="jinsom-chat-message-tips"><span><n>你</n>撤回了<n>'+name+'</n>的一条消息</span></p>');
$('#jinsom-chat-content-'+id).remove();
}

ws.send('{"from_url":"'+jinsom.home_url+'","type":"group_che","bbs_id":"'+bbs_id+'","notice_user_id":"'+user_id+'","notice_user_name":"'+name+'","do_user_id":"'+jinsom.user_id+'","do_user_name":"'+jinsom.nickname_base+'","message":"'+id+'"}');


}else{
layer.open({content:msg.msg,skin:'msg',time:2});
}
}
});

}},
{text:'禁言/撤销禁言',onClick:function(){

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.module_url+"/chat/chat-do.php",
data:{id:id,bbs_id:bbs_id,type:'stop'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){

}
}
});

}},
{text:'取消',color: 'red'},
];

if(!jinsom.is_admin_x||(jinsom.is_admin_x&&user_id==jinsom.user_id)){
buttons.splice(3,1);	
}

if(user_id!=jinsom.user_id&&!jinsom.is_admin_x){
buttons.splice(2,1);
}

if(user_id==jinsom.user_id){
buttons.splice(1,1);	
}

if($('#jinsom-chat-content-'+id+' .jinsom-chat-message-list-content .jinsom-group-img').length>0){
buttons.splice(0,1);
}

myApp.actions(buttons);

$('.actions-modal-button').first().attr('id','jinsom-chat-copy');
$('.actions-modal-button').first().attr('data-clipboard-text',$('#jinsom-chat-content-'+id+' .jinsom-chat-message-list-content').attr('copy'));


}
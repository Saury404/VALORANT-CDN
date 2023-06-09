function jinsom_msg(content){
layer.msg(content);
}

//置顶内容：全局置顶==板块置顶==主页置顶==推荐==加精
function jinsom_sticky(post_id,bbs_id,type,obj){
layer.confirm('你确定要'+$(obj).html()+'吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/commend-post.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1||msg.code==2){
$(obj).html(msg.html);
}else if(msg.code==3){//弹窗开通会员
function c(){jinsom_recharge_vip_form();}setTimeout(c,1500);
}
}
});
});
}


//电脑签到
function jinsom_sign(ticket,randstr,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1); 
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/sign.php",
data: {sign:1,ticket:ticket,randstr:randstr},
dataType:'json',
success: function(msg){ 
layer.closeAll('loading');
if(msg.code==0){//签到失败
layer.msg(msg.msg);
}else if(msg.code==1||msg.code==2){//签到成功
audio=document.getElementById('jinsom-sign-music');
audio.play();
if(msg.code==2){
layer.msg(msg.msg);
}else{
layer.open({
title:false,
type: 1,
skin:'jinsom-sign-success-form',
area: ['300px','auto'],
resize:false,
content: msg.content
});
}
$(obj).addClass('had').html(msg.text);
$('.jinsom-sign-page-all-days span').html(msg.sign_c);
month_day=parseInt($('.jinsom-sign-page-month-days span').text());
$('.jinsom-sign-page-month-days span').html(month_day+1);
$('.jinsom-sign-page-content tbody td.today').removeClass('no-sign').addClass('had-sign').children('span').append('<i class="jinsom-icon jinsom-dagou"></i>');
$('#sign-1').after($('#sign-1').clone());
$('.jinsom-sidebar-user-info .sign,.jinsom-sign-page-btn').first().remove();
}else if(msg.code==9){//绑定邮箱
layer.msg(msg.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else if(msg.code==8){//弹出绑定手机号
layer.msg(msg.msg);
function d(){jinsom_update_phone_form(msg.user_id);}setTimeout(d,2000);
}
}
});
return false;
}

//补签表单
function jinsom_sign_add_form(day){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/sign-add.php",
data:{day:day},
success: function(msg){
layer.closeAll(); 
layer.open({
title:false,
btn: false,
skin:'jinsom-sign-add-form',
area: ['300px','auto'],
resize:false,
content:msg
})
}
});
}

//补签
function jinsom_sign_add(day){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/sign-add.php",
data:{day:day},
success: function(msg){
layer.closeAll(); 
if(msg.code==1){
layer.open({
title:false,
type: 1,
skin:'jinsom-sign-success-form',
area: ['300px','auto'],
resize:false,
content: msg.content
});

//前端渲染
$('.jinsom-sign-page-all-days span').html(msg.sign_c);
month_day=parseInt($('.jinsom-sign-page-month-days span').text());
$('.jinsom-sign-page-month-days span').html(month_day+1);
$('#jinsom-sign-day-'+day).removeClass('no-sign').addClass('had-sign').children('span').html(day+'<i class="jinsom-icon jinsom-dagou"></i>');

}else{
layer.msg(msg.msg);
}
}
});
}


//查看签到宝箱
function jinsom_sign_treasure_form(number){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/sign-treasure.php",
data:{number:number},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
fixed: false,
skin:'jinsom-sign-treasure-form',
area: ['300px','auto'],
resize:false,
content: msg
});
}
});	
}


//领取宝箱奖励
function jinsom_sign_treasure(number,obj){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/sign-treasure.php",
data:{number:number},
success: function(msg){
layer.closeAll(); 
if(msg.code==1){

audio=document.getElementById('jinsom-sign-music');
audio.play();

layer.open({
title:false,
type: 1,
skin:'jinsom-sign-success-form',
area: ['300px','auto'],
resize:false,
content: msg.content
});

//前端渲染
$(obj).addClass('had').html('已领取').parents('li').removeClass('shake');

}else{
layer.msg(msg.msg);
}
}
});
}


//弹出推广规则说明表单
function jinsom_referral_info(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/referral-info.php",
success: function(msg){
layer.closeAll(); 
layer.open({
title:'推广规则说明',
btn: false,
area: ['550px','auto'],
resize:false,
content: msg
})
}
}); 
}


//更新论坛设置信息
function jinsom_update_bbs_setting(){

enabled='';
disabled='';
$('#jinsom-bbs-menu-setting-1 li').each(function(){
enabled+=$(this).attr('data')+',';
});
$('#jinsom-bbs-menu-setting-2 li').each(function(){
disabled+=$(this).attr('data')+',';
});

data=$('#jinsom-bbs-setting-form').serialize();
data+='&enabled_menu='+enabled+'&disabled_menu='+disabled;
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/update/bbs-setting.php",
data: data,
success: function(msg){
layer.closeAll('loading');
layer.msg('更新成功！');
}
});
return false;
}

//更新子论坛设置
function jinsom_update_bbs_child_setting(){
layer.load(1);
data = $('#jinsom-bbs-setting-form').serialize();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/update/bbs-setting-child.php",
data: data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});
}


//喜欢动态
function jinsom_like_posts(post_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}

var like_num=$(obj).children('span');
var like_dom=$(obj).parents('.jinsom-post-bar').siblings('.jinsom-single-left-bar').children().first();
var user_id=jinsom.user_id;
var avatar=jinsom.avatar;
if($(obj).hasClass('jinsom-had-like')){
$(obj).removeClass('jinsom-had-like');    
$(obj).addClass('jinsom-no-like');
$(obj).children('i').addClass('jinsom-xihuan2').removeClass('jinsom-xihuan1');
like_dom.removeClass('jinsom-had-like');//文章左侧栏
like_dom.addClass('jinsom-no-like');//文章左侧栏
like_dom.children('i').addClass('jinsom-xihuan2').removeClass('jinsom-xihuan1');//文章左侧栏
like_num.html(parseInt(like_num.html())-1); 
$(obj).parent().next().children('.jinsom-post-like-list').find('#had_like_'+user_id).remove();
}else{

audio=document.getElementById('jinsom-like-up-music');
audio.play();

$(obj).removeClass('jinsom-no-like');    
$(obj).addClass('jinsom-had-like');
$(obj).children('i').addClass('jinsom-xihuan1').removeClass('jinsom-xihuan2');
like_dom.removeClass('jinsom-no-like');//文章左侧栏    
like_dom.addClass('jinsom-had-like');//文章左侧栏
like_dom.children('i').addClass('jinsom-xihuan1').removeClass('jinsom-xihuan2');//文章左侧栏
like_num.html(parseInt(like_num.html())+1);  
$(obj).parent().next().children('.jinsom-post-like-list').prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+jinsom.verify+'</a>');
// layer.msg('喜欢成功！');
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

//文章侧栏喜欢
function jinsom_single_sidebar_like(post_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();   
return false;
}

var like_dom=$(obj).parent('.jinsom-single-left-bar').siblings('.jinsom-post-bar').children('.like');
var like_num=like_dom.find('span');
var user_id=jinsom.user_id;
var avatar=jinsom.avatar;
if($(obj).hasClass('jinsom-had-like')){
like_dom.removeClass('jinsom-had-like'); 
$(obj).removeClass('jinsom-had-like');    
like_dom.addClass('jinsom-no-like');
$(obj).addClass('jinsom-no-like');
$(obj).children('i').addClass('jinsom-xihuan2').removeClass('jinsom-xihuan1');
like_dom.children('i').addClass('jinsom-xihuan2').removeClass('jinsom-xihuan1');
like_num.html(parseInt(like_num.html())-1); 
like_dom.parent().next().children('.jinsom-post-like-list').find('#had_like_'+user_id).remove();
}else{
audio=document.getElementById('jinsom-like-up-music');
audio.play();
like_dom.removeClass('jinsom-no-like');  
$(obj).removeClass('jinsom-no-like');   
like_dom.addClass('jinsom-had-like');
$(obj).addClass('jinsom-had-like');
$(obj).children('i').addClass('jinsom-xihuan1').removeClass('jinsom-xihuan2');
like_dom.children('i').addClass('jinsom-xihuan1').removeClass('jinsom-xihuan2');
like_num.html(parseInt(like_num.html())+1);  
like_dom.parent().next().children('.jinsom-post-like-list').prepend('<a href="#" id="had_like_'+user_id+'">'+avatar+jinsom.verify+'</a>');
// layer.msg('喜欢成功！');
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




//关注论坛
function jinsom_bbs_like(bbs_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
n=parseInt($(".jinsom-bbs-follow-info .num").html());
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/bbs-like.php",
data: {bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
audio=document.getElementById('jinsom-follow-music');
audio.play();
$(obj).addClass("had");
$(obj).html('<i class="jinsom-icon jinsom-yiguanzhu"></i> 已 关');
n++; 	
}else if(msg.code==2){
$(obj).removeClass("had");
$(obj).html('<i class="jinsom-icon jinsom-guanzhu"></i> 关 注');
n--;	
}
$(".jinsom-bbs-follow-info .num").text(n);

}
});

}

//关注话题
function jinsom_topic_like(topic_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
n=parseInt($(".jinsom-topic-info-content .right span").last().children('i').html());
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/topic-like.php",
data: {topic_id:topic_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
audio=document.getElementById('jinsom-follow-music');
audio.play();
$(obj).addClass("had");
$(obj).html('<i class="jinsom-icon jinsom-yiguanzhu"></i> 已 关');
n++;	
}else if(msg.code==2){
$(obj).removeClass("had");
$(obj).html('<i class="jinsom-icon jinsom-guanzhu"></i> 关 注');
n--;	
}
$(".jinsom-topic-info-content .right span i").text(n); 
}
});

}






//===============================打赏============================

//展示打赏页面
function jinsom_reward_form(post_id,type){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/reward.php",
type:'POST',   
data:{post_id:post_id,type:type},    
success:function(results){
layer.open({
title:false,
type: 1,
closeBtn: 0,
skin: 'jinsom-reward-form', 
area: ['300px'], 
resize:false,
content: results
});
layer.closeAll('loading');
$('.jinsom-reward-close').click(function(){
layer.closeAll();//关闭打赏页面
});

}   
});  
}
//修改打赏金额
function jinsom_reward_edior(number){
this_dom=$('.jinsom-reward-edior');
if(this_dom.hasClass('on')){
this_dom.removeClass('on').html('修改金额');
$('.jinsom-reward-money span').html('<input type="hidden" id="jinsom-reward-number" value="'+number+'"><m>'+number+'</m>');
}else{
this_dom.addClass('on').html('取消');
$('.jinsom-reward-money span').html('<input type="text"  maxlength="6"  id="jinsom-reward-number">');
$('#jinsom-reward-number').focus();
}
}

//提交打赏
function jinsom_reward(post_id,type){
number=parseInt($("#jinsom-reward-number").val());
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/reward.php",
type:'POST',   
data:{number:number,post_id:post_id,type:type},    
success:function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){


ws.send('{"from_url":"'+jinsom.home_url+'","type":"reward","notice_user_id":"'+msg.author_id+'"}');


function d(){
layer.closeAll();
if(msg.post_url&&!$('body').hasClass('home')){
window.open(msg.post_url,'_self');
}
}setTimeout(d,2000);
}else if(msg.code==4){//绑定邮箱
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else if(msg.code==2){//弹出绑定手机号
function d(){jinsom_update_phone_form(msg.user_id);}setTimeout(d,2000);
} 
}
});
}


//==============================打赏结束==========================







//弹出转发表单、分享表单
function jinsom_reprint_form(post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/reprint.php",
type:'POST',   
data:{post_id:post_id},    
success:function(results){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
skin: 'jinsom-reprint-form', 
area: ['475px', '270px'], 
resize:false,
content: results
});
layui.use('form', function(){
var form = layui.form;
form.render();//表单重渲染
});

//复制文章分享链接
var clipboard = new ClipboardJS('#jinsom-copy-share-link-single');
clipboard.on('success', function(e) {
e.clearSelection();
$('#jinsom-copy-share-link-single').append('<g>复制成功！</g>');
function d(){$('#jinsom-copy-share-link-single').children('g').remove()}
setTimeout(d,1000);
});

}   
});
}



// 一级转载
function jinsom_reprint(post_id){
content = $('#jinsom-reprint-value').val();
comment_a=$('#jinsom-reprint-check-a').is(':checked');
if(content==''){content='转发了';}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/reprint.php",
data: {content:content,post_id:post_id,comment_a:comment_a,type:'a'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==2){
jinsom_update_phone_form(msg.user_id);//弹出绑定手机号界面
}
}
});

}



// 二级转载
function jinsom_reprint_again(post_id){
content = $('#jinsom-reprint-value').val();
comment_a=$('#jinsom-reprint-check-a').is(':checked');
comment_b=$('#jinsom-reprint-check-b').is(':checked');
if(content==''){content='转发了';}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/reprint.php",
data: {content:content,post_id:post_id,comment_a:comment_a,comment_b:comment_b,type:'b'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==2){
jinsom_update_phone_form(msg.user_id);//弹出绑定手机号界面
}
}
});

}



//弹出论坛设置界面 父级论坛
function jinsom_bbs_setting_form(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/bbs-setting.php",
data: {bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'父级'+jinsom.bbs_name+'设置---论坛ID：'+bbs_id,
skin: 'jinsom-bbs-setting-form', 
type: 1,
area: ['870px', '600px'], 
resize:false,
content: msg
});

$('.jinsom-bbs-setting-form .layui-layer-content').after('<div class="jinsom-update-bbs-setting-btn" onclick="jinsom_update_bbs_setting();">保存设置</div>');


//论坛上传头像
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.jinsom-bbs-child-setting-avatar span',
url: jinsom.jinsom_ajax_url+'/upload/term.php',
data: {bbs_id:bbs_id},
accept:'file',
before: function(obj){
$('.jinsom-bbs-child-setting-avatar span').show().html(jinsom.loading);
},
done: function(res, index, upload){
$('.jinsom-bbs-child-setting-avatar span').hide().html('点击上传头像');
if(res.code == 1){
$('.jinsom-bbs-child-setting-avatar img').attr('src',res.file_url);
$('.jinsom-bbs-avatar-input').val(res.file_url);
}else if(res.code == 4){
jinsom_msg(res.msg);
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(res.code == 5){
jinsom_msg(res.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('.jinsom-bbs-child-setting-avatar span').hide().html('点击上传头像');
}
});

});


layui.use('form', function(){
var form = layui.form;
form.render();

//论坛模板
form.on('select(bbs_template)', function(data){
$select_value=$("#jinsom-bbs-setting-bbs-template").val();
if($select_value!='default'){
$("#jinsom-bbs-setting-bbs-template-require").show();    
}else{
$("#jinsom-bbs-setting-bbs-template-require").hide();       
}
});

//论坛内页模板
form.on('select(bbs_type)', function(data){
$select_value=$("#jinsom-bbs-setting-bbs-type").val();
if($select_value!='default'&&$select_value!='download'){
$("#jinsom-bbs-setting-bbs-type-require").show();    
}else{
$("#jinsom-bbs-setting-bbs-type-require").hide();       
}
});

//发表
form.on('select(power_form)', function(data){
$select_value=parseInt($("#power_form").val());
if($select_value==6){
$("#jinsom-publish-power-lv").show();    
}else{
$("#jinsom-publish-power-lv").hide();     
}
if($select_value==7){
$("#jinsom-publish-power-honor").show();    
}else{
$("#jinsom-publish-power-honor").hide();     
}
if($select_value==8){
$("#jinsom-publish-power-verify").show();    
}else{
$("#jinsom-publish-power-verify").hide();     
}
});

//回帖
form.on('select(comment_power)', function(data){
$select_value=parseInt($("#jinsom-bbs-comment-power").val());
if($select_value==6){
$("#jinsom-bbs-comment-power-lv").show();    
}else{
$("#jinsom-bbs-comment-power-lv").hide();     
}
if($select_value==7){
$("#jinsom-bbs-comment-power-honor").show();    
}else{
$("#jinsom-bbs-comment-power-honor").hide();     
}
if($select_value==8){
$("#jinsom-bbs-comment-power-verify").show();    
}else{
$("#jinsom-bbs-comment-power-verify").hide();     
}
});

//访问
form.on('select(visit_power_form)',function(data){
$select_value=parseInt($("#visit_power_form").val());
if($select_value==5){
$("#jinsom-visit-power-pass").show();    
}else{
$("#jinsom-visit-power-pass").hide();     
}
if($select_value==6){
$("#jinsom-visit-power-exp").show();    
}else{
$("#jinsom-visit-power-exp").hide();     
}
if($select_value==12){
$("#jinsom-visit-power-vip-number").show();    
}else{
$("#jinsom-visit-power-vip-number").hide();     
}
if($select_value==7){
$("#jinsom-visit-power-user").show();    
}else{
$("#jinsom-visit-power-user").hide();     
}
if($select_value==9){
$("#jinsom-visit-power-honor").show();    
}else{
$("#jinsom-visit-power-honor").hide();     
}
if($select_value==10){
$("#jinsom-visit-power-verify").show();    
}else{
$("#jinsom-visit-power-verify").hide();     
}
if($select_value==11){
$("#jinsom-visit-power-pay").show();    
}else{
$("#jinsom-visit-power-pay").hide();     
}
});

});
}

});    
}




//弹出子论坛设置界面 子论坛
function jinsom_bbs_setting_form_child(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/bbs-setting-child.php",
data: {bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:jinsom.bbs_name+'子版块设置---子论坛ID：'+bbs_id,
skin: 'jinsom-bbs-setting-form', 
type: 1,
area: ['500px', '400px'], 
resize:false,
content: msg
});

$('.jinsom-bbs-setting-form .layui-layer-content').after('<div class="jinsom-update-bbs-setting-btn opacity" onclick="jinsom_update_bbs_child_setting();">保存设置</div>');



//子论坛上传头像
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.jinsom-bbs-child-setting-avatar span',
url: jinsom.jinsom_ajax_url+'/upload/term.php',
data: {bbs_id:bbs_id},
accept:'file',
before: function(obj){
$('.jinsom-bbs-child-setting-avatar span').show().html(jinsom.loading);
},
done: function(res, index, upload){
$('.jinsom-bbs-child-setting-avatar span').hide().html('点击上传头像');
if(res.code == 1){
$('.jinsom-bbs-child-setting-avatar img').attr('src',res.file_url);
$('.jinsom-bbs-avatar-input').val(res.file_url);
}else if(res.code == 4){
jinsom_msg(res.msg);
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(res.code == 5){
jinsom_msg(res.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('.jinsom-bbs-child-setting-avatar span').hide().html('点击上传头像');
}
});

});

}

});    
}


//话题设置表单
function jinsom_topic_setting_form(topic_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/topic-setting.php",
data: {topic_id:topic_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'话题设置',
skin: 'jinsom-bbs-setting-form', 
type: 1,
area: ['500px', '400px'], 
resize:false,
content: msg
});

$('.jinsom-bbs-setting-form .layui-layer-content').after('<div class="jinsom-update-bbs-setting-btn opacity" onclick="jinsom_update_topic();">保存设置</div>');


//话题上传头像
layui.use(['upload','form'], function(){
var upload = layui.upload;
var form = layui.form;
form.render();
upload.render({
elem: '.jinsom-topic-setting-avatar span',
url: jinsom.jinsom_ajax_url+'/upload/term.php',
data: {bbs_id:topic_id},
accept:'file',
before: function(obj){
$('.jinsom-topic-setting-avatar span').show().html(jinsom.loading);
},
done: function(res, index, upload){
$('.jinsom-topic-setting-avatar span').hide().html('点击上传头像');
if(res.code == 1){
$('.jinsom-topic-setting-avatar img').attr('src',res.file_url);
$('.jinsom-bbs-avatar-input').val(res.file_url);
}else if(res.code == 4){
jinsom_msg(res.msg);
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(res.code == 5){
jinsom_msg(res.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('.jinsom-topic-setting-avatar span').hide().html('点击上传头像');
}
});

});



layui.use('form', function(){
var form = layui.form;
form.render();
form.on('select(topic_power)', function(data){
$select_value=$("#jinsom-topic-power").val();
if($select_value=='user'){
$("#jinsom-topic-power-user").show();    
}else{
$("#jinsom-topic-power-user").hide();     
}
});

});






}

});    
}


//提交话题设置
function jinsom_update_topic(){
layer.load(1);
data = $('#jinsom-topic-setting-form').serialize();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/update/topic.php",
data: data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});
}







//弹出购买付费可见内容-表单
function jinsom_show_pay_form(post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/pay-form.php",
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
area: ['600px','auto'], 
resize:false,
content: msg
});
}
});
}

//提交付费可见购买
function jinsom_pay_for_visible(post_id){
layer.load(1);
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/pay-for-visible.php",
dataType:'json',
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
ws.send('{"from_url":"'+jinsom.home_url+'","type":"buy","notice_user_id":"'+msg.author_id+'","do_user_id":"'+jinsom.user_id+'"}');
function d(){window.location.href=jinsom.home_url+'/?p='+post_id;}
setTimeout(d,1500);
}else if(msg.code==3){//弹出金币充值窗口
function c(){jinsom_recharge_credit_form();}setTimeout(c,1500);
}else if(msg.code==8){//弹出余额充值窗口
function c(){jinsom_recharge_money_form();}setTimeout(c,1500);
}else if(msg.code==4){//绑定邮箱
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else if(msg.code==2){//弹出绑定手机号
function d(){jinsom_update_phone_form(msg.user_id);}setTimeout(d,2000);
}
}
});    
}



//显示二级评论框
function jinsom_bbs_show_comment_form(obj){
$(obj).parents('.jinsom-bbs-single-footer').next().toggle();
}


//快速添加内容到输入框
function jinsom_set_input(dom_id,content) {
$("#"+dom_id).val($("#"+dom_id).val()+content);
$("#"+dom_id).focus();
}


// =====================我的钱包模块===================

//我的钱包
function jinsom_mywallet_form(user_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/mywallet.php",
data:{user_id:user_id},
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'我的钱包',
type: 1,
area: ['800px', '570px'], 
resize:false,
// fixed: false,
// offset: '50px',
content: msg
});
}
});
}




//卡密兑换表单
function jinsom_keypay_form(title){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/keypay.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:title,
btn: false,
resize:false,
area: '350px',
skin: 'jinsom-login-form',
content: msg
});
}
});	
}

//提交卡密兑换
function jinsom_keypay(){
key=$('#jinsom-pop-key').val();
if(key==''){
layer.msg('请输入卡密！');
return false;	
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/key-use.php",
data:{key:key},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('#jinsom-pop-key').val('');
if(msg.type=='credit'){
current_credit=parseInt($('.jinsom-mycredit-credit-info .credit i').html());
recharge_credit=parseInt(msg.number);
$('.jinsom-mycredit-credit-info .credit i').html(current_credit+recharge_credit);
}
}
}
});	
}


//支付宝充值金币||微信充值金币界面
function jinsom_recharge_credit_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/recharge-credit.php",
success: function(msg){
layer.closeAll('loading');
window.recharge_credit_form=layer.open({
type:1,
title:jinsom.credit_name+'充值',
btn: false,
fixed:false,
resize:false,
area: ['600px', 'auto'], 
skin: 'jinsom-credit-recharge-form',
content: msg
});
}
});
}

//余额充值表单
function jinsom_recharge_money_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/recharge-money.php",
success: function(msg){
layer.closeAll('loading');
window.recharge_credit_form=layer.open({
type:1,
title:jinsom.money_name+'充值',
btn: false,
fixed:false,
resize:false,
area: ['600px', 'auto'], 
skin: 'jinsom-credit-recharge-form',
content: msg
});
}
});
}

//积分充值
function jinsom_recharge_extcredits_form(){
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/recharge-extcredits.php",
success: function(msg){
layer.closeAll('loading');
window.recharge_extcredits_form=layer.open({
type:1,
title:jinsom.extcredits_name+'充值',
btn: false,
fixed:false,
resize:false,
area: ['600px', 'auto'],
skin: 'jinsom-credit-recharge-form',
content: msg
});
}
});
}

//积分兑换表单
function jinsom_exchange_extcredits_form(){
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/exchange-extcredits.php",
success: function(msg){
layer.closeAll('loading');
window.exchange_extcredits_form=layer.open({
title:jinsom.extcredits_name+'兑换',
fixed: false,
skin:'jinsom-exchange-extcredits-form',
type: 1,
area: ['380px', 'auto'], 
content: msg
});
}
});
}

//金币兑换积分
function jinsom_extcredits_exchange(){
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
number=$('#jinsom-extcredits-exchange-number').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/exchange-extcredits.php",
data:{number:number},
success: function(msg){
layer.closeAll('loading');
jinsom_msg(msg.msg);
if(msg.code==1){
exchange_extcredits = parseInt($('.jinsom-mycredit-credit-info .credit m.extcredits').html());
function c(){layer.close(exchange_extcredits_form);$('.jinsom-mycredit-credit-info .credit m.extcredits').html(exchange_extcredits+msg.num);}setTimeout(c,2000);
}else if(msg.code==2){//弹出金币充值窗口
function c(){jinsom_recharge_credit_form();}setTimeout(c,1500);
}
}
});
}

//支付宝||微信||金币开通会员
function jinsom_recharge_vip_form(type){
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/recharge-vip.php",
data:{type:type},
success: function(msg){
layer.closeAll('loading');
window.recharge_vip_form=layer.open({
type:1,
title:false,
fixed:false,
btn: false,
resize:false,
area: ['600px', 'auto'], 
skin: 'jinsom-credit-recharge-form',
content: msg
});
}
});
}


//提交支付宝金币充值付款
function jinsom_recharge_alipay(type){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}

number=$('#jinsom-credit-recharge-number').val();
recharge_data=$('#jinsom-credit-recharge-form').serialize();
if(type=='alipay_pc'){
type='alipay';
}else if(type=='alipay_code'){
type='qrcode';
}

recharge_data=recharge_data+'&type='+type;

//创建订单
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/create-trade-no.php",
data:recharge_data,
});

if(type=='alipay'){
$('#jinsom-credit-recharge-form').attr('action',jinsom.home_url+'/Extend/pay/alipay/alipay.php').submit();

layer.confirm(
'<p style="text-align:center;">请您在新窗口完成付款操作！</p>', 
{title:false,btn:['已支付完成','支付失败'],btnAlign: 'c'}, 
function(index){
layer.close(index);
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/check-trade.php",
type:'POST',   
data:recharge_data,
success:function(msg){   
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else{
layer.close(index);
}
}   
}); 
}
); 

$('#jinsom-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
}else{//当面付


//生成当面付二维码
layer.load(1);
$.ajax({   
url:jinsom.home_url+'/Extend/pay/alipay/'+type+'.php',
type:'GET',   
data:recharge_data,
success:function(msg){   
layer.closeAll('loading');
window.wechatpay_code_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'jinsom-wechatpay-code-form',
content: '<div class="jinsom-wechatpay-code-content"><div id="jinsom-qrcode"></div><p style="color: #00a7ff;"><i class="jinsom-icon jinsom-zhifubaozhifu" style="color: #00a7ff;font-size: 24px;vertical-align: -3px;"></i> 支付宝扫码支付</p></div>',
cancel: function(index,layero){ 
$('#jinsom-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
jinsom_check_order_wechatpay_ajax.abort();
},
success:function(){
jinsom_qrcode('jinsom-qrcode',200,200,msg);
}
});

jinsom_check_order_wechatpay(recharge_data);

}   
});


}

}


//提交微信支付充值
function jinsom_recharge_wechatpay(type){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}

number=$('#jinsom-credit-recharge-number').val();
if(number<=0){
layer.msg('充值的金额不合法！');
return false;
}

if(type=='wechatpay_pc'){
ajax_url=jinsom.home_url+"/Extend/pay/wechatpay/wechatpay-code.php";
}else if(type=='zhanpay_wechat_native'){
ajax_url="/Extend/pay/zhanpay/wechatpay-native.php";
}else{
ajax_url=jinsom.home_url+"/Extend/pay/xunhupay/wechatpay-xunhu-code.php";	
}

data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type=wechatpay';
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/create-trade-no.php",
data:data,
success: function(msg){}
});



//生成二维码
if(type=='wechatpay_pc'||type=='zhanpay_wechat_native'){
layer.load(1);
$.ajax({   
url:ajax_url,
type:'POST',   
data:data,
success:function(msg){   
layer.closeAll('loading');
window.wechatpay_code_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'jinsom-wechatpay-code-form',
content: '<div class="jinsom-wechatpay-code-content"><div id="jinsom-qrcode"></div><p><i class="jinsom-icon jinsom-weixinzhifu"></i> 微信扫码支付</p></div>',
cancel: function(index, layero){ 
$('#jinsom-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
jinsom_check_order_wechatpay_ajax.abort();
},
success:function(){
jinsom_qrcode('jinsom-qrcode',200,200,msg);
}
});

jinsom_check_order_wechatpay(data);

}   
}); 


}else{
layer.load(1);
$.ajax({   
url:ajax_url,
type:'POST',   
data:data,
success:function(msg){   
layer.closeAll('loading');
window.wechatpay_code_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'jinsom-wechatpay-code-form',
content: '<div class="jinsom-wechatpay-code-content"><img style="width:200px;height:200px;" src="'+msg+'"><p><i class="jinsom-icon jinsom-weixinzhifu"></i> 微信扫码支付</p></div>',
cancel: function(index, layero){ 
$('#jinsom-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
jinsom_check_order_wechatpay_ajax.abort();
}
});

jinsom_check_order_wechatpay(data);

}   
});	
}


}


//易支付
function jinsom_recharge_other_pay(type){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}

data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type='+type;

//创建订单
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/create-trade-no.php",
data:data,
});
$('#jinsom-credit-recharge-form').append('<input type="hidden" name="pay_type" value="'+type+'">');

if(type=='epusdt'){
$('#jinsom-credit-recharge-form').attr('action',jinsom.home_url+'/Extend/pay/Epusdt/pay.php').submit();
}else{//易支付
$('#jinsom-credit-recharge-form').attr('action',jinsom.home_url+'/Extend/pay/epay/index.php').submit();
}

layer.confirm(
'<p style="text-align:center;">请您在新窗口完成付款操作！</p>', 
{title:false,btn:['已支付完成','支付失败'],btnAlign: 'c'}, 
function(index){
layer.close(index);
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/check-trade.php",
type:'POST',   
data:data,
success:function(msg){   
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else{
layer.close(index);
}
}   
}); 
}
); 

$('#jinsom-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
}


function jinsom_recharge(recharge_type){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}

if(recharge_type=='money'){
money_number=$('.jinsom-recharge-money-input input').val();
if(money_number<0.01||!money_number){
layer.msg('充值金额不能小于0.01元！');
return false;
}
$('#jinsom-credit-recharge-number').val(money_number);
}

if($('.jinsom-credit-recharge-type li.on').length>0){
type=$('.jinsom-credit-recharge-type li.on').attr('data');
console.log(type);
if(type=='alipay_pc'||type=='alipay_code'){
jinsom_recharge_alipay(type);
}else if(type=='wechatpay_pc'||type=='xunhupay_wechat_pc'||type=='zhanpay_wechat_native'){
jinsom_recharge_wechatpay(type);
}else if(type=='epay_alipay'||type=='epay_wechatpay'||type=='epusdt'){
jinsom_recharge_other_pay(type);
}else if(type=='creditpay'){
jinsom_recharge_vip_credit();
}else if(type=='moneypay'){
jinsom_money_recharge(recharge_type);
}else{
layer.msg('暂未开启！');	
}
}else{
layer.msg('请选择充值类型！');
}	
}









function jinsom_check_order_wechatpay(data){
//长轮询付款
jinsom_check_order_wechatpay_ajax=$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/check-trade.php",
data:data,
success: function(msg){
if(msg.code==0){
jinsom_check_order_wechatpay(data);
}else if(msg.code==1){
$('.jinsom-wechatpay-code-content').html(msg.msg);
if(msg.type=='credit'){
credit=parseInt($('.jinsom-mycredit-credit-info .credit i').html());
recharge_number=parseInt(msg.recharge_number);
count=credit+recharge_number;
$('.jinsom-mycredit-credit-info .credit i').html(count);
}else if(msg.type=='money'){
money=parseFloat($('.jinsom-mycredit-credit-info .credit m.money').html())
recharge_number=parseInt(msg.recharge_number);
count=money+recharge_number;
$('.jinsom-mycredit-credit-info .credit m.money').html(count+msg.money_unit);
}else if(msg.type=='extcredits'){
extcredits=parseInt($('.jinsom-mycredit-credit-info .credit m.extcredits').html())
recharge_number=parseInt(msg.recharge_number);
count=extcredits+recharge_number;
$('.jinsom-mycredit-credit-info .credit m.extcredits').html(count);
}else{//开通会员
$('.jinsom-mycredit-user-info .vip m').html(msg.content);
}
}else{
jinsom_check_order_wechatpay(data);	
}
}
});	
}





//用金币开通会员
function jinsom_recharge_vip_credit(){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
number=$('#jinsom-credit-recharge-number').val();
if(number<=0){
layer.msg('充值的金额不合法！');
return false;
}
data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type=creditpay';
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/recharge-vip-credit.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('.jinsom-mycredit-user-info .vip m').html(msg.content);
}
}
});
}

//使用余额充值
function jinsom_money_recharge(recharge_type){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
number=$('#jinsom-credit-recharge-number').val();
if(number<=0){
layer.msg('充值的金额不合法！');
return false;
}
data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type=moneypay';
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/recharge-"+recharge_type+"-money.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(recharge_type=='credit'){
$('.jinsom-mycredit-credit-info .credit i').html(msg.credit);
}else if(recharge_type=='extcredits'){
$('.jinsom-mycredit-credit-info .credit m.extcredits').html(msg.extcredits);
}
$('.jinsom-mycredit-credit-info .credit m.money').html(msg.money);
}
}
});
}


//转账表单-输入转账用户的昵称
function jinsom_transfer_one_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/transfer-one.php",
success: function(msg){
layer.closeAll('loading');
window.transfer_one_form=layer.open({
type:1,
title:'转账',
btn: false,
resize:false,
area: '350px',
skin: 'jinsom-login-form',
content: msg
});

//回车
$("#jinsom-pop-nickname").keypress(function(e) {  
if(e.which == 13) {  
jinsom_transfer_one();
}  
}); 

}
});	
}

//提交转账表单--第一步
function jinsom_transfer_one(){
nickname=$('#jinsom-pop-nickname').val();
if(nickname==''){
layer.msg('请输入需要转账用户的昵称！');
return false;
}

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/transfer-one.php",
data:{nickname:nickname},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
window.transfer_confirm_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: '350px',
skin: 'jinsom-transfer-form',
content: msg.content
});
layui.use('form', function(){
var form = layui.form;
form.render('radio');
form.on('radio(transfer)', function(data){
if(data.value=='credit'){
$('.transfer-credit').show();
$('.transfer-money').hide();
$('.transfer-extcredits').hide();
}else if(data.value=='money'){
$('.transfer-credit').hide();
$('.transfer-money').show();
$('.transfer-extcredits').hide();
}else if(data.value=='extcredits'){
$('.transfer-credit').hide();
$('.transfer-money').hide();
$('.transfer-extcredits').show();
}
});
});
$('#jinsom-pop-transfer-number').focus();
layer.close(transfer_one_form);
}else{
layer.msg(msg.msg);	
}
}
});
}

//用户主页转账
function jinsom_transfer_form(author_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/transfer-user.php",
data:{author_id:author_id},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
window.transfer_confirm_form=layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: '350px',
skin: 'jinsom-transfer-form',
content: msg.msg
});
layui.use('form', function(){
var form = layui.form;
form.render('radio');
form.on('radio(transfer)', function(data){
if(data.value=='credit'){
$('.transfer-credit').show();
$('.transfer-money').hide();
$('.transfer-extcredits').hide();
}else if(data.value=='money'){
$('.transfer-credit').hide();
$('.transfer-money').show();
$('.transfer-extcredits').hide();
}else if(data.value=='extcredits'){
$('.transfer-credit').hide();
$('.transfer-money').hide();
$('.transfer-extcredits').show();
}
});
});
$('#jinsom-pop-transfer-number').focus();
}else{
layer.msg(msg.msg);	
}
}
});
}

//确定转账
function jinsom_transfer_confirm(){
author_id=$('.jinsom-transfer-confirm-form').attr('data');
number=$('#jinsom-pop-transfer-number').val();
mark=$('#jinsom-pop-transfer-mark').val();
if(number==''){
layer.msg('请输入转账金额！');
return false;
}

transfer_type=$('.jinsom-transfer-confirm-form .transfer-type input:checked').val();

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/transfer-confirm.php",
data:{author_id:author_id,number:number,mark:mark,transfer_type:transfer_type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);	
if(msg.code==1){
if($('.jinsom-mycredit-form').length>0){
recharge_number=parseInt(msg.transfer_number);
if(transfer_type=='credit'){
credit=parseInt($('.jinsom-mycredit-credit-info .credit i').html());
credit_count=credit-recharge_number;
$('.jinsom-mycredit-credit-info .credit i').html(credit_count);
}else if(transfer_type=='money'){
money=parseFloat($('.jinsom-mycredit-credit-info .credit m.money').html());
money_count=money-recharge_number;
$('.jinsom-mycredit-credit-info .credit m.money').html(money_count);
}else if(transfer_type=='extcredits'){
extcredits=parseInt($('.jinsom-mycredit-credit-info .credit m.extcredits').html());
extcredits_count=extcredits-recharge_number;
$('.jinsom-mycredit-credit-info .credit m.extcredits').html(extcredits_count);
}
}
layer.close(transfer_confirm_form);
}
}
});

}





//=============================我的钱包模块结束===========================









//查看密码动态
function jinsom_post_password(post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.prompt({title:'请输入查看密码',formType:1,btnAlign:'c'},function(password,index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/password-post.php",
data: {post_id:post_id,password:password},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function d(){window.open(msg.url,'_self');}setTimeout(d,1500);
}
}
});
});
}



//关注按钮
function jinsom_follow(author_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/follow.php",
data: {author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){//取消关注
$(obj).removeClass('had').addClass('no');
$(obj).html('<i class="jinsom-icon jinsom-guanzhu"></i>关注');
}else if(msg.code==2){//关注成功
audio=document.getElementById('jinsom-follow-music');
audio.play();
$(obj).removeClass('no').addClass('had'); 
$(obj).html('<i class="jinsom-icon jinsom-yiguanzhu"></i>已关');     
}else if(msg.code==3){//相互关注成功
audio=document.getElementById('jinsom-follow-music');
audio.play();
$(obj).removeClass('no').addClass('had');  
$(obj).html('<i class="jinsom-icon jinsom-xianghuguanzhu"></i>互关');    
}
if(msg.code==2||msg.code==3){
if($(obj).parent().hasClass('follow-see')){
function d(){window.open($(obj).parent().attr('data'),'_self');}setTimeout(d,500);
}
}
}
}); 
}




//更新用户资料
function jinsom_setting(type){
if(type=='base'){
input_data = $('#jinsom-setting-base').serialize();	
}else if(type=='account'){
input_data = $('#jinsom-setting-account').serialize();	
}else if(type=='social'){
input_data = $('#jinsom-setting-social').serialize();	
}else if(type=='privacy'){
input_data = $('#jinsom-setting-privacy').serialize();	
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/update/profile.php",
data: input_data,
dataType:'json',
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}

}); 
}

//修改背景音乐
function jinsom_update_profile_bg_music(){
author_id =$('.jinsom-page').attr('author_id');
bg_music_url=$('#jinsom-bg-music-url').val();
bg_music_on_off=$('#jinsom-bg-music-on-off').is(':checked');
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:jinsom.jinsom_ajax_url+"/update/profile.php",
data: {author_id:author_id,bg_music_url:bg_music_url,bg_music_on_off:bg_music_on_off},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}

});
}



//弹窗扫码分享
function jinsom_popop_share_code(url,title,tips){
if(tips){
tips='<p>'+tips+'</p>';
}
layer.open({
title:title,
btn: false,
type: 1,
resize:false,
area: ['240px'],
skin: 'jinsom-pop-share',
content: '<div id="jinsom-qrcode"></div>'+tips,
success: function(layero, index){
jinsom_qrcode('jinsom-qrcode',200,200,url);
}
});    
}


//分享到QQ空间
function jinsom_sidebar_share_qzone(){
qzone_url='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+jinsom.site_name+'&url=';
share_url=$('#jinsom-sidebar-share-link').html();
window.open(qzone_url+share_url);
}

//分享到微博
function jinsom_sidebar_share_weibo(key){
weibo_url='http://service.weibo.com/share/share.php?title='+jinsom.site_name+'&url=';
share_url=$('#jinsom-sidebar-share-link').html();
window.open(weibo_url+share_url);
}


//个人主页关注页面
function jinsom_member_follow_page(obj){
author_id=$(obj).attr('author_id');
if(!$(obj).attr('type')){
$('.jinsom-member-menu li[type=follow-page]').addClass('on').siblings().removeClass('on');
}else{
$(obj).addClass('on').siblings().removeClass('on');
}
$('.jinsom-post-list').prepend(jinsom.loading_post);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/member-follow.php",
data: {author_id:author_id},
success: function(msg){ 
$('.jinsom-load').remove();
$('.jinsom-post-list').html(msg);  
}
});
}



//个人主页设置页面
function jinsom_member_setting_page(obj){
if($('.jinsom-load-post').length>0){
return false;	
}
author_id=$(obj).attr('author_id');
$(obj).addClass('on').siblings().removeClass('on');
$('.jinsom-post-list').prepend(jinsom.loading_post);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/member-profile.php",
data: {author_id:author_id},
success: function(msg){   
$('.jinsom-load').remove();
$('.jinsom-post-list').html(msg);
layui.use(['upload','form','element'], function(){
var upload = layui.upload;
var form = layui.form;
var element = layui.element;
element.render();
form.render();//表单重渲染


//个人主页背景音乐
upload.render({
elem: '#test-upload-music',
url: jinsom.jinsom_ajax_url+'/upload/user-bg-music.php',
multiple:true,
accept:'file',
data: {author_id:$('#jinsom-bg-music-url').attr('data')},
before: function(obj){
$('#jinsom-bbs-comment-upload').html('<i class="fa fa-spin fa-refresh">');
},
done: function(res, index, upload){
$('#jinsom-bbs-comment-upload').html('<i class="fa fa-picture-o"></i>');
if(res.code == 0){
$('#jinsom-bg-music-url').val(res.data['src']);
}else if(res.code == 4){
jinsom_msg(res.msg);
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(res.code == 5){
jinsom_msg(res.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('#jinsom-bbs-comment-upload').html('<i class="fa fa-picture-o"></i>');
}, 
xhr:function (index,e) {
var percent=e.loaded / e.total;//计算百分比
percent = parseFloat(percent.toFixed(2));
element.progress('jinsom-bg-music', percent*100+'%');
// console.log("-----"+percent);
}
});

});



}
});
}






//论坛查看更多置顶
function jinsom_more_bbs_commend_posts(obj){
if($(obj).prev('.jinsom-bbs-post-list').hasClass('had')){
$(obj).prev('.jinsom-bbs-post-list').removeClass('had');
$(obj).html('收起列表 <i class="fa fa-angle-up">');	
}else{
$(obj).prev('.jinsom-bbs-post-list').addClass('had');
$(obj).html('查看更多 <i class="fa fa-angle-down">');
}
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
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/vote.php",
data: {post_id:post_id,vote:data_arr},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function d(){window.location.reload();}setTimeout(d,1500);	
}

}
});
}else{ //判断是否选择了投票选项
layer.msg('请至少选择一项进行投票！');
}
}

//打开链接
function jinsom_post_link(obj){
var post_url=$(obj).parents('a').attr('href');
$(obj).parents('a').removeAttr('href');
var link=$(obj).attr('data');
window.open(link);
function d(){$(obj).parents('a').attr('href',post_url);}
setTimeout(d,1500);
}


//论坛附件类型
function jinsom_bbs_file_style(type){
if(jinsom.is_black){
layer.msg('你是黑名单用户，禁止设置操作！');	
return false;
}
layer.open({
content: '请选择你要上传附件的类型'
,btn: ['本地', '外链', '网盘']
,btnAlign: 'c'
,yes: function(index, layero){
layer.closeAll(); 
jinsom_bbs_file_local_add(type);

}
,btn2: function(index, layero){
jinsom_bbs_file_outlink_add(type);
}
,btn3: function(index, layero){
jinsom_bbs_file_pan_add(type);
}
,cancel: function(){ 
}
});
}
//添加本地上传 
function jinsom_bbs_file_local_add(type){

layer.open({
title:'添加附件-本地',
type: 1,
area: ['282px', '230px'], //宽高
content: '<div class="bbs_add_file_form"><div class="file_progress"><span class="file_bar"></span><span class="file_percent">0%</span></div><div id="bbs_file_local_select_btn" class="bbs_file_local_select_btn opacity"><i class="fa fa-plus"></i> 选择文件<form id="add_file_local" method="post" enctype="multipart/form-data" action="'+jinsom.jinsom_ajax_url+'/upload/file.php"><input id="bbs_file_local_input" type="file" name="file"></form></div><input type="text"  placeholder="请输入附件名称" id="file_name"><input type="hidden"  placeholder="附件地址，需要带http://" id="file_url"><div class="bbs_add_file_btn opacity" onclick="jinsom_bbs_file_insert_local('+type+');">插入附件</div></div>'
});


}




//添加外链 
function jinsom_bbs_file_outlink_add(type){
layer.open({
title:'添加附件-外链',
type: 1,
area: ['282px', '230px'], //宽高
content: '<div class="bbs_add_file_form"><input type="text"  placeholder="附件地址，需要带http://" id="file_url"><input type="text"  placeholder="附件名称" id="file_name"><div class="bbs_add_file_btn opacity" onclick="jinsom_bbs_file_insert_out('+type+');">插入附件</div></div>'
});
$('#file_url').focus();
}
//添加网盘 
function jinsom_bbs_file_pan_add(type){
layer.open({
title:'添加附件-网盘',
type: 1,
area: ['282px', '280px'], //宽高
content: '<div class="bbs_add_file_form"><input type="text"  placeholder="附件地址，需要带http://" id="file_url"><input type="text"  placeholder="附件名称" id="file_name"><input type="text"  placeholder="下载密码" id="file_pass"><div class="bbs_add_file_btn opacity" onclick="jinsom_bbs_file_insert_pan('+type+');">插入附件</div></div>'
});
$('#file_url').focus();
}

//编辑器插入-网盘
function jinsom_bbs_file_insert_pan(type){	
var file_url=$('#file_url').val();
var name=$('#file_name').val();
var pass=$('#file_pass').val();
if((name&&file_url)==''){
layer.msg('信息不能为空！');	
return false;
}
if(type==1){
ue.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+pass+'" type="3"] ');	
}else if(type==2){
ue_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+pass+'" type="3"] ');	
}else{
ue_single.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+pass+'" type="3"] ');	
}
layer.closeAll(); 
}


//编辑器插入-外链
function jinsom_bbs_file_insert_out(type){	
var file_url=$('#file_url').val();
var name=$('#file_name').val();
if((name&&file_url)==''){
layer.msg('信息不能为空！');	
return false;
}

if(type==1){
ue.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" type="2"] ');	
}else if(type==2){
ue_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" type="2"] ');	
}else{
ue_single.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" type="2"] ');	
}
layer.closeAll(); 
}





//==========================提现相关=================


//显示提现二维码
function jinsom_show_cash_code(obj){
down_url=$(obj).attr('data');
layer.load(1);
layer.open({
title:false,
btn: false,
type: 1,
resize:false,
area: ['200px', '200px'],
skin: 'jinsom-show-cash-code',
content: '<img src="'+down_url+'"/>',
success: function(layero, index){
layer.closeAll('loading');
}
}); 	
}



//弹出提现表单
function jinsom_show_cash_form(){
var cash_ratio=parseInt(jinsom.cash_ratio);
var credit=parseInt(jinsom.credit);
var yuan=parseInt(credit/cash_ratio);
if(jinsom.wechat_cash){
var wechat_cash='<input type="radio" name="cash_type" class="cash_form_type" checked="" title="微信" value="1">';	
}else{
var wechat_cash='';	
}
if(jinsom.alipay_cash){
var alipay_cash='<input type="radio" name="cash_type" class="cash_form_type" checked="" title="支付宝" value="2">';	
}else{
var alipay_cash='';	
}
window.cash_form=layer.open({
title:'发起提现 - '+jinsom.current_user_name,
type: 1,
area: ['282px', '265px'], //宽高
content: '<div class="show_cash_form layui-form"><div class="cash_form_tip"><p>'+cash_ratio+' '+jinsom.credit_name+' = 1 人民币</p><p>你最多可以申请提现 '+yuan+' 元</p></div><input type="number" id="cash_number"placeholder="提现金额至少'+jinsom.cash_mini_number+'元起"><div class="cash_form_select_type">'+wechat_cash+alipay_cash+'</div><div class="cash_form_btn opacity" onclick="jinsom_add_cash();">申请提现</div></div>'
});
layui.use('form', function(){
var form = layui.form;
form.render();//表单重渲染
});
}

//删除提现收款二维码
function jinsom_delete_cash_img(type,user_id,obj){
$(obj).next('img').remove();
$(obj).remove();
$.ajax({   
url:jinsom.jinsom_ajax_url+"/update_user_profile.php",
type:'POST',   
data:{cash_type:type,user_id:user_id},    
success:function(results){}
});
}

//提交提现
function jinsom_add_cash(){
var number =$('#cash_number').val();
var type =$("input[name='cash_type']:checked").val();
if(number==''){
layer.msg('请输入提现金额！');	
return false;	
}
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{add_cash:1,number:number,type:type},    
success:function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);
function c(){layer.close(cash_form);}
setTimeout(c,2000);	
}else{
layer.msg(msg.msg);
}

}
});

}

//拒绝提现
function jinsom_refuse_cash(id,user_id,number){
layer.prompt({title: '请填写拒绝原因', formType: 2}, function(text, index){
if(text==''){
layer.msg('原因不能为空！');
return false;	
}else{
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{update_cash:id,content:text,status:2,user_id:user_id,number:number},    
success:function(msg){
layer.closeAll('loading');
layer.msg('已经拒绝！');
function c(){layer.close(index);}
setTimeout(c,2000);	
}
});


}
});
}

//通过提现
function jinsom_agree_cash(id){
layer.confirm('你确定要通过吗？', {
btn: ['确定','取消'] 
}, function(){

layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{update_cash:id,status:1},    
success:function(msg){
layer.closeAll('loading');
layer.msg('已经通过！');
}
});

});
}

//删除提现
function jinsom_delete_cash(id,obj){
var this_dom=obj;
layer.confirm('你确定要删除记录吗？', {
btn: ['确定','取消'] 
}, function(){

layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/cash.php",
type:'POST',   
dataType:'json',
data:{delete_cash:id},    
success:function(msg){
layer.closeAll('loading');
layer.msg('删除成功！');
$(this_dom).parents('tr').remove();
}
});

});
}


//==============================提现相关结束=========================








//偏好设置
function jinsom_preference_setting(){
this_dom=$(".jinsom-preference-setting");
if(this_dom.css("display")=='none'){
this_dom.show();
if ($(".jinsom-preference-list li").length==0&&$('.jinsom-preference-list .jinsom-empty-page').length==0){
$(".jinsom-preference-list").append('<div class="jinsom-load"><div class="jinsom-loading"><i></i><i></i><i></i></div></div>');
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/preference.php",
success: function(msg){
$('.jinsom-load').remove();
$('.jinsom-preference-list').append(msg);


//设置单栏
bg_skin=GetCookie("bg-style");
if(bg_skin=='01.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_01').addClass('on');
}else if(bg_skin=='02.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_02').addClass('on');    
}else if(bg_skin=='03.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_03').addClass('on');    
}else if(bg_skin=='04.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_04').addClass('on');    
}else if(bg_skin=='05.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_05').addClass('on');    
}else if(bg_skin=='06.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_06').addClass('on');    
}else if(bg_skin=='07.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_07').addClass('on');    
}else if(bg_skin=='08.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_08').addClass('on');    
}else if(bg_skin=='09.css'){
$('.jinsom-preference-list .default').removeClass('on');
$('.bg_09').addClass('on');    
}
}
});
}    
}else{
this_dom.hide();
}
}



//偏好设置记录cookie
function jinsom_set_cookie(type,val){
if(val!=''){
if(type=='post-style'){
$('#jinsom-post-style').attr('href',jinsom.theme_url+'/assets/style/'+val);	
}else if(type=='layout-style'){
$('#jinsom-layout-style').attr('href',jinsom.theme_url+'/assets/style/'+val);	
}else if(type=='space-style'){
$('#jinsom-space-style').attr('href',jinsom.theme_url+'/assets/style/'+val);		
}else if(type=='sidebar-style'){
$('#jinsom-sidebar-style').attr('href',jinsom.theme_url+'/assets/style/'+val);		
}else if(type=='preference-bg'){
$('#jinsom-bg-style').attr('href',val);		
}
SetCookie(type,val);
}	
}





//追加悬赏
function jinsom_add_bbs_answer_number(post_id){
layer.prompt({title:'请输入要追加的'+jinsom.credit_name+'数量',btnAlign: 'c'},function(value, index, elem){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/answer.php",
data: {number:value,post_id:post_id,type:'add'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function a(){layer.closeAll();}setTimeout(a,2000); 
}
}
});

});	
}

//采纳答案
function jinsom_answer_adopt(obj,post_id){
this_dom=$(obj);
comment_id=$(obj).attr('data');
layer.confirm('你要采纳这个答案吗？', {
btnAlign: 'c'
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/answer.php",
data: {comment_id:comment_id,post_id:post_id,type:'adopt'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function a(){layer.closeAll();}setTimeout(a,2000); 
this_dom.parents('.right').prepend('<i class="jinsom-icon answer-icon jinsom-yicaina"></i>');
$('.jinsom-bbs-single-footer .answer').remove();
$('.jinsom-bbs-single-footer .add').remove();
$('.jinsom-bbs-post-type-answer').addClass('ok').html('');
}else if(msg.code==3){
function d(){window.location.reload();}setTimeout(d,2000);	
}	
}
});
});
}











//快捷插入表情
function jinsom_add_smile(a,type,obj){
if(type=='im-one'||type=='im-group'){//IM
content=$(obj).parents('.jinsom-chat-windows-footer-bar').next('textarea');
content.val(content.val()+a);
content.focus();	
}else{//普通
content=$(obj).parents('.jinsom-single-expression-btn').prev('textarea');
content.val(content.val()+a);
content.focus();
}
}



//访问密码论坛，输入密码
function jinsom_bbs_visit_password(){
bbs_id=$('.jinsom-bbs-visit').attr('data');
pass=$('#jinsom-bbs-visit-psssword').val();
if(pass==''){
layer.msg('请输入访问密码！');
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.module_url+"/action/bbs-visit-password.php",
data: {bbs_id:bbs_id,pass:pass,visit:1},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);	
function d(){window.location.reload();}setTimeout(d,2000);
}else if(msg.code==3){
jinsom_pop_login_style();
}else{
layer.msg(msg.msg);	
}
}
});
}
//删除已经输入的访问密码
function jinsom_delete_bbs_visit_password(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.module_url+"/action/bbs-visit-password.php",
data: {bbs_id:bbs_id,delete:1},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);	
}
});
}




//查看更多喜欢的用户
function jinsom_post_more_like(post_id){
layer.open({
type: 1,
title:'更多喜欢的用户',
resize:false,
scrollbar:true,
skin: 'jinsom-more-like-form',
area: ['250px', '420px'],
content: '<div class="jinsom-more-like-content">'+jinsom.loading_post+'</div>',
success: function(layero,index){
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/more-like.php",
type:'POST',      
data: {post_id:post_id},
success:function(msg){
$('.jinsom-more-like-content').html(msg);
}
});	
}
});
}


//用户设置邮件通知开关
function jinsom_emali_notice_form(){
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/email-notice.php",
type:'POST',      
success:function(msg){
layer.closeAll('loading');
layer.open({
type: 1,
title:'邮件通知设置',
resize:false,
area: ['200px', 'auto'],
content: msg
});	
layui.use('form', function(){
var form = layui.form;
form.render();

form.on('switch(system)', function(data){
if(data.elem.checked){
value=1
}else{
value=0	
}
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/email-notice.php",
type:'POST',   
data:{type:'system',value:value},   
success:function(msg){}
});	
}); 

form.on('switch(user)', function(data){
if(data.elem.checked){
value=1
}else{
value=0	
}
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/email-notice.php",
type:'POST',   
data:{type:'user',value:value},   
success:function(msg){}
});	
}); 

form.on('switch(comment)', function(data){
if(data.elem.checked){
value=1
}else{
value=0	
}
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/email-notice.php",
type:'POST',   
data:{type:'comment',value:value}, 
success:function(msg){}
});	
}); 


});	

}
});	

}



//拉黑
function jinsom_add_blacklist(type,author_id,obj){
if(type=='add'){
title='你要将对方加入黑名单吗？';	
}else{
title='你要将对方移出黑名单吗？';		
}
layer.confirm(title,{
btnAlign: 'c',
btn: ['确定','取消']
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/add-blacklist.php",
data: {author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).html('拉黑名单').attr('onclick','jinsom_add_blacklist("add",'+author_id+',this)');	
}else if(msg.code==2){
$(obj).html('取消拉黑').attr('onclick','jinsom_add_blacklist("remove",'+author_id+',this)');	
}
}
});
});
}


//弹出活动报名表单
function jinsom_activity_form(post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/activity.php",
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
fixed: false,
resize:false,
skin:'jinsom-activity-form',
type: 1,
area: ['500px'], 
content:msg
});


layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '.jinsom-activity-upload',
url:jinsom.jinsom_ajax_url+'/upload/file.php',
multiple:false,
accept:'file',
before: function(obj){
layer.load(1);
},
done: function(res, index, upload){
layer.closeAll('loading');
layer.msg(res.msg);	
if(res.code == 1){
$(this.item[0]).siblings('.item').val(res.file_url).after('<img src="'+res.file_url+'">');
$(this.item[0]).remove();
}else if(res.code == 4){
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(res.code == 5){
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}
},
error: function(index, upload){
layer.msg('上传失败！');
layer.closeAll('loading');
}
});
});

}
});
}

//报名
function jinsom_activity(post_id){
if($(".jinsom-activity-form-list input.item").val()==''){
layer.msg('内容不能为空！');	
return false;	
}
// if($(".jinsom-activity-form-list li").children('.upload').val()==''){
// layer.msg('请上传内容！');	
// return false;	
// }

// $(".jinsom-activity-form-list input.item").each(function(){
// if($(this).val()==''){
// layer.msg('选项不能为空！');	
// return false;	
// }
// });


data='<div class="jinsom-bbs-comment-activity">';
$(".jinsom-activity-form-list li").each(function(){
data+='<li>';
data+='<label>'+$(this).children('label').html()+'</label>';
value=$(this).children('.item').val();
if($(this).children('.item').hasClass('upload')){
if(value){
data+='<div class="content"><a href="'+value+'" target="_blank" download="" class="jinsom-post-link"><i class="fa fa-link"></i> 附件下载</a></div>';
}
}else{
data+='<div class="content">'+value+'</div>';	
}
data+='</li>';
});
data+='</div>';

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/activity.php",
data: {content:data,post_id:post_id},
success: function(msg){	
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==2){
function d(){jinsom_update_phone_form(msg.user_id);}setTimeout(d,1000);
}
}
});

}


//选择附件类型
function jinsom_upload_file_form(type){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/file-type.php",
data:{type:type},
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:false,
btn: false,
resize:false,
shade:0.4,
area: ['220px'],
content: msg
});
}
});	
}

//插入附件表单
function jinsom_insert_file_form(upload_type,editor_type){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/file-type-file.php",
data:{editor_type:editor_type,upload_type:upload_type},
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:false,
btn: false,
resize:false,
fixed: false,
skin:'jinsom-insert-file-main',
shade:0.4,
area: ['370px','auto'],
content: msg
});
//附件选择付费渲染
layui.use('form', function(){
var form = layui.form;
form.render('radio');
form.on('radio(file_pay)', function(data){
if(data.value == 0){
$('#jinsom-insert-file-pay-value').hide();
}else{
$('#jinsom-insert-file-pay-value').show();
}
});
});
}
});	
}

//编辑器插入-文件
function jinsom_bbs_insert_file(type){
file_url=$('#jinsom-insert-file-url').val();
name=$('#jinsom-insert-file-name').val();
name=name.replace(/\[|]/g,'');
info=$('#jinsom-insert-file-info').val();
info=info.replace(/\[|]/g,'');
if(file_url==''||name==''){
layer.msg('文件地址和名称不能为空！');	
return false;
}

desc=$('#jinsom-insert-file-desc').val();
desc=desc.replace(/\[|]/g,'');

if($('.jinsom-file-pay-radio').length > 0){
file_pay =$('.jinsom-file-pay-radio [name="pay_type"]:checked').val();
pay_value=$('#jinsom-insert-file-pay-value').val();
pay_value=pay_value.replace(/\[|]/g,'');
if(file_pay != 0 && pay_value == ''){
layer.msg('文件的售价不能为空！');	
return false;
}
if(file_pay == 1){
pay_value=parseInt(pay_value);
}
if(file_pay == 2){
pay_value=parseFloat(pay_value);
}
}else{
file_pay =0;
pay_value=0;
}

if(type==1){
ue.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'" file_desc="'+desc+'" file_pay="'+file_pay+'" pay_value="'+pay_value+'"] ');//论坛编辑器
}else if(type==2){
ue_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'" file_desc="'+desc+'" file_pay="'+file_pay+'" pay_value="'+pay_value+'"] ');//论坛付费编辑器
}else if(type==3){
ue_single_pay.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'" file_desc="'+desc+'" file_pay="'+file_pay+'" pay_value="'+pay_value+'"] ');//文章付费编辑器
}else{
ue_single.execCommand('inserthtml',' [file url="'+file_url+'" name="'+name+'" pass="'+info+'" file_desc="'+desc+'" file_pay="'+file_pay+'" pay_value="'+pay_value+'"] ');//文章编辑器
}
layer.closeAll();//关闭插入的表单
}
//编辑器插入-视频
function jinsom_bbs_insert_video(type){	
file_url=$('#jinsom-insert-file-url').val();
video_cover=$('#jinsom-insert-video-cover').val();
if(file_url==''){
layer.msg('视频地址不能为空！');	
return false;
}
if(type==1){
ue.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//论坛编辑器
}else if(type==2){
ue_pay.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//论坛付费编辑器
}else if(type==3){
ue_single_pay.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//文章付费编辑器
}else{
ue_single.execCommand('inserthtml',' [video url="'+file_url+'" cover="'+video_cover+'"] ');//文章编辑器
}
layer.closeAll();//关闭插入的表单
}
//编辑器插入-文件
function jinsom_bbs_insert_music(type){	
file_url=$('#jinsom-insert-file-url').val();
if(file_url==''){
layer.msg('音乐地址不能为空！');	
return false;
}
if(type==1){
ue.execCommand('inserthtml',' [music url="'+file_url+'"] ');//论坛编辑器
}else if(type==2){
ue_pay.execCommand('inserthtml',' [music url="'+file_url+'"] ');//论坛付费编辑器
}else if(type==3){
ue_single_pay.execCommand('inserthtml',' [music url="'+file_url+'"] ');//文章付费编辑器
}else{
ue_single.execCommand('inserthtml',' [music url="'+file_url+'"] ');//文章编辑器
}
layer.closeAll();//关闭插入的表单
}

//附件下载次数
function jinsom_file_download_time(filename,post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/file-download.php",
data:{filename:filename,post_id:post_id},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
window.open(msg.url,'_self');
}else if(msg.code==2){
jinsom_msg(msg.msg);
jinsom_file_pay(filename,post_id,$('.btn-' + filename));
}else if(msg.code==4){
jinsom_pay_tips_confirm(msg.msg,msg.name,jinsom_recharge_extcredits_form);
}else{
jinsom_msg(msg.msg);
function d(){window.location.reload();}setTimeout(d,2000);
}
}
});
}

//附件付费
function jinsom_file_pay(filename,post_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
type = $(obj).attr('data-type');
value = $(obj).attr('data-value');
layer.confirm('下载该文件需要支付'+$(obj).siblings('.info').find('font').text(),{
title: '付费提醒',
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/file-pay.php",
data:{filename:filename,type:type,value:value,post_id:post_id},
success: function(msg){
layer.closeAll('loading');
// layer.msg(msg.msg);
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
});
}

//附件付费提醒弹窗封装
function jinsom_pay_tips_confirm(msg,name,callback){
layer.confirm(msg,{
title: '信息提醒',
btnAlign: 'c',
btn: [name+'充值','我的钱包']
}, function(){
layer.closeAll();
$.isFunction(callback) && callback();
}, function(){
layer.closeAll();
jinsom_mywallet_form(jinsom.user_id);
});
}

//附件下载记录
function jinsom_file_download_note(filename,post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/file-download-note.php",
data:{filename:filename,post_id:post_id},
success: function(msg){
layer.closeAll('loading');
if(msg==0){
layer.confirm('你好，记录购买后可查看',{
title: '信息提醒',
btnAlign: 'c',
}, function(){
jinsom_file_pay(filename,post_id,$('.btn-' + filename));
});
}else if(msg==1){
layer.confirm('你好，你的付费已经过期，记录重新购买后可查看',{
title: '信息提醒',
btnAlign: 'c',
}, function(){
jinsom_file_pay(filename,post_id,$('.btn-' + filename));
});
}else{
layer.open({
type:1,
title:'下载记录',
btn: false,
resize:false,
area: ['600px', '570px'], 
skin: 'jinsom-download-file-note-form',
content: msg
});
}
}
});
}

//退还附件扣费
function jinsom_file_download_refund(filename,post_id,user_id,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.confirm('你确定要'+$(obj).html()+'吗？',{
title: '退还提醒',
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/file-download-refund.php",
data:{filename:filename,post_id:post_id,user_id:user_id},
success: function(msg){
layer.closeAll('loading');
jinsom_msg(msg.msg);
if(msg.code==1){
$(obj).parents('td').prev('td').text('已退还');
$(obj).parents('td').remove();
}
}
});
});
}

//赠送礼物表单
function jinsom_send_gift_form(author_id,post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/send-gift.php",
data:{author_id:author_id,post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:'赠送礼物',
btn: false,
resize:false,
area: ['600px', 'auto'], 
skin: 'jinsom-send-gift-form',
content: msg
});
}
});
}

//送礼物
function jinsom_send_gift(author_id,post_id){
if($('.jinsom-send-gift-form li.on').length==0){
layer.msg('请选择需要赠送的礼物！');	
return false;
}
name=$('.jinsom-send-gift-form li.on .top .name').text();

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/send-gift.php",
data: {name:name,author_id:author_id,post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){

ws.send('{"from_url":"'+jinsom.home_url+'","type":"gift","notice_user_id":"'+author_id+'","notice_user_name":"'+msg.notice_user_name+'","do_user_id":"'+jinsom.user_id+'","do_user_name":"'+msg.do_user_name+'","do_user_avatar":"'+msg.do_user_avatar+'","content":"'+msg.content+'","message":"'+msg.gift_name+'"}');

if(msg.post_url){
function d(){window.open(msg.post_url,'_self');}setTimeout(d,2000);
}else{
function d(){window.location.reload();}setTimeout(d,2000);
}
}
}
});


}

//视频播放
function jinsom_post_video(post_id,video_url,cover,autoplay){
video_type=jinsom_video_type(video_url);
window['video_'+post_id]=new window[video_type]({
id:'jinsom-video-'+post_id,
url:video_url,
poster:cover,
playbackRate: [0.5,1,1.5,2,6],
fitVideoSize:'fixWidth',
pip: true,
rotate:{
"clockwise": true,
"innerRotate": true
},
autoplay:autoplay,
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

//弹窗视频
function jinsom_pop_video(video_url,video_img,obj){
var rand = Math.floor(Math.random()*(100000 - 9999999) + 9999999);
var title =$(obj).attr('data');
if(title==''){title='每日视频推荐';}
layer.open({
type: 1,
title: title,
area: ['600px','380px'],
fixed:false,
resize:false,
skin:'jinsom-pop-video',
content: '<div id="jinsom-video-'+rand+'"></div>'
});
jinsom_post_video(rand,video_url,video_img,true);
}




//显示IM表情
function jinsom_smile(obj,type,dom){
window.event.stopPropagation();
if($(obj).children('.jinsom-smile-form').length>0){
$(obj).children('.jinsom-smile-form').toggle(100);
}else{
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.module_url+"/stencil/smile.php",
data:{type:type,dom:dom},
success: function(msg){
layer.closeAll('loading');

if(type=='im'){
$(obj).html(msg);//IM
}else{
$(obj).append(msg);//普通|富文本
}

//切换表情
$('.jinsom-smile-form .header li').click(function(e){
e.stopPropagation();
$(this).addClass('on').siblings().removeClass('on');
$(this).parent().next().children('ul').eq($(this).index()).show().siblings().hide();
});

$(obj).children('.jinsom-smile-form').show();
}
});
}
}

//显示内容表情
// function jinsom_post_smile(obj){
// window.event.stopPropagation();
// $(obj).children('.jinsom-smile-form').toggle(100);
// }


//清除未读IM消息
function jinsom_clear_im_notice(){
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/notice-clear.php",
success: function(msg){
layer.msg(msg.msg);
if(msg.code==1){
$('.jinsom-chat-list-tips,.jinsom-right-bar-im span').remove();
}
}
});
}


//弹窗选择佩戴头衔
function jinsom_use_honor_form(user_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/use-honor.php",
type:'POST', 
data:{user_id:user_id},
success:function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
skin: 'jinsom-select-honor-form', 
area: ['400px', 'auto'], 
content: msg
});
$('.jinsom-user_honor-select-form .list li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});

}   
});
}

//提交选择头衔
function jinsom_use_honor(user_id){
dom=$('.jinsom-user_honor-select-form .list li.on');
if(dom.length==0){
layer.msg('请选择要使用的头衔！');
return false;
}
honor=dom.text();
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/use-honor.php",
type:'POST', 
data:{user_id:user_id,honor:honor},
success:function(msg){
layer.closeAll('loading');
if(msg.code==1){
$('#jinsom-honor').val(msg.honor);
layer.closeAll();
layer.msg(msg.msg);
}else{
layer.msg(msg.msg);	
}
}   
});
}


//打开实时动态
function jinsom_open_now(){
// $(".jinsom-main").animate({left:"-300px"});
$(".jinsom-now").animate({right:"0px"});

if($('.jinsom-now-content li').length==0){
$('.jinsom-now-content').html(jinsom.loading_post);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/now.php",
data:{page:1,type:1},
type:'POST', 
success:function(msg){
$('.jinsom-now-content').html(msg);
}   
});
}
}

//关闭实时动态
function jinsom_close_now(){
// $(".jinsom-main").animate({left:"0px"},250);
$(".jinsom-now").animate({right:"-350px"},250);
}

//刷新实时动态
function jinsom_refresh_now(){
$('.jinsom-now-content').html(jinsom.loading_post);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/now.php",
data:{page:1,type:1},
type:'POST', 
success:function(msg){
$('.jinsom-now-content').html(msg);
$('.jinsom-now-content').attr('page',2);
}   
});	
}

//加载更多实时动态
function jinsom_more_now(){
page=parseInt($('.jinsom-now-content').attr('page'));
$.ajax({   
url:jinsom.jinsom_ajax_url+"/stencil/now.php",
data:{page:page,type:2},
type:'POST', 
success:function(msg){
if(msg==0){
$('.jinsom-now-more').remove();	
layer.msg('没有更多内容！');
}else{
$('.jinsom-now-more').before(msg);
$('.jinsom-now-content').attr('page',page+1);
}
}   
});	
}

//提现表单
function jinsom_cash_form(cash_type){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/cash-"+cash_type+".php",
success: function(msg){
layer.closeAll('loading');
window.cash_form=layer.open({
title:'提现',
fixed: false,
skin:'jinsom-cash-form',
type: 1,
area: ['380px', 'auto'], 
content: msg
});
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

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/cash.php",
data:{number:number,type:type,name:name,alipay:alipay,wechat:wechat,cash_type:cash_type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.close(cash_form);}setTimeout(c,2000);
}
}
});
}

//查看提现详情
function jinsom_cash_more(ID){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/cash-more.php",
data:{ID:ID},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
skin:'jinsom-cash-form',
type: 1,
area: ['380px', 'auto'], 
content: msg
});
}
});
}


//内容限流
function jinsom_limit_post(post_id,obj){
layer.prompt({title: '请输入限流的原因',btnAlign: 'c',formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/limit-post.php",
data:{post_id:post_id,reason:reason},
success: function(msg){
layer.closeAll('loading');
jinsom_msg(msg.msg);
if(msg.code==1){
$(obj).parents('.jinsom-posts-list').fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function() {
$(this).remove();
});
});
function c(){layer.closeAll();}setTimeout(c,2000);
}
}
});
});
}

//内容限流-取消
function jinsom_cancel_limit_post(post_id){
layer.confirm('你确定要取消该内容的限流吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/limit-post-cancel.php",
data:{post_id:post_id},
success: function(msg){
layer.closeAll('loading');
jinsom_msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
});
}


//==============内容审核



//内容管理
function jinsom_content_management_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/content-management.php",
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'内容管理',
type: 1,
area: ['700px', '560px'], 
resize:false,
content: msg
});
}
});
}

//通过审核
function jinsom_content_management_agree(post_id,obj){
layer.confirm('你要通过该内容吗',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'agree'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parent().html('<m style="color:#5fb878">已通过</m>');
}
}
});
});
}

//驳回内容
//where:==1 在列表 ==2 在内容管理页面
function jinsom_content_management_refuse(post_id,bbs_id,where,obj){
layer.prompt({title: '请输入驳回的原因',btnAlign: 'c',formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,bbs_id:bbs_id,type:'refuse',reason:reason,where:where},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(where==1){
if($('.jinsom-main-content').hasClass('single')){//如果在内容页面删除，直接返回首页
if(bbs_id){
back_url=msg.url;
}else{
back_url='/';
}
function d(){window.location.href=back_url;}setTimeout(d,2000);	
}else{
$(obj).parents('.jinsom-posts-list').fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function() {
$(this).remove();
});
});
}
}else{
$(obj).parent().html('<m style="color:#f00">已驳回</m>');
}
layer.close(index);
}
}
});
});
}

//取消审核
function jinsom_content_management_pending_refuse(post_id,obj){
layer.confirm('取消的内容将显示在驳回列表，你确定吗',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'pending_refuse'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parent().html('<m style="color:#f00">已取消</m>');
}
}
});
});
}

//查看驳回原因
function jinsom_content_management_reason_form(post_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/content-management.php",
data:{post_id:post_id,type:'read_reason'},
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'驳回原因',
type: 1,
area: ['300px'], 
resize:false,
content: msg
});
}
});
}

//锁帖--禁止删除，禁止修改，禁止评论
function jinsom_lock_post(post_id,bbs_id,type){
layer.confirm('你确定要锁帖吗？这将会禁止该内容修改/删除/评论',{
btnAlign: 'c',
btn: ['确定','取消']
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/action/post-lock.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){
layer.closeAll('loading');
jinsom_msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
});
}

//解锁帖子
function jinsom_unlock_post(post_id,bbs_id,type){
layer.confirm('你确定要解锁帖子吗？',{
btnAlign: 'c',
btn: ['确定','取消']
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url: jinsom.jinsom_ajax_url+"/action/post-unlock.php",
data: {post_id:post_id,bbs_id:bbs_id,type:type},
success: function(msg){
layer.closeAll('loading');
jinsom_msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
});
}

//切换马甲表单
function jinsom_majia_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/majia.php",
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'切换马甲帐号',
type: 1,
fixed: false,
area: ['500px'],
offset: '50px',
resize:false,
content: msg
});
}
});
}

//切换马甲
function jinsom_exchange_majia(majia_user_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/majia.php",
data:{majia_user_id:majia_user_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
}

//抢红包
function jinsom_get_redbag(post_id,obj){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/get-redbag.php",
data:{post_id:post_id},
success: function(msg){
layer.closeAll('loading');
if(msg==0){
layer.msg('需要关注作者才可以领取红包！');
}else{
mywallet_form=layer.open({
title:false,
type: 1,
fixed: false,
area: ['300px'],
content: msg
});

$(obj).find('.tips').text('已打开');


}

}
});
}

//任务表单
function jinsom_task_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/task.php",
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:'做任务',
type: 1,
fixed: false,
skin:'jinsom-pop-task-form',
offset: '50px',
area: ['700px'],
offset: '50px',
resize:false,
content: msg
});
}
});
}

//领取任务奖励
function jinsom_task_finish(task_id,type,obj){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/task.php",
data:{task_id:task_id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
audio=document.getElementById('jinsom-sign-music');
audio.play();
$(obj).addClass('had').removeClass('on').text('已领取');
number_obj=$('.jinsom-task-form-header .header .number n');
number=parseInt(number_obj.text());
number_obj.text(number+1);
}

}
});
}

//打开宝箱任务表单
function jinsom_task_treasure_form(task_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/task-treasure.php",
data:{task_id:task_id},
success: function(msg){
layer.closeAll('loading');
mywallet_form=layer.open({
title:false,
type: 1,
fixed: false,
area: ['300px','auto'],
skin:'jinsom-pop-task-form',
resize:false,
content: msg
});
}
});
}
//打开宝箱任务
function jinsom_task_treasure(task_id,obj){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/task-treasure.php",
data:{task_id:task_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
audio=document.getElementById('jinsom-sign-music');
audio.play();
$(obj).addClass('had').text('已领取');
}
}
});
}

//转移板块表单
function jinsom_change_bbs_form(post_id,bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/change-bbs.php",
data:{post_id:post_id,bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'转移板块',
type: 1,
fixed: false,
skin:'jinsom-change-bbs-form',
offset: '50px',
area: ['300px'],
resize:false,
content: msg
});
}
});
}

//转移板块
function jinsom_change_bbs(post_id,bbs_id){
new_bbs_id='';
$('.jinsom-change-bbs-content li input:checkbox:checked').each(function (index, item) {
new_bbs_id+=$(this).val()+',';
});

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/change-bbs.php",
data:{post_id:post_id,bbs_id:bbs_id,new_bbs_id:new_bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
function c(){window.location.reload();}setTimeout(c,2000);
}
});
}


//弹出通知表单
function jinsom_system_notice_form(obj){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/system-notice.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'通知消息',
type: 1,
fixed: false,
skin:'jinsom-system-notice-form',
// offset: '50px',
area: ['400px','550px'],
resize:false,
content: msg
});
$(obj).children('.tips').remove();
}
});
}

//加载更多消息通知
function jinsom_system_notice_more(obj){
page=parseInt($(obj).attr('data'));
$(obj).before(jinsom.loading_post);
$(obj).hide();
$.ajax({
type: "POST",
url:jinsom.mobile_ajax_url+"/post/system-notice.php",
data:{page:page},
success: function(msg){
$('.jinsom-load-post').remove();

if(msg!='0'){
$(obj).before(msg);
page=page+1;
$(obj).attr('data',page);
$(obj).show();	
}else{
layer.msg('没有更多通知！');
$(obj).remove();
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


//申请版主表单
function jinsom_apply_bbs_admin_form(bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/apply-bbs-admin.php",
data:{bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'申请',
type: 1,
skin:'jinsom-apply-bbs-admin-form',
area: ['300px','300px'],
resize:false,
content: msg
});

layui.use('form', function(){
var form = layui.form;
form.render();
});

}
});
}


//申请版主
function jinsom_apply_bbs_admin(bbs_id){
type=$('#jinsom-apply-bbs-admin-type').val();
reason=$('#jinsom-apply-bbs-admin-reason').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/apply-bbs-admin.php",
data:{bbs_id:bbs_id,type:type,reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
}


//申请论坛表单
function jinsom_apply_bbs_form(){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/apply-bbs.php",
success: function(msg){
layer.closeAll('loading');
window.apply_bbs_form=layer.open({
title:'申请'+jinsom.bbs_name,
type: 1,
skin:'jinsom-apply-bbs-form',
area: ['550px','600px'],
resize:false,
content: msg
});

//论坛上传头像
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '#apply-bbs-avatar',
url: jinsom.jinsom_ajax_url+'/upload/apply-term.php',
accept:'file',
before: function(obj){
$('#apply-bbs-avatar').show().html(jinsom.loading);
},
done: function(res, index, upload){
$('#apply-bbs-avatar').hide().html('上传头像');
if(res.code == 1){
$('#bbs-avatar').attr('src',res.file_url).show();
$('#apply-bbs-avatar-url').val(res.file_url);
}else if(res.code == 4){
jinsom_msg(res.msg);
function d(){jinsom_update_phone_form(jinsom.user_id);}setTimeout(d,2000);
}else if(res.code == 5){
jinsom_msg(res.msg);
function e(){jinsom_update_mail_form(jinsom.user_id,2);}setTimeout(e,1500);
}else{
layer.msg(res.msg);	
}
},
error: function(index, upload){
layer.msg('上传失败！');
$('#apply-bbs-avatar').hide().html('上传头像');
}
});

});

layui.use('form', function(){
var form = layui.form;
form.render();

//发表权限
form.on('select(power_form)', function(data){
$select_value=parseInt($("#power_form").val());
if($select_value==6){
$("#jinsom-publish-power-lv").show();    
}else{
$("#jinsom-publish-power-lv").hide();     
}
if($select_value==7){
$("#jinsom-publish-power-honor").show();    
}else{
$("#jinsom-publish-power-honor").hide();     
}
if($select_value==8){
$("#jinsom-publish-power-verify").show();    
}else{
$("#jinsom-publish-power-verify").hide();     
}
});

//回帖权限
form.on('select(comment_power)', function(data){
$select_value=parseInt($("#jinsom-bbs-comment-power").val());
if($select_value==6){
$("#jinsom-bbs-comment-power-lv").show();    
}else{
$("#jinsom-bbs-comment-power-lv").hide();     
}
if($select_value==7){
$("#jinsom-bbs-comment-power-honor").show();    
}else{
$("#jinsom-bbs-comment-power-honor").hide();     
}
if($select_value==8){
$("#jinsom-bbs-comment-power-verify").show();    
}else{
$("#jinsom-bbs-comment-power-verify").hide();     
}
});

//访问权限
form.on('select(visit_power_form)',function(data){
$select_value=parseInt($("#visit_power_form").val());
if($select_value==5){
$("#jinsom-visit-power-pass").show();    
}else{
$("#jinsom-visit-power-pass").hide();     
}
if($select_value==6){
$("#jinsom-visit-power-exp").show();    
}else{
$("#jinsom-visit-power-exp").hide();     
}
if($select_value==12){
$("#jinsom-visit-power-vip-number").show();    
}else{
$("#jinsom-visit-power-vip-number").hide();     
}
if($select_value==7){
$("#jinsom-visit-power-user").show();    
}else{
$("#jinsom-visit-power-user").hide();     
}
if($select_value==9){
$("#jinsom-visit-power-honor").show();    
}else{
$("#jinsom-visit-power-honor").hide();     
}
if($select_value==10){
$("#jinsom-visit-power-verify").show();    
}else{
$("#jinsom-visit-power-verify").hide();     
}
if($select_value==11){
$("#jinsom-visit-power-pay").show();    
}else{
$("#jinsom-visit-power-pay").hide();     
}
});

});
}
});
}

//申请论坛
function jinsom_apply_bbs(){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
data=$('.jinsom-apply-bbs-content').serialize();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/apply-bbs.php",
data: data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.close(apply_bbs_form);}setTimeout(c,2000);
}
}
});

}


//付费访问论坛
function jinsom_bbs_visit_pay(bbs_id){
layer.confirm('你确定要支付吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/bbs-visit-pay.php",
data:{bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}else if(msg.code==3){
function c(){jinsom_recharge_credit_form();}setTimeout(c,1500);
}else if(msg.code==5){
function c(){jinsom_recharge_money_form();}setTimeout(c,1500);
}
}
});
});
}


//生成二维码
function jinsom_qrcode(dom,width,height,link){
console.log(link);
$('#'+dom).qrcode({
width:width,
height:height,
text:link
});
}


//订单确定表单
function jinsom_goods_order_confirmation_form(post_id){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
var number=$('#jinsom-goods-number').val();
var select_arr={};
var i=0;
$(".jinsom-goods-single-header .right .select li").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('span').text();
select_arr[i]['value']=$(this).children('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.jinsom-goods-single-header .right .select-price').length>0){//存在价格套餐
length=$('.jinsom-goods-single-header .right .select li').length;
select_arr[length]={};
select_arr[length]['name']=$('.jinsom-goods-single-header .right .select-price li span').text();
select_arr[length]['value']=$('.jinsom-goods-single-header .right .select-price li n.on').text();
select_price=$('.jinsom-goods-single-header .right .select-price li n.on').index();//价格套餐选择的位置
}

select_arr=JSON.stringify(select_arr);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/order-confirmation.php",
data:{select_arr:select_arr,post_id:post_id,number:number,select_price:select_price,from:'page'},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'订单确定',
type: 1,
fixed: false,
offset: '100px',
skin:'jinsom-goods-order-confirmation-form',
area: ['550px','auto'],
resize:false,
content: msg
});
}
});
}

// 加入购物车
function jinsom_join_shopping_cart(post_id) {
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
var number=$('#jinsom-goods-number').val();
var select_arr={};
var i=0;
$(".jinsom-goods-single-header .right .select li").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('span').text();
select_arr[i]['value']=$(this).children('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.jinsom-goods-single-header .right .select-price').length>0){//存在价格套餐
length=$('.jinsom-goods-single-header .right .select li').length;
select_arr[length]={};
select_arr[length]['name']=$('.jinsom-goods-single-header .right .select-price li span').text();
select_arr[length]['value']=$('.jinsom-goods-single-header .right .select-price li n.on').text();
select_price=$('.jinsom-goods-single-header .right .select-price li n.on').index();//价格套餐选择的位置
}

select_arr=JSON.stringify(select_arr);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/shopping-cart-join.php",
data:{select_arr:select_arr,post_id:post_id,number:number,select_price:select_price},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});
}

function jinsom_shopping_cart(user_id) {
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.open({
title:'我的购物车',
type: 1,
fixed: false,
skin:'jinsom-goods-shopping-cart-form',
area: ['1150px','80%'],
resize:false,
content: `<div class="layui-form jinsom-shpping-cart-form"></div>`
});
jinsom_shopping_cart_render(user_id);
}

//我的购物车
function jinsom_shopping_cart_render(user_id) {
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/shopping-cart.php",
data:{user_id:user_id},
success: function(msg){
layer.closeAll('loading');

$('.jinsom-shpping-cart-form').html(msg);
//改变商品数量
$('[name="goods_number"]').change(function(){
old_goods_price = $(this).parent().siblings('.goods-price').children('em').text();
goods_number = $(this).val();
if(goods_number == '' || goods_number <= 0) {
goods_number = 1;
$(this).val(1);
}
if(goods_number>99){
$(this).val(99);
}
goods_price = parseFloat($(this).parent().siblings('.goods-value').children('input').attr('data-price'));
$(this).parent().siblings('.goods-price').children('em').text(goods_price * goods_number);
$(this).parent().siblings('.goods-value').children('input').val(goods_price * goods_number);
// console.log($(this).parent());
goods_checked = $(this).parent().siblings('.goods-value').children('input').is(':checked');
if(goods_checked){
// 如果商品已经被选中
if($(this).parent().siblings('.goods-value').children('input').attr('name') == 'jinbi'){ //如果付款类型是金币
jinbi = parseInt($('#selected-items-price-jinbi-total').text());
$('#selected-items-price-jinbi-total').text(jinbi - parseInt(old_goods_price) + goods_price * goods_number);
}else{
yuan = parseFloat($('#selected-items-price-total').text());
$('#selected-items-price-total').text(yuan - parseFloat(old_goods_price) + goods_price * goods_number);
}
}
});

layui.use('form', function(){
var form = layui.form;
form.render();

// 全选
form.on('checkbox(jinsom_all_goods)', function(data){
var child = $('.jinsom-shpping-cart-form input[type="checkbox"]');
child.each(function (index, item) {
item.checked = data.elem.checked;
});

all_jinbi = 0;
all_yuan = 0;
$('.jinsom-shpping-cart-table input[name="jinbi"]').each(function(i,n){
if(data.elem.checked){
all_jinbi += parseInt(n.value);
}else{
all_jinbi = '0.00';
}
});

$('.jinsom-shpping-cart-table input[name="yuan"]').each(function(d,t){
if(data.elem.checked){
all_yuan += parseFloat(t.value);
}else{
all_yuan = '0.00';
}
});

form.render('checkbox');
var selected_num = $('.jinsom-shpping-cart-table input[type="checkbox"]:checked').length - 1;
if(selected_num < 0) {selected_num = 0;}
$('#selected-items-count').text(selected_num);

$('#selected-items-price-jinbi-total').text(all_jinbi);
$('#selected-items-price-total').text(all_yuan);

if(data.elem.checked){
$(data.elem).parents('.jinsom-shpping-cart-form').children('.jinsom-shpping-cart-table').find('tbody').children('tr').siblings().addClass('on');
$('.jinsom-shpping-cart-bar .buy-btn').addClass('ok');
}else{
$(data.elem).parents('.jinsom-shpping-cart-form').children('.jinsom-shpping-cart-table').find('tbody').children('tr').siblings().removeClass('on');
$('.jinsom-shpping-cart-bar .buy-btn').removeClass('ok');
}
});

// 单选
form.on('checkbox(jinsom_shopping_cart)', function(data){
var selected_num = parseInt($('#selected-items-count').text());
if(selected_num < 0) {
selected_num = 0;
}
jinbi = parseInt($('#selected-items-price-jinbi-total').text());
yuan = parseFloat($('#selected-items-price-total').text());

if(data.elem.checked){
$(data.elem).parents('tr').addClass('on');
$('.jinsom-shpping-cart-bar .buy-btn').addClass('ok');
if(data.elem.name == 'jinbi') {
$('#selected-items-price-jinbi-total').text(jinbi+parseInt(data.value));
}else{
$('#selected-items-price-total').text(yuan+parseFloat(data.value));
}
$('#selected-items-count').text(selected_num + 1);
}else{
$(data.elem).parents('tr').removeClass('on');
if(selected_num - 1 <= 0) {
$('.jinsom-shpping-cart-bar .buy-btn').removeClass('ok');
}
$('#selected-items-count').text(selected_num - 1);
if(data.elem.name == 'jinbi') {
$('#selected-items-price-jinbi-total').text(jinbi-parseInt(data.value));
}else{
$('#selected-items-price-total').text(Math.round((yuan-parseFloat(data.value)) * 100) / 100);
}
}
});

});

}

});
}

//购物车里移除商品
function jinsom_shopping_cart_delete_goods(key,obj) {
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
layer.confirm('你确定要将该商品移出购物车吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/shopping-cart-delete.php",
data:{key:key,type:'one'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code == 1){
$(obj).parents('tr').remove();
// 重载购物车
function d(){jinsom_shopping_cart_render(msg.user_id);}setTimeout(d,500);
}
}
});
});
}

//购物车里批量移除
function jinsom_shopping_cart_delete_batch_goods() {
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
order_el = $('.jinsom-shpping-cart-table input[type="checkbox"]:checked');
if(order_el.length < 1) {
layer.msg('请选择要移除的商品！');
return false;
}
key_arr = [];
var a=0;
$('.jinsom-shpping-cart-table input[type="checkbox"]:not([name="all_goods"]):checked').each(function(index, item){
key_arr.push($(item).attr('data-id'));
a++;
});

layer.confirm('你确定要将这些商品移出购物车吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/shopping-cart-delete.php",
data:{key_arr:JSON.stringify(key_arr),type:'batch'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code == 1){
for (i = 0; i < a; i++) {
$('.jinsom-shpping-cart-table input[type="checkbox"]:checked').parents('tr').remove();
}
// 重载购物车
function d(){jinsom_shopping_cart_render(msg.user_id);}setTimeout(d,500);
}
}
});
});
}

//提交购物车里订单
function jinsom_batch_order_confirmation_form() {
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}
order_el = $('.jinsom-shpping-cart-table input[type="checkbox"]:not([name="all_goods"]):checked');
if(order_el.length < 1) {
layer.msg('请选择订单！');
return false;
}
var order_key={};
var i=0;
order_el.each(function(index,item){
order_key[i]={};
order_key[i]['key']=$(item).attr('data-id');
order_key[i]['number']=$(item).parent().siblings('.goods-number').children('input').val();
i++;
});

key_arr=JSON.stringify(order_key);

if(parseInt($('#selected-items-price-jinbi-total').text()) > jinsom.credit) {
layer.msg('您的'+jinsom.credit_name+'不足支付所选的'+jinsom.credit_name+'订单！');
return false;
}

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/order-confirmation.php",
data:{key_arr:key_arr,from:'shopping_cart'},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'订单确定',
type: 1,
fixed: false,
offset: '100px',
skin:'jinsom-goods-order-confirmation-form batch',
area: ['550px','80%'],
resize:false,
content: msg
});
}
});
}

//从购物车批量提交商品--条件检查
function jinsom_goods_batch_buy_check() {
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}

order_el = $('.jinsom-shpping-cart-table input[type="checkbox"]:not([name="all_goods"]):checked');
if(order_el.length < 1) {
layer.msg('请选择订单！');
return false;
}
var order_key={};
var i=0;
order_el.each(function(index,item){
order_key[i]={};
order_key[i]['key']=$(item).attr('data-id');
order_key[i]['number']=$(item).parent().siblings('.goods-number').children('input').val();
order_key[i]['marks']=$('.jinsom-goods-order-confirmation-content .marks input[name="'+$(item).attr('data-id')+'_mark"]').val();

//下单信息
if($('.jinsom-goods-order-confirmation-content .pass-info').length>0){
order_key[i]['info_arr']={};
var a=0;
$('.jinsom-goods-order-confirmation-content .pass-info .list li.'+$(item).attr('data-id')+'-pass-info').each(function(){
order_key[i]['info_arr'][a]={};
order_key[i]['info_arr'][a]['name']=$(this).children('span').text();
order_key[i]['info_arr'][a]['value']=$(this).children('input').val();
a++;
});
}

i++;
});

key_arr=JSON.stringify(order_key);

var address=$('.jinsom-goods-order-confirmation-content .address li input:radio:checked').val();

var pay_type='creditpay';
if($('.jinsom-credit-recharge-type').length>0){
if($('.jinsom-credit-recharge-type li.on').length==0){
layer.msg('请选择支付方式！');
return false;
}
pay_type=$('.jinsom-credit-recharge-type li.on').attr('data');
}

trade_no=new Date().getTime();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-batch-buy-check.php",
data:{key_arr:key_arr,address:address,pay_type:pay_type},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);
jinsom_goods_batch_buy(key_arr,address,pay_type,trade_no);
}else if(msg.code==2){//充值页面
layer.msg(msg.msg);
function c(){layer.closeAll();jinsom_recharge_credit_form();}setTimeout(c,1500);
}else if(msg.code==3){//我的订单
layer.closeAll();
layer.msg(msg.msg);
function c(){layer.closeAll();jinsom_goods_order_form();}setTimeout(c,1800);
}else{//其他失败情况
layer.msg(msg.msg);
}

}
});
}

//从购物车批量提交商品
function jinsom_goods_batch_buy(key_arr,address,pay_type,trade_no) {
if(!jinsom.is_login){
jinsom_pop_login_style();
return false;
}

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-batch-buy.php",
data:{key_arr:key_arr,address:address,pay_type:pay_type,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);
function c(){layer.closeAll();jinsom_goods_order_form();}setTimeout(c,2000);
}else if(msg.code==2){//人民币付款
jinsom_goods_order_pay(pay_type,trade_no);//发起订单支付
}

}
});
}

//提交购买商品
function jinsom_goods_buy(post_id){
var number=$('#jinsom-goods-number').val();
var address=$('.jinsom-goods-order-confirmation-content .address li input:radio:checked').val();
var marks=$('.jinsom-goods-order-confirmation-content .marks textarea').val();

var pay_type='creditpay';
if($('.jinsom-credit-recharge-type').length>0){
if($('.jinsom-credit-recharge-type li.on').length==0){
layer.msg('请选择支付方式！');
return false;
}
pay_type=$('.jinsom-credit-recharge-type li.on').attr('data');
}


//下单信息
if($('.jinsom-goods-order-confirmation-content .pass-info').length>0){
var info_arr={};
var a=0;
var b='';
$(".jinsom-goods-order-confirmation-content .pass-info .list li").each(function(){
info_arr[a]={};
info_arr[a]['name']=$(this).children('span').text();
info_arr[a]['value']=$(this).children('input').val();
b+=$(this).children('input').val();
a++;
});
info_arr=JSON.stringify(info_arr);
}else{
info_arr='';	
}

if(b==''){
layer.msg('下单信息不能为空！');
return false;	
}


var select_arr={};
var i=0;
$(".jinsom-goods-single-header .right .select li").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('span').text();
select_arr[i]['value']=$(this).children('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.jinsom-goods-single-header .right .select-price').length>0){//存在价格套餐
length=$('.jinsom-goods-single-header .right .select li').length;
select_arr[length]={};
select_arr[length]['name']=$('.jinsom-goods-single-header .right .select-price li span').text();
select_arr[length]['value']=$('.jinsom-goods-single-header .right .select-price li n.on').text();
select_price=$('.jinsom-goods-single-header .right .select-price li n.on').index();//价格套餐选择的位置
}

select_arr=JSON.stringify(select_arr);
trade_no=new Date().getTime();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-buy.php",
data:{info_arr:info_arr,select_arr:select_arr,post_id:post_id,number:number,address:address,marks:marks,select_price:select_price,pay_type:pay_type,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.msg(msg.msg);
function c(){layer.closeAll();jinsom_goods_order_form();}setTimeout(c,2000);
}else if(msg.code==2){//充值页面
layer.msg(msg.msg);
function c(){layer.closeAll();jinsom_recharge_credit_form();}setTimeout(c,1500);
}else if(msg.code==3){//人民币付款
jinsom_goods_order_pay(pay_type,trade_no);//发起订单支付
}else if(msg.code==5){//我的订单
layer.closeAll();
layer.msg(msg.msg);
function c(){layer.closeAll();jinsom_goods_order_form();}setTimeout(c,1800);
}else{//其他失败情况
layer.msg(msg.msg);
}

}
});

}

//商品订单支付
function jinsom_goods_order_pay(pay_type,trade_no){
if(pay_type=='alipay_pc'){
window.location.href=jinsom.home_url+'/Extend/pay/alipay/alipay.php?trade_no='+trade_no;
}else if(pay_type=='alipay_code'||pay_type=='wechatpay_pc'||pay_type=='xunhupay_wechat_pc'||pay_type=='zhanpay_wechat_native'){
ajax_type='POST';
pay_tips='<p><i class="jinsom-icon jinsom-weixinzhifu"></i> 微信扫码支付</p>';
if(pay_type=='alipay_code'){
ajax_type='GET';
pay_tips='<p style="color: #00a7ff;"><i class="jinsom-icon jinsom-zhifubaozhifu" style="color: #00a7ff;font-size: 24px;vertical-align: -3px;"></i> 支付宝扫码支付</p>';
pay_url=jinsom.home_url+'/Extend/pay/alipay/qrcode.php';
}else if(pay_type=='wechatpay_pc'){
pay_url=jinsom.home_url+"/Extend/pay/wechatpay/wechatpay-code.php";
}else if(pay_type=='zhanpay_wechat_native'){
pay_url=jinsom.home_url+"/Extend/pay/zhanpay/wechatpay-native.php";
}else if(pay_type=='xunhupay_wechat_pc'){
pay_url=jinsom.home_url+"/Extend/pay/xunhupay/wechatpay-xunhu-code.php";
}
	

//生成二维码
layer.load(1);
$.ajax({   
url:pay_url,
type:ajax_type,   
data:{trade_no:trade_no},
success:function(msg){   
layer.closeAll('loading');
if(pay_type=='xunhupay_wechat_pc'){
pay_code='<img style="width:200px;height:200px;" src="'+msg+'">';
}else{
pay_code='<div id="jinsom-qrcode"></div>';
}

layer.open({
type:1,
title:false,
btn: false,
resize:false,
area: ['300px', '330px'], 
skin: 'jinsom-wechatpay-code-form',
content: '<div class="jinsom-wechatpay-code-content">'+pay_code+pay_tips+'</div>',
cancel: function(index,layero){ 
$('#jinsom-goods-trade-no').val(new Date().getTime());
jinsom_check_goods_order_ajax.abort();//取消长轮询
},
success:function(){
if(pay_type!='xunhu-wechat'){
jinsom_qrcode('jinsom-qrcode',200,200,msg);
}
jinsom_check_goods_order(trade_no);//发起长轮询
}
});


}   
});


}else if(pay_type=='epay_alipay'||pay_type=='epay_wechatpay'){//易支付
window.location.href=jinsom.home_url+'/Extend/pay/epay/index.php?trade_no='+trade_no+'&pay_type='+pay_type;
}else if(pay_type=='epusdt'){//USDT
window.location.href=jinsom.home_url+'/Extend/pay/Epusdt/pay.php?trade_no='+trade_no+'&pay_type='+pay_type;
}
}


//检查订单状态
function jinsom_check_goods_order(trade_no){
jinsom_check_goods_order_ajax=$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/check-trade-goods.php",
data:{trade_no:trade_no},
success: function(msg){
if(msg.code==0){
jinsom_check_goods_order(trade_no);
}else if(msg.code==1){
$('.jinsom-wechatpay-code-content').html(msg.msg);
function c(){window.location.reload();}setTimeout(c,2000);
}else{
jinsom_check_goods_order(trade_no);	
}
}
});	
}


//我的订单表单
function jinsom_goods_order_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/goods-order.php",
success: function(msg){
layer.closeAll('loading');

layer.open({
type:1,
title:'我的订单',
resize:false,
fixed: false,
area: ['700px', '580px'], 
skin: 'jinsom-goods-order-form',
content: msg
});

}
});

}


//提交订单之后再次进行支付的确定表单
function jinsom_goods_order_confirmation_buy_form(trade_no,type){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/order-confirmation-buy.php",
data:{trade_no:trade_no,type:type},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'订单支付',
type: 1,
fixed: false,
offset: '100px',
skin:'jinsom-goods-order-confirmation-form',
area: ['550px','auto'],
resize:false,
content: msg
});
}
});
}


//删除商品订单
function jinsom_goods_order_delete(ID,obj){
layer.confirm('你确定要删除吗？',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/goods-order-delete.php",
data: {ID:ID},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
$(obj).parents('li').fadeTo("slow",0.06, function(){
$(this).slideUp(0.06, function() {
$(this).remove();
});
});
}
});
});
}


//商品评价表单
function jinsom_goods_order_comment_form(post_id,trade_no){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/goods-order-comment.php",
data:{post_id:post_id,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'订单评价',
type: 1,
fixed: false,
skin:'jinsom-goods-order-comment-form',
area: ['500px','auto'],
resize:false,
content: msg
});

layui.use(['rate'], function(){
var rate = layui.rate;
rate.render({
elem: '#jinsom-goods-order-comment-star',
value:5
})
});

}
});
}

//商品评价
function jinsom_goods_order_comment(post_id,trade_no){
star=$('.jinsom-goods-order-comment-content .layui-icon-rate-solid').length;
content=$('#jinsom-goods-order-comment-val').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-order-comment.php",
data: {star:star,content:content,post_id:post_id,trade_no:trade_no},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.closeAll();jinsom_goods_order_form();}setTimeout(c,2000);
}

}
});
}


//点击广告
function jinsom_click_ad(){
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/click-ad.php",
});	
}


//评论置顶
function jinsom_up_comment(comment_id,bbs_id,obj){
title=$(obj).text();
layer.confirm('你确定要'+title+'吗？', {
btnAlign: 'c',
btn: ['确定','取消'] 
}, function(){
layer.load(1);
$.ajax({
type: "POST",
dataType:'json',
url:  jinsom.jinsom_ajax_url+"/action/up-comment.php",
data: {comment_id:comment_id,bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);  
$(obj).text(msg.name);

if(!bbs_id){//动态类
$(obj).parents('.jinsom-post-comment-list').find('.up-comment').remove();	
if(msg.code==1){//成功
$(obj).parents('li').find('.jinsom-comment-info-footer').prepend('<span class="up-comment">'+title+'</span>');
$(obj).parents('.jinsom-post-comment-list').prepend($(obj).parents('li'));
$(obj).parents('li').siblings().find('.comment-up').text(title);
}
}else{//帖子
$(obj).parents('.jinsom-bbs-comment-list').find('.up-comment').remove();	
if(msg.code==1){//成功
$(obj).parents('.jinsom-bbs-single-box').children('.right').prepend('<span class="up-comment">'+title+'</span>');
$(obj).parents('.jinsom-bbs-comment-list').prepend($(obj).parents('.jinsom-bbs-single-box'));
$(obj).parents('.jinsom-bbs-single-box').siblings().find('.comment-up').text(title);
}
}


}
});
}); 
}

//收藏内容
function jinsom_collect(post_id,type,obj){
if(!jinsom.is_login){
jinsom_pop_login_style();	
return false;
}
if(type=='img'){
url=$(obj).parent().siblings('.fancybox-stage').find('img').attr('src');
}else{
url='';	
}
layer.load(1);
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/collect.php",
type:'POST',   
data:{post_id:post_id,type:type,url:url},  
success: function(msg){
layer.closeAll('loading');
jinsom_msg(msg.msg);
if(type=='post'){
$(obj).text(msg.text1);
}else if(type=='goods'){
if(msg.code==2){
$(obj).children('i').addClass('jinsom-shoucang1').removeClass('jinsom-shoucang').siblings('p').text(msg.text);
}else{
$(obj).children('i').addClass('jinsom-shoucang').removeClass('jinsom-shoucang1').siblings('p').text(msg.text);
}
}
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



//记录社交登录 返回地址 登录返回 登录回调
function jinsom_login_back_url(){
url=window.location.href;
document.cookie="login_back="+url;
}


//清除历史搜索
function jinsom_history_search_clear(){
layer.confirm('你确定要清除历史搜索吗？',{
btnAlign: 'c',
}, function(){
$('.jinsom-pop-search-hot.history').remove();
layer.msg('已经清除！'); 
DelCookie('history-search');
});	
}


//刷新内容时间
function jinsom_reload_post(post_id){
layer.confirm('你确定要刷新该内容吗？<br><font style="color: #f44336;">刷新之后，内容的时间变更为当前的时间</font>',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/reload-post.php",
data: {post_id:post_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);  
}
});
});
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



//添加标记 表单
function jinsom_add_post_mark_form(post_id,bbs_id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/add-post-mark.php",
data:{post_id:post_id,bbs_id:bbs_id},
success: function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:'添加标记',
resize:false,
fixed: false,
area: ['300px', '290px'], 
skin: 'jinsom-add-mark-form',
content: msg
});

}
});
}

//添加标记 
function jinsom_add_post_mark(post_id,bbs_id){
mark_name=$('#jinsom-post-mark-name-val').val();
mark_color=$('#jinsom-post-mark-color-val').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/add-post-mark.php",
data:{bbs_id:bbs_id,post_id:post_id,mark_name:mark_name,mark_color:mark_color},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.open(msg.url,'_self');}setTimeout(c,1000);
}
}
});
}


// //收藏功能
// function jinsom_collect(post_id,obj){
// if(!jinsom.is_login){
// jinsom_pop_login_style();  
// return false;
// }
// $.ajax({   
// url:jinsom.jinsom_ajax_url+"/action/collect.php",
// type:'POST',   
// data:{post_id:post_id,type:'post'},  
// success:function(msg){
// layer.msg(msg.msg);
// if(msg.code==1||msg.code==2){
// $(obj).text(msg.text1);
// }
// }
// }); 
// }

//举报弹窗
function jinsom_report_form(type,report_id){
if(!jinsom.is_login){
jinsom_pop_login_style();  
return false;
}
layer.load(1);
$.ajax({
url:jinsom.jinsom_ajax_url+"/stencil/report.php",
type:'POST',
data:{report_id:report_id,type:type},
success:function(msg){
layer.closeAll('loading');
layer.open({
type:1,
title:'举报',
resize:false,
fixed: false,
area: ['400px', '500px'], 
skin: 'jinsom-content-report-form',
content: msg
});
layui.use('form', function(){
var form = layui.form;
form.render();
});
}
});
}

//举报
function jinsom_report(from,report_id){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
reason=$('#jinsom-content-report-reason').val();
type=$('#jinsom-content-report-type').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/report.php",
data:{report_id:report_id,reason:reason,type:type,from:from},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.closeAll();}setTimeout(c,1500);	
}
}
});
}

//设置为风险用户
function jinsom_blacklist_setting(author_id){
layer.confirm('确定要将该用户设置为风险用户？',{
btnAlign: 'c',
btn: ['确定','按错了'],
}, function(){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/blacklist-user.php",
data:{author_id:author_id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('.user-'+author_id).text('已重置-'+author_id);
$('.jinsom-member-left-profile li.nickname span').text('已重置-'+author_id);
document.title='已重置-'+author_id;
layer.close(index);
}
}
});
});
}


//html实体化
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


//测试提示
function jinsom_test(){
layer.msg('该功能开发中，即将开启。');
}


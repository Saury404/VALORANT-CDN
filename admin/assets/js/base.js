// 后台面板
jQuery(document).ready(function($) {


var patterns={validate:/^(?!_nonce)[a-zA-Z0-9_-]*(?:\[(?:\d*|(?!_nonce)[a-zA-Z0-9_-]+)\])*$/i,key:/[a-zA-Z0-9_-]+|(?=\[\])/g,named:/^[a-zA-Z0-9_-]+$/,push:/^$/,fixed:/^\d+$/};function FormSerializer(helper,$form){var data={},pushes={};function build(base,key,value){base[key]=value;return base;}
function makeObject(root,value){var keys=root.match(patterns.key),k;while((k=keys.pop())!==undefined){if(patterns.push.test(k)){var idx=incrementPush(root.replace(/\[\]$/,''));value=build([],idx,value);}
else if(patterns.fixed.test(k)){value=build([],k,value);}
else if(patterns.named.test(k)){value=build({},k,value);}}
return value;}
function incrementPush(key){if(pushes[key]===undefined){pushes[key]=0;}
return pushes[key]++;}
function addPair(pair){if(!patterns.validate.test(pair.name))return this;var obj=makeObject(pair.name,pair.value);data=helper.extend(true,data,obj);return this;}
function addPairs(pairs){if(!helper.isArray(pairs)){throw new Error("formSerializer.addPairs expects an Array");}
for(var i=0,len=pairs.length;i<len;i++){this.addPair(pairs[i]);}
return this;}
function serialize(){return data;}
function serializeJSON(){return JSON.stringify(serialize());}
this.addPair=addPair;this.addPairs=addPairs;this.serialize=serialize;this.serializeJSON=serializeJSON;}
FormSerializer.patterns=patterns;FormSerializer.serializeObject=function serializeObject(){return new FormSerializer($,this).addPairs(this.serializeArray()).serialize();};FormSerializer.serializeJSON=function serializeJSON(){return new FormSerializer($,this).addPairs(this.serializeArray()).serializeJSON();};if(typeof $.fn!=="undefined"){$.fn.serializeObjectLightSNS=FormSerializer.serializeObject;$.fn.serializeJSONLightSNS=FormSerializer.serializeJSON;}



//切换WordPress面板
$(".jinsom-panel-header-left").click(function() {
if ($("#adminmenumain").css('display')=='block') {
$("#wpcontent").css("margin-left", "0px");
$("#adminmenumain").hide(0);
$(".jinsom-admin-logo").removeClass('had_show')
} else {
$("#adminmenumain").show(0);
$("#wpcontent").css("margin-left", "160px");
$(".jinsom-admin-logo").addClass('had_show')
}
});


//折叠菜单
$(".jinsom-show-menu").click(function() {
if ($(".jinsom-panel-nav").css('width')=='180px') {
$(this).children('i').addClass('fa-expand').removeClass('fa-compress');
$(".jinsom-panel-nav").css("width", "48px").addClass('on');
$(".jinsom-panel-content").css("margin-left", "48px");
$(".jinsom-panel-nav ul li a span").hide();
$('.jinsom-panel-nav ul li .jinsom-panel-arrow:after').css('right','2px');

$('.jinsom-panel-nav.on ul li').hover(function() {
if($('.jinsom-panel-nav').hasClass('on')){
layer.tips($(this).find('span').html(), $(this));
}
}, function() {
layer.closeAll('tips');
});

} else {
$(this).children('i').addClass('fa-compress').removeClass('fa-expand');
$(".jinsom-panel-nav ul li a span").show();
$(".jinsom-panel-content").css("margin-left", "180px");
$('.jinsom-panel-nav ul li .jinsom-panel-arrow:after').css('right','10px');
$(".jinsom-panel-nav").css("width", "180px").removeClass('on');

$('.jinsom-panel-nav.on ul li').hover(function() {
}, function() {
});

}
});

//切换肤色
$('[name="jinsom_options[jinsom_panel_skin]"]').click(function(){
skin=$(this).val();
if(skin=='dark'){
$('.jinsom-panel').addClass('jinsom-panel-theme-dark').removeClass('jinsom-panel-theme-light');
}else{
$('.jinsom-panel').addClass('jinsom-panel-theme-light').removeClass('jinsom-panel-theme-dark');
}
});

//监听面板
$("input[name='jinsom_options[jinsom_panel_name]']").bind("input propertychange",function(event){
$('.jinsom-panel-header-inner h1').html($(this).val());
});

//获取最新版本提示
layui.use(['layer'], function() {
$("#jinsom-get-update-info").click(function() {
layer.load(1);
url=jinsom.update_url+"/update.php?callback=?&url=123";
jQuery.getJSON(url,function(data) {
layer.closeAll('loading');
layer.alert(data.version)
})
});
});



//设置页回车搜索
$(".jinsom-panel-search input").keypress(function(e) {  
if(e.which == 13) {  
return false;
}  
}); 

//layui模块引入
layui.use('element',function(){
var element=layui.element
})

//用户列表筛选
jinsom_user_type_el=$('[name="jinsom_user_type"]');
jinsom_user_type_el.change(function(){
jinsom_user_type_el.val(jQuery(this).val());
});

});//ready




// =================================函数开始



//退出登录
function jinsom_login_out(){
layer.confirm('你确定要退出本帐号吗？',{
title:'退出登录',
btnAlign: 'c',
btn: ['确定','按错了'] 
}, function(){
layer.msg('已退出，欢迎再次回来！');
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/update/profile.php",
data: {login_out:1},
success: function(msg){}
});
function d(){window.location.href='/';}setTimeout(d,2500);
});
}


//导入备份
function jinsom_admin_backup_export(){
backup=$('#jinsom-admin-backup-export-val').val();
if(backup=='delete'){
title='你要确定要清空所有的设置选项吗？清空之后将恢复默认设置！';
}else{
title='你确定要导入备份设置吗？你之前的设置选项会被覆盖！';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type:"POST",
url: jinsom.jinsom_ajax_url+"/admin/action/admin-setting.php",
data:{backup:backup},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
});
}

//metabox导出备份
function jinsom_amdin_backup_metabox(){
post_id=jinsom_getUrlParam('post');
if($('.jinsom-panel-show').length>0){
option=$('.jinsom-panel-show').attr('id');
}else{
option='';
}
if(!post_id){
alert('请新建页面之后再进行导出数据操作！');
return false;
}
type=$('.components-select-control__input').val();

window.open(jinsom.theme_url+"/module/admin/action/admin-setting-metabox-back.php?download&post_id="+post_id+"&type="+type+"&option="+option);
}


//metabox导入备份
function jinsom_amdin_backup_metabox_import(){
post_id=jinsom_getUrlParam('post');
if(!post_id){
alert('请新建页面之后再进行导入数据操作！');
return false;
}

if($('.jinsom-panel-show').length>0){
option=$('.jinsom-panel-show').attr('id');
}else{
option='';
}

type=$('.components-select-control__input').val();
backup=$('#jinsom-admin-backup-metabox-val').val();
if(backup=='delete'){
title='你要确定要清空所有的设置选项吗？清空之后将恢复默认设置！';
}else{
title='你确定要导入备份设置吗？你之前的设置选项会被覆盖！';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type:"POST",
url: jinsom.jinsom_ajax_url+"/admin/action/admin-setting-metabox-back.php",
data:{backup:backup,post_id:post_id,type:type,option:option},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,2000);
}
}
});
});
}


//保存设置
function jinsom_admin_save_setting(tips){
data=$('#jinsom-panel-form').serializeJSONLightSNS();
time=$('#jinsom-setting-time').attr('data');
layer.load(1);
$.ajax({
type:"POST",
url: jinsom.jinsom_ajax_url+"/admin/action/admin-save.php",
data:{data:data,time:time},
success: function(msg){
layer.closeAll('loading');
if(tips){
layer.msg(msg.msg);
}
if(msg.code==1){
$('#jinsom-setting-time').attr('data',msg.time);
}
}
});
}


//弹出卡密表单
function jinsom_admin_key_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/key.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'卡密管理',
type: 1,
area: ['800px', '520px'], 
content: msg
});
}
});	
}

//弹出卡密生成的表单
function jinsom_admin_key_add_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/key-add.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'卡密生成',
type: 1,
area: ['540px', '500px'], 
content: msg
});
layui.use(['form','laydate'], function () {
var form = layui.form;
var laydate = layui.laydate;
form.render('radio');
form.on('radio(add-key)', function(data){
$('#jinsom-add-key-form li.number i').html($(data.elem).attr('data'));
}); 
laydate.render({elem:'#jinsom-key-expiry',type:'date'});
});
}
});		
}

//生成卡密
function jinsom_admin_key_add(){
data=$('#jinsom-add-key-form').serialize();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/key-add.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
layer.close(admin_key_add_form);
}
}
});		
}


//弹出卡密查询表单
function jinsom_admin_key_search_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/key-search.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_search_form=layer.open({
title:'卡密查询',
btn: false,
type: 1,
resize:false,
area: '350px',
skin: 'jinsom-login-form',
content: msg
});
}
});
}

//卡密查询
function jinsom_admin_key_search(){
key=$('#jinsom-pop-key-search').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/key-search.php",
data:{key:key},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.close(admin_key_search_form);
layer.open({
title:'查询结果',
type: 1,
content:msg.msg
});
}else{
layer.msg(msg.msg);	
}
}
});		
}


//弹出导出卡密的表单
function jinsom_admin_key_export_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/key-export.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'卡密导出',
type: 1,
area: ['640px', '400px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');

form.on('radio(jinsom-custom-key-number)', function(data){
if(data.value=='custom'){
$('#jinsom-custom-key-number').show();
}else{
$('#jinsom-custom-key-number').hide();	
}
}); 

});
}
});		
}

//提交导出表单
function jinsom_admin_key_export(){
$('#jinsom-export-key-form').submit();	
}


//弹出删除卡密的表单
function jinsom_admin_key_delete_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/key-delete.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'卡密删除',
type: 1,
area: ['630px', '320px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');
});
}
});		
}

//删除卡密
function jinsom_admin_key_delete(){
data=$('#jinsom-delete-key-form').serialize();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/key-delete.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});		
}


//弹出批量注册表单
function jinsom_multiple_reg_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/multiple-reg.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'批量注册',
type: 1,
area: ['700px', 'auto'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('checkbox');
});
}
});	
}


//提交批量注册
function jinsom_multiple_reg(){
username=$('.jinsom-multiple-reg-username').val();	
password=$('.jinsom-multiple-reg-password').val();
city=$('.jinsom-multiple-city:checkbox:checked').val();	
sex=$('.jinsom-multiple-sex:checkbox:checked').val();	
if(username==''){
layer.msg('请输入用户名！');
return false;	
}
$('.jinsom-multiple-reg-form .btn').html('<i class="fa fa-superpowers fa-spin"></i> 批量注册中...');
layer.load(1);
$.ajax({
type: "POST",
data:{username:username,password:password,city:city,sex:sex},
url:jinsom.jinsom_ajax_url+"/admin/action/multiple-reg.php",
success: function(msg){
layer.closeAll('loading');
$('.jinsom-multiple-reg-form .btn').html('<i class="fa fa-superpowers"></i> 开始注册');
if(msg.code==1){
$('.jinsom-multiple-reg-form .username .show').html(msg.content);	
$('.jinsom-multiple-userdata').val(msg.user_data);
$('.jinsom-multiple-reg-form .lable p span').show();
}else{
layer.msg(msg.msg);	
}
}
});	
}

//显示已经注册成功的用户id
function jinsom_multiple_userdata_form(){
userdata=$('.jinsom-multiple-userdata').val();
layer.prompt({title: '已经注册成功的用户id集合',formType: 2,btnAlign: 'c',value:userdata}); 	
}


//弹出邀请码表单
function jinsom_admin_invite_code_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/invite-code.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'邀请码管理',
type: 1,
area: ['700px', '520px'], 
content: msg
});
}
});	
}


//弹出生成邀请码表单
function jinsom_admin_invite_code_add_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/invite-code-add.php",
success: function(msg){
layer.closeAll('loading');
window.admin_invite_code_add_form=layer.open({
title:'生成邀请码',
btn: false,
type: 1,
resize:false,
area: '350px',
skin: 'jinsom-login-form',
content: msg
});
}
});
}

//生成邀请码
function jinsom_admin_invite_code_add(){
number=$('#jinsom-pop-invite-code-number').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/invite-code-add.php",
data:{number:number},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
layer.close(admin_invite_code_add_form);
}
}
});		
}



//弹出邀请码查询表单
function jinsom_admin_invite_code_search_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/invite-code-search.php",
success: function(msg){
layer.closeAll('loading');
window.admin_invite_code_search_form=layer.open({
title:'邀请码查询',
btn: false,
type: 1,
resize:false,
area: '350px',
skin: 'jinsom-login-form',
content: msg
});
}
});
}

//邀请码查询
function jinsom_admin_invite_code_search(){
code=$('#jinsom-pop-invite-code').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/invite-code-search.php",
data:{code:code},
success: function(msg){
layer.closeAll('loading');
if(msg.code==1){
layer.close(admin_invite_code_search_form);
layer.open({
type: 1,
title:'查询结果',
content:msg.msg
});
}else{
layer.msg(msg.msg);	
}
}
});		
}


//弹出导出邀请码的表单
function jinsom_admin_invite_code_export_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/invite-code-export.php",
success: function(msg){
layer.closeAll('loading');
window.admin_key_add_form=layer.open({
title:'邀请码导出',
type: 1,
area: ['440px', '212px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');
});
}
});		
}


//提交导出邀请码表单
function jinsom_admin_invite_code_export(){
$('#jinsom-export-invite-code-form').submit();	
}


//弹出删除邀请码的表单
function jinsom_admin_invite_code_delete_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/invite-code-delete.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'邀请码删除',
type: 1,
area: ['440px', '176px'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('radio');
});
}
});		
}

//删除邀请码
function jinsom_admin_invite_code_delete(){
data=$('#jinsom-delete-invite-code-form').serialize();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/invite-code-delete.php",
data:data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});		
}




//弹出批量导入视频表单
function jinsom_multiple_import_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/multiple-import.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'批量导入视频',
type: 1,
area: ['700px', 'auto'], 
content: msg
});
layui.use(['form'], function () {
var form = layui.form;
form.render('checkbox');
});
}
});	
}


//提交批量注册
function jinsom_multiple_import(){
ids=$('.jinsom-multiple-import-ids').val();	
content=$('.jinsom-multiple-import-content').val();
if(ids==''||content==''){
layer.msg('请输入信息！');
return false;	
}
$('.jinsom-multiple-import-form .btn').html('<i class="fa fa-superpowers fa-spin"></i> 导入中...');
layer.load(1);
$.ajax({
type: "POST",
data:{ids:ids,content:content},
url:jinsom.jinsom_ajax_url+"/admin/action/multiple-import.php",
success: function(msg){
layer.closeAll('loading');
$('.jinsom-multiple-import-form .btn').html('<i class="fa fa-superpowers"></i> 开始导入<span></span>');
layer.msg(msg.msg);	
if(msg.code==1){
$('.jinsom-multiple-import-content').val('');
}
}
});	
}


//弹出充值记录表单
function jinsom_admin_recharge_form(type){
if(type=='money'){
url=jinsom.jinsom_ajax_url+"/admin/stencil/recharge-money.php";
title=jinsom.money_name+'充值记录';
}else if(type=='extcredits'){
url=jinsom.jinsom_ajax_url+"/admin/stencil/recharge-extcredits.php";
title=jinsom.extcredits_name+'充值记录';
}else{
url=jinsom.jinsom_ajax_url+"/admin/stencil/recharge.php";
title=jinsom.credit_name+'充值记录';
}

layer.load(1);
$.ajax({
type: "POST",
url:url,
success: function(msg){
layer.closeAll('loading');
layer.open({
title:title,
type: 1,
area: ['700px', '520px'], 
content: msg
});
}
});	
}


//弹出查看聊天记录表单
function jinsom_admin_chat_note_form(){
layer.confirm('选择你要查看的聊天记录类型',{
btn: ['单聊记录','群聊记录'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/chat-note-one.php",
success: function(msg){
layer.closeAll();
layer.open({
title:'单聊记录',
type: 1,
area: ['850px', '520px'], 
content: msg
});
}
});	
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/chat-note-group.php",
success: function(msg){
layer.closeAll();
layer.open({
title:'群聊记录',
type: 1,
area: ['800px', '520px'], 
content: msg
});
}
});
}
);
}

//删除聊天记录
function jinsom_admin_del_chat_note(type,id,obj){
layer.confirm('删除之后将不可恢复，你确定？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/chat-note-delete.php",
data:{type:type,id:id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parents('li').remove();	
}
}
});
});
}

//查看聊天记录详情
function jinsom_admin_read_chat_note(type,id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/chat-note-all.php",
data:{type:type,id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'聊天记录详情',
type: 1,
area: ['600px', '500px'], 
content: msg.msg
});
}
});
}



//弹出提现记录表单
function jinsom_admin_cash_form(type){
if(type=='money'){
title='余额提现记录';
}else{
title='金币提现记录';
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/cash.php",
data:{type:type},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:title,
type: 1,
area: ['900px', '530px'], 
content: msg
});
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

//通过提现
function  jinsom_cash_agree(ID,obj){
layer.confirm('你要通过该提现记录吗',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/cash-do.php",
data:{ID:ID,type:'agree'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).siblings('.refuse').remove();
$(obj).parent().prev().text('成功');
$(obj).remove();
}
}
});
});
}

//拒绝提现
function  jinsom_cash_refuse(ID,obj){
layer.prompt({title: '请输入拒绝通过的原因', formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/cash-do.php",
data:{ID:ID,type:'refuse',reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).siblings('.agree').remove();
$(obj).parent().prev().text('失败');
$(obj).remove();
layer.close(index);
}
}
});
});
}


//弹出全站通知表单
function jinsom_admin_notice_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/notice.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'全站通知',
type: 1,
fixed: false,
area: ['700px', '485px'], 
content: msg
});
}
});	
}

//弹出发表全站通知表单
function jinsom_admin_notice_add_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/notice-add.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'全站通知',
type: 1,
fixed: false,
area: ['500px'], 
skin: 'jinsom-admin-notice-add-form',
content: msg
});
}
});	
}


//发表全站通知
function jinsom_admin_notice_add(){
title=$('#jinsom-admin-notice-add-title').val();
content=$('#jinsom-admin-notice-add-val').val();
if(content==''||title==''){
layer.msg("通知内容或标题不能为空！");
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/notice-do.php",
data:{content:content,title:title,type:'add'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.closeAll();}setTimeout(c,2000);
}
}
});
}


//弹出编辑全站通知表单
function jinsom_admin_notice_edit_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/notice-edit.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'全站通知',
type: 1,
fixed: false,
area: ['500px'], 
skin: 'jinsom-admin-notice-add-form',
content: msg
});
}
});	
}

//编辑全站通知
function jinsom_admin_notice_edit(id){
title=$('#jinsom-admin-notice-add-title').val();
content=$('#jinsom-admin-notice-add-val').val();
if(content==''||title==''){
layer.msg("通知内容或标题不能为空！");
return false;
}
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/notice-do.php",
data:{content:content,title:title,type:'edit',id:id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){layer.closeAll();}setTimeout(c,2000);
}
}
});
}

//查看全站通知
function jinsom_admin_notice_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/notice-read.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'通知详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
skin: 'jinsom-admin-notice-read-form',
content: msg
});
}
});	
}

//删除聊天记录
function jinsom_admin_notice_del(id,obj){
layer.confirm('你确定要删除这条通知？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/notice-do.php",
data:{type:'delete',id:id},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$(obj).parents('li').remove();	
}
}
});
});
}


//版主申请表单
function jinsom_admin_apply_bbs_admin_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/apply-bbs-admin.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'版主申请',
type: 1,
fixed: false,
area: ['700px','410px'], 
content: msg
});
}
});	
}

//查看版主申请
function jinsom_admin_apply_bbs_admin_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/apply-bbs-admin-do.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
window.admin_apply_bbs_admin_read_form=layer.open({
title:'申请详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
content: msg
});
}
});	
}

//版主申请操作
function jinsom_admin_apply_bbs_admin_do(type,id,obj){

if(type=='refuse'){//拒绝
layer.prompt({title: '请输入拒绝通过的原因', formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/apply-bbs-admin-do.php",
data:{ID:id,type:type,reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('#jinsom-admin-apply-bbs-admin-'+id+' span m').html('已经拒绝').attr('style','');
layer.close(index);
layer.close(admin_apply_bbs_admin_read_form);
}
}
});
});
}else{//删除或通过


if(type=='agree'){
title="通过";
}else{
title="删除";	
}

layer.confirm('你确定要'+title+'吗？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/apply-bbs-admin-do.php",
data:{ID:id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(type=='del'){
$('#jinsom-admin-apply-bbs-admin-'+id).remove();
}else if(type=='agree'){
$('#jinsom-admin-apply-bbs-admin-'+id+' span m').html('已经通过').attr('style','');
}
layer.close(admin_apply_bbs_admin_read_form);
}
}
});	
});	


}

}


//论坛开通申请表单
function jinsom_admin_apply_bbs_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/apply-bbs.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:jinsom.bbs_name+'申请开通',
type: 1,
fixed: false,
area: ['700px','410px'], 
content: msg
});
}
});	
}

//查看论坛申请表单
function jinsom_admin_apply_bbs_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/apply-bbs-do.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
window.admin_apply_bbs_read_form=layer.open({
title:'申请详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
content: msg
});


//论坛上传头像
layui.use(['upload'], function(){
var upload = layui.upload;
upload.render({
elem: '#bbs-avatar',
url: jinsom.jinsom_ajax_url+'/upload/apply-term.php',
accept:'file',
done: function(res, index, upload){
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
}
});

});

layui.use('form', function(){
var form = layui.form;
form.render();

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

}); //form

}
});	
}

//论坛申请操作
function jinsom_admin_apply_bbs_do(type,id,obj){

if(type=='refuse'){//拒绝
layer.prompt({title: '请输入拒绝通过的原因', formType: 2},function(reason,index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/apply-bbs-do.php",
data:{ID:id,type:type,reason:reason},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
$('#jinsom-admin-apply-bbs-admin-'+id+' span m').html('已经拒绝').attr('style','');
layer.close(index);
layer.close(admin_apply_bbs_read_form);
}
}
});
});
}else{//删除或通过


if(type=='agree'){
title="通过";
}else{
title="删除";	
}

apply_data=$('.jinsom-apply-bbs-content').serialize();
apply_data+='&ID='+id+'&type='+type;

layer.confirm('你确定要'+title+'吗？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/apply-bbs-do.php",
data:apply_data,
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(type=='del'){
$('#jinsom-admin-apply-bbs-admin-'+id).remove();
}else if(type=='agree'){
$('#jinsom-admin-apply-bbs-admin-'+id+' span m').html('已经通过').attr('style','');
}
layer.close(admin_apply_bbs_read_form);
}
}
});	
});	




}



}

//商城订单
function jinsom_admin_shop_order_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/shop-order.php",
success: function(msg){
layer.closeAll('loading');
window.admin_apply_bbs_read_form=layer.open({
title:'订单详情',
type: 1,
fixed: false,
offset: '61px',
area: ['750px','680px'], 
content: msg
});
}
});	
}




//查看订单
function jinsom_goods_order_view_form(ID){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/order-view.php",
data:{ID:ID},
success: function(msg){
layer.closeAll('loading');
window.goods_order_view_form=layer.open({
title:'订单查看',
type: 1,
fixed: false,
offset: '100px',
skin:'jinsom-goods-order-view-form',
area: ['500px','auto'],
resize:false,
content: msg
});
}
});
}

//发货表单
function jinsom_goods_order_send_form(ID){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/order-send.php",
data:{ID:ID},
success: function(msg){
layer.closeAll('loading');
window.goods_order_send_form=layer.open({
title:'订单发货',
type: 1,
fixed: false,
skin:'jinsom-goods-order-send-form',
area: ['500px','auto'],
resize:false,
content: msg
});
}
});
}

//发货
function jinsom_goods_order_send(ID){
content=$('#jinsom-goods-order-send-content').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/order-send.php",
data:{content:content,ID:ID},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
function c(){
layer.close(goods_order_send_form);
layer.close(goods_order_view_form);
}setTimeout(c,2000);
}
});
}


//删除订单记录
function jinsom_goods_order_delete(ID){
layer.confirm('你确定要删除该订单？',{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/order-delete.php",
data:{ID:ID},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
$('.order-'+ID).remove();
layer.close(goods_order_view_form);
}
});
});
}



//举报表单
function jinsom_admin_report_form(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/report.php",
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'举报列表',
type: 1,
fixed: false,
area: ['700px','410px'], 
content: msg
});
}
});	
}

//查看举报详情表单
function jinsom_admin_report_read_form(id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/report-read.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
window.admin_report_read_form=layer.open({
title:'举报详情',
type: 1,
fixed: false,
area: ['500px','350px'], 
content: msg
});
}
});	
}

//举报操作
function jinsom_admin_report_do(type,id,obj){

if(type=='do'){
title="你确定要标记为处理吗？";
}else{
title="你确定要删除吗？";	
}

layer.confirm(title,{
btn: ['确定','取消'],
btnAlign: 'c',
},
function(){

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/report-do.php",
data:{ID:id,type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
if(type=='del'){
$('#jinsom-admin-report-'+id).remove();
}else if(type=='do'){
$('#jinsom-admin-report-'+id+' span m').html('已经处理').attr('style','');
}
layer.close(admin_report_read_form);
}
}
});	
});	



}




//导出手机号/邮箱
function jinsom_phone_email_export(){
layer.confirm('选择你要导出的用户数据',{
btn: ['手机号','邮箱号'],
btnAlign: 'c',
},
function(){
$('#jinsom-export-phone-email-form input').attr('value','phone');
$('#jinsom-export-phone-email-form').submit();
layer.closeAll();	
},
function(){
$('#jinsom-export-phone-email-form input').attr('value','email');
$('#jinsom-export-phone-email-form').submit();
layer.closeAll();
}
);
}


//插入图标表单
function jinsom_add_icon_form(obj){
id=$(obj).siblings('input').attr('name');
// $('#'+id).find('.jinsom-panel-icon-remove').hide();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/add-icon.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:false,
type: 1,
fixed: false,
skin:'jinsom-add-icon-form',
area: ['620px','450px'], 
content: msg
});
}
});
}








function jinsom_no(){
layer.msg("还没有写好啦！预留接口");	
}


//获取get参数
function jinsom_getUrlParam(name){
var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
var r = window.location.search.substr(1).match(reg);
if(r!=null)return  unescape(r[2]); return null;
}



//分享配置数据===单独的option选项
function jinsom_setting_share(title,type){
if(!type){
layer.msg("数据异常！");
return false;
}
layer.msg(title,{
time:0,
closeBtn:2,
btn: ['云共享(公开)','私人备份','查看共享'],
btnAlign: 'c',
btn1:function(){
layer.closeAll();
layer.prompt({title:'请输入分享备注码(可搜索)',formType:2}, function(pass,index){
layer.close(index);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share.php",
data:{content:pass,type:type,share_type:'option',is_open:1},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});	
});
},
btn2: function(){
layer.closeAll();
layer.prompt({title:'请输入私人备份备注码(可搜索)',formType:2}, function(pass,index){
layer.close(index);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share.php",
data:{content:pass,type:type,share_type:'option',is_open:0},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});	
});
},
btn3: function(){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/settings-share-get.php",
data:{type:type,share_type:'option',post_id:0},
success: function(msg){
layer.closeAll();
layer.open({
title:'Option数据['+title+']',
type: 1,
area: ['300px', '500px'], 
content: msg
});
}
});
}
}
);


}

//分享配置数据 metabox
function jinsom_setting_share_metabox(post_id){
type=$('.jinsom-panel-page-templates.jinsom-panel-show').attr('id');
if(!type){
layer.msg("该页面模板没有设置选项，请选择其他模板！");
return false;
}
title=$('.jinsom-panel-page-templates.jinsom-panel-show .ui-sortable-handle').text();
layer.msg(title,{
time:0,
closeBtn:2,
btn: ['云共享(公开)','私人备份','查看共享'],
btnAlign: 'c',
btn1:function(){
layer.closeAll();
layer.prompt({title:'请输入分享备注码(可搜索)',formType:2}, function(pass,index){
layer.close(index);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share.php",
data:{content:pass,type:type,share_type:'metabox',post_id:post_id,is_open:1},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});	
});
},
btn2: function(){
layer.closeAll();
layer.prompt({title:'请输入私人备份备注码(可搜索)',formType:2}, function(pass,index){
layer.close(index);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share.php",
data:{content:pass,type:type,share_type:'metabox',post_id:post_id,is_open:0},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});	
});
},
btn3: function(){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/settings-share-get.php",
data:{type:type,share_type:'metabox',post_id:post_id},
success: function(msg){
layer.closeAll();
layer.open({
title:'Metabox数据['+title+']',
type: 1,
area: ['300px', '500px'], 
content: msg
});
}
});
}
}
);


}


//分享主题总配置数据 options
function jinsom_setting_share_options(){
layer.msg('LightSNS主题全部设置选项',{
time:0,
closeBtn:2,
btn: ['云共享(公开)','私人备份','查看共享'],
btnAlign: 'c',
btn1:function(){
layer.closeAll();
layer.prompt({title:'请输入分享备注码(可搜索)',formType:2}, function(pass,index){
layer.close(index);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share.php",
data:{type:'jinsom_options',content:pass,share_type:'options',is_open:1},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});	
});
},
btn2: function(){
layer.closeAll();
layer.prompt({title:'请输入私人备份备注码(可搜索)',formType:2}, function(pass,index){
layer.close(index);
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share.php",
data:{type:'jinsom_options',content:pass,share_type:'options',is_open:0},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
}
});	
});
},
btn3: function(){
layer.closeAll();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/settings-share-get.php",
data:{type:'jinsom_options',share_type:'options',post_id:0},
success: function(msg){
layer.closeAll();
layer.open({
title:'LightSNS主题设置选项',
type: 1,
area: ['300px', '500px'], 
content: msg
});
}
});
}
}
);


}


//查看配置选项
function jinsom_setting_share_data_read(id){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share-read.php",
data:{id:id},
success: function(msg){
layer.closeAll('loading');
layer.open({
title:'数据详情',
type: 1,
skin:'jinsom-settings-share-read-pop',
area: ['600px', '500px'], 
content: msg
});
}
});	
}


//导入云设置选项
function jinsom_setting_share_data_add(id,post_id,share_type){
layer.confirm('<font style="color:#f00;">导入之后会覆盖你目前的该项设置，你确定？</font>',{
btnAlign: 'c',
}, function(){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/settings-share-add.php",
data:{id:id,post_id:post_id,share_type:share_type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,1000);
}
}
});	
});
}


//搜索云设置选项
function jinsom_setting_share_data_search(type,post_id,share_type){
key=$('.jinsom-admin-setting-get-form .search input').val();
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/stencil/settings-share-search.php",
data:{type:type,key:key,post_id:post_id,share_type:share_type},
success: function(msg){
layer.closeAll('loading');
$('.jinsom-admin-setting-get-form .content').html(msg);
}
});	
}


//设置数据 域名替换 表单
function jinsom_setting_domain_replace_form(){
layer.open({
title:'设置数据域名批量替换',
type: 1,
area: ['500px', '440px'], 
content: '<div class="jinsom-setting-domain-replace-content">\
<div class="tips">该功能用于一键替换主题设置数据的旧域名为新域名 (也可以替换文字)<br><font style="color:#f00;">替换之前务必备份主题设置选项+mysql数据库，防止不可预见的风险</font></div>\
<li><p>旧域名：</p><input type="text" id="jinsom-old-domain"></li>\
<li><p>新域名：</p><input type="text" id="jinsom-new-domain"></li>\
<li><input type="checkbox" id="jinsom-replace-is-mysql"> <span>全站替换（WordPress+LightSNS）关联数据表</span></li>\
<div class="btn opacity" onclick="jinsom_setting_domain_replace()">一键替换</div>\
</div>'
});	
}


//提交设置选项替换
function jinsom_setting_domain_replace(){
old_str=$('#jinsom-old-domain').val();
new_str=$('#jinsom-new-domain').val();
if(!old_str||!new_str){
layer.msg("请输入新域名/旧域名！");
return false;
}

if($('#jinsom-replace-is-mysql').is(':checked')){
is_sql=1;
}else{
is_sql=0;
}

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/domain-replace.php",
data:{old_str:old_str,new_str:new_str,is_sql:is_sql},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,1000);
}
}
});	
}


//给用户发送消息
function jinsom_admin_send_msg(author_id){
layer.msg('请选择你需要发送的消息类型', {
time:0,
closeBtn:2,
btn: ['IM消息','邮件消息'],
btn1: function(index, layero){
layer.closeAll();
layer.prompt({title: '请输入你需要发送的IM内容', formType: 2}, function(text, index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/send-msg.php",
data:{author_id:author_id,content:text,type:'im'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
layer.close(index);
}
}
});	
});
},
btn2: function(index, layero){
layer.closeAll();
layer.prompt({title: '请输入你需要发送的邮件内容', formType: 2}, function(text, index){
layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/send-msg.php",
data:{author_id:author_id,content:text,type:'email'},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
layer.close(index);
}
}
});	
});
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
$('#user-'+author_id+' .nickname a').text('已重置-'+author_id);
layer.close(index);
}
}
});
});
}

//清空网站的货币
function  jinsom_clear_currency(type){
if(type=='credit'){
title='你确定要清空全站所有用户的金币吗？<br><font style="color:#f00;">这是一个不可逆的操作，请及时备份数据！</font>';
}else if(type=='extcredits'){
title='你确定要清空全站所有用户的积分吗？<br><font style="color:#f00;">这是一个不可逆的操作，请及时备份数据！</font>';
}else{
title='你确定要清空全站所有用户的余额吗？<br><font style="color:#f00;">这是一个不可逆的操作，请及时备份数据！</font>';
}
layer.confirm(title,{
btnAlign: 'c',
}, function(){
layer.closeAll();
layer.prompt({title: '输入"确定清空"，并点击确认', formType: 0}, function(pass, index){
layer.close(index);

if(pass=='确定清空'){

layer.load(1);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/admin/action/clear-currency.php",
data:{type:type},
success: function(msg){
layer.closeAll('loading');
layer.msg(msg.msg);
if(msg.code==1){
function c(){window.location.reload();}setTimeout(c,1000);
}
}
});

}else{
layer.msg('已经取消操作');
}

});




});
}
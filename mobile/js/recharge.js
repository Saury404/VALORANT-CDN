

//充值金币
function jinsom_recharge(recharge_type){


if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

if(myApp.device.os=='ios'&&jinsom.is_miniprogram&&jinsom.miniprogram_ios_stop_pay&&(recharge_type=='money'||recharge_type=='credit'||recharge_type=='extcredits'||recharge_type=='vip')){
layer.open({
content: '根据苹果和微信有关规定，I0S端小程序不提供虚拟商品充值接口，请选用其他方式('+myApp.device.os+')',btn: ['确定', '取消'],yes: function(index){layer.close(index);}
});
return false;	
}

if(recharge_type=='money'){
money_number=$('.jinsom-recharge-money-input input').val();
if(money_number<0.01||!money_number){
layer.open({content:'充值金额不能小于0.01元！',skin:'msg',time:2});
return false;
}
$('#jinsom-credit-recharge-number').val(money_number);
}

number=$('#jinsom-credit-recharge-number').val();	
WIDout_trade_no=$('input[name="WIDout_trade_no"]').val();
WIDsubject=$('input[name="WIDsubject"]').val();
openid=$('input[name="openid"]').val();
type=$('#jinsom-recharge-type').val();	
if(type==''){
layer.open({content:'请选择支付方式！',skin:'msg',time:2});
return false;	
}
if(number==''&&type!='keypay'){
layer.open({content:'请选择充值金额！',skin:'msg',time:2});
return false;		
}
if(type=='wechatpay_mobile'||type=='wechatpay_mp'||type=='xunhupay_wechat_mobile'||type=='zhanpay_wechat_h5'||type=='zhanpay_wechat_jsapi'){
pay_type='wechatpay';
}else if(type=='alipay_code'){
pay_type='qrcode';
}else if(type=='epay_wechatpay'||type=='epay_alipay'||type=='mapay_alipay'||type=='mapay_wechatpay'||type=='epusdt'){
pay_type=type;
}else{
pay_type='alipay';
}


//金币支付
if(type=='creditpay'){
data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type=creditpay';
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/recharge-vip-credit.php",
data:data,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function d(){window.location.reload();}setTimeout(d,1500);//刷新页面
// history.back(-1);
}

}
});
}

//余额支付
if(type=='moneypay'){
data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type=moneypay';
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/recharge-"+recharge_type+"-money.php",
data:data,
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function d(){window.location.reload();}setTimeout(d,1500);//刷新页面
// history.back(-1);
}

}
});
}


if(type=='alipay_code'){//当面付
data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type=qrcode';
myApp.showIndicator();
$.ajax({   
url:jinsom.home_url+'/Extend/pay/alipay/qrcode.php',
type:'GET',   
data:data,
success:function(msg){   
myApp.hideIndicator();
if(myApp.device.os=='ios'){
window.location.href=msg;	
}else{
window.open(msg);	
}

layer.open({
content: '是否已经充值完成？'
,btn: ['已充值', '已取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/check-trade.php",
type:'POST',   
data:data,
success:function(msg){   
myApp.hideIndicator();
if(msg.code==1){
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.type=='credit'){
$('.jinsom-mywallet-header .number span,.jinsom-mine-list-credit').text(msg.credit);
}else if(msg.type=='money'){
$('.jinsom-mywallet-header .yuan span').text(msg.money);
}else if(msg.type=='extcredits'){
$('.jinsom-mywallet-box.extcredits .number').text(msg.extcredits);
}

function c(){history.back(-1);}setTimeout(c,2000);
}else{
layer.open({content:'充值失败，系统未查询到充值订单！',skin:'msg',time:2});
}
}   
}); 
layer.close(index);
}
});

}   
});

}


//创建订单
if(type!='creditpay'){
data=$('#jinsom-credit-recharge-form').serialize();
data=data+'&type='+pay_type;
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/create-trade-no.php",
data:data,
success:function(aa){

if(type=='alipay_mobile'||type=='wechatpay_mp'||type=='epay_wechatpay'||type=='epay_alipay'||type=='epusdt'){//提交表单
$('#jinsom-credit-recharge-form').submit();
$('#jinsom-credit-recharge-form input[name="WIDout_trade_no"]').val(new Date().getTime());
}else if(type=='wechatpay_mobile'){//微信H5支付
$.ajax({   
url:jinsom.home_url+"/Extend/pay/wechatpay/wechat-h5.php",
type:'POST',   
data:{number:number,type:'credit',WIDout_trade_no:WIDout_trade_no,WIDsubject:WIDsubject,openid:openid},    
success:function(msg){
if(myApp.device.os=='ios'){
window.location.href=msg.url;
}else{
window.open(msg.url);	
}
}   
}); 	
}else if(type=='xunhupay_wechat_mobile'){//迅虎微信支付
data=$('#jinsom-credit-recharge-form').serialize();
$.ajax({   
url:jinsom.home_url+"/Extend/pay/xunhupay/wechatpay-xunhu-code.php",
type:'POST',   
data:data,    
success:function(msg){
if(myApp.device.os=='ios'){
window.location.href=msg;
}else{
window.open(msg);		
}
}   
}); 	
}else if(type=='zhanpay_wechat_h5'){//站长支付
data=$('#jinsom-credit-recharge-form').serialize();
$.ajax({   
url:jinsom.home_url+"/Extend/pay/zhanpay/wechat-h5.php",
type:'POST',   
data:data,    
success:function(msg){
// console.log(msg);
if(myApp.device.os=='ios'){
window.location.href=msg;
}else{
window.open(msg);		
}
}   
}); 	
}else if(type=='zhanpay_wechat_jsapi'){//站长支付

$('#jinsom-credit-recharge-form').attr('action',jinsom.home_url+"/Extend/pay/zhanpay/wechat-jsapi.php");
$('#jinsom-credit-recharge-form').submit();
}


}  
});
}



}

//打开充值界面
function jinsom_recharge_vip_type_form(){
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-vip.php'});	
}


//余额充值包监听输入
function jinsom_recharge_money_select_bag(obj){
if($('.jinsom-recharge-number li').length>0){
price=$(obj).val();
$('.jinsom-recharge-number li').removeClass('on');
$('.price-'+price).addClass('on');
}
}
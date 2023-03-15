//提交购物车里订单
function jinsom_batch_order_confirmation_form() {
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
order_el = $('.jinsom-shopping-cart-list .content-box input:checkbox:checked');
if(order_el.length < 1) {
layer.open({content:'请选择订单！',skin:'msg',time:2});
return false;
}
var order_key={};
var i=0;
order_el.each(function(index,item){
order_key[i]={};
order_key[i]['key']=$(item).attr('data-id');
order_key[i]['number']=$(item).siblings('.content-right').find('[name="goods_number"]').val();
i++;
});

key_arr=JSON.stringify(order_key);

if(parseInt($('#selected-items-price-jinbi-total').text()) > jinsom.credit) {
layer.open({content:'您的'+jinsom.credit_name+'不足支付所选的'+jinsom.credit_name+'订单！',skin:'msg',time:2});
return false;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/order-confirmation.php",
data:{key_arr:key_arr,from:'shopping_cart'},
success: function(msg){
myApp.hideIndicator();
jinsom_page('shop/goods-batch.php',1,'page');
function c(){
$('.jinsom-shop-order-batch-list').html(msg);

$('.jinsom-recharge-type li').click(function() {
$(this).addClass('on').siblings().removeClass('on');
type=$(this).attr('data');
if(type=='alipay_mobile'){
$('#jinsom-goods-recharge-form').attr('action',jinsom.home_url+'/Extend/pay/alipay/alipay-h5.php');	
}else if(type=='wechatpay_mp'){
$('#jinsom-goods-recharge-form').attr('action',jinsom.home_url+'/Extend/pay/wechatpay/wechat-mp.php');	
}else if(type=='epay_alipay'||type=='epay_wechatpay'){
$('#jinsom-goods-recharge-form').append('<input type="hidden" name="pay_type" value="'+type+'">');
$('#jinsom-goods-recharge-form').attr('action',jinsom.home_url+'/Extend/pay/epay/index.php');	
}else if(type=='epusdt'){
$('#jinsom-goods-recharge-form').append('<input type="hidden" name="pay_type" value="'+type+'">');
$('#jinsom-goods-recharge-form').attr('action',jinsom.home_url+'/Extend/pay/Epusdt/pay.php');	
}
});
$('.jinsom-recharge-type li.on').click();

}setTimeout(c,1500);

}
});
}

//选择套餐
function jinsom_shop_select_form(post_id,type){
layer.open({
type: 1,
content: $('.jinsom-shop-select-form-'+post_id).html(),
anim: 'up',
className :'jinsom-shop-select-pop-form jinsom-shop-select-pop-form-'+post_id,
style: 'position:fixed;bottom:0;left:0;width:100%;border:none;border-radius: 2vw 2vw 0 0;'
});	


//属性套餐选择
$('.jinsom-shop-select-content-'+post_id+' .select-box .list .content li').click(function(){
$(this).addClass('on').siblings().removeClass('on');
});

//价格套餐选择
$('.jinsom-shop-select-content-'+post_id+' .select-box.price .list .content li').click(function(){
price=$(this).attr('price');
price_discount=$(this).attr('price_discount');
if(price_discount){
price=price_discount;
$('.jinsom-shop-select-header .info .price n').show();
$('.jinsom-shop-select-header .info .price n d').html($(this).attr('price'))
}else{
$('.jinsom-shop-select-header .info .price n').hide();
}
$('.jinsom-shop-select-header .info .price c').html(price);
});

//减号
$('.jinsom-shop-select-content-'+post_id+' .select-box.number .right i.jinsom-jianhao').click(function(){
if(!$(this).hasClass('on')){
var number=parseInt($(this).siblings('input').val());
if(number>2){
$(this).siblings('input').val(number-1);
}else{
$(this).siblings('input').val(1);	
$(this).addClass('on');
}
}
});

//加号
$('.jinsom-shop-select-content-'+post_id+' .select-box.number .right i.jinsom-hao').click(function(){
var number=parseInt($(this).siblings('input').val());
$(this).siblings('input').val(number+1);
if((number+1)>1){
$(this).siblings('.jinsom-jianhao').removeClass('on');
}
if((number+1)>99){
$(this).siblings('input').val(99);
}
});


if(type=='car'){
$('.jinsom-shop-select-pop-form .btn span.buy').remove();
$('.layui-m-layercont .select-box.marks').remove();
$('.layui-m-layercont .select-box.pass-info').remove();
}else{
$('.jinsom-shop-select-pop-form .btn span.car').remove();
}
}

// 加入购物车
function jinsom_join_shopping_cart(post_id,obj) {
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

var number=$(obj).parent().prev().find('#jinsom-goods-number').val();

var select_arr={};
var i=0;
$(".jinsom-shop-select-pop-form-"+post_id+" .select-box.select .list").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('.title').text();
select_arr[i]['value']=$(this).find('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price').length>0){//存在价格套餐
length=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.select .list').length;
select_arr[length]={};
select_arr[length]['name']=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price .title').text();
select_arr[length]['value']=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price li.on').text();
select_price=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price li.on').index();//价格套餐选择的位置
}
select_price=parseInt(select_price)+1;

select_arr=JSON.stringify(select_arr);

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/shopping-cart-join.php",
data:{select_arr:select_arr,post_id:post_id,number:number,select_price:select_price},
success: function(msg){
myApp.hideIndicator();
layer.closeAll();
layer.open({content:msg.msg,skin:'msg',time:2});
}
});
}

//提交购买
function jinsom_shop_buy(post_id,obj){
if(!jinsom.is_login){
layer.closeAll();
jinsom_login_page();
return false;
}

var number=$(obj).parent().prev().find('#jinsom-goods-number').val();
var address='';
var marks=$(obj).parent().prev().find('#jinsom-goods-marks').val();

//下单信息
info_arr='';
if($('.jinsom-shop-select-pop-form-'+post_id+' .select-box.pass-info').length>0){
var info_arr={};
var a=0;
var b='';
$(".jinsom-shop-select-pop-form-"+post_id+" .select-box.pass-info .list li").each(function(){
info_arr[a]={};
info_arr[a]['name']=$(this).children('span').text();
info_arr[a]['value']=$(this).children('input').val();
b+=$(this).children('input').val();
a++;
});
info_arr=JSON.stringify(info_arr);
}

if(b==''){
layer.open({content:'下单信息不能为空！',skin:'msg',time:2});
return false;	
}

var select_arr={};
var i=0;
$(".jinsom-shop-select-pop-form-"+post_id+" .select-box.select .list").each(function(){
select_arr[i]={};
select_arr[i]['name']=$(this).children('.title').text();
select_arr[i]['value']=$(this).find('.on').text();
i++;
});

select_price='';//价格套餐选择的位置
if($('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price').length>0){//存在价格套餐
length=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.select .list').length;
select_arr[length]={};
select_arr[length]['name']=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price .title').text();
select_arr[length]['value']=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price li.on').text();
select_price=$('.jinsom-shop-select-pop-form-'+post_id+' .select-box.price li.on').index();//价格套餐选择的位置
}
select_price=parseInt(select_price)+1;

select_arr=JSON.stringify(select_arr);
trade_no=new Date().getTime();

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-buy.php",
data:{info_arr:info_arr,select_arr:select_arr,post_id:post_id,number:number,address:address,marks:marks,select_price:select_price,trade_no:trade_no},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){layer.closeAll();myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/shop/order-mine.php?read_type='+msg.status});}setTimeout(c,1500);
}else if(msg.code==2){//充值页面
layer.closeAll();
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});}setTimeout(c,1500);
}else if(msg.code==3){//支付界面
layer.closeAll();
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){jinsom_order_details(msg.order_id);}setTimeout(c,1500);
}else if(msg.code==5){//我的订单
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){
layer.closeAll();
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/shop/order-mine.php'});
}setTimeout(c,1500);
}else{//其他失败情况
layer.open({content:msg.msg,skin:'msg',time:2});
}

}
});



}



//查看订单详情
function jinsom_order_details(id){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/shop/order-details.php?id='+id});
}

//删除商品订单
function jinsom_goods_order_delete(ID){
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/goods-order-delete.php",
data: {ID:ID},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
$('#jinsom-order-'+ID).remove();
function d(){history.back(-1);}setTimeout(d,1500);	
}
});
}
});
}


//从购物车批量提交商品--条件检查
function jinsom_goods_batch_buy_check() {
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

var order_key={};
var i=0;
$('.jinsom-batch-goods-info').each(function(index,item){
order_key[i]={};
order_key[i]['key']=$(item).attr('data-id');
order_key[i]['number']=$(item).attr('data-num');
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

if($('#jinsom-shop-address').length>0){
address_number=$('#jinsom-shop-address').val();
if(address_number==''){
layer.open({content:'请添加收货地址！',skin:'msg',time:2});
return false;
}
}

pay_type=$('.jinsom-recharge-type li.on').attr('data');

if(pay_type==''){
layer.open({content:'请选择支付方式！',skin:'msg',time:2});
return false;	
}


trade_no=new Date().getTime();
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-batch-buy-check.php",
data:{key_arr:key_arr,address:address_number,pay_type:pay_type},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({content:msg.msg,skin:'msg',time:2});
$('#jinsom-goods-recharge-form [name="trade_no"]').val(trade_no);
jinsom_goods_batch_buy(key_arr,address_number,pay_type,trade_no);
}else if(msg.code==2){//充值页面
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/mywallet/recharge-credit.php'});}setTimeout(c,1500);
}else if(msg.code==3){//我的订单
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/shop/order-mine.php'});
}setTimeout(c,1500);
}else{//其他失败情况
layer.open({content:msg.msg,skin:'msg',time:2});
}

}
});
}

//从购物车批量提交商品
function jinsom_goods_batch_buy(key_arr,address,pay_type,trade_no) {
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-batch-buy.php",
data:{key_arr:key_arr,address:address,pay_type:pay_type,trade_no:trade_no},
success: function(msg){
myApp.hideIndicator();
if(msg.code==1){
layer.open({content:msg.msg,skin:'msg',time:2});
function c(){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/shop/order-mine.php'});
}setTimeout(c,1500);
}else if(msg.code==2){//人民币付款
jinsom_goods_order_pay(pay_type,trade_no);//发起订单支付
}

}
});
}

//商品订单支付
function jinsom_goods_order_pay(pay_type,trade_no){
if(pay_type=='alipay_code'){//当面付
data=$('#jinsom-goods-recharge-form').serialize();
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
content: '是否已经完成付款？',
btn: ['已完成', '已取消'],
yes: function(index){
myApp.showIndicator();
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/check-trade.php",
type:'POST',   
data:{trade_no:trade_no},
success:function(msg){   
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){
// history.back(-1);
myApp.getCurrentView().router.refreshPage();
}setTimeout(c,2000);
}
}   
}); 
layer.close(index);
}
});

}   
});

}else if(pay_type=='alipay_mobile'||pay_type=='wechatpay_mp'||pay_type=='epay_wechatpay'||pay_type=='epay_alipay'||pay_type=='epusdt'){//提交表单
$('#jinsom-goods-recharge-form').submit();
}else if(pay_type=='wechatpay_mobile'){//微信H5支付
$.ajax({   
url:jinsom.home_url+"/Extend/pay/wechatpay/wechat-h5.php",
type:'POST',   
data:{trade_no:trade_no},    
success:function(msg){
if(myApp.device.os=='ios'){
window.location.href=msg.url;
}else{
window.open(msg.url);	
}
}   
}); 	
}else if(pay_type=='xunhupay_wechat_mobile'){//迅虎微信支付
$.ajax({   
url:jinsom.home_url+"/Extend/pay/xunhupay/wechatpay-xunhu-code.php",
type:'POST',   
data:{trade_no:trade_no},   
success:function(msg){
if(myApp.device.os=='ios'){
window.location.href=msg;
}else{
window.open(msg);		
}
}   
}); 	
}else if(pay_type=='zhanpay_wechat_h5'){//站长支付
$.ajax({   
url:jinsom.home_url+"/Extend/pay/zhanpay/wechat-h5.php",
type:'POST',   
data:{trade_no:trade_no},  
success:function(msg){
// console.log(msg);
if(myApp.device.os=='ios'){
window.location.href=msg;
}else{
window.open(msg);		
}
}   
}); 	
}else if(pay_type=='zhanpay_wechat_jsapi'){//站长支付
url=jinsom.home_url+"/Extend/pay/zhanpay/wechat-jsapi.php?trade_no="+trade_no;
// console.log(msg);
if(myApp.device.os=='ios'){
window.location.href=url;
}else{
window.open(url);		
}
 	
}else if(pay_type=='moneypay'){//余额支付
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/goods-buy-money.php",
data:{trade_no:trade_no},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
function c(){history.back(-1);}setTimeout(c,1500);
function d(){jinsom_order_details(msg.order_id);}setTimeout(d,2000);
}

}
});
}
}

//提交订单
function jinsom_recharge_goods(){
if($('#jinsom-shop-address').length>0){
address_number=$('#jinsom-shop-address').val();
if(address_number==''){
layer.open({content:'请添加收货地址！',skin:'msg',time:2});
return false;
}
}


trade_no=$('input[name="trade_no"]').val();
openid=$('input[name="openid"]').val();
pay_type=$('.jinsom-recharge-type li.on').attr('data');

if(pay_type==''){
layer.open({content:'请选择支付方式！',skin:'msg',time:2});
return false;	
}


// address_number=parseInt(address_number)-1;
//ajax后端插入地址
if($('#jinsom-shop-address').length>0){
$.ajax({   
url:jinsom.jinsom_ajax_url+"/action/address-order-add.php",
type:'POST',   
data:{trade_no:trade_no,address_number:address_number},
});
}

jinsom_goods_order_pay(pay_type,trade_no);
// if(pay_type=='alipay_code'){//当面付
// data=$('#jinsom-goods-recharge-form').serialize();
// myApp.showIndicator();
// $.ajax({   
// url:jinsom.home_url+'/Extend/pay/alipay/qrcode.php',
// type:'GET',   
// data:data,
// success:function(msg){   
// myApp.hideIndicator();
// if(myApp.device.os=='ios'){
// window.location.href=msg;	
// }else{
// window.open(msg);	
// }

// layer.open({
// content: '是否已经完成付款？'
// ,btn: ['已完成', '已取消']
// ,yes: function(index){
// myApp.showIndicator();
// $.ajax({   
// url:jinsom.jinsom_ajax_url+"/action/check-trade.php",
// type:'POST',   
// data:{trade_no:trade_no},
// success:function(msg){   
// myApp.hideIndicator();
// layer.open({content:msg.msg,skin:'msg',time:2});
// if(msg.code==1){
// function c(){
// // history.back(-1);
// myApp.getCurrentView().router.refreshPage();
// }setTimeout(c,2000);
// }
// }   
// }); 
// layer.close(index);
// }
// });

// }   
// });

// }else if(pay_type=='alipay_mobile'||pay_type=='wechatpay_mp'||pay_type=='epay_wechatpay'||pay_type=='epay_alipay'||pay_type=='epusdt'){//提交表单
// $('#jinsom-goods-recharge-form').submit();
// }else if(pay_type=='wechatpay_mobile'){//微信H5支付
// $.ajax({   
// url:jinsom.home_url+"/Extend/pay/wechatpay/wechat-h5.php",
// type:'POST',   
// data:{trade_no:trade_no},    
// success:function(msg){
// if(myApp.device.os=='ios'){
// window.location.href=msg.url;
// }else{
// window.open(msg.url);	
// }
// }   
// }); 	
// }else if(pay_type=='xunhupay_wechat_mobile'){//迅虎微信支付
// $.ajax({   
// url:jinsom.home_url+"/Extend/pay/xunhupay/wechatpay-xunhu-code.php",
// type:'POST',   
// data:{trade_no:trade_no},   
// success:function(msg){
// if(myApp.device.os=='ios'){
// window.location.href=msg;
// }else{
// window.open(msg);		
// }
// }   
// }); 	
// }else if(pay_type=='zhanpay_wechat_h5'){//站长支付
// $.ajax({   
// url:jinsom.home_url+"/Extend/pay/zhanpay/wechat-h5.php",
// type:'POST',   
// data:{trade_no:trade_no},  
// success:function(msg){
// // console.log(msg);
// if(myApp.device.os=='ios'){
// window.location.href=msg;
// }else{
// window.open(msg);		
// }
// }   
// }); 	
// }else if(pay_type=='zhanpay_wechat_jsapi'){//站长支付
// url=jinsom.home_url+"/Extend/pay/zhanpay/wechat-jsapi.php?trade_no="+trade_no;
// // console.log(msg);
// if(myApp.device.os=='ios'){
// window.location.href=url;
// }else{
// window.open(url);		
// }
 	
// }else if(pay_type=='moneypay'){//余额支付
// myApp.showIndicator();
// $.ajax({
// type: "POST",
// url:jinsom.jinsom_ajax_url+"/action/goods-buy-money.php",
// data:{trade_no:trade_no},
// success: function(msg){
// myApp.hideIndicator();
// layer.open({content:msg.msg,skin:'msg',time:2});
// if(msg.code==1){
// function c(){history.back(-1);}setTimeout(c,1500);
// function d(){jinsom_order_details(msg.order_id);}setTimeout(d,2000);
// }

// }
// });
// }



}





//打开我的地址管理页面
function jinsom_my_address_page(author_id,type){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-address.php?type='+type+'&author_id='+author_id});
}

//插入地址||编辑地址
function jinsom_my_address_do(author_id,number,type,obj){
if(type=='insert'){//选择地址
address=$(obj).children('.a').text();
name=$(obj).find('.name').text();
phone=$(obj).find('.phone').text();
history.back(-1);

if($('.jinsom-goods-order-confirmation-content .add-address').length>0){
$('.jinsom-goods-order-confirmation-content .address-list').html('<li onclick=jinsom_my_address_page('+jinsom.user_id+',"insert")><i class="jinsom-icon jinsom-arrow-right"></i>\
<p class="address"><span>地址</span><m>'+address+'</m></p>\
<p class="name"><span>收货人</span><m>'+name+'</m></p>\
<p class="phone"><span>手机号</span><m>'+phone+'</m></p>\
</li>\
<input type="hidden" id="jinsom-shop-address" value="'+number+'">');
}else{
$('.address-list.order .address m').text(address);
$('.address-list.order .name m').text(name);
$('.address-list.order .phone m').text(phone);
$('#jinsom-shop-address').val(number);
}

}else{//编辑地址
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-address-add.php?type=edit&number='+number+'&author_id='+author_id});
}
}

//打开我新建地址页面
function jinsom_add_address_page(author_id,type){
myApp.getCurrentView().router.load({url:jinsom.theme_url+'/mobile/templates/page/setting/setting-address-add.php?type=add&author_id='+author_id});
}


//提交添加地址
function jinsom_address_add(type,number){
province=$('#jinsom-address-province').val();
city=$('#jinsom-address-city').val();
district=$('#jinsom-address-district').val();
address=$('#jinsom-address-detailed').val();
name=$('#jinsom-address-name').val();
phone=$('#jinsom-address-phone').val();


if(!province||!city||!district){
layer.open({content:'请选择省份/城市/区县！',skin:'msg',time:2});
return false;
}
console.log(province,city,district)

if(province=='海外地区'){
province='';	
}else if(province=='香港特别行政区'||province=='澳门特别行政区'){
province=province+city;
}else if(province=='台湾省'){
}else if(province){
province=province+city+district;	
}

myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/address-add.php",
data:{city:province,address:address,name:name,phone:phone,type:type,number:number},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
if(msg.type=='add'){//新增地址
history.back(-1);
number=$('.jinsom-setting-content.address .address-list li').length;
type='edit';
if($('.jinsom-goods-order-confirmation-content').length>0){
type='insert';
}

html="\
<li id='jinsom-address-"+number+"' onclick=jinsom_my_address_do("+jinsom.user_id+","+(number)+",'"+type+"',this)><i class='jinsom-icon jinsom-fabiao1'></i>\
<p class='a'>"+province+address+"</p>\
<p class='b'><span class='name'>"+name+"</span><span class='phone'>"+phone+"</span></p>\
</li>\
";
if($('.jinsom-setting-content.address .address-list .jinsom-empty-page').length>0){
number=0;
$('.jinsom-setting-content.address .address-list').html(html);
}else{
$('.jinsom-setting-content.address .address-list').append(html);	
}
}else{
number=parseInt(msg.number);
$('.jinsom-setting-content.address .address-list li').eq(number).children('.a').html(province+address);
$('.jinsom-setting-content.address .address-list li').eq(number).find('.name').html(name);
$('.jinsom-setting-content.address .address-list li').eq(number).find('.phone').html(phone);
}


}

}
});
}


//删除地址
function jinsom_address_del(number){
layer.open({
content: '你确定要删除吗？'
,btn: ['确定', '取消']
,yes: function(index){
layer.close(index);
myApp.showIndicator();
$.ajax({
type: "POST",
url:  jinsom.jinsom_ajax_url+"/action/address-add.php",
data: {number:number,type:'del'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code==1){
history.back(-1);
$('#jinsom-address-'+number).remove();
}
}
});
}
});
}

// 购物车管理
function jinsom_shopping_cart_change(obj) {
if($(obj).hasClass('true')){
$(obj).removeClass('true').text('管理');
$('.jinsom-shopping-cart-list .buy-bar .total-box').show();
$('.jinsom-shopping-cart-list .buy-bar .goods-delete').hide();
}else{
$(obj).addClass('true').text('取消');
$('.jinsom-shopping-cart-list .buy-bar .total-box').hide();
$('.jinsom-shopping-cart-list .buy-bar .goods-delete').show();
}
}

//购物车内商品移除
function jinsom_shopping_cart_delete_goods() {
if(!jinsom.is_login){
jinsom_login_page();  
return false;
}
order_el = $('.jinsom-shopping-cart-list .content-box input:checkbox:checked');
if(order_el.length < 1) {
layer.open({content:'请选择要移除的商品！',skin:'msg',time:2});
return false;
}

key_arr = [];
var a=0;
order_el.each(function(index, item){
key_arr.push($(item).attr('data-id'));
a++;
});

layer.open({
content: '你确定要移除这些吗？',
btn: ['确定', '取消'],
yes: function(index){
layer.close(index);
myApp.showIndicator();
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/action/shopping-cart-delete.php",
data:{key_arr:JSON.stringify(key_arr),type:'batch'},
success: function(msg){
myApp.hideIndicator();
layer.open({content:msg.msg,skin:'msg',time:2});
if(msg.code == 1){
for (i = 0; i < a; i++) {
order_el.parents('.content-box').remove();
}
// 重载购物车
function d(){myApp.getCurrentView().router.refreshPage();}setTimeout(d,500);
}
}
});
}
});
}
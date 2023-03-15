

//获取内容数据
function jinsom_post(type,load_type,obj){
if($('.jinsom-load-post').length>0){
return false;	
}
author_id=$(obj).attr('author_id');
if(load_type=='more'){//加载更多
page=$(obj).attr('page');
$(obj).before(jinsom.loading_post);
$(obj).hide();	

if(author_id==1){
menu_list=$('.jinsom-member-menu li.on');
}else{
menu_list=$('.jinsom-index-menu li.on');
}

data=menu_list.attr('data');
index=menu_list.index();

}else{//ajax切换



page=1;
$(obj).addClass('on').siblings().removeClass('on');//菜单切换效果
$('.jinsom-post-list').prepend(jinsom.loading_post);//加载动画
data=$(obj).attr('data');
index=$(obj).index();

if(!author_id&&jinsom.sns_home_load_type=='page'){//首页显示
history.pushState('','','?type='+type+'&index='+index+'&page=1');
}
}


$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/post.php",
data: {type:type,page:page,load_type:load_type,index:index,author_id:author_id,data:data},
success: function(msg){
if(load_type=='more'){//加载更多
$('.jinsom-load-post').remove();
$(obj).show();
if(msg==0){//没有数据
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);
page=parseInt(page)+1;
$(obj).attr('page',page);	
}
}else{//ajax切换
audio=document.getElementById('jinsom-reload-music');
audio.play();
$('.jinsom-post-list').html(msg);
}

if(!author_id&&$('#jinsom-sns-home-ajax-page').length>0){//分页
layui.use('laypage', function(){
var laypage = layui.laypage;
laypage.render({
elem:'jinsom-sns-home-ajax-page',
count:$('#jinsom-sns-home-ajax-page').attr('count'),
limit:$('#jinsom-sns-home-ajax-page').attr('number'),
theme:'var(--jinsom-color)',
jump:function(obj,first){
type=$('.jinsom-index-menu li.on').attr('type');
index=$('.jinsom-index-menu li.on').index();
page=obj.curr;
if(!first){
window.open('/?type='+type+'&index='+index+'&page='+page,'_self');
}
}
});
});
}


jinsom_post_js();//ajax后加载要执行的脚本
}
});
}


//ajax后加载要执行的脚本
function jinsom_post_js(){
$(".jinsom-post-read-more").click(function(){
if($(this).prev().hasClass('hidden')){
$(this).prev().removeClass('hidden');
$(this).html("收起内容");
}else{
$(this).prev().addClass('hidden');
$(this).html("查看全文");
}
});

//评论框点击变高
$('.jinsom-post-comments').focus(function(){
if(!$(this).next().hasClass('jinsom-stop-comment-tips')){
$(this).css('height','85px');
}
});

//资料小卡片
$(".jinsom-post-user-info-avatar").hover(function(){
$this=$(this);
$this.children('.jinsom-user-info-card').show()
author_id=$this.attr('user-data');
if($this.find('.jinsom-info-card').length==0){
$this.children('.jinsom-user-info-card').html(jinsom.loading_info);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/stencil/info-card.php",
data: {author_id:author_id,info_card:1},
success: function(msg){
$this.children('.jinsom-user-info-card').html(msg);
}
});
}
},function(){
$(this).children('.jinsom-user-info-card').hide();
});


jinsom_lightbox();
}



//搜索页面======ajax加载
function jinsom_search_post(type,obj){
if($('.jinsom-load-post').length>0){
return false;
}


$('.jinsom-search-content').prepend(jinsom.loading_post);//加载动画
keyword=$('#jinsom-search-val').val();
data=$(obj).attr('data');
$(obj).addClass('on').siblings().removeClass('on');
jinsom_post_status=0;
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/search.php",
data: {type:type,keyword:keyword,page:1,load_type:'menu',data:data},
success: function(msg){   
audio=document.getElementById('jinsom-reload-music');
audio.play();
$('.jinsom-search-content').html(msg);
jinsom_post_js();
jinsom_post_status=1;
}
});
}


//===========搜索页面加载更多
function jinsom_more_search(obj){
type=$(obj).attr('type');
page=$(obj).attr('data');
data=$('.jinsom-search-tab li.on').attr('data');
keyword=$('#jinsom-search-val').val();
if($('.jinsom-load-post').length==0){
$(obj).before(jinsom.loading_post);
$(obj).hide();
}
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/search.php",
data: {page:page,type:type,keyword:keyword,load_type:'more',data:data},
success: function(msg){   
$('.jinsom-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);
paged=parseInt(page)+1;
$(obj).attr('data',paged);	
}
//ajax后加载要执行的脚本
jinsom_post_js();

}
});
}


//=======================================话题页面加载数据===================
function jinsom_topic_data(type,obj){
if($('.jinsom-load-post').length>0){
return false;
}

$('.jinsom-topic-post-list').prepend(jinsom.loading_post);//加载动画
topic_id=$('.jinsom-topic-info').attr('data');
post_list=$('.jinsom-topic-post-list');
$(obj).addClass('on').siblings().removeClass('on');
jinsom_post_status=0;
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/topic.php",
data: {type:type,topic_id:topic_id},
success: function(msg){  
audio=document.getElementById('jinsom-reload-music');
audio.play(); 
post_list.html(msg);
jinsom_post_js();
jinsom_post_status=1;
}
});
}


//加载更多话题
function jinsom_topic_data_more(type,obj){
topic_id=$('.jinsom-topic-info').attr('data');
page=$(obj).attr('data');
if($('.jinsom-load-post').length==0){
$(obj).before(jinsom.loading_post);
$(obj).hide();
}
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/topic.php",
data: {type:type,topic_id:topic_id,page:page},
success: function(msg){   
$('.jinsom-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);
paged=parseInt(page)+1;
$(obj).attr('data',paged);	
}

//ajax后加载要执行的脚本
jinsom_post_js();

}
});
}



//电脑端动态加载更多评论
function jinsom_more_comment(post_id,obj){
if($('.jinsom-load-post').length==0){
$(obj).before(jinsom.loading_post);
$(obj).hide();
}
page=$(obj).attr('page');
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/more/post-comment.php",
data: {post_id:post_id,page:page},
success: function(msg){   
$('.jinsom-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多评论！');
$(obj).remove();
}else{
$('.jinsom-post-comment-list').append(msg);
paged=parseInt(page)+1;
$(obj).attr('page',paged);	
}

}
});

}



//图片灯箱
function jinsom_lightbox(){
$("[data-fancybox]").fancybox({
hash:false,
});	
}



//=================论坛ajax加载内容

//comment:按最新回复排序
//new:按最新发表排序
//nice:精品帖子
function jinsom_ajax_bbs_menu(type,obj){
if($('.jinsom-load').length==0){
$(obj).addClass('on').siblings().removeClass('on');
var bbs_id=$('.jinsom-bbs-header').attr('data');
$('.jinsom-bbs-list-box').prepend(jinsom.loading_post);
topic=$(obj).attr('topic');
meta_key=$(obj).attr('meta-key');
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/bbs.php",
data: {page:1,bbs_id:bbs_id,type:type,topic:topic,meta_key:meta_key},
success: function(msg){ 
audio=document.getElementById('jinsom-reload-music');
audio.play();

$('.jinsom-bbs-list-box').html(msg);//追加内容	


if($('#jinsom-bbs-list-ajax-page').length>0){//分页
index=$('.jinsom-bbs-box-header .left li.on').index();
history.pushState('','','?type='+type+'&index='+index+'&page=1');

layui.use('laypage', function(){
var laypage = layui.laypage;
laypage.render({
elem:'jinsom-bbs-list-ajax-page',
count:$('#jinsom-bbs-list-ajax-page').attr('count'),
limit:$('#jinsom-bbs-list-ajax-page').attr('number'),
theme:'var(--jinsom-color)',
jump:function(obj,first){
page=obj.curr;
if(!first){
window.open($('#jinsom-bbs-list-ajax-page').attr('url')+'/?type='+type+'&index='+index+'&page='+page,'_self');
}
}
});
});
}

//瀑布流渲染
if($(obj).parents('.jinsom-bbs-box').next().hasClass('jinsom-bbs-list-4')){
grid.masonry('reloadItems');  
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
}); 
}

}
});
}
}

//论坛列表加载更多
function jinsom_ajax_bbs(obj,type){
$(obj).before(jinsom.loading_post);
$(obj).hide();
page=$(obj).attr('data');
bbs_id=$('.jinsom-bbs-header').attr('data');
topic=$('.jinsom-bbs-box-header .left li.on').attr('topic');
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/bbs.php",
data: {page:page,bbs_id:bbs_id,type:type,topic:topic},
success: function(msg){   
$('.jinsom-load-post').remove();
$(obj).show();
if(msg==0){
layer.msg('没有更多内容！');
$(obj).remove();
}else{
$(obj).before(msg);//追加内容

//瀑布流渲染
if($(obj).parent().hasClass('jinsom-bbs-list-4')){
grid.masonry('reloadItems');  
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
}); 
}

paged=parseInt(page)+1;
$(obj).attr('data',paged);	
}

}
});
}


//论坛ajax搜索
function jinsom_ajax_bbs_search(){
content=$('#jinsom-bbs-search').val();
bbs_id=$('.jinsom-bbs-header').attr('data');
if($.trim(content)==''){
layer.msg('请输入你要搜索的内容！');
return false;
}

$('.jinsom-bbs-list-box').html(jinsom.loading_post);
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/bbs-search.php",
data: {page:1,bbs_id:bbs_id,content:content},
success: function(msg){   

$('.jinsom-bbs-list-box').empty();
$('.jinsom-bbs-list-box').html(msg);//追加内容

//瀑布流渲染
if($('.jinsom-bbs-list-box').hasClass('jinsom-bbs-list-4')){
grid.masonry('reloadItems');  
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});
}

}
});
}


//论坛ajax搜索 加载更多
function jinsom_ajax_bbs_search_more(obj){
$(obj).html(jinsom.loading_post);
page=parseInt($(obj).attr('data'));
content=$('#jinsom-bbs-search').val();
bbs_id=$('.jinsom-bbs-header').attr('data');
if($.trim(content)==''){
layer.msg('请输入你要搜索的内容！');
return false;
}
$.ajax({
type: "POST",
url:jinsom.jinsom_ajax_url+"/data/bbs-search.php",
data: {page:page,bbs_id:bbs_id,content:content},
success: function(msg){   
$('.jinsom-bb-search-more').html('加载更多');
if(msg==0){
layer.msg('没有更多的内容！');
$('.jinsom-bb-search-more').remove();
}else{

$('.jinsom-bb-search-more').attr('data',page+1);

$('.jinsom-bb-search-more').before(msg);//追加内容

//瀑布流渲染
if($(obj).parent().hasClass('jinsom-bbs-list-4')){
grid.masonry('reloadItems');  
grid.imagesLoaded().progress( function() {
grid.masonry('layout');
});
}
	
}

}
});
}
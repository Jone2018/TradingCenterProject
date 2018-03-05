function PageInit(){
	$(".mm-ucenter  > a").addClass("active");
}

function ShowConfirm()
{
	layer.alert(gettext('您还没有提交实名认证，请继续完成实名认证!'),{closeBtn:0},function(index){
		document.location = "user-idcard.html";
		layer.close(index);
	});
}
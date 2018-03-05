function PageInit()
{
	$(".mm-ucenter  > a").addClass("active");
}

function MsgDelete(frm)
{
	var count = GetMsgCount(frm);
	if(count == 0)
	{
		layer.alert(gettext('请选择要删除的信息'));
		return false;
	}
	
	layer.confirm(gettext('请确认是否要删除所选信息?'),{icon: 3, title: gettext('删除提示')},function(index){
		var api = "/api/notice/delete_messages";
		
		AjaxSubmitData({
			apiURL : api,
			data : $(frm).serialize(),
			type : "get",
			onSuccess : cbSuccess
		});
		
		layer.close(index);
	});
	
	
	return false;
}

function MsgIsRead(frm)
{
	var count = GetMsgCount(frm);
	if(count == 0)
	{
		layer.alert(gettext('请选择要处理的信息'));
		return false;
	}
	
	var ds = $(frm).serialize();
	var api = "/api/notice/isRead_messages";
	
	AjaxSubmitData({
		apiURL : api,
		data : ds,
		type : "get",
		onSuccess : cbSuccess
	});
	
	return false;
}

function MsgIsReadID(id)
{
	var ds = { message_id:id };
	var api = "/api/notice/isRead_messages";
	
	AjaxSubmitData({
		apiURL : api,
		data : ds,
		type : "get",
		onSuccess : cbSuccess
	});
	
	return false;
}

function MsgAllIsRead(frm)
{
	$(frm).find("input[name='message_id']").each(function(index, element) {
        var ths = $(element);
			 ths.attr("checked",true);
    });
	
	//console.log(frm);
	
	var count = GetMsgCount(frm);
	if(count == 0)
	{
		layer.alert(gettext('请选择要处理的信息'));
		return false;
	}
	
	var ds = $(frm).serialize();
	var api = "/api/notice/isRead_messages";
	
	AjaxSubmitData({
		apiURL : api,
		data : ds,
		type : "get",
		onSuccess : cbSuccess
	});
	
	return false;
}

function GetMsgCount(frm)
{
	return $(frm).find("input[name='message_id']:checked").length;	
}

function cbSuccess(res)
{
	//console.log(res);
	if(res.result)
	{
		var msg = res.msg || gettext('处理成功');
		ShowMsgOK(msg,3000,function(){
			document.location = "user-message.html";
		});
	}
	else
	{
		ShowMsgError(res.msg);
	}
}
function PageInit()
{
	$(".mm-ucenter  > a").addClass("active");
}


function QuestionDelete(id)
{
	layer.confirm(gettext('请确认是否要删除工单') + "[" + id + "]?",{icon: 3, title: gettext('删除提示')},function(index){
		AjaxSubmitData({
			apiURL : "/api/question/question_delete",
			data : { question_id:id },
			type : "get",
			onSuccess : cbSuccess
		});
		
		layer.close(index);
	});
	
	return false;
}

function cbSuccess(res){
	var msg = res.msg || gettext('删除成功');
	//console.log(res);
	if(res.result && res.data && res.data.status == "1")
	{
		ShowMsgOK(msg,3000,function(){
			document.location = "user-question-list.html";
		});
	}
	else
	{
		ShowMsgError(gettext('删除失败'));
	}
}
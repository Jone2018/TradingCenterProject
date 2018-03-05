function PageInit() {
	$(".mm-ucenter  > a").addClass("active");
	
	$('#frmAction').bootstrapValidator({
 //        live: 'disabled',
         message: gettext('请输入一个有效的值'),
         feedbackIcons: {
             valid: ' ',
             invalid: ' ',
             validating: ' '
         },
         fields: {
			 old_password:
			 {
				 validators: {
					 notEmpty: {
							message: gettext('请输入原密码')
						},
					 stringLength: {
								min: 8,
								max: 32,
								message: gettext('请输入有效的8-32原密码')
						}
				 }
			 },
			 new_password:
			 {
				 validators: {
					 notEmpty: {
							message: gettext('请输入新交易密码')
						},
					 stringLength: {
								min: 8,
								max: 32,
								message: gettext('请输入有效的8-32新密码')
						}
				 }
			 },
			 new_password2:
			 {
				 validators: {
					  notEmpty: {
							message: gettext('请输入新交易密码')
						},
					 stringLength: {
								min: 8,
								max: 32,
								message: gettext('请输入有效的8-32新密码')
						},
					equalTo:{
						equalTo:'#new_password',
						message: gettext('二次输入的密码不相同')
					}
				 }
			 }
		 },
		 onSuccess:function(){
			 
			 AjaxSubmit('#frmAction',"/api/account/change_password",cbSuccess);
			 $("#frmAction").data("bootstrapValidator").resetForm();
		 }
	});
}

function cbSuccess(res)
{
	//console.log(res);
	if(res.result)
	{
		var msg = res.msg || gettext('密码修改成功');
		clearAllCookie();
		
		ShowMsgOK(msg,3000,function(){
			document.location = "login.html";
		});
	}
	else
	{
		ShowMsgError(res.msg);
	}
	
	
}
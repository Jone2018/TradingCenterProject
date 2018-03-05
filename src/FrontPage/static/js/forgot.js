function PageInit()
{
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
			 email:
			 {
				 validators: {
					 notEmpty: {
                         message: gettext('请输入的电子邮箱地址')
                     },
					 email: {
						 	message: gettext('请输入有效的邮箱地址')
						}
				 }
			 },
			 captcha:
			 {
				 validators: {
					 notEmpty: {
                         message: gettext('请输入的验证码')
                     },
					 stringLength: {
								min: 4,
								max: 6,
								message: gettext('请输入有效的验证码')
						}
				 }
			 },
			 password:
			 {
				 validators: {
					 Password: {
								min: 8,
								max: 32,
								message: gettext('请输入大小写字母与数字的组合的8-32位密码')
					}
				 }
			 },
			 password2:
			 {
				 validators: {
					 Password: {
								min: 8,
								max: 32,
								message: gettext('请输入大小写字母与数字的组合的8-32位密码')
					},
					equalTo:{
						equalTo:'#password',
						message: gettext('二次输入的密码不相同')
					}
				 }
			 }
		 },
		 onSuccess:function(){
			 AjaxSubmit('#frmAction',"/api/account/email_reset_password",cbSuccess);
			 
			 $("#frmAction").data("bootstrapValidator").resetForm();
		 }
	});
}

function cbSuccess(res)
{
	//console.log(res);
	if(res.result)
	{
		var msg = res.msg || gettext('密码已重置，请登录');
		ShowMsgOK(msg,3000,function(){
			document.location = "login.html";
		});
	}
	else
	{
		ShowMsgError(res.msg);
	}
}



function SendToEmail(el)
{
	var email = $("#email").val();
	if(IsEmail(email))
	{
		SendEmailMsg(el,email)
	}
	else
	{
		ShowMsgError(gettext('请输入有效的邮箱地址'))
	}
	return false;
}
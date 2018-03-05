$(function(){
	$('#frmAction').bootstrapValidator({
 //        live: 'disabled',
         message: gettext('请输入一个有效的值'),
         feedbackIcons: {
             valid: ' ',
             invalid: ' ',
             validating: ' '
         },
         fields: {
			 password:
			 {
				 validators: {
					 notEmpty: {
							 message: gettext('请输入的交易密码')
					 },
					 digits:{
						 message: gettext('只允许输入数字密码')
					 },
					 stringLength: {
								min: 6,
								max: 6,
								message: gettext('请输入有效的六位数字密码')
						}
				 }
			 },
			 repassword:
			 {
				 validators: {
					 notEmpty: {
							 message: gettext('请再输入一次交易密码')
					 },
					 digits:{
						 message: gettext('只允许输入数字密码')
					 },
					 stringLength: {
								min: 6,
								max: 6,
								message: gettext('请输入有效的六位数字密码')
					},
					equalTo:{
						equalTo:'#password',
						message: gettext('二次输入的密码不相同')
					}
				 }
			 }
		 },
		 onSuccess:function(){
			  AjaxSubmit('#frmAction',"/api/account/signup",cbSuccess);
			 
			 $("#frmAction").data("bootstrapValidator").resetForm();
		 }
	});
});

function cbSuccess(res)
{
	//console.log(res);
	if(res.result)
	{					
		ShowMsgOK(gettext('资料已提交,请继续完善资料'),3000,function(){
			document.location = "register-idcard.html";
		});
	}
	else
	{
		ShowMsgError(res.msg);
		RefreshCode("#rndCode");
	}
}
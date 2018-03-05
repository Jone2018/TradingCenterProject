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
			 name:
			 {
				 validators: {
					 notEmpty: {
							 message: gettext('请输入的真实姓名')
					 },
					 stringLength: {
								min: 2,
								message: gettext('请输入有效的真实姓名')
						}
				 }
			 },
			 idnumber:
			 {
				 validators: {
					 notEmpty: {
							 message: gettext('请输入有效的证件号码')
					 }
				 }
			 },
			 idnumber2:
			 {
				 validators: {
					 notEmpty: {
							 message: gettext('请再输入一次证件号码')
					 },
					equalTo:{
						equalTo:'#idnumber',
						message: gettext('二次输入的证件号码不相同')
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
			document.location = "register-success.html";
		});
	}
	else
	{
		ShowMsgError(res.msg);
		RefreshCode("#rndCode");
	}
}
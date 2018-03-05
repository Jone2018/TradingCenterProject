function PageInit(){
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
			 realname:
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
			 id_card_no:
			 {
				 validators: {
					 UNID: {
						 message: gettext('请输入有效的证件号码')
					 }
				 }
			 }
		 },
		 onSuccess:function(){
			 ShowLoading("正在处理...",2000,function(){
				 SetItem("temp_realname",$("#realname").val());
				 SetItem("temp_id_card_no",$("#id_card_no").val());
				 SetItem("temp_id_type",$("#id_type").val());
				 
				 document.location = "user-idcard-upload.html";
			 });
			 
			 $("#frmAction").data("bootstrapValidator").resetForm();
		 }
	});
}
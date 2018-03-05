function PageInit()
{
	$(".mm-fmcenter  > a").addClass("active");
	$("#amount").keyup(function(){
		UpdateWKCAmount();
	});
	
	$("#amount").blur(function(){
		UpdateWKCAmount();
	});
	
	$.getJSON("/api/finance/get_coin_address",{
		coin_type:6
	},function(res){
		if(res && res.result)
		{
			var addr = res.data.address
			$("#wkc_address").html(addr);
			var span = $("#wkc_qrc");
			var qrcode = new QRCode(span[0], {
                    width : 100,
                    height : 100
                });
			qrcode.makeCode(res.data.address);
		}
	});
	
}

function RefreshCode(id)
{
	$.ajax({
			url:'/api/account/get_captcha',
			type:'GET',
			cache:false,
			dataType:'json',
			success:function (res) {
				if(res.result)
				{
					var key = GetCaptchaKey(res.data.captcha_url);
						$(id).attr('src', res.data.captcha_url);
						$("#captcha_key").val(key);
				}
			}
		})
	
	return false;
}

function UpdateWKCAmount()
{
	var amount = $("#amount").val();
	if(IsNumber(amount) && amount.indexOf(".") == -1)
	{
		var s = amount + "." + GetItem("uid");
		$("#wkcUID").html(s);	
	}
}

function GetCaptchaKey(url)
{
	var arr = url.split('/');
	if(arr.length >= 2)
	{
		return arr[arr.length-2];	
	}
	
	return "";
}

function BindWKC(cbSuccess)
{
	$('#frmAction').bootstrapValidator({
 //        live: 'disabled',
         message: gettext("请输入一个有效的值"),
         feedbackIcons: {
             valid: ' ',
             invalid: ' ',
             validating: ' '
         },
         fields: {
			 address:
			 {
				 validators: {
					 notEmpty: {
						 message: gettext("请输入转出地址")
					 }
				 }
			 },
			 amount:
			 {
				 validators: {
					 notEmpty: {
						 message: gettext("请输入充币数量")
					 },
					 digits: {
						 message: gettext("请输入一个整数")
					 }
				 }
			 },
			 captcha_value:
			 {
				 validators: {
					 notEmpty: {
						 message: gettext("请输入验证码")
					 },
					 stringLength:{
						min:4,
						max:6,
						message: gettext("请输入有效的验证码")
					 }
				 }
			 }
		 	},
			 onSuccess:function(){
				 AjaxSubmitWKC(cbSuccess);
				 $("#frmAction").data("bootstrapValidator").resetForm();
			 }
	});	
}

function AjaxSubmitWKC(cbSuccess)
{
	var form_data = {};
	var items = $('#frmAction').serializeArray();
	$.each(items, function () {
		if(this.name == "amount")
		{
			form_data[this.name] = this.value + "." + GetItem("uid");
		}
		else
		{
			form_data[this.name] = this.value;
		}
	});
	form_data["csrfmiddlewaretoken"] = GetToKen();
	
	AjaxSubmitData({
		apiURL:"/api/finance/wkc_charge",
		type:"POST",
		data:form_data,
		onSuccess:function(res){
			cbWKCCharge(res);
			
			if(res.result && res.data && res.data.status == "1")
			{
				cbSuccess && cbSuccess();
			}
		}
	});
	
	
}

function CancelOrder(id,cbSuccess)
{
	if(!id) return false;
	
	var data = {
				id:id,
				csrfmiddlewaretoken:GetToKen()	
			};
			
		
			
	layer.confirm(gettext("请确认是否要撤消充值订单") + "[" + id + "]?",{icon: 3, title: gettext("撤消提示")},function(index){
		ShowLoading(gettext("正在撤消..."));
		AjaxSubmitData({
			apiURL : "/api/finance/cancel_wkc_charge",
			data : data,
			type : "post",
			onSuccess : function(res){
				cbCancelSuccess(res);
				if(res.result && res.data && res.data.status==1)
				{
					cbSuccess();
				}
			}
		});
		
		//console.log(data);
		
		layer.close(index);
	});        
	
	return false;
}


function cbCancelSuccess(res)
{
	//console.log(res);
	if(res.result && res.data && res.data.status==1)
	{
		var msg = res.msg || gettext("处理成功");
		ShowMsgOK(msg,3000);
	}
	else
	{
		ShowMsgError(res.msg);
	}
}

function cbWKCCharge(res)
{
	//console.log(res);
	if(res.result && res.data && res.data.status == 1)
	{
		var msg = res.msg || gettext("充值提交成功");
		$("#div_wkc_address").removeClass("hidden").show();
		ShowMsgOK(msg,3000,function(){
			
		});
	}
	else
	{
		ShowMsgError(res.msg);
	}
	RefreshCode('#rndCode');
}
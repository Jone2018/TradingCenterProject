function PageInit(){
	$(".mm-ucenter  > a").addClass("active");
	/*
	$("#file_id").uploadifive({
		'buttonClass' : 'hidden',
		'buttonText':'上传正面',
		'multi':false,
		'uploadScript': '/js/uploadifive/upload-json.asp',
		'onUploadComplete' : function(file, data) {
			var src = "/images/idcard.jpg"
			$("#picIDCard").css({"background-image":"url(/images/idcard.jpg)","background-size":"100% 100%"});
			$("input[name='pic_front']").val(src);
		},
        'onUploadSuccess' : function(file, data, response) {
			
        }
    });
	
	$("#file_idback").uploadifive({
		'buttonClass' : 'hidden',
		'buttonText':'上传背面',
		'multi':false,
        'uploadScript': '/js/uploadifive/upload-json.asp',
		'onUploadComplete' : function(file, data) {
			var src = "/images/idback.jpg"
			$("#picIDCardBack").css({"background-image":"url(/images/idback.jpg)","background-size":"100% 100%"});
			$("input[name='pic_back']").val(src);
		},
        'onUploadSuccess' : function(file, data, response) {
			
        }
    });
	
	$("#file_personal").uploadifive({
		'buttonClass' : 'hidden',
		'buttonText':'立即上传',
		'multi':false,
        'uploadScript': '/js/uploadifive/upload-json.asp',
		'onUploadComplete' : function(file, data) {
			var src = "/images/idpersonal.jpg"
			$("#picPersonal").css({"background-image":"url(/images/idpersonal.jpg)","background-size":"100% 100%"});
			$("input[name='pic_handon']").val(src);
		},
        'onUploadSuccess' : function(file, data, response) {
			
        }
    });
	*/
	/*$(".photo .box a").click(function(){
		var rel = $(this).data("rel");
			$(rel).trigger("click");
			
		var frm = $("#frUpload").contents();
		var rel = $(this).data("rel");
		var rnd = CreateRND(20);
		var file = frm.find("#file");
		var id = frm.find("#id");
		var li = $(this).parent();
		if(id.length && file.length)
		{
			id.val(rnd);
			file.trigger("click");
		}
		
		
		
		return false;
	});*/
	
}

var iUploadResult = 0;
function AjaxUpload(id,cbSuccess)
{
	iUploadResult = 0;
	
	ShowLoading(gettext('正在上传文件'),60000,function(){
			clearInterval(upTimerID);
			if(iUploadResult == 0)
			{
				cbSuccess && cbSuccess({ result:false });
				ResetUpload();
			}
		});
		
		upTimerID = setInterval(function(){
			
			var src = GetItem(id);
			
			if(src && src.length > 0)
			{
				iUploadResult = 1;
				ShowMsgOK(gettext('图片已上传成功'));
				clearInterval(upTimerID);
				cbSuccess && cbSuccess({ src:src, result:true });
				RemoveItem(id)
				ResetUpload();
				
			}
			else
			{
				try
				{
					var frm = $("#frUpload").contents();
					
					if(frm && frm.find("error").length > 0)
					{
						iUploadResult = 2;
						ShowMsgOK(gettext('上传失败，请重试'));
						cbSuccess && cbSuccess({ result:false });
						ResetUpload();
					}
				}
				catch(err)
				{
					//console.log(err);
				}
				
			}
			
		},1000);		
}

function GetExt(str)
{
	var arr = str.split(".");
	if(arr.length > 1)
	{
		return "." + arr[arr.length-1].toLowerCase();	
	}
	return "";
}

function IsImage(ext)
{
	return (ext == ".jpg" || ext == ".png" || ext == ".gif" || ext == ".jpeg" || ext == ".bmp");
}


function ResetUpload()
{
	$("#frUpload").attr("src","oss-upload.html");	
}

var upTimerID;
var chkTimerID;

function CreateRND(len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

function ShowConfirm(tl,msg)
{ 

	layer.confirm(msg, {icon: 3, title:tl}, function(index){
	  //do something
	  
	  layer.close(index);
	  
	  document.location = "user-idcard-list.html";
	});

}

function AjaxSubmitX(el)
{
	var frm = $(el);
	var pic1 = frm.find("input[name='pic_front']");	
	var pic2 = frm.find("input[name='pic_back']");	
	var pic3 = frm.find("input[name='pic_handon']");
	
	var name = frm.find("input[name='realname']");
	var idno = frm.find("input[name='id_card_no']");
	
	var box1 = $("#picIDCard");
	var box2 = $("#picIDCardBack");
	var box3 = $("#picPersonal");
	
	if(pic1.val().length < 3)
	{
		box1.addClass("error");
		ShowMsgError(gettext('请上传证件正面'));
		return false;
	}
	
	if(pic2.val().length < 3)
	{
		box2.addClass("error");
		ShowMsgError(gettext('请上传证件背面'));
		return false;
	}
	
	if(pic3.val().length < 3)
	{
		box3.addClass("error");
		ShowMsgError(gettext('请上传手持身份证和当日字条'));
		return false;
	}
	
	if(name.length == 0)
	{
		ShowMsgError(gettext('真实姓名不能为空'));
		return false;
	}
	
	if(idno.length == 0)
	{
		ShowMsgError(gettext('证件号码不能为空'));
		return false;
	}
	
	AjaxSubmit('#frmAction',"/api/account/set_realname",cbSuccess);
	
	
	return false;
}

function cbSuccess(res)
{
	//console.log(res);
	if(res.result)
	{
		var msg = res.msg || gettext('设置实名认证资料已提交');
		ShowMsgOK(msg,3000,function(){
			document.location = "user-idcard-list.html";
		});
	}
	else
	{
		ShowMsgError(res.msg);
	}
}
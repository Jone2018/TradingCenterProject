$(function () {
    /*$.get("/api/account/userinfo",function(res){
            if(!res.result)
            {
                clearAllCookie();
                layer.alert('请登录后再访问',{title:"提示",closeBtn:0}, function(index){
                      //do something
                      layer.close(index);
                      document.location = "login.html";
                    });
            }
        });*/

    if (!$.cookie('sessionid') && !$.cookie('uid')) {
        layer.alert(gettext('请登录后再访问'), {title: gettext('提示'), id: "dialog_alert", closeBtn: 0}, function (index) {
            //do something
            layer.close(index);
            document.location = "login.html";
        });
    }
    ;
})

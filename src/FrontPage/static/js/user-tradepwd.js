var isSetPasswd = GetItem("is_set_password") == "true";

function PageInit() {
    $(".mm-ucenter a").addClass("active");

    /*if(!isSetPasswd)
    {
        $("#old_password").val("111111");
    }*/

    $('#frmAction').bootstrapValidator({
        //        live: 'disabled',
        message: gettext('请输入一个有效的值'),
        feedbackIcons: {
            valid: ' ',
            invalid: ' ',
            validating: ' '
        },
        fields: {
            /*old_password:
            {
                validators: {
                    notEmpty: {
                           message: gettext('请输入原密码')
                       },
                    digits:{
                        message: gettext('只允许输入数字密码')
                    },
                    stringLength: {
                               min: 6,
                               max: 6,
                               message: gettext('请输入有效的六位数字原密码')
                       }
                }
            },*/
            trade_password:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入新交易密码')
                        },
                        digits: {
                            message: gettext('只允许输入数字密码')
                        },
                        stringLength: {
                            min: 6,
                            max: 6,
                            message: gettext('请输入有效的六位数字密码')
                        }
                    }
                },
            trade_password2:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请再输入新交易密码')
                        },
                        digits: {
                            message: gettext('只允许输入数字密码')
                        },
                        stringLength: {
                            min: 6,
                            max: 6,
                            message: gettext('请输入有效的六位数字密码')
                        },
                        equalTo: {
                            equalTo: '#trade_password',
                            message: gettext('二次输入的密码不相同')
                        }
                    }
                },
            captcha:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入验证码')
                        },
                        stringLength: {
                            min: 4,
                            max: 6,
                            message: gettext('请输入有效的验证码')
                        }
                    }
                }
        },
        onSuccess: function () {
            /* if(!isSetPasswd)
             {
                 $("#old_password").val("");
             }*/

            AjaxSubmit('#frmAction', "/api/account/set_trade_password", cbSuccess);
            $("#frmAction").data("bootstrapValidator").resetForm();
        }
    });
}

function cbSuccess(res) {
    //console.log(res);
    if (res.result) {
        var msg = res.msg || gettext('交易密码已修改');

        ShowMsgOK(msg, 3000, function () {
            document.location = "user-tradepwd.html";
        });
    }
    else {
        ShowMsgError(res.msg);
        /*if(!isSetPasswd)
        {
            $("#old_password").val("111111");
        }*/
    }


}

function SendMsgX(el) {
    var type = $("input[name='captcha_type']:checked").val();
    //console.log(type);
    if (type == "email") {
        SendEmailMsgX(el, "#email");
    }
    else if (type == "phone") {
        SendMobiMsgX(el, "#phone_number");
    }

    return false;
}
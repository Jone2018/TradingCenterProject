function PageInit() {
    $(".mm-ucenter a").addClass("active");

    $('#frmAction').bootstrapValidator({
        //        live: 'disabled',
        message: gettext('请输入一个有效的值'),
        feedbackIcons: {
            valid: ' ',
            invalid: ' ',
            validating: ' '
        },
        fields: {
            phone_number:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入手机号码')
                        },
                        regexp: {
                            regexp: /^\d[\d-]{5,15}$/,
                            message: gettext('请输入有效的手机号码')
                        }
                    }
                },
            captcha:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入收到的验证码')
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
            AjaxSubmit('#frmAction', "/api/account/set_phone_number", cbSuccess);

            $("#frmAction").data("bootstrapValidator").resetForm();
        }
    });
}

function cbSuccess(res) {
    //console.log(res);
    if (res.result) {
        var msg = res.msg || gettext('手机已绑定成功');
        ShowMsgOK(msg, 3000, function () {
            document.location = "user-mobile.html";
        });
    }
    else {
        ShowMsgError(res.msg);
    }
}
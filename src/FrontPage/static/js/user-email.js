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
            email:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入的电子邮箱')
                        },
                        emailAddress: {
                            message: gettext('请输入有效的电子邮箱')
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
                }
        },
        onSuccess: function () {
            AjaxSubmit('#frmAction', "/api/account/set_email", cbSuccess);

            $("#frmAction").data("bootstrapValidator").resetForm();
        }
    });
}

function cbSuccess(res) {
    //console.log(res);
    if (res.result) {
        var msg = res.msg || gettext('邮件已绑定成功');
        ShowMsgOK(msg, 3000, function () {
            document.location = "user-email.html";
        });
    }
    else {
        ShowMsgError(res.msg);
    }
}
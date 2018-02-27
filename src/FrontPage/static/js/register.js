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
            email: {
                validators: {
                    notEmpty: {
                        message: gettext('请输入有效的电子邮箱地址')
                    },
                    emailAddress: {
                        message: gettext('请输入有效的电子邮箱地址')
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
                        equalTo: {
                            equalTo: '#password',
                            message: gettext('二次输入的密码不相同')
                        }
                    }
                },
            agree:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请阅读并同意相关的注册条款')
                        }
                    }
                }
        },
        onSuccess: function () {
            AjaxSubmit('#frmAction', "/api/account/email_signup", cbSuccess);

            $("#frmAction").data("bootstrapValidator").resetForm();
        }
    });
}

function cbSuccess(res) {
    //console.log(res);
    if (res.result) {
        var msg = res.data.msg || gettext('注册成功，请继续完成邮箱激活');
        ShowMsgOK(msg, 3000, function () {
            document.location = "register-success.html";
        });

        SetItem("temp_email", $("#email").val());
    }
    else {
        ShowMsgError(res.msg);
    }
}
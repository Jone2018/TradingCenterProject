function RefreshCode(id) {
    $.ajax({
        url: '/api/account/get_captcha',
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (res) {
            if (res.result) {
                var key = GetCaptchaKey(res.data.captcha_url);
                $(id).attr('src', res.data.captcha_url);
                $("#captcha_key").val(key);
            }
        }
    })

    return false;
}

function GetCaptchaKey(url) {
    var arr = url.split('/');
    if (arr.length >= 2) {
        return arr[arr.length - 2];
    }

    return "";
}

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
            username:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入邮箱地址')
                        },
                        email: {
                            message: gettext('请输入有效的邮箱地址')
                        }
                    }
                },
            password:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入有效的登录密码')
                        }
                    }
                },
            'captcha_value':
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入的验证码')
                        }
                    }
                }
        },
        onSuccess: function () {

            AjaxSubmit('#frmAction', "/api/account/login", cbLogin);

            $("#frmAction").data("bootstrapValidator").resetForm();
        }
    });

    RefreshCode("#rndCode");
}


function cbLogin(res) {
    //console.log(res);
    if (res.result) {
        SetItem('uid', res.data.uid);
        SetItem('email', res.data.email);
        SetItem('nicname', res.data.nickname);
        SetItem('phone_number', res.data.phone_number);
        SetItem('avatar_url', res.data.avatar_url);
        SetItem('date_joined', res.data.date_joined);
        SetItem('is_email_verified', res.data.is_email_verified);
        SetItem('is_phone_verified', res.data.is_phone_verified);
        SetItem('is_realname_verified', res.data.is_realname_verified);
        SetItem('is_set_password', res.data.is_set_password);
        SetItem('last_login_ip', res.data.last_login_ip);
        SetItem('last_login_time', res.data.last_login_time);

        ShowMsgOK(gettext('登录成功，正在跳转'), 3000, function () {
            document.location = "index.html";
        });
    }
    else {
        ShowMsgError(res.msg);
        RefreshCode("#rndCode");
    }
}
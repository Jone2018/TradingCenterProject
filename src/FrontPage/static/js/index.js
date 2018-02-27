function PageInit() {
    RefreshCode("#rndCode");

    $(".mm-home a").addClass("active");


    $(window).resize(function () {
        ResizeAll();
    });

    if (IsLogin()) {
        $.getJSON("/api/account/get_is_read", function (res) {
            if (res.result && res.data && !res.data.is_read) {
                ShowRules();
            }

        });
    }

}

var srTimerID;
var srSeconds = 10;

function ShowRules() {
    $.get("dialog/rules.html", function (html) {
        var winWd = $(window).width();
        var winHt = $(window).height();

        var wd = winWd > 991 ? 800 : winWd * 0.9;
        var ht = winHt > 500 ? 500 : winHt * 0.8;

        srTimerID = setInterval(function () {
            TRules();
        }, 1000);

        layer.open({
            title: gettext('随求用户协议'),
            content: html,
            area: [wd + "px", ht + "px"],
            isFixed: true,
            closeBtn: false,
            btn: [gettext('我已阅读并同意该协议')],
            yes: function (index, layero) {
                if (srSeconds <= 0) {
                    $.getJSON("/api/account/set_is_read", {}, function (res) {

                    });

                    layer.close(index);
                }
            }
        });

        $(".layui-layer-btn0").css({"background-color": "#999", "border-color": "#999"});
    }, "html");
}

function TRules() {
    if (--srSeconds <= 0) {
        clearInterval(srTimerID);
        $(".layui-layer-btn0").removeAttr("style").html("我已阅读并同意该协议");
    }
    else {
        $(".layui-layer-btn0").html("我已阅读并同意该协议(" + srSeconds + "秒)");
    }
}

function InitSlider() {
    $(".bxSlider").bxSlider({
        mode: 'horizontal',
        auto: true,
        pause: 6000,
        easing: "swing"
    });
}

function ResizeAll() {

    $(".home-news .img img").each(function (index, element) {
        var ths = $(element);
        var wd = ths.width();
        var ht = parseInt(wd / 2);
        //console.log(ht);
        ths.css("height", ht + 'px');
    });
}

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

function AjaxLogin(el) {
    var frm = $(el);
    var usr = frm.find("input[name='username']");
    var pwd = frm.find("input[name='password']");
    var cde = frm.find("input[name='captcha_value']");
    if (IsEmpty(usr.val())) {
        ShowMsgError(gettext('请输入手机号/邮箱'));
        usr.focus();
        return false;
    }

    if (IsEmpty(pwd.val())) {
        ShowMsgError(gettext('请输入密码'));
        pwd.focus();
        return false;
    }

    if (IsEmpty(cde.val())) {
        ShowMsgError(gettext('请输入验证码'));
        cde.focus();
        return false;
    }


    AjaxSubmit(el, "/api/account/login", cbLogin);

    return false;
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

function InitTotalAmount() {
    $.getJSON("/api/finance/get_funds", {
        is_zero: 1
    }, function (res) {
        if (res.result) {
            CountTotalAmount(res.data);
        }
    });
}

function CountTotalAmount(funds) {
    var btc = 0;
    var cny = 0;
    var rate = GetItem("cny_rate");
    if (IsNumber(rate)) {
        rate = parseFloat(rate)
    }

    $.getJSON("/api/market/market_info", {}, function (res) {
        //console.log(res);
        //console.log(funds);
        if (res.result) {
            for (var j = 0; j < funds.length; j++) {
                var frozen = IsNumber(funds[j].frozen) ? funds[j].frozen : 0;
                var available = IsNumber(funds[j].available) ? funds[j].available : 0;
                var unconfirm = IsNumber(funds[j].unconfirm) ? funds[j].unconfirm : 0;
                var type = funds[j].coin_type;
                var newPrice = GetCoinBTCPrice(res.data, type);
                var cnyRate = GetCoinBTCRate(res.data, type);
                if (cnyRate > 0 && cnyRate != rate) {
                    rate = cnyRate;
                }

                if (newPrice > 0) {
                    btc += (parseFloat(frozen) + parseFloat(available) + parseFloat(unconfirm)) * parseFloat(newPrice);
                }
            }

            cny = btc * rate;
            if (btc > 0) {
                $("#fnAmountBTC").html(FormatNumX(btc));
            }

            if (cny > 0) {
                $("#fnAmountBTC").attr("title", "¥" + Math.round(cny));
            }

            $('[data-toggle="tooltip"]').tooltip();
        }
    });

}

function GetCoinBTCPrice(data, type) {
    if (type == "1")
        return 1.0;

    var price = 0;
    for (var i = 0; i < data.length; i++) {
        var coin_type = GetPairCode(data[i].pair_code, "coin_type_b");
        if (type == coin_type) {
            price = IsNumber(data[i].price) ? parseFloat(data[i].price) : 0;
            break;
        }
    }

    return price;
}

function GetCoinBTCRate(data, type) {
    var rate = 0;
    for (var i = 0; i < data.length; i++) {
        var coin_type = GetPairCode(data[i].pair_code, "coin_type_b");
        if (type == coin_type) {
            rate = IsNumber(data[i].cny_rate) ? parseFloat(data[i].cny_rate) : 0;
            break;
        }
    }

    return rate;
}
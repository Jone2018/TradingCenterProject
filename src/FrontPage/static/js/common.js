$(function () {
    if ($("#home").length > 0) {
        LoadUserinfo(CreatePage);
    }
    else {
        LoadUserinfo();
    }

    if (!GetItem("cny_rate") || GetItem("cny_rate") == "0" || !IsNumber(GetItem("cny_rate"))) {
        $.getJSON("/api/market/get_cny_rate", {}, function (res) {
            console.log(res);
            if (res.result && res.data && res.data.cny_rate) {
                SetItem("cny_rate", res.data.cny_rate);
            }
        });
    }

})

function LoadUserinfo(cbSuccess) {
    $.getJSON("/api/account/userinfo", function (res) {
        //console.log(res);
        if (!res.result) {
            clearAllCookie();
        }
        else {
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
        }

        cbSuccess && cbSuccess();
    });
}

function WSlideInit() {
    var swiper = new Swiper('#swiper', {
        direction: 'vertical',
        loop: true,
        autoplay: {
            delay: 5000
        }
    });
}

function ScrollTopInit() {
    $(".scrolltop-bar ul li:has(div.item-hover)").hover(function () {
        $(this).children("div.item-hover").stop(true, true).animate({"right": "0"}, 300);
    }, function () {
        $(this).children("div.item-hover").stop(true, true).animate({"right": "-200"}, 300);
    })
}

function ShowDialogWX() {
    layer.open({
        title: gettext('扫描微信二维码'),
        btn: [],
        content: '<div style="text-align:center"><img src="/static/images/wx.jpg" height="200" width="200" /></div>'
    });
}

function CreateOSSPath(src, ossTK) {
    var key = GetItem("OSSAccessKeyId");
    var eps = GetItem("Expires");
    var sge = GetItem("Signature");
    if (ossTK) {
        key = ossTK.OSSAccessKeyId;
        eps = ossTK.expires;
        sge = ossTK.signature;
    }

    if (key && eps && sge) {
        return realNameHost + src + "?OSSAccessKeyId=" + key + "&Expires=" + eps + "&Signature=" + escape(sge) + "&security-token=SecurityToken";
    }

    return "";
}

function GetItem(key) {
    var k = key;
    if (k == "phone_number_cn") k = "phone_number";
    var v = $.cookie(k) ? $.cookie(k) : "";
    if (key == "phone_number_cn" && v.substr(0, 3) == "+86") {
        v = v.substr(3);
    }

    return v;
}

function GetFormatItem(key) {
    var s = GetItem(key);

    if (s && s.length > 3) {
        var len = s.length;
        var vLen = parseInt(len / 3);
        var tmp = s;
        if (s.indexOf("@") != -1) {
            var arr = s.split('@');

            for (var i = 0; i < arr.length; i++) {
                if (i == 0) {
                    tmp = arr[i].substr(0, 3) + "***";
                }
                else {
                    tmp += "@" + arr[i];
                }
            }
        }
        else {
            tmp = s.substr(0, vLen) + "****" + s.substr(len - vLen, vLen);
        }
        s = tmp;
    }

    return s;
}

// toFixed 修复 解决JS 数字丢失精度
function toFixedFloat(num, s) {
    var times = Math.pow(10, s)
    var des = num * times + 0.5
    des = parseInt(des, 10) / times
    return des + ''
}

function SetItem(key, val) {
    $.cookie(key, val, {expires: 7});
}

function RemoveItem(key) {
    $.cookie(key, "");
}

function GetCoinType(coin_id, key) {
    var itms = siteConfig.coin_type;
    if (itms) {
        for (var i = 0; i < itms.length; i++) {
            if (itms[i].coin_id == coin_id) {
                return itms[i][key];
            }
        }
    }
    return "";
}

function GetPairCode(code, key) {
    var itms = siteConfig.pair_choice;
    if (itms) {
        for (var i = 0; i < itms.length; i++) {
            if (itms[i].code == code) {
                return itms[i][key];
            }
        }
    }
    return "";
}

function GetPairCoinType(code, key) {
    var type = GetPairCode(code, "coin_type_b");
    return GetCoinType(type, key);
}

function GetLangLocalName(code, key) {
    var itms = siteConfig.language;
    if (itms) {
        for (var i = 0; i < itms.length; i++) {
            if (itms[i].code == code) {
                return itms[i][key];
            }
        }
    }
    return "";
}

//pair_choice

function IsLogin() {
    /*if($("#non-login").length) return false;

    return true;	*/
    return $.cookie('uid') && 1 == 1;
}

function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            if (keys[i] != "csrftoken" && keys[i] != "sessionid" && keys[i] != "cny_rate" && keys[i] != "_language") {
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
            }
        }
    }
}

function AjaxSubmit(f, apiURL, funSuccess) {
    var nm = f || "#frmAction";
    var frm = $(nm);
    var btn = frm.find(":input[type='submit']");

    if (frm.length) {
        if (btn.length) {
            btn.attr("disabled", true);
        }
        var form_data = {};
        var items = frm.serializeArray();
        $.each(items, function () {
            if (form_data[this.name]) {
                form_data[this.name] += "," + this.value;
            }
            else {
                form_data[this.name] = this.value;
            }
        });
        form_data["csrfmiddlewaretoken"] = GetToKen();

        ShowLoading(gettext("处理中..."));

        //console.log(form_data)

        $.ajax({
            url: apiURL,
            data: form_data,
            type: "POST",
            dataType: 'json',
            success: function (res) {

                setTimeout(function () {
                    funSuccess && funSuccess(res);
                }, 1000);

                if (btn.length) {
                    btn.removeAttr("disabled");
                }
            },
            error: function () {
                ShowMsgError(gettext('服务端错误，请稍后再试'));
                if (btn.length) {
                    btn.removeAttr("disabled");
                }
            }
        });

    }
    return false;
}

function AjaxSubmitData(opts) {

    var apiURL = opts.apiURL;
    var arrData = opts.data || [];
    var sType = opts.type || "post";
    var ok = opts.onSuccess;

    if (!opts.silent) {
        ShowLoading(gettext('处理中...'));
    }

    $.ajax({
        url: apiURL,
        data: arrData,
        type: sType,
        dataType: 'json',
        success: function (res) {

            setTimeout(function () {
                ok && ok(res);
            }, 1000);

        },
        error: function () {
            ShowMsgError(gettext('服务端错误，请稍后再试'));
        }
    });
    return false;
}

function CloseAll() {
    layer.closeAll();
}

function CloseDialogX(itmCss) {
    var lyr = $("." + itmCss);
    if (lyr.length) {
        var index = lyr.attr("id").replace("layui-layer", "");

        layer.close(index);
    }

    return false;
}

var msgIndex;

function ShowMsg(options) {
    if ($("#dialog_alert").length > 0) {
        return;
    }

    var opts = options || {};
    var ms = opts.timer || 3000;
    var end = opts.end
    var icon = opts.icon;
    var msg = GetFmtMsg(icon, opts.msg);

    if ($("#dialog_msg").length > 0) {
        $("#dialog_msg").html(msg);

        setTimeout(function () {
            CloseLoading();
            end && end();
        }, ms);

        return;
    }


    msgIndex = layer.msg(msg, {time: ms, id: 'dialog_msg'}, function () {
        end && end();
    });
}

function ShowLoading(msg, ms, end) {
    ShowMsg({
        icon: 3,
        msg: msg,
        timer: ms,
        end: end
    });
}

function ShowMsgError(msg, ms, end) {
    ShowMsg({
        icon: 0,
        msg: gettext(msg),
        timer: ms,
        end: end
    });
}

function ShowMsgOK(msg, ms, end) {
    ShowMsg({
        icon: 1,
        msg: msg,
        timer: ms,
        end: end
    });
}

function GetFmtMsg(icon, msg) {
    var css = "";
    switch (icon) {
        case 0:
            css = "icon-close icon-large txt-error";
            break;
        case 1:
            css = "icon-check-circle icon-large txt-success";
            break;
        case 2:
            css = "icon-lock icon-large txt-lock";
            break;
        case 3:
            css = "icon-spin icon-spinner";
            break;

    }
    return "<i class='" + css + "'></i> " + msg;
}

function CloseLoading(ms) {
    if (ms && ms > 0) {
        setTimeout(function () {
            layer.close(msgIndex);
        }, ms);
    }
    else {
        layer.close(msgIndex);
    }
}

function Logout() {
    ShowLoading(gettext('正在退出...'), 5000);

    $.ajax({
        url: "/api/account/logout",
        type: "GeT",
        dataType: 'json',
        success: function (res) {
            clearAllCookie();

            if (res.result) {
                setTimeout(function () {
                    ShowMsgOK(gettext('账户已退出'), 3000, function () {
                        document.location = "/";
                    });
                }, 1000);
            }
            else {
                ShowMsgError(res.msg)
            }

        },
        error: function () {
            ShowMsgError(gettext('服务端错误，请稍后再试'));
        }
    });

    return false;
}

function AjaxDialog(url, cssName, isFixed, iWidth, loading) {
    var index;
    if (loading) {
        index = layer.load(2);
    }

    if (iWidth <= 100) iWidth = 960;

    $.get(url, function (html) {
        if (loading) {
            layer.close(index);
        }

        var winWd = $(window).width();
        var wd = winWd > iWidth ? iWidth : parseInt(winWd * 0.98);

        var mIndex = layer.open({
            type: 1,
            area: wd + 'px',
            skin: 'custom-skin', //样式类名
            closeBtn: 0, //不显示关闭按钮
            anim: 1,
            fixed: isFixed,
            shadeClose: false, //开启遮罩关闭
            content: html
        });

        $("#layui-layer" + mIndex).addClass(cssName);

        var tp = $("#layui-layer" + mIndex).css("top");

        if (parseInt(tp) < 0) {
            layer.style(mIndex, {top: '10px'});
        }

        $(window).resize(function () {
            var lyr = $("#layui-layer" + mIndex);
            if (lyr.length) {
                var winWd = $(window).width();
                var winHt = $(window).height();
                var wd = winWd > iWidth ? iWidth : parseInt(winWd * 0.98);
                var lt = (winWd - wd) / 2;
                var tp = (winHt - lyr.outerHeight()) / 2;
                if (tp < 0) tp = 10;
                if (lt < 0) lt = 10;


                layer.style(mIndex, {
                    width: wd + 'px',
                    left: lt + 'px',
                    top: tp + 'px'
                });

                setTimeout(function () {
                    var htNew = $(window).height();
                    var tpNew = (htNew - lyr.outerHeight()) / 2;
                    if (tpNew < 0) tpNew = 10;

                    layer.style(mIndex, {
                        top: tpNew + 'px'
                    });
                }, 50);
            }

        });

    }, "html");
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


function AjaxLoad(url) {
    ShowLoading(gettext('正在加载...'));
    return false;
}


var timer1;
var objBtn1;
var msTimer1 = 0;
var isAvailable = true;

function TimerCreate(btn, mSecond) {
    if (!isAvailable) {
        clearInterval(timer1);
    }
    isAvailable = false;
    objBtn1 = $(btn);
    msTimer1 = mSecond;
    objBtn1.data("timer", objBtn1.html());
    objBtn1.attr("disabled", true);

    TimerRun();
    timer1 = setInterval(function () {
        TimerRun();
    }, 1000);

}

function TimerRun() {
    if (msTimer1-- > 0) {
        $(objBtn1).html(msTimer1 + gettext('秒后可发送'));
    }
    else {
        $(objBtn1).html($(objBtn1).data("timer"));
        objBtn1.removeAttr("disabled");
        isAvailable = true;
        msTimer1 = 0;
        objBtn1 = null;
        clearInterval(timer1);
    }
}

function SendMsg(el) {
    if (isAvailable) {
        TimerCreate(el, 60);
    }
    return false;
}

function SendEmailMsg(el, email) {
    if (isAvailable) {
        TimerCreate(el, 60);

        ShowLoading(gettext('验证码正在发送中...'), 30000);

        $.ajax({
            url: "/api/account/send_email_captcha",
            type: "POST",
            cache: false,
            data: {
                'email': email,
                'csrfmiddlewaretoken': GetToKen()
            },
            dataType: 'json',
            success: function (res) {
                if (res.result) {
                    ShowMsgOK(gettext('验证码发送成功'))
                }
                else {
                    ShowMsgError(res.msg);
                }
            },
            error: function () {
                ShowMsgError(gettext('服务端错误，请稍后再试'));
            }
        });
    }
    return false;
}

function SendEmailMsgX(el, id) {
    var email = $(id).val();
    if (IsEmail(email)) {
        SendEmailMsg(el, email);
    }
    else {
        ShowMsgError(gettext('请输入有效的邮箱地址'));
    }

    return false;
}

function SendEmailConfirmation(el, id) {
    var email = $(id).val();
    if (IsEmail(email)) {
        SendEmailConfirmationMsg(el, email);
    }
    else {
        ShowMsgError(gettext('不是有效的邮箱地址'));
    }

    return false;
}

function SendEmailConfirmationMsg(el, email) {
    if (isAvailable) {
        TimerCreate(el, 60);

        ShowLoading(gettext('验证码正在发送中...'), 30000);

        $.ajax({
            url: "/api/account/send_email_confirmation",
            type: "POST",
            cache: false,
            data: {
                'email': email,
                'csrfmiddlewaretoken': GetToKen()
            },
            dataType: 'json',
            success: function (res) {
                if (res.result) {
                    ShowMsgOK(gettext('验证码发送成功'))
                }
                else {
                    ShowMsgError(res.msg);
                }
            },
            error: function () {
                ShowMsgError(gettext('服务端错误，请稍后再试'));
            }
        });
    }
    return false;
}

function SendMobiMsg(el, mobi) {
    if (isAvailable) {
        TimerCreate(el, 60);

        ShowLoading(gettext('验证码正在发送中...'), 30000);

        $.ajax({
            url: "/api/account/send_phone_captcha",
            type: "POST",
            cache: false,
            data: {
                'phone_number': mobi,
                'csrfmiddlewaretoken': GetToKen()
            },
            dataType: 'json',
            success: function (res) {
                if (res.result) {
                    ShowMsgOK(gettext('验证码发送成功'))
                }
                else {
                    ShowMsgError(res.msg);
                }
            },
            error: function () {
                ShowMsgError(gettext('服务端错误，请稍后再试'));
            }
        });
    }
    return false;
}

function SendMobiMsgX(el, id) {
    var mobi = $(id).val();

    if (IsMobile(mobi)) {
        SendMobiMsg(el, mobi)
    }
    else {
        ShowMsgError(gettext('请输入有效的手机号码'));
    }

    return false;
}

function ShowLocation() {
    AjaxDialog("dialog/language.html", "winLocation", true, 300, true);

    return false;
}

function Post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}

function ChangeLocation(lan) {
    CloseDialogX('winLocation');
    $.cookie('_language', lan, {expires: 3});
    var url = "/i18n/setlang/";
    var data = {'csrfmiddlewaretoken': $.cookie('csrftoken'), 'language': lan, 'next': ''};
    Post(url, data);
    return false;
}

function TimerGo(url, ms) {
    setTimeout(function () {
        document.location = url;
    }, ms);
}

function GoUserCenter(el) {
    var ths = $(el);
    var url = "user-mobile.html"
    var isMobi = $(window).width() < 767;
    if (isMobi) {
        url = "usercenter.html";
    }
    ths.attr("href", url);

    return true;
}

function GetToKen() {
    return $.cookie("csrftoken");
}

function FormatDate(d, f) {
    if (d === undefined)
        return "";

    var fmt = f || "yyyy-MM-dd";
    if (IsDate(d)) {
        return new Date(d).Format(fmt);
    }

    return d;
}

function IsNumber(s) {
    return s && s != "" && !isNaN(s);
}

function IsInteger(obj) {
    return typeof obj === 'number' && obj % 1 === 0
}

function FormatNum(s, fx) {
    var f = fx || 8;
    if (IsNumber(s)) {
        return parseFloat(s).toFixed(f);
    }

    return s;
}

function FormatCNY(s) {
    var rate = GetRate();
    if (IsNumber(s) && rate > 0) {
        return parseFloat(FormatNumX(parseFloat(s) * rate, 2))
    }

    return 0;
}

function GetRate() {
    var r = GetItem("cny_rate");
    if (IsNumber(r)) {
        return parseFloat(r);
    }

    return 0;
}

function FormatNumX(s, fx) {
    return TrimZero(FormatNum(s, fx));
}

function TrimZero(s) {
    if (s && !isNaN(s) && s.indexOf('.') != -1) {
        var str = s.replace(/0+$/, "");
        if (str.length > 0) {
            var last = str.substr(str.length - 1);
            if (last == ".") {
                str += "0";
            }
        }

        return parseFloat(str);
    }

    return s;
}

function FormatMask(str, sLen, eLen) {
    var len = str.length;
    var s = str;

    if (len > sLen + eLen) {
        s = "";
        if (sLen > 0) {
            s = str.substr(0, sLen);
        }

        for (var i = 0; i < len - sLen - eLen; i++) {
            s += "*";
        }

        if (eLen > 0) {
            s += str.substr(len - eLen, eLen);
        }
    }

    return s;
}

function FormatMaskEmail(str, len) {
    if (str.indexOf("@") != -1) {
        var s1 = str.substring(0, str.indexOf("@"));
        var s2 = str.substring(s1.length);
        var len = parseInt(s1.length / 2);
        var s = FormatMask(s1, len, 0) + s2;

        return s;
    }

    return str;
}

function IsEmpty(s) {
    return (!s || s.length == 0 || s.replace(/\s+/, "").length == 0);
}

function IsEmail(s) {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(s);
}

function IsMobile(s) {
    var reg = /^1\d{10}$/;
    return reg.test(s);
}

function IsDate(s) {
    var d = new Date(s)
    return !isNaN(d);
}

function GetStatusName(ft, st) {
    var fs = siteConfig.finance_type;
    var ss;
    for (var i in fs) {
        if (fs[i].code == ft) {
            ss = siteConfig[fs[i].id];
        }
    }
    for (var i in ss) {
        if (ss[i].code == st) {
            return ss[i].name;
        }
    }
}

function GetExplorer(cointype, txid) {
    var ct = siteConfig.coin_type;
    for (var i in ct) {
        if (ct[i].coin_id == cointype && typeof(ct[i].explorer) == "string") {
            return ct[i].explorer.format({"txid": txid});
        }
    }
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                }
                else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
}
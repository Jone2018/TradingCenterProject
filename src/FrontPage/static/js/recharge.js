function PageInit() {
    $(".mm-fmcenter a").addClass("active");
}

var curr_coin_type;
var amount_avaible = 0.0;

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
                $("#fnAmountCNY").html(Math.round(cny));
            }
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

function CoinIn(id) {
    curr_coin_type = id;

    var itm = $("#sitem" + id);
    $(".titem-qr").hide();
    if (itm.hasClass("open")) {
        itm.removeClass("open");
        itm.hide();
    }
    else {
        $(".titem-qr").removeClass("open");
        itm.addClass("open");
        itm.slideDown("fast");

        var td = itm.find("td");
        td.html("<div class='page-loading'><i class='icon-spin icon-spinner'><i> " + gettext('正在加载...') + "<div>");

        $.getJSON("/api/finance/get_coin_address", {
            coin_type: id
        }, function (res) {
            //console.log(res);

            if (res.result && res.data && res.data.address) {
                var html = '<div class="clearfix qritem"><span class="qrspan"></span><span class="qrinfo">' + gettext('请将币转入到这个地址') + ' <span class="txt-red">' + res.data.address + '</span> </span></div>';
                td.html(html);

                var span = td.find(".qrspan");
                var qrcode = new QRCode(span[0], {
                    width: 100,
                    height: 100
                });
                qrcode.makeCode(res.data.address);
            }
            else {
                var msg = res.msg || gettext('加载失败，请重试');
                td.html(msg);
            }
        });

    }
}

var FeeWithdraw = 0;

function CoinToBTC(id, onSuccess) {
    curr_coin_type = id;

    var url = "dialog/coinbtc.html?.rnd=" + new Date().getTime();
    var isFixed = $(window).width() > 767;

    NewDialog({
        url: url,
        name: "winBtc",
        isFixed: isFixed,
        width: 960,
        onSuccess: function () {


            $("#frmDialogBTC input[name='coin_type']").val(id);
            $("#frmDialogBTC input[name='email']").val(GetItem("email"));
            $("#frmDialogBTC input[name='phone_number']").val(GetItem("phone_number"));

            $.getJSON("/api/finance/cointype_property", {coin_type: id}, function (res) {
                if (res.result) {
                    var withdraw_fee = res.data.withdraw_fee;//	提现手续费
                    var single_limit = res.data.single_limit;//	float	单笔限额
                    var day_limit = res.data.day_limit;//	float	单日限额
                    var low_limit = res.data.low_limit;//

                    FeeWithdraw = parseFloat(withdraw_fee);

                    $(".withdraw_fee").html(FormatNumX(withdraw_fee, 8));
                    $(".single_limit").html(FormatNumX(single_limit, 8));
                    $(".day_limit").html(FormatNumX(day_limit, 8));
                    $(".low_limit").html(FormatNumX(low_limit, 8));

                    BindCoinToBTC(parseFloat(low_limit), parseFloat(single_limit), onSuccess);
                }
            });

            var code = GetCoinType(id, "code");
            $(".CoinCode").html(code);


            $.ajax({
                url: "/api/finance/get_fund",
                data: {
                    coin_type: id
                },
                cache: false,
                type: "get",
                dataType: 'json',
                success: function (res) {
                    //console.log(res);
                    var html = GetFundRows(res);
                    $("#tb-funds").html(html);
                },
                error: function () {
                    ShowMsgError(gettext('服务端错误，请稍后再试'));
                }
            });
        }
    });
}

function CoinBTCAdd(id) {
    var type_id = id || curr_coin_type;
    var url = "dialog/coinbtc-add.html?.rnd=" + new Date().getTime();
    var isFixed = ($(window).width() > 767);

    NewDialog({
        url: url,
        name: "winBtcAdd",
        isFixed: isFixed,
        width: 960,
        onSuccess: function () {
            BindCoinAdd();

            $("#frmDialogAdd input[name='coin_type']").val(type_id);
            $("#frmDialogAdd input[name='email']").val(GetItem("email"));
            $("#frmDialogAdd input[name='phone_number']").val(GetItem("phone_number"));

        }
    });

    return false;
}

function CoinBTCList(id) {
    var type_id = id || curr_coin_type;

    var url = "dialog/coinbtc-list.html?.rnd=" + new Date().getTime();
    var isFixed = ($(window).width() > 767);

    NewDialog({
        url: url,
        name: "winBtcList",
        isFixed: isFixed,
        width: 960,
        onSuccess: function () {
            $.ajax({
                url: "/api/finance/get_address_list",
                data: {
                    coin_type: type_id
                },
                cache: false,
                type: "get",
                dataType: 'json',
                success: function (res) {
                    //console.log(res);

                    var html = GetBTCAddr(res);
                    $("#btcAddrList").html(html);
                },
                error: function () {
                    ShowMsgError(gettext('服务端错误，请稍后再试'));
                }
            });
        }
    });

    return false;
}

function RefreshBTCAddrList(coin_type) {
    var id = coin_type || curr_coin_type;

    if ($("#btcAddrList").length > 0) {
        $.ajax({
            url: "/api/finance/get_address_list",
            data: {
                coin_type: id
            },
            cache: false,
            type: "get",
            dataType: 'json',
            success: function (res) {
                //console.log(res);

                var html = GetBTCAddr(res);
                $("#btcAddrList").html(html);
            },
            error: function () {
                ShowMsgError(gettext('服务端错误，请稍后再试'));
            }
        });
    }
}

function CoinOut(id, onSuccess) {
    curr_coin_type = id;

    var url = "dialog/coinout.html?.rnd=" + new Date().getTime();
    var isFixed = ($(window).width() > 767);

    NewDialog({
        url: url,
        name: "winCoinOut",
        isFixed: isFixed,
        width: 960,
        onSuccess: function () {
            BindBTCOut(onSuccess);

            $("#frmDialogOut input[name='coin_type']").val(id);

            $.ajax({
                url: "/api/finance/get_fund",
                data: {
                    coin_type: id
                },
                cache: false,
                type: "get",
                dataType: 'json',
                success: function (res) {
                    //console.log(res);

                    var html = GetFundRows(res);
                    $("#tb-funds").html(html);
                },
                error: function () {
                    ShowMsgError(gettext('服务端错误，请稍后再试'));
                }
            });
        }
    });

    return false;
}

function ChangeBTC(el, id) {
    var amount = $(el).val();
    if (!isNaN(amount) && parseFloat(amount) > 0) {
        amount = parseFloat(amount);
        var avai = parseFloat(amount_avaible);
        if (amount > avai) {
            if (amount > avai) {
                amount = avai;
            }

            /*if(amount > 10.0)
            {
                amount = 10.0;	
            }*/

            $(el).val(amount);
        }

        /*if(amount < 0.01)
        {
            amount = 0.01;
            $(el).val(amount);
        }*/

        var btc = TrimZero((parseFloat(amount) - FeeWithdraw).toFixed(8));
        if (!isNaN(btc)) {
            $(id).val(btc);
        }
    }
}

function SendMsgX(el, frm) {
    var type = $(frm).find("input[name='captcha_type']:checked").val();
    //console.log(type);
    if (type == "email") {
        SendEmailMsg(el, GetItem("email"));
    }
    else if (type == "phone") {
        SendMobiMsg(el, GetItem("phone_number"));
    }

    return false;
}

function GetFundRows(res) {
    var html = "";
    if (res && res.data) {
        var item = res.data;
        var available = FormatNumX(item.available, 8);
        var frozen = FormatNumX(item.frozen, 8);
        var unconfirm = FormatNumX(item.unconfirm, 8);
        var total = FormatNumX(parseFloat(available) + parseFloat(frozen) + parseFloat(unconfirm), 8);

        amount_avaible = available;

        $("#CoinAvailable").html(available);

        var coin_type = item.coin_type;
        var code = GetCoinType(coin_type, "code");
        var name = GetCoinType(coin_type, "fname");

        html += '<tr class="titem">';
        html += '<td class="sname">' + code + '</td>';
        html += '<td class="name hidden-xs">' + name + '</td>';
        html += '<td class="amount-liv">' + available + '</td>';
        html += '<td class="amount-smt">' + frozen + '</td>';
        html += '<td class="amount-cfm">' + unconfirm + '</td>';
        html += '<td class="amount-ttl hidden-xs">' + total + '</td>';
        html += "</tr>";
    }

    return html;
}


function GetBTCAddr(res) {
    var html = "";
    if (res && res.data && res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
            var item = res.data[i];
            var lbl = item.label;
            var addr = item.address;
            var isVer = item.is_verified;

            html += '<li class="item col-lg-4 col-md-4 col-sm-4 col-xs-12" id="btcItem' + i + '">';
            html += '<div class="item-box" onclick="CheckBtcList(' + i + ')">';
            html += '<div class="tl clearfix"><span class="fl">' + lbl + '</span>';
            html += '<span class="fr">&nbsp;<a href="#" onClick="return DeleteBTCAddr(\'' + lbl + '\')"><i class="icon icon-trash"></i></a></span>';

            if (isVer) {
                html += '<span class="fr txt-orange">' + gettext("已认证") + '</span>';
            }

            html += '</div><div class="addr">' + addr + '</div>';
            html += '</div>';
            html += '</li>';
        }
    }
    return html;
}

function DeleteBTCAddr(lbl) {
    layer.confirm(gettext("请确认是否要删除提币地址") + "[" + lbl + "]?", {icon: 3, title: gettext('删除提示')}, function (index) {
        var api = "/api/finance/del_wdr_addr";

        AjaxSubmitData({
            apiURL: api,
            data: {
                label: lbl,
                csrfmiddlewaretoken: GetToKen()
            },
            type: "post",
            onSuccess: cbAddrDelete
        });

        layer.close(index);
    });
}

function cbAddrDelete(res) {
    if (res.result && res.data && res.data.status == 1) {
        var msg = res.msg || gettext("处理成功");
        ShowMsgOK(msg, 3000, function () {

        });

        RefreshBTCAddrList(curr_coin_type);

    }
    else {
        ShowMsgError(res.msg);
    }
}

function CheckBtcList(id) {
    var itm = $("#btcItem" + id);
    $(".btc-list .active").removeClass("active");
    if (itm.length) {
        itm.find(".item-box").addClass("active");
    }

    $("#frmDialogList input[name='id']").val(id);
}

function ActBtcList() {
    var id = $("#frmDialogList input[name='id']").val();
    var itm = $("#btcItem" + id);
    var addr = itm.find(".addr").html();

    $("#CoinBTCAddr").html(addr);
    $("#coinaddr").val(addr);

    CloseDialogX('winBtcList');
}

function NewDialog(options) {
    ShowLoading(gettext('正在加载...'));

    var opts = options || {};
    var url = opts.url;
    var cssName = opts.name;
    var isFixed = opts.isFixed;
    var iWidth = opts.width || 960;
    var onSuccess = opts.onSuccess;

    $.get(url, function (html) {

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

        onSuccess && onSuccess();

        CloseLoading();

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

function BindBTCOut(cbSuccess) {
    $('#frmDialogOut').bootstrapValidator({
        //        live: 'disabled',
        message: gettext('请输入一个有效的值'),
        feedbackIcons: {
            valid: ' ',
            invalid: ' ',
            validating: ' '
        },
        fields: {
            uid:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入对方UID')
                        }
                    }
                },
            trade_password:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入交易密码')
                        },
                        stringLength: {
                            min: 6,
                            max: 6,
                            message: gettext('请输入6位数交易密码')
                        }
                    }
                },
            email_or_phone:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入对方邮箱/手机号码')
                        }
                    }
                },
            quantity:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入转账数量')
                        },
                        numeric: {
                            message: gettext('请输入有效的转账数量')
                        }
                    }
                }
        },
        onSuccess: function () {
            var s = $("#frmDialogOut input[name='email_or_phone']").val();
            var email = $("#frmDialogOut input[name='email']");
            var phone = $("#frmDialogOut input[name='phone_num']");
            var iFlag = true;
            if (IsEmail(s)) {
                email.val(s);
            }
            else if (IsMobile(s)) {
                phone.val(s);
            }
            else {
                iFlag = false;
            }

            if (iFlag) {
                AjaxSubmit('#frmDialogOut', "/api/finance/transfer", function (res) {
                    cbCoinOut(res);
                    cbSuccess && cbSuccess();
                });
            }
            else {
                ShowMsgError(gettext('请输入有效的邮箱/手机号码'));
            }

            $("#frmDialogOut").data("bootstrapValidator").resetForm();

        }
    });
}

function cbCoinOut(res) {
    //console.log(res);
    if (res.result && res.data && res.data.status == 1) {
        var msg = res.msg || gettext('转帐成功');

        ShowMsgOK(msg, 3000, function () {
            CloseDialogX('winCoinOut');
        });


    }
    else {
        ShowMsgError(res.msg);
    }

    var email = $("#frmDialogOut input[name='email']");
    var phone = $("#frmDialogOut input[name='phone_num']");
    email.val("");
    phone.val("");
}

function BindCoinToBTC(lMin, lMax, cbSuccess) {
    $('#frmDialogBTC').bootstrapValidator({
        //        live: 'disabled',
        message: gettext('请输入一个有效的值'),
        feedbackIcons: {
            valid: ' ',
            invalid: ' ',
            validating: ' '
        },
        fields: {
            captcha:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入收到的验证码')
                        }
                    }
                },
            amount:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入转账数量')
                        },
                        numeric: {
                            message: gettext('请输入有效的转账数量')
                        },
                        between: {
                            min: lMin,
                            max: lMax,
                            inclusive: true,
                            message: gettext('提币金额为') + lMin + '-' + lMax + gettext('之间')
                        }
                    }
                }
        },
        onSuccess: function () {
            var addr = $("#coinaddr").val();
            if (!IsEmpty(addr)) {
                AjaxSubmit('#frmDialogBTC', "/api/finance/withdraw", function (res) {
                    cbCoinToBTC(res);
                    cbSuccess && cbSuccess();
                });
            }
            else {
                ShowMsgError(gettext('请选择提现地址'));
            }
            $("#frmDialogBTC").data("bootstrapValidator").resetForm();
        }
    });
}

function cbCoinToBTC(res) {
    //console.log(res);
    if (res.result && res.data && res.data.status == 1) {
        var msg = res.msg || gettext('提币成功');

        ShowMsgOK(msg, 3000, function () {
            CloseDialogX('winBtc');
        });

    }
    else {
        ShowMsgError(res.msg);
    }
}

function BindCoinAdd() {
    $('#frmDialogAdd').bootstrapValidator({
        //        live: 'disabled',
        message: gettext('请输入一个有效的值'),
        feedbackIcons: {
            valid: ' ',
            invalid: ' ',
            validating: ' '
        },
        fields: {
            captcha:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入收到的验证码')
                        }
                    }
                },
            address:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入提币地址')
                        }
                    }
                },
            label:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入标签')
                        }
                    }
                }
        },
        onSuccess: function () {

            var form_data = {};
            var items = $('#frmDialogAdd').serializeArray();
            var flag = false;
            $.each(items, function () {
                if (this.name == "is_verified") {
                    flag = true;
                }
                form_data[this.name] = this.value;
            });
            if (!flag) {
                form_data["is_verified"] = 0;
            }
            form_data["csrfmiddlewaretoken"] = GetToKen();
            AjaxSubmitData({
                apiURL: "/api/finance/add_address",
                type: "POST",
                data: form_data,
                onSuccess: cbCoinAdd
            });

            $("#frmDialogAdd").data("bootstrapValidator").resetForm();
        }
    });
}

function TestAPI(addr, lbl, captcha) {
    $.ajax({
        url: '/api/finance/add_address',
        type: 'POST',
        dataType: 'json',
        data: {
            'coin_type': 1,
            'address': addr,
            'label': lbl,
            'captcha': captcha,
            'captcha_type': "phone",
            'email': GetItem("email"),
            'phone_number': GetItem('phone_number'),
            'csrfmiddlewaretoken': $.cookie('csrftoken')
        },
        success: function (res) {
            //console.log(res);
        }
    });
}

function cbCoinAdd(res) {
    //console.log(res);
    if (res.result && res.data && res.data.status == 1) {
        RefreshBTCAddrList();

        var msg = res.msg || gettext('地址添加成功');

        ShowMsgOK(msg, 3000, function () {
            CloseDialogX('winBtcAdd');
        });

    }
    else {
        ShowMsgError(res.msg);
    }
}
function PageInit() {
    $(".mm-ucenter a").addClass("active");
}


function ShowAdd() {
    var url = "dialog/api-add.html?.rnd=" + new Date().getTime();
    var winWD = $(window).width();
    var isFixed = (winWD > 767);
    var wd = winWD > 320 ? 480 : winWD * 0.95;

    NewDialog({
        url: url,
        name: "winAdd",
        isFixed: isFixed,
        width: wd,
        onSuccess: function () {
            BindAdd();

            $.getJSON("/api/account/get_api_permission_list", {}, function (res) {
                //console.log(res);
                var cbGroups = GetRBGroups(res);
                //console.log(cbGroups);
                $("#permissionBox").html(cbGroups);
                $("input[name='permission']:eq(0)").attr("checked", true);
            });

            $("#frmDialogAdd input[name='phone_number']").val(GetItem("phone_number"));
        }
    });

    return false;
}

function ShowDel(id) {
    var url = "dialog/api-delete.html?.rnd=" + new Date().getTime();
    var winWD = $(window).width();
    var isFixed = (winWD > 767);
    var wd = winWD > 320 ? 480 : winWD * 0.95;

    NewDialog({
        url: url,
        name: "winDel",
        isFixed: isFixed,
        width: wd,
        onSuccess: function () {
            BindDel();

            var cmt = $("#api" + id).find(".lbl").text();

            $("#fldComment").text(cmt);
            $("#frmDialogDel input[name='id']").val(id);
            $("#frmDialogDel input[name='phone_number']").val(GetItem("phone_number"));
        }
    });

    return false;
}

function BindDel() {
    $('#frmDialogDel').bootstrapValidator({
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
            AjaxSubmit('#frmDialogDel', "/api/account/delete_api_key_pair", cbApiDel);
            $("#frmDialogDel").data("bootstrapValidator").resetForm();
        }
    });
}

function cbApiDel(res) {
    //console.log(res);
    if (res.result && res.data && res.data.status == 1) {
        var msg = res.msg || gettext('删除成功');

        ShowMsgOK(msg, 3000, function () {
            CloseDialogX('winDel');
        });
    }
    else {
        ShowMsgError(res.msg);
    }
}

function ShowView(id) {
    var url = "dialog/api-view.html?.rnd=" + new Date().getTime();
    var winWD = $(window).width();
    var isFixed = (winWD > 767);
    var wd = winWD > 320 ? 480 : winWD * 0.95;

    NewDialog({
        url: url,
        name: "winView",
        isFixed: isFixed,
        width: wd,
        onSuccess: function () {
            BindView();

            $("#frmDialogView input[name='id']").val(id);
            $("#frmDialogView input[name='phone_number']").val(GetItem("phone_number"));
        }
    });

    return false;
}

function ShowUpdate(id) {
    var url = "dialog/api-update.html?.rnd=" + new Date().getTime();
    var winWD = $(window).width();
    var isFixed = (winWD > 767);
    var wd = winWD > 320 ? 480 : winWD * 0.95;

    NewDialog({
        url: url,
        name: "winUpdate",
        isFixed: isFixed,
        width: wd,
        onSuccess: function () {
            BindUpdate();

            $.getJSON("/api/account/get_api_permission_list", function (res) {

                var cbGroups = GetRBGroups(res);
                $("#permissionBox").html(cbGroups);

                $.getJSON("/api/account/get_api_list", function (aRes) {
                    //console.log(aRes);
                    if (aRes.result && aRes.data) {
                        for (var i = 0; i < aRes.data.length; i++) {
                            var itm = aRes.data[i];
                            if (itm.id == id) {
                                $("#fldComment").html(itm.comment);
                                InitPermission(itm.permission);
                            }
                        }
                    }
                });


            });

            $("#frmDialogUpdate input[name='id']").val(id);
            $("#frmDialogUpdate input[name='phone_number']").val(GetItem("phone_number"));
        }
    });

    return false;
}

function BindView() {
    $('#frmDialogView').bootstrapValidator({
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

            var form_data = {};
            var item = $('#frmDialogView').serializeArray();
            $.each(item, function () {
                form_data[this.name] = this.value;
            });
            form_data["csrfmiddlewaretoken"] = GetToKen();

            AjaxSubmitData({
                apiURL: "/api/account/get_api_detail",
                data: form_data,
                type: 'POST',
                onSuccess: cbApiView
            });


            $("#frmDialogView").data("bootstrapValidator").resetForm();
        }
    });
}

function cbApiView(res) {
    //console.log(res);
    if (res.result) {
        var itm = res.data;

        $("#fldComment").html(itm.comment);
        $("#fldKey").html(itm.key);
        $("#fldSecret").html(itm.secret);
        $("#fldPermission").html(itm.permission);
        $("#fldCreateAt").html(itm.create_at);

        $(".item-chk").hide();
        $(".item-view").show();

    }
    else {
        ShowMsgError(res.msg);
    }
}

function InitPermission(p) {
    if (p) {
        var arr = p.split(",");
        var lbls = $("#permissionBox").find("input");
        for (var i = 0; i < lbls.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if ($(lbls[i]).data("title") == arr[j]) {
                    $(lbls[i]).attr("checked", true);
                }
            }
        }

    }
}

function BindUpdate() {
    $('#frmDialogUpdate').bootstrapValidator({
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
            AjaxSubmit('#frmDialogUpdate', "/api/account/update_api_info", cbApiUpdate);
            $("#frmDialogUpdate").data("bootstrapValidator").resetForm();
        }
    });
}

function cbApiUpdate(res) {
    //console.log(res);
    if (res.result && res.data && res.data.status == 1) {
        var msg = res.msg || gettext('修改成功');

        ShowMsgOK(msg, 3000, function () {
            CloseDialogX('winUpdate');
        });
    }
    else {
        ShowMsgError(res.msg);
    }
}


function GetRBGroups(res) {
    var s = "";
    if (res.result && res.data) {
        for (var i = 0; i < res.data.length; i++) {
            s += "<label><input type='radio' name='permission' value='" + res.data[i].id + "' data-title='" + res.data[i].name + "' />" + res.data[i].name + "</label>";
        }
    }

    return s;
}

function BindAdd() {
    $('#frmDialogAdd').bootstrapValidator({
        //        live: 'disabled',
        message: gettext('请输入一个有效的值'),
        feedbackIcons: {
            valid: ' ',
            invalid: ' ',
            validating: ' '
        },
        fields: {
            comment:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入备注名')
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
            AjaxSubmit('#frmDialogAdd', "/api/account/create_api_key_pair", cbApiAdd);
            $("#frmDialogAdd").data("bootstrapValidator").resetForm();
        }
    });
}

function cbApiAdd(res) {
    //console.log(res);
    if (res.result && res.data && res.data.status == 1) {
        var msg = res.msg || gettext('申请已提交');

        ShowMsgOK(msg, 3000, function () {
            CloseDialogX('winAdd');
        });
    }
    else {
        ShowMsgError(res.msg);
    }
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


function SendMsgX(el) {
    SendMobiMsg(el, GetItem("phone_number"));

    return false;
}
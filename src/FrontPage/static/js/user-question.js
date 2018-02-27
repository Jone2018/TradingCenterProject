function PageInit() {
    $(".mm-ucenter a").addClass("active");

    $(".rbox a").click(function () {
        var ths = $(this);
        var id = ths.data("id");
        var nm = ths.data("name");

        $("input[name='" + nm + "']").val(id);
        $("a[data-name='" + nm + "']").removeClass("checked");
        ths.addClass("checked");

        return false;
    });

    $('#frmAction').bootstrapValidator({
        //        live: 'disabled',
        message: gettext('请输入一个有效的值'),
        feedbackIcons: {
            valid: ' ',
            invalid: ' ',
            validating: ' '
        },
        fields: {
            content:
                {
                    validators: {
                        notEmpty: {
                            message: gettext('请输入的您遇到的问题')
                        }
                    }
                }
        },
        onSuccess: function () {
            AjaxSubmit('#frmAction', "/api/question/create_question", cbSuccess);

            $("#frmAction").data("bootstrapValidator").resetForm();
        }
    });
}


function cbSuccess(res) {
    //console.log(res);
    if (res.result) {
        var msg = res.msg || gettext('工单已提交成功');
        ShowMsgOK(msg, 3000, function () {
            document.location = "user-question-list.html";
        });
    }
    else {
        ShowMsgError(res.msg);
    }
}
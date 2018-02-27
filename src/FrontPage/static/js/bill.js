function PageInit() {
    $(".mm-fmcenter a").addClass("active");

}


function CreateDSPairCodes() {
    var items = [];
    if (siteConfig && siteConfig.pair_choice) {
        for (var i = 0; i < siteConfig.pair_choice.length; i++) {
            var itm = siteConfig.pair_choice[i];
            var name = GetCoinType(itm["coin_type_b"], "fname")
            items.push({
                id: itm.code,
                name: name
            });

        }
    }

    return items;
}

function CancelOrder(id, onSuccess) {
    if (!id) return false;

    var data = {
        id: id,
        csrfmiddlewaretoken: GetToKen()
    };

    layer.confirm(gettext("请确认是否要撤消提币") + "[" + id + "]?", {icon: 3, title: gettext('撤消提示')}, function (index) {
        ShowLoading(gettext("正在撤消..."));
        AjaxSubmitData({
            apiURL: "/api/finance/cancel_withdraw",
            data: data,
            type: "post",
            onSuccess: onSuccess
        });

        //console.log(data);

        layer.close(index);
    });

    return false;
}

function cbCancelSuccess(res) {
    //console.log(res);
    if (res.result && res.data && res.data.status == 1) {
        var msg = res.msg || gettext("处理成功");
        ShowMsgOK(msg, 3000);
    }
    else {
        ShowMsgError(res.msg);
    }
}
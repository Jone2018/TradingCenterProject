function PageInit() {
    $(".mm-fmcenter a").addClass("active");

    /*
    $(".rbox a").click(function(){
        var ths = $(this);
        var id = ths.data("id");
        var nm = ths.data("name");

        $("input[name='" + nm + "']").val(id);
        $("a[data-name='" + nm + "']").removeClass("checked");
        ths.addClass("checked");

        return false;
    });*/

    var dEnd = new Date();
    var yyyy = dEnd.getFullYear() - 1;
    var mm = dEnd.getMonth();
    var dd = dEnd.getDate();

    var dStart = new Date(yyyy, mm, dd);

    $("#date_start").val(dStart.Format("yyyy-MM-dd hh:mm"));
    $("#date_end").val(dEnd.Format("yyyy-MM-dd hh:mm"));

    $(".date").each(function (index, element) {
        var ths = $(element);
        ths.datetimepicker({
            //format: 'yyyy-MM-dd hh:mm:ss',
            weekStart: 1,
            startView: 2,
            minView: 1,
            //startDate:"2015-01-01",
            //endDate:"",
            pickerPosition: "bottom-right",
            autoclose: true,
            language: "zh-CN"
        })
    });
}

function CreateDSCoinTypes(iAll) {
    var items = [];
    if (iAll) {
        items.push({
            id: -1,
            name: gettext('全部币种')
        });
    }

    if (siteConfig && siteConfig.coin_type) {
        for (var i = 0; i < siteConfig.coin_type.length; i++) {
            var itm = siteConfig.coin_type[i];
            items.push({
                id: itm.coin_id,
                name: itm.fname
            });
        }
    }
    return items;
}
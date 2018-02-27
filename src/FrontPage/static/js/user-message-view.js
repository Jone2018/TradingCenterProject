function PageInit() {
    $(".mm-ucenter a").addClass("active");
}

function MsgIsRead(id) {
    var ds = {message_id: id};
    var api = "/api/notice/isRead_messages";

    AjaxSubmitData({
        apiURL: api,
        data: ds,
        type: "get",
        silent: true,
        onSuccess: cbSuccess
    });

    return false;
}

function cbSuccess(res) {

}
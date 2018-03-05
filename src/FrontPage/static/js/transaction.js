var last_trade_price = 0;

function PageInit(){

    $(".mm-transaction  > a").addClass("active");
    $(".nav-main").addClass("line-sd");
	
	HSInit();
	
	/*$(".tb-cate tr").click(function(){
		var tr = $(this);
		var nm = tr.find(".nm").text();
		$(".btc_typename").html(nm);
		
		var index = layer.load(2);
		$(".tb-cate .active").removeClass("active");
			tr.addClass("active");
		setTimeout(function(){
			layer.close(index);
		},3000);
	});
	
	$(".cate-dd li a").click(function(){
		var ths = $(this);
		var nm = ths.html();
			$("#dd-cointype").html(nm);
			$(".cate-dd li.active").removeClass("active");
			ths.parent().addClass("active");
	});*/

	
	$(".tabs a").click(function(){
		
		var rel = $(this).data("rel");
		
			TabTGR(rel);
		
		return false;
	})
	
	TGSize();
	
	$(window).resize(function(){
		TGSize();
	});
}

function ChangeCNYBuy()
{
		var price = $("#buyPrice").val();
		var amount = $("#buyAmount").val();
		var cnyBuy = $("#cnyBuyPrice");
		var cnyAmount = $("#cnyBuyAmount");
		if(IsNumber(price))
		{
			cnyBuy.html("¥" + FormatCNY(price))
		}
		else
		{
			cnyBuy.html("")
		}

		if(IsNumber(amount))
		{
			cnyAmount.html("¥" + FormatCNY(amount))
		}
		else
		{
			cnyAmount.html("")
		}
}

function ChangeCNYSell()
{
		var price = $("#sellPrice").val();
		var amount = $("#sellAmount").val();
		var cnyBuy = $("#cnySellPrice");
		var cnyAmount = $("#cnySellAmount");
		if(IsNumber(price))
		{
			cnyBuy.html("¥" + FormatCNY(price))
		}
		else
		{
			cnyBuy.html("")
		}

		if(IsNumber(amount))
		{
			cnyAmount.html("¥" + FormatCNY(amount))
		}
		else
		{
			cnyAmount.html("")
		}
}

function InitNewPrice(data)
{
	var newPrice = 0.0;
	if(data && data.length > 0)
	{
		var tdList = data[0];
		if(IsNumber(tdList[1]))
		{
			newPrice = parseFloat(tdList[1]);
		}
		
	}
	
	last_trade_price = newPrice;
	
	var s = "";
	if(newPrice > 0)
	{
		s = FormatNumX(last_trade_price,8);
	}
	
	//console.log(newPrice)
	
	$("#last-trade-price").data("val",newPrice).html(s);
	UpdateQtyBuyAndSell();
}

function UpdateNewPrice(data)
{
	/*
			"pair_code": 10001,
			"type": "page_data",
			"page_data": {
				"newest_price": 0.8570823617023372,
				"vol": 3627734,
				"chg": -0.9930318507178671
			}
			*/
			
	if(data && data.page_data )
	{	
		var price = data.page_data.newest_price;
		var pct = data.page_data.chg;
		var vol = data.page_data.vol;
		
		UpdateLastTradeVol(price,vol,pct);
	}
}

//更新买1，卖1，价格
function UpdateLastTradePrice(type,btcPrice)
{
	var price = FormatCNY(btcPrice);
	if(IsNumber(price) && price > 0)
	{
		price = "&yen;" + price;
	}
	else
	{
		price = "--";
	}
	
	if(type == "buy")
		{
			$("#mkBuyPrice").html(price);
		}
		else if(type == "sell")
		{
			$("#mkSellPrice").html(price);
		}
}

function SortSell(a,b)
{
	return a[0] - b[0];
}

function SortBuy(a,b)
{
	return b[0] - a[0];
}

function slice_depth(arr,isSell){
			var tmp = [];
			if(isSell)
			{
				arr.sort(SortSell);
			}
			else
			{
				arr.sort(SortBuy);
			}
			for (var i = 0; i < 30; i++) {
				if (arr[i]) {
					tmp.push(arr[i])
				}
			}
			return tmp;
}

function update_depth(DEPTH,action,isSell){
	//console.log(action);
	switch(action[0]){
		case 'INSERT':
			var tmp = [];
			for (var i = 0; i < DEPTH.length; i++){
				if (DEPTH[i][0] < action[1][0]) {
					tmp.push(DEPTH[i])
				}
			}
			tmp.push(action[1])
			for (var i = 0; i < DEPTH.length; i++){
				if (DEPTH[i][0] > action[1][0]) {
					tmp.push(DEPTH[i])
				}
			}
			return slice_depth(tmp,isSell);
		case 'DELETE':
			var tmp = [];
			for (var i = 0; i < DEPTH.length; i++){
				if (DEPTH[i][0] < action[1][0]) {
					tmp.push(DEPTH[i])
				}
			}
			for (var i = 0; i < DEPTH.length; i++){
				if (DEPTH[i][0] > action[1][0]) {
					tmp.push(DEPTH[i])
				}
			}
			if (action[3]){
				tmp.push(action[3])
			}
			return slice_depth(tmp,isSell);
		case 'MODIFY':
			var tmp = [];
			for (var i = 0; i < DEPTH.length; i++){
				if (DEPTH[i][0] < action[1][0] || DEPTH[i][0] > action[1][0]) {
					tmp.push(DEPTH[i])
				}
				else if (DEPTH[i][0] == action[1][0]) {
					// tmp.push(action[1])
					tmp.push([DEPTH[i][0], DEPTH[i][1] + action[1][1]])
				}
			}
			return slice_depth(tmp,isSell);
	}
	
	//console.log('New Depth Data: ', DEPTH)
	
	return DEPTH;
}


//更新买1，卖1，价格
function UpdateLastTradeVol(price,vols,chg)
{
	var pct;
	if(IsNumber(chg))
	{
		pct = (parseFloat(chg) * 100).toFixed(2) + "%";
	}
	else
	{
		pct = "--";	
	}
	
	var vol = vols;
	if(IsNumber(vol))
	{
		vol = parseFloat(vol).toFixed(2);
	}
	else
	{
		vol = "--";	
	}
	
	var newPrice = last_trade_price;
	if(IsNumber(price))
	{
		newPrice = parseFloat(price)
		
	}
	
	last_trade_price = newPrice;
	
	var s = "";
	if(newPrice > 0)
	{
		s = FormatNumX(last_trade_price,8);
	}
	
	//console.log(newPrice);
	
	$("#last-trade-price").data("val",newPrice).html(s);
	$("#mkVol").html(vol);
	$("#mkPercent").html(pct);
	
	UpdateQtyBuyAndSell();
}


function UpdateQtyBuyAndSell() {
    //获取最新成交价
    var newPrice = parseFloat(last_trade_price);
	var qtyBuy = "";
	var qtySell = "";
	
	var cnyBuy = "";
	var cnySell = "";
	
	if(newPrice > 0)
	{
		//获取btc余额
		var btc = $('#btc_available').data("val");
		
		//获取当前币种余额
		var coin = $('#coin_available').data("val");
		
		//可买当前币种数量
		if(IsNumber(btc))
		{
			qtyBuy = FormatNumX(parseFloat(btc) / 1.002 / newPrice);
			cnyBuy = FormatCNY(btc);
		}
		
		if(IsNumber(coin))
		{
			qtySell = FormatNumX(parseFloat(coin) * newPrice * 0.998);
			cnySell = FormatCNY(qtySell);
		}
	}
	
    $('#btc_qty_buy').html(qtyBuy);
    $('#coin_qty_sell').html(qtySell);
	
	$('#btc_cny_buy').html(cnyBuy);
	$('#coin_cny_sell').html(cnySell);
	
}

function AjaxUpdateAvailable(pair_code)
{
	InitAmount();
	
	var coin_type = GetPairCode(pair_code,"coin_type_b");
	//console.log(coin_type);
	$.ajax({
        url: '/api/finance/get_funds',
		 data:{ is_zero:1 },
		 cache:false,
        type: 'GET',
        dateType:'json',
        success: function (res) {
			//console.log("读取余额");
			//console.log(res);
            if (res.result) {
				for (var i = 0; i < res.data.length; i++) {
					var itm = res.data[i];
					var amount = FormatNumX(itm.available);
					if (itm.coin_type == "1") {
						$("#btc_available").data("val",amount).html(amount);
						$("#btc_available2").data("val",amount).html(amount);
					}
					
					if(itm.coin_type == coin_type)
					{
						$("#coin_available").data("val",amount).html(amount);
						$("#coin_available2").data("val",amount).html(amount);
					}
				}
            }
        }
    });
}

function InitAmount()
{
	$("#btc_available,#coin_available,#btc_available2,#coin_available2,#btc_qty_buy,#coin_qty_sell,#btc_cny_buy,#coin_cny_sell").html("");	
}

function ChangeCate(el)
{
	var tr = $(el);
	var nm = tr.find(".nm").text();
	var bcn = tr.find(".bcn").text();
	var code = tr.data("id");
	
		$(".coin_type_a").html(bcn);
    	$(".coin_type_b").html(nm);
		$(".tb-cate .active").removeClass("active");
		tr.addClass("active");
	var li = $("#mcate" + code);
	var txt = li.find("a").text();
		$("#dd-cointype").text(txt);
		$(".cate-dd .active").removeClass("active");
		li.addClass("active");
		
}

function ChangeCateCode(code)
{
	var tr = $("#cate" + code);
	var li = $("#mcate" + code);
	var txt = li.find("a").text();
	var name_b = GetPairCode(code,"name");
	var code_a = GetCoinType(GetPairCode(code,"coin_type_a"), "code");
	
		$(".coin_type_a").html(code_a);
    	$(".coin_type_b").html(name_b);
		$(".tb-cate .active").removeClass("active");
		tr.addClass("active");
		
		$("#dd-cointype").text(txt);
		$(".cate-dd .active").removeClass("active");
		li.addClass("active");
		
}

function TGSize()
{
	var frmKline = $("#frmKline");
	if($(window).width() < 992)
		{
			var rel = $(".tabs .active").length > 0 ? $(".tabs .active a").data("rel") : "buy";
			TabTGR(rel);
			/*
			if(frmKline.attr("src") != "blank.html")
			{
				frmKline.attr("src","blank.html");
			}
			*/
		}
		else
		{
			/*
			if(frmKline.attr("src") != "TradingView.html")
			{
				frmKline.attr("src","TradingView.html");
			}
			*/
			
			$(".tab-item").show();
			$(".form-buy,.form-sell").show();
		}
	
}

function TabTGR(rel)
{
	$(".tab-item").hide();
	$(".tabs .active").removeClass("active");
	$(".tabs a[data-rel='" + rel + "']").parent().addClass("active");
		
		switch(rel)
		{
			case "buy":
				$(".trade-box").show();
				$(".form-buy").show();
				$(".form-sell").hide();
				$("#btc-amount").addClass("visible-sm").addClass("visible-xs").show();
				$("#coin-amount").removeClass("visible-sm").removeClass("visible-xs").hide();
				$("#MarketLast").show();
				break;
			case "sell":
				$(".trade-box").show();
				$(".form-buy").hide();
				$(".form-sell").show();
				$("#coin-amount").addClass("visible-sm").addClass("visible-xs").show();
				$("#btc-amount").removeClass("visible-sm").removeClass("visible-xs").hide();
				$("#MarketLast").show();
				break;
			case "kline":
				$("#btc-amount").removeClass("visible-sm").removeClass("visible-xs").hide();
				$("#coin-amount").removeClass("visible-sm").removeClass("visible-xs").hide();
				$("#kline").show();
				break;
			case "orders":
				$("#btc-amount").removeClass("visible-sm").removeClass("visible-xs").hide();
				$("#coin-amount").removeClass("visible-sm").removeClass("visible-xs").hide();
				$("#OrdersList").show();
				break;
		}
}

function AjaxBuy(onSuccess)
{
	var form_data = {};
    var item = $('#form_buy').serializeArray();
    $.each(item, function () {
        form_data[this.name] = this.value;
    });
	form_data["csrfmiddlewaretoken"] = GetToKen();
	
	//console.log(form_data);

	var newPrice = last_trade_price;
	var qty = $("#form_buy input[name='quantity']")
	var price = $("#form_buy input[name='price']")
	
	if(qty.val() == "" || !IsNumber(qty.val()))
	{
		ShowMsgError(gettext('请输入有效的数量'));
		qty.focus();
	}
	else if(price.val() == "" || !IsNumber(price.val()))
	{
		ShowMsgError(gettext('请输入有效的价格'));
		price.focus();
	}
	else if (parseFloat(form_data['quantity']) <= 0.01) {
		ShowMsgError(gettext('下单数量必须大于0.01'));
		qty.focus();
    }
	else if (parseFloat(form_data['price']) <= 0) {
        ShowMsgError('下单价格必须大于0');
		price.focus();
    } else if (parseFloat(form_data['price']*form_data['quantity']) <= 0.000005) {
        ShowMsgError(gettext('交易金额必须大于0.000005'));
    } else if(parseFloat(form_data['price'])>parseFloat(FormatNumX(newPrice*1.1))){
		ShowPrompt(gettext("下单价格已超出最新成交价的10%，需要您输入交易密码进行确认。"),function(val){
			form_data['trade_pwd'] = val;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				BuyCallback(res);
				onSuccess && onSuccess(res);
			});
		});
		/*
        layer.prompt({
            title: gettext('下单价格已超出最新成交价的10%，需要您输入交易密码进行确认。'),
            formType: 1,
			 area:wdArea
        },function(value,index,elem){
			form_data['trade_pwd'] = value;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				BuyCallback(res);
				onSuccess && onSuccess(res);
			});
			
			layer.close(index);
		});*/

    } else if(parseFloat(form_data['price'])<parseFloat(FormatNumX(newPrice*0.9))){

		ShowPrompt(gettext("下单价格已低于最新成交价的10%，需要您输入交易密码进行确认"),function(val){
			form_data['trade_pwd'] = val;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				BuyCallback(res);
				onSuccess && onSuccess(res);
			});
		});


		/*
        layer.prompt({
            title: gettext('下单价格已低于最新成交价的10%，需要您输入交易密码进行确认。'),
            formType: 1,
			 area:wdArea
        },function(value,index,elem){
			form_data['trade_pwd'] = value;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				BuyCallback(res);
				onSuccess && onSuccess(res);
			});
			
			layer.close(index);
		});*/
		
    } else {
		AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				BuyCallback(res);
				onSuccess && onSuccess(res);
			});
    }
	
	return false;
}

function GetTradePwd()
{
	var s = '<form class="form-horizontal" id="frmPrompt" method="post" onSubmit="return false">';
      	s += '<div class="form-group">';
		s += '<label class="col-sm-3 control-label">'+gettext("交易密码")+'：</label>';
       s += '<div class="col-sm-8">';
	   s += '<input type="password" class="form-control fld-xs-block" name="trade_pwd" placeholder="'+gettext("请输入6位数字交易密码")+'" />';
       s += '</div>';
      s += '</div>';
	  s += '</form>';

	return s;
}

function ShowPrompt(title,success)
{
	var winWd = parseInt($(window).width());
	var wdArea = winWd > 767 ? "450px" : (winWd * 0.90) + "px";

	layer.open({
		title: title,
		area:wdArea,
		btn:["确定","取消"],
		content:GetTradePwd(),
		success:function(){
			$("#frmPrompt input[name='trade_pwd']").focus();
		},
		yes:function(index){
			var fld = $("#frmPrompt input[name='trade_pwd']");
			var val = fld.val();
			if(val.length == 6)
			{
				fld.removeClass("fld-error");
				layer.close(index);
				success && success(val);
			}
			else
			{
				fld.addClass("fld-error").focus();
			}
		},
		no:function(index){
			layer.close(index);
		}
	});
}

function BuyCallback(res)
{
	//console.log(res);
	var msg;
	if(res.result && res.data && res.data.status == 1)
	{
        msg = res.msg || gettext("已提交下单申请");
		ShowMsgOK(msg,3000,function(){
			
		});
	}
	else
	{
		msg = res.msg;
		ShowMsgError(msg);
	}
}

function AjaxSumitX(data,url,onSuccess){
	AjaxSubmitData({
		apiURL:url,
		data:data,
		type:'POST',
		onSuccess:onSuccess
	});
}

function AjaxSell(onSuccess)
{
	var form_data = {};
    var item = $('#form_sell').serializeArray();
    $.each(item, function () {
        form_data[this.name] = this.value;
    });
	form_data["csrfmiddlewaretoken"] = GetToKen();

	var newPrice = last_trade_price;
	
	var qty = $("#form_sell input[name='quantity']")
	var price = $("#form_sell input[name='price']")

	if(qty.val() == "" || !IsNumber(qty.val()))
	{
		ShowMsgError(gettext("请输入有效的数量"));
		qty.focus();
	}
	else if(price.val() == "" || !IsNumber(price.val()))
	{
		ShowMsgError(gettext("请输入有效的价格"));
		price.focus();
	}
	else if (parseFloat(form_data['quantity']) <= 0.01) {
		ShowMsgError(gettext("下单数量必须大于0.01"));
		qty.focus();
    }
	else if (parseFloat(form_data['price']) <= 0) {
        ShowMsgError(gettext("下单价格必须大于0"));
		price.focus();
    } else if (parseFloat(form_data['price']*form_data['quantity']) <= 0.000005) {
        ShowMsgError(gettext('交易金额必须大于0.000005'));
    } else if(parseFloat(form_data['price'])>parseFloat(FormatNumX(newPrice*1.1))){

		ShowPrompt("下单价格已超出最新成交价的10%，需要您输入交易密码进行确认",function(val){
			form_data['trade_pwd'] = val;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				SellCallback(res);
				onSuccess && onSuccess(res);
			});
		});
		/*
        layer.prompt({
            title: gettext('下单价格已超出最新成交价的10%，需要您输入交易密码进行确认。'),
            formType: 1,
			 area:wdArea
        },function(value,index,elem){
			form_data['trade_pwd'] = value;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				SellCallback(res);
				onSuccess && onSuccess(res);
			});
			
			layer.close(index);
		});*/

    } else if(parseFloat(form_data['price'])<parseFloat(FormatNumX(newPrice*0.9))){
		ShowPrompt(gettext("下单价格已低于最新成交价的10%，需要您输入交易密码进行确认"),function(val){
			form_data['trade_pwd'] = val;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				SellCallback(res);
				onSuccess && onSuccess(res);
			});
		});
		/*
        layer.prompt({
            title: gettext('下单价格已低于最新成交价的10%，需要您输入交易密码进行确认。'),
            formType: 1,
			 area:wdArea
        },function(value,index,elem){
			form_data['trade_pwd'] = value;
			AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				SellCallback(res);
				onSuccess && onSuccess(res);
			});
			
			layer.close(index);
		});*/
		
    } else {
		AjaxSumitX(form_data,"/api/trade/put_order",function(res) {
				SellCallback(res);
				onSuccess && onSuccess(res);
			});
    }
	
	return false;
}

function SellCallback(res)
{
	//console.log(res);
	
	var msg;
	if(res.result && res.data && res.data.status == 1)
	{
        msg = res.msg || gettext("已提交下单申请");
		ShowMsgOK(msg,3000,function(){
			
		});
	}
	else
	{
		msg = res.msg;
		ShowMsgError(msg);
	}
}




function CancelOrder(id,code,onSuccess)
{
	if(!id) return false;
	
	var data = {
				pair_code:code,
				order_id:id,
				csrfmiddlewaretoken:GetToKen()	
			};
			
		
    layer.confirm(gettext('请确认是否要撤消订单') + "[" + id + "]?", {icon: 3, title: gettext('撤消提示')}, function (index) {
        ShowLoading(gettext('正在撤消...'));
		AjaxSubmitData({
			apiURL : "/api/trade/cancel_order",
			data : data,
			type : "post",
			onSuccess : onSuccess
		});
		
		//console.log(data);
		
		layer.close(index);
	});        
	
	return false;
}


function cbCancelSuccess(res)
{
	//console.log(res);
	if(res.result && res.data && res.data.status==1)
	{
		var msg = res.msg || gettext('处理成功');
		ShowMsgOK(msg,3000);
	}
	else
	{
		ShowMsgError(res.msg);
	}
}
var weekDays = [
    gettext('周日'),
    gettext('周一'),
    gettext('周二'),
    gettext('周三'),
    gettext('周四'),
    gettext('周五'),
    gettext('周六')
];
var pageHSData = {
    values:[],
    vols:[],
    ma5:[],
    ma20:[]
};

function HSInit()
{
    if (GetItem('chart_time')) {
        $('#chart_time > a').removeClass('cur');
    } else {
        $('#chart_1h').addClass("cur").siblings().removeClass("cur");
        $('#chart_time > a').removeClass('cur');
        SetItem('chart_time', 60);
       $('#chart_1h').addClass('cur');
    }

    $("#hsTitle").html(GetHTName(GetItem('chart_time')));

    if (GetItem('chart_time_name')) {
        $('#' + GetItem('chart_time_name')).addClass('cur');
    } else {
        $('#chart_1h').addClass('cur');
        GetItem('chart_time_name', 'chart_1h');
    }

    $("#chart_time > a").click(function () {
        $(this).addClass("cur").siblings().removeClass("cur");

        SetItem('chart_time', $(this).attr('data-time'));
        SetItem('chart_time_name', $(this).attr('id'));

        var time = GetItem('chart_time');
        var code = GetItem("pair_code") || 10002;
		if(time < 0) time = 60;

        $("#hsTitle").html(GetHTName(time));

        SetTime(code,time);
    });


    if (GetItem('chart_theme') != 'black') {
        //console.log(GetItem('chart_theme'));

        SetItem('chart_theme', 'white');
        $('#chart_black').removeClass('cur');
        $('#chart_white').addClass('cur');
    } else {
        $('#chart_white').removeClass('cur');
        $('#chart_black').addClass('cur');
    }

    $('#chart_white').click(function () {
        SetItem('chart_theme', 'white');
        setTimeout(function(){
            document.location.reload();
        },1000);
    });
    $('#chart_black').click(function () {
        SetItem('chart_theme', 'black');
        //console.log(GetItem('chart_theme'));
        setTimeout(function(){
            document.location.reload();
        },1000);
    });

    $("#paint_chart").css("height","400px;");

    HighStockInit();
}

function GetHTName(ctime)
{
    var s="5分钟线";
    switch(ctime)
    {
        case "10080":
            s = gettext("周线");
            break;
        case "1440":
			s =  gettext("日线");
			break;
		case "720":
			s = "12" + gettext("小时线");
            break;
        case "240":
            s =  "4" + gettext("小时线");
            break;
        case "60":
            s =  "1" + gettext("小时线");
            break;
        case "30":
            s =  "30" + gettext("分钟线");
            break;
    }

    return s + " <i class='icon-caret-down'></i>";
}


function HighStockInit()
{
    var chartData = arguments;
    var height = 400;

    //console.log(GetItem('chart_theme'));

    Highcharts.theme = {
        colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
        chart: {
            backgroundColor: {
                linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                stops: [[0, '#2a2a2b'], [1, '#3e3e40']]
            }, style: {fontFamily: "'Unica One', sans-serif"}, plotBorderColor: '#606063'
        },
        title: {style: {color: '#E0E0E3', textTransform: 'uppercase', fontSize: '20px'}},
        subtitle: {style: {color: '#E0E0E3', textTransform: 'uppercase'}},
        xAxis: {
            gridLineColor: '#707073',
            labels: {style: {color: '#E0E0E3'}},
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
                title: {style: {color: '#A0A0A3'}},
				  dateTimeLabelFormats: {
						second: '%H:%M:%S',
						minute: '%H:%M',
						hour: '%H:%M',
						day: '%Y-%m-%d',
						week: '%Y-%m-%d',
						month: '%Y-%m',
						year: '%Y'
					}
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {style: {color: '#E0E0E3'}},
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {style: {color: '#A0A0A3'}}
        },
        tooltip: {backgroundColor: 'rgba(0, 0, 0, 0.85)', style: {color: '#F0F0F0'}},
        plotOptions: {
            series: {dataLabels: {color: '#B0B0B3'}, marker: {lineColor: '#333'}},
            boxplot: {fillColor: '#505053'},
            candlestick: {lineColor: 'white'},
            errorbar: {color: 'white'}
        },
        legend: {
            itemStyle: {color: '#E0E0E3'},
            itemHoverStyle: {color: '#FFF'},
            itemHiddenStyle: {color: '#606063'}
        },
        credits: {style: {color: '#666'}},
        labels: {style: {color: '#707073'}},
        drilldown: {activeAxisLabelStyle: {color: '#F0F0F3'}, activeDataLabelStyle: {color: '#F0F0F3'}},
        navigation: {buttonOptions: {symbolStroke: '#DDDDDD', theme: {fill: '#505053'}}},
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {color: '#CCC'},
                states: {
                    hover: {fill: '#707073', stroke: '#000000', style: {color: 'white'}},
                    select: {fill: '#000003', stroke: '#000000', style: {color: 'white'}}
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {backgroundColor: '#333', color: 'silver'},
            labelStyle: {color: 'silver'},
        },
        navigator: {
            handles: {backgroundColor: '#666', borderColor: '#AAA'},
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {color: '#7798BF', lineColor: '#A6C7ED'},
            xAxis: {gridLineColor: '#505053'}
        },
        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };

    if (GetItem('chart_theme') == 'black') {
        Highcharts.setOptions(Highcharts.theme);
    }

    var time = GetItem("chart_time") || 5;
    var selIndex = 2;
    if(time == "30" || time == "60")
    {
        selIndex = 3;
    }
    else if(time == "240")
    {
        selIndex = 3;
    }
			else if(time == "720" || time == "1440")
    {
        selIndex = 4
    }
    else if(time > 1440)
    {
        selIndex = 5;
    }

    Highcharts.setOptions({
        global: {useUTC: false},
        lang: {
            months: [
                gettext('一月'),
                gettext('二月'),
                gettext('三月'),
                gettext('四月'),
                gettext('五月'),
                gettext('六月'),
                gettext('七月'),
                gettext('八月'),
                gettext('九月'),
                gettext('十月'),
                gettext('十一月'),
                gettext('十二月')
            ],
            shortMonths: [
                gettext('一月'),
                gettext('二月'),
                gettext('三月'),
                gettext('四月'),
                gettext('五月'),
                gettext('六月'),
                gettext('七月'),
                gettext('八月'),
                gettext('九月'),
                gettext('十月'),
                gettext('十一月'),
                gettext('十二月')
            ],
            weekdays: [
                gettext('周日'),
                gettext('周一'),
                gettext('周二'),
                gettext('周三'),
                gettext('周四'),
                gettext('周五'),
                gettext('周六')
            ],
            thousandsSep: '',
            rangeSelectorZoom: gettext('范围')
        },
        rangeSelector: {
            buttons: [
                {type: 'minute', count: 60, text: '1h'},
                {type: 'minute', count: 720, text: '12h'},
                {type: 'day', count: 1, text: '1d' },
                {type: 'day', count: 7, text: '1w'},
                {type: 'day', count: 30, text: '1m' },
                {type: 'all', text: gettext('全部')}], selected: selIndex, inputEnabled: false
        },
        credits: {enabled: false},
    });

    //
    chartData.callee.chart = new Highcharts.StockChart({
        chart: {renderTo: 'paint_chart', animation: Highcharts.svg},
        title: {text: ""},
        yAxis: [{
            labels: {style: {color: '#e55600'}, x: 15, align: 'left'},
            title: {text: gettext('价格'), style: {color: '#e55600'}, margin: -10},
            offset: 0,
            height: height / 100 * 60,
            opposite: false,
            lineWidth: 2,
            gridLineDashStyle: 'Dash',
            showLastLabel: true
        }, {
            labels: {style: {color: '#4572A7'}, x: 15, align: 'left'},
            title: {text: gettext('成交量'), style: {color: '#4572A7'}, margin: -10},
            offset: 0,
            top: height / 100 * 70,
            height: height / 100 * 20,
            opposite: false,
            lineWidth: 2,
            gridLineDashStyle: 'Dash',
            showLastLabel: true
        }],
            xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					second: '%H:%M:%S',
					minute: '%H:%M',
					hour: '%H:%M',
					day: '%m月%d日',
					week: '%m月%d日',
					month: '%Y年%m月',
					year: '%Y年'
				}
			},
			navigator: {
                xAxis: {
						dateTimeLabelFormats: {
								second: '%Y-%m-%d<br/>%H:%M:%S',
								minute: '%Y-%m-%d<br/>%H:%M',
								hour: '%Y-%m-%d<br/>%H:%M',
								day: '%m月%d日',
								week: '%m月%d日',
								month: '%Y年%m月',
								year: '%Y年'
							}
					}
            },
        plotOptions: {candlestick: {color: 'rgb(229, 86, 0)', upColor: 'rgb(102, 153, 0)'}},
        tooltip: {
            crosshairs: [true, true],
            shared: true,
            useHTML:true,
            formatter: function () {
                var s = '<span style="border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:5px;display:block;" ><b>' + FormatTooltip(this.x) + '</b></span>';

                $.each(this.points, function (i) {
                    if(this.series.name == gettext("价格"))
                    {
                        s += gettext('开') + ': ' + this.point.open + '';
                        s += '<br/>' + gettext("高") + ': ' + this.point.high + '';
                        s += '<br/>' + gettext("低") + ': ' + this.point.low + '';
                        s += '<br/>' +  gettext("收") + ': ' + this.point.close + '';
                    }
                    else
                    {
								s += '<br/>' + this.series.name + ': ' + FormatNumX(parseFloat(this.y),8) + '';
                    }

                });

                return s;
            },
            xDateFormat: '%Y-%m-%d %H:%M %A',
            color: '#f0f',
                borderColor: '#058dc7'
        },
        series: [
            {
                animation: false,
                name: gettext('价格'),
                type: 'candlestick',
                data: []
            }, {
                animation: false,
                name: gettext('成交量'),
                type: 'column',
                color: '#4572A7',
                yAxis: 1,
                data: [],
                tooltip: {valueDecimals: 4}
            }, {
                animation: false,
                name: '05' + gettext('均线'),
                type: 'spline',
                color: '#FF00FF',
                data: [],
                threshold: null,
                lineWidth: 1,
                    tooltip: {valueDecimals: 8}
            }, {
                animation: false,
                name: '20' + gettext('均线'),
                type: 'spline',
                color: '#450fff',
                data: [],
                threshold: null,
                lineWidth: 1,
                    tooltip: {valueDecimals: 8}
            }]
    });
}

function FormatUTCDate(s,fmt)
{
    var utc = new Date(s * 1000);

    return FormatDate(utc,fmt);
}

function FormatTooltip(utcTime)
{
    var dt = new Date(utcTime);
    var tp = GetItem("chart_time") || 5;
    var s="";

    var yy = dt.getFullYear();
    var mm = PadLeft(dt.getMonth() + 1);
    var dd = PadLeft(dt.getDate());

    var hh = PadLeft(dt.getHours());
    var mn = PadLeft(dt.getMinutes());

    var ww = GetWeekName(dt.getDay());

    switch(tp.toString())
    {
        case "10080":
        case "1440":
            s = [ww,",",yy,gettext('年'),mm,gettext('月'),dd,gettext('日')].join('');
            break;
        case "240":
        case "60":
        case "30":
        case "5":
            s = [yy,gettext('年'),mm,gettext('月'),dd,gettext('日'),hh,":",mn].join('');
            break;
        default:
            s = [yy,gettext('年'),mm,gettext('月'),dd,gettext('日'),hh,":",mn].join('');
            break;
    }

    return s;
}



function GetWeekName(d)
{
    var w = "";
    if(d>=0 && d < 7)
    {
        w = weekDays[d];
    }

    return w;
}

function PadLeft(m)
{
    return m < 10 ? "0" + m : m;
}


function HChartReset(res)
{

    var myChart = HighStockInit.chart;
    //console.log("reset")

    if(myChart)
    {
        var data = splitDataX(res);
        pageHSData = data;

			//console.log(data);
			for(var i=0;i<data.vols.length;i++)
			{
				for(var j=0;j<data.vols.length;j++)
				{
					if(i != j && data.vols[i][0] == data.vols[j][0])
					{
						console.log("------",i,j,"-----",data.vols[i][0],data.vols[j][0]);
					}
				}
			}

        myChart.series[0].setData(data.values);
        myChart.series[1].setData(data.vols);
        myChart.series[2].setData(data.ma5);
        myChart.series[3].setData(data.ma20);
        myChart.redraw();

    }
}




function HChartAdd(res)
{
    //console.log("addPoint");
    var myChart = HighStockInit.chart;
    if(myChart && myChart.series && myChart.series.length > 0)
    {
        var tick = Math.round(parseFloat(res.time) * 1000);
			var val = [tick,parseFloat(FormatNumX(res.open,8)),parseFloat(FormatNumX(res.high,8)),parseFloat(FormatNumX(res.low,8)),parseFloat(FormatNumX(res.close,8))];
			var vol = [tick,parseFloat(FormatNumX(res.vol,8))];

        var xIndex = GetPHDataIndex(tick);
        var isUpdate = xIndex >= 0;

        var m5 = GetSumX(res.high,5,isUpdate);
        var m20 = GetSumX(res.high,20,isUpdate);
        var ma5 = [tick,m5];
        var ma20 = [tick,m20];

        //console.log(FormatUTCDate(res.time,"yyyy-MM-dd hh:mm:ss"));
        //console.log("-----");
        //console.log(val);
        //console.log(vol);
        //console.log(ma5);
        //console.log(ma20);
        //console.log("-----");

        if(xIndex >= 0)
        {
				console.log("updatePoint");

            pageHSData.values[xIndex] = val;
            pageHSData.vols[xIndex] = vol;
            pageHSData.ma5[xIndex] = ma5;
            pageHSData.ma20[xIndex] = ma20;

            myChart.series[0].setData(pageHSData.values);
            myChart.series[1].setData(pageHSData.vols);
            myChart.series[2].setData(pageHSData.ma5);
            myChart.series[3].setData(pageHSData.ma20);
            myChart.redraw();
        }
        else
        {
				console.log("addPoint");

            myChart.series[0].addPoint(val);
            myChart.series[1].addPoint(vol);
            myChart.series[2].addPoint(ma5);
            myChart.series[3].addPoint(ma20);
            myChart.redraw();
        }
    }
}

function GetPHDataIndex(tick)
{
    if(pageHSData && pageHSData.values)
    {
        var data = pageHSData.values;
        var len = data.length;
        for(var i=len-1;i>=0;i--)
        {
            if(data[i][0] == tick)
            {
                return i;
            }
            else if(data[i][0] < tick)
            {
                break;
            }
        }
    }

    return -1;
}

function GetHSDataIndex(data,tick)
{
    if(data && data.length > 0)
    {
        var len = data.length;
        for(var i=len-1;i>=0;i--)
        {
            if(data[0] == tick)
            {
                return i;
            }
            else if(data[0] < tick)
            {
                break;
            }
        }
    }
    return -1;
}


function splitDataX(rawData)
{
    var values = []
    var vols = [];

    var ma5 = [];
    var ma20 = [];

    for(var i=0;i<rawData.length;i++)
    {
        var itm = rawData[i];
        var tick = Math.round(itm.time * 1000);

        values.push([tick,parseFloat(itm.open),parseFloat(itm.high),parseFloat(itm.low),parseFloat(itm.close)]);
        vols.push([tick,parseFloat(itm.vol)]);

        ma5.push([tick,GetSum(values,i,5)]);
        ma20.push([tick,GetSum(values,i,20)]);

    }

    return {
        values:values,
        vols:vols,
        ma5:ma5,
        ma20:ma20
    };
}

function GetSum(vals,iStart,dayCount)
{
    var sm = 0;
    for(var i=0;i<dayCount;i++)
    {
        if(iStart - i < 0)
            break;

        sm += parseFloat(vals[iStart - i][2]);
    }
		return parseFloat((sm/dayCount).toFixed(8));
}

function GetSumX(lastVal,dayCount,isUpdate)
{
    var s=parseFloat(lastVal);
    if(pageHSData)
    {
        var vals = pageHSData.values;

        if(vals)
        {
            var len = vals.length;

            if(isUpdate)
            {
                for(var i=2;i<=dayCount;i++)
                {
                    if(len - i >= 0)
                    {
                        s += parseFloat(vals[len-i][2]);
                    }
                }
            }
            else
            {
                for(var i=1;i<dayCount;i++)
                {
                    if(len - i >= 0)
                    {
                        s += parseFloat(vals[len-i][2]);
                    }
                }
            }
        }
    }

		return parseFloat((s/dayCount).toFixed(8));
}


function SetTime(code,mins)
{
    if(wsTransaction && wsTransaction.readyState == 1)
    {
        var msg = {
            type: "subscribe",
            message: "k_line",
            params: {
                size: parseInt(mins),
                pair_code: code
            }
        };

        wsTransaction.send(JSON.stringify(msg));
    }
}
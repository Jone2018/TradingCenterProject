function LinkLogout(props) {
    function clickHandler(e) {
        e.preventDefault();
        Logout();
    }

    return (<a href="#logout" className="txt-primary" onClick={clickHandler}>{gettext('退出')}</a>);
}

function TopBar(props) {

    var nicname = GetItem("nicname") || "--";
    var uid = GetItem("uid") || 0;

    return (<div className="top-login hidden-xs">
        <div className="container">
            <div className="clearfix">
                <div className="tl-welcome fl">{gettext('您好，欢迎来到中国领先的区块链资产交易平台！')}</div>
                <div className="tl-info fr"><i className="icon icon-user txt-primary"></i>
                    <span>{nicname}</span> UID：<span>{uid}</span> [<LinkLogout/>]
                </div>
            </div>
        </div>
    </div>);
}

function MenuItem(props) {
    var txt = props.children || props.text;
    var target = props.url.indexOf(":") != -1 ? "_blank" : "";
    return (<li className={props.className}><a href={props.url} className="hvr-underline-from-center"
                                               target={target}>{txt}</a></li>);
}

function MTradeCateItem(props) {
    var code = props.code;
    var name = props.name;
    var id = "mcate" + code;
    return (<li id={id}><a href="#" data-id={code} onClick={props.clickHandler}>{name}</a></li>);
}

var MTradeCate = React.createClass({
    getInitialState: function () {
        return {
            status: 0,
            items: []
        };
    },
    componentDidMount: function () {
        $.getJSON("/api/market/market_info", {}, function (res) {
            //console.log(res);

            if (res.result) {
                this.setState({
                    status: 1,
                    items: res.data
                });
            }
            else {
                this.setState({
                    status: 2,
                    items: []
                });
            }
        }.bind(this));
    },
    clickHandler: function (e) {
        e.preventDefault();
        var code = $(e.target).data("id");
        $("#cate" + code).trigger("click");
    },
    render: function () {
        var rows = [];
        var num = 0;
        var code = GetItem("pair_code");
        var currLbl = "";
        this.state.items.forEach(function (item) {
            num++;
            var name = GetPairCoinType(item.pair_code, "name");
            if (item.pair_code == code) {
                currLbl = name;
            }
            rows.push(<MTradeCateItem key={num} code={item.pair_code} name={name} clickHandler={this.clickHandler}/>);
        }.bind(this));

        return (<div className="visible-xs visible-sm cate-dd">
            <div className="dropdown"><a href="#" id="dLabel" className="btn-block lbl" data-toggle="dropdown"
                                         aria-haspopup="true" aria-expanded="false"> <span
                id="dd-cointype">{currLbl}</span> <span className="icon-angle-down"></span> </a>
                <ul className="dropdown-menu" aria-labelledby="dLabel">
                    {rows}
                </ul>
            </div>
        </div>);
    }
});

function NavHeader(props) {
    var dd = "";
    var dType = props.ddType || "";
    if (dType == "1") {
        dd = <MTradeCate/>;
    }
    else if (dType == "2") {
        dd = <MMarketHome/>;
    }
    return (
        <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navmenu"
                    aria-expanded="false"><span className="icon-bar"></span> <span className="icon-bar"></span> <span
                className="icon-bar"></span></button>
            {dd}
            <a className="navbar-brand" href="index.html"><img src="/static/images/spacer.gif"/></a></div>
    );
}

function MMarketHome(props) {
    return (<div className="market-top">
        <div className="tb-row"><span className="tp">ETH/BTC</span> <span className="cy">￥231027</span></div>
    </div>);
}

function NavLeft(props) {
    return (
        <ul className="nav navbar-nav">
            <MenuItem className="mitem mm-home" url="index.html" text={gettext('首页')}/>
            <MenuItem className="mitem mm-transaction" url="transaction.html" text={gettext('交易')}/>
            <MenuItem className="mitem mm-otc" url="otc.html" text={gettext('场外交易')}/>
        </ul>
    );
}

function CSwiperItem(props) {
    return (<div className="swiper-slide">
        <div className="clearfix spritem" id={props.id}>
            <span className="tp">{props.name}</span>
            <span className="pt">{props.percent}%</span>
            <span className="cy">{props.price}</span>
        </div>
    </div>);


}

var mkTimeID;
var NavCenter = React.createClass({
    getInitialState: function () {
        return {
            status: 0,
            items: []
        };
    },
    componentDidMount: function () {
        this.Refresh();
        mkTimeID = setInterval(function () {
            this.RefreshData();
        }.bind(this), 15000);

    },
    RefreshData: function () {
        $.getJSON("/api/market/market_info", {}, function (res) {
            if (res.result) {
                this.UpdateData(res);
            }
        }.bind(this));
    },
    UpdateData: function (res) {
        if (res.data) {
            for (var i = 0; i < res.data; i++) {
                var item = res.data[i];
                var code = item.pair_code;
                var name = GetPairCoinType(code, "code") + "/BTC";
                var pct = item.change_24h;
                if (IsNumber(pct)) {
                    pct = (parseFloat(pct) * 100).toFixed(2);
                }

                var price = item.price;
                if (IsNumber(item.price)) {
                    price = "¥" + FormatCNY(item.price);
                }

                if (IsNumber(item.cny_rate) && parseFloat(item.cny_rate) > 0) {
                    SetItem("cny_rate", item.cny_rate);
                }

                var li = $("#spritem" + code);
                var liX = $("#spritemX" + code);

                if (li.length) {
                    li.find(".tp").html(name);
                    li.find(".pt").html(pct);
                    li.find(".cy").html(price);
                }

                if (liX.length) {
                    liX.find(".tp").html(name);
                    liX.find(".pt").html(pct);
                    liX.find(".cy").html(price);
                }
            }
        }
    },
    Refresh: function () {
        $.getJSON("/api/market/market_info", {}, function (res) {
            //console.log(res);

            if (res.result) {
                this.setState({
                    status: 1,
                    items: res.data
                });
                WSlideInit();
            }
            else {
                this.setState({
                    status: 2,
                    items: []
                });
            }
        }.bind(this));
    },
    render: function () {
        var rows = [];
        if (this.status == 0) {
            rows.push(<div key="0"><CLoading text=""/></div>);
        }
        else if (this.state.items && this.state.items.length > 0) {
            var num = 0;
            var len = this.state.items.length;
            this.state.items.forEach(function (item) {
                var name = GetPairCoinType(item.pair_code, "code") + "/BTC";
                var price = "--";
                if (IsNumber(item.price)) {
                    price = "¥" + FormatCNY(item.price);
                }

                if (IsNumber(item.cny_rate) && parseFloat(item.cny_rate) > 0) {
                    SetItem("cny_rate", item.cny_rate);
                }

                var pct = item.change_24h;
                if (IsNumber(pct)) {
                    pct = (parseFloat(pct) * 100).toFixed(2);
                }
                num++;

                var id1 = "spritem" + item.pair_code;

                rows.push(<CSwiperItem name={name} key={num} id={id1} percent={pct} price={price}/>);
                if (len == 1) {
                    var id2 = "spritemX" + item.pair_code;

                    rows.push(<CSwiperItem name={name} key={num + 10} id={id2} percent={pct} price={price}/>);
                }

            }.bind(this));
        }

        return (
            <ul className="nav navbar-nav navbar-left navbar-tline visible-lg">
                <li className="mitem2">
                    <div className="swiper-container" id="swiper">
                        <div className="swiper-wrapper">
                            {rows}
                        </div>
                    </div>
                </li>
            </ul>
        );
    }
});

function NavRight(props) {

    var url1 = "login.html";
    var txt1 = gettext('登录/注册');

    var url2 = "http://shang.qq.com/wpa/qunwpa?idkey=13267765cc86d290127f88f18617e4b1eb59a3e57e43bc5557905329faca31d6";
    var txt2 = gettext('加入QQ群');

    if (props.isLogin) {
        url1 = "usercenter.html";
        txt1 = gettext('个人中心');

        url2 = "recharge.html";
        txt2 = gettext('财务中心');

    }

    var logout = "";
    if (IsLogin()) {
        logout = <MenuItemLogout/>;
    }

    return (
        <ul className="nav navbar-nav navbar-right">
            <MenuItem className="mitem mm-ucenter" url={url1} text={txt1}/>
            <MenuItem className="mitem mm-fmcenter" url={url2} text={txt2}/>
            <MenuItem className="mitem mm-help" url="help.html" text={gettext('帮助中心')}/>
            {logout}
        </ul>
    );
}

function MenuItemLogout(props) {
    function clickHandler(e) {
        e.preventDefault();
        Logout();
    }

    return (<li className="mitem visible-xs">
        <a href="#logout" className="hvr-underline-from-center" onClick={clickHandler}>{gettext('退出登录')}</a>;
    </li>);
}


var HeaderBar = React.createClass({

    render: function () {
        var tbr = '';
        if (this.props.isLogin) {
            tbr = <TopBar/>;
        }

        return (<header>
            {tbr}
            <nav className="navbar navbar-default nav-main">
                <div className="container">
                    <NavHeader ddType={this.props.ddType}/>
                    <div className="collapse navbar-collapse" id="bs-navmenu">
                        <NavLeft/>
                        <NavCenter/>
                        <NavRight isLogin={this.props.isLogin}/>
                    </div>
                </div>
            </nav>
        </header>);
    }
});
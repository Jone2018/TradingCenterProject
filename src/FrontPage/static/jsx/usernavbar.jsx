var smItems = [
    {
        id: "sm-mobile",
        url: "user-mobile.html",
        icon: "icon-mobile icon-large txt-center",
        name: gettext('手机绑定'),
        verKey: "is_phone_verified"
    },
    {
        id: "sm-email",
        url: "user-email.html",
        icon: "icon-envelope",
        name: gettext('邮箱绑定'),
        verKey: "is_email_verified"
    },
    {
        id: "sm-tradepwd",
        url: "user-tradepwd.html",
        icon: "icon-lock icon-large",
        name: gettext('交易密码'),
        verKey: "is_set_password"
    },
    {
        id: "sm-idcard",
        url: "user-idcard-list.html",
        icon: "icon-credit-card",
        name: gettext('身份验证'),
        verKey: "is_realname_verified"
    },
    {
        id: "sm-question",
        url: "user-question.html",
        icon: "icon-question-circle",
        name: gettext('我的工单')
    },
    {
        id: "sm-question-list",
        url: "user-question-list.html",
        icon: "icon-list-alt",
        name: gettext('工单详情')
    },
    {
        id: "sm-passwd",
        url: "user-passwd.html",
        icon: "icon-user icon-large",
        name: gettext('登录密码')
    },
    /*{
        id: "sm-message",
        url: "user-message.html",
        icon: "icon-paper-plane",
        name: gettext('站内信')
    },
    {
        id: "sm-api",
        url: "user-api.html",
        icon: "icon-database",
        name: gettext('我的API')
    },*/

];

var CUserNavBar = React.createClass({
    getInitialState: function () {
        return {
            count: 0
        };
    },
    componentDidMount: function () {
        $.getJSON("/api/notice/get_message_count", function (res) {
            if (res.result && res.data && res.data.count) {
                this.setState({
                    count: res.data.count
                });
            }
        }.bind(this));
    },
    render: function () {
        return (
            <div className="item-box">
                <CUserInfo/>
                <CUserNav activeItem={this.props.activeItem} menuItems={smItems} msgCount={this.state.count}/>
            </div>
        );
    }
});

var CMobiUserNavBar = React.createClass({
    getInitialState: function () {
        return {
            count: 0
        };
    },
    componentDidMount: function () {
        $.getJSON("/api/notice/get_message_count", function (res) {
            if (res.result && res.data && res.data.count) {
                this.setState({
                    count: res.data.count
                });
            }
        });
    },
    render: function () {
        return (
            <div className="item-box">
                <div className="box">
                    <CUserInfo/>
                    <CUserNav activeItem={this.props.activeItem} menuItems={smItems} msgCount={this.state.count}/>
                </div>
            </div>
        );
    }
});

function CUserInfo(props) {
    var avatar = GetItem("avatar_url") || "/static/images/avatar.jpg";
    var nicname = GetItem("nicname") || gettext('未设置');
    var uid = GetItem("uid") || 0;
    return (<div className="userinfo clearfix"><img src={avatar} className="thu"/>
        <div className="info"><span>{nicname}</span><br/>
            UID <span>{uid}</span></div>
    </div>);
}

function CUserNav(props) {
    var rows = [];

    props.menuItems.forEach(function (item) {
        var act = (props.activeItem == item.id);
        rows.push(<CNavItem key={item.id} active={act} url={item.url} msgCount={props.msgCount} icon={item.icon}
                            name={item.name} verKey={item.verKey}/>);
    })

    return (<ul>{rows}</ul>);
}

function CNavItem(props) {
    var txt = props.children || props.name;
    var css = props.active ? "active" : "";
    if (props.verKey) {
        css += GetItem(props.verKey) == "true" ? " verified" : " unverified";
    }

    var bdg = "";
    if (txt == gettext('站内信')) {
        bdg = <span id='msgCount' className='badge'>{props.msgCount}</span>;
    }

    return (<li className={css}><a href={props.url}><i className={props.icon}></i> {txt}{bdg}</a></li>);
}
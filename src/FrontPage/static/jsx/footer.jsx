// JavaScript Document
var FooterBar = React.createClass({
    locHandler: function (e) {
        ShowLocation();
        e.preventDefault();
    },
    render: function () {
        return (<footer className="footer">
                <div className="container">
                    <ul className="row">
                        <li className="col-lg-3 logo visible-lg">
                            <img src="/static/images/bitbiex_logo.png"/>
                        </li>
                        <li className="col-lg-3 col-md-6 col-sm-6 col-xs-5 mnu mnu1">
                            <div className="bdr">
                                <div className="item-box">
                                    <h4>{gettext('帮助中心')}</h4>
                                    <a href="help.html?id=1">{gettext('注册登录')}</a> <a
                                    href="help.html?id=2">{gettext('交易指南')}</a> <a
                                    href="help.html?id=3">{gettext('费用说明')}</a></div>
                            </div>
                        </li>
                        <li className="col-lg-3 col-md-6 col-sm-6 col-xs-7 mnu mnu2">
                            <div className="bdr">
                                <div className="item-box">
                                <h4>{ gettext('联系我们') }</h4>
                                <div>
                                    { gettext('合作邮箱') }：services@bitbiex.com<br/>
                                    </div>
                                </div>
                            </div>
                        </li>
                    <li className="col-lg-3 qr visible-lg">
                    </li>
                    </ul>
                </div>
                <div className="copyright">
                    <div className="container">
                        <a href="#" onClick={this.locHandler} className="language" title={gettext('选择您的国家或区域')}>
                            <i className=
                                   {
                                       $.cookie('_language') == null ? 'zh-hans' : $.cookie('_language')
                                   }
                            ></i>
                            {
                                GetLangLocalName($.cookie('_language'), 'name_local') == "" ? '中文简体' : GetLangLocalName($.cookie('_language'), 'name_local')
                            }
                        </a>
                        <a href="rules.html">{gettext('用户协议')}</a>
                        <a href="privace.html">{gettext('隐私条款')}</a>
                    </div>
            </div>
            </footer>);
    }
});

var ScrollBar = React.createClass({
    componentDidMount: function () {
        ScrollTopInit();
    },
    clickHandler: function (e) {
        e.preventDefault();
        ShowDialogWX();
    },
    render: function () {

        return <div className="scrolltop-bar">
            <ul>
            </ul>
        </div>;
    }
});

function ScrollBarItem(props) {
    var txt = props.text || props.children;
    var css = props.hoverCss ? ("item-hover " + props.hoverCss) : "item-hover";
    return (<li className="st-item">
        <div className="item-icon"><a href={props.url} target={props.target}><i className={props.className}></i></a>
        </div>
        <div className={css}><a href={props.url} target={props.target}><i className={props.className}></i>{txt}</a>
        </div>
    </li>);
}

function ScrollBarItemWX(props) {
    var txt = props.text || props.children;

    return (<li className="st-item">
        <div className="item-icon"><a href={props.url} onClick={props.clickHandler}><i className={props.className}></i></a>
        </div>
    </li>);
}
var smItems = [
    {
        id: "fm-recharge",
        url: "recharge.html",
        icon: "icon-credit-card",
        name: gettext('资金管理')
    },
    {
        id: "fm-bill",
        url: "bill.html",
        icon: "icon-yen txt-center",
        name: gettext('财务记录')
    },
    {
        id: "fm-bill-query",
        url: "bill-query.html",
        icon: "icon-list-alt",
        name: gettext('账单详情')
    }
];

function CFMNavBar(props) {
    return (
        <div className="item-box">
            <h3 className="title">
                <div className="line">{gettext('财务中心')}</div>
            </h3>
            <CFMNav activeItem={props.activeItem} menuItems={smItems}/>
        </div>
    );
}


function CFMNav(props) {
    var rows = [];

    props.menuItems.forEach(function (item) {
        var act = (props.activeItem == item.id);
        rows.push(<CFMItem key={item.id} id={item.id} active={act} url={item.url} icon={item.icon} name={item.name}/>);
    })

    return (<ul>{rows}</ul>);
}

function CFMItem(props) {
    var txt = props.children || props.name;
    var css = props.active ? "active" : "";
    return (<li className={css}><a href={props.url}><i className={props.icon}></i> {txt}</a></li>);
}

function CFMCateBar(props) {
    return (
        <div className="nav-cate visible-xs-block">
            <CFMCate activeItem={props.activeItem} menuItems={smItems}/>
        </div>
    );
}


function CFMCate(props) {
    var rows = [];

    props.menuItems.forEach(function (item) {
        var css = props.activeItem == item.id ? "active" : "";
        rows.push(<a key={item.id} href={item.url} className={css}><i className={item.icon}></i> {item.name}</a>);
    })

    return (<div>{rows}</div>);
}
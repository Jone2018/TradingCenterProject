var App = React.createClass({
    componentWillMount: function () {
        //console.log('Component WILL MOUNT!')
    },
    componentDidMount: function () {
        //console.log('Component DID MOUNT!');
        PageInit();
    },
    render: function () {

        return (<section>
            <HeaderBar isLogin={this.props.isLogin}/>
            {this.props.ContentBox}
            <FooterBar/>
            <ScrollBar/>
        </section>);
    }
});

function CLoading(props) {
    var icon = props.icon || "icon-spin icon-spinner";
    var txt = props.text || props.children;
    return (<div className="btns-loading"><i className={icon}></i> {txt}</div>);
}

function CLoadMore(props) {
    return (<div className="btns-load">
        <a href="#" onClick={props.clickHandler}><i className="icon-angle-double-down"></i> 加载更多</a>
    </div>);
}

function CPager(props) {
    var pIndex = props.pageIndex || 1;
    var pCount = props.pageCount || 0;

    var pPrev = pIndex - 1;
    var pNext = pIndex + 1;

    if (pPrev <= 0) pPrev = 1;
    if (pPrev > pCount) pPrev = pCount;
    if (pIndex > pCount) pIndex = pCount;
    if (pNext > pCount) pNext = pCount;

    var rows = [];

    if (pCount > 1) {
        rows.push(<li key="0">
            <a href="#" data-flag="prev" data-id={pPrev} onClick={props.clickHandler}>&laquo;上一页</a>
        </li>);
        rows.push(<li key="1"><a>{pIndex}/{pCount}</a></li>);
        rows.push(<li key="2">
            <a href="#" data-flag="next" data-id={pNext} onClick={props.clickHandler}>下一页&raquo;</a>
        </li>);
    }

    return (<nav aria-label="Page navigation" className="pagebar">
        <ul className="pagination">
            {rows}
        </ul>
    </nav>);
}

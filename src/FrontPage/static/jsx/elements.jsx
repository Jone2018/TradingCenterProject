function CLoginQQ(props) {
    return (<div className="split-line">
        <div className="form-qq">
            <div className="lnk"><a href={props.url} className="txt-primary"><i
                className="icon icon-qq"></i> {gettext('使用QQ快捷登录')}</a></div>
        </div>
        <div className="spt"><i>{gettext('或')}</i></div>
    </div>);
}

function CLoginBox(props) {
    var id = props.id || "frmAction";
    var css = props.className || "form-horizontal";
    var method = props.method || "post";
    var small = props.subTitle ? <small>{props.subTitle}</small> : "";
    return (<div className="box login-box">
        <h3 className="title clearfix"><span className="tl pull-left">{props.title}</span> <span className="pull-right"><i
            className="icon-key txt-grey"></i></span></h3>
        <CLoginQQ url="/api/social/login/qq/"/>
        <div className="form-box">
            <form className={css} id={id} method={method} onSubmit={props.submitHandler}>
                {props.children}
            </form>
        </div>

    </div>);
}

function CFormBox(props) {
    var id = props.id || "frmAction";
    var css = props.className || "form-horizontal";
    var method = props.method || "post";
    var small = props.subTitle ? <small>{props.subTitle}</small> : "";
    return (<div className="item-box">
        <h4 className="tb-title tb-title-border"><span className="tl">{props.title}{small}</span></h4>
        <div className="user-form">
            <div className="form-box">
                <form className={css} id={id} method={method} onSubmit={props.submitHandler}>
                    {props.children}
                </form>
            </div>
        </div>
    </div>);
}

function CSelect(props) {
    var css = props.className || "form-control fld-xs-block";
    var opts = [];
    props.items.forEach(function (item) {
        opts.push(<option value={item.id} key={item.id}>{item.name}</option>);
    });

    if (props.colIn) {
        var colCss = props.colIn == "1" ? "col-sm-9" : props.colIn;
        return (<CCol className={colCss}>
            <select className={css} id={props.id} name={props.name} onChange={props.changeHandler}>
                {opts}
            </select>
        </CCol>);
    }

    return (<select className={css} id={props.id} name={props.name} onChange={props.changeHandler}>
        {opts}
    </select>);
}

function CLinkButton(props) {
    var txt = props.children || props.text;
    var css = props.className;

    return (<a href="#" className={css} onClick={props.linkHandler}>{txt}</a>);
}

function CFormGroup(props) {
    var css = props.className || "form-group";
    return (<div className={css}>
        {props.children}
    </div>);
}

function CCol(props) {
    var css = props.className || "col-sm-9";
    return (<div className={css}>
        {props.children}
    </div>);
}

function CLabel(props) {
    var css = props.className ? props.className : "col-sm-3 control-label";
    var txt = props.children ? props.children : props.text;
    return (<label className={css}>{txt}</label>);
}

function CTextInput(props) {
    var type = props.type || "text";
    var id = props.id;
    var css = props.className || "form-control fld-xs-block";
    if (props.colIn) {
        var colCss = props.colIn == "1" ? "col-sm-9" : props.colIn;
        return (<CCol className={colCss}>
            <input type={type} className={css} name={props.name} id={id} placeholder={props.title}/>
        </CCol>);
    }
    return (<input type={type} className={css} name={props.name} id={id} placeholder={props.title}/>);
}


function CStaticText(props) {
    var txt = props.children || props.text;
    var css = "form-control-static " + props.className;
    if (props.colIn) {
        var colCss = props.colIn == "1" ? "col-sm-9" : props.colIn;
        return (<CCol className={colCss}>
            <div className={css}>{txt}</div>
        </CCol>);
    }
    return (<div className={css}>{txt}</div>);
}

function CStaticInfo(props) {
    var txt = props.children || props.text;
    var css = props.className || "fld-info";
    if (props.colIn) {
        var colCss = props.colIn == "1" ? "col-sm-9" : props.colIn;
        return (<CCol className={colCss}>
            <div className={css}>{txt}</div>
        </CCol>);
    }
    return (<div className={css}>{txt}</div>);
}

function CRadioBox(props) {
    var txt = props.children || props.text;
    return (<label>
        <input type="radio" className={props.className} name={props.name} id={props.id} value={props.value}
               defaultChecked={props.checked}/>
        {txt}
    </label>);
}

function CCheckbox(props) {
    var txt = props.children || props.text;
    return (<label>
        <input type="checkbox" className={props.className} name={prop.name} id={props.id} value={props.value}
               defaultChecked={props.checked}/>
        {txt}
    </label>);
}

function CHidden(props) {
    return (<input type="hidden" name={props.name} id={props.id} value={props.value}/>);
}

function CButton(props) {
    var type = props.type || "submit";
    var txt = props.children || props.text;
    var css = props.className || "btn btn-primary btn-block fld-xs-block";
    if (props.colIn) {
        var colCss = props.colIn == "1" ? "col-sm-9" : props.colIn;
        return (<CCol className={colCss}>
            <button type={type} className={css}>{txt}</button>
        </CCol>);
    }
    return (<button type={type} className={css}>{txt}</button>);
}



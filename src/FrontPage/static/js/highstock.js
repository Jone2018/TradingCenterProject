/* Highstock JS v1.3.6 License: www.highcharts.com/license */
(function () {
    function z() {
        var a, b = arguments, c, d = {}, e = function (a, b) {
            var c, d;
            typeof a !== "object" && (a = {});
            for (d in b) b.hasOwnProperty(d) && (c = b[d], a[d] = c && typeof c === "object" && Object.prototype.toString.call(c) !== "[object Array]" && d !== "renderTo" && typeof c.nodeType !== "number" ? e(a[d] || {}, c) : b[d]);
            return a
        };
        b[0] === !0 && (d = b[1], b = Array.prototype.slice.call(b, 2));
        c = b.length;
        for (a = 0; a < c; a++) d = e(d, b[a]);
        return d
    }

    function L(a, b) {
        return parseInt(a, b || 10)
    }

    function Ja(a) {
        return typeof a === "string"
    }

    function ha(a) {
        return a &&
            typeof a === "object"
    }

    function Ka(a) {
        return Object.prototype.toString.call(a) === "[object Array]"
    }

    function ra(a) {
        return typeof a === "number"
    }

    function La(a) {
        return X.log(a) / X.LN10
    }

    function sa(a) {
        return X.pow(10, a)
    }

    function ta(a, b) {
        for (var c = a.length; c--;) if (a[c] === b) {
            a.splice(c, 1);
            break
        }
    }

    function v(a) {
        return a !== s && a !== null
    }

    function V(a, b, c) {
        var d, e;
        if (Ja(b)) v(c) ? a.setAttribute(b, c) : a && a.getAttribute && (e = a.getAttribute(b)); else if (v(b) && ha(b)) for (d in b) a.setAttribute(d, b[d]);
        return e
    }

    function oa(a) {
        return Ka(a) ?
            a : [a]
    }

    function M(a, b) {
        if (Da && !da && b && b.opacity !== s) b.filter = "alpha(opacity=" + b.opacity * 100 + ")";
        w(a.style, b)
    }

    function $(a, b, c, d, e) {
        a = C.createElement(a);
        b && w(a, b);
        e && M(a, {padding: 0, border: Z, margin: 0});
        c && M(a, c);
        d && d.appendChild(a);
        return a
    }

    function ia(a, b) {
        var c = function () {
            return s
        };
        c.prototype = new a;
        w(c.prototype, b);
        return c
    }

    function Ra(a, b) {
        return Array((b || 2) + 1 - String(a).length).join(0) + a
    }

    function bb(a) {
        return (kb && kb(a) || wb || 0) * 6E4
    }

    function Ma(a, b) {
        for (var c = "{", d = !1, e, f, g, h, i, j = []; (c = a.indexOf(c)) !==
        -1;) {
            e = a.slice(0, c);
            if (d) {
                f = e.split(":");
                g = f.shift().split(".");
                i = g.length;
                e = b;
                for (h = 0; h < i; h++) e = e[g[h]];
                if (f.length) f = f.join(":"), g = /\.([0-9])/, h = P.lang, i = void 0, /f$/.test(f) ? (i = (i = f.match(g)) ? i[1] : -1, e !== null && (e = A.numberFormat(e, i, h.decimalPoint, f.indexOf(",") > -1 ? h.thousandsSep : ""))) : e = ja(f, e)
            }
            j.push(e);
            a = a.slice(c + 1);
            c = (d = !d) ? "}" : "{"
        }
        j.push(a);
        return j.join("")
    }

    function xb(a) {
        return X.pow(10, W(X.log(a) / X.LN10))
    }

    function yb(a, b, c, d, e) {
        var f, g = a, c = p(c, 1);
        f = a / c;
        b || (b = [1, 2, 2.5, 5, 10], d === !1 && (c ===
        1 ? b = [1, 2, 5, 10] : c <= 0.1 && (b = [1 / c])));
        for (d = 0; d < b.length; d++) if (g = b[d], e && g * c >= a || !e && f <= (b[d] + (b[d + 1] || b[d])) / 2) break;
        g *= c;
        return g
    }

    function zb(a, b) {
        var c = a.length, d, e;
        for (e = 0; e < c; e++) a[e].ss_i = e;
        a.sort(function (a, c) {
            d = b(a, c);
            return d === 0 ? a.ss_i - c.ss_i : d
        });
        for (e = 0; e < c; e++) delete a[e].ss_i
    }

    function Sa(a) {
        for (var b = a.length, c = a[0]; b--;) a[b] < c && (c = a[b]);
        return c
    }

    function Ea(a) {
        for (var b = a.length, c = a[0]; b--;) a[b] > c && (c = a[b]);
        return c
    }

    function Na(a, b) {
        for (var c in a) a[c] && a[c] !== b && a[c].destroy && a[c].destroy(),
            delete a[c]
    }

    function Ta(a) {
        lb || (lb = $(Ua));
        a && lb.appendChild(a);
        lb.innerHTML = ""
    }

    function pa(a, b) {
        var c = "Highcharts error #" + a + ": www.highcharts.com/errors/" + a;
        if (b) throw c;
        S.console && console.log(c)
    }

    function ka(a) {
        return parseFloat(a.toPrecision(14))
    }

    function Ya(a, b) {
        Fa = p(a, b.animation)
    }

    function Ob() {
        var a = P.global, b = a.useUTC, c = b ? "getUTC" : "get", d = b ? "setUTC" : "set";
        ea = a.Date || window.Date;
        wb = b && a.timezoneOffset;
        kb = b && a.getTimezoneOffset;
        mb = function (a, c, d, h, i, j) {
            var k;
            b ? (k = ea.UTC.apply(0, arguments), k +=
                bb(k)) : k = (new ea(a, c, p(d, 1), p(h, 0), p(i, 0), p(j, 0))).getTime();
            return k
        };
        Ab = c + "Minutes";
        Bb = c + "Hours";
        Cb = c + "Day";
        cb = c + "Date";
        db = c + "Month";
        eb = c + "FullYear";
        Pb = d + "Milliseconds";
        Qb = d + "Seconds";
        Rb = d + "Minutes";
        Sb = d + "Hours";
        Db = d + "Date";
        Eb = d + "Month";
        Fb = d + "FullYear"
    }

    function Y() {
    }

    function Za(a, b, c, d) {
        this.axis = a;
        this.pos = b;
        this.type = c || "";
        this.isNew = !0;
        !c && !d && this.addLabel()
    }

    function Tb(a, b, c, d, e) {
        var f = a.chart.inverted;
        this.axis = a;
        this.isNegative = c;
        this.options = b;
        this.x = d;
        this.total = null;
        this.points = {};
        this.stack =
            e;
        this.alignOptions = {
            align: b.align || (f ? c ? "left" : "right" : "center"),
            verticalAlign: b.verticalAlign || (f ? "middle" : c ? "bottom" : "top"),
            y: p(b.y, f ? 4 : c ? 14 : -6),
            x: p(b.x, f ? c ? -6 : 6 : 0)
        };
        this.textAlign = b.textAlign || (f ? c ? "right" : "left" : "center")
    }

    function Gb(a) {
        var b = a.options, c = b.navigator, d = c.enabled, b = b.scrollbar, e = b.enabled, f = d ? c.height : 0,
            g = e ? b.height : 0;
        this.handles = [];
        this.scrollbarButtons = [];
        this.elementsToDestroy = [];
        this.chart = a;
        this.setBaseSeries();
        this.height = f;
        this.scrollbarHeight = g;
        this.scrollbarEnabled = e;
        this.navigatorEnabled = d;
        this.navigatorOptions = c;
        this.scrollbarOptions = b;
        this.outlineHeight = f + g;
        this.init()
    }

    function Hb(a) {
        this.init(a)
    }

    var s, C = document, S = window, X = Math, u = X.round, W = X.floor, ya = X.ceil, x = X.max, B = X.min, Q = X.abs,
        aa = X.cos, fa = X.sin, ua = X.PI, qa = ua * 2 / 360, Ga = navigator.userAgent, Ub = S.opera,
        Da = /(msie|trident)/i.test(Ga) && !Ub, nb = C.documentMode === 8, ob = /AppleWebKit/.test(Ga),
        Va = /Firefox/.test(Ga), fb = /(Mobile|Android|Windows Phone)/.test(Ga), Ha = "http://www.w3.org/2000/svg",
        da = !!C.createElementNS && !!C.createElementNS(Ha,
            "svg").createSVGRect, Zb = Va && parseInt(Ga.split("Firefox/")[1], 10) < 4,
        la = !da && !Da && !!C.createElement("canvas").getContext, Wa, $a, Vb = {}, Ib = 0, lb, P, ja, Fa, Jb, I,
        ga = function () {
            return s
        }, ba = [], gb = 0, Ua = "div", Z = "none", $b = /^[0-9]+$/,
        pb = ["plotTop", "marginRight", "marginBottom", "plotLeft"], ac = "stroke-width", ea, mb, wb, kb, Ab, Bb, Cb,
        cb, db, eb, Pb, Qb, Rb, Sb, Db, Eb, Fb, F = {}, A;
    A = S.Highcharts = S.Highcharts ? pa(16, !0) : {};
    A.seriesTypes = F;
    var w = A.extend = function (a, b) {
        var c;
        a || (a = {});
        for (c in b) a[c] = b[c];
        return a
    }, p = A.pick = function () {
        var a =
            arguments, b, c, d = a.length;
        for (b = 0; b < d; b++) if (c = a[b], c !== s && c !== null) return c
    }, R = A.wrap = function (a, b, c) {
        var d = a[b];
        a[b] = function () {
            var a = Array.prototype.slice.call(arguments);
            a.unshift(d);
            return c.apply(this, a)
        }
    };
    ja = function (a, b, c) {
        if (!v(b) || isNaN(b)) return "Invalid date";
        var a = p(a, "%Y-%m-%d %H:%M:%S"), d = new ea(b - bb(b)), e, f = d[Bb](), g = d[Cb](), h = d[cb](), i = d[db](),
            j = d[eb](), k = P.lang, m = k.weekdays, d = w({
                a: m[g].substr(0, 3),
                A: m[g],
                d: Ra(h),
                e: h,
                w: g,
                b: k.shortMonths[i],
                B: k.months[i],
                m: Ra(i + 1),
                y: j.toString().substr(2,
                    2),
                Y: j,
                H: Ra(f),
                I: Ra(f % 12 || 12),
                l: f % 12 || 12,
                M: Ra(d[Ab]()),
                p: f < 12 ? "AM" : "PM",
                P: f < 12 ? "am" : "pm",
                S: Ra(d.getSeconds()),
                L: Ra(u(b % 1E3), 3)
            }, A.dateFormats);
        for (e in d) for (; a.indexOf("%" + e) !== -1;) a = a.replace("%" + e, typeof d[e] === "function" ? d[e](b) : d[e]);
        return c ? a.substr(0, 1).toUpperCase() + a.substr(1) : a
    };
    I = {
        millisecond: 1,
        second: 1E3,
        minute: 6E4,
        hour: 36E5,
        day: 864E5,
        week: 6048E5,
        month: 24192E5,
        year: 314496E5
    };
    A.numberFormat = function (a, b, c, d) {
        var e = P.lang, a = +a || 0, f = b === -1 ? B((a.toString().split(".")[1] || "").length, 20) : isNaN(b =
                Q(b)) ? 2 : b, b = c === void 0 ? e.decimalPoint : c, d = d === void 0 ? e.thousandsSep : d,
            e = a < 0 ? "-" : "", c = String(L(a = Q(a).toFixed(f))), g = c.length > 3 ? c.length % 3 : 0;
        return e + (g ? c.substr(0, g) + d : "") + c.substr(g).replace(/(\d{3})(?=\d)/g, "$1" + d) + (f ? b + Q(a - c).toFixed(f).slice(2) : "")
    };
    Jb = {
        init: function (a, b, c) {
            var b = b || "", d = a.shift, e = b.indexOf("C") > -1, f = e ? 7 : 3, g, b = b.split(" "), c = [].concat(c),
                h, i, j = function (a) {
                    for (g = a.length; g--;) a[g] === "M" && a.splice(g + 1, 0, a[g + 1], a[g + 2], a[g + 1], a[g + 2])
                };
            e && (j(b), j(c));
            a.isArea && (h = b.splice(b.length -
                6, 6), i = c.splice(c.length - 6, 6));
            if (d <= c.length / f && b.length === c.length) for (; d--;) c = [].concat(c).splice(0, f).concat(c);
            a.shift = 0;
            if (b.length) for (a = c.length; b.length < a;) d = [].concat(b).splice(b.length - f, f), e && (d[f - 6] = d[f - 2], d[f - 5] = d[f - 1]), b = b.concat(d);
            h && (b = b.concat(h), c = c.concat(i));
            return [b, c]
        }, step: function (a, b, c, d) {
            var e = [], f = a.length;
            if (c === 1) e = d; else if (f === b.length && c < 1) for (; f--;) d = parseFloat(a[f]), e[f] = isNaN(d) ? a[f] : c * parseFloat(b[f] - d) + d; else e = b;
            return e
        }
    };
    (function (a) {
        S.HighchartsAdapter = S.HighchartsAdapter ||
            a && {
                init: function (b) {
                    var c = a.fx;
                    a.extend(a.easing, {
                        easeOutQuad: function (a, b, c, g, h) {
                            return -g * (b /= h) * (b - 2) + c
                        }
                    });
                    a.each(["cur", "_default", "width", "height", "opacity"], function (b, e) {
                        var f = c.step, g;
                        e === "cur" ? f = c.prototype : e === "_default" && a.Tween && (f = a.Tween.propHooks[e], e = "set");
                        (g = f[e]) && (f[e] = function (a) {
                            var c, a = b ? a : this;
                            if (a.prop !== "align") return c = a.elem, c.attr ? c.attr(a.prop, e === "cur" ? s : a.now) : g.apply(this, arguments)
                        })
                    });
                    R(a.cssHooks.opacity, "get", function (a, b, c) {
                        return b.attr ? b.opacity || 0 : a.call(this,
                            b, c)
                    });
                    this.addAnimSetter("d", function (a) {
                        var c = a.elem, f;
                        if (!a.started) f = b.init(c, c.d, c.toD), a.start = f[0], a.end = f[1], a.started = !0;
                        c.attr("d", b.step(a.start, a.end, a.pos, c.toD))
                    });
                    this.each = Array.prototype.forEach ? function (a, b) {
                        return Array.prototype.forEach.call(a, b)
                    } : function (a, b) {
                        var c, g = a.length;
                        for (c = 0; c < g; c++) if (b.call(a[c], a[c], c, a) === !1) return c
                    };
                    a.fn.highcharts = function () {
                        var a = "Chart", b = arguments, c, g;
                        if (this[0]) {
                            Ja(b[0]) && (a = b[0], b = Array.prototype.slice.call(b, 1));
                            c = b[0];
                            if (c !== s) c.chart =
                                c.chart || {}, c.chart.renderTo = this[0], new A[a](c, b[1]), g = this;
                            c === s && (g = ba[V(this[0], "data-highcharts-chart")])
                        }
                        return g
                    }
                }, addAnimSetter: function (b, c) {
                    a.Tween ? a.Tween.propHooks[b] = {set: c} : a.fx.step[b] = c
                }, getScript: a.getScript, inArray: a.inArray, adapterRun: function (b, c) {
                    return a(b)[c]()
                }, grep: a.grep, map: function (a, c) {
                    for (var d = [], e = 0, f = a.length; e < f; e++) d[e] = c.call(a[e], a[e], e, a);
                    return d
                }, offset: function (b) {
                    return a(b).offset()
                }, addEvent: function (b, c, d) {
                    a(b).bind(c, d)
                }, removeEvent: function (b, c, d) {
                    var e =
                        C.removeEventListener ? "removeEventListener" : "detachEvent";
                    C[e] && b && !b[e] && (b[e] = function () {
                    });
                    a(b).unbind(c, d)
                }, fireEvent: function (b, c, d, e) {
                    var f = a.Event(c), g = "detached" + c, h;
                    !Da && d && (delete d.layerX, delete d.layerY, delete d.returnValue);
                    w(f, d);
                    b[c] && (b[g] = b[c], b[c] = null);
                    a.each(["preventDefault", "stopPropagation"], function (a, b) {
                        var c = f[b];
                        f[b] = function () {
                            try {
                                c.call(f)
                            } catch (a) {
                                b === "preventDefault" && (h = !0)
                            }
                        }
                    });
                    a(b).trigger(f);
                    b[g] && (b[c] = b[g], b[g] = null);
                    e && !f.isDefaultPrevented() && !h && e(f)
                }, washMouseEvent: function (a) {
                    var c =
                        a.originalEvent || a;
                    if (c.pageX === s) c.pageX = a.pageX, c.pageY = a.pageY;
                    return c
                }, animate: function (b, c, d) {
                    var e = a(b);
                    if (!b.style) b.style = {};
                    if (c.d) b.toD = c.d, c.d = 1;
                    e.stop();
                    c.opacity !== s && b.attr && (c.opacity += "px");
                    b.hasAnim = 1;
                    e.animate(c, d)
                }, stop: function (b) {
                    b.hasAnim && a(b).stop()
                }
            }
    })(S.jQuery);
    var N = S.HighchartsAdapter, H = N || {};
    N && N.init.call(N, Jb);
    var qb = H.adapterRun, bc = H.getScript, Oa = H.inArray, n = A.each = H.each, hb = H.grep, cc = H.offset,
        za = H.map, D = H.addEvent, T = H.removeEvent, E = H.fireEvent, dc = H.washMouseEvent,
        rb = H.animate, ab = H.stop;
    P = {
        colors: "#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#2b908f,#f45b5b,#91e8e1".split(","),
        symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
        lang: {
            loading: "Loading...",
            months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
            shortMonths: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
            decimalPoint: ".",
            numericSymbols: "k,M,G,T,P,E".split(","),
            resetZoom: "Reset zoom",
            resetZoomTitle: "Reset zoom level 1:1",
            thousandsSep: " "
        },
        global: {
            useUTC: !0,
            canvasToolsURL: "http://code.highcharts.com/stock/2.1.6/modules/canvas-tools.js",
            VMLRadialGradientURL: "http://code.highcharts.com/stock/2.1.6/gfx/vml-radial-gradient.png"
        },
        chart: {
            borderColor: "#4572A7",
            borderRadius: 0,
            defaultSeriesType: "line",
            ignoreHiddenSeries: !0,
            spacing: [10, 10, 15, 10],
            backgroundColor: "#FFFFFF",
            plotBorderColor: "#C0C0C0",
            resetZoomButton: {theme: {zIndex: 20}, position: {align: "right", x: -10, y: 10}}
        },
        title: {text: "Chart title", align: "center", margin: 15, style: {color: "#333333", fontSize: "18px"}},
        subtitle: {text: "", align: "center", style: {color: "#555555"}},
        plotOptions: {
            line: {
                allowPointSelect: !1,
                showCheckbox: !1,
                animation: {duration: 1E3},
                events: {},
                lineWidth: 2,
                marker: {
                    lineWidth: 0,
                    radius: 4,
                    lineColor: "#FFFFFF",
                    states: {
                        hover: {enabled: !0, lineWidthPlus: 1, radiusPlus: 2},
                        select: {fillColor: "#FFFFFF", lineColor: "#000000", lineWidth: 2}
                    }
                },
                point: {events: {}},
                dataLabels: {
                    align: "center",
                    formatter: function () {
                        return this.y ===
                        null ? "" : A.numberFormat(this.y, -1)
                    },
                    style: {
                        color: "contrast",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textShadow: "0 0 6px contrast, 0 0 3px contrast"
                    },
                    verticalAlign: "bottom",
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                states: {hover: {lineWidthPlus: 1, marker: {}, halo: {size: 10, opacity: 0.25}}, select: {marker: {}}},
                stickyTracking: !0,
                turboThreshold: 1E3
            }
        },
        labels: {style: {position: "absolute", color: "#3E576F"}},
        legend: {
            enabled: !0,
            align: "center",
            layout: "horizontal",
            labelFormatter: function () {
                return this.name
            },
            borderColor: "#909090",
            borderRadius: 0,
            navigation: {activeColor: "#274b6d", inactiveColor: "#CCC"},
            shadow: !1,
            itemStyle: {color: "#333333", fontSize: "12px", fontWeight: "bold"},
            itemHoverStyle: {color: "#000"},
            itemHiddenStyle: {color: "#CCC"},
            itemCheckboxStyle: {position: "absolute", width: "13px", height: "13px"},
            symbolPadding: 5,
            verticalAlign: "bottom",
            x: 0,
            y: 0,
            title: {style: {fontWeight: "bold"}}
        },
        loading: {
            labelStyle: {fontWeight: "bold", position: "relative", top: "45%"},
            style: {position: "absolute", backgroundColor: "white", opacity: 0.5, textAlign: "center"}
        },
        tooltip: {
            enabled: !0,
            animation: da,
            backgroundColor: "rgba(249, 249, 249, .85)",
            borderWidth: 1,
            borderRadius: 3,
            dateTimeLabelFormats: {
                millisecond: "%A, %b %e, %H:%M:%S.%L",
                second: "%A, %b %e, %H:%M:%S",
                minute: "%A, %b %e, %H:%M",
                hour: "%A, %b %e, %H:%M",
                day: "%A, %b %e, %Y",
                week: "Week from %A, %b %e, %Y",
                month: "%B %Y",
                year: "%Y"
            },
            footerFormat: "",
            headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
            shadow: !0,
            snap: fb ? 25 : 10,
            style: {color: "#333333", cursor: "default", fontSize: "12px", padding: "8px", whiteSpace: "nowrap"}
        },
        credits: {
            enabled: !0,
            text: "",
            href: "http://www.highcharts.com",
            position: {align: "right", x: -10, verticalAlign: "bottom", y: -5},
            style: {cursor: "pointer", color: "#909090", fontSize: "9px"}
        }
    };
    var U = P.plotOptions, N = U.line;
    Ob();
    var ec = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
        fc = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
        gc = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
        va = function (a) {
            var b = [], c, d;
            (function (a) {
                a && a.stops ? d = za(a.stops, function (a) {
                    return va(a[1])
                }) : (c = ec.exec(a)) ? b = [L(c[1]), L(c[2]), L(c[3]), parseFloat(c[4], 10)] : (c = fc.exec(a)) ? b = [L(c[1], 16), L(c[2], 16), L(c[3], 16), 1] : (c = gc.exec(a)) && (b = [L(c[1]), L(c[2]), L(c[3]), 1])
            })(a);
            return {
                get: function (c) {
                    var f;
                    d ? (f = z(a), f.stops = [].concat(f.stops), n(d, function (a, b) {
                        f.stops[b] = [f.stops[b][0], a.get(c)]
                    })) : f = b && !isNaN(b[0]) ? c === "rgb" ? "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")" : c === "a" ? b[3] : "rgba(" + b.join(",") + ")" : a;
                    return f
                }, brighten: function (a) {
                    if (d) n(d,
                        function (b) {
                            b.brighten(a)
                        }); else if (ra(a) && a !== 0) {
                        var c;
                        for (c = 0; c < 3; c++) b[c] += L(a * 255), b[c] < 0 && (b[c] = 0), b[c] > 255 && (b[c] = 255)
                    }
                    return this
                }, rgba: b, setOpacity: function (a) {
                    b[3] = a;
                    return this
                }, raw: a
            }
        };
    Y.prototype = {
        opacity: 1,
        textProps: "fontSize,fontWeight,fontFamily,fontStyle,color,lineHeight,width,textDecoration,textShadow".split(","),
        init: function (a, b) {
            this.element = b === "span" ? $(b) : C.createElementNS(Ha, b);
            this.renderer = a
        },
        animate: function (a, b, c) {
            b = p(b, Fa, !0);
            ab(this);
            if (b) {
                b = z(b, {});
                if (c) b.complete = c;
                rb(this, a, b)
            } else this.attr(a), c && c();
            return this
        },
        colorGradient: function (a, b, c) {
            var d = this.renderer, e, f, g, h, i, j, k, m, l, o, q = [];
            a.linearGradient ? f = "linearGradient" : a.radialGradient && (f = "radialGradient");
            if (f) {
                g = a[f];
                h = d.gradients;
                j = a.stops;
                l = c.radialReference;
                Ka(g) && (a[f] = g = {x1: g[0], y1: g[1], x2: g[2], y2: g[3], gradientUnits: "userSpaceOnUse"});
                f === "radialGradient" && l && !v(g.gradientUnits) && (g = z(g, {
                    cx: l[0] - l[2] / 2 + g.cx * l[2],
                    cy: l[1] - l[2] / 2 + g.cy * l[2],
                    r: g.r * l[2],
                    gradientUnits: "userSpaceOnUse"
                }));
                for (o in g) o !==
                "id" && q.push(o, g[o]);
                for (o in j) q.push(j[o]);
                q = q.join(",");
                h[q] ? a = h[q].attr("id") : (g.id = a = "highcharts-" + Ib++, h[q] = i = d.createElement(f).attr(g).add(d.defs), i.stops = [], n(j, function (a) {
                    a[1].indexOf("rgba") === 0 ? (e = va(a[1]), k = e.get("rgb"), m = e.get("a")) : (k = a[1], m = 1);
                    a = d.createElement("stop").attr({offset: a[0], "stop-color": k, "stop-opacity": m}).add(i);
                    i.stops.push(a)
                }));
                c.setAttribute(b, "url(" + d.url + "#" + a + ")")
            }
        },
        applyTextShadow: function (a) {
            var b = this.element, c, d = a.indexOf("contrast") !== -1, e = {}, f = this.renderer.forExport ||
                b.style.textShadow !== s && !Da;
            if (d) e.textShadow = a = a.replace(/contrast/g, this.renderer.getContrast(b.style.fill));
            if (ob) e.textRendering = "geometricPrecision";
            f ? M(b, e) : (this.fakeTS = !0, this.ySetter = this.xSetter, c = [].slice.call(b.getElementsByTagName("tspan")), n(a.split(/\s?,\s?/g), function (a) {
                var d = b.firstChild, e, f, a = a.split(" ");
                e = a[a.length - 1];
                (f = a[a.length - 2]) && n(c, function (a, c) {
                    var g;
                    c === 0 && (a.setAttribute("x", b.getAttribute("x")), c = b.getAttribute("y"), a.setAttribute("y", c || 0), c === null && b.setAttribute("y",
                        0));
                    g = a.cloneNode(1);
                    V(g, {
                        "class": "highcharts-text-shadow",
                        fill: e,
                        stroke: e,
                        "stroke-opacity": 1 / x(L(f), 3),
                        "stroke-width": f,
                        "stroke-linejoin": "round"
                    });
                    b.insertBefore(g, d)
                })
            }))
        },
        attr: function (a, b) {
            var c, d, e = this.element, f, g = this, h;
            typeof a === "string" && b !== s && (c = a, a = {}, a[c] = b);
            if (typeof a === "string") g = (this[a + "Getter"] || this._defaultGetter).call(this, a, e); else {
                for (c in a) {
                    d = a[c];
                    h = !1;
                    this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c) && (f || (this.symbolAttr(a), f = !0), h = !0);
                    if (this.rotation && (c === "x" || c === "y")) this.doTransform = !0;
                    h || (this[c + "Setter"] || this._defaultSetter).call(this, d, c, e);
                    this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(c) && this.updateShadows(c, d)
                }
                if (this.doTransform) this.updateTransform(), this.doTransform = !1
            }
            return g
        },
        updateShadows: function (a, b) {
            for (var c = this.shadows, d = c.length; d--;) c[d].setAttribute(a, a === "height" ? x(b - (c[d].cutHeight || 0), 0) : a === "d" ? this.d : b)
        },
        addClass: function (a) {
            var b = this.element, c = V(b, "class") || "";
            c.indexOf(a) ===
            -1 && V(b, "class", c + " " + a);
            return this
        },
        symbolAttr: function (a) {
            var b = this;
            n("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","), function (c) {
                b[c] = p(a[c], b[c])
            });
            b.attr({d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b)})
        },
        clip: function (a) {
            return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : Z)
        },
        crisp: function (a) {
            var b, c = {}, d, e = a.strokeWidth || this.strokeWidth || 0;
            d = u(e) % 2 / 2;
            a.x = W(a.x || this.x || 0) + d;
            a.y = W(a.y || this.y || 0) + d;
            a.width = W((a.width || this.width || 0) - 2 * d);
            a.height = W((a.height || this.height || 0) - 2 * d);
            a.strokeWidth = e;
            for (b in a) this[b] !== a[b] && (this[b] = c[b] = a[b]);
            return c
        },
        css: function (a) {
            var b = this.styles, c = {}, d = this.element, e, f, g = "";
            e = !b;
            if (a && a.color) a.fill = a.color;
            if (b) for (f in a) a[f] !== b[f] && (c[f] = a[f], e = !0);
            if (e) {
                e = this.textWidth = a && a.width && d.nodeName.toLowerCase() === "text" && L(a.width) || this.textWidth;
                b && (a = w(b, c));
                this.styles = a;
                e && (la || !da && this.renderer.forExport) && delete a.width;
                if (Da && !da) M(this.element, a); else {
                    b = function (a, b) {
                        return "-" + b.toLowerCase()
                    };
                    for (f in a) g += f.replace(/([A-Z])/g, b) + ":" + a[f] + ";";
                    V(d, "style", g)
                }
                e && this.added && this.renderer.buildText(this)
            }
            return this
        },
        on: function (a, b) {
            var c = this, d = c.element;
            $a && a === "click" ? (d.ontouchstart = function (a) {
                c.touchEventFired = ea.now();
                a.preventDefault();
                b.call(d, a)
            }, d.onclick = function (a) {
                (Ga.indexOf("Android") === -1 || ea.now() - (c.touchEventFired || 0) > 1100) && b.call(d, a)
            }) : d["on" + a] = b;
            return this
        },
        setRadialReference: function (a) {
            this.element.radialReference = a;
            return this
        },
        translate: function (a, b) {
            return this.attr({
                translateX: a,
                translateY: b
            })
        },
        invert: function () {
            this.inverted = !0;
            this.updateTransform();
            return this
        },
        updateTransform: function () {
            var a = this.translateX || 0, b = this.translateY || 0, c = this.scaleX, d = this.scaleY, e = this.inverted,
                f = this.rotation, g = this.element;
            e && (a += this.attr("width"), b += this.attr("height"));
            a = ["translate(" + a + "," + b + ")"];
            e ? a.push("rotate(90) scale(-1,1)") : f && a.push("rotate(" + f + " " + (g.getAttribute("x") || 0) + " " + (g.getAttribute("y") || 0) + ")");
            (v(c) || v(d)) && a.push("scale(" + p(c, 1) + " " + p(d, 1) + ")");
            a.length && g.setAttribute("transform",
                a.join(" "))
        },
        toFront: function () {
            var a = this.element;
            a.parentNode.appendChild(a);
            return this
        },
        align: function (a, b, c) {
            var d, e, f, g, h = {};
            e = this.renderer;
            f = e.alignedObjects;
            if (a) {
                if (this.alignOptions = a, this.alignByTranslate = b, !c || Ja(c)) this.alignTo = d = c || "renderer", ta(f, this), f.push(this), c = null
            } else a = this.alignOptions, b = this.alignByTranslate, d = this.alignTo;
            c = p(c, e[d], e);
            d = a.align;
            e = a.verticalAlign;
            f = (c.x || 0) + (a.x || 0);
            g = (c.y || 0) + (a.y || 0);
            if (d === "right" || d === "center") f += (c.width - (a.width || 0)) / {right: 1, center: 2}[d];
            h[b ? "translateX" : "x"] = u(f);
            if (e === "bottom" || e === "middle") g += (c.height - (a.height || 0)) / ({bottom: 1, middle: 2}[e] || 1);
            h[b ? "translateY" : "y"] = u(g);
            this[this.placed ? "animate" : "attr"](h);
            this.placed = !0;
            this.alignAttr = h;
            return this
        },
        getBBox: function (a) {
            var b, c = this.renderer, d, e = this.rotation, f = this.element, g = this.styles, h = e * qa;
            d = this.textStr;
            var i, j = f.style, k, m;
            d !== s && (m = ["", e || 0, g && g.fontSize, f.style.width].join(","), m = d === "" || $b.test(d) ? "num:" + d.toString().length + m : d + m);
            m && !a && (b = c.cache[m]);
            if (!b) {
                if (f.namespaceURI ===
                    Ha || c.forExport) {
                    try {
                        k = this.fakeTS && function (a) {
                            n(f.querySelectorAll(".highcharts-text-shadow"), function (b) {
                                b.style.display = a
                            })
                        }, Va && j.textShadow ? (i = j.textShadow, j.textShadow = "") : k && k(Z), b = f.getBBox ? w({}, f.getBBox()) : {
                            width: f.offsetWidth,
                            height: f.offsetHeight
                        }, i ? j.textShadow = i : k && k("")
                    } catch (l) {
                    }
                    if (!b || b.width < 0) b = {width: 0, height: 0}
                } else b = this.htmlGetBBox();
                if (c.isSVG) {
                    a = b.width;
                    d = b.height;
                    if (Da && g && g.fontSize === "11px" && d.toPrecision(3) === "16.9") b.height = d = 14;
                    if (e) b.width = Q(d * fa(h)) + Q(a * aa(h)), b.height =
                        Q(d * aa(h)) + Q(a * fa(h))
                }
                c.cache[m] = b
            }
            return b
        },
        show: function (a) {
            a && this.element.namespaceURI === Ha ? this.element.removeAttribute("visibility") : this.attr({visibility: a ? "inherit" : "visible"});
            return this
        },
        hide: function () {
            return this.attr({visibility: "hidden"})
        },
        fadeOut: function (a) {
            var b = this;
            b.animate({opacity: 0}, {
                duration: a || 150, complete: function () {
                    b.attr({y: -9999})
                }
            })
        },
        add: function (a) {
            var b = this.renderer, c = this.element, d;
            if (a) this.parentGroup = a;
            this.parentInverted = a && a.inverted;
            this.textStr !== void 0 &&
            b.buildText(this);
            this.added = !0;
            if (!a || a.handleZ || this.zIndex) d = this.zIndexSetter();
            d || (a ? a.element : b.box).appendChild(c);
            if (this.onAdd) this.onAdd();
            return this
        },
        safeRemoveChild: function (a) {
            var b = a.parentNode;
            b && b.removeChild(a)
        },
        destroy: function () {
            var a = this, b = a.element || {}, c = a.shadows,
                d = a.renderer.isSVG && b.nodeName === "SPAN" && a.parentGroup, e, f;
            b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = b.point = null;
            ab(a);
            if (a.clipPath) a.clipPath = a.clipPath.destroy();
            if (a.stops) {
                for (f = 0; f < a.stops.length; f++) a.stops[f] =
                    a.stops[f].destroy();
                a.stops = null
            }
            a.safeRemoveChild(b);
            for (c && n(c, function (b) {
                a.safeRemoveChild(b)
            }); d && d.div && d.div.childNodes.length === 0;) b = d.parentGroup, a.safeRemoveChild(d.div), delete d.div, d = b;
            a.alignTo && ta(a.renderer.alignedObjects, a);
            for (e in a) delete a[e];
            return null
        },
        shadow: function (a, b, c) {
            var d = [], e, f, g = this.element, h, i, j, k;
            if (a) {
                i = p(a.width, 3);
                j = (a.opacity || 0.15) / i;
                k = this.parentInverted ? "(-1,-1)" : "(" + p(a.offsetX, 1) + ", " + p(a.offsetY, 1) + ")";
                for (e = 1; e <= i; e++) {
                    f = g.cloneNode(0);
                    h = i * 2 + 1 - 2 * e;
                    V(f, {
                        isShadow: "true",
                        stroke: a.color || "black",
                        "stroke-opacity": j * e,
                        "stroke-width": h,
                        transform: "translate" + k,
                        fill: Z
                    });
                    if (c) V(f, "height", x(V(f, "height") - h, 0)), f.cutHeight = h;
                    b ? b.element.appendChild(f) : g.parentNode.insertBefore(f, g);
                    d.push(f)
                }
                this.shadows = d
            }
            return this
        },
        xGetter: function (a) {
            this.element.nodeName === "circle" && (a = {x: "cx", y: "cy"}[a] || a);
            return this._defaultGetter(a)
        },
        _defaultGetter: function (a) {
            a = p(this[a], this.element ? this.element.getAttribute(a) : null, 0);
            /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
            return a
        },
        dSetter: function (a, b, c) {
            a && a.join && (a = a.join(" "));
            /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
            c.setAttribute(b, a);
            this[b] = a
        },
        dashstyleSetter: function (a) {
            var b;
            if (a = a && a.toLowerCase()) {
                a = a.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                for (b = a.length; b--;) a[b] = L(a[b]) * this["stroke-width"];
                a = a.join(",").replace("NaN",
                    "none");
                this.element.setAttribute("stroke-dasharray", a)
            }
        },
        alignSetter: function (a) {
            this.element.setAttribute("text-anchor", {left: "start", center: "middle", right: "end"}[a])
        },
        opacitySetter: function (a, b, c) {
            this[b] = a;
            c.setAttribute(b, a)
        },
        titleSetter: function (a) {
            var b = this.element.getElementsByTagName("title")[0];
            b || (b = C.createElementNS(Ha, "title"), this.element.appendChild(b));
            b.textContent = String(p(a), "").replace(/<[^>]*>/g, "")
        },
        textSetter: function (a) {
            if (a !== this.textStr) delete this.bBox, this.textStr = a,
            this.added && this.renderer.buildText(this)
        },
        fillSetter: function (a, b, c) {
            typeof a === "string" ? c.setAttribute(b, a) : a && this.colorGradient(a, b, c)
        },
        zIndexSetter: function (a, b) {
            var c = this.renderer, d = this.parentGroup, c = (d || c).element || c.box, e, f, g = this.element, h;
            e = this.added;
            var i;
            v(a) && (g.setAttribute(b, a), a = +a, this[b] === a && (e = !1), this[b] = a);
            if (e) {
                if ((a = this.zIndex) && d) d.handleZ = !0;
                d = c.childNodes;
                for (i = 0; i < d.length && !h; i++) if (e = d[i], f = V(e, "zIndex"), e !== g && (L(f) > a || !v(a) && v(f))) c.insertBefore(g, e), h = !0;
                h || c.appendChild(g)
            }
            return h
        },
        _defaultSetter: function (a, b, c) {
            c.setAttribute(b, a)
        }
    };
    Y.prototype.yGetter = Y.prototype.xGetter;
    Y.prototype.translateXSetter = Y.prototype.translateYSetter = Y.prototype.rotationSetter = Y.prototype.verticalAlignSetter = Y.prototype.scaleXSetter = Y.prototype.scaleYSetter = function (a, b) {
        this[b] = a;
        this.doTransform = !0
    };
    Y.prototype["stroke-widthSetter"] = Y.prototype.strokeSetter = function (a, b, c) {
        this[b] = a;
        if (this.stroke && this["stroke-width"]) this.strokeWidth = this["stroke-width"], Y.prototype.fillSetter.call(this, this.stroke,
            "stroke", c), c.setAttribute("stroke-width", this["stroke-width"]), this.hasStroke = !0; else if (b === "stroke-width" && a === 0 && this.hasStroke) c.removeAttribute("stroke"), this.hasStroke = !1
    };
    var ma = function () {
        this.init.apply(this, arguments)
    };
    ma.prototype = {
        Element: Y, init: function (a, b, c, d, e) {
            var f = location, g, d = this.createElement("svg").attr({version: "1.1"}).css(this.getStyle(d));
            g = d.element;
            a.appendChild(g);
            a.innerHTML.indexOf("xmlns") === -1 && V(g, "xmlns", Ha);
            this.isSVG = !0;
            this.box = g;
            this.boxWrapper = d;
            this.alignedObjects =
                [];
            this.url = (Va || ob) && C.getElementsByTagName("base").length ? f.href.replace(/#.*?$/, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
            this.createElement("desc").add().element.appendChild(C.createTextNode("Created with Highstock 2.1.6"));
            this.defs = this.createElement("defs").add();
            this.forExport = e;
            this.gradients = {};
            this.cache = {};
            this.setSize(b, c, !1);
            var h;
            if (Va && a.getBoundingClientRect) this.subPixelFix = b = function () {
                M(a, {left: 0, top: 0});
                h = a.getBoundingClientRect();
                M(a, {
                    left: ya(h.left) - h.left + "px",
                    top: ya(h.top) - h.top + "px"
                })
            }, b(), D(S, "resize", b)
        }, getStyle: function (a) {
            return this.style = w({
                fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                fontSize: "12px"
            }, a)
        }, isHidden: function () {
            return !this.boxWrapper.getBBox().width
        }, destroy: function () {
            var a = this.defs;
            this.box = null;
            this.boxWrapper = this.boxWrapper.destroy();
            Na(this.gradients || {});
            this.gradients = null;
            if (a) this.defs = a.destroy();
            this.subPixelFix && T(S, "resize", this.subPixelFix);
            return this.alignedObjects = null
        }, createElement: function (a) {
            var b =
                new this.Element;
            b.init(this, a);
            return b
        }, draw: function () {
        }, buildText: function (a) {
            for (var b = a.element, c = this, d = c.forExport, e = p(a.textStr, "").toString(), f = e.indexOf("<") !== -1, g = b.childNodes, h, i, j = V(b, "x"), k = a.styles, m = a.textWidth, l = k && k.lineHeight, o = k && k.textShadow, q = k && k.textOverflow === "ellipsis", r = g.length, G = m && !a.added && this.box, Ia = function (a) {
                return l ? L(l) : c.fontMetrics(/(px|em)$/.test(a && a.style.fontSize) ? a.style.fontSize : k && k.fontSize || c.style.fontSize || 12, a).h
            }, t = function (a) {
                return a.replace(/&lt;/g,
                    "<").replace(/&gt;/g, ">")
            }; r--;) b.removeChild(g[r]);
            !f && !o && !q && e.indexOf(" ") === -1 ? b.appendChild(C.createTextNode(t(e))) : (h = /<.*style="([^"]+)".*>/, i = /<.*href="(http[^"]+)".*>/, G && G.appendChild(b), e = f ? e.replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">').replace(/<a/g, "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(/<br.*?>/g) : [e], e[e.length - 1] === "" && e.pop(), n(e, function (e, f) {
                var g, l = 0, e = e.replace(/<span/g, "|||<span").replace(/<\/span>/g,
                    "</span>|||");
                g = e.split("|||");
                n(g, function (e) {
                    if (e !== "" || g.length === 1) {
                        var o = {}, r = C.createElementNS(Ha, "tspan"), G;
                        h.test(e) && (G = e.match(h)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), V(r, "style", G));
                        i.test(e) && !d && (V(r, "onclick", 'location.href="' + e.match(i)[1] + '"'), M(r, {cursor: "pointer"}));
                        e = t(e.replace(/<(.|\n)*?>/g, "") || " ");
                        if (e !== " ") {
                            r.appendChild(C.createTextNode(e));
                            if (l) o.dx = 0; else if (f && j !== null) o.x = j;
                            V(r, o);
                            b.appendChild(r);
                            !l && f && (!da && d && M(r, {display: "block"}), V(r, "dy", Ia(r)));
                            if (m) {
                                for (var o =
                                    e.replace(/([^\^])-/g, "$1- ").split(" "), p = g.length > 1 || f || o.length > 1 && k.whiteSpace !== "nowrap", n, y, s, v = [], u = Ia(r), x = 1, w = a.rotation, z = e, B = z.length; (p || q) && (o.length || v.length);) a.rotation = 0, n = a.getBBox(!0), s = n.width, !da && c.forExport && (s = c.measureSpanWidth(r.firstChild.data, a.styles)), n = s > m, y === void 0 && (y = n), q && y ? (B /= 2, z === "" || !n && B < 0.5 ? o = [] : (n && (y = !0), z = e.substring(0, z.length + (n ? -1 : 1) * ya(B)), o = [z + (m > 3 ? "…" : "")], r.removeChild(r.firstChild))) : !n || o.length === 1 ? (o = v, v = [], o.length && (x++, r = C.createElementNS(Ha,
                                    "tspan"), V(r, {
                                    dy: u,
                                    x: j
                                }), G && V(r, "style", G), b.appendChild(r)), s > m && (m = s)) : (r.removeChild(r.firstChild), v.unshift(o.pop())), o.length && r.appendChild(C.createTextNode(o.join(" ").replace(/- /g, "-")));
                                y && a.attr("title", a.textStr);
                                a.rotation = w
                            }
                            l++
                        }
                    }
                })
            }), G && G.removeChild(b), o && a.applyTextShadow && a.applyTextShadow(o))
        }, getContrast: function (a) {
            a = va(a).rgba;
            return a[0] + a[1] + a[2] > 384 ? "#000000" : "#FFFFFF"
        }, button: function (a, b, c, d, e, f, g, h, i) {
            var j = this.label(a, b, c, i, null, null, null, null, "button"), k = 0, m, l, o, q, r,
                G, a = {x1: 0, y1: 0, x2: 0, y2: 1}, e = z({
                    "stroke-width": 1,
                    stroke: "#CCCCCC",
                    fill: {linearGradient: a, stops: [[0, "#FEFEFE"], [1, "#F6F6F6"]]},
                    r: 2,
                    padding: 5,
                    style: {color: "black"}
                }, e);
            o = e.style;
            delete e.style;
            f = z(e, {stroke: "#68A", fill: {linearGradient: a, stops: [[0, "#FFF"], [1, "#ACF"]]}}, f);
            q = f.style;
            delete f.style;
            g = z(e, {stroke: "#68A", fill: {linearGradient: a, stops: [[0, "#9BD"], [1, "#CDF"]]}}, g);
            r = g.style;
            delete g.style;
            h = z(e, {style: {color: "#CCC"}}, h);
            G = h.style;
            delete h.style;
            D(j.element, Da ? "mouseover" : "mouseenter", function () {
                k !==
                3 && j.attr(f).css(q)
            });
            D(j.element, Da ? "mouseout" : "mouseleave", function () {
                k !== 3 && (m = [e, f, g][k], l = [o, q, r][k], j.attr(m).css(l))
            });
            j.setState = function (a) {
                (j.state = k = a) ? a === 2 ? j.attr(g).css(r) : a === 3 && j.attr(h).css(G) : j.attr(e).css(o)
            };
            return j.on("click", function () {
                k !== 3 && d.call(j)
            }).attr(e).css(w({cursor: "default"}, o))
        }, crispLine: function (a, b) {
            a[1] === a[4] && (a[1] = a[4] = u(a[1]) - b % 2 / 2);
            a[2] === a[5] && (a[2] = a[5] = u(a[2]) + b % 2 / 2);
            return a
        }, path: function (a) {
            var b = {fill: Z};
            Ka(a) ? b.d = a : ha(a) && w(b, a);
            return this.createElement("path").attr(b)
        },
        circle: function (a, b, c) {
            a = ha(a) ? a : {x: a, y: b, r: c};
            b = this.createElement("circle");
            b.xSetter = function (a) {
                this.element.setAttribute("cx", a)
            };
            b.ySetter = function (a) {
                this.element.setAttribute("cy", a)
            };
            return b.attr(a)
        }, arc: function (a, b, c, d, e, f) {
            if (ha(a)) b = a.y, c = a.r, d = a.innerR, e = a.start, f = a.end, a = a.x;
            a = this.symbol("arc", a || 0, b || 0, c || 0, c || 0, {innerR: d || 0, start: e || 0, end: f || 0});
            a.r = c;
            return a
        }, rect: function (a, b, c, d, e, f) {
            var e = ha(a) ? a.r : e, g = this.createElement("rect"), a = ha(a) ? a : a === s ? {} : {
                x: a, y: b, width: x(c, 0), height: x(d,
                    0)
            };
            if (f !== s) a.strokeWidth = f, a = g.crisp(a);
            if (e) a.r = e;
            g.rSetter = function (a) {
                V(this.element, {rx: a, ry: a})
            };
            return g.attr(a)
        }, setSize: function (a, b, c) {
            var d = this.alignedObjects, e = d.length;
            this.width = a;
            this.height = b;
            for (this.boxWrapper[p(c, !0) ? "animate" : "attr"]({width: a, height: b}); e--;) d[e].align()
        }, g: function (a) {
            var b = this.createElement("g");
            return v(a) ? b.attr({"class": "highcharts-" + a}) : b
        }, image: function (a, b, c, d, e) {
            var f = {preserveAspectRatio: Z};
            arguments.length > 1 && w(f, {x: b, y: c, width: d, height: e});
            f = this.createElement("image").attr(f);
            f.element.setAttributeNS ? f.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : f.element.setAttribute("hc-svg-href", a);
            return f
        }, symbol: function (a, b, c, d, e, f) {
            var g, h = this.symbols[a], h = h && h(u(b), u(c), d, e, f), i = /^url\((.*?)\)$/, j, k;
            if (h) g = this.path(h), w(g, {
                symbolName: a,
                x: b,
                y: c,
                width: d,
                height: e
            }), f && w(g, f); else if (i.test(a)) k = function (a, b) {
                a.element && (a.attr({
                    width: b[0],
                    height: b[1]
                }), a.alignByTranslate || a.translate(u((d - b[0]) / 2), u((e - b[1]) / 2)))
            }, j = a.match(i)[1], a = Vb[j] || f && f.width && f.height &&
                [f.width, f.height], g = this.image(j).attr({
                x: b,
                y: c
            }), g.isImg = !0, a ? k(g, a) : (g.attr({width: 0, height: 0}), $("img", {
                onload: function () {
                    k(g, Vb[j] = [this.width, this.height])
                }, src: j
            }));
            return g
        }, symbols: {
            circle: function (a, b, c, d) {
                var e = 0.166 * c;
                return ["M", a + c / 2, b, "C", a + c + e, b, a + c + e, b + d, a + c / 2, b + d, "C", a - e, b + d, a - e, b, a + c / 2, b, "Z"]
            }, square: function (a, b, c, d) {
                return ["M", a, b, "L", a + c, b, a + c, b + d, a, b + d, "Z"]
            }, triangle: function (a, b, c, d) {
                return ["M", a + c / 2, b, "L", a + c, b + d, a, b + d, "Z"]
            }, "triangle-down": function (a, b, c, d) {
                return ["M", a, b,
                    "L", a + c, b, a + c / 2, b + d, "Z"]
            }, diamond: function (a, b, c, d) {
                return ["M", a + c / 2, b, "L", a + c, b + d / 2, a + c / 2, b + d, a, b + d / 2, "Z"]
            }, arc: function (a, b, c, d, e) {
                var f = e.start, c = e.r || c || d, g = e.end - 0.001, d = e.innerR, h = e.open, i = aa(f), j = fa(f),
                    k = aa(g), g = fa(g), e = e.end - f < ua ? 0 : 1;
                return ["M", a + c * i, b + c * j, "A", c, c, 0, e, 1, a + c * k, b + c * g, h ? "M" : "L", a + d * k, b + d * g, "A", d, d, 0, e, 0, a + d * i, b + d * j, h ? "" : "Z"]
            }, callout: function (a, b, c, d, e) {
                var f = B(e && e.r || 0, c, d), g = f + 6, h = e && e.anchorX, e = e && e.anchorY, i;
                i = ["M", a + f, b, "L", a + c - f, b, "C", a + c, b, a + c, b, a + c, b + f, "L", a + c, b + d - f,
                    "C", a + c, b + d, a + c, b + d, a + c - f, b + d, "L", a + f, b + d, "C", a, b + d, a, b + d, a, b + d - f, "L", a, b + f, "C", a, b, a, b, a + f, b];
                h && h > c && e > b + g && e < b + d - g ? i.splice(13, 3, "L", a + c, e - 6, a + c + 6, e, a + c, e + 6, a + c, b + d - f) : h && h < 0 && e > b + g && e < b + d - g ? i.splice(33, 3, "L", a, e + 6, a - 6, e, a, e - 6, a, b + f) : e && e > d && h > a + g && h < a + c - g ? i.splice(23, 3, "L", h + 6, b + d, h, b + d + 6, h - 6, b + d, a + f, b + d) : e && e < 0 && h > a + g && h < a + c - g && i.splice(3, 3, "L", h - 6, b, h, b - 6, h + 6, b, c - f, b);
                return i
            }
        }, clipRect: function (a, b, c, d) {
            var e = "highcharts-" + Ib++, f = this.createElement("clipPath").attr({id: e}).add(this.defs),
                a = this.rect(a, b, c, d, 0).add(f);
            a.id = e;
            a.clipPath = f;
            a.count = 0;
            return a
        }, text: function (a, b, c, d) {
            var e = la || !da && this.forExport, f = {};
            if (d && !this.forExport) return this.html(a, b, c);
            f.x = Math.round(b || 0);
            if (c) f.y = Math.round(c);
            if (a || a === 0) f.text = a;
            a = this.createElement("text").attr(f);
            e && a.css({position: "absolute"});
            if (!d) a.xSetter = function (a, b, c) {
                var d = c.getElementsByTagName("tspan"), e, f = c.getAttribute(b), l;
                for (l = 0; l < d.length; l++) e = d[l], e.getAttribute(b) === f && e.setAttribute(b, a);
                c.setAttribute(b, a)
            };
            return a
        },
        fontMetrics: function (a, b) {
            a = a || this.style.fontSize;
            if (b && S.getComputedStyle) b = b.element || b, a = S.getComputedStyle(b, "").fontSize;
            var a = /px/.test(a) ? L(a) : /em/.test(a) ? parseFloat(a) * 12 : 12, c = a < 24 ? a + 3 : u(a * 1.2),
                d = u(c * 0.8);
            return {h: c, b: d, f: a}
        }, rotCorr: function (a, b, c) {
            var d = a;
            b && c && (d = x(d * aa(b * qa), 4));
            return {x: -a / 3 * fa(b * qa), y: d}
        }, label: function (a, b, c, d, e, f, g, h, i) {
            function j() {
                var a, b;
                a = q.element.style;
                G = (na === void 0 || x === void 0 || o.styles.textAlign) && v(q.textStr) && q.getBBox();
                o.width = (na || G.width || 0) + 2 * t + y;
                o.height = (x || G.height || 0) + 2 * t;
                A = t + l.fontMetrics(a && a.fontSize, q).b;
                if (D) {
                    if (!r) a = u(-p * t) + sb, b = (h ? -A : 0) + sb, o.box = r = d ? l.symbol(d, a, b, o.width, o.height, K) : l.rect(a, b, o.width, o.height, 0, K[ac]), r.attr("fill", Z).add(o);
                    r.isImg || r.attr(w({width: u(o.width), height: u(o.height)}, K));
                    K = null
                }
            }

            function k() {
                var a = o.styles, a = a && a.textAlign, b = y + t * (1 - p), c;
                c = h ? 0 : A;
                if (v(na) && G && (a === "center" || a === "right")) b += {center: 0.5, right: 1}[a] * (na - G.width);
                if (b !== q.x || c !== q.y) q.attr("x", b), c !== s && q.attr("y", c);
                q.x = b;
                q.y = c
            }

            function m(a,
                       b) {
                r ? r.attr(a, b) : K[a] = b
            }

            var l = this, o = l.g(i), q = l.text("", 0, 0, g).attr({zIndex: 1}), r, G, p = 0, t = 3, y = 0, na, x, B,
                Kb, sb = 0, K = {}, A, D;
            o.onAdd = function () {
                q.add(o);
                o.attr({text: a || a === 0 ? a : "", x: b, y: c});
                r && v(e) && o.attr({anchorX: e, anchorY: f})
            };
            o.widthSetter = function (a) {
                na = a
            };
            o.heightSetter = function (a) {
                x = a
            };
            o.paddingSetter = function (a) {
                if (v(a) && a !== t) t = o.padding = a, k()
            };
            o.paddingLeftSetter = function (a) {
                v(a) && a !== y && (y = a, k())
            };
            o.alignSetter = function (a) {
                p = {left: 0, center: 0.5, right: 1}[a]
            };
            o.textSetter = function (a) {
                a !== s && q.textSetter(a);
                j();
                k()
            };
            o["stroke-widthSetter"] = function (a, b) {
                a && (D = !0);
                sb = a % 2 / 2;
                m(b, a)
            };
            o.strokeSetter = o.fillSetter = o.rSetter = function (a, b) {
                b === "fill" && a && (D = !0);
                m(b, a)
            };
            o.anchorXSetter = function (a, b) {
                e = a;
                m(b, u(a) - sb - B)
            };
            o.anchorYSetter = function (a, b) {
                f = a;
                m(b, a - Kb)
            };
            o.xSetter = function (a) {
                o.x = a;
                p && (a -= p * ((na || G.width) + t));
                B = u(a);
                o.attr("translateX", B)
            };
            o.ySetter = function (a) {
                Kb = o.y = u(a);
                o.attr("translateY", Kb)
            };
            var C = o.css;
            return w(o, {
                css: function (a) {
                    if (a) {
                        var b = {}, a = z(a);
                        n(o.textProps, function (c) {
                            a[c] !== s && (b[c] =
                                a[c], delete a[c])
                        });
                        q.css(b)
                    }
                    return C.call(o, a)
                }, getBBox: function () {
                    return {width: G.width + 2 * t, height: G.height + 2 * t, x: G.x - t, y: G.y - t}
                }, shadow: function (a) {
                    r && r.shadow(a);
                    return o
                }, destroy: function () {
                    T(o.element, "mouseenter");
                    T(o.element, "mouseleave");
                    q && (q = q.destroy());
                    r && (r = r.destroy());
                    Y.prototype.destroy.call(o);
                    o = l = j = k = m = null
                }
            })
        }
    };
    Wa = ma;
    w(Y.prototype, {
        htmlCss: function (a) {
            var b = this.element;
            if (b = a && b.tagName === "SPAN" && a.width) delete a.width, this.textWidth = b, this.updateTransform();
            if (a && a.textOverflow ===
                "ellipsis") a.whiteSpace = "nowrap", a.overflow = "hidden";
            this.styles = w(this.styles, a);
            M(this.element, a);
            return this
        }, htmlGetBBox: function () {
            var a = this.element;
            if (a.nodeName === "text") a.style.position = "absolute";
            return {x: a.offsetLeft, y: a.offsetTop, width: a.offsetWidth, height: a.offsetHeight}
        }, htmlUpdateTransform: function () {
            if (this.added) {
                var a = this.renderer, b = this.element, c = this.translateX || 0, d = this.translateY || 0,
                    e = this.x || 0, f = this.y || 0, g = this.textAlign || "left",
                    h = {left: 0, center: 0.5, right: 1}[g], i = this.shadows,
                    j = this.styles;
                M(b, {marginLeft: c, marginTop: d});
                i && n(i, function (a) {
                    M(a, {marginLeft: c + 1, marginTop: d + 1})
                });
                this.inverted && n(b.childNodes, function (c) {
                    a.invertChild(c, b)
                });
                if (b.tagName === "SPAN") {
                    var k = this.rotation, m, l = L(this.textWidth), o = [k, g, b.innerHTML, this.textWidth].join(",");
                    if (o !== this.cTT) {
                        m = a.fontMetrics(b.style.fontSize).b;
                        v(k) && this.setSpanRotation(k, h, m);
                        i = p(this.elemWidth, b.offsetWidth);
                        if (i > l && /[ \-]/.test(b.textContent || b.innerText)) M(b, {
                            width: l + "px", display: "block", whiteSpace: j && j.whiteSpace ||
                            "normal"
                        }), i = l;
                        this.getSpanCorrection(i, m, h, k, g)
                    }
                    M(b, {left: e + (this.xCorr || 0) + "px", top: f + (this.yCorr || 0) + "px"});
                    if (ob) m = b.offsetHeight;
                    this.cTT = o
                }
            } else this.alignOnAdd = !0
        }, setSpanRotation: function (a, b, c) {
            var d = {},
                e = Da ? "-ms-transform" : ob ? "-webkit-transform" : Va ? "MozTransform" : Ub ? "-o-transform" : "";
            d[e] = d.transform = "rotate(" + a + "deg)";
            d[e + (Va ? "Origin" : "-origin")] = d.transformOrigin = b * 100 + "% " + c + "px";
            M(this.element, d)
        }, getSpanCorrection: function (a, b, c) {
            this.xCorr = -a * c;
            this.yCorr = -b
        }
    });
    w(ma.prototype, {
        html: function (a,
                        b, c) {
            var d = this.createElement("span"), e = d.element, f = d.renderer;
            d.textSetter = function (a) {
                a !== e.innerHTML && delete this.bBox;
                e.innerHTML = this.textStr = a
            };
            d.xSetter = d.ySetter = d.alignSetter = d.rotationSetter = function (a, b) {
                b === "align" && (b = "textAlign");
                d[b] = a;
                d.htmlUpdateTransform()
            };
            d.attr({text: a, x: u(b), y: u(c)}).css({
                position: "absolute",
                fontFamily: this.style.fontFamily,
                fontSize: this.style.fontSize
            });
            e.style.whiteSpace = "nowrap";
            d.css = d.htmlCss;
            if (f.isSVG) d.add = function (a) {
                var b, c = f.box.parentNode, j = [];
                if (this.parentGroup =
                        a) {
                    if (b = a.div, !b) {
                        for (; a;) j.push(a), a = a.parentGroup;
                        n(j.reverse(), function (a) {
                            var d;
                            b = a.div = a.div || $(Ua, {className: V(a.element, "class")}, {
                                position: "absolute",
                                left: (a.translateX || 0) + "px",
                                top: (a.translateY || 0) + "px"
                            }, b || c);
                            d = b.style;
                            w(a, {
                                translateXSetter: function (b, c) {
                                    d.left = b + "px";
                                    a[c] = b;
                                    a.doTransform = !0
                                }, translateYSetter: function (b, c) {
                                    d.top = b + "px";
                                    a[c] = b;
                                    a.doTransform = !0
                                }, visibilitySetter: function (a, b) {
                                    d[b] = a
                                }
                            })
                        })
                    }
                } else b = c;
                b.appendChild(e);
                d.added = !0;
                d.alignOnAdd && d.htmlUpdateTransform();
                return d
            };
            return d
        }
    });
    var ib;
    if (!da && !la) H = {
        init: function (a, b) {
            var c = ["<", b, ' filled="f" stroked="f"'], d = ["position: ", "absolute", ";"], e = b === Ua;
            (b === "shape" || e) && d.push("left:0;top:0;width:1px;height:1px;");
            d.push("visibility: ", e ? "hidden" : "visible");
            c.push(' style="', d.join(""), '"/>');
            if (b) c = e || b === "span" || b === "img" ? c.join("") : a.prepVML(c), this.element = $(c);
            this.renderer = a
        }, add: function (a) {
            var b = this.renderer, c = this.element, d = b.box, d = a ? a.element || a : d;
            a && a.inverted && b.invertChild(c, d);
            d.appendChild(c);
            this.added =
                !0;
            this.alignOnAdd && !this.deferUpdateTransform && this.updateTransform();
            if (this.onAdd) this.onAdd();
            return this
        }, updateTransform: Y.prototype.htmlUpdateTransform, setSpanRotation: function () {
            var a = this.rotation, b = aa(a * qa), c = fa(a * qa);
            M(this.element, {filter: a ? ["progid:DXImageTransform.Microsoft.Matrix(M11=", b, ", M12=", -c, ", M21=", c, ", M22=", b, ", sizingMethod='auto expand')"].join("") : Z})
        }, getSpanCorrection: function (a, b, c, d, e) {
            var f = d ? aa(d * qa) : 1, g = d ? fa(d * qa) : 0, h = p(this.elemHeight, this.element.offsetHeight),
                i;
            this.xCorr = f < 0 && -a;
            this.yCorr = g < 0 && -h;
            i = f * g < 0;
            this.xCorr += g * b * (i ? 1 - c : c);
            this.yCorr -= f * b * (d ? i ? c : 1 - c : 1);
            e && e !== "left" && (this.xCorr -= a * c * (f < 0 ? -1 : 1), d && (this.yCorr -= h * c * (g < 0 ? -1 : 1)), M(this.element, {textAlign: e}))
        }, pathToVML: function (a) {
            for (var b = a.length, c = []; b--;) if (ra(a[b])) c[b] = u(a[b] * 10) - 5; else if (a[b] === "Z") c[b] = "x"; else if (c[b] = a[b], a.isArc && (a[b] === "wa" || a[b] === "at")) c[b + 5] === c[b + 7] && (c[b + 7] += a[b + 7] > a[b + 5] ? 1 : -1), c[b + 6] === c[b + 8] && (c[b + 8] += a[b + 8] > a[b + 6] ? 1 : -1);
            return c.join(" ") || "x"
        }, clip: function (a) {
            var b =
                this, c;
            a ? (c = a.members, ta(c, b), c.push(b), b.destroyClip = function () {
                ta(c, b)
            }, a = a.getCSS(b)) : (b.destroyClip && b.destroyClip(), a = {clip: nb ? "inherit" : "rect(auto)"});
            return b.css(a)
        }, css: Y.prototype.htmlCss, safeRemoveChild: function (a) {
            a.parentNode && Ta(a)
        }, destroy: function () {
            this.destroyClip && this.destroyClip();
            return Y.prototype.destroy.apply(this)
        }, on: function (a, b) {
            this.element["on" + a] = function () {
                var a = S.event;
                a.target = a.srcElement;
                b(a)
            };
            return this
        }, cutOffPath: function (a, b) {
            var c, a = a.split(/[ ,]/);
            c = a.length;
            if (c === 9 || c === 11) a[c - 4] = a[c - 2] = L(a[c - 2]) - 10 * b;
            return a.join(" ")
        }, shadow: function (a, b, c) {
            var d = [], e, f = this.element, g = this.renderer, h, i = f.style, j, k = f.path, m, l, o, q;
            k && typeof k.value !== "string" && (k = "x");
            l = k;
            if (a) {
                o = p(a.width, 3);
                q = (a.opacity || 0.15) / o;
                for (e = 1; e <= 3; e++) {
                    m = o * 2 + 1 - 2 * e;
                    c && (l = this.cutOffPath(k.value, m + 0.5));
                    j = ['<shape isShadow="true" strokeweight="', m, '" filled="false" path="', l, '" coordsize="10 10" style="', f.style.cssText, '" />'];
                    h = $(g.prepVML(j), null, {
                        left: L(i.left) + p(a.offsetX, 1), top: L(i.top) +
                        p(a.offsetY, 1)
                    });
                    if (c) h.cutOff = m + 1;
                    j = ['<stroke color="', a.color || "black", '" opacity="', q * e, '"/>'];
                    $(g.prepVML(j), null, null, h);
                    b ? b.element.appendChild(h) : f.parentNode.insertBefore(h, f);
                    d.push(h)
                }
                this.shadows = d
            }
            return this
        }, updateShadows: ga, setAttr: function (a, b) {
            nb ? this.element[a] = b : this.element.setAttribute(a, b)
        }, classSetter: function (a) {
            this.element.className = a
        }, dashstyleSetter: function (a, b, c) {
            (c.getElementsByTagName("stroke")[0] || $(this.renderer.prepVML(["<stroke/>"]), null, null, c))[b] = a || "solid";
            this[b] = a
        }, dSetter: function (a, b, c) {
            var d = this.shadows, a = a || [];
            this.d = a.join && a.join(" ");
            c.path = a = this.pathToVML(a);
            if (d) for (c = d.length; c--;) d[c].path = d[c].cutOff ? this.cutOffPath(a, d[c].cutOff) : a;
            this.setAttr(b, a)
        }, fillSetter: function (a, b, c) {
            var d = c.nodeName;
            if (d === "SPAN") c.style.color = a; else if (d !== "IMG") c.filled = a !== Z, this.setAttr("fillcolor", this.renderer.color(a, c, b, this))
        }, opacitySetter: ga, rotationSetter: function (a, b, c) {
            c = c.style;
            this[b] = c[b] = a;
            c.left = -u(fa(a * qa) + 1) + "px";
            c.top = u(aa(a * qa)) + "px"
        },
        strokeSetter: function (a, b, c) {
            this.setAttr("strokecolor", this.renderer.color(a, c, b))
        }, "stroke-widthSetter": function (a, b, c) {
            c.stroked = !!a;
            this[b] = a;
            ra(a) && (a += "px");
            this.setAttr("strokeweight", a)
        }, titleSetter: function (a, b) {
            this.setAttr(b, a)
        }, visibilitySetter: function (a, b, c) {
            a === "inherit" && (a = "visible");
            this.shadows && n(this.shadows, function (c) {
                c.style[b] = a
            });
            c.nodeName === "DIV" && (a = a === "hidden" ? "-999em" : 0, nb || (c.style[b] = a ? "visible" : "hidden"), b = "top");
            c.style[b] = a
        }, xSetter: function (a, b, c) {
            this[b] = a;
            b ===
            "x" ? b = "left" : b === "y" && (b = "top");
            this.updateClipping ? (this[b] = a, this.updateClipping()) : c.style[b] = a
        }, zIndexSetter: function (a, b, c) {
            c.style[b] = a
        }
    }, A.VMLElement = H = ia(Y, H), H.prototype.ySetter = H.prototype.widthSetter = H.prototype.heightSetter = H.prototype.xSetter, H = {
        Element: H, isIE8: Ga.indexOf("MSIE 8.0") > -1, init: function (a, b, c, d) {
            var e;
            this.alignedObjects = [];
            d = this.createElement(Ua).css(w(this.getStyle(d), {position: "relative"}));
            e = d.element;
            a.appendChild(d.element);
            this.isVML = !0;
            this.box = e;
            this.boxWrapper =
                d;
            this.cache = {};
            this.setSize(b, c, !1);
            if (!C.namespaces.hcv) {
                C.namespaces.add("hcv", "urn:schemas-microsoft-com:vml");
                try {
                    C.createStyleSheet().cssText = "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "
                } catch (f) {
                    C.styleSheets[0].cssText += "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "
                }
            }
        }, isHidden: function () {
            return !this.box.offsetWidth
        }, clipRect: function (a, b, c, d) {
            var e = this.createElement(),
                f = ha(a);
            return w(e, {
                members: [],
                count: 0,
                left: (f ? a.x : a) + 1,
                top: (f ? a.y : b) + 1,
                width: (f ? a.width : c) - 1,
                height: (f ? a.height : d) - 1,
                getCSS: function (a) {
                    var b = a.element, c = b.nodeName, a = a.inverted, d = this.top - (c === "shape" ? b.offsetTop : 0),
                        e = this.left, b = e + this.width, f = d + this.height,
                        d = {clip: "rect(" + u(a ? e : d) + "px," + u(a ? f : b) + "px," + u(a ? b : f) + "px," + u(a ? d : e) + "px)"};
                    !a && nb && c === "DIV" && w(d, {width: b + "px", height: f + "px"});
                    return d
                },
                updateClipping: function () {
                    n(e.members, function (a) {
                        a.element && a.css(e.getCSS(a))
                    })
                }
            })
        }, color: function (a,
                            b, c, d) {
            var e = this, f, g = /^rgba/, h, i, j = Z;
            a && a.linearGradient ? i = "gradient" : a && a.radialGradient && (i = "pattern");
            if (i) {
                var k, m, l = a.linearGradient || a.radialGradient, o, q, r, G, p, t = "", a = a.stops, y, na = [],
                    s = function () {
                        h = ['<fill colors="' + na.join(",") + '" opacity="', r, '" o:opacity2="', q, '" type="', i, '" ', t, 'focus="100%" method="any" />'];
                        $(e.prepVML(h), null, null, b)
                    };
                o = a[0];
                y = a[a.length - 1];
                o[0] > 0 && a.unshift([0, o[1]]);
                y[0] < 1 && a.push([1, y[1]]);
                n(a, function (a, b) {
                    g.test(a[1]) ? (f = va(a[1]), k = f.get("rgb"), m = f.get("a")) : (k =
                        a[1], m = 1);
                    na.push(a[0] * 100 + "% " + k);
                    b ? (r = m, G = k) : (q = m, p = k)
                });
                if (c === "fill") if (i === "gradient") c = l.x1 || l[0] || 0, a = l.y1 || l[1] || 0, o = l.x2 || l[2] || 0, l = l.y2 || l[3] || 0, t = 'angle="' + (90 - X.atan((l - a) / (o - c)) * 180 / ua) + '"', s(); else {
                    var j = l.r, v = j * 2, x = j * 2, u = l.cx, w = l.cy, z = b.radialReference, B, j = function () {
                        z && (B = d.getBBox(), u += (z[0] - B.x) / B.width - 0.5, w += (z[1] - B.y) / B.height - 0.5, v *= z[2] / B.width, x *= z[2] / B.height);
                        t = 'src="' + P.global.VMLRadialGradientURL + '" size="' + v + "," + x + '" origin="0.5,0.5" position="' + u + "," + w + '" color2="' + p +
                            '" ';
                        s()
                    };
                    d.added ? j() : d.onAdd = j;
                    j = G
                } else j = k
            } else if (g.test(a) && b.tagName !== "IMG") f = va(a), h = ["<", c, ' opacity="', f.get("a"), '"/>'], $(this.prepVML(h), null, null, b), j = f.get("rgb"); else {
                j = b.getElementsByTagName(c);
                if (j.length) j[0].opacity = 1, j[0].type = "solid";
                j = a
            }
            return j
        }, prepVML: function (a) {
            var b = this.isIE8, a = a.join("");
            b ? (a = a.replace("/>", ' xmlns="urn:schemas-microsoft-com:vml" />'), a = a.indexOf('style="') === -1 ? a.replace("/>", ' style="display:inline-block;behavior:url(#default#VML);" />') : a.replace('style="',
                'style="display:inline-block;behavior:url(#default#VML);')) : a = a.replace("<", "<hcv:");
            return a
        }, text: ma.prototype.html, path: function (a) {
            var b = {coordsize: "10 10"};
            Ka(a) ? b.d = a : ha(a) && w(b, a);
            return this.createElement("shape").attr(b)
        }, circle: function (a, b, c) {
            var d = this.symbol("circle");
            if (ha(a)) c = a.r, b = a.y, a = a.x;
            d.isCircle = !0;
            d.r = c;
            return d.attr({x: a, y: b})
        }, g: function (a) {
            var b;
            a && (b = {className: "highcharts-" + a, "class": "highcharts-" + a});
            return this.createElement(Ua).attr(b)
        }, image: function (a, b, c, d, e) {
            var f =
                this.createElement("img").attr({src: a});
            arguments.length > 1 && f.attr({x: b, y: c, width: d, height: e});
            return f
        }, createElement: function (a) {
            return a === "rect" ? this.symbol(a) : ma.prototype.createElement.call(this, a)
        }, invertChild: function (a, b) {
            var c = this, d = b.style, e = a.tagName === "IMG" && a.style;
            M(a, {
                flip: "x",
                left: L(d.width) - (e ? L(e.top) : 1),
                top: L(d.height) - (e ? L(e.left) : 1),
                rotation: -90
            });
            n(a.childNodes, function (b) {
                c.invertChild(b, a)
            })
        }, symbols: {
            arc: function (a, b, c, d, e) {
                var f = e.start, g = e.end, h = e.r || c || d, c = e.innerR, d =
                    aa(f), i = fa(f), j = aa(g), k = fa(g);
                if (g - f === 0) return ["x"];
                f = ["wa", a - h, b - h, a + h, b + h, a + h * d, b + h * i, a + h * j, b + h * k];
                e.open && !c && f.push("e", "M", a, b);
                f.push("at", a - c, b - c, a + c, b + c, a + c * j, b + c * k, a + c * d, b + c * i, "x", "e");
                f.isArc = !0;
                return f
            }, circle: function (a, b, c, d, e) {
                e && (c = d = 2 * e.r);
                e && e.isCircle && (a -= c / 2, b -= d / 2);
                return ["wa", a, b, a + c, b + d, a + c, b + d / 2, a + c, b + d / 2, "e"]
            }, rect: function (a, b, c, d, e) {
                return ma.prototype.symbols[!v(e) || !e.r ? "square" : "callout"].call(0, a, b, c, d, e)
            }
        }
    }, A.VMLRenderer = ib = function () {
        this.init.apply(this, arguments)
    },
        ib.prototype = z(ma.prototype, H), Wa = ib;
    ma.prototype.measureSpanWidth = function (a, b) {
        var c = C.createElement("span"), d;
        d = C.createTextNode(a);
        c.appendChild(d);
        M(c, b);
        this.box.appendChild(c);
        d = c.offsetWidth;
        Ta(c);
        return d
    };
    var Wb;
    if (la) A.CanVGRenderer = H = function () {
        Ha = "http://www.w3.org/1999/xhtml"
    }, H.prototype.symbols = {}, Wb = function () {
        function a() {
            var a = b.length, d;
            for (d = 0; d < a; d++) b[d]();
            b = []
        }

        var b = [];
        return {
            push: function (c, d) {
                b.length === 0 && bc(d, a);
                b.push(c)
            }
        }
    }(), Wa = H;
    Za.prototype = {
        addLabel: function () {
            var a =
                    this.axis, b = a.options, c = a.chart, d = a.categories, e = a.names, f = this.pos, g = b.labels,
                h = a.tickPositions, i = f === h[0], j = f === h[h.length - 1], e = d ? p(d[f], e[f], f) : f,
                d = this.label, h = h.info, k;
            a.isDatetimeAxis && h && (k = b.dateTimeLabelFormats[h.higherRanks[f] || h.unitName]);
            this.isFirst = i;
            this.isLast = j;
            b = a.labelFormatter.call({
                axis: a,
                chart: c,
                isFirst: i,
                isLast: j,
                dateTimeLabelFormat: k,
                value: a.isLog ? ka(sa(e)) : e
            });
            v(d) ? d && d.attr({text: b}) : (this.labelLength = (this.label = d = v(b) && g.enabled ? c.renderer.text(b, 0, 0, g.useHTML).css(z(g.style)).add(a.labelGroup) :
                null) && d.getBBox().width, this.rotation = 0)
        }, getLabelSize: function () {
            return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0
        }, handleOverflow: function (a) {
            var b = this.axis, c = a.x, d = b.chart.chartWidth, e = b.chart.spacing, f = p(b.labelLeft, e[3]),
                e = p(b.labelRight, d - e[1]), g = this.label, h = this.rotation,
                i = {left: 0, center: 0.5, right: 1}[b.labelAlign], j = g.getBBox().width, k = b.slotWidth, m = 1, l;
            if (h) h < 0 && c - i * j < f ? l = u(c / aa(h * qa) - f) : h > 0 && c + i * j > e && (l = u((d - c) / aa(h * qa))); else if (d = c + (1 - i) * j, c - i * j < f ? k = a.x + k * (1 -
                    i) - f : d > e && (k = e - a.x + k * i, m = -1), k = B(b.slotWidth, k), k < b.slotWidth && b.labelAlign === "center" && (a.x += m * (b.slotWidth - k - i * (b.slotWidth - B(j, k)))), j > k || b.autoRotation && g.styles.width) l = k;
            l && g.css({width: l, textOverflow: "ellipsis"})
        }, getPosition: function (a, b, c, d) {
            var e = this.axis, f = e.chart, g = d && f.oldChartHeight || f.chartHeight;
            return {
                x: a ? e.translate(b + c, null, null, d) + e.transB : e.left + e.offset + (e.opposite ? (d && f.oldChartWidth || f.chartWidth) - e.right - e.left : 0),
                y: a ? g - e.bottom + e.offset - (e.opposite ? e.height : 0) : g - e.translate(b +
                    c, null, null, d) - e.transB
            }
        }, getLabelPosition: function (a, b, c, d, e, f, g, h) {
            var i = this.axis, j = i.transA, k = i.reversed, m = i.staggerLines, l = i.tickRotCorr || {x: 0, y: 0},
                c = p(e.y, l.y + (i.side === 2 ? 8 : -(c.getBBox().height / 2))),
                a = a + e.x + l.x - (f && d ? f * j * (k ? -1 : 1) : 0),
                b = b + c - (f && !d ? f * j * (k ? 1 : -1) : 0);
            m && (b += g / (h || 1) % m * (i.labelOffset / m));
            return {x: a, y: u(b)}
        }, getMarkPath: function (a, b, c, d, e, f) {
            return f.crispLine(["M", a, b, "L", a + (e ? 0 : -c), b + (e ? c : 0)], d)
        }, render: function (a, b, c) {
            var d = this.axis, e = d.options, f = d.chart.renderer, g = d.horiz, h = this.type,
                i = this.label, j = this.pos, k = e.labels, m = this.gridLine, l = h ? h + "Grid" : "grid",
                o = h ? h + "Tick" : "tick", q = e[l + "LineWidth"], r = e[l + "LineColor"], G = e[l + "LineDashStyle"],
                n = e[o + "Length"], l = e[o + "Width"] || 0, t = e[o + "Color"], y = e[o + "Position"], o = this.mark,
                na = k.step, v = !0, x = d.tickmarkOffset, u = this.getPosition(g, j, x, b), w = u.x, u = u.y,
                z = g && w === d.pos + d.len || !g && u === d.pos ? -1 : 1, c = p(c, 1);
            this.isActive = !0;
            if (q) {
                j = d.getPlotLinePath(j + x, q * z, b, !0);
                if (m === s) {
                    m = {stroke: r, "stroke-width": q};
                    if (G) m.dashstyle = G;
                    if (!h) m.zIndex = 1;
                    if (b) m.opacity =
                        0;
                    this.gridLine = m = q ? f.path(j).attr(m).add(d.gridGroup) : null
                }
                if (!b && m && j) m[this.isNew ? "attr" : "animate"]({d: j, opacity: c})
            }
            if (l && n) y === "inside" && (n = -n), d.opposite && (n = -n), h = this.getMarkPath(w, u, n, l * z, g, f), o ? o.animate({
                d: h,
                opacity: c
            }) : this.mark = f.path(h).attr({stroke: t, "stroke-width": l, opacity: c}).add(d.axisGroup);
            if (i && !isNaN(w)) i.xy = u = this.getLabelPosition(w, u, i, g, k, x, a, na), this.isFirst && !this.isLast && !p(e.showFirstLabel, 1) || this.isLast && !this.isFirst && !p(e.showLastLabel, 1) ? v = !1 : g && !d.isRadial && !k.step &&
                !k.rotation && !b && c !== 0 && this.handleOverflow(u), na && a % na && (v = !1), v && !isNaN(u.y) ? (u.opacity = c, i[this.isNew ? "attr" : "animate"](u), this.isNew = !1) : i.attr("y", -9999)
        }, destroy: function () {
            Na(this, this.axis)
        }
    };
    A.PlotLineOrBand = function (a, b) {
        this.axis = a;
        if (b) this.options = b, this.id = b.id
    };
    A.PlotLineOrBand.prototype = {
        render: function () {
            var a = this, b = a.axis, c = b.horiz, d = a.options, e = d.label, f = a.label, g = d.width, h = d.to,
                i = d.from, j = v(i) && v(h), k = d.value, m = d.dashStyle, l = a.svgElem, o = [], q, r = d.color,
                G = d.zIndex, n = d.events, t =
                    {}, p = b.chart.renderer;
            b.isLog && (i = La(i), h = La(h), k = La(k));
            if (g) {
                if (o = b.getPlotLinePath(k, g), t = {stroke: r, "stroke-width": g}, m) t.dashstyle = m
            } else if (j) {
                o = b.getPlotBandPath(i, h, d);
                if (r) t.fill = r;
                if (d.borderWidth) t.stroke = d.borderColor, t["stroke-width"] = d.borderWidth
            } else return;
            if (v(G)) t.zIndex = G;
            if (l) if (o) l.animate({d: o}, null, l.onGetPath); else {
                if (l.hide(), l.onGetPath = function () {
                        l.show()
                    }, f) a.label = f = f.destroy()
            } else if (o && o.length && (a.svgElem = l = p.path(o).attr(t).add(), n)) for (q in d = function (b) {
                l.on(b,
                    function (c) {
                        n[b].apply(a, [c])
                    })
            }, n) d(q);
            if (e && v(e.text) && o && o.length && b.width > 0 && b.height > 0) {
                e = z({
                    align: c && j && "center",
                    x: c ? !j && 4 : 10,
                    verticalAlign: !c && j && "middle",
                    y: c ? j ? 16 : 10 : j ? 6 : -4,
                    rotation: c && !j && 90
                }, e);
                if (!f) {
                    t = {align: e.textAlign || e.align, rotation: e.rotation};
                    if (v(G)) t.zIndex = G;
                    a.label = f = p.text(e.text, 0, 0, e.useHTML).attr(t).css(e.style).add()
                }
                b = [o[1], o[4], j ? o[6] : o[1]];
                j = [o[2], o[5], j ? o[7] : o[2]];
                o = Sa(b);
                c = Sa(j);
                f.align(e, !1, {x: o, y: c, width: Ea(b) - o, height: Ea(j) - c});
                f.show()
            } else f && f.hide();
            return a
        },
        destroy: function () {
            ta(this.axis.plotLinesAndBands, this);
            delete this.axis;
            Na(this)
        }
    };
    var J = A.Axis = function () {
        this.init.apply(this, arguments)
    };
    J.prototype = {
        defaultOptions: {
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L",
                second: "%H:%M:%S",
                minute: "%H:%M",
                hour: "%H:%M",
                day: "%e. %b",
                week: "%e. %b",
                month: "%b '%y",
                year: "%Y"
            },
            endOnTick: !1,
            gridLineColor: "#e5e5e5",
            labels: {enabled: !0, style: {color: "#606060", cursor: "default", fontSize: "11px"}, x: 0, y: 15},
            lineColor: "#fff",
            lineWidth: 1,
            minPadding: 0.01,
            maxPadding: 0.01,
            minorGridLineColor: "#E0E0E0",
            minorGridLineWidth: 1,
            minorTickColor: "#A0A0A0",
            minorTickLength: 2,
            minorTickPosition: "outside",
            startOfWeek: 1,
            startOnTick: !1,
            tickColor: "#fff",
            tickLength: 10,
            tickmarkPlacement: "between",
            tickPixelInterval: 100,
            tickPosition: "outside",
            tickWidth: 1,
            title: {align: "middle", style: {color: "#707070"}},
            type: "linear"
        },
        defaultYAxisOptions: {
            endOnTick: !0,
            gridLineWidth: 1,
            tickPixelInterval: 72,
            showLastLabel: !0,
            labels: {x: -8, y: 3},
            lineWidth: 0,
            maxPadding: 0.05,
            minPadding: 0.05,
            startOnTick: !0,
            tickWidth: 0,
            title: {rotation: 270, text: "Values"},
            stackLabels: {
                enabled: !1, formatter: function () {
                    return A.numberFormat(this.total, -1)
                }, style: z(U.line.dataLabels.style, {color: "#000000"})
            }
        },
        defaultLeftAxisOptions: {labels: {x: -15, y: null}, title: {rotation: 270}},
        defaultRightAxisOptions: {labels: {x: 15, y: null}, title: {rotation: 90}},
        defaultBottomAxisOptions: {labels: {autoRotation: [-45], x: 0, y: null}, title: {rotation: 0}},
        defaultTopAxisOptions: {labels: {autoRotation: [-45], x: 0, y: -15}, title: {rotation: 0}},
        init: function (a, b) {
            var c = b.isX;
            this.horiz = a.inverted ? !c : c;
            this.coll = (this.isXAxis = c) ? "xAxis" : "yAxis";
            this.opposite = b.opposite;
            this.side = b.side || (this.horiz ? this.opposite ? 0 : 2 : this.opposite ? 1 : 3);
            this.setOptions(b);
            var d = this.options, e = d.type;
            this.labelFormatter = d.labels.formatter || this.defaultLabelFormatter;
            this.userOptions = b;
            this.minPixelPadding = 0;
            this.chart = a;
            this.reversed = d.reversed;
            this.zoomEnabled = d.zoomEnabled !== !1;
            this.categories = d.categories || e === "category";
            this.names = this.names || [];
            this.isLog = e === "logarithmic";
            this.isDatetimeAxis =
                e === "datetime";
            this.isLinked = v(d.linkedTo);
            this.ticks = {};
            this.labelEdge = [];
            this.minorTicks = {};
            this.plotLinesAndBands = [];
            this.alternateBands = {};
            this.len = 0;
            this.minRange = this.userMinRange = d.minRange || d.maxZoom;
            this.range = d.range;
            this.offset = d.offset || 0;
            this.stacks = {};
            this.oldStacks = {};
            this.min = this.max = null;
            this.crosshair = p(d.crosshair, oa(a.options.tooltip.crosshairs)[c ? 0 : 1], !1);
            var f, d = this.options.events;
            Oa(this, a.axes) === -1 && (c && !this.isColorAxis ? a.axes.splice(a.xAxis.length, 0, this) : a.axes.push(this),
                a[this.coll].push(this));
            this.series = this.series || [];
            if (a.inverted && c && this.reversed === s) this.reversed = !0;
            this.removePlotLine = this.removePlotBand = this.removePlotBandOrLine;
            for (f in d) D(this, f, d[f]);
            if (this.isLog) this.val2lin = La, this.lin2val = sa
        },
        setOptions: function (a) {
            this.options = z(this.defaultOptions, this.isXAxis ? {} : this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], z(P[this.coll], a))
        },
        defaultLabelFormatter: function () {
            var a =
                    this.axis, b = this.value, c = a.categories, d = this.dateTimeLabelFormat, e = P.lang.numericSymbols,
                f = e && e.length, g, h = a.options.labels.format, a = a.isLog ? b : a.tickInterval;
            if (h) g = Ma(h, this); else if (c) g = b; else if (d) g = ja(d, b); else if (f && a >= 1E3) for (; f-- && g === s;) c = Math.pow(1E3, f + 1), a >= c && e[f] !== null && (g = A.numberFormat(b / c, -1) + e[f]);
            g === s && (g = Q(b) >= 1E4 ? A.numberFormat(b, 0) : A.numberFormat(b, -1, s, ""));
            return g
        },
        getSeriesExtremes: function () {
            var a = this, b = a.chart;
            a.hasVisibleSeries = !1;
            a.dataMin = a.dataMax = a.ignoreMinPadding =
                a.ignoreMaxPadding = null;
            a.buildStacks && a.buildStacks();
            n(a.series, function (c) {
                if (c.visible || !b.options.chart.ignoreHiddenSeries) {
                    var d;
                    d = c.options.threshold;
                    var e;
                    a.hasVisibleSeries = !0;
                    a.isLog && d <= 0 && (d = null);
                    if (a.isXAxis) {
                        if (d = c.xData, d.length) a.dataMin = B(p(a.dataMin, d[0]), Sa(d)), a.dataMax = x(p(a.dataMax, d[0]), Ea(d))
                    } else {
                        c.getExtremes();
                        e = c.dataMax;
                        c = c.dataMin;
                        if (v(c) && v(e)) a.dataMin = B(p(a.dataMin, c), c), a.dataMax = x(p(a.dataMax, e), e);
                        if (v(d)) if (a.dataMin >= d) a.dataMin = d, a.ignoreMinPadding = !0; else if (a.dataMax <
                            d) a.dataMax = d, a.ignoreMaxPadding = !0
                    }
                }
            })
        },
        translate: function (a, b, c, d, e, f) {
            var g = this.linkedParent || this, h = 1, i = 0, j = d ? g.oldTransA : g.transA, d = d ? g.oldMin : g.min,
                k = g.minPixelPadding, e = (g.doPostTranslate || g.isLog && e) && g.lin2val;
            if (!j) j = g.transA;
            if (c) h *= -1, i = g.len;
            g.reversed && (h *= -1, i -= h * (g.sector || g.len));
            b ? (a = a * h + i, a -= k, a = a / j + d, e && (a = g.lin2val(a))) : (e && (a = g.val2lin(a)), f === "between" && (f = 0.5), a = h * (a - d) * j + i + h * k + (ra(f) ? j * f * g.pointRange : 0));
            return a
        },
        toPixels: function (a, b) {
            return this.translate(a, !1, !this.horiz,
                null, !0) + (b ? 0 : this.pos)
        },
        toValue: function (a, b) {
            return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0)
        },
        getPlotLinePath: function (a, b, c, d, e) {
            var f = this.chart, g = this.left, h = this.top, i, j, k = c && f.oldChartHeight || f.chartHeight,
                m = c && f.oldChartWidth || f.chartWidth, l;
            i = this.transB;
            var o = function (a, b, c) {
                if (a < b || a > c) d ? a = B(x(b, a), c) : l = !0;
                return a
            }, e = p(e, this.translate(a, null, null, c)), a = c = u(e + i);
            i = j = u(k - e - i);
            isNaN(e) ? l = !0 : this.horiz ? (i = h, j = k - this.bottom, a = c = o(a, g, g + this.width)) : (a = g, c = m - this.right, i = j = o(i,
                h, h + this.height));
            return l && !d ? null : f.renderer.crispLine(["M", a, i, "L", c, j], b || 1)
        },
        getLinearTickPositions: function (a, b, c) {
            var d, e = ka(W(b / a) * a), f = ka(ya(c / a) * a), g = [];
            if (b === c && ra(b)) return [b];
            for (b = e; b <= f;) {
                g.push(b);
                b = ka(b + a);
                if (b === d) break;
                d = b
            }
            return g
        },
        getMinorTickPositions: function () {
            var a = this.options, b = this.tickPositions, c = this.minorTickInterval, d = [], e, f = this.min;
            e = this.max;
            var g = e - f;
            if (g && g / c < this.len / 3) if (this.isLog) {
                a = b.length;
                for (e = 1; e < a; e++) d = d.concat(this.getLogTickPositions(c, b[e - 1], b[e],
                    !0))
            } else if (this.isDatetimeAxis && a.minorTickInterval === "auto") d = d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c), f, e, a.startOfWeek)); else for (b = f + (b[0] - f) % c; b <= e; b += c) d.push(b);
            this.trimTicks(d);
            return d
        },
        adjustForMinRange: function () {
            var a = this.options, b = this.min, c = this.max, d, e = this.dataMax - this.dataMin >= this.minRange, f, g,
                h, i, j;
            if (this.isXAxis && this.minRange === s && !this.isLog) v(a.min) || v(a.max) ? this.minRange = null : (n(this.series, function (a) {
                i = a.xData;
                for (g = j = a.xIncrement ? 1 : i.length - 1; g >
                0; g--) if (h = i[g] - i[g - 1], f === s || h < f) f = h
            }), this.minRange = B(f * 5, this.dataMax - this.dataMin));
            if (c - b < this.minRange) {
                var k = this.minRange;
                d = (k - c + b) / 2;
                d = [b - d, p(a.min, b - d)];
                if (e) d[2] = this.dataMin;
                b = Ea(d);
                c = [b + k, p(a.max, b + k)];
                if (e) c[2] = this.dataMax;
                c = Sa(c);
                c - b < k && (d[0] = c - k, d[1] = p(a.min, c - k), b = Ea(d))
            }
            this.min = b;
            this.max = c
        },
        setAxisTranslation: function (a) {
            var b = this, c = b.max - b.min, d = b.axisPointRange || 0, e, f = 0, g = 0, h = b.linkedParent,
                i = !!b.categories, j = b.transA, k = b.isXAxis;
            if (k || i || d) if (h ? (f = h.minPointOffset, g = h.pointRangePadding) :
                    n(b.series, function (a) {
                        var h = i ? 1 : k ? a.pointRange : b.axisPointRange || 0, j = a.options.pointPlacement,
                            q = a.closestPointRange;
                        h > c && (h = 0);
                        d = x(d, h);
                        b.single || (f = x(f, Ja(j) ? 0 : h / 2), g = x(g, j === "on" ? 0 : h));
                        !a.noSharedTooltip && v(q) && (e = v(e) ? B(e, q) : q)
                    }), h = b.ordinalSlope && e ? b.ordinalSlope / e : 1, b.minPointOffset = f *= h, b.pointRangePadding = g *= h, b.pointRange = B(d, c), k) b.closestPointRange = e;
            if (a) b.oldTransA = j;
            b.translationSlope = b.transA = j = b.len / (c + g || 1);
            b.transB = b.horiz ? b.left : b.bottom;
            b.minPixelPadding = j * f
        },
        setTickInterval: function (a) {
            var b =
                    this, c = b.chart, d = b.options, e = b.isLog, f = b.isDatetimeAxis, g = b.isXAxis, h = b.isLinked,
                i = d.maxPadding, j = d.minPadding, k = d.tickInterval, m = d.tickPixelInterval, l = b.categories;
            !f && !l && !h && this.getTickAmount();
            h ? (b.linkedParent = c[b.coll][d.linkedTo], c = b.linkedParent.getExtremes(), b.min = p(c.min, c.dataMin), b.max = p(c.max, c.dataMax), d.type !== b.linkedParent.options.type && pa(11, 1)) : (b.min = p(b.userMin, d.min, b.dataMin), b.max = p(b.userMax, d.max, b.dataMax));
            if (e) !a && B(b.min, p(b.dataMin, b.min)) <= 0 && pa(10, 1), b.min = ka(La(b.min)),
                b.max = ka(La(b.max));
            if (b.range && v(b.max)) b.userMin = b.min = x(b.min, b.max - b.range), b.userMax = b.max, b.range = null;
            b.beforePadding && b.beforePadding();
            b.adjustForMinRange();
            if (!l && !b.axisPointRange && !b.usePercentage && !h && v(b.min) && v(b.max) && (c = b.max - b.min)) {
                if (!v(d.min) && !v(b.userMin) && j && (b.dataMin < 0 || !b.ignoreMinPadding)) b.min -= c * j;
                if (!v(d.max) && !v(b.userMax) && i && (b.dataMax > 0 || !b.ignoreMaxPadding)) b.max += c * i
            }
            if (ra(d.floor)) b.min = x(b.min, d.floor);
            if (ra(d.ceiling)) b.max = B(b.max, d.ceiling);
            b.tickInterval =
                b.min === b.max || b.min === void 0 || b.max === void 0 ? 1 : h && !k && m === b.linkedParent.options.tickPixelInterval ? k = b.linkedParent.tickInterval : p(k, this.tickAmount ? (b.max - b.min) / x(this.tickAmount - 1, 1) : void 0, l ? 1 : (b.max - b.min) * m / x(b.len, m));
            g && !a && n(b.series, function (a) {
                a.processData(b.min !== b.oldMin || b.max !== b.oldMax)
            });
            b.setAxisTranslation(!0);
            b.beforeSetTickPositions && b.beforeSetTickPositions();
            if (b.postProcessTickInterval) b.tickInterval = b.postProcessTickInterval(b.tickInterval);
            if (b.pointRange) b.tickInterval =
                x(b.pointRange, b.tickInterval);
            a = p(d.minTickInterval, b.isDatetimeAxis && b.closestPointRange);
            if (!k && b.tickInterval < a) b.tickInterval = a;
            if (!f && !e && !k) b.tickInterval = yb(b.tickInterval, null, xb(b.tickInterval), p(d.allowDecimals, !(b.tickInterval > 0.5 && b.tickInterval < 5 && b.max > 1E3 && b.max < 9999)), !!this.tickAmount);
            if (!this.tickAmount && this.len) b.tickInterval = b.unsquish();
            this.setTickPositions()
        },
        setTickPositions: function () {
            var a = this.options, b, c = a.tickPositions, d = a.tickPositioner, e = a.startOnTick, f = a.endOnTick,
                g;
            this.tickmarkOffset = this.categories && a.tickmarkPlacement === "between" && this.tickInterval === 1 ? 0.5 : 0;
            this.minorTickInterval = a.minorTickInterval === "auto" && this.tickInterval ? this.tickInterval / 5 : a.minorTickInterval;
            this.tickPositions = b = c && c.slice();
            if (!b && (this.tickPositions = b = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval,
                    this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), d && (d = d.apply(this, [this.min, this.max])))) this.tickPositions = b = d;
            if (!this.isLinked) this.trimTicks(b, e, f), this.min === this.max && v(this.min) && !this.tickAmount && (g = !0, this.min -= 0.5, this.max += 0.5), this.single = g, !c && !d && this.adjustTickAmount()
        },
        trimTicks: function (a, b, c) {
            var d = a[0], e = a[a.length - 1], f = this.minPointOffset || 0;
            b ? this.min = d : this.min - f > d && a.shift();
            c ? this.max = e : this.max + f < e && a.pop();
            a.length === 0 && v(d) && a.push((e +
                d) / 2)
        },
        getTickAmount: function () {
            var a = {}, b, c = this.options, d = c.tickAmount, e = c.tickPixelInterval;
            !v(c.tickInterval) && this.len < e && !this.isRadial && !this.isLog && c.startOnTick && c.endOnTick && (d = 2);
            !d && this.chart.options.chart.alignTicks !== !1 && c.alignTicks !== !1 && (n(this.chart[this.coll], function (c) {
                var d = c.options, e = c.horiz, d = [e ? d.left : d.top, e ? d.width : d.height, d.pane].join(",");
                a[d] ? c.series.length && (b = !0) : a[d] = 1
            }), b && (d = ya(this.len / e) + 1));
            if (d < 4) this.finalTickAmt = d, d = 5;
            this.tickAmount = d
        },
        adjustTickAmount: function () {
            var a =
                    this.tickInterval, b = this.tickPositions, c = this.tickAmount, d = this.finalTickAmt,
                e = b && b.length;
            if (e < c) {
                for (; b.length < c;) b.push(ka(b[b.length - 1] + a));
                this.transA *= (e - 1) / (c - 1);
                this.max = b[b.length - 1]
            } else e > c && (this.tickInterval *= 2, this.setTickPositions());
            if (v(d)) {
                for (a = c = b.length; a--;) (d === 3 && a % 2 === 1 || d <= 2 && a > 0 && a < c - 1) && b.splice(a, 1);
                this.finalTickAmt = s
            }
        },
        setScale: function () {
            var a = this.stacks, b, c, d, e;
            this.oldMin = this.min;
            this.oldMax = this.max;
            this.oldAxisLength = this.len;
            this.setAxisSize();
            e = this.len !== this.oldAxisLength;
            n(this.series, function (a) {
                if (a.isDirtyData || a.isDirty || a.xAxis.isDirty) d = !0
            });
            if (e || d || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax) {
                if (!this.isXAxis) for (b in a) for (c in a[b]) a[b][c].total = null, a[b][c].cum = 0;
                this.forceRedraw = !1;
                this.getSeriesExtremes();
                this.setTickInterval();
                this.oldUserMin = this.userMin;
                this.oldUserMax = this.userMax;
                if (!this.isDirty) this.isDirty = e || this.min !== this.oldMin || this.max !== this.oldMax
            } else if (!this.isXAxis) {
                if (this.oldStacks) a =
                    this.stacks = this.oldStacks;
                for (b in a) for (c in a[b]) a[b][c].cum = a[b][c].total
            }
        },
        setExtremes: function (a, b, c, d, e) {
            var f = this, g = f.chart, c = p(c, !0);
            n(f.series, function (a) {
                delete a.kdTree
            });
            e = w(e, {min: a, max: b});
            E(f, "setExtremes", e, function () {
                f.userMin = a;
                f.userMax = b;
                f.eventArgs = e;
                f.isDirtyExtremes = !0;
                c && g.redraw(d)
            })
        },
        zoom: function (a, b) {
            var c = this.dataMin, d = this.dataMax, e = this.options;
            this.allowZoomOutside || (v(c) && a <= B(c, p(e.min, c)) && (a = s), v(d) && b >= x(d, p(e.max, d)) && (b = s));
            this.displayBtn = a !== s || b !== s;
            this.setExtremes(a,
                b, !1, s, {trigger: "zoom"});
            return !0
        },
        setAxisSize: function () {
            var a = this.chart, b = this.options, c = b.offsetLeft || 0, d = this.horiz,
                e = p(b.width, a.plotWidth - c + (b.offsetRight || 0)), f = p(b.height, a.plotHeight),
                g = p(b.top, a.plotTop), b = p(b.left, a.plotLeft + c), c = /%$/;
            c.test(f) && (f = parseFloat(f) / 100 * a.plotHeight);
            c.test(g) && (g = parseFloat(g) / 100 * a.plotHeight + a.plotTop);
            this.left = b;
            this.top = g;
            this.width = e;
            this.height = f;
            this.bottom = a.chartHeight - f - g;
            this.right = a.chartWidth - e - b;
            this.len = x(d ? e : f, 0);
            this.pos = d ? b : g
        },
        getExtremes: function () {
            var a =
                this.isLog;
            return {
                min: a ? ka(sa(this.min)) : this.min,
                max: a ? ka(sa(this.max)) : this.max,
                dataMin: this.dataMin,
                dataMax: this.dataMax,
                userMin: this.userMin,
                userMax: this.userMax
            }
        },
        getThreshold: function (a) {
            var b = this.isLog, c = b ? sa(this.min) : this.min, b = b ? sa(this.max) : this.max;
            c > a || a === null ? a = c : b < a && (a = b);
            return this.translate(a, 0, 1, 0, 1)
        },
        autoLabelAlign: function (a) {
            a = (p(a, 0) - this.side * 90 + 720) % 360;
            return a > 15 && a < 165 ? "right" : a > 195 && a < 345 ? "left" : "center"
        },
        unsquish: function () {
            var a = this.ticks, b = this.options.labels, c =
                    this.horiz, d = this.tickInterval, e = d,
                f = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / d), g, h = b.rotation,
                i = this.chart.renderer.fontMetrics(b.style.fontSize, a[0] && a[0].label), j, k = Number.MAX_VALUE, m,
                l = function (a) {
                    a /= f || 1;
                    a = a > 1 ? ya(a) : 1;
                    return a * d
                };
            c ? (m = v(h) ? [h] : f < p(b.autoRotationLimit, 80) && !b.staggerLines && !b.step && b.autoRotation) && n(m, function (a) {
                var b;
                if (a === h || a && a >= -90 && a <= 90) j = l(Q(i.h / fa(qa * a))), b = j + Q(a / 360), b < k && (k = b, g = a, e = j)
            }) : e = l(i.h);
            this.autoRotation = m;
            this.labelRotation = g;
            return e
        },
        renderUnsquish: function () {
            var a =
                    this.chart, b = a.renderer, c = this.tickPositions, d = this.ticks, e = this.options.labels,
                f = this.horiz, g = a.margin, h = this.categories ? c.length : c.length - 1,
                h = this.slotWidth = f && !e.step && !e.rotation && (this.staggerLines || 1) * a.plotWidth / h || !f && (g[3] && g[3] - a.spacing[3] || a.chartWidth * 0.33),
                i = x(1, u(h - 2 * (e.padding || 5))), j = {}, g = b.fontMetrics(e.style.fontSize, d[0] && d[0].label),
                k, m = 0;
            if (!Ja(e.rotation)) j.rotation = e.rotation;
            if (this.autoRotation) n(c, function (a) {
                if ((a = d[a]) && a.labelLength > m) m = a.labelLength
            }), m > i && m > g.h ? j.rotation =
                this.labelRotation : this.labelRotation = 0; else if (h) {
                k = {width: i + "px", textOverflow: "clip"};
                for (h = c.length; !f && h--;) if (i = c[h], i = d[i].label) if (i.styles.textOverflow === "ellipsis" && i.css({textOverflow: "clip"}), i.getBBox().height > this.len / c.length - (g.h - g.f)) i.specCss = {textOverflow: "ellipsis"}
            }
            j.rotation && (k = {
                width: (m > a.chartHeight * 0.5 ? a.chartHeight * 0.33 : a.chartHeight) + "px",
                textOverflow: "ellipsis"
            });
            this.labelAlign = j.align = e.align || this.autoLabelAlign(this.labelRotation);
            n(c, function (a) {
                var b = (a = d[a]) && a.label;
                if (b) k && b.css(z(k, b.specCss)), delete b.specCss, b.attr(j), a.rotation = j.rotation
            });
            this.tickRotCorr = b.rotCorr(g.b, this.labelRotation || 0, this.side === 2)
        },
        getOffset: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.options, e = a.tickPositions, f = a.ticks, g = a.horiz,
                h = a.side, i = b.inverted ? [1, 0, 3, 2][h] : h, j, k, m = 0, l, o = 0, q = d.title, r = d.labels,
                G = 0, Ia = b.axisOffset, b = b.clipOffset, t = [-1, 1, 1, -1][h], y;
            a.hasData = j = a.hasVisibleSeries || v(a.min) && v(a.max) && !!e;
            a.showAxis = k = j || p(d.showEmpty, !0);
            a.staggerLines = a.horiz && r.staggerLines;
            if (!a.axisGroup) a.gridGroup = c.g("grid").attr({zIndex: d.gridZIndex || 1}).add(), a.axisGroup = c.g("axis").attr({zIndex: d.zIndex || 2}).add(), a.labelGroup = c.g("axis-labels").attr({zIndex: r.zIndex || 7}).addClass("highcharts-" + a.coll.toLowerCase() + "-labels").add();
            if (j || a.isLinked) {
                if (n(e, function (b) {
                        f[b] ? f[b].addLabel() : f[b] = new Za(a, b)
                    }), a.renderUnsquish(), n(e, function (b) {
                        if (h === 0 || h === 2 || {
                                1: "left",
                                3: "right"
                            }[h] === a.labelAlign) G = x(f[b].getLabelSize(), G)
                    }), a.staggerLines) G *= a.staggerLines, a.labelOffset = G
            } else for (y in f) f[y].destroy(),
                delete f[y];
            if (q && q.text && q.enabled !== !1) {
                if (!a.axisTitle) a.axisTitle = c.text(q.text, 0, 0, q.useHTML).attr({
                    zIndex: 7,
                    rotation: q.rotation || 0,
                    align: q.textAlign || {low: "left", middle: "center", high: "right"}[q.align]
                }).addClass("highcharts-" + this.coll.toLowerCase() + "-title").css(q.style).add(a.axisGroup), a.axisTitle.isNew = !0;
                if (k) m = a.axisTitle.getBBox()[g ? "height" : "width"], l = q.offset, o = v(l) ? 0 : p(q.margin, g ? 5 : 10);
                a.axisTitle[k ? "show" : "hide"]()
            }
            a.offset = t * p(d.offset, Ia[h]);
            a.tickRotCorr = a.tickRotCorr || {x: 0, y: 0};
            c = h === 2 ? a.tickRotCorr.y : 0;
            g = G + o + (G && t * (g ? p(r.y, a.tickRotCorr.y + 8) : r.x) - c);
            a.axisTitleMargin = p(l, g);
            Ia[h] = x(Ia[h], a.axisTitleMargin + m + t * a.offset, g);
            b[i] = x(b[i], W(d.lineWidth / 2) * 2)
        },
        getLinePath: function (a) {
            var b = this.chart, c = this.opposite, d = this.offset, e = this.horiz,
                f = this.left + (c ? this.width : 0) + d, d = b.chartHeight - this.bottom - (c ? this.height : 0) + d;
            c && (a *= -1);
            return b.renderer.crispLine(["M", e ? this.left : f, e ? d : this.top, "L", e ? b.chartWidth - this.right : f, e ? d : b.chartHeight - this.bottom], a)
        },
        getTitlePosition: function () {
            var a =
                    this.horiz, b = this.left, c = this.top, d = this.len, e = this.options.title, f = a ? b : c,
                g = this.opposite, h = this.offset, i = e.x || 0, j = e.y || 0, k = L(e.style.fontSize || 12),
                d = {low: f + (a ? 0 : d), middle: f + d / 2, high: f + (a ? d : 0)}[e.align],
                b = (a ? c + this.height : b) + (a ? 1 : -1) * (g ? -1 : 1) * this.axisTitleMargin + (this.side === 2 ? k : 0);
            return {x: a ? d + i : b + (g ? this.width : 0) + h + i, y: a ? b + j - (g ? this.height : 0) + h : d + j}
        },
        render: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.options, e = a.isLog, f = a.isLinked, g = a.tickPositions,
                h = a.axisTitle, i = a.ticks, j = a.minorTicks, k =
                    a.alternateBands, m = d.stackLabels, l = d.alternateGridColor, o = a.tickmarkOffset, q = d.lineWidth, r,
                G = b.hasRendered && v(a.oldMin) && !isNaN(a.oldMin);
            r = a.hasData;
            var p = a.showAxis, t, y;
            a.labelEdge.length = 0;
            a.overlap = !1;
            n([i, j, k], function (a) {
                for (var b in a) a[b].isActive = !1
            });
            if (r || f) {
                a.minorTickInterval && !a.categories && n(a.getMinorTickPositions(), function (b) {
                    j[b] || (j[b] = new Za(a, b, "minor"));
                    G && j[b].isNew && j[b].render(null, !0);
                    j[b].render(null, !1, 1)
                });
                if (g.length && (n(g, function (b, c) {
                        if (!f || b >= a.min && b <= a.max) i[b] ||
                        (i[b] = new Za(a, b)), G && i[b].isNew && i[b].render(c, !0, 0.1), i[b].render(c)
                    }), o && (a.min === 0 || a.single))) i[-1] || (i[-1] = new Za(a, -1, null, !0)), i[-1].render(-1);
                l && n(g, function (b, c) {
                    if (c % 2 === 0 && b < a.max) k[b] || (k[b] = new A.PlotLineOrBand(a)), t = b + o, y = g[c + 1] !== s ? g[c + 1] + o : a.max, k[b].options = {
                        from: e ? sa(t) : t,
                        to: e ? sa(y) : y,
                        color: l
                    }, k[b].render(), k[b].isActive = !0
                });
                if (!a._addedPlotLB) n((d.plotLines || []).concat(d.plotBands || []), function (b) {
                    a.addPlotBandOrLine(b)
                }), a._addedPlotLB = !0
            }
            n([i, j, k], function (a) {
                var c, d, e = [],
                    f = Fa ? Fa.duration || 500 : 0, g = function () {
                        for (d = e.length; d--;) a[e[d]] && !a[e[d]].isActive && (a[e[d]].destroy(), delete a[e[d]])
                    };
                for (c in a) if (!a[c].isActive) a[c].render(c, !1, 0), a[c].isActive = !1, e.push(c);
                a === k || !b.hasRendered || !f ? g() : f && setTimeout(g, f)
            });
            if (q) r = a.getLinePath(q), a.axisLine ? a.axisLine.animate({d: r}) : a.axisLine = c.path(r).attr({
                stroke: d.lineColor,
                "stroke-width": q,
                zIndex: 7
            }).add(a.axisGroup), a.axisLine[p ? "show" : "hide"]();
            if (h && p) h[h.isNew ? "attr" : "animate"](a.getTitlePosition()), h.isNew = !1;
            m &&
            m.enabled && a.renderStackTotals();
            a.isDirty = !1
        },
        redraw: function () {
            this.render();
            n(this.plotLinesAndBands, function (a) {
                a.render()
            });
            n(this.series, function (a) {
                a.isDirty = !0
            })
        },
        destroy: function (a) {
            var b = this, c = b.stacks, d, e = b.plotLinesAndBands;
            a || T(b);
            for (d in c) Na(c[d]), c[d] = null;
            n([b.ticks, b.minorTicks, b.alternateBands], function (a) {
                Na(a)
            });
            for (a = e.length; a--;) e[a].destroy();
            n("stackTotalGroup,axisLine,axisTitle,axisGroup,cross,gridGroup,labelGroup".split(","), function (a) {
                b[a] && (b[a] = b[a].destroy())
            });
            this.cross && this.cross.destroy()
        },
        drawCrosshair: function (a, b) {
            var c, d = this.crosshair, e = d.animation;
            if (!this.crosshair || (v(b) || !p(this.crosshair.snap, !0)) === !1 || b && b.series && b.series[this.coll] !== this) this.hideCrosshair(); else if (p(d.snap, !0) ? v(b) && (c = this.isXAxis ? b.plotX : this.len - b.plotY) : c = this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos, c = this.isRadial ? this.getPlotLinePath(this.isXAxis ? b.x : p(b.stackY, b.y)) || null : this.getPlotLinePath(null, null, null, null, c) || null, c === null) this.hideCrosshair();
            else if (this.cross) this.cross.attr({visibility: "visible"})[e ? "animate" : "attr"]({d: c}, e); else {
                e = this.categories && !this.isRadial;
                e = {
                    "stroke-width": d.width || (e ? this.transA : 1),
                    stroke: d.color || (e ? "rgba(155,200,255,0.2)" : "#C0C0C0"),
                    zIndex: d.zIndex || 2
                };
                if (d.dashStyle) e.dashstyle = d.dashStyle;
                this.cross = this.chart.renderer.path(c).attr(e).add()
            }
        },
        hideCrosshair: function () {
            this.cross && this.cross.hide()
        }
    };
    w(J.prototype, {
        getPlotBandPath: function (a, b) {
            var c = this.getPlotLinePath(b, null, null, !0), d = this.getPlotLinePath(a,
                null, null, !0);
            d && c && d.toString() !== c.toString() ? d.push(c[4], c[5], c[1], c[2]) : d = null;
            return d
        }, addPlotBand: function (a) {
            return this.addPlotBandOrLine(a, "plotBands")
        }, addPlotLine: function (a) {
            return this.addPlotBandOrLine(a, "plotLines")
        }, addPlotBandOrLine: function (a, b) {
            var c = (new A.PlotLineOrBand(this, a)).render(), d = this.userOptions;
            c && (b && (d[b] = d[b] || [], d[b].push(a)), this.plotLinesAndBands.push(c));
            return c
        }, removePlotBandOrLine: function (a) {
            for (var b = this.plotLinesAndBands, c = this.options, d = this.userOptions,
                     e = b.length; e--;) b[e].id === a && b[e].destroy();
            n([c.plotLines || [], d.plotLines || [], c.plotBands || [], d.plotBands || []], function (b) {
                for (e = b.length; e--;) b[e].id === a && ta(b, b[e])
            })
        }
    });
    J.prototype.getTimeTicks = function (a, b, c, d) {
        var e = [], f = {}, g = P.global.useUTC, h, i = new ea(b - bb(b)), j = a.unitRange, k = a.count;
        if (v(b)) {
            i[Pb](j >= I.second ? 0 : k * W(i.getMilliseconds() / k));
            if (j >= I.second) i[Qb](j >= I.minute ? 0 : k * W(i.getSeconds() / k));
            if (j >= I.minute) i[Rb](j >= I.hour ? 0 : k * W(i[Ab]() / k));
            if (j >= I.hour) i[Sb](j >= I.day ? 0 : k * W(i[Bb]() / k));
            if (j >= I.day) i[Db](j >= I.month ? 1 : k * W(i[cb]() / k));
            j >= I.month && (i[Eb](j >= I.year ? 0 : k * W(i[db]() / k)), h = i[eb]());
            j >= I.year && (h -= h % k, i[Fb](h));
            if (j === I.week) i[Db](i[cb]() - i[Cb]() + p(d, 1));
            b = 1;
            if (wb || kb) i = i.getTime(), i = new ea(i + bb(i));
            h = i[eb]();
            for (var d = i.getTime(), m = i[db](), l = i[cb](), o = (I.day + (g ? bb(i) : i.getTimezoneOffset() * 6E4)) % I.day; d < c;) e.push(d), j === I.year ? d = mb(h + b * k, 0) : j === I.month ? d = mb(h, m + b * k) : !g && (j === I.day || j === I.week) ? d = mb(h, m, l + b * k * (j === I.day ? 1 : 7)) : d += j * k, b++;
            e.push(d);
            n(hb(e, function (a) {
                return j <=
                    I.hour && a % I.day === o
            }), function (a) {
                f[a] = "day"
            })
        }
        e.info = w(a, {higherRanks: f, totalRange: j * k});
        return e
    };
    J.prototype.normalizeTimeTickInterval = function (a, b) {
        var c = b || [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2]], ["week", [1, 2]], ["month", [1, 2, 3, 4, 6]], ["year", null]],
            d = c[c.length - 1], e = I[d[0]], f = d[1], g;
        for (g = 0; g < c.length; g++) if (d = c[g], e = I[d[0]], f = d[1], c[g + 1] && a <= (e * f[f.length - 1] + I[c[g + 1][0]]) / 2) break;
        e === I.year &&
        a < 5 * e && (f = [1, 2, 5]);
        c = yb(a / e, f, d[0] === "year" ? x(xb(a / e), 1) : 1);
        return {unitRange: e, count: c, unitName: d[0]}
    };
    J.prototype.getLogTickPositions = function (a, b, c, d) {
        var e = this.options, f = this.len, g = [];
        if (!d) this._minorAutoInterval = null;
        if (a >= 0.5) a = u(a), g = this.getLinearTickPositions(a, b, c); else if (a >= 0.08) for (var f = W(b), h, i, j, k, m, e = a > 0.3 ? [1, 2, 4] : a > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < c + 1 && !m; f++) {
            i = e.length;
            for (h = 0; h < i && !m; h++) j = La(sa(f) * e[h]), j > b && (!d || k <= c) && k !== s && g.push(k), k > c && (m = !0), k = j
        } else if (b = sa(b),
                c = sa(c), a = e[d ? "minorTickInterval" : "tickInterval"], a = p(a === "auto" ? null : a, this._minorAutoInterval, (c - b) * (e.tickPixelInterval / (d ? 5 : 1)) / ((d ? f / this.tickPositions.length : f) || 1)), a = yb(a, null, xb(a)), g = za(this.getLinearTickPositions(a, b, c), La), !d) this._minorAutoInterval = a / 5;
        if (!d) this.tickInterval = a;
        return g
    };
    var Lb = A.Tooltip = function () {
        this.init.apply(this, arguments)
    };
    Lb.prototype = {
        init: function (a, b) {
            var c = b.borderWidth, d = b.style, e = L(d.padding);
            this.chart = a;
            this.options = b;
            this.crosshairs = [];
            this.now = {
                x: 0,
                y: 0
            };
            this.isHidden = !0;
            this.label = a.renderer.label("", 0, 0, b.shape || "callout", null, null, b.useHTML, null, "tooltip").attr({
                padding: e,
                fill: b.backgroundColor,
                "stroke-width": c,
                r: b.borderRadius,
                zIndex: 8
            }).css(d).css({padding: 0}).add().attr({y: -9999});
            la || this.label.shadow(b.shadow);
            this.shared = b.shared
        }, destroy: function () {
            if (this.label) this.label = this.label.destroy();
            clearTimeout(this.hideTimer);
            clearTimeout(this.tooltipTimeout)
        }, move: function (a, b, c, d) {
            var e = this, f = e.now, g = e.options.animation !== !1 && !e.isHidden &&
                (Q(a - f.x) > 1 || Q(b - f.y) > 1), h = e.followPointer || e.len > 1;
            w(f, {
                x: g ? (2 * f.x + a) / 3 : a,
                y: g ? (f.y + b) / 2 : b,
                anchorX: h ? s : g ? (2 * f.anchorX + c) / 3 : c,
                anchorY: h ? s : g ? (f.anchorY + d) / 2 : d
            });
            e.label.attr(f);
            if (g) clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function () {
                e && e.move(a, b, c, d)
            }, 32)
        }, hide: function (a) {
            var b = this;
            clearTimeout(this.hideTimer);
            if (!this.isHidden) this.hideTimer = setTimeout(function () {
                b.label.fadeOut();
                b.isHidden = !0
            }, p(a, this.options.hideDelay, 500))
        }, getAnchor: function (a, b) {
            var c, d = this.chart,
                e = d.inverted, f = d.plotTop, g = d.plotLeft, h = 0, i = 0, j, k, a = oa(a);
            c = a[0].tooltipPos;
            this.followPointer && b && (b.chartX === s && (b = d.pointer.normalize(b)), c = [b.chartX - d.plotLeft, b.chartY - f]);
            c || (n(a, function (a) {
                j = a.series.yAxis;
                k = a.series.xAxis;
                h += a.plotX + (!e && k ? k.left - g : 0);
                i += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!e && j ? j.top - f : 0)
            }), h /= a.length, i /= a.length, c = [e ? d.plotWidth - i : h, this.shared && !e && a.length > 1 && b ? b.chartY - f : e ? d.plotHeight - h : i]);
            return za(c, u)
        }, getPosition: function (a, b, c) {
            var d = this.chart, e = this.distance,
                f = {}, g = c.h || 0, h, i = ["y", d.chartHeight, b, c.plotY + d.plotTop],
                j = ["x", d.chartWidth, a, c.plotX + d.plotLeft],
                k = p(c.ttBelow, d.inverted && !c.negative || !d.inverted && c.negative), m = function (a, b, c, d) {
                    var h = c < d - e, i = d + e + c < b, j = d - e - c;
                    d += e;
                    if (k && i) f[a] = d; else if (!k && h) f[a] = j; else if (h) f[a] = j - g < 0 ? j : j - g; else if (i) f[a] = d + g + c > b ? d : d + g; else return !1
                }, l = function (a, b, c, d) {
                    if (d < e || d > b - e) return !1; else f[a] = d < c / 2 ? 1 : d > b - c / 2 ? b - c - 2 : d - c / 2
                }, o = function (a) {
                    var b = i;
                    i = j;
                    j = b;
                    h = a
                }, q = function () {
                    m.apply(0, i) !== !1 ? l.apply(0, j) === !1 && !h && (o(!0),
                        q()) : h ? f.x = f.y = 0 : (o(!0), q())
                };
            (d.inverted || this.len > 1) && o();
            q();
            return f
        }, defaultFormatter: function (a) {
            var b = this.points || oa(this), c;
            c = [a.tooltipFooterHeaderFormatter(b[0])];
            c = c.concat(a.bodyFormatter(b));
            c.push(a.tooltipFooterHeaderFormatter(b[0], !0));
            return c.join("")
        }, refresh: function (a, b) {
            var c = this.chart, d = this.label, e = this.options, f, g, h, i = {}, j, k = [];
            j = e.formatter || this.defaultFormatter;
            var i = c.hoverPoints, m, l = this.shared;
            clearTimeout(this.hideTimer);
            this.followPointer = oa(a)[0].series.tooltipOptions.followPointer;
            h = this.getAnchor(a, b);
            f = h[0];
            g = h[1];
            l && (!a.series || !a.series.noSharedTooltip) ? (c.hoverPoints = a, i && n(i, function (a) {
                a.setState()
            }), n(a, function (a) {
                a.setState("hover");
                k.push(a.getLabelConfig())
            }), i = {
                x: a[0].category,
                y: a[0].y
            }, i.points = k, this.len = k.length, a = a[0]) : i = a.getLabelConfig();
            j = j.call(i, this);
            i = a.series;
            this.distance = p(i.tooltipOptions.distance, 16);
            j === !1 ? this.hide() : (this.isHidden && (ab(d), d.attr("opacity", 1).show()), d.attr({text: j}), m = e.borderColor || a.color || i.color || "#606060", d.attr({stroke: m}),
                this.updatePosition({
                    plotX: f,
                    plotY: g,
                    negative: a.negative,
                    ttBelow: a.ttBelow,
                    h: h[2] || 0
                }), this.isHidden = !1);
            E(c, "tooltipRefresh", {text: j, x: f + c.plotLeft, y: g + c.plotTop, borderColor: m})
        }, updatePosition: function (a) {
            var b = this.chart, c = this.label,
                c = (this.options.positioner || this.getPosition).call(this, c.width, c.height, a);
            this.move(u(c.x), u(c.y || 0), a.plotX + b.plotLeft, a.plotY + b.plotTop)
        }, getXDateFormat: function (a, b, c) {
            var d, b = b.dateTimeLabelFormats, e = c && c.closestPointRange, f, g = {
                millisecond: 15, second: 12, minute: 9,
                hour: 6, day: 3
            }, h, i = "millisecond";
            if (e) {
                h = ja("%m-%d %H:%M:%S.%L", a.x);
                for (f in I) {
                    if (e === I.week && +ja("%w", a.x) === c.options.startOfWeek && h.substr(6) === "00:00:00.000") {
                        f = "week";
                        break
                    } else if (I[f] > e) {
                        f = i;
                        break
                    } else if (g[f] && h.substr(g[f]) !== "01-01 00:00:00.000".substr(g[f])) break;
                    f !== "week" && (i = f)
                }
                f && (d = b[f])
            } else d = b.day;
            return d || b.year
        }, tooltipFooterHeaderFormatter: function (a, b) {
            var c = b ? "footer" : "header", d = a.series, e = d.tooltipOptions, f = e.xDateFormat, g = d.xAxis,
                h = g && g.options.type === "datetime" && ra(a.key),
                c = e[c + "Format"];
            h && !f && (f = this.getXDateFormat(a, e, g));
            h && f && (c = c.replace("{point.key}", "{point.key:" + f + "}"));
            return Ma(c, {point: a, series: d})
        }, bodyFormatter: function (a) {
            return za(a, function (a) {
                var c = a.series.tooltipOptions;
                return (c.pointFormatter || a.point.tooltipFormatter).call(a.point, c.pointFormat)
            })
        }
    };
    var wa;
    $a = C.documentElement.ontouchstart !== s;
    var Xa = A.Pointer = function (a, b) {
        this.init(a, b)
    };
    Xa.prototype = {
        init: function (a, b) {
            var c = b.chart, d = c.events, e = la ? "" : c.zoomType, c = a.inverted, f;
            this.options =
                b;
            this.chart = a;
            this.zoomX = f = /x/.test(e);
            this.zoomY = e = /y/.test(e);
            this.zoomHor = f && !c || e && c;
            this.zoomVert = e && !c || f && c;
            this.hasZoom = f || e;
            this.runChartClick = d && !!d.click;
            this.pinchDown = [];
            this.lastValidTouch = {};
            if (A.Tooltip && b.tooltip.enabled) a.tooltip = new Lb(a, b.tooltip), this.followTouchMove = p(b.tooltip.followTouchMove, !0);
            this.setDOMEvents()
        }, normalize: function (a, b) {
            var c, d, a = a || window.event, a = dc(a);
            if (!a.target) a.target = a.srcElement;
            d = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] :
                a;
            if (!b) this.chartPosition = b = cc(this.chart.container);
            d.pageX === s ? (c = x(a.x, a.clientX - b.left), d = a.y) : (c = d.pageX - b.left, d = d.pageY - b.top);
            return w(a, {chartX: u(c), chartY: u(d)})
        }, getCoordinates: function (a) {
            var b = {xAxis: [], yAxis: []};
            n(this.chart.axes, function (c) {
                b[c.isXAxis ? "xAxis" : "yAxis"].push({axis: c, value: c.toValue(a[c.horiz ? "chartX" : "chartY"])})
            });
            return b
        }, runPointActions: function (a) {
            var b = this.chart, c = b.series, d = b.tooltip, e = d ? d.shared : !1, f = b.hoverPoint, g = b.hoverSeries,
                h, i = b.chartWidth, j, k, m = [], l,
                o;
            if (!e && !g) for (h = 0; h < c.length; h++) if (c[h].directTouch || !c[h].options.stickyTracking) c = [];
            !e && g && g.directTouch && f ? l = f : (n(c, function (b) {
                j = b.noSharedTooltip && e;
                k = !e && b.directTouch;
                b.visible && !j && !k && p(b.options.enableMouseTracking, !0) && (o = b.searchPoint(a, !j && b.kdDimensions === 1)) && m.push(o)
            }), n(m, function (a) {
                if (a && typeof a.dist === "number" && a.dist < i) i = a.dist, l = a
            }));
            if (l && (l !== this.prevKDPoint || d && d.isHidden)) {
                if (e && !l.series.noSharedTooltip) {
                    for (h = m.length; h--;) (m[h].clientX !== l.clientX || m[h].series.noSharedTooltip) &&
                    m.splice(h, 1);
                    m.length && d && d.refresh(m, a);
                    n(m, function (b) {
                        if (b !== l) b.onMouseOver(a)
                    });
                    (g && g.directTouch && f || l).onMouseOver(a)
                } else d && d.refresh(l, a), l.onMouseOver(a);
                this.prevKDPoint = l
            } else c = g && g.tooltipOptions.followPointer, d && c && !d.isHidden && (c = d.getAnchor([{}], a), d.updatePosition({
                plotX: c[0],
                plotY: c[1]
            }));
            if (d && !this._onDocumentMouseMove) this._onDocumentMouseMove = function (a) {
                if (ba[wa]) ba[wa].pointer.onDocumentMouseMove(a)
            }, D(C, "mousemove", this._onDocumentMouseMove);
            n(b.axes, function (b) {
                b.drawCrosshair(a,
                    p(l, f))
            })
        }, reset: function (a, b) {
            var c = this.chart, d = c.hoverSeries, e = c.hoverPoint, f = c.hoverPoints, g = c.tooltip,
                h = g && g.shared ? f : e;
            (a = a && g && h) && oa(h)[0].plotX === s && (a = !1);
            if (a) g.refresh(h), e && (e.setState(e.state, !0), n(c.axes, function (a) {
                p(a.options.crosshair && a.options.crosshair.snap, !0) ? a.drawCrosshair(null, e) : a.hideCrosshair()
            })); else {
                if (e) e.onMouseOut();
                f && n(f, function (a) {
                    a.setState()
                });
                if (d) d.onMouseOut();
                g && g.hide(b);
                if (this._onDocumentMouseMove) T(C, "mousemove", this._onDocumentMouseMove), this._onDocumentMouseMove =
                    null;
                n(c.axes, function (a) {
                    a.hideCrosshair()
                });
                this.hoverX = c.hoverPoints = c.hoverPoint = null
            }
        }, scaleGroups: function (a, b) {
            var c = this.chart, d;
            n(c.series, function (e) {
                d = a || e.getPlotBox();
                e.xAxis && e.xAxis.zoomEnabled && (e.group.attr(d), e.markerGroup && (e.markerGroup.attr(d), e.markerGroup.clip(b ? c.clipRect : null)), e.dataLabelsGroup && e.dataLabelsGroup.attr(d))
            });
            c.clipRect.attr(b || c.clipBox)
        }, dragStart: function (a) {
            var b = this.chart;
            b.mouseIsDown = a.type;
            b.cancelClick = !1;
            b.mouseDownX = this.mouseDownX = a.chartX;
            b.mouseDownY =
                this.mouseDownY = a.chartY
        }, drag: function (a) {
            var b = this.chart, c = b.options.chart, d = a.chartX, e = a.chartY, f = this.zoomHor, g = this.zoomVert,
                h = b.plotLeft, i = b.plotTop, j = b.plotWidth, k = b.plotHeight, m, l = this.mouseDownX,
                o = this.mouseDownY, q = c.panKey && a[c.panKey + "Key"];
            d < h ? d = h : d > h + j && (d = h + j);
            e < i ? e = i : e > i + k && (e = i + k);
            this.hasDragged = Math.sqrt(Math.pow(l - d, 2) + Math.pow(o - e, 2));
            if (this.hasDragged > 10) {
                m = b.isInsidePlot(l - h, o - i);
                if (b.hasCartesianSeries && (this.zoomX || this.zoomY) && m && !q && !this.selectionMarker) this.selectionMarker =
                    b.renderer.rect(h, i, f ? 1 : j, g ? 1 : k, 0).attr({
                        fill: c.selectionMarkerFill || "rgba(69,114,167,0.25)",
                        zIndex: 7
                    }).add();
                this.selectionMarker && f && (d -= l, this.selectionMarker.attr({width: Q(d), x: (d > 0 ? 0 : d) + l}));
                this.selectionMarker && g && (d = e - o, this.selectionMarker.attr({
                    height: Q(d),
                    y: (d > 0 ? 0 : d) + o
                }));
                m && !this.selectionMarker && c.panning && b.pan(a, c.panning)
            }
        }, drop: function (a) {
            var b = this, c = this.chart, d = this.hasPinched;
            if (this.selectionMarker) {
                var e = {xAxis: [], yAxis: [], originalEvent: a.originalEvent || a}, f = this.selectionMarker,
                    g = f.attr ? f.attr("x") : f.x, h = f.attr ? f.attr("y") : f.y,
                    i = f.attr ? f.attr("width") : f.width, j = f.attr ? f.attr("height") : f.height, k;
                if (this.hasDragged || d) n(c.axes, function (c) {
                    if (c.zoomEnabled && v(c.min) && (d || b[{xAxis: "zoomX", yAxis: "zoomY"}[c.coll]])) {
                        var f = c.horiz, o = a.type === "touchend" ? c.minPixelPadding : 0,
                            q = c.toValue((f ? g : h) + o), f = c.toValue((f ? g + i : h + j) - o);
                        e[c.coll].push({axis: c, min: B(q, f), max: x(q, f)});
                        k = !0
                    }
                }), k && E(c, "selection", e, function (a) {
                    c.zoom(w(a, d ? {animation: !1} : null))
                });
                this.selectionMarker = this.selectionMarker.destroy();
                d && this.scaleGroups()
            }
            if (c) M(c.container, {cursor: c._cursor}), c.cancelClick = this.hasDragged > 10, c.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = []
        }, onContainerMouseDown: function (a) {
            a = this.normalize(a);
            a.preventDefault && a.preventDefault();
            this.dragStart(a)
        }, onDocumentMouseUp: function (a) {
            ba[wa] && ba[wa].pointer.drop(a)
        }, onDocumentMouseMove: function (a) {
            var b = this.chart, c = this.chartPosition, a = this.normalize(a, c);
            c && !this.inClass(a.target, "highcharts-tracker") && !b.isInsidePlot(a.chartX - b.plotLeft,
                a.chartY - b.plotTop) && this.reset()
        }, onContainerMouseLeave: function () {
            var a = ba[wa];
            if (a) a.pointer.reset(), a.pointer.chartPosition = null
        }, onContainerMouseMove: function (a) {
            var b = this.chart;
            wa = b.index;
            a = this.normalize(a);
            a.returnValue = !1;
            b.mouseIsDown === "mousedown" && this.drag(a);
            (this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop)) && !b.openMenu && this.runPointActions(a)
        }, inClass: function (a, b) {
            for (var c; a;) {
                if (c = V(a, "class")) if (c.indexOf(b) !== -1) return !0; else if (c.indexOf("highcharts-container") !==
                    -1) return !1;
                a = a.parentNode
            }
        }, onTrackerMouseOut: function (a) {
            var b = this.chart.hoverSeries, c = (a = a.relatedTarget || a.toElement) && a.point && a.point.series;
            if (b && !b.options.stickyTracking && !this.inClass(a, "highcharts-tooltip") && c !== b) b.onMouseOut()
        }, onContainerClick: function (a) {
            var b = this.chart, c = b.hoverPoint, d = b.plotLeft, e = b.plotTop, a = this.normalize(a);
            a.originalEvent = a;
            b.cancelClick || (c && this.inClass(a.target, "highcharts-tracker") ? (E(c.series, "click", w(a, {point: c})), b.hoverPoint && c.firePointEvent("click",
                a)) : (w(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - d, a.chartY - e) && E(b, "click", a)))
        }, setDOMEvents: function () {
            var a = this, b = a.chart.container;
            b.onmousedown = function (b) {
                a.onContainerMouseDown(b)
            };
            b.onmousemove = function (b) {
                a.onContainerMouseMove(b)
            };
            b.onclick = function (b) {
                a.onContainerClick(b)
            };
            D(b, "mouseleave", a.onContainerMouseLeave);
            gb === 1 && D(C, "mouseup", a.onDocumentMouseUp);
            if ($a) b.ontouchstart = function (b) {
                a.onContainerTouchStart(b)
            }, b.ontouchmove = function (b) {
                a.onContainerTouchMove(b)
            }, gb === 1 &&
            D(C, "touchend", a.onDocumentTouchEnd)
        }, destroy: function () {
            var a;
            T(this.chart.container, "mouseleave", this.onContainerMouseLeave);
            gb || (T(C, "mouseup", this.onDocumentMouseUp), T(C, "touchend", this.onDocumentTouchEnd));
            clearInterval(this.tooltipTimeout);
            for (a in this) this[a] = null
        }
    };
    w(A.Pointer.prototype, {
        pinchTranslate: function (a, b, c, d, e, f) {
            (this.zoomHor || this.pinchHor) && this.pinchTranslateDirection(!0, a, b, c, d, e, f);
            (this.zoomVert || this.pinchVert) && this.pinchTranslateDirection(!1, a, b, c, d, e, f)
        }, pinchTranslateDirection: function (a,
                                              b, c, d, e, f, g, h) {
            var i = this.chart, j = a ? "x" : "y", k = a ? "X" : "Y", m = "chart" + k, l = a ? "width" : "height",
                o = i["plot" + (a ? "Left" : "Top")], q, r, p = h || 1, n = i.inverted, t = i.bounds[a ? "h" : "v"],
                y = b.length === 1, s = b[0][m], u = c[0][m], v = !y && b[1][m], x = !y && c[1][m], w, c = function () {
                    !y && Q(s - v) > 20 && (p = h || Q(u - x) / Q(s - v));
                    r = (o - u) / p + s;
                    q = i["plot" + (a ? "Width" : "Height")] / p
                };
            c();
            b = r;
            b < t.min ? (b = t.min, w = !0) : b + q > t.max && (b = t.max - q, w = !0);
            w ? (u -= 0.8 * (u - g[j][0]), y || (x -= 0.8 * (x - g[j][1])), c()) : g[j] = [u, x];
            n || (f[j] = r - o, f[l] = q);
            f = n ? 1 / p : p;
            e[l] = q;
            e[j] = b;
            d[n ? a ? "scaleY" :
                "scaleX" : "scale" + k] = p;
            d["translate" + k] = f * o + (u - f * s)
        }, pinch: function (a) {
            var b = this, c = b.chart, d = b.pinchDown, e = a.touches, f = e.length, g = b.lastValidTouch,
                h = b.hasZoom, i = b.selectionMarker, j = {},
                k = f === 1 && (b.inClass(a.target, "highcharts-tracker") && c.runTrackerClick || b.runChartClick),
                m = {};
            if (f > 1) b.initiated = !0;
            h && b.initiated && !k && a.preventDefault();
            za(e, function (a) {
                return b.normalize(a)
            });
            if (a.type === "touchstart") n(e, function (a, b) {
                d[b] = {chartX: a.chartX, chartY: a.chartY}
            }), g.x = [d[0].chartX, d[1] && d[1].chartX], g.y =
                [d[0].chartY, d[1] && d[1].chartY], n(c.axes, function (a) {
                if (a.zoomEnabled) {
                    var b = c.bounds[a.horiz ? "h" : "v"], d = a.minPixelPadding,
                        e = a.toPixels(p(a.options.min, a.dataMin)), f = a.toPixels(p(a.options.max, a.dataMax)),
                        g = B(e, f), e = x(e, f);
                    b.min = B(a.pos, g - d);
                    b.max = x(a.pos + a.len, e + d)
                }
            }), b.res = !0; else if (d.length) {
                if (!i) b.selectionMarker = i = w({destroy: ga}, c.plotBox);
                b.pinchTranslate(d, e, j, i, m, g);
                b.hasPinched = h;
                b.scaleGroups(j, m);
                if (!h && b.followTouchMove && f === 1) this.runPointActions(b.normalize(a)); else if (b.res) b.res =
                    !1, this.reset(!1, 0)
            }
        }, touch: function (a, b) {
            var c = this.chart;
            wa = c.index;
            a.touches.length === 1 ? (a = this.normalize(a), c.isInsidePlot(a.chartX - c.plotLeft, a.chartY - c.plotTop) && !c.openMenu ? (b && this.runPointActions(a), this.pinch(a)) : b && this.reset()) : a.touches.length === 2 && this.pinch(a)
        }, onContainerTouchStart: function (a) {
            this.touch(a, !0)
        }, onContainerTouchMove: function (a) {
            this.touch(a)
        }, onDocumentTouchEnd: function (a) {
            ba[wa] && ba[wa].pointer.drop(a)
        }
    });
    if (S.PointerEvent || S.MSPointerEvent) {
        var Aa = {}, Mb = !!S.PointerEvent,
            hc = function () {
                var a, b = [];
                b.item = function (a) {
                    return this[a]
                };
                for (a in Aa) Aa.hasOwnProperty(a) && b.push({
                    pageX: Aa[a].pageX,
                    pageY: Aa[a].pageY,
                    target: Aa[a].target
                });
                return b
            }, Nb = function (a, b, c, d) {
                a = a.originalEvent || a;
                if ((a.pointerType === "touch" || a.pointerType === a.MSPOINTER_TYPE_TOUCH) && ba[wa]) d(a), d = ba[wa].pointer, d[b]({
                    type: c,
                    target: a.currentTarget,
                    preventDefault: ga,
                    touches: hc()
                })
            };
        w(Xa.prototype, {
            onContainerPointerDown: function (a) {
                Nb(a, "onContainerTouchStart", "touchstart", function (a) {
                    Aa[a.pointerId] =
                        {pageX: a.pageX, pageY: a.pageY, target: a.currentTarget}
                })
            }, onContainerPointerMove: function (a) {
                Nb(a, "onContainerTouchMove", "touchmove", function (a) {
                    Aa[a.pointerId] = {pageX: a.pageX, pageY: a.pageY};
                    if (!Aa[a.pointerId].target) Aa[a.pointerId].target = a.currentTarget
                })
            }, onDocumentPointerUp: function (a) {
                Nb(a, "onDocumentTouchEnd", "touchend", function (a) {
                    delete Aa[a.pointerId]
                })
            }, batchMSEvents: function (a) {
                a(this.chart.container, Mb ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
                a(this.chart.container, Mb ?
                    "pointermove" : "MSPointerMove", this.onContainerPointerMove);
                a(C, Mb ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
            }
        });
        R(Xa.prototype, "init", function (a, b, c) {
            a.call(this, b, c);
            this.hasZoom && M(b.container, {"-ms-touch-action": Z, "touch-action": Z})
        });
        R(Xa.prototype, "setDOMEvents", function (a) {
            a.apply(this);
            (this.hasZoom || this.followTouchMove) && this.batchMSEvents(D)
        });
        R(Xa.prototype, "destroy", function (a) {
            this.batchMSEvents(T);
            a.call(this)
        })
    }
    var tb = A.Legend = function (a, b) {
        this.init(a, b)
    };
    tb.prototype = {
        init: function (a,
                        b) {
            var c = this, d = b.itemStyle, e = b.itemMarginTop || 0;
            this.options = b;
            if (b.enabled) c.itemStyle = d, c.itemHiddenStyle = z(d, b.itemHiddenStyle), c.itemMarginTop = e, c.padding = d = p(b.padding, 8), c.initialItemX = d, c.initialItemY = d - 5, c.maxItemWidth = 0, c.chart = a, c.itemHeight = 0, c.symbolWidth = p(b.symbolWidth, 16), c.pages = [], c.render(), D(c.chart, "endResize", function () {
                c.positionCheckboxes()
            })
        }, colorizeItem: function (a, b) {
            var c = this.options, d = a.legendItem, e = a.legendLine, f = a.legendSymbol,
                g = this.itemHiddenStyle.color, c = b ? c.itemStyle.color :
                g, h = b ? a.legendColor || a.color || "#CCC" : g, g = a.options && a.options.marker, i = {fill: h}, j;
            d && d.css({fill: c, color: c});
            e && e.attr({stroke: h});
            if (f) {
                if (g && f.isMarker) for (j in i.stroke = h, g = a.convertAttribs(g), g) d = g[j], d !== s && (i[j] = d);
                f.attr(i)
            }
        }, positionItem: function (a) {
            var b = this.options, c = b.symbolPadding, b = !b.rtl, d = a._legendItemPos, e = d[0], d = d[1],
                f = a.checkbox;
            (a = a.legendGroup) && a.element && a.translate(b ? e : this.legendWidth - e - 2 * c - 4, d);
            if (f) f.x = e, f.y = d
        }, destroyItem: function (a) {
            var b = a.checkbox;
            n(["legendItem", "legendLine",
                "legendSymbol", "legendGroup"], function (b) {
                a[b] && (a[b] = a[b].destroy())
            });
            b && Ta(a.checkbox)
        }, destroy: function () {
            var a = this.group, b = this.box;
            if (b) this.box = b.destroy();
            if (a) this.group = a.destroy()
        }, positionCheckboxes: function (a) {
            var b = this.group.alignAttr, c, d = this.clipHeight || this.legendHeight;
            if (b) c = b.translateY, n(this.allItems, function (e) {
                var f = e.checkbox, g;
                f && (g = c + f.y + (a || 0) + 3, M(f, {
                    left: b.translateX + e.checkboxOffset + f.x - 20 + "px",
                    top: g + "px",
                    display: g > c - 6 && g < c + d - 6 ? "" : Z
                }))
            })
        }, renderTitle: function () {
            var a =
                this.padding, b = this.options.title, c = 0;
            if (b.text) {
                if (!this.title) this.title = this.chart.renderer.label(b.text, a - 3, a - 4, null, null, null, null, null, "legend-title").attr({zIndex: 1}).css(b.style).add(this.group);
                a = this.title.getBBox();
                c = a.height;
                this.offsetWidth = a.width;
                this.contentGroup.attr({translateY: c})
            }
            this.titleHeight = c
        }, setText: function (a) {
            var b = this.options;
            a.legendItem.attr({text: b.labelFormat ? Ma(b.labelFormat, a) : b.labelFormatter.call(a)})
        }, renderItem: function (a) {
            var b = this.chart, c = b.renderer, d =
                    this.options, e = d.layout === "horizontal", f = this.symbolWidth, g = d.symbolPadding,
                h = this.itemStyle, i = this.itemHiddenStyle, j = this.padding, k = e ? p(d.itemDistance, 20) : 0,
                m = !d.rtl, l = d.width, o = d.itemMarginBottom || 0, q = this.itemMarginTop, r = this.initialItemX,
                n = a.legendItem, Ia = a.series && a.series.drawLegendSymbol ? a.series : a, t = Ia.options,
                t = this.createCheckboxForItem && t && t.showCheckbox, y = d.useHTML;
            if (!n) {
                a.legendGroup = c.g("legend-item").attr({zIndex: 1}).add(this.scrollGroup);
                a.legendItem = n = c.text("", m ? f + g : -g, this.baseline ||
                    0, y).css(z(a.visible ? h : i)).attr({align: m ? "left" : "right", zIndex: 2}).add(a.legendGroup);
                if (!this.baseline) this.fontMetrics = c.fontMetrics(h.fontSize, n), this.baseline = this.fontMetrics.f + 3 + q, n.attr("y", this.baseline);
                Ia.drawLegendSymbol(this, a);
                this.setItemEvents && this.setItemEvents(a, n, y, h, i);
                this.colorizeItem(a, a.visible);
                t && this.createCheckboxForItem(a)
            }
            this.setText(a);
            c = n.getBBox();
            f = a.checkboxOffset = d.itemWidth || a.legendItemWidth || f + g + c.width + k + (t ? 20 : 0);
            this.itemHeight = g = u(a.legendItemHeight || c.height);
            if (e && this.itemX - r + f > (l || b.chartWidth - 2 * j - r - d.x)) this.itemX = r, this.itemY += q + this.lastLineHeight + o, this.lastLineHeight = 0;
            this.maxItemWidth = x(this.maxItemWidth, f);
            this.lastItemY = q + this.itemY + o;
            this.lastLineHeight = x(g, this.lastLineHeight);
            a._legendItemPos = [this.itemX, this.itemY];
            e ? this.itemX += f : (this.itemY += q + g + o, this.lastLineHeight = g);
            this.offsetWidth = l || x((e ? this.itemX - r - k : f) + j, this.offsetWidth)
        }, getAllItems: function () {
            var a = [];
            n(this.chart.series, function (b) {
                var c = b.options;
                if (p(c.showInLegend, !v(c.linkedTo) ?
                        s : !1, !0)) a = a.concat(b.legendItems || (c.legendType === "point" ? b.data : b))
            });
            return a
        }, adjustMargins: function (a, b) {
            var c = this.chart, d = this.options, e = d.align[0] + d.verticalAlign[0] + d.layout[0];
            this.display && !d.floating && n([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function (f, g) {
                f.test(e) && !v(a[g]) && (c[pb[g]] = x(c[pb[g]], c.legend[(g + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][g] * d[g % 2 ? "x" : "y"] + p(d.margin, 12) + b[g]))
            })
        }, render: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.group, e, f,
                g, h, i = a.box, j = a.options, k = a.padding, m = j.borderWidth, l = j.backgroundColor;
            a.itemX = a.initialItemX;
            a.itemY = a.initialItemY;
            a.offsetWidth = 0;
            a.lastItemY = 0;
            if (!d) a.group = d = c.g("legend").attr({zIndex: 7}).add(), a.contentGroup = c.g().attr({zIndex: 1}).add(d), a.scrollGroup = c.g().add(a.contentGroup);
            a.renderTitle();
            e = a.getAllItems();
            zb(e, function (a, b) {
                return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0)
            });
            j.reversed && e.reverse();
            a.allItems = e;
            a.display = f = !!e.length;
            a.lastLineHeight = 0;
            n(e, function (b) {
                a.renderItem(b)
            });
            g = (j.width || a.offsetWidth) + k;
            h = a.lastItemY + a.lastLineHeight + a.titleHeight;
            h = a.handleOverflow(h);
            h += k;
            if (m || l) {
                if (i) {
                    if (g > 0 && h > 0) i[i.isNew ? "attr" : "animate"](i.crisp({width: g, height: h})), i.isNew = !1
                } else a.box = i = c.rect(0, 0, g, h, j.borderRadius, m || 0).attr({
                    stroke: j.borderColor,
                    "stroke-width": m || 0,
                    fill: l || Z
                }).add(d).shadow(j.shadow), i.isNew = !0;
                i[f ? "show" : "hide"]()
            }
            a.legendWidth = g;
            a.legendHeight = h;
            n(e, function (b) {
                a.positionItem(b)
            });
            f && d.align(w({width: g, height: h}, j), !0,
                "spacingBox");
            b.isResizing || this.positionCheckboxes()
        }, handleOverflow: function (a) {
            var b = this, c = this.chart, d = c.renderer, e = this.options, f = e.y,
                f = c.spacingBox.height + (e.verticalAlign === "top" ? -f : f) - this.padding, g = e.maxHeight, h,
                i = this.clipRect, j = e.navigation, k = p(j.animation, !0), m = j.arrowSize || 12, l = this.nav,
                o = this.pages, q, r = this.allItems;
            e.layout === "horizontal" && (f /= 2);
            g && (f = B(f, g));
            o.length = 0;
            if (a > f && !e.useHTML) {
                this.clipHeight = h = x(f - 20 - this.titleHeight - this.padding, 0);
                this.currentPage = p(this.currentPage,
                    1);
                this.fullHeight = a;
                n(r, function (a, b) {
                    var c = a._legendItemPos[1], d = u(a.legendItem.getBBox().height), e = o.length;
                    if (!e || c - o[e - 1] > h && (q || c) !== o[e - 1]) o.push(q || c), e++;
                    b === r.length - 1 && c + d - o[e - 1] > h && o.push(c);
                    c !== q && (q = c)
                });
                if (!i) i = b.clipRect = d.clipRect(0, this.padding, 9999, 0), b.contentGroup.clip(i);
                i.attr({height: h});
                if (!l) this.nav = l = d.g().attr({zIndex: 1}).add(this.group), this.up = d.symbol("triangle", 0, 0, m, m).on("click", function () {
                    b.scroll(-1, k)
                }).add(l), this.pager = d.text("", 15, 10).css(j.style).add(l), this.down =
                    d.symbol("triangle-down", 0, 0, m, m).on("click", function () {
                        b.scroll(1, k)
                    }).add(l);
                b.scroll(0);
                a = f
            } else if (l) i.attr({height: c.chartHeight}), l.hide(), this.scrollGroup.attr({translateY: 1}), this.clipHeight = 0;
            return a
        }, scroll: function (a, b) {
            var c = this.pages, d = c.length, e = this.currentPage + a, f = this.clipHeight,
                g = this.options.navigation, h = g.activeColor, g = g.inactiveColor, i = this.pager, j = this.padding;
            e > d && (e = d);
            if (e > 0) b !== s && Ya(b, this.chart), this.nav.attr({
                translateX: j, translateY: f + this.padding + 7 + this.titleHeight,
                visibility: "visible"
            }), this.up.attr({fill: e === 1 ? g : h}).css({cursor: e === 1 ? "default" : "pointer"}), i.attr({text: e + "/" + d}), this.down.attr({
                x: 18 + this.pager.getBBox().width,
                fill: e === d ? g : h
            }).css({cursor: e === d ? "default" : "pointer"}), c = -c[e - 1] + this.initialItemY, this.scrollGroup.animate({translateY: c}), this.currentPage = e, this.positionCheckboxes(c)
        }
    };
    H = A.LegendSymbolMixin = {
        drawRectangle: function (a, b) {
            var c = a.options.symbolHeight || a.fontMetrics.f;
            b.legendSymbol = this.chart.renderer.rect(0, a.baseline - c + 1, a.symbolWidth,
                c, a.options.symbolRadius || 0).attr({zIndex: 3}).add(b.legendGroup)
        }, drawLineMarker: function (a) {
            var b = this.options, c = b.marker, d;
            d = a.symbolWidth;
            var e = this.chart.renderer, f = this.legendGroup, a = a.baseline - u(a.fontMetrics.b * 0.3), g;
            if (b.lineWidth) {
                g = {"stroke-width": b.lineWidth};
                if (b.dashStyle) g.dashstyle = b.dashStyle;
                this.legendLine = e.path(["M", 0, a, "L", d, a]).attr(g).add(f)
            }
            if (c && c.enabled !== !1) b = c.radius, this.legendSymbol = d = e.symbol(this.symbol, d / 2 - b, a - b, 2 * b, 2 * b).add(f), d.isMarker = !0
        }
    };
    (/Trident\/7\.0/.test(Ga) ||
        Va) && R(tb.prototype, "positionItem", function (a, b) {
        var c = this, d = function () {
            b._legendItemPos && a.call(c, b)
        };
        d();
        setTimeout(d)
    });
    var Pa = A.Chart = function () {
        this.init.apply(this, arguments)
    };
    Pa.prototype = {
        callbacks: [], init: function (a, b) {
            var c, d = a.series;
            a.series = null;
            c = z(P, a);
            c.series = a.series = d;
            this.userOptions = a;
            d = c.chart;
            this.margin = this.splashArray("margin", d);
            this.spacing = this.splashArray("spacing", d);
            var e = d.events;
            this.bounds = {h: {}, v: {}};
            this.callback = b;
            this.isResizing = 0;
            this.options = c;
            this.axes = [];
            this.series = [];
            this.hasCartesianSeries = d.showAxes;
            var f = this, g;
            f.index = ba.length;
            ba.push(f);
            gb++;
            d.reflow !== !1 && D(f, "load", function () {
                f.initReflow()
            });
            if (e) for (g in e) D(f, g, e[g]);
            f.xAxis = [];
            f.yAxis = [];
            f.animation = la ? !1 : p(d.animation, !0);
            f.pointCount = f.colorCounter = f.symbolCounter = 0;
            f.firstRender()
        }, initSeries: function (a) {
            var b = this.options.chart;
            (b = F[a.type || b.type || b.defaultSeriesType]) || pa(17, !0);
            b = new b;
            b.init(this, a);
            return b
        }, isInsidePlot: function (a, b, c) {
            var d = c ? b : a, a = c ? a : b;
            return d >= 0 && d <= this.plotWidth &&
                a >= 0 && a <= this.plotHeight
        }, redraw: function (a) {
            var b = this.axes, c = this.series, d = this.pointer, e = this.legend, f = this.isDirtyLegend, g, h,
                i = this.hasCartesianSeries, j = this.isDirtyBox, k = c.length, m = k, l = this.renderer,
                o = l.isHidden(), q = [];
            Ya(a, this);
            o && this.cloneRenderTo();
            for (this.layOutTitles(); m--;) if (a = c[m], a.options.stacking && (g = !0, a.isDirty)) {
                h = !0;
                break
            }
            if (h) for (m = k; m--;) if (a = c[m], a.options.stacking) a.isDirty = !0;
            n(c, function (a) {
                a.isDirty && a.options.legendType === "point" && (a.updateTotals && a.updateTotals(), f =
                    !0)
            });
            if (f && e.options.enabled) e.render(), this.isDirtyLegend = !1;
            g && this.getStacks();
            if (i && !this.isResizing) this.maxTicks = null, n(b, function (a) {
                a.setScale()
            });
            this.getMargins();
            i && (n(b, function (a) {
                a.isDirty && (j = !0)
            }), n(b, function (a) {
                if (a.isDirtyExtremes) a.isDirtyExtremes = !1, q.push(function () {
                    E(a, "afterSetExtremes", w(a.eventArgs, a.getExtremes()));
                    delete a.eventArgs
                });
                (j || g) && a.redraw()
            }));
            j && this.drawChartBox();
            n(c, function (a) {
                a.isDirty && a.visible && (!a.isCartesian || a.xAxis) && a.redraw()
            });
            d && d.reset(!0);
            l.draw();
            E(this, "redraw");
            o && this.cloneRenderTo(!0);
            n(q, function (a) {
                a.call()
            })
        }, get: function (a) {
            var b = this.axes, c = this.series, d, e;
            for (d = 0; d < b.length; d++) if (b[d].options.id === a) return b[d];
            for (d = 0; d < c.length; d++) if (c[d].options.id === a) return c[d];
            for (d = 0; d < c.length; d++) {
                e = c[d].points || [];
                for (b = 0; b < e.length; b++) if (e[b].id === a) return e[b]
            }
            return null
        }, getAxes: function () {
            var a = this, b = this.options, c = b.xAxis = oa(b.xAxis || {}), b = b.yAxis = oa(b.yAxis || {});
            n(c, function (a, b) {
                a.index = b;
                a.isX = !0
            });
            n(b, function (a,
                           b) {
                a.index = b
            });
            c = c.concat(b);
            n(c, function (b) {
                new J(a, b)
            })
        }, getSelectedPoints: function () {
            var a = [];
            n(this.series, function (b) {
                a = a.concat(hb(b.points || [], function (a) {
                    return a.selected
                }))
            });
            return a
        }, getSelectedSeries: function () {
            return hb(this.series, function (a) {
                return a.selected
            })
        }, getStacks: function () {
            var a = this;
            n(a.yAxis, function (a) {
                if (a.stacks && a.hasVisibleSeries) a.oldStacks = a.stacks
            });
            n(a.series, function (b) {
                if (b.options.stacking && (b.visible === !0 || a.options.chart.ignoreHiddenSeries === !1)) b.stackKey =
                    b.type + p(b.options.stack, "")
            })
        }, setTitle: function (a, b, c) {
            var g;
            var d = this, e = d.options, f;
            f = e.title = z(e.title, a);
            g = e.subtitle = z(e.subtitle, b), e = g;
            n([["title", a, f], ["subtitle", b, e]], function (a) {
                var b = a[0], c = d[b], e = a[1], a = a[2];
                c && e && (d[b] = c = c.destroy());
                a && a.text && !c && (d[b] = d.renderer.text(a.text, 0, 0, a.useHTML).attr({
                    align: a.align,
                    "class": "highcharts-" + b,
                    zIndex: a.zIndex || 4
                }).css(a.style).add())
            });
            d.layOutTitles(c)
        }, layOutTitles: function (a) {
            var b = 0, c = this.title, d = this.subtitle, e = this.options, f = e.title,
                e = e.subtitle, g = this.renderer, h = this.spacingBox.width - 44;
            if (c && (c.css({width: (f.width || h) + "px"}).align(w({y: g.fontMetrics(f.style.fontSize, c).b - 3}, f), !1, "spacingBox"), !f.floating && !f.verticalAlign)) b = c.getBBox().height;
            d && (d.css({width: (e.width || h) + "px"}).align(w({y: b + (f.margin - 13) + g.fontMetrics(f.style.fontSize, d).b}, e), !1, "spacingBox"), !e.floating && !e.verticalAlign && (b = ya(b + d.getBBox().height)));
            c = this.titleOffset !== b;
            this.titleOffset = b;
            if (!this.isDirtyBox && c) this.isDirtyBox = c, this.hasRendered &&
            p(a, !0) && this.isDirtyBox && this.redraw()
        }, getChartSize: function () {
            var a = this.options.chart, b = a.width, a = a.height, c = this.renderToClone || this.renderTo;
            if (!v(b)) this.containerWidth = qb(c, "width");
            if (!v(a)) this.containerHeight = qb(c, "height");
            this.chartWidth = x(0, b || this.containerWidth || 600);
            this.chartHeight = x(0, p(a, this.containerHeight > 19 ? this.containerHeight : 400))
        }, cloneRenderTo: function (a) {
            var b = this.renderToClone, c = this.container;
            a ? b && (this.renderTo.appendChild(c), Ta(b), delete this.renderToClone) : (c &&
            c.parentNode === this.renderTo && this.renderTo.removeChild(c), this.renderToClone = b = this.renderTo.cloneNode(0), M(b, {
                position: "absolute",
                top: "-9999px",
                display: "block"
            }), b.style.setProperty && b.style.setProperty("display", "block", "important"), C.body.appendChild(b), c && b.appendChild(c))
        }, getContainer: function () {
            var a, b = this.options.chart, c, d, e;
            this.renderTo = a = b.renderTo;
            e = "highcharts-" + Ib++;
            if (Ja(a)) this.renderTo = a = C.getElementById(a);
            a || pa(13, !0);
            c = L(V(a, "data-highcharts-chart"));
            !isNaN(c) && ba[c] && ba[c].hasRendered &&
            ba[c].destroy();
            V(a, "data-highcharts-chart", this.index);
            a.innerHTML = "";
            !b.skipClone && !a.offsetWidth && this.cloneRenderTo();
            this.getChartSize();
            c = this.chartWidth;
            d = this.chartHeight;
            this.container = a = $(Ua, {
                className: "highcharts-container" + (b.className ? " " + b.className : ""),
                id: e
            }, w({
                position: "relative",
                overflow: "hidden",
                width: c + "px",
                height: d + "px",
                textAlign: "left",
                lineHeight: "normal",
                zIndex: 0,
                "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
            }, b.style), this.renderToClone || a);
            this._cursor = a.style.cursor;
            this.renderer =
                b.forExport ? new ma(a, c, d, b.style, !0) : new Wa(a, c, d, b.style);
            la && this.renderer.create(this, a, c, d);
            this.renderer.chartIndex = this.index
        }, getMargins: function (a) {
            var b = this.spacing, c = this.margin, d = this.titleOffset;
            this.resetMargins();
            if (d && !v(c[0])) this.plotTop = x(this.plotTop, d + this.options.title.margin + b[0]);
            this.legend.adjustMargins(c, b);
            this.extraBottomMargin && (this.marginBottom += this.extraBottomMargin);
            this.extraTopMargin && (this.plotTop += this.extraTopMargin);
            a || this.getAxisMargins()
        }, getAxisMargins: function () {
            var a =
                this, b = a.axisOffset = [0, 0, 0, 0], c = a.margin;
            a.hasCartesianSeries && n(a.axes, function (a) {
                a.getOffset()
            });
            n(pb, function (d, e) {
                v(c[e]) || (a[d] += b[e])
            });
            a.setChartSize()
        }, reflow: function (a) {
            var b = this, c = b.options.chart, d = b.renderTo, e = c.width || qb(d, "width"),
                f = c.height || qb(d, "height"), c = a ? a.target : S, d = function () {
                    if (b.container) b.setSize(e, f, !1), b.hasUserSize = null
                };
            if (!b.hasUserSize && !b.isPrinting && e && f && (c === S || c === C)) {
                if (e !== b.containerWidth || f !== b.containerHeight) clearTimeout(b.reflowTimeout), a ? b.reflowTimeout =
                    setTimeout(d, 100) : d();
                b.containerWidth = e;
                b.containerHeight = f
            }
        }, initReflow: function () {
            var a = this, b = function (b) {
                a.reflow(b)
            };
            D(S, "resize", b);
            D(a, "destroy", function () {
                T(S, "resize", b)
            })
        }, setSize: function (a, b, c) {
            var d = this, e, f, g;
            d.isResizing += 1;
            g = function () {
                d && E(d, "endResize", null, function () {
                    d.isResizing -= 1
                })
            };
            Ya(c, d);
            d.oldChartHeight = d.chartHeight;
            d.oldChartWidth = d.chartWidth;
            if (v(a)) d.chartWidth = e = x(0, u(a)), d.hasUserSize = !!e;
            if (v(b)) d.chartHeight = f = x(0, u(b));
            (Fa ? rb : M)(d.container, {
                width: e + "px", height: f +
                "px"
            }, Fa);
            d.setChartSize(!0);
            d.renderer.setSize(e, f, c);
            d.maxTicks = null;
            n(d.axes, function (a) {
                a.isDirty = !0;
                a.setScale()
            });
            n(d.series, function (a) {
                a.isDirty = !0
            });
            d.isDirtyLegend = !0;
            d.isDirtyBox = !0;
            d.layOutTitles();
            d.getMargins();
            d.redraw(c);
            d.oldChartHeight = null;
            E(d, "resize");
            Fa === !1 ? g() : setTimeout(g, Fa && Fa.duration || 500)
        }, setChartSize: function (a) {
            var b = this.inverted, c = this.renderer, d = this.chartWidth, e = this.chartHeight, f = this.options.chart,
                g = this.spacing, h = this.clipOffset, i, j, k, m;
            this.plotLeft = i = u(this.plotLeft);
            this.plotTop = j = u(this.plotTop);
            this.plotWidth = k = x(0, u(d - i - this.marginRight));
            this.plotHeight = m = x(0, u(e - j - this.marginBottom));
            this.plotSizeX = b ? m : k;
            this.plotSizeY = b ? k : m;
            this.plotBorderWidth = f.plotBorderWidth || 0;
            this.spacingBox = c.spacingBox = {x: g[3], y: g[0], width: d - g[3] - g[1], height: e - g[0] - g[2]};
            this.plotBox = c.plotBox = {x: i, y: j, width: k, height: m};
            d = 2 * W(this.plotBorderWidth / 2);
            b = ya(x(d, h[3]) / 2);
            c = ya(x(d, h[0]) / 2);
            this.clipBox = {
                x: b, y: c, width: W(this.plotSizeX - x(d, h[1]) / 2 - b), height: x(0, W(this.plotSizeY - x(d, h[2]) /
                    2 - c))
            };
            a || n(this.axes, function (a) {
                a.setAxisSize();
                a.setAxisTranslation()
            })
        }, resetMargins: function () {
            var a = this;
            n(pb, function (b, c) {
                a[b] = p(a.margin[c], a.spacing[c])
            });
            a.axisOffset = [0, 0, 0, 0];
            a.clipOffset = [0, 0, 0, 0]
        }, drawChartBox: function () {
            var a = this.options.chart, b = this.renderer, c = this.chartWidth, d = this.chartHeight,
                e = this.chartBackground, f = this.plotBackground, g = this.plotBorder, h = this.plotBGImage,
                i = a.borderWidth || 0, j = a.backgroundColor, k = a.plotBackgroundColor, m = a.plotBackgroundImage,
                l = a.plotBorderWidth ||
                    0, o, q = this.plotLeft, r = this.plotTop, n = this.plotWidth, p = this.plotHeight,
                t = this.plotBox, y = this.clipRect, s = this.clipBox;
            o = i + (a.shadow ? 8 : 0);
            if (i || j) if (e) e.animate(e.crisp({width: c - o, height: d - o})); else {
                e = {fill: j || Z};
                if (i) e.stroke = a.borderColor, e["stroke-width"] = i;
                this.chartBackground = b.rect(o / 2, o / 2, c - o, d - o, a.borderRadius, i).attr(e).addClass("highcharts-background").add().shadow(a.shadow)
            }
            if (k) f ? f.animate(t) : this.plotBackground = b.rect(q, r, n, p, 0).attr({fill: k}).add().shadow(a.plotShadow);
            if (m) h ? h.animate(t) :
                this.plotBGImage = b.image(m, q, r, n, p).add();
            y ? y.animate({width: s.width, height: s.height}) : this.clipRect = b.clipRect(s);
            if (l) g ? g.animate(g.crisp({
                x: q,
                y: r,
                width: n,
                height: p,
                strokeWidth: -l
            })) : this.plotBorder = b.rect(q, r, n, p, 0, -l).attr({
                stroke: a.plotBorderColor,
                "stroke-width": l,
                fill: Z,
                zIndex: 1
            }).add();
            this.isDirtyBox = !1
        }, propFromSeries: function () {
            var a = this, b = a.options.chart, c, d = a.options.series, e, f;
            n(["inverted", "angular", "polar"], function (g) {
                c = F[b.type || b.defaultSeriesType];
                f = a[g] || b[g] || c && c.prototype[g];
                for (e = d && d.length; !f && e--;) (c = F[d[e].type]) && c.prototype[g] && (f = !0);
                a[g] = f
            })
        }, linkSeries: function () {
            var a = this, b = a.series;
            n(b, function (a) {
                a.linkedSeries.length = 0
            });
            n(b, function (b) {
                var d = b.options.linkedTo;
                if (Ja(d) && (d = d === ":previous" ? a.series[b.index - 1] : a.get(d))) d.linkedSeries.push(b), b.linkedParent = d
            })
        }, renderSeries: function () {
            n(this.series, function (a) {
                a.translate();
                a.render()
            })
        }, renderLabels: function () {
            var a = this, b = a.options.labels;
            b.items && n(b.items, function (c) {
                var d = w(b.style, c.style), e = L(d.left) +
                    a.plotLeft, f = L(d.top) + a.plotTop + 12;
                delete d.left;
                delete d.top;
                a.renderer.text(c.html, e, f).attr({zIndex: 2}).css(d).add()
            })
        }, render: function () {
            var a = this.axes, b = this.renderer, c = this.options, d, e, f, g;
            this.setTitle();
            this.legend = new tb(this, c.legend);
            this.getStacks();
            this.getMargins(!0);
            this.setChartSize();
            d = this.plotWidth;
            e = this.plotHeight -= 13;
            n(a, function (a) {
                a.setScale()
            });
            this.getAxisMargins();
            f = d / this.plotWidth > 1.1;
            g = e / this.plotHeight > 1.1;
            if (f || g) this.maxTicks = null, n(a, function (a) {
                (a.horiz && f || !a.horiz &&
                    g) && a.setTickInterval(!0)
            }), this.getMargins();
            this.drawChartBox();
            this.hasCartesianSeries && n(a, function (a) {
                a.render()
            });
            if (!this.seriesGroup) this.seriesGroup = b.g("series-group").attr({zIndex: 3}).add();
            this.renderSeries();
            this.renderLabels();
            this.showCredits(c.credits);
            this.hasRendered = !0
        }, showCredits: function (a) {
            if (a.enabled && !this.credits) this.credits = this.renderer.text(a.text, 0, 0).on("click", function () {
                if (a.href) location.href = a.href
            }).attr({align: a.position.align, zIndex: 8}).css(a.style).add().align(a.position)
        },
        destroy: function () {
            var a = this, b = a.axes, c = a.series, d = a.container, e, f = d && d.parentNode;
            E(a, "destroy");
            ba[a.index] = s;
            gb--;
            a.renderTo.removeAttribute("data-highcharts-chart");
            T(a);
            for (e = b.length; e--;) b[e] = b[e].destroy();
            for (e = c.length; e--;) c[e] = c[e].destroy();
            n("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","), function (b) {
                var c = a[b];
                c && c.destroy && (a[b] = c.destroy())
            });
            if (d) d.innerHTML =
                "", T(d), f && Ta(d);
            for (e in a) delete a[e]
        }, isReadyToRender: function () {
            var a = this;
            return !da && S == S.top && C.readyState !== "complete" || la && !S.canvg ? (la ? Wb.push(function () {
                a.firstRender()
            }, a.options.global.canvasToolsURL) : C.attachEvent("onreadystatechange", function () {
                C.detachEvent("onreadystatechange", a.firstRender);
                C.readyState === "complete" && a.firstRender()
            }), !1) : !0
        }, firstRender: function () {
            var a = this, b = a.options, c = a.callback;
            if (a.isReadyToRender()) {
                a.getContainer();
                E(a, "init");
                a.resetMargins();
                a.setChartSize();
                a.propFromSeries();
                a.getAxes();
                n(b.series || [], function (b) {
                    a.initSeries(b)
                });
                a.linkSeries();
                E(a, "beforeRender");
                if (A.Pointer) a.pointer = new Xa(a, b);
                a.render();
                a.renderer.draw();
                c && c.apply(a, [a]);
                n(a.callbacks, function (b) {
                    a.index !== s && b.apply(a, [a])
                });
                E(a, "load");
                a.cloneRenderTo(!0)
            }
        }, splashArray: function (a, b) {
            var c = b[a], c = ha(c) ? c : [c, c, c, c];
            return [p(b[a + "Top"], c[0]), p(b[a + "Right"], c[1]), p(b[a + "Bottom"], c[2]), p(b[a + "Left"], c[3])]
        }
    };
    var ic = A.CenteredSeriesMixin = {
        getCenter: function () {
            var a = this.options,
                b = this.chart, c = 2 * (a.slicedOffset || 0), d = b.plotWidth - 2 * c, b = b.plotHeight - 2 * c,
                e = a.center, e = [p(e[0], "50%"), p(e[1], "50%"), a.size || "100%", a.innerSize || 0], f = B(d, b), g,
                h;
            for (g = 0; g < 4; ++g) h = e[g], a = g < 2 || g === 2 && /%$/.test(h), e[g] = (/%$/.test(h) ? [d, b, f, e[2]][g] * parseFloat(h) / 100 : parseFloat(h)) + (a ? c : 0);
            return e
        }
    }, Ba = function () {
    };
    Ba.prototype = {
        init: function (a, b, c) {
            this.series = a;
            this.color = a.color;
            this.applyOptions(b, c);
            this.pointAttr = {};
            if (a.options.colorByPoint && (b = a.options.colors || a.chart.options.colors, this.color =
                    this.color || b[a.colorCounter++], a.colorCounter === b.length)) a.colorCounter = 0;
            a.chart.pointCount++;
            return this
        }, applyOptions: function (a, b) {
            var c = this.series, d = c.options.pointValKey || c.pointValKey,
                a = Ba.prototype.optionsToObject.call(this, a);
            w(this, a);
            this.options = this.options ? w(this.options, a) : a;
            if (d) this.y = this[d];
            if (this.x === s && c) this.x = b === s ? c.autoIncrement() : b;
            return this
        }, optionsToObject: function (a) {
            var b = {}, c = this.series, d = c.options.keys, e = d || c.pointArrayMap || ["y"], f = e.length, g = 0,
                h = 0;
            if (typeof a ===
                "number" || a === null) b[e[0]] = a; else if (Ka(a)) {
                if (!d && a.length > f) {
                    c = typeof a[0];
                    if (c === "string") b.name = a[0]; else if (c === "number") b.x = a[0];
                    g++
                }
                for (; h < f;) b[e[h++]] = a[g++]
            } else if (typeof a === "object") {
                b = a;
                if (a.dataLabels) c._hasPointLabels = !0;
                if (a.marker) c._hasPointMarkers = !0
            }
            return b
        }, destroy: function () {
            var a = this.series.chart, b = a.hoverPoints, c;
            a.pointCount--;
            if (b && (this.setState(), ta(b, this), !b.length)) a.hoverPoints = null;
            if (this === a.hoverPoint) this.onMouseOut();
            if (this.graphic || this.dataLabel) T(this),
                this.destroyElements();
            this.legendItem && a.legend.destroyItem(this);
            for (c in this) this[c] = null
        }, destroyElements: function () {
            for (var a = "graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","), b, c = 6; c--;) b = a[c], this[b] && (this[b] = this[b].destroy())
        }, getLabelConfig: function () {
            return {
                x: this.category,
                y: this.y,
                key: this.name || this.category,
                series: this.series,
                point: this,
                percentage: this.percentage,
                total: this.total || this.stackTotal
            }
        }, tooltipFormatter: function (a) {
            var b = this.series, c = b.tooltipOptions,
                d = p(c.valueDecimals, ""), e = c.valuePrefix || "", f = c.valueSuffix || "";
            n(b.pointArrayMap || ["y"], function (b) {
                b = "{point." + b;
                if (e || f) a = a.replace(b + "}", e + b + "}" + f);
                a = a.replace(b + "}", b + ":,." + d + "f}")
            });
            return Ma(a, {point: this, series: this.series})
        }, firePointEvent: function (a, b, c) {
            var d = this, e = this.series.options;
            (e.point.events[a] || d.options && d.options.events && d.options.events[a]) && this.importEvents();
            a === "click" && e.allowPointSelect && (c = function (a) {
                d.select(null, a.ctrlKey || a.metaKey || a.shiftKey)
            });
            E(this, a, b, c)
        }
    };
    var O = A.Series = function () {
    };
    O.prototype = {
        isCartesian: !0,
        type: "line",
        pointClass: Ba,
        sorted: !0,
        requireSorting: !0,
        pointAttrToOptions: {stroke: "lineColor", "stroke-width": "lineWidth", fill: "fillColor", r: "radius"},
        axisTypes: ["xAxis", "yAxis"],
        colorCounter: 0,
        parallelArrays: ["x", "y"],
        init: function (a, b) {
            var c = this, d, e, f = a.series, g = function (a, b) {
                return p(a.options.index, a._i) - p(b.options.index, b._i)
            };
            c.chart = a;
            c.options = b = c.setOptions(b);
            c.linkedSeries = [];
            c.bindAxes();
            w(c, {
                name: b.name, state: "", pointAttr: {}, visible: b.visible !==
                !1, selected: b.selected === !0
            });
            if (la) b.animation = !1;
            e = b.events;
            for (d in e) D(c, d, e[d]);
            if (e && e.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0;
            c.getColor();
            c.getSymbol();
            n(c.parallelArrays, function (a) {
                c[a + "Data"] = []
            });
            c.setData(b.data, !1);
            if (c.isCartesian) a.hasCartesianSeries = !0;
            f.push(c);
            c._i = f.length - 1;
            zb(f, g);
            this.yAxis && zb(this.yAxis.series, g);
            n(f, function (a, b) {
                a.index = b;
                a.name = a.name || "Series " + (b + 1)
            })
        },
        bindAxes: function () {
            var a = this, b = a.options, c =
                a.chart, d;
            n(a.axisTypes || [], function (e) {
                n(c[e], function (c) {
                    d = c.options;
                    if (b[e] === d.index || b[e] !== s && b[e] === d.id || b[e] === s && d.index === 0) c.series.push(a), a[e] = c, c.isDirty = !0
                });
                !a[e] && a.optionalAxis !== e && pa(18, !0)
            })
        },
        updateParallelArrays: function (a, b) {
            var c = a.series, d = arguments;
            n(c.parallelArrays, typeof b === "number" ? function (d) {
                var f = d === "y" && c.toYData ? c.toYData(a) : a[d];
                c[d + "Data"][b] = f
            } : function (a) {
                Array.prototype[b].apply(c[a + "Data"], Array.prototype.slice.call(d, 2))
            })
        },
        autoIncrement: function () {
            var a =
                this.options, b = this.xIncrement, c, d = a.pointIntervalUnit, b = p(b, a.pointStart, 0);
            this.pointInterval = c = p(this.pointInterval, a.pointInterval, 1);
            if (d === "month" || d === "year") a = new ea(b), a = d === "month" ? +a[Eb](a[db]() + c) : +a[Fb](a[eb]() + c), c = a - b;
            this.xIncrement = b + c;
            return b
        },
        getSegments: function () {
            var a = -1, b = [], c, d = this.points, e = d.length;
            if (e) if (this.options.connectNulls) {
                for (c = e; c--;) d[c].y === null && d.splice(c, 1);
                d.length && (b = [d])
            } else n(d, function (c, g) {
                c.y === null ? (g > a + 1 && b.push(d.slice(a + 1, g)), a = g) : g === e - 1 &&
                    b.push(d.slice(a + 1, g + 1))
            });
            this.segments = b
        },
        setOptions: function (a) {
            var b = this.chart, c = b.options.plotOptions, b = b.userOptions || {}, d = b.plotOptions || {},
                e = c[this.type];
            this.userOptions = a;
            c = z(e, c.series, a);
            this.tooltipOptions = z(P.tooltip, P.plotOptions[this.type].tooltip, b.tooltip, d.series && d.series.tooltip, d[this.type] && d[this.type].tooltip, a.tooltip);
            e.marker === null && delete c.marker;
            this.zoneAxis = c.zoneAxis;
            a = this.zones = (c.zones || []).slice();
            if ((c.negativeColor || c.negativeFillColor) && !c.zones) a.push({
                value: c[this.zoneAxis +
                "Threshold"] || c.threshold || 0, color: c.negativeColor, fillColor: c.negativeFillColor
            });
            a.length && v(a[a.length - 1].value) && a.push({color: this.color, fillColor: this.fillColor});
            return c
        },
        getCyclic: function (a, b, c) {
            var d = this.userOptions, e = "_" + a + "Index", f = a + "Counter";
            b || (v(d[e]) ? b = d[e] : (d[e] = b = this.chart[f] % c.length, this.chart[f] += 1), b = c[b]);
            this[a] = b
        },
        getColor: function () {
            this.options.colorByPoint || this.getCyclic("color", this.options.color || U[this.type].color, this.chart.options.colors)
        },
        getSymbol: function () {
            var a =
                this.options.marker;
            this.getCyclic("symbol", a.symbol, this.chart.options.symbols);
            if (/^url/.test(this.symbol)) a.radius = 0
        },
        drawLegendSymbol: H.drawLineMarker,
        setData: function (a, b, c, d) {
            var e = this, f = e.points, g = f && f.length || 0, h, i = e.options, j = e.chart, k = null, m = e.xAxis,
                l = m && !!m.categories, o = i.turboThreshold, q = this.xData, r = this.yData,
                G = (h = e.pointArrayMap) && h.length, a = a || [];
            h = a.length;
            b = p(b, !0);
            if (d !== !1 && h && g === h && !e.cropped && !e.hasGroupedData && e.visible) n(a, function (a, b) {
                f[b].update(a, !1, null, !1)
            }); else {
                e.xIncrement =
                    null;
                e.pointRange = l ? 1 : i.pointRange;
                e.colorCounter = 0;
                n(this.parallelArrays, function (a) {
                    e[a + "Data"].length = 0
                });
                if (o && h > o) {
                    for (c = 0; k === null && c < h;) k = a[c], c++;
                    if (ra(k)) {
                        l = p(i.pointStart, 0);
                        i = p(i.pointInterval, 1);
                        for (c = 0; c < h; c++) q[c] = l, r[c] = a[c], l += i;
                        e.xIncrement = l
                    } else if (Ka(k)) if (G) for (c = 0; c < h; c++) i = a[c], q[c] = i[0], r[c] = i.slice(1, G + 1); else for (c = 0; c < h; c++) i = a[c], q[c] = i[0], r[c] = i[1]; else pa(12)
                } else for (c = 0; c < h; c++) if (a[c] !== s && (i = {series: e}, e.pointClass.prototype.applyOptions.apply(i, [a[c]]), e.updateParallelArrays(i,
                        c), l && i.name)) m.names[i.x] = i.name;
                Ja(r[0]) && pa(14, !0);
                e.data = [];
                e.options.data = a;
                for (c = g; c--;) f[c] && f[c].destroy && f[c].destroy();
                if (m) m.minRange = m.userMinRange;
                e.isDirty = e.isDirtyData = j.isDirtyBox = !0;
                c = !1
            }
            b && j.redraw(c)
        },
        processData: function (a) {
            var b = this.xData, c = this.yData, d = b.length, e;
            e = 0;
            var f, g, h = this.xAxis, i, j = this.options;
            i = j.cropThreshold;
            var k = this.isCartesian, m, l;
            if (k && !this.isDirty && !h.isDirty && !this.yAxis.isDirty && !a) return !1;
            if (h) a = h.getExtremes(), m = a.min, l = a.max;
            if (k && this.sorted && (!i ||
                    d > i || this.forceCrop)) if (b[d - 1] < m || b[0] > l) b = [], c = []; else if (b[0] < m || b[d - 1] > l) e = this.cropData(this.xData, this.yData, m, l), b = e.xData, c = e.yData, e = e.start, f = !0;
            for (i = b.length - 1; i >= 0; i--) d = b[i] - b[i - 1], d > 0 && (g === s || d < g) ? g = d : d < 0 && this.requireSorting && pa(15);
            this.cropped = f;
            this.cropStart = e;
            this.processedXData = b;
            this.processedYData = c;
            if (j.pointRange === null) this.pointRange = g || 1;
            this.closestPointRange = g
        },
        cropData: function (a, b, c, d) {
            var e = a.length, f = 0, g = e, h = p(this.cropShoulder, 1), i;
            for (i = 0; i < e; i++) if (a[i] >= c) {
                f =
                    x(0, i - h);
                break
            }
            for (; i < e; i++) if (a[i] > d) {
                g = i + h;
                break
            }
            return {xData: a.slice(f, g), yData: b.slice(f, g), start: f, end: g}
        },
        generatePoints: function () {
            var a = this.options.data, b = this.data, c, d = this.processedXData, e = this.processedYData,
                f = this.pointClass, g = d.length, h = this.cropStart || 0, i, j = this.hasGroupedData, k, m = [], l;
            if (!b && !j) b = [], b.length = a.length, b = this.data = b;
            for (l = 0; l < g; l++) i = h + l, j ? m[l] = (new f).init(this, [d[l]].concat(oa(e[l]))) : (b[i] ? k = b[i] : a[i] !== s && (b[i] = k = (new f).init(this, a[i], d[l])), m[l] = k), m[l].index =
                i;
            if (b && (g !== (c = b.length) || j)) for (l = 0; l < c; l++) if (l === h && !j && (l += g), b[l]) b[l].destroyElements(), b[l].plotX = s;
            this.data = b;
            this.points = m
        },
        getExtremes: function (a) {
            var b = this.yAxis, c = this.processedXData, d, e = [], f = 0;
            d = this.xAxis.getExtremes();
            var g = d.min, h = d.max, i, j, k, m, a = a || this.stackedYData || this.processedYData;
            d = a.length;
            for (m = 0; m < d; m++) if (j = c[m], k = a[m], i = k !== null && k !== s && (!b.isLog || k.length || k > 0), j = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || (c[m + 1] || j) >= g && (c[m - 1] || j) <= h,
                i && j) if (i = k.length) for (; i--;) k[i] !== null && (e[f++] = k[i]); else e[f++] = k;
            this.dataMin = Sa(e);
            this.dataMax = Ea(e)
        },
        translate: function () {
            this.processedXData || this.processData();
            this.generatePoints();
            for (var a = this.options, b = a.stacking, c = this.xAxis, d = c.categories, e = this.yAxis, f = this.points, g = f.length, h = !!this.modifyValue, i = a.pointPlacement, j = i === "between" || ra(i), k = a.threshold, m = a.startFromThreshold ? k : 0, l, o, q, r = Number.MAX_VALUE, a = 0; a < g; a++) {
                var n = f[a], u = n.x, t = n.y;
                o = n.low;
                var y = b && e.stacks[(this.negStacks &&
                t < (m ? 0 : k) ? "-" : "") + this.stackKey];
                if (e.isLog && t !== null && t <= 0) n.y = t = null, pa(10);
                n.plotX = l = B(x(-1E5, c.translate(u, 0, 0, 0, 1, i, this.type === "flags")), 1E5);
                if (b && this.visible && y && y[u]) y = y[u], t = y.points[this.index + "," + a], o = t[0], t = t[1], o === m && (o = p(k, e.min)), e.isLog && o <= 0 && (o = null), n.total = n.stackTotal = y.total, n.percentage = y.total && n.y / y.total * 100, n.stackY = t, y.setOffset(this.pointXOffset || 0, this.barW || 0);
                n.yBottom = v(o) ? e.translate(o, 0, 1, 0, 1) : null;
                h && (t = this.modifyValue(t, n));
                n.plotY = o = typeof t === "number" && t !==
                Infinity ? B(x(-1E5, e.translate(t, 0, 1, 0, 1)), 1E5) : s;
                n.isInside = o !== s && o >= 0 && o <= e.len && l >= 0 && l <= c.len;
                n.clientX = j ? c.translate(u, 0, 0, 0, 1) : l;
                n.negative = n.y < (k || 0);
                n.category = d && d[n.x] !== s ? d[n.x] : n.x;
                a && (r = B(r, Q(l - q)));
                q = l
            }
            this.closestPointRangePx = r;
            this.getSegments()
        },
        setClip: function (a) {
            var b = this.chart, c = b.renderer, d = b.inverted, e = this.clipBox, f = e || b.clipBox,
                g = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, f.height].join(","), h = b[g],
                i = b[g + "m"];
            if (!h) {
                if (a) f.width = 0, b[g + "m"] = i = c.clipRect(-99,
                    d ? -b.plotLeft : -b.plotTop, 99, d ? b.chartWidth : b.chartHeight);
                b[g] = h = c.clipRect(f)
            }
            a && (h.count += 1);
            if (this.options.clip !== !1) this.group.clip(a || e ? h : b.clipRect), this.markerGroup.clip(i), this.sharedClipKey = g;
            a || (h.count -= 1, h.count <= 0 && g && b[g] && (e || (b[g] = b[g].destroy()), b[g + "m"] && (b[g + "m"] = b[g + "m"].destroy())))
        },
        animate: function (a) {
            var b = this.chart, c = this.options.animation, d;
            if (c && !ha(c)) c = U[this.type].animation;
            a ? this.setClip(c) : (d = this.sharedClipKey, (a = b[d]) && a.animate({width: b.plotSizeX}, c), b[d + "m"] &&
            b[d + "m"].animate({width: b.plotSizeX + 99}, c), this.animate = null)
        },
        afterAnimate: function () {
            this.setClip();
            E(this, "afterAnimate")
        },
        drawPoints: function () {
            var a, b = this.points, c = this.chart, d, e, f, g, h, i, j, k, m = this.options.marker,
                l = this.pointAttr[""], o, q, r, n = this.markerGroup,
                u = p(m.enabled, this.xAxis.isRadial, this.closestPointRangePx > 2 * m.radius);
            if (m.enabled !== !1 || this._hasPointMarkers) for (f = b.length; f--;) if (g = b[f], d = W(g.plotX), e = g.plotY, k = g.graphic, o = g.marker || {}, q = !!g.marker, a = u && o.enabled === s || o.enabled, r =
                    g.isInside, a && e !== s && !isNaN(e) && g.y !== null) if (a = g.pointAttr[g.selected ? "select" : ""] || l, h = a.r, i = p(o.symbol, this.symbol), j = i.indexOf("url") === 0, k) k[r ? "show" : "hide"](!0).animate(w({
                x: d - h,
                y: e - h
            }, k.symbolName ? {width: 2 * h, height: 2 * h} : {})); else {
                if (r && (h > 0 || j)) g.graphic = c.renderer.symbol(i, d - h, e - h, 2 * h, 2 * h, q ? o : m).attr(a).add(n)
            } else if (k) g.graphic = k.destroy()
        },
        convertAttribs: function (a, b, c, d) {
            var e = this.pointAttrToOptions, f, g, h = {}, a = a || {}, b = b || {}, c = c || {}, d = d || {};
            for (f in e) g = e[f], h[f] = p(a[g], b[f], c[f], d[f]);
            return h
        },
        getAttribs: function () {
            var a = this, b = a.options, c = U[a.type].marker ? b.marker : b, d = c.states, e = d.hover, f, g = a.color,
                h = a.options.negativeColor;
            f = {stroke: g, fill: g};
            var i = a.points || [], j, k = [], m, l = a.pointAttrToOptions;
            m = a.hasPointSpecificOptions;
            var o = c.lineColor, q = c.fillColor;
            j = b.turboThreshold;
            var r = a.zones, p = a.zoneAxis || "y", u;
            b.marker ? (e.radius = e.radius || c.radius + e.radiusPlus, e.lineWidth = e.lineWidth || c.lineWidth + e.lineWidthPlus) : (e.color = e.color || va(e.color || g).brighten(e.brightness).get(), e.negativeColor =
                e.negativeColor || va(e.negativeColor || h).brighten(e.brightness).get());
            k[""] = a.convertAttribs(c, f);
            n(["hover", "select"], function (b) {
                k[b] = a.convertAttribs(d[b], k[""])
            });
            a.pointAttr = k;
            g = i.length;
            if (!j || g < j || m) for (; g--;) {
                j = i[g];
                if ((c = j.options && j.options.marker || j.options) && c.enabled === !1) c.radius = 0;
                if (r.length) {
                    m = 0;
                    for (f = r[m]; j[p] >= f.value;) f = r[++m];
                    j.color = j.fillColor = f.color
                }
                m = b.colorByPoint || j.color;
                if (j.options) for (u in l) v(c[l[u]]) && (m = !0);
                if (m) {
                    c = c || {};
                    m = [];
                    d = c.states || {};
                    f = d.hover = d.hover || {};
                    if (!b.marker) f.color = f.color || !j.options.color && e[j.negative && h ? "negativeColor" : "color"] || va(j.color).brighten(f.brightness || e.brightness).get();
                    f = {color: j.color};
                    if (!q) f.fillColor = j.color;
                    if (!o) f.lineColor = j.color;
                    c.hasOwnProperty("color") && !c.color && delete c.color;
                    m[""] = a.convertAttribs(w(f, c), k[""]);
                    m.hover = a.convertAttribs(d.hover, k.hover, m[""]);
                    m.select = a.convertAttribs(d.select, k.select, m[""])
                } else m = k;
                j.pointAttr = m
            }
        },
        destroy: function () {
            var a = this, b = a.chart, c = /AppleWebKit\/533/.test(Ga), d, e =
                a.data || [], f, g, h;
            E(a, "destroy");
            T(a);
            n(a.axisTypes || [], function (b) {
                if (h = a[b]) ta(h.series, a), h.isDirty = h.forceRedraw = !0
            });
            a.legendItem && a.chart.legend.destroyItem(a);
            for (d = e.length; d--;) (f = e[d]) && f.destroy && f.destroy();
            a.points = null;
            clearTimeout(a.animationTimeout);
            for (g in a) a[g] instanceof Y && !a[g].survive && (d = c && g === "group" ? "hide" : "destroy", a[g][d]());
            if (b.hoverSeries === a) b.hoverSeries = null;
            ta(b.series, a);
            for (g in a) delete a[g]
        },
        getSegmentPath: function (a) {
            var b = this, c = [], d = b.options.step;
            n(a, function (e,
                           f) {
                var g = e.plotX, h = e.plotY, i;
                b.getPointSpline ? c.push.apply(c, b.getPointSpline(a, e, f)) : (c.push(f ? "L" : "M"), d && f && (i = a[f - 1], d === "right" ? c.push(i.plotX, h) : d === "center" ? c.push((i.plotX + g) / 2, i.plotY, (i.plotX + g) / 2, h) : c.push(g, i.plotY)), c.push(e.plotX, e.plotY))
            });
            return c
        },
        getGraphPath: function () {
            var a = this, b = [], c, d = [];
            n(a.segments, function (e) {
                c = a.getSegmentPath(e);
                e.length > 1 ? b = b.concat(c) : d.push(e[0])
            });
            a.singlePoints = d;
            return a.graphPath = b
        },
        drawGraph: function () {
            var a = this, b = this.options, c = [["graph", b.lineColor ||
                this.color, b.dashStyle]], d = b.lineWidth, e = b.linecap !== "square", f = this.getGraphPath(),
                g = this.fillGraph && this.color || Z;
            n(this.zones, function (d, e) {
                c.push(["zoneGraph" + e, d.color || a.color, d.dashStyle || b.dashStyle])
            });
            n(c, function (c, i) {
                var j = c[0], k = a[j];
                if (k) ab(k), k.animate({d: f}); else if ((d || g) && f.length) k = {
                    stroke: c[1],
                    "stroke-width": d,
                    fill: g,
                    zIndex: 1
                }, c[2] ? k.dashstyle = c[2] : e && (k["stroke-linecap"] = k["stroke-linejoin"] = "round"), a[j] = a.chart.renderer.path(f).attr(k).add(a.group).shadow(i < 2 && b.shadow)
            })
        },
        applyZones: function () {
            var a = this, b = this.chart, c = b.renderer, d = this.zones, e, f, g = this.clips || [], h, i = this.graph,
                j = this.area, k = x(b.chartWidth, b.chartHeight), m = this[(this.zoneAxis || "y") + "Axis"], l,
                o = m.reversed, q = b.inverted, r = m.horiz, G, s, t, y = !1;
            if (d.length && (i || j)) i && i.hide(), j && j.hide(), l = m.getExtremes(), n(d, function (d, n) {
                e = o ? r ? b.plotWidth : 0 : r ? 0 : m.toPixels(l.min);
                e = B(x(p(f, e), 0), k);
                f = B(x(u(m.toPixels(p(d.value, l.max), !0)), 0), k);
                y && (e = f = m.toPixels(l.max));
                G = Math.abs(e - f);
                s = B(e, f);
                t = x(e, f);
                if (m.isXAxis) {
                    if (h =
                            {x: q ? t : s, y: 0, width: G, height: k}, !r) h.x = b.plotHeight - h.x
                } else if (h = {x: 0, y: q ? t : s, width: k, height: G}, r) h.y = b.plotWidth - h.y;
                b.inverted && c.isVML && (h = m.isXAxis ? {
                    x: 0,
                    y: o ? s : t,
                    height: h.width,
                    width: b.chartWidth
                } : {x: h.y - b.plotLeft - b.spacingBox.x, y: 0, width: h.height, height: b.chartHeight});
                g[n] ? g[n].animate(h) : (g[n] = c.clipRect(h), i && a["zoneGraph" + n].clip(g[n]), j && a["zoneArea" + n].clip(g[n]));
                y = d.value > l.max
            }), this.clips = g
        },
        invertGroups: function () {
            function a() {
                var a = {width: b.yAxis.len, height: b.xAxis.len};
                n(["group",
                    "markerGroup"], function (c) {
                    b[c] && b[c].attr(a).invert()
                })
            }

            var b = this, c = b.chart;
            if (b.xAxis) D(c, "resize", a), D(b, "destroy", function () {
                T(c, "resize", a)
            }), a(), b.invertGroups = a
        },
        plotGroup: function (a, b, c, d, e) {
            var f = this[a], g = !f;
            g && (this[a] = f = this.chart.renderer.g(b).attr({visibility: c, zIndex: d || 0.1}).add(e));
            f[g ? "attr" : "animate"](this.getPlotBox());
            return f
        },
        getPlotBox: function () {
            var a = this.chart, b = this.xAxis, c = this.yAxis;
            if (a.inverted) b = c, c = this.xAxis;
            return {
                translateX: b ? b.left : a.plotLeft, translateY: c ? c.top :
                    a.plotTop, scaleX: 1, scaleY: 1
            }
        },
        render: function () {
            var a = this, b = a.chart, c, d = a.options,
                e = (c = d.animation) && !!a.animate && b.renderer.isSVG && p(c.duration, 500) || 0,
                f = a.visible ? "visible" : "hidden", g = d.zIndex, h = a.hasRendered, i = b.seriesGroup;
            c = a.plotGroup("group", "series", f, g, i);
            a.markerGroup = a.plotGroup("markerGroup", "markers", f, g, i);
            e && a.animate(!0);
            a.getAttribs();
            c.inverted = a.isCartesian ? b.inverted : !1;
            a.drawGraph && (a.drawGraph(), a.applyZones());
            n(a.points, function (a) {
                a.redraw && a.redraw()
            });
            a.drawDataLabels &&
            a.drawDataLabels();
            a.visible && a.drawPoints();
            a.drawTracker && a.options.enableMouseTracking !== !1 && a.drawTracker();
            b.inverted && a.invertGroups();
            d.clip !== !1 && !a.sharedClipKey && !h && c.clip(b.clipRect);
            e && a.animate();
            if (!h) e ? a.animationTimeout = setTimeout(function () {
                a.afterAnimate()
            }, e) : a.afterAnimate();
            a.isDirty = a.isDirtyData = !1;
            a.hasRendered = !0
        },
        redraw: function () {
            var a = this.chart, b = this.isDirtyData, c = this.isDirty, d = this.group, e = this.xAxis, f = this.yAxis;
            d && (a.inverted && d.attr({width: a.plotWidth, height: a.plotHeight}),
                d.animate({translateX: p(e && e.left, a.plotLeft), translateY: p(f && f.top, a.plotTop)}));
            this.translate();
            this.render();
            b && E(this, "updatedData");
            (c || b) && delete this.kdTree
        },
        kdDimensions: 1,
        kdAxisArray: ["clientX", "plotY"],
        searchPoint: function (a, b) {
            var c = this.xAxis, d = this.yAxis, e = this.chart.inverted;
            return this.searchKDTree({
                clientX: e ? c.len - a.chartY + c.pos : a.chartX - c.pos,
                plotY: e ? d.len - a.chartX + d.pos : a.chartY - d.pos
            }, b)
        },
        buildKDTree: function () {
            function a(b, d, g) {
                var h, i;
                if (i = b && b.length) return h = c.kdAxisArray[d %
                g], b.sort(function (a, b) {
                    return a[h] - b[h]
                }), i = Math.floor(i / 2), {
                    point: b[i],
                    left: a(b.slice(0, i), d + 1, g),
                    right: a(b.slice(i + 1), d + 1, g)
                }
            }

            function b() {
                var b = hb(c.points, function (a) {
                    return a.y !== null
                });
                c.kdTree = a(b, d, d)
            }

            var c = this, d = c.kdDimensions;
            delete c.kdTree;
            c.options.kdSync ? b() : setTimeout(b)
        },
        searchKDTree: function (a, b) {
            function c(a, b, j, k) {
                var m = b.point, l = d.kdAxisArray[j % k], o, q, r = m;
                q = v(a[e]) && v(m[e]) ? Math.pow(a[e] - m[e], 2) : null;
                o = v(a[f]) && v(m[f]) ? Math.pow(a[f] - m[f], 2) : null;
                o = (q || 0) + (o || 0);
                m.dist = v(o) ? Math.sqrt(o) :
                    Number.MAX_VALUE;
                m.distX = v(q) ? Math.sqrt(q) : Number.MAX_VALUE;
                l = a[l] - m[l];
                o = l < 0 ? "left" : "right";
                q = l < 0 ? "right" : "left";
                b[o] && (o = c(a, b[o], j + 1, k), r = o[g] < r[g] ? o : m);
                b[q] && Math.sqrt(l * l) < r[g] && (a = c(a, b[q], j + 1, k), r = a[g] < r[g] ? a : r);
                return r
            }

            var d = this, e = this.kdAxisArray[0], f = this.kdAxisArray[1], g = b ? "distX" : "dist";
            this.kdTree || this.buildKDTree();
            if (this.kdTree) return c(a, this.kdTree, this.kdDimensions, this.kdDimensions)
        }
    };
    Tb.prototype = {
        destroy: function () {
            Na(this, this.axis)
        }, render: function (a) {
            var b = this.options,
                c = b.format, c = c ? Ma(c, this) : b.formatter.call(this);
            this.label ? this.label.attr({
                text: c,
                visibility: "hidden"
            }) : this.label = this.axis.chart.renderer.text(c, null, null, b.useHTML).css(b.style).attr({
                align: this.textAlign,
                rotation: b.rotation,
                visibility: "hidden"
            }).add(a)
        }, setOffset: function (a, b) {
            var c = this.axis, d = c.chart, e = d.inverted, f = c.reversed,
                f = this.isNegative && !f || !this.isNegative && f,
                g = c.translate(c.usePercentage ? 100 : this.total, 0, 0, 0, 1), c = c.translate(0), c = Q(g - c),
                h = d.xAxis[0].translate(this.x) + a, i = d.plotHeight,
                f = {
                    x: e ? f ? g : g - c : h,
                    y: e ? i - h - b : f ? i - g - c : i - g,
                    width: e ? c : b,
                    height: e ? b : c
                };
            if (e = this.label) e.align(this.alignOptions, null, f), f = e.alignAttr, e[this.options.crop === !1 || d.isInsidePlot(f.x, f.y) ? "show" : "hide"](!0)
        }
    };
    J.prototype.buildStacks = function () {
        var a = this.series, b = p(this.options.reversedStacks, !0), c = a.length;
        if (!this.isXAxis) {
            for (this.usePercentage = !1; c--;) a[b ? c : a.length - c - 1].setStackedPoints();
            if (this.usePercentage) for (c = 0; c < a.length; c++) a[c].setPercentStacks()
        }
    };
    J.prototype.renderStackTotals = function () {
        var a =
            this.chart, b = a.renderer, c = this.stacks, d, e, f = this.stackTotalGroup;
        if (!f) this.stackTotalGroup = f = b.g("stack-labels").attr({visibility: "visible", zIndex: 6}).add();
        f.translate(a.plotLeft, a.plotTop);
        for (d in c) for (e in a = c[d], a) a[e].render(f)
    };
    O.prototype.setStackedPoints = function () {
        if (this.options.stacking && !(this.visible !== !0 && this.chart.options.chart.ignoreHiddenSeries !== !1)) {
            var a = this.processedXData, b = this.processedYData, c = [], d = b.length, e = this.options,
                f = e.threshold, g = e.startFromThreshold ? f : 0, h = e.stack,
                e = e.stacking, i = this.stackKey, j = "-" + i, k = this.negStacks, m = this.yAxis, l = m.stacks,
                o = m.oldStacks, q, r, n, s, t, y;
            for (s = 0; s < d; s++) {
                t = a[s];
                y = b[s];
                n = this.index + "," + s;
                r = (q = k && y < (g ? 0 : f)) ? j : i;
                l[r] || (l[r] = {});
                if (!l[r][t]) o[r] && o[r][t] ? (l[r][t] = o[r][t], l[r][t].total = null) : l[r][t] = new Tb(m, m.options.stackLabels, q, t, h);
                r = l[r][t];
                r.points[n] = [p(r.cum, g)];
                e === "percent" ? (q = q ? i : j, k && l[q] && l[q][t] ? (q = l[q][t], r.total = q.total = x(q.total, r.total) + Q(y) || 0) : r.total = ka(r.total + (Q(y) || 0))) : r.total = ka(r.total + (y || 0));
                r.cum = p(r.cum,
                    g) + (y || 0);
                r.points[n].push(r.cum);
                c[s] = r.cum
            }
            if (e === "percent") m.usePercentage = !0;
            this.stackedYData = c;
            m.oldStacks = {}
        }
    };
    O.prototype.setPercentStacks = function () {
        var a = this, b = a.stackKey, c = a.yAxis.stacks, d = a.processedXData;
        n([b, "-" + b], function (b) {
            var e;
            for (var f = d.length, g, h; f--;) if (g = d[f], e = (h = c[b] && c[b][g]) && h.points[a.index + "," + f], g = e) h = h.total ? 100 / h.total : 0, g[0] = ka(g[0] * h), g[1] = ka(g[1] * h), a.stackedYData[f] = g[1]
        })
    };
    w(Pa.prototype, {
        addSeries: function (a, b, c) {
            var d, e = this;
            a && (b = p(b, !0), E(e, "addSeries",
                {options: a}, function () {
                    d = e.initSeries(a);
                    e.isDirtyLegend = !0;
                    e.linkSeries();
                    b && e.redraw(c)
                }));
            return d
        }, addAxis: function (a, b, c, d) {
            var e = b ? "xAxis" : "yAxis", f = this.options;
            new J(this, z(a, {index: this[e].length, isX: b}));
            f[e] = oa(f[e] || {});
            f[e].push(a);
            p(c, !0) && this.redraw(d)
        }, showLoading: function (a) {
            var b = this, c = b.options, d = b.loadingDiv, e = c.loading, f = function () {
                d && M(d, {
                    left: b.plotLeft + "px",
                    top: b.plotTop + "px",
                    width: b.plotWidth + "px",
                    height: b.plotHeight + "px"
                })
            };
            if (!d) b.loadingDiv = d = $(Ua, {className: "highcharts-loading"},
                w(e.style, {
                    zIndex: 10,
                    display: Z
                }), b.container), b.loadingSpan = $("span", null, e.labelStyle, d), D(b, "redraw", f);
            b.loadingSpan.innerHTML = a || c.lang.loading;
            if (!b.loadingShown) M(d, {
                opacity: 0,
                display: ""
            }), rb(d, {opacity: e.style.opacity}, {duration: e.showDuration || 0}), b.loadingShown = !0;
            f()
        }, hideLoading: function () {
            var a = this.options, b = this.loadingDiv;
            b && rb(b, {opacity: 0}, {
                duration: a.loading.hideDuration || 100, complete: function () {
                    M(b, {display: Z})
                }
            });
            this.loadingShown = !1
        }
    });
    w(Ba.prototype, {
        update: function (a, b, c, d) {
            function e() {
                f.applyOptions(a);
                if (f.y === null && h) f.graphic = h.destroy();
                if (ha(a) && !Ka(a)) f.redraw = function () {
                    if (h) if (a && a.marker && a.marker.symbol) f.graphic = h.destroy(); else h.attr(f.pointAttr[f.state || ""])[f.visible ? "show" : "hide"](!0);
                    if (a && a.dataLabels && f.dataLabel) f.dataLabel = f.dataLabel.destroy();
                    f.redraw = null
                };
                i = f.index;
                g.updateParallelArrays(f, i);
                if (m && f.name) m[f.x] = f.name;
                k.data[i] = f.options;
                g.isDirty = g.isDirtyData = !0;
                if (!g.fixedBox && g.hasCartesianSeries) j.isDirtyBox = !0;
                if (k.legendType === "point") j.isDirtyLegend = !0;
                b && j.redraw(c)
            }

            var f = this, g = f.series, h = f.graphic, i, j = g.chart, k = g.options, m = g.xAxis && g.xAxis.names,
                b = p(b, !0);
            d === !1 ? e() : f.firePointEvent("update", {options: a}, e)
        }, remove: function (a, b) {
            this.series.removePoint(Oa(this, this.series.data), a, b)
        }
    });
    w(O.prototype, {
        addPoint: function (a, b, c, d) {
            var e = this, f = e.options, g = e.data, h = e.graph, i = e.area, j = e.chart, k = e.xAxis && e.xAxis.names,
                m = h && h.shift || 0, l = ["graph", "area"], h = f.data, o, q = e.xData;
            Ya(d, j);
            if (c) {
                for (d = e.zones.length; d--;) l.push("zoneGraph" + d, "zoneArea" + d);
                n(l, function (a) {
                    if (e[a]) e[a].shift =
                        m + 1
                })
            }
            if (i) i.isArea = !0;
            b = p(b, !0);
            i = {series: e};
            e.pointClass.prototype.applyOptions.apply(i, [a]);
            l = i.x;
            d = q.length;
            if (e.requireSorting && l < q[d - 1]) for (o = !0; d && q[d - 1] > l;) d--;
            e.updateParallelArrays(i, "splice", d, 0, 0);
            e.updateParallelArrays(i, d);
            if (k && i.name) k[l] = i.name;
            h.splice(d, 0, a);
            o && (e.data.splice(d, 0, null), e.processData());
            f.legendType === "point" && e.generatePoints();
            c && (g[0] && g[0].remove ? g[0].remove(!1) : (g.shift(), e.updateParallelArrays(i, "shift"), h.shift()));
            e.isDirty = !0;
            e.isDirtyData = !0;
            b && (e.getAttribs(),
                j.redraw())
        }, removePoint: function (a, b, c) {
            var d = this, e = d.data, f = e[a], g = d.points, h = d.chart, i = function () {
                e.length === g.length && g.splice(a, 1);
                e.splice(a, 1);
                d.options.data.splice(a, 1);
                d.updateParallelArrays(f || {series: d}, "splice", a, 1);
                f && f.destroy();
                d.isDirty = !0;
                d.isDirtyData = !0;
                b && h.redraw()
            };
            Ya(c, h);
            b = p(b, !0);
            f ? f.firePointEvent("remove", null, i) : i()
        }, remove: function (a, b) {
            var c = this, d = c.chart, a = p(a, !0);
            if (!c.isRemoving) c.isRemoving = !0, E(c, "remove", null, function () {
                c.destroy();
                d.isDirtyLegend = d.isDirtyBox =
                    !0;
                d.linkSeries();
                a && d.redraw(b)
            });
            c.isRemoving = !1
        }, update: function (a, b) {
            var c = this, d = this.chart, e = this.userOptions, f = this.type, g = F[f].prototype,
                h = ["group", "markerGroup", "dataLabelsGroup"], i;
            if (a.type && a.type !== f || a.zIndex !== void 0) h.length = 0;
            n(h, function (a) {
                h[a] = c[a];
                delete c[a]
            });
            a = z(e, {animation: !1, index: this.index, pointStart: this.xData[0]}, {data: this.options.data}, a);
            this.remove(!1);
            for (i in g) this[i] = s;
            w(this, F[a.type || f].prototype);
            n(h, function (a) {
                c[a] = h[a]
            });
            this.init(d, a);
            d.linkSeries();
            p(b,
                !0) && d.redraw(!1)
        }
    });
    w(J.prototype, {
        update: function (a, b) {
            var c = this.chart, a = c.options[this.coll][this.options.index] = z(this.userOptions, a);
            this.destroy(!0);
            this._addedPlotLB = s;
            this.init(c, w(a, {events: s}));
            c.isDirtyBox = !0;
            p(b, !0) && c.redraw()
        }, remove: function (a) {
            for (var b = this.chart, c = this.coll, d = this.series, e = d.length; e--;) d[e] && d[e].remove(!1);
            ta(b.axes, this);
            ta(b[c], this);
            b.options[c].splice(this.options.index, 1);
            n(b[c], function (a, b) {
                a.options.index = b
            });
            this.destroy();
            b.isDirtyBox = !0;
            p(a, !0) && b.redraw()
        },
        setTitle: function (a, b) {
            this.update({title: a}, b)
        }, setCategories: function (a, b) {
            this.update({categories: a}, b)
        }
    });
    var Ca = ia(O);
    F.line = Ca;
    U.area = z(N, {threshold: 0});
    var xa = ia(O, {
        type: "area", getSegments: function () {
            var a = this, b = [], c = [], d = [], e = this.xAxis, f = this.yAxis, g = f.stacks[this.stackKey], h = {},
                i, j, k = this.points, m = this.options.connectNulls, l, o;
            if (this.options.stacking && !this.cropped) {
                for (l = 0; l < k.length; l++) h[k[l].x] = k[l];
                for (o in g) g[o].total !== null && d.push(+o);
                d.sort(function (a, b) {
                    return a - b
                });
                n(d, function (b) {
                    var d =
                        0, k;
                    if (!m || h[b] && h[b].y !== null) if (h[b]) c.push(h[b]); else {
                        for (l = a.index; l <= f.series.length; l++) if (k = g[b].points[l + "," + b]) {
                            d = k[1];
                            break
                        }
                        i = e.translate(b);
                        j = f.toPixels(d, !0);
                        c.push({y: null, plotX: i, clientX: i, plotY: j, yBottom: j, onMouseOver: ga})
                    }
                });
                c.length && b.push(c)
            } else O.prototype.getSegments.call(this), b = this.segments;
            this.segments = b
        }, getSegmentPath: function (a) {
            var b = O.prototype.getSegmentPath.call(this, a), c = [].concat(b), d, e = this.options;
            d = b.length;
            var f = this.yAxis.getThreshold(e.threshold), g;
            d === 3 &&
            c.push("L", b[1], b[2]);
            if (e.stacking && !this.closedStacks) for (d = a.length - 1; d >= 0; d--) g = p(a[d].yBottom, f), d < a.length - 1 && e.step && c.push(a[d + 1].plotX, g), c.push(a[d].plotX, g); else this.closeSegment(c, a, f);
            this.areaPath = this.areaPath.concat(c);
            return b
        }, closeSegment: function (a, b, c) {
            a.push("L", b[b.length - 1].plotX, c, "L", b[0].plotX, c)
        }, drawGraph: function () {
            this.areaPath = [];
            O.prototype.drawGraph.apply(this);
            var a = this, b = this.areaPath, c = this.options, d = [["area", this.color, c.fillColor]];
            n(this.zones, function (b,
                                    f) {
                d.push(["zoneArea" + f, b.color || a.color, b.fillColor || c.fillColor])
            });
            n(d, function (d) {
                var f = d[0], g = a[f];
                g ? g.animate({d: b}) : a[f] = a.chart.renderer.path(b).attr({
                    fill: p(d[2], va(d[1]).setOpacity(p(c.fillOpacity, 0.75)).get()),
                    zIndex: 0
                }).add(a.group)
            })
        }, drawLegendSymbol: H.drawRectangle
    });
    F.area = xa;
    U.spline = z(N);
    Ca = ia(O, {
        type: "spline", getPointSpline: function (a, b, c) {
            var d = b.plotX, e = b.plotY, f = a[c - 1], g = a[c + 1], h, i, j, k;
            if (f && g) {
                a = f.plotY;
                j = g.plotX;
                var g = g.plotY, m;
                h = (1.5 * d + f.plotX) / 2.5;
                i = (1.5 * e + a) / 2.5;
                j = (1.5 *
                    d + j) / 2.5;
                k = (1.5 * e + g) / 2.5;
                m = (k - i) * (j - d) / (j - h) + e - k;
                i += m;
                k += m;
                i > a && i > e ? (i = x(a, e), k = 2 * e - i) : i < a && i < e && (i = B(a, e), k = 2 * e - i);
                k > g && k > e ? (k = x(g, e), i = 2 * e - k) : k < g && k < e && (k = B(g, e), i = 2 * e - k);
                b.rightContX = j;
                b.rightContY = k
            }
            c ? (b = ["C", f.rightContX || f.plotX, f.rightContY || f.plotY, h || d, i || e, d, e], f.rightContX = f.rightContY = null) : b = ["M", d, e];
            return b
        }
    });
    F.spline = Ca;
    U.areaspline = z(U.area);
    xa = xa.prototype;
    Ca = ia(Ca, {
        type: "areaspline",
        closedStacks: !0,
        getSegmentPath: xa.getSegmentPath,
        closeSegment: xa.closeSegment,
        drawGraph: xa.drawGraph,
        drawLegendSymbol: H.drawRectangle
    });
    F.areaspline = Ca;
    U.column = z(N, {
        borderColor: "#FFFFFF",
        borderRadius: 0,
        groupPadding: 0.2,
        marker: null,
        pointPadding: 0.1,
        minPointLength: 0,
        cropThreshold: 50,
        pointRange: null,
        states: {
            hover: {brightness: 0.1, shadow: !1, halo: !1},
            select: {color: "#C0C0C0", borderColor: "#000000", shadow: !1}
        },
        dataLabels: {align: null, verticalAlign: null, y: null},
        startFromThreshold: !0,
        stickyTracking: !1,
        tooltip: {distance: 6},
        threshold: 0
    });
    Ca = ia(O, {
        type: "column",
        pointAttrToOptions: {
            stroke: "borderColor", fill: "color",
            r: "borderRadius"
        },
        cropShoulder: 0,
        directTouch: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        negStacks: !0,
        init: function () {
            O.prototype.init.apply(this, arguments);
            var a = this, b = a.chart;
            b.hasRendered && n(b.series, function (b) {
                if (b.type === a.type) b.isDirty = !0
            })
        },
        getColumnMetrics: function () {
            var a = this, b = a.options, c = a.xAxis, d = a.yAxis, e = c.reversed, f, g = {}, h, i = 0;
            b.grouping === !1 ? i = 1 : n(a.chart.series, function (b) {
                var c = b.options, e = b.yAxis;
                if (b.type === a.type && b.visible && d.len === e.len && d.pos === e.pos) c.stacking ? (f = b.stackKey,
                g[f] === s && (g[f] = i++), h = g[f]) : c.grouping !== !1 && (h = i++), b.columnIndex = h
            });
            var c = B(Q(c.transA) * (c.ordinalSlope || b.pointRange || c.closestPointRange || c.tickInterval || 1), c.len),
                j = c * b.groupPadding, k = (c - 2 * j) / i, m = b.pointWidth,
                b = v(m) ? (k - m) / 2 : k * b.pointPadding, m = p(m, k - 2 * b);
            return a.columnMetrics = {
                width: m,
                offset: b + (j + ((e ? i - (a.columnIndex || 0) : a.columnIndex) || 0) * k - c / 2) * (e ? -1 : 1)
            }
        },
        translate: function () {
            var a = this, b = a.chart, c = a.options,
                d = a.borderWidth = p(c.borderWidth, a.closestPointRange * a.xAxis.transA < 2 ? 0 : 1), e = a.yAxis,
                f = a.translatedThreshold = e.getThreshold(c.threshold), g = p(c.minPointLength, 5),
                h = a.getColumnMetrics(), i = h.width, j = a.barW = x(i, 1 + 2 * d), k = a.pointXOffset = h.offset,
                m = -(d % 2 ? 0.5 : 0), l = d % 2 ? 0.5 : 1;
            b.inverted && (f -= 0.5, b.renderer.isVML && (l += 1));
            c.pointPadding && (j = ya(j));
            O.prototype.translate.apply(a);
            n(a.points, function (c) {
                var d = p(c.yBottom, f), h = 999 + Q(d), h = B(x(-h, c.plotY), e.len + h), n = c.plotX + k, s = j,
                    t = B(h, d), y, v;
                y = x(h, d) - t;
                Q(y) < g && g && (y = g, v = !e.reversed && !c.negative || e.reversed && c.negative, t = u(Q(t - f) > g ? d - g : f - (v ? g : 0)));
                c.barX = n;
                c.pointWidth = i;
                s = u(n + s) + m;
                n = u(n) + m;
                s -= n;
                d = Q(t) < 0.5;
                y = B(u(t + y) + l, 9E4);
                t = u(t) + l;
                y -= t;
                d && (t -= 1, y += 1);
                c.tooltipPos = b.inverted ? [e.len + e.pos - b.plotLeft - h, a.xAxis.len - n - s / 2, y] : [n + s / 2, h + e.pos - b.plotTop, y];
                c.shapeType = "rect";
                c.shapeArgs = {x: n, y: t, width: s, height: y}
            })
        },
        getSymbol: ga,
        drawLegendSymbol: H.drawRectangle,
        drawGraph: ga,
        drawPoints: function () {
            var a = this, b = this.chart, c = a.options, d = b.renderer, e = c.animationLimit || 250, f, g;
            n(a.points, function (h) {
                var i = h.plotY, j = h.graphic;
                if (i !== s && !isNaN(i) && h.y !==
                    null) f = h.shapeArgs, i = v(a.borderWidth) ? {"stroke-width": a.borderWidth} : {}, g = h.pointAttr[h.selected ? "select" : ""] || a.pointAttr[""], j ? (ab(j), j.attr(i)[b.pointCount < e ? "animate" : "attr"](z(f))) : h.graphic = d[h.shapeType](f).attr(i).attr(g).add(a.group).shadow(c.shadow, null, c.stacking && !c.borderRadius); else if (j) h.graphic = j.destroy()
            })
        },
        animate: function (a) {
            var b = this.yAxis, c = this.options, d = this.chart.inverted, e = {};
            if (da) a ? (e.scaleY = 0.001, a = B(b.pos + b.len, x(b.pos, b.toPixels(c.threshold))), d ? e.translateX = a - b.len :
                e.translateY = a, this.group.attr(e)) : (e.scaleY = 1, e[d ? "translateX" : "translateY"] = b.pos, this.group.animate(e, this.options.animation), this.animate = null)
        },
        remove: function () {
            var a = this, b = a.chart;
            b.hasRendered && n(b.series, function (b) {
                if (b.type === a.type) b.isDirty = !0
            });
            O.prototype.remove.apply(a, arguments)
        }
    });
    F.column = Ca;
    U.bar = z(U.column);
    xa = ia(Ca, {type: "bar", inverted: !0});
    F.bar = xa;
    U.scatter = z(N, {
        lineWidth: 0, marker: {enabled: !0}, tooltip: {
            headerFormat: '<span style="color:{series.color}">\u25CF</span> <span style="font-size: 10px;"> {series.name}</span><br/>',
            pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"
        }
    });
    xa = ia(O, {
        type: "scatter",
        sorted: !1,
        requireSorting: !1,
        noSharedTooltip: !0,
        trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
        takeOrdinalPosition: !1,
        kdDimensions: 2,
        drawGraph: function () {
            this.options.lineWidth && O.prototype.drawGraph.call(this)
        }
    });
    F.scatter = xa;
    U.pie = z(N, {
        borderColor: "#FFFFFF",
        borderWidth: 1,
        center: [null, null],
        clip: !1,
        colorByPoint: !0,
        dataLabels: {
            distance: 30, enabled: !0, formatter: function () {
                return this.point.name
            }, x: 0
        },
        ignoreHiddenPoint: !0,
        legendType: "point",
        marker: null,
        size: null,
        showInLegend: !1,
        slicedOffset: 10,
        states: {hover: {brightness: 0.1, shadow: !1}},
        stickyTracking: !1,
        tooltip: {followPointer: !0}
    });
    N = {
        type: "pie",
        isCartesian: !1,
        pointClass: ia(Ba, {
            init: function () {
                Ba.prototype.init.apply(this, arguments);
                var a = this, b;
                w(a, {visible: a.visible !== !1, name: p(a.name, "Slice")});
                b = function (b) {
                    a.slice(b.type === "select")
                };
                D(a, "select", b);
                D(a, "unselect", b);
                return a
            }, setVisible: function (a, b) {
                var c = this, d = c.series, e = d.chart, f = d.options.ignoreHiddenPoint,
                    b = p(b, f);
                if (a !== c.visible) {
                    c.visible = c.options.visible = a = a === s ? !c.visible : a;
                    d.options.data[Oa(c, d.data)] = c.options;
                    n(["graphic", "dataLabel", "connector", "shadowGroup"], function (b) {
                        if (c[b]) c[b][a ? "show" : "hide"](!0)
                    });
                    c.legendItem && e.legend.colorizeItem(c, a);
                    if (f) d.isDirty = !0;
                    b && e.redraw()
                }
            }, slice: function (a, b, c) {
                var d = this.series;
                Ya(c, d.chart);
                p(b, !0);
                this.sliced = this.options.sliced = a = v(a) ? a : !this.sliced;
                d.options.data[Oa(this, d.data)] = this.options;
                a = a ? this.slicedTranslation : {translateX: 0, translateY: 0};
                this.graphic.animate(a);
                this.shadowGroup && this.shadowGroup.animate(a)
            }, haloPath: function (a) {
                var b = this.shapeArgs, c = this.series.chart;
                return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(c.plotLeft + b.x, c.plotTop + b.y, b.r + a, b.r + a, {
                    innerR: this.shapeArgs.r,
                    start: b.start,
                    end: b.end
                })
            }
        }),
        requireSorting: !1,
        directTouch: !0,
        noSharedTooltip: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        axisTypes: [],
        pointAttrToOptions: {stroke: "borderColor", "stroke-width": "borderWidth", fill: "color"},
        getColor: ga,
        animate: function (a) {
            var b = this, c = b.points, d = b.startAngleRad;
            if (!a) n(c, function (a) {
                var c = a.graphic, g = a.shapeArgs;
                c && (c.attr({r: a.startR || b.center[3] / 2, start: d, end: d}), c.animate({
                    r: g.r,
                    start: g.start,
                    end: g.end
                }, b.options.animation))
            }), b.animate = null
        },
        setData: function (a, b, c, d) {
            O.prototype.setData.call(this, a, !1, c, d);
            this.processData();
            this.generatePoints();
            p(b, !0) && this.chart.redraw(c)
        },
        updateTotals: function () {
            var a, b = 0, c = this.points, d = c.length, e, f = this.options.ignoreHiddenPoint;
            for (a = 0; a < d; a++) e = c[a],
                b += f && !e.visible ? 0 : e.y;
            this.total = b;
            for (a = 0; a < d; a++) e = c[a], e.percentage = b > 0 && (e.visible || !f) ? e.y / b * 100 : 0, e.total = b
        },
        generatePoints: function () {
            O.prototype.generatePoints.call(this);
            this.updateTotals()
        },
        translate: function (a) {
            this.generatePoints();
            var b = 0, c = this.options, d = c.slicedOffset, e = d + c.borderWidth, f, g, h, i = c.startAngle || 0,
                j = this.startAngleRad = ua / 180 * (i - 90),
                i = (this.endAngleRad = ua / 180 * (p(c.endAngle, i + 360) - 90)) - j, k = this.points,
                m = c.dataLabels.distance, c = c.ignoreHiddenPoint, l, o = k.length, q;
            if (!a) this.center =
                a = this.getCenter();
            this.getX = function (b, c) {
                h = X.asin(B((b - a[1]) / (a[2] / 2 + m), 1));
                return a[0] + (c ? -1 : 1) * aa(h) * (a[2] / 2 + m)
            };
            for (l = 0; l < o; l++) {
                q = k[l];
                f = j + b * i;
                if (!c || q.visible) b += q.percentage / 100;
                g = j + b * i;
                q.shapeType = "arc";
                q.shapeArgs = {
                    x: a[0],
                    y: a[1],
                    r: a[2] / 2,
                    innerR: a[3] / 2,
                    start: u(f * 1E3) / 1E3,
                    end: u(g * 1E3) / 1E3
                };
                h = (g + f) / 2;
                h > 1.5 * ua ? h -= 2 * ua : h < -ua / 2 && (h += 2 * ua);
                q.slicedTranslation = {translateX: u(aa(h) * d), translateY: u(fa(h) * d)};
                f = aa(h) * a[2] / 2;
                g = fa(h) * a[2] / 2;
                q.tooltipPos = [a[0] + f * 0.7, a[1] + g * 0.7];
                q.half = h < -ua / 2 || h > ua / 2 ?
                    1 : 0;
                q.angle = h;
                e = B(e, m / 2);
                q.labelPos = [a[0] + f + aa(h) * m, a[1] + g + fa(h) * m, a[0] + f + aa(h) * e, a[1] + g + fa(h) * e, a[0] + f, a[1] + g, m < 0 ? "center" : q.half ? "right" : "left", h]
            }
        },
        drawGraph: null,
        drawPoints: function () {
            var a = this, b = a.chart.renderer, c, d, e = a.options.shadow, f, g, h;
            if (e && !a.shadowGroup) a.shadowGroup = b.g("shadow").add(a.group);
            n(a.points, function (i) {
                d = i.graphic;
                g = i.shapeArgs;
                f = i.shadowGroup;
                if (e && !f) f = i.shadowGroup = b.g("shadow").add(a.shadowGroup);
                c = i.sliced ? i.slicedTranslation : {translateX: 0, translateY: 0};
                f && f.attr(c);
                if (d) d.animate(w(g, c)); else {
                    h = {"stroke-linejoin": "round"};
                    if (!i.visible) h.visibility = "hidden";
                    i.graphic = d = b[i.shapeType](g).setRadialReference(a.center).attr(i.pointAttr[i.selected ? "select" : ""]).attr(h).attr(c).add(a.group).shadow(e, f)
                }
            })
        },
        searchPoint: ga,
        sortByAngle: function (a, b) {
            a.sort(function (a, d) {
                return a.angle !== void 0 && (d.angle - a.angle) * b
            })
        },
        drawLegendSymbol: H.drawRectangle,
        getCenter: ic.getCenter,
        getSymbol: ga
    };
    N = ia(O, N);
    F.pie = N;
    O.prototype.drawDataLabels = function () {
        var a = this, b = a.options, c =
            b.cursor, d = b.dataLabels, e = a.points, f, g, h = a.hasRendered || 0, i, j, k = a.chart.renderer;
        if (d.enabled || a._hasPointLabels) a.dlProcessOptions && a.dlProcessOptions(d), j = a.plotGroup("dataLabelsGroup", "data-labels", d.defer ? "hidden" : "visible", d.zIndex || 6), p(d.defer, !0) && (j.attr({opacity: +h}), h || D(a, "afterAnimate", function () {
            a.visible && j.show();
            j[b.animation ? "animate" : "attr"]({opacity: 1}, {duration: 200})
        })), g = d, n(e, function (e) {
            var h, o = e.dataLabel, q, r, n = e.connector, u = !0, t, y = {};
            f = e.dlOptions || e.options && e.options.dataLabels;
            h = p(f && f.enabled, g.enabled);
            if (o && !h) e.dataLabel = o.destroy(); else if (h) {
                d = z(g, f);
                t = d.style;
                h = d.rotation;
                q = e.getLabelConfig();
                i = d.format ? Ma(d.format, q) : d.formatter.call(q, d);
                t.color = p(d.color, t.color, a.color, "black");
                if (o) if (v(i)) o.attr({text: i}), u = !1; else {
                    if (e.dataLabel = o = o.destroy(), n) e.connector = n.destroy()
                } else if (v(i)) {
                    o = {
                        fill: d.backgroundColor,
                        stroke: d.borderColor,
                        "stroke-width": d.borderWidth,
                        r: d.borderRadius || 0,
                        rotation: h,
                        padding: d.padding,
                        zIndex: 1
                    };
                    if (t.color === "contrast") y.color = d.inside ||
                    d.distance < 0 || b.stacking ? k.getContrast(e.color || a.color) : "#000000";
                    if (c) y.cursor = c;
                    for (r in o) o[r] === s && delete o[r];
                    o = e.dataLabel = k[h ? "text" : "label"](i, 0, -999, d.shape, null, null, d.useHTML).attr(o).css(w(t, y)).add(j).shadow(d.shadow)
                }
                o && a.alignDataLabel(e, o, d, null, u)
            }
        })
    };
    O.prototype.alignDataLabel = function (a, b, c, d, e) {
        var f = this.chart, g = f.inverted, h = p(a.plotX, -999), i = p(a.plotY, -999), j = b.getBBox(),
            k = f.renderer.fontMetrics(c.style.fontSize).b,
            m = this.visible && (a.series.forceDL || f.isInsidePlot(h, u(i), g) ||
                d && f.isInsidePlot(h, g ? d.x + 1 : d.y + d.height - 1, g));
        if (m) d = w({
            x: g ? f.plotWidth - i : h,
            y: u(g ? f.plotHeight - h : i),
            width: 0,
            height: 0
        }, d), w(c, {
            width: j.width,
            height: j.height
        }), c.rotation ? (a = f.renderer.rotCorr(k, c.rotation), b[e ? "attr" : "animate"]({
            x: d.x + c.x + d.width / 2 + a.x,
            y: d.y + c.y + d.height / 2
        }).attr({align: c.align})) : (b.align(c, null, d), g = b.alignAttr, p(c.overflow, "justify") === "justify" ? this.justifyDataLabel(b, c, g, j, d, e) : p(c.crop, !0) && (m = f.isInsidePlot(g.x, g.y) && f.isInsidePlot(g.x + j.width, g.y + j.height)), c.shape && b.attr({
            anchorX: a.plotX,
            anchorY: a.plotY
        }));
        if (!m) b.attr({y: -999}), b.placed = !1
    };
    O.prototype.justifyDataLabel = function (a, b, c, d, e, f) {
        var g = this.chart, h = b.align, i = b.verticalAlign, j, k, m = a.box ? 0 : a.padding || 0;
        j = c.x + m;
        if (j < 0) h === "right" ? b.align = "left" : b.x = -j, k = !0;
        j = c.x + d.width - m;
        if (j > g.plotWidth) h === "left" ? b.align = "right" : b.x = g.plotWidth - j, k = !0;
        j = c.y + m;
        if (j < 0) i === "bottom" ? b.verticalAlign = "top" : b.y = -j, k = !0;
        j = c.y + d.height - m;
        if (j > g.plotHeight) i === "top" ? b.verticalAlign = "bottom" : b.y = g.plotHeight - j, k = !0;
        if (k) a.placed = !f, a.align(b, null,
            e)
    };
    if (F.pie) F.pie.prototype.drawDataLabels = function () {
        var a = this, b = a.data, c, d = a.chart, e = a.options.dataLabels, f = p(e.connectorPadding, 10),
            g = p(e.connectorWidth, 1), h = d.plotWidth, i = d.plotHeight, j, k, m = p(e.softConnector, !0),
            l = e.distance, o = a.center, q = o[2] / 2, r = o[1], s = l > 0, v, t, y, w = [[], []], z, A, D, C, K,
            F = [0, 0, 0, 0], L = function (a, b) {
                return b.y - a.y
            };
        if (a.visible && (e.enabled || a._hasPointLabels)) {
            O.prototype.drawDataLabels.apply(a);
            n(b, function (a) {
                a.dataLabel && a.visible && w[a.half].push(a)
            });
            for (C = 2; C--;) {
                var H = [], M =
                    [], I = w[C], J = I.length, E;
                if (J) {
                    a.sortByAngle(I, C - 0.5);
                    for (K = b = 0; !b && I[K];) b = I[K] && I[K].dataLabel && (I[K].dataLabel.getBBox().height || 21), K++;
                    if (l > 0) {
                        t = B(r + q + l, d.plotHeight);
                        for (K = x(0, r - q - l); K <= t; K += b) H.push(K);
                        t = H.length;
                        if (J > t) {
                            c = [].concat(I);
                            c.sort(L);
                            for (K = J; K--;) c[K].rank = K;
                            for (K = J; K--;) I[K].rank >= t && I.splice(K, 1);
                            J = I.length
                        }
                        for (K = 0; K < J; K++) {
                            c = I[K];
                            y = c.labelPos;
                            c = 9999;
                            var P, N;
                            for (N = 0; N < t; N++) P = Q(H[N] - y[1]), P < c && (c = P, E = N);
                            if (E < K && H[K] !== null) E = K; else for (t < J - K + E && H[K] !== null && (E = t - J + K); H[E] === null;) E++;
                            M.push({i: E, y: H[E]});
                            H[E] = null
                        }
                        M.sort(L)
                    }
                    for (K = 0; K < J; K++) {
                        c = I[K];
                        y = c.labelPos;
                        v = c.dataLabel;
                        D = c.visible === !1 ? "hidden" : "inherit";
                        c = y[1];
                        if (l > 0) {
                            if (t = M.pop(), E = t.i, A = t.y, c > A && H[E + 1] !== null || c < A && H[E - 1] !== null) A = B(x(0, c), d.plotHeight)
                        } else A = c;
                        z = e.justify ? o[0] + (C ? -1 : 1) * (q + l) : a.getX(A === r - q - l || A === r + q + l ? c : A, C);
                        v._attr = {visibility: D, align: y[6]};
                        v._pos = {x: z + e.x + ({left: f, right: -f}[y[6]] || 0), y: A + e.y - 10};
                        v.connX = z;
                        v.connY = A;
                        if (this.options.size === null) t = v.width, z - t < f ? F[3] = x(u(t - z + f), F[3]) : z + t > h - f && (F[1] = x(u(z +
                            t - h + f), F[1])), A - b / 2 < 0 ? F[0] = x(u(-A + b / 2), F[0]) : A + b / 2 > i && (F[2] = x(u(A + b / 2 - i), F[2]))
                    }
                }
            }
            if (Ea(F) === 0 || this.verifyDataLabelOverflow(F)) this.placeDataLabels(), s && g && n(this.points, function (b) {
                j = b.connector;
                y = b.labelPos;
                if ((v = b.dataLabel) && v._pos && b.visible) D = v._attr.visibility, z = v.connX, A = v.connY, k = m ? ["M", z + (y[6] === "left" ? 5 : -5), A, "C", z, A, 2 * y[2] - y[4], 2 * y[3] - y[5], y[2], y[3], "L", y[4], y[5]] : ["M", z + (y[6] === "left" ? 5 : -5), A, "L", y[2], y[3], "L", y[4], y[5]], j ? (j.animate({d: k}), j.attr("visibility", D)) : b.connector = j = a.chart.renderer.path(k).attr({
                    "stroke-width": g,
                    stroke: e.connectorColor || b.color || "#606060", visibility: D
                }).add(a.dataLabelsGroup); else if (j) b.connector = j.destroy()
            })
        }
    }, F.pie.prototype.placeDataLabels = function () {
        n(this.points, function (a) {
            var b = a.dataLabel;
            if (b && a.visible) (a = b._pos) ? (b.attr(b._attr), b[b.moved ? "animate" : "attr"](a), b.moved = !0) : b && b.attr({y: -999})
        })
    }, F.pie.prototype.alignDataLabel = ga, F.pie.prototype.verifyDataLabelOverflow = function (a) {
        var b = this.center, c = this.options, d = c.center, e = c.minSize || 80, f = e, g;
        d[0] !== null ? f = x(b[2] - x(a[1], a[3]),
            e) : (f = x(b[2] - a[1] - a[3], e), b[0] += (a[3] - a[1]) / 2);
        d[1] !== null ? f = x(B(f, b[2] - x(a[0], a[2])), e) : (f = x(B(f, b[2] - a[0] - a[2]), e), b[1] += (a[0] - a[2]) / 2);
        f < b[2] ? (b[2] = f, b[3] = /%$/.test(c.innerSize || 0) ? f * parseFloat(c.innerSize || 0) / 100 : parseFloat(c.innerSize || 0), this.translate(b), n(this.points, function (a) {
            if (a.dataLabel) a.dataLabel._pos = null
        }), this.drawDataLabels && this.drawDataLabels()) : g = !0;
        return g
    };
    if (F.column) F.column.prototype.alignDataLabel = function (a, b, c, d, e) {
        var f = this.chart.inverted, g = a.series, h = a.dlBox || a.shapeArgs,
            i = p(a.below, a.plotY > p(this.translatedThreshold, g.yAxis.len)),
            j = p(c.inside, !!this.options.stacking);
        if (h && (d = z(h), f && (d = {
                x: g.yAxis.len - d.y - d.height,
                y: g.xAxis.len - d.x - d.width,
                width: d.height,
                height: d.width
            }), !j)) f ? (d.x += i ? 0 : d.width, d.width = 0) : (d.y += i ? d.height : 0, d.height = 0);
        c.align = p(c.align, !f || j ? "center" : i ? "right" : "left");
        c.verticalAlign = p(c.verticalAlign, f || j ? "middle" : i ? "top" : "bottom");
        O.prototype.alignDataLabel.call(this, a, b, c, d, e)
    };
    (function (a) {
        var b = a.Chart, c = a.each, d = a.pick, e = HighchartsAdapter.addEvent;
        b.prototype.callbacks.push(function (a) {
            function b() {
                var e = [];
                c(a.series, function (a) {
                    var b = a.options.dataLabels;
                    (b.enabled || a._hasPointLabels) && !b.allowOverlap && a.visible && c(a.points, function (a) {
                        if (a.dataLabel) a.dataLabel.labelrank = d(a.labelrank, a.shapeArgs && a.shapeArgs.height), e.push(a.dataLabel)
                    })
                });
                a.hideOverlappingLabels(e)
            }

            b();
            e(a, "redraw", b)
        });
        b.prototype.hideOverlappingLabels = function (a) {
            var b = a.length, c, d, e, k;
            for (d = 0; d < b; d++) if (c = a[d]) c.oldOpacity = c.opacity, c.newOpacity = 1;
            a.sort(function (a,
                             b) {
                return b.labelrank - a.labelrank
            });
            for (d = 0; d < b; d++) {
                e = a[d];
                for (c = d + 1; c < b; ++c) if (k = a[c], e && k && e.placed && k.placed && e.newOpacity !== 0 && k.newOpacity !== 0 && !(k.alignAttr.x > e.alignAttr.x + e.width || k.alignAttr.x + k.width < e.alignAttr.x || k.alignAttr.y > e.alignAttr.y + e.height || k.alignAttr.y + k.height < e.alignAttr.y)) (e.labelrank < k.labelrank ? e : k).newOpacity = 0
            }
            for (d = 0; d < b; d++) if (c = a[d]) {
                if (c.oldOpacity !== c.newOpacity && c.placed) c.alignAttr.opacity = c.newOpacity, c[c.isOld && c.newOpacity ? "animate" : "attr"](c.alignAttr);
                c.isOld = !0
            }
        }
    })(A);
    var jb = A.TrackerMixin = {
        drawTrackerPoint: function () {
            var a = this, b = a.chart, c = b.pointer, d = a.options.cursor, e = d && {cursor: d}, f = function (a) {
                for (var c = a.target, d; c && !d;) d = c.point, c = c.parentNode;
                if (d !== s && d !== b.hoverPoint) d.onMouseOver(a)
            };
            n(a.points, function (a) {
                if (a.graphic) a.graphic.element.point = a;
                if (a.dataLabel) a.dataLabel.element.point = a
            });
            if (!a._hasTracking) n(a.trackerGroups, function (b) {
                if (a[b] && (a[b].addClass("highcharts-tracker").on("mouseover", f).on("mouseout", function (a) {
                        c.onTrackerMouseOut(a)
                    }).css(e),
                        $a)) a[b].on("touchstart", f)
            }), a._hasTracking = !0
        }, drawTrackerGraph: function () {
            var a = this, b = a.options, c = b.trackByArea, d = [].concat(c ? a.areaPath : a.graphPath), e = d.length,
                f = a.chart, g = f.pointer, h = f.renderer, i = f.options.tooltip.snap, j = a.tracker, k = b.cursor,
                m = k && {cursor: k}, k = a.singlePoints, l, o = function () {
                    if (f.hoverSeries !== a) a.onMouseOver()
                }, q = "rgba(192,192,192," + (da ? 1.0E-4 : 0.002) + ")";
            if (e && !c) for (l = e + 1; l--;) d[l] === "M" && d.splice(l + 1, 0, d[l + 1] - i, d[l + 2], "L"), (l && d[l] === "M" || l === e) && d.splice(l, 0, "L", d[l - 2] + i, d[l -
            1]);
            for (l = 0; l < k.length; l++) e = k[l], d.push("M", e.plotX - i, e.plotY, "L", e.plotX + i, e.plotY);
            j ? j.attr({d: d}) : (a.tracker = h.path(d).attr({
                "stroke-linejoin": "round",
                visibility: a.visible ? "visible" : "hidden",
                stroke: q,
                fill: c ? q : Z,
                "stroke-width": b.lineWidth + (c ? 0 : 2 * i),
                zIndex: 2
            }).add(a.group), n([a.tracker, a.markerGroup], function (a) {
                a.addClass("highcharts-tracker").on("mouseover", o).on("mouseout", function (a) {
                    g.onTrackerMouseOut(a)
                }).css(m);
                if ($a) a.on("touchstart", o)
            }))
        }
    };
    if (F.column) Ca.prototype.drawTracker = jb.drawTrackerPoint;
    if (F.pie) F.pie.prototype.drawTracker = jb.drawTrackerPoint;
    if (F.scatter) xa.prototype.drawTracker = jb.drawTrackerPoint;
    w(tb.prototype, {
        setItemEvents: function (a, b, c, d, e) {
            var f = this;
            (c ? b : a.legendGroup).on("mouseover", function () {
                a.setState("hover");
                b.css(f.options.itemHoverStyle)
            }).on("mouseout", function () {
                b.css(a.visible ? d : e);
                a.setState()
            }).on("click", function (b) {
                var c = function () {
                    a.setVisible()
                }, b = {browserEvent: b};
                a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : E(a, "legendItemClick", b, c)
            })
        }, createCheckboxForItem: function (a) {
            a.checkbox =
                $("input", {
                    type: "checkbox",
                    checked: a.selected,
                    defaultChecked: a.selected
                }, this.options.itemCheckboxStyle, this.chart.container);
            D(a.checkbox, "click", function (b) {
                E(a.series || a, "checkboxClick", {checked: b.target.checked, item: a}, function () {
                    a.select()
                })
            })
        }
    });
    P.legend.itemStyle.cursor = "pointer";
    w(Pa.prototype, {
        showResetZoom: function () {
            var a = this, b = P.lang, c = a.options.chart.resetZoomButton, d = c.theme, e = d.states,
                f = c.relativeTo === "chart" ? null : "plotBox";
            this.resetZoomButton = a.renderer.button(b.resetZoom, null, null,
                function () {
                    a.zoomOut()
                }, d, e && e.hover).attr({
                align: c.position.align,
                title: b.resetZoomTitle
            }).add().align(c.position, !1, f)
        }, zoomOut: function () {
            var a = this;
            E(a, "selection", {resetSelection: !0}, function () {
                a.zoom()
            })
        }, zoom: function (a) {
            var b, c = this.pointer, d = !1, e;
            !a || a.resetSelection ? n(this.axes, function (a) {
                b = a.zoom()
            }) : n(a.xAxis.concat(a.yAxis), function (a) {
                var e = a.axis, h = e.isXAxis;
                if (c[h ? "zoomX" : "zoomY"] || c[h ? "pinchX" : "pinchY"]) b = e.zoom(a.min, a.max), e.displayBtn && (d = !0)
            });
            e = this.resetZoomButton;
            if (d && !e) this.showResetZoom();
            else if (!d && ha(e)) this.resetZoomButton = e.destroy();
            b && this.redraw(p(this.options.chart.animation, a && a.animation, this.pointCount < 100))
        }, pan: function (a, b) {
            var c = this, d = c.hoverPoints, e;
            d && n(d, function (a) {
                a.setState()
            });
            n(b === "xy" ? [1, 0] : [1], function (b) {
                var d = a[b ? "chartX" : "chartY"], h = c[b ? "xAxis" : "yAxis"][0],
                    i = c[b ? "mouseDownX" : "mouseDownY"], j = (h.pointRange || 0) / 2, k = h.getExtremes(),
                    m = h.toValue(i - d, !0) + j, j = h.toValue(i + c[b ? "plotWidth" : "plotHeight"] - d, !0) - j,
                    i = i > d;
                if (h.series.length && (i || m > B(k.dataMin, k.min)) &&
                    (!i || j < x(k.dataMax, k.max))) h.setExtremes(m, j, !1, !1, {trigger: "pan"}), e = !0;
                c[b ? "mouseDownX" : "mouseDownY"] = d
            });
            e && c.redraw(!1);
            M(c.container, {cursor: "move"})
        }
    });
    w(Ba.prototype, {
        select: function (a, b) {
            var c = this, d = c.series, e = d.chart, a = p(a, !c.selected);
            c.firePointEvent(a ? "select" : "unselect", {accumulate: b}, function () {
                c.selected = c.options.selected = a;
                d.options.data[Oa(c, d.data)] = c.options;
                c.setState(a && "select");
                b || n(e.getSelectedPoints(), function (a) {
                    if (a.selected && a !== c) a.selected = a.options.selected = !1, d.options.data[Oa(a,
                        d.data)] = a.options, a.setState(""), a.firePointEvent("unselect")
                })
            })
        }, onMouseOver: function (a) {
            var b = this.series, c = b.chart, d = c.tooltip, e = c.hoverPoint;
            if (c.hoverSeries !== b) b.onMouseOver();
            if (e && e !== this) e.onMouseOut();
            this.firePointEvent("mouseOver");
            d && (!d.shared || b.noSharedTooltip) && d.refresh(this, a);
            this.setState("hover");
            c.hoverPoint = this
        }, onMouseOut: function () {
            var a = this.series.chart, b = a.hoverPoints;
            this.firePointEvent("mouseOut");
            if (!b || Oa(this, b) === -1) this.setState(), a.hoverPoint = null
        }, importEvents: function () {
            if (!this.hasImportedEvents) {
                var a =
                    z(this.series.options.point, this.options).events, b;
                this.events = a;
                for (b in a) D(this, b, a[b]);
                this.hasImportedEvents = !0
            }
        }, setState: function (a, b) {
            var c = this.plotX, d = this.plotY, e = this.series, f = e.options.states,
                g = U[e.type].marker && e.options.marker, h = g && !g.enabled, i = g && g.states[a],
                j = i && i.enabled === !1, k = e.stateMarkerGraphic, m = this.marker || {}, l = e.chart, o = e.halo, q,
                a = a || "";
            q = this.pointAttr[a] || e.pointAttr[a];
            if (!(a === this.state && !b || this.selected && a !== "select" || f[a] && f[a].enabled === !1 || a && (j || h && i.enabled ===
                    !1) || a && m.states && m.states[a] && m.states[a].enabled === !1)) {
                if (this.graphic) g = g && this.graphic.symbolName && q.r, this.graphic.attr(z(q, g ? {
                    x: c - g,
                    y: d - g,
                    width: 2 * g,
                    height: 2 * g
                } : {})), k && k.hide(); else {
                    if (a && i) if (g = i.radius, m = m.symbol || e.symbol, k && k.currentSymbol !== m && (k = k.destroy()), k) k[b ? "animate" : "attr"]({
                        x: c - g,
                        y: d - g
                    }); else if (m) e.stateMarkerGraphic = k = l.renderer.symbol(m, c - g, d - g, 2 * g, 2 * g).attr(q).add(e.markerGroup), k.currentSymbol = m;
                    if (k) k[a && l.isInsidePlot(c, d, l.inverted) ? "show" : "hide"]()
                }
                if ((c = f[a] && f[a].halo) &&
                    c.size) {
                    if (!o) e.halo = o = l.renderer.path().add(l.seriesGroup);
                    o.attr(w({fill: va(this.color || e.color).setOpacity(c.opacity).get()}, c.attributes))[b ? "animate" : "attr"]({d: this.haloPath(c.size)})
                } else o && o.attr({d: []});
                this.state = a
            }
        }, haloPath: function (a) {
            var b = this.series, c = b.chart, d = b.getPlotBox(), e = c.inverted;
            return c.renderer.symbols.circle(d.translateX + (e ? b.yAxis.len - this.plotY : this.plotX) - a, d.translateY + (e ? b.xAxis.len - this.plotX : this.plotY) - a, a * 2, a * 2)
        }
    });
    w(O.prototype, {
        onMouseOver: function () {
            var a =
                this.chart, b = a.hoverSeries;
            if (b && b !== this) b.onMouseOut();
            this.options.events.mouseOver && E(this, "mouseOver");
            this.setState("hover");
            a.hoverSeries = this
        }, onMouseOut: function () {
            var a = this.options, b = this.chart, c = b.tooltip, d = b.hoverPoint;
            b.hoverSeries = null;
            if (d) d.onMouseOut();
            this && a.events.mouseOut && E(this, "mouseOut");
            c && !a.stickyTracking && (!c.shared || this.noSharedTooltip) && c.hide();
            this.setState()
        }, setState: function (a) {
            var b = this.options, c = this.graph, d = b.states, e = b.lineWidth, b = 0, a = a || "";
            if (this.state !==
                a && (this.state = a, !(d[a] && d[a].enabled === !1) && (a && (e = d[a].lineWidth || e + (d[a].lineWidthPlus || 0)), c && !c.dashstyle))) {
                a = {"stroke-width": e};
                for (c.attr(a); this["zoneGraph" + b];) this["zoneGraph" + b].attr(a), b += 1
            }
        }, setVisible: function (a, b) {
            var c = this, d = c.chart, e = c.legendItem, f, g = d.options.chart.ignoreHiddenSeries, h = c.visible;
            f = (c.visible = a = c.userOptions.visible = a === s ? !h : a) ? "show" : "hide";
            n(["group", "dataLabelsGroup", "markerGroup", "tracker"], function (a) {
                if (c[a]) c[a][f]()
            });
            if (d.hoverSeries === c || (d.hoverPoint &&
                    d.hoverPoint.series) === c) c.onMouseOut();
            e && d.legend.colorizeItem(c, a);
            c.isDirty = !0;
            c.options.stacking && n(d.series, function (a) {
                if (a.options.stacking && a.visible) a.isDirty = !0
            });
            n(c.linkedSeries, function (b) {
                b.setVisible(a, !1)
            });
            if (g) d.isDirtyBox = !0;
            b !== !1 && d.redraw();
            E(c, f)
        }, show: function () {
            this.setVisible(!0)
        }, hide: function () {
            this.setVisible(!1)
        }, select: function (a) {
            this.selected = a = a === s ? !this.selected : a;
            if (this.checkbox) this.checkbox.checked = a;
            E(this, a ? "select" : "unselect")
        }, drawTracker: jb.drawTrackerGraph
    });
    R(O.prototype, "init", function (a) {
        var b;
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        (b = this.xAxis) && b.options.ordinal && D(this, "updatedData", function () {
            delete b.ordinalIndex
        })
    });
    R(J.prototype, "getTimeTicks", function (a, b, c, d, e, f, g, h) {
        var i = 0, j = 0, k, m = {}, l, o, q, n = [], p = -Number.MAX_VALUE, u = this.options.tickPixelInterval;
        if (!this.options.ordinal && !this.options.breaks || !f || f.length < 3 || c === s) return a.call(this, b, c, d, e);
        for (o = f.length; j < o; j++) {
            q = j && f[j - 1] > d;
            f[j] < c && (i = j);
            if (j === o - 1 || f[j + 1] - f[j] > g * 5 ||
                q) {
                if (f[j] > p) {
                    for (k = a.call(this, b, f[i], f[j], e); k.length && k[0] <= p;) k.shift();
                    k.length && (p = k[k.length - 1]);
                    n = n.concat(k)
                }
                i = j + 1
            }
            if (q) break
        }
        a = k.info;
        if (h && a.unitRange <= I.hour) {
            j = n.length - 1;
            for (i = 1; i < j; i++) ja("%d", n[i]) !== ja("%d", n[i - 1]) && (m[n[i]] = "day", l = !0);
            l && (m[n[0]] = "day");
            a.higherRanks = m
        }
        n.info = a;
        if (h && v(u)) {
            var h = a = n.length, j = [], t;
            for (l = []; h--;) i = this.translate(n[h]), t && (l[h] = t - i), j[h] = t = i;
            l.sort();
            l = l[W(l.length / 2)];
            l < u * 0.6 && (l = null);
            h = n[a - 1] > d ? a - 1 : a;
            for (t = void 0; h--;) i = j[h], d = t - i, t && d < u * 0.8 && (l ===
                null || d < l * 0.8) ? (m[n[h]] && !m[n[h + 1]] ? (d = h + 1, t = i) : d = h, n.splice(d, 1)) : t = i
        }
        return n
    });
    w(J.prototype, {
        beforeSetTickPositions: function () {
            var a, b = [], c = !1, d, e = this.getExtremes(), f = e.min, g = e.max, h,
                i = this.isXAxis && !!this.options.breaks;
            if ((e = this.options.ordinal) || i) {
                n(this.series, function (c, d) {
                    if (c.visible !== !1 && (c.takeOrdinalPosition !== !1 || i)) if (b = b.concat(c.processedXData), a = b.length, b.sort(function (a, b) {
                            return a - b
                        }), a) for (d = a - 1; d--;) b[d] === b[d + 1] && b.splice(d, 1)
                });
                a = b.length;
                if (a > 2) {
                    d = b[1] - b[0];
                    for (h = a -
                        1; h-- && !c;) b[h + 1] - b[h] !== d && (c = !0);
                    if (!this.options.keepOrdinalPadding && (b[0] - f > d || g - b[b.length - 1] > d)) c = !0
                }
                c ? (this.ordinalPositions = b, d = this.val2lin(x(f, b[0]), !0), h = x(this.val2lin(B(g, b[b.length - 1]), !0), 1), this.ordinalSlope = g = (g - f) / (h - d), this.ordinalOffset = f - d * g) : this.ordinalPositions = this.ordinalSlope = this.ordinalOffset = s
            }
            this.doPostTranslate = e && c || i;
            this.groupIntervalFactor = null
        }, val2lin: function (a, b) {
            var c = this.ordinalPositions;
            if (c) {
                var d = c.length, e, f;
                for (e = d; e--;) if (c[e] === a) {
                    f = e;
                    break
                }
                for (e =
                         d - 1; e--;) if (a > c[e] || e === 0) {
                    c = (a - c[e]) / (c[e + 1] - c[e]);
                    f = e + c;
                    break
                }
                return b ? f : this.ordinalSlope * (f || 0) + this.ordinalOffset
            } else return a
        }, lin2val: function (a, b) {
            var c = this.ordinalPositions;
            if (c) {
                var d = this.ordinalSlope, e = this.ordinalOffset, f = c.length - 1, g, h;
                if (b) a < 0 ? a = c[0] : a > f ? a = c[f] : (f = W(a), h = a - f); else for (; f--;) if (g = d * f + e, a >= g) {
                    d = d * (f + 1) + e;
                    h = (a - g) / (d - g);
                    break
                }
                return h !== s && c[f] !== s ? c[f] + (h ? h * (c[f + 1] - c[f]) : 0) : a
            } else return a
        }, getExtendedPositions: function () {
            var a = this.chart, b = this.series[0].currentDataGrouping,
                c = this.ordinalIndex, d = b ? b.count + b.unitName : "raw", e = this.getExtremes(), f, g;
            if (!c) c = this.ordinalIndex = {};
            if (!c[d]) f = {
                series: [], getExtremes: function () {
                    return {min: e.dataMin, max: e.dataMax}
                }, options: {ordinal: !0}, val2lin: J.prototype.val2lin
            }, n(this.series, function (c) {
                g = {xAxis: f, xData: c.xData, chart: a, destroyGroupedData: ga};
                g.options = {
                    dataGrouping: b ? {
                        enabled: !0,
                        forced: !0,
                        approximation: "open",
                        units: [[b.unitName, [b.count]]]
                    } : {enabled: !1}
                };
                c.processData.apply(g);
                f.series.push(g)
            }), this.beforeSetTickPositions.apply(f),
                c[d] = f.ordinalPositions;
            return c[d]
        }, getGroupIntervalFactor: function (a, b, c) {
            var d = 0, c = c.processedXData, e = c.length, f = [], g = this.groupIntervalFactor;
            if (!g) {
                for (; d < e - 1; d++) f[d] = c[d + 1] - c[d];
                f.sort(function (a, b) {
                    return a - b
                });
                d = f[W(e / 2)];
                a = x(a, c[0]);
                b = B(b, c[e - 1]);
                this.groupIntervalFactor = g = e * d / (b - a)
            }
            return g
        }, postProcessTickInterval: function (a) {
            var b = this.ordinalSlope;
            return b ? this.options.breaks ? this.closestPointRange : a / (b / this.closestPointRange) : a
        }
    });
    R(Pa.prototype, "pan", function (a, b) {
        var c = this.xAxis[0],
            d = b.chartX, e = !1;
        if (c.options.ordinal && c.series.length) {
            var f = this.mouseDownX, g = c.getExtremes(), h = g.dataMax, i = g.min, j = g.max, k = this.hoverPoints,
                m = c.closestPointRange, f = (f - d) / (c.translationSlope * (c.ordinalSlope || m)),
                l = {ordinalPositions: c.getExtendedPositions()}, m = c.lin2val, o = c.val2lin, q;
            if (l.ordinalPositions) {
                if (Q(f) > 1) k && n(k, function (a) {
                    a.setState()
                }), f < 0 ? (k = l, q = c.ordinalPositions ? c : l) : (k = c.ordinalPositions ? c : l, q = l), l = q.ordinalPositions, h > l[l.length - 1] && l.push(h), this.fixedRange = j - i, f = c.toFixedRange(null,
                    null, m.apply(k, [o.apply(k, [i, !0]) + f, !0]), m.apply(q, [o.apply(q, [j, !0]) + f, !0])), f.min >= B(g.dataMin, i) && f.max <= x(h, j) && c.setExtremes(f.min, f.max, !0, !1, {trigger: "pan"}), this.mouseDownX = d, M(this.container, {cursor: "move"})
            } else e = !0
        } else e = !0;
        e && a.apply(this, Array.prototype.slice.call(arguments, 1))
    });
    R(O.prototype, "getSegments", function (a) {
        var b, c = this.options.gapSize, d = this.xAxis;
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        if (c) b = this.segments, n(b, function (a, f) {
            for (var g = a.length - 1; g--;) a[g +
            1].x - a[g].x > d.closestPointRange * c && b.splice(f + 1, 0, a.splice(g + 1, a.length - g))
        })
    });
    (function (a) {
        function b() {
            return Array.prototype.slice.call(arguments, 1)
        }

        var c = a.pick, d = a.wrap, e = a.extend, f = HighchartsAdapter.fireEvent, g = a.Axis, h = a.Series;
        e(g.prototype, {
            isInBreak: function (a, b) {
                var c = a.repeat || Infinity, d = a.from, e = a.to - a.from, c = b >= d ? (b - d) % c : c - (d - b) % c;
                return a.inclusive ? c <= e : c < e && c !== 0
            }, isInAnyBreak: function (a, b) {
                if (!this.options.breaks) return !1;
                for (var d = this.options.breaks, e = d.length, f = !1, g = !1; e--;) this.isInBreak(d[e],
                    a) && (f = !0, g || (g = c(d[e].showPoints, this.isXAxis ? !1 : !0)));
                return f && b ? f && !g : f
            }
        });
        d(g.prototype, "setTickPositions", function (a) {
            a.apply(this, Array.prototype.slice.call(arguments, 1));
            if (this.options.breaks) {
                var b = this.tickPositions, c = this.tickPositions.info, d = [], e;
                if (!(c && c.totalRange >= this.closestPointRange)) {
                    for (e = 0; e < b.length; e++) this.isInAnyBreak(b[e]) || d.push(b[e]);
                    this.tickPositions = d;
                    this.tickPositions.info = c
                }
            }
        });
        d(g.prototype, "init", function (a, b, c) {
            if (c.breaks && c.breaks.length) c.ordinal = !1;
            a.call(this,
                b, c);
            if (this.options.breaks) {
                var d = this;
                d.doPostTranslate = !0;
                this.val2lin = function (a) {
                    var b = a, c, e;
                    for (e = 0; e < d.breakArray.length; e++) if (c = d.breakArray[e], c.to <= a) b -= c.len; else if (c.from >= a) break; else if (d.isInBreak(c, a)) {
                        b -= a - c.from;
                        break
                    }
                    return b
                };
                this.lin2val = function (a) {
                    var b, c;
                    for (c = 0; c < d.breakArray.length; c++) if (b = d.breakArray[c], b.from >= a) break; else b.to < a ? a += b.to - b.from : d.isInBreak(b, a) && (a += b.to - b.from);
                    return a
                };
                this.setExtremes = function (a, b, c, d, e) {
                    for (; this.isInAnyBreak(a);) a -= this.closestPointRange;
                    for (; this.isInAnyBreak(b);) b -= this.closestPointRange;
                    g.prototype.setExtremes.call(this, a, b, c, d, e)
                };
                this.setAxisTranslation = function (a) {
                    g.prototype.setAxisTranslation.call(this, a);
                    var b = d.options.breaks, a = [], c = [], e = 0, h, i, j = d.userMin || d.min,
                        k = d.userMax || d.max, n, p;
                    for (p in b) i = b[p], h = i.repeat || Infinity, d.isInBreak(i, j) && (j += i.to % h - j % h), d.isInBreak(i, k) && (k -= k % h - i.from % h);
                    for (p in b) {
                        i = b[p];
                        n = i.from;
                        for (h = i.repeat || Infinity; n - h > j;) n -= h;
                        for (; n < j;) n += h;
                        for (; n < k; n += h) a.push({value: n, move: "in"}), a.push({
                            value: n +
                            (i.to - i.from), move: "out", size: i.breakSize
                        })
                    }
                    a.sort(function (a, b) {
                        return a.value === b.value ? (a.move === "in" ? 0 : 1) - (b.move === "in" ? 0 : 1) : a.value - b.value
                    });
                    b = 0;
                    n = j;
                    for (p in a) {
                        i = a[p];
                        b += i.move === "in" ? 1 : -1;
                        if (b === 1 && i.move === "in") n = i.value;
                        b === 0 && (c.push({
                            from: n,
                            to: i.value,
                            len: i.value - n - (i.size || 0)
                        }), e += i.value - n - (i.size || 0))
                    }
                    d.breakArray = c;
                    f(d, "afterBreaks");
                    d.transA *= (k - d.min) / (k - j - e);
                    d.min = j;
                    d.max = k
                }
            }
        });
        d(h.prototype, "generatePoints", function (a) {
            a.apply(this, b(arguments));
            var c = this.xAxis, d = this.yAxis,
                e = this.points, f, g = e.length;
            if (c && d && (c.options.breaks || d.options.breaks)) for (; g--;) if (f = e[g], c.isInAnyBreak(f.x, !0) || d.isInAnyBreak(f.y, !0)) e.splice(g, 1), this.data[g] && this.data[g].destroyElements()
        });
        d(a.seriesTypes.column.prototype, "drawPoints", function (a) {
            a.apply(this);
            var a = this.points, b = this.yAxis, c = b.breakArray || [], d, e, g, h, n;
            for (g = 0; g < a.length; g++) {
                d = a[g];
                n = d.stackY || d.y;
                for (h = 0; h < c.length; h++) if (e = c[h], n < e.from) break; else n > e.to ? f(b, "pointBreak", {
                    point: d,
                    brk: e
                }) : f(b, "pointInBreak", {
                    point: d,
                    brk: e
                })
            }
        })
    })(A);
    var ca = O.prototype, N = Lb.prototype, jc = ca.processData, kc = ca.generatePoints, lc = ca.destroy,
        mc = N.tooltipFooterHeaderFormatter, nc = {
            approximation: "average", groupPixelWidth: 2, dateTimeLabelFormats: {
                millisecond: ["%A, %b %e, %H:%M:%S.%L", "%A, %b %e, %H:%M:%S.%L", "-%H:%M:%S.%L"],
                second: ["%A, %b %e, %H:%M:%S", "%A, %b %e, %H:%M:%S", "-%H:%M:%S"],
                minute: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                hour: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                day: ["%A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                week: ["Week from %A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                month: ["%B %Y", "%B", "-%B %Y"],
                year: ["%Y", "%Y", "-%Y"]
            }
        }, Xb = {
            line: {},
            spline: {},
            area: {},
            areaspline: {},
            column: {approximation: "sum", groupPixelWidth: 10},
            arearange: {approximation: "range"},
            areasplinerange: {approximation: "range"},
            columnrange: {approximation: "range", groupPixelWidth: 10},
            candlestick: {approximation: "ohlc", groupPixelWidth: 10},
            ohlc: {approximation: "ohlc", groupPixelWidth: 5}
        }, Yb = [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second",
            [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1]], ["week", [1]], ["month", [1, 3, 6]], ["year", null]],
        Qa = {
            sum: function (a) {
                var b = a.length, c;
                if (!b && a.hasNulls) c = null; else if (b) for (c = 0; b--;) c += a[b];
                return c
            }, average: function (a) {
                var b = a.length, a = Qa.sum(a);
                typeof a === "number" && b && (a /= b);
                return a
            }, open: function (a) {
                return a.length ? a[0] : a.hasNulls ? null : s
            }, high: function (a) {
                return a.length ? Ea(a) : a.hasNulls ? null : s
            }, low: function (a) {
                return a.length ? Sa(a) : a.hasNulls ? null : s
            }, close: function (a) {
                return a.length ?
                    a[a.length - 1] : a.hasNulls ? null : s
            }, ohlc: function (a, b, c, d) {
                a = Qa.open(a);
                b = Qa.high(b);
                c = Qa.low(c);
                d = Qa.close(d);
                if (typeof a === "number" || typeof b === "number" || typeof c === "number" || typeof d === "number") return [a, b, c, d]
            }, range: function (a, b) {
                a = Qa.low(a);
                b = Qa.high(b);
                if (typeof a === "number" || typeof b === "number") return [a, b]
            }
        };
    ca.groupData = function (a, b, c, d) {
        var e = this.data, f = this.options.data, g = [], h = [], i = a.length, j, k, m = !!b, l = [[], [], [], []],
            d = typeof d === "function" ? d : Qa[d], o = this.pointArrayMap, n = o && o.length, r;
        for (r =
                 0; r <= i; r++) if (a[r] >= c[0]) break;
        for (; r <= i; r++) {
            for (; c[1] !== s && a[r] >= c[1] || r === i;) if (j = c.shift(), k = d.apply(0, l), k !== s && (g.push(j), h.push(k)), l[0] = [], l[1] = [], l[2] = [], l[3] = [], r === i) break;
            if (r === i) break;
            if (o) {
                j = this.cropStart + r;
                j = e && e[j] || this.pointClass.prototype.applyOptions.apply({series: this}, [f[j]]);
                var p;
                for (k = 0; k < n; k++) if (p = j[o[k]], typeof p === "number") l[k].push(p); else if (p === null) l[k].hasNulls = !0
            } else if (j = m ? b[r] : null, typeof j === "number") l[0].push(j); else if (j === null) l[0].hasNulls = !0
        }
        return [g,
            h]
    };
    ca.processData = function () {
        var a = this.chart, b = this.options, c = b.dataGrouping,
            d = this.allowDG !== !1 && c && p(c.enabled, a.options._stock), e;
        this.forceCrop = d;
        this.groupPixelWidth = null;
        this.hasProcessed = !0;
        if (jc.apply(this, arguments) !== !1 && d) {
            this.destroyGroupedData();
            var f = this.processedXData, g = this.processedYData, h = a.plotSizeX, a = this.xAxis,
                i = a.options.ordinal, j = this.groupPixelWidth = a.getGroupPixelWidth && a.getGroupPixelWidth(),
                d = this.pointRange;
            if (j) {
                e = !0;
                this.points = null;
                var k = a.getExtremes(), d = k.min,
                    k = k.max, i = i && a.getGroupIntervalFactor(d, k, this) || 1, h = j * (k - d) / h * i,
                    j = a.getTimeTicks(a.normalizeTimeTickInterval(h, c.units || Yb), d, k, a.options.startOfWeek, f, this.closestPointRange),
                    g = ca.groupData.apply(this, [f, g, j, c.approximation]), f = g[0], g = g[1];
                if (c.smoothed) {
                    c = f.length - 1;
                    for (f[c] = k; c-- && c > 0;) f[c] += h / 2;
                    f[0] = d
                }
                this.currentDataGrouping = j.info;
                if (b.pointRange === null) this.pointRange = j.info.totalRange;
                this.closestPointRange = j.info.totalRange;
                if (v(f[0]) && f[0] < a.dataMin) {
                    if (a.min === a.dataMin) a.min = f[0];
                    a.dataMin =
                        f[0]
                }
                this.processedXData = f;
                this.processedYData = g
            } else this.currentDataGrouping = null, this.pointRange = d;
            this.hasGroupedData = e
        }
    };
    ca.destroyGroupedData = function () {
        var a = this.groupedData;
        n(a || [], function (b, c) {
            b && (a[c] = b.destroy ? b.destroy() : null)
        });
        this.groupedData = null
    };
    ca.generatePoints = function () {
        kc.apply(this);
        this.destroyGroupedData();
        this.groupedData = this.hasGroupedData ? this.points : null
    };
    N.tooltipFooterHeaderFormatter = function (a, b) {
        var c = a.series, d = c.tooltipOptions, e = c.options.dataGrouping, f = d.xDateFormat,
            g, h = c.xAxis;
        h && h.options.type === "datetime" && e && ra(a.key) ? (c = c.currentDataGrouping, e = e.dateTimeLabelFormats, c ? (h = e[c.unitName], c.count === 1 ? f = h[0] : (f = h[1], g = h[2])) : !f && e && (f = this.getXDateFormat(a, d, h)), f = ja(f, a.key), g && (f += ja(g, a.key + c.totalRange - 1)), d = d[(b ? "footer" : "header") + "Format"].replace("{point.key}", f)) : d = mc.call(this, a, b);
        return d
    };
    ca.destroy = function () {
        for (var a = this.groupedData || [], b = a.length; b--;) a[b] && a[b].destroy();
        lc.apply(this)
    };
    R(ca, "setOptions", function (a, b) {
        var c = a.call(this, b), d =
            this.type, e = this.chart.options.plotOptions, f = U[d].dataGrouping;
        if (Xb[d]) f || (f = z(nc, Xb[d])), c.dataGrouping = z(f, e.series && e.series.dataGrouping, e[d].dataGrouping, b.dataGrouping);
        if (this.chart.options._stock) this.requireSorting = !0;
        return c
    });
    R(J.prototype, "setScale", function (a) {
        a.call(this);
        n(this.series, function (a) {
            a.hasProcessed = !1
        })
    });
    J.prototype.getGroupPixelWidth = function () {
        var a = this.series, b = a.length, c, d = 0, e = !1, f;
        for (c = b; c--;) (f = a[c].options.dataGrouping) && (d = x(d, f.groupPixelWidth));
        for (c = b; c--;) if ((f =
                a[c].options.dataGrouping) && a[c].hasProcessed) if (b = (a[c].processedXData || a[c].data).length, a[c].groupPixelWidth || b > this.chart.plotSizeX / d || b && f.forced) e = !0;
        return e ? d : 0
    };
    J.prototype.setDataGrouping = function (a, b) {
        b = p(b, !0);
        a || (a = {forced: !1, units: null});
        this instanceof J ? n(this.series, function (b) {
            b.update({dataGrouping: a}, !1)
        }) : n(this.chart.options.series, function (b) {
            b.dataGrouping = a
        })
    };
    U.ohlc = z(U.column, {
        lineWidth: 1,
        tooltip: {pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>开盘：{point.open}<br/>最高：{point.high}<br/>最低：{point.low}<br/>收盘：{point.close}<br/>'},
        states: {hover: {lineWidth: 3}},
        threshold: null
    });
    N = ia(F.column, {
        type: "ohlc",
        pointArrayMap: ["open", "high", "low", "close"],
        toYData: function (a) {
            return [a.open, a.high, a.low, a.close]
        },
        pointValKey: "high",
        pointAttrToOptions: {stroke: "color", "stroke-width": "lineWidth"},
        upColorProp: "stroke",
        getAttribs: function () {
            F.column.prototype.getAttribs.apply(this, arguments);
            var a = this.options, b = a.states, a = a.upColor || this.color, c = z(this.pointAttr),
                d = this.upColorProp;
            c[""][d] = a;
            c.hover[d] = b.hover.upColor || a;
            c.select[d] = b.select.upColor ||
                a;
            n(this.points, function (a) {
                if (a.open < a.close && !a.options.color) a.pointAttr = c
            })
        },
        translate: function () {
            var a = this.yAxis;
            F.column.prototype.translate.apply(this);
            n(this.points, function (b) {
                if (b.open !== null) b.plotOpen = a.translate(b.open, 0, 1, 0, 1);
                if (b.close !== null) b.plotClose = a.translate(b.close, 0, 1, 0, 1)
            })
        },
        drawPoints: function () {
            var a = this, b = a.chart, c, d, e, f, g, h, i, j;
            n(a.points, function (k) {
                if (k.plotY !== s) i = k.graphic, c = k.pointAttr[k.selected ? "selected" : ""] || a.pointAttr[""], f = c["stroke-width"] % 2 / 2, j = u(k.plotX) -
                    f, g = u(k.shapeArgs.width / 2), h = ["M", j, u(k.yBottom), "L", j, u(k.plotY)], k.open !== null && (d = u(k.plotOpen) + f, h.push("M", j, d, "L", j - g, d)), k.close !== null && (e = u(k.plotClose) + f, h.push("M", j, e, "L", j + g, e)), i ? i.attr(c).animate({d: h}) : k.graphic = b.renderer.path(h).attr(c).add(a.group)
            })
        },
        animate: null
    });
    F.ohlc = N;
    U.candlestick = z(U.column, {
        lineColor: "black",
        lineWidth: 1,
        states: {hover: {lineWidth: 2}},
        tooltip: U.ohlc.tooltip,
        threshold: null,
        upColor: "white"
    });
    N = ia(N, {
        type: "candlestick", pointAttrToOptions: {
            fill: "color", stroke: "lineColor",
            "stroke-width": "lineWidth"
        }, upColorProp: "fill", getAttribs: function () {
            F.ohlc.prototype.getAttribs.apply(this, arguments);
            var a = this.options, b = a.states, c = a.upLineColor || a.lineColor, d = b.hover.upLineColor || c,
                e = b.select.upLineColor || c;
            n(this.points, function (a) {
                if (a.open < a.close) a.pointAttr[""].stroke = c, a.pointAttr.hover.stroke = d, a.pointAttr.select.stroke = e
            })
        }, drawPoints: function () {
            var a = this, b = a.chart, c, d = a.pointAttr[""], e, f, g, h, i, j, k, m, l, o, q;
            n(a.points, function (n) {
                l = n.graphic;
                if (n.plotY !== s) c = n.pointAttr[n.selected ?
                    "selected" : ""] || d, k = c["stroke-width"] % 2 / 2, m = u(n.plotX) - k, e = n.plotOpen, f = n.plotClose, g = X.min(e, f), h = X.max(e, f), q = u(n.shapeArgs.width / 2), i = u(g) !== u(n.plotY), j = h !== n.yBottom, g = u(g) + k, h = u(h) + k, o = ["M", m - q, h, "L", m - q, g, "L", m + q, g, "L", m + q, h, "Z", "M", m, g, "L", m, i ? u(n.plotY) : g, "M", m, h, "L", m, j ? u(n.yBottom) : h], l ? l.attr(c).animate({d: o}) : n.graphic = b.renderer.path(o).attr(c).add(a.group).shadow(a.options.shadow)
            })
        }
    });
    F.candlestick = N;
    var ub = ma.prototype.symbols;
    U.flags = z(U.column, {
        fillColor: "white",
        lineWidth: 1,
        pointRange: 0,
        shape: "flag",
        stackDistance: 12,
        states: {hover: {lineColor: "black", fillColor: "#FCFFC5"}},
        style: {fontSize: "11px", fontWeight: "bold", textAlign: "center"},
        tooltip: {pointFormat: "{point.text}<br/>"},
        threshold: null,
        y: -30
    });
    F.flags = ia(F.column, {
        type: "flags",
        sorted: !1,
        noSharedTooltip: !0,
        allowDG: !1,
        takeOrdinalPosition: !1,
        trackerGroups: ["markerGroup"],
        forceCrop: !0,
        init: O.prototype.init,
        pointAttrToOptions: {fill: "fillColor", stroke: "color", "stroke-width": "lineWidth", r: "radius"},
        translate: function () {
            F.column.prototype.translate.apply(this);
            var a = this.chart, b = this.points, c = b.length - 1, d, e, f = this.options.onSeries,
                f = (d = f && a.get(f)) && d.options.step, g = d && d.points, h = g && g.length, i = this.xAxis,
                j = i.getExtremes(), k, m, l;
            if (d && d.visible && h) {
                d = d.currentDataGrouping;
                m = g[h - 1].x + (d ? d.totalRange : 0);
                for (b.sort(function (a, b) {
                    return a.x - b.x
                }); h-- && b[c];) if (d = b[c], k = g[h], k.x <= d.x && k.plotY !== s) {
                    if (d.x <= m) d.plotY = k.plotY, k.x < d.x && !f && (l = g[h + 1]) && l.plotY !== s && (d.plotY += (d.x - k.x) / (l.x - k.x) * (l.plotY - k.plotY));
                    c--;
                    h++;
                    if (c < 0) break
                }
            }
            n(b, function (c, d) {
                var f;
                if (c.plotY ===
                    s) c.x >= j.min && c.x <= j.max ? c.plotY = a.chartHeight - i.bottom - (i.opposite ? i.height : 0) + i.offset - a.plotTop : c.shapeArgs = {};
                if ((e = b[d - 1]) && e.plotX === c.plotX) {
                    if (e.stackIndex === s) e.stackIndex = 0;
                    f = e.stackIndex + 1
                }
                c.stackIndex = f
            })
        },
        drawPoints: function () {
            var a, b = this.pointAttr[""], c = this.points, d = this.chart.renderer, e, f, g = this.options, h = g.y, i,
                j, k, m, l, o;
            for (j = c.length; j--;) if (k = c[j], a = k.plotX > this.xAxis.len, e = k.plotX - 1, m = k.stackIndex, i = k.options.shape || g.shape, f = k.plotY, f !== s && (f = k.plotY + h - (m !== s && m * g.stackDistance)),
                    l = m ? s : k.plotX, o = m ? s : k.plotY, m = k.graphic, f !== s && e >= 0 && !a) a = k.pointAttr[k.selected ? "select" : ""] || b, m ? m.attr({
                x: e,
                y: f,
                r: a.r,
                anchorX: l,
                anchorY: o
            }) : k.graphic = d.label(k.options.title || g.title || "A", e, f, i, l, o, g.useHTML).css(z(g.style, k.style)).attr(a).attr({
                align: i === "flag" ? "left" : "center",
                width: g.width,
                height: g.height
            }).add(this.markerGroup).shadow(g.shadow), k.tooltipPos = [e, f]; else if (m) k.graphic = m.destroy()
        },
        drawTracker: function () {
            var a = this.points;
            jb.drawTrackerPoint.apply(this);
            n(a, function (b) {
                var c =
                    b.graphic;
                c && D(c.element, "mouseover", function () {
                    if (b.stackIndex > 0 && !b.raised) b._y = c.y, c.attr({y: b._y - 8}), b.raised = !0;
                    n(a, function (a) {
                        if (a !== b && a.raised && a.graphic) a.graphic.attr({y: a._y}), a.raised = !1
                    })
                })
            })
        },
        animate: ga,
        buildKDTree: ga,
        setClip: ga
    });
    ub.flag = function (a, b, c, d, e) {
        var f = e && e.anchorX || a, e = e && e.anchorY || b;
        return ["M", f, e, "L", a, b + d, a, b, a + c, b, a + c, b + d, a, b + d, "M", f, e, "Z"]
    };
    n(["circle", "square"], function (a) {
        ub[a + "pin"] = function (b, c, d, e, f) {
            var g = f && f.anchorX, f = f && f.anchorY;
            a === "circle" && e > d && (b -= u((e -
                d) / 2), d = e);
            b = ub[a](b, c, d, e);
            g && f && b.push("M", g, c > f ? c : c + e, "L", g, f);
            return b
        }
    });
    Wa === A.VMLRenderer && n(["flag", "circlepin", "squarepin"], function (a) {
        ib.prototype.symbols[a] = ub[a]
    });
    var N = [].concat(Yb), vb = function (a) {
        var b = hb(arguments, function (a) {
            return typeof a === "number"
        });
        if (b.length) return Math[a].apply(0, b)
    };
    N[4] = ["day", [1, 2, 3, 4]];
    N[5] = ["week", [1, 2, 3]];
    w(P, {
        navigator: {
            handles: {backgroundColor: "#ebe7e8", borderColor: "#b2b1b6"},
            height: 40,
            margin: 25,
            maskFill: "rgba(128,179,236,0.3)",
            maskInside: !0,
            outlineColor: "#b2b1b6",
            outlineWidth: 1,
            series: {
                type: F.areaspline === s ? "line" : "areaspline",
                color: "#4572A7",
                compare: null,
                fillOpacity: 0.05,
                dataGrouping: {approximation: "average", enabled: !0, groupPixelWidth: 2, smoothed: !0, units: N},
                dataLabels: {enabled: !1, zIndex: 2},
                id: "highcharts-navigator-series",
                lineColor: "#4572A7",
                lineWidth: 1,
                marker: {enabled: !1},
                pointRange: 0,
                shadow: !1,
                threshold: null
            },
            xAxis: {
                tickWidth: 0,
                lineWidth: 0,
                gridLineColor: "#EEE",
                gridLineWidth: 1,
                tickPixelInterval: 200,
                labels: {align: "left", style: {color: "#888"}, x: 3, y: -4},
                crosshair: !1
            },
            yAxis: {
                gridLineWidth: 0,
                startOnTick: !1,
                endOnTick: !1,
                minPadding: 0.1,
                maxPadding: 0.1,
                labels: {enabled: !1},
                crosshair: !1,
                title: {text: null},
                tickWidth: 0
            }
        }, scrollbar: {
            height: fb ? 20 : 14,
            barBackgroundColor: "#bfc8d1",
            barBorderRadius: 0,
            barBorderWidth: 1,
            barBorderColor: "#bfc8d1",
            buttonArrowColor: "#666",
            buttonBackgroundColor: "#ebe7e8",
            buttonBorderColor: "#bbb",
            buttonBorderRadius: 0,
            buttonBorderWidth: 1,
            minWidth: 6,
            rifleColor: "#666",
            trackBackgroundColor: "#eeeeee",
            trackBorderColor: "#eeeeee",
            trackBorderWidth: 1,
            liveRedraw: da &&
            !fb
        }
    });
    Gb.prototype = {
        drawHandle: function (a, b) {
            var c = this.chart, d = c.renderer, e = this.elementsToDestroy, f = this.handles,
                g = this.navigatorOptions.handles,
                g = {fill: g.backgroundColor, stroke: g.borderColor, "stroke-width": 1}, h;
            this.rendered || (f[b] = d.g("navigator-handle-" + ["left", "right"][b]).css({cursor: "ew-resize"}).attr({zIndex: 4 - b}).add(), h = d.rect(-4.5, 0, 9, 16, 0, 1).attr(g).add(f[b]), e.push(h), h = d.path(["M", -1.5, 4, "L", -1.5, 12, "M", 0.5, 4, "L", 0.5, 12]).attr(g).add(f[b]), e.push(h));
            f[b][c.isResizing ? "animate" : "attr"]({
                translateX: this.scrollerLeft +
                this.scrollbarHeight + parseInt(a, 10), translateY: this.top + this.height / 2 - 8
            })
        }, drawScrollbarButton: function (a) {
            var b = this.chart.renderer, c = this.elementsToDestroy, d = this.scrollbarButtons,
                e = this.scrollbarHeight, f = this.scrollbarOptions, g;
            this.rendered || (d[a] = b.g().add(this.scrollbarGroup), g = b.rect(-0.5, -0.5, e + 1, e + 1, f.buttonBorderRadius, f.buttonBorderWidth).attr({
                stroke: f.buttonBorderColor,
                "stroke-width": f.buttonBorderWidth,
                fill: f.buttonBackgroundColor
            }).add(d[a]), c.push(g), g = b.path(["M", e / 2 + (a ? -1 : 1), e / 2 -
            3, "L", e / 2 + (a ? -1 : 1), e / 2 + 3, e / 2 + (a ? 2 : -2), e / 2]).attr({fill: f.buttonArrowColor}).add(d[a]), c.push(g));
            a && d[a].attr({translateX: this.scrollerWidth - e})
        }, render: function (a, b, c, d) {
            var e = this.chart, f = e.renderer, g, h, i, j, k = this.scrollbarGroup, m = this.navigatorGroup,
                l = this.scrollbar, m = this.xAxis, o = this.scrollbarTrack, n = this.scrollbarHeight,
                r = this.scrollbarEnabled, s = this.navigatorOptions, w = this.scrollbarOptions, t = w.minWidth,
                y = this.height, z = this.top, A = this.navigatorEnabled, D = s.outlineWidth, C = D / 2, F = 0,
                K = this.outlineHeight,
                I = w.barBorderRadius, H = w.barBorderWidth, E = z + C, J;
            if (v(a) && !isNaN(a)) {
                this.navigatorLeft = g = p(m.left, e.plotLeft + n);
                this.navigatorWidth = h = p(m.len, e.plotWidth - 2 * n);
                this.scrollerLeft = i = g - n;
                this.scrollerWidth = j = j = h + 2 * n;
                m.getExtremes && (J = this.getUnionExtremes(!0)) && (J.dataMin !== m.min || J.dataMax !== m.max) && m.setExtremes(J.dataMin, J.dataMax, !0, !1);
                c = p(c, m.translate(a));
                d = p(d, m.translate(b));
                if (isNaN(c) || Q(c) === Infinity) c = 0, d = j;
                if (!(m.translate(d, !0) - m.translate(c, !0) < e.xAxis[0].minRange)) {
                    this.zoomedMax = B(x(c,
                        d), h);
                    this.zoomedMin = x(this.fixedWidth ? this.zoomedMax - this.fixedWidth : B(c, d), 0);
                    this.range = this.zoomedMax - this.zoomedMin;
                    c = u(this.zoomedMax);
                    b = u(this.zoomedMin);
                    a = c - b;
                    if (!this.rendered) {
                        if (A) this.navigatorGroup = m = f.g("navigator").attr({zIndex: 3}).add(), this.leftShade = f.rect().attr({fill: s.maskFill}).add(m), s.maskInside ? this.leftShade.css({cursor: "ew-resize "}) : this.rightShade = f.rect().attr({fill: s.maskFill}).add(m), this.outline = f.path().attr({
                            "stroke-width": D,
                            stroke: s.outlineColor
                        }).add(m);
                        if (r) this.scrollbarGroup =
                            k = f.g("scrollbar").add(), l = w.trackBorderWidth, this.scrollbarTrack = o = f.rect().attr({
                            x: 0,
                            y: -l % 2 / 2,
                            fill: w.trackBackgroundColor,
                            stroke: w.trackBorderColor,
                            "stroke-width": l,
                            r: w.trackBorderRadius || 0,
                            height: n
                        }).add(k), this.scrollbar = l = f.rect().attr({
                            y: -H % 2 / 2,
                            height: n,
                            fill: w.barBackgroundColor,
                            stroke: w.barBorderColor,
                            "stroke-width": H,
                            r: I
                        }).add(k), this.scrollbarRifles = f.path().attr({
                            stroke: w.rifleColor,
                            "stroke-width": 1
                        }).add(k)
                    }
                    e = e.isResizing ? "animate" : "attr";
                    if (A) {
                        this.leftShade[e](s.maskInside ? {
                            x: g + b, y: z,
                            width: c - b, height: y
                        } : {x: g, y: z, width: b, height: y});
                        if (this.rightShade) this.rightShade[e]({x: g + c, y: z, width: h - c, height: y});
                        this.outline[e]({d: ["M", i, E, "L", g + b - C, E, g + b - C, E + K, "L", g + c - C, E + K, "L", g + c - C, E, i + j, E].concat(s.maskInside ? ["M", g + b + C, E, "L", g + c - C, E] : [])});
                        this.drawHandle(b + C, 0);
                        this.drawHandle(c + C, 1)
                    }
                    if (r && k) this.drawScrollbarButton(0), this.drawScrollbarButton(1), k[e]({
                        translateX: i,
                        translateY: u(E + y)
                    }), o[e]({width: j}), g = n + b, h = a - H, h < t && (F = (t - h) / 2, h = t, g -= F), this.scrollbarPad = F, l[e]({
                        x: W(g) + H % 2 / 2,
                        width: h
                    }),
                        t = n + b + a / 2 - 0.5, this.scrollbarRifles.attr({visibility: a > 12 ? "visible" : "hidden"})[e]({d: ["M", t - 3, n / 4, "L", t - 3, 2 * n / 3, "M", t, n / 4, "L", t, 2 * n / 3, "M", t + 3, n / 4, "L", t + 3, 2 * n / 3]});
                    this.scrollbarPad = F;
                    this.rendered = !0
                }
            }
        }, addEvents: function () {
            var a = this.chart.container, b = this.mouseDownHandler, c = this.mouseMoveHandler, d = this.mouseUpHandler,
                e;
            e = [[a, "mousedown", b], [a, "mousemove", c], [document, "mouseup", d]];
            $a && e.push([a, "touchstart", b], [a, "touchmove", c], [document, "touchend", d]);
            n(e, function (a) {
                D.apply(null, a)
            });
            this._events =
                e
        }, removeEvents: function () {
            n(this._events, function (a) {
                T.apply(null, a)
            });
            this._events = s;
            this.navigatorEnabled && this.baseSeries && T(this.baseSeries, "updatedData", this.updatedDataHandler)
        }, init: function () {
            var a = this, b = a.chart, c, d, e = a.scrollbarHeight, f = a.navigatorOptions, g = a.height, h = a.top, i,
                j, k = a.baseSeries;
            a.mouseDownHandler = function (d) {
                var d = b.pointer.normalize(d), e = a.zoomedMin, f = a.zoomedMax, h = a.top, j = a.scrollbarHeight,
                    k = a.scrollerLeft, l = a.scrollerWidth, m = a.navigatorLeft, n = a.navigatorWidth,
                    p = a.scrollbarPad,
                    s = a.range, u = d.chartX, v = d.chartY, d = b.xAxis[0], x, w = fb ? 10 : 7;
                if (v > h && v < h + g + j) if ((h = !a.scrollbarEnabled || v < h + g) && X.abs(u - e - m) < w) a.grabbedLeft = !0, a.otherHandlePos = f, a.fixedExtreme = d.max, b.fixedRange = null; else if (h && X.abs(u - f - m) < w) a.grabbedRight = !0, a.otherHandlePos = e, a.fixedExtreme = d.min, b.fixedRange = null; else if (u > m + e - p && u < m + f + p) a.grabbedCenter = u, a.fixedWidth = s, i = u - e; else if (u > k && u < k + l) {
                    f = h ? u - m - s / 2 : u < m ? e - s * 0.2 : u > k + l - j ? e + s * 0.2 : u < m + e ? e - s : f;
                    if (f < 0) f = 0; else if (f + s >= n) f = n - s, x = a.getUnionExtremes().dataMax;
                    if (f !==
                        e) a.fixedWidth = s, e = c.toFixedRange(f, f + s, null, x), d.setExtremes(e.min, e.max, !0, !1, {trigger: "navigator"})
                }
            };
            a.mouseMoveHandler = function (c) {
                var d = a.scrollbarHeight, e = a.navigatorLeft, f = a.navigatorWidth, g = a.scrollerLeft,
                    h = a.scrollerWidth, k = a.range, l;
                if (c.pageX !== 0) c = b.pointer.normalize(c), l = c.chartX, l < e ? l = e : l > g + h - d && (l = g + h - d), a.grabbedLeft ? (j = !0, a.render(0, 0, l - e, a.otherHandlePos)) : a.grabbedRight ? (j = !0, a.render(0, 0, a.otherHandlePos, l - e)) : a.grabbedCenter && (j = !0, l < i ? l = i : l > f + i - k && (l = f + i - k), a.render(0, 0, l - i,
                    l - i + k)), j && a.scrollbarOptions.liveRedraw && setTimeout(function () {
                    a.mouseUpHandler(c)
                }, 0)
            };
            a.mouseUpHandler = function (d) {
                var e, f;
                if (j) {
                    if (a.zoomedMin === a.otherHandlePos) e = a.fixedExtreme; else if (a.zoomedMax === a.otherHandlePos) f = a.fixedExtreme;
                    e = c.toFixedRange(a.zoomedMin, a.zoomedMax, e, f);
                    b.xAxis[0].setExtremes(e.min, e.max, !0, !1, {
                        trigger: "navigator",
                        triggerOp: "navigator-drag",
                        DOMEvent: d
                    })
                }
                if (d.type !== "mousemove") a.grabbedLeft = a.grabbedRight = a.grabbedCenter = a.fixedWidth = a.fixedExtreme = a.otherHandlePos =
                    j = i = null
            };
            var m = b.xAxis.length, l = b.yAxis.length;
            b.extraBottomMargin = a.outlineHeight + f.margin;
            a.navigatorEnabled ? (a.xAxis = c = new J(b, z({
                breaks: k && k.xAxis.options.breaks,
                ordinal: k && k.xAxis.options.ordinal
            }, f.xAxis, {
                id: "navigator-x-axis",
                isX: !0,
                type: "datetime",
                index: m,
                height: g,
                offset: 0,
                offsetLeft: e,
                offsetRight: -e,
                keepOrdinalPadding: !0,
                startOnTick: !1,
                endOnTick: !1,
                minPadding: 0,
                maxPadding: 0,
                zoomEnabled: !1
            })), a.yAxis = d = new J(b, z(f.yAxis, {
                id: "navigator-y-axis",
                alignTicks: !1,
                height: g,
                offset: 0,
                index: l,
                zoomEnabled: !1
            })),
                k || f.series.data ? a.addBaseSeries() : b.series.length === 0 && R(b, "redraw", function (c, d) {
                    if (b.series.length > 0 && !a.series) a.setBaseSeries(), b.redraw = c;
                    c.call(b, d)
                })) : a.xAxis = c = {
                translate: function (a, c) {
                    var d = b.xAxis[0], f = d.getExtremes(), g = b.plotWidth - 2 * e,
                        h = vb("min", d.options.min, f.dataMin), d = vb("max", d.options.max, f.dataMax) - h;
                    return c ? a * d / g + h : g * (a - h) / d
                }, toFixedRange: J.prototype.toFixedRange
            };
            R(b, "getMargins", function (b) {
                var e = this.legend, f = e.options;
                b.apply(this, [].slice.call(arguments, 1));
                a.top = h = a.navigatorOptions.top ||
                    this.chartHeight - a.height - a.scrollbarHeight - this.spacing[2] - (f.verticalAlign === "bottom" && f.enabled && !f.floating ? e.legendHeight + p(f.margin, 10) : 0);
                if (c && d) c.options.top = d.options.top = h, c.setAxisSize(), d.setAxisSize()
            });
            a.addEvents()
        }, getUnionExtremes: function (a) {
            var b = this.chart.xAxis[0], c = this.xAxis, d = c.options, e = b.options, f;
            if (!a || b.dataMin !== null) f = {
                dataMin: p(d && d.min, vb("min", e.min, b.dataMin, c.dataMin)),
                dataMax: p(d && d.max, vb("max", e.max, b.dataMax, c.dataMax))
            };
            return f
        }, setBaseSeries: function (a) {
            var b =
                this.chart, a = a || b.options.navigator.baseSeries;
            this.series && this.series.remove();
            this.baseSeries = b.series[a] || typeof a === "string" && b.get(a) || b.series[0];
            this.xAxis && this.addBaseSeries()
        }, addBaseSeries: function () {
            var a = this.baseSeries, b = a ? a.options : {}, c = b.data, d = this.navigatorOptions.series, e;
            e = d.data;
            this.hasNavigatorData = !!e;
            b = z(b, d, {
                enableMouseTracking: !1,
                group: "nav",
                padXAxis: !1,
                xAxis: "navigator-x-axis",
                yAxis: "navigator-y-axis",
                name: "Navigator",
                showInLegend: !1,
                isInternal: !0,
                visible: !0
            });
            b.data =
                e || c;
            this.series = this.chart.initSeries(b);
            if (a && this.navigatorOptions.adaptToUpdatedData !== !1) D(a, "updatedData", this.updatedDataHandler), a.userOptions.events = w(a.userOptions.event, {updatedData: this.updatedDataHandler})
        }, updatedDataHandler: function () {
            var a = this.chart.scroller, b = a.baseSeries, c = b.xAxis, d = c.getExtremes(), e = d.min, f = d.max,
                g = d.dataMin, d = d.dataMax, h = f - e, i, j, k, m, l, n = a.series;
            i = n.xData;
            var p = !!c.setExtremes;
            j = f >= i[i.length - 1] - (this.closestPointRange || 0);
            i = e <= g;
            if (!a.hasNavigatorData) n.options.pointStart =
                b.xData[0], n.setData(b.options.data, !1), l = !0;
            i && (m = g, k = m + h);
            j && (k = d, i || (m = x(k - h, n.xData[0])));
            p && (i || j) ? isNaN(m) || c.setExtremes(m, k, !0, !1, {trigger: "updatedData"}) : (l && this.chart.redraw(!1), a.render(x(e, g), B(f, d)))
        }, destroy: function () {
            this.removeEvents();
            n([this.xAxis, this.yAxis, this.leftShade, this.rightShade, this.outline, this.scrollbarTrack, this.scrollbarRifles, this.scrollbarGroup, this.scrollbar], function (a) {
                a && a.destroy && a.destroy()
            });
            this.xAxis = this.yAxis = this.leftShade = this.rightShade = this.outline =
                this.scrollbarTrack = this.scrollbarRifles = this.scrollbarGroup = this.scrollbar = null;
            n([this.scrollbarButtons, this.handles, this.elementsToDestroy], function (a) {
                Na(a)
            })
        }
    };
    A.Scroller = Gb;
    R(J.prototype, "zoom", function (a, b, c) {
        var d = this.chart, e = d.options, f = e.chart.zoomType, g = e.navigator, e = e.rangeSelector, h;
        if (this.isXAxis && (g && g.enabled || e && e.enabled)) if (f === "x") d.resetZoomButton = "blocked"; else if (f === "y") h = !1; else if (f === "xy") d = this.previousZoom, v(b) ? this.previousZoom = [this.min, this.max] : d && (b = d[0], c = d[1],
            delete this.previousZoom);
        return h !== s ? h : a.call(this, b, c)
    });
    R(Pa.prototype, "init", function (a, b, c) {
        D(this, "beforeRender", function () {
            var a = this.options;
            if (a.navigator.enabled || a.scrollbar.enabled) this.scroller = new Gb(this)
        });
        a.call(this, b, c)
    });
    R(O.prototype, "addPoint", function (a, b, c, d, e) {
        var f = this.options.turboThreshold;
        f && this.xData.length > f && ha(b) && !Ka(b) && this.chart.scroller && pa(20, !0);
        a.call(this, b, c, d, e)
    });
    w(P, {
        rangeSelector: {
            buttonTheme: {
                width: 28,
                height: 18,
                fill: "#f7f7f7",
                padding: 2,
                r: 0,
                "stroke-width": 0,
                style: {color: "#676c7b", cursor: "pointer", fontWeight: "normal"},
                zIndex: 7,
                states: {
                    hover: {fill: "#e7e7e7"},
                    select: {fill: "#e7f0f9", style: {color: "black", fontWeight: "bold"}}
                }
            }, inputPosition: {align: "right"}, labelStyle: {color: "#666"}
        }
    });
    P.lang = z(P.lang, {rangeSelectorZoom: "Zoom", rangeSelectorFrom: "From", rangeSelectorTo: "To"});
    Hb.prototype = {
        clickButton: function (a, b) {
            var c = this, d = c.selected, e = c.chart, f = c.buttons, g = c.buttonOptions[a], h = e.xAxis[0],
                i = e.scroller && e.scroller.getUnionExtremes() || h || {}, j = i.dataMin, k = i.dataMax,
                m, l = h && u(B(h.max, p(k, h.max))), o = new ea(l), q = g.type, r = g.count, i = g._range, v,
                w = g.dataGrouping;
            if (!(j === null || k === null || a === c.selected)) {
                if (w) this.forcedDataGrouping = !0, J.prototype.setDataGrouping.call(h || {chart: this.chart}, w, !1);
                if (q === "month" || q === "year") m = {
                    month: "Month",
                    year: "FullYear"
                }[q], o["set" + m](o["get" + m]() - r), m = o.getTime(), j = p(j, Number.MIN_VALUE), isNaN(m) || m < j ? (m = j, l = B(m + i, k)) : i = l - m; else if (i) m = x(l - i, j), l = B(m + i, k); else if (q === "ytd") if (h) {
                    if (k === s) j = Number.MAX_VALUE, k = Number.MIN_VALUE, n(e.series,
                        function (a) {
                            a = a.xData;
                            j = B(a[0], j);
                            k = x(a[a.length - 1], k)
                        }), b = !1;
                    l = new ea(k);
                    v = l.getFullYear();
                    m = v = x(j || 0, ea.UTC(v, 0, 1));
                    l = l.getTime();
                    l = B(k || l, l)
                } else {
                    D(e, "beforeRender", function () {
                        c.clickButton(a)
                    });
                    return
                } else q === "all" && h && (m = j, l = k);
                f[d] && f[d].setState(0);
                f[a] && f[a].setState(2);
                e.fixedRange = i;
                h ? h.setExtremes(m, l, p(b, 1), 0, {
                    trigger: "rangeSelectorButton",
                    rangeSelectorButton: g
                }) : (d = e.options.xAxis, d[0] = z(d[0], {range: i, min: v}));
                c.setSelected(a)
            }
        },
        setSelected: function (a) {
            this.selected = this.options.selected =
                a
        },
        defaultButtons: [{type: "month", count: 1, text: "1m"}, {type: "month", count: 3, text: "3m"}, {
            type: "month",
            count: 6,
            text: "6m"
        }, {type: "ytd", text: "YTD"}, {type: "year", count: 1, text: "1y"}, {type: "all", text: "All"}],
        init: function (a) {
            var b = this, c = a.options.rangeSelector, d = c.buttons || [].concat(b.defaultButtons), e = c.selected,
                f = b.blurInputs = function () {
                    var a = b.minInput, c = b.maxInput;
                    a && a.blur && E(a, "blur");
                    c && c.blur && E(c, "blur")
                };
            b.chart = a;
            b.options = c;
            b.buttons = [];
            a.extraTopMargin = 35;
            b.buttonOptions = d;
            D(a.container, "mousedown",
                f);
            D(a, "resize", f);
            n(d, b.computeButtonRange);
            e !== s && d[e] && this.clickButton(e, !1);
            D(a, "load", function () {
                D(a.xAxis[0], "setExtremes", function (c) {
                    this.max - this.min !== a.fixedRange && c.trigger !== "rangeSelectorButton" && c.trigger !== "updatedData" && b.forcedDataGrouping && this.setDataGrouping(!1, !1)
                });
                D(a.xAxis[0], "afterSetExtremes", function () {
                    b.updateButtonStates(!0)
                })
            })
        },
        updateButtonStates: function (a) {
            var b = this, c = this.chart, d = c.xAxis[0], e = c.scroller && c.scroller.getUnionExtremes() || d,
                f = e.dataMin, g = e.dataMax,
                h = b.selected, i = b.options.allButtonsEnabled, j = b.buttons;
            a && c.fixedRange !== u(d.max - d.min) && (j[h] && j[h].setState(0), b.setSelected(null));
            n(b.buttonOptions, function (a, c) {
                var e = a._range, n = e > g - f, p = e < d.minRange,
                    r = a.type === "all" && d.max - d.min >= g - f && j[c].state !== 2,
                    s = a.type === "ytd" && ja("%Y", f) === ja("%Y", g);
                e === u(d.max - d.min) && c !== h ? (b.setSelected(c), j[c].setState(2)) : !i && (n || p || r || s) ? j[c].setState(3) : j[c].state === 3 && j[c].setState(0)
            })
        },
        computeButtonRange: function (a) {
            var b = a.type, c = a.count || 1, d = {
                millisecond: 1,
                second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5
            };
            if (d[b]) a._range = d[b] * c; else if (b === "month" || b === "year") a._range = {
                month: 30,
                year: 365
            }[b] * 864E5 * c
        },
        setInputValue: function (a, b) {
            var c = this.chart.options.rangeSelector;
            if (v(b)) this[a + "Input"].HCTime = b;
            this[a + "Input"].value = ja(c.inputEditDateFormat || "%Y-%m-%d", this[a + "Input"].HCTime);
            this[a + "DateBox"].attr({text: ja(c.inputDateFormat || "%b %e, %Y", this[a + "Input"].HCTime)})
        },
        showInput: function (a) {
            var b = this.inputGroup, c = this[a + "DateBox"];
            M(this[a + "Input"],
                {
                    left: b.translateX + c.x + "px",
                    top: b.translateY + "px",
                    width: c.width - 2 + "px",
                    height: c.height - 2 + "px",
                    border: "2px solid silver"
                })
        },
        hideInput: function (a) {
            document.activeElement === this[a + "Input"] && (M(this[a + "Input"], {
                border: 0,
                width: "1px",
                height: "1px"
            }), this.setInputValue(a))
        },
        drawInput: function (a) {
            var b = this, c = b.chart, d = c.renderer.style, e = c.renderer, f = c.options.rangeSelector, g = b.div,
                h = a === "min", i, j, k = this.inputGroup;
            this[a + "Label"] = j = e.label(P.lang[h ? "rangeSelectorFrom" : "rangeSelectorTo"], this.inputGroup.offset).attr({padding: 2}).css(z(d,
                f.labelStyle)).add(k);
            k.offset += j.width + 5;
            this[a + "DateBox"] = e = e.label("", k.offset).attr({
                padding: 2,
                width: f.inputBoxWidth || 90,
                height: f.inputBoxHeight || 17,
                stroke: f.inputBoxBorderColor || "silver",
                "stroke-width": 1
            }).css(z({textAlign: "center", color: "#676c7b"}, d, f.inputStyle)).on("click", function () {
                b.showInput(a);
                b[a + "Input"].focus()
            }).add(k);
            k.offset += e.width + (h ? 10 : 0);
            this[a + "Input"] = i = $("input", {name: a, className: "highcharts-range-selector", type: "text"}, w({
                position: "absolute", border: 0, width: "1px", height: "1px",
                padding: 0, textAlign: "center", fontSize: d.fontSize, fontFamily: d.fontFamily, top: c.plotTop + "px"
            }, f.inputStyle), g);
            i.onfocus = function () {
                b.showInput(a)
            };
            i.onblur = function () {
                b.hideInput(a)
            };
            i.onchange = function () {
                var a = i.value, d = (f.inputDateParser || ea.parse)(a), e = c.xAxis[0], g = e.dataMin, j = e.dataMax;
                isNaN(d) && (d = a.split("-"), d = ea.UTC(L(d[0]), L(d[1]) - 1, L(d[2])));
                isNaN(d) || (P.global.useUTC || (d += (new ea).getTimezoneOffset() * 6E4), h ? d > b.maxInput.HCTime ? d = s : d < g && (d = g) : d < b.minInput.HCTime ? d = s : d > j && (d = j), d !== s && c.xAxis[0].setExtremes(h ?
                    d : e.min, h ? e.max : d, s, s, {trigger: "rangeSelectorInput"}))
            }
        },
        render: function (a, b) {
            var c = this, d = c.chart, e = d.renderer, f = d.container, g = d.options,
                h = g.exporting && g.navigation && g.navigation.buttonOptions, i = g.rangeSelector, j = c.buttons,
                k = P.lang, g = c.div, g = c.inputGroup, m = i.buttonTheme, l = i.buttonPosition || {},
                o = i.inputEnabled, q = m && m.states, r = d.plotLeft, s, u, t = c.group;
            if (!c.rendered && (c.group = t = e.g("range-selector-buttons").add(), c.zoomText = e.text(k.rangeSelectorZoom, p(l.x, r), p(l.y, d.plotTop - 35) + 15).css(i.labelStyle).add(t),
                    s = p(l.x, r) + c.zoomText.getBBox().width + 5, u = p(l.y, d.plotTop - 35), n(c.buttonOptions, function (a, b) {
                    j[b] = e.button(a.text, s, u, function () {
                        c.clickButton(b);
                        c.isActive = !0
                    }, m, q && q.hover, q && q.select, q && q.disabled).css({textAlign: "center"}).add(t);
                    s += j[b].width + p(i.buttonSpacing, 5);
                    c.selected === b && j[b].setState(2)
                }), c.updateButtonStates(), o !== !1)) c.div = g = $("div", null, {
                position: "relative",
                height: 0,
                zIndex: 1
            }), f.parentNode.insertBefore(g, f), c.inputGroup = g = e.g("input-group").add(), g.offset = 0, c.drawInput("min"), c.drawInput("max");
            o !== !1 && (f = d.plotTop - 45, g.align(w({
                y: f,
                width: g.offset,
                x: h && f < (h.y || 0) + h.height - d.spacing[0] ? -40 : 0
            }, i.inputPosition), !0, d.spacingBox), v(o) || (d = t.getBBox(), g[g.translateX < d.x + d.width + 10 ? "hide" : "show"]()), c.setInputValue("min", a), c.setInputValue("max", b));
            c.rendered = !0
        },
        destroy: function () {
            var a = this.minInput, b = this.maxInput, c = this.chart, d = this.blurInputs, e;
            T(c.container, "mousedown", d);
            T(c, "resize", d);
            Na(this.buttons);
            if (a) a.onfocus = a.onblur = a.onchange = null;
            if (b) b.onfocus = b.onblur = b.onchange = null;
            for (e in this) this[e] &&
            e !== "chart" && (this[e].destroy ? this[e].destroy() : this[e].nodeType && Ta(this[e])), this[e] = null
        }
    };
    J.prototype.toFixedRange = function (a, b, c, d) {
        var e = this.chart && this.chart.fixedRange, a = p(c, this.translate(a, !0)), b = p(d, this.translate(b, !0)),
            c = e && (b - a) / e;
        c > 0.7 && c < 1.3 && (d ? a = b - e : b = a + e);
        return {min: a, max: b}
    };
    R(Pa.prototype, "init", function (a, b, c) {
        D(this, "init", function () {
            if (this.options.rangeSelector.enabled) this.rangeSelector = new Hb(this)
        });
        a.call(this, b, c)
    });
    A.RangeSelector = Hb;
    Pa.prototype.callbacks.push(function (a) {
        function b() {
            f =
                a.xAxis[0].getExtremes();
            g.render(f.min, f.max)
        }

        function c() {
            f = a.xAxis[0].getExtremes();
            isNaN(f.min) || h.render(f.min, f.max)
        }

        function d(a) {
            a.triggerOp !== "navigator-drag" && g.render(a.min, a.max)
        }

        function e(a) {
            h.render(a.min, a.max)
        }

        var f, g = a.scroller, h = a.rangeSelector;
        g && (D(a.xAxis[0], "afterSetExtremes", d), R(a, "drawChartBox", function (a) {
            var c = this.isDirtyBox;
            a.call(this);
            c && b()
        }), b());
        h && (D(a.xAxis[0], "afterSetExtremes", e), D(a, "resize", c), c());
        D(a, "destroy", function () {
            g && T(a.xAxis[0], "afterSetExtremes",
                d);
            h && (T(a, "resize", c), T(a.xAxis[0], "afterSetExtremes", e))
        })
    });
    A.StockChart = function (a, b) {
        var c = a.series, d, e = p(a.navigator && a.navigator.enabled, !0) ? {startOnTick: !1, endOnTick: !1} : null,
            f = {marker: {enabled: !1, radius: 2}}, g = {shadow: !1, borderWidth: 0};
        a.xAxis = za(oa(a.xAxis || {}), function (a) {
            return z({
                minPadding: 0,
                maxPadding: 0,
                ordinal: !0,
                title: {text: null},
                labels: {overflow: "justify"},
                showLastLabel: !0
            }, a, {type: "datetime", categories: null}, e)
        });
        a.yAxis = za(oa(a.yAxis || {}), function (a) {
            d = p(a.opposite, !0);
            return z({
                labels: {y: -2},
                opposite: d, showLastLabel: !1, title: {text: null}
            }, a)
        });
        a.series = null;
        a = z({
            chart: {panning: !0, pinchType: "x"},
            navigator: {enabled: !0},
            scrollbar: {enabled: !0},
            rangeSelector: {enabled: !0},
            title: {text: null, style: {fontSize: "16px"}},
            tooltip: {shared: !0, crosshairs: !0},
            legend: {enabled: !1},
            plotOptions: {
                line: f,
                spline: f,
                area: f,
                areaspline: f,
                arearange: f,
                areasplinerange: f,
                column: g,
                columnrange: g,
                candlestick: g,
                ohlc: g
            }
        }, a, {_stock: !0, chart: {inverted: !1}});
        a.series = c;
        return new Pa(a, b)
    };
    R(Xa.prototype, "init", function (a, b, c) {
        var d =
            c.chart.pinchType || "";
        a.call(this, b, c);
        this.pinchX = this.pinchHor = d.indexOf("x") !== -1;
        this.pinchY = this.pinchVert = d.indexOf("y") !== -1;
        this.hasZoom = this.hasZoom || this.pinchHor || this.pinchVert
    });
    R(J.prototype, "autoLabelAlign", function (a) {
        var b = this.chart, c = this.options, b = b._labelPanes = b._labelPanes || {}, d = this.options.labels;
        if (this.chart.options._stock && this.coll === "yAxis" && (c = c.top + "," + c.height, !b[c] && d.enabled)) {
            if (d.x === 15) d.x = 0;
            if (d.align === void 0) d.align = "right";
            b[c] = 1;
            return "right"
        }
        return a.call(this,
            [].slice.call(arguments, 1))
    });
    R(J.prototype, "getPlotLinePath", function (a, b, c, d, e, f) {
        var g = this, h = this.isLinked && !this.series ? this.linkedParent.series : this.series, i = g.chart,
            j = i.renderer, k = g.left, m = g.top, l, o, q, r, s = [], w = [], t;
        if (g.coll === "colorAxis") return a.apply(this, [].slice.call(arguments, 1));
        w = g.isXAxis ? v(g.options.yAxis) ? [i.yAxis[g.options.yAxis]] : za(h, function (a) {
            return a.yAxis
        }) : v(g.options.xAxis) ? [i.xAxis[g.options.xAxis]] : za(h, function (a) {
            return a.xAxis
        });
        n(g.isXAxis ? i.yAxis : i.xAxis, function (a) {
            if (v(a.options.id) ?
                    a.options.id.indexOf("navigator") === -1 : 1) {
                var b = a.isXAxis ? "yAxis" : "xAxis", b = v(a.options[b]) ? i[b][a.options[b]] : i[b][0];
                g === b && w.push(a)
            }
        });
        t = w.length ? [] : [g.isXAxis ? i.yAxis[0] : i.xAxis[0]];
        n(w, function (a) {
            Oa(a, t) === -1 && t.push(a)
        });
        f = p(f, g.translate(b, null, null, d));
        isNaN(f) || (g.horiz ? n(t, function (a) {
            var b;
            o = a.pos;
            r = o + a.len;
            l = q = u(f + g.transB);
            if (l < k || l > k + g.width) e ? l = q = B(x(k, l), k + g.width) : b = !0;
            b || s.push("M", l, o, "L", q, r)
        }) : n(t, function (a) {
            var b;
            l = a.pos;
            q = l + a.len;
            o = r = u(m + g.height - f);
            if (o < m || o > m + g.height) e ?
                o = r = B(x(m, o), g.top + g.height) : b = !0;
            b || s.push("M", l, o, "L", q, r)
        }));
        return s.length > 0 ? j.crispPolyLine(s, c || 1) : null
    });
    J.prototype.getPlotBandPath = function (a, b) {
        var c = this.getPlotLinePath(b, null, null, !0), d = this.getPlotLinePath(a, null, null, !0), e = [], f;
        if (d && c && d.toString() !== c.toString()) for (f = 0; f < d.length; f += 6) e.push("M", d[f + 1], d[f + 2], "L", d[f + 4], d[f + 5], c[f + 4], c[f + 5], c[f + 1], c[f + 2]); else e = null;
        return e
    };
    ma.prototype.crispPolyLine = function (a, b) {
        var c;
        for (c = 0; c < a.length; c += 6) a[c + 1] === a[c + 4] && (a[c + 1] = a[c + 4] =
            u(a[c + 1]) - b % 2 / 2), a[c + 2] === a[c + 5] && (a[c + 2] = a[c + 5] = u(a[c + 2]) + b % 2 / 2);
        return a
    };
    if (Wa === A.VMLRenderer) ib.prototype.crispPolyLine = ma.prototype.crispPolyLine;
    R(J.prototype, "hideCrosshair", function (a, b) {
        a.call(this, b);
        v(this.crossLabelArray) && (v(b) ? this.crossLabelArray[b] && this.crossLabelArray[b].hide() : n(this.crossLabelArray, function (a) {
            a.hide()
        }))
    });
    R(J.prototype, "drawCrosshair", function (a, b, c) {
        var d, e;
        a.call(this, b, c);
        if (v(this.crosshair.label) && this.crosshair.label.enabled && v(c)) {
            var a = this.chart, f =
                    this.options.crosshair.label, g = this.isXAxis ? "x" : "y", b = this.horiz, h = this.opposite,
                i = this.left, j = this.top, k = this.crossLabel, m, l, n = f.format, q = "";
            if (!k) k = this.crossLabel = a.renderer.label().attr({
                align: f.align || (b ? "center" : h ? this.labelAlign === "right" ? "right" : "left" : this.labelAlign === "left" ? "left" : "center"),
                zIndex: 12,
                height: b ? 16 : s,
                fill: f.backgroundColor || this.series[0] && this.series[0].color || "gray",
                padding: p(f.padding, 2),
                stroke: f.borderColor || null,
                "stroke-width": f.borderWidth || 0
            }).css(w({
                color: "white",
                fontWeight: "normal", fontSize: "11px", textAlign: "center"
            }, f.style)).add();
            b ? (m = c.plotX + i, l = j + (h ? 0 : this.height)) : (m = h ? this.width + i : 0, l = c.plotY + j);
            if (l < j || l > j + this.height) this.hideCrosshair(); else {
                !n && !f.formatter && (this.isDatetimeAxis && (q = "%b %d, %Y"), n = "{value" + (q ? ":" + q : "") + "}");
                k.attr({
                    text: n ? Ma(n, {value: c[g]}) : f.formatter.call(this, c[g]),
                    x: m,
                    y: l,
                    visibility: "visible"
                });
                c = k.getBBox();
                if (b) {
                    if (this.options.tickPosition === "inside" && !h || this.options.tickPosition !== "inside" && h) l = k.y - c.height
                } else l = k.y -
                    c.height / 2;
                b ? (d = i - c.x, e = i + this.width - c.x) : (d = this.labelAlign === "left" ? i : 0, e = this.labelAlign === "right" ? i + this.width : a.chartWidth);
                k.translateX < d && (m += d - k.translateX);
                k.translateX + c.width >= e && (m -= k.translateX + c.width - e);
                k.attr({x: m, y: l, visibility: "visible"})
            }
        }
    });
    var oc = ca.init, pc = ca.processData, qc = Ba.prototype.tooltipFormatter;
    ca.init = function () {
        oc.apply(this, arguments);
        this.setCompare(this.options.compare)
    };
    ca.setCompare = function (a) {
        this.modifyValue = a === "value" || a === "percent" ? function (b, c) {
            var d = this.compareValue;
            if (b !== s && (b = a === "value" ? b - d : b = 100 * (b / d) - 100, c)) c.change = b;
            return b
        } : null;
        if (this.chart.hasRendered) this.isDirty = !0
    };
    ca.processData = function () {
        var a = 0, b, c, d;
        pc.apply(this, arguments);
        if (this.xAxis && this.processedYData) {
            b = this.processedXData;
            c = this.processedYData;
            for (d = c.length; a < d; a++) if (typeof c[a] === "number" && b[a] >= this.xAxis.min) {
                this.compareValue = c[a];
                break
            }
        }
    };
    R(ca, "getExtremes", function (a) {
        a.apply(this, [].slice.call(arguments, 1));
        if (this.modifyValue) this.dataMax = this.modifyValue(this.dataMax),
            this.dataMin = this.modifyValue(this.dataMin)
    });
    J.prototype.setCompare = function (a, b) {
        this.isXAxis || (n(this.series, function (b) {
            b.setCompare(a)
        }), p(b, !0) && this.chart.redraw())
    };
    Ba.prototype.tooltipFormatter = function (a) {
        a = a.replace("{point.change}", (this.change > 0 ? "+" : "") + A.numberFormat(this.change, p(this.series.tooltipOptions.changeDecimals, 2)));
        return qc.apply(this, [a])
    };
    R(O.prototype, "render", function (a) {
        if (this.chart.options._stock) !this.clipBox && this.animate ? (this.clipBox = z(this.chart.clipBox), this.clipBox.width =
            this.xAxis.len, this.clipBox.height = this.yAxis.len) : this.chart[this.sharedClipKey] && (ab(this.chart[this.sharedClipKey]), this.chart[this.sharedClipKey].attr({
            width: this.xAxis.len,
            height: this.yAxis.len
        }));
        a.call(this)
    });
    w(A, {
        Color: va,
        Point: Ba,
        Tick: Za,
        Renderer: Wa,
        SVGElement: Y,
        SVGRenderer: ma,
        arrayMin: Sa,
        arrayMax: Ea,
        charts: ba,
        dateFormat: ja,
        error: pa,
        format: Ma,
        pathAnim: Jb,
        getOptions: function () {
            return P
        },
        hasBidiBug: Zb,
        isTouchDevice: fb,
        setOptions: function (a) {
            P = z(!0, P, a);
            Ob();
            return P
        },
        addEvent: D,
        removeEvent: T,
        createElement: $,
        discardElement: Ta,
        css: M,
        each: n,
        map: za,
        merge: z,
        splat: oa,
        extendClass: ia,
        pInt: L,
        svg: da,
        canvas: la,
        vml: !da && !la,
        product: "Highstock",
        version: "2.1.6"
    })
})();


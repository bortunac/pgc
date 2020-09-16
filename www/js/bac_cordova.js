
/* global FormData, HTMLFormElement, Q, Node, Element, NodeList, self, NP, EP, body, Notification, LS, MEM */

(function () {
    Object.defineProperties(self, {
        $$: {
            value: function (hnd) {
                (document.readyState === "complete" || document.readyState === "loaded") ?
                        hnd.apply(this, arguments) :
                        document.addEventListener("DOMContentLoaded", hnd);
            }
        },
        Q: {
            value: function (s, con) {
                if (typeof con === 'string')
                    con = document.querySelector(con);
                return s.indexOf("#") < 0 ? (con || document).querySelectorAll(s) : (con || document).querySelector(s);
                // !!! BAC >>>    :scope >    _i.find(":scope > div") --- cautare de divuri direct childs in contextul _i
            }
        },
        browser: {
            value: (function () {
                var o = {EDGE: /edg/i, Opera: /opr/i, Chrome: /chrome/i, Firefox: /firefox/i, Safari: /safari/i};
                for (var v in o) {
                    if (o[v].test(navigator.userAgent)) {
                        return v;
                    }
                }
            })()
        },
        DOC: {
            value: document.documentElement
        },
        body: {
            get: function () {
                return document.body;
            }
        },
        SS: {value: sessionStorage},
        LS: {value: localStorage},
        NP: {value: Node.prototype},
        EP: {value: Element.prototype},
        NLP: {value: NodeList.prototype},
        PLATFORM: {
            value: (function () {
                var userAgent = window.navigator.userAgent,
                        platform = window.navigator.platform,
                        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
                        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
                        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
                        os = null;
                if (macosPlatforms.indexOf(platform) !== -1) {
                    os = 'Mac';
                }
                else if (iosPlatforms.indexOf(platform) !== -1) {
                    os = 'iOS';
                }
                else if (windowsPlatforms.indexOf(platform) !== -1) {
                    os = 'Windows';
                }
                else if (/Android/.test(userAgent)) {
                    os = 'Android';
                }
                else if (!os && /Linux/.test(platform)) {
                    os = 'Linux';
                }
                return os;
            })()
        }
    });

    window.__read__ = 'db\\read.val';
    window.__code__ = '__code__';


    // use Capiatalized  names like Function String ...
    gettype = function (x) {
        return {}.toString.call(x).match(/\s([a-zA-Z]+)/)[1];
    }; // !!!!!!!!!! do not modify

    dn = function (message, title) {
        setTimeout(() => navigator.notification.alert(message, nf, title = ''), 100);
    };

    nf = () => {
    };

    cl = function () {
        console.log(...arguments);
    };

    Chain = function () {
        var resolve, reject, p = new Promise((a, b) => {
            resolve = a;
            reject = b;
        });
        p.tail({resolve, reject});
        return p;
    };

    //OBJECT PROTOTYPE
    Object.defineProperties(Object.prototype, {
        tail: {
            value: function (o) {
                for (let p in o) {
                    this[p] = o[p];
                }
                return this;
            }
        }, pointer: {
            value: function (arr, val) {
                if (typeof arr === "string") {
                    arr = arr.split(".");
                }
                try {
                    return eval("this['" + arr.join("']['") + "']" + ((val !== undefined) ? ("=" + JSON.stringify(val)) : ""));
                } catch (e) {
                    if (val !== undefined) {
                        var o = this;
                        arr.map((p, idx) => {
                            if (o[p] === undefined) {
                                typeof p === 'number' ? o[p] = [] : o[p] = {};
                            }
                            o = o[p];
                        });
                        return this.pointer(arr, val);
                    }
                    else {
                        return undefined;
                    }
                }
            }
        },
        o2s: {
            value: function () {
                var rez = '', o = gettype(this) === 'String' ? this.parsed : this;
                for (var v in o) {
                    rez += v + ":" + o[v] + ";";
                }
                return rez;
            }
        }
    });

    _E = function (name, text) {
        var $;
        switch (true) {
            case (name === '' || !name):
                {
                    $ = document.createElement('div');
                }
                break; // create  div
            case (!name.indexOf('<')):
                {
                    $ = document.createElement('div');
                    $.innerHTML = name;
                    $ = $.firstElementChild;
                }
                break;
            default:
                var c = window.customElements.get(name);
                if (c) {
                    $ = new c();   // _E('f-btn')  -- customElement
                }
                else {
                    $ = document.createElement(name); // _E('button')  -- htmlElement
                }
                //$ = document.createElement(name); // create new name element containing text
        }
        if (text)
            $.innerHTML = text;
        return $;
    };

    _txt = function (x) {
        return document.createTextNode(x);
    };








    // NODE PROTOTYPE EXTENSION 	
    Object.defineProperties(NP, {
        html: {
            get: function () {
                return this.innerHTML;
            },
            set: function (s) {
                this.innerHTML = s;
            }
        },
        find: {
            value: function (str, f) {
                return f ? this.querySelector(str.esc_slash) : this.querySelectorAll(str.esc_slash);
                //return Q(str,this);
            }
        },
        setA: {
            value: function (a, v, clear) {
                if (typeof a !== 'string') {    // setA({a:1,b:2})
                    for (var i in a) {
                        this.setA(i, a[i]);
                    }
                }
                else { // setA("name","vals") 
                    if (0 && this.hasAttribute(a) && !clear) {
                        v = ((v || "") + "").split(" ");
                        var s = '';
                        for (var i in v) {
                            if (!this.hasA(a, v[i]))
                                s += v[i];
                        }
                        s && this.setAttribute(a, this.getAttribute(a) + ' ' + s);
                    }
                    else {
                        this.setAttribute(a, (v || ''));
                    }
                }
                return this;
            }
        },
        remA: {
            value: function (a, val) {
                val && this.getAttribute(a) !== null ? this.setAttribute(a, this.getAttribute(a).replace(new RegExp("\\s*" + val, 'gim'), '').trim()) : this.removeAttribute(a);
                return this;
            }
        },
        getA: {
            value: function (a) {
                if (a) {
                    return this.getAttribute(a);
                }
                else {
                    var o = {};
                    for (let a of this.attributes) {
                        o[a.name] = a.value;
                    }
                    return o;
                }
            }
        },
        togA: {
            value: function (a) {
                !!this.hasAttribute(a) ? this.remA(a) : this.setA(a);
                return this.hasA(a);
            }
        },
        tmpA: {
            value: function (name, time) {
                this.setAttribute(name, "");
                setTimeout((function () {
                    this.removeAttribute(name);
                    //this.fire("attribute_removed",{attribute:name});
                }).bind(this), time || 500);
                return this;
            }
        },
        hasA: {
            value: function (a, val) {
                return !!val ? (new RegExp('(\\s|^)' + (val + "").trim() + '(\\s|$)')).test(this.getAttribute(a)) : this.hasAttribute(a);
            }
        },
        copyA: {
            value: function (elm) {
                var $ = this;
                elm.attributes.toArray().map(function (atr) {
                    $.setAttribute(atr.name, atr.value);
                });
            }

        },
        hasC: {
            value: function (c) {
                return (new RegExp('(\\s|^)' + c + '(\\s|$)')).test(this.className);
            }
        },
        setC: {
            value: function (c) {
                if (!this.hasC(c))
                    this.className = this.className + " " + c;
                return this;
            }
        },
        remC: {
            value: function (c) {
                this.className = this.className.replace(new RegExp('(\\s|^)' + c + '(\\s|$)'), '');
                return this;
            }
        },
        togC: {
            value: function (c) {
                this.hasC(c) ? this.remC(c) : this.setC(c);
            }
        },
        css: {
            value: function (s) {
                if (typeof s === 'object') {
                    this.style.cssText += ';' + s.o2s();
                }
                else {
                    switch (s) {
                        case '#':
                            return;
                        case undefined:
                            return this.style.cssText;
                        case '':
                            this.style.cssText = null;
                            break;
                        default:
                            this.style.cssText += ';' + s;
                    }
                }
                return this;
            }
        },
        _: {
            value: function () {
                var A = arguments;
                if (A.length > 1)
                    for (var i = 0; i < A.length; i++)
                        this._(A[i]);
                else {
                    if (typeof A[0] === 'string') {
                        //this.innerHTML+=ar[0]; !!! GRESIT -- distruge event listener -- copie oarba a innerHTML 
                        var $;
                        $ = document.createElement('div');
                        $.innerHTML = A[0];
                        this._.apply(this, [...$.childNodes]);
                    }
                    else
                        this.appendChild(A[0]);
                }
                return this;
            }
        },
        _clr: {
            value: function () {
                this.html = '';
                this._(...arguments);
                return this;
            }
        },
        _ins: {
            value: function (elm, poz) {
                this.children[poz] ? this.insertBefore(elm, this.children[poz]) : this._(elm);
                return this;
            }
        },
        _poz: {
            value: function (poz) {
                var parent = this.parent;
                this.die();
                parent._ins(this, poz);
            }
        },
        _top: {
            value: function (node) {
                var $ = this, fc = $.firstChild, fn = function (x) {
                    typeof x === 'string' ? $.insertBefore(_E(x), fc) : $.insertBefore(x, fc);
                };
                if (fc) {
                    gettype(node) === "NodeList" ? node.map(fn) : fn(node);
                }
                else {
                    $._(node);
                }
                return this;
            }
        },
        _before: {
            value: function (elm) {
                elm.parentNode.insertBefore(this, elm);
                return this;
            }
        },
        _after: {
            value: function (elm) {
                try {
                    this._before(elm.nextSibling);
                } catch (err) {
                    elm.parentNode.appendChild(this);
                }
                return this;
            }
        },
        _up: {
            value: function () {
                this.prev && this._before(this.prev);
                return this;
            }
        },
        _down: {
            value: function () {
                this.next && this._after(this.next);
                return this;
            }
        },
        _swap: {
            value: function (elm) {
                var ph = elm.cloneNode();
                ph.oust(this);
                this.oust(elm);
                elm.oust(ph);
                ph = null;
                return [this, elm];
            }
        },
        die: {
            value: function (time) { // use  time in seconds like css ---  time >0 fade | time
                var $ = this;
                if (time > 0) {
                    $.fade(0, time, function () {
                        $.die(-1);
                    });
                    return;
                }
                else {
                    if (time < 0) { // fast --- hidden before delete
                        $.setA("hidden");
                        setTimeout(function () {
                            requestAnimationFrame(function () {
                                var parent = this.parentNode; // uneori nu are parent ??? ciudat
                                parent && parent.removeChild($);
                            });
                        }, 0);
                    }
                    else {
                        $.parent && $.parent.removeChild($);
                    }
                }
            }
        },
        oust: {
            value: function (elm) {
                elm.parentNode.replaceChild(this, elm);
            }
        }
    });

    // ELEMENT PROTOTYPE
    Object.defineProperties(EP, {

        next: {
            get: function () {
                return this.nextElementSibling;
            }, enumerable: true
        },
        prev: {
            get: function () {
                return this.previousElementSibling;
            }
        },
        logical_sibling: {
            value: function (arg) {
                var p = this.parent, gp = p.parent, path = [];
                while (gp && gp !== document) {
                    if (gp.find("[logical_row]").has(p)) {
                        break;
                    }
                    else {
                        path.push(p.tagName);
                        p = gp;
                        gp = p.parent;
                    }
                }
                if (p === document) {
                    return false;
                }
                var A = "TMP_" + Date.now();
                p.setAttribute(A, true);
                var ls = p.parent.find("[" + A + "] > " + path.reverse().join(" > ") + " > [name]");
                p.removeAttribute(A);
                if (+arg) {
                    for (var e = 0; e < ls.length; e++) {
                        if (ls[e].name === this.name) {
                            return ls[e + arg];
                        }
                    }
                }
                else {
                    for (var e = 0; e < ls.length; e++) {
                        if (ls[e].name === arg) {
                            return ls[e];
                        }
                    }
                }
            }
        },
        parent: {
            get: function () {
                return this.parentNode;
            }
        },
        first: {
            get: function () {
                return this.firstElementChild;
            }
        },
        last: {
            get: function () {
                return this.lastElementChild;
            }
        },
        group: {
            value: function (str, context) {
                var t = "to_select_siblings___";
                var parent = context ? context : this.parentNode;
                if (!parent)
                    return null;
                parent.setAttribute(t, '');
                var rez = document.querySelectorAll("[" + t + "] " + (context ? '' : ">") + this.nodeName + (str || "")).toArray();
                parent.removeAttribute(t);
                return rez;   // !!!!!!!!!!!!!!! ATENTIE returneaza Array (nu NodeList)
            }
        },
        siblings: {
            value: function (str, context) {
                var rez = this.group(str, context);
                rez.splice(rez.indexOf(this), 1);
                return rez;   // !!!!!!!!!!!!!!! ATENTIE returneaza Array (nu NodeList)
            }
        },
        nth: {
            value: function (str, context) {
                return this.group(str, context).indexOf(this);
            }
        },
        dom_index: {
            get: function () {
                return this.parentNode ? Array.prototype.indexOf.call(this.parentNode.children, this) : null;
            }
        },

        __closest: {// opozite of find --- exista un nativ dar care da in bot la x-form unde folosesc __closest
            value: function (str) {
                var p = this.parent, gp = p.parent;
                while (gp && gp !== document) {
                    if (gp.find(str).has(p)) {
                        return p;
                    }
                    else {
                        p = gp;
                        gp = p.parent;
                    }
                }
                return false;
            }
        },
        desc: {
            value: function (elm) {
                var x = this;
                return isDescendant(x, elm);
            }
        },
        ascend: {
            value: function (elm) {
                return elm.desc(this);
            }
        },
        overflow: {
            get: function () {
                var $ = this, cw = $.clientWidth, sw = $.scrollWidth, ch = $.clientHeight, sh = $.scrollHeight;
                return {w: cw < sw, h: ch < sh, dx: sw - cw, dy: sh - ch, clientWidth: cw, scrollWidth: sw, clientHeight: ch, scrollHeight: sh};
            }
        },
        tagString: {
            get: function () {
                return this.outerHTML.match(/<.*?>/)[0].replace(/^</, "&lt;");
            }
        },
        lock: {
            value: function () {
                this.find("textarea,select").map(function (elm) {
                    var repl = _E('lock', elm.value);
                    repl.oust(elm);
                });
                this.find("[del]").die();
                this.setAttribute("locked", 1);
            }
        },
        frozen: {
            set: function (on_off) {
                this.style.pointerEvents = on_off ? "none" : "inherit";
                on_off ? this.setA("frozen") : this.remA("frozen");
            }
        },
        kids: {
            get: function () {
                return [...this.children];
            }
        },
        _cache_: {
            value: null,
            writable: true,
            configurable: true
        },
        cache: {// ideea e sa masor doar o data si sa notez dupa ultima stare  --- avoid reflow and repaint  for repeated animations 
            get: function () {
                var $ = this;
                if (!$._cache_) {
                    $._cache_ = new Proxy({}, {
                        get: function (o, p) {
                            if (!o.hasOwnProperty(p)) { // !!!BAC  1level object  vs Pointer
                                o[p] = $[p];
                            }
                            return o[p];
                        },
                        set: function (o, p, v) {
                            o[p] = v;
                            $[p] = v;
                        }
                    });
                }
                return $._cache_;
            }
        },
        cr: {
            get: function () { // !!!!!!!!!!! NASOL CU PAGE REFLOW 
                return this.getBoundingClientRect();
            },
            enumerable: true
        },
        x: {// !!!????  CONFLICT CU SVG 
            get: function () {
                return this.cr.left + (document.scrollingElement.scrollLeft || 0);//getX(this);
            },
            set: function (x) {
                this.style.left = x + "px";
            },
            enumerable: true
        },
        y: {
            get: function () {
                //return getY(this);
                return this.cr.top + (document.scrollingElement.scrollTop || 0);// buba la chrome 6.1
            },
            set: function (y) {
                this.style.top = y + "px";
            },
            enumerable: true
        },
        z: {
            get: function () {
                return this.computed('z-index');
            },
            set: function (val) {
                this.style.zIndex = val;
            },
            enumerable: true
        },
        w: {
            get: function () {
                return this.cr.width;
            },
            set: function (val) {
                this.style.width = val + "px";
            },
            enumerable: true
        },
        h: {
            get: function () {
                return this.cr.height;
            },
            set: function (val) {
                this.style.height = val + "px";
            },
            enumerable: true
        },
        matrix: {
            get: function () {
                var M = this.computed().transform.split(/\s*[(),]\s*/).slice(1, -1); // matrix(0,1,....  string
                if (!M.length)
                    M = [1, 0, 0, 1, 0, 0];
                if (M.length === 6) {
                    M = [M[0], M[1], 0, 0, M[2], M[3], 0, 0, 0, 0, 1, 0, M[4], M[5], 0, 1];
                }
                return M.map(i => +i);
            },
            set: function (M) {
                //requestAnimationFrame(() => this.style.transform = "matrix3d(" + M.join(",") + ")");
                this.style.transform = "matrix3d(" + M.join(",") + ")";
            }
        },
        mtx: {
            get: function () {
                return new Proxy(this, {
                    get(o, p) {  // read any position in the elementmatrix 
                        switch (true) {
                            case Number.isInteger(p):
                                return o.matrix[p];
                                break;
                            case p === "reset":
                                return function () {
                                    o.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                                    //o.style.transform="";
                                    delete o.active_trans; // e nevoie in  BAC_MORF 
                                    return o;
                                };
                                break;
                        }

                    },
                    set(o, p, v) { // modify any position in matrix 
                        var n = parseInt(p);
                        if (Number.isInteger(n) && (0 <= n <= 15)) {
                            var A = o.matrix;
                            A[p] = v;
                            o.matrix = A;
                        }
                        else {
                            switch (p) {
                                case "txy":
                                    var A = o.matrix;
                                    A[12] = v[0];
                                    A[13] = v[1];
                                    o.matrix = A;
                                    break;
                                case "scale":
                                    var A = o.matrix;
                                    A[0] = A[5] = v;
                                    o.matrix = A;
                                    break;
                                default:
                                    var tp = {r0c0: 0, r0c1: 1, r0c2: 2, r0c3: 3, r1c0: 4, r1c1: 5, r1c2: 6, r1c3: 7, r2c0: 8, r2c1: 9, r2c2: 10, r2c3: 11, r3c0: 12, r3c1: 13, r3c2: 14, r3c3: 15}[p];
                                    if (tp >= 0) {
                                        o.mtx[tp] = v;
                                    }
                                    break;
                            }
                        }

                    }
                });
            },
            set: function (M) { // 3d only
                this.matrix = M;
            }
        },
        txy: {
            get: function () {
                var M = this.matrix;
                return [M[12], M[13]];
            },
            set: function (arr) {
                var M = this.matrix;
                M[12] = parseFloat(arr[0]);
                M[13] = parseFloat(arr[1]);
                this.matrix = M;
            }
        },
        __txy: {
            get: function () {
                var M = this.cache.matrix;
                return [M[12], M[13]];
            },
            set: function (arr) {
                var M = this.cache.matrix;
                M[12] = parseFloat(arr[0]);
                M[13] = parseFloat(arr[1]);
                this.cache.matrix = M;
            }
        },
        __scale2d: {//  cache 2D scaling
            get: function () {
                return this.cache.matrix[0];
            },
            set: function (s) {
                var M = this.cache.matrix;
                M[0] = M[5] = parseFloat(s);
                this.cache.matrix = M;
            }
        },
        __matrix: {
            get: function () {
                return this.cache.matrix;
            },
            set: function (M) {
                this.cache.matrix = M;
            }
        },
        tx: {
            get: function () {
                return parseFloat(this.matrix[12]);
            },
            set: function (x) {
                var M = this.matrix;
                M[12] = parseFloat(x);
                this.matrix = M;
            }
        },
        ty: {
            get: function () {
                return parseFloat(this.matrix[13]);
            },
            set: function (y) {
                var M = this.matrix;
                M[13] = parseFloat(y);
                this.matrix = M;
            }
        },
        oxy: {
            get: function () {
                return (this.computed().transformOrigin || "").match(/[\.-\d]+/gim);
            },
            set: function (arr) {
                this.style.transformOrigin = `${arr[0]}px ${arr[1]}px`;
            }
        },
        ox: {
            get: function () {
                return this.oxy[0];
            },
            set: function (x) {
                this.oxy = [x, this.oxy[1]];
            }
        },
        oy: {
            get: function () {
                return this.oxy[1];
            },
            set: function (y) {
                this.oxy = [this.oxy[0], y];
            }
        },
        geometry: {
            get: function () {// 2 dimension 
                var $ = this,
                        cr = $.cr, // client rects
                        comp = $.computed(), // getComputedStyle($)
                        MTX, // matrix(0,1,....  string
                        trfo = (comp.transformOrigin || "").match(/[\.-\d]+/gim), // transform origin
                        scale,
                        M = comp.transform.split(/\s*[(),]\s*/).slice(1, -1); // matrix(0,1,....  string
                if (!M.length)
                    M = [1, 0, 0, 1, 0, 0];
                if (M.length === 6) {
                    M = [M[0], M[1], 0, 0, M[2], M[3], 0, 0, 0, 0, 1, 0, M[4], M[5], 0, 1];
                }
                MTX = M.map(i => +i);
                trfo = trfo ? trfo.map(i => +i) : [0, 0];
                scale = Math.sqrt(MTX[0] * MTX[0] + MTX[1] * MTX[1]);
                return {
                    matrix: MTX,
                    //"computed.transform": comp.transform,
                    //"style.transform": $.style.transform,
                    scale: scale,
                    rotateY: -Math.rad2deg(Math.asin(-M[8])), //flip
                    rotateX: -Math.rad2deg(Math.atan(M[9] / M[10])), // roll
                    rotateZ: -Math.rad2deg(Math.atan(M[4] / M[0])), //spin
                    tx: MTX[12],
                    ty: MTX[13],
                    tz: MTX[14],
                    x: cr.x,
                    y: cr.y,
                    w: cr.width,
                    h: cr.height,
                    top: cr.top + (document.scrollingElement.scrollTop || 0), // ???BAC offsetParent
                    left: cr.left + (document.scrollingElement.scrollLeft || 0),
                    bottom: cr.bottom,
                    right: cr.right,
                    ox: trfo[0],
                    oy: trfo[1]
                };
            }
        },
        reflect: {
            // MUTATION OBSERVER
            // var config = { attributes: true, childList: true, characterData: true };
            value: function (config, reaction) {
                this.reflect_off();
                var o = new MutationObserver(reaction);
                this.observer = o;
                o.target = this;
                if (!Object.keys(config).length)
                    config = {attributes: true, childList: true, characterData: true};
                o.observe(this, config);
                return this;
            }
        },
        reflect_off: {
            value: function () {
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
            }
        },
        xpath: {
            get: function () {
                var $ = this;
                if (typeof $ === "string")
                    return document.evaluate($, document, null, 0, null);
                if (!$ || $.nodeType !== 1)
                    return '';
                if ($.id)
                    return "//*[@id='" + $.id + "']";
                var sames = [].filter.call($.parentNode.children, function (x) {
                    return x.tagName === $.tagName;
                });
                return $.parentNode.xpath + '/' + $.tagName.toLowerCase() + (sames.length > 1 ? '[' + ([].indexOf.call(sames, $) + 1) + ']' : '');
            }
        },
        get_by_xpath: {
            //https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
            value: function (path) {
                return document.evaluate(path, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }
        },
        computed: {
            value: function () { // ??? BUBA
                return arguments[0] !== undefined ? getComputedStyle(this)[arguments[0]] : getComputedStyle(this);
            }
        }
    });




    // STRING PROTOTYPE
    Object.defineProperties(String.prototype, {
        rgx: {
            get: function () {
                return new RegExp(this, 'gim');
            }
        },
        has: {
            value: function (s) {
                return this.indexOf(s) >= 0;
            },
            writable: true
        },
        capitalize: {
            value: function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            },
            //enumerable: true
        },
        smallize: {
            value: function () {
                return this.charAt(0).toLowerCase() + this.slice(1);
            }
        },
        esc_slash: {//  ?? gresit
            get: function () {
                return this.replace(/\//gim, "\\/");
            }
        },
        esc4html: {
            get: function () {
                return _E('', this).html;
            }
        },
        dom: {
            value: function () {
                var parser = new DOMParser();
                return parser.parseFromString(this, "text/xml");
            }
        },
        limit: {
            value: function (x) {
                return this.length > x ? this.substring(0, x) : this;
            }
        },
        htmlentities: {
            get: function () {
                return this.replace(/<!--/gim, "&lt;!--").replace(/<([^>]*?)>/gim, "&lt;$1>");
            }
        },
        s2o: {
            get: function () {
                var o = {};
                var p = this.split(";");
                for (var v in p) {
                    if (!p[v])
                        continue;
                    var tmp = /([^:]*):(.*$)/gim.exec(p[v]);

                    if (tmp) {
                        o[tmp[1].trim()] = tmp[2].trim();
                    }
                }
                return o;
            }
        },
        parsed: {
            get: function () {
                return JSON.parse(this);
            }
        },
        basename: {
            get: function () {
                return this.match(/[^\/]*$/)[0];
            }
        },
        trim_by: {
            value: function (str) {
                var rgx = new RegExp("^(?:" + str + ")+|(?:" + str + ")+$");
                return this.trim().replace(rgx, "");
            }
        },
        dirname: {
            get: function () {
                let a = this.split("/");
                a.pop();
                return a.join("/");
            }
        }
    });
    String.concat = function () {
        return [...arguments].join('');
    };

    // Date PROTOTYPE
    Object.defineProperties(Date.prototype, {
        date: {
            get: function () {
                var yyyy = this.getFullYear().toString();
                var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
                var dd = this.getDate().toString();
                return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
            }
        },
        days_to: {
            value: function (date) {
                var days = (date - this) / (1000 * 60 * 60 * 24);
                return parseInt(days);
            }
        },
        time: {
            get: function () {
                return this.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
            }
        },
        datetime: {
            get: function () {
                return this.date + " " + this.time;
            }
        },
        monthLength: {
            get: function () {
                return new Date(this.getFullYear(), (this.getMonth() + 1), 0).getDate();
            }
        },
        monthName: {
            get: function () {
                return this.monthNames[this.getMonth()];
            }
        },
        dayName: {
            get: function () {
                return this.dayNames[this.getDay()];
            }
        },
        yy: {
            get: function () {
                return this.getFullYear();
            }
        },
        mm: {
            get: function () {
                return this.getMonth();
            }
        },
        dd: {
            get: function () {
                return this.getDate();
            }
        },
        jump: {
            value: function (n) {
                this.setDate(this.getDate() + n);
                return this;
            }
        },
        offset: {/// ???? NU MERGE
            value: function (n) {
                var v = new Date();
                v.setDate(this.getDate() + n);
                return v;
            }
        }
    });

    Date.fix = function (str) {
        var d = new Date(str);
        return d.date;
    };

    Date.min = function (a, b) {
        if (!a || !b) {
            return "1970";
        }
        return a < b ? a : b;
    };
    Date.max = function (a, b) {
        if (!a || !b) {
            return "1970";
        }
        return a > b ? a : b;
    };
    Date.days_between = function (a, b) {
        return Math.abs((new Date(a)).days_to((new Date(b))));
    };

    Date.monthsDiff = function (dS, dE) {
        var months;
        months = (dE.getFullYear() - dS.getFullYear()) * 12;
        months -= dS.getMonth();
        months += dE.getMonth();
        return months <= 0 ? 0 : months;
    };

    Date.prototype.monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];


    //EVENTS
    {
        window.on = window.AEL = window.addEventListener;
        window.off = window.REL = window.removeEventListener;
        NP.AEL = Element.prototype.addEventListener; // NP adauga AEL si pt document --- EP nu se uita decit la elemente
        NP.REL = Element.prototype.removeEventListener;
        Q.forced_event_hnd = {

        };
        Q.custom_events = {
            tik: ["click"],
            swipe: ["swipeleft", "swiperight", "swipeup", "swipedown"],
            data_change: ["change_written", "undo", "redo", "modified"]
        };
        function on_off_event(type, hnd, capt, elm, adrm) { // accepta array of events sau string of events separate cu blank sau virgula
            if (gettype(type) === 'Object') { // se poate si elm.on({click:click_hnd,keyup:click_hnd"})
                for (var t in type) {
                    on_off_event(t, type[t], capt, elm, adrm);
                }
                return;
            }
            (typeof type === "string" ? type.match(/[^\s,]+/gim) : type).forEach(// fortez transformarea "type1 type2,type3" despartite de virgula sau spatiu in array
                    function (type) {
                        type = Q.custom_events[type] || type;
                        typeof type !== "string" ? on_off_event(type, hnd, capt, elm, adrm) :
                                Q.forced_event_hnd[type] ? Q.forced_event_hnd[type](elm, adrm, hnd, capt) : elm[adrm](type, hnd, capt);
                    }
            );
        }

        NP.on = function (type, hnd, capt) {
            on_off_event(type, hnd, capt, this, "AEL");
            return this;
        };
        NP.off = function (type, hnd, capt) {
            on_off_event(type, hnd, capt, this, "REL");
            return this;
        };
        EP.once = function (type, hnd, flag_14all) {// if no flag 
            var $ = this;
            if (!flag_14all) {
                (typeof type === "string" ? [type] : type).forEach(
                        function (type) {
                            function f(e) {
                                hnd.bind($)(e);
                                $.off(type, f);
                            }
                            $.on(type, f);
                        }
                );
            }
            else {
                function f(e) {
                    hnd(e);
                    $.off(type, f);
                }
                $.on(type, f);
            }
            return $;
        };
        window['fire'] = NP.fire = function (type, data, interface) {
            data = data || {};
            var type = {pik: "click", enter: "mouseover", leave: "mouseout"}[type] || type;
            var evObj = new window[interface || "CustomEvent"](type, {bubbles: data.bubbles === false ? false : true});
            evObj.tail(data);
            this.dispatchEvent(evObj);
            return this;
        };
    }

    // AJAX
    {
        Object.defineProperty(XMLHttpRequest.prototype, "header", {
            value: function (str, parsed) {
                return !!parsed ? JSON.parse(this.getResponseHeader(str)) : this.getResponseHeader(str);
            }
        });

        var Loader = {
            element: _E().setC("circular_loader"),
            show: function () {
                !this.init && body._(this.element);
                this.element.hidden = false;
            },
            hide: function () {
                this.element.hidden = true;
            },
            init: false
        };

        Q.ajax = function (o = {}) {
            var cb = o.cb || nf, req = new XMLHttpRequest();
            cb = cb.bind(req);
            o.method = o.method || "POST";

            req.onloadstart = () => Loader.show(); // show loader

            req.onprogress = function (e) { };

            req.onabort = function (ev) {
                Loader.hide();
                (o.abort || nf)();
                console.log("request aborted");
            };

            req.onreadystatechange = function (ev) { // handle response
                if (req.readyState === 4) {
                    Loader.hide();
                    if (req.status === 200) { // DONE
                        o.type === 'xml' ? cb(req.responseXML, req) : cb(req.response, req);
                    }
                    else {
                        var msg = "<div style='margin:0 0 .5em 0'>SRC:<e style='color:#bdf;'>\"" + o.src.split('?')[0] + "\"</e></div><sad></sad> " + req.statusText + "!";
                        if (o.fail) {
                            setTimeout(() => o.fail(msg, req), 100);
                            ;
                        }
                        else {
                            setTimeout(() => dn(msg, "ERROR [" + req.status + "]"), 100);
                            //Q.i(req.getAllResponseHeaders())
                        }
                    }
                    req.abort();
                }
            };

            // eroror
            req.onerror = function (evt) {
                Loader.hide();
                dn("Connection Problems!<br/>" + evt, "NETWORK");
            };


            // handling timeout
            req.timeout = o.timeout || 30000;
            req.ontimeout = function () {
                dn("connection is weak", "NETWORK");
                Loader.hide();
            };

            // prepare data
            var D, d = o.data;
            if (o.method === "POST") {
                switch (gettype(d)) {
                    case 'Object':
                        D = new FormData();
                        for (var v in d) {
                            !(d[v] || {}).tagName && D.append(v, typeof d[v] === 'string' ? d[v] : JSON.stringify(d[v]));
                        }
                        break;
                    case 'HTMLFormElement':
                        D = new FormData(d);
                        break;
                    default:
                        D = d; // considera ca aprimit obiect special de tip FormData 
                }
            }
            else {
                o.src += /\?/.test(o.src) ? "&" : "?";
                for (let [k, v] of Object.entries(d || {})) {
                    o.src += ("&" + k + "=" + v);
                }
            }

            // open connection to server
            req.open(o.method, o.src);

            //lounch request
            req.send(D || null);
            return req;
        };

        ask = function (keyword, POST, done, fail, opt = {}) {
            /*
             * ask("db\\read.val",{tb_name:'user_safe',type:2},true).then(Q.ip);
             * ask("db\\read.val",{tb_name:'user_safe',type:2},Q.ip,null,{a:1,b:2});
             */
            var C = new Chain();
            var cb = function () {
                // warning
                var warn = this.getResponseHeader('warning');
                warn && dn(warn, "WARNING");
                // error 
                var error = this.getResponseHeader('error');
                if (error) {
                    (fail || dn)(error.trim(), "ERROR");
                    return; // intrerupt normal flow but execute
                }
                // error by number
                var err_nr = this.header("error_code");
                if (err_nr) {
                    (Q.error_hnd[err_nr] || nf)();
                }
                // comands
                var code;
                try {
                    code = eval("(" + this.getResponseHeader('code') + ")");
                } catch (err) {
                    code = eval(this.getResponseHeader('code'));
                }
                typeof done === 'function' && done(this.response, code, this);//  this este XMLHTTPRequest
                C.resolve(this.response);
            };

            
            var req = Q.ajax({
                src:  "/aha/io.php?keyword=" + keyword, // pt mai multe $_GET folosesc & ... ex ask("test_code&c=2&caca=pipi",'_::lo($_REQUEST);')
                data: POST,
                method: "POST",
                cb: cb,
                ...opt
            });
            return C;
        };
    }
    
    //EX      ask.only(!data_required)(keyword,POST,r=>{data_required=r.parsed;}).then     
    ask.only = function (cond, ...args) {
        return function (keyword, POST, cb = r => r) { // r=>r is pong function
            var bool = cond instanceof Function ? cond(...args) : cond;
            if (!bool) {
                CH = new Chain;
                CH.resolve(0);
                return CH;
            }
            else {
                return ask(keyword, POST, 'chain').then(cb);
            }
        };
    };
    // FormData.prototype EXTENSION
    Object.defineProperties(FormData.prototype, {
        load: {
            value: function (d) {
                switch (true) {
                    case d instanceof HTMLFormElement: // form
                        d.find("[name]").forEach(i => {
                            this.delete(i.name);
                            this.append(i.name, i.value);
                        });
                        break;
                    case d.__proto__ && d.__proto__.hasOwnProperty("value"): // input, textarea ,x-check etc
                        this.delete(d.name);
                        this.append(d.name, d.value);
                        break;
                    default: // raw object
                        for (var v in d) {
                            this.delete(v);
                            // previn trimitere de tag
                            !(d[v] || {}).tagName && this.append(v, typeof d[v] === 'string' ? d[v] : JSON.stringify(d[v]));
                        }
                        break;
                }
            },
            enumerable: true
        },
        clear: {
            value: function () {
                var k = [];
                for (var key of this.keys()) {
                    // here you can add filtering conditions
                    k.push(key);
                }
                k.map(key => this.delete(key));
            },
            enumerable: true
        },
        rename: {
            value: function (entrie, to) {
                if (this.getAll(entrie).length > 1) {
                    throw Error("FormData can't rename multiple values! ");
                }
                let orig = this.get(entrie);
                gettype(orig) === "File" ? this.append(to, orig, to) : this.append(to, orig);
                this.delete(entrie);
            },
            enumerable: true
        },
        list: {
            get: function () {
                let o = {};
                for (let [k, v] of this.entries()) {
                    var found = this.getAll(k);
                    o[k] = found.length > 1 ? found : this.get(k);
                }
                return o;
            },
            enumerable: true
        }
    });


    // drag && zoom --- de rescris pt touch

    (function () {
        var DO = {};
        var initDO = function (e, OPT = {}) {
            if (e.which !== 1)
                return;  // drag numai pt left-click;
            if (OPT.before) { // in functia before am this obiectul de configurare OPT in care de ex pot schimba conditionat targetul sau comportamentul dragului
                if (OPT.before(e))
                    return; // conditionally stop
            }

            var $ = e.currentTarget, hot = e.target;
            if (hot.tagName === 'INPUT') { // prevent #INPUT to drag parent instead of focusing 
                hot.focus();
                hot.hasA("type", "checkbox") && IS_TOUCH && hot.click();
                return;
            }
            $.fire("dragstart");
            t0 = t1 = performance.now();
            // drag element poate fi self ,parent , taget_element, sau o clona gost -- pt svg elements 
            DO.dragElm = OPT.target || $;
            //DO.zIndex = DO.dragElm.computed("zIndex");
            DO.tx = 0;
            DO.ty = 0;
            DO.trf_base = DO.dragElm.style.transform.replace(/translate\(.*?\)/, function (x) {
                var T = x.match(/[-\d\.]+/gim);
                DO.tx = +T[0];
                DO.ty = +T[1];
                return '';
            });

            DO.mX = e.clientX;
            DO.mY = e.clientY;
            // !!! adimit  ca am numai scale(N) adica 2D si scaleX===scaleY
            DO.inhertited_scale = calculate_inherited_scale(DO.dragElm);



            window.addEventListener('touchemove', moveDO, false);

            //e.preventDefault(); // omoara blur pt inputuri
            e.stopPropagation();// !!!! allow drag an element hosted by a draggable parent;

        };

        var t0, t1, dx, dy, x0, x, y0, y;
        var moveDO = function (e) {
            e.preventDefault(); // evit selectie de text peste care trece 
            dx = (e.clientX - DO.mX) / DO.inhertited_scale;
            dy = (e.clientY - DO.mY) / DO.inhertited_scale;
            t0 = t1;
            t1 = performance.now();
            x0 = x;
            y0 = y;
            x = DO.tx + dx;
            y = DO.ty + dy;

            if (DO.dragElm.cage) {
                if (DO.dragElm.cage.left !== undefined)
                    x = Math.max(x, DO.dragElm.cage.left);
                if (DO.dragElm.cage.right !== undefined)
                    x = Math.min(x, DO.dragElm.cage.right);
                if (DO.dragElm.cage.top !== undefined)
                    y = Math.max(y, DO.dragElm.cage.top);
                if (DO.dragElm.cage.bottom !== undefined)
                    y = Math.min(y, DO.dragElm.cage.bottom);
            }
            // keep path
            if (DO.dragElm.path) {
                if (Math.abs(dx) >= Math.abs(dy)) {
                    if (DO.dragElm.path.dir !== undefined)
                        y = DO.dragElm.path.dir(x);
                }
                else {
                    if (DO.dragElm.path.rev !== undefined)
                        x = DO.dragElm.path.rev(y);
                }
            }
            requestAnimationFrame(function () {
                let ELM = DO.dragElm;
                ELM.style.transform = "translate(" + x + "px," + y + "px) " + DO.trf_base; // put translation first !!!
                ELM.fire("drag", {drag: {dx: dx, dy: dy}});

            });

        };


        function disableDragWatch(e) {
            if (!DO.dragElm)
                return;
            try {
                DO.dragElm.oo.active = false;
            } catch (e) {
            }
            DO.dragElm.fire("dragend");
            //DO = {};
            document.onselectstart = null;
            window.removeEventListener('mousemove', moveDO, false);
            window.removeEventListener('touchemove', moveDO, false);
        }

        window.addEventListener('mouseup', disableDragWatch, true);

        function calculate_inherited_scale(elm) {
            var s = 1, p = elm.parent, cs;
            console.log(p);
            while (p !== document.body) {
                cs = getComputedStyle(p).transform;
                var A = /matrix\(([^,]*),/.exec(cs);
                if (A) {
                    s *= +A[1];
                }
                p = p.parent;
            }
            return s;
        }

        EP.drag = function (opt) {
            this.drag_hnd && this.undrag();
            this.drag_hnd = function (e) {
                initDO(e, opt);
            };
            this.on('mousedown', this.drag_hnd, false);
            //this.on('t2m');
            return this;
        };
        EP.undrag = function () {
            this.off('mousedown', this.drag_hnd, false);
            //this.off('t2m');
            return this;
        };

        EP.dragParent = function () {
            this.drag({target: this.parent});
            return this;
        };
        EP.undragParent = EP.undrag;
    })();


    //bind to a cage	
    function bindCage(elm, ref) {
        elm.cage = {};
        elm.cage.top = ref.y - elm.y;
        elm.cage.bottom = elm.cage.top + ref.offsetHeight - elm.offsetHeight;
        elm.cage.left = ref.x - elm.x;
        elm.cage.right = elm.cage.left + ref.offsetWidth - elm.offsetWidth;
    }






























    Object.defineProperties(Array.prototype, {
        find_obj: {
            value: function (o, get_idx) {
                var rez = [];//, idx = -1;
                for (var v in this) {
                    if (this[v]) {
                        var bool = true;
                        //  idx++;
                        for (var p in o) {
                            if (!this.hasOwnProperty(v) || this[v][p] != o[p]) {
                                bool = false;
                                break;
                            }
                        }
                        bool && rez.push(get_idx ? +v : this[v]);
                    }
                }
                return rez;
            }
        },
        having: {
            /**
             * !!!ATENTIE -- REFERINTA catre elementele din original ---  se poate rupe   asa  S = COLECTION.having(condition).raw_copy() dar nu {...COLECTION.having(condition)} sau [...COLECTION.having(condition)]
             * !!!ATENTIE --- accepta obiect de obiecte  {1:{},3:{}} -- ex hr.stc_by_id dar intoarce  ARRAY of objects
             * 
             * COLECTIE = 'array of complex objects with same structure '     COL = [{a:1,b:2},{a:2,b:1},{a:3,b:1},{a:4,b:5},{a:5,b:5},{a:1,c:{d:1,e:["alfa"]}},{c:{d:1,e:["alfa","beta"]}}]; 
             * 
             * ex -- using  reference objects
             * COL.having({b:5,a:4},{a:[2,3]}) -> selecteaza seturile care au (b=5 si a=4) sau a = 2 sau a=3
             * 
             * ex2 ---  using logical expresion
             * COL.having("${b} > 1 && ${a} > 4 ") --> [{a:5,b:5}]  ATENTIE nu se foloseste  = ca e asignare ci == sau ===
             * 
             * ex3 ---  using regular expression
             * COL.having("/^55/.test('${b}')") --> seturi in care b incepe cu 55   AM ales stilul PHP pt desemnarea variabilelor  --- ATENTIE la SINGLE-QUOT 
             * COL.having("${c} == 3 || ${a}===1 && ${b}===2")
             * 
             * 
             * ex4 --- DEEP SEARCH POINTER
             * COL.having("$@.c.e[1] !== undefined || $@.a > 2")  
             * @returns {array}
             */
            value: function () {
                var selected = [];
                for (var i in arguments) {
                    var o = arguments[i];
                    for (var v in this) {
                        try {
                            var bool = true, set = this[v];
                            if (typeof o === 'string') {
                                if (/\$@/.test(o)) {
                                    // Function -- DEEP SEARCH
                                    var str = o.replace(/(\$@)([^\s=<>!\)]*)/gim, function (p, i, j) {
                                        var a = j.match(/[^\.\[\]]+/gim);
                                        return " _x_" + (a.length ? ".pointer(" + JSON.stringify(a) + ")" : "");//
                                    });
                                    bool = (new Function("_x_", "return " + str))(set);
                                    console.log("----", str);
                                }
                                else {
                                    // eval cu rgx
                                    var str = o.replace(/\$\{(.*?)\}/gim, function (p, i) {
                                        return set[i];
                                    });
                                    bool = eval(str);
                                }
                            }
                            else {
                                for (var p in o) {
                                    if ((typeof o[p] !== 'object' ? this[v][p] != o[p] : !o[p].has(this[v][p]))) { // p:1 <-> p:[1,2]  !!!BAC>>> type_agnostic == not  ===
                                        bool = false;
                                        break;
                                    }
                                }
                            }
                            if (bool) {
                                selected.push(this[v]);
                            }
                        } catch (e) {
                            console.log("INPUT:", o, "\nCOND:", str, "\n", e);
                        }
                    }
                }
                return selected;
            }
        }
    });


    window.MEM = {};
    Object.defineProperties(MEM, {
        get: {
            value: function (path) {
                path = typeof path === 'string' ? path.split(".") : path;
                if (!LS[path[0]])
                    return undefined;
                var o = LS[path[0]].parsed;
                path.shift();
                for (var i = 0; i < path.length; i++) {
                    o = o[path[i]];
                    if (!o)
                        return undefined;
                }
                return o;
            }
        },
        set: {
            value: function (path, value) {// session.write(_name_, o);
                if (path === undefined) {
                    throw new Error("\"session.set\" ----  missing path argument ---");
                    return;
                }
                path = typeof path === 'string' ? path.split(".") : path;
                var _ssb_ = path.shift();
                if (path.length) {
                    var o = (LS[_ssb_] || '{}').parsed; // daca e scalar trebuie suprascris cu obiect gol
                    var a = o;
                    path.forEach(function (p_segment, idx) {
                        if (a[p_segment] === undefined) {
                            a[p_segment] = +p_segment ? [] : {};
                        }
                        a = a[p_segment];
                    });
                    eval('o["' + path.join('"]["') + '"] = ' + JSON.stringify(value));
                    MEM.write(_ssb_, o);
                }
                else {
                    value !== undefined ? MEM.write(_ssb_, value) : LS.removeItem(_ssb_);
                }
            }
        },
        write: {
            value: function (name, o) {
                LS.setItem(name, JSON.stringify(o));
            }
        },
        read: {
            value: function (name) {
                return JSON.parse(LS.getItem(name));
            }
        },
        delete: {
            value: function (name) {
                LS.removeItem(name);
                delete LS[name];
            }
        }
    });


})();


Blinder = {
    init: function () {
        var $ = this;
        this.panel = _E('<div id="result_panel" _anm_ modal_panel  style="z-index:100;color:white;padding:1em;transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 2000,0, 1);"></div>');
        $.header = _E('div').setA({id: "modalHeader"}).css("padding:.5em;color:white")._(
                $.flag = _E().css("float:left;margin-right:2em;"),
                $.kill = _E("kill").css("float:right;font-size:2em;line-height: 1em;width: 1.3em;"),
                $.modal_title = _E().setA({id: "modalTitle"})
                );
        $.content = _E('div').setA({id: "modalBody"}).css("padding:0");

        $.footer = _E('div').setA({id: "modalFooter"}).css("_float:right")._(
                $.apply_btn = _E('div', "APPLY").setA({btn: '', hidden: '', apply_btn: '', tabindex: "0"}).css("float:left;margin-right:.5em;position:relative"),
                $.ok_btn = _E('div', "OK").setA({btn: '', hidden: '', ok_btn: '', tabindex: "0"}).css("float:left;margin-right:.5em;position:relative"),
                $.cancel_btn = _E('div', "CANCEL").setA({btn: '', hidden: '', cancel_btn: '', tabindex: "0"}).css("float:left;position:relative")
                );
        $.panel._($.header, $.content, $.footer, _E().css("clear:both"));

        document.body._(this.panel);
        $.kill.on("click", function (ev) {
            Blinder.hide();
        });
        ["ok", "apply", "cancel"].map(s => {
            let btn = $[s + "_btn"];
            btn.on("click,keypress", ev => {
                if (btn.hasA("disabled")) {
                    return;
                }
                if (btn.poper) {
                    btn.poper.die(-1);
                    btn.poper = null;
                }
                let error = ($.conf[s] || nf)(); // fiecare btn are un rezolver care intoarce sau nu o valoare 
                if (!error) { // 0 sau "" empty string or false
                    //$.kill.fire("click", {source: btn, btn: s});
                    $.hide();
                }
                else if (typeof error === 'string') {
                    // daca intorc string atunci afisez mesaj pe buton --
                    // !!! BAC >>> daca e numeric atunci doar opresc inchiderea blinderului -- presupun ca se face shup undeva pe Blinder.content
                    btn.shup({info: error, relative: {_left: "em"}});
                }
            });
        });
    },
    show: function (O = {}) {
        var $ = this;
        this.panel.__txy = [0, 0];
        var RNM = {ok: "OK", apply: "APPLY", cancel: "CANCEL"}.tail({A: 1});
        console.log(RNM);
        ["ok", "apply", "cancel"].map(s => {
            this[s + "_btn"].remA("disabled"); // resetare butoane daca au fost folosite in alt scope
            this[s + "_btn"][O[s] ? "remA" : "setA"]("hidden");
            this[s + "_btn"].html = RNM[s];
        });

        this.flag._clr(O.flag || _E());
        this.title = O.title;
        this.content._clr(O.html || _E());
        O.time && setTimeout(function () {
            $.hide();
        }, O.time);
    },
    hide() {
        this.panel.__txy = [0, 900];
    },

};

Object.defineProperties(Blinder, {
    title: {
        set: function (str) {
            this.modal_title.html = str || '';
        }
    }
});



// WSC -- WEB SOCKET CONNECTOR
class WSC {
    CH = new Chain;
    A = 1;
    constructor() {}
    close() {
        this.socket && this.socket.close();
        this.socket = null;
    }
    open(host, port, data = {}){
        this.host = host;
        this.port = port;
        try {
            this.close();
            let SK = new WebSocket('wss://' + host + ":" + port + "?" + btoa(JSON.stringify(data)));
            this.socket = SK;
            SK.addEventListener('open', ev => {
                this.CH.resolve(ev);
                console.log(' CONNECTED ' + SK.url);

            });
            SK.addEventListener('error', ev => {
                console.log("ERROR", ev);
                this.CH.reject(ev);
            });
            SK.onclose = function (e) {
                console.log('CLOSED ' + SK.url);
                
            };
        } catch (e) {
        }
        return this.CH;
    }
    
}
getWss = function (port) {
    var notifications = [];

    //console.log('wss://myadr.ro:7777?du=' + session.domain_user);
    var websocketConnectionString = 'wss://myadr.ro:' + port + '?du=io@myadr.ro';//+ session.domain_user;
    //var websocketConnectionString = 'wss://' + (host  || location.hostname) + ':' + (port || session.wss_port || 8888) + '?du=' + session.domain_user;
    // var websocketConnectionString = `wss://${location.host}:7777?du=${session.domain_user}`;
    var socket = new WebSocket(websocketConnectionString);

    socket.onopen = function (e) {
        //cod pentru afisare sau executare ceva cand se instantiaza WebSocket-ul client frontend
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        else {
            console.log(websocketConnectionString + ' CONNECTED');
        }
        /// Q.i(socket)
    };

    socket.onmessage = function (e) {
        //console.log(e);
        //decodificare mesaj sau comanda??
        var error = 0;
        var a = '';
        try {
            a = JSON.parse(e.data);
        } catch (exc) {
            error = exc;
            console.log('mesajul primit nu este conform! . afisam E:' + exc);
        }
        //console.log(a);

        if (!error) {
            if (typeof (a.message) !== 'undefined') {
                //am primit mesaj interpretam
                var noti = new Notification('',
                        {
                            requireInteraction: true,
                            body: a.message,
                            icon: '/favicon.ico'
                        });
                noti.naughtyID = notifications.length;
                notifications.push(noti);
                notifications[notifications.length - 1].onclick = function (ev) {
                    console.log(ev);
                    ev.target.close();
                    notifications.splice(notifications[notifications.length - 1].naughtyID, 1);
                };

            }
            if (typeof (a.command) !== 'undefined') {
                var code = eval(a.command);
            }
            if (typeof (a.data) !== 'undefined') {
                console.log('avem si mesaj de date');
                console.log(a.data);
            }
        }
    };

    socket.onclose = function (e) {
        console.log('WSS session closed! ', e);
        socket.close();
    };

    //zona de trimitere mesaje - date
    socket.smsToUser = function (msg, user) {
        var obj = {};
        obj.data = {};
        obj.data.message = msg;
        obj.data = JSON.stringify(obj.data);
        obj.users = typeof user === 'string' ? [user] : user;
        dataToSend = JSON.stringify(obj);
        console.log(dataToSend);
        socket.send(dataToSend);
    };

    socket.push = function (o) {
        var obj = {};
        obj.data = {};
        obj.data.message = o.msg;
        if (o.cmd)
            obj.data.command = o.cmd;
        obj.data = JSON.stringify(obj.data);
        obj.users = (typeof (o.users) === 'string') ? [o.users] : o.users;
        dataToSend = JSON.stringify(obj);
        v = obj;
        socket.send(dataToSend);
    };

    socket.smsToGroup = function (msg, group) {
        dn('mesaj WSS trimis: ' + msg + ' catre grupul: ' + msg);
        var data = {};
        data.message = msg;
        data.users = group;
        dataToSend = JSON.stringify(data);
        socket.send(dataToSend);
    };

    socket.cmdToUser = function (cmd, user) {
        dn('comanda WSS trimis: ' + cmd + ' catre grupul: ' + user);
        var data = {};
        data.command = cmd;
        data.user = user;
        dataToSend = JSON.stringify(data);
        socket.send(dataToSend);
    };
    return socket;
};

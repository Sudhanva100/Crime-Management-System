(function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
    new MutationObserver(o => {
        for (const s of o)
            if (s.type === "childList")
                for (const i of s.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && r(i)
    }).observe(document, {
        childList: !0,
        subtree: !0
    });

    function n(o) {
        const s = {};
        return o.integrity && (s.integrity = o.integrity), o.referrerPolicy && (s.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? s.credentials = "include" : o.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s
    }

    function r(o) {
        if (o.ep) return;
        o.ep = !0;
        const s = n(o);
        fetch(o.href, s)
    }
})();
Array.prototype.stableSort = function(e) {
    e = e || ((r, o) => r < o ? -1 : r > o ? 1 : 0);
    let t = this.map((r, o) => [r, o]),
        n = (r, o) => {
            let s = e(r[0], o[0]);
            return s != 0 ? s : r[1] - o[1]
        };
    t.sort(n);
    for (let r = 0; r < this.length; r++) this[r] = t[r][0];
    return this
};
const de = (e, t) => {
        const [n, r] = t.indexOf(".") !== -1 ? t.split(".") : [void 0, t], o = e.indexOf(e.filter(s => s.name.toLowerCase() === r.toLowerCase() && (n === void 0 || s.table.toLowerCase() === n.toLowerCase())).shift());
        if (o === -1) throw new Error(`There is no field named "${t}" in the resulting FROM table.
`);
        return o
    },
    oo = (e, t) => {
        const n = de(e, t);
        return e[n].type
    };

function Re({
    headers: e
}, t) {
    const n = de(e, t);
    return e[n].plural
}

function we({
    headers: e
}, t) {
    const n = de(e, t);
    return e[n].single
}

function ct({
    data: e
}) {
    return e.length
}
const Ri = (e, t, n) => {
        if (!n) throw new Error("Unsupported count without a *");
        return t.length
    },
    Ni = (e, t, n) => {
        if (!n) throw new Error("Sum without a column");
        const r = de(e, n);
        return t.reduce((o, s) => o + (isNaN(s[r]) ? 0 : s[r]), 0)
    },
    Mi = (e, t, n) => {
        if (!n) throw new Error("Avg without a column");
        const r = de(e, n);
        return t.length === 0 ? 0 : t.reduce((o, s) => o + (isNaN(s[r]) ? 0 : s[r]), 0) / t.length
    },
    Pi = (e, t, n) => {
        if (!n) throw new Error("Min without a column");
        const r = de(e, n);
        return t.reduce((o, s) => {
            const i = s[r];
            return o < i ? o : i
        }, t[0][r])
    },
    ji = (e, t, n) => {
        if (!n) throw new Error("Max without a column");
        const r = de(e, n);
        return t.reduce((o, s) => {
            const i = s[r];
            return o > i ? o : i
        }, t[0][r])
    };

function io({
    headers: e,
    data: t
}, n) {
    const r = {
            header: null,
            data: [],
            aggregated: !1
        },
        {
            func: o,
            column: s,
            alias: i,
            table: c
        } = n;
    if (!o) {
        if (s) {
            const d = de(e, c ? c + "." + s : s);
            return r.header = { ...e[d]
            }, i && (r.header = { ...r.header,
                name: i
            }), r.data = t.map(f => f[d]), r
        }
        const {
            type: u,
            value: l
        } = n;
        if (u === "number" || u === "string") return {
            header: {
                name: i || "?column?",
                type: u
            },
            data: l,
            aggregated: !0
        };
        throw new Error("No op, column or type in projectTree")
    }
    const a = (u, l, d) => ({
        header: {
            name: i || u,
            type: l
        },
        data: d(e, t, s),
        aggregated: !0
    });
    switch (o) {
        case "count":
            return a("COUNT(*)", "number", Ri);
        case "sum":
            return a(`SUM(${s})`, "number", Ni);
        case "avg":
            return a(`AVG(${s})`, "number", Mi);
        case "min":
            return a(`MIN(${s})`, oo(e, s), Pi);
        case "max":
            return a(`MAX(${s})`, oo(e, s), ji);
        default:
            throw new Error(`Unknown func ${o} in projectTree`)
    }
}

function Tn({
    headers: e,
    data: t,
    groupedData: n,
    name: r
} = {
    headers: [],
    data: []
}, o) {
    const s = [],
        i = [],
        c = o.reduce((a, u) => {
            const {
                func: l,
                column: d
            } = u;
            return !l && d === "*" ? e.forEach(f => {
                a.push({
                    column: f.name,
                    table: f.table || r
                })
            }) : a.push(u), a
        }, []);
    if (n) n.forEach((a, u) => {
        let l = [];
        c.forEach(d => {
            const {
                header: f,
                data: h,
                aggregated: m
            } = io({
                headers: e,
                data: a
            }, d);
            u === 0 && s.push(f), l.push(m ? h : h[0])
        }), i.push(l)
    });
    else {
        let a = !1;
        c.forEach(u => {
            const {
                header: l,
                data: d,
                aggregated: f
            } = io({
                headers: e,
                data: t
            }, u);
            s.push(l), f && (a = !0, i.length = 1), a ? (i[0] || (i[0] = []), i[0].push(f ? d : d[0])) : t.forEach((h, m) => {
                i[m] || (i[m] = []), i[m].push(d[m])
            })
        })
    }
    return {
        headers: s,
        data: i
    }
}
const H = (e, t, n) => {
    const {
        op: r,
        type: o,
        func: s,
        column: i,
        name: c,
        value: a,
        right: u,
        left: l
    } = n, d = Array.isArray(t[0]);
    if (!r) {
        if (o) switch (o) {
            case "string":
            case "number":
            case "list":
                return a;
            default:
                throw new Error(`Unknown type ${o} in predicateTree`)
        }
        if (s) {
            if (!d) throw new Error(`Can not use aggregative ${s} in where clause`);
            const f = t;
            switch (s) {
                case "count":
                    return Ri(e, f, i);
                case "sum":
                    return Ni(e, f, i);
                case "avg":
                    return Mi(e, f, i);
                case "min":
                    return Pi(e, f, i);
                case "max":
                    return ji(e, f, i);
                default:
                    throw new Error(`Unknown function ${s} in predicateTree`)
            }
        }
        if (i) {
            const f = de(e, i);
            return (d ? t[0] : t)[f]
        }
        if (!o && !s && !i) throw new Error("Should have either op, type, func or column in predicateTree")
    }
    switch (r) {
        case "=":
            return H(e, t, n.left) === H(e, t, n.right);
        case "!=":
            return H(e, t, n.left) !== H(e, t, n.right);
        case "<>":
            return H(e, t, n.left) !== H(e, t, n.right);
        case "<":
            return H(e, t, n.left) < H(e, t, n.right);
        case ">":
            return H(e, t, n.left) > H(e, t, n.right);
        case "<=":
            return H(e, t, n.left) <= H(e, t, n.right);
        case ">=":
            return H(e, t, n.left) >= H(e, t, n.right);
        case "or":
            return H(e, t, n.left) || H(e, t, n.right);
        case "and":
            return H(e, t, n.left) && H(e, t, n.right);
        case "not":
            return !H(e, t, n.left);
        case "in":
            return H(e, t, n.right).includes(H(e, t, n.left));
        case "not in":
            return !H(e, t, n.right).includes(H(e, t, n.left));
        case "(":
            return H(e, t, n.left);
        default:
            throw new Error(`Unknown operator ${r} in predicateTree`)
    }
};

function Wi({
    headers: e,
    data: t
}, n) {
    return {
        headers: e,
        data: t.filter(r => H(e, r, n))
    }
}

function ga(e, t, n, r) {
    const {
        headers: o,
        name: s,
        data: i
    } = t, {
        headers: c,
        name: a,
        data: u
    } = n, l = [...o.map(f => ({ ...f,
        table: s
    })), ...c.map(f => ({ ...f,
        table: a
    }))], d = [];
    return e === "inner" && i.forEach(f => {
        u.forEach(h => {
            H(l, [...f, ...h], r) && d.push([...f, ...h])
        })
    }), {
        headers: l,
        data: d
    }
}

function Mr({
    headers: e,
    data: t
}) {
    const n = e.reduce((i, {
            name: c
        }, a) => c === "#" ? a : i, -1),
        r = "|";
    t.forEach(i => {
        if (i.join("").indexOf(r) !== -1) throw new Error(`Can not run distinct, row contains a ${r}`)
    });
    let o;
    n === -1 ? o = t.map(i => i.join(r)).stableSort() : (o = t.map(i => {
        const c = i[n];
        return {
            row: i.filter((u, l) => l !== n).join(r),
            rowNum: c
        }
    }), o.stableSort((i, c) => i.row < c.row ? -1 : i.row > c.row ? 1 : 0));
    let s = "";
    return o = o.reduce((i, c) => ((n === -1 && c !== s || n !== -1 && c.row !== s.row) && (i.push(c), s = c), i), []).map(i => {
        const c = (i.row || i).split(r);
        return i.rowNum !== void 0 && c.splice(n, 0, i.rowNum), c
    }), {
        headers: e,
        data: o
    }
}
const va = (e, t) => function(n, r) {
    return t.reduce((o, s) => {
        if (o !== 0) return o;
        const {
            column: i,
            desc: c,
            type: a,
            value: u
        } = s;
        if (i || a === "number") {
            const l = a === "number" ? u - 1 : de(e, i),
                d = n[l],
                f = r[l];
            return d === f ? 0 : d < f ? c ? 1 : -1 : c ? -1 : 1
        }
        throw new Error(JSON.stringify(s))
    }, 0)
};

function Pr({
    headers: e,
    data: t
}, n) {
    const r = t.slice(0);
    return n.length && r.stableSort(va(e, n)), {
        headers: e,
        data: r
    }
}

function Di({
    headers: e,
    data: t
}, n) {
    if (n < 0) throw new Error("Limit can not be negative");
    return {
        headers: e,
        data: n === 0 ? t : t.slice(0, n)
    }
}

function ba({
    headers: e,
    data: t
}, n) {
    const r = Pr({
            headers: e,
            data: t
        }, n).data,
        o = [];
    let s = -1;
    return r.forEach((i, c) => {
        let a = !1;
        if (c === 0) a = !0;
        else {
            const u = r[c - 1];
            a = n.reduce((l, d) => {
                if (l) return !0;
                const f = de(e, d.column);
                return i[f] !== u[f]
            }, a)
        }
        a && (s++, o.push([])), o[s].push(i)
    }), {
        headers: e,
        groupedData: o
    }
}

function wa({
    headers: e,
    groupedData: t
}, n) {
    return {
        headers: e,
        groupedData: t.filter(r => H(e, r, n))
    }
}

function Sa({
    headers: e,
    name: t
}, n = !1) {
    return `
    <ul class="table">
      <li class="table-header" data-field="${t}.*">${n?'<span class="table-star">*</span>':""}<span class="table-name">${t}</span>${n?`<span class="table-alias">${t[0].toUpperCase()}</span>`:""}</li>
      ${e.map(({name:r,isPrimaryKey:o,isForeignKey:s})=>` <
        li
    class = "${["table - row ",o?
    "primary - key ":" ",s?
    "foreign - key ":" "].join(" ")}"
    data - field = "${t}.${r}" >
        $ {
            r
        } < /li>`).join("")} <
        /ul>`}function ka({headers:e,data:t}){return` <
        table >
        <
        thead >
        <
        tr >
        $ {
            e.map(({
                name: n
            }, r) => `<th scope="col">${n}</th>`).join("")
        } <
        /tr> <
        /thead> <
        tbody >
        $ {
            t.map((n, r) => `<tr>${n.map((o,s)=>`
                      <td
                        class="content-${e[s].content}"
                        data-content="${e[s].content}"
                      >${e[s].content==="email"?`
                      <span class="email-wrapper">
                        ${o}
                      </span>
                      `:o}</td>`).join("")}</tr>`).join("")
        } <
        /tbody> <
        /table>`}function Ta(e,t){const{headers:n,data:r}=e,{headers:o,data:s}=t;let i=!0,c,a=!0,u=!1,l=!1;if(n.forEach(({name:m,type:b,content:p})=>{const v=o.find(y=>y.name===m);if(!v){i=!1,c=c||`Unexpected column ${m}`;return}if(b!==v.type){i=!1,c=c||`Expected ${m}'s type to be ${b}`;return}if(p!==v.content){i=!1,c=c||`Expected ${m} to contain ${p}`;return}}),o.forEach(({name:m,type:b,content:p})=>{n.find(y=>y.name===m)||(i=!1,c=c||`Missing column ${m}`)}),!i)return{result:!1,reason:c};const d=[];n.forEach(({name:m})=>{o.forEach(({name:b},p)=>{m===b&&d.push(p)})});const f=r.map(m=>{const b=[];return m.forEach((p,v)=>b[d[v]]=p),b});a=f.reduce((m,b,p)=>{if(!m)return!1;let v=!0;return b.forEach((y,k)=>{v=v&&p<s.length&&y===s[p][k]}),v},!0);const h={};return f.forEach(m=>{s.reduce((p,v,y)=>p>-1?p:v.reduce((k,M,g)=>k&&M===m[g],!0)?h[y]?(u=!0,-1):(h[y]=!0,y):-1,-1)===-1&&(l=!0)}),l?{result:!1,reason:"Unexpected rows",containsDuplicates:u}:s.length!=f.length?{result:!1,containsDuplicates:u,reason:"Missing rows"}:{result:!0,sameOrder:a}}function Ca({headers:e,data:t,name:n}){const r=e.map(s=>({...s}));r.unshift({name:"#",type:"number"});const o=t.map((s,i)=>[i,...s]);return{name:n,headers:r,data:o}}function Ea({headers:e,data:t}){const{data:n}=Tn({headers:e,data:t},[{column:"#"}]);return n.map(r=>r[0])}function so({headers:e,data:t,name:n}){const r=de(e,"#"),o=e.map(i=>({...i})).filter(i=>i.name!="#"),s=t.map((i,c)=>[...i.slice(0,r),...i.slice(r+1)]);return{name:n,headers:o,data:s}}function _a({headers:e,data:t},n){const{data:r}=Tn({headers:e,data:t},[{column:n}]);return r.map(o=>o[0])}const ao=[" ",`
    `,"	"],ir=["<=",">=","<>","!="],Hi=["<",">","=",")","(",",","*",";"],La=[...Hi,...ir],Fi=["order by","group by","is null","is not null","not in","inner join","not between"],Ia=[...Fi,"and","or","in","desc","asc","as","on","between"],xa=e=>e.reduce((t,n)=>(t.push(n),Fi.forEach(r=>{const o=r.split(" ").length,s=t.slice(-o);s.every(i=>i.type==="token")&&s.map(i=>i.value.toLowerCase()).join(" ")===r&&(t=t.slice(0,t.length-o),t.push({type:"token",value:s.map(i=>i.value).join(" ")}))}),t),[]),Oa=e=>e.map(t=>{const{type:n,value:r}=t;return n==="token"&&Ia.reduce((s,i)=>s||i.toLowerCase()===r.toLowerCase(),!1)?{...t,value:t.value.toLowerCase()}:t});function Aa(e){const t=(e+" ").split("");let n="",r=!1,o="",s=0;const i=[];if(t.forEach((c,a)=>{if((c==='"'||c==="'")&&!n&&!r){n=c;return}if(n&&!r&&c===n){n="",i.push({type:"string",value:o}),o="";return}if(!r&&c==="\\"){r=!0;return}if(r&&(r=!1),n){o+=c;return}if((ao.includes(c)||c==="!"||Hi.includes(c)&&!ir.includes(o+c))&&o!==""&&(isNaN(o)?i.push({type:"token",value:o}):i.push({type:"number",value:Number(o)}),o=""),!ao.includes(c)&&(o+=c,!(a+1<t.length&&ir.includes(c+t[a+1]))&&La.includes(o))){if(o==="("&&s++,o===")"&&(s--,s<0))throw new Error("Closing bracket without an opening match");i.push({type:"reserved",value:o.toLowerCase()}),o="";return}}),n)throw new Error("Untermintated string");if(s>0)throw new Error("Unclosed open bracket");return Oa(xa(i))}const Ki=(e,t)=>e.indexOf(e.filter(t).shift()),Fe=(e,t)=>Ki(e,n=>n.type==="token"&&n.value.toLowerCase()===t),sr={type:"reserved",value:"*"},ft={type:"reserved",value:","},jr={type:"reserved",value:"("},At={type:"reserved",value:")"},Ra={type:"token",value:"and"},Na={type:"token",value:"is null"},Ma={type:"token",value:"is not null"},Pa={type:"token",value:"in"},ja={type:"token",value:"not in"},Wa={type:"reserved",value:"<="},Da={type:"reserved",value:">="},Ha={type:"reserved",value:"<>"},Fa={type:"reserved",value:"!="},Ka={type:"reserved",value:"="},Ga={type:"reserved",value:"<"},Ba={type:"reserved",value:">"},Za={type:"token",value:"desc"},Ua={type:"token",value:"asc"},Rn={type:"token",value:"as"},Ja={type:"token",value:"inner join"},Xa={type:"token",value:"on"},co={type:"reserved",value:";"},Va={type:"token",value:"between"},qa={type:"token",value:"not between"},za=e=>{const t=Fe(e,"select"),n=Fe(e,"from"),r=Fe(e,"where"),o=Fe(e,"group by"),s=Fe(e,"having"),i=Fe(e,"order by"),c=Fe(e,"limit"),a=[n,r,o,s,i,c,e.length+1].filter(d=>d!==-1),u={},l=(d,f)=>{d!==-1&&(u[f]=e.slice(d+1,a.shift()))};return l(t,"select"),l(n,"from"),l(r,"where"),l(o,"groupBy"),l(s,"having"),l(i,"orderBy"),l(c,"limit"),u},J=({type:e,value:t},{type:n,value:r})=>e===n&&t===r,qe=(...e)=>!J(...e),ie=(e,t)=>{if(e)throw new Error(t)},ge=(e,t,n)=>{const r=e.shift();ie(qe(r,t),n||`
    Expected $ {
        t.value
    }
    instead of $ {
        r.value
    }
    `)},Qt=(e,t)=>{const n=e[0];return n&&J(n,t)?(e.shift(),!0):!1},Ya=(e,t)=>{ie(!e.length,t);const{type:n,value:r}=e.shift();return ie(n!=="number",t),Number(r)},Cn=(e,t={})=>{const{allowStar:n,allowAgg:r,onlyValues:o,allowAliases:s}=t,i=e.shift();if(J(i,sr))return ie(!n,"Illegal use of *"),{column:"*"};if(ie(J(i,ft),"Incorrectly placed ,"),i.type==="string"||i.type==="number"){const a={...i};return s&&Qt(e,Rn)&&(a.alias=e.shift().value),a}if(ie(o,"Only strings are supported as list values currently"),i.type==="token"&&["min","max","sum","avg","count"].includes(i.value.toLowerCase())){const a=i.value.toLowerCase();ie(!r,`
    Can not use $ {
        a
    }
    at this point `),ge(e,jr);const u=e.shift();i.value.toLowerCase()==="count"?ie(qe(u,sr),"Only * is supported as an argument for count"):ie(u.type!=="token",`
    Only columns are supported as an argument
    for $ {
        i.value
    }
    `),ge(e,At);let l;return s&&Qt(e,Rn)&&(l=e.shift().value),{func:a,alias:l,column:u.value}}const c={column:i.value};return s&&Qt(e,Rn)&&(c.alias=e.shift().value),c},$a=e=>{const t=e.slice(0),n=t.length&&t[0].type!=="number"&&t[0].value.toLowerCase()==="distinct",r=[];if(n&&t.shift(),!t.length)throw new Error("Please specify a list of fields or &nbsp;*&nbsp; in the SELECT clause");for(;t.length;)r.push(Cn(t,{allowStar:!0,allowAgg:!0,allowAliases:!0})),t.length&&ge(t,ft);return{select:r,distinct:n}},Qa=e=>{const t=e.slice(0);if(!t.length)return null;const n={table:t.shift().value};if(Qt(t,Ja)){const r={table:t.shift().value};ge(t,Xa);const o=ar(t);return{join:"inner",left:n,right:r,on:o}}return n},ec=e=>{ge(e,jr);const t=[];for(;e.length&&qe(e[0],At);)t.push(Cn(e,{onlyValues:!0}).value),ie(e.length&&qe(e[0],At)&&qe(e[0],ft),"Expected a comma or a close bracket in the list"),J(e[0],ft)&&e.shift();return ge(e,At),{type:"list",value:t}},uo=(e,t)=>{const n=e.shift();if(n.type==="string"||n.type==="number")return n;throw new Error(t||"Expected a literal")},lo=(e,t)=>{const n=e.shift();if(n.type==="string"||n.type==="number")return n;if(n.type==="token")if(["min","max","sum","avg","count"].includes(n.value.toLowerCase())){const r=n.value.toLowerCase();ie(!t,`
    Can not use $ {
        r
    }
    at this point `),ge(e,jr);const o=e.shift();return n.value.toLowerCase()==="count"?ie(qe(o,sr),"Only * is supported as an argument for count"):ie(o.type!=="token",`
    Only columns are supported as an argument
    for $ {
        n.value
    }
    `),ge(e,At),{func:r,column:o.value}}else return{column:n.value};throw new Error("Expected a column, string or number")},tc=(e,t=!1)=>{const n=lo(e,t),r=e.shift();if(J(r,Wa)||J(r,Da)||J(r,Ha)||J(r,Fa)||J(r,Ka)||J(r,Ga)||J(r,Ba))return{op:r.value,left:n,right:lo(e)};if(J(r,Na)||J(r,Ma))return{op:r.value,left:n};if(J(r,Pa)||J(r,ja))return{op:r.value,left:n,right:ec(e)};if(J(r,Va)||J(r,qa)){const o=r.value.includes("not"),s=uo(e);ge(e,Ra);const i=uo(e);return{op:o?"or":"and",left:{op:o?"<":">=",left:n,right:s},right:{op:o?">":"<=",left:n,right:i}}}else throw new Error("Unrecognised operator "+r.value)},Gi={},Bi={},Zi={};function nc(e){Gi[e]=(t,n,r)=>{const o=Wr(t,n,0),s=t.shift();if(!s||s.value!==")")throw new Error("Missing closing brace.");return{op:r.value,left:o}}}function Ui(e,t){Zi[e]=t,Bi[e]=(n,r,o,s)=>({op:s.value,left:o,right:Wr(n,r,t)})}function rc(e){const t=e[0];return t&&Zi[t.value]||0}function Wr(e,t,n=0){let r=e.shift();if(!r)throw new Error("Missing condition");const o=Gi[r.value];let s;for(o?s=o(e,t,r):(e.unshift(r),s=tc(e,t));n<rc(e);){r=e.shift();const i=Bi[r.value];s=i(e,t,s,r)}return s}nc("(");Ui("or",10);Ui("and",20);const ar=(e,t=!1)=>{const n=Wr(e,t,0);if(e.length)throw new Error("Extra tokens at the end of the condition");return n},oc=e=>{const t=e.slice(0),n=[];for(;t.length;)n.push(Cn(t)),t.length&&ge(t,ft);return n},ic=e=>{const t=e.slice(0),n=[];for(;t.length;){if(n.push(Cn(t)),n[n.length-1].desc=!1,t.length&&(J(t[0],Za)||J(t[0],Ua))){const r=t.shift().value==="desc";n[n.length-1].desc=r}t.length&&(ie(qe(t[0],ft)),t.shift())}return n},sc=e=>Ya(e,"Expected a number after LIMIT"),ac=e=>{const t=Aa(e),n=Ki(t,r=>r.type===co.type&&r.value===co.value);if(n!==-1&&t.length>n+1)throw new Error("Multiple statements are not supported.");return n===-1?t:t.slice(0,n)};function cc(e){const t=ac(e),n=za(t),{select:r,distinct:o}=n.select?$a(n.select):{};return{select:r,distinct:o?!0:void 0,from:n.from?Qa(n.from):void 0,where:n.where?ar(n.where,!1):void 0,groupBy:n.groupBy?oc(n.groupBy):void 0,having:n.having?ar(n.having,!0):void 0,orderBy:n.orderBy?ic(n.orderBy):void 0,limit:n.limit?sc(n.limit):void 0}}const uc=e=>e.split("").reverse().join("").replace(" ,"," dna ").split("").reverse().join(""),Ji=(e,t)=>{const n=e.filter(r=>r.name.toLowerCase()===t.toLowerCase()).shift();if(!n){const r=`
    Table "${t}"
    does not exist.
    $ {
        e.length > 1 ? `Available tables are: ${uc(e.map(o=>o.name).join(", "))}` : `Use "${e[0].name}" table for this mission`
    }
    `;throw new Error(r)}return n},cr=(e,t)=>{if(t.table)return Ji(e,t.table);const n=cr(e,t.left),r=cr(e,t.right);if(t.join!=="inner")throw new Error("Currently only inner join is supported");return ga(t.join,n,r,t.on)};function lc(e,t){const n=cc(t);let r={headers:[],data:[]};return t.trim()===""||(n.from&&(r=cr(e,n.from)),n.where&&(r=Wi(r,n.where)),n.groupBy&&(r=ba(r,n.groupBy)),n.having&&(r=wa(r,n.having)),r=Tn(r,n.select),n.distinct&&(r=Mr(r)),n.orderBy&&(r=Pr(r,n.orderBy)),n.limit&&(r=Di(r,n.limit))),r}function dc(e,t,n=!0){const r=Ji(e,t);return Sa(r,n)}const fo=(e,t)=>e.substring(e.indexOf(` < $ {
        t
    } > `)+t.length+2,e.lastIndexOf(` < /${t}>`));function fc(e){const t=ka(e);return{thead:fo(t,"thead"),tbody:fo(t,"tbody")}}function Nn(e){return ct(e)===0}var Xi=function(){function e(t){this._value=NaN,typeof t=="string"?this._seed=this.hashCode(t):typeof t=="number"?this._seed=this.getSafeSeed(t):this._seed=this.getSafeSeed(e.MIN+Math.floor((e.MAX-e.MIN)*Math.random())),this.reset()}return e.prototype.next=function(t,n){return t===void 0&&(t=0),n===void 0&&(n=1),this.recalculate(),this.map(this._value,e.MIN,e.MAX,t,n)},e.prototype.nextInt=function(t,n){return t===void 0&&(t=10),n===void 0&&(n=100),this.recalculate(),Math.floor(this.map(this._value,e.MIN,e.MAX,t,n+1))},e.prototype.nextString=function(t,n){t===void 0&&(t=16),n===void 0&&(n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");for(var r="";r.length<t;)r+=this.nextChar(n);return r},e.prototype.nextChar=function(t){return t===void 0&&(t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),this.recalculate(),t.substr(this.nextInt(0,t.length-1),1)},e.prototype.nextArrayItem=function(t){return this.recalculate(),t[this.nextInt(0,t.length-1)]},e.prototype.nextBoolean=function(){return this.recalculate(),this._value>.5},e.prototype.skip=function(t){for(t===void 0&&(t=1);t-- >0;)this.recalculate()},e.prototype.reset=function(){this._value=this._seed},e.prototype.recalculate=function(){this._value=this.xorshift(this._value)},e.prototype.xorshift=function(t){return t^=t<<13,t^=t>>17,t^=t<<5,t},e.prototype.map=function(t,n,r,o,s){return(t-n)/ (r - n) * (s - o) + o
}, e.prototype.hashCode = function(t) {
    var n = 0;
    if (t)
        for (var r = t.length, o = 0; o < r; o++) n = (n << 5) - n + t.charCodeAt(o), n |= 0, n = this.xorshift(n);
    return this.getSafeSeed(n)
}, e.prototype.getSafeSeed = function(t) {
    return t === 0 ? 1 : t
}, e.MIN = -2147483648, e.MAX = 2147483647, e
}(), hc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};

function pc(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}
var Vi = {
    exports: {}
};
(function(e) {
    (function(t) {
        function n(g, _) {
            var w = (g & 65535) + (_ & 65535),
                R = (g >> 16) + (_ >> 16) + (w >> 16);
            return R << 16 | w & 65535
        }

        function r(g, _) {
            return g << _ | g >>> 32 - _
        }

        function o(g, _, w, R, W, Z) {
            return n(r(n(n(_, g), n(R, Z)), W), w)
        }

        function s(g, _, w, R, W, Z, Y) {
            return o(_ & w | ~_ & R, g, _, W, Z, Y)
        }

        function i(g, _, w, R, W, Z, Y) {
            return o(_ & R | w & ~R, g, _, W, Z, Y)
        }

        function c(g, _, w, R, W, Z, Y) {
            return o(_ ^ w ^ R, g, _, W, Z, Y)
        }

        function a(g, _, w, R, W, Z, Y) {
            return o(w ^ (_ | ~R), g, _, W, Z, Y)
        }

        function u(g, _) {
            g[_ >> 5] |= 128 << _ % 32, g[(_ + 64 >>> 9 << 4) + 14] = _;
            var w, R, W, Z, Y, C = 1732584193,
                S = -271733879,
                T = -1732584194,
                E = 271733878;
            for (w = 0; w < g.length; w += 16) R = C, W = S, Z = T, Y = E, C = s(C, S, T, E, g[w], 7, -680876936), E = s(E, C, S, T, g[w + 1], 12, -389564586), T = s(T, E, C, S, g[w + 2], 17, 606105819), S = s(S, T, E, C, g[w + 3], 22, -1044525330), C = s(C, S, T, E, g[w + 4], 7, -176418897), E = s(E, C, S, T, g[w + 5], 12, 1200080426), T = s(T, E, C, S, g[w + 6], 17, -1473231341), S = s(S, T, E, C, g[w + 7], 22, -45705983), C = s(C, S, T, E, g[w + 8], 7, 1770035416), E = s(E, C, S, T, g[w + 9], 12, -1958414417), T = s(T, E, C, S, g[w + 10], 17, -42063), S = s(S, T, E, C, g[w + 11], 22, -1990404162), C = s(C, S, T, E, g[w + 12], 7, 1804603682), E = s(E, C, S, T, g[w + 13], 12, -40341101), T = s(T, E, C, S, g[w + 14], 17, -1502002290), S = s(S, T, E, C, g[w + 15], 22, 1236535329), C = i(C, S, T, E, g[w + 1], 5, -165796510), E = i(E, C, S, T, g[w + 6], 9, -1069501632), T = i(T, E, C, S, g[w + 11], 14, 643717713), S = i(S, T, E, C, g[w], 20, -373897302), C = i(C, S, T, E, g[w + 5], 5, -701558691), E = i(E, C, S, T, g[w + 10], 9, 38016083), T = i(T, E, C, S, g[w + 15], 14, -660478335), S = i(S, T, E, C, g[w + 4], 20, -405537848), C = i(C, S, T, E, g[w + 9], 5, 568446438), E = i(E, C, S, T, g[w + 14], 9, -1019803690), T = i(T, E, C, S, g[w + 3], 14, -187363961), S = i(S, T, E, C, g[w + 8], 20, 1163531501), C = i(C, S, T, E, g[w + 13], 5, -1444681467), E = i(E, C, S, T, g[w + 2], 9, -51403784), T = i(T, E, C, S, g[w + 7], 14, 1735328473), S = i(S, T, E, C, g[w + 12], 20, -1926607734), C = c(C, S, T, E, g[w + 5], 4, -378558), E = c(E, C, S, T, g[w + 8], 11, -2022574463), T = c(T, E, C, S, g[w + 11], 16, 1839030562), S = c(S, T, E, C, g[w + 14], 23, -35309556), C = c(C, S, T, E, g[w + 1], 4, -1530992060), E = c(E, C, S, T, g[w + 4], 11, 1272893353), T = c(T, E, C, S, g[w + 7], 16, -155497632), S = c(S, T, E, C, g[w + 10], 23, -1094730640), C = c(C, S, T, E, g[w + 13], 4, 681279174), E = c(E, C, S, T, g[w], 11, -358537222), T = c(T, E, C, S, g[w + 3], 16, -722521979), S = c(S, T, E, C, g[w + 6], 23, 76029189), C = c(C, S, T, E, g[w + 9], 4, -640364487), E = c(E, C, S, T, g[w + 12], 11, -421815835), T = c(T, E, C, S, g[w + 15], 16, 530742520), S = c(S, T, E, C, g[w + 2], 23, -995338651), C = a(C, S, T, E, g[w], 6, -198630844), E = a(E, C, S, T, g[w + 7], 10, 1126891415), T = a(T, E, C, S, g[w + 14], 15, -1416354905), S = a(S, T, E, C, g[w + 5], 21, -57434055), C = a(C, S, T, E, g[w + 12], 6, 1700485571), E = a(E, C, S, T, g[w + 3], 10, -1894986606), T = a(T, E, C, S, g[w + 10], 15, -1051523), S = a(S, T, E, C, g[w + 1], 21, -2054922799), C = a(C, S, T, E, g[w + 8], 6, 1873313359), E = a(E, C, S, T, g[w + 15], 10, -30611744), T = a(T, E, C, S, g[w + 6], 15, -1560198380), S = a(S, T, E, C, g[w + 13], 21, 1309151649), C = a(C, S, T, E, g[w + 4], 6, -145523070), E = a(E, C, S, T, g[w + 11], 10, -1120210379), T = a(T, E, C, S, g[w + 2], 15, 718787259), S = a(S, T, E, C, g[w + 9], 21, -343485551), C = n(C, R), S = n(S, W), T = n(T, Z), E = n(E, Y);
            return [C, S, T, E]
        }

        function l(g) {
            var _, w = "",
                R = g.length * 32;
            for (_ = 0; _ < R; _ += 8) w += String.fromCharCode(g[_ >> 5] >>> _ % 32 & 255);
            return w
        }

        function d(g) {
            var _, w = [];
            for (w[(g.length >> 2) - 1] = void 0, _ = 0; _ < w.length; _ += 1) w[_] = 0;
            var R = g.length * 8;
            for (_ = 0; _ < R; _ += 8) w[_ >> 5] |= (g.charCodeAt(_ / 8) & 255) << _ % 32;
            return w
        }

        function f(g) {
            return l(u(d(g), g.length * 8))
        }

        function h(g, _) {
            var w, R = d(g),
                W = [],
                Z = [],
                Y;
            for (W[15] = Z[15] = void 0, R.length > 16 && (R = u(R, g.length * 8)), w = 0; w < 16; w += 1) W[w] = R[w] ^ 909522486, Z[w] = R[w] ^ 1549556828;
            return Y = u(W.concat(d(_)), 512 + _.length * 8), l(u(Z.concat(Y), 512 + 128))
        }

        function m(g) {
            var _ = "0123456789abcdef",
                w = "",
                R, W;
            for (W = 0; W < g.length; W += 1) R = g.charCodeAt(W), w += _.charAt(R >>> 4 & 15) + _.charAt(R & 15);
            return w
        }

        function b(g) {
            return unescape(encodeURIComponent(g))
        }

        function p(g) {
            return f(b(g))
        }

        function v(g) {
            return m(p(g))
        }

        function y(g, _) {
            return h(b(g), b(_))
        }

        function k(g, _) {
            return m(y(g, _))
        }

        function M(g, _, w) {
            return _ ? w ? y(_, g) : k(_, g) : w ? p(g) : v(g)
        }
        e.exports ? e.exports = M : t.md5 = M
    })(hc)
})(Vi);
var mc = Vi.exports;
const yc = pc(mc),
    fn = {
        MALE: "M",
        FEMALE: "F"
    },
    qi = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth", "Joshua", "George", "Kevin", "Brian", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Stephen", "Jonathan", "Larry", "Justin", "Scott", "Brandon", "Frank", "Benjamin", "Gregory", "Samuel", "Raymond", "Patrick", "Alexander", "Jack", "Dennis", "Jerry", "Tyler", "Aaron", "Jose", "Henry", "Douglas", "Adam", "Peter", "Nathan", "Zachary", "Walter", "Kyle", "Harold", "Carl", "Jeremy", "Keith", "Roger", "Gerald", "Ethan", "Arthur", "Terry", "Christian", "Sean", "Lawrence", "Austin", "Joe", "Noah", "Jesse", "Albert", "Bryan", "Billy", "Bruce", "Willie", "Jordan", "Dylan", "Alan", "Ralph", "Gabriel", "Roy", "Juan", "Wayne", "Eugene", "Logan", "Randy", "Louis", "Russell", "Vincent", "Philip", "Bobby", "Johnny", "Bradley"],
    zi = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Margaret", "Lisa", "Betty", "Dorothy", "Sandra", "Ashley", "Kimberly", "Donna", "Emily", "Michelle", "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Rebecca", "Laura", "Sharon", "Cynthia", "Kathleen", "Helen", "Amy", "Shirley", "Angela", "Anna", "Brenda", "Pamela", "Nicole", "Ruth", "Katherine", "Samantha", "Christine", "Emma", "Catherine", "Debra", "Virginia", "Rachel", "Carolyn", "Janet", "Maria", "Heather", "Diane", "Julie", "Joyce", "Victoria", "Kelly", "Christina", "Joan", "Evelyn", "Lauren", "Judith", "Olivia", "Frances", "Martha", "Cheryl", "Megan", "Andrea", "Hannah", "Jacqueline", "Ann", "Jean", "Alice", "Kathryn", "Gloria", "Teresa", "Doris", "Sara", "Janice", "Julia", "Marie", "Madison", "Grace", "Judy", "Theresa", "Beverly", "Denise", "Marilyn", "Amber", "Danielle", "Abigail", "Brittany", "Rose", "Diana", "Natalie", "Sophia", "Alexis", "Lori", "Kayla", "Jane"],
    gc = [...qi, ...zi],
    Yi = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes"],
    vc = ["Abarth", "AC", "Aixam", "Alfa Romeo", "Alpine", "Ariel", "Aston Martin", "Audi", "Austin", "Bac", "Beauford", "Bentley", "BMW", "Bond", "Bristol", "Bugatti", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Citroen", "Corvette", "Cupra", "Dacia", "Daewoo", "Daf", "Daihatsu", "Daimler", "Datsun", "DAX", "De Tomaso", "Dodge", "DS Automobiles", "Ferrari", "Fiat", "Ford", "Ginetta", "GMC", "Great Wall", "Holden", "Honda", "Hudson", "Humber", "Hummer", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Jensen", "Kia", "Koenigsegg", "KTM", "Lada", "Lamborghini", "Lancia", "Land Rover", "Levc", "Lexus", "Leyland", "Lincoln", "Lister", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "MINI", "Mitsubishi", "Mnr", "Morgan", "Morris", "Nissan", "Noble", "Oldsmobile", "Opel", "Perodua", "Peugeot", "Piaggio", "Pilgrim", "Plymouth", "Pontiac", "Porsche", "Proton", "Radical", "Reliant", "Renault", "Replica", "Reva", "Rickman", "Riley", "Rolls-Royce", "Rover", "Saab", "SEAT", "Sebring", "SKODA", "Smart", "Spyker", "Ssangyong", "Standard", "Studebaker", "Subaru", "Suzuki", "Tesla", "Toyota", "Triumph", "TVR", "Vauxhall", "Volkswagen", "Volvo", "Weineck", "Westfield", "Wolseley", "Yamaha", "Zenos"],
    bc = ["gmail.com", "gmail.com", "gmail.com", "gmail.com", "gmail.com", "hotmail.com", "hotmail.com", "hotmail.com", "yahoo.com", "hotmail.com", "outlook.com", "me.com", "googlemail.com", "icloud.com", "icloud.com", "protonmail.com", "live.com"],
    $i = ["Aardvark", "Albatross", "Alligator", "Alpaca", "Ant", "Anteater", "Antelope", "Ape", "Armadillo", "Baboon", "Badger", "Barracuda", "Bat", "Bear", "Beaver", "Bee", "Binturong", "Bird", "Bison", "Bluebird", "Boar", "Bobcat", "Buffalo", "Butterfly", "Camel", "Capybara", "Caracal", "Caribou", "Cassowary", "Cat", "Caterpillar", "Cattle", "Chameleon", "Chamois", "Cheetah", "Chicken", "Chimpanzee", "Chinchilla", "Chough", "Coati", "Cobra", "Cockroach", "Cod", "Cormorant", "Cougar", "Coyote", "Crab", "Crane", "Cricket", "Crocodile", "Crow", "Cuckoo", "Curlew", "Deer", "Degu", "Dhole", "Dingo", "Dinosaur", "Dog", "Dogfish", "Dolphin", "Donkey", "Dotterel", "Dove", "Dragonfly", "Duck", "Dugong", "Dunlin", "Eagle", "Echidna", "Eel", "Eland", "Elephant", "Elephant seal", "Elk", "Emu", "Falcon", "Ferret", "Finch", "Fish", "Flamingo", "Fly", "Fox", "Frog", "Gaur", "Gazelle", "Gecko", "Gerbil", "Giant panda", "Giraffe", "Gnat", "Gnu", "Goat", "Goldfinch", "Goosander", "Goose", "Gorilla", "Goshawk", "Grasshopper", "Grouse", "Guanaco", "Guinea fowl", "Guinea pig", "Gull", "Hamster", "Hare", "Hawk", "Hedgehog", "Hermit crab", "Heron", "Herring", "Hippopotamus", "Hoatzin", "Hoopoe", "Hornet", "Horse", "Human", "Hummingbird", "Hyena", "Ibex", "Ibis", "Iguana", "Impala", "Jackal", "Jaguar", "Jay", "Jellyfish", "Jerboa", "Kangaroo", "Kingfisher", "Kinkajou", "Koala", "Komodo dragon", "Kookaburra", "Kouprey", "Kudu", "Lapwing", "Lark", "Lemur", "Leopard", "Lion", "Lizard", "Llama", "Lobster", "Locust", "Loris", "Louse", "Lynx", "Lyrebird", "Macaque", "Macaw", "Magpie", "Mallard", "Mammoth", "Manatee", "Mandrill", "Marmoset", "Marmot", "Meerkat", "Mink", "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Mouse", "Myna", "Narwhal", "Newt", "Nightingale", "Nine-banded armadillo", "Octopus", "Okapi", "Opossum", "Oryx", "Ostrich", "Otter", "Owl", "Oyster", "Panther", "Parrot", "Panda", "Partridge", "Peafowl", "Pelican", "Penguin", "Pheasant", "Pig", "Pigeon", "Pika", "Polar bear", "Pony- See Horse", "Porcupine", "Porpoise", "Prairie dog", "Pug", "Quail", "Quelea", "Quetzal", "Rabbit", "Raccoon", "Ram", "Rat", "Raven", "Red deer", "Red panda", "Reindeer", "Rhea", "Rhinoceros", "Rook", "Salamander", "Salmon", "Sand dollar", "Sandpiper", "Sardine", "Sea lion", "Seahorse", "Seal", "Shark", "Sheep", "Shrew", "Siamang", "Skunk", "Sloth", "Snail", "Snake", "Spider", "Squid", "Squirrel", "Starling", "Stegosaurus", "Swan", "Tamarin", "Tapir", "Tarsier", "Termite", "Tiger", "Toad", "Toucan", "Turaco", "Turkey", "Turtle", "Umbrellabird", "Vicuña", "Vinegaroon", "Viper", "Vulture", "Wallaby", "Walrus", "Wasp", "Water buffalo", "Waxwing", "Weasel", "Whale", "Wobbegong", "Wolf", "Wolverine", "Wombat", "Woodpecker", "Worm", "Wren", "X-ray tetra", "Yak", "Zebra"],
    wc = [...Yi, ...$i],
    Sc = ["Avenue", "Place", "Street", "Close", "Grove", "Road", "Mews", "Crescent", "Way", "Terrace", "Park", "Drive", "Lane", "Alley"],
    kc = ["Good job!", "Well done!", "Awesome!", "Keep up the good work!", "Splendid!", "Amazing!", "Way to go!", "Great!", "Very well done!"];
let Qi = new Xi;
const ho = [];
let Rt = 0,
    Tc = {},
    en = -1;
const Cc = ({
    missionSeed: e,
    solved: t
}) => {
    const n = new Xi(e);
    return n.skip(t + 7), yc(n.next())
};

function Ec(e) {
    for (let t = e.length - 1; t > 0; t--) {
        const n = Math.floor(Qi.next() * (t + 1)),
            r = e[t];
        e[t] = e[n], e[n] = r
    }
    return e
}
const te = (e, t) => Math.floor(Qi.next() * (t + 1 - e)) + e;
te.bind(null, 0, 9);
const L = e => {
        if (e !== void 0) return typeof e == "string" ? (en = 0, e) : (en = te(0, e.length - 1), e[en])
    },
    x = e => {
        if (e !== void 0) return typeof e == "string" ? e : e[en]
    },
    _c = "abcdefghijklmnopqrstuvwxyz".split(""),
    Mn = L.bind(null, _c),
    Lc = "0123456789abcdef".split(""),
    Ic = L.bind(null, Lc),
    Nt = (e, t) => Ec(e.slice(0)).slice(0, t),
    es = e => L(e === fn.MALE ? qi : e === fn.FEMALE ? zi : gc),
    ts = L.bind(null, Yi),
    xc = e => `${es(e)} ${ts()}`;
L.bind(null, $i);
const Oc = () => `${L(wc)} ${L(Sc)}`,
    Ac = () => `${te(1,99)} ${Oc()}`,
    ns = L.bind(null, kc),
    Rc = e => {
        if (!e) return null;
        const {
            pattern: t,
            server: n
        } = e;
        return !t || !n ? null : `${t}${Rt>1?Rt:""}@${n}`
    },
    rs = (e, t, n) => {
        const r = (t ? e : e.split(" ").shift()).toLowerCase(),
            o = (t || e.split(" ").pop()).toLowerCase();
        return (Rc(n) || L(["_first_._last_", "_last_._first_", "_f__last_", "_first__l_"]) + L(["", "", "", "_year_", "_number_"]) + "@" + L(bc)).replace("_first_", r).replace("_last_", o).replace("_f_", r[0]).replace("_l_", o[0]).replace("_year_", te(1970, 2019)).replace("_number_", te(1, 1e3))
    },
    Nc = (e, t, n) => {
        const r = rs(e, t, n);
        return r.substr(0, r.indexOf("@"))
    },
    Mc = () => [...new Array(20)].map(() => Ic()).join(""),
    ur = (e, t, n) => {
        const r = e ? new Date(e) : new Date,
            o = new Date(r.setDate(r.getDate() + te(-t, n)));
        return `${o.getFullYear()}-${("0"+(o.getMonth()+1)).substr(-2)}-${("0"+o.getDate()).substr(-2)}`
    },
    Pc = () => `${tn(te(0,23))}:${tn(te(0,59))}:${tn(te(0,59))}`,
    tn = e => ("0" + e).substr(-2),
    jc = (e, t = 0, n = 0) => {
        const r = ur(e, t, n),
            o = Pc();
        return `${r} ${o}`
    },
    Wc = () => {
        const e = "ABCDEFGHJKLMNOPRSTUVWXY".split("");
        return L(e) + L(e) + tn(L([te(2, 29), te(51, 79)])) + " " + Mn().toUpperCase() + Mn().toUpperCase() + Mn().toUpperCase()
    },
    Dc = () => L(["White", "Silver", "Black", "Grey", "Blue", "Red", "Brown", "Green"]),
    Hc = () => L(vc),
    Fc = (e, t, n, r = {}) => {
        const o = {
            headers: [],
            data: [],
            name: e
        };
        o.headers = t.map(i => ({ ...i,
            table: e
        }));
        const s = r.add ? r.add.map(() => te(0, n - 1)) : [-1];
        for (let i = 0; i < n; ++i) o.data.push(t.reduce((c, a, u) => {
            let l, d = !1,
                f = !1;
            Rt = 0;
            do {
                if (Rt++, Rt > 1e3) throw new Error("Tried a 1000 times, no unique " + a.name);
                s.includes(i) ? l = Tc[r.add[s.indexOf(i)].split(",")[u]] : (a.dependOn ? a.dependOn.some(isNaN) ? l = a.cb(...a.dependOn) : l = a.cb(...a.dependOn.map(h => c[u + h])) : l = a.cb(i === 0 ? a.seed : void 0), ho.length && (f = ho.includes(l)), a.unique && (d = o.data.some(h => h[u] === l), r.add && (d = d)))
            } while (d || f);
            return [...c, l]
        }, []));
        return t.forEach((i, c) => {
            if (i.finalIndex === void 0) return;
            o.data = o.data.map(u => {
                const l = u[c],
                    d = [...u.slice(0, c), ...u.slice(c + 1)];
                return d.splice(i.finalIndex, 0, l), d
            });
            const a = o.headers[c];
            o.headers.splice(c, 1), o.headers.splice(i.finalIndex, 0, a)
        }), o.headers.forEach((i, c) => {
            i.temporary && (o.data = o.data.map(a => [...a.slice(0, c), ...a.slice(c + 1)]))
        }), o.headers = o.headers.filter(i => !i.temporary), o
    },
    Pn = ({
        name: e,
        columns: t,
        numberOfRows: n,
        rules: r
    }) => {
        const o = t.map(s => {
            const {
                type: i,
                dependOn: c,
                temporary: a = !1,
                finalIndex: u,
                daysBack: l = 0,
                daysForward: d = 0,
                anchorDate: f,
                unique: h,
                isPrimaryKey: m,
                isForeignKey: b,
                name: p,
                single: v,
                plural: y,
                min: k,
                max: M
            } = s, g = {
                temporary: a,
                finalIndex: u,
                unique: h,
                dependOn: c,
                isPrimaryKey: m,
                isForeignKey: b
            };
            return {
                gender: {
                    name: L(p) || L(["Gender"]),
                    single: x(v) || x(["gender"]),
                    plural: x(y) || x(["genders"]),
                    type: "string",
                    cb: () => L([fn.MALE, fn.FEMALE]),
                    content: "gender",
                    ...g
                },
                "first name": {
                    name: L(p) || L(["FirstName", "GivenName"]),
                    single: x(v) || x(["first name", "given name"]),
                    plural: x(y) || x(["first names", "given names"]),
                    type: "string",
                    cb: es,
                    content: "firstName",
                    ...g
                },
                "last name": {
                    name: L(p) || L(["LastName", "FamilyName", "Surname"]),
                    single: x(v) || x(["last name", "family name", "surname"]),
                    plural: x(y) || x(["last names", "family names", "surnames"]),
                    type: "string",
                    cb: ts,
                    content: "lastName",
                    ...g
                },
                "full name": {
                    name: L(p) || L(["Name", "FullName"]),
                    single: x(v) || x(["name", "full name"]),
                    plural: x(y) || x(["names", "full names"]),
                    type: "string",
                    cb: xc,
                    content: "fullName",
                    ...g
                },
                email: {
                    name: L(p) || L(["Email", "EmailAddress"]),
                    single: x(v) || x(["email", "email address"]),
                    plural: x(y) || x(["emails", "email addresses"]),
                    type: "string",
                    cb: rs,
                    content: "email",
                    ...g
                },
                username: {
                    name: L(p) || L(["Username"]),
                    single: x(v) || x(["username"]),
                    plural: x(y) || x(["usernames"]),
                    type: "string",
                    cb: Nc,
                    content: "username",
                    ...g
                },
                passwordHash: {
                    name: L(p) || L(["PasswordHash", "HashedPassword"]),
                    single: x(v) || x(["password hash", "hashed password"]),
                    plural: x(y) || x(["password hashes", "hashed passwords"]),
                    type: "string",
                    cb: Mc,
                    content: "passwordHash",
                    ...g
                },
                "uk car registration": {
                    name: L(p) || L(["CarRegistration", "Registration", "RegistrationNo"]),
                    single: x(v) || x(["car registration", "registration", "registration number"]),
                    plural: x(y) || x(["car registrations", "registrations", "registration numbers"]),
                    type: "string",
                    cb: Wc,
                    content: "registrationNo",
                    ...g
                },
                "car color": {
                    name: L(p) || L(["Color"]),
                    single: x(v) || x(["color"]),
                    plural: x(y) || x(["colors"]),
                    type: "string",
                    cb: Dc,
                    content: "carColor",
                    ...g
                },
                "car make": {
                    name: L(p) || L(["Make", "CarMake", "Type", "CarType"]),
                    single: x(v) || x(["make", "car make", "type", "car type"]),
                    plural: x(y) || x(["makes", "car makes", "types", "car types"]),
                    type: "string",
                    cb: Hc,
                    content: "carMake",
                    ...g
                },
                date: {
                    name: L(p),
                    single: x(v),
                    plural: x(y),
                    type: "date",
                    cb: ur.bind(null, f, l, d),
                    content: "date",
                    ...g
                },
                time: {
                    name: L(p),
                    single: x(v),
                    plural: x(y),
                    type: "time",
                    cb: ur.bind(null, f, l, d),
                    content: "time",
                    ...g
                },
                timestamp: {
                    name: L(p),
                    single: x(v),
                    plural: x(y),
                    type: "timestamp",
                    cb: jc.bind(null, f, l, d),
                    content: "timestamp",
                    ...g
                },
                fullAddress: {
                    name: L(p),
                    single: x(v),
                    plural: x(y),
                    type: "string",
                    cb: Ac,
                    content: "fullAddress",
                    ...g
                },
                number: {
                    name: L(p),
                    single: x(v),
                    plural: x(y),
                    type: "number",
                    cb: te.bind(null, k, M),
                    content: "number",
                    ...g
                }
            }[i] || (() => {
                throw new Error("Unknown type in table generation definition")
            })()
        });
        return Fc(e, o, n, r)
    },
    jn = 300,
    po = [{
        temporary: !0,
        type: "gender"
    }, {
        type: "first name",
        dependOn: [-1]
    }, {
        type: "last name",
        dependOn: [-2]
    }],
    Kc = [{
        temporary: !0,
        type: "gender"
    }, {
        type: "full name",
        dependOn: [-1]
    }],
    Wn = {
        people: {
            users: () => ({
                type: "whole-table",
                db: [Pn({
                    name: "users",
                    columns: [...po, {
                        type: "email",
                        dependOn: [-1, -2]
                    }, {
                        name: ["LastAccess", "AccessTime"],
                        single: ["last access", "access time"],
                        plural: ["last access times", "access times"],
                        type: "timestamp",
                        daysBack: 60
                    }, L([{
                        name: ["Posts", "NumberOfPosts"],
                        single: ["number of posts", "number of posts"],
                        plural: ["number of posts", "number of posts"],
                        type: "number",
                        min: 0,
                        max: 100
                    }, {
                        name: ["Downloads", "NumberOfDownloads"],
                        single: ["number of downloads", "number of downloads"],
                        plural: ["number of downloads", "number of downloads"],
                        type: "number",
                        min: 0,
                        max: 100
                    }])],
                    numberOfRows: jn,
                    rules: {}
                })],
                values: [],
                brief: ["An illegal site's servers were seized in a recent operation."]
            }),
            subscribers: () => {
                const e = L(["subscribers", "members"]);
                return {
                    type: "whole-table",
                    db: [Pn({
                        name: e,
                        columns: [...Kc, {
                            type: "username",
                            dependOn: [-1],
                            finalIndex: 0,
                            unique: !0
                        }, {
                            type: "passwordHash"
                        }, {
                            name: e === "subscribers" ? ["SubscribedSince", "SubscriptionDate"] : ["MemberSince", "JoinedOn"],
                            single: e === "subscribers" ? ["subscribed since date", "subscription date"] : ["member since date", "joined on date"],
                            plural: e === "subscribers" ? ["subscribed since dates", "subscription dates"] : ["member since dates", "joined on dates"],
                            type: "date",
                            daysBack: 365 * 2
                        }, {
                            name: ["Address", "MailingAddress"],
                            single: ["address", "mailing address"],
                            plural: ["addresses", "mailing addresses"],
                            type: "fullAddress"
                        }, L([{
                            name: ["Purchases", "NumberOfPurchases"],
                            single: ["number of purchases", "number of purchases"],
                            plural: ["number of purchases", "number of purchases"],
                            type: "number",
                            min: 0,
                            max: 50
                        }, {
                            name: ["Comments", "NumberOfComments"],
                            single: ["number of comments", "number of comments"],
                            plural: ["number of comments", "number of comments"],
                            type: "number",
                            min: 0,
                            max: 200
                        }])],
                        numberOfRows: jn,
                        rules: {}
                    })],
                    values: [],
                    brief: [L(["A hacked site " + e + "' details have surfaced on a darknet forum.", "White hat hacker has sent SQLPD exposed " + e + "' details of a shady site connected to various persons of interest."])]
                }
            },
            mailingList: () => ({
                type: "whole-table",
                db: [Pn({
                    name: "mailing_list",
                    columns: [...po, {
                        type: "email",
                        dependOn: [-1, -2]
                    }, {
                        name: ["Joined", "JoinDate"],
                        single: ["join date", "join date"],
                        plural: ["join dates", "join dates"],
                        type: "date",
                        daysBack: 1095
                    }, L([{
                        name: ["Promotions", "PromotionsSent"],
                        single: ["number of promotions sent", "number of promotions sent"],
                        plural: ["number of promotions sent", "number of promotions sent"],
                        type: "number",
                        min: 0,
                        max: 10
                    }, {
                        name: ["PasswordChanges", "PassChangeCount"],
                        single: ["number of password changes", "number of password changes"],
                        plural: ["number of password changes", "number of password changes"],
                        type: "number",
                        min: 0,
                        max: 10
                    }, {
                        name: ["NumberOfKids", "Children"],
                        single: ["number of kids", "number of children"],
                        plural: ["number of kids", "number of children"],
                        type: "number",
                        min: 0,
                        max: 4
                    }])],
                    numberOfRows: jn,
                    rules: {}
                })],
                values: [],
                brief: ["A mailing list of an illegal online service was sent to the SQLPD hot-line."]
            })
        }
    },
    Gc = ({
        headers: e
    }, t = !1) => e.map(({
        single: n,
        plural: r
    }) => t ? n : r).join(", ").replace(/(.*), (.*)/, "$1 and $2"),
    Bc = ({
        headers: e
    }, t) => t.every(n => e.map(r => r.type).includes(n)),
    Zc = [void 0, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    mo = e => {
        const [t, n, r] = e.split("-");
        return `${Zc[Number(n)]} ${Number(r)}${r.endsWith("1")?"st":r.endsWith("2")?"nd":r.endsWith("3")?"rd":"th"} ${t}`
    },
    Uc = e => {
        const [t, n] = e.split(":"), r = Number(t) - 12 > 0 ? "PM" : "AM";
        return `${Number(t)-12>0?Number(t)-12:Number(t)}:${n}${r}`
    },
    Dn = e => {
        const [t, n] = e.split(" ");
        return n ? `${mo(t)} at ${Uc(n)}` : mo(t)
    },
    Jc = ({
        table: e,
        column: t,
        operator: n,
        value: r,
        type: o,
        boolOp: s
    }) => {
        if (o === "number") {
            if (n === "in" || n === "not in") return `
        ${L(n.includes("not")?["that do not have","without"]:["that have","with"])}
        ${r.join(", ").trim().replace(/, ([^,]+)$/," or $1")}
        ${Re(e,t).replace("number of ","")}
        ${s||""}
      `;
            if (n === "between" || n === "not between") {
                const [i, c] = r, [a, u] = n.includes("not") ? L([
                    ["with less than", "or more than"],
                    ["that do not have between", "and"]
                ]) : L([
                    ["that have at least", "but not more than"],
                    ["that have between", "and"]
                ]);
                return `
        ${a}
        ${i}
        ${u}
        ${c}
        ${Re(e,t).replace("number of ","")}
        ${s||""}
      `
            }
            return `${{"=":L(["that have","with"]),"!=":L(["that do not have"]),">":L(["that have more than","with more than"]),"<":L(["that have less than","with less than"]),">=":L(["that have at least","with at least"]),"<=":L(["that have at most","with at most"])}[n]} ${r[0]===0&&n==="="?"no":r[0]} ${(r[0]===1?we:Re)(e,t).replace("number of ","")} ${s||""}`
        } else if (o === "date" || o === "timestamp") {
            if (n === "between" || n === "not between") {
                const [i, c] = r, [a, u] = n.includes("not") ? L([
                    ["before", "or after"],
                    ["not between", "and"]
                ]) : L([
                    ["on or after", "but not after"],
                    ["between", "and"]
                ]);
                return `
        with ${Re(e,t)}
        ${a}
        ${Dn(i)}
        ${u}
        ${Dn(c)}
        ${s||""}
      `
            }
            return `with ${Re(e,t)}
      ${{"=":L(["of","on"]),"!=":"not on",">":"after","<":"before",">=":"on or after","<=":"that came before or on"}[n]} ${Dn(r[0])} ${s||""}
      `
        } else if (o === "string") return n === "in" || n === "not in" ? `
        ${n.includes("not")?`that do not have a ${we(e,t)} of`:`that have a ${we(e,t)} of`}
        ${r.join(", ").trim().replace(/, ([^,]+)$/," or $1")}
        ${s||""}
      ` : `
      ${{"=":`that have a ${we(e,t)} of`,"!=":`that do not have a ${we(e,t)} of`,">":`whose ${we(e,t)} is bigger than`,"<":`whose ${we(e,t)} is smaller than`,">=":`whose ${we(e,t)} is bigger than or equal to`,"<=":`whose ${we(e,t)} is smaller than or equal to`}[n]} ${r[0]} ${s||""}
      `
    };

function Xc(e, t) {
    let n = t.brief[0];
    const r = t.db[0].name,
        o = r.includes("_") ? L(["entries", "records"]) : r,
        s = t.where ? ` ${t.where.map(Jc).join(" ")} ` : "' details",
        i = e.includes("sort-one") || e.includes("sort-one-desc") || e.includes("sorted") ? ` ${e.includes("limit")?"when ":""}sorted by ` + t.sort.map(([a, u]) => `${Re(t.db[0],a)} in ${u==="ASC"?"ascending":"descending"} order`).join(" and then by ") : "",
        c = e.includes("limit") ? "the top " + ct(t.resultTable) : "all";
    if (e.includes("table")) n += " Please submit " + c + " " + o, n += s, n += i, n = n.trim() + ".";
    else if (e.includes("columns") || e.includes("one-column")) n += " Please submit " + c + " " + (o + " " + Gc(t.resultTable) + s + i).trim() + ".";
    else throw new Error("Unsupported attributes in mission generation");
    return e.includes("no-dups") && (n += " Please make sure there are no duplicates."), n
}
const Vc = ["number", "date", "timestamp", "string"],
    qc = ["=", "><", "><=", "!=", "in", "not in", "between", "not between"],
    zc = ["and", "or"],
    yo = (e, t, n) => {
        let r, o, s;
        const i = n.db[0].headers.filter(d => d.name !== "#").filter(d => e === d.type).map(d => d.name),
            c = L(i),
            a = _a(n.db[0], c).filter((d, f, h) => h.indexOf(d) === f),
            u = [],
            l = {
                "=": "=",
                "!=": "!=",
                "><": L([">", "<"]),
                "><=": L([">=", "<="]),
                in: "in",
                "not in": "not in",
                between: "between",
                "not between": "not between"
            }[t];
        if (l === "in" || l === "not in") u.push(...Nt(a, 3)), r = {
            op: l,
            left: {
                column: c
            },
            right: {
                type: "list",
                value: u
            }
        };
        else if (l === "between" || l === "not between") {
            const [d, f] = Nt(a, 2).sort((m, b) => typeof m == "number" ? m - b : m < b ? -1 : m > b ? 1 : 0);
            u.push(d, f);
            const h = l.includes("not");
            r = {
                op: h ? "or" : "and",
                left: {
                    op: h ? "<" : ">=",
                    left: {
                        column: c
                    },
                    right: {
                        type: e === "number" ? "number" : "string",
                        value: d
                    }
                },
                right: {
                    op: h ? ">" : "<=",
                    left: {
                        column: c
                    },
                    right: {
                        type: e === "number" ? "number" : "string",
                        value: f
                    }
                }
            }
        } else {
            const d = a.reduce((m, b) => m < b ? m : b),
                f = a.reduce((m, b) => m > b ? m : b),
                h = L(t !== "><" ? a : a.filter(m => m !== d && m != f));
            u.push(h), r = {
                op: l,
                left: {
                    column: c
                },
                right: {
                    type: e === "number" ? "number" : "string",
                    value: h
                }
            }
        }
        return o = {
            table: n.db[0],
            column: c,
            operator: l,
            value: u,
            type: e
        }, s = u.map(d => e === "number" ? "" + d : `'${d}'`), {
            where: o,
            whereTree: r,
            briefValues: s
        }
    };

function Yc(e) {
    let t, n = [e.includes("number") ? "number" : "", e.includes("date") ? "date" : "", e.includes("timestamp") ? "timestamp" : "", e.includes("string") ? "string" : ""].filter(i => i);
    do {
        let i = L(Object.keys(Wn)),
            c = L(Object.keys(Wn[i]));
        t = Wn[i][c](), t.db[0] = Ca(t.db[0])
    } while (!Bc(t.db[0], n));
    const r = t.db[0].headers.filter(i => i.name !== "#").map(i => i.name),
        o = e.filter(i => Vc.includes(i) || qc.includes(i) || zc.includes(i));
    if (o.length) {
        const i = o.shift(),
            c = o.shift(),
            {
                where: a,
                whereTree: u,
                briefValues: l
            } = yo(i, c, t),
            d = o.shift();
        if (!d) t.where = [a], t.whereTree = u, t.values.push(...l);
        else {
            const f = o.shift(),
                h = o.shift(),
                {
                    where: m,
                    whereTree: b,
                    briefValues: p
                } = yo(f, h, t);
            t.where = [{ ...a,
                boolOp: d
            }, m], t.whereTree = {
                op: d,
                left: u,
                right: b
            }, t.values.push(...l, ...p)
        }
    }
    t.where && t.whereTree;
    const s = e.includes("one-column") ? 1 : e.includes("columns") ? te(2, 3) : r.length;
    if (e.includes("columns") || e.includes("one-column") || e.includes("table")) {
        t.where && (t.resultTable = Wi(t.resultTable || t.db[0], t.whereTree));
        const i = Nt(r, s);
        t.resultTable = Tn(t.resultTable || t.db[0], [{
            column: "#"
        }, ...i.map(c => ({
            column: c
        }))])
    }
    if (e.includes("no-dups") && (t.resultTable = Mr(t.resultTable)), e.includes("sort-one") || e.includes("sort-one-desc") || e.includes("sorted")) {
        const i = t.resultTable || t.db[0],
            c = i.headers.filter(u => u.name !== "#").map(u => u.name),
            a = Nt(c, e.includes("sort-one") || e.includes("sort-one-desc") || e.includes("one-column") ? 1 : 2);
        t.sort = a.map(u => [u, e.includes("sort-one") ? "ASC" : e.includes("sort-one-desc") ? "DESC" : L(["ASC", "DESC"])]), t.resultTable = Pr(i, t.sort.map(([u, l]) => ({
            column: u,
            desc: l === "DESC"
        })))
    }
    if (e.includes("limit")) {
        const i = L([3, 5, 10, 20]),
            c = t.resultTable || t.db[0];
        t.resultTable = Di(c, i), t.values.push("" + i)
    }
    if (e.includes("no-dups")) {
        const i = Ea(t.resultTable || t.db[0]);
        Nt(i, te(1, Math.min(i.length, 3))).forEach(a => t.db[0].data.push(t.db[0].data[a].slice(0)))
    }
    return t.db[0] = so(t.db[0]), t.resultTable && (t.resultTable = so(t.resultTable)), t.brief[0] = Xc(e, t), t
}
const go = e => e.charAt(0).toUpperCase() + e.slice(1),
    $c = ({
        rank: e,
        solved: t,
        missionAttributes: n
    }, r) => {
        const o = Yc(n),
            s = {
                "fill-in": `
      Use SQL and choose values from the results to fill in the 
      blanks above.`,
                "whole-table": `
      Use SQL to retrieve the data and submit the resulting table.`
            }[o.type];
        return { ...o,
            instructions: s,
            checkAnswer: c => {
                if (n.includes("table") || n.includes("columns") || n.includes("one-column")) {
                    const a = Ta(c, o.resultTable || o.db[0]);
                    if (!a.result) {
                        if (n.includes("no-dups") && ct(c) !== ct(Mr(c))) return {
                            isSuccessful: !1,
                            response: (n.includes("one-column") ? "Some " + c.headers[0].plural + " appear more than once." : "Results contain duplicate entries.") + "<BR>Did you use DISTINCT?"
                        };
                        if (n.includes("limit")) {
                            const f = ct(o.resultTable);
                            if (ct(c) !== f) return {
                                isSuccessful: !1,
                                response: "Expected to get only the top " + f + " rows.<BR>Did you use LIMIT?"
                            }
                        }
                        if (o.where && a.reason === "Unexpected rows") return {
                            isSuccessful: !1,
                            response: "Result does not match the request.<BR>Did you use the right conditions in the WHERE clause?"
                        }
                    }
                    if ((n.includes("sort-one") || n.includes("sort-one-desc") || n.includes("sorted")) && a.result && !a.sameOrder) return {
                        isSuccessful: !1,
                        response: "Content seems ok, but the ordering is off.<BR>Did you sort the resulting table?"
                    };
                    let u = "";
                    const l = /Missing column (.*)/.exec(a.reason) || /Unexpected column (.*)/.exec(a.reason);
                    l && l[1] && (/Missing column/.test(a.reason) && (u = Re(o.resultTable, l[1])), /Unexpected column/.test(a.reason) && (u = Re(c, l[1])));
                    const d = a.reason ? a.reason.replace(/Missing column (.*)/, go(u + " should be submitted as well.")).replace(/Unexpected column (.*)/, go(u + " should not be submitted.")) : "";
                    return {
                        isSuccessful: a.result,
                        response: d || ns()
                    }
                } else throw new Error("unimplemented attribute checkAnswer")
            }
        }
    },
    Ke = document.querySelector(".query"),
    vo = document.querySelector(".placeholder"),
    Qc = () => {
        const e = Ke.querySelectorAll(".query-part");
        !e.length && !Ke.querySelector(".placeholder") && Ke.appendChild(vo), e.length && Ke.querySelector(".placeholder") && Ke.removeChild(vo);
        let t = !1;
        for (let n = 0; n < e.length; ++n) {
            const r = e[n],
                o = e[n + 1],
                s = e[n - 1],
                i = r.getAttribute("data-type"),
                c = o ? o.getAttribute("data-type") : void 0;
            let a = r.innerHTML.trim(),
                u = "",
                l = "";
            const d = o ? o.innerHTML.trim() : void 0,
                f = s ? s.innerHTML.trim() : void 0,
                h = c === "semicolon" ? "" : " ";
            (a.endsWith(",") || a.endsWith(".") || a.endsWith(")")) && a !== "." && a !== "," && a !== ")" && (a = a.substr(0, a.length - 1)), a[0] === "(" && a !== "(" && (a = a.substr(1)), a.endsWith(" AND") && (a = a.substr(0, a.length - 4)), (i === "field" || i === "value" || i === "sort-order" || a === "*") && (c === "field" || c === "table" || c === "value" || d === "*") && (l = ","), i === "table" && (c === "field" || d === "*") && (l = "."), t ? (i === "value" && c !== "value" && (l = ")"), i != "value" ? t = !1 : f === "IN" && (u = "(")) : a === "IN" && (t = !0), f === "BETWEEN" && (l = " AND"), r.innerHTML = u + a + l + (l === "." ? "" : h)
        }
        for (let n = 0; n < e.length; ++n) {
            const r = e[n],
                o = e[n - 1];
            let s = r.innerHTML.trim();
            const i = o ? o.innerHTML.trim() : void 0;
            (i === "&lt;" || i === "&gt;") && s === "=" ? (o.innerText = o.innerText.trim() + "= ", Ke.removeChild(r)) : i === "&lt;" && s === "&gt;" && (o.innerText = "<> ", Ke.removeChild(r))
        }
    };
var lr = function(e, t) {
    return lr = Object.setPrototypeOf || {
        __proto__: []
    }
    instanceof Array && function(n, r) {
        n.__proto__ = r
    } || function(n, r) {
        for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (n[o] = r[o])
    }, lr(e, t)
};

function tt(e, t) {
    if (typeof t != "function" && t !== null) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

    function n() {
        this.constructor = e
    }
    lr(e, t), e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n)
}
var O = function() {
    return O = Object.assign || function(e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
            for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        return e
    }, O.apply(this, arguments)
};

function re(e, t) {
    var n = {};
    for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function") {
        var o = 0;
        for (r = Object.getOwnPropertySymbols(e); o < r.length; o++) t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]])
    }
    return n
}

function P(e, t, n, r) {
    return new(n || (n = Promise))(function(o, s) {
        function i(u) {
            try {
                a(r.next(u))
            } catch (l) {
                s(l)
            }
        }

        function c(u) {
            try {
                a(r.throw(u))
            } catch (l) {
                s(l)
            }
        }

        function a(u) {
            var l;
            u.done ? o(u.value) : (l = u.value, l instanceof n ? l : new n(function(d) {
                d(l)
            })).then(i, c)
        }
        a((r = r.apply(e, t || [])).next())
    })
}

function j(e, t) {
    var n, r, o, s, i = {
        label: 0,
        sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
        },
        trys: [],
        ops: []
    };
    return s = {
        next: c(0),
        throw: c(1),
        return: c(2)
    }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
        return this
    }), s;

    function c(a) {
        return function(u) {
            return function(l) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; i;) try {
                    if (n = 1, r && (o = 2 & l[0] ? r.return : l[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, l[1])).done) return o;
                    switch (r = 0, o && (l = [2 & l[0], o.value]), l[0]) {
                        case 0:
                        case 1:
                            o = l;
                            break;
                        case 4:
                            return i.label++, {
                                value: l[1],
                                done: !1
                            };
                        case 5:
                            i.label++, r = l[1], l = [0];
                            continue;
                        case 7:
                            l = i.ops.pop(), i.trys.pop();
                            continue;
                        default:
                            if (o = i.trys, !((o = o.length > 0 && o[o.length - 1]) || l[0] !== 6 && l[0] !== 2)) {
                                i = 0;
                                continue
                            }
                            if (l[0] === 3 && (!o || l[1] > o[0] && l[1] < o[3])) {
                                i.label = l[1];
                                break
                            }
                            if (l[0] === 6 && i.label < o[1]) {
                                i.label = o[1], o = l;
                                break
                            }
                            if (o && i.label < o[2]) {
                                i.label = o[2], i.ops.push(l);
                                break
                            }
                            o[2] && i.ops.pop(), i.trys.pop();
                            continue
                    }
                    l = t.call(e, i)
                } catch (d) {
                    l = [6, d], r = 0
                } finally {
                    n = o = 0
                }
                if (5 & l[0]) throw l[1];
                return {
                    value: l[0] ? l[1] : void 0,
                    done: !0
                }
            }([a, u])
        }
    }
}

function ht(e, t) {
    var n = typeof Symbol == "function" && e[Symbol.iterator];
    if (!n) return e;
    var r, o, s = n.call(e),
        i = [];
    try {
        for (;
            (t === void 0 || t-- > 0) && !(r = s.next()).done;) i.push(r.value)
    } catch (c) {
        o = {
            error: c
        }
    } finally {
        try {
            r && !r.done && (n = s.return) && n.call(s)
        } finally {
            if (o) throw o.error
        }
    }
    return i
}

function dr(e, t, n) {
    if (n || arguments.length === 2)
        for (var r, o = 0, s = t.length; o < s; o++) !r && o in t || (r || (r = Array.prototype.slice.call(t, 0, o)), r[o] = t[o]);
    return e.concat(r || Array.prototype.slice.call(t))
}
var ye = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};

function Dr(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}

function vt(e, t) {
    return e(t = {
        exports: {}
    }, t.exports), t.exports
}
var xe, nn, Ut = function(e) {
        return e && e.Math == Math && e
    },
    A = Ut(typeof globalThis == "object" && globalThis) || Ut(typeof window == "object" && window) || Ut(typeof self == "object" && self) || Ut(typeof ye == "object" && ye) || function() {
        return this
    }() || Function("return this")(),
    K = function(e) {
        try {
            return !!e()
        } catch {
            return !0
        }
    },
    D = !K(function() {
        return Object.defineProperty({}, 1, {
            get: function() {
                return 7
            }
        })[1] != 7
    }),
    Ft = !K(function() {
        var e = function() {}.bind();
        return typeof e != "function" || e.hasOwnProperty("prototype")
    }),
    Jt = Function.prototype.call,
    ee = Ft ? Jt.bind(Jt) : function() {
        return Jt.apply(Jt, arguments)
    },
    bo = {}.propertyIsEnumerable,
    wo = Object.getOwnPropertyDescriptor,
    eu = wo && !bo.call({
        1: 2
    }, 1) ? function(e) {
        var t = wo(this, e);
        return !!t && t.enumerable
    } : bo,
    Hr = {
        f: eu
    },
    $e = function(e, t) {
        return {
            enumerable: !(1 & e),
            configurable: !(2 & e),
            writable: !(4 & e),
            value: t
        }
    },
    os = Function,
    is = os.prototype,
    tu = is.bind,
    fr = is.call,
    nu = Ft && tu.bind(fr, fr),
    N = function(e) {
        return e instanceof os ? Ft ? nu(e) : function() {
            return fr.apply(e, arguments)
        } : void 0
    },
    ru = N({}.toString),
    ou = N("".slice),
    Ce = function(e) {
        return ou(ru(e), 8, -1)
    },
    Hn = Object,
    iu = N("".split),
    ss = K(function() {
        return !Hn("z").propertyIsEnumerable(0)
    }) ? function(e) {
        return Ce(e) == "String" ? iu(e, "") : Hn(e)
    } : Hn,
    bt = function(e) {
        return e == null
    },
    su = TypeError,
    Kt = function(e) {
        if (bt(e)) throw su("Can't call method on " + e);
        return e
    },
    be = function(e) {
        return ss(Kt(e))
    },
    Fn = typeof document == "object" && document.all,
    En = {
        all: Fn,
        IS_HTMLDDA: Fn === void 0 && Fn !== void 0
    },
    au = En.all,
    F = En.IS_HTMLDDA ? function(e) {
        return typeof e == "function" || e === au
    } : function(e) {
        return typeof e == "function"
    },
    cu = En.all,
    G = En.IS_HTMLDDA ? function(e) {
        return typeof e == "object" ? e !== null : F(e) || e === cu
    } : function(e) {
        return typeof e == "object" ? e !== null : F(e)
    },
    uu = function(e) {
        return F(e) ? e : void 0
    },
    pe = function(e, t) {
        return arguments.length < 2 ? uu(A[e]) : A[e] && A[e][t]
    },
    Qe = N({}.isPrototypeOf),
    Kn = pe("navigator", "userAgent") || "",
    So = A.process,
    ko = A.Deno,
    To = So && So.versions || ko && ko.version,
    Co = To && To.v8;
Co && (nn = (xe = Co.split("."))[0] > 0 && xe[0] < 4 ? 1 : +(xe[0] + xe[1])), !nn && Kn && (!(xe = Kn.match(/Edge\/(\d+)/)) || xe[1] >= 74) && (xe = Kn.match(/Chrome\/(\d+)/)) && (nn = +xe[1]);
var hn = nn,
    ce = !!Object.getOwnPropertySymbols && !K(function() {
        var e = Symbol();
        return !String(e) || !(Object(e) instanceof Symbol) || !Symbol.sham && hn && hn < 41
    }),
    Fr = ce && !Symbol.sham && typeof Symbol.iterator == "symbol",
    lu = Object,
    pt = Fr ? function(e) {
        return typeof e == "symbol"
    } : function(e) {
        var t = pe("Symbol");
        return F(t) && Qe(t.prototype, lu(e))
    },
    du = String,
    wt = function(e) {
        try {
            return du(e)
        } catch {
            return "Object"
        }
    },
    fu = TypeError,
    Kr = function(e) {
        if (F(e)) return e;
        throw fu(wt(e) + " is not a function")
    },
    pn = function(e, t) {
        var n = e[t];
        return bt(n) ? void 0 : Kr(n)
    },
    hu = TypeError,
    pu = Object.defineProperty,
    Gr = function(e, t) {
        try {
            pu(A, e, {
                value: t,
                configurable: !0,
                writable: !0
            })
        } catch {
            A[e] = t
        }
        return t
    },
    Pe = A["__core-js_shared__"] || Gr("__core-js_shared__", {}),
    He = vt(function(e) {
        (e.exports = function(t, n) {
            return Pe[t] || (Pe[t] = n !== void 0 ? n : {})
        })("versions", []).push({
            version: "3.25.4",
            mode: "global",
            copyright: "© 2014-2022 Denis Pushkarev (zloirock.ru)",
            license: "https://github.com/zloirock/core-js/blob/v3.25.4/LICENSE",
            source: "https://github.com/zloirock/core-js"
        })
    }),
    mu = Object,
    St = function(e) {
        return mu(Kt(e))
    },
    yu = N({}.hasOwnProperty),
    I = Object.hasOwn || function(e, t) {
        return yu(St(e), t)
    },
    gu = 0,
    vu = Math.random(),
    bu = N(1.toString),
    mt = function(e) {
        return "Symbol(" + (e === void 0 ? "" : e) + ")_" + bu(++gu + vu, 36)
    },
    Ct = He("wks"),
    ze = A.Symbol,
    Eo = ze && ze.for,
    wu = Fr ? ze : ze && ze.withoutSetter || mt,
    U = function(e) {
        if (!I(Ct, e) || !ce && typeof Ct[e] != "string") {
            var t = "Symbol." + e;
            ce && I(ze, e) ? Ct[e] = ze[e] : Ct[e] = Fr && Eo ? Eo(t) : wu(t)
        }
        return Ct[e]
    },
    Su = TypeError,
    ku = U("toPrimitive"),
    Tu = function(e, t) {
        if (!G(e) || pt(e)) return e;
        var n, r = pn(e, ku);
        if (r) {
            if (t === void 0 && (t = "default"), n = ee(r, e, t), !G(n) || pt(n)) return n;
            throw Su("Can't convert object to primitive value")
        }
        return t === void 0 && (t = "number"),
            function(o, s) {
                var i, c;
                if (s === "string" && F(i = o.toString) && !G(c = ee(i, o)) || F(i = o.valueOf) && !G(c = ee(i, o)) || s !== "string" && F(i = o.toString) && !G(c = ee(i, o))) return c;
                throw hu("Can't convert object to primitive value")
            }(e, t)
    },
    et = function(e) {
        var t = Tu(e, "string");
        return pt(t) ? t : t + ""
    },
    hr = A.document,
    Cu = G(hr) && G(hr.createElement),
    as = function(e) {
        return Cu ? hr.createElement(e) : {}
    },
    cs = !D && !K(function() {
        return Object.defineProperty(as("div"), "a", {
            get: function() {
                return 7
            }
        }).a != 7
    }),
    _o = Object.getOwnPropertyDescriptor,
    Gt = {
        f: D ? _o : function(e, t) {
            if (e = be(e), t = et(t), cs) try {
                return _o(e, t)
            } catch {}
            if (I(e, t)) return $e(!ee(Hr.f, e, t), e[t])
        }
    },
    us = D && K(function() {
        return Object.defineProperty(function() {}, "prototype", {
            value: 42,
            writable: !1
        }).prototype != 42
    }),
    Eu = String,
    _u = TypeError,
    V = function(e) {
        if (G(e)) return e;
        throw _u(Eu(e) + " is not an object")
    },
    Lu = TypeError,
    Gn = Object.defineProperty,
    Iu = Object.getOwnPropertyDescriptor,
    $ = {
        f: D ? us ? function(e, t, n) {
            if (V(e), t = et(t), V(n), typeof e == "function" && t === "prototype" && "value" in n && "writable" in n && !n.writable) {
                var r = Iu(e, t);
                r && r.writable && (e[t] = n.value, n = {
                    configurable: "configurable" in n ? n.configurable : r.configurable,
                    enumerable: "enumerable" in n ? n.enumerable : r.enumerable,
                    writable: !1
                })
            }
            return Gn(e, t, n)
        } : Gn : function(e, t, n) {
            if (V(e), t = et(t), V(n), cs) try {
                return Gn(e, t, n)
            } catch {}
            if ("get" in n || "set" in n) throw Lu("Accessors not supported");
            return "value" in n && (e[t] = n.value), e
        }
    },
    _n = D ? function(e, t, n) {
        return $.f(e, t, $e(1, n))
    } : function(e, t, n) {
        return e[t] = n, e
    },
    ls = Function.prototype,
    xu = D && Object.getOwnPropertyDescriptor,
    Bn = I(ls, "name"),
    Br = {
        EXISTS: Bn,
        PROPER: Bn && function() {}.name === "something",
        CONFIGURABLE: Bn && (!D || D && xu(ls, "name").configurable)
    },
    Ou = N(Function.toString);
F(Pe.inspectSource) || (Pe.inspectSource = function(e) {
    return Ou(e)
});
var mn, Mt, yn, ds = Pe.inspectSource,
    Lo = A.WeakMap,
    Au = F(Lo) && /native code/.test(String(Lo)),
    Io = He("keys"),
    Ln = function(e) {
        return Io[e] || (Io[e] = mt(e))
    },
    kt = {},
    pr = A.TypeError,
    Ru = A.WeakMap;
if (Au || Pe.state) {
    var Ge = Pe.state || (Pe.state = new Ru),
        Nu = N(Ge.get),
        xo = N(Ge.has),
        Mu = N(Ge.set);
    mn = function(e, t) {
        if (xo(Ge, e)) throw pr("Object already initialized");
        return t.facade = e, Mu(Ge, e, t), t
    }, Mt = function(e) {
        return Nu(Ge, e) || {}
    }, yn = function(e) {
        return xo(Ge, e)
    }
} else {
    var rt = Ln("state");
    kt[rt] = !0, mn = function(e, t) {
        if (I(e, rt)) throw pr("Object already initialized");
        return t.facade = e, _n(e, rt, t), t
    }, Mt = function(e) {
        return I(e, rt) ? e[rt] : {}
    }, yn = function(e) {
        return I(e, rt)
    }
}
var le = {
        set: mn,
        get: Mt,
        has: yn,
        enforce: function(e) {
            return yn(e) ? Mt(e) : mn(e, {})
        },
        getterFor: function(e) {
            return function(t) {
                var n;
                if (!G(t) || (n = Mt(t)).type !== e) throw pr("Incompatible receiver, " + e + " required");
                return n
            }
        }
    },
    Pu = vt(function(e) {
        var t = Br.CONFIGURABLE,
            n = le.enforce,
            r = le.get,
            o = Object.defineProperty,
            s = D && !K(function() {
                return o(function() {}, "length", {
                    value: 8
                }).length !== 8
            }),
            i = String(String).split("String"),
            c = e.exports = function(a, u, l) {
                String(u).slice(0, 7) === "Symbol(" && (u = "[" + String(u).replace(/^Symbol\(([^)]*)\)/, "$1") + "]"), l && l.getter && (u = "get " + u), l && l.setter && (u = "set " + u), (!I(a, "name") || t && a.name !== u) && (D ? o(a, "name", {
                    value: u,
                    configurable: !0
                }) : a.name = u), s && l && I(l, "arity") && a.length !== l.arity && o(a, "length", {
                    value: l.arity
                });
                try {
                    l && I(l, "constructor") && l.constructor ? D && o(a, "prototype", {
                        writable: !1
                    }) : a.prototype && (a.prototype = void 0)
                } catch {}
                var d = n(a);
                return I(d, "source") || (d.source = i.join(typeof u == "string" ? u : "")), a
            };
        Function.prototype.toString = c(function() {
            return F(this) && r(this).source || ds(this)
        }, "toString")
    }),
    ne = function(e, t, n, r) {
        r || (r = {});
        var o = r.enumerable,
            s = r.name !== void 0 ? r.name : t;
        if (F(n) && Pu(n, s, r), r.global) o ? e[t] = n : Gr(t, n);
        else {
            try {
                r.unsafe ? e[t] && (o = !0) : delete e[t]
            } catch {}
            o ? e[t] = n : $.f(e, t, {
                value: n,
                enumerable: !1,
                configurable: !r.nonConfigurable,
                writable: !r.nonWritable
            })
        }
        return e
    },
    ju = Math.ceil,
    Wu = Math.floor,
    Du = Math.trunc || function(e) {
        var t = +e;
        return (t > 0 ? Wu : ju)(t)
    },
    Zr = function(e) {
        var t = +e;
        return t != t || t === 0 ? 0 : Du(t)
    },
    Hu = Math.max,
    Fu = Math.min,
    mr = function(e, t) {
        var n = Zr(e);
        return n < 0 ? Hu(n + t, 0) : Fu(n, t)
    },
    Ku = Math.min,
    fs = function(e) {
        return e > 0 ? Ku(Zr(e), 9007199254740991) : 0
    },
    Tt = function(e) {
        return fs(e.length)
    },
    Oo = function(e) {
        return function(t, n, r) {
            var o, s = be(t),
                i = Tt(s),
                c = mr(r, i);
            if (e && n != n) {
                for (; i > c;)
                    if ((o = s[c++]) != o) return !0
            } else
                for (; i > c; c++)
                    if ((e || c in s) && s[c] === n) return e || c || 0;
            return !e && -1
        }
    },
    hs = {
        includes: Oo(!0),
        indexOf: Oo(!1)
    },
    Gu = hs.indexOf,
    Ao = N([].push),
    ps = function(e, t) {
        var n, r = be(e),
            o = 0,
            s = [];
        for (n in r) !I(kt, n) && I(r, n) && Ao(s, n);
        for (; t.length > o;) I(r, n = t[o++]) && (~Gu(s, n) || Ao(s, n));
        return s
    },
    gn = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
    Bu = gn.concat("length", "prototype"),
    Pt = {
        f: Object.getOwnPropertyNames || function(e) {
            return ps(e, Bu)
        }
    },
    In = {
        f: Object.getOwnPropertySymbols
    },
    Zu = N([].concat),
    Uu = pe("Reflect", "ownKeys") || function(e) {
        var t = Pt.f(V(e)),
            n = In.f;
        return n ? Zu(t, n(e)) : t
    },
    ms = function(e, t, n) {
        for (var r = Uu(t), o = $.f, s = Gt.f, i = 0; i < r.length; i++) {
            var c = r[i];
            I(e, c) || n && I(n, c) || o(e, c, s(t, c))
        }
    },
    Ju = /#|\.prototype\./,
    Bt = function(e, t) {
        var n = Vu[Xu(e)];
        return n == zu || n != qu && (F(t) ? K(t) : !!t)
    },
    Xu = Bt.normalize = function(e) {
        return String(e).replace(Ju, ".").toLowerCase()
    },
    Vu = Bt.data = {},
    qu = Bt.NATIVE = "N",
    zu = Bt.POLYFILL = "P",
    yr = Bt,
    Yu = Gt.f,
    q = function(e, t) {
        var n, r, o, s, i, c = e.target,
            a = e.global,
            u = e.stat;
        if (n = a ? A : u ? A[c] || Gr(c, {}) : (A[c] || {}).prototype)
            for (r in t) {
                if (s = t[r], o = e.dontCallGetSet ? (i = Yu(n, r)) && i.value : n[r], !yr(a ? r : c + (u ? "." : "#") + r, e.forced) && o !== void 0) {
                    if (typeof s == typeof o) continue;
                    ms(s, o)
                }(e.sham || o && o.sham) && _n(s, "sham", !0), ne(n, r, s, e)
            }
    },
    ys = {};
ys[U("toStringTag")] = "z";
var Zn, Ur = String(ys) === "[object z]",
    $u = U("toStringTag"),
    Qu = Object,
    el = Ce(function() {
        return arguments
    }()) == "Arguments",
    nt = Ur ? Ce : function(e) {
        var t, n, r;
        return e === void 0 ? "Undefined" : e === null ? "Null" : typeof(n = function(o, s) {
            try {
                return o[s]
            } catch {}
        }(t = Qu(e), $u)) == "string" ? n : el ? Ce(t) : (r = Ce(t)) == "Object" && F(t.callee) ? "Arguments" : r
    },
    tl = String,
    _e = function(e) {
        if (nt(e) === "Symbol") throw TypeError("Cannot convert a Symbol value to a string");
        return tl(e)
    },
    nl = U("match"),
    rl = TypeError,
    gs = function(e) {
        if (function(t) {
                var n;
                return G(t) && ((n = t[nl]) !== void 0 ? !!n : Ce(t) == "RegExp")
            }(e)) throw rl("The method doesn't accept regular expressions");
        return e
    },
    ol = U("match"),
    vs = function(e) {
        var t = /./;
        try {
            "/./" [e](t)
        } catch {
            try {
                return t[ol] = !1, "/./" [e](t)
            } catch {}
        }
        return !1
    },
    il = Gt.f,
    Ro = N("".startsWith),
    sl = N("".slice),
    al = Math.min,
    bs = vs("startsWith"),
    cl = !(bs || (Zn = il(String.prototype, "startsWith"), !Zn || Zn.writable));
q({
    target: "String",
    proto: !0,
    forced: !cl && !bs
}, {
    startsWith: function(e) {
        var t = _e(Kt(this));
        gs(e);
        var n = fs(al(arguments.length > 1 ? arguments[1] : void 0, t.length)),
            r = _e(e);
        return Ro ? Ro(t, r, n) : sl(t, n, n + r.length) === r
    }
});
var Jr = function(e, t) {
    return N(A[e].prototype[t])
};
Jr("String", "startsWith");
var vn = Array.isArray || function(e) {
        return Ce(e) == "Array"
    },
    ul = TypeError,
    No = function(e) {
        if (e > 9007199254740991) throw ul("Maximum allowed index exceeded");
        return e
    },
    jt = function(e, t, n) {
        var r = et(t);
        r in e ? $.f(e, r, $e(0, n)) : e[r] = n
    },
    ws = function() {},
    ll = [],
    Ss = pe("Reflect", "construct"),
    Xr = /^\s*(?:class|function)\b/,
    dl = N(Xr.exec),
    fl = !Xr.exec(ws),
    Et = function(e) {
        if (!F(e)) return !1;
        try {
            return Ss(ws, ll, e), !0
        } catch {
            return !1
        }
    },
    ks = function(e) {
        if (!F(e)) return !1;
        switch (nt(e)) {
            case "AsyncFunction":
            case "GeneratorFunction":
            case "AsyncGeneratorFunction":
                return !1
        }
        try {
            return fl || !!dl(Xr, ds(e))
        } catch {
            return !0
        }
    };
ks.sham = !0;
var Mo, Vr = !Ss || K(function() {
        var e;
        return Et(Et.call) || !Et(Object) || !Et(function() {
            e = !0
        }) || e
    }) ? ks : Et,
    hl = U("species"),
    Po = Array,
    Ts = function(e, t) {
        return new(function(n) {
            var r;
            return vn(n) && (r = n.constructor, (Vr(r) && (r === Po || vn(r.prototype)) || G(r) && (r = r[hl]) === null) && (r = void 0)), r === void 0 ? Po : r
        }(e))(t === 0 ? 0 : t)
    },
    pl = U("species"),
    Cs = U("isConcatSpreadable"),
    ml = hn >= 51 || !K(function() {
        var e = [];
        return e[Cs] = !1, e.concat()[0] !== e
    }),
    yl = (Mo = "concat", hn >= 51 || !K(function() {
        var e = [];
        return (e.constructor = {})[pl] = function() {
            return {
                foo: 1
            }
        }, e[Mo](Boolean).foo !== 1
    })),
    gl = function(e) {
        if (!G(e)) return !1;
        var t = e[Cs];
        return t !== void 0 ? !!t : vn(e)
    };
q({
    target: "Array",
    proto: !0,
    arity: 1,
    forced: !ml || !yl
}, {
    concat: function(e) {
        var t, n, r, o, s, i = St(this),
            c = Ts(i, 0),
            a = 0;
        for (t = -1, r = arguments.length; t < r; t++)
            if (gl(s = t === -1 ? i : arguments[t]))
                for (o = Tt(s), No(a + o), n = 0; n < o; n++, a++) n in s && jt(c, a, s[n]);
            else No(a + 1), jt(c, a++, s);
        return c.length = a, c
    }
});
var vl = Ur ? {}.toString : function() {
    return "[object " + nt(this) + "]"
};
Ur || ne(Object.prototype, "toString", vl, {
    unsafe: !0
});
var Xt, qr = Object.keys || function(e) {
        return ps(e, gn)
    },
    bl = D && !us ? Object.defineProperties : function(e, t) {
        V(e);
        for (var n, r = be(t), o = qr(t), s = o.length, i = 0; s > i;) $.f(e, n = o[i++], r[n]);
        return e
    },
    Es = {
        f: bl
    },
    wl = pe("document", "documentElement"),
    _s = Ln("IE_PROTO"),
    Un = function() {},
    Ls = function(e) {
        return "<script>" + e + "<\/script>"
    },
    jo = function(e) {
        e.write(Ls("")), e.close();
        var t = e.parentWindow.Object;
        return e = null, t
    },
    rn = function() {
        try {
            Xt = new ActiveXObject("htmlfile")
        } catch {}
        var e, t;
        rn = typeof document < "u" ? document.domain && Xt ? jo(Xt) : ((t = as("iframe")).style.display = "none", wl.appendChild(t), t.src = "javascript:", (e = t.contentWindow.document).open(), e.write(Ls("document.F=Object")), e.close(), e.F) : jo(Xt);
        for (var n = gn.length; n--;) delete rn.prototype[gn[n]];
        return rn()
    };
kt[_s] = !0;
var We = Object.create || function(e, t) {
        var n;
        return e !== null ? (Un.prototype = V(e), n = new Un, Un.prototype = null, n[_s] = e) : n = rn(), t === void 0 ? n : Es.f(n, t)
    },
    Sl = Array,
    kl = Math.max,
    Is = Pt.f,
    xs = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
    Tl = function(e) {
        try {
            return Is(e)
        } catch {
            return function(n, r, o) {
                for (var s = Tt(n), i = mr(r, s), c = mr(o === void 0 ? s : o, s), a = Sl(kl(c - i, 0)), u = 0; i < c; i++, u++) jt(a, u, n[i]);
                return a.length = u, a
            }(xs)
        }
    },
    zr = {
        f: function(e) {
            return xs && Ce(e) == "Window" ? Tl(e) : Is(be(e))
        }
    },
    Os = {
        f: U
    },
    Wt = A,
    Cl = $.f,
    oe = function(e) {
        var t = Wt.Symbol || (Wt.Symbol = {});
        I(t, e) || Cl(t, e, {
            value: Os.f(e)
        })
    },
    As = function() {
        var e = pe("Symbol"),
            t = e && e.prototype,
            n = t && t.valueOf,
            r = U("toPrimitive");
        t && !t[r] && ne(t, r, function(o) {
            return ee(n, this)
        }, {
            arity: 1
        })
    },
    El = $.f,
    Wo = U("toStringTag"),
    Me = function(e, t, n) {
        e && !n && (e = e.prototype), e && !I(e, Wo) && El(e, Wo, {
            configurable: !0,
            value: t
        })
    },
    _l = N(N.bind),
    xn = function(e, t) {
        return Kr(e), t === void 0 ? e : Ft ? _l(e, t) : function() {
            return e.apply(t, arguments)
        }
    },
    Do = N([].push),
    Oe = function(e) {
        var t = e == 1,
            n = e == 2,
            r = e == 3,
            o = e == 4,
            s = e == 6,
            i = e == 7,
            c = e == 5 || s;
        return function(a, u, l, d) {
            for (var f, h, m = St(a), b = ss(m), p = xn(u, l), v = Tt(b), y = 0, k = d || Ts, M = t ? k(a, v) : n || i ? k(a, 0) : void 0; v > y; y++)
                if ((c || y in b) && (h = p(f = b[y], y, m), e))
                    if (t) M[y] = h;
                    else if (h) switch (e) {
                case 3:
                    return !0;
                case 5:
                    return f;
                case 6:
                    return y;
                case 2:
                    Do(M, f)
            } else switch (e) {
                case 4:
                    return !1;
                case 7:
                    Do(M, f)
            }
            return s ? -1 : r || o ? o : M
        }
    },
    On = {
        forEach: Oe(0),
        map: Oe(1),
        filter: Oe(2),
        some: Oe(3),
        every: Oe(4),
        find: Oe(5),
        findIndex: Oe(6),
        filterReject: Oe(7)
    }.forEach,
    se = Ln("hidden"),
    Ll = le.set,
    Ho = le.getterFor("Symbol"),
    ue = Object.prototype,
    ut = A.Symbol,
    It = ut && ut.prototype,
    Il = A.TypeError,
    Jn = A.QObject,
    Rs = Gt.f,
    Ne = $.f,
    Ns = zr.f,
    xl = Hr.f,
    Ms = N([].push),
    Le = He("symbols"),
    Zt = He("op-symbols"),
    Ol = He("wks"),
    Xn = !Jn || !Jn.prototype || !Jn.prototype.findChild,
    gr = D && K(function() {
        return We(Ne({}, "a", {
            get: function() {
                return Ne(this, "a", {
                    value: 7
                }).a
            }
        })).a != 7
    }) ? function(e, t, n) {
        var r = Rs(ue, t);
        r && delete ue[t], Ne(e, t, n), r && e !== ue && Ne(ue, t, r)
    } : Ne,
    Vn = function(e, t) {
        var n = Le[e] = We(It);
        return Ll(n, {
            type: "Symbol",
            tag: e,
            description: t
        }), D || (n.description = t), n
    },
    bn = function(e, t, n) {
        e === ue && bn(Zt, t, n), V(e);
        var r = et(t);
        return V(n), I(Le, r) ? (n.enumerable ? (I(e, se) && e[se][r] && (e[se][r] = !1), n = We(n, {
            enumerable: $e(0, !1)
        })) : (I(e, se) || Ne(e, se, $e(1, {})), e[se][r] = !0), gr(e, r, n)) : Ne(e, r, n)
    },
    qn = function(e, t) {
        V(e);
        var n = be(t),
            r = qr(n).concat(Ps(n));
        return On(r, function(o) {
            D && !ee(vr, n, o) || bn(e, o, n[o])
        }), e
    },
    vr = function(e) {
        var t = et(e),
            n = ee(xl, this, t);
        return !(this === ue && I(Le, t) && !I(Zt, t)) && (!(n || !I(this, t) || !I(Le, t) || I(this, se) && this[se][t]) || n)
    },
    Fo = function(e, t) {
        var n = be(e),
            r = et(t);
        if (n !== ue || !I(Le, r) || I(Zt, r)) {
            var o = Rs(n, r);
            return !o || !I(Le, r) || I(n, se) && n[se][r] || (o.enumerable = !0), o
        }
    },
    Ko = function(e) {
        var t = Ns(be(e)),
            n = [];
        return On(t, function(r) {
            I(Le, r) || I(kt, r) || Ms(n, r)
        }), n
    },
    Ps = function(e) {
        var t = e === ue,
            n = Ns(t ? Zt : be(e)),
            r = [];
        return On(n, function(o) {
            !I(Le, o) || t && !I(ue, o) || Ms(r, Le[o])
        }), r
    };
ce || (It = (ut = function() {
    if (Qe(It, this)) throw Il("Symbol is not a constructor");
    var e = arguments.length && arguments[0] !== void 0 ? _e(arguments[0]) : void 0,
        t = mt(e),
        n = function(r) {
            this === ue && ee(n, Zt, r), I(this, se) && I(this[se], t) && (this[se][t] = !1), gr(this, t, $e(1, r))
        };
    return D && Xn && gr(ue, t, {
        configurable: !0,
        set: n
    }), Vn(t, e)
}).prototype, ne(It, "toString", function() {
    return Ho(this).tag
}), ne(ut, "withoutSetter", function(e) {
    return Vn(mt(e), e)
}), Hr.f = vr, $.f = bn, Es.f = qn, Gt.f = Fo, Pt.f = zr.f = Ko, In.f = Ps, Os.f = function(e) {
    return Vn(U(e), e)
}, D && (Ne(It, "description", {
    configurable: !0,
    get: function() {
        return Ho(this).description
    }
}), ne(ue, "propertyIsEnumerable", vr, {
    unsafe: !0
}))), q({
    global: !0,
    constructor: !0,
    wrap: !0,
    forced: !ce,
    sham: !ce
}, {
    Symbol: ut
}), On(qr(Ol), function(e) {
    oe(e)
}), q({
    target: "Symbol",
    stat: !0,
    forced: !ce
}, {
    useSetter: function() {
        Xn = !0
    },
    useSimple: function() {
        Xn = !1
    }
}), q({
    target: "Object",
    stat: !0,
    forced: !ce,
    sham: !D
}, {
    create: function(e, t) {
        return t === void 0 ? We(e) : qn(We(e), t)
    },
    defineProperty: bn,
    defineProperties: qn,
    getOwnPropertyDescriptor: Fo
}), q({
    target: "Object",
    stat: !0,
    forced: !ce
}, {
    getOwnPropertyNames: Ko
}), As(), Me(ut, "Symbol"), kt[se] = !0;
var js = ce && !!Symbol.for && !!Symbol.keyFor,
    zn = He("string-to-symbol-registry"),
    Al = He("symbol-to-string-registry");
q({
    target: "Symbol",
    stat: !0,
    forced: !js
}, {
    for: function(e) {
        var t = _e(e);
        if (I(zn, t)) return zn[t];
        var n = pe("Symbol")(t);
        return zn[t] = n, Al[n] = t, n
    }
});
var Go = He("symbol-to-string-registry");
q({
    target: "Symbol",
    stat: !0,
    forced: !js
}, {
    keyFor: function(e) {
        if (!pt(e)) throw TypeError(wt(e) + " is not a symbol");
        if (I(Go, e)) return Go[e]
    }
});
var Ws = Function.prototype,
    Bo = Ws.apply,
    Zo = Ws.call,
    Ds = typeof Reflect == "object" && Reflect.apply || (Ft ? Zo.bind(Bo) : function() {
        return Zo.apply(Bo, arguments)
    }),
    Yr = N([].slice),
    je = pe("JSON", "stringify"),
    Vt = N(/./.exec),
    Uo = N("".charAt),
    Rl = N("".charCodeAt),
    Nl = N("".replace),
    Ml = N(1.toString),
    Pl = /[\uD800-\uDFFF]/g,
    Jo = /^[\uD800-\uDBFF]$/,
    Xo = /^[\uDC00-\uDFFF]$/,
    Vo = !ce || K(function() {
        var e = pe("Symbol")();
        return je([e]) != "[null]" || je({
            a: e
        }) != "{}" || je(Object(e)) != "{}"
    }),
    qo = K(function() {
        return je("\uDF06\uD834") !== '"\\udf06\\ud834"' || je("\uDEAD") !== '"\\udead"'
    }),
    jl = function(e, t) {
        var n = Yr(arguments),
            r = t;
        if ((G(t) || e !== void 0) && !pt(e)) return vn(t) || (t = function(o, s) {
            if (F(r) && (s = ee(r, this, o, s)), !pt(s)) return s
        }), n[1] = t, Ds(je, null, n)
    },
    Wl = function(e, t, n) {
        var r = Uo(n, t - 1),
            o = Uo(n, t + 1);
        return Vt(Jo, e) && !Vt(Xo, o) || Vt(Xo, e) && !Vt(Jo, r) ? "\\u" + Ml(Rl(e, 0), 16) : e
    };
je && q({
    target: "JSON",
    stat: !0,
    arity: 3,
    forced: Vo || qo
}, {
    stringify: function(e, t, n) {
        var r = Yr(arguments),
            o = Ds(Vo ? jl : je, null, r);
        return qo && typeof o == "string" ? Nl(o, Pl, Wl) : o
    }
});
var Dl = !ce || K(function() {
    In.f(1)
});
q({
    target: "Object",
    stat: !0,
    forced: Dl
}, {
    getOwnPropertySymbols: function(e) {
        var t = In.f;
        return t ? t(St(e)) : []
    }
}), oe("asyncIterator");
var Hl = $.f,
    ke = A.Symbol,
    Be = ke && ke.prototype;
if (D && F(ke) && (!("description" in Be) || ke().description !== void 0)) {
    var zo = {},
        qt = function() {
            var e = arguments.length < 1 || arguments[0] === void 0 ? void 0 : _e(arguments[0]),
                t = Qe(Be, this) ? new ke(e) : e === void 0 ? ke() : ke(e);
            return e === "" && (zo[t] = !0), t
        };
    ms(qt, ke), qt.prototype = Be, Be.constructor = qt;
    var Fl = String(ke("test")) == "Symbol(test)",
        Kl = N(Be.valueOf),
        Gl = N(Be.toString),
        Bl = /^Symbol\((.*)\)[^)]+$/,
        Zl = N("".replace),
        Ul = N("".slice);
    Hl(Be, "description", {
        configurable: !0,
        get: function() {
            var e = Kl(this);
            if (I(zo, e)) return "";
            var t = Gl(e),
                n = Fl ? Ul(t, 7, -1) : Zl(t, Bl, "$1");
            return n === "" ? void 0 : n
        }
    }), q({
        global: !0,
        constructor: !0,
        forced: !0
    }, {
        Symbol: qt
    })
}
oe("hasInstance"), oe("isConcatSpreadable"), oe("iterator"), oe("match"), oe("matchAll"), oe("replace"), oe("search"), oe("species"), oe("split"), oe("toPrimitive"), As(), oe("toStringTag"), Me(pe("Symbol"), "Symbol"), oe("unscopables"), Me(A.JSON, "JSON", !0), Me(Math, "Math", !0), q({
    global: !0
}, {
    Reflect: {}
}), Me(A.Reflect, "Reflect", !0), Wt.Symbol;
var Ye, Yo, $o, Jl = N("".charAt),
    Qo = N("".charCodeAt),
    Xl = N("".slice),
    ei = function(e) {
        return function(t, n) {
            var r, o, s = _e(Kt(t)),
                i = Zr(n),
                c = s.length;
            return i < 0 || i >= c ? e ? "" : void 0 : (r = Qo(s, i)) < 55296 || r > 56319 || i + 1 === c || (o = Qo(s, i + 1)) < 56320 || o > 57343 ? e ? Jl(s, i) : r : e ? Xl(s, i, i + 2) : o - 56320 + (r - 55296 << 10) + 65536
        }
    },
    Vl = {
        codeAt: ei(!1),
        charAt: ei(!0)
    },
    ql = !K(function() {
        function e() {}
        return e.prototype.constructor = null, Object.getPrototypeOf(new e) !== e.prototype
    }),
    ti = Ln("IE_PROTO"),
    br = Object,
    zl = br.prototype,
    De = ql ? br.getPrototypeOf : function(e) {
        var t = St(e);
        if (I(t, ti)) return t[ti];
        var n = t.constructor;
        return F(n) && t instanceof n ? n.prototype : t instanceof br ? zl : null
    },
    wr = U("iterator"),
    Hs = !1;
[].keys && ("next" in ($o = [].keys()) ? (Yo = De(De($o))) !== Object.prototype && (Ye = Yo) : Hs = !0);
var Yl = !G(Ye) || K(function() {
    var e = {};
    return Ye[wr].call(e) !== e
});
Yl && (Ye = {}), F(Ye[wr]) || ne(Ye, wr, function() {
    return this
});
var $r = {
        IteratorPrototype: Ye,
        BUGGY_SAFARI_ITERATORS: Hs
    },
    yt = {},
    $l = $r.IteratorPrototype,
    Ql = function() {
        return this
    },
    ed = String,
    td = TypeError,
    ve = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var e, t = !1,
            n = {};
        try {
            (e = N(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set))(n, []), t = n instanceof Array
        } catch {}
        return function(r, o) {
            return V(r),
                function(s) {
                    if (typeof s == "object" || F(s)) return s;
                    throw td("Can't set " + ed(s) + " as a prototype")
                }(o), t ? e(r, o) : r.__proto__ = o, r
        }
    }() : void 0),
    nd = Br.PROPER,
    rd = Br.CONFIGURABLE,
    ni = $r.IteratorPrototype,
    zt = $r.BUGGY_SAFARI_ITERATORS,
    _t = U("iterator"),
    od = function() {
        return this
    },
    Qr = function(e, t, n, r, o, s, i) {
        (function(v, y, k, M) {
            var g = y + " Iterator";
            v.prototype = We($l, {
                next: $e(+!M, k)
            }), Me(v, g, !1), yt[g] = Ql
        })(n, t, r);
        var c, a, u, l = function(v) {
                if (v === o && b) return b;
                if (!zt && v in h) return h[v];
                switch (v) {
                    case "keys":
                    case "values":
                    case "entries":
                        return function() {
                            return new n(this, v)
                        }
                }
                return function() {
                    return new n(this)
                }
            },
            d = t + " Iterator",
            f = !1,
            h = e.prototype,
            m = h[_t] || h["@@iterator"] || o && h[o],
            b = !zt && m || l(o),
            p = t == "Array" && h.entries || m;
        if (p && (c = De(p.call(new e))) !== Object.prototype && c.next && (De(c) !== ni && (ve ? ve(c, ni) : F(c[_t]) || ne(c, _t, od)), Me(c, d, !0)), nd && o == "values" && m && m.name !== "values" && (rd ? _n(h, "name", "values") : (f = !0, b = function() {
                return ee(m, this)
            })), o)
            if (a = {
                    values: l("values"),
                    keys: s ? b : l("keys"),
                    entries: l("entries")
                }, i)
                for (u in a)(zt || f || !(u in h)) && ne(h, u, a[u]);
            else q({
                target: t,
                proto: !0,
                forced: zt || f
            }, a);
        return h[_t] !== b && ne(h, _t, b, {
            name: o
        }), yt[t] = b, a
    },
    gt = function(e, t) {
        return {
            value: e,
            done: t
        }
    },
    id = Vl.charAt,
    sd = le.set,
    ad = le.getterFor("String Iterator");
Qr(String, "String", function(e) {
    sd(this, {
        type: "String Iterator",
        string: _e(e),
        index: 0
    })
}, function() {
    var e, t = ad(this),
        n = t.string,
        r = t.index;
    return r >= n.length ? gt(void 0, !0) : (e = id(n, r), t.index += e.length, gt(e, !1))
});
var Sr = function(e, t, n) {
        var r, o;
        V(e);
        try {
            if (!(r = pn(e, "return"))) {
                if (t === "throw") throw n;
                return n
            }
            r = ee(r, e)
        } catch (s) {
            o = !0, r = s
        }
        if (t === "throw") throw n;
        if (o) throw r;
        return V(r), n
    },
    cd = function(e, t, n, r) {
        try {
            return r ? t(V(n)[0], n[1]) : t(n)
        } catch (o) {
            Sr(e, "throw", o)
        }
    },
    ud = U("iterator"),
    ld = Array.prototype,
    Fs = function(e) {
        return e !== void 0 && (yt.Array === e || ld[ud] === e)
    },
    dd = U("iterator"),
    eo = function(e) {
        if (!bt(e)) return pn(e, dd) || pn(e, "@@iterator") || yt[nt(e)]
    },
    fd = TypeError,
    Ks = function(e, t) {
        var n = arguments.length < 2 ? eo(e) : t;
        if (Kr(n)) return V(ee(n, e));
        throw fd(wt(e) + " is not iterable")
    },
    ri = Array,
    Gs = U("iterator"),
    Bs = !1;
try {
    var hd = 0,
        oi = {
            next: function() {
                return {
                    done: !!hd++
                }
            },
            return: function() {
                Bs = !0
            }
        };
    oi[Gs] = function() {
        return this
    }, Array.from(oi, function() {
        throw 2
    })
} catch {}
var Zs = function(e, t) {
        if (!t && !Bs) return !1;
        var n = !1;
        try {
            var r = {};
            r[Gs] = function() {
                return {
                    next: function() {
                        return {
                            done: n = !0
                        }
                    }
                }
            }, e(r)
        } catch {}
        return n
    },
    pd = !Zs(function(e) {
        Array.from(e)
    });
q({
    target: "Array",
    stat: !0,
    forced: pd
}, {
    from: function(e) {
        var t = St(e),
            n = Vr(this),
            r = arguments.length,
            o = r > 1 ? arguments[1] : void 0,
            s = o !== void 0;
        s && (o = xn(o, r > 2 ? arguments[2] : void 0));
        var i, c, a, u, l, d, f = eo(t),
            h = 0;
        if (!f || this === ri && Fs(f))
            for (i = Tt(t), c = n ? new this(i) : ri(i); i > h; h++) d = s ? o(t[h], h) : t[h], jt(c, h, d);
        else
            for (l = (u = Ks(t, f)).next, c = n ? new this : []; !(a = ee(l, u)).done; h++) d = s ? cd(u, o, [a.value, h], !0) : a.value, jt(c, h, d);
        return c.length = h, c
    }
}), Wt.Array.from;
var ae, dt, wn, md = typeof ArrayBuffer < "u" && typeof DataView < "u",
    yd = $.f,
    Us = le.enforce,
    gd = le.get,
    Sn = A.Int8Array,
    kr = Sn && Sn.prototype,
    ii = A.Uint8ClampedArray,
    si = ii && ii.prototype,
    me = Sn && De(Sn),
    he = kr && De(kr),
    vd = Object.prototype,
    Tr = A.TypeError,
    ai = U("toStringTag"),
    Cr = mt("TYPED_ARRAY_TAG"),
    Ee = md && !!ve && nt(A.opera) !== "Opera",
    Js = !1,
    Te = {
        Int8Array: 1,
        Uint8Array: 1,
        Uint8ClampedArray: 1,
        Int16Array: 2,
        Uint16Array: 2,
        Int32Array: 4,
        Uint32Array: 4,
        Float32Array: 4,
        Float64Array: 8
    },
    to = {
        BigInt64Array: 8,
        BigUint64Array: 8
    },
    Xs = function(e) {
        var t = De(e);
        if (G(t)) {
            var n = gd(t);
            return n && I(n, "TypedArrayConstructor") ? n.TypedArrayConstructor : Xs(t)
        }
    },
    ci = function(e) {
        if (!G(e)) return !1;
        var t = nt(e);
        return I(Te, t) || I(to, t)
    };
for (ae in Te)(wn = (dt = A[ae]) && dt.prototype) ? Us(wn).TypedArrayConstructor = dt : Ee = !1;
for (ae in to)(wn = (dt = A[ae]) && dt.prototype) && (Us(wn).TypedArrayConstructor = dt);
if ((!Ee || !F(me) || me === Function.prototype) && (me = function() {
        throw Tr("Incorrect invocation")
    }, Ee))
    for (ae in Te) A[ae] && ve(A[ae], me);
if ((!Ee || !he || he === vd) && (he = me.prototype, Ee))
    for (ae in Te) A[ae] && ve(A[ae].prototype, he);
if (Ee && De(si) !== he && ve(si, he), D && !I(he, ai))
    for (ae in Js = !0, yd(he, ai, {
            get: function() {
                return G(this) ? this[Cr] : void 0
            }
        }), Te) A[ae] && _n(A[ae], Cr, ae);
var An = {
        NATIVE_ARRAY_BUFFER_VIEWS: Ee,
        TYPED_ARRAY_TAG: Js && Cr,
        aTypedArray: function(e) {
            if (ci(e)) return e;
            throw Tr("Target is not a typed array")
        },
        aTypedArrayConstructor: function(e) {
            if (F(e) && (!ve || Qe(me, e))) return e;
            throw Tr(wt(e) + " is not a typed array constructor")
        },
        exportTypedArrayMethod: function(e, t, n, r) {
            if (D) {
                if (n)
                    for (var o in Te) {
                        var s = A[o];
                        if (s && I(s.prototype, e)) try {
                            delete s.prototype[e]
                        } catch {
                            try {
                                s.prototype[e] = t
                            } catch {}
                        }
                    }
                he[e] && !n || ne(he, e, n ? t : Ee && kr[e] || t, r)
            }
        },
        exportTypedArrayStaticMethod: function(e, t, n) {
            var r, o;
            if (D) {
                if (ve) {
                    if (n) {
                        for (r in Te)
                            if ((o = A[r]) && I(o, e)) try {
                                delete o[e]
                            } catch {}
                    }
                    if (me[e] && !n) return;
                    try {
                        return ne(me, e, n ? t : Ee && me[e] || t)
                    } catch {}
                }
                for (r in Te) !(o = A[r]) || o[e] && !n || ne(o, e, t)
            }
        },
        getTypedArrayConstructor: Xs,
        isView: function(e) {
            if (!G(e)) return !1;
            var t = nt(e);
            return t === "DataView" || I(Te, t) || I(to, t)
        },
        isTypedArray: ci,
        TypedArray: me,
        TypedArrayPrototype: he
    },
    bd = TypeError,
    wd = U("species"),
    Sd = function(e, t) {
        var n, r = V(e).constructor;
        return r === void 0 || bt(n = V(r)[wd]) ? t : function(o) {
            if (Vr(o)) return o;
            throw bd(wt(o) + " is not a constructor")
        }(n)
    },
    kd = An.aTypedArrayConstructor,
    Td = An.getTypedArrayConstructor,
    Cd = An.aTypedArray;
(0, An.exportTypedArrayMethod)("slice", function(e, t) {
    for (var n, r = Yr(Cd(this), e, t), o = kd(Sd(n = this, Td(n))), s = 0, i = r.length, c = new o(i); i > s;) c[s] = r[s++];
    return c
}, K(function() {
    new Int8Array(1).slice()
}));
var Ed = $.f,
    Er = U("unscopables"),
    _r = Array.prototype;
_r[Er] == null && Ed(_r, Er, {
    configurable: !0,
    value: We(null)
});
var on = function(e) {
        _r[Er][e] = !0
    },
    _d = hs.includes,
    Ld = K(function() {
        return !Array(1).includes()
    });
q({
    target: "Array",
    proto: !0,
    forced: Ld
}, {
    includes: function(e) {
        return _d(this, e, arguments.length > 1 ? arguments[1] : void 0)
    }
}), on("includes"), Jr("Array", "includes");
var Id = N("".indexOf);
q({
    target: "String",
    proto: !0,
    forced: !vs("includes")
}, {
    includes: function(e) {
        return !!~Id(_e(Kt(this)), _e(gs(e)), arguments.length > 1 ? arguments[1] : void 0)
    }
}), Jr("String", "includes");
var xd = $.f,
    Od = le.set,
    Ad = le.getterFor("Array Iterator");
Qr(Array, "Array", function(e, t) {
    Od(this, {
        type: "Array Iterator",
        target: be(e),
        index: 0,
        kind: t
    })
}, function() {
    var e = Ad(this),
        t = e.target,
        n = e.kind,
        r = e.index++;
    return !t || r >= t.length ? (e.target = void 0, gt(void 0, !0)) : gt(n == "keys" ? r : n == "values" ? t[r] : [r, t[r]], !1)
}, "values");
var ui = yt.Arguments = yt.Array;
if (on("keys"), on("values"), on("entries"), D && ui.name !== "values") try {
    xd(ui, "name", {
        value: "values"
    })
} catch {}
var li = K(function() {
        if (typeof ArrayBuffer == "function") {
            var e = new ArrayBuffer(8);
            Object.isExtensible(e) && Object.defineProperty(e, "a", {
                value: 8
            })
        }
    }),
    Yt = Object.isExtensible,
    Yn = K(function() {
        Yt(1)
    }) || li ? function(e) {
        return !!G(e) && (!li || Ce(e) != "ArrayBuffer") && (!Yt || Yt(e))
    } : Yt,
    Rd = !K(function() {
        return Object.isExtensible(Object.preventExtensions({}))
    }),
    lt = vt(function(e) {
        var t = $.f,
            n = !1,
            r = mt("meta"),
            o = 0,
            s = function(c) {
                t(c, r, {
                    value: {
                        objectID: "O" + o++,
                        weakData: {}
                    }
                })
            },
            i = e.exports = {
                enable: function() {
                    i.enable = function() {}, n = !0;
                    var c = Pt.f,
                        a = N([].splice),
                        u = {};
                    u[r] = 1, c(u).length && (Pt.f = function(l) {
                        for (var d = c(l), f = 0, h = d.length; f < h; f++)
                            if (d[f] === r) {
                                a(d, f, 1);
                                break
                            }
                        return d
                    }, q({
                        target: "Object",
                        stat: !0,
                        forced: !0
                    }, {
                        getOwnPropertyNames: zr.f
                    }))
                },
                fastKey: function(c, a) {
                    if (!G(c)) return typeof c == "symbol" ? c : (typeof c == "string" ? "S" : "P") + c;
                    if (!I(c, r)) {
                        if (!Yn(c)) return "F";
                        if (!a) return "E";
                        s(c)
                    }
                    return c[r].objectID
                },
                getWeakData: function(c, a) {
                    if (!I(c, r)) {
                        if (!Yn(c)) return !0;
                        if (!a) return !1;
                        s(c)
                    }
                    return c[r].weakData
                },
                onFreeze: function(c) {
                    return Rd && n && Yn(c) && !I(c, r) && s(c), c
                }
            };
        kt[r] = !0
    });
lt.enable, lt.fastKey, lt.getWeakData, lt.onFreeze;
var Nd = TypeError,
    sn = function(e, t) {
        this.stopped = e, this.result = t
    },
    di = sn.prototype,
    Vs = function(e, t, n) {
        var r, o, s, i, c, a, u, l = n && n.that,
            d = !(!n || !n.AS_ENTRIES),
            f = !(!n || !n.IS_RECORD),
            h = !(!n || !n.IS_ITERATOR),
            m = !(!n || !n.INTERRUPTED),
            b = xn(t, l),
            p = function(y) {
                return r && Sr(r, "normal", y), new sn(!0, y)
            },
            v = function(y) {
                return d ? (V(y), m ? b(y[0], y[1], p) : b(y[0], y[1])) : m ? b(y, p) : b(y)
            };
        if (f) r = e.iterator;
        else if (h) r = e;
        else {
            if (!(o = eo(e))) throw Nd(wt(e) + " is not iterable");
            if (Fs(o)) {
                for (s = 0, i = Tt(e); i > s; s++)
                    if ((c = v(e[s])) && Qe(di, c)) return c;
                return new sn(!1)
            }
            r = Ks(e, o)
        }
        for (a = f ? e.next : r.next; !(u = ee(a, r)).done;) {
            try {
                c = v(u.value)
            } catch (y) {
                Sr(r, "throw", y)
            }
            if (typeof c == "object" && c && Qe(di, c)) return c
        }
        return new sn(!1)
    },
    Md = TypeError,
    qs = function(e, t) {
        if (Qe(t, e)) return e;
        throw Md("Incorrect invocation")
    },
    fi = function(e, t, n) {
        for (var r in t) ne(e, r, t[r], n);
        return e
    },
    hi = U("species"),
    Pd = $.f,
    pi = lt.fastKey,
    mi = le.set,
    $n = le.getterFor,
    jd = {
        getConstructor: function(e, t, n, r) {
            var o = e(function(u, l) {
                    qs(u, s), mi(u, {
                        type: t,
                        index: We(null),
                        first: void 0,
                        last: void 0,
                        size: 0
                    }), D || (u.size = 0), bt(l) || Vs(l, u[r], {
                        that: u,
                        AS_ENTRIES: n
                    })
                }),
                s = o.prototype,
                i = $n(t),
                c = function(u, l, d) {
                    var f, h, m = i(u),
                        b = a(u, l);
                    return b ? b.value = d : (m.last = b = {
                        index: h = pi(l, !0),
                        key: l,
                        value: d,
                        previous: f = m.last,
                        next: void 0,
                        removed: !1
                    }, m.first || (m.first = b), f && (f.next = b), D ? m.size++ : u.size++, h !== "F" && (m.index[h] = b)), u
                },
                a = function(u, l) {
                    var d, f = i(u),
                        h = pi(l);
                    if (h !== "F") return f.index[h];
                    for (d = f.first; d; d = d.next)
                        if (d.key == l) return d
                };
            return fi(s, {
                clear: function() {
                    for (var u = i(this), l = u.index, d = u.first; d;) d.removed = !0, d.previous && (d.previous = d.previous.next = void 0), delete l[d.index], d = d.next;
                    u.first = u.last = void 0, D ? u.size = 0 : this.size = 0
                },
                delete: function(u) {
                    var l = this,
                        d = i(l),
                        f = a(l, u);
                    if (f) {
                        var h = f.next,
                            m = f.previous;
                        delete d.index[f.index], f.removed = !0, m && (m.next = h), h && (h.previous = m), d.first == f && (d.first = h), d.last == f && (d.last = m), D ? d.size-- : l.size--
                    }
                    return !!f
                },
                forEach: function(u) {
                    for (var l, d = i(this), f = xn(u, arguments.length > 1 ? arguments[1] : void 0); l = l ? l.next : d.first;)
                        for (f(l.value, l.key, this); l && l.removed;) l = l.previous
                },
                has: function(u) {
                    return !!a(this, u)
                }
            }), fi(s, n ? {
                get: function(u) {
                    var l = a(this, u);
                    return l && l.value
                },
                set: function(u, l) {
                    return c(this, u === 0 ? 0 : u, l)
                }
            } : {
                add: function(u) {
                    return c(this, u = u === 0 ? 0 : u, u)
                }
            }), D && Pd(s, "size", {
                get: function() {
                    return i(this).size
                }
            }), o
        },
        setStrong: function(e, t, n) {
            var r = t + " Iterator",
                o = $n(t),
                s = $n(r);
            Qr(e, t, function(i, c) {
                    mi(this, {
                        type: r,
                        target: i,
                        state: o(i),
                        kind: c,
                        last: void 0
                    })
                }, function() {
                    for (var i = s(this), c = i.kind, a = i.last; a && a.removed;) a = a.previous;
                    return i.target && (i.last = a = a ? a.next : i.state.first) ? gt(c == "keys" ? a.key : c == "values" ? a.value : [a.key, a.value], !1) : (i.target = void 0, gt(void 0, !0))
                }, n ? "entries" : "values", !n, !0),
                function(i) {
                    var c = pe(i),
                        a = $.f;
                    D && c && !c[hi] && a(c, hi, {
                        configurable: !0,
                        get: function() {
                            return this
                        }
                    })
                }(t)
        }
    };

function zs(e) {
    var t = this.constructor;
    return this.then(function(n) {
        return t.resolve(e()).then(function() {
            return n
        })
    }, function(n) {
        return t.resolve(e()).then(function() {
            return t.reject(n)
        })
    })
}

function Ys(e) {
    return new this(function(t, n) {
        if (!e || e.length === void 0) return n(new TypeError(typeof e + " " + e + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
        var r = Array.prototype.slice.call(e);
        if (r.length === 0) return t([]);
        var o = r.length;

        function s(c, a) {
            if (a && (typeof a == "object" || typeof a == "function")) {
                var u = a.then;
                if (typeof u == "function") return void u.call(a, function(l) {
                    s(c, l)
                }, function(l) {
                    r[c] = {
                        status: "rejected",
                        reason: l
                    }, --o == 0 && t(r)
                })
            }
            r[c] = {
                status: "fulfilled",
                value: a
            }, --o == 0 && t(r)
        }
        for (var i = 0; i < r.length; i++) s(i, r[i])
    })
}(function(e, t, n) {
    var r = e.indexOf("Map") !== -1,
        o = e.indexOf("Weak") !== -1,
        s = r ? "set" : "add",
        i = A[e],
        c = i && i.prototype,
        a = i,
        u = {},
        l = function(p) {
            var v = N(c[p]);
            ne(c, p, p == "add" ? function(y) {
                return v(this, y === 0 ? 0 : y), this
            } : p == "delete" ? function(y) {
                return !(o && !G(y)) && v(this, y === 0 ? 0 : y)
            } : p == "get" ? function(y) {
                return o && !G(y) ? void 0 : v(this, y === 0 ? 0 : y)
            } : p == "has" ? function(y) {
                return !(o && !G(y)) && v(this, y === 0 ? 0 : y)
            } : function(y, k) {
                return v(this, y === 0 ? 0 : y, k), this
            })
        };
    if (yr(e, !F(i) || !(o || c.forEach && !K(function() {
            new i().entries().next()
        })))) a = n.getConstructor(t, e, r, s), lt.enable();
    else if (yr(e, !0)) {
        var d = new a,
            f = d[s](o ? {} : -0, 1) != d,
            h = K(function() {
                d.has(1)
            }),
            m = Zs(function(p) {
                new i(p)
            }),
            b = !o && K(function() {
                for (var p = new i, v = 5; v--;) p[s](v, v);
                return !p.has(-0)
            });
        m || ((a = t(function(p, v) {
            qs(p, c);
            var y = function(k, M, g) {
                var _, w;
                return ve && F(_ = M.constructor) && _ !== g && G(w = _.prototype) && w !== g.prototype && ve(k, w), k
            }(new i, p, a);
            return bt(v) || Vs(v, y[s], {
                that: y,
                AS_ENTRIES: r
            }), y
        })).prototype = c, c.constructor = a), (h || b) && (l("delete"), l("has"), r && l("get")), (b || f) && l(s), o && c.clear && delete c.clear
    }
    u[e] = a, q({
        global: !0,
        constructor: !0,
        forced: a != i
    }, u), Me(a, e), o || n.setStrong(a, e, r)
})("Set", function(e) {
    return function() {
        return e(this, arguments.length ? arguments[0] : void 0)
    }
}, jd), Wt.Set;
var Wd = setTimeout;

function yi(e) {
    return !!(e && e.length !== void 0)
}

function Dd() {}

function B(e) {
    if (!(this instanceof B)) throw new TypeError("Promises must be constructed via new");
    if (typeof e != "function") throw new TypeError("not a function");
    this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], Qs(e, this)
}

function $s(e, t) {
    for (; e._state === 3;) e = e._value;
    e._state !== 0 ? (e._handled = !0, B._immediateFn(function() {
        var n = e._state === 1 ? t.onFulfilled : t.onRejected;
        if (n !== null) {
            var r;
            try {
                r = n(e._value)
            } catch (o) {
                return void Dt(t.promise, o)
            }
            Lr(t.promise, r)
        } else(e._state === 1 ? Lr : Dt)(t.promise, e._value)
    })) : e._deferreds.push(t)
}

function Lr(e, t) {
    try {
        if (t === e) throw new TypeError("A promise cannot be resolved with itself.");
        if (t && (typeof t == "object" || typeof t == "function")) {
            var n = t.then;
            if (t instanceof B) return e._state = 3, e._value = t, void Ir(e);
            if (typeof n == "function") return void Qs((r = n, o = t, function() {
                r.apply(o, arguments)
            }), e)
        }
        e._state = 1, e._value = t, Ir(e)
    } catch (s) {
        Dt(e, s)
    }
    var r, o
}

function Dt(e, t) {
    e._state = 2, e._value = t, Ir(e)
}

function Ir(e) {
    e._state === 2 && e._deferreds.length === 0 && B._immediateFn(function() {
        e._handled || B._unhandledRejectionFn(e._value)
    });
    for (var t = 0, n = e._deferreds.length; t < n; t++) $s(e, e._deferreds[t]);
    e._deferreds = null
}

function Hd(e, t, n) {
    this.onFulfilled = typeof e == "function" ? e : null, this.onRejected = typeof t == "function" ? t : null, this.promise = n
}

function Qs(e, t) {
    var n = !1;
    try {
        e(function(r) {
            n || (n = !0, Lr(t, r))
        }, function(r) {
            n || (n = !0, Dt(t, r))
        })
    } catch (r) {
        if (n) return;
        n = !0, Dt(t, r)
    }
}
B.prototype.catch = function(e) {
    return this.then(null, e)
}, B.prototype.then = function(e, t) {
    var n = new this.constructor(Dd);
    return $s(this, new Hd(e, t, n)), n
}, B.prototype.finally = zs, B.all = function(e) {
    return new B(function(t, n) {
        if (!yi(e)) return n(new TypeError("Promise.all accepts an array"));
        var r = Array.prototype.slice.call(e);
        if (r.length === 0) return t([]);
        var o = r.length;

        function s(c, a) {
            try {
                if (a && (typeof a == "object" || typeof a == "function")) {
                    var u = a.then;
                    if (typeof u == "function") return void u.call(a, function(l) {
                        s(c, l)
                    }, n)
                }
                r[c] = a, --o == 0 && t(r)
            } catch (l) {
                n(l)
            }
        }
        for (var i = 0; i < r.length; i++) s(i, r[i])
    })
}, B.allSettled = Ys, B.resolve = function(e) {
    return e && typeof e == "object" && e.constructor === B ? e : new B(function(t) {
        t(e)
    })
}, B.reject = function(e) {
    return new B(function(t, n) {
        n(e)
    })
}, B.race = function(e) {
    return new B(function(t, n) {
        if (!yi(e)) return n(new TypeError("Promise.race accepts an array"));
        for (var r = 0, o = e.length; r < o; r++) B.resolve(e[r]).then(t, n)
    })
}, B._immediateFn = typeof setImmediate == "function" && function(e) {
    setImmediate(e)
} || function(e) {
    Wd(e, 0)
}, B._unhandledRejectionFn = function(e) {
    typeof console < "u" && console && console.warn("Possible Unhandled Promise Rejection:", e)
};
var ot = function() {
    if (typeof self < "u") return self;
    if (typeof window < "u") return window;
    if (typeof global < "u") return global;
    throw new Error("unable to locate global object")
}();
typeof ot.Promise != "function" ? ot.Promise = B : (ot.Promise.prototype.finally || (ot.Promise.prototype.finally = zs), ot.Promise.allSettled || (ot.Promise.allSettled = Ys)),
    function(e) {
        function t(h) {
            for (var m = 0, b = Math.min(65536, h.length + 1), p = new Uint16Array(b), v = [], y = 0;;) {
                var k = m < h.length;
                if (!k || y >= b - 1) {
                    var M = p.subarray(0, y);
                    if (v.push(String.fromCharCode.apply(null, M)), !k) return v.join("");
                    h = h.subarray(m), m = 0, y = 0
                }
                var g = h[m++];
                if (!(128 & g)) p[y++] = g;
                else if ((224 & g) == 192) {
                    var _ = 63 & h[m++];
                    p[y++] = (31 & g) << 6 | _
                } else if ((240 & g) == 224) {
                    _ = 63 & h[m++];
                    var w = 63 & h[m++];
                    p[y++] = (31 & g) << 12 | _ << 6 | w
                } else if ((248 & g) == 240) {
                    var R = (7 & g) << 18 | (_ = 63 & h[m++]) << 12 | (w = 63 & h[m++]) << 6 | 63 & h[m++];
                    R > 65535 && (R -= 65536, p[y++] = R >>> 10 & 1023 | 55296, R = 56320 | 1023 & R), p[y++] = R
                }
            }
        }
        var n = "Failed to ",
            r = function(h, m, b) {
                if (h) throw new Error("".concat(n).concat(m, ": the '").concat(b, "' option is unsupported."))
            },
            o = typeof Buffer == "function" && Buffer.from,
            s = o ? function(h) {
                return Buffer.from(h)
            } : function(h) {
                for (var m = 0, b = h.length, p = 0, v = Math.max(32, b + (b >>> 1) + 7), y = new Uint8Array(v >>> 3 << 3); m < b;) {
                    var k = h.charCodeAt(m++);
                    if (k >= 55296 && k <= 56319) {
                        if (m < b) {
                            var M = h.charCodeAt(m);
                            (64512 & M) == 56320 && (++m, k = ((1023 & k) << 10) + (1023 & M) + 65536)
                        }
                        if (k >= 55296 && k <= 56319) continue
                    }
                    if (p + 4 > y.length) {
                        v += 8, v = (v *= 1 + m / h.length * 2) >>> 3 << 3;
                        var g = new Uint8Array(v);
                        g.set(y), y = g
                    }
                    if (4294967168 & k) {
                        if (!(4294965248 & k)) y[p++] = k >>> 6 & 31 | 192;
                        else if (!(4294901760 & k)) y[p++] = k >>> 12 & 15 | 224, y[p++] = k >>> 6 & 63 | 128;
                        else {
                            if (4292870144 & k) continue;
                            y[p++] = k >>> 18 & 7 | 240, y[p++] = k >>> 12 & 63 | 128, y[p++] = k >>> 6 & 63 | 128
                        }
                        y[p++] = 63 & k | 128
                    } else y[p++] = k
                }
                return y.slice ? y.slice(0, p) : y.subarray(0, p)
            };

        function i() {
            this.encoding = "utf-8"
        }
        i.prototype.encode = function(h, m) {
            return r(m && m.stream, "encode", "stream"), s(h)
        };
        var c = !o && typeof Blob == "function" && typeof URL == "function" && typeof URL.createObjectURL == "function",
            a = ["utf-8", "utf8", "unicode-1-1-utf-8"],
            u = t;
        o ? u = function(h, m) {
            return (h instanceof Buffer ? h : Buffer.from(h.buffer, h.byteOffset, h.byteLength)).toString(m)
        } : c && (u = function(h) {
            try {
                return function(m) {
                    var b;
                    try {
                        var p = new Blob([m], {
                            type: "text/plain;charset=UTF-8"
                        });
                        b = URL.createObjectURL(p);
                        var v = new XMLHttpRequest;
                        return v.open("GET", b, !1), v.send(), v.responseText
                    } finally {
                        b && URL.revokeObjectURL(b)
                    }
                }(h)
            } catch {
                return t(h)
            }
        });
        var l = "construct 'TextDecoder'",
            d = "".concat(n, " ").concat(l, ": the ");

        function f(h, m) {
            if (r(m && m.fatal, l, "fatal"), h = h || "utf-8", !(o ? Buffer.isEncoding(h) : a.indexOf(h.toLowerCase()) !== -1)) throw new RangeError("".concat(d, " encoding label provided ('").concat(h, "') is invalid."));
            this.encoding = h, this.fatal = !1, this.ignoreBOM = !1
        }
        f.prototype.decode = function(h, m) {
            var b;
            return r(m && m.stream, "decode", "stream"), b = h instanceof Uint8Array ? h : h.buffer instanceof ArrayBuffer ? new Uint8Array(h.buffer) : new Uint8Array(h), u(b, this.encoding)
        }, e.TextEncoder = e.TextEncoder || i, e.TextDecoder = e.TextDecoder || f
    }(typeof window < "u" ? window : ye),
    function() {
        function e(p, v) {
            if (!(p instanceof v)) throw new TypeError("Cannot call a class as a function")
        }

        function t(p, v) {
            for (var y = 0; y < v.length; y++) {
                var k = v[y];
                k.enumerable = k.enumerable || !1, k.configurable = !0, "value" in k && (k.writable = !0), Object.defineProperty(p, k.key, k)
            }
        }

        function n(p, v, y) {
            return v && t(p.prototype, v), y && t(p, y), p
        }

        function r(p, v) {
            if (typeof v != "function" && v !== null) throw new TypeError("Super expression must either be null or a function");
            p.prototype = Object.create(v && v.prototype, {
                constructor: {
                    value: p,
                    writable: !0,
                    configurable: !0
                }
            }), v && s(p, v)
        }

        function o(p) {
            return o = Object.setPrototypeOf ? Object.getPrototypeOf : function(v) {
                return v.__proto__ || Object.getPrototypeOf(v)
            }, o(p)
        }

        function s(p, v) {
            return s = Object.setPrototypeOf || function(y, k) {
                return y.__proto__ = k, y
            }, s(p, v)
        }

        function i() {
            if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
            if (typeof Proxy == "function") return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
            } catch {
                return !1
            }
        }

        function c(p) {
            if (p === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return p
        }

        function a(p, v) {
            return !v || typeof v != "object" && typeof v != "function" ? c(p) : v
        }

        function u(p) {
            var v = i();
            return function() {
                var y, k = o(p);
                if (v) {
                    var M = o(this).constructor;
                    y = Reflect.construct(k, arguments, M)
                } else y = k.apply(this, arguments);
                return a(this, y)
            }
        }

        function l(p, v) {
            for (; !Object.prototype.hasOwnProperty.call(p, v) && (p = o(p)) !== null;);
            return p
        }

        function d(p, v, y) {
            return d = typeof Reflect < "u" && Reflect.get ? Reflect.get : function(k, M, g) {
                var _ = l(k, M);
                if (_) {
                    var w = Object.getOwnPropertyDescriptor(_, M);
                    return w.get ? w.get.call(g) : w.value
                }
            }, d(p, v, y || p)
        }
        var f = function() {
                function p() {
                    e(this, p), Object.defineProperty(this, "listeners", {
                        value: {},
                        writable: !0,
                        configurable: !0
                    })
                }
                return n(p, [{
                    key: "addEventListener",
                    value: function(v, y, k) {
                        v in this.listeners || (this.listeners[v] = []), this.listeners[v].push({
                            callback: y,
                            options: k
                        })
                    }
                }, {
                    key: "removeEventListener",
                    value: function(v, y) {
                        if (v in this.listeners) {
                            for (var k = this.listeners[v], M = 0, g = k.length; M < g; M++)
                                if (k[M].callback === y) return void k.splice(M, 1)
                        }
                    }
                }, {
                    key: "dispatchEvent",
                    value: function(v) {
                        if (v.type in this.listeners) {
                            for (var y = this.listeners[v.type].slice(), k = 0, M = y.length; k < M; k++) {
                                var g = y[k];
                                try {
                                    g.callback.call(this, v)
                                } catch (_) {
                                    Promise.resolve().then(function() {
                                        throw _
                                    })
                                }
                                g.options && g.options.once && this.removeEventListener(v.type, g.callback)
                            }
                            return !v.defaultPrevented
                        }
                    }
                }]), p
            }(),
            h = function(p) {
                r(y, p);
                var v = u(y);

                function y() {
                    var k;
                    return e(this, y), (k = v.call(this)).listeners || f.call(c(k)), Object.defineProperty(c(k), "aborted", {
                        value: !1,
                        writable: !0,
                        configurable: !0
                    }), Object.defineProperty(c(k), "onabort", {
                        value: null,
                        writable: !0,
                        configurable: !0
                    }), k
                }
                return n(y, [{
                    key: "toString",
                    value: function() {
                        return "[object AbortSignal]"
                    }
                }, {
                    key: "dispatchEvent",
                    value: function(k) {
                        k.type === "abort" && (this.aborted = !0, typeof this.onabort == "function" && this.onabort.call(this, k)), d(o(y.prototype), "dispatchEvent", this).call(this, k)
                    }
                }]), y
            }(f),
            m = function() {
                function p() {
                    e(this, p), Object.defineProperty(this, "signal", {
                        value: new h,
                        writable: !0,
                        configurable: !0
                    })
                }
                return n(p, [{
                    key: "abort",
                    value: function() {
                        var v;
                        try {
                            v = new Event("abort")
                        } catch {
                            typeof document < "u" ? document.createEvent ? (v = document.createEvent("Event")).initEvent("abort", !1, !1) : (v = document.createEventObject()).type = "abort" : v = {
                                type: "abort",
                                bubbles: !1,
                                cancelable: !1
                            }
                        }
                        this.signal.dispatchEvent(v)
                    }
                }, {
                    key: "toString",
                    value: function() {
                        return "[object AbortController]"
                    }
                }]), p
            }();

        function b(p) {
            return p.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL ? (console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"), !0) : typeof p.Request == "function" && !p.Request.prototype.hasOwnProperty("signal") || !p.AbortController
        }
        typeof Symbol < "u" && Symbol.toStringTag && (m.prototype[Symbol.toStringTag] = "AbortController", h.prototype[Symbol.toStringTag] = "AbortSignal"),
            function(p) {
                b(p) && (p.AbortController = m, p.AbortSignal = h)
            }(typeof self < "u" ? self : ye)
    }();
var Ue = vt(function(e, t) {
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = function() {
        function r() {
            var o = this;
            this.locked = new Map, this.addToLocked = function(s, i) {
                var c = o.locked.get(s);
                c === void 0 ? i === void 0 ? o.locked.set(s, []) : o.locked.set(s, [i]) : i !== void 0 && (c.unshift(i), o.locked.set(s, c))
            }, this.isLocked = function(s) {
                return o.locked.has(s)
            }, this.lock = function(s) {
                return new Promise(function(i, c) {
                    o.isLocked(s) ? o.addToLocked(s, i) : (o.addToLocked(s), i())
                })
            }, this.unlock = function(s) {
                var i = o.locked.get(s);
                if (i !== void 0 && i.length !== 0) {
                    var c = i.pop();
                    o.locked.set(s, i), c !== void 0 && setTimeout(c, 0)
                } else o.locked.delete(s)
            }
        }
        return r.getInstance = function() {
            return r.instance === void 0 && (r.instance = new r), r.instance
        }, r
    }();
    t.default = function() {
        return n.getInstance()
    }
});
Dr(Ue);
var Fd = vt(function(e, t) {
        var n = ye && ye.__awaiter || function(a, u, l, d) {
                return new(l || (l = Promise))(function(f, h) {
                    function m(v) {
                        try {
                            p(d.next(v))
                        } catch (y) {
                            h(y)
                        }
                    }

                    function b(v) {
                        try {
                            p(d.throw(v))
                        } catch (y) {
                            h(y)
                        }
                    }

                    function p(v) {
                        v.done ? f(v.value) : new l(function(y) {
                            y(v.value)
                        }).then(m, b)
                    }
                    p((d = d.apply(a, u || [])).next())
                })
            },
            r = ye && ye.__generator || function(a, u) {
                var l, d, f, h, m = {
                    label: 0,
                    sent: function() {
                        if (1 & f[0]) throw f[1];
                        return f[1]
                    },
                    trys: [],
                    ops: []
                };
                return h = {
                    next: b(0),
                    throw: b(1),
                    return: b(2)
                }, typeof Symbol == "function" && (h[Symbol.iterator] = function() {
                    return this
                }), h;

                function b(p) {
                    return function(v) {
                        return function(y) {
                            if (l) throw new TypeError("Generator is already executing.");
                            for (; m;) try {
                                if (l = 1, d && (f = 2 & y[0] ? d.return : y[0] ? d.throw || ((f = d.return) && f.call(d), 0) : d.next) && !(f = f.call(d, y[1])).done) return f;
                                switch (d = 0, f && (y = [2 & y[0], f.value]), y[0]) {
                                    case 0:
                                    case 1:
                                        f = y;
                                        break;
                                    case 4:
                                        return m.label++, {
                                            value: y[1],
                                            done: !1
                                        };
                                    case 5:
                                        m.label++, d = y[1], y = [0];
                                        continue;
                                    case 7:
                                        y = m.ops.pop(), m.trys.pop();
                                        continue;
                                    default:
                                        if (f = m.trys, !((f = f.length > 0 && f[f.length - 1]) || y[0] !== 6 && y[0] !== 2)) {
                                            m = 0;
                                            continue
                                        }
                                        if (y[0] === 3 && (!f || y[1] > f[0] && y[1] < f[3])) {
                                            m.label = y[1];
                                            break
                                        }
                                        if (y[0] === 6 && m.label < f[1]) {
                                            m.label = f[1], f = y;
                                            break
                                        }
                                        if (f && m.label < f[2]) {
                                            m.label = f[2], m.ops.push(y);
                                            break
                                        }
                                        f[2] && m.ops.pop(), m.trys.pop();
                                        continue
                                }
                                y = u.call(a, m)
                            } catch (k) {
                                y = [6, k], d = 0
                            } finally {
                                l = f = 0
                            }
                            if (5 & y[0]) throw y[1];
                            return {
                                value: y[0] ? y[1] : void 0,
                                done: !0
                            }
                        }([p, v])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = "browser-tabs-lock-key";

        function s(a) {
            return new Promise(function(u) {
                return setTimeout(u, a)
            })
        }

        function i(a) {
            for (var u = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", l = "", d = 0; d < a; d++) l += u[Math.floor(Math.random() * u.length)];
            return l
        }
        var c = function() {
            function a() {
                this.acquiredIatSet = new Set, this.id = Date.now().toString() + i(15), this.acquireLock = this.acquireLock.bind(this), this.releaseLock = this.releaseLock.bind(this), this.releaseLock__private__ = this.releaseLock__private__.bind(this), this.waitForSomethingToChange = this.waitForSomethingToChange.bind(this), this.refreshLockWhileAcquired = this.refreshLockWhileAcquired.bind(this), a.waiters === void 0 && (a.waiters = [])
            }
            return a.prototype.acquireLock = function(u, l) {
                return l === void 0 && (l = 5e3), n(this, void 0, void 0, function() {
                    var d, f, h, m, b, p;
                    return r(this, function(v) {
                        switch (v.label) {
                            case 0:
                                d = Date.now() + i(4), f = Date.now() + l, h = o + "-" + u, m = window.localStorage, v.label = 1;
                            case 1:
                                return Date.now() < f ? [4, s(30)] : [3, 8];
                            case 2:
                                return v.sent(), m.getItem(h) !== null ? [3, 5] : (b = this.id + "-" + u + "-" + d, [4, s(Math.floor(25 * Math.random()))]);
                            case 3:
                                return v.sent(), m.setItem(h, JSON.stringify({
                                    id: this.id,
                                    iat: d,
                                    timeoutKey: b,
                                    timeAcquired: Date.now(),
                                    timeRefreshed: Date.now()
                                })), [4, s(30)];
                            case 4:
                                return v.sent(), (p = m.getItem(h)) !== null && (p = JSON.parse(p)).id === this.id && p.iat === d ? (this.acquiredIatSet.add(d), this.refreshLockWhileAcquired(h, d), [2, !0]) : [3, 7];
                            case 5:
                                return a.lockCorrector(), [4, this.waitForSomethingToChange(f)];
                            case 6:
                                v.sent(), v.label = 7;
                            case 7:
                                return d = Date.now() + i(4), [3, 1];
                            case 8:
                                return [2, !1]
                        }
                    })
                })
            }, a.prototype.refreshLockWhileAcquired = function(u, l) {
                return n(this, void 0, void 0, function() {
                    var d = this;
                    return r(this, function(f) {
                        return setTimeout(function() {
                            return n(d, void 0, void 0, function() {
                                var h, m;
                                return r(this, function(b) {
                                    switch (b.label) {
                                        case 0:
                                            return [4, Ue.default().lock(l)];
                                        case 1:
                                            return b.sent(), this.acquiredIatSet.has(l) ? (h = window.localStorage, (m = h.getItem(u)) === null ? (Ue.default().unlock(l), [2]) : ((m = JSON.parse(m)).timeRefreshed = Date.now(), h.setItem(u, JSON.stringify(m)), Ue.default().unlock(l), this.refreshLockWhileAcquired(u, l), [2])) : (Ue.default().unlock(l), [2])
                                    }
                                })
                            })
                        }, 1e3), [2]
                    })
                })
            }, a.prototype.waitForSomethingToChange = function(u) {
                return n(this, void 0, void 0, function() {
                    return r(this, function(l) {
                        switch (l.label) {
                            case 0:
                                return [4, new Promise(function(d) {
                                    var f = !1,
                                        h = Date.now(),
                                        m = !1;

                                    function b() {
                                        if (m || (window.removeEventListener("storage", b), a.removeFromWaiting(b), clearTimeout(p), m = !0), !f) {
                                            f = !0;
                                            var v = 50 - (Date.now() - h);
                                            v > 0 ? setTimeout(d, v) : d()
                                        }
                                    }
                                    window.addEventListener("storage", b), a.addToWaiting(b);
                                    var p = setTimeout(b, Math.max(0, u - Date.now()))
                                })];
                            case 1:
                                return l.sent(), [2]
                        }
                    })
                })
            }, a.addToWaiting = function(u) {
                this.removeFromWaiting(u), a.waiters !== void 0 && a.waiters.push(u)
            }, a.removeFromWaiting = function(u) {
                a.waiters !== void 0 && (a.waiters = a.waiters.filter(function(l) {
                    return l !== u
                }))
            }, a.notifyWaiters = function() {
                a.waiters !== void 0 && a.waiters.slice().forEach(function(u) {
                    return u()
                })
            }, a.prototype.releaseLock = function(u) {
                return n(this, void 0, void 0, function() {
                    return r(this, function(l) {
                        switch (l.label) {
                            case 0:
                                return [4, this.releaseLock__private__(u)];
                            case 1:
                                return [2, l.sent()]
                        }
                    })
                })
            }, a.prototype.releaseLock__private__ = function(u) {
                return n(this, void 0, void 0, function() {
                    var l, d, f;
                    return r(this, function(h) {
                        switch (h.label) {
                            case 0:
                                return l = window.localStorage, d = o + "-" + u, (f = l.getItem(d)) === null ? [2] : (f = JSON.parse(f)).id !== this.id ? [3, 2] : [4, Ue.default().lock(f.iat)];
                            case 1:
                                h.sent(), this.acquiredIatSet.delete(f.iat), l.removeItem(d), Ue.default().unlock(f.iat), a.notifyWaiters(), h.label = 2;
                            case 2:
                                return [2]
                        }
                    })
                })
            }, a.lockCorrector = function() {
                for (var u = Date.now() - 5e3, l = window.localStorage, d = Object.keys(l), f = !1, h = 0; h < d.length; h++) {
                    var m = d[h];
                    if (m.includes(o)) {
                        var b = l.getItem(m);
                        b !== null && ((b = JSON.parse(b)).timeRefreshed === void 0 && b.timeAcquired < u || b.timeRefreshed !== void 0 && b.timeRefreshed < u) && (l.removeItem(m), f = !0)
                    }
                }
                f && a.notifyWaiters()
            }, a.waiters = void 0, a
        }();
        t.default = c
    }),
    Kd = Dr(Fd),
    Gd = {
        timeoutInSeconds: 60
    },
    Bd = ["login_required", "consent_required", "interaction_required", "account_selection_required", "access_denied"],
    ea = {
        name: "auth0-spa-js",
        version: "1.22.6"
    },
    ta = function() {
        return Date.now()
    },
    Ie = function(e) {
        function t(n, r) {
            var o = e.call(this, r) || this;
            return o.error = n, o.error_description = r, Object.setPrototypeOf(o, t.prototype), o
        }
        return tt(t, e), t.fromPayload = function(n) {
            return new t(n.error, n.error_description)
        }, t
    }(Error),
    Zd = function(e) {
        function t(n, r, o, s) {
            s === void 0 && (s = null);
            var i = e.call(this, n, r) || this;
            return i.state = o, i.appState = s, Object.setPrototypeOf(i, t.prototype), i
        }
        return tt(t, e), t
    }(Ie),
    xr = function(e) {
        function t() {
            var n = e.call(this, "timeout", "Timeout") || this;
            return Object.setPrototypeOf(n, t.prototype), n
        }
        return tt(t, e), t
    }(Ie),
    Ud = function(e) {
        function t(n) {
            var r = e.call(this) || this;
            return r.popup = n, Object.setPrototypeOf(r, t.prototype), r
        }
        return tt(t, e), t
    }(xr),
    Jd = function(e) {
        function t(n) {
            var r = e.call(this, "cancelled", "Popup closed") || this;
            return r.popup = n, Object.setPrototypeOf(r, t.prototype), r
        }
        return tt(t, e), t
    }(Ie),
    Xd = function(e) {
        function t(n, r, o) {
            var s = e.call(this, n, r) || this;
            return s.mfa_token = o, Object.setPrototypeOf(s, t.prototype), s
        }
        return tt(t, e), t
    }(Ie),
    Vd = function(e) {
        function t(n, r) {
            var o = e.call(this, "missing_refresh_token", "Missing Refresh Token (audience: '".concat(vi(n, ["default"]), "', scope: '").concat(vi(r), "')")) || this;
            return o.audience = n, o.scope = r, Object.setPrototypeOf(o, t.prototype), o
        }
        return tt(t, e), t
    }(Ie),
    qd = function(e) {
        return new Promise(function(t, n) {
            var r, o = setInterval(function() {
                    e.popup && e.popup.closed && (clearInterval(o), clearTimeout(s), window.removeEventListener("message", r, !1), n(new Jd(e.popup)))
                }, 1e3),
                s = setTimeout(function() {
                    clearInterval(o), n(new Ud(e.popup)), window.removeEventListener("message", r, !1)
                }, 1e3 * (e.timeoutInSeconds || 60));
            r = function(i) {
                if (i.data && i.data.type === "authorization_response") {
                    if (clearTimeout(s), clearInterval(o), window.removeEventListener("message", r, !1), e.popup.close(), i.data.response.error) return n(Ie.fromPayload(i.data.response));
                    t(i.data.response)
                }
            }, window.addEventListener("message", r)
        })
    },
    no = function() {
        return window.crypto || window.msCrypto
    },
    na = function() {
        var e = no();
        return e.subtle || e.webkitSubtle
    },
    Se = function() {
        var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.",
            t = "";
        return Array.from(no().getRandomValues(new Uint8Array(43))).forEach(function(n) {
            return t += e[n % e.length]
        }), t
    },
    it = function(e) {
        return btoa(e)
    },
    Or = function(e) {
        return Object.keys(e).filter(function(t) {
            return e[t] !== void 0
        }).map(function(t) {
            return encodeURIComponent(t) + "=" + encodeURIComponent(e[t])
        }).join("&")
    },
    Qn = function(e) {
        return P(void 0, void 0, void 0, function() {
            var t;
            return j(this, function(n) {
                switch (n.label) {
                    case 0:
                        return t = na().digest({
                            name: "SHA-256"
                        }, new TextEncoder().encode(e)), window.msCrypto ? [2, new Promise(function(r, o) {
                            t.oncomplete = function(s) {
                                r(s.target.result)
                            }, t.onerror = function(s) {
                                o(s.error)
                            }, t.onabort = function() {
                                o("The digest operation was aborted")
                            }
                        })] : [4, t];
                    case 1:
                        return [2, n.sent()]
                }
            })
        })
    },
    gi = function(e) {
        return function(t) {
            return decodeURIComponent(atob(t).split("").map(function(n) {
                return "%" + ("00" + n.charCodeAt(0).toString(16)).slice(-2)
            }).join(""))
        }(e.replace(/_/g, "/").replace(/-/g, "+"))
    },
    er = function(e) {
        var t = new Uint8Array(e);
        return function(n) {
            var r = {
                "+": "-",
                "/": "_",
                "=": ""
            };
            return n.replace(/[+/=]/g, function(o) {
                return r[o]
            })
        }(window.btoa(String.fromCharCode.apply(String, dr([], ht(Array.from(t)), !1))))
    };

function vi(e, t) {
    return t === void 0 && (t = []), e && !t.includes(e) ? e : ""
}
var zd = function(e, t) {
        return P(void 0, void 0, void 0, function() {
            var n, r;
            return j(this, function(o) {
                switch (o.label) {
                    case 0:
                        return [4, (s = e, i = t, i = i || {}, new Promise(function(c, a) {
                            var u = new XMLHttpRequest,
                                l = [],
                                d = [],
                                f = {},
                                h = function() {
                                    return {
                                        ok: (u.status / 100 | 0) == 2,
                                        statusText: u.statusText,
                                        status: u.status,
                                        url: u.responseURL,
                                        text: function() {
                                            return Promise.resolve(u.responseText)
                                        },
                                        json: function() {
                                            return Promise.resolve(u.responseText).then(JSON.parse)
                                        },
                                        blob: function() {
                                            return Promise.resolve(new Blob([u.response]))
                                        },
                                        clone: h,
                                        headers: {
                                            keys: function() {
                                                return l
                                            },
                                            entries: function() {
                                                return d
                                            },
                                            get: function(b) {
                                                return f[b.toLowerCase()]
                                            },
                                            has: function(b) {
                                                return b.toLowerCase() in f
                                            }
                                        }
                                    }
                                };
                            for (var m in u.open(i.method || "get", s, !0), u.onload = function() {
                                    u.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function(b, p, v) {
                                        l.push(p = p.toLowerCase()), d.push([p, v]), f[p] = f[p] ? f[p] + "," + v : v
                                    }), c(h())
                                }, u.onerror = a, u.withCredentials = i.credentials == "include", i.headers) u.setRequestHeader(m, i.headers[m]);
                            u.send(i.body || null)
                        }))];
                    case 1:
                        return n = o.sent(), r = {
                            ok: n.ok
                        }, [4, n.json()];
                    case 2:
                        return [2, (r.json = o.sent(), r)]
                }
                var s, i
            })
        })
    },
    Yd = function(e, t, n) {
        return P(void 0, void 0, void 0, function() {
            var r, o;
            return j(this, function(s) {
                return r = new AbortController, t.signal = r.signal, [2, Promise.race([zd(e, t), new Promise(function(i, c) {
                    o = setTimeout(function() {
                        r.abort(), c(new Error("Timeout when executing 'fetch'"))
                    }, n)
                })]).finally(function() {
                    clearTimeout(o)
                })]
            })
        })
    },
    $d = function(e, t, n, r, o, s, i) {
        return P(void 0, void 0, void 0, function() {
            return j(this, function(c) {
                return [2, (a = {
                    auth: {
                        audience: t,
                        scope: n
                    },
                    timeout: o,
                    fetchUrl: e,
                    fetchOptions: r,
                    useFormData: i
                }, u = s, new Promise(function(l, d) {
                    var f = new MessageChannel;
                    f.port1.onmessage = function(h) {
                        h.data.error ? d(new Error(h.data.error)) : l(h.data), f.port1.close()
                    }, u.postMessage(a, [f.port2])
                }))];
                var a, u
            })
        })
    },
    Qd = function(e, t, n, r, o, s, i) {
        return i === void 0 && (i = 1e4), P(void 0, void 0, void 0, function() {
            return j(this, function(c) {
                return o ? [2, $d(e, t, n, r, i, o, s)] : [2, Yd(e, r, i)]
            })
        })
    };

function ef(e, t, n, r, o, s, i) {
    return P(this, void 0, void 0, function() {
        var c, a, u, l, d, f, h, m, b;
        return j(this, function(p) {
            switch (p.label) {
                case 0:
                    c = null, u = 0, p.label = 1;
                case 1:
                    if (!(u < 3)) return [3, 6];
                    p.label = 2;
                case 2:
                    return p.trys.push([2, 4, , 5]), [4, Qd(e, n, r, o, s, i, t)];
                case 3:
                    return a = p.sent(), c = null, [3, 6];
                case 4:
                    return l = p.sent(), c = l, [3, 5];
                case 5:
                    return u++, [3, 1];
                case 6:
                    if (c) throw c.message = c.message || "Failed to fetch", c;
                    if (d = a.json, f = d.error, h = d.error_description, m = re(d, ["error", "error_description"]), !a.ok) throw b = h || "HTTP error. Unable to fetch ".concat(e), f === "mfa_required" ? new Xd(f, b, m.mfa_token) : new Ie(f || "request_error", b);
                    return [2, m]
            }
        })
    })
}

function $t(e, t) {
    var n = e.baseUrl,
        r = e.timeout,
        o = e.audience,
        s = e.scope,
        i = e.auth0Client,
        c = e.useFormData,
        a = re(e, ["baseUrl", "timeout", "audience", "scope", "auth0Client", "useFormData"]);
    return P(this, void 0, void 0, function() {
        var u;
        return j(this, function(l) {
            switch (l.label) {
                case 0:
                    return u = c ? Or(a) : JSON.stringify(a), [4, ef("".concat(n, "/oauth/token"), r, o || "default", s, {
                        method: "POST",
                        body: u,
                        headers: {
                            "Content-Type": c ? "application/x-www-form-urlencoded" : "application/json",
                            "Auth0-Client": btoa(JSON.stringify(i || ea))
                        }
                    }, t, c)];
                case 1:
                    return [2, l.sent()]
            }
        })
    })
}
var tf = function(e) {
        return Array.from(new Set(e))
    },
    Ae = function() {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        return tf(e.join(" ").trim().split(/\s+/)).join(" ")
    },
    Je = function() {
        function e(t, n) {
            n === void 0 && (n = "@@auth0spajs@@"), this.prefix = n, this.client_id = t.client_id, this.scope = t.scope, this.audience = t.audience
        }
        return e.prototype.toKey = function() {
            return "".concat(this.prefix, "::").concat(this.client_id, "::").concat(this.audience, "::").concat(this.scope)
        }, e.fromKey = function(t) {
            var n = ht(t.split("::"), 4),
                r = n[0],
                o = n[1],
                s = n[2];
            return new e({
                client_id: o,
                scope: n[3],
                audience: s
            }, r)
        }, e.fromCacheEntry = function(t) {
            return new e({
                scope: t.scope,
                audience: t.audience,
                client_id: t.client_id
            })
        }, e
    }(),
    nf = function() {
        function e() {}
        return e.prototype.set = function(t, n) {
            localStorage.setItem(t, JSON.stringify(n))
        }, e.prototype.get = function(t) {
            var n = window.localStorage.getItem(t);
            if (n) try {
                return JSON.parse(n)
            } catch {
                return
            }
        }, e.prototype.remove = function(t) {
            localStorage.removeItem(t)
        }, e.prototype.allKeys = function() {
            return Object.keys(window.localStorage).filter(function(t) {
                return t.startsWith("@@auth0spajs@@")
            })
        }, e
    }(),
    rf = function() {
        var e;
        this.enclosedCache = (e = {}, {
            set: function(t, n) {
                e[t] = n
            },
            get: function(t) {
                var n = e[t];
                if (n) return n
            },
            remove: function(t) {
                delete e[t]
            },
            allKeys: function() {
                return Object.keys(e)
            }
        })
    },
    of = function() {
        function e(t, n, r) {
            this.cache = t, this.keyManifest = n, this.nowProvider = r, this.nowProvider = this.nowProvider || ta
        }
        return e.prototype.get = function(t, n) {
            var r;
            return n === void 0 && (n = 0), P(this, void 0, void 0, function() {
                var o, s, i, c, a;
                return j(this, function(u) {
                    switch (u.label) {
                        case 0:
                            return [4, this.cache.get(t.toKey())];
                        case 1:
                            return (o = u.sent()) ? [3, 4] : [4, this.getCacheKeys()];
                        case 2:
                            return (s = u.sent()) ? (i = this.matchExistingCacheKey(t, s)) ? [4, this.cache.get(i)] : [3, 4] : [2];
                        case 3:
                            o = u.sent(), u.label = 4;
                        case 4:
                            return o ? [4, this.nowProvider()] : [2];
                        case 5:
                            return c = u.sent(), a = Math.floor(c / 1e3), o.expiresAt - n < a ? o.body.refresh_token ? (o.body = {
                                refresh_token: o.body.refresh_token
                            }, [4, this.cache.set(t.toKey(), o)]) : [3, 7] : [3, 10];
                        case 6:
                            return u.sent(), [2, o.body];
                        case 7:
                            return [4, this.cache.remove(t.toKey())];
                        case 8:
                            return u.sent(), [4, (r = this.keyManifest) === null || r === void 0 ? void 0 : r.remove(t.toKey())];
                        case 9:
                            return u.sent(), [2];
                        case 10:
                            return [2, o.body]
                    }
                })
            })
        }, e.prototype.set = function(t) {
            var n;
            return P(this, void 0, void 0, function() {
                var r, o;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return r = new Je({
                                client_id: t.client_id,
                                scope: t.scope,
                                audience: t.audience
                            }), [4, this.wrapCacheEntry(t)];
                        case 1:
                            return o = s.sent(), [4, this.cache.set(r.toKey(), o)];
                        case 2:
                            return s.sent(), [4, (n = this.keyManifest) === null || n === void 0 ? void 0 : n.add(r.toKey())];
                        case 3:
                            return s.sent(), [2]
                    }
                })
            })
        }, e.prototype.clear = function(t) {
            var n;
            return P(this, void 0, void 0, function() {
                var r, o = this;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return [4, this.getCacheKeys()];
                        case 1:
                            return (r = s.sent()) ? [4, r.filter(function(i) {
                                return !t || i.includes(t)
                            }).reduce(function(i, c) {
                                return P(o, void 0, void 0, function() {
                                    return j(this, function(a) {
                                        switch (a.label) {
                                            case 0:
                                                return [4, i];
                                            case 1:
                                                return a.sent(), [4, this.cache.remove(c)];
                                            case 2:
                                                return a.sent(), [2]
                                        }
                                    })
                                })
                            }, Promise.resolve())] : [2];
                        case 2:
                            return s.sent(), [4, (n = this.keyManifest) === null || n === void 0 ? void 0 : n.clear()];
                        case 3:
                            return s.sent(), [2]
                    }
                })
            })
        }, e.prototype.clearSync = function(t) {
            var n = this,
                r = this.cache.allKeys();
            r && r.filter(function(o) {
                return !t || o.includes(t)
            }).forEach(function(o) {
                n.cache.remove(o)
            })
        }, e.prototype.wrapCacheEntry = function(t) {
            return P(this, void 0, void 0, function() {
                var n, r, o;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return [4, this.nowProvider()];
                        case 1:
                            return n = s.sent(), r = Math.floor(n / 1e3) + t.expires_in, o = Math.min(r, t.decodedToken.claims.exp), [2, {
                                body: t,
                                expiresAt: o
                            }]
                    }
                })
            })
        }, e.prototype.getCacheKeys = function() {
            var t;
            return P(this, void 0, void 0, function() {
                var n;
                return j(this, function(r) {
                    switch (r.label) {
                        case 0:
                            return this.keyManifest ? [4, this.keyManifest.get()] : [3, 2];
                        case 1:
                            return n = (t = r.sent()) === null || t === void 0 ? void 0 : t.keys, [3, 4];
                        case 2:
                            return [4, this.cache.allKeys()];
                        case 3:
                            n = r.sent(), r.label = 4;
                        case 4:
                            return [2, n]
                    }
                })
            })
        }, e.prototype.matchExistingCacheKey = function(t, n) {
            return n.filter(function(r) {
                var o = Je.fromKey(r),
                    s = new Set(o.scope && o.scope.split(" ")),
                    i = t.scope.split(" "),
                    c = o.scope && i.reduce(function(a, u) {
                        return a && s.has(u)
                    }, !0);
                return o.prefix === "@@auth0spajs@@" && o.client_id === t.client_id && o.audience === t.audience && c
            })[0]
        }, e
    }(),
    sf = function() {
        function e(t, n) {
            this.storage = t, this.clientId = n, this.storageKey = "".concat("a0.spajs.txs", ".").concat(this.clientId), this.transaction = this.storage.get(this.storageKey)
        }
        return e.prototype.create = function(t) {
            this.transaction = t, this.storage.save(this.storageKey, t, {
                daysUntilExpire: 1
            })
        }, e.prototype.get = function() {
            return this.transaction
        }, e.prototype.remove = function() {
            delete this.transaction, this.storage.remove(this.storageKey)
        }, e
    }(),
    Lt = function(e) {
        return typeof e == "number"
    },
    af = ["iss", "aud", "exp", "nbf", "iat", "jti", "azp", "nonce", "auth_time", "at_hash", "c_hash", "acr", "amr", "sub_jwk", "cnf", "sip_from_tag", "sip_date", "sip_callid", "sip_cseq_num", "sip_via_branch", "orig", "dest", "mky", "events", "toe", "txn", "rph", "sid", "vot", "vtm"],
    cf = function(e) {
        if (!e.id_token) throw new Error("ID token is required but missing");
        var t = function(c) {
            var a = c.split("."),
                u = ht(a, 3),
                l = u[0],
                d = u[1],
                f = u[2];
            if (a.length !== 3 || !l || !d || !f) throw new Error("ID token could not be decoded");
            var h = JSON.parse(gi(d)),
                m = {
                    __raw: c
                },
                b = {};
            return Object.keys(h).forEach(function(p) {
                m[p] = h[p], af.includes(p) || (b[p] = h[p])
            }), {
                encoded: {
                    header: l,
                    payload: d,
                    signature: f
                },
                header: JSON.parse(gi(l)),
                claims: m,
                user: b
            }
        }(e.id_token);
        if (!t.claims.iss) throw new Error("Issuer (iss) claim must be a string present in the ID token");
        if (t.claims.iss !== e.iss) throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'.concat(e.iss, '", found "').concat(t.claims.iss, '"'));
        if (!t.user.sub) throw new Error("Subject (sub) claim must be a string present in the ID token");
        if (t.header.alg !== "RS256") throw new Error('Signature algorithm of "'.concat(t.header.alg, '" is not supported. Expected the ID token to be signed with "RS256".'));
        if (!t.claims.aud || typeof t.claims.aud != "string" && !Array.isArray(t.claims.aud)) throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");
        if (Array.isArray(t.claims.aud)) {
            if (!t.claims.aud.includes(e.aud)) throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e.aud, '" but was not one of "').concat(t.claims.aud.join(", "), '"'));
            if (t.claims.aud.length > 1) {
                if (!t.claims.azp) throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");
                if (t.claims.azp !== e.aud) throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'.concat(e.aud, '", found "').concat(t.claims.azp, '"'))
            }
        } else if (t.claims.aud !== e.aud) throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e.aud, '" but found "').concat(t.claims.aud, '"'));
        if (e.nonce) {
            if (!t.claims.nonce) throw new Error("Nonce (nonce) claim must be a string present in the ID token");
            if (t.claims.nonce !== e.nonce) throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'.concat(e.nonce, '", found "').concat(t.claims.nonce, '"'))
        }
        if (e.max_age && !Lt(t.claims.auth_time)) throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");
        if (!Lt(t.claims.exp)) throw new Error("Expiration Time (exp) claim must be a number present in the ID token");
        if (!Lt(t.claims.iat)) throw new Error("Issued At (iat) claim must be a number present in the ID token");
        var n = e.leeway || 60,
            r = new Date(e.now || Date.now()),
            o = new Date(0),
            s = new Date(0),
            i = new Date(0);
        if (i.setUTCSeconds(parseInt(t.claims.auth_time) + e.max_age + n), o.setUTCSeconds(t.claims.exp + n), s.setUTCSeconds(t.claims.nbf - n), r > o) throw new Error("Expiration Time (exp) claim error in the ID token; current time (".concat(r, ") is after expiration time (").concat(o, ")"));
        if (Lt(t.claims.nbf) && r < s) throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Currrent time (".concat(r, ") is before ").concat(s));
        if (Lt(t.claims.auth_time) && r > i) throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Currrent time (".concat(r, ") is after last auth at ").concat(i));
        if (e.organizationId) {
            if (!t.claims.org_id) throw new Error("Organization ID (org_id) claim must be a string present in the ID token");
            if (e.organizationId !== t.claims.org_id) throw new Error('Organization ID (org_id) claim mismatch in the ID token; expected "'.concat(e.organizationId, '", found "').concat(t.claims.org_id, '"'))
        }
        return t
    },
    Ve = vt(function(e, t) {
        var n = ye && ye.__assign || function() {
            return n = Object.assign || function(a) {
                for (var u, l = 1, d = arguments.length; l < d; l++)
                    for (var f in u = arguments[l]) Object.prototype.hasOwnProperty.call(u, f) && (a[f] = u[f]);
                return a
            }, n.apply(this, arguments)
        };

        function r(a, u) {
            if (!u) return "";
            var l = "; " + a;
            return u === !0 ? l : l + "=" + u
        }

        function o(a, u, l) {
            return encodeURIComponent(a).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/\(/g, "%28").replace(/\)/g, "%29") + "=" + encodeURIComponent(u).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + function(d) {
                if (typeof d.expires == "number") {
                    var f = new Date;
                    f.setMilliseconds(f.getMilliseconds() + 864e5 * d.expires), d.expires = f
                }
                return r("Expires", d.expires ? d.expires.toUTCString() : "") + r("Domain", d.domain) + r("Path", d.path) + r("Secure", d.secure) + r("SameSite", d.sameSite)
            }(l)
        }

        function s(a) {
            for (var u = {}, l = a ? a.split("; ") : [], d = /(%[\dA-F]{2})+/gi, f = 0; f < l.length; f++) {
                var h = l[f].split("="),
                    m = h.slice(1).join("=");
                m.charAt(0) === '"' && (m = m.slice(1, -1));
                try {
                    u[h[0].replace(d, decodeURIComponent)] = m.replace(d, decodeURIComponent)
                } catch {}
            }
            return u
        }

        function i() {
            return s(document.cookie)
        }

        function c(a, u, l) {
            document.cookie = o(a, u, n({
                path: "/"
            }, l))
        }
        t.__esModule = !0, t.encode = o, t.parse = s, t.getAll = i, t.get = function(a) {
            return i()[a]
        }, t.set = c, t.remove = function(a, u) {
            c(a, "", n(n({}, u), {
                expires: -1
            }))
        }
    });
Dr(Ve), Ve.encode, Ve.parse, Ve.getAll;
var uf = Ve.get,
    ra = Ve.set,
    oa = Ve.remove,
    at = {
        get: function(e) {
            var t = uf(e);
            if (t !== void 0) return JSON.parse(t)
        },
        save: function(e, t, n) {
            var r = {};
            window.location.protocol === "https:" && (r = {
                secure: !0,
                sameSite: "none"
            }), n != null && n.daysUntilExpire && (r.expires = n.daysUntilExpire), n != null && n.cookieDomain && (r.domain = n.cookieDomain), ra(e, JSON.stringify(t), r)
        },
        remove: function(e, t) {
            var n = {};
            t != null && t.cookieDomain && (n.domain = t.cookieDomain), oa(e, n)
        }
    },
    lf = {
        get: function(e) {
            var t = at.get(e);
            return t || at.get("".concat("_legacy_").concat(e))
        },
        save: function(e, t, n) {
            var r = {};
            window.location.protocol === "https:" && (r = {
                secure: !0
            }), n != null && n.daysUntilExpire && (r.expires = n.daysUntilExpire), ra("".concat("_legacy_").concat(e), JSON.stringify(t), r), at.save(e, t, n)
        },
        remove: function(e, t) {
            var n = {};
            t != null && t.cookieDomain && (n.domain = t.cookieDomain), oa(e, n), at.remove(e, t), at.remove("".concat("_legacy_").concat(e), t)
        }
    },
    df = {
        get: function(e) {
            if (typeof sessionStorage < "u") {
                var t = sessionStorage.getItem(e);
                if (t !== void 0) return JSON.parse(t)
            }
        },
        save: function(e, t) {
            sessionStorage.setItem(e, JSON.stringify(t))
        },
        remove: function(e) {
            sessionStorage.removeItem(e)
        }
    };

function ff(e, t, n) {
    var r = t === void 0 ? null : t,
        o = function(a, u) {
            var l = atob(a);
            if (u) {
                for (var d = new Uint8Array(l.length), f = 0, h = l.length; f < h; ++f) d[f] = l.charCodeAt(f);
                return String.fromCharCode.apply(null, new Uint16Array(d.buffer))
            }
            return l
        }(e, n !== void 0 && n),
        s = o.indexOf(`
`, 10) + 1,
        i = o.substring(s) + (r ? "//# sourceMappingURL=" + r : ""),
        c = new Blob([i], {
            type: "application/javascript"
        });
    return URL.createObjectURL(c)
}
var bi, wi, Si, tr, hf = (bi = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7dmFyIHQ9ZnVuY3Rpb24oZSxyKXtyZXR1cm4gdD1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fHtfX3Byb3RvX186W119aW5zdGFuY2VvZiBBcnJheSYmZnVuY3Rpb24odCxlKXt0Ll9fcHJvdG9fXz1lfXx8ZnVuY3Rpb24odCxlKXtmb3IodmFyIHIgaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxyKSYmKHRbcl09ZVtyXSl9LHQoZSxyKX07ZnVuY3Rpb24gZShlLHIpe2lmKCJmdW5jdGlvbiIhPXR5cGVvZiByJiZudWxsIT09cil0aHJvdyBuZXcgVHlwZUVycm9yKCJDbGFzcyBleHRlbmRzIHZhbHVlICIrU3RyaW5nKHIpKyIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbCIpO2Z1bmN0aW9uIG4oKXt0aGlzLmNvbnN0cnVjdG9yPWV9dChlLHIpLGUucHJvdG90eXBlPW51bGw9PT1yP09iamVjdC5jcmVhdGUocik6KG4ucHJvdG90eXBlPXIucHJvdG90eXBlLG5ldyBuKX12YXIgcj1mdW5jdGlvbigpe3JldHVybiByPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxyPTEsbj1hcmd1bWVudHMubGVuZ3RoO3I8bjtyKyspZm9yKHZhciBvIGluIGU9YXJndW1lbnRzW3JdKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLG8pJiYodFtvXT1lW29dKTtyZXR1cm4gdH0sci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2Z1bmN0aW9uIG4odCxlLHIsbil7cmV0dXJuIG5ldyhyfHwocj1Qcm9taXNlKSkoKGZ1bmN0aW9uKG8sYyl7ZnVuY3Rpb24gaSh0KXt0cnl7cyhuLm5leHQodCkpfWNhdGNoKHQpe2ModCl9fWZ1bmN0aW9uIGEodCl7dHJ5e3Mobi50aHJvdyh0KSl9Y2F0Y2godCl7Yyh0KX19ZnVuY3Rpb24gcyh0KXt2YXIgZTt0LmRvbmU/byh0LnZhbHVlKTooZT10LnZhbHVlLGUgaW5zdGFuY2VvZiByP2U6bmV3IHIoKGZ1bmN0aW9uKHQpe3QoZSl9KSkpLnRoZW4oaSxhKX1zKChuPW4uYXBwbHkodCxlfHxbXSkpLm5leHQoKSl9KSl9ZnVuY3Rpb24gbyh0LGUpe3ZhciByLG4sbyxjLGk9e2xhYmVsOjAsc2VudDpmdW5jdGlvbigpe2lmKDEmb1swXSl0aHJvdyBvWzFdO3JldHVybiBvWzFdfSx0cnlzOltdLG9wczpbXX07cmV0dXJuIGM9e25leHQ6YSgwKSx0aHJvdzphKDEpLHJldHVybjphKDIpfSwiZnVuY3Rpb24iPT10eXBlb2YgU3ltYm9sJiYoY1tTeW1ib2wuaXRlcmF0b3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KSxjO2Z1bmN0aW9uIGEoYyl7cmV0dXJuIGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihjKXtpZihyKXRocm93IG5ldyBUeXBlRXJyb3IoIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy4iKTtmb3IoO2k7KXRyeXtpZihyPTEsbiYmKG89MiZjWzBdP24ucmV0dXJuOmNbMF0/bi50aHJvd3x8KChvPW4ucmV0dXJuKSYmby5jYWxsKG4pLDApOm4ubmV4dCkmJiEobz1vLmNhbGwobixjWzFdKSkuZG9uZSlyZXR1cm4gbztzd2l0Y2gobj0wLG8mJihjPVsyJmNbMF0sby52YWx1ZV0pLGNbMF0pe2Nhc2UgMDpjYXNlIDE6bz1jO2JyZWFrO2Nhc2UgNDpyZXR1cm4gaS5sYWJlbCsrLHt2YWx1ZTpjWzFdLGRvbmU6ITF9O2Nhc2UgNTppLmxhYmVsKyssbj1jWzFdLGM9WzBdO2NvbnRpbnVlO2Nhc2UgNzpjPWkub3BzLnBvcCgpLGkudHJ5cy5wb3AoKTtjb250aW51ZTtkZWZhdWx0OmlmKCEobz1pLnRyeXMsKG89by5sZW5ndGg+MCYmb1tvLmxlbmd0aC0xXSl8fDYhPT1jWzBdJiYyIT09Y1swXSkpe2k9MDtjb250aW51ZX1pZigzPT09Y1swXSYmKCFvfHxjWzFdPm9bMF0mJmNbMV08b1szXSkpe2kubGFiZWw9Y1sxXTticmVha31pZig2PT09Y1swXSYmaS5sYWJlbDxvWzFdKXtpLmxhYmVsPW9bMV0sbz1jO2JyZWFrfWlmKG8mJmkubGFiZWw8b1syXSl7aS5sYWJlbD1vWzJdLGkub3BzLnB1c2goYyk7YnJlYWt9b1syXSYmaS5vcHMucG9wKCksaS50cnlzLnBvcCgpO2NvbnRpbnVlfWM9ZS5jYWxsKHQsaSl9Y2F0Y2godCl7Yz1bNix0XSxuPTB9ZmluYWxseXtyPW89MH1pZig1JmNbMF0pdGhyb3cgY1sxXTtyZXR1cm57dmFsdWU6Y1swXT9jWzFdOnZvaWQgMCxkb25lOiEwfX0oW2MsYV0pfX19ZnVuY3Rpb24gYyh0LGUpe3JldHVybiB2b2lkIDA9PT1lJiYoZT1bXSksdCYmIWUuaW5jbHVkZXModCk/dDoiIn12YXIgaT1mdW5jdGlvbih0KXtmdW5jdGlvbiByKGUsbil7dmFyIG89dC5jYWxsKHRoaXMsbil8fHRoaXM7cmV0dXJuIG8uZXJyb3I9ZSxvLmVycm9yX2Rlc2NyaXB0aW9uPW4sT2JqZWN0LnNldFByb3RvdHlwZU9mKG8sci5wcm90b3R5cGUpLG99cmV0dXJuIGUocix0KSxyLmZyb21QYXlsb2FkPWZ1bmN0aW9uKHQpe3JldHVybiBuZXcgcih0LmVycm9yLHQuZXJyb3JfZGVzY3JpcHRpb24pfSxyfShFcnJvcik7IWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIoZSxuLG8sYyl7dm9pZCAwPT09YyYmKGM9bnVsbCk7dmFyIGk9dC5jYWxsKHRoaXMsZSxuKXx8dGhpcztyZXR1cm4gaS5zdGF0ZT1vLGkuYXBwU3RhdGU9YyxPYmplY3Quc2V0UHJvdG90eXBlT2YoaSxyLnByb3RvdHlwZSksaX1lKHIsdCl9KGkpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIoZSl7dmFyIG49dC5jYWxsKHRoaXMpfHx0aGlzO3JldHVybiBuLnBvcHVwPWUsT2JqZWN0LnNldFByb3RvdHlwZU9mKG4sci5wcm90b3R5cGUpLG59ZShyLHQpfShmdW5jdGlvbih0KXtmdW5jdGlvbiByKCl7dmFyIGU9dC5jYWxsKHRoaXMsInRpbWVvdXQiLCJUaW1lb3V0Iil8fHRoaXM7cmV0dXJuIE9iamVjdC5zZXRQcm90b3R5cGVPZihlLHIucHJvdG90eXBlKSxlfXJldHVybiBlKHIsdCkscn0oaSkpLGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIHIoZSl7dmFyIG49dC5jYWxsKHRoaXMsImNhbmNlbGxlZCIsIlBvcHVwIGNsb3NlZCIpfHx0aGlzO3JldHVybiBuLnBvcHVwPWUsT2JqZWN0LnNldFByb3RvdHlwZU9mKG4sci5wcm90b3R5cGUpLG59ZShyLHQpfShpKSxmdW5jdGlvbih0KXtmdW5jdGlvbiByKGUsbixvKXt2YXIgYz10LmNhbGwodGhpcyxlLG4pfHx0aGlzO3JldHVybiBjLm1mYV90b2tlbj1vLE9iamVjdC5zZXRQcm90b3R5cGVPZihjLHIucHJvdG90eXBlKSxjfWUocix0KX0oaSk7dmFyIGE9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gcihlLG4pe3ZhciBvPXQuY2FsbCh0aGlzLCJtaXNzaW5nX3JlZnJlc2hfdG9rZW4iLCJNaXNzaW5nIFJlZnJlc2ggVG9rZW4gKGF1ZGllbmNlOiAnIi5jb25jYXQoYyhlLFsiZGVmYXVsdCJdKSwiJywgc2NvcGU6ICciKS5jb25jYXQoYyhuKSwiJykiKSl8fHRoaXM7cmV0dXJuIG8uYXVkaWVuY2U9ZSxvLnNjb3BlPW4sT2JqZWN0LnNldFByb3RvdHlwZU9mKG8sci5wcm90b3R5cGUpLG99cmV0dXJuIGUocix0KSxyfShpKSxzPXt9LHU9ZnVuY3Rpb24odCxlKXtyZXR1cm4iIi5jb25jYXQodCwifCIpLmNvbmNhdChlKX07YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsKGZ1bmN0aW9uKHQpe3ZhciBlPXQuZGF0YSxjPWUudGltZW91dCxpPWUuYXV0aCxmPWUuZmV0Y2hVcmwsbD1lLmZldGNoT3B0aW9ucyxwPWUudXNlRm9ybURhdGEsaD1mdW5jdGlvbih0LGUpe3ZhciByPSJmdW5jdGlvbiI9PXR5cGVvZiBTeW1ib2wmJnRbU3ltYm9sLml0ZXJhdG9yXTtpZighcilyZXR1cm4gdDt2YXIgbixvLGM9ci5jYWxsKHQpLGk9W107dHJ5e2Zvcig7KHZvaWQgMD09PWV8fGUtLSA+MCkmJiEobj1jLm5leHQoKSkuZG9uZTspaS5wdXNoKG4udmFsdWUpfWNhdGNoKHQpe289e2Vycm9yOnR9fWZpbmFsbHl7dHJ5e24mJiFuLmRvbmUmJihyPWMucmV0dXJuKSYmci5jYWxsKGMpfWZpbmFsbHl7aWYobyl0aHJvdyBvLmVycm9yfX1yZXR1cm4gaX0odC5wb3J0cywxKVswXTtyZXR1cm4gbih2b2lkIDAsdm9pZCAwLHZvaWQgMCwoZnVuY3Rpb24oKXt2YXIgdCxlLG4seSx2LGIsZCx3LE8sXztyZXR1cm4gbyh0aGlzLChmdW5jdGlvbihvKXtzd2l0Y2goby5sYWJlbCl7Y2FzZSAwOm49KGU9aXx8e30pLmF1ZGllbmNlLHk9ZS5zY29wZSxvLmxhYmVsPTE7Y2FzZSAxOmlmKG8udHJ5cy5wdXNoKFsxLDcsLDhdKSwhKHY9cD8obT1sLmJvZHksaz1uZXcgVVJMU2VhcmNoUGFyYW1zKG0pLFA9e30say5mb3JFYWNoKChmdW5jdGlvbih0LGUpe1BbZV09dH0pKSxQKTpKU09OLnBhcnNlKGwuYm9keSkpLnJlZnJlc2hfdG9rZW4mJiJyZWZyZXNoX3Rva2VuIj09PXYuZ3JhbnRfdHlwZSl7aWYoYj1mdW5jdGlvbih0LGUpe3JldHVybiBzW3UodCxlKV19KG4seSksIWIpdGhyb3cgbmV3IGEobix5KTtsLmJvZHk9cD9uZXcgVVJMU2VhcmNoUGFyYW1zKHIocih7fSx2KSx7cmVmcmVzaF90b2tlbjpifSkpLnRvU3RyaW5nKCk6SlNPTi5zdHJpbmdpZnkocihyKHt9LHYpLHtyZWZyZXNoX3Rva2VuOmJ9KSl9ZD12b2lkIDAsImZ1bmN0aW9uIj09dHlwZW9mIEFib3J0Q29udHJvbGxlciYmKGQ9bmV3IEFib3J0Q29udHJvbGxlcixsLnNpZ25hbD1kLnNpZ25hbCksdz12b2lkIDAsby5sYWJlbD0yO2Nhc2UgMjpyZXR1cm4gby50cnlzLnB1c2goWzIsNCwsNV0pLFs0LFByb21pc2UucmFjZShbKGc9YyxuZXcgUHJvbWlzZSgoZnVuY3Rpb24odCl7cmV0dXJuIHNldFRpbWVvdXQodCxnKX0pKSksZmV0Y2goZixyKHt9LGwpKV0pXTtjYXNlIDM6cmV0dXJuIHc9by5zZW50KCksWzMsNV07Y2FzZSA0OnJldHVybiBPPW8uc2VudCgpLGgucG9zdE1lc3NhZ2Uoe2Vycm9yOk8ubWVzc2FnZX0pLFsyXTtjYXNlIDU6cmV0dXJuIHc/WzQsdy5qc29uKCldOihkJiZkLmFib3J0KCksaC5wb3N0TWVzc2FnZSh7ZXJyb3I6IlRpbWVvdXQgd2hlbiBleGVjdXRpbmcgJ2ZldGNoJyJ9KSxbMl0pO2Nhc2UgNjpyZXR1cm4odD1vLnNlbnQoKSkucmVmcmVzaF90b2tlbj8oZnVuY3Rpb24odCxlLHIpe3NbdShlLHIpXT10fSh0LnJlZnJlc2hfdG9rZW4sbix5KSxkZWxldGUgdC5yZWZyZXNoX3Rva2VuKTpmdW5jdGlvbih0LGUpe2RlbGV0ZSBzW3UodCxlKV19KG4seSksaC5wb3N0TWVzc2FnZSh7b2s6dy5vayxqc29uOnR9KSxbMyw4XTtjYXNlIDc6cmV0dXJuIF89by5zZW50KCksaC5wb3N0TWVzc2FnZSh7b2s6ITEsanNvbjp7ZXJyb3JfZGVzY3JpcHRpb246Xy5tZXNzYWdlfX0pLFszLDhdO2Nhc2UgODpyZXR1cm5bMl19dmFyIGcsbSxrLFB9KSl9KSl9KSl9KCk7Cgo=", wi = null, Si = !1, function(e) {
        return tr = tr || ff(bi, wi, Si), new Worker(tr, e)
    }),
    nr = {},
    pf = function() {
        function e(t, n) {
            this.cache = t, this.clientId = n, this.manifestKey = this.createManifestKeyFrom(this.clientId)
        }
        return e.prototype.add = function(t) {
            var n;
            return P(this, void 0, void 0, function() {
                var r, o;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return o = Set.bind, [4, this.cache.get(this.manifestKey)];
                        case 1:
                            return (r = new(o.apply(Set, [void 0, ((n = s.sent()) === null || n === void 0 ? void 0 : n.keys) || []]))).add(t), [4, this.cache.set(this.manifestKey, {
                                keys: dr([], ht(r), !1)
                            })];
                        case 2:
                            return s.sent(), [2]
                    }
                })
            })
        }, e.prototype.remove = function(t) {
            return P(this, void 0, void 0, function() {
                var n, r;
                return j(this, function(o) {
                    switch (o.label) {
                        case 0:
                            return [4, this.cache.get(this.manifestKey)];
                        case 1:
                            return (n = o.sent()) ? ((r = new Set(n.keys)).delete(t), r.size > 0 ? [4, this.cache.set(this.manifestKey, {
                                keys: dr([], ht(r), !1)
                            })] : [3, 3]) : [3, 5];
                        case 2:
                        case 4:
                            return [2, o.sent()];
                        case 3:
                            return [4, this.cache.remove(this.manifestKey)];
                        case 5:
                            return [2]
                    }
                })
            })
        }, e.prototype.get = function() {
            return this.cache.get(this.manifestKey)
        }, e.prototype.clear = function() {
            return this.cache.remove(this.manifestKey)
        }, e.prototype.createManifestKeyFrom = function(t) {
            return "".concat("@@auth0spajs@@", "::").concat(t)
        }, e
    }(),
    rr = new Kd,
    mf = {
        memory: function() {
            return new rf().enclosedCache
        },
        localstorage: function() {
            return new nf
        }
    },
    ki = function(e) {
        return mf[e]
    },
    yf = function() {
        return !/Trident.*rv:11\.0/.test(navigator.userAgent)
    },
    gf = function() {
        function e(t) {
            var n, r, o, s, i = this;
            if (this.options = t, this._releaseLockOnPageHide = function() {
                    return P(i, void 0, void 0, function() {
                        return j(this, function(u) {
                            switch (u.label) {
                                case 0:
                                    return [4, rr.releaseLock("auth0.lock.getTokenSilently")];
                                case 1:
                                    return u.sent(), window.removeEventListener("pagehide", this._releaseLockOnPageHide), [2]
                            }
                        })
                    })
                }, typeof window < "u" && function() {
                    if (!no()) throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");
                    if (na() === void 0) throw new Error(`
      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.
    `)
                }(), t.cache && t.cacheLocation && console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."), t.cache) o = t.cache;
            else {
                if (this.cacheLocation = t.cacheLocation || "memory", !ki(this.cacheLocation)) throw new Error('Invalid cache location "'.concat(this.cacheLocation, '"'));
                o = ki(this.cacheLocation)()
            }
            this.httpTimeoutMs = t.httpTimeoutInSeconds ? 1e3 * t.httpTimeoutInSeconds : 1e4, this.cookieStorage = t.legacySameSiteCookie === !1 ? at : lf, this.orgHintCookieName = (s = this.options.client_id, "auth0.".concat(s, ".organization_hint")), this.isAuthenticatedCookieName = function(u) {
                return "auth0.".concat(u, ".is.authenticated")
            }(this.options.client_id), this.sessionCheckExpiryDays = t.sessionCheckExpiryDays || 1;
            var c, a = t.useCookiesForTransactions ? this.cookieStorage : df;
            this.scope = this.options.scope, this.transactionManager = new sf(a, this.options.client_id), this.nowProvider = this.options.nowProvider || ta, this.cacheManager = new of (o, o.allKeys ? null : new pf(o, this.options.client_id), this.nowProvider), this.domainUrl = (c = this.options.domain, /^https?:\/\//.test(c) ? c : "https://".concat(c)), this.tokenIssuer = function(u, l) {
                return u ? u.startsWith("https://") ? u : "https://".concat(u, "/") : "".concat(l, "/")
            }(this.options.issuer, this.domainUrl), this.defaultScope = Ae("openid", ((r = (n = this.options) === null || n === void 0 ? void 0 : n.advancedOptions) === null || r === void 0 ? void 0 : r.defaultScope) !== void 0 ? this.options.advancedOptions.defaultScope : "openid profile email"), this.options.useRefreshTokens && (this.scope = Ae(this.scope, "offline_access")), typeof window < "u" && window.Worker && this.options.useRefreshTokens && this.cacheLocation === "memory" && yf() && (this.worker = new hf), this.customOptions = function(u) {
                return u.advancedOptions, u.audience, u.auth0Client, u.authorizeTimeoutInSeconds, u.cacheLocation, u.cache, u.client_id, u.domain, u.issuer, u.leeway, u.max_age, u.nowProvider, u.redirect_uri, u.scope, u.useRefreshTokens, u.useRefreshTokensFallback, u.useCookiesForTransactions, u.useFormData, re(u, ["advancedOptions", "audience", "auth0Client", "authorizeTimeoutInSeconds", "cacheLocation", "cache", "client_id", "domain", "issuer", "leeway", "max_age", "nowProvider", "redirect_uri", "scope", "useRefreshTokens", "useRefreshTokensFallback", "useCookiesForTransactions", "useFormData"])
            }(t), this.useRefreshTokensFallback = this.options.useRefreshTokensFallback !== !1
        }
        return e.prototype._url = function(t) {
            var n = encodeURIComponent(btoa(JSON.stringify(this.options.auth0Client || ea)));
            return "".concat(this.domainUrl).concat(t, "&auth0Client=").concat(n)
        }, e.prototype._getParams = function(t, n, r, o, s) {
            var i = this.options;
            i.useRefreshTokens, i.useCookiesForTransactions, i.useFormData, i.auth0Client, i.cacheLocation, i.advancedOptions, i.detailedResponse, i.nowProvider, i.authorizeTimeoutInSeconds, i.legacySameSiteCookie, i.sessionCheckExpiryDays, i.domain, i.leeway, i.httpTimeoutInSeconds;
            var c = re(i, ["useRefreshTokens", "useCookiesForTransactions", "useFormData", "auth0Client", "cacheLocation", "advancedOptions", "detailedResponse", "nowProvider", "authorizeTimeoutInSeconds", "legacySameSiteCookie", "sessionCheckExpiryDays", "domain", "leeway", "httpTimeoutInSeconds"]);
            return O(O(O({}, c), t), {
                scope: Ae(this.defaultScope, this.scope, t.scope),
                response_type: "code",
                response_mode: "query",
                state: n,
                nonce: r,
                redirect_uri: s || this.options.redirect_uri,
                code_challenge: o,
                code_challenge_method: "S256"
            })
        }, e.prototype._authorizeUrl = function(t) {
            return this._url("/authorize?".concat(Or(t)))
        }, e.prototype._verifyIdToken = function(t, n, r) {
            return P(this, void 0, void 0, function() {
                var o;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return [4, this.nowProvider()];
                        case 1:
                            return o = s.sent(), [2, cf({
                                iss: this.tokenIssuer,
                                aud: this.options.client_id,
                                id_token: t,
                                nonce: n,
                                organizationId: r,
                                leeway: this.options.leeway,
                                max_age: this._parseNumber(this.options.max_age),
                                now: o
                            })]
                    }
                })
            })
        }, e.prototype._parseNumber = function(t) {
            return typeof t != "string" ? t : parseInt(t, 10) || void 0
        }, e.prototype._processOrgIdHint = function(t) {
            t ? this.cookieStorage.save(this.orgHintCookieName, t, {
                daysUntilExpire: this.sessionCheckExpiryDays,
                cookieDomain: this.options.cookieDomain
            }) : this.cookieStorage.remove(this.orgHintCookieName, {
                cookieDomain: this.options.cookieDomain
            })
        }, e.prototype.buildAuthorizeUrl = function(t) {
            return t === void 0 && (t = {}), P(this, void 0, void 0, function() {
                var n, r, o, s, i, c, a, u, l, d, f, h;
                return j(this, function(m) {
                    switch (m.label) {
                        case 0:
                            return n = t.redirect_uri, r = t.appState, o = re(t, ["redirect_uri", "appState"]), s = it(Se()), i = it(Se()), c = Se(), [4, Qn(c)];
                        case 1:
                            return a = m.sent(), u = er(a), l = t.fragment ? "#".concat(t.fragment) : "", d = this._getParams(o, s, i, u, n), f = this._authorizeUrl(d), h = t.organization || this.options.organization, this.transactionManager.create(O({
                                nonce: i,
                                code_verifier: c,
                                appState: r,
                                scope: d.scope,
                                audience: d.audience || "default",
                                redirect_uri: d.redirect_uri,
                                state: s
                            }, h && {
                                organizationId: h
                            })), [2, f + l]
                    }
                })
            })
        }, e.prototype.loginWithPopup = function(t, n) {
            return P(this, void 0, void 0, function() {
                var r, o, s, i, c, a, u, l, d, f, h, m, b;
                return j(this, function(p) {
                    switch (p.label) {
                        case 0:
                            if (t = t || {}, !(n = n || {}).popup && (n.popup = function(v) {
                                    var y = window.screenX + (window.innerWidth - 400) / 2,
                                        k = window.screenY + (window.innerHeight - 600) / 2;
                                    return window.open(v, "auth0:authorize:popup", "left=".concat(y, ",top=").concat(k, ",width=").concat(400, ",height=").concat(600, ",resizable,scrollbars=yes,status=1"))
                                }(""), !n.popup)) throw new Error("Unable to open a popup for loginWithPopup - window.open returned `null`");
                            return r = re(t, []), o = it(Se()), s = it(Se()), i = Se(), [4, Qn(i)];
                        case 1:
                            return c = p.sent(), a = er(c), u = this._getParams(r, o, s, a, this.options.redirect_uri || window.location.origin), l = this._authorizeUrl(O(O({}, u), {
                                response_mode: "web_message"
                            })), n.popup.location.href = l, [4, qd(O(O({}, n), {
                                timeoutInSeconds: n.timeoutInSeconds || this.options.authorizeTimeoutInSeconds || 60
                            }))];
                        case 2:
                            if (d = p.sent(), o !== d.state) throw new Error("Invalid state");
                            return [4, $t({
                                audience: u.audience,
                                scope: u.scope,
                                baseUrl: this.domainUrl,
                                client_id: this.options.client_id,
                                code_verifier: i,
                                code: d.code,
                                grant_type: "authorization_code",
                                redirect_uri: u.redirect_uri,
                                auth0Client: this.options.auth0Client,
                                useFormData: this.options.useFormData,
                                timeout: this.httpTimeoutMs
                            }, this.worker)];
                        case 3:
                            return f = p.sent(), h = t.organization || this.options.organization, [4, this._verifyIdToken(f.id_token, s, h)];
                        case 4:
                            return m = p.sent(), b = O(O({}, f), {
                                decodedToken: m,
                                scope: u.scope,
                                audience: u.audience || "default",
                                client_id: this.options.client_id
                            }), [4, this.cacheManager.set(b)];
                        case 5:
                            return p.sent(), this.cookieStorage.save(this.isAuthenticatedCookieName, !0, {
                                daysUntilExpire: this.sessionCheckExpiryDays,
                                cookieDomain: this.options.cookieDomain
                            }), this._processOrgIdHint(m.claims.org_id), [2]
                    }
                })
            })
        }, e.prototype.getUser = function(t) {
            return t === void 0 && (t = {}), P(this, void 0, void 0, function() {
                var n, r, o;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return n = t.audience || this.options.audience || "default", r = Ae(this.defaultScope, this.scope, t.scope), [4, this.cacheManager.get(new Je({
                                client_id: this.options.client_id,
                                audience: n,
                                scope: r
                            }))];
                        case 1:
                            return [2, (o = s.sent()) && o.decodedToken && o.decodedToken.user]
                    }
                })
            })
        }, e.prototype.getIdTokenClaims = function(t) {
            return t === void 0 && (t = {}), P(this, void 0, void 0, function() {
                var n, r, o;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return n = t.audience || this.options.audience || "default", r = Ae(this.defaultScope, this.scope, t.scope), [4, this.cacheManager.get(new Je({
                                client_id: this.options.client_id,
                                audience: n,
                                scope: r
                            }))];
                        case 1:
                            return [2, (o = s.sent()) && o.decodedToken && o.decodedToken.claims]
                    }
                })
            })
        }, e.prototype.loginWithRedirect = function(t) {
            return t === void 0 && (t = {}), P(this, void 0, void 0, function() {
                var n, r, o;
                return j(this, function(s) {
                    switch (s.label) {
                        case 0:
                            return n = t.redirectMethod, r = re(t, ["redirectMethod"]), [4, this.buildAuthorizeUrl(r)];
                        case 1:
                            return o = s.sent(), window.location[n || "assign"](o), [2]
                    }
                })
            })
        }, e.prototype.handleRedirectCallback = function(t) {
            return t === void 0 && (t = window.location.href), P(this, void 0, void 0, function() {
                var n, r, o, s, i, c, a, u, l, d;
                return j(this, function(f) {
                    switch (f.label) {
                        case 0:
                            if ((n = t.split("?").slice(1)).length === 0) throw new Error("There are no query params available for parsing.");
                            if (r = function(h) {
                                    h.indexOf("#") > -1 && (h = h.substr(0, h.indexOf("#")));
                                    var m = h.split("&"),
                                        b = {};
                                    return m.forEach(function(p) {
                                        var v = ht(p.split("="), 2),
                                            y = v[0],
                                            k = v[1];
                                        b[y] = decodeURIComponent(k)
                                    }), b.expires_in && (b.expires_in = parseInt(b.expires_in)), b
                                }(n.join("")), o = r.state, s = r.code, i = r.error, c = r.error_description, !(a = this.transactionManager.get())) throw new Error("Invalid state");
                            if (this.transactionManager.remove(), i) throw new Zd(i, c, o, a.appState);
                            if (!a.code_verifier || a.state && a.state !== o) throw new Error("Invalid state");
                            return u = {
                                audience: a.audience,
                                scope: a.scope,
                                baseUrl: this.domainUrl,
                                client_id: this.options.client_id,
                                code_verifier: a.code_verifier,
                                grant_type: "authorization_code",
                                code: s,
                                auth0Client: this.options.auth0Client,
                                useFormData: this.options.useFormData,
                                timeout: this.httpTimeoutMs
                            }, a.redirect_uri !== void 0 && (u.redirect_uri = a.redirect_uri), [4, $t(u, this.worker)];
                        case 1:
                            return l = f.sent(), [4, this._verifyIdToken(l.id_token, a.nonce, a.organizationId)];
                        case 2:
                            return d = f.sent(), [4, this.cacheManager.set(O(O(O(O({}, l), {
                                decodedToken: d,
                                audience: a.audience,
                                scope: a.scope
                            }), l.scope ? {
                                oauthTokenScope: l.scope
                            } : null), {
                                client_id: this.options.client_id
                            }))];
                        case 3:
                            return f.sent(), this.cookieStorage.save(this.isAuthenticatedCookieName, !0, {
                                daysUntilExpire: this.sessionCheckExpiryDays,
                                cookieDomain: this.options.cookieDomain
                            }), this._processOrgIdHint(d.claims.org_id), [2, {
                                appState: a.appState
                            }]
                    }
                })
            })
        }, e.prototype.checkSession = function(t) {
            return P(this, void 0, void 0, function() {
                var n;
                return j(this, function(r) {
                    switch (r.label) {
                        case 0:
                            if (!this.cookieStorage.get(this.isAuthenticatedCookieName)) {
                                if (!this.cookieStorage.get("auth0.is.authenticated")) return [2];
                                this.cookieStorage.save(this.isAuthenticatedCookieName, !0, {
                                    daysUntilExpire: this.sessionCheckExpiryDays,
                                    cookieDomain: this.options.cookieDomain
                                }), this.cookieStorage.remove("auth0.is.authenticated")
                            }
                            r.label = 1;
                        case 1:
                            return r.trys.push([1, 3, , 4]), [4, this.getTokenSilently(t)];
                        case 2:
                            return r.sent(), [3, 4];
                        case 3:
                            if (n = r.sent(), !Bd.includes(n.error)) throw n;
                            return [3, 4];
                        case 4:
                            return [2]
                    }
                })
            })
        }, e.prototype.getTokenSilently = function(t) {
            return t === void 0 && (t = {}), P(this, void 0, void 0, function() {
                var n, r, o, s, i = this;
                return j(this, function(c) {
                    switch (c.label) {
                        case 0:
                            return n = O(O({
                                audience: this.options.audience,
                                ignoreCache: !1
                            }, t), {
                                scope: Ae(this.defaultScope, this.scope, t.scope)
                            }), r = n.ignoreCache, o = re(n, ["ignoreCache"]), [4, (a = function() {
                                return i._getTokenSilently(O({
                                    ignoreCache: r
                                }, o))
                            }, u = "".concat(this.options.client_id, "::").concat(o.audience, "::").concat(o.scope), l = nr[u], l || (l = a().finally(function() {
                                delete nr[u], l = null
                            }), nr[u] = l), l)];
                        case 1:
                            return s = c.sent(), [2, t.detailedResponse ? s : s.access_token]
                    }
                    var a, u, l
                })
            })
        }, e.prototype._getTokenSilently = function(t) {
            return t === void 0 && (t = {}), P(this, void 0, void 0, function() {
                var n, r, o, s, i, c, a, u, l;
                return j(this, function(d) {
                    switch (d.label) {
                        case 0:
                            return n = t.ignoreCache, r = re(t, ["ignoreCache"]), n ? [3, 2] : [4, this._getEntryFromCache({
                                scope: r.scope,
                                audience: r.audience || "default",
                                client_id: this.options.client_id
                            })];
                        case 1:
                            if (o = d.sent()) return [2, o];
                            d.label = 2;
                        case 2:
                            return [4, (f = function() {
                                return rr.acquireLock("auth0.lock.getTokenSilently", 5e3)
                            }, h = 10, h === void 0 && (h = 3), P(void 0, void 0, void 0, function() {
                                var m;
                                return j(this, function(b) {
                                    switch (b.label) {
                                        case 0:
                                            m = 0, b.label = 1;
                                        case 1:
                                            return m < h ? [4, f()] : [3, 4];
                                        case 2:
                                            if (b.sent()) return [2, !0];
                                            b.label = 3;
                                        case 3:
                                            return m++, [3, 1];
                                        case 4:
                                            return [2, !1]
                                    }
                                })
                            }))];
                        case 3:
                            if (!d.sent()) return [3, 15];
                            d.label = 4;
                        case 4:
                            return d.trys.push([4, , 12, 14]), window.addEventListener("pagehide", this._releaseLockOnPageHide), n ? [3, 6] : [4, this._getEntryFromCache({
                                scope: r.scope,
                                audience: r.audience || "default",
                                client_id: this.options.client_id
                            })];
                        case 5:
                            if (o = d.sent()) return [2, o];
                            d.label = 6;
                        case 6:
                            return this.options.useRefreshTokens ? [4, this._getTokenUsingRefreshToken(r)] : [3, 8];
                        case 7:
                            return i = d.sent(), [3, 10];
                        case 8:
                            return [4, this._getTokenFromIFrame(r)];
                        case 9:
                            i = d.sent(), d.label = 10;
                        case 10:
                            return s = i, [4, this.cacheManager.set(O({
                                client_id: this.options.client_id
                            }, s))];
                        case 11:
                            return d.sent(), this.cookieStorage.save(this.isAuthenticatedCookieName, !0, {
                                daysUntilExpire: this.sessionCheckExpiryDays,
                                cookieDomain: this.options.cookieDomain
                            }), c = s.id_token, a = s.access_token, u = s.oauthTokenScope, l = s.expires_in, [2, O(O({
                                id_token: c,
                                access_token: a
                            }, u ? {
                                scope: u
                            } : null), {
                                expires_in: l
                            })];
                        case 12:
                            return [4, rr.releaseLock("auth0.lock.getTokenSilently")];
                        case 13:
                            return d.sent(), window.removeEventListener("pagehide", this._releaseLockOnPageHide), [7];
                        case 14:
                            return [3, 16];
                        case 15:
                            throw new xr;
                        case 16:
                            return [2]
                    }
                    var f, h
                })
            })
        }, e.prototype.getTokenWithPopup = function(t, n) {
            return t === void 0 && (t = {}), n === void 0 && (n = {}), P(this, void 0, void 0, function() {
                return j(this, function(r) {
                    switch (r.label) {
                        case 0:
                            return t.audience = t.audience || this.options.audience, t.scope = Ae(this.defaultScope, this.scope, t.scope), n = O(O({}, Gd), n), [4, this.loginWithPopup(t, n)];
                        case 1:
                            return r.sent(), [4, this.cacheManager.get(new Je({
                                scope: t.scope,
                                audience: t.audience || "default",
                                client_id: this.options.client_id
                            }))];
                        case 2:
                            return [2, r.sent().access_token]
                    }
                })
            })
        }, e.prototype.isAuthenticated = function() {
            return P(this, void 0, void 0, function() {
                return j(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return [4, this.getUser()];
                        case 1:
                            return [2, !!t.sent()]
                    }
                })
            })
        }, e.prototype.buildLogoutUrl = function(t) {
            t === void 0 && (t = {}), t.client_id !== null ? t.client_id = t.client_id || this.options.client_id : delete t.client_id;
            var n = t.federated,
                r = re(t, ["federated"]),
                o = n ? "&federated" : "";
            return this._url("/v2/logout?".concat(Or(r))) + o
        }, e.prototype.logout = function(t) {
            var n = this;
            t === void 0 && (t = {});
            var r = t.localOnly,
                o = re(t, ["localOnly"]);
            if (r && o.federated) throw new Error("It is invalid to set both the `federated` and `localOnly` options to `true`");
            var s = function() {
                if (n.cookieStorage.remove(n.orgHintCookieName, {
                        cookieDomain: n.options.cookieDomain
                    }), n.cookieStorage.remove(n.isAuthenticatedCookieName, {
                        cookieDomain: n.options.cookieDomain
                    }), !r) {
                    var i = n.buildLogoutUrl(o);
                    window.location.assign(i)
                }
            };
            if (this.options.cache) return this.cacheManager.clear().then(function() {
                return s()
            });
            this.cacheManager.clearSync(), s()
        }, e.prototype._getTokenFromIFrame = function(t) {
            return P(this, void 0, void 0, function() {
                var n, r, o, s, i, c, a, u, l, d, f, h, m, b, p, v, y;
                return j(this, function(k) {
                    switch (k.label) {
                        case 0:
                            return n = it(Se()), r = it(Se()), o = Se(), [4, Qn(o)];
                        case 1:
                            s = k.sent(), i = er(s), c = re(t, ["detailedResponse"]), a = this._getParams(c, n, r, i, t.redirect_uri || this.options.redirect_uri || window.location.origin), (u = this.cookieStorage.get(this.orgHintCookieName)) && !a.organization && (a.organization = u), l = this._authorizeUrl(O(O({}, a), {
                                prompt: "none",
                                response_mode: "web_message"
                            })), k.label = 2;
                        case 2:
                            if (k.trys.push([2, 6, , 7]), window.crossOriginIsolated) throw new Ie("login_required", "The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");
                            return d = t.timeoutInSeconds || this.options.authorizeTimeoutInSeconds, [4, (M = l, g = this.domainUrl, _ = d, _ === void 0 && (_ = 60), new Promise(function(w, R) {
                                var W = window.document.createElement("iframe");
                                W.setAttribute("width", "0"), W.setAttribute("height", "0"), W.style.display = "none";
                                var Z, Y = function() {
                                        window.document.body.contains(W) && (window.document.body.removeChild(W), window.removeEventListener("message", Z, !1))
                                    },
                                    C = setTimeout(function() {
                                        R(new xr), Y()
                                    }, 1e3 * _);
                                Z = function(S) {
                                    if (S.origin == g && S.data && S.data.type === "authorization_response") {
                                        var T = S.source;
                                        T && T.close(), S.data.response.error ? R(Ie.fromPayload(S.data.response)) : w(S.data.response), clearTimeout(C), window.removeEventListener("message", Z, !1), setTimeout(Y, 2e3)
                                    }
                                }, window.addEventListener("message", Z, !1), window.document.body.appendChild(W), W.setAttribute("src", M)
                            }))];
                        case 3:
                            if (f = k.sent(), n !== f.state) throw new Error("Invalid state");
                            return h = t.scope, m = t.audience, b = re(t, ["scope", "audience", "redirect_uri", "ignoreCache", "timeoutInSeconds", "detailedResponse"]), [4, $t(O(O(O({}, this.customOptions), b), {
                                scope: h,
                                audience: m,
                                baseUrl: this.domainUrl,
                                client_id: this.options.client_id,
                                code_verifier: o,
                                code: f.code,
                                grant_type: "authorization_code",
                                redirect_uri: a.redirect_uri,
                                auth0Client: this.options.auth0Client,
                                useFormData: this.options.useFormData,
                                timeout: b.timeout || this.httpTimeoutMs
                            }), this.worker)];
                        case 4:
                            return p = k.sent(), [4, this._verifyIdToken(p.id_token, r)];
                        case 5:
                            return v = k.sent(), this._processOrgIdHint(v.claims.org_id), [2, O(O({}, p), {
                                decodedToken: v,
                                scope: a.scope,
                                oauthTokenScope: p.scope,
                                audience: a.audience || "default"
                            })];
                        case 6:
                            throw (y = k.sent()).error === "login_required" && this.logout({
                                localOnly: !0
                            }), y;
                        case 7:
                            return [2]
                    }
                    var M, g, _
                })
            })
        }, e.prototype._getTokenUsingRefreshToken = function(t) {
            return P(this, void 0, void 0, function() {
                var n, r, o, s, i, c, a, u, l;
                return j(this, function(d) {
                    switch (d.label) {
                        case 0:
                            return t.scope = Ae(this.defaultScope, this.options.scope, t.scope), [4, this.cacheManager.get(new Je({
                                scope: t.scope,
                                audience: t.audience || "default",
                                client_id: this.options.client_id
                            }))];
                        case 1:
                            return (n = d.sent()) && n.refresh_token || this.worker ? [3, 4] : this.useRefreshTokensFallback ? [4, this._getTokenFromIFrame(t)] : [3, 3];
                        case 2:
                            return [2, d.sent()];
                        case 3:
                            throw new Vd(t.audience || "default", t.scope);
                        case 4:
                            r = t.redirect_uri || this.options.redirect_uri || window.location.origin, s = t.scope, i = t.audience, c = re(t, ["scope", "audience", "ignoreCache", "timeoutInSeconds", "detailedResponse"]), a = typeof t.timeoutInSeconds == "number" ? 1e3 * t.timeoutInSeconds : null, d.label = 5;
                        case 5:
                            return d.trys.push([5, 7, , 10]), [4, $t(O(O(O(O(O({}, this.customOptions), c), {
                                audience: i,
                                scope: s,
                                baseUrl: this.domainUrl,
                                client_id: this.options.client_id,
                                grant_type: "refresh_token",
                                refresh_token: n && n.refresh_token,
                                redirect_uri: r
                            }), a && {
                                timeout: a
                            }), {
                                auth0Client: this.options.auth0Client,
                                useFormData: this.options.useFormData,
                                timeout: this.httpTimeoutMs
                            }), this.worker)];
                        case 6:
                            return o = d.sent(), [3, 10];
                        case 7:
                            return ((u = d.sent()).message.indexOf("Missing Refresh Token") > -1 || u.message && u.message.indexOf("invalid refresh token") > -1) && this.useRefreshTokensFallback ? [4, this._getTokenFromIFrame(t)] : [3, 9];
                        case 8:
                            return [2, d.sent()];
                        case 9:
                            throw u;
                        case 10:
                            return [4, this._verifyIdToken(o.id_token)];
                        case 11:
                            return l = d.sent(), [2, O(O({}, o), {
                                decodedToken: l,
                                scope: t.scope,
                                oauthTokenScope: o.scope,
                                audience: t.audience || "default"
                            })]
                    }
                })
            })
        }, e.prototype._getEntryFromCache = function(t) {
            var n = t.scope,
                r = t.audience,
                o = t.client_id;
            return P(this, void 0, void 0, function() {
                var s, i, c, a, u;
                return j(this, function(l) {
                    switch (l.label) {
                        case 0:
                            return [4, this.cacheManager.get(new Je({
                                scope: n,
                                audience: r,
                                client_id: o
                            }), 60)];
                        case 1:
                            return (s = l.sent()) && s.access_token ? (i = s.id_token, c = s.access_token, a = s.oauthTokenScope, u = s.expires_in, [2, O(O({
                                id_token: i,
                                access_token: c
                            }, a ? {
                                scope: a
                            } : null), {
                                expires_in: u
                            })]) : [2]
                    }
                })
            })
        }, e
    }();

function vf(e) {
    return P(this, void 0, void 0, function() {
        var t;
        return j(this, function(n) {
            switch (n.label) {
                case 0:
                    return [4, (t = new gf(e)).checkSession()];
                case 1:
                    return n.sent(), [2, t]
            }
        })
    })
}
let Xe = null,
    Ht = null;
const bf = async () => {
        await Xe.loginWithRedirect({
            redirect_uri: window.location.origin
        })
    },
    wf = () => {
        Xe.logout({
            returnTo: window.location.origin
        })
    },
    Sf = () => {
        if (Ht) return !1;
        const e = window.location.search;
        return !!(e.includes("code=") && e.includes("state=") || document.cookie.includes("auth0.is.authenticated=true"))
    },
    kf = () => Sf() ? void 0 : Ht,
    ro = (e, t) => {
        Ht = {
            email: e,
            accessToken: t
        }, ro.updateCallback()
    },
    Tf = async (e = () => {}) => {
        ro.updateCallback = e;
        try {
            e(), Xe = await vf({
                domain: "dev-9ax3-qo8.eu.auth0.com",
                client_id: "Qg1WDuGuayE16bJIRBDByY3wZh4FODnk",
                audience: "https://sqlpd.com/api"
            });
            let t = await Xe.isAuthenticated();
            if (!t) {
                const n = window.location.search;
                n.includes("code=") && n.includes("state=") && (await Xe.handleRedirectCallback(), window.history.replaceState({}, document.title, "/"), t = !0)
            }
            if (t) {
                e();
                const n = await Xe.getTokenSilently(),
                    r = await Xe.getUser();
                r ? Ht = {
                    email: r.email,
                    accessToken: n
                } : Ht = null, e()
            }
        } catch (t) {
            console.log(t)
        }
    },
    Cf = async ({
        accessToken: e
    }) => {
        const n = await (await fetch("/user", {
            headers: {
                Authorization: `Bearer ${e}`
            }
        })).json();
        if (n.error) throw new Error(n.message);
        return n
    },
    Ef = async ({
        accessToken: e,
        rank: t,
        solutionCRC: n,
        solved: r,
        missionLog: o
    }) => {
        const s = {
            Authorization: `Bearer ${e}`,
            "Content-Type": "application/json"
        };
        e || delete s.Authorization;
        const c = await (await fetch("/user", {
            method: "POST",
            headers: s,
            body: JSON.stringify({
                rank: t,
                solved: r,
                solutionCRC: n,
                missionLog: o
            })
        })).json();
        if (c.error) throw new Error(c.message);
        return c
    },
    _f = async (e, t) => {
        const n = {
            Authorization: `Bearer ${e}`,
            "Content-Type": "application/json"
        };
        e || delete n.Authorization;
        const o = await (await fetch("/user", {
            method: "POST",
            headers: n,
            body: JSON.stringify({
                testSolution: t
            })
        })).json();
        if (o.error) throw new Error(o.message);
        return o
    };
let Lf = window.innerHeight * .01;
document.documentElement.style.setProperty("--vh", `${Lf}px`);
window.addEventListener("resize", () => {
    let e = window.innerHeight * .01;
    document.documentElement.style.setProperty("--vh", `${e}px`)
});
let z = document.querySelector(".cursor"),
    Q = document.querySelector(".query"),
    Ti = document.querySelector(".placeholder");
const If = document.querySelector("#show-results-tab"),
    xt = document.querySelector(".column-headers"),
    Ot = document.querySelector(".rows-data"),
    xf = document.querySelector(".sql-error-message"),
    an = document.querySelector("#show-sql-error-message"),
    ia = document.querySelector("#show-no-results-yet-message"),
    sa = document.querySelector("#show-empty-result-message"),
    Of = document.querySelector(".scrollable-container"),
    Af = document.querySelector(".current-table"),
    cn = document.querySelector("#show-tag-options"),
    Rf = document.querySelector(".selected-value"),
    un = document.querySelector("#show-updated-statement"),
    Nf = document.querySelector(".updated-statement > p"),
    Ar = document.querySelector("#show-mission-tab"),
    Mf = document.querySelector("#show-builder-tab"),
    Pf = document.querySelector("#show-login-section"),
    jf = document.querySelector("#show-sending-modal"),
    Wf = document.querySelector("#show-no-sending-modal"),
    Df = document.querySelector("#show-rank-test-sending-modal");
document.querySelector("#show-rank-test-unknown");
const Hf = document.querySelector("#show-keyboard-erd"),
    Ff = document.querySelector("#show-still-in-development"),
    aa = document.querySelectorAll(".mission-brief"),
    Ci = document.querySelector(".mission-instructions"),
    Kf = document.querySelector(".tag-options > label"),
    Ei = document.querySelector(".keyboard-brief"),
    ca = document.querySelector("#show-results-instructions"),
    _i = document.querySelector("#show-solved-stamp"),
    Li = document.querySelector("#show-retry-stamp"),
    Ii = document.querySelector(".retry-message"),
    Gf = document.querySelector(".decline-message"),
    Bf = document.querySelector(".approve-message"),
    Zf = document.querySelector(".approved-rank"),
    or = document.querySelector(".solved-message"),
    Uf = document.querySelector(".cases-to-next-rank"),
    Jf = document.querySelector("#buy-solved-cases"),
    Xf = document.querySelector(".account-rank"),
    Vf = document.querySelector("#show-advance-to-next-case"),
    qf = document.querySelector("#show-take-rank-test"),
    zf = document.querySelector("#show-end-of-free-trial"),
    Yf = document.querySelector("#show-rank-test-section"),
    $f = document.querySelector("#show-rank-test-success"),
    Qf = document.querySelector("#show-rank-test-failure"),
    eh = document.querySelector(".approved-qualified-note"),
    th = document.querySelector("#show-workspace-section");
document.querySelector("#show-login-options");
const nh = document.querySelector("#show-logout-options");
document.querySelector("#show-profile-login-options");
const rh = document.querySelector("#show-profile-logout-options"),
    kn = document.querySelector("#show-logging-in"),
    ua = document.querySelector("#show-logging-out"),
    oh = document.querySelector("#show-buy-a-license");
document.querySelector("#show-logout-options");
const ih = document.querySelectorAll(".account-email"),
    sh = new RegExp(`[\\s\\r\\n${String.fromCodePoint(8629)}]+`, "g");
let ln, la, da, st, fe, X = {
        rank: "SQL Intern",
        qualifiedRank: "SQL Intern",
        solved: 0,
        casesLeftToNextRank: 11,
        missionAttributes: ["table", "whole"]
    },
    dn = 2,
    xi = !1;
const Oi = e => {
        ["rank", "qualifiedRank", "solved", "missionAttributes", "casesLeftToNextRank", "missionSeed", "rankTest", "reachedDevelopmentLimit"].forEach(t => {
            X[t] = e[t]
        }), Jf.value = X.solved
    },
    Ai = e => new Promise(t => {
        setTimeout(() => {
            t()
        }, e * 1e3)
    });

function Ze(e) {
    e.scrollIntoViewIfNeeded ? e.scrollIntoViewIfNeeded(!0) : e.scrollIntoView()
}

function ah() {
    kn.checked = !1, ua.checked = !1, Pf.checked = !0, Ar.checked = !0, cn.checked = !1, Wf.checked = !0, un.checked = !1, an.checked = !1, ca.checked = !0, oh.checked = !1
}

function ch() {
    document.body.classList.remove("brief-completed"), document.body.classList.remove("mission-fill-in"), document.body.classList.remove("mission-whole-table"), fe = [], [...Q.querySelectorAll(".query-part")].forEach(i => {
        Q.removeChild(i)
    }), ia.checked = !0, sa.checked = !1, Hf.checked = !0, xt.innerHTML = "", Ot.innerHTML = "", Ei.innerHTML = "";
    const e = $c(X);
    ln = e.db, da = e.type, document.body.classList.add(`mission-${e.type}`), la = e.checkAnswer;
    const {
        brief: t,
        statement: n,
        values: r,
        instructions: o
    } = e;
    Xf.innerHTML = X.rank, Uf.innerHTML = X.reachedDevelopmentLimit ? "-- PRACTICE MODE --" : `${X.casesLeftToNextRank} more case${X.casesLeftToNextRank>1?"s":""} to next rank`, Af.innerHTML = dc(ln, ln[0].name), aa.forEach(i => i.innerHTML = t.reduce((c, a, u) => u % 2 === 0 ? c + a : c + ` <span
          class="statement-placeholder"
          data-tag="${a}"
        >${a}</span> `, "")), Ci.innerHTML = o, Ci.style.display = dn > 0 ? "block" : "none", dn > 0 && dn--;
    const s = t.filter((i, c) => c % 2 !== 0);
    Nf.innerHTML = s.map(i => `${i}: <span
        class="statement-placeholder"
        data-tag="${i}"
      >${i}</span>`).join("<br />"), [...s].map(i => {
        const c = document.createElement("div");
        return c.className = "tag-operation", c.setAttribute("data-tag", i), c.innerText = i, c
    }).forEach(i => Kf.insertAdjacentElement("beforebegin", i)), r.map(i => {
        const c = document.createElement("div");
        return c.className = "keyboard-key brief-value", c.innerText = i, c
    }).forEach(i => Ei.appendChild(i))
}

function uh() {
    const e = X.rankTest,
        t = document.querySelector(".rank-test-question"),
        n = document.querySelector(".rank-test-options-list"),
        r = e[0];
    n.innerHTML = r.options.map(({
        option: o
    }) => `
        <li>
          <label class="button rank-test-option">${o}</label>
        </li>
      `).join(""), t.innerText = r.question
}

function fa(e) {
    var t;
    return e || (e = window.event), t = e.target ? e.target : e.srcElement, t.nodeType == 3 && (t = t.parentNode), t
}
document.addEventListener("keydown", e => {
    if (e.keyCode !== 8) return !0;
    const {
        tagName: t,
        type: n
    } = fa(e) || {}, r = (t || "").toUpperCase() === "INPUT" && (n || "").toUpperCase() !== "CHECKBOX";
    return !r && e.preventDefault && e.stopImmediatePropagation && (e.preventDefault(), e.stopImmediatePropagation()), !r
});
document.addEventListener("click", e => {
    const t = fa(e),
        n = t.classList,
        r = document.querySelector(".selected-cell");
    if (n.contains("hide-tag-options")) r && (r.classList.remove("selected-cell"), r.parentNode.classList.remove("selected-row")), cn.checked = !1, un.checked = !1;
    else if (n.contains("brief-value")) {
        const o = document.createElement("span");
        o.className = "query-part", o.setAttribute("data-type", "value"), o.innerHTML = t.innerHTML + " ", Q.insertBefore(o, z), Ze(o)
    } else if (n.contains("keyboard-key") || n.contains("table-star")) {
        const o = document.createElement("span");
        o.className = "query-part", n.contains("query-clause-start") && (o.className += " query-clause-start"), n.contains("sort-order") && o.setAttribute("data-type", "sort-order"), o.innerHTML = t.innerHTML + " ", Q.insertBefore(o, z), Ze(o)
    } else if (n.contains("table-name") || n.contains("table-alias") || n.contains("table-row")) {
        const o = document.createElement("span");
        o.className = "query-part", n.contains("table-name") || n.contains("table-alias") ? o.setAttribute("data-type", "table") : n.contains("table-row") && o.setAttribute("data-type", "field"), o.innerHTML = t.innerHTML + " ", Q.insertBefore(o, z), Ze(o)
    } else if (n.contains("semicolon")) {
        const o = document.createElement("span");
        o.className = "query-part", o.setAttribute("data-type", "semicolon"), o.innerHTML = "; ", Q.insertBefore(o, z), Ze(o)
    } else if (n.contains("query-part")) z = Q.removeChild(z), Q.insertBefore(z, t.nextSibling), Ze(z);
    else if (n.contains("query") && !Ti.parentNode) z = Q.removeChild(z), Q.appendChild(z), Ze(z);
    else if (n.contains("backspace")) {
        const o = z.previousSibling;
        o && Q.removeChild(o), Ze(z)
    } else if (n.contains("clear-all")) z = Q.removeChild(z), Q.innerHTML = "", Q.appendChild(z), an.checked = !1;
    else if (n.contains("execute")) {
        const o = Q.textContent.replace(Ti.textContent, "").replace(sh, " ").trim();
        fe.push(o);
        try {
            if (!o.startsWith("SELECT")) throw new Error(`For now, start with <span class='code'>SELECT</span>.
                    Need help? Check the Guide <span class="guide-tab-icon">&nbsp;</span> tab!`);
            if (!o.endsWith(";")) throw new Error("SQL statements must end with a <span class='code'>;</span> (semicolon).");
            if (o.indexOf(";") !== o.lastIndexOf(";")) throw new Error("Executing multiple statements is not supported. Make sure to have only one <span class='code'>;</span> (semicolon) at the end of the statement.");
            if (an.checked = !1, st = lc(ln, o), sa.checked = Nn(st), Nn(st)) xt.innerHTML = "", Ot.innerHTML = "";
            else {
                const {
                    thead: s,
                    tbody: i
                } = fc(st);
                xt.innerHTML = "<thead>" + s + "</thead>", Ot.innerHTML = "<tbody>" + s + i + "</tbody>"
            }
            if (ia.checked = !1, cn.checked = !1, un.checked = !1, If.checked = !0, Of.scrollTo(0, 0), !Nn(st)) {
                xt.style.width = Ot.offsetWidth + "px";
                const s = Ot.querySelectorAll("th");
                xt.querySelectorAll("th").forEach((c, a) => c.style.width = s[a].offsetWidth + "px")
            }
            fe[fe.length - 1] = "Q " + fe[fe.length - 1]
        } catch (s) {
            fe[fe.length - 1] = "E " + fe[fe.length - 1], xf.innerHTML = s.message, an.checked = !0
        }
    } else if (t.className.includes("content-") && da === "fill-in") r && (r.classList.remove("selected-cell"), r.parentNode.classList.remove("selected-row")), t.classList.add("selected-cell"), t.parentNode.classList.add("selected-row"), Rf.innerText = t.innerText, cn.checked = !0, t.scrollIntoViewIfNeeded && t.scrollIntoViewIfNeeded(!0);
    else if (t.className.includes("tag-operation")) {
        const o = t.getAttribute("data-tag"),
            s = document.querySelector(".selected-cell").innerText,
            i = document.querySelector(`.mission-brief [data-tag='${o}']`);
        i.innerText = s, i.className = "statement-claim";
        const c = document.querySelector(`.updated-statement [data-tag='${o}']`);
        c.innerText = s, c.className = "statement-claim", !aa[0].querySelector(".statement-placeholder") && document.body.classList.add("brief-completed"), un.checked = !0, ca.checked = !1
    } else if (t.classList.contains("mission-submit") || t.classList.contains("table-submit")) {
        let o;
        Ar.checked ? o = [...document.getElementsByClassName("statement-claim")].reduce((a, u) => ({ ...a,
            [u.getAttribute("data-tag")]: u.innerText
        }), {}) : o = st, jf.checked = !0;
        const {
            isSuccessful: s,
            response: i
        } = la(o), c = Cc(X);
        Promise.all([Ai(4), s ? Ef({ ...X,
            solutionCRC: c,
            missionLog: fe
        }) : Promise.resolve()]).then(([, a]) => {
            new Audio(s ? "sounds/stamp.mp3" : "sounds/thick_stamp.mp3").play(), s ? (Oi(a), X.rank !== X.qualifiedRank ? (or.innerHTML = `You qualify for the rank of<BR><span class="account-rank">${X.qualifiedRank}!</span>`, qf.checked = !0) : (or.innerHTML = i, Vf.checked = !0), _i.checked = !0) : (Ii.innerHTML = i, Li.checked = !0)
        }).catch(a => {
            a.message === "End of free trial" ? (or.innerHTML = `
                        - End of free trial -
                        <BR>
                        <BR>
                        <label class="link-like" for="show-buy-a-license">Buy a license</label> to
                        take the rank test and advance to the next level.
                    `, zf.checked = !0, _i.checked = !0) : (Ii.innerHTML = a.message, Li.checked = !0)
        })
    } else if (n.contains("advance-to-next-case") || n.contains("try-a-few-cases") || n.contains("logged-in-continue-cases") || n.contains("after-buy-solve-cases")) X.reachedDevelopmentLimit && !xi && (Ff.checked = !0, xi = !0), ch(), Ar.checked = !0, th.checked = !0;
    else if (n.contains("retry-case")) Mf.checked = !0;
    else if (n.contains("take-rank-test")) uh(), Yf.checked = !0;
    else if (n.contains("rank-test-option")) {
        const o = t.innerText;
        Df.checked = !0, Promise.all([Ai(4), _f(X.accessToken, o)]).then(([, s]) => {
            const i = s.rank === s.qualifiedRank,
                c = s.reason || ns();
            Oi(s), new Audio(i ? "sounds/clapping.mp3" : "sounds/thick_stamp.mp3").play(), i ? ($f.checked = !0, Bf.innerHTML = c, eh.innerHTML = X.rank, Zf.innerHTML = X.rank) : (Gf.innerHTML = c, Qf.checked = !0)
        })
    } else {
        if (n.contains("login-link")) return kn.checked = !0, bf();
        if (n.contains("logout-link")) return ua.checked = !0, wf()
    }
    Qc()
});
const lh = async e => {
    const t = await Cf(e);
    ["rank", "solved", "missionAttributes", "casesLeftToNextRank", "missionSeed", "reachedDevelopmentLimit"].forEach(n => {
        e[n] = t[n]
    }), e.ready = !0
};

function ha() {
    let e = kf();
    e !== null && ((e === void 0 || !e.ready) && (kn.checked = !0, dn = 2, e && e.email && e.accessToken && lh(e).then(ha, t => {
        console.error(t)
    })), e && e.ready && (kn.checked = !1, nh.checked = !0, rh.checked = !0, X = e, ih.forEach(t => {
        t.innerHTML = e.email
    })))
}
window.onload = async () => Tf(ha);
ah();
const Rr = document.querySelector("#user-email"),
    pa = document.querySelector("#user-password"),
    dh = document.querySelector("#accept-terms"),
    fh = document.querySelector(".buy-email-step .error-message"),
    hh = document.querySelector(".buy-password-step .error-message"),
    ph = document.querySelector(".buy-email-step form"),
    mh = document.querySelector(".buy-password-step form"),
    yh = document.querySelector("#show-buy-paypal-step"),
    gh = document.querySelector("#show-buy-intro-step"),
    vh = document.querySelector("#show-buy-password-step"),
    bh = document.querySelector("#show-buy-thank-you-step"),
    ma = document.querySelector("#show-buy-error-step"),
    ya = document.querySelector(".buy-error-step .error-message"),
    wh = document.querySelector("#buy-solved-cases"),
    Sh = document.querySelector("#show-no-sending-modal"),
    kh = () => {
        const e = (Rr.value || "").trim().toLowerCase();
        if (!e) return "Please enter an email address";
        if (!e.includes("@")) return "Email should include an @";
        if (!e.substr(e.indexOf("@")).includes(".")) return "Invalid email. Please recheck."
    },
    Th = () => {
        if (!dh.checked) return "Please accept the terms to continue"
    },
    Ch = () => {
        const e = (pa.value || "").trim();
        if (!e) return "Please choose a password";
        if (e.length < 8) return "Password must have at least 8 characters";
        if (!e.split("").some(t => t >= "a" && t <= "z")) return "Password must contain a lowercase letter";
        if (!e.split("").some(t => t >= "A" && t <= "Z")) return "Password must contain an uppercase letter";
        if (!e.split("").some(t => t >= "0" && t <= "9")) return "Password must contain a number"
    },
    Eh = e => {
        const t = kh() || Th();
        return fh.innerHTML = t || "", t || (vh.checked = !0), e.preventDefault(), !1
    };
ph.addEventListener("submit", Eh);
const _h = e => {
    const t = Ch();
    return hh.innerHTML = t || "", t || (yh.checked = !0), e.preventDefault(), !1
};
mh.addEventListener("submit", _h);
const Lh = (e, {
        error: t,
        message: n,
        order_id: r,
        capture_id: o,
        access_token: s,
        expiration: i
    }) => {
        if (t) {
            ya.innerHTML = n, ma.checked = !0;
            return
        }
        document.querySelector(".purchase-email").innerHTML = e, document.querySelector(".purchase-orderid").innerHTML = r, document.querySelector(".purchase-captureid").innerHTML = o, document.querySelector(".purchase-expiration").innerHTML = new Date(i).toDateString(), bh.checked = !0, Sh.checked = !0, ro(e, s)
    },
    Nr = () => {
        if (Nr.alreadyRun) return;
        Nr.alreadyRun = !0;
        const e = document.createElement("script");
        e.src = "https://www.paypal.com/sdk/js?client-id=AcSAdDA3GsLLYW_9-FMzFcpt2QmQ6KqrRIoyN156DGU0n8oi6W11-_2TeIJPNCzL1iVMFaMmQf_A6_jw", e.onload = () => {
            paypal.Buttons({
                createOrder: function() {
                    return fetch("/buy", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            email: (Rr.value || "").trim().toLowerCase(),
                            solved: (wh.value || "").trim()
                        })
                    }).then(t => t.json()).then(t => {
                        if (t.error) throw new Error(t.message);
                        return t.orderID
                    })
                },
                onApprove: function(t, n) {
                    const r = (Rr.value || "").trim().toLowerCase(),
                        o = (pa.value || "").trim();
                    return fetch("/activate", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            orderId: t.orderID,
                            email: r,
                            password: o
                        })
                    }).then(s => s.json()).then(s => s.error === "INSTRUMENT_DECLINED" ? n.restart() : s).then(Lh.bind(null, r))
                },
                onError: function(t) {
                    console.log("ON ERROR", t), ya.innerHTML = t.message, ma.checked = !0
                }
            }).render("#paypal-button-container")
        }, document.body.append(e)
    };
document.querySelector(".buy-intro-step label").addEventListener("click", Nr);
document.querySelector(".buy-a-license-overlay .close-dialog").addEventListener("click", () => {
    gh.checked = !0
});
document.querySelector(".buy-thank-you-step label[for='show-buy-a-license']").addEventListener("click", () => {
    document.querySelector("#show-workspace-section").checked = !0
});
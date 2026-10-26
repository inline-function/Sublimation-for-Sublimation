"use strict";
(() => {
  const None = () => ({ tag: "None" });
  const Some = (a0) => ({ tag: "Some", 0: a0 });
  const __dshtoStr = (v) => {
    if (v === null || v === undefined) return String(v);
    if (Array.isArray(v)) return "[" + v.map(__dshtoStr).join(",") + "]";
    if (typeof v === "object" && Object.keys(v).length === 1 && "tag" in v) return String(v.tag);
    return String(v);
  };
  const __isa = (v, t) => {
    if (t === "Nat" || t === "Int" || t === "Rat") return typeof v === "number";
    if (t === "Str") return typeof v === "string";
    if (t === "Bool") return typeof v === "boolean";
    if (t === "Null") return v === null || (v && v.tag === "Null");
    if (t === "(fn)") return typeof v === "function";
    if (t === "List") return Array.isArray(v);
    return v !== null && typeof v === "object" && v.tag === t;
  };
  const __eq = (a, b) => {
    if (a === b) return true;
    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
    if (a.tag !== undefined && a.tag !== b.tag) return false;
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every(k => __eq(a[k], b[k]));
  };
  function Expr__Var(a0) { return { tag: "Var", 0: a0 }; }
  const Var = Expr__Var;
  function Expr__Num(a0) { return { tag: "Num", 0: a0 }; }
  const Num = Expr__Num;
  function Expr__Txt(a0) { return { tag: "Txt", 0: a0 }; }
  const Txt = Expr__Txt;
  function Expr__Bol(a0) { return { tag: "Bol", 0: a0 }; }
  const Bol = Expr__Bol;
  function Expr__Lam(a0, a1) { return { tag: "Lam", 0: a0, 1: a1 }; }
  const Lam = Expr__Lam;
  function Expr__App(a0, a1) { return { tag: "App", 0: a0, 1: a1 }; }
  const App = Expr__App;
  function Expr__If(a0, a1, a2) { return { tag: "If", 0: a0, 1: a1, 2: a2 }; }
  const If = Expr__If;
  function Ty__TNat() { return { tag: "TNat" }; }
  const TNat = Ty__TNat;
  function Ty__TStr() { return { tag: "TStr" }; }
  const TStr = Ty__TStr;
  function Ty__TBool() { return { tag: "TBool" }; }
  const TBool = Ty__TBool;
  function Ty__TFun(a0, a1) { return { tag: "TFun", 0: a0, 1: a1 }; }
  const TFun = Ty__TFun;
  function Ctx__CEmpty() { return { tag: "CEmpty" }; }
  const CEmpty = Ctx__CEmpty;
  function Ctx__CBind(a0, a1, a2) { return { tag: "CBind", 0: a0, 1: a1, 2: a2 }; }
  const CBind = Ctx__CBind;
  function weight(e) {
    return (() => {
  const __s0 = e;
  if ((__s0.tag === "Var")) { const s = __s0[0];  return 1; }
  if ((__s0.tag === "Num")) { const n = __s0[0];  return 1; }
  if ((__s0.tag === "Txt")) { const s = __s0[0];  return 1; }
  if ((__s0.tag === "Bol")) { const b = __s0[0];  return 1; }
  if ((__s0.tag === "Lam")) { const x = __s0[0]; const b = __s0[1];  return (weight(b) + 1); }
  if ((__s0.tag === "App")) { const f = __s0[0]; const a = __s0[1];  return ((weight(f) + weight(a)) + 1); }
  if ((__s0.tag === "If")) { const c = __s0[0]; const t = __s0[1]; const e2 = __s0[2];  return (((weight(c) + weight(t)) + weight(e2)) + 1); }
  return null;
})();
  }
  function isValOf(e) {
    return (() => {
  const __s1 = e;
  if ((__s1.tag === "Var")) { const s = __s1[0];  return false; }
  if ((__s1.tag === "Num")) { const n = __s1[0];  return true; }
  if ((__s1.tag === "Txt")) { const s = __s1[0];  return true; }
  if ((__s1.tag === "Bol")) { const b = __s1[0];  return true; }
  if ((__s1.tag === "Lam")) { const x = __s1[0]; const b = __s1[1];  return true; }
  if ((__s1.tag === "App")) { const f = __s1[0]; const a = __s1[1];  return false; }
  if ((__s1.tag === "If")) { const c = __s1[0]; const t = __s1[1]; const e2 = __s1[2];  return false; }
  return null;
})();
  }
  function subst(body, name, value) {
    return (() => {
  const __s2 = body;
  if ((__s2.tag === "Var")) { const x = __s2[0];  return (__eq(x, name) ? (() => {
  return value;
})() : (() => {
  return body;
})()); }
  if ((__s2.tag === "Num")) { const n = __s2[0];  return body; }
  if ((__s2.tag === "Txt")) { const s = __s2[0];  return body; }
  if ((__s2.tag === "Bol")) { const b = __s2[0];  return body; }
  if ((__s2.tag === "Lam")) { const x = __s2[0]; const b = __s2[1];  return (__eq(x, name) ? (() => {
  return body;
})() : (() => {
  return Lam(x, subst(b, name, value));
})()); }
  if ((__s2.tag === "App")) { const f = __s2[0]; const a = __s2[1];  return App(subst(f, name, value), subst(a, name, value)); }
  if ((__s2.tag === "If")) { const c = __s2[0]; const t = __s2[1]; const e2 = __s2[2];  return If(subst(c, name, value), subst(t, name, value), subst(e2, name, value)); }
  return null;
})();
  }
  function fvOf(e) {
    return (() => {
  const __s3 = e;
  if ((__s3.tag === "Var")) { const x = __s3[0];  return [x, ...([])]; }
  if ((__s3.tag === "Num")) { const n = __s3[0];  return []; }
  if ((__s3.tag === "Txt")) { const s = __s3[0];  return []; }
  if ((__s3.tag === "Bol")) { const b = __s3[0];  return []; }
  if ((__s3.tag === "Lam")) { const x = __s3[0]; const b = __s3[1];  return dropOne(fvOf(b), x); }
  if ((__s3.tag === "App")) { const f = __s3[0]; const a = __s3[1];  return cat(fvOf(f), fvOf(a)); }
  if ((__s3.tag === "If")) { const c = __s3[0]; const t = __s3[1]; const e2 = __s3[2];  return cat(cat(fvOf(c), fvOf(t)), fvOf(e2)); }
  return null;
})();
  }
  function dropOne(xs, y) {
    return (() => {
  const __s4 = xs;
  if (((Array.isArray(__s4) && __s4.length === 0))) {  return []; }
  if (((Array.isArray(__s4) && __s4.length >= 1))) { const h = __s4[0]; const t = __s4.slice(1);  return (__eq(h, y) ? (() => {
  return t;
})() : (() => {
  return [h, ...(dropOne(t, y))];
})()); }
  return null;
})();
  }
  function cat(xs, ys) {
    return (() => {
  const __s5 = xs;
  if (((Array.isArray(__s5) && __s5.length === 0))) {  return ys; }
  if (((Array.isArray(__s5) && __s5.length >= 1))) { const h = __s5[0]; const t = __s5.slice(1);  return [h, ...(cat(t, ys))]; }
  return null;
})();
  }
  async function main() {
    const g0 = CEmpty();
    const vx = "x";
    const vtnat = TNat();
    const vfun = TFun(TNat(), TNat());
    const ext = CBind(g0, "x", TNat());
    const vbody = Var("x");
    const vlam = Lam("x", Var("x"));
    const vn3 = Num(3);
    const vapp = App(Lam("x", Var("x")), Num(3));
    const vred = Num(3);
    const c3 = 3;
    // axiom: isVarX(vbody, vx)
    // axiom: isNumX(vn3, c3)
    // axiom: isLamX(vlam, vx, vbody)
    // axiom: isAppX(vapp, vlam, vn3)
    // axiom: natTy(vtnat)
    // axiom: funT(vfun, vtnat, vtnat)
    // axiom: bound(ext, vx, vtnat)
    // axiom: extBy(g0, ext, vx, vtnat)
    // axiom: substN(vbody, vx, vn3, vred)
    null;
    null;
    null;
    null;
    null;
    null;
    null;
    null;
    null;
    null;
    null;
    const tgt = "a2";
    const src = "b3";
    const tgt9 = "a9";
    // axiom: mS(src)
    // axiom: ¬mT(tgt)
    // axiom: ¬rT(tgt)
    null;
    // axiom: mT(tgt9)
    // axiom: ¬rT(tgt9)
    null;
    const frefl = "refl";
    const fmap = "list.map";
    // axiom: propP(frefl)
    null;
    null;
    // axiom: progP(fmap)
    null;
    const p1 = 1;
    const p2 = 2;
    const p3 = 3;
    const p4 = 4;
    const p5 = 5;
    const p6 = 6;
    const p7 = 7;
    const p10 = 10;
    const p11 = 11;
    const p12 = 12;
    const p13 = 13;
    // axiom: phBefore(p1, p2)
    // axiom: phBefore(p2, p3)
    // axiom: phBefore(p3, p4)
    // axiom: phBefore(p4, p5)
    // axiom: phBefore(p5, p6)
    // axiom: phBefore(p6, p7)
    null;
    null;
    null;
    null;
    null;
    // axiom: chanBefore(p4, p13)
    // axiom: hitC(p4, p12)
    null;
    null;
    // axiom: factK(p10)
    // axiom: impK(p10, p11)
    // axiom: impK(p11, p12)
    null;
    null;
    null;
    // axiom: monoR(p7)
    // axiom: boundR(p7)
    null;
    const coreM = "core";
    const vpath = "core/logic";
    // axiom: rootMod(coreM)
    null;
    const ncheck = Num(3);
    const wrefl = Num(1);
    console.log(__dshtoStr("weight(vapp) = 4 ? "));
    console.log(__dshtoStr(weight(vapp)));
    console.log(__dshtoStr("weight(ncheck) = 1 ? "));
    console.log(__dshtoStr(weight(ncheck)));
    console.log(__dshtoStr("weight(wrefl) = 1 ? "));
    console.log(__dshtoStr(weight(wrefl)));
    console.log(__dshtoStr("vbody[vx := vn3] is a value ? "));
    console.log(__dshtoStr(isValOf(subst(vbody, vx, vn3))));
    console.log(__dshtoStr("subst == vred ? "));
    console.log(__dshtoStr(__eq(subst(vbody, vx, vn3), vred)));
    console.log(__dshtoStr("cCopy row2 (0,0,1,0) = true ? "));
    console.log(__dshtoStr(cCopy(false, false, true, false)));
    console.log(__dshtoStr("cCopy row1 (0,0,0,0) = false ? "));
    console.log(__dshtoStr(cCopy(false, false, false, false)));
    console.log(__dshtoStr("sublimation for sublimation ok"));
    return null;
  }
  function Phase__PLex() { return { tag: "PLex" }; }
  const PLex = Phase__PLex;
  function Phase__PParse() { return { tag: "PParse" }; }
  const PParse = Phase__PParse;
  function Phase__PChkA() { return { tag: "PChkA" }; }
  const PChkA = Phase__PChkA;
  function Phase__PChkB() { return { tag: "PChkB" }; }
  const PChkB = Phase__PChkB;
  function Phase__PChkC() { return { tag: "PChkC" }; }
  const PChkC = Phase__PChkC;
  function Phase__PGen() { return { tag: "PGen" }; }
  const PGen = Phase__PGen;
  function Phase__PPost() { return { tag: "PPost" }; }
  const PPost = Phase__PPost;
  function Ch__CExpand() { return { tag: "CExpand" }; }
  const CExpand = Ch__CExpand;
  function Ch__CNot() { return { tag: "CNot" }; }
  const CNot = Ch__CNot;
  function Ch__CImp() { return { tag: "CImp" }; }
  const CImp = Ch__CImp;
  function Ch__CAnd() { return { tag: "CAnd" }; }
  const CAnd = Ch__CAnd;
  function Ch__CConstAtomV() { return { tag: "CConstAtomV" }; }
  const CConstAtomV = Ch__CConstAtomV;
  function Ch__CConstAtomT() { return { tag: "CConstAtomT" }; }
  const CConstAtomT = Ch__CConstAtomT;
  function Ch__CImpurity() { return { tag: "CImpurity" }; }
  const CImpurity = Ch__CImpurity;
  function Ch__CTypeJudg() { return { tag: "CTypeJudg" }; }
  const CTypeJudg = Ch__CTypeJudg;
  function Ch__CReduceC() { return { tag: "CReduceC" }; }
  const CReduceC = Ch__CReduceC;
  function Ch__CReal() { return { tag: "CReal" }; }
  const CReal = Ch__CReal;
  function Ch__CArith() { return { tag: "CArith" }; }
  const CArith = Ch__CArith;
  function Ch__CProver() { return { tag: "CProver" }; }
  const CProver = Ch__CProver;
  function Ch__CSearch() { return { tag: "CSearch" }; }
  const CSearch = Ch__CSearch;
  function Proc__PReg() { return { tag: "PReg" }; }
  const PReg = Proc__PReg;
  function Proc__PScan() { return { tag: "PScan" }; }
  const PScan = Proc__PScan;
  function Proc__PXform() { return { tag: "PXform" }; }
  const PXform = Proc__PXform;
  function Proc__PPost2() { return { tag: "PPost2" }; }
  const PPost2 = Proc__PPost2;
  function cCopy(mt, rt, ms, rs) {
    return (((mt && ((!rt) || ((!ms) && (!rs)))) || ((ms && (!mt)) && (!rt))) || (rs && (!rt)));
  }
  const dict_core_collection_Functor_List = {
    map: (d, fa, f) => (() => {
  const __s6 = fa;
  if (((Array.isArray(__s6) && __s6.length === 0))) {  return []; }
  if (((Array.isArray(__s6) && __s6.length >= 1))) { const h = __s6[0]; const t = __s6.slice(1);  return [f(h), ...(dict_core_collection_Functor_List.map(dict_core_collection_Functor_List, t, f))]; }
  return null;
})()
  };
  const dict_core_collection_Foldable_List = {
    fold: (d, fa, init, f) => (() => {
  const __s7 = fa;
  if (((Array.isArray(__s7) && __s7.length === 0))) {  return init; }
  if (((Array.isArray(__s7) && __s7.length >= 1))) { const h = __s7[0]; const t = __s7.slice(1);  return dict_core_collection_Foldable_List.fold(dict_core_collection_Foldable_List, t, f(init, h), f); }
  return null;
})()
  };
  const dict_core_collection_Monad_List = {
    pure: (d, x) => [x, ...([])],
    flatMap: (d, fa, f) => (() => {
  const __s8 = fa;
  if (((Array.isArray(__s8) && __s8.length === 0))) {  return []; }
  if (((Array.isArray(__s8) && __s8.length >= 1))) { const h = __s8[0]; const t = __s8.slice(1);  return (f(h)).concat(dict_core_collection_Monad_List.flatMap(dict_core_collection_Monad_List, t, f)); }
  return null;
})()
  };
  function core_collection__emptyList() {
    return [];
  }
  function core_collection__cons(x, xs) {
    return [x, ...(xs)];
  }
  function core_collection__listOf(items) {
    return items;
  }
  function core_collection__range(a, b) {
    if ((a < b)) {
      // unchecked
      const rest = core_collection__range((a + 1), b);
      return [a, ...(rest)];
    }
    return [];
  }
  function core_collection__size$List(xs) {
    return (() => {
  const __s9 = xs;
  if (((Array.isArray(__s9) && __s9.length === 0))) {  return 0; }
  if (((Array.isArray(__s9) && __s9.length >= 1))) { const t = __s9.slice(1);  return ((t).length + 1); }
  return null;
})();
  }
  function core_collection__isEmpty$List(xs) {
    return (() => {
  const __s10 = xs;
  if (((Array.isArray(__s10) && __s10.length === 0))) {  return true; }
  if (((Array.isArray(__s10) && __s10.length >= 1))) {  return false; }
  return null;
})();
  }
  function core_collection__head(xs) {
    return (() => {
  const __s11 = xs;
  if (((Array.isArray(__s11) && __s11.length === 0))) {  return None(); }
  if (((Array.isArray(__s11) && __s11.length >= 1))) { const h = __s11[0];  return Some(h); }
  return null;
})();
  }
  function core_collection__last(xs) {
    return (() => {
  const __s12 = xs;
  if (((Array.isArray(__s12) && __s12.length === 0))) {  return None(); }
  if (((Array.isArray(__s12) && __s12.length >= 1)) && ((Array.isArray(__s12.slice(1)) && __s12.slice(1).length === 0))) { const h = __s12[0];  return Some(h); }
  if (((Array.isArray(__s12) && __s12.length >= 1))) { const t = __s12.slice(1);  return (() => { const a = t; return a.length ? Some(a[a.length - 1]) : None(); })(); }
  return null;
})();
  }
  function core_collection__elementAt(xs, i) {
    return (() => {
  const __s13 = xs;
  if (((Array.isArray(__s13) && __s13.length === 0))) {  return None(); }
  if (((Array.isArray(__s13) && __s13.length >= 1))) { const h = __s13[0]; const t = __s13.slice(1);  return (__eq(i, 0) ? (() => {
  return Some(h);
})() : (() => {
  return (() => { const a = t; const i = (i - 1); return i >= 0 && i < a.length ? Some(a[i]) : None(); })();
})()); }
  return null;
})();
  }
  function core_collection__get$List(xs, i) {
    return (() => {
  const __s14 = (() => { const a = xs; const i = i; return i >= 0 && i < a.length ? Some(a[i]) : None(); })();
  if ((__s14.tag === "Some")) { const v = __s14[0];  return v; }
  if ((__s14.tag === "None")) {  return (() => { throw new Error('panic: unreachable') })(); }
  return null;
})();
  }
  function core_collection__firstOr(xs, d) {
    return core_collection__getOrElse((() => { const a = xs; return a.length ? Some(a[0]) : None(); })(), d);
  }
  function core_collection__contains$List(xs, x) {
    return (() => {
  const __s15 = xs;
  if (((Array.isArray(__s15) && __s15.length === 0))) {  return false; }
  if (((Array.isArray(__s15) && __s15.length >= 1))) { const h = __s15[0]; const t = __s15.slice(1);  return (__eq(h, x) ? (() => {
  return true;
})() : (() => {
  return (t).includes(x);
})()); }
  return null;
})();
  }
  function core_collection__indexOf(xs, x) {
    return (() => {
  const __s16 = xs;
  if (((Array.isArray(__s16) && __s16.length === 0))) {  return None(); }
  if (((Array.isArray(__s16) && __s16.length >= 1))) { const h = __s16[0]; const t = __s16.slice(1);  return (__eq(h, x) ? (() => {
  return Some(0);
})() : (() => {
  return (() => {
  const __s17 = (() => { const i = (t).indexOf(x); return i === -1 ? None() : Some(i); })();
  if ((__s17.tag === "Some")) { const n = __s17[0];  return Some((n + 1)); }
  if ((__s17.tag === "None")) {  return None(); }
  return null;
})();
})()); }
  return null;
})();
  }
  function core_collection__count$List(xs, p) {
    return dict_core_collection_Foldable_List.fold(dict_core_collection_Foldable_List, xs, 0, (acc, x) => (p(x) ? (() => {
  return (acc + 1);
})() : (() => {
  return acc;
})()));
  }
  function core_collection__any(xs, p) {
    return dict_core_collection_Foldable_List.fold(dict_core_collection_Foldable_List, xs, false, (acc, x) => (acc || p(x)));
  }
  function core_collection__all(xs, p) {
    return dict_core_collection_Foldable_List.fold(dict_core_collection_Foldable_List, xs, true, (acc, x) => (acc && p(x)));
  }
  function core_collection__find(xs, p) {
    return (() => {
  const __s18 = xs;
  if (((Array.isArray(__s18) && __s18.length === 0))) {  return None(); }
  if (((Array.isArray(__s18) && __s18.length >= 1))) { const h = __s18[0]; const t = __s18.slice(1);  return (p(h) ? (() => {
  return Some(h);
})() : (() => {
  return core_collection__find(t, p);
})()); }
  return null;
})();
  }
  function core_collection__forEach$List(xs, f) {
    return (() => {
  const __s19 = xs;
  if (((Array.isArray(__s19) && __s19.length === 0))) {  return null; }
  if (((Array.isArray(__s19) && __s19.length >= 1))) { const h = __s19[0]; const t = __s19.slice(1);  return (() => {
  f(h);
  return (t).forEach(x => (f)(x));
})(); }
  return null;
})();
  }
  function core_collection__append(xs, ys) {
    return (() => {
  const __s20 = xs;
  if (((Array.isArray(__s20) && __s20.length === 0))) {  return ys; }
  if (((Array.isArray(__s20) && __s20.length >= 1))) { const h = __s20[0]; const t = __s20.slice(1);  return [h, ...((t).concat(ys))]; }
  return null;
})();
  }
  function core_collection__take(xs, n) {
    return (() => {
  const __s21 = xs;
  if (((Array.isArray(__s21) && __s21.length === 0))) {  return []; }
  if (((Array.isArray(__s21) && __s21.length >= 1))) { const h = __s21[0]; const t = __s21.slice(1);  return (__eq(n, 0) ? (() => {
  return [];
})() : (() => {
  const r = (t).slice(0, (n - 1));
  return [h, ...(r)];
})()); }
  return null;
})();
  }
  function core_collection__drop(xs, n) {
    return (() => {
  const __s22 = xs;
  if (((Array.isArray(__s22) && __s22.length === 0))) {  return []; }
  if (((Array.isArray(__s22) && __s22.length >= 1))) { const t = __s22.slice(1);  return (__eq(n, 0) ? (() => {
  return xs;
})() : (() => {
  const r = (t).slice((n - 1));
  return r;
})()); }
  return null;
})();
  }
  function core_collection__slice(xs, from, to) {
    return (() => {
  const __s23 = xs;
  if (((Array.isArray(__s23) && __s23.length === 0))) {  return []; }
  if (((Array.isArray(__s23) && __s23.length >= 1))) { const h = __s23[0]; const t = __s23.slice(1);  return ((to <= from) ? (() => {
  return [];
})() : (() => {
  return (__eq(from, 0) ? (() => {
  const r = (t).slice(0, (to - 1));
  return [h, ...(r)];
})() : (() => {
  return (t).slice((from - 1), (to - 1));
})());
})()); }
  return null;
})();
  }
  function core_collection__filter$List(xs, p) {
    return (() => {
  const __s24 = xs;
  if (((Array.isArray(__s24) && __s24.length === 0))) {  return []; }
  if (((Array.isArray(__s24) && __s24.length >= 1))) { const h = __s24[0]; const t = __s24.slice(1);  return (p(h) ? (() => {
  return [h, ...((t).filter(p))];
})() : (() => {
  return (t).filter(p);
})()); }
  return null;
})();
  }
  function core_collection__distinct(xs) {
    return (() => {
  const __s25 = xs;
  if (((Array.isArray(__s25) && __s25.length === 0))) {  return []; }
  if (((Array.isArray(__s25) && __s25.length >= 1))) { const h = __s25[0]; const t = __s25.slice(1);  return ((t).includes(h) ? (() => {
  return core_collection__distinct(t);
})() : (() => {
  return [h, ...(core_collection__distinct(t))];
})()); }
  return null;
})();
  }
  function core_collection__sortBy(xs, f) {
    return (() => {
  const __s26 = xs;
  if (((Array.isArray(__s26) && __s26.length === 0))) {  return []; }
  if (((Array.isArray(__s26) && __s26.length >= 1))) { const h = __s26[0]; const t = __s26.slice(1);  return core_collection__insertSort(h, (t).slice().sort((a, b) => (f)(a, b) ? -1 : 1), f); }
  return null;
})();
  }
  function core_collection__insertSort(x, xs, f) {
    return (() => {
  const __s27 = xs;
  if (((Array.isArray(__s27) && __s27.length === 0))) {  return [x, ...([])]; }
  if (((Array.isArray(__s27) && __s27.length >= 1))) { const h = __s27[0]; const t = __s27.slice(1);  return (f(x, h) ? (() => {
  return [x, ...([h, ...(t)])];
})() : (() => {
  return [h, ...(core_collection__insertSort(x, t, f))];
})()); }
  return null;
})();
  }
  function core_collection__reverse(xs) {
    return (() => {
  const __s28 = xs;
  if (((Array.isArray(__s28) && __s28.length === 0))) {  return []; }
  if (((Array.isArray(__s28) && __s28.length >= 1))) { const h = __s28[0]; const t = __s28.slice(1);  return ((t).slice().reverse()).concat([h, ...([])]); }
  return null;
})();
  }
  function core_collection__clear(xs) {
    return [];
  }
  function core_collection__sum(xs) {
    return dict_core_collection_Foldable_List.fold(dict_core_collection_Foldable_List, xs, 0, (acc, x) => (acc + x));
  }
  function core_collection__maxNat(xs) {
    return (() => {
  const __s29 = xs;
  if (((Array.isArray(__s29) && __s29.length === 0))) {  return None(); }
  if (((Array.isArray(__s29) && __s29.length >= 1))) { const h = __s29[0]; const t = __s29.slice(1);  return (() => {
  const __s30 = t;
  if (((Array.isArray(__s30) && __s30.length === 0))) {  return Some(h); }
  if (((Array.isArray(__s30) && __s30.length >= 1))) {  return (() => {
  const __s31 = core_collection__maxNat(t);
  if ((__s31.tag === "Some")) { const v = __s31[0];  return ((h > v) ? (() => {
  return Some(h);
})() : (() => {
  return Some(v);
})()); }
  if ((__s31.tag === "None")) {  return Some(h); }
  return null;
})(); }
  return null;
})(); }
  return null;
})();
  }
  function core_collection__minNat(xs) {
    return (() => {
  const __s32 = xs;
  if (((Array.isArray(__s32) && __s32.length === 0))) {  return None(); }
  if (((Array.isArray(__s32) && __s32.length >= 1))) { const h = __s32[0]; const t = __s32.slice(1);  return (() => {
  const __s33 = t;
  if (((Array.isArray(__s33) && __s33.length === 0))) {  return Some(h); }
  if (((Array.isArray(__s33) && __s33.length >= 1))) {  return (() => {
  const __s34 = core_collection__minNat(t);
  if ((__s34.tag === "Some")) { const v = __s34[0];  return ((h < v) ? (() => {
  return Some(h);
})() : (() => {
  return Some(v);
})()); }
  if ((__s34.tag === "None")) {  return Some(h); }
  return null;
})(); }
  return null;
})(); }
  return null;
})();
  }
  function core_collection__joinToString(xs, sep) {
    return dict_core_collection_Foldable_List.fold(dict_core_collection_Foldable_List, xs, "", (acc, x) => (__eq(acc, "") ? (() => {
  return __dshtoStr(x);
})() : (() => {
  return (acc + (sep + __dshtoStr(x)));
})()));
  }
  function core_collection__zip(xs, ys) {
    return (() => {
  const __s35 = xs;
  if (((Array.isArray(__s35) && __s35.length === 0))) {  return []; }
  if (((Array.isArray(__s35) && __s35.length >= 1))) { const h = __s35[0]; const t = __s35.slice(1);  return (() => {
  const __s36 = ys;
  if (((Array.isArray(__s36) && __s36.length === 0))) {  return []; }
  if (((Array.isArray(__s36) && __s36.length >= 1))) { const h2 = __s36[0]; const t2 = __s36.slice(1);  return [[h, h2], ...(core_collection__zip(t, t2))]; }
  return null;
})(); }
  return null;
})();
  }
  function core_collection__toSet(xs) {
    return (() => {
  const __s37 = xs;
  if (((Array.isArray(__s37) && __s37.length === 0))) {  return core_collection__SetNil(); }
  if (((Array.isArray(__s37) && __s37.length >= 1))) { const h = __s37[0]; const t = __s37.slice(1);  return core_collection__add(core_collection__toSet(t), h); }
  return null;
})();
  }
  function core_collection__toMap(xs) {
    return (() => {
  const __s38 = xs;
  if (((Array.isArray(__s38) && __s38.length === 0))) {  return core_collection__MapNil(); }
  if (((Array.isArray(__s38) && __s38.length >= 1))) { const pr = __s38[0]; const t = __s38.slice(1);  return (() => {
  const __s39 = pr;
  if (((Array.isArray(__s39) && __s39.length === 2))) { const k = __s39[0]; const v = __s39[1];  return core_collection__put(core_collection__toMap(t), k, v); }
  return null;
})(); }
  return null;
})();
  }
  function core_collection__Map__MapNil() { return { tag: "MapNil" }; }
  const core_collection__MapNil = core_collection__Map__MapNil;
  function core_collection__Map__MapCons(a0, a1, a2) { return { tag: "MapCons", 0: a0, 1: a1, 2: a2 }; }
  const core_collection__MapCons = core_collection__Map__MapCons;
  function core_collection__mapEmpty() {
    return core_collection__MapNil();
  }
  function core_collection__size$Map(m) {
    return (() => {
  const __s40 = m;
  if ((__s40.tag === "MapNil")) {  return 0; }
  if ((__s40.tag === "MapCons")) { const t = __s40[2];  return (core_collection__size$Map(t) + 1); }
  return null;
})();
  }
  function core_collection__isEmpty$Map(m) {
    return (() => {
  const __s41 = m;
  if ((__s41.tag === "MapNil")) {  return true; }
  if ((__s41.tag === "MapCons")) {  return false; }
  return null;
})();
  }
  function core_collection__get$Map(m, k) {
    return (() => {
  const __s42 = m;
  if ((__s42.tag === "MapNil")) {  return None(); }
  if ((__s42.tag === "MapCons")) { const k0 = __s42[0]; const v0 = __s42[1]; const t = __s42[2];  return (__eq(k0, k) ? (() => {
  return Some(v0);
})() : (() => {
  return core_collection__get$Map(t, k);
})()); }
  return null;
})();
  }
  function core_collection__containsKey(m, k) {
    return (() => {
  const __s43 = m;
  if ((__s43.tag === "MapNil")) {  return false; }
  if ((__s43.tag === "MapCons")) { const k0 = __s43[0]; const t = __s43[2];  return (__eq(k0, k) ? (() => {
  return true;
})() : (() => {
  return core_collection__containsKey(t, k);
})()); }
  return null;
})();
  }
  function core_collection__keys(m) {
    return (() => {
  const __s44 = m;
  if ((__s44.tag === "MapNil")) {  return []; }
  if ((__s44.tag === "MapCons")) { const k0 = __s44[0]; const t = __s44[2];  return [k0, ...(core_collection__keys(t))]; }
  return null;
})();
  }
  function core_collection__values(m) {
    return (() => {
  const __s45 = m;
  if ((__s45.tag === "MapNil")) {  return []; }
  if ((__s45.tag === "MapCons")) { const v0 = __s45[1]; const t = __s45[2];  return [v0, ...(core_collection__values(t))]; }
  return null;
})();
  }
  function core_collection__put(m, k, v) {
    return core_collection__MapCons(k, v, core_collection__remove$Map(m, k));
  }
  function core_collection__remove$Map(m, k) {
    return (() => {
  const __s46 = m;
  if ((__s46.tag === "MapNil")) {  return core_collection__MapNil(); }
  if ((__s46.tag === "MapCons")) { const k0 = __s46[0]; const v0 = __s46[1]; const t = __s46[2];  return (__eq(k0, k) ? (() => {
  return t;
})() : (() => {
  return core_collection__MapCons(k0, v0, core_collection__remove$Map(t, k));
})()); }
  return null;
})();
  }
  function core_collection__filter$Map(m, p) {
    return (() => {
  const __s47 = m;
  if ((__s47.tag === "MapNil")) {  return core_collection__MapNil(); }
  if ((__s47.tag === "MapCons")) { const k0 = __s47[0]; const v0 = __s47[1]; const t = __s47[2];  return (p(v0) ? (() => {
  return core_collection__MapCons(k0, v0, core_collection__filter$Map(t, p));
})() : (() => {
  return core_collection__filter$Map(t, p);
})()); }
  return null;
})();
  }
  function core_collection__mapValues(m, f) {
    return (() => {
  const __s48 = m;
  if ((__s48.tag === "MapNil")) {  return core_collection__MapNil(); }
  if ((__s48.tag === "MapCons")) { const k0 = __s48[0]; const v0 = __s48[1]; const t = __s48[2];  return core_collection__MapCons(k0, f(v0), core_collection__mapValues(t, f)); }
  return null;
})();
  }
  function core_collection__mapKeys(m, f) {
    return (() => {
  const __s49 = m;
  if ((__s49.tag === "MapNil")) {  return core_collection__MapNil(); }
  if ((__s49.tag === "MapCons")) { const k0 = __s49[0]; const v0 = __s49[1]; const t = __s49[2];  return core_collection__put(core_collection__mapKeys(t, f), f(k0), v0); }
  return null;
})();
  }
  function core_collection__merge(m1, m2) {
    return (() => {
  const __s50 = m2;
  if ((__s50.tag === "MapNil")) {  return m1; }
  if ((__s50.tag === "MapCons")) { const k0 = __s50[0]; const v0 = __s50[1]; const t = __s50[2];  return core_collection__merge(core_collection__put(m1, k0, v0), t); }
  return null;
})();
  }
  function core_collection__toList$Map(m) {
    return core_collection__values(m);
  }
  function core_collection__Optional__Some(a0) { return { tag: "Some", 0: a0 }; }
  const core_collection__Some = core_collection__Optional__Some;
  function core_collection__Optional__None() { return { tag: "None" }; }
  const core_collection__None = core_collection__Optional__None;
  const dict_core_collection_Functor_Optional = {
    map: (d, fa, f) => (() => {
  const __s51 = fa;
  if ((__s51.tag === "Some")) { const v = __s51[0];  return Some(f(v)); }
  if ((__s51.tag === "None")) {  return None(); }
  return null;
})()
  };
  const dict_core_collection_Foldable_Optional = {
    fold: (d, fa, init, f) => (() => {
  const __s52 = fa;
  if ((__s52.tag === "Some")) { const v = __s52[0];  return f(init, v); }
  if ((__s52.tag === "None")) {  return init; }
  return null;
})()
  };
  const dict_core_collection_Monad_Optional = {
    pure: (d, x) => Some(x),
    flatMap: (d, fa, f) => (() => {
  const __s53 = fa;
  if ((__s53.tag === "Some")) { const v = __s53[0];  return f(v); }
  if ((__s53.tag === "None")) {  return None(); }
  return null;
})()
  };
  function core_collection__isSome(o) {
    return (() => {
  const __s54 = o;
  if ((__s54.tag === "Some")) {  return true; }
  if ((__s54.tag === "None")) {  return false; }
  return null;
})();
  }
  function core_collection__isNone(o) {
    return (() => {
  const __s55 = o;
  if ((__s55.tag === "Some")) {  return false; }
  if ((__s55.tag === "None")) {  return true; }
  return null;
})();
  }
  function core_collection__getOrElse(o, d) {
    return (() => {
  const __s56 = o;
  if ((__s56.tag === "Some")) { const v = __s56[0];  return v; }
  if ((__s56.tag === "None")) {  return d; }
  return null;
})();
  }
  function core_collection__orElse(o, d) {
    return (() => {
  const __s57 = o;
  if ((__s57.tag === "Some")) {  return o; }
  if ((__s57.tag === "None")) {  return d; }
  return null;
})();
  }
  function core_collection__filter$Optional(o, p) {
    return (() => {
  const __s58 = o;
  if ((__s58.tag === "Some")) { const v = __s58[0];  return (p(v) ? (() => {
  return Some(v);
})() : (() => {
  return None();
})()); }
  if ((__s58.tag === "None")) {  return None(); }
  return null;
})();
  }
  function core_collection__toResult(o, e) {
    return (() => {
  const __s59 = o;
  if ((__s59.tag === "Some")) { const v = __s59[0];  return core_collection__Ok(v); }
  if ((__s59.tag === "None")) {  return core_collection__Err(e); }
  return null;
})();
  }
  function core_collection__toList$Optional(o) {
    return (() => {
  const __s60 = o;
  if ((__s60.tag === "Some")) { const v = __s60[0];  return [v, ...([])]; }
  if ((__s60.tag === "None")) {  return []; }
  return null;
})();
  }
  function core_collection__Result__Ok(a0) { return { tag: "Ok", 0: a0 }; }
  const core_collection__Ok = core_collection__Result__Ok;
  function core_collection__Result__Err(a0) { return { tag: "Err", 0: a0 }; }
  const core_collection__Err = core_collection__Result__Err;
  function core_collection__isOk(r) {
    return (() => {
  const __s61 = r;
  if ((__s61.tag === "Ok")) {  return true; }
  if ((__s61.tag === "Err")) {  return false; }
  return null;
})();
  }
  function core_collection__isErr(r) {
    return (() => {
  const __s62 = r;
  if ((__s62.tag === "Ok")) {  return false; }
  if ((__s62.tag === "Err")) {  return true; }
  return null;
})();
  }
  function core_collection__unwrapOr(r, d) {
    return (() => {
  const __s63 = r;
  if ((__s63.tag === "Ok")) { const v = __s63[0];  return v; }
  if ((__s63.tag === "Err")) {  return d; }
  return null;
})();
  }
  function core_collection__mapOk(r, f) {
    return (() => {
  const __s64 = r;
  if ((__s64.tag === "Ok")) { const v = __s64[0];  return core_collection__Ok(f(v)); }
  if ((__s64.tag === "Err")) { const e = __s64[0];  return core_collection__Err(e); }
  return null;
})();
  }
  function core_collection__mapErr(r, f) {
    return (() => {
  const __s65 = r;
  if ((__s65.tag === "Ok")) { const v = __s65[0];  return core_collection__Ok(v); }
  if ((__s65.tag === "Err")) { const e = __s65[0];  return core_collection__Err(f(e)); }
  return null;
})();
  }
  function core_collection__flatMapOk(r, f) {
    return (() => {
  const __s66 = r;
  if ((__s66.tag === "Ok")) { const v = __s66[0];  return f(v); }
  if ((__s66.tag === "Err")) { const e = __s66[0];  return core_collection__Err(e); }
  return null;
})();
  }
  function core_collection__toList$Result(r) {
    return (() => {
  const __s67 = r;
  if ((__s67.tag === "Ok")) { const v = __s67[0];  return [v, ...([])]; }
  if ((__s67.tag === "Err")) {  return []; }
  return null;
})();
  }
  function core_collection__Set__SetNil() { return { tag: "SetNil" }; }
  const core_collection__SetNil = core_collection__Set__SetNil;
  function core_collection__Set__SetCons(a0, a1) { return { tag: "SetCons", 0: a0, 1: a1 }; }
  const core_collection__SetCons = core_collection__Set__SetCons;
  const dict_core_collection_Functor_Set = {
    map: (d, fa, f) => (() => {
  const __s68 = fa;
  if ((__s68.tag === "SetNil")) {  return core_collection__SetNil(); }
  if ((__s68.tag === "SetCons")) { const h = __s68[0]; const t = __s68[1];  return core_collection__add(dict_core_collection_Functor_Set.map(dict_core_collection_Functor_Set, t, f), f(h)); }
  return null;
})()
  };
  const dict_core_collection_Foldable_Set = {
    fold: (d, fa, init, f) => (() => {
  const __s69 = fa;
  if ((__s69.tag === "SetNil")) {  return init; }
  if ((__s69.tag === "SetCons")) { const h = __s69[0]; const t = __s69[1];  return dict_core_collection_Foldable_Set.fold(dict_core_collection_Foldable_Set, t, f(init, h), f); }
  return null;
})()
  };
  function core_collection__setEmpty() {
    return core_collection__SetNil();
  }
  function core_collection__setOf(items) {
    return core_collection__SetNil();
  }
  function core_collection__add(s, x) {
    return (core_collection__contains$Set(s, x) ? (() => {
  return s;
})() : (() => {
  return core_collection__SetCons(x, s);
})());
  }
  function core_collection__remove$Set(s, x) {
    return (() => {
  const __s70 = s;
  if ((__s70.tag === "SetNil")) {  return core_collection__SetNil(); }
  if ((__s70.tag === "SetCons")) { const h = __s70[0]; const t = __s70[1];  return (__eq(h, x) ? (() => {
  return t;
})() : (() => {
  return core_collection__SetCons(h, core_collection__remove$Set(t, x));
})()); }
  return null;
})();
  }
  function core_collection__size$Set(s) {
    return (() => {
  const __s71 = s;
  if ((__s71.tag === "SetNil")) {  return 0; }
  if ((__s71.tag === "SetCons")) { const t = __s71[1];  return (core_collection__size$Set(t) + 1); }
  return null;
})();
  }
  function core_collection__isEmpty$Set(s) {
    return (() => {
  const __s72 = s;
  if ((__s72.tag === "SetNil")) {  return true; }
  if ((__s72.tag === "SetCons")) {  return false; }
  return null;
})();
  }
  function core_collection__contains$Set(s, x) {
    return (() => {
  const __s73 = s;
  if ((__s73.tag === "SetNil")) {  return false; }
  if ((__s73.tag === "SetCons")) { const h = __s73[0]; const t = __s73[1];  return (__eq(h, x) ? (() => {
  return true;
})() : (() => {
  return core_collection__contains$Set(t, x);
})()); }
  return null;
})();
  }
  function core_collection__count$Set(s, p) {
    return dict_core_collection_Foldable_Set.fold(dict_core_collection_Foldable_Set, s, 0, (acc, x) => (p(x) ? (() => {
  return (acc + 1);
})() : (() => {
  return acc;
})()));
  }
  function core_collection__forEach$Set(s, f) {
    return (() => {
  const __s74 = s;
  if ((__s74.tag === "SetNil")) {  return null; }
  if ((__s74.tag === "SetCons")) { const h = __s74[0]; const t = __s74[1];  return (() => {
  f(h);
  return core_collection__forEach$Set(t, f);
})(); }
  return null;
})();
  }
  function core_collection__union(s1, s2) {
    return (() => {
  const __s75 = s1;
  if ((__s75.tag === "SetNil")) {  return s2; }
  if ((__s75.tag === "SetCons")) { const h = __s75[0]; const t = __s75[1];  return (core_collection__contains$Set(s2, h) ? (() => {
  return core_collection__union(t, s2);
})() : (() => {
  return core_collection__SetCons(h, core_collection__union(t, s2));
})()); }
  return null;
})();
  }
  function core_collection__intersect(s1, s2) {
    return (() => {
  const __s76 = s1;
  if ((__s76.tag === "SetNil")) {  return core_collection__SetNil(); }
  if ((__s76.tag === "SetCons")) { const h = __s76[0]; const t = __s76[1];  return (core_collection__contains$Set(s2, h) ? (() => {
  return core_collection__SetCons(h, core_collection__intersect(t, s2));
})() : (() => {
  return core_collection__intersect(t, s2);
})()); }
  return null;
})();
  }
  function core_collection__filter$Set(s, p) {
    return (() => {
  const __s77 = s;
  if ((__s77.tag === "SetNil")) {  return core_collection__SetNil(); }
  if ((__s77.tag === "SetCons")) { const h = __s77[0]; const t = __s77[1];  return (p(h) ? (() => {
  return core_collection__SetCons(h, core_collection__filter$Set(t, p));
})() : (() => {
  return core_collection__filter$Set(t, p);
})()); }
  return null;
})();
  }
  function core_collection__flatMap(s, f) {
    return (() => {
  const __s78 = s;
  if ((__s78.tag === "SetNil")) {  return core_collection__SetNil(); }
  if ((__s78.tag === "SetCons")) { const h = __s78[0]; const t = __s78[1];  return core_collection__union(f(h), core_collection__flatMap(t, f)); }
  return null;
})();
  }
  function core_collection__toList$Set(s) {
    return (() => {
  const __s79 = s;
  if ((__s79.tag === "SetNil")) {  return []; }
  if ((__s79.tag === "SetCons")) { const h = __s79[0]; const t = __s79[1];  return [h, ...(core_collection__toList$Set(t))]; }
  return null;
})();
  }
  const dict_core_collection_Tuple_EmptyTuple = {
    size: (d, __self) => 0,
    isEmpty: (d, __self) => true
  };
  const dict_core_collection_Tuple_SingleTuple = {
    size: (d, __self) => 1,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b_ = {
    size: (d, __self) => 2,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c_ = {
    size: (d, __self) => 3,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c__d_ = {
    size: (d, __self) => 4,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c__d__e_ = {
    size: (d, __self) => 5,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c__d__e__f_ = {
    size: (d, __self) => 6,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c__d__e__f__g_ = {
    size: (d, __self) => 7,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c__d__e__f__g__h_ = {
    size: (d, __self) => 8,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c__d__e__f__g__h__i_ = {
    size: (d, __self) => 9,
    isEmpty: (d, __self) => false
  };
  const dict_core_collection_Tuple__a__b__c__d__e__f__g__h__i__j_ = {
    size: (d, __self) => 10,
    isEmpty: (d, __self) => false
  };
  function core_encoding__base64Encode(s) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_encoding__base64Decode(s) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_encoding__hexEncode(s) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_encoding__hexDecode(s) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_math__sqrt(x) {
    return Math.pow(x, 0.5);
  }
  function core_math__gcd(a, b) {
    return (__eq(b, 0) ? (() => {
  return a;
})() : (() => {
  const r = core_math__gcd(b, (a % b));
  return r;
})());
  }
  function core_math__lcm(a, b) {
    return (__eq(b, 0) ? (() => {
  return 0;
})() : (() => {
  const r = core_math__gcd(a, b);
  return (a * (b / r));
})());
  }
  function core_math__isEven(n) {
    return __eq((n % 2), 0);
  }
  function core_math__isOdd(n) {
    return (!__eq((n % 2), 0));
  }
  function core_math__sq(n) {
    return (n * n);
  }
  function core_math__cube(n) {
    return ((n * n) * n);
  }
  function core_math__summation(a, b) {
    return (core_collection__range(a, b)).reduce((a, b) => a + b, 0);
  }
  async function core_net__httpGet(url) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  async function core_net__httpPost(url, body) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  async function core_net__socketConnect(host, port) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  const dict_core_number_Num_Rat = {
  };
  function core_random__randNat(n) {
    return Math.floor((Math.random() * Number(n)));
  }
  function core_real__ratOr(s, fallback) {
    return (() => {
  const __s80 = (() => { const v = Number(String(s)); return Number.isNaN(v) ? None() : Some(v); })();
  if ((__s80.tag === "Some")) { const r = __s80[0];  return r; }
  if ((__s80.tag === "None")) {  return fallback; }
  return null;
})();
  }
  function core_regex__regexMatch(s, pattern) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_regex__regexFind(s, pattern) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_regex__regexSplit(s, pattern) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_regex__regexReplace(s, pattern, repl) {
    return (() => { throw new Error('panic: unreachable') })();
  }
  function core_time__diffMs(a, b) {
    return (b - a);
  }
  main();
})();

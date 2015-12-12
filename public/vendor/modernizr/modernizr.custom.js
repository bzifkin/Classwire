/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-backgroundsize-bgpositionshorthand-bgpositionxy-bgrepeatspace_bgrepeatround-bgsizecover-borderradius-cssanimations-csscalc-csstransforms-csstransforms3d-csstransitions-flexboxtweener-fontface-inlinesvg-localstorage-multiplebgs-preserve3d-sessionstorage-smil-svgclippaths-svgfilters-svgforeignobject-todataurljpeg_todataurlpng_todataurlwebp-setclasses !*/
!function(e,t,n){function r(e,t){return typeof e===t}function s(){var e,t,n,s,a,o,i;for(var d in w)if(w.hasOwnProperty(d)){if(e=[],t=w[d],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=r(t.fn,"function")?t.fn():t.fn,a=0;a<e.length;a++)o=e[a],i=o.split("."),1===i.length?Modernizr[i[0]]=s:(!Modernizr[i[0]]||Modernizr[i[0]]instanceof Boolean||(Modernizr[i[0]]=new Boolean(Modernizr[i[0]])),Modernizr[i[0]][i[1]]=s),b.push((s?"":"no-")+i.join("-"))}}function a(e){var t=x.className,n=Modernizr._config.classPrefix||"";if(S&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),S?x.className.baseVal=t:x.className=t)}function o(e,t){return!!~(""+e).indexOf(t)}function i(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):S?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function d(){var e=t.body;return e||(e=i(S?"svg":"body"),e.fake=!0),e}function l(e,n,r,s){var a,o,l,c,u="modernizr",f=i("div"),p=d();if(parseInt(r,10))for(;r--;)l=i("div"),l.id=s?s[r]:u+(r+1),f.appendChild(l);return a=i("style"),a.type="text/css",a.id="s"+u,(p.fake?p:f).appendChild(a),p.appendChild(f),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),f.id=u,p.fake&&(p.style.background="",p.style.overflow="hidden",c=x.style.overflow,x.style.overflow="hidden",x.appendChild(p)),o=n(f,e),p.fake?(p.parentNode.removeChild(p),x.style.overflow=c,x.offsetHeight):f.parentNode.removeChild(f),!!o}function c(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function u(t,r){var s=t.length;if("CSS"in e&&"supports"in e.CSS){for(;s--;)if(e.CSS.supports(c(t[s]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var a=[];s--;)a.push("("+c(t[s])+":"+r+")");return a=a.join(" or "),l("@supports ("+a+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return n}function f(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function p(e,t,s,a){function d(){c&&(delete _.style,delete _.modElem)}if(a=r(a,"undefined")?!1:a,!r(s,"undefined")){var l=u(e,s);if(!r(l,"undefined"))return l}for(var c,p,g,m,v,h=["modernizr","tspan"];!_.style;)c=!0,_.modElem=i(h.shift()),_.style=_.modElem.style;for(g=e.length,p=0;g>p;p++)if(m=e[p],v=_.style[m],o(m,"-")&&(m=f(m)),_.style[m]!==n){if(a||r(s,"undefined"))return d(),"pfx"==t?m:!0;try{_.style[m]=s}catch(w){}if(_.style[m]!=v)return d(),"pfx"==t?m:!0}return d(),!1}function g(e,t){return function(){return e.apply(t,arguments)}}function m(e,t,n){var s;for(var a in e)if(e[a]in t)return n===!1?e[a]:(s=t[e[a]],r(s,"function")?g(s,n||t):s);return!1}function v(e,t,n,s,a){var o=e.charAt(0).toUpperCase()+e.slice(1),i=(e+" "+C.join(o+" ")+o).split(" ");return r(t,"string")||r(t,"undefined")?p(i,t,s,a):(i=(e+" "+k.join(o+" ")+o).split(" "),m(i,t,n))}function h(e,t,r){return v(e,n,n,t,r)}var w=[],y={_version:"3.2.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){w.push({name:e,fn:t,options:n})},addAsyncTest:function(e){w.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=y,Modernizr=new Modernizr;var b=[],x=t.documentElement,S="svg"===x.nodeName.toLowerCase(),T="Moz O ms Webkit",C=y._config.usePrefixes?T.split(" "):[];y._cssomPrefixes=C;var E={elem:i("modernizr")};Modernizr._q.push(function(){delete E.elem});var _={style:E.elem.style};Modernizr._q.unshift(function(){delete _.style});var k=y._config.usePrefixes?T.toLowerCase().split(" "):[];y._domPrefixes=k,y.testAllProps=v,y.testAllProps=h,Modernizr.addTest("backgroundsize",h("backgroundSize","100%",!0)),Modernizr.addTest("bgpositionshorthand",function(){var e=i("a"),t=e.style,n="right 10px bottom 10px";return t.cssText="background-position: "+n+";",t.backgroundPosition===n}),Modernizr.addTest("bgpositionxy",function(){return h("backgroundPositionX","3px",!0)&&h("backgroundPositionY","5px",!0)}),Modernizr.addTest("bgrepeatround",h("backgroundRepeat","round")),Modernizr.addTest("bgrepeatspace",h("backgroundRepeat","space")),Modernizr.addTest("bgsizecover",h("backgroundSize","cover")),Modernizr.addTest("borderradius",h("borderRadius","0px",!0)),Modernizr.addTest("cssanimations",h("animationName","a",!0));var z=y._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];y._prefixes=z,Modernizr.addTest("csscalc",function(){var e="width:",t="calc(10px);",n=i("a");return n.style.cssText=e+z.join(t+e),!!n.style.length}),Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&h("transform","scale(1)",!0)});var P=y.testStyles=l,R="CSS"in e&&"supports"in e.CSS,N="supportsCSS"in e;Modernizr.addTest("supports",R||N),Modernizr.addTest("csstransforms3d",function(){var e=!!h("perspective","1px",!0),t=Modernizr._config.usePrefixes;if(e&&(!t||"webkitPerspective"in x.style)){var n,r="#modernizr{width:0;height:0}";Modernizr.supports?n="@supports (perspective: 1px)":(n="@media (transform-3d)",t&&(n+=",(-webkit-transform-3d)")),n+="{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}",P(r+n,function(t){e=7===t.offsetWidth&&18===t.offsetHeight})}return e}),Modernizr.addTest("csstransitions",h("transition","all",!0)),Modernizr.addTest("flexboxtweener",h("flexAlign","end",!0));var j=function(){var e=navigator.userAgent,t=e.match(/applewebkit\/([0-9]+)/gi)&&parseFloat(RegExp.$1),n=e.match(/w(eb)?osbrowser/gi),r=e.match(/windows phone/gi)&&e.match(/iemobile\/([0-9])+/gi)&&parseFloat(RegExp.$1)>=9,s=533>t&&e.match(/android/gi);return n||s||r}();j?Modernizr.addTest("fontface",!1):P('@font-face {font-family:"font";src:url("https://")}',function(e,n){var r=t.getElementById("smodernizr"),s=r.sheet||r.styleSheet,a=s?s.cssRules&&s.cssRules[0]?s.cssRules[0].cssText:s.cssText||"":"",o=/src/i.test(a)&&0===a.indexOf(n.split(" ")[0]);Modernizr.addTest("fontface",o)}),Modernizr.addTest("inlinesvg",function(){var e=i("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"==("undefined"!=typeof SVGRect&&e.firstChild&&e.firstChild.namespaceURI)}),Modernizr.addTest("localstorage",function(){var e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return!1}}),Modernizr.addTest("multiplebgs",function(){var e=i("a").style;return e.cssText="background:url(https://),url(https://),red url(https://)",/(url\s*\(.*?){3}/.test(e.background)}),Modernizr.addTest("preserve3d",h("transformStyle","preserve-3d")),Modernizr.addTest("sessionstorage",function(){var e="modernizr";try{return sessionStorage.setItem(e,e),sessionStorage.removeItem(e),!0}catch(t){return!1}});var A={}.toString;Modernizr.addTest("smil",function(){return!!t.createElementNS&&/SVGAnimate/.test(A.call(t.createElementNS("http://www.w3.org/2000/svg","animate")))}),Modernizr.addTest("svgclippaths",function(){return!!t.createElementNS&&/SVGClipPath/.test(A.call(t.createElementNS("http://www.w3.org/2000/svg","clipPath")))}),Modernizr.addTest("svgfilters",function(){var t=!1;try{t="SVGFEColorMatrixElement"in e&&2==SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE}catch(n){}return t}),Modernizr.addTest("svgforeignobject",function(){return!!t.createElementNS&&/SVGForeignObject/.test(A.call(t.createElementNS("http://www.w3.org/2000/svg","foreignObject")))}),Modernizr.addTest("canvas",function(){var e=i("canvas");return!(!e.getContext||!e.getContext("2d"))});var O=i("canvas");Modernizr.addTest("todataurljpeg",function(){return!!Modernizr.canvas&&0===O.toDataURL("image/jpeg").indexOf("data:image/jpeg")}),Modernizr.addTest("todataurlpng",function(){return!!Modernizr.canvas&&0===O.toDataURL("image/png").indexOf("data:image/png")}),Modernizr.addTest("todataurlwebp",function(){var e=!1;try{e=!!Modernizr.canvas&&0===O.toDataURL("image/webp").indexOf("data:image/webp")}catch(t){}return e}),s(),a(b),delete y.addTest,delete y.addAsyncTest;for(var L=0;L<Modernizr._q.length;L++)Modernizr._q[L]();e.Modernizr=Modernizr}(window,document);
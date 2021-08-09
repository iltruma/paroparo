!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).SVGInjector={})}(this,(function(t){"use strict";var e=function(t){return t.cloneNode(!0)},r=function(){return"file:"===window.location.protocol},n=new Map,i={},o=function(t,e){i[t]=i[t]||[],i[t].push(e)},l=function(t){for(var r=function(r,o){setTimeout((function(){if(Array.isArray(i[t])){var o=n.get(t),l=i[t][r];o instanceof SVGElement&&l(null,e(o)),o instanceof Error&&l(o),r===i[t].length-1&&delete i[t]}}),0)},o=0,l=i[t].length;o<l;o++)r(o)},a=0,s=function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),i=0;for(e=0;e<r;e++)for(var o=arguments[e],l=0,a=o.length;l<a;l++,i++)n[i]=o[l];return n},u=[],c={},f="http://www.w3.org/1999/xlink",d=function(t,i,d,p,v){var h=t.getAttribute("data-src")||t.getAttribute("src");if(h&&/\.svg/i.test(h)){if(-1!==u.indexOf(t))return u.splice(u.indexOf(t),1),void(t=null);u.push(t),t.setAttribute("src",""),function(t,i){if(n.has(t)){var a=n.get(t);return a instanceof SVGElement?void i(null,e(a)):a instanceof Error?void i(a):void o(t,i)}n.set(t,void 0),o(t,i);var s=new XMLHttpRequest;s.onreadystatechange=function(){try{if(4===s.readyState){if(404===s.status||null===s.responseXML)throw new Error(r()?"Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+t);if(!(200===s.status||r()&&0===s.status))throw new Error("There was a problem injecting the SVG: "+s.status+" "+s.statusText);s.responseXML instanceof Document&&s.responseXML.documentElement&&n.set(t,s.responseXML.documentElement),l(t)}}catch(e){n.set(t,e),l(t)}},s.open("GET",t),s.overrideMimeType&&s.overrideMimeType("text/xml"),s.send()}(h,(function(e,r){if(!r)return u.splice(u.indexOf(t),1),t=null,void v(e);var n=t.getAttribute("id");n&&r.setAttribute("id",n);var o=t.getAttribute("title");o&&r.setAttribute("title",o);var l=t.getAttribute("width");l&&r.setAttribute("width",l);var g=t.getAttribute("height");g&&r.setAttribute("height",g);var A=Array.from(new Set(s((r.getAttribute("class")||"").split(" "),["injected-svg"],(t.getAttribute("class")||"").split(" ")))).join(" ").trim();r.setAttribute("class",A);var b=t.getAttribute("style");b&&r.setAttribute("style",b),r.setAttribute("data-src",h);var m=[].filter.call(t.attributes,(function(t){return/^data-\w[\w-]*$/.test(t.name)}));if(Array.prototype.forEach.call(m,(function(t){t.name&&t.value&&r.setAttribute(t.name,t.value)})),d){var y,w,x,E,S={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]};Object.keys(S).forEach((function(t){w=S[t];for(var e=function(t,e){var n;E=(x=y[t].id)+"-"+ ++a,Array.prototype.forEach.call(w,(function(t){for(var e=0,i=(n=r.querySelectorAll("["+t+'*="'+x+'"]')).length;e<i;e++){var o=n[e].getAttribute(t);o&&!o.match(new RegExp("url\\(#"+x+"\\)"))||n[e].setAttribute(t,"url(#"+E+")")}}));for(var i=r.querySelectorAll("[*|href]"),o=[],l=0,s=i.length;l<s;l++){var u=i[l].getAttributeNS(f,"href");u&&u.toString()==="#"+y[t].id&&o.push(i[l])}for(var c=0,d=o.length;c<d;c++)o[c].setAttributeNS(f,"href","#"+E);y[t].id=E},n=0,i=(y=r.querySelectorAll(t+"[id]")).length;n<i;n++)e(n)}))}r.removeAttribute("xmlns:a");for(var j,k,G=r.querySelectorAll("script"),M=[],T=0,O=G.length;T<O;T++)(k=G[T].getAttribute("type"))&&"application/ecmascript"!==k&&"application/javascript"!==k&&"text/javascript"!==k||((j=G[T].innerText||G[T].textContent)&&M.push(j),r.removeChild(G[T]));if(M.length>0&&("always"===i||"once"===i&&!c[h])){for(var V=0,q=M.length;V<q;V++)new Function(M[V])(window);c[h]=!0}var N=r.querySelectorAll("style");Array.prototype.forEach.call(N,(function(t){t.textContent+=""})),r.setAttribute("xmlns","http://www.w3.org/2000/svg"),r.setAttribute("xmlns:xlink",f),p(r),t.parentNode&&t.parentNode.replaceChild(r,t),u.splice(u.indexOf(t),1),t=null,v(null,r)}))}else v(new Error("Attempted to inject a file with a non-svg extension: "+h))};t.SVGInjector=function(t,e){var r=void 0===e?{}:e,n=r.afterAll,i=void 0===n?function(){}:n,o=r.afterEach,l=void 0===o?function(){}:o,a=r.beforeEach,s=void 0===a?function(){}:a,u=r.evalScripts,c=void 0===u?"never":u,f=r.renumerateIRIElements,p=void 0===f||f;if(t&&"length"in t)for(var v=0,h=0,g=t.length;h<g;h++)d(t[h],c,p,s,(function(e,r){l(e,r),t&&"length"in t&&t.length===++v&&i(v)}));else t?d(t,c,p,s,(function(e,r){l(e,r),i(1),t=null})):i(0)},Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=svg-injector.umd.production.js.map

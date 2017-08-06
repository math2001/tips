/*! URI.js v1.18.10 http://medialize.github.io/URI.js/ */
/* build contains: URI.js, URITemplate.js */
/*
 URI.js - Mutating URLs

 Version: 1.18.10

 Author: Rodney Rehm
 Web: http://medialize.github.io/URI.js/

 Licensed under
   MIT License http://www.opensource.org/licenses/mit-license

 URI.js - Mutating URLs
 URI Template Support - http://tools.ietf.org/html/rfc6570

 Version: 1.18.10

 Author: Rodney Rehm
 Web: http://medialize.github.io/URI.js/

 Licensed under
   MIT License http://www.opensource.org/licenses/mit-license

*/
(function(h,y){"object"===typeof module&&module.exports?module.exports=y(require("./punycode"),require("./IPv6"),require("./SecondLevelDomains")):"function"===typeof define&&define.amd?define(["./punycode","./IPv6","./SecondLevelDomains"],y):h.URI=y(h.punycode,h.IPv6,h.SecondLevelDomains,h)})(this,function(h,y,k,w){function d(a,b){var c=1<=arguments.length,m=2<=arguments.length;if(!(this instanceof d))return c?m?new d(a,b):new d(a):new d;if(void 0===a){if(c)throw new TypeError("undefined is not a valid argument for URI");
a="undefined"!==typeof location?location.href+"":""}if(null===a&&c)throw new TypeError("null is not a valid argument for URI");this.href(a);return void 0!==b?this.absoluteTo(b):this}function A(a){return a.replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")}function B(a){return void 0===a?"Undefined":String(Object.prototype.toString.call(a)).slice(8,-1)}function p(a){return"Array"===B(a)}function g(a,b){var c={},d;if("RegExp"===B(b))c=null;else if(p(b)){var f=0;for(d=b.length;f<d;f++)c[b[f]]=!0}else c[b]=
!0;f=0;for(d=a.length;f<d;f++)if(c&&void 0!==c[a[f]]||!c&&b.test(a[f]))a.splice(f,1),d--,f--;return a}function l(a,b){var c;if(p(b)){var d=0;for(c=b.length;d<c;d++)if(!l(a,b[d]))return!1;return!0}var f=B(b);d=0;for(c=a.length;d<c;d++)if("RegExp"===f){if("string"===typeof a[d]&&a[d].match(b))return!0}else if(a[d]===b)return!0;return!1}function q(a,b){if(!p(a)||!p(b)||a.length!==b.length)return!1;a.sort();b.sort();for(var c=0,d=a.length;c<d;c++)if(a[c]!==b[c])return!1;return!0}function t(a){return a.replace(/^\/+|\/+$/g,
"")}function E(a){return escape(a)}function z(a){return encodeURIComponent(a).replace(/[!'()*]/g,E).replace(/\*/g,"%2A")}function x(a){return function(b,c){if(void 0===b)return this._parts[a]||"";this._parts[a]=b||null;this.build(!c);return this}}function C(a,b){return function(c,d){if(void 0===c)return this._parts[a]||"";null!==c&&(c+="",c.charAt(0)===b&&(c=c.substring(1)));this._parts[a]=c;this.build(!d);return this}}var n=w&&w.URI;d.version="1.18.10";var e=d.prototype,r=Object.prototype.hasOwnProperty;
d._parts=function(){return{protocol:null,username:null,password:null,hostname:null,urn:null,port:null,path:null,query:null,fragment:null,duplicateQueryParameters:d.duplicateQueryParameters,escapeQuerySpace:d.escapeQuerySpace}};d.duplicateQueryParameters=!1;d.escapeQuerySpace=!0;d.protocol_expression=/^[a-z][a-z0-9.+-]*$/i;d.idn_expression=/[^a-z0-9\.-]/i;d.punycode_expression=/(xn--)/i;d.ip4_expression=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;d.ip6_expression=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
d.find_uri_expression=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/ig;d.findUri={start:/\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,end:/[\s\r\n]|$/,trim:/[`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019]+$/,parens:/(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g};d.defaultPorts={http:"80",https:"443",ftp:"21",
gopher:"70",ws:"80",wss:"443"};d.invalid_hostname_characters=/[^a-zA-Z0-9\.-]/;d.domAttributes={a:"href",blockquote:"cite",link:"href",base:"href",script:"src",form:"action",img:"src",area:"href",iframe:"src",embed:"src",source:"src",track:"src",input:"src",audio:"src",video:"src"};d.getDomAttribute=function(a){if(a&&a.nodeName){var b=a.nodeName.toLowerCase();if("input"!==b||"image"===a.type)return d.domAttributes[b]}};d.encode=z;d.decode=decodeURIComponent;d.iso8859=function(){d.encode=escape;d.decode=
unescape};d.unicode=function(){d.encode=z;d.decode=decodeURIComponent};d.characters={pathname:{encode:{expression:/%(24|26|2B|2C|3B|3D|3A|40)/ig,map:{"%24":"$","%26":"&","%2B":"+","%2C":",","%3B":";","%3D":"=","%3A":":","%40":"@"}},decode:{expression:/[\/\?#]/g,map:{"/":"%2F","?":"%3F","#":"%23"}}},reserved:{encode:{expression:/%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,map:{"%3A":":","%2F":"/","%3F":"?","%23":"#","%5B":"[","%5D":"]","%40":"@","%21":"!","%24":"$","%26":"&","%27":"'",
"%28":"(","%29":")","%2A":"*","%2B":"+","%2C":",","%3B":";","%3D":"="}}},urnpath:{encode:{expression:/%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,map:{"%21":"!","%24":"$","%27":"'","%28":"(","%29":")","%2A":"*","%2B":"+","%2C":",","%3B":";","%3D":"=","%40":"@"}},decode:{expression:/[\/\?#:]/g,map:{"/":"%2F","?":"%3F","#":"%23",":":"%3A"}}}};d.encodeQuery=function(a,b){var c=d.encode(a+"");void 0===b&&(b=d.escapeQuerySpace);return b?c.replace(/%20/g,"+"):c};d.decodeQuery=function(a,b){a+="";void 0===b&&
(b=d.escapeQuerySpace);try{return d.decode(b?a.replace(/\+/g,"%20"):a)}catch(c){return a}};var u={encode:"encode",decode:"decode"},v,D=function(a,b){return function(c){try{return d[b](c+"").replace(d.characters[a][b].expression,function(c){return d.characters[a][b].map[c]})}catch(m){return c}}};for(v in u)d[v+"PathSegment"]=D("pathname",u[v]),d[v+"UrnPathSegment"]=D("urnpath",u[v]);u=function(a,b,c){return function(m){var f=c?function(a){return d[b](d[c](a))}:d[b];m=(m+"").split(a);for(var e=0,g=
m.length;e<g;e++)m[e]=f(m[e]);return m.join(a)}};d.decodePath=u("/","decodePathSegment");d.decodeUrnPath=u(":","decodeUrnPathSegment");d.recodePath=u("/","encodePathSegment","decode");d.recodeUrnPath=u(":","encodeUrnPathSegment","decode");d.encodeReserved=D("reserved","encode");d.parse=function(a,b){b||(b={});var c=a.indexOf("#");-1<c&&(b.fragment=a.substring(c+1)||null,a=a.substring(0,c));c=a.indexOf("?");-1<c&&(b.query=a.substring(c+1)||null,a=a.substring(0,c));"//"===a.substring(0,2)?(b.protocol=
null,a=a.substring(2),a=d.parseAuthority(a,b)):(c=a.indexOf(":"),-1<c&&(b.protocol=a.substring(0,c)||null,b.protocol&&!b.protocol.match(d.protocol_expression)?b.protocol=void 0:"//"===a.substring(c+1,c+3)?(a=a.substring(c+3),a=d.parseAuthority(a,b)):(a=a.substring(c+1),b.urn=!0)));b.path=a;return b};d.parseHost=function(a,b){a=a.replace(/\\/g,"/");var c=a.indexOf("/");-1===c&&(c=a.length);if("["===a.charAt(0)){var d=a.indexOf("]");b.hostname=a.substring(1,d)||null;b.port=a.substring(d+2,c)||null;
"/"===b.port&&(b.port=null)}else{var f=a.indexOf(":");d=a.indexOf("/");f=a.indexOf(":",f+1);-1!==f&&(-1===d||f<d)?(b.hostname=a.substring(0,c)||null,b.port=null):(d=a.substring(0,c).split(":"),b.hostname=d[0]||null,b.port=d[1]||null)}b.hostname&&"/"!==a.substring(c).charAt(0)&&(c++,a="/"+a);return a.substring(c)||"/"};d.parseAuthority=function(a,b){a=d.parseUserinfo(a,b);return d.parseHost(a,b)};d.parseUserinfo=function(a,b){var c=a.indexOf("/"),m=a.lastIndexOf("@",-1<c?c:a.length-1);-1<m&&(-1===
c||m<c)?(c=a.substring(0,m).split(":"),b.username=c[0]?d.decode(c[0]):null,c.shift(),b.password=c[0]?d.decode(c.join(":")):null,a=a.substring(m+1)):(b.username=null,b.password=null);return a};d.parseQuery=function(a,b){if(!a)return{};a=a.replace(/&+/g,"&").replace(/^\?*&*|&+$/g,"");if(!a)return{};for(var c={},m=a.split("&"),f=m.length,e,g,l=0;l<f;l++)if(e=m[l].split("="),g=d.decodeQuery(e.shift(),b),e=e.length?d.decodeQuery(e.join("="),b):null,r.call(c,g)){if("string"===typeof c[g]||null===c[g])c[g]=
[c[g]];c[g].push(e)}else c[g]=e;return c};d.build=function(a){var b="";a.protocol&&(b+=a.protocol+":");a.urn||!b&&!a.hostname||(b+="//");b+=d.buildAuthority(a)||"";"string"===typeof a.path&&("/"!==a.path.charAt(0)&&"string"===typeof a.hostname&&(b+="/"),b+=a.path);"string"===typeof a.query&&a.query&&(b+="?"+a.query);"string"===typeof a.fragment&&a.fragment&&(b+="#"+a.fragment);return b};d.buildHost=function(a){var b="";if(a.hostname)b=d.ip6_expression.test(a.hostname)?b+("["+a.hostname+"]"):b+a.hostname;
else return"";a.port&&(b+=":"+a.port);return b};d.buildAuthority=function(a){return d.buildUserinfo(a)+d.buildHost(a)};d.buildUserinfo=function(a){var b="";a.username&&(b+=d.encode(a.username));a.password&&(b+=":"+d.encode(a.password));b&&(b+="@");return b};d.buildQuery=function(a,b,c){var m="",f,e;for(f in a)if(r.call(a,f)&&f)if(p(a[f])){var g={};var l=0;for(e=a[f].length;l<e;l++)void 0!==a[f][l]&&void 0===g[a[f][l]+""]&&(m+="&"+d.buildQueryParameter(f,a[f][l],c),!0!==b&&(g[a[f][l]+""]=!0))}else void 0!==
a[f]&&(m+="&"+d.buildQueryParameter(f,a[f],c));return m.substring(1)};d.buildQueryParameter=function(a,b,c){return d.encodeQuery(a,c)+(null!==b?"="+d.encodeQuery(b,c):"")};d.addQuery=function(a,b,c){if("object"===typeof b)for(var m in b)r.call(b,m)&&d.addQuery(a,m,b[m]);else if("string"===typeof b)void 0===a[b]?a[b]=c:("string"===typeof a[b]&&(a[b]=[a[b]]),p(c)||(c=[c]),a[b]=(a[b]||[]).concat(c));else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");};d.removeQuery=
function(a,b,c){var m;if(p(b))for(c=0,m=b.length;c<m;c++)a[b[c]]=void 0;else if("RegExp"===B(b))for(m in a)b.test(m)&&(a[m]=void 0);else if("object"===typeof b)for(m in b)r.call(b,m)&&d.removeQuery(a,m,b[m]);else if("string"===typeof b)void 0!==c?"RegExp"===B(c)?!p(a[b])&&c.test(a[b])?a[b]=void 0:a[b]=g(a[b],c):a[b]!==String(c)||p(c)&&1!==c.length?p(a[b])&&(a[b]=g(a[b],c)):a[b]=void 0:a[b]=void 0;else throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
};d.hasQuery=function(a,b,c,m){switch(B(b)){case "String":break;case "RegExp":for(var f in a)if(r.call(a,f)&&b.test(f)&&(void 0===c||d.hasQuery(a,f,c)))return!0;return!1;case "Object":for(var e in b)if(r.call(b,e)&&!d.hasQuery(a,e,b[e]))return!1;return!0;default:throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");}switch(B(c)){case "Undefined":return b in a;case "Boolean":return a=!(p(a[b])?!a[b].length:!a[b]),c===a;case "Function":return!!c(a[b],
b,a);case "Array":return p(a[b])?(m?l:q)(a[b],c):!1;case "RegExp":return p(a[b])?m?l(a[b],c):!1:!(!a[b]||!a[b].match(c));case "Number":c=String(c);case "String":return p(a[b])?m?l(a[b],c):!1:a[b]===c;default:throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");}};d.joinPaths=function(){for(var a=[],b=[],c=0,m=0;m<arguments.length;m++){var f=new d(arguments[m]);a.push(f);for(var f=f.segment(),e=0;e<f.length;e++)"string"===typeof f[e]&&
b.push(f[e]),f[e]&&c++}if(!b.length||!c)return new d("");b=(new d("")).segment(b);""!==a[0].path()&&"/"!==a[0].path().slice(0,1)||b.path("/"+b.path());return b.normalize()};d.commonPath=function(a,b){var c=Math.min(a.length,b.length),d;for(d=0;d<c;d++)if(a.charAt(d)!==b.charAt(d)){d--;break}if(1>d)return a.charAt(0)===b.charAt(0)&&"/"===a.charAt(0)?"/":"";if("/"!==a.charAt(d)||"/"!==b.charAt(d))d=a.substring(0,d).lastIndexOf("/");return a.substring(0,d+1)};d.withinString=function(a,b,c){c||(c={});
var e=c.start||d.findUri.start,f=c.end||d.findUri.end,g=c.trim||d.findUri.trim,l=c.parens||d.findUri.parens,x=/[a-z0-9-]=["']?$/i;for(e.lastIndex=0;;){var k=e.exec(a);if(!k)break;var t=k.index;if(c.ignoreHtml){var h=a.slice(Math.max(t-3,0),t);if(h&&x.test(h))continue}for(var n=t+a.slice(t).search(f),h=a.slice(t,n),n=-1;;){var q=l.exec(h);if(!q)break;n=Math.max(n,q.index+q[0].length)}h=-1<n?h.slice(0,n)+h.slice(n).replace(g,""):h.replace(g,"");h.length<=k[0].length||c.ignore&&c.ignore.test(h)||(n=
t+h.length,k=b(h,t,n,a),void 0===k?e.lastIndex=n:(k=String(k),a=a.slice(0,t)+k+a.slice(n),e.lastIndex=t+k.length))}e.lastIndex=0;return a};d.ensureValidHostname=function(a){if(a.match(d.invalid_hostname_characters)){if(!h)throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-] and Punycode.js is not available');if(h.toASCII(a).match(d.invalid_hostname_characters))throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-]');}};d.noConflict=function(a){if(a)return a=
{URI:this.noConflict()},w.URITemplate&&"function"===typeof w.URITemplate.noConflict&&(a.URITemplate=w.URITemplate.noConflict()),w.IPv6&&"function"===typeof w.IPv6.noConflict&&(a.IPv6=w.IPv6.noConflict()),w.SecondLevelDomains&&"function"===typeof w.SecondLevelDomains.noConflict&&(a.SecondLevelDomains=w.SecondLevelDomains.noConflict()),a;w.URI===this&&(w.URI=n);return this};e.build=function(a){if(!0===a)this._deferred_build=!0;else if(void 0===a||this._deferred_build)this._string=d.build(this._parts),
this._deferred_build=!1;return this};e.clone=function(){return new d(this)};e.valueOf=e.toString=function(){return this.build(!1)._string};e.protocol=x("protocol");e.username=x("username");e.password=x("password");e.hostname=x("hostname");e.port=x("port");e.query=C("query","?");e.fragment=C("fragment","#");e.search=function(a,b){var c=this.query(a,b);return"string"===typeof c&&c.length?"?"+c:c};e.hash=function(a,b){var c=this.fragment(a,b);return"string"===typeof c&&c.length?"#"+c:c};e.pathname=function(a,
b){if(void 0===a||!0===a){var c=this._parts.path||(this._parts.hostname?"/":"");return a?(this._parts.urn?d.decodeUrnPath:d.decodePath)(c):c}this._parts.path=this._parts.urn?a?d.recodeUrnPath(a):"":a?d.recodePath(a):"/";this.build(!b);return this};e.path=e.pathname;e.href=function(a,b){var c;if(void 0===a)return this.toString();this._string="";this._parts=d._parts();var e=a instanceof d,f="object"===typeof a&&(a.hostname||a.path||a.pathname);a.nodeName&&(f=d.getDomAttribute(a),a=a[f]||"",f=!1);!e&&
f&&void 0!==a.pathname&&(a=a.toString());if("string"===typeof a||a instanceof String)this._parts=d.parse(String(a),this._parts);else if(e||f)for(c in e=e?a._parts:a,e)r.call(this._parts,c)&&(this._parts[c]=e[c]);else throw new TypeError("invalid input");this.build(!b);return this};e.is=function(a){var b=!1,c=!1,e=!1,f=!1,g=!1,l=!1,t=!1,h=!this._parts.urn;this._parts.hostname&&(h=!1,c=d.ip4_expression.test(this._parts.hostname),e=d.ip6_expression.test(this._parts.hostname),b=c||e,g=(f=!b)&&k&&k.has(this._parts.hostname),
l=f&&d.idn_expression.test(this._parts.hostname),t=f&&d.punycode_expression.test(this._parts.hostname));switch(a.toLowerCase()){case "relative":return h;case "absolute":return!h;case "domain":case "name":return f;case "sld":return g;case "ip":return b;case "ip4":case "ipv4":case "inet4":return c;case "ip6":case "ipv6":case "inet6":return e;case "idn":return l;case "url":return!this._parts.urn;case "urn":return!!this._parts.urn;case "punycode":return t}return null};var F=e.protocol,G=e.port,H=e.hostname;
e.protocol=function(a,b){if(void 0!==a&&a&&(a=a.replace(/:(\/\/)?$/,""),!a.match(d.protocol_expression)))throw new TypeError('Protocol "'+a+"\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");return F.call(this,a,b)};e.scheme=e.protocol;e.port=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0!==a&&(0===a&&(a=null),a&&(a+="",":"===a.charAt(0)&&(a=a.substring(1)),a.match(/[^0-9]/))))throw new TypeError('Port "'+a+'" contains characters other than [0-9]');
return G.call(this,a,b)};e.hostname=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0!==a){var c={};if("/"!==d.parseHost(a,c))throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-]');a=c.hostname}return H.call(this,a,b)};e.origin=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){var c=this.protocol();return this.authority()?(c?c+"://":"")+this.authority():""}c=d(a);this.protocol(c.protocol()).authority(c.authority()).build(!b);return this};
e.host=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a)return this._parts.hostname?d.buildHost(this._parts):"";if("/"!==d.parseHost(a,this._parts))throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-]');this.build(!b);return this};e.authority=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a)return this._parts.hostname?d.buildAuthority(this._parts):"";if("/"!==d.parseAuthority(a,this._parts))throw new TypeError('Hostname "'+
a+'" contains characters other than [A-Z0-9.-]');this.build(!b);return this};e.userinfo=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){var c=d.buildUserinfo(this._parts);return c?c.substring(0,c.length-1):c}"@"!==a[a.length-1]&&(a+="@");d.parseUserinfo(a,this._parts);this.build(!b);return this};e.resource=function(a,b){if(void 0===a)return this.path()+this.search()+this.hash();var c=d.parse(a);this._parts.path=c.path;this._parts.query=c.query;this._parts.fragment=c.fragment;
this.build(!b);return this};e.subdomain=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var c=this._parts.hostname.length-this.domain().length-1;return this._parts.hostname.substring(0,c)||""}c=this._parts.hostname.length-this.domain().length;c=this._parts.hostname.substring(0,c);c=new RegExp("^"+A(c));a&&"."!==a.charAt(a.length-1)&&(a+=".");a&&d.ensureValidHostname(a);this._parts.hostname=this._parts.hostname.replace(c,a);
this.build(!b);return this};e.domain=function(a,b){if(this._parts.urn)return void 0===a?"":this;"boolean"===typeof a&&(b=a,a=void 0);if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var c=this._parts.hostname.match(/\./g);if(c&&2>c.length)return this._parts.hostname;c=this._parts.hostname.length-this.tld(b).length-1;c=this._parts.hostname.lastIndexOf(".",c-1)+1;return this._parts.hostname.substring(c)||""}if(!a)throw new TypeError("cannot set domain empty");d.ensureValidHostname(a);
!this._parts.hostname||this.is("IP")?this._parts.hostname=a:(c=new RegExp(A(this.domain())+"$"),this._parts.hostname=this._parts.hostname.replace(c,a));this.build(!b);return this};e.tld=function(a,b){if(this._parts.urn)return void 0===a?"":this;"boolean"===typeof a&&(b=a,a=void 0);if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var c=this._parts.hostname.lastIndexOf("."),c=this._parts.hostname.substring(c+1);return!0!==b&&k&&k.list[c.toLowerCase()]?k.get(this._parts.hostname)||c:c}if(a)if(a.match(/[^a-zA-Z0-9-]/))if(k&&
k.is(a))c=new RegExp(A(this.tld())+"$"),this._parts.hostname=this._parts.hostname.replace(c,a);else throw new TypeError('TLD "'+a+'" contains characters other than [A-Z0-9]');else{if(!this._parts.hostname||this.is("IP"))throw new ReferenceError("cannot set TLD on non-domain host");c=new RegExp(A(this.tld())+"$");this._parts.hostname=this._parts.hostname.replace(c,a)}else throw new TypeError("cannot set TLD empty");this.build(!b);return this};e.directory=function(a,b){if(this._parts.urn)return void 0===
a?"":this;if(void 0===a||!0===a){if(!this._parts.path&&!this._parts.hostname)return"";if("/"===this._parts.path)return"/";var c=this._parts.path.length-this.filename().length-1,c=this._parts.path.substring(0,c)||(this._parts.hostname?"/":"");return a?d.decodePath(c):c}c=this._parts.path.length-this.filename().length;c=this._parts.path.substring(0,c);c=new RegExp("^"+A(c));this.is("relative")||(a||(a="/"),"/"!==a.charAt(0)&&(a="/"+a));a&&"/"!==a.charAt(a.length-1)&&(a+="/");a=d.recodePath(a);this._parts.path=
this._parts.path.replace(c,a);this.build(!b);return this};e.filename=function(a,b){if(this._parts.urn)return void 0===a?"":this;if("string"!==typeof a){if(!this._parts.path||"/"===this._parts.path)return"";var c=this._parts.path.lastIndexOf("/"),c=this._parts.path.substring(c+1);return a?d.decodePathSegment(c):c}c=!1;"/"===a.charAt(0)&&(a=a.substring(1));a.match(/\.?\//)&&(c=!0);var e=new RegExp(A(this.filename())+"$");a=d.recodePath(a);this._parts.path=this._parts.path.replace(e,a);c?this.normalizePath(b):
this.build(!b);return this};e.suffix=function(a,b){if(this._parts.urn)return void 0===a?"":this;if(void 0===a||!0===a){if(!this._parts.path||"/"===this._parts.path)return"";var c=this.filename(),e=c.lastIndexOf(".");if(-1===e)return"";c=c.substring(e+1);c=/^[a-z0-9%]+$/i.test(c)?c:"";return a?d.decodePathSegment(c):c}"."===a.charAt(0)&&(a=a.substring(1));if(c=this.suffix())e=a?new RegExp(A(c)+"$"):new RegExp(A("."+c)+"$");else{if(!a)return this;this._parts.path+="."+d.recodePath(a)}e&&(a=d.recodePath(a),
this._parts.path=this._parts.path.replace(e,a));this.build(!b);return this};e.segment=function(a,b,c){var d=this._parts.urn?":":"/",e=this.path(),g="/"===e.substring(0,1),e=e.split(d);void 0!==a&&"number"!==typeof a&&(c=b,b=a,a=void 0);if(void 0!==a&&"number"!==typeof a)throw Error('Bad segment "'+a+'", must be 0-based integer');g&&e.shift();0>a&&(a=Math.max(e.length+a,0));if(void 0===b)return void 0===a?e:e[a];if(null===a||void 0===e[a])if(p(b)){e=[];a=0;for(var l=b.length;a<l;a++)if(b[a].length||
e.length&&e[e.length-1].length)e.length&&!e[e.length-1].length&&e.pop(),e.push(t(b[a]))}else{if(b||"string"===typeof b)b=t(b),""===e[e.length-1]?e[e.length-1]=b:e.push(b)}else b?e[a]=t(b):e.splice(a,1);g&&e.unshift("");return this.path(e.join(d),c)};e.segmentCoded=function(a,b,c){var e;"number"!==typeof a&&(c=b,b=a,a=void 0);if(void 0===b){a=this.segment(a,b,c);if(p(a)){var f=0;for(e=a.length;f<e;f++)a[f]=d.decode(a[f])}else a=void 0!==a?d.decode(a):void 0;return a}if(p(b))for(f=0,e=b.length;f<e;f++)b[f]=
d.encode(b[f]);else b="string"===typeof b||b instanceof String?d.encode(b):b;return this.segment(a,b,c)};var I=e.query;e.query=function(a,b){if(!0===a)return d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("function"===typeof a){var c=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace),e=a.call(this,c);this._parts.query=d.buildQuery(e||c,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);this.build(!b);return this}return void 0!==a&&"string"!==typeof a?(this._parts.query=
d.buildQuery(a,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),this.build(!b),this):I.call(this,a,b)};e.setQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("string"===typeof a||a instanceof String)e[a]=void 0!==b?b:null;else if("object"===typeof a)for(var f in a)r.call(a,f)&&(e[f]=a[f]);else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");this._parts.query=d.buildQuery(e,this._parts.duplicateQueryParameters,
this._parts.escapeQuerySpace);"string"!==typeof a&&(c=b);this.build(!c);return this};e.addQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);d.addQuery(e,a,void 0===b?null:b);this._parts.query=d.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==typeof a&&(c=b);this.build(!c);return this};e.removeQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);d.removeQuery(e,a,b);this._parts.query=
d.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==typeof a&&(c=b);this.build(!c);return this};e.hasQuery=function(a,b,c){var e=d.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return d.hasQuery(e,a,b,c)};e.setSearch=e.setQuery;e.addSearch=e.addQuery;e.removeSearch=e.removeQuery;e.hasSearch=e.hasQuery;e.normalize=function(){return this._parts.urn?this.normalizeProtocol(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build():this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()};
e.normalizeProtocol=function(a){"string"===typeof this._parts.protocol&&(this._parts.protocol=this._parts.protocol.toLowerCase(),this.build(!a));return this};e.normalizeHostname=function(a){this._parts.hostname&&(this.is("IDN")&&h?this._parts.hostname=h.toASCII(this._parts.hostname):this.is("IPv6")&&y&&(this._parts.hostname=y.best(this._parts.hostname)),this._parts.hostname=this._parts.hostname.toLowerCase(),this.build(!a));return this};e.normalizePort=function(a){"string"===typeof this._parts.protocol&&
this._parts.port===d.defaultPorts[this._parts.protocol]&&(this._parts.port=null,this.build(!a));return this};e.normalizePath=function(a){var b=this._parts.path;if(!b)return this;if(this._parts.urn)return this._parts.path=d.recodeUrnPath(this._parts.path),this.build(!a),this;if("/"===this._parts.path)return this;var b=d.recodePath(b),c="";if("/"!==b.charAt(0)){var e=!0;b="/"+b}if("/.."===b.slice(-3)||"/."===b.slice(-2))b+="/";b=b.replace(/(\/(\.\/)+)|(\/\.$)/g,"/").replace(/\/{2,}/g,"/");e&&(c=b.substring(1).match(/^(\.\.\/)+/)||
"")&&(c=c[0]);for(;;){var f=b.search(/\/\.\.(\/|$)/);if(-1===f)break;else if(0===f){b=b.substring(3);continue}var g=b.substring(0,f).lastIndexOf("/");-1===g&&(g=f);b=b.substring(0,g)+b.substring(f+3)}e&&this.is("relative")&&(b=c+b.substring(1));this._parts.path=b;this.build(!a);return this};e.normalizePathname=e.normalizePath;e.normalizeQuery=function(a){"string"===typeof this._parts.query&&(this._parts.query.length?this.query(d.parseQuery(this._parts.query,this._parts.escapeQuerySpace)):this._parts.query=
null,this.build(!a));return this};e.normalizeFragment=function(a){this._parts.fragment||(this._parts.fragment=null,this.build(!a));return this};e.normalizeSearch=e.normalizeQuery;e.normalizeHash=e.normalizeFragment;e.iso8859=function(){var a=d.encode,b=d.decode;d.encode=escape;d.decode=decodeURIComponent;try{this.normalize()}finally{d.encode=a,d.decode=b}return this};e.unicode=function(){var a=d.encode,b=d.decode;d.encode=z;d.decode=unescape;try{this.normalize()}finally{d.encode=a,d.decode=b}return this};
e.readable=function(){var a=this.clone();a.username("").password("").normalize();var b="";a._parts.protocol&&(b+=a._parts.protocol+"://");a._parts.hostname&&(a.is("punycode")&&h?(b+=h.toUnicode(a._parts.hostname),a._parts.port&&(b+=":"+a._parts.port)):b+=a.host());a._parts.hostname&&a._parts.path&&"/"!==a._parts.path.charAt(0)&&(b+="/");b+=a.path(!0);if(a._parts.query){for(var c="",e=0,f=a._parts.query.split("&"),g=f.length;e<g;e++){var l=(f[e]||"").split("="),c=c+("&"+d.decodeQuery(l[0],this._parts.escapeQuerySpace).replace(/&/g,
"%26"));void 0!==l[1]&&(c+="="+d.decodeQuery(l[1],this._parts.escapeQuerySpace).replace(/&/g,"%26"))}b+="?"+c.substring(1)}return b+=d.decodeQuery(a.hash(),!0)};e.absoluteTo=function(a){var b=this.clone(),c=["protocol","username","password","hostname","port"],e,f;if(this._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");a instanceof d||(a=new d(a));if(b._parts.protocol)return b;b._parts.protocol=a._parts.protocol;if(this._parts.hostname)return b;for(e=0;f=c[e];e++)b._parts[f]=
a._parts[f];b._parts.path?(".."===b._parts.path.substring(-2)&&(b._parts.path+="/"),"/"!==b.path().charAt(0)&&(c=(c=a.directory())?c:0===a.path().indexOf("/")?"/":"",b._parts.path=(c?c+"/":"")+b._parts.path,b.normalizePath())):(b._parts.path=a._parts.path,b._parts.query||(b._parts.query=a._parts.query));b.build();return b};e.relativeTo=function(a){var b=this.clone().normalize();if(b._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");a=(new d(a)).normalize();var c=
b._parts;var e=a._parts;var f=b.path();a=a.path();if("/"!==f.charAt(0))throw Error("URI is already relative");if("/"!==a.charAt(0))throw Error("Cannot calculate a URI relative to another relative URI");c.protocol===e.protocol&&(c.protocol=null);if(c.username===e.username&&c.password===e.password&&null===c.protocol&&null===c.username&&null===c.password&&c.hostname===e.hostname&&c.port===e.port)c.hostname=null,c.port=null;else return b.build();if(f===a)return c.path="",b.build();f=d.commonPath(f,a);
if(!f)return b.build();e=e.path.substring(f.length).replace(/[^\/]*$/,"").replace(/.*?\//g,"../");c.path=e+c.path.substring(f.length)||"./";return b.build()};e.equals=function(a){var b=this.clone(),c=new d(a);a={};var e;b.normalize();c.normalize();if(b.toString()===c.toString())return!0;var f=b.query();var g=c.query();b.query("");c.query("");if(b.toString()!==c.toString()||f.length!==g.length)return!1;b=d.parseQuery(f,this._parts.escapeQuerySpace);g=d.parseQuery(g,this._parts.escapeQuerySpace);for(e in b)if(r.call(b,
e)){if(!p(b[e])){if(b[e]!==g[e])return!1}else if(!q(b[e],g[e]))return!1;a[e]=!0}for(e in g)if(r.call(g,e)&&!a[e])return!1;return!0};e.duplicateQueryParameters=function(a){this._parts.duplicateQueryParameters=!!a;return this};e.escapeQuerySpace=function(a){this._parts.escapeQuerySpace=!!a;return this};return d});
(function(h,y){"object"===typeof module&&module.exports?module.exports=y(require("./URI")):"function"===typeof define&&define.amd?define(["./URI"],y):h.URITemplate=y(h.URI,h)})(this,function(h,y){function k(d){if(k._cache[d])return k._cache[d];if(!(this instanceof k))return new k(d);this.expression=d;k._cache[d]=this;return this}function w(d){this.data=d;this.cache={}}var d=y&&y.URITemplate,A=Object.prototype.hasOwnProperty,B=k.prototype,p={"":{prefix:"",separator:",",named:!1,empty_name_separator:!1,
encode:"encode"},"+":{prefix:"",separator:",",named:!1,empty_name_separator:!1,encode:"encodeReserved"},"#":{prefix:"#",separator:",",named:!1,empty_name_separator:!1,encode:"encodeReserved"},".":{prefix:".",separator:".",named:!1,empty_name_separator:!1,encode:"encode"},"/":{prefix:"/",separator:"/",named:!1,empty_name_separator:!1,encode:"encode"},";":{prefix:";",separator:";",named:!0,empty_name_separator:!1,encode:"encode"},"?":{prefix:"?",separator:"&",named:!0,empty_name_separator:!0,encode:"encode"},
"&":{prefix:"&",separator:"&",named:!0,empty_name_separator:!0,encode:"encode"}};k._cache={};k.EXPRESSION_PATTERN=/\{([^a-zA-Z0-9%_]?)([^\}]+)(\}|$)/g;k.VARIABLE_PATTERN=/^([^*:.](?:\.?[^*:.])*)((\*)|:(\d+))?$/;k.VARIABLE_NAME_PATTERN=/[^a-zA-Z0-9%_.]/;k.LITERAL_PATTERN=/[<>{}"`^| \\]/;k.expand=function(d,l,h){var g=p[d.operator],q=g.named?"Named":"Unnamed";d=d.variables;var z=[],x,C;for(C=0;x=d[C];C++){var n=l.get(x.name);if(0===n.type&&h&&h.strict)throw Error('Missing expansion value for variable "'+
x.name+'"');if(n.val.length){if(1<n.type&&x.maxlength)throw Error('Invalid expression: Prefix modifier not applicable to variable "'+x.name+'"');z.push(k["expand"+q](n,g,x.explode,x.explode&&g.separator||",",x.maxlength,x.name))}else n.type&&z.push("")}return z.length?g.prefix+z.join(g.separator):""};k.expandNamed=function(d,l,k,t,p,z){var g="",q=l.encode;l=l.empty_name_separator;var n=!d[q].length,e=2===d.type?"":h[q](z),r;var u=0;for(r=d.val.length;u<r;u++){if(p){var v=h[q](d.val[u][1].substring(0,
p));2===d.type&&(e=h[q](d.val[u][0].substring(0,p)))}else n?(v=h[q](d.val[u][1]),2===d.type?(e=h[q](d.val[u][0]),d[q].push([e,v])):d[q].push([void 0,v])):(v=d[q][u][1],2===d.type&&(e=d[q][u][0]));g&&(g+=t);k?g+=e+(l||v?"=":"")+v:(u||(g+=h[q](z)+(l||v?"=":"")),2===d.type&&(g+=e+","),g+=v)}return g};k.expandUnnamed=function(d,l,k,t,p){var g="",q=l.encode;l=l.empty_name_separator;var w=!d[q].length,n;var e=0;for(n=d.val.length;e<n;e++){if(p)var r=h[q](d.val[e][1].substring(0,p));else w?(r=h[q](d.val[e][1]),
d[q].push([2===d.type?h[q](d.val[e][0]):void 0,r])):r=d[q][e][1];g&&(g+=t);if(2===d.type){var u=p?h[q](d.val[e][0].substring(0,p)):d[q][e][0];g+=u;g=k?g+(l||r?"=":""):g+","}g+=r}return g};k.noConflict=function(){y.URITemplate===k&&(y.URITemplate=d);return k};B.expand=function(d,l){var g="";this.parts&&this.parts.length||this.parse();d instanceof w||(d=new w(d));for(var h=0,p=this.parts.length;h<p;h++)g+="string"===typeof this.parts[h]?this.parts[h]:k.expand(this.parts[h],d,l);return g};B.parse=function(){var d=
this.expression,l=k.EXPRESSION_PATTERN,h=k.VARIABLE_PATTERN,t=k.VARIABLE_NAME_PATTERN,w=k.LITERAL_PATTERN,z=[],x=0,y=function(d){if(d.match(w))throw Error('Invalid Literal "'+d+'"');return d};for(l.lastIndex=0;;){var n=l.exec(d);if(null===n){z.push(y(d.substring(x)));break}else z.push(y(d.substring(x,n.index))),x=n.index+n[0].length;if(!p[n[1]])throw Error('Unknown Operator "'+n[1]+'" in "'+n[0]+'"');if(!n[3])throw Error('Unclosed Expression "'+n[0]+'"');var e=n[2].split(",");for(var r=0,u=e.length;r<
u;r++){var v=e[r].match(h);if(null===v)throw Error('Invalid Variable "'+e[r]+'" in "'+n[0]+'"');if(v[1].match(t))throw Error('Invalid Variable Name "'+v[1]+'" in "'+n[0]+'"');e[r]={name:v[1],explode:!!v[3],maxlength:v[4]&&parseInt(v[4],10)}}if(!e.length)throw Error('Expression Missing Variable(s) "'+n[0]+'"');z.push({expression:n[0],operator:n[1],variables:e})}z.length||z.push(y(d));this.parts=z;return this};w.prototype.get=function(d){var g=this.data,h={type:0,val:[],encode:[],encodeReserved:[]};
if(void 0!==this.cache[d])return this.cache[d];this.cache[d]=h;g="[object Function]"===String(Object.prototype.toString.call(g))?g(d):"[object Function]"===String(Object.prototype.toString.call(g[d]))?g[d](d):g[d];if(void 0!==g&&null!==g)if("[object Array]"===String(Object.prototype.toString.call(g))){var k=0;for(d=g.length;k<d;k++)void 0!==g[k]&&null!==g[k]&&h.val.push([void 0,String(g[k])]);h.val.length&&(h.type=3)}else if("[object Object]"===String(Object.prototype.toString.call(g))){for(k in g)A.call(g,
k)&&void 0!==g[k]&&null!==g[k]&&h.val.push([k,String(g[k])]);h.val.length&&(h.type=2)}else h.type=1,h.val.push([void 0,String(g)]);return h};h.expand=function(d,l){var g=(new k(d)).expand(l);return new h(g)};return k});

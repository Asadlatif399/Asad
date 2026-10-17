#!/usr/bin/env node
/*
  Zoappo site build. No dependencies.
    node build.js            builds ../zoappo-site (deployable static site) and ../Zoappo_Website.html (single-file preview)
  Source of truth: src/render.js (pages), src/behaviors.js (animation, search, forms), src/site.css, data/pages.json (page content).
*/
const fs=require("fs"),path=require("path");
const ROOT=__dirname,OUT=path.join(ROOT,"..","zoappo-site"),PREVIEW=path.join(ROOT,"..","Zoappo_Website.html");
const ZR=require("./src/render.js");
const DATA=JSON.parse(fs.readFileSync(path.join(ROOT,"data","pages.json"),"utf8"));
const CSS=fs.readFileSync(path.join(ROOT,"src","site.css"),"utf8");
const BEH=fs.readFileSync(path.join(ROOT,"src","behaviors.js"),"utf8");
const SITE="https://zoappo.com";
const FONTS="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
const LIBS=["https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js","https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js","https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"];
const esc=ZR.esc;
const THEME_JS='(function(){var r=document.documentElement,t=null;try{t=localStorage.getItem("zp-theme");if(sessionStorage.getItem("zp-seen"))r.classList.add("zp-seen");if(sessionStorage.getItem("zp-wipe"))r.classList.add("wipe-in")}catch(e){}if(t!=="dark"&&t!=="light")t="light";r.setAttribute("data-theme",t)})()';

/* ---------- static multi-page site ---------- */
const S=ZR.create(DATA,{});            // default url(): clean paths like /zoho-crm/
const routes=S.routes();
function write(file,content){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content)}
function shell(route,extra){
  const m=S.meta(route),isPost=route.indexOf("post-")===0,noindex=route==="thank-you"||route==="404";
  const ld=S.jsonld(route).map(o=>'<script type="application/ld+json">'+JSON.stringify(o).replace(/</g,"\\u003c")+'</script>').join("");
  return '<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'+
  '<title>'+esc(m.title)+'</title><meta name="description" content="'+esc(m.desc)+'">'+(noindex?'<meta name="robots" content="noindex">':'<link rel="canonical" href="'+SITE+m.path+'">')+
  '<meta property="og:title" content="'+esc(m.title)+'"><meta property="og:description" content="'+esc(m.desc)+'"><meta property="og:type" content="'+(isPost?"article":"website")+'"><meta property="og:url" content="'+SITE+m.path+'"><meta property="og:site_name" content="Zoappo"><meta name="twitter:card" content="summary"><meta name="theme-color" content="#0A0A0B">'+
  '<script>'+THEME_JS+'</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="'+FONTS+'"><link rel="stylesheet" href="/assets/site.css">'+ld+'</head>'+
  '<body data-route="'+route+'"><a class="skip" href="#view" id="skip">Skip to content</a><div class="progress" id="progress" aria-hidden="true"></div>'+S.overlaysHTML()+S.topHTML(route)+
  '<main id="view" tabindex="-1">'+S.pageHTML(route)+'</main><footer class="dk" id="footer">'+S.footerHTML()+'</footer>'+
  LIBS.map(s=>'<script src="'+s+'" defer></script>').join("")+'<script src="/assets/config.js" defer></script><script src="/assets/search-index.js" defer></script><script src="/assets/site.js" defer></script></body></html>';
}
fs.rmSync(OUT,{recursive:true,force:true});
routes.forEach(r=>{const p=S.pathOf(r);write(path.join(OUT,p==="/"?"index.html":p.slice(1)+"index.html"),shell(r))});
write(path.join(OUT,"404.html"),shell("404"));
write(path.join(OUT,"assets","site.css"),CSS);
write(path.join(OUT,"assets","site.js"),BEH+"\nwindow.ZP.boot();\n");
write(path.join(OUT,"assets","search-index.js"),"window.ZP_INDEX="+JSON.stringify(S.searchIndex())+";\n");
write(path.join(OUT,"assets","config.js"),'/* Site settings. Set endpoint to the URL that receives enquiry JSON (for example a Zoho CRM web-to-lead proxy). */\nwindow.ZP_CFG={mode:"mpa",endpoint:"",homeUrl:"/"};\n');
write(path.join(OUT,"sitemap.xml"),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.filter(r=>r!=="thank-you").map(r=>'  <url><loc>'+SITE+S.pathOf(r)+'</loc></url>').join("\n")+'\n</urlset>\n');
write(path.join(OUT,"robots.txt"),"User-agent: *\nAllow: /\nSitemap: "+SITE+"/sitemap.xml\n");

/* ---------- single-file preview (hash routing) ---------- */
const P=ZR.create(DATA,{url:(r,a)=>"#"+r+(a?"~"+a:"")});
const RENDER=fs.readFileSync(path.join(ROOT,"src","render.js"),"utf8");
const GLUE=`(function(){
var S=ZR.create(DATA,{url:function(r,a){return "#"+r+(a?"~"+a:"")}});
window.ZP_INDEX=S.searchIndex();
var view=document.getElementById("view"),cur=null,started=false;
function parse(){var h=(location.hash||"#home").slice(1)||"home",p=h.split("~");return {route:p[0],anchor:p[1]||null,raw:h}}
function anchorTo(id){var el=id&&document.getElementById(id);if(el){ZP.openFaq(id);setTimeout(function(){ZP.scrollToEl(el,true)},80);return true}return false}
function show(route,anchor){
  ZP.teardown();
  view.innerHTML=S.pageHTML(route);
  document.title=S.meta(route).title;
  document.body.dataset.route=route;
  document.getElementById("menu").innerHTML=S.menuHTML(route);
  document.getElementById("mob").innerHTML=S.mobHTML(route);
  ZP.closeMobile();ZP.closeDD();
  cur=route;ZP.toTop();ZP.enhance(view);
  if(anchor)anchorTo(anchor);
}
function route(){
  var r=parse();
  if(S.isRoute(r.route)){if(r.route===cur){if(r.anchor)anchorTo(r.anchor);return}show(r.route,r.anchor);return}
  if(anchorTo(r.raw))return;
  if(!started)show("404");
}
function go(){var r=parse();if(!S.isRoute(r.route)||r.route===cur){route();return}ZP.wipe(function(){route()})}
window.addEventListener("hashchange",go);
ZP.boot();route();started=true;
})();`;
const dataJson=JSON.stringify(DATA).replace(/<\//g,"<\\/");
const preview='<title>Zoappo Automation Partner</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<meta name="description" content="Zoappo is a Zoho certified partner in Dubai. Zoho implementation, customization and integration for businesses across the UAE, GCC and MENA.">\n'+
`<script>${THEME_JS}</script>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${FONTS}">\n<style>\n${CSS}\n</style>\n`+
'<a class="skip" href="#view" id="skip">Skip to content</a>\n<div class="progress" id="progress" aria-hidden="true"></div>\n'+P.overlaysHTML()+'\n'+P.topHTML("home")+'\n<main id="view" tabindex="-1"></main>\n<footer class="dk" id="footer">'+P.footerHTML()+'</footer>\n'+
LIBS.map(s=>'<script src="'+s+'"></script>').join("\n")+'\n<script>window.ZP_CFG={mode:"preview",endpoint:"",homeUrl:"#home"};</script>\n<script>\n'+RENDER+'\n</script>\n<script>\nvar DATA='+dataJson+';\n</script>\n<script>\n'+BEH+'\n</script>\n<script>\n'+GLUE+'\n</script>\n';
fs.writeFileSync(PREVIEW,preview);
console.log("pages:",routes.length+1,"| preview:",(preview.length/1024).toFixed(0)+"KB");

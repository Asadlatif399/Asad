/* Zoappo shared renderer: builds every page as an HTML string (used in the browser preview and by the static site generator). */
(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else root.ZR=factory()})(typeof self!=="undefined"?self:this,function(){
"use strict";
var CONSULT="https://zcform.com/bzQ70";
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
/* ---------- icons ---------- */
var SV='fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
function ic(p,s){s=s||24;return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" '+SV+' aria-hidden="true">'+p+'</svg>'}
var P={
 spark:'<path d="M12 3l1.8 5.2L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.500 20a6.500 6.500 0 0 1 13 0"/><path d="M16 5a3.500 3.500 0 0 1 0 7M18 14a6.500 6.500 0 0 1 3.500 6"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.500"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
 shield:'<path d="M12 3l8 3v6c0 4.500-3.400 8-8 9-4.600-1-8-4.500-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 plug:'<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2.500"/><path d="M11 18h2"/>',
 doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h6M9 16h6"/>',
 cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900l2.100 2.100M17 17l2.100 2.100M4.900 19.100L7 17M17 7l2.100-2.100"/>',
 layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 pin:'<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.500"/>',
 check:'<path d="M5 12l5 5 9-10"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 cart:'<circle cx="9" cy="20" r="1.500"/><circle cx="18" cy="20" r="1.500"/><path d="M2 3h3l3 12h11l2-8H6"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
 pen:'<path d="M4 20l1-5L16 4l4 4L9 19z"/>'
};
var KW=[[/artificial|ai\b|zia|predict|openai/i,"spark"],[/lead|deal|sales|pipeline|opportunit|target|quota/i,"target"],[/contact|customer|client|people|team|employee|candidate|account/i,"users"],[/analytic|report|dashboard|insight|intelligence|forecast|performance|track/i,"chart"],[/secur|compliance|permission|privacy|safe|audit/i,"shield"],[/integrat|connect|api|sdk|plug|sync|extension/i,"plug"],[/global|multi|language|currency|world|territor|locale/i,"globe"],[/mobile|app\b|phone|whatsapp|sms/i,"phone"],[/quote|invoice|bill|finance|document|sign|contract|payroll|expense|estimate/i,"doc"],[/automat|workflow|process|blueprint|function|rule|flow/i,"cog"],[/template|module|custom|layout|builder|design|form|page/i,"layers"],[/fast|speed|real.?time|instant|trigger/i,"bolt"],[/email|mail|campaign|newsletter|message/i,"mail"],[/time|attendance|shift|schedule|leave/i,"clock"],[/inventory|stock|order|ecommerce|commerce|shop|product/i,"cart"]];
var CYC=["layers","bolt","target","users","chart","plug","cog","shield"];
function iconFor(t,i){t=t||"";for(var k=0;k<KW.length;k++)if(KW[k][0].test(t))return P[KW[k][1]];return P[CYC[(i||0)%CYC.length]]}

/* ---------- nav data ---------- */
var NAV=[
 {g:"Sales",l:[["CRM Plus","crm-plus"],["Zoho CRM","zoho-crm"],["Zoho Bigin","zoho-bigin"],["Sales IQ","sales-iq"]]},
 {g:"Marketing",l:[["Marketing Plus","marketing-plus"],["Landing Pages","landing-pages"],["Campaigns","campaigns"],["Social","social"]]},
 {g:"Custom Processes",l:[["Zoho Creator","zoho-creator"],["Analytics","analytics"],["Flow","flow"],["Sign","sign"]]},
 {g:"HRMS",l:[["Zoho People","zoho-people"],["Recruit","recruit"]]},
 {g:"Finance & Operations",l:[["Books","books"],["Inventory","inventory"],["Practice","practice"]]},
 {g:"Collaboration",l:[["Projects","projects"],["Mail","mail"]]}
];
var OTHER=[["Web & Mobile Development","web-mobile-development"],["OpenAI WhatsApp Integrations","openai-whatsapp-integrations"],["Biometric Devices","biometric-devices"]];
var LABEL={home:"Home","about-us":"About Us",contact:"Contact",blog:"Blog","zoho-one":"Zoho One"};
NAV.forEach(function(g){g.l.forEach(function(x){LABEL[x[1]]=x[0]})});OTHER.forEach(function(x){LABEL[x[1]]=x[0]});
var INTEREST={"zoho-one":"Zoho One","zoho-crm":"Zoho CRM","crm-plus":"Zoho CRM Plus","zoho-bigin":"Zoho Bigin","sales-iq":"Zoho SalesIQ","marketing-plus":"Zoho Marketing Plus","landing-pages":"Zoho Landing Pages",campaigns:"Zoho Campaigns",social:"Zoho Social","zoho-creator":"Zoho Creator",analytics:"Zoho Analytics",flow:"Zoho Flow",sign:"Zoho Sign","zoho-people":"Zoho People",recruit:"Zoho Recruit",books:"Zoho Books",inventory:"Zoho Inventory",practice:"Zoho Practice",projects:"Zoho Projects",mail:"Zoho Mail","web-mobile-development":"Web & Mobile Apps","openai-whatsapp-integrations":"WhatsApp & OpenAI","biometric-devices":"Biometric Integration"};
var INTERESTS=["Zoho One","Zoho CRM","Zoho CRM Plus","Zoho Bigin","Zoho SalesIQ","Zoho Marketing Plus","Zoho Landing Pages","Zoho Campaigns","Zoho Social","Zoho Creator","Zoho Analytics","Zoho Flow","Zoho Sign","Zoho People","Zoho Recruit","Zoho Books","Zoho Inventory","Zoho Practice","Zoho Projects","Zoho Mail","Web & Mobile Apps","WhatsApp & OpenAI","Biometric Integration","Not sure yet"];
var COUNTRIES=["United Arab Emirates","Saudi Arabia","Qatar","Oman","Bahrain","Kuwait","Other"];
var SIZES=["1-10 employees","11-50 employees","51-200 employees","201-500 employees","500+ employees"];


P.search='<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.500-3.500"/>';

/* ---------- site model ---------- */
var AREAS=NAV.map(function(g){var slug=g.g.toLowerCase().replace(/&/g,"").replace(/\s+/g," ").trim().replace(/ /g,"-");return {id:"sol-"+slug,slug:slug,name:g.g,items:g.l}});
var AREA_OF={};AREAS.forEach(function(a){a.items.forEach(function(x){AREA_OF[x[1]]=a})});
var AREA_ICON={sales:"target",marketing:"mail",["custom-processes"]:"cog",hrms:"users",["finance-operations"]:"doc",collaboration:"layers"};
var OTHER_ROUTES=OTHER.map(function(x){return x[1]});
LABEL.solutions="Solutions";LABEL.apps="Apps";LABEL.services="Services";LABEL["how-we-work"]="How we work";LABEL.faq="FAQ";
AREAS.forEach(function(a){LABEL[a.id]=a.name});
var PATHS={home:"/",solutions:"/solutions/",apps:"/apps/",services:"/services/","how-we-work":"/how-we-work/",faq:"/faq/",blog:"/blog/","about-us":"/about-us/",contact:"/contact/","thank-you":"/thank-you/"};
function pathOf(r){
  if(PATHS[r])return PATHS[r];
  if(r.indexOf("post-")===0)return "/blog/"+r.slice(5)+"/";
  if(r.indexOf("sol-")===0)return "/solutions/"+r.slice(4)+"/";
  return "/"+r+"/";
}
var SERVICE_IDS=["implementation","customization","integrations","custom-apps","support"];

function create(DATA,cfg){
  cfg=cfg||{};
  var rawUrl=cfg.url||function(r,a){return pathOf(r)+(a?"#"+a:"")};
  var EXTRA=["solutions","apps","services","how-we-work","faq"].concat(AREAS.map(function(a){return a.id}));
  function isRoute(id){return !!DATA[id]||EXTRA.indexOf(id)>-1}
  function u(r,a){return rawUrl(r,a)}
  function lk(h){
    if(!h)return h;
    if(h.charAt(0)==="#"){var id=h.slice(1);return isRoute(id)?u(id):h}
    return h;
  }
  function fixHtml(html){return html.replace(/href="#([a-z0-9-]+)"/g,function(m,id){return isRoute(id)?'href="'+u(id)+'"':m})}
  function snippet(t,n){
    if(!t)return "";
    if(t.length<=n)return t;
    var cut=t.slice(0,n),m=cut.lastIndexOf(". ");
    if(m>n*.45)return cut.slice(0,m+1);
    cut=cut.slice(0,cut.lastIndexOf(" ")).replace(/[,;:\s]+$/,"");
    return cut+"…";
  }
  function kw(r){
    var p=DATA[r],out=[];if(!p||!p.blocks)return "";
    p.blocks.forEach(function(b){
      if(b.k==="chips")out=out.concat(b.items);
      if((b.k==="cards"||b.k==="splitcards")&&!b.appcards)(b.items||b.cards||[]).forEach(function(c){if(c.t)out.push(c.t)});
      if(b.k==="apps")(b.items||[]).forEach(function(c){out.push(c.n)});
    });
    return out.join(" ");
  }
  function heroOf(r){var p=DATA[r];return p&&p.blocks&&p.blocks[0]}
  function lead(r){var h=heroOf(r);return (h&&h.lead)||""}
  function findBlock(r,fn){var p=DATA[r];if(!p||!p.blocks)return null;for(var i=0;i<p.blocks.length;i++)if(fn(p.blocks[i]))return p.blocks[i];return null}
  var home=DATA.home,stmt=home.blocks[1],railB=home.blocks[2],whyB=home.blocks[3],logosB=home.blocks[4],ctaB=home.blocks[5],formB=home.blocks[6];
  var stepsB=findBlock("zoho-crm",function(b){return b.k==="steps"})||{items:[]};
  var e2eB=findBlock("zoho-crm",function(b){return b.k==="split"&&b.items[0].h2==="End-to-end implementation support"});
  var customB=findBlock("zoho-crm",function(b){return b.k==="split"&&/Customize Zoho CRM/.test(b.items[0].h2||"")});
  var why=(whyB&&whyB.items[0].feats)||[];
  var steps=stepsB.items;
  var posts=(DATA.blog&&DATA.blog.posts)||[];

  /* ---- services + faq content (reused wording) ---- */
  var SERVICES=[
    {id:"implementation",t:"Implementation & consulting",ps:[stmt.items[0].ps[0]],links:[["See how we work","how-we-work"],["Zoho One","zoho-one"]]},
    {id:"customization",t:"Customization",ps:[why[1]&&why[1].p,customB&&customB.items[0].ps[0]].filter(Boolean),links:[["Zoho CRM","zoho-crm"],["Zoho Creator","zoho-creator"]]},
    {id:"integrations",t:"Integrations & AI",ps:[lead("openai-whatsapp-integrations"),lead("flow")].filter(Boolean),links:[["WhatsApp & OpenAI","openai-whatsapp-integrations"],["Zoho Flow","flow"],["Biometric devices","biometric-devices"]]},
    {id:"custom-apps",t:"Custom apps & development",ps:[lead("zoho-creator"),lead("web-mobile-development")].filter(Boolean),links:[["Zoho Creator","zoho-creator"],["Web & mobile development","web-mobile-development"]]},
    {id:"support",t:"Onboarding & support",ps:[why[3]&&why[3].p,steps[3]&&steps[3].p].filter(Boolean),links:[["Our process","how-we-work"],["Contact us","contact"]]}
  ];
  var SVC_ICON={implementation:"layers",customization:"cog",integrations:"plug",["custom-apps"]:"phone",support:"shield"};
  function sentence(t,i){var s=(t||"").split(/(?<=\.)\s+/);return s[i]||t||""}
  var addr=(findBlock("contact",function(b){return b.k==="cards"})||{items:[{},{},{}]}).items[2].t||"";
  var FAQ=[
    {q:"Which countries do you work in?",a:sentence(heroOf("home").lead,1)},
    {q:"How do I get started?",a:ctaB.p},
    {q:"How quickly will someone reply?",a:(formB.p||"").split(/(?<=\.)\s+/).slice(-1)[0]},
    {q:"What is Zoho One?",a:lead("zoho-one"),link:["Explore Zoho One","zoho-one"]},
    {q:"Should I choose Zoho One or individual Zoho apps?",a:DATA["post-zoho-one-vs-individual-zoho-apps"]?DATA["post-zoho-one-vs-individual-zoho-apps"].post.lead:"",link:["Read the guide","post-zoho-one-vs-individual-zoho-apps"]},
    {q:"What does an implementation involve?",steps:steps,link:["See how we work","how-we-work"]},
    {q:"Can Zoho connect to WhatsApp and OpenAI?",a:lead("openai-whatsapp-integrations"),link:["WhatsApp & OpenAI integrations","openai-whatsapp-integrations"]},
    {q:"Can you build custom apps?",a:lead("zoho-creator"),link:["Zoho Creator","zoho-creator"]},
    {q:"Do you work with biometric devices?",a:lead("biometric-devices"),link:["Biometric devices","biometric-devices"]},
    {q:"Where is your office?",a:addr,link:["Contact us","contact"]}
  ].filter(function(f){return f.a||f.steps});

  /* ---- shared small renderers ---- */
  function hl(s){
    var m=/\b(Zoho [A-Z][A-Za-z]+|Zoho|CRM|low-code|automation|apps?|WhatsApp|OpenAI|Biometric|analytics|Implementation|solutions?|process|FAQs?|services?)\b/.exec(s);
    if(!m)return esc(s);
    return esc(s.slice(0,m.index))+"<em>"+esc(m[0])+"</em>"+esc(s.slice(m.index+m[0].length));
  }
  function btn(b,cls){return '<a class="btn '+(cls||(b.primary?"red":"ghost"))+'" href="'+esc(lk(b.href))+'"'+(b.ext?' target="_blank" rel="noopener"':"")+'>'+esc(b.label)+(b.primary?" "+ic(P.arrow,18):"")+'</a>'}
  function trail(route){
    if(route==="home")return [];
    var t=[["Home","home"]];
    if(route.indexOf("sol-")===0)t.push(["Solutions","solutions"]);
    else if(AREA_OF[route]){t.push(["Solutions","solutions"]);t.push([AREA_OF[route].name,AREA_OF[route].id])}
    else if(OTHER_ROUTES.indexOf(route)>-1)t.push(["Services","services"]);
    else if(route.indexOf("post-")===0)t.push(["Blog","blog"]);
    return t;
  }
  function crumbs(route,title){
    return '<ol class="crumbs" aria-label="Breadcrumb">'+trail(route).map(function(x){return '<li><a href="'+esc(u(x[1]))+'">'+esc(x[0])+'</a></li>'}).join("")+'<li><span aria-current="page">'+esc(title)+'</span></li></ol>';
  }
  function wfHTML(){
    var nodes=[[150,60,"New lead","Website form or WhatsApp",P.mail],[410,150,"Zoho CRM","Lead created and scored",P.target],[170,252,"Workflow","Routed by territory",P.cog],[400,352,"WhatsApp","Instant alert to the team",P.phone],[190,456,"Zoho Books","Quote drafted and sent",P.doc]];
    var h='<div class="wf" id="wf" aria-hidden="true"><svg viewBox="0 0 560 520" preserveAspectRatio="xMidYMid meet">';
    var paths=[];
    for(var i=0;i<nodes.length-1;i++){var a=nodes[i],b=nodes[i+1],my=(a[1]+b[1])/2;paths.push("M"+a[0]+","+(a[1]+30)+" C"+a[0]+","+my+" "+b[0]+","+my+" "+b[0]+","+(b[1]-30))}
    paths.forEach(function(d,i){h+='<path class="path" d="'+d+'"/><circle class="pulse" r="4.5"><animateMotion dur="2.2s" begin="'+(i*.55).toFixed(2)+'s" repeatCount="indefinite" path="'+d+'"/></circle>'});
    h+='</svg><span class="wfbadge">Live workflow · example</span>';
    nodes.forEach(function(n,i){h+='<div class="wfn" style="left:'+(n[0]/5.6).toFixed(2)+'%;top:'+(n[1]/5.2).toFixed(2)+'%;--i:'+i+'"><span class="wi2">'+ic(n[4],20)+'</span><span><b>'+n[2]+'</b><small>'+n[3]+'</small></span><i class="st"></i></div>'});
    return h+'</div>';
  }
  function mockHTML(name,chips){
    var bars=[46,70,38,88,60,76,52,94].map(function(v,i){return '<i style="--h:'+v+'%;--k:'+i+'"></i>'}).join("");
    var cs=(chips||[]).slice(0,3);
    return '<div class="mock" aria-hidden="true"><div class="win"><div class="win-bar"><i></i><i></i><i></i><b>'+esc(name)+'</b></div><div class="win-body"><div class="side"><i></i><i></i><i></i><i></i><i></i></div><div class="main"><div class="sk m"></div><div class="sk s"></div><div class="bars">'+bars+'</div><div class="lanes"><div class="lane"><i></i><i></i><i></i></div><div class="lane"><i></i><i></i></div><div class="lane"><i></i><i></i><i></i></div></div></div></div></div>'+cs.map(function(c,i){return '<span class="fchip '+"abc"[i]+'">'+esc(c)+'</span>'}).join("")+'</div>';
  }
  function secHead(eyebrow,h2,p,center){
    return '<div class="sec-head'+(center?" center":"")+' rv">'+(eyebrow?'<span class="eyebrow">'+esc(eyebrow)+'</span>':"")+(h2?'<h2 class="sh2">'+esc(h2)+'</h2>':"")+(p?'<p class="lead">'+esc(p)+'</p>':"")+'</div>';
  }
  function more(label){return '<span class="more">'+esc(label||"Learn more")+' '+ic(P.arrow,16)+'</span>'}
  function appCard(route,i){
    var area=AREA_OF[route];
    return '<a class="card dircard rv" href="'+esc(u(route))+'"><span class="ico">'+ic(iconFor(LABEL[route],i||0))+'</span><span class="eyebrow">'+esc(area?area.name:(route==="zoho-one"?"Flagship suite":"Services"))+'</span><h3>'+esc(LABEL[route])+'</h3><p>'+esc(snippet(lead(route),130))+'</p>'+more()+'</a>';
  }

  var R={};
  R.hero=function(b,route,page){
    var isHome=route==="home";
    var chipSrc=(page&&page.blocks?(page.blocks.filter(function(x){return x.k==="chips"})[0]||{}).items:null);
    var vis=isHome?wfHTML():mockHTML(LABEL[route]||b.eyebrow||"Zoho",chipSrc);
    var tags=b.tags&&isHome?'<div class="tagrow" data-in>'+b.tags.map(function(x){return '<span>'+esc(x)+'</span>'}).join("")+'</div>':"";
    var noVis=b.novis||route==="contact"||route==="about-us"||route==="blog";
    return '<section class="hero dk"><canvas class="fx" id="fx" aria-hidden="true"></canvas><div class="wrap hero-grid" style="'+(noVis?"grid-template-columns:minmax(0,860px)":"")+'"><div class="hero-copy">'+(isHome?"":'<div data-in>'+crumbs(route,b.crumb||LABEL[route]||b.eyebrow||"")+'</div>')+(b.eyebrow?'<span class="eyebrow" data-in>'+esc(b.eyebrow)+'</span>':"")+'<h1 class="sh1">'+hl(b.h1)+'</h1>'+(b.lead?'<p class="lead" data-in>'+esc(b.lead)+'</p>':"")+((b.btns&&b.btns.length)?'<div class="row" data-in>'+b.btns.map(function(x,i){return btn(x,i===0?"red mag":"ghost")}).join("")+'</div>':"")+tags+'</div>'+(noVis?"":vis)+'</div></section>';
  };
  R.chips=function(b){
    return '<section class="band"><div class="wrap">'+secHead(b.eyebrow,b.h2,b.p,true)+'<div class="chips">'+b.items.map(function(x){return '<span class="rv">'+ic(P.check,18)+esc(x)+'</span>'}).join("")+'</div></div></section>';
  };
  R.cards=function(b,route){
    if(b.appcards)return R.rail(b);
    var n=b.items.length,cols=b.duo||n===2?"c2":(n===4?"c4":"");
    var head=(b.h2||b.eyebrow)?secHead(b.eyebrow,b.h2,b.p,true):"";
    var items=b.items.map(function(c,i){
      var top=c.n?'<span class="num">'+esc(c.n)+'</span>':(c.e?'<span class="eyebrow">'+esc(c.e)+'</span>':'<span class="ico">'+ic(iconFor(c.t,i))+'</span>');
      return '<article class="card rv'+(b.duo?" lg":"")+'">'+top+(c.t?'<h3>'+esc(c.t)+'</h3>':"")+(c.p?'<p>'+esc(c.p)+'</p>':"")+'</article>';
    }).join("");
    if(route==="contact"){
      var ico=[P.mail,P.phone,P.pin];
      items=b.items.map(function(c,i){
        var href=i===0?"mailto:"+c.t:(i===1?"tel:"+c.t.replace(/\s/g,""):"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(c.t));
        return '<a class="card rv" href="'+esc(href)+'"'+(i===2?' target="_blank" rel="noopener"':"")+'><span class="ico">'+ic(ico[i]||P.pin)+'</span><h3 style="overflow-wrap:anywhere">'+esc(c.t)+'</h3><p>'+esc(c.p||"")+'</p></a>';
      }).join("");
    }
    return '<section class="band'+(b.muted?" alt":"")+'"><div class="wrap">'+head+'<div class="grid '+cols+'">'+items+'</div></div></section>';
  };
  R.rail=function(b){
    var cards=b.items.map(function(c,i){return '<a class="rcard" href="'+esc(lk(c.href||"#home"))+'"><span class="big-ico">'+ic(iconFor(c.t,i),30)+'</span><h3>'+esc(c.t)+'</h3><p>'+esc(c.p||"")+'</p>'+more()+'</a>'}).join("");
    return '<section class="railsec" id="railsec"><div class="wrap rail-head"><div class="sec-head" style="margin-bottom:0"><span class="eyebrow">'+esc(b.eyebrow||"")+'</span><h2 class="sh2">'+esc(b.h2||"")+'</h2></div></div><div class="rail-view" id="railView"><div class="rail" id="rail">'+cards+'</div></div><div class="rail-bar" aria-hidden="true"><i id="railBar"></i></div></section>';
  };
  function visualHTML(seed){
    var icon=iconFor(seed,seed.length);
    var dots=[[18,22],[78,18],[84,70],[14,74],[50,12],[62,86]].map(function(d,i){return '<span class="dot" style="left:'+d[0]+'%;top:'+d[1]+'%;animation:float '+(5+i)+'s ease-in-out infinite"></span>'}).join("");
    return '<div class="visual rv" aria-hidden="true">'+dots+'<div class="vi">'+ic(icon,48)+'</div></div>';
  }
  R.split=function(b,route,page,idx){
    if(route==="home"&&idx===1)return statementHTML();
    var items=b.items;
    if(items.length>1){
      return '<section class="band'+(b.muted?" alt":"")+'"><div class="wrap split">'+items.map(function(it){return '<div class="stack rv">'+(it.h2?'<h2 class="sh2">'+esc(it.h2)+'</h2>':"")+it.ps.map(function(p){return '<p>'+esc(p)+'</p>'}).join("")+(it.list?'<ul class="checks">'+it.list.map(function(x){return '<li>'+ic(P.check,18)+'<span>'+esc(x)+'</span></li>'}).join("")+'</ul>':"")+'</div>'}).join("")+'</div></section>';
    }
    var it1=items[0],solo=!b.img&&!it1.h2;
    var feats=it1.feats?'<ul class="feats">'+it1.feats.map(function(f){return '<li><span class="ico">'+ic(iconFor(f.t,0),22)+'</span><div><h3>'+esc(f.t)+'</h3><p>'+esc(f.p)+'</p></div></li>'}).join("")+'</ul>':"";
    var copy='<div class="stack rv">'+(it1.e?'<span class="eyebrow">'+esc(it1.e)+'</span>':"")+(it1.h2?'<h2 class="sh2">'+esc(it1.h2)+'</h2>':"")+it1.ps.map(function(p){return '<p>'+esc(p)+'</p>'}).join("")+feats+(it1.list?'<ul class="checks">'+it1.list.map(function(x){return '<li>'+ic(P.check,18)+'<span>'+esc(x)+'</span></li>'}).join("")+'</ul>':"")+((it1.btns&&it1.btns.length)?'<div class="row">'+it1.btns.map(function(x){return btn(x,x.primary?"primary":"ghost")}).join("")+'</div>':"")+'</div>';
    var vis=b.img?visualHTML(it1.h2||""):"";
    return '<section class="band'+(b.muted?" alt":"")+'"><div class="wrap split'+(solo?" solo":"")+(b.reverse?" rev":"")+'">'+copy+vis+'</div></section>';
  };
  function statementHTML(){
    var it=stmt.items[0];
    return '<section class="band"><div class="wrap"><span class="eyebrow">We don’t believe in one-size-fits-all</span><p class="big" id="statement" style="margin-top:18px">'+esc(it.h2)+'</p>'+it.ps.map(function(p){return '<p class="stmt-sub rv">'+esc(p)+'</p>'}).join("")+'</div></section>';
  }
  R.splitcards=function(b){
    return '<section class="band alt"><div class="wrap">'+secHead("",b.h2,"",true)+'<div class="split"><div class="rv">'+visualHTML(b.h2||"")+'</div><div class="stack">'+b.cards.map(function(c,i){return '<article class="card rv"><span class="ico">'+ic(iconFor(c.t,i))+'</span><h3>'+esc(c.t)+'</h3><p>'+esc(c.p)+'</p></article>'}).join("")+'</div></div></div></section>';
  };
  R.stat=function(b){return '<section class="band" style="padding-block:clamp(40px,6vw,80px)"><div class="wrap statband rv"><b class="count">'+esc(b.n)+'</b><span>'+esc(b.l)+'</span></div></section>'};
  R.stats=function(b){return '<section class="band" style="padding-block:clamp(40px,6vw,80px)"><div class="wrap stats">'+b.items.map(function(s){return '<div class="stat rv"><b class="count">'+esc(s.n)+'</b><span>'+esc(s.l)+'</span></div>'}).join("")+'</div></section>'};
  R.steps=function(b){
    var n=b.items.length;
    var panels=b.items.map(function(s,i){return '<div class="panel"><span class="pn">Step '+(i+1)+' of '+n+'</span><h3>'+esc(s.t)+'</h3><p>'+esc(s.p)+'</p></div>'}).join("");
    var pipe=b.items.map(function(s,i){return '<div class="pn2 on"><span class="nd">'+(i+1)+'</span><span class="tt">'+esc(s.t)+'</span></div>'}).join("");
    return '<section class="story dk" id="story"><div class="wrap story-in"><div class="ghostnum" id="ghost" aria-hidden="true">01</div><div class="story-left"><div class="stack"><span class="eyebrow">'+esc(b.eyebrow||"How it works")+'</span><h2 class="sh2">'+esc(b.h2||"")+'</h2></div><div class="panels" id="panels">'+panels+'</div><div class="dots" id="dots" aria-hidden="true">'+b.items.map(function(){return "<i></i>"}).join("")+'</div></div><div class="story-right"><div class="pipe" id="pipe" aria-hidden="true"><div class="tr"><i></i></div>'+pipe+'</div></div></div></section>';
  };
  R.logos=function(b){
    var gen=/^(partner|client|brand) logo$/i;
    return '<section class="band alt" style="padding-block:clamp(48px,6vw,88px)"><div class="wrap">'+(b.h2?'<div class="sec-head center rv"><h2 class="sh2" style="font-size:clamp(1.5rem,3vw,2.2rem)">'+esc(b.h2)+'</h2></div>':"")+'<ul class="logos'+(b.large?" large":"")+' rv">'+b.items.map(function(x){var g=gen.test((x.alt||"").trim())||!x.alt;return '<li class="'+(g?"gen":"")+'"><img src="'+esc(x.src)+'" alt="'+esc(x.alt)+'" loading="lazy"><span>'+esc((x.alt||"").replace(/ client logo$/i,""))+'</span></li>'}).join("")+'</ul></div></section>';
  };
  R.apps=function(b){
    return '<section class="band'+(b.muted?" alt":"")+'" style="padding-block:clamp(28px,4vw,56px)"><div class="wrap"><div class="appgrp rv"><div><h2 class="sh2" style="font-size:clamp(1.5rem,2.6vw,2.2rem)">'+esc(b.h2)+'</h2><p>'+esc(b.p)+'</p></div><div class="pills">'+b.items.map(function(x){return '<span class="pill"><span class="dotc">'+esc((x.n||"?").slice(0,2))+'</span>'+esc(x.n)+'</span>'}).join("")+'</div></div></div></section>';
  };
  R.tech=function(b){
    return '<section class="band alt"><div class="wrap">'+secHead("",b.h2,"",true)+b.groups.map(function(g){return '<div class="techg rv"><h3>'+esc(g.t)+'</h3><div class="pills">'+g.items.map(function(x){return '<span class="pill"><span class="dotc">'+esc((x.n||"?").slice(0,2))+'</span>'+esc(x.n)+'</span>'}).join("")+'</div></div>'}).join("")+'</div></section>';
  };
  R.cta=function(b){
    return '<section class="cta-band dk band"><div class="wrap cta"><h2 class="sh2">'+esc(b.h2)+'</h2><p>'+esc(b.p)+'</p><div class="row" style="justify-content:center">'+(b.btns||[]).map(function(x){return btn(x,"red mag")}).join("")+'</div></div></section>';
  };
  R.text=function(b,route){
    if(route==="thank-you")return '<section class="band nf404"><div class="wrap stack center"><h1>'+esc(b.h2||"Thank you")+'</h1>'+b.ps.map(function(p){return '<p class="lead">'+esc(p)+'</p>'}).join("")+'<a class="btn primary" href="'+esc(u("home"))+'">Back to home</a></div></section>';
    return '<section class="band"><div class="wrap stack"><h2>'+esc(b.h2)+'</h2>'+b.ps.map(function(p){return '<p>'+esc(p)+'</p>'}).join("")+'</div></section>';
  };
  R.map=function(){return ""};
  R.form=function(b,route){
    var pre=INTEREST[route]||"";
    var contactBox='<div class="contact-list"><a class="ci" href="tel:+971555584095"><span class="ico">'+ic(P.phone)+'</span><span><b>+971 55 558 4095</b><small>Call us</small></span></a><a class="ci" href="mailto:zoho@zoappo.com"><span class="ico">'+ic(P.mail)+'</span><span><b>zoho@zoappo.com</b><small>Email us</small></span></a><a class="ci" href="https://api.whatsapp.com/send/?phone=%2B971555584095&text=Hello" target="_blank" rel="noopener"><span class="ico">'+ic(P.bolt)+'</span><span><b>Chat on WhatsApp</b><small>Fastest way to reach us</small></span></a></div>';
    return '<section class="band alt" id="contact-form"><div class="wrap formsec"><div class="stack rv"><span class="eyebrow">Contact Us</span><h2 class="sh2">'+esc(b.h2||"Talk to a certified Zoho consultant")+'</h2><p class="lead">'+esc(b.p||"")+'</p>'+contactBox+'</div>'+
    '<form class="card rv" id="leadForm" novalidate><div id="formBody" style="display:contents">'+
    '<div class="field"><label for="f-first">First name *</label><input id="f-first" autocomplete="given-name" required aria-required="true"></div>'+
    '<div class="field"><label for="f-last">Last name *</label><input id="f-last" autocomplete="family-name" required aria-required="true"></div>'+
    '<div class="field"><label for="f-email">Business email *</label><input id="f-email" type="email" autocomplete="email" required aria-required="true"></div>'+
    '<div class="field"><label for="f-phone">Mobile / WhatsApp *</label><input id="f-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+971 50 123 4567" required aria-required="true"></div>'+
    '<div class="field"><label for="f-company">Company name *</label><input id="f-company" autocomplete="organization" required aria-required="true"></div>'+
    '<div class="field"><label for="f-country">Country</label><select id="f-country">'+COUNTRIES.map(function(c){return '<option>'+c+'</option>'}).join("")+'</select></div>'+
    '<div class="field"><label for="f-interest">Interested in *</label><select id="f-interest" required aria-required="true"><option value="">Select a solution</option>'+INTERESTS.map(function(c){return '<option'+(c===pre?" selected":"")+'>'+c+'</option>'}).join("")+'</select></div>'+
    '<div class="field"><label for="f-size">Company size</label><select id="f-size"><option value="">Select employees</option>'+SIZES.map(function(c){return '<option>'+c+'</option>'}).join("")+'</select></div>'+
    '<div class="field full"><label for="f-msg">How can we help?</label><textarea id="f-msg"></textarea></div>'+
    '<div class="hp" aria-hidden="true"><label for="f-site">Leave empty</label><input id="f-site" tabindex="-1" autocomplete="off"></div>'+
    '<div class="field full"><label class="consent" for="f-consent"><input id="f-consent" type="checkbox"><span>I agree to Zoappo contacting me by phone, email or WhatsApp about my enquiry.</span></label></div>'+
    '<div class="alert" id="formAlert" role="alert" hidden></div>'+
    '<div class="field full"><button class="btn primary" type="submit" id="send">Send enquiry</button></div>'+
    '<p class="fine">We reply within 24 hours. Prefer to talk? Call +971 55 558 4095.</p></div><div class="success" id="success" role="status" hidden></div></form></div></section>';
  };
  function demoHTML(){
    return '<section class="band alt demo" id="demo"><div class="wrap split"><div class="stack rv"><span class="eyebrow">Automation in action</span><h2 class="sh2">One trigger. Every system updated.</h2><p class="lead">A new WhatsApp enquiry can create the lead in Zoho CRM, route it by territory, alert the right salesperson and queue the quote in Zoho Books. This is an illustrative workflow built from the integrations we deliver.</p><ol class="runlist" id="runlist"><li>Lead arrives from WhatsApp or your website form</li><li>Zoho CRM creates and scores the lead</li><li>A workflow routes it to the right owner</li><li>The team is alerted and a quote is drafted</li></ol></div><div class="term dk rv" id="term" role="group" aria-label="Example automation script and run log"><div class="term-bar"><i></i><i></i><i></i><b>lead-workflow.deluge</b><button class="re" id="replay" type="button">Replay</button></div><pre class="code" id="code" aria-label="Illustrative Zoho CRM workflow script"></pre><div class="log" id="log" aria-live="polite"></div></div></div></section>';
  }

  /* ---- new structure: solutions, services, apps, process, faq ---- */
  function areaCard(a){
    return '<article class="area rv"><span class="ico">'+ic(P[AREA_ICON[a.slug]||"layers"],26)+'</span><h3><a href="'+esc(u(a.id))+'">'+esc(a.name)+'</a></h3><div class="pills">'+a.items.map(function(x){return '<a class="pill" href="'+esc(u(x[1]))+'"><span class="dotc">'+esc(x[0].replace(/^Zoho /,"").slice(0,2))+'</span>'+esc(x[0])+'</a>'}).join("")+'</div><a class="more" href="'+esc(u(a.id))+'">Explore '+esc(a.name)+' '+ic(P.arrow,16)+'</a></article>';
  }
  function faqItem(f,i){
    var body=f.steps?'<ol class="faq-steps">'+f.steps.map(function(s){return '<li><b>'+esc(s.t)+'</b> '+esc(s.p)+'</li>'}).join("")+'</ol>':'<p>'+esc(f.a)+'</p>';
    return '<details class="rv" id="faq-'+(i+1)+'"><summary><span>'+esc(f.q)+'</span><i class="plus" aria-hidden="true"></i></summary><div class="ans">'+body+(f.link?'<a class="more" href="'+esc(u(f.link[1]))+'">'+esc(f.link[0])+' '+ic(P.arrow,16)+'</a>':"")+'</div></details>';
  }
  function ctaForm(route){return R.cta(ctaB,route)+R.form(formB,route)}
  function hubHero(route,eyebrow,h1,leadText,btns){return R.hero({eyebrow:eyebrow,h1:h1,lead:leadText,btns:btns||[],novis:true,crumb:LABEL[route]},route,null)}
  function solutionsHTML(){
    return hubHero("solutions","Solutions","Zoho solutions for every team",stmt.items[0].ps[0],[{label:"Book Free Consultation",href:CONSULT,ext:true,primary:true},{label:"Browse all apps",href:"#apps",primary:false}])+
    '<section class="band"><div class="wrap"><div class="areas">'+AREAS.map(areaCard).join("")+'</div></div></section>'+ctaForm("solutions");
  }
  function areaHTML(id){
    var a=AREAS.filter(function(x){return x.id===id})[0];
    var cards=a.items.map(function(x,i){return appCard(x[1],i)}).join("");
    var others=AREAS.filter(function(x){return x.id!==id}).map(function(x){return '<a class="pill" href="'+esc(u(x.id))+'">'+esc(x.name)+'</a>'}).join("");
    return hubHero(id,"Solutions",a.name+" solutions","Zoho apps for "+a.name.toLowerCase()+": "+a.items.map(function(x){return x[0]}).join(", ")+".",[{label:"Book Free Consultation",href:CONSULT,ext:true,primary:true},{label:"Talk to an expert",href:"#contact-form",primary:false}])+
    '<section class="band"><div class="wrap"><div class="grid">'+cards+'</div></div></section>'+
    '<section class="band alt" style="padding-block:clamp(36px,5vw,64px)"><div class="wrap"><div class="sec-head rv"><span class="eyebrow">More solutions</span></div><div class="pills rv">'+others+'<a class="pill" href="'+esc(u("solutions"))+'">All solutions</a></div></div></section>'+ctaForm(id);
  }
  function appsHTML(){
    var routes=["zoho-one"].concat([].concat.apply([],AREAS.map(function(a){return a.items.map(function(x){return x[1]})}))).concat(OTHER_ROUTES);
    var cards=routes.map(function(r,i){
      var area=AREA_OF[r],key=r==="zoho-one"?"suite":(area?area.slug:"other");
      return '<a class="card dircard" data-area="'+key+'" data-q="'+esc((LABEL[r]+" "+lead(r)+" "+kw(r)+" "+(area?area.name:"")).toLowerCase())+'" href="'+esc(u(r))+'"><span class="ico">'+ic(iconFor(LABEL[r],i))+'</span><span class="eyebrow">'+esc(area?area.name:(r==="zoho-one"?"Flagship suite":"Services"))+'</span><h3>'+esc(LABEL[r])+'</h3><p>'+esc(snippet(lead(r),130))+'</p>'+more()+'</a>';
    }).join("");
    var chips=[["all","All"],["suite","Zoho One"]].concat(AREAS.map(function(a){return [a.slug,a.name]})).concat([["other","Other services"]]);
    return hubHero("apps","Apps","Every Zoho app we implement","One partner for every Zoho app your business runs on.",[{label:"Book Free Consultation",href:CONSULT,ext:true,primary:true}])+
    '<section class="band"><div class="wrap"><div class="dir-tools"><label class="dir-search" for="dirSearch">'+ic(P.search,20)+'<input id="dirSearch" type="search" placeholder="Search apps, e.g. invoicing, hiring, WhatsApp" autocomplete="off"></label><div class="filters" id="dirFilters" role="toolbar" aria-label="Filter by solution area">'+chips.map(function(c,i){return '<button type="button" aria-pressed="'+(i===0)+'" data-cat="'+c[0]+'">'+esc(c[1])+'</button>'}).join("")+'</div></div><p class="dir-count" id="dirCount" role="status" aria-live="polite">'+routes.length+' apps and services</p><div class="grid" id="dirGrid">'+cards+'</div><p class="dir-empty" id="dirEmpty" hidden>No apps match that search. Try a different word, or <a href="'+esc(u("contact"))+'">ask an expert</a>.</p></div></section>'+ctaForm("apps");
  }
  function servicesHTML(){
    var rows=SERVICES.map(function(s,i){
      return '<article class="svcrow" id="'+s.id+'"><div class="stack rv"><span class="ico">'+ic(P[SVC_ICON[s.id]||"layers"],26)+'</span><h2 class="sh2">'+esc(s.t)+'</h2>'+s.ps.map(function(p){return '<p>'+esc(snippet(p,320))+'</p>'}).join("")+'<div class="pills">'+s.links.map(function(l){return '<a class="pill" href="'+esc(u(l[1]))+'">'+esc(l[0])+'</a>'}).join("")+'</div></div>'+visualHTML(s.t)+'</article>';
    }).join("");
    return hubHero("services","Services","Zoho implementation, integration and support",e2eB?e2eB.items[0].ps[0].split(/(?<=\.)\s+/)[0]:"",[{label:"Book Free Consultation",href:CONSULT,ext:true,primary:true},{label:"See how we work",href:"#how-we-work",primary:false}])+
    '<section class="band" style="padding-block:clamp(20px,4vw,48px)"><div class="wrap">'+rows+'</div></section>'+
    R.steps({eyebrow:"How we work",h2:"Our implementation process",items:steps})+ctaForm("services");
  }
  function postSections(slug){
    var p=DATA["post-"+slug];if(!p)return {intro:[],steps:[]};
    var parts=p.post.html.split(/(?=<h2 id=)/),intro=[],st=[];
    parts.forEach(function(h){
      var m=/^<h2 id="([^"]+)">([\s\S]*?)<\/h2>([\s\S]*)$/.exec(h.trim());
      if(!m){(h.match(/<p>[\s\S]*?<\/p>/g)||[]).forEach(function(x){intro.push(x.replace(/<\/?p>/g,""))});return}
      if(/^Step \d/.test(m[2].replace(/<[^>]+>/g,"")))st.push({id:m[1],t:m[2].replace(/<[^>]+>/g,"").replace(/^Step \d+:\s*/,""),html:m[3]});
    });
    return {intro:intro,steps:st};
  }
  function howHTML(){
    var ps=postSections("zoho-crm-implementation-process");
    var details=ps.steps.map(function(s,i){return '<article class="card detail rv"><span class="num">'+("0"+(i+1))+'</span><h3>'+esc(s.t)+'</h3><div class="dbody">'+fixHtml(s.html)+'</div></article>'}).join("");
    return hubHero("how-we-work","How we work","Our implementation process",(ps.intro[1]||ps.intro[0]||"").replace(/<[^>]+>/g,""),[{label:"Book Free Consultation",href:CONSULT,ext:true,primary:true},{label:"Read the full guide",href:"#post-zoho-crm-implementation-process",primary:false}])+
    R.steps({eyebrow:"The four steps",h2:"Our implementation process",items:steps})+
    '<section class="band"><div class="wrap">'+secHead("In detail","What happens at every step","",true)+'<div class="grid c2">'+details+'</div></div></section>'+
    (e2eB?R.split(e2eB,"how-we-work",null,-1):"")+ctaForm("how-we-work");
  }
  function faqHTML(){
    return hubHero("faq","FAQ","Zoho implementation questions, answered","Straight answers from the people who implement Zoho every day.",[{label:"Book Free Consultation",href:CONSULT,ext:true,primary:true},{label:"Talk to an expert",href:"#contact-form",primary:false}])+
    '<section class="band"><div class="wrap"><div class="faq">'+FAQ.map(faqItem).join("")+'</div></div></section>'+ctaForm("faq");
  }
  function homeHTML(){
    var mq=["Zoho implementation","CRM","Automation","Integrations","Custom apps","WhatsApp","OpenAI","Analytics","Web & mobile"].map(function(x){return "<span>"+x+"<b></b></span>"}).join("");
    var out=R.hero(home.blocks[0],"home",home);
    out+='<div class="marquee" aria-hidden="true"><div class="mq" id="mq">'+mq+mq+'</div></div>';
    out+=statementHTML();
    out+='<section class="band alt"><div class="wrap">'+secHead("Solutions","Find the right Zoho solution for your team","",false)+'<div class="areas">'+AREAS.map(areaCard).join("")+'</div></div></section>';
    out+=demoHTML();
    out+='<section class="band"><div class="wrap">'+secHead("Services","End-to-end implementation support","",false)+'<div class="grid svcg">'+SERVICES.map(function(s){return '<a class="card rv" href="'+esc(u("services",s.id))+'"><span class="ico">'+ic(P[SVC_ICON[s.id]||"layers"])+'</span><h3>'+esc(s.t)+'</h3><p>'+esc(snippet(s.ps[0],150))+'</p>'+more()+'</a>'}).join("")+'</div></div></section>';
    out+=R.steps({eyebrow:"How we work",h2:"Our implementation process",items:steps});
    out+=R.rail(railB);
    out+=R.split(whyB,"home",home,3);
    out+=R.logos(logosB);
    out+='<section class="band"><div class="wrap">'+secHead("FAQ","Questions we hear most","",false)+'<div class="faq">'+FAQ.slice(0,4).map(faqItem).join("")+'</div><div class="row rv" style="margin-top:26px"><a class="btn ghost" href="'+esc(u("faq"))+'">See all questions</a></div></div></section>';
    out+='<section class="band alt"><div class="wrap"><div class="sec-head rv"><span class="eyebrow">Insights</span><h2 class="sh2">Zoho guides for UAE businesses</h2></div><div class="grid">'+posts.slice(0,3).map(function(x){return postCard(x)}).join("")+'</div><div class="row rv" style="margin-top:26px"><a class="btn ghost" href="'+esc(u("blog"))+'">All articles</a></div></div></section>';
    out+=R.cta(ctaB,"home")+R.form(formB,"home");
    return out;
  }
  function relatedHTML(route){
    var area=AREA_OF[route];if(!area&&OTHER_ROUTES.indexOf(route)<0)return "";
    var sibs=(area?area.items.map(function(x){return x[1]}):OTHER_ROUTES).filter(function(r){return r!==route});
    if(!sibs.length)return "";
    return '<section class="band" style="padding-block:clamp(40px,6vw,88px)"><div class="wrap"><div class="sec-head rv"><span class="eyebrow">'+(area?"More in "+esc(area.name):"More services")+'</span></div><div class="grid">'+sibs.map(function(r,i){return appCard(r,i)}).join("")+'</div><div class="row rv" style="margin-top:22px">'+(area?'<a class="btn ghost" href="'+esc(u(area.id))+'">All '+esc(area.name)+' solutions</a>':'<a class="btn ghost" href="'+esc(u("services"))+'">All services</a>')+'<a class="btn ghost" href="'+esc(u("apps"))+'">Browse all apps</a></div></div></section>';
  }
  function postCard(p,feat){
    return '<a class="post-card'+(feat?" feat":" rv")+'" data-cat="'+esc(p.cat)+'" href="'+esc(u("post-"+p.slug))+'"><div class="pc-top"><span>'+esc(p.cat)+'</span></div><div class="pc-body"><div class="meta"><span>'+esc(p.date)+'</span><span aria-hidden="true">·</span><span>'+esc(p.read)+'</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.excerpt)+'</p>'+more("Read article")+'</div></a>';
  }
  function blogListHTML(){
    var cats=["All"].concat(posts.map(function(x){return x.cat}).filter(function(c,i,a){return a.indexOf(c)===i}));
    return '<section class="band"><div class="wrap">'+(posts[0]?postCard(posts[0],true):"")+'<div class="filters" id="filters" role="toolbar" aria-label="Filter posts by category">'+cats.map(function(c,i){return '<button type="button" aria-pressed="'+(i===0)+'" data-cat="'+esc(c)+'">'+esc(c)+'</button>'}).join("")+'</div><div class="grid" id="postGrid">'+posts.slice(1).map(function(x){return postCard(x)}).join("")+'</div></div></section>';
  }
  function postHTML(page){
    var p=page.post,others=Object.keys(DATA).filter(function(k){return DATA[k].post&&k!=="post-"+p.slug}).map(function(k){var q=DATA[k].post;return {slug:q.slug,cat:q.cat,title:q.title,excerpt:q.lead,date:q.date,read:q.read}});
    return '<section class="hero dk" style="padding-bottom:clamp(40px,6vw,72px)"><div class="wrap stack" style="position:relative;z-index:1;max-width:900px;gap:22px"><div data-in>'+crumbs("post-"+p.slug,p.cat)+'</div><span class="eyebrow" data-in>'+esc(p.cat)+'</span><h1 class="sh1" style="font-size:clamp(2rem,4.6vw,3.6rem)">'+esc(p.title)+'</h1><p class="lead" data-in>'+esc(p.lead)+'</p><div class="meta" data-in style="color:#A0A0AB"><span>By '+esc(p.by)+'</span><span aria-hidden="true">·</span><span>'+esc(p.date)+'</span><span aria-hidden="true">·</span><span>'+esc(p.read)+'</span></div></div></section>'+
    '<section class="band"><div class="wrap post-layout"><aside class="toc" aria-label="On this page"><b>On this page</b>'+p.toc.map(function(t){return '<a href="#'+esc(t.id)+'">'+esc(t.t)+'</a>'}).join("")+'</aside><article><div class="prose">'+fixHtml(p.html)+'</div><ul class="tags" aria-label="Tags">'+p.tags.map(function(t){return '<li>#'+esc(t)+'</li>'}).join("")+'</ul></article></div></section>'+
    '<section class="band alt"><div class="wrap"><div class="sec-head rv"><h2 class="sh2">Keep reading</h2></div><div class="grid c2">'+others.map(function(x){return postCard(x)}).join("")+'</div></div></section>';
  }
  function notFoundHTML(){
    return '<section class="band nf404"><div class="wrap stack center"><span class="eyebrow">404</span><h1>We couldn’t find that page</h1><p class="lead">The page you are looking for may have moved. Try the home page, browse our apps, or contact us.</p><div class="row" style="justify-content:center"><a class="btn primary" href="'+esc(u("home"))+'">Back to home</a><a class="btn ghost" href="'+esc(u("apps"))+'">Browse apps</a><a class="btn ghost" href="'+esc(u("contact"))+'">Contact us</a></div></div></section>';
  }
  function pageHTML(route){
    if(route==="home")return homeHTML();
    if(route==="solutions")return solutionsHTML();
    if(route.indexOf("sol-")===0&&isRoute(route))return areaHTML(route);
    if(route==="apps")return appsHTML();
    if(route==="services")return servicesHTML();
    if(route==="how-we-work")return howHTML();
    if(route==="faq")return faqHTML();
    var p=DATA[route];
    if(!p)return notFoundHTML();
    if(p.post)return postHTML(p);
    var out="";
    p.blocks.forEach(function(b,i){
      if(b.k==="form")out+=(route==="blog"?blogListHTML():relatedHTML(route));
      if(b.k==="hero")out+=R.hero(b,route,p);
      else if(R[b.k])out+=R[b.k](b,route,p,i);
    });
    return out;
  }

  /* ---- chrome ---- */
  function grpOf(route){
    if(route==="solutions"||route.indexOf("sol-")===0||AREA_OF[route]||route==="zoho-one")return "solutions";
    if(route==="services"||OTHER_ROUTES.indexOf(route)>-1)return "services";
    if(route==="blog"||route.indexOf("post-")===0||route==="faq")return "resources";
    if(route==="about-us"||route==="contact")return "company";
    return route;
  }
  function menuHTML(route){
    var g=grpOf(route),chev=ic('<path d="M6 9l6 6 6-6"/>',14);
    var cur=function(r){return route===r?' aria-current="page"':""};
    var dd=function(key,label,inner,cls){return '<li data-dd'+(cls?' class="'+cls+'"':"")+'><button class="nl'+(g===key?" act":"")+'" type="button" aria-expanded="false" aria-haspopup="true">'+label+' '+chev+'</button>'+inner+'</li>'};
    var m=dd("solutions","Solutions",'<div class="mega"><a class="flag" href="'+esc(u("zoho-one"))+'"><small>Flagship suite</small><b>Zoho One</b><span>50+ integrated apps that run your entire business.</span><u>Explore Zoho One →</u></a><div class="groups">'+AREAS.map(function(a){return '<div><h4><a href="'+esc(u(a.id))+'">'+esc(a.name)+'</a></h4><ul>'+a.items.map(function(x){return '<li><a href="'+esc(u(x[1]))+'">'+x[0]+'</a></li>'}).join("")+'</ul></div>'}).join("")+'</div></div>',"bigdd");
    m+=dd("services","Services",'<div class="mega small"><div><h4><a href="'+esc(u("services"))+'">All services</a></h4><ul>'+SERVICES.map(function(s){return '<li><a href="'+esc(u("services",s.id))+'">'+esc(s.t)+'</a></li>'}).join("")+'</ul><h4 style="margin-top:12px">Beyond Zoho apps</h4><ul>'+OTHER.map(function(x){return '<li><a href="'+esc(u(x[1]))+'">'+x[0]+'</a></li>'}).join("")+'</ul></div></div>');
    m+='<li><a class="nl'+(route==="apps"?" act":"")+'" href="'+esc(u("apps"))+'"'+cur("apps")+'>Apps</a></li><li><a class="nl'+(route==="how-we-work"?" act":"")+'" href="'+esc(u("how-we-work"))+'"'+cur("how-we-work")+'>How we work</a></li>';
    m+=dd("resources","Resources",'<div class="mega small"><div><ul><li><a href="'+esc(u("blog"))+'">Blog</a></li><li><a href="'+esc(u("faq"))+'">FAQ</a></li></ul></div></div>');
    m+=dd("company","Company",'<div class="mega small"><div><ul><li><a href="'+esc(u("about-us"))+'">About Us</a></li><li><a href="'+esc(u("contact"))+'">Contact</a></li></ul></div></div>');
    return m;
  }
  function mobHTML(route){
    var det=function(label,items){return '<li><details><summary>'+label+'</summary><ul>'+items+'</ul></details></li>'};
    var a=function(label,r,anchor){return '<li><a href="'+esc(u(r,anchor))+'">'+label+'</a></li>'};
    return '<ul><li><a href="'+esc(u("home"))+'">Home</a></li>'+det("Solutions",'<li><a href="'+esc(u("solutions"))+'">All solutions</a></li>'+a("Zoho One","zoho-one")+AREAS.map(function(ar){return '<li class="grp">'+esc(ar.name)+'</li>'+ar.items.map(function(x){return a(x[0],x[1])}).join("")}).join(""))+det("Services",'<li><a href="'+esc(u("services"))+'">All services</a></li>'+SERVICES.map(function(s){return a(esc(s.t),"services",s.id)}).join("")+OTHER.map(function(x){return a(x[0],x[1])}).join(""))+'<li><a href="'+esc(u("apps"))+'">Apps</a></li><li><a href="'+esc(u("how-we-work"))+'">How we work</a></li>'+det("Resources",a("Blog","blog")+a("FAQ","faq"))+det("Company",a("About Us","about-us")+a("Contact","contact"))+'</ul><a class="btn primary" href="'+CONSULT+'" target="_blank" rel="noopener">Book Free Consultation</a>';
  }
  function topHTML(route){
    return '<div class="topbar dk"><div class="wrap topbar-in"><span>Certified Zoho Partner · UAE &amp; MENA</span><span class="sp"><a href="tel:+971555584095">+971 55 558 4095</a><a href="mailto:zoho@zoappo.com">zoho@zoappo.com</a></span></div></div>'+
    '<header class="site" id="siteHeader"><div class="wrap nav"><a href="'+esc(u("home"))+'" class="logo" aria-label="Zoappo, home"><i class="lk"></i><i class="lr"></i></a><ul class="menu" id="menu" aria-label="Main">'+menuHTML(route)+'</ul><div class="tools"><button class="srch-btn" id="srchBtn" type="button" aria-label="Search the site" aria-haspopup="dialog">'+ic(P.search,18)+'<span>Search</span><kbd>/</kbd></button><a class="btn primary cta-nav mag" href="'+CONSULT+'" target="_blank" rel="noopener">Free Consultation</a><button class="theme-btn" id="themeBtn" type="button" aria-label="Switch to dark theme" aria-pressed="false"><svg class="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg><svg class="sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button><button class="menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mob"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div><nav class="mob" id="mob" aria-label="Mobile" hidden>'+mobHTML(route)+'</nav></div></header>';
  }
  function footerHTML(){
    var li=function(label,r,anchor){return '<li><a href="'+esc(u(r,anchor))+'">'+esc(label)+'</a></li>'};
    var all=[["Zoho One","zoho-one"]].concat([].concat.apply([],NAV.map(function(g){return g.l})));
    return '<div class="wrap"><div class="foot"><div><a class="logo" href="'+esc(u("home"))+'" style="--lw:150px" aria-label="Zoappo, home"><i class="lk"></i><i class="lr"></i></a><p style="max-width:34ch"><b style="color:#fff">Your trusted Zoho Partner!</b><br>Zoho implementation, customization and integration for businesses across the UAE, GCC and MENA.</p><div class="social"><a href="https://www.linkedin.com/company/zoappo-technologies-llc/" target="_blank" rel="noopener" aria-label="Zoappo on LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.980 3.500a2.500 2.500 0 1 1-.01 5 2.500 2.500 0 0 1 .01-5zM3 9.500h4V21H3zM9.500 9.500h3.800v1.600h.1c.5-1 1.800-2 3.800-2 4 0 4.800 2.600 4.800 6.100V21h-4v-5.100c0-1.200 0-2.800-1.700-2.800s-2 1.300-2 2.700V21h-4z"/></svg></a><a href="https://www.facebook.com/people/Zoappo-Technologies/100083162770977/" target="_blank" rel="noopener" aria-label="Zoappo on Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8V6.500c0-.7.200-1 1.200-1H17V2h-2.600C11.300 2 10 3.800 10 6.200V8H8v3.500h2V22h4V11.500h2.700L17 8z"/></svg></a><a href="https://api.whatsapp.com/send/?phone=%2B971555584095&text=Hello" target="_blank" rel="noopener" aria-label="Chat with Zoappo on WhatsApp">'+ic(P.phone,18)+'</a></div></div>'+
    '<nav aria-label="Solutions"><h4>Solutions</h4><ul>'+li("All solutions","solutions")+AREAS.map(function(a){return li(a.name,a.id)}).join("")+'</ul></nav>'+
    '<nav aria-label="Services"><h4>Services</h4><ul>'+li("All services","services")+SERVICES.map(function(s){return li(s.t,"services",s.id)}).join("")+'</ul></nav>'+
    '<nav aria-label="Company"><h4>Company</h4><ul>'+li("About Us","about-us")+li("How we work","how-we-work")+li("Apps","apps")+li("FAQ","faq")+li("Blog","blog")+li("Contact","contact")+'</ul><h4 style="margin-top:18px">Contact Us</h4><address><span>Office 102-12, 1st Floor RAG Business Centre, Al Twar-5, Dubai, UAE</span><a href="tel:+971555584095">+971 55 558 4095</a><a href="mailto:zoho@zoappo.com">zoho@zoappo.com</a></address></nav></div>'+
    '<div class="allapps"><h4>All Zoho apps we implement</h4><ul>'+all.map(function(x){return li(x[0],x[1])}).join("")+'</ul></div><div class="mega-word" aria-hidden="true"><div id="mega">Zoappo</div></div><div class="legal"><span>© '+new Date().getFullYear()+' Zoappo Technologies LLC. All rights reserved.</span><span>Dubai, United Arab Emirates</span></div></div>';
  }
  function overlaysHTML(){
    return '<div class="preload" id="preload" aria-hidden="true"><i class="ph t"></i><i class="ph b"></i><div class="pc dk"><span class="logo" id="plLogo" style="--lw:min(260px,70vw)" role="img" aria-label="Zoappo"><i class="lk"></i><i class="lr"></i></span><div class="pl-bar"><i id="plBar"></i></div><div class="pl-word">Certified Zoho Partner</div></div></div>'+
    '<div class="wipe" id="wipe" aria-hidden="true"></div>'+
    '<div class="srch" id="search" hidden role="dialog" aria-modal="true" aria-label="Search the site"><div class="srch-bg" data-close></div><div class="srch-box"><div class="srch-in">'+ic(P.search,20)+'<input id="srchInput" type="search" placeholder="Search apps, services, guides…" autocomplete="off" aria-controls="srchList" aria-label="Search"><kbd>Esc</kbd></div><ul id="srchList" role="listbox" aria-label="Results"></ul><div class="srch-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>Enter</kbd> to open</span></div></div></div>'+
    '<a class="fab" href="https://api.whatsapp.com/send/?phone=%2B971555584095&text=Hello" target="_blank" rel="noopener" aria-label="Chat with Zoappo on WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.500A11.800 11.800 0 0 0 12 0C5.400 0 .1 5.300.1 11.900c0 2.100.6 4.100 1.600 5.900L0 24l6.400-1.700a11.900 11.900 0 0 0 5.600 1.400c6.600 0 11.900-5.300 11.900-11.900 0-3.200-1.200-6.200-3.400-8.300zM12 21.700c-1.800 0-3.500-.5-5-1.400l-.4-.2-3.800 1 1-3.700-.2-.4a9.800 9.800 0 0 1-1.500-5.200C2.100 6.400 6.500 2 12 2c2.600 0 5.100 1 6.900 2.900a9.700 9.700 0 0 1 2.900 6.900c0 5.400-4.400 9.900-9.800 9.900zm5.400-7.400c-.3-.1-1.700-.9-2-1s-.5-.1-.7.100-.8 1-.9 1.200-.3.200-.6.100a8 8 0 0 1-4-3.500c-.3-.5.300-.5.900-1.600.1-.2 0-.4 0-.5l-.9-2.200c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.400 1 2.800 1.200 3c.1.200 2 3.100 4.900 4.300 1.800.8 2.500.9 3.400.7.6-.1 1.700-.7 2-1.400.2-.7.2-1.300.2-1.400-.1-.1-.3-.2-.6-.4z"/></svg></a><div class="toast" id="toast" role="status" hidden></div>';
  }

  /* ---- meta + search ---- */
  function routes(){return Object.keys(DATA).filter(function(k){return DATA[k]}).concat(EXTRA)}
  function metaOf(route){
    var title,desc;
    var p=DATA[route];
    var NEW={
      solutions:["Zoho Solutions by Business Need | Zoappo",stmt.items[0].ps[0]],
      apps:["All Zoho Apps We Implement | Zoappo","One partner for every Zoho app your business runs on."],
      services:["Zoho Implementation, Integration & Support Services | Zoappo",e2eB?e2eB.items[0].ps[0]:""],
      "how-we-work":["Our Zoho Implementation Process | Zoappo","Consult, Build, Deploy and Assist: how Zoappo runs Zoho implementations across the UAE and MENA."],
      faq:["Zoho Implementation FAQs | Zoappo","Answers about Zoho One, CRM implementation, integrations and support from the Zoappo team."]
    };
    if(NEW[route]){title=NEW[route][0];desc=NEW[route][1]}
    else if(route.indexOf("sol-")===0&&isRoute(route)){var a=AREAS.filter(function(x){return x.id===route})[0];title="Zoho "+a.name+" Solutions in Dubai, UAE | Zoappo";desc="Zoho apps for "+a.name.toLowerCase()+": "+a.items.map(function(x){return x[0]}).join(", ")+"."}
    else if(p&&p.post){title=p.title;desc=p.post.lead}
    else if(p){title=p.title;desc=lead(route)||""}
    else{title="Page not found | Zoappo";desc="We couldn’t find that page."}
    return {title:title,desc:snippet(desc,158),path:pathOf(route)};
  }
  function jsonld(route){
    var out=[];
    var org={"@context":"https://schema.org","@type":"Organization",name:"Zoappo Technologies LLC",url:"https://zoappo.com",telephone:"+971555584095",email:"zoho@zoappo.com",address:{"@type":"PostalAddress",streetAddress:"Office 102-12, 1st Floor RAG Business Centre, Al Twar-5",addressLocality:"Dubai",addressCountry:"AE"},sameAs:["https://www.linkedin.com/company/zoappo-technologies-llc/","https://www.facebook.com/people/Zoappo-Technologies/100083162770977/"]};
    out.push(org);
    var t=trail(route);
    if(t.length){
      var items=t.concat([[LABEL[route]||"","__cur"]]).map(function(x,i){return {"@type":"ListItem",position:i+1,name:x[0],item:"https://zoappo.com"+(x[1]==="__cur"?pathOf(route):pathOf(x[1]))}});
      out.push({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items});
    }
    if(route==="faq")out.push({"@context":"https://schema.org","@type":"FAQPage",mainEntity:FAQ.map(function(f){return {"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a||f.steps.map(function(s){return s.t+": "+s.p}).join(" ")}}})});
    if(DATA[route]&&DATA[route].post){var q=DATA[route].post;out.push({"@context":"https://schema.org","@type":"Article",headline:q.title,description:q.lead,author:{"@type":"Organization",name:q.by||"Zoappo Team"},publisher:{"@type":"Organization",name:"Zoappo Technologies LLC"},mainEntityOfPage:"https://zoappo.com"+pathOf(route)});}
    return out;
  }
  function searchIndex(){
    var idx=[];
    var add=function(t,k,url,d,q){idx.push({t:t,k:k,u:url,d:snippet(d||"",110),q:(q||"").toLowerCase()})};
    add("Solutions","Page",u("solutions"),"Zoho solutions for every team");
    add("Apps directory","Page",u("apps"),"Search every Zoho app we implement");
    add("Services","Page",u("services"),"Implementation, customization, integrations and support");
    add("How we work","Page",u("how-we-work"),"Consult, Build, Deploy, Assist");
    add("FAQ","Page",u("faq"),"Questions we hear most");
    add("Blog","Page",u("blog"),"Zoho guides for UAE businesses");
    add("About Us","Page",u("about-us"),lead("about-us"));
    add("Contact","Page",u("contact"),"Talk to a certified Zoho consultant");
    AREAS.forEach(function(a){add(a.name+" solutions","Solution",u(a.id),a.items.map(function(x){return x[0]}).join(", "))});
    add("Zoho One","App",u("zoho-one"),lead("zoho-one"),kw("zoho-one"));
    AREAS.forEach(function(a){a.items.forEach(function(x){add(x[0],"App",u(x[1]),lead(x[1]),kw(x[1]))})});
    OTHER.forEach(function(x){add(x[0],"Service",u(x[1]),lead(x[1]),kw(x[1]))});
    SERVICES.forEach(function(s){add(s.t,"Service",u("services",s.id),s.ps[0])});
    FAQ.forEach(function(f,i){add(f.q,"FAQ",u("faq","faq-"+(i+1)),f.a||"")});
    posts.forEach(function(p){add(p.title,"Guide",u("post-"+p.slug),p.excerpt)});
    return idx;
  }

  return {pageHTML:pageHTML,topHTML:topHTML,footerHTML:footerHTML,overlaysHTML:overlaysHTML,menuHTML:menuHTML,mobHTML:mobHTML,meta:metaOf,jsonld:jsonld,searchIndex:searchIndex,routes:routes,pathOf:pathOf,isRoute:isRoute,label:function(r){return LABEL[r]||""},faq:FAQ};
}
return {create:create,pathOf:pathOf,CONSULT:CONSULT,esc:esc};
});

/* Zoappo behaviours: animation, navigation chrome, search, forms. Shared by the single-file preview and the multi-page site. */
(function(){
"use strict";
var CFG=window.ZP_CFG||{mode:"mpa",endpoint:"",homeUrl:"/"};
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var esc=function(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var calm=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);
var fine=!!(window.matchMedia&&matchMedia("(hover:hover) and (pointer:fine)").matches);
var G=window.gsap,ST=window.ScrollTrigger,motion=!!(G&&ST)&&!calm,lenis=null,ctx=null,preloading=false,wiping=false;
var html=document.documentElement;
var ARROW='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ---------- helpers ---------- */
function toTop(){window.scrollTo(0,0);if(lenis)lenis.scrollTo(0,{immediate:true,force:true})}
function scrollToEl(el,instant){
  if(lenis)lenis.scrollTo(el,{offset:-96,immediate:!!instant,force:true});
  else el.scrollIntoView({behavior:(calm||instant)?"auto":"smooth"});
}
function splitWords(el){
  if(el.dataset.split)return;el.dataset.split="1";
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(t){
          if(!t)return;
          if(/^\s+$/.test(t)){frag.appendChild(document.createTextNode(" "));return}
          var m=document.createElement("span"),i=document.createElement("span");
          m.className="wm";i.className="wi";i.textContent=t;m.appendChild(i);frag.appendChild(m);
        });
        node.replaceChild(frag,n);
      }else if(n.nodeType===1)walk(n);
    });
  })(el);
}
function initFx(root){
  var cv=$("#fx",root);if(!cv)return;
  var c=cv.getContext("2d"),W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1),pts=[],mx=-999,my=-999,live=true,looping=false;
  function size(){var r=cv.parentNode.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0)}
  size();
  var n=Math.round(Math.min(70,Math.max(24,W/18)));
  for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.4,vx:(Math.random()-.5)*.16,vy:-Math.random()*.28-.05,a:Math.random()*.5+.15});
  cv.parentNode.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
  function frame(){
    if(!live||!cv.isConnected){looping=false;return}
    c.clearRect(0,0,W,H);
    pts.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;
      if(p.y<-6){p.y=H+6;p.x=Math.random()*W}
      if(p.x<-6)p.x=W+6;if(p.x>W+6)p.x=-6;
      var dx=p.x-mx,dy=p.y-my,d=dx*dx+dy*dy;
      if(d<16000){var f=(1-d/16000)*1.4;p.x+=dx*.02*f;p.y+=dy*.02*f}
      c.beginPath();c.arc(p.x,p.y,p.r,0,6.2832);c.fillStyle="rgba(253,50,50,"+p.a+")";c.shadowColor="rgba(253,50,50,.8)";c.shadowBlur=8;c.fill();
    });
    requestAnimationFrame(frame);
  }
  ST.create({trigger:cv.parentNode,start:"top bottom",end:"bottom top",onToggle:function(s){live=s.isActive;if(live&&!looping){looping=true;frame()}}});
  looping=true;frame();
}

/* ---------- automation demo ---------- */
var DEMO_CODE='// Illustrative Zoho CRM workflow (Deluge-style)\nlead = zoho.crm.getRecordById("Leads", leadId);\nowner = routeByTerritory(lead.get("Territory"));\nzoho.crm.updateRecord("Leads", leadId, {"Owner": owner});\nsendWhatsApp(owner.phone, "New lead: " + lead.get("Company"));\ncreateQuote(lead);';
var DEMO_LOG=[["lead.created","WhatsApp",0],["crm.lead.scored","Zoho CRM",0],["owner.assigned","territory match",1],["whatsapp.alert.sent","sales team",2],["books.quote.drafted","Zoho Books",3]];
function hiCode(t){
  return esc(t).replace(/(\/\/[^\n]*)/g,'<span class="c">$1</span>').replace(/(&quot;[^&]*?&quot;)/g,'<span class="s">$1</span>').replace(/\b(zoho\.crm\.\w+|routeByTerritory|sendWhatsApp|createQuote)\b/g,'<span class="f">$1</span>');
}
function runlistSet(i){$$("#runlist li").forEach(function(li,k){li.classList.toggle("on",k<=i)})}
function demoStatic(){
  var c=$("#code");if(!c)return;
  c.innerHTML=hiCode(DEMO_CODE);
  $("#log").innerHTML=DEMO_LOG.map(function(l){return '<span>'+l[0]+'<em>'+l[1]+'</em></span>'}).join("");
  runlistSet(3);
}
var demoTimers=[];
function demoRun(){
  var c=$("#code"),lg=$("#log");if(!c)return;
  demoTimers.forEach(clearTimeout);demoTimers=[];
  c.textContent="";lg.innerHTML="";runlistSet(-1);
  var i=0,cursor='<span class="cur2"></span>';
  (function type(){
    if(!$("#code"))return;
    i+=2;c.innerHTML=esc(DEMO_CODE.slice(0,i))+cursor;
    if(i<DEMO_CODE.length){demoTimers.push(setTimeout(type,16));return}
    c.innerHTML=hiCode(DEMO_CODE);
    DEMO_LOG.forEach(function(l,k){demoTimers.push(setTimeout(function(){
      if(!$("#log"))return;
      var sp=document.createElement("span");sp.innerHTML=l[0]+"<em>"+l[1]+"</em>";lg.appendChild(sp);
      if(motion)G.from(sp,{x:-12,opacity:0,duration:.4});
      runlistSet(l[2]);
    },380*(k+1)))});
  })();
}

/* ---------- per-view animation ---------- */
function animate(root){
  if(!motion)return;
  var delayA=preloading?2.0:(html.classList.contains("wipe-in")?.5:.1),delayB=delayA+.1;
  ctx=G.context(function(){
    var h1=$(".sh1",root);
    if(h1){splitWords(h1);var w=h1.querySelectorAll(".wi");G.set(w,{yPercent:112});G.to(w,{yPercent:0,duration:1.1,stagger:.06,ease:"power4.out",delay:delayA})}
    G.from($$("[data-in]",root),{y:26,opacity:0,duration:.9,stagger:.1,ease:"power3.out",clearProps:"transform,opacity",delay:delayB});
    var vis=$(".wf,.mock",root);
    if(vis)G.from(vis,{scale:.88,opacity:0,duration:1.4,ease:"expo.out",clearProps:"transform,opacity",delay:delayB});
    var hero=$(".hero",root);
    if(hero){
      G.to($(".hero-copy",hero)||hero,{y:-60,opacity:.15,ease:"none",scrollTrigger:{trigger:hero,start:"30% top",end:"bottom top",scrub:true}});
      if(vis)G.to(vis,{y:-50,scale:1.1,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
      var orb=$("#wf",root);
      if(orb&&fine)hero.addEventListener("pointermove",function(e){var r=hero.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;G.to(orb,{rotateY:nx*16,rotateX:-ny*16,transformPerspective:1100,duration:.9,ease:"power3.out"})},{passive:true});
      try{initFx(root)}catch(e){}
    }
    var mq=$("#mq",root);
    if(mq){
      var tw=G.to(mq,{xPercent:-50,ease:"none",duration:50,repeat:-1});
      ST.create({onUpdate:function(s){tw.timeScale(1+Math.min(6,Math.abs(s.getVelocity())/500));G.to(tw,{timeScale:1,duration:1.2,ease:"power2.out",overwrite:true})}});
    }
    var st=$("#statement",root);
    if(st){
      var words=st.textContent.trim().split(/\s+/);
      st.innerHTML=words.map(function(x){return '<span class="w">'+esc(x)+"</span>"}).join(" ");
      G.fromTo(st.querySelectorAll(".w"),{opacity:.15},{opacity:1,stagger:.12,ease:"none",scrollTrigger:{trigger:st,start:"top 82%",end:"bottom 48%",scrub:true}});
    }
    try{$$(".sh2",root).forEach(function(h){splitWords(h);var w=h.querySelectorAll(".wi");G.set(w,{yPercent:112});ST.create({trigger:h,start:"top 88%",once:true,onEnter:function(){G.to(w,{yPercent:0,duration:1,stagger:.05,ease:"power4.out"})}})})}catch(e){}
    if($("#term",root))ST.create({trigger:"#term",start:"top 78%",once:true,onEnter:demoRun});
    $$(".count",root).forEach(function(el){
      var m=/^([^\d]*)([\d][\d,.]*)(.*)$/.exec(el.textContent.trim());if(!m)return;
      var target=parseFloat(m[2].replace(/,/g,"")),dec=(m[2].split(".")[1]||"").length,o={v:0};
      el.textContent=m[1]+"0"+m[3];
      ST.create({trigger:el,start:"top 90%",once:true,onEnter:function(){G.to(o,{v:target,duration:1.8,ease:"power3.out",onUpdate:function(){el.textContent=m[1]+(dec?o.v.toFixed(dec):Math.round(o.v).toLocaleString("en-US"))+m[3]}})}});
    });
    var rv=$$(".rv",root).filter(function(e){return !e.classList.contains("sh2")&&!e.closest("details")});
    G.set(rv,{opacity:0,y:36});
    ST.batch(rv,{start:"top 90%",once:true,onEnter:function(b){G.to(b,{opacity:1,y:0,duration:.95,stagger:.09,ease:"power3.out",clearProps:"transform,opacity"})}});
    var mm=G.matchMedia();
    mm.add("(min-width:901px)",function(){
      var story=$("#story",root);
      if(story){
        var panels=$$(".panel",story),dots=$$("#dots i",story),nodes=$$(".pn2",story),fill=$(".tr i",story),n=panels.length,cur=-1;
        story.classList.add("pin");
        var show=function(i){
          cur=i;
          panels.forEach(function(p,k){G.to(p,{opacity:k===i?1:0,y:k===i?0:(k<i?-30:30),duration:.55,ease:"power3.out",overwrite:true})});
          dots.forEach(function(d,k){d.classList.toggle("on",k===i)});
          nodes.forEach(function(nd,k){nd.classList.toggle("on",k<=i)});
          var gh=$("#ghost",story);if(gh){gh.textContent="0"+(i+1);G.fromTo(gh,{yPercent:10,opacity:.3},{yPercent:0,opacity:1,duration:.8,ease:"power3.out",overwrite:true})}
        };
        G.set(panels,{opacity:0});G.set(fill,{scaleY:0});show(0);
        ST.create({trigger:story,start:"top top",end:function(){return "+="+window.innerHeight*(n-0.5)},pin:true,scrub:true,onUpdate:function(s){var i=Math.min(n-1,Math.floor(s.progress*n));if(i!==cur)show(i);G.set(fill,{scaleY:s.progress})}});
      }
      var sec=$("#railsec",root);
      if(sec){
        var track=$("#rail",sec),bar=$("#railBar",sec);
        sec.classList.add("pin");
        var dist=function(){return Math.max(0,track.scrollWidth-window.innerWidth+40)};
        G.to(track,{x:function(){return -dist()},ease:"none",scrollTrigger:{trigger:sec,start:"top top",end:function(){return "+="+dist()},pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:function(s){bar.style.transform="scaleX("+s.progress+")"}}});
      }
    });
    mm.add("(max-width:900px)",function(){
      var t=$$("#panels,#rail",root)[0];
      if(t)G.from($$(".panel,.rcard",root),{y:40,opacity:0,duration:.9,stagger:.1,ease:"power3.out",clearProps:"transform,opacity",scrollTrigger:{trigger:t,start:"top 88%",once:true}});
    });
  },root);
  setTimeout(function(){if(motion)ST.refresh()},300);
}
function teardown(){if(ctx){try{ctx.revert()}catch(e){}ctx=null}demoTimers.forEach(clearTimeout);demoTimers=[]}

/* ---------- per-view bindings ---------- */
function setErr(id,msg){
  var el=document.getElementById(id),old=document.getElementById(id+"-err");
  if(old)old.remove();
  el.removeAttribute("aria-invalid");el.removeAttribute("aria-describedby");
  if(!msg)return false;
  var s=document.createElement("span");s.className="err";s.id=id+"-err";s.textContent=msg;
  el.closest(".field").appendChild(s);
  el.setAttribute("aria-invalid","true");el.setAttribute("aria-describedby",s.id);return true;
}
function bindForm(form){
  if(form.dataset.bound)return;form.dataset.bound="1";
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var send=$("#send");if(send.disabled)return;
    var v=function(id){return document.getElementById(id).value.trim()},bad=[];
    var chk=function(id,msg){if(setErr(id,msg))bad.push(id)};
    chk("f-first",v("f-first")?"":"Enter your first name.");
    chk("f-last",v("f-last")?"":"Enter your last name.");
    chk("f-email",/^\S+@\S+\.\S+$/.test(v("f-email"))?"":"Enter an email address like name@company.com.");
    var d=v("f-phone").replace(/\D/g,"");
    chk("f-phone",!d?"Enter your mobile or WhatsApp number.":(d.length<7||d.length>15)?"Check the number, include the country code.":"");
    chk("f-company",v("f-company")?"":"Enter your company name.");
    chk("f-interest",v("f-interest")?"":"Choose the solution you are interested in.");
    chk("f-consent",$("#f-consent").checked?"":"Tick the box so we can contact you.");
    var al=$("#formAlert");al.hidden=true;
    var old=$("#previewNote");if(old)old.remove();
    if(bad.length){document.getElementById(bad[0]).focus();return}
    var payload={first:v("f-first"),last:v("f-last"),email:v("f-email"),phone:v("f-phone"),company:v("f-company"),country:v("f-country"),interest:v("f-interest"),size:v("f-size"),message:v("f-msg"),page:document.body.dataset.route||""};
    if(v("f-site")){done();return}
    if(!CFG.endpoint){
      var n=document.createElement("p");n.className="note";n.id="previewNote";n.setAttribute("role","status");
      n.textContent="Preview only: nothing was sent. Set the enquiry endpoint in the site settings and this form posts to Zoho CRM.";
      $("#formBody").insertBefore(n,$("#send").closest(".field"));
      return;
    }
    send.disabled=true;send.textContent="Sending…";
    var ctl=new AbortController(),t=setTimeout(function(){ctl.abort()},15000);
    fetch(CFG.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:ctl.signal}).then(function(r){if(!r.ok)throw new Error("bad");done()}).catch(function(){
      al.textContent="Your enquiry did not go through. Check your connection and try again, or call +971 55 558 4095.";al.hidden=false;
    }).finally(function(){clearTimeout(t);send.disabled=false;send.textContent="Send enquiry"});
    function done(){
      var s=$("#success");
      s.innerHTML='<span class="tick"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></span><h3 style="font-size:1.6rem">Thank you, '+esc(payload.first)+'.</h3><p style="color:var(--muted)">We have your enquiry about '+esc(payload.interest)+'. A certified consultant will contact you within 24 hours.</p><div><a class="btn ghost" href="'+esc(CFG.homeUrl||"/")+'">Back to home</a></div>';
      s.hidden=false;$("#formBody").hidden=true;s.tabIndex=-1;s.focus();
    }
  });
}
function bindFilters(root){
  var f=$("#filters",root);
  if(f)f.addEventListener("click",function(e){
    var b=e.target.closest("button");if(!b)return;
    var c=b.dataset.cat;
    $$("button",f).forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});
    $$(".post-card[data-cat]",root).forEach(function(card){card.hidden=!(c==="All"||card.dataset.cat===c)});
    if(motion)requestAnimationFrame(function(){ST.refresh()});
  });
  var df=$("#dirFilters",root),inp=$("#dirSearch",root);
  if(df&&inp){
    var cards=$$("#dirGrid .dircard",root),cat="all",count=$("#dirCount",root),empty=$("#dirEmpty",root);
    var apply=function(){
      var q=inp.value.trim().toLowerCase(),n=0;
      cards.forEach(function(c){
        var ok=(cat==="all"||c.dataset.area===cat)&&(!q||c.dataset.q.indexOf(q)>-1);
        c.hidden=!ok;if(ok)n++;
      });
      count.textContent=n+(n===1?" app or service":" apps and services");
      empty.hidden=n>0;
      if(motion)requestAnimationFrame(function(){ST.refresh()});
    };
    df.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;cat=b.dataset.cat;$$("button",df).forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});apply()});
    inp.addEventListener("input",apply);
  }
}
function openFaq(id){
  var d=id&&document.getElementById(id);
  if(d&&d.tagName==="DETAILS"){d.open=true;return d}
  return null;
}
function enhance(root){
  root=root||$("#view");
  bindFilters(root);
  $$(".logos img",root).forEach(function(img){
    var fail=function(){img.parentNode.classList.add("nf")};
    img.addEventListener("error",fail);
    if(img.complete&&img.naturalWidth===0)fail();
  });
  var form=$("#leadForm",root);if(form)bindForm(form);
  if($("#term",root)){
    if(!motion)demoStatic();
    var rb=$("#replay",root);if(rb)rb.addEventListener("click",function(){if(motion)demoRun();else demoStatic()});
  }
  $$(".card,.rcard,.post-card,.area",root).forEach(function(c){c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px")},{passive:true})});
  if(motion&&fine)$$(".mag",root).forEach(function(b){
    b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();G.to(b,{x:(e.clientX-r.left-r.width/2)*.22,y:(e.clientY-r.top-r.height/2)*.35,duration:.3,ease:"power2.out"})});
    b.addEventListener("pointerleave",function(){G.to(b,{x:0,y:0,duration:.7,ease:"elastic.out(1,.4)"})});
  });
  animate(root);
}

/* ---------- search palette ---------- */
function initSearch(){
  var box=$("#search"),inp=$("#srchInput"),list=$("#srchList");
  if(!box||!inp)return;
  var sel=0,res=[],last=null;
  var DEF=["Zoho One","Zoho CRM","Apps directory","Services","How we work","Contact"];
  var idx=function(){return window.ZP_INDEX||[]};
  function score(e,q){
    var t=e.t.toLowerCase(),d=((e.d||"")+" "+(e.q||"")).toLowerCase(),k=e.k.toLowerCase(),s=0;
    q.split(/\s+/).forEach(function(tok){
      if(!tok)return;
      if(t.indexOf(tok)===0)s+=6;else if(t.indexOf(" "+tok)>-1)s+=4;else if(t.indexOf(tok)>-1)s+=3;else if(d.indexOf(tok)>-1)s+=1;else if(k.indexOf(tok)>-1)s+=1;else s-=100;
    });
    return s;
  }
  function draw(){
    list.innerHTML=res.length?res.map(function(e,i){return '<li role="option" aria-selected="'+(i===sel)+'"><a href="'+esc(e.u)+'" data-i="'+i+'"><span class="k">'+esc(e.k)+'</span><span class="tt"><b>'+esc(e.t)+'</b><small>'+esc(e.d||"")+'</small></span>'+ARROW+'</a></li>'}).join(""):'<li class="none">No results. Try “CRM”, “WhatsApp” or “invoice”.</li>';
    var a=$('li[aria-selected="true"]',list);if(a&&a.scrollIntoView)a.scrollIntoView({block:"nearest"});
  }
  function query(){
    var q=inp.value.trim().toLowerCase();
    if(!q)res=DEF.map(function(n){return idx().filter(function(e){return e.t===n})[0]}).filter(Boolean);
    else res=idx().map(function(e){return {e:e,s:score(e,q)}}).filter(function(x){return x.s>0}).sort(function(a,b){return b.s-a.s}).slice(0,8).map(function(x){return x.e});
    sel=0;draw();
  }
  function open(){
    if(!box.hidden)return;
    last=document.activeElement;box.hidden=false;inp.value="";query();
    if(lenis)lenis.stop();
    setTimeout(function(){inp.focus()},20);
    if(motion)G.fromTo(".srch-box",{y:-18,opacity:0,scale:.98},{y:0,opacity:1,scale:1,duration:.35,ease:"power3.out"});
  }
  function close(){
    if(box.hidden)return;box.hidden=true;
    if(lenis)lenis.start();
    if(last&&last.focus)last.focus();
  }
  function go(i){var e=res[i];if(!e)return;close();navTo(e.u)}
  $("#srchBtn").addEventListener("click",open);
  box.addEventListener("click",function(e){
    if(e.target.hasAttribute("data-close")){close();return}
    var a=e.target.closest("a[data-i]");
    if(a){e.preventDefault();go(+a.dataset.i)}
  });
  inp.addEventListener("input",query);
  inp.addEventListener("keydown",function(e){
    if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(res.length-1,sel+1);draw()}
    else if(e.key==="ArrowUp"){e.preventDefault();sel=Math.max(0,sel-1);draw()}
    else if(e.key==="Enter"){e.preventDefault();go(sel)}
  });
  document.addEventListener("keydown",function(e){
    var tag=(document.activeElement&&document.activeElement.tagName)||"";
    var typing=/INPUT|TEXTAREA|SELECT/.test(tag)||(document.activeElement&&document.activeElement.isContentEditable);
    if((e.key==="/"&&!typing&&!e.metaKey&&!e.ctrlKey)||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k")){e.preventDefault();open()}
    else if(e.key==="Escape")close();
  });
}

/* ---------- navigation ---------- */
function wipe(cb){
  if(!motion||wiping){cb();return}
  wiping=true;
  G.timeline({onComplete:function(){wiping=false}})
    .set("#wipe",{yPercent:100,display:"block"})
    .to("#wipe",{yPercent:0,duration:.55,ease:"power4.inOut"})
    .add(cb)
    .to("#wipe",{yPercent:-100,duration:.7,ease:"power4.inOut"},"+=.1")
    .set("#wipe",{display:"none"});
}
function navTo(url){
  if(CFG.mode==="preview"){location.hash=url.replace(/^#/,"");return}
  var a=document.createElement("a");a.href=url;
  if(a.pathname===location.pathname&&a.hash){var el=document.getElementById(a.hash.slice(1));if(el){openFaq(el.id);scrollToEl(el)}return}
  if(!motion){location.href=url;return}
  try{sessionStorage.setItem("zp-wipe","1")}catch(e){}
  wiping=true;
  G.set("#wipe",{yPercent:100,display:"block"});
  G.to("#wipe",{yPercent:0,duration:.5,ease:"power4.inOut",onComplete:function(){location.href=url}});
}
function bindLinks(){
  if(CFG.mode!=="mpa")return;
  document.addEventListener("click",function(e){
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest("a[href]");if(!a||a.target||a.hasAttribute("download"))return;
    if(a.origin!==location.origin)return;
    if(a.pathname===location.pathname){
      if(!a.hash)return;
      var el=document.getElementById(a.hash.slice(1));
      if(el){e.preventDefault();history.pushState(null,"",a.hash);openFaq(el.id);scrollToEl(el)}
      return;
    }
    if(!motion)return;
    e.preventDefault();navTo(a.href);
  });
}

/* ---------- chrome ---------- */
function closeMobile(){var m=$("#mob"),b=$("#menuBtn");if(!m)return;m.hidden=true;b.setAttribute("aria-expanded","false");b.setAttribute("aria-label","Open menu")}
function closeDD(except){$$("#menu>li[data-dd]").forEach(function(li){if(li!==except){li.classList.remove("open");li.firstElementChild.setAttribute("aria-expanded","false")}})}
function bindChrome(){
  var menu=$("#menu");
  menu.addEventListener("click",function(e){
    var b=e.target.closest("button.nl");
    if(b){var li=b.parentNode,open=!li.classList.contains("open");closeDD(li);li.classList.toggle("open",open);b.setAttribute("aria-expanded",String(open));return}
    if(e.target.closest("a"))closeDD();
  });
  if(fine){
    var t;
    menu.addEventListener("mouseover",function(e){
      var li=e.target.closest("li[data-dd]");if(!li)return;
      clearTimeout(t);closeDD(li);li.classList.add("open");li.firstElementChild.setAttribute("aria-expanded","true");
    });
    menu.addEventListener("mouseout",function(e){
      var li=e.target.closest("li[data-dd]");if(!li||li.contains(e.relatedTarget))return;
      t=setTimeout(function(){li.classList.remove("open");li.firstElementChild.setAttribute("aria-expanded","false")},180);
    });
  }
  document.addEventListener("click",function(e){if(!e.target.closest("#menu"))closeDD()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeDD();if(!$("#mob").hidden){closeMobile();$("#menuBtn").focus()}}});
  $("#menuBtn").addEventListener("click",function(){
    var m=$("#mob"),open=m.hidden;m.hidden=!open;
    this.setAttribute("aria-expanded",String(open));this.setAttribute("aria-label",open?"Close menu":"Open menu");
  });
  $("#mob").addEventListener("click",function(e){if(e.target.closest("a"))closeMobile()});
  var skip=$("#skip");if(skip)skip.addEventListener("click",function(e){e.preventDefault();$("#view").focus()});
  var tbtn=$("#themeBtn");
  function sync(){var d=html.getAttribute("data-theme")==="dark";tbtn.setAttribute("aria-pressed",String(d));tbtn.setAttribute("aria-label",d?"Switch to light theme":"Switch to dark theme")}
  tbtn.addEventListener("click",function(){
    var next=html.getAttribute("data-theme")==="dark"?"light":"dark";
    html.classList.add("theme-anim");html.setAttribute("data-theme",next);
    try{localStorage.setItem("zp-theme",next)}catch(e){}
    sync();setTimeout(function(){html.classList.remove("theme-anim")},650);
  });
  sync();
  var hdr=$("#siteHeader"),bar=$("#progress"),last=0,ticking=false;
  function onScroll(){
    ticking=false;
    var y=window.scrollY||0,h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.transform="scaleX("+(h>0?Math.min(1,y/h):0)+")";
    hdr.classList.toggle("scrolled",y>10);
    if(!calm){if(y>260&&y>last+4&&$("#mob").hidden)hdr.classList.add("hide");else if(y<last-4||y<260)hdr.classList.remove("hide")}
    last=y;
  }
  window.addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  onScroll();
  if(motion&&fine){
    var cur=document.createElement("div"),dot=document.createElement("div"),lab=document.createElement("span");
    cur.className="cur";dot.className="cur-dot";cur.appendChild(lab);document.body.appendChild(cur);document.body.appendChild(dot);
    var cx=G.quickTo(cur,"x",{duration:.5,ease:"power3.out"}),cy=G.quickTo(cur,"y",{duration:.5,ease:"power3.out"}),dx=G.quickTo(dot,"x",{duration:.1}),dy=G.quickTo(dot,"y",{duration:.1});
    window.addEventListener("pointermove",function(e){cx(e.clientX);cy(e.clientY);dx(e.clientX);dy(e.clientY);cur.classList.add("on");dot.classList.add("on")},{passive:true});
    document.addEventListener("pointerover",function(e){
      var t=e.target.closest?e.target.closest("a,button,label,select,input,textarea,summary,.rcard,.post-card"):null,card=t&&t.closest(".rcard,.post-card");
      cur.classList.toggle("big",!!t&&!card);cur.classList.toggle("view",!!card);lab.textContent=card?"View":"";
    });
    html.addEventListener("pointerleave",function(){cur.classList.remove("on");dot.classList.remove("on")});
  }
  if(motion&&$(".mega-word"))G.from("#mega",{yPercent:105,duration:1.5,ease:"power4.out",scrollTrigger:{trigger:".mega-word",start:"top 98%",once:true}});
}

/* ---------- preload ---------- */
function runPreload(){
  var el=$("#preload");if(!el)return;el.style.animation="none";
  var began=false,gone=false;
  if(lenis)lenis.stop();
  function begin(){if(began)return;began=true;preloading=false}
  function finish(){if(gone)return;gone=true;begin();if(el.parentNode)el.remove();if(lenis)lenis.start();if(ST)ST.refresh()}
  var tl=G.timeline({onComplete:finish});
  tl.from(".pc .lk",{clipPath:"inset(0 100% 0 0)",duration:.8,ease:"power3.inOut"}).from(".pc .lr",{clipPath:"inset(0 100% 0 0)",duration:.8,ease:"power3.inOut"},"-=.45")
    .to("#plBar",{scaleX:1,duration:1.3,ease:"power2.inOut"},.2)
    .to(".preload .pc",{opacity:0,y:-24,duration:.5,ease:"power2.in"},">+.15")
    .add(begin,">-.1")
    .to(".preload .ph.t",{yPercent:-101,duration:1.05,ease:"power4.inOut"},"<")
    .to(".preload .ph.b",{yPercent:101,duration:1.05,ease:"power4.inOut"},"<");
  setTimeout(finish,6500);
}
function wipeAway(){
  G.set("#wipe",{yPercent:0,display:"block"});
  G.to("#wipe",{yPercent:-100,duration:.7,ease:"power4.inOut",delay:.1,onComplete:function(){
    G.set("#wipe",{display:"none"});html.classList.remove("wipe-in");
    try{sessionStorage.removeItem("zp-wipe")}catch(e){}
  }});
}

/* ---------- boot ---------- */
function boot(){
  if(motion){
    G.registerPlugin(ST);
    html.classList.add("gs");
    if(window.Lenis){
      try{
        lenis=new window.Lenis({duration:1.15,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))}});
        lenis.on("scroll",ST.update);
        G.ticker.add(function(t){lenis.raf(t*1000)});
        G.ticker.lagSmoothing(0);
      }catch(e){lenis=null}
    }
  }
  bindChrome();initSearch();bindLinks();
  var seen=html.classList.contains("zp-seen"),pre=CFG.mode==="preview"||!seen;
  if(motion&&pre){
    preloading=true;runPreload();
    try{sessionStorage.setItem("zp-seen","1")}catch(e){}
  }else{
    var pe=$("#preload");if(pe)pe.remove();
    if(html.classList.contains("wipe-in")){if(motion)wipeAway();else html.classList.remove("wipe-in")}
  }
  if(CFG.mode==="mpa"){
    enhance($("#view"));
    var h=location.hash.slice(1),el=h&&document.getElementById(h);
    if(el){openFaq(h);setTimeout(function(){scrollToEl(el,true)},60)}
  }
}
window.ZP={boot:boot,enhance:enhance,teardown:teardown,wipe:wipe,toTop:toTop,scrollToEl:scrollToEl,openFaq:openFaq,closeMobile:closeMobile,closeDD:closeDD,navTo:navTo,isMotion:function(){return motion},refresh:function(){if(motion)ST.refresh()}};
})();

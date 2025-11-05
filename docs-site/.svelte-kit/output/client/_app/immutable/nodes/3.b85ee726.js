import{s as $n,f as Wa,h as _n,d as Dn,u as Hn,g as wn,e as Vn,n as In}from"../chunks/scheduler.5d594c60.js";import{S as yn,i as Tn,r as $,u as I,v as y,d as C,t as E,w as T,g as t,s as l,m as x,h as s,j as n,x as p,c as r,f as o,n as g,k as a,a as Ja,y as e}from"../chunks/index.1d3f9147.js";import{I as An,g as kn,a as On,B as bn,G as Ln}from"../chunks/github.eb49a4d0.js";import{b as Mn}from"../chunks/paths.26f88e6c.js";import{S as jn,G as Cn,K as Gn,T as Sn}from"../chunks/terminal.de9394d9.js";import{C as En,Z as Un}from"../chunks/zap.ac426999.js";function Rn(f){let d;const c=f[2].default,m=Dn(c,f,f[3],null);return{c(){m&&m.c()},l(i){m&&m.l(i)},m(i,u){m&&m.m(i,u),d=!0},p(i,u){m&&m.p&&(!d||u&8)&&Hn(m,c,i,i[3],d?Vn(c,i[3],u,null):wn(i[3]),null)},i(i){d||(C(m,i),d=!0)},o(i){E(m,i),d=!1},d(i){m&&m.d(i)}}}function qn(f){let d,c;const m=[{name:"book-open"},f[1],{iconNode:f[0]}];let i={$$slots:{default:[Rn]},$$scope:{ctx:f}};for(let u=0;u<m.length;u+=1)i=Wa(i,m[u]);return d=new An({props:i}),{c(){$(d.$$.fragment)},l(u){I(d.$$.fragment,u)},m(u,h){y(d,u,h),c=!0},p(u,[h]){const D=h&3?kn(m,[m[0],h&2&&On(u[1]),h&1&&{iconNode:u[0]}]):{};h&8&&(D.$$scope={dirty:h,ctx:u}),d.$set(D)},i(u){c||(C(d.$$.fragment,u),c=!0)},o(u){E(d.$$.fragment,u),c=!1},d(u){T(d,u)}}}function Nn(f,d,c){let{$$slots:m={},$$scope:i}=d;const u=[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"}]];return f.$$set=h=>{c(1,d=Wa(Wa({},d),_n(h))),"$$scope"in h&&c(3,i=h.$$scope)},d=_n(d),[u,d,m,i]}class Xn extends yn{constructor(d){super(),Tn(this,d,Nn,qn,$n,{})}}const Pn=Xn;function zn(f){let d,c,m;return d=new Ln({props:{class:"mr-2 h-4 w-4"}}),{c(){$(d.$$.fragment),c=x(`
				View on GitHub`)},l(i){I(d.$$.fragment,i),c=g(i,`
				View on GitHub`)},m(i,u){y(d,i,u),Ja(i,c,u),m=!0},p:In,i(i){m||(C(d.$$.fragment,i),m=!0)},o(i){E(d.$$.fragment,i),m=!1},d(i){i&&o(c),T(d,i)}}}function Bn(f){let d,c,m;return d=new Pn({props:{class:"mr-2 h-4 w-4"}}),{c(){$(d.$$.fragment),c=x(`
				Back to Documentation`)},l(i){I(d.$$.fragment,i),c=g(i,`
				Back to Documentation`)},m(i,u){y(d,i,u),Ja(i,c,u),m=!0},p:In,i(i){m||(C(d.$$.fragment,i),m=!0)},o(i){E(d.$$.fragment,i),m=!1},d(i){i&&o(c),T(d,i)}}}function Yn(f){let d,c,m,i=`<h1 class="text-4xl font-bold tracking-tight mb-4">API Reference</h1> <p class="text-lg text-muted-foreground">Complete API documentation for LLM Link. Learn how to interact with all available endpoints,
				manage providers, and integrate with your applications.</p>`,u,h,D,R,le,Is,re,Qa="API Overview",ys,de,eo='<div><h3 class="text-lg font-medium mb-3">Base URL</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">http://localhost:8088</code></div> <p class="text-sm text-muted-foreground mt-2">Default port is 8088, can be changed with <code>--port</code> flag</p></div> <div><h3 class="text-lg font-medium mb-3">Authentication</h3> <div class="space-y-2"><div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">OpenAI API: Bearer Token</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Anthropic API: x-api-key Header</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Management APIs: No Auth Required</code></div></div></div>',Ts,lt,q,N,ie,Ps,ce,to="Management APIs",Ds,b,V,pe,me,Hs,ws,ue,so="Get available models for all providers or specific provider",Vs,X,rt,ao='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/models</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/models?provider=openai</code></div></div>',As,ve,fe,oo="Example Usage",ks,dt,it,no=f[1].models+"",Os,Ls,A,he,xe,Ms,js,ge,lo="Get status and configuration of all providers",Gs,z,ct,ro='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/providers</code></div>',Ss,_e,be,io="Example Usage",Us,pt,mt,co=f[1].providers+"",Rs,qs,k,Ce,Ee,Ns,Xs,$e,po="Get static list of all supported models with detailed information",zs,B,ut,mo='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/supported-models</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/supported-models?provider=openai</code></div></div>',Bs,Ie,ye,uo="Example Usage",Ys,vt,ft,vo=f[1].supportedModels+"",Ks,Zs,O,Te,Pe,Fs,Ws,De,fo="Get list of all supported providers with their capabilities",Js,Y,ht,ho='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/provider-list</code></div>',Qs,He,we,xo="Example Usage",ea,xt,gt,go=f[1].providerList+"",ta,sa,L,Ve,Ae,aa,oa,ke,_o="Update provider configurations without restarting the service",na,K,_t,bo='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/config/update</code></div>',la,Oe,Le,Co="Example Usage",ra,bt,Ct,Eo=f[1].config+"",da,ia,M,Me,je,ca,pa,Ge,$o="Check service health and system status",ma,Z,Et,Io='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/health</code></div>',ua,Se,Ue,yo="Example Usage",va,$t,It,To=f[1].health+"",fa,ha,yt,H,F,Re,xa,qe,Po="Protocol APIs",ga,Ne,Do=`LLM Link provides native API compatibility for major LLM providers. 
					Use the same endpoints and authentication as the original services.`,_a,w,j,Xe,Ho="OpenAI Compatible API",ba,ze,wo="Compatible with OpenAI's API format for OpenAI, Zhipu AI, Longcat, Moonshot, and Minimax providers",Ca,W,Tt,Vo='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /v1/chat/completions</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /v1/models</code></div></div>',Ea,Be,Ye,Ao="Example Usage",$a,Pt,Dt,ko=f[1].openai+"",Ia,ya,G,Ke,Oo="Anthropic Native API",Ta,Ze,Lo="Native Anthropic Claude API compatibility",Pa,J,Ht,Mo='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /v1/messages</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /v1/models</code></div></div>',Da,Fe,We,jo="Example Usage",Ha,wt,Vt,Go=f[1].anthropic+"",wa,Va,S,Je,So="Ollama Compatible API",Aa,Qe,Uo="Compatible with Ollama's API format for local model deployment",ka,Q,At,Ro='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-3"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/generate</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/chat</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/tags</code></div></div>',Oa,et,tt,qo="Example Usage",La,kt,Ot,No=f[1].ollama+"",Ma,ja,Lt,ee,st,Xo="Error Handling",Ga,te,at,zo='<h3 class="font-medium mb-2">HTTP Status Codes</h3> <div class="space-y-2"><div class="flex justify-between"><code class="text-xs font-mono">200</code> <span class="text-sm">Success</span></div> <div class="flex justify-between"><code class="text-xs font-mono">400</code> <span class="text-sm">Bad Request</span></div> <div class="flex justify-between"><code class="text-xs font-mono">401</code> <span class="text-sm">Unauthorized</span></div> <div class="flex justify-between"><code class="text-xs font-mono">404</code> <span class="text-sm">Not Found</span></div> <div class="flex justify-between"><code class="text-xs font-mono">500</code> <span class="text-sm">Internal Server Error</span></div></div>',Sa,se,ot,Bo="Error Response Format",Ua,Mt,jt,Yo=f[1].error+"",Ra,qa,nt,Ko=`<div class="rounded-lg border bg-card p-6"><h2 class="text-2xl font-semibold mb-6">Rate Limiting</h2> <div class="space-y-4"><p class="text-sm text-muted-foreground">LLM Link respects the rate limits of each provider. Limits are applied per provider 
						and are automatically managed based on the provider&#39;s specifications.</p> <div class="grid gap-4 md:grid-cols-2"><div class="border rounded-lg p-4"><h3 class="font-medium mb-2">OpenAI</h3> <p class="text-xs text-muted-foreground">3,500 requests per minute<br/>
								90,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Anthropic</h3> <p class="text-xs text-muted-foreground">1,000 requests per minute<br/>
								40,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Zhipu AI</h3> <p class="text-xs text-muted-foreground">600 requests per minute<br/>
								120,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Ollama</h3> <p class="text-xs text-muted-foreground">No rate limiting<br/>
								Depends on local hardware</p></div></div></div></div>`,Na,ae,oe,Xa,ne,Ft;return le=new Pn({props:{class:"h-6 w-6 mr-2 text-primary"}}),ie=new jn({props:{class:"h-6 w-6 mr-2 text-primary"}}),me=new En({props:{class:"h-4 w-4 mr-2"}}),xe=new Cn({props:{class:"h-4 w-4 mr-2"}}),Ee=new En({props:{class:"h-4 w-4 mr-2"}}),Pe=new Cn({props:{class:"h-4 w-4 mr-2"}}),Ae=new Gn({props:{class:"h-4 w-4 mr-2"}}),je=new Un({props:{class:"h-4 w-4 mr-2"}}),Re=new Sn({props:{class:"h-6 w-6 mr-2 text-primary"}}),oe=new bn({props:{size:"lg",href:"https://github.com/lipish/llm-link",$$slots:{default:[zn]},$$scope:{ctx:f}}}),ne=new bn({props:{variant:"outline",size:"lg",href:f[0]+"/docs",class:"ml-4",$$slots:{default:[Bn]},$$scope:{ctx:f}}}),{c(){d=t("div"),c=t("div"),m=t("div"),m.innerHTML=i,u=l(),h=t("section"),D=t("div"),R=t("div"),$(le.$$.fragment),Is=l(),re=t("h2"),re.textContent=Qa,ys=l(),de=t("div"),de.innerHTML=eo,Ts=l(),lt=t("section"),q=t("div"),N=t("div"),$(ie.$$.fragment),Ps=l(),ce=t("h2"),ce.textContent=to,Ds=l(),b=t("div"),V=t("div"),pe=t("h3"),$(me.$$.fragment),Hs=x(`
							Models API`),ws=l(),ue=t("p"),ue.textContent=so,Vs=l(),X=t("div"),rt=t("div"),rt.innerHTML=ao,As=l(),ve=t("div"),fe=t("h4"),fe.textContent=oo,ks=l(),dt=t("div"),it=t("code"),Os=x(no),Ls=l(),A=t("div"),he=t("h3"),$(xe.$$.fragment),Ms=x(`
							Providers API`),js=l(),ge=t("p"),ge.textContent=lo,Gs=l(),z=t("div"),ct=t("div"),ct.innerHTML=ro,Ss=l(),_e=t("div"),be=t("h4"),be.textContent=io,Us=l(),pt=t("div"),mt=t("code"),Rs=x(co),qs=l(),k=t("div"),Ce=t("h3"),$(Ee.$$.fragment),Ns=x(`
							Supported Models API`),Xs=l(),$e=t("p"),$e.textContent=po,zs=l(),B=t("div"),ut=t("div"),ut.innerHTML=mo,Bs=l(),Ie=t("div"),ye=t("h4"),ye.textContent=uo,Ys=l(),vt=t("div"),ft=t("code"),Ks=x(vo),Zs=l(),O=t("div"),Te=t("h3"),$(Pe.$$.fragment),Fs=x(`
							Provider List API`),Ws=l(),De=t("p"),De.textContent=fo,Js=l(),Y=t("div"),ht=t("div"),ht.innerHTML=ho,Qs=l(),He=t("div"),we=t("h4"),we.textContent=xo,ea=l(),xt=t("div"),gt=t("code"),ta=x(go),sa=l(),L=t("div"),Ve=t("h3"),$(Ae.$$.fragment),aa=x(`
							Configuration API`),oa=l(),ke=t("p"),ke.textContent=_o,na=l(),K=t("div"),_t=t("div"),_t.innerHTML=bo,la=l(),Oe=t("div"),Le=t("h4"),Le.textContent=Co,ra=l(),bt=t("div"),Ct=t("code"),da=x(Eo),ia=l(),M=t("div"),Me=t("h3"),$(je.$$.fragment),ca=x(`
							Health API`),pa=l(),Ge=t("p"),Ge.textContent=$o,ma=l(),Z=t("div"),Et=t("div"),Et.innerHTML=Io,ua=l(),Se=t("div"),Ue=t("h4"),Ue.textContent=yo,va=l(),$t=t("div"),It=t("code"),fa=x(To),ha=l(),yt=t("section"),H=t("div"),F=t("div"),$(Re.$$.fragment),xa=l(),qe=t("h2"),qe.textContent=Po,ga=l(),Ne=t("p"),Ne.textContent=Do,_a=l(),w=t("div"),j=t("div"),Xe=t("h3"),Xe.textContent=Ho,ba=l(),ze=t("p"),ze.textContent=wo,Ca=l(),W=t("div"),Tt=t("div"),Tt.innerHTML=Vo,Ea=l(),Be=t("div"),Ye=t("h4"),Ye.textContent=Ao,$a=l(),Pt=t("div"),Dt=t("code"),Ia=x(ko),ya=l(),G=t("div"),Ke=t("h3"),Ke.textContent=Oo,Ta=l(),Ze=t("p"),Ze.textContent=Lo,Pa=l(),J=t("div"),Ht=t("div"),Ht.innerHTML=Mo,Da=l(),Fe=t("div"),We=t("h4"),We.textContent=jo,Ha=l(),wt=t("div"),Vt=t("code"),wa=x(Go),Va=l(),S=t("div"),Je=t("h3"),Je.textContent=So,Aa=l(),Qe=t("p"),Qe.textContent=Uo,ka=l(),Q=t("div"),At=t("div"),At.innerHTML=Ro,Oa=l(),et=t("div"),tt=t("h4"),tt.textContent=qo,La=l(),kt=t("div"),Ot=t("code"),Ma=x(No),ja=l(),Lt=t("section"),ee=t("div"),st=t("h2"),st.textContent=Xo,Ga=l(),te=t("div"),at=t("div"),at.innerHTML=zo,Sa=l(),se=t("div"),ot=t("h3"),ot.textContent=Bo,Ua=l(),Mt=t("div"),jt=t("code"),Ra=x(Yo),qa=l(),nt=t("section"),nt.innerHTML=Ko,Na=l(),ae=t("div"),$(oe.$$.fragment),Xa=l(),$(ne.$$.fragment),this.h()},l(v){d=s(v,"DIV",{class:!0});var U=n(d);c=s(U,"DIV",{class:!0});var _=n(c);m=s(_,"DIV",{class:!0,"data-svelte-h":!0}),p(m)!=="svelte-i1l7sj"&&(m.innerHTML=i),u=r(_),h=s(_,"SECTION",{class:!0});var Zt=n(h);D=s(Zt,"DIV",{class:!0});var Wt=n(D);R=s(Wt,"DIV",{class:!0});var Jt=n(R);I(le.$$.fragment,Jt),Is=r(Jt),re=s(Jt,"H2",{class:!0,"data-svelte-h":!0}),p(re)!=="svelte-1g1ysmf"&&(re.textContent=Qa),Jt.forEach(o),ys=r(Wt),de=s(Wt,"DIV",{class:!0,"data-svelte-h":!0}),p(de)!=="svelte-jbwp41"&&(de.innerHTML=eo),Wt.forEach(o),Zt.forEach(o),Ts=r(_),lt=s(_,"SECTION",{class:!0});var Zo=n(lt);q=s(Zo,"DIV",{class:!0});var Qt=n(q);N=s(Qt,"DIV",{class:!0});var es=n(N);I(ie.$$.fragment,es),Ps=r(es),ce=s(es,"H2",{class:!0,"data-svelte-h":!0}),p(ce)!=="svelte-1y5nyj6"&&(ce.textContent=to),es.forEach(o),Ds=r(Qt),b=s(Qt,"DIV",{class:!0});var P=n(b);V=s(P,"DIV",{});var Gt=n(V);pe=s(Gt,"H3",{class:!0});var za=n(pe);I(me.$$.fragment,za),Hs=g(za,`
							Models API`),za.forEach(o),ws=r(Gt),ue=s(Gt,"P",{class:!0,"data-svelte-h":!0}),p(ue)!=="svelte-16l7pg0"&&(ue.textContent=so),Vs=r(Gt),X=s(Gt,"DIV",{class:!0});var ts=n(X);rt=s(ts,"DIV",{"data-svelte-h":!0}),p(rt)!=="svelte-yy1h00"&&(rt.innerHTML=ao),As=r(ts),ve=s(ts,"DIV",{});var ss=n(ve);fe=s(ss,"H4",{class:!0,"data-svelte-h":!0}),p(fe)!=="svelte-nkj2fj"&&(fe.textContent=oo),ks=r(ss),dt=s(ss,"DIV",{class:!0});var Fo=n(dt);it=s(Fo,"CODE",{class:!0});var Wo=n(it);Os=g(Wo,no),Wo.forEach(o),Fo.forEach(o),ss.forEach(o),ts.forEach(o),Gt.forEach(o),Ls=r(P),A=s(P,"DIV",{});var St=n(A);he=s(St,"H3",{class:!0});var Ba=n(he);I(xe.$$.fragment,Ba),Ms=g(Ba,`
							Providers API`),Ba.forEach(o),js=r(St),ge=s(St,"P",{class:!0,"data-svelte-h":!0}),p(ge)!=="svelte-quw76s"&&(ge.textContent=lo),Gs=r(St),z=s(St,"DIV",{class:!0});var as=n(z);ct=s(as,"DIV",{"data-svelte-h":!0}),p(ct)!=="svelte-kz8v0x"&&(ct.innerHTML=ro),Ss=r(as),_e=s(as,"DIV",{});var os=n(_e);be=s(os,"H4",{class:!0,"data-svelte-h":!0}),p(be)!=="svelte-nkj2fj"&&(be.textContent=io),Us=r(os),pt=s(os,"DIV",{class:!0});var Jo=n(pt);mt=s(Jo,"CODE",{class:!0});var Qo=n(mt);Rs=g(Qo,co),Qo.forEach(o),Jo.forEach(o),os.forEach(o),as.forEach(o),St.forEach(o),qs=r(P),k=s(P,"DIV",{});var Ut=n(k);Ce=s(Ut,"H3",{class:!0});var Ya=n(Ce);I(Ee.$$.fragment,Ya),Ns=g(Ya,`
							Supported Models API`),Ya.forEach(o),Xs=r(Ut),$e=s(Ut,"P",{class:!0,"data-svelte-h":!0}),p($e)!=="svelte-12fxrzb"&&($e.textContent=po),zs=r(Ut),B=s(Ut,"DIV",{class:!0});var ns=n(B);ut=s(ns,"DIV",{"data-svelte-h":!0}),p(ut)!=="svelte-q1jqfm"&&(ut.innerHTML=mo),Bs=r(ns),Ie=s(ns,"DIV",{});var ls=n(Ie);ye=s(ls,"H4",{class:!0,"data-svelte-h":!0}),p(ye)!=="svelte-nkj2fj"&&(ye.textContent=uo),Ys=r(ls),vt=s(ls,"DIV",{class:!0});var en=n(vt);ft=s(en,"CODE",{class:!0});var tn=n(ft);Ks=g(tn,vo),tn.forEach(o),en.forEach(o),ls.forEach(o),ns.forEach(o),Ut.forEach(o),Zs=r(P),O=s(P,"DIV",{});var Rt=n(O);Te=s(Rt,"H3",{class:!0});var Ka=n(Te);I(Pe.$$.fragment,Ka),Fs=g(Ka,`
							Provider List API`),Ka.forEach(o),Ws=r(Rt),De=s(Rt,"P",{class:!0,"data-svelte-h":!0}),p(De)!=="svelte-qnfcy1"&&(De.textContent=fo),Js=r(Rt),Y=s(Rt,"DIV",{class:!0});var rs=n(Y);ht=s(rs,"DIV",{"data-svelte-h":!0}),p(ht)!=="svelte-s7238n"&&(ht.innerHTML=ho),Qs=r(rs),He=s(rs,"DIV",{});var ds=n(He);we=s(ds,"H4",{class:!0,"data-svelte-h":!0}),p(we)!=="svelte-nkj2fj"&&(we.textContent=xo),ea=r(ds),xt=s(ds,"DIV",{class:!0});var sn=n(xt);gt=s(sn,"CODE",{class:!0});var an=n(gt);ta=g(an,go),an.forEach(o),sn.forEach(o),ds.forEach(o),rs.forEach(o),Rt.forEach(o),sa=r(P),L=s(P,"DIV",{});var qt=n(L);Ve=s(qt,"H3",{class:!0});var Za=n(Ve);I(Ae.$$.fragment,Za),aa=g(Za,`
							Configuration API`),Za.forEach(o),oa=r(qt),ke=s(qt,"P",{class:!0,"data-svelte-h":!0}),p(ke)!=="svelte-1xl09sv"&&(ke.textContent=_o),na=r(qt),K=s(qt,"DIV",{class:!0});var is=n(K);_t=s(is,"DIV",{"data-svelte-h":!0}),p(_t)!=="svelte-1ytj6v"&&(_t.innerHTML=bo),la=r(is),Oe=s(is,"DIV",{});var cs=n(Oe);Le=s(cs,"H4",{class:!0,"data-svelte-h":!0}),p(Le)!=="svelte-nkj2fj"&&(Le.textContent=Co),ra=r(cs),bt=s(cs,"DIV",{class:!0});var on=n(bt);Ct=s(on,"CODE",{class:!0});var nn=n(Ct);da=g(nn,Eo),nn.forEach(o),on.forEach(o),cs.forEach(o),is.forEach(o),qt.forEach(o),ia=r(P),M=s(P,"DIV",{});var Nt=n(M);Me=s(Nt,"H3",{class:!0});var Fa=n(Me);I(je.$$.fragment,Fa),ca=g(Fa,`
							Health API`),Fa.forEach(o),pa=r(Nt),Ge=s(Nt,"P",{class:!0,"data-svelte-h":!0}),p(Ge)!=="svelte-1pp5eqi"&&(Ge.textContent=$o),ma=r(Nt),Z=s(Nt,"DIV",{class:!0});var ps=n(Z);Et=s(ps,"DIV",{"data-svelte-h":!0}),p(Et)!=="svelte-1aymo75"&&(Et.innerHTML=Io),ua=r(ps),Se=s(ps,"DIV",{});var ms=n(Se);Ue=s(ms,"H4",{class:!0,"data-svelte-h":!0}),p(Ue)!=="svelte-nkj2fj"&&(Ue.textContent=yo),va=r(ms),$t=s(ms,"DIV",{class:!0});var ln=n($t);It=s(ln,"CODE",{class:!0});var rn=n(It);fa=g(rn,To),rn.forEach(o),ln.forEach(o),ms.forEach(o),ps.forEach(o),Nt.forEach(o),P.forEach(o),Qt.forEach(o),Zo.forEach(o),ha=r(_),yt=s(_,"SECTION",{class:!0});var dn=n(yt);H=s(dn,"DIV",{class:!0});var Xt=n(H);F=s(Xt,"DIV",{class:!0});var us=n(F);I(Re.$$.fragment,us),xa=r(us),qe=s(us,"H2",{class:!0,"data-svelte-h":!0}),p(qe)!=="svelte-1j4ijhn"&&(qe.textContent=Po),us.forEach(o),ga=r(Xt),Ne=s(Xt,"P",{class:!0,"data-svelte-h":!0}),p(Ne)!=="svelte-z7y22e"&&(Ne.textContent=Do),_a=r(Xt),w=s(Xt,"DIV",{class:!0});var zt=n(w);j=s(zt,"DIV",{});var Bt=n(j);Xe=s(Bt,"H3",{class:!0,"data-svelte-h":!0}),p(Xe)!=="svelte-13fg7im"&&(Xe.textContent=Ho),ba=r(Bt),ze=s(Bt,"P",{class:!0,"data-svelte-h":!0}),p(ze)!=="svelte-1cmrc6k"&&(ze.textContent=wo),Ca=r(Bt),W=s(Bt,"DIV",{class:!0});var vs=n(W);Tt=s(vs,"DIV",{"data-svelte-h":!0}),p(Tt)!=="svelte-dsp2r9"&&(Tt.innerHTML=Vo),Ea=r(vs),Be=s(vs,"DIV",{});var fs=n(Be);Ye=s(fs,"H4",{class:!0,"data-svelte-h":!0}),p(Ye)!=="svelte-nkj2fj"&&(Ye.textContent=Ao),$a=r(fs),Pt=s(fs,"DIV",{class:!0});var cn=n(Pt);Dt=s(cn,"CODE",{class:!0});var pn=n(Dt);Ia=g(pn,ko),pn.forEach(o),cn.forEach(o),fs.forEach(o),vs.forEach(o),Bt.forEach(o),ya=r(zt),G=s(zt,"DIV",{});var Yt=n(G);Ke=s(Yt,"H3",{class:!0,"data-svelte-h":!0}),p(Ke)!=="svelte-1x6ey2x"&&(Ke.textContent=Oo),Ta=r(Yt),Ze=s(Yt,"P",{class:!0,"data-svelte-h":!0}),p(Ze)!=="svelte-f1bevk"&&(Ze.textContent=Lo),Pa=r(Yt),J=s(Yt,"DIV",{class:!0});var hs=n(J);Ht=s(hs,"DIV",{"data-svelte-h":!0}),p(Ht)!=="svelte-1fhyldj"&&(Ht.innerHTML=Mo),Da=r(hs),Fe=s(hs,"DIV",{});var xs=n(Fe);We=s(xs,"H4",{class:!0,"data-svelte-h":!0}),p(We)!=="svelte-nkj2fj"&&(We.textContent=jo),Ha=r(xs),wt=s(xs,"DIV",{class:!0});var mn=n(wt);Vt=s(mn,"CODE",{class:!0});var un=n(Vt);wa=g(un,Go),un.forEach(o),mn.forEach(o),xs.forEach(o),hs.forEach(o),Yt.forEach(o),Va=r(zt),S=s(zt,"DIV",{});var Kt=n(S);Je=s(Kt,"H3",{class:!0,"data-svelte-h":!0}),p(Je)!=="svelte-z5u8wu"&&(Je.textContent=So),Aa=r(Kt),Qe=s(Kt,"P",{class:!0,"data-svelte-h":!0}),p(Qe)!=="svelte-g9g3va"&&(Qe.textContent=Uo),ka=r(Kt),Q=s(Kt,"DIV",{class:!0});var gs=n(Q);At=s(gs,"DIV",{"data-svelte-h":!0}),p(At)!=="svelte-o4om0y"&&(At.innerHTML=Ro),Oa=r(gs),et=s(gs,"DIV",{});var _s=n(et);tt=s(_s,"H4",{class:!0,"data-svelte-h":!0}),p(tt)!=="svelte-nkj2fj"&&(tt.textContent=qo),La=r(_s),kt=s(_s,"DIV",{class:!0});var vn=n(kt);Ot=s(vn,"CODE",{class:!0});var fn=n(Ot);Ma=g(fn,No),fn.forEach(o),vn.forEach(o),_s.forEach(o),gs.forEach(o),Kt.forEach(o),zt.forEach(o),Xt.forEach(o),dn.forEach(o),ja=r(_),Lt=s(_,"SECTION",{class:!0});var hn=n(Lt);ee=s(hn,"DIV",{class:!0});var bs=n(ee);st=s(bs,"H2",{class:!0,"data-svelte-h":!0}),p(st)!=="svelte-fojgu5"&&(st.textContent=Xo),Ga=r(bs),te=s(bs,"DIV",{class:!0});var Cs=n(te);at=s(Cs,"DIV",{class:!0,"data-svelte-h":!0}),p(at)!=="svelte-1p7zcuu"&&(at.innerHTML=zo),Sa=r(Cs),se=s(Cs,"DIV",{class:!0});var Es=n(se);ot=s(Es,"H3",{class:!0,"data-svelte-h":!0}),p(ot)!=="svelte-1i4szvk"&&(ot.textContent=Bo),Ua=r(Es),Mt=s(Es,"DIV",{class:!0});var xn=n(Mt);jt=s(xn,"CODE",{class:!0});var gn=n(jt);Ra=g(gn,Yo),gn.forEach(o),xn.forEach(o),Es.forEach(o),Cs.forEach(o),bs.forEach(o),hn.forEach(o),qa=r(_),nt=s(_,"SECTION",{class:!0,"data-svelte-h":!0}),p(nt)!=="svelte-i3reia"&&(nt.innerHTML=Ko),Na=r(_),ae=s(_,"DIV",{class:!0});var $s=n(ae);I(oe.$$.fragment,$s),Xa=r($s),I(ne.$$.fragment,$s),$s.forEach(o),_.forEach(o),U.forEach(o),this.h()},h(){a(m,"class","mb-8"),a(re,"class","text-2xl font-semibold"),a(R,"class","flex items-center mb-6"),a(de,"class","grid gap-6 md:grid-cols-2"),a(D,"class","rounded-lg border bg-card p-6"),a(h,"class","mb-12"),a(ce,"class","text-2xl font-semibold"),a(N,"class","flex items-center mb-6"),a(pe,"class","text-lg font-medium mb-3 flex items-center"),a(ue,"class","text-sm text-muted-foreground mb-4"),a(fe,"class","font-medium mb-2"),a(it,"class","text-sm font-mono whitespace-pre-wrap"),a(dt,"class","bg-muted rounded-md p-4"),a(X,"class","space-y-4"),a(he,"class","text-lg font-medium mb-3 flex items-center"),a(ge,"class","text-sm text-muted-foreground mb-4"),a(be,"class","font-medium mb-2"),a(mt,"class","text-sm font-mono whitespace-pre-wrap"),a(pt,"class","bg-muted rounded-md p-4"),a(z,"class","space-y-4"),a(Ce,"class","text-lg font-medium mb-3 flex items-center"),a($e,"class","text-sm text-muted-foreground mb-4"),a(ye,"class","font-medium mb-2"),a(ft,"class","text-sm font-mono whitespace-pre-wrap"),a(vt,"class","bg-muted rounded-md p-4"),a(B,"class","space-y-4"),a(Te,"class","text-lg font-medium mb-3 flex items-center"),a(De,"class","text-sm text-muted-foreground mb-4"),a(we,"class","font-medium mb-2"),a(gt,"class","text-sm font-mono whitespace-pre-wrap"),a(xt,"class","bg-muted rounded-md p-4"),a(Y,"class","space-y-4"),a(Ve,"class","text-lg font-medium mb-3 flex items-center"),a(ke,"class","text-sm text-muted-foreground mb-4"),a(Le,"class","font-medium mb-2"),a(Ct,"class","text-sm font-mono whitespace-pre-wrap"),a(bt,"class","bg-muted rounded-md p-4"),a(K,"class","space-y-4"),a(Me,"class","text-lg font-medium mb-3 flex items-center"),a(Ge,"class","text-sm text-muted-foreground mb-4"),a(Ue,"class","font-medium mb-2"),a(It,"class","text-sm font-mono whitespace-pre-wrap"),a($t,"class","bg-muted rounded-md p-4"),a(Z,"class","space-y-4"),a(b,"class","space-y-8"),a(q,"class","rounded-lg border bg-card p-6"),a(lt,"class","mb-12"),a(qe,"class","text-2xl font-semibold"),a(F,"class","flex items-center mb-6"),a(Ne,"class","text-sm text-muted-foreground mb-6"),a(Xe,"class","text-lg font-medium mb-3"),a(ze,"class","text-sm text-muted-foreground mb-4"),a(Ye,"class","font-medium mb-2"),a(Dt,"class","text-sm font-mono whitespace-pre-wrap"),a(Pt,"class","bg-muted rounded-md p-4"),a(W,"class","space-y-4"),a(Ke,"class","text-lg font-medium mb-3"),a(Ze,"class","text-sm text-muted-foreground mb-4"),a(We,"class","font-medium mb-2"),a(Vt,"class","text-sm font-mono whitespace-pre-wrap"),a(wt,"class","bg-muted rounded-md p-4"),a(J,"class","space-y-4"),a(Je,"class","text-lg font-medium mb-3"),a(Qe,"class","text-sm text-muted-foreground mb-4"),a(tt,"class","font-medium mb-2"),a(Ot,"class","text-sm font-mono whitespace-pre-wrap"),a(kt,"class","bg-muted rounded-md p-4"),a(Q,"class","space-y-4"),a(w,"class","space-y-8"),a(H,"class","rounded-lg border bg-card p-6"),a(yt,"class","mb-12"),a(st,"class","text-2xl font-semibold mb-6"),a(at,"class","border-l-4 border-red-400 pl-4"),a(ot,"class","font-medium mb-2"),a(jt,"class","text-sm font-mono"),a(Mt,"class","bg-muted rounded-md p-4"),a(se,"class","border-l-4 border-yellow-400 pl-4"),a(te,"class","space-y-4"),a(ee,"class","rounded-lg border bg-card p-6"),a(Lt,"class","mb-12"),a(nt,"class","mb-12"),a(ae,"class","mt-12 text-center"),a(c,"class","max-w-6xl mx-auto"),a(d,"class","container py-8")},m(v,U){Ja(v,d,U),e(d,c),e(c,m),e(c,u),e(c,h),e(h,D),e(D,R),y(le,R,null),e(R,Is),e(R,re),e(D,ys),e(D,de),e(c,Ts),e(c,lt),e(lt,q),e(q,N),y(ie,N,null),e(N,Ps),e(N,ce),e(q,Ds),e(q,b),e(b,V),e(V,pe),y(me,pe,null),e(pe,Hs),e(V,ws),e(V,ue),e(V,Vs),e(V,X),e(X,rt),e(X,As),e(X,ve),e(ve,fe),e(ve,ks),e(ve,dt),e(dt,it),e(it,Os),e(b,Ls),e(b,A),e(A,he),y(xe,he,null),e(he,Ms),e(A,js),e(A,ge),e(A,Gs),e(A,z),e(z,ct),e(z,Ss),e(z,_e),e(_e,be),e(_e,Us),e(_e,pt),e(pt,mt),e(mt,Rs),e(b,qs),e(b,k),e(k,Ce),y(Ee,Ce,null),e(Ce,Ns),e(k,Xs),e(k,$e),e(k,zs),e(k,B),e(B,ut),e(B,Bs),e(B,Ie),e(Ie,ye),e(Ie,Ys),e(Ie,vt),e(vt,ft),e(ft,Ks),e(b,Zs),e(b,O),e(O,Te),y(Pe,Te,null),e(Te,Fs),e(O,Ws),e(O,De),e(O,Js),e(O,Y),e(Y,ht),e(Y,Qs),e(Y,He),e(He,we),e(He,ea),e(He,xt),e(xt,gt),e(gt,ta),e(b,sa),e(b,L),e(L,Ve),y(Ae,Ve,null),e(Ve,aa),e(L,oa),e(L,ke),e(L,na),e(L,K),e(K,_t),e(K,la),e(K,Oe),e(Oe,Le),e(Oe,ra),e(Oe,bt),e(bt,Ct),e(Ct,da),e(b,ia),e(b,M),e(M,Me),y(je,Me,null),e(Me,ca),e(M,pa),e(M,Ge),e(M,ma),e(M,Z),e(Z,Et),e(Z,ua),e(Z,Se),e(Se,Ue),e(Se,va),e(Se,$t),e($t,It),e(It,fa),e(c,ha),e(c,yt),e(yt,H),e(H,F),y(Re,F,null),e(F,xa),e(F,qe),e(H,ga),e(H,Ne),e(H,_a),e(H,w),e(w,j),e(j,Xe),e(j,ba),e(j,ze),e(j,Ca),e(j,W),e(W,Tt),e(W,Ea),e(W,Be),e(Be,Ye),e(Be,$a),e(Be,Pt),e(Pt,Dt),e(Dt,Ia),e(w,ya),e(w,G),e(G,Ke),e(G,Ta),e(G,Ze),e(G,Pa),e(G,J),e(J,Ht),e(J,Da),e(J,Fe),e(Fe,We),e(Fe,Ha),e(Fe,wt),e(wt,Vt),e(Vt,wa),e(w,Va),e(w,S),e(S,Je),e(S,Aa),e(S,Qe),e(S,ka),e(S,Q),e(Q,At),e(Q,Oa),e(Q,et),e(et,tt),e(et,La),e(et,kt),e(kt,Ot),e(Ot,Ma),e(c,ja),e(c,Lt),e(Lt,ee),e(ee,st),e(ee,Ga),e(ee,te),e(te,at),e(te,Sa),e(te,se),e(se,ot),e(se,Ua),e(se,Mt),e(Mt,jt),e(jt,Ra),e(c,qa),e(c,nt),e(c,Na),e(c,ae),y(oe,ae,null),e(ae,Xa),y(ne,ae,null),Ft=!0},p(v,[U]){const _={};U&4&&(_.$$scope={dirty:U,ctx:v}),oe.$set(_);const Zt={};U&4&&(Zt.$$scope={dirty:U,ctx:v}),ne.$set(Zt)},i(v){Ft||(C(le.$$.fragment,v),C(ie.$$.fragment,v),C(me.$$.fragment,v),C(xe.$$.fragment,v),C(Ee.$$.fragment,v),C(Pe.$$.fragment,v),C(Ae.$$.fragment,v),C(je.$$.fragment,v),C(Re.$$.fragment,v),C(oe.$$.fragment,v),C(ne.$$.fragment,v),Ft=!0)},o(v){E(le.$$.fragment,v),E(ie.$$.fragment,v),E(me.$$.fragment,v),E(xe.$$.fragment,v),E(Ee.$$.fragment,v),E(Pe.$$.fragment,v),E(Ae.$$.fragment,v),E(je.$$.fragment,v),E(Re.$$.fragment,v),E(oe.$$.fragment,v),E(ne.$$.fragment,v),Ft=!1},d(v){v&&o(d),T(le),T(ie),T(me),T(xe),T(Ee),T(Pe),T(Ae),T(je),T(Re),T(oe),T(ne)}}}function Kn(f){return[Mn,{models:`# Get all available models
curl -X GET http://localhost:8088/api/models

# Get models for specific provider
curl -X GET http://localhost:8088/api/models?provider=openai

# Response example
{
  "providers": {
    "openai": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "description": "Most capable model",
        "context_length": 8192,
        "pricing": { "input": 0.03, "output": 0.06 }
      }
    ],
    "anthropic": [
      {
        "id": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "description": "Latest Claude model",
        "context_length": 200000,
        "pricing": { "input": 0.003, "output": 0.015 }
      }
    ]
  }
}`,supportedModels:`# Get all supported models (static list)
curl -X GET http://localhost:8088/api/supported-models

# Get supported models for specific provider
curl -X GET http://localhost:8088/api/supported-models?provider=openai

# Response example
{
  "supported_models": {
    "openai": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "display_name": "GPT-4",
        "description": "Most capable GPT-4 model",
        "context_length": 8192,
        "max_output_tokens": 4096,
        "input_price": 0.03,
        "output_price": 0.06,
        "capabilities": ["chat", "completion", "function_calling", "vision"],
        "status": "available"
      }
    ],
    "anthropic": [
      {
        "id": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "display_name": "claude-3-5-sonnet-20241022",
        "description": "Latest Claude model with improved capabilities",
        "context_length": 200000,
        "max_output_tokens": 8192,
        "input_price": 0.003,
        "output_price": 0.015,
        "capabilities": ["chat", "vision", "long_context"],
        "status": "available"
      }
    ]
  },
  "total_models": 45,
  "last_updated": "2025-01-15T10:00:00Z"
}`,providerList:`# Get list of all supported providers
curl -X GET http://localhost:8088/api/provider-list

# Response example
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "display_name": "OpenAI",
      "description": "Leading AI models including GPT-4, GPT-3.5, and more",
      "api_type": "native",
      "base_url": "https://api.openai.com/v1",
      "requires_api_key": true,
      "env_var": "OPENAI_API_KEY",
      "supported_features": ["streaming", "function_calling", "vision"],
      "models_count": 5,
      "status": "available"
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "display_name": "Anthropic",
      "description": "Advanced Claude models with strong reasoning capabilities",
      "api_type": "native",
      "base_url": "https://api.anthropic.com",
      "requires_api_key": true,
      "env_var": "ANTHROPIC_API_KEY",
      "supported_features": ["streaming", "long_context", "vision"],
      "models_count": 3,
      "status": "available"
    },
    {
      "id": "ollama",
      "name": "Ollama",
      "display_name": "Ollama",
      "description": "Local and open-source models",
      "api_type": "native",
      "base_url": "http://localhost:11434",
      "requires_api_key": false,
      "env_var": null,
      "supported_features": ["streaming", "custom_models", "local_deployment"],
      "models_count": 8,
      "status": "available"
    }
  ],
  "total_providers": 10,
  "available_providers": 10
}`,providers:`# Get all provider status
curl -X GET http://localhost:8088/api/providers

# Response example
{
  "providers": {
    "openai": {
      "status": "active",
      "configured": true,
      "models_count": 5,
      "api_type": "native",
      "base_url": "https://api.openai.com/v1"
    },
    "anthropic": {
      "status": "active",
      "configured": true,
      "models_count": 3,
      "api_type": "native",
      "base_url": "https://api.anthropic.com"
    },
    "ollama": {
      "status": "active",
      "configured": true,
      "models_count": 8,
      "api_type": "native",
      "base_url": "http://localhost:11434"
    }
  }
}`,config:`# Update provider configuration
curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Update multiple providers
curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{
    "providers": {
      "openai": {
        "api_key": "sk-new-key-here"
      },
      "anthropic": {
        "api_key": "sk-ant-new-key-here"
      }
    }
  }'

# Response example
{
  "success": true,
  "message": "Configuration updated successfully",
  "updated_providers": ["openai", "anthropic"]
}`,health:`# Check service health
curl -X GET http://localhost:8088/api/health

# Response example
{
  "status": "healthy",
  "version": "0.3.5",
  "uptime": "2h 30m 15s",
  "active_protocols": ["openai", "anthropic", "ollama"],
  "configured_providers": 10,
  "total_models": 45,
  "system": {
    "cpu_usage": "15%",
    "memory_usage": "120MB",
    "port": 8088
  }
}`,openai:`# OpenAI Compatible API - Chat Completions
curl -X POST http://localhost:8088/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "stream": false,
    "temperature": 0.7
  }'

# Streaming response
curl -X POST http://localhost:8088/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Write a short story"
      }
    ],
    "stream": true,
    "temperature": 0.7
  }'`,anthropic:`# Anthropic Native API - Messages
curl -X POST http://localhost:8088/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-5-sonnet",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Hello, Claude!"
      }
    ]
  }'

# Streaming response
curl -X POST http://localhost:8088/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-5-sonnet",
    "max_tokens": 1024,
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing"
      }
    ]
  }'`,ollama:`# Ollama Compatible API - Generate
curl -X POST http://localhost:8088/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "prompt": "Why is the sky blue?",
    "stream": false
  }'

# Streaming response
curl -X POST http://localhost:8088/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "prompt": "Tell me a story",
    "stream": true
  }'

# Chat endpoint
curl -X POST http://localhost:8088/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "stream": false
  }'`,error:`{
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid API key provided",
    "code": "invalid_api_key"
  }
}`}]}class tl extends yn{constructor(d){super(),Tn(this,d,Kn,Yn,$n,{})}}export{tl as component};

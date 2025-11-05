import{s as Vr,f as Pn,h as Tr,d as Or,u as Lr,g as Gr,e as jr,n as kr}from"../chunks/scheduler.5d594c60.js";import{S as Ar,i as Mr,r as $,u as y,v as T,d as C,t as E,w as P,g as t,s as l,m as h,h as s,j as n,x as d,c as r,f as o,n as g,k as a,a as Dn,y as e}from"../chunks/index.1d3f9147.js";import{I as Sr,g as Rr,a as Xr,B as Pr,G as Ur}from"../chunks/github.eb49a4d0.js";import{b as qr}from"../chunks/paths.a1e3c374.js";import{S as zr,G as wr,K as Dr,T as Nr}from"../chunks/terminal.de9394d9.js";import{C as Hr,Z as Kr}from"../chunks/zap.ac426999.js";function Br(u){let i;const p=u[2].default,m=Or(p,u,u[3],null);return{c(){m&&m.c()},l(c){m&&m.l(c)},m(c,f){m&&m.m(c,f),i=!0},p(c,f){m&&m.p&&(!i||f&8)&&Lr(m,p,c,c[3],i?jr(p,c[3],f,null):Gr(c[3]),null)},i(c){i||(C(m,c),i=!0)},o(c){E(m,c),i=!1},d(c){m&&m.d(c)}}}function Yr(u){let i,p;const m=[{name:"book-open"},u[1],{iconNode:u[0]}];let c={$$slots:{default:[Br]},$$scope:{ctx:u}};for(let f=0;f<m.length;f+=1)c=Pn(c,m[f]);return i=new Sr({props:c}),{c(){$(i.$$.fragment)},l(f){y(i.$$.fragment,f)},m(f,_){T(i,f,_),p=!0},p(f,[_]){const D=_&3?Rr(m,[m[0],_&2&&Xr(f[1]),_&1&&{iconNode:f[0]}]):{};_&8&&(D.$$scope={dirty:_,ctx:f}),i.$set(D)},i(f){p||(C(i.$$.fragment,f),p=!0)},o(f){E(i.$$.fragment,f),p=!1},d(f){P(i,f)}}}function Zr(u,i,p){let{$$slots:m={},$$scope:c}=i;const f=[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"}]];return u.$$set=_=>{p(1,i=Pn(Pn({},i),Tr(_))),"$$scope"in _&&p(3,c=_.$$scope)},i=Tr(i),[f,i,m,c]}class Fr extends Ar{constructor(i){super(),Mr(this,i,Zr,Yr,Vr,{})}}const wn=Fr;function Wr(u){let i,p,m;return i=new Ur({props:{class:"mr-2 h-4 w-4"}}),{c(){$(i.$$.fragment),p=h(`
				View on GitHub`)},l(c){y(i.$$.fragment,c),p=g(c,`
				View on GitHub`)},m(c,f){T(i,c,f),Dn(c,p,f),m=!0},p:kr,i(c){m||(C(i.$$.fragment,c),m=!0)},o(c){E(i.$$.fragment,c),m=!1},d(c){c&&o(p),P(i,c)}}}function Jr(u){let i,p,m;return i=new wn({props:{class:"mr-2 h-4 w-4"}}),{c(){$(i.$$.fragment),p=h(`
				Back to Documentation`)},l(c){y(i.$$.fragment,c),p=g(c,`
				Back to Documentation`)},m(c,f){T(i,c,f),Dn(c,p,f),m=!0},p:kr,i(c){m||(C(i.$$.fragment,c),m=!0)},o(c){E(i.$$.fragment,c),m=!1},d(c){c&&o(p),P(i,c)}}}function Qr(u){let i,p,m,c=`<h1 class="text-4xl font-bold tracking-tight mb-4">API Reference</h1> <p class="text-lg text-muted-foreground">Complete API documentation for LLM Link. Learn how to interact with all available endpoints,
				manage providers, and integrate with your applications.</p>`,f,_,D,F,he,ba,ge,Hn="API Overview",Ca,xe,Vn='<div><h3 class="text-lg font-medium mb-3">Base URL</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">http://localhost:8088</code></div> <p class="text-sm text-muted-foreground mt-2">Default port is 8088, can be changed with <code>--port</code> flag</p></div> <div><h3 class="text-lg font-medium mb-3">Authentication</h3> <div class="space-y-2"><div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">OpenAI API: Bearer Token</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Anthropic API: x-api-key Header</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Management APIs: No Auth Required</code></div></div></div>',Ea,Mt,W,J,_e,Ia,be,kn="Management APIs",$a,x,A,Ce,Ee,ya,Ta,Ie,An="Get available models for all providers or specific provider",Pa,Q,Ot,Mn='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/models</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/models?provider=openai</code></div></div>',wa,$e,ye,On="Example Usage",Da,Lt,Gt,Ln=u[1].models+"",Ha,Va,M,Te,Pe,ka,Aa,we,Gn="Get status and configuration of all providers",Ma,ee,jt,jn='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/providers</code></div>',Oa,De,He,Sn="Example Usage",La,St,Rt,Rn=u[1].providers+"",Ga,ja,O,Ve,ke,Sa,Ra,Ae,Xn="Get static list of all supported models with detailed information",Xa,te,Xt,Un='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/supported-models</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/supported-models?provider=openai</code></div></div>',Ua,Me,Oe,qn="Example Usage",qa,Ut,qt,zn=u[1].supportedModels+"",za,Na,L,Le,Ge,Ka,Ba,je,Nn="Get list of all supported providers with their capabilities",Ya,se,zt,Kn='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/provider-list</code></div>',Za,Se,Re,Bn="Example Usage",Fa,Nt,Kt,Yn=u[1].providerList+"",Wa,Ja,G,Xe,Ue,Qa,eo,qe,Zn="Runtime configuration management without service restart",to,w,j,ze,Fn="Get Current Configuration",so,Ne,Wn='<code class="text-xs font-mono">GET /api/config/current</code>',ao,Bt,Yt,Jn=u[1].currentConfig+"",oo,no,S,Ke,Qn="Validate API Key",lo,Be,el='<code class="text-xs font-mono">POST /api/config/validate-key</code>',ro,Zt,Ft,tl=u[1].validateKey+"",io,co,R,Ye,sl="Update API Key (Hot Reload)",po,Ze,al='<code class="text-xs font-mono">POST /api/config/update-key</code>',mo,Wt,Jt,ol=u[1].updateKey+"",vo,uo,X,Fe,nl="Switch Provider",fo,We,ll='<code class="text-xs font-mono">POST /api/config/switch-provider</code>',ho,Qt,es,rl=u[1].switchProvider+"",go,xo,U,Je,dl="Process Management",_o,Qe,il='<div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/config/pid</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/config/shutdown</code></div>',bo,ts,ss,cl=u[1].processManagement+"",Co,Eo,q,et,tt,Io,$o,st,pl="Get comprehensive service information and status",yo,ae,as,ml='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/info</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/health</code></div></div>',To,at,ot,vl="Example Usage",Po,os,ns,ul=u[1].serviceInfo+"",wo,Do,z,nt,lt,Ho,Vo,rt,fl="Update provider configurations without restarting the service",ko,oe,ls,hl='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/config/update</code></div>',Ao,dt,it,gl="Example Usage",Mo,rs,ds,xl=u[1].config+"",Oo,Lo,N,ct,pt,Go,jo,mt,_l="Check service health and system status",So,ne,is,bl='<h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/health</code></div>',Ro,vt,ut,Cl="Example Usage",Xo,cs,ps,El=u[1].health+"",Uo,qo,ms,H,le,ft,zo,ht,Il="Protocol APIs",No,gt,$l=`LLM Link provides native API compatibility for major LLM providers. 
					Use the same endpoints and authentication as the original services.`,Ko,V,K,xt,yl="OpenAI Compatible API",Bo,_t,Tl="Compatible with OpenAI's API format for OpenAI, Zhipu AI, Longcat, Moonshot, and Minimax providers",Yo,re,vs,Pl='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /v1/chat/completions</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /v1/models</code></div></div>',Zo,bt,Ct,wl="Example Usage",Fo,us,fs,Dl=u[1].openai+"",Wo,Jo,B,Et,Hl="Anthropic Native API",Qo,It,Vl="Native Anthropic Claude API compatibility",en,de,hs,kl='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /v1/messages</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /v1/models</code></div></div>',tn,$t,yt,Al="Example Usage",sn,gs,xs,Ml=u[1].anthropic+"",an,on,Y,Tt,Ol="Ollama Compatible API",nn,Pt,Ll="Compatible with Ollama's API format for local model deployment",ln,ie,_s,Gl='<h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-3"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/generate</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/chat</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/tags</code></div></div>',rn,wt,Dt,jl="Example Usage",dn,bs,Cs,Sl=u[1].ollama+"",cn,pn,Es,ce,Ht,Rl="Error Handling",mn,pe,Vt,Xl='<h3 class="font-medium mb-2">HTTP Status Codes</h3> <div class="space-y-2"><div class="flex justify-between"><code class="text-xs font-mono">200</code> <span class="text-sm">Success</span></div> <div class="flex justify-between"><code class="text-xs font-mono">400</code> <span class="text-sm">Bad Request</span></div> <div class="flex justify-between"><code class="text-xs font-mono">401</code> <span class="text-sm">Unauthorized</span></div> <div class="flex justify-between"><code class="text-xs font-mono">404</code> <span class="text-sm">Not Found</span></div> <div class="flex justify-between"><code class="text-xs font-mono">500</code> <span class="text-sm">Internal Server Error</span></div></div>',vn,me,kt,Ul="Error Response Format",un,Is,$s,ql=u[1].error+"",fn,hn,At,zl=`<div class="rounded-lg border bg-card p-6"><h2 class="text-2xl font-semibold mb-6">Rate Limiting</h2> <div class="space-y-4"><p class="text-sm text-muted-foreground">LLM Link respects the rate limits of each provider. Limits are applied per provider 
						and are automatically managed based on the provider&#39;s specifications.</p> <div class="grid gap-4 md:grid-cols-2"><div class="border rounded-lg p-4"><h3 class="font-medium mb-2">OpenAI</h3> <p class="text-xs text-muted-foreground">3,500 requests per minute<br/>
								90,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Anthropic</h3> <p class="text-xs text-muted-foreground">1,000 requests per minute<br/>
								40,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Zhipu AI</h3> <p class="text-xs text-muted-foreground">600 requests per minute<br/>
								120,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Ollama</h3> <p class="text-xs text-muted-foreground">No rate limiting<br/>
								Depends on local hardware</p></div></div></div></div>`,gn,ve,ue,xn,fe,zs;return he=new wn({props:{class:"h-6 w-6 mr-2 text-primary"}}),_e=new zr({props:{class:"h-6 w-6 mr-2 text-primary"}}),Ee=new Hr({props:{class:"h-4 w-4 mr-2"}}),Pe=new wr({props:{class:"h-4 w-4 mr-2"}}),ke=new Hr({props:{class:"h-4 w-4 mr-2"}}),Ge=new wr({props:{class:"h-4 w-4 mr-2"}}),Ue=new Dr({props:{class:"h-4 w-4 mr-2"}}),tt=new wn({props:{class:"h-4 w-4 mr-2"}}),lt=new Dr({props:{class:"h-4 w-4 mr-2"}}),pt=new Kr({props:{class:"h-4 w-4 mr-2"}}),ft=new Nr({props:{class:"h-6 w-6 mr-2 text-primary"}}),ue=new Pr({props:{size:"lg",href:"https://github.com/lipish/llm-link",$$slots:{default:[Wr]},$$scope:{ctx:u}}}),fe=new Pr({props:{variant:"outline",size:"lg",href:u[0]+"/docs",class:"ml-4",$$slots:{default:[Jr]},$$scope:{ctx:u}}}),{c(){i=t("div"),p=t("div"),m=t("div"),m.innerHTML=c,f=l(),_=t("section"),D=t("div"),F=t("div"),$(he.$$.fragment),ba=l(),ge=t("h2"),ge.textContent=Hn,Ca=l(),xe=t("div"),xe.innerHTML=Vn,Ea=l(),Mt=t("section"),W=t("div"),J=t("div"),$(_e.$$.fragment),Ia=l(),be=t("h2"),be.textContent=kn,$a=l(),x=t("div"),A=t("div"),Ce=t("h3"),$(Ee.$$.fragment),ya=h(`
							Models API`),Ta=l(),Ie=t("p"),Ie.textContent=An,Pa=l(),Q=t("div"),Ot=t("div"),Ot.innerHTML=Mn,wa=l(),$e=t("div"),ye=t("h4"),ye.textContent=On,Da=l(),Lt=t("div"),Gt=t("code"),Ha=h(Ln),Va=l(),M=t("div"),Te=t("h3"),$(Pe.$$.fragment),ka=h(`
							Providers API`),Aa=l(),we=t("p"),we.textContent=Gn,Ma=l(),ee=t("div"),jt=t("div"),jt.innerHTML=jn,Oa=l(),De=t("div"),He=t("h4"),He.textContent=Sn,La=l(),St=t("div"),Rt=t("code"),Ga=h(Rn),ja=l(),O=t("div"),Ve=t("h3"),$(ke.$$.fragment),Sa=h(`
							Supported Models API`),Ra=l(),Ae=t("p"),Ae.textContent=Xn,Xa=l(),te=t("div"),Xt=t("div"),Xt.innerHTML=Un,Ua=l(),Me=t("div"),Oe=t("h4"),Oe.textContent=qn,qa=l(),Ut=t("div"),qt=t("code"),za=h(zn),Na=l(),L=t("div"),Le=t("h3"),$(Ge.$$.fragment),Ka=h(`
							Provider List API`),Ba=l(),je=t("p"),je.textContent=Nn,Ya=l(),se=t("div"),zt=t("div"),zt.innerHTML=Kn,Za=l(),Se=t("div"),Re=t("h4"),Re.textContent=Bn,Fa=l(),Nt=t("div"),Kt=t("code"),Wa=h(Yn),Ja=l(),G=t("div"),Xe=t("h3"),$(Ue.$$.fragment),Qa=h(`
							Configuration Management APIs`),eo=l(),qe=t("p"),qe.textContent=Zn,to=l(),w=t("div"),j=t("div"),ze=t("h4"),ze.textContent=Fn,so=l(),Ne=t("div"),Ne.innerHTML=Wn,ao=l(),Bt=t("div"),Yt=t("code"),oo=h(Jn),no=l(),S=t("div"),Ke=t("h4"),Ke.textContent=Qn,lo=l(),Be=t("div"),Be.innerHTML=el,ro=l(),Zt=t("div"),Ft=t("code"),io=h(tl),co=l(),R=t("div"),Ye=t("h4"),Ye.textContent=sl,po=l(),Ze=t("div"),Ze.innerHTML=al,mo=l(),Wt=t("div"),Jt=t("code"),vo=h(ol),uo=l(),X=t("div"),Fe=t("h4"),Fe.textContent=nl,fo=l(),We=t("div"),We.innerHTML=ll,ho=l(),Qt=t("div"),es=t("code"),go=h(rl),xo=l(),U=t("div"),Je=t("h4"),Je.textContent=dl,_o=l(),Qe=t("div"),Qe.innerHTML=il,bo=l(),ts=t("div"),ss=t("code"),Co=h(cl),Eo=l(),q=t("div"),et=t("h3"),$(tt.$$.fragment),Io=h(`
							Service Info API`),$o=l(),st=t("p"),st.textContent=pl,yo=l(),ae=t("div"),as=t("div"),as.innerHTML=ml,To=l(),at=t("div"),ot=t("h4"),ot.textContent=vl,Po=l(),os=t("div"),ns=t("code"),wo=h(ul),Do=l(),z=t("div"),nt=t("h3"),$(lt.$$.fragment),Ho=h(`
							Configuration API`),Vo=l(),rt=t("p"),rt.textContent=fl,ko=l(),oe=t("div"),ls=t("div"),ls.innerHTML=hl,Ao=l(),dt=t("div"),it=t("h4"),it.textContent=gl,Mo=l(),rs=t("div"),ds=t("code"),Oo=h(xl),Lo=l(),N=t("div"),ct=t("h3"),$(pt.$$.fragment),Go=h(`
							Health API`),jo=l(),mt=t("p"),mt.textContent=_l,So=l(),ne=t("div"),is=t("div"),is.innerHTML=bl,Ro=l(),vt=t("div"),ut=t("h4"),ut.textContent=Cl,Xo=l(),cs=t("div"),ps=t("code"),Uo=h(El),qo=l(),ms=t("section"),H=t("div"),le=t("div"),$(ft.$$.fragment),zo=l(),ht=t("h2"),ht.textContent=Il,No=l(),gt=t("p"),gt.textContent=$l,Ko=l(),V=t("div"),K=t("div"),xt=t("h3"),xt.textContent=yl,Bo=l(),_t=t("p"),_t.textContent=Tl,Yo=l(),re=t("div"),vs=t("div"),vs.innerHTML=Pl,Zo=l(),bt=t("div"),Ct=t("h4"),Ct.textContent=wl,Fo=l(),us=t("div"),fs=t("code"),Wo=h(Dl),Jo=l(),B=t("div"),Et=t("h3"),Et.textContent=Hl,Qo=l(),It=t("p"),It.textContent=Vl,en=l(),de=t("div"),hs=t("div"),hs.innerHTML=kl,tn=l(),$t=t("div"),yt=t("h4"),yt.textContent=Al,sn=l(),gs=t("div"),xs=t("code"),an=h(Ml),on=l(),Y=t("div"),Tt=t("h3"),Tt.textContent=Ol,nn=l(),Pt=t("p"),Pt.textContent=Ll,ln=l(),ie=t("div"),_s=t("div"),_s.innerHTML=Gl,rn=l(),wt=t("div"),Dt=t("h4"),Dt.textContent=jl,dn=l(),bs=t("div"),Cs=t("code"),cn=h(Sl),pn=l(),Es=t("section"),ce=t("div"),Ht=t("h2"),Ht.textContent=Rl,mn=l(),pe=t("div"),Vt=t("div"),Vt.innerHTML=Xl,vn=l(),me=t("div"),kt=t("h3"),kt.textContent=Ul,un=l(),Is=t("div"),$s=t("code"),fn=h(ql),hn=l(),At=t("section"),At.innerHTML=zl,gn=l(),ve=t("div"),$(ue.$$.fragment),xn=l(),$(fe.$$.fragment),this.h()},l(v){i=s(v,"DIV",{class:!0});var Z=n(i);p=s(Z,"DIV",{class:!0});var b=n(p);m=s(b,"DIV",{class:!0,"data-svelte-h":!0}),d(m)!=="svelte-i1l7sj"&&(m.innerHTML=c),f=r(b),_=s(b,"SECTION",{class:!0});var qs=n(_);D=s(qs,"DIV",{class:!0});var Ns=n(D);F=s(Ns,"DIV",{class:!0});var Ks=n(F);y(he.$$.fragment,Ks),ba=r(Ks),ge=s(Ks,"H2",{class:!0,"data-svelte-h":!0}),d(ge)!=="svelte-1g1ysmf"&&(ge.textContent=Hn),Ks.forEach(o),Ca=r(Ns),xe=s(Ns,"DIV",{class:!0,"data-svelte-h":!0}),d(xe)!=="svelte-jbwp41"&&(xe.innerHTML=Vn),Ns.forEach(o),qs.forEach(o),Ea=r(b),Mt=s(b,"SECTION",{class:!0});var Nl=n(Mt);W=s(Nl,"DIV",{class:!0});var Bs=n(W);J=s(Bs,"DIV",{class:!0});var Ys=n(J);y(_e.$$.fragment,Ys),Ia=r(Ys),be=s(Ys,"H2",{class:!0,"data-svelte-h":!0}),d(be)!=="svelte-1y5nyj6"&&(be.textContent=kn),Ys.forEach(o),$a=r(Bs),x=s(Bs,"DIV",{class:!0});var I=n(x);A=s(I,"DIV",{});var ys=n(A);Ce=s(ys,"H3",{class:!0});var _n=n(Ce);y(Ee.$$.fragment,_n),ya=g(_n,`
							Models API`),_n.forEach(o),Ta=r(ys),Ie=s(ys,"P",{class:!0,"data-svelte-h":!0}),d(Ie)!=="svelte-16l7pg0"&&(Ie.textContent=An),Pa=r(ys),Q=s(ys,"DIV",{class:!0});var Zs=n(Q);Ot=s(Zs,"DIV",{"data-svelte-h":!0}),d(Ot)!=="svelte-yy1h00"&&(Ot.innerHTML=Mn),wa=r(Zs),$e=s(Zs,"DIV",{});var Fs=n($e);ye=s(Fs,"H4",{class:!0,"data-svelte-h":!0}),d(ye)!=="svelte-nkj2fj"&&(ye.textContent=On),Da=r(Fs),Lt=s(Fs,"DIV",{class:!0});var Kl=n(Lt);Gt=s(Kl,"CODE",{class:!0});var Bl=n(Gt);Ha=g(Bl,Ln),Bl.forEach(o),Kl.forEach(o),Fs.forEach(o),Zs.forEach(o),ys.forEach(o),Va=r(I),M=s(I,"DIV",{});var Ts=n(M);Te=s(Ts,"H3",{class:!0});var bn=n(Te);y(Pe.$$.fragment,bn),ka=g(bn,`
							Providers API`),bn.forEach(o),Aa=r(Ts),we=s(Ts,"P",{class:!0,"data-svelte-h":!0}),d(we)!=="svelte-quw76s"&&(we.textContent=Gn),Ma=r(Ts),ee=s(Ts,"DIV",{class:!0});var Ws=n(ee);jt=s(Ws,"DIV",{"data-svelte-h":!0}),d(jt)!=="svelte-kz8v0x"&&(jt.innerHTML=jn),Oa=r(Ws),De=s(Ws,"DIV",{});var Js=n(De);He=s(Js,"H4",{class:!0,"data-svelte-h":!0}),d(He)!=="svelte-nkj2fj"&&(He.textContent=Sn),La=r(Js),St=s(Js,"DIV",{class:!0});var Yl=n(St);Rt=s(Yl,"CODE",{class:!0});var Zl=n(Rt);Ga=g(Zl,Rn),Zl.forEach(o),Yl.forEach(o),Js.forEach(o),Ws.forEach(o),Ts.forEach(o),ja=r(I),O=s(I,"DIV",{});var Ps=n(O);Ve=s(Ps,"H3",{class:!0});var Cn=n(Ve);y(ke.$$.fragment,Cn),Sa=g(Cn,`
							Supported Models API`),Cn.forEach(o),Ra=r(Ps),Ae=s(Ps,"P",{class:!0,"data-svelte-h":!0}),d(Ae)!=="svelte-12fxrzb"&&(Ae.textContent=Xn),Xa=r(Ps),te=s(Ps,"DIV",{class:!0});var Qs=n(te);Xt=s(Qs,"DIV",{"data-svelte-h":!0}),d(Xt)!=="svelte-q1jqfm"&&(Xt.innerHTML=Un),Ua=r(Qs),Me=s(Qs,"DIV",{});var ea=n(Me);Oe=s(ea,"H4",{class:!0,"data-svelte-h":!0}),d(Oe)!=="svelte-nkj2fj"&&(Oe.textContent=qn),qa=r(ea),Ut=s(ea,"DIV",{class:!0});var Fl=n(Ut);qt=s(Fl,"CODE",{class:!0});var Wl=n(qt);za=g(Wl,zn),Wl.forEach(o),Fl.forEach(o),ea.forEach(o),Qs.forEach(o),Ps.forEach(o),Na=r(I),L=s(I,"DIV",{});var ws=n(L);Le=s(ws,"H3",{class:!0});var En=n(Le);y(Ge.$$.fragment,En),Ka=g(En,`
							Provider List API`),En.forEach(o),Ba=r(ws),je=s(ws,"P",{class:!0,"data-svelte-h":!0}),d(je)!=="svelte-qnfcy1"&&(je.textContent=Nn),Ya=r(ws),se=s(ws,"DIV",{class:!0});var ta=n(se);zt=s(ta,"DIV",{"data-svelte-h":!0}),d(zt)!=="svelte-s7238n"&&(zt.innerHTML=Kn),Za=r(ta),Se=s(ta,"DIV",{});var sa=n(Se);Re=s(sa,"H4",{class:!0,"data-svelte-h":!0}),d(Re)!=="svelte-nkj2fj"&&(Re.textContent=Bn),Fa=r(sa),Nt=s(sa,"DIV",{class:!0});var Jl=n(Nt);Kt=s(Jl,"CODE",{class:!0});var Ql=n(Kt);Wa=g(Ql,Yn),Ql.forEach(o),Jl.forEach(o),sa.forEach(o),ta.forEach(o),ws.forEach(o),Ja=r(I),G=s(I,"DIV",{});var Ds=n(G);Xe=s(Ds,"H3",{class:!0});var In=n(Xe);y(Ue.$$.fragment,In),Qa=g(In,`
							Configuration Management APIs`),In.forEach(o),eo=r(Ds),qe=s(Ds,"P",{class:!0,"data-svelte-h":!0}),d(qe)!=="svelte-fdnhn8"&&(qe.textContent=Zn),to=r(Ds),w=s(Ds,"DIV",{class:!0});var k=n(w);j=s(k,"DIV",{});var Hs=n(j);ze=s(Hs,"H4",{class:!0,"data-svelte-h":!0}),d(ze)!=="svelte-4dtjw1"&&(ze.textContent=Fn),so=r(Hs),Ne=s(Hs,"DIV",{class:!0,"data-svelte-h":!0}),d(Ne)!=="svelte-1bgj05n"&&(Ne.innerHTML=Wn),ao=r(Hs),Bt=s(Hs,"DIV",{class:!0});var er=n(Bt);Yt=s(er,"CODE",{class:!0});var tr=n(Yt);oo=g(tr,Jn),tr.forEach(o),er.forEach(o),Hs.forEach(o),no=r(k),S=s(k,"DIV",{});var Vs=n(S);Ke=s(Vs,"H4",{class:!0,"data-svelte-h":!0}),d(Ke)!=="svelte-55c1r5"&&(Ke.textContent=Qn),lo=r(Vs),Be=s(Vs,"DIV",{class:!0,"data-svelte-h":!0}),d(Be)!=="svelte-7pxt5i"&&(Be.innerHTML=el),ro=r(Vs),Zt=s(Vs,"DIV",{class:!0});var sr=n(Zt);Ft=s(sr,"CODE",{class:!0});var ar=n(Ft);io=g(ar,tl),ar.forEach(o),sr.forEach(o),Vs.forEach(o),co=r(k),R=s(k,"DIV",{});var ks=n(R);Ye=s(ks,"H4",{class:!0,"data-svelte-h":!0}),d(Ye)!=="svelte-bty523"&&(Ye.textContent=sl),po=r(ks),Ze=s(ks,"DIV",{class:!0,"data-svelte-h":!0}),d(Ze)!=="svelte-1hv2035"&&(Ze.innerHTML=al),mo=r(ks),Wt=s(ks,"DIV",{class:!0});var or=n(Wt);Jt=s(or,"CODE",{class:!0});var nr=n(Jt);vo=g(nr,ol),nr.forEach(o),or.forEach(o),ks.forEach(o),uo=r(k),X=s(k,"DIV",{});var As=n(X);Fe=s(As,"H4",{class:!0,"data-svelte-h":!0}),d(Fe)!=="svelte-1pmqm7"&&(Fe.textContent=nl),fo=r(As),We=s(As,"DIV",{class:!0,"data-svelte-h":!0}),d(We)!=="svelte-zkg31u"&&(We.innerHTML=ll),ho=r(As),Qt=s(As,"DIV",{class:!0});var lr=n(Qt);es=s(lr,"CODE",{class:!0});var rr=n(es);go=g(rr,rl),rr.forEach(o),lr.forEach(o),As.forEach(o),xo=r(k),U=s(k,"DIV",{});var Ms=n(U);Je=s(Ms,"H4",{class:!0,"data-svelte-h":!0}),d(Je)!=="svelte-y95rme"&&(Je.textContent=dl),_o=r(Ms),Qe=s(Ms,"DIV",{class:!0,"data-svelte-h":!0}),d(Qe)!=="svelte-9lbkdi"&&(Qe.innerHTML=il),bo=r(Ms),ts=s(Ms,"DIV",{class:!0});var dr=n(ts);ss=s(dr,"CODE",{class:!0});var ir=n(ss);Co=g(ir,cl),ir.forEach(o),dr.forEach(o),Ms.forEach(o),k.forEach(o),Ds.forEach(o),Eo=r(I),q=s(I,"DIV",{});var Os=n(q);et=s(Os,"H3",{class:!0});var $n=n(et);y(tt.$$.fragment,$n),Io=g($n,`
							Service Info API`),$n.forEach(o),$o=r(Os),st=s(Os,"P",{class:!0,"data-svelte-h":!0}),d(st)!=="svelte-ydgcin"&&(st.textContent=pl),yo=r(Os),ae=s(Os,"DIV",{class:!0});var aa=n(ae);as=s(aa,"DIV",{"data-svelte-h":!0}),d(as)!=="svelte-19ehzvn"&&(as.innerHTML=ml),To=r(aa),at=s(aa,"DIV",{});var oa=n(at);ot=s(oa,"H4",{class:!0,"data-svelte-h":!0}),d(ot)!=="svelte-nkj2fj"&&(ot.textContent=vl),Po=r(oa),os=s(oa,"DIV",{class:!0});var cr=n(os);ns=s(cr,"CODE",{class:!0});var pr=n(ns);wo=g(pr,ul),pr.forEach(o),cr.forEach(o),oa.forEach(o),aa.forEach(o),Os.forEach(o),Do=r(I),z=s(I,"DIV",{});var Ls=n(z);nt=s(Ls,"H3",{class:!0});var yn=n(nt);y(lt.$$.fragment,yn),Ho=g(yn,`
							Configuration API`),yn.forEach(o),Vo=r(Ls),rt=s(Ls,"P",{class:!0,"data-svelte-h":!0}),d(rt)!=="svelte-1xl09sv"&&(rt.textContent=fl),ko=r(Ls),oe=s(Ls,"DIV",{class:!0});var na=n(oe);ls=s(na,"DIV",{"data-svelte-h":!0}),d(ls)!=="svelte-1ytj6v"&&(ls.innerHTML=hl),Ao=r(na),dt=s(na,"DIV",{});var la=n(dt);it=s(la,"H4",{class:!0,"data-svelte-h":!0}),d(it)!=="svelte-nkj2fj"&&(it.textContent=gl),Mo=r(la),rs=s(la,"DIV",{class:!0});var mr=n(rs);ds=s(mr,"CODE",{class:!0});var vr=n(ds);Oo=g(vr,xl),vr.forEach(o),mr.forEach(o),la.forEach(o),na.forEach(o),Ls.forEach(o),Lo=r(I),N=s(I,"DIV",{});var Gs=n(N);ct=s(Gs,"H3",{class:!0});var Tn=n(ct);y(pt.$$.fragment,Tn),Go=g(Tn,`
							Health API`),Tn.forEach(o),jo=r(Gs),mt=s(Gs,"P",{class:!0,"data-svelte-h":!0}),d(mt)!=="svelte-1pp5eqi"&&(mt.textContent=_l),So=r(Gs),ne=s(Gs,"DIV",{class:!0});var ra=n(ne);is=s(ra,"DIV",{"data-svelte-h":!0}),d(is)!=="svelte-1aymo75"&&(is.innerHTML=bl),Ro=r(ra),vt=s(ra,"DIV",{});var da=n(vt);ut=s(da,"H4",{class:!0,"data-svelte-h":!0}),d(ut)!=="svelte-nkj2fj"&&(ut.textContent=Cl),Xo=r(da),cs=s(da,"DIV",{class:!0});var ur=n(cs);ps=s(ur,"CODE",{class:!0});var fr=n(ps);Uo=g(fr,El),fr.forEach(o),ur.forEach(o),da.forEach(o),ra.forEach(o),Gs.forEach(o),I.forEach(o),Bs.forEach(o),Nl.forEach(o),qo=r(b),ms=s(b,"SECTION",{class:!0});var hr=n(ms);H=s(hr,"DIV",{class:!0});var js=n(H);le=s(js,"DIV",{class:!0});var ia=n(le);y(ft.$$.fragment,ia),zo=r(ia),ht=s(ia,"H2",{class:!0,"data-svelte-h":!0}),d(ht)!=="svelte-1j4ijhn"&&(ht.textContent=Il),ia.forEach(o),No=r(js),gt=s(js,"P",{class:!0,"data-svelte-h":!0}),d(gt)!=="svelte-z7y22e"&&(gt.textContent=$l),Ko=r(js),V=s(js,"DIV",{class:!0});var Ss=n(V);K=s(Ss,"DIV",{});var Rs=n(K);xt=s(Rs,"H3",{class:!0,"data-svelte-h":!0}),d(xt)!=="svelte-13fg7im"&&(xt.textContent=yl),Bo=r(Rs),_t=s(Rs,"P",{class:!0,"data-svelte-h":!0}),d(_t)!=="svelte-1cmrc6k"&&(_t.textContent=Tl),Yo=r(Rs),re=s(Rs,"DIV",{class:!0});var ca=n(re);vs=s(ca,"DIV",{"data-svelte-h":!0}),d(vs)!=="svelte-dsp2r9"&&(vs.innerHTML=Pl),Zo=r(ca),bt=s(ca,"DIV",{});var pa=n(bt);Ct=s(pa,"H4",{class:!0,"data-svelte-h":!0}),d(Ct)!=="svelte-nkj2fj"&&(Ct.textContent=wl),Fo=r(pa),us=s(pa,"DIV",{class:!0});var gr=n(us);fs=s(gr,"CODE",{class:!0});var xr=n(fs);Wo=g(xr,Dl),xr.forEach(o),gr.forEach(o),pa.forEach(o),ca.forEach(o),Rs.forEach(o),Jo=r(Ss),B=s(Ss,"DIV",{});var Xs=n(B);Et=s(Xs,"H3",{class:!0,"data-svelte-h":!0}),d(Et)!=="svelte-1x6ey2x"&&(Et.textContent=Hl),Qo=r(Xs),It=s(Xs,"P",{class:!0,"data-svelte-h":!0}),d(It)!=="svelte-f1bevk"&&(It.textContent=Vl),en=r(Xs),de=s(Xs,"DIV",{class:!0});var ma=n(de);hs=s(ma,"DIV",{"data-svelte-h":!0}),d(hs)!=="svelte-1fhyldj"&&(hs.innerHTML=kl),tn=r(ma),$t=s(ma,"DIV",{});var va=n($t);yt=s(va,"H4",{class:!0,"data-svelte-h":!0}),d(yt)!=="svelte-nkj2fj"&&(yt.textContent=Al),sn=r(va),gs=s(va,"DIV",{class:!0});var _r=n(gs);xs=s(_r,"CODE",{class:!0});var br=n(xs);an=g(br,Ml),br.forEach(o),_r.forEach(o),va.forEach(o),ma.forEach(o),Xs.forEach(o),on=r(Ss),Y=s(Ss,"DIV",{});var Us=n(Y);Tt=s(Us,"H3",{class:!0,"data-svelte-h":!0}),d(Tt)!=="svelte-z5u8wu"&&(Tt.textContent=Ol),nn=r(Us),Pt=s(Us,"P",{class:!0,"data-svelte-h":!0}),d(Pt)!=="svelte-g9g3va"&&(Pt.textContent=Ll),ln=r(Us),ie=s(Us,"DIV",{class:!0});var ua=n(ie);_s=s(ua,"DIV",{"data-svelte-h":!0}),d(_s)!=="svelte-o4om0y"&&(_s.innerHTML=Gl),rn=r(ua),wt=s(ua,"DIV",{});var fa=n(wt);Dt=s(fa,"H4",{class:!0,"data-svelte-h":!0}),d(Dt)!=="svelte-nkj2fj"&&(Dt.textContent=jl),dn=r(fa),bs=s(fa,"DIV",{class:!0});var Cr=n(bs);Cs=s(Cr,"CODE",{class:!0});var Er=n(Cs);cn=g(Er,Sl),Er.forEach(o),Cr.forEach(o),fa.forEach(o),ua.forEach(o),Us.forEach(o),Ss.forEach(o),js.forEach(o),hr.forEach(o),pn=r(b),Es=s(b,"SECTION",{class:!0});var Ir=n(Es);ce=s(Ir,"DIV",{class:!0});var ha=n(ce);Ht=s(ha,"H2",{class:!0,"data-svelte-h":!0}),d(Ht)!=="svelte-fojgu5"&&(Ht.textContent=Rl),mn=r(ha),pe=s(ha,"DIV",{class:!0});var ga=n(pe);Vt=s(ga,"DIV",{class:!0,"data-svelte-h":!0}),d(Vt)!=="svelte-1p7zcuu"&&(Vt.innerHTML=Xl),vn=r(ga),me=s(ga,"DIV",{class:!0});var xa=n(me);kt=s(xa,"H3",{class:!0,"data-svelte-h":!0}),d(kt)!=="svelte-1i4szvk"&&(kt.textContent=Ul),un=r(xa),Is=s(xa,"DIV",{class:!0});var $r=n(Is);$s=s($r,"CODE",{class:!0});var yr=n($s);fn=g(yr,ql),yr.forEach(o),$r.forEach(o),xa.forEach(o),ga.forEach(o),ha.forEach(o),Ir.forEach(o),hn=r(b),At=s(b,"SECTION",{class:!0,"data-svelte-h":!0}),d(At)!=="svelte-i3reia"&&(At.innerHTML=zl),gn=r(b),ve=s(b,"DIV",{class:!0});var _a=n(ve);y(ue.$$.fragment,_a),xn=r(_a),y(fe.$$.fragment,_a),_a.forEach(o),b.forEach(o),Z.forEach(o),this.h()},h(){a(m,"class","mb-8"),a(ge,"class","text-2xl font-semibold"),a(F,"class","flex items-center mb-6"),a(xe,"class","grid gap-6 md:grid-cols-2"),a(D,"class","rounded-lg border bg-card p-6"),a(_,"class","mb-12"),a(be,"class","text-2xl font-semibold"),a(J,"class","flex items-center mb-6"),a(Ce,"class","text-lg font-medium mb-3 flex items-center"),a(Ie,"class","text-sm text-muted-foreground mb-4"),a(ye,"class","font-medium mb-2"),a(Gt,"class","text-sm font-mono whitespace-pre-wrap"),a(Lt,"class","bg-muted rounded-md p-4"),a(Q,"class","space-y-4"),a(Te,"class","text-lg font-medium mb-3 flex items-center"),a(we,"class","text-sm text-muted-foreground mb-4"),a(He,"class","font-medium mb-2"),a(Rt,"class","text-sm font-mono whitespace-pre-wrap"),a(St,"class","bg-muted rounded-md p-4"),a(ee,"class","space-y-4"),a(Ve,"class","text-lg font-medium mb-3 flex items-center"),a(Ae,"class","text-sm text-muted-foreground mb-4"),a(Oe,"class","font-medium mb-2"),a(qt,"class","text-sm font-mono whitespace-pre-wrap"),a(Ut,"class","bg-muted rounded-md p-4"),a(te,"class","space-y-4"),a(Le,"class","text-lg font-medium mb-3 flex items-center"),a(je,"class","text-sm text-muted-foreground mb-4"),a(Re,"class","font-medium mb-2"),a(Kt,"class","text-sm font-mono whitespace-pre-wrap"),a(Nt,"class","bg-muted rounded-md p-4"),a(se,"class","space-y-4"),a(Xe,"class","text-lg font-medium mb-3 flex items-center"),a(qe,"class","text-sm text-muted-foreground mb-4"),a(ze,"class","font-medium mb-2"),a(Ne,"class","bg-muted rounded p-3 mb-3"),a(Yt,"class","text-sm font-mono whitespace-pre-wrap"),a(Bt,"class","bg-muted rounded-md p-4"),a(Ke,"class","font-medium mb-2"),a(Be,"class","bg-muted rounded p-3 mb-3"),a(Ft,"class","text-sm font-mono whitespace-pre-wrap"),a(Zt,"class","bg-muted rounded-md p-4"),a(Ye,"class","font-medium mb-2"),a(Ze,"class","bg-muted rounded p-3 mb-3"),a(Jt,"class","text-sm font-mono whitespace-pre-wrap"),a(Wt,"class","bg-muted rounded-md p-4"),a(Fe,"class","font-medium mb-2"),a(We,"class","bg-muted rounded p-3 mb-3"),a(es,"class","text-sm font-mono whitespace-pre-wrap"),a(Qt,"class","bg-muted rounded-md p-4"),a(Je,"class","font-medium mb-2"),a(Qe,"class","grid gap-2 md:grid-cols-2 mb-3"),a(ss,"class","text-sm font-mono whitespace-pre-wrap"),a(ts,"class","bg-muted rounded-md p-4"),a(w,"class","space-y-6"),a(et,"class","text-lg font-medium mb-3 flex items-center"),a(st,"class","text-sm text-muted-foreground mb-4"),a(ot,"class","font-medium mb-2"),a(ns,"class","text-sm font-mono whitespace-pre-wrap"),a(os,"class","bg-muted rounded-md p-4"),a(ae,"class","space-y-4"),a(nt,"class","text-lg font-medium mb-3 flex items-center"),a(rt,"class","text-sm text-muted-foreground mb-4"),a(it,"class","font-medium mb-2"),a(ds,"class","text-sm font-mono whitespace-pre-wrap"),a(rs,"class","bg-muted rounded-md p-4"),a(oe,"class","space-y-4"),a(ct,"class","text-lg font-medium mb-3 flex items-center"),a(mt,"class","text-sm text-muted-foreground mb-4"),a(ut,"class","font-medium mb-2"),a(ps,"class","text-sm font-mono whitespace-pre-wrap"),a(cs,"class","bg-muted rounded-md p-4"),a(ne,"class","space-y-4"),a(x,"class","space-y-8"),a(W,"class","rounded-lg border bg-card p-6"),a(Mt,"class","mb-12"),a(ht,"class","text-2xl font-semibold"),a(le,"class","flex items-center mb-6"),a(gt,"class","text-sm text-muted-foreground mb-6"),a(xt,"class","text-lg font-medium mb-3"),a(_t,"class","text-sm text-muted-foreground mb-4"),a(Ct,"class","font-medium mb-2"),a(fs,"class","text-sm font-mono whitespace-pre-wrap"),a(us,"class","bg-muted rounded-md p-4"),a(re,"class","space-y-4"),a(Et,"class","text-lg font-medium mb-3"),a(It,"class","text-sm text-muted-foreground mb-4"),a(yt,"class","font-medium mb-2"),a(xs,"class","text-sm font-mono whitespace-pre-wrap"),a(gs,"class","bg-muted rounded-md p-4"),a(de,"class","space-y-4"),a(Tt,"class","text-lg font-medium mb-3"),a(Pt,"class","text-sm text-muted-foreground mb-4"),a(Dt,"class","font-medium mb-2"),a(Cs,"class","text-sm font-mono whitespace-pre-wrap"),a(bs,"class","bg-muted rounded-md p-4"),a(ie,"class","space-y-4"),a(V,"class","space-y-8"),a(H,"class","rounded-lg border bg-card p-6"),a(ms,"class","mb-12"),a(Ht,"class","text-2xl font-semibold mb-6"),a(Vt,"class","border-l-4 border-red-400 pl-4"),a(kt,"class","font-medium mb-2"),a($s,"class","text-sm font-mono"),a(Is,"class","bg-muted rounded-md p-4"),a(me,"class","border-l-4 border-yellow-400 pl-4"),a(pe,"class","space-y-4"),a(ce,"class","rounded-lg border bg-card p-6"),a(Es,"class","mb-12"),a(At,"class","mb-12"),a(ve,"class","mt-12 text-center"),a(p,"class","max-w-6xl mx-auto"),a(i,"class","container py-8")},m(v,Z){Dn(v,i,Z),e(i,p),e(p,m),e(p,f),e(p,_),e(_,D),e(D,F),T(he,F,null),e(F,ba),e(F,ge),e(D,Ca),e(D,xe),e(p,Ea),e(p,Mt),e(Mt,W),e(W,J),T(_e,J,null),e(J,Ia),e(J,be),e(W,$a),e(W,x),e(x,A),e(A,Ce),T(Ee,Ce,null),e(Ce,ya),e(A,Ta),e(A,Ie),e(A,Pa),e(A,Q),e(Q,Ot),e(Q,wa),e(Q,$e),e($e,ye),e($e,Da),e($e,Lt),e(Lt,Gt),e(Gt,Ha),e(x,Va),e(x,M),e(M,Te),T(Pe,Te,null),e(Te,ka),e(M,Aa),e(M,we),e(M,Ma),e(M,ee),e(ee,jt),e(ee,Oa),e(ee,De),e(De,He),e(De,La),e(De,St),e(St,Rt),e(Rt,Ga),e(x,ja),e(x,O),e(O,Ve),T(ke,Ve,null),e(Ve,Sa),e(O,Ra),e(O,Ae),e(O,Xa),e(O,te),e(te,Xt),e(te,Ua),e(te,Me),e(Me,Oe),e(Me,qa),e(Me,Ut),e(Ut,qt),e(qt,za),e(x,Na),e(x,L),e(L,Le),T(Ge,Le,null),e(Le,Ka),e(L,Ba),e(L,je),e(L,Ya),e(L,se),e(se,zt),e(se,Za),e(se,Se),e(Se,Re),e(Se,Fa),e(Se,Nt),e(Nt,Kt),e(Kt,Wa),e(x,Ja),e(x,G),e(G,Xe),T(Ue,Xe,null),e(Xe,Qa),e(G,eo),e(G,qe),e(G,to),e(G,w),e(w,j),e(j,ze),e(j,so),e(j,Ne),e(j,ao),e(j,Bt),e(Bt,Yt),e(Yt,oo),e(w,no),e(w,S),e(S,Ke),e(S,lo),e(S,Be),e(S,ro),e(S,Zt),e(Zt,Ft),e(Ft,io),e(w,co),e(w,R),e(R,Ye),e(R,po),e(R,Ze),e(R,mo),e(R,Wt),e(Wt,Jt),e(Jt,vo),e(w,uo),e(w,X),e(X,Fe),e(X,fo),e(X,We),e(X,ho),e(X,Qt),e(Qt,es),e(es,go),e(w,xo),e(w,U),e(U,Je),e(U,_o),e(U,Qe),e(U,bo),e(U,ts),e(ts,ss),e(ss,Co),e(x,Eo),e(x,q),e(q,et),T(tt,et,null),e(et,Io),e(q,$o),e(q,st),e(q,yo),e(q,ae),e(ae,as),e(ae,To),e(ae,at),e(at,ot),e(at,Po),e(at,os),e(os,ns),e(ns,wo),e(x,Do),e(x,z),e(z,nt),T(lt,nt,null),e(nt,Ho),e(z,Vo),e(z,rt),e(z,ko),e(z,oe),e(oe,ls),e(oe,Ao),e(oe,dt),e(dt,it),e(dt,Mo),e(dt,rs),e(rs,ds),e(ds,Oo),e(x,Lo),e(x,N),e(N,ct),T(pt,ct,null),e(ct,Go),e(N,jo),e(N,mt),e(N,So),e(N,ne),e(ne,is),e(ne,Ro),e(ne,vt),e(vt,ut),e(vt,Xo),e(vt,cs),e(cs,ps),e(ps,Uo),e(p,qo),e(p,ms),e(ms,H),e(H,le),T(ft,le,null),e(le,zo),e(le,ht),e(H,No),e(H,gt),e(H,Ko),e(H,V),e(V,K),e(K,xt),e(K,Bo),e(K,_t),e(K,Yo),e(K,re),e(re,vs),e(re,Zo),e(re,bt),e(bt,Ct),e(bt,Fo),e(bt,us),e(us,fs),e(fs,Wo),e(V,Jo),e(V,B),e(B,Et),e(B,Qo),e(B,It),e(B,en),e(B,de),e(de,hs),e(de,tn),e(de,$t),e($t,yt),e($t,sn),e($t,gs),e(gs,xs),e(xs,an),e(V,on),e(V,Y),e(Y,Tt),e(Y,nn),e(Y,Pt),e(Y,ln),e(Y,ie),e(ie,_s),e(ie,rn),e(ie,wt),e(wt,Dt),e(wt,dn),e(wt,bs),e(bs,Cs),e(Cs,cn),e(p,pn),e(p,Es),e(Es,ce),e(ce,Ht),e(ce,mn),e(ce,pe),e(pe,Vt),e(pe,vn),e(pe,me),e(me,kt),e(me,un),e(me,Is),e(Is,$s),e($s,fn),e(p,hn),e(p,At),e(p,gn),e(p,ve),T(ue,ve,null),e(ve,xn),T(fe,ve,null),zs=!0},p(v,[Z]){const b={};Z&4&&(b.$$scope={dirty:Z,ctx:v}),ue.$set(b);const qs={};Z&4&&(qs.$$scope={dirty:Z,ctx:v}),fe.$set(qs)},i(v){zs||(C(he.$$.fragment,v),C(_e.$$.fragment,v),C(Ee.$$.fragment,v),C(Pe.$$.fragment,v),C(ke.$$.fragment,v),C(Ge.$$.fragment,v),C(Ue.$$.fragment,v),C(tt.$$.fragment,v),C(lt.$$.fragment,v),C(pt.$$.fragment,v),C(ft.$$.fragment,v),C(ue.$$.fragment,v),C(fe.$$.fragment,v),zs=!0)},o(v){E(he.$$.fragment,v),E(_e.$$.fragment,v),E(Ee.$$.fragment,v),E(Pe.$$.fragment,v),E(ke.$$.fragment,v),E(Ge.$$.fragment,v),E(Ue.$$.fragment,v),E(tt.$$.fragment,v),E(lt.$$.fragment,v),E(pt.$$.fragment,v),E(ft.$$.fragment,v),E(ue.$$.fragment,v),E(fe.$$.fragment,v),zs=!1},d(v){v&&o(i),P(he),P(_e),P(Ee),P(Pe),P(ke),P(Ge),P(Ue),P(tt),P(lt),P(pt),P(ft),P(ue),P(fe)}}}function ed(u){return[qr,{models:`# Get all available models
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
}`,currentConfig:`# Get current configuration
curl -X GET http://localhost:8088/api/config/current

# Response example
{
  "provider": "openai",
  "model": "gpt-4",
  "has_api_key": true,
  "has_base_url": false,
  "supports_hot_reload": true
}`,validateKey:`# Validate API key before applying
curl -X POST http://localhost:8088/api/config/validate-key \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Response example
{
  "status": "valid",
  "message": "API key is valid and ready for hot update",
  "provider": "openai",
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable GPT-4 model"
    }
  ],
  "supports_hot_reload": true
}`,updateKey:`# Update API key without restart (hot reload)
curl -X POST http://localhost:8088/api/config/update-key \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Response example
{
  "status": "success",
  "message": "API key updated for provider: openai",
  "provider": "openai",
  "restart_required": false
}`,switchProvider:`# Switch to different provider dynamically
curl -X POST http://localhost:8088/api/config/switch-provider \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "api_key": "sk-ant-new-key-here"
  }'

# Response example
{
  "status": "success",
  "message": "Provider switched to: anthropic",
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "restart_required": false
}`,processManagement:`# Get process PID
curl -X GET http://localhost:8088/api/config/pid

# Response example
{
  "pid": 12345,
  "message": "Use this PID to restart the service"
}

# Trigger graceful shutdown
curl -X POST http://localhost:8088/api/config/shutdown

# Response example
{
  "status": "success",
  "message": "Shutdown signal sent. Please restart with new configuration."
}`,serviceInfo:`# Get comprehensive service information
curl -X GET http://localhost:8088/api/info

# Response example
{
  "service": "llm-link",
  "version": "0.3.3",
  "current_provider": "openai",
  "current_model": "gpt-4",
  "supported_providers": [
    {
      "name": "openai",
      "models": [
        {
          "id": "gpt-4",
          "name": "GPT-4",
          "description": "Most capable GPT-4 model"
        }
      ]
    }
  ],
  "api_endpoints": {
    "openai": {
      "path": "/v1",
      "enabled": true,
      "auth_required": true
    }
  }
}

# Get health status with instance info
curl -X GET http://localhost:8088/api/health

# Response example
{
  "status": "ok",
  "instance_id": 1729900050,
  "pid": 12345,
  "provider": "openai",
  "model": "gpt-4"
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
}`}]}class rd extends Ar{constructor(i){super(),Mr(this,i,ed,Qr,Vr,{})}}export{rd as component};

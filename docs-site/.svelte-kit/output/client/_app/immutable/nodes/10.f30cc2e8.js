import{s as st,k as rt,n as ot}from"../chunks/scheduler.f4350b81.js";import{S as nt,i as at,g as s,s as n,r as ee,m as Q,h as r,j as d,x as m,c as a,f as l,u as te,n as W,k as t,a as it,y as e,v as se,d as re,t as oe,w as ne}from"../chunks/index.9ea6f852.js";import{C as Me}from"../chunks/CodeBlock.818897d2.js";import{b as lt}from"../chunks/paths.02c97ffe.js";import{L as dt}from"../chunks/layers.307c17b9.js";function ct(g){let o,y,He=`<h1 class="text-4xl font-bold tracking-tight mb-4">Architecture</h1> <p class="text-lg text-muted-foreground">See how LLM Link is structured as a single service in front of many providers: client
			integrations, protocol adapters, provider connectors, and the control APIs that tie everything
			together.</p>`,ae,R,I,qe,ie,x,A,_,le,de,U,L,ce,T,De=`<h2 class="text-2xl font-semibold">Runtime components</h2> <p class="text-sm text-muted-foreground">LLM Link is a single Rust binary built on top of <code>axum</code> and <code>tokio</code>. Its runtime
			pipeline consists of three distinct stages:</p> <div class="grid gap-6 md:grid-cols-3"><div class="space-y-2 border-l-2 pl-4 border-muted"><h3 class="font-medium">1. CLI &amp; Config Loader</h3> <p class="text-sm text-muted-foreground">Parses arguments using <code>clap</code>. It determines whether to run in App Mode (e.g.,
					<code>--app zed</code>) or Protocol Mode. It generates a runtime <code>Settings</code> struct
					that defines active protocols, ports, and provider credentials.</p></div> <div class="space-y-2 border-l-2 pl-4 border-muted"><h3 class="font-medium">2. Protocol Adapters</h3> <p class="text-sm text-muted-foreground">Axum routes that mimic upstream APIs (OpenAI <code>/v1/chat/completions</code>, Anthropic
					<code>/v1/messages</code>, etc.). These adapters accept inbound requests, validate headers,
					and convert them into a unified internal request model.</p></div> <div class="space-y-2 border-l-2 pl-4 border-muted"><h3 class="font-medium">3. Connectors &amp; Normalizer</h3> <p class="text-sm text-muted-foreground">The core logic that dispatches the unified request to the configured provider (e.g., Zhipu,
					DeepSeek). The <strong>Normalizer</strong> handles the response, converting provider-specific
					JSON or SSE streams back into the format the client expects.</p></div></div>`,pe,h,P,Ne="Request flow",ue,k,ze="Trace the lifecycle of a request (e.g., from Codex CLI to Zhipu AI):",me,b,J,$,he,E,Ve=`<div class="flex gap-3"><div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium">1</div> <div><p class="font-medium text-foreground mb-1">Inbound Request</p>
						The client sends a standard OpenAI request. The <code>api/openai.rs</code> handler receives
						it and deserializes it using standard serde structs.</div></div> <div class="flex gap-3"><div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium">2</div> <div><p class="font-medium text-foreground mb-1">Internal Conversion</p>
						The handler converts the OpenAI request into a unified <code>ChatCompletionRequest</code>.
						This unifies differences between OpenAI, Anthropic, and Ollama inputs.</div></div> <div class="flex gap-3"><div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium">3</div> <div><p class="font-medium text-foreground mb-1">Provider Dispatch</p>
						The <code>Provider</code> trait implementation (e.g., <code>provider/zhipu.rs</code>) takes
						over, transforming the internal request into Zhipu&#39;s specific JSON format and signing headers.</div></div> <div class="flex gap-3"><div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium">4</div> <div><p class="font-medium text-foreground mb-1">Normalization</p>
						As chunks arrive from Zhipu, the <code>Normalizer</code> maps them back to standard OpenAI
						SSE chunks (deltas) in real-time, ensuring the client sees a perfect OpenAI simulation.</div></div>`,fe,u,S,Ze="Code structure",ve,O,Ge=`The codebase follows a layered architecture, separating configuration, external interfaces,
			core logic, and provider adapters.`,ge,w,xe,M,je=`<h3 class="font-medium text-sm">Where to start contributing?</h3> <ul class="text-xs text-muted-foreground space-y-2 list-disc pl-4"><li><strong>Adding a new Provider:</strong> Create a new file in <code>src/provider/</code> implementing
					the <code>Provider</code> trait, then register it in <code>src/provider/mod.rs</code>.</li> <li><strong>Adding a new App Preset:</strong> Add a new module in <code>src/apps/</code> to define
					default settings and CLI flags for the tool you want to support.</li> <li><strong>Improving Protocol Support:</strong> Modify handlers in <code>src/api/</code> to support
					more endpoints or fields from OpenAI/Anthropic specs.</li></ul>`,be,H,Re=`<h2 class="text-2xl font-semibold">Design principles</h2> <div class="space-y-4"><div><h3 class="text-lg font-medium">Single binary, many clients</h3> <p class="text-sm text-muted-foreground">One deployment serves editors, agents, and SDKs. This reduces operational overhead and
					provides a stable local API surface for all tools.</p></div> <div><h3 class="text-lg font-medium">Explicit API keys</h3> <p class="text-sm text-muted-foreground">Provider keys are passed via CLI or config APIs, not read from global env. This avoids
					accidental leakage and makes multi‑tenant setups safe.</p></div> <div><h3 class="text-lg font-medium">Stable local API surface</h3> <p class="text-sm text-muted-foreground">External tools only talk to LLM Link; provider churn stays behind it. Adding or swapping
					providers never requires client changes.</p></div> <div><h3 class="text-lg font-medium">Extensible connectors</h3> <p class="text-sm text-muted-foreground">New providers live under <code>src/provider</code> without touching callers. The internal
					interface stays the same, only the concrete implementation changes.</p></div></div>`,Ce,q,Ue='<h2 class="text-2xl font-semibold">Control APIs</h2> <p class="text-sm text-muted-foreground">Use the built‑in HTTP APIs to inspect and update the running service:</p> <ul class="text-sm text-muted-foreground list-disc pl-5 space-y-1"><li><code>GET /api/health</code> – service health and version</li> <li><code>GET /api/providers</code> – configured providers</li> <li><code>GET /api/models</code> – available models</li> <li><code>POST /api/config/update</code> – update keys and settings at runtime</li></ul>',ye,f,D,Je="Next steps",Ie,N,Be="Dive into dedicated guides for specific editors, agents, and protocol setups:",Ae,p,z,_e,Le,V,Te,Pe,Z,ke,$e,G,Ee,Se,j,Oe,F;return _=new dt({props:{class:"h-6 w-6 mr-2 text-primary"}}),L=new Me({props:{language:"bash",code:`┌──────────────────────────────────────────────────────────┐
│                    Editors / Agents                      │
│  Zed.dev  •  Codex CLI  •  Continue.dev  │
└─────────────────────┬────────────────────────────────────┘
                      │ HTTP (OpenAI/Anthropic/Ollama style)
                      ▼
┌──────────────────────────────────────────────────────────┐
│                     LLM Link                             │
│  ┌─────────────────┐   ┌─────────────────────────────┐   │
│  │ CLI & App       │   │ Protocol Layer              │   │
│  │ Presets         │   │ • OpenAI / Anthropic        │   │
│  │ (--app zed…)    │   │ • Unified request format    │   │
│  └─────────────────┘   └─────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Normalizer                                        │   │
│  │ • Shape requests/responses across providers       │   │
│  │ • Streaming helpers                               │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────┬────────────────────────────────────┘
                      │ Provider-specific HTTP calls
                      ▼
┌──────────────────────────────────────────────────────────┐
│                Provider Connectors                       │
│  OpenAI • Anthropic • Zhipu • Volcengine • Moonshot      │
│  Minimax • Tencent • Aliyun • Longcat • Ollama           │
└──────────────────────────────────────────────────────────┘`}}),$=new Me({props:{language:"bash",code:`      Client (Codex CLI)
             │
             ▼
   POST /v1/chat/completions
             │
┌───────────────────────────┐
│      Protocol Layer       │
│     (api/openai.rs)       │
└────────────┬──────────────┘
             ▼
┌───────────────────────────┐
│     Connector (Zhipu)     │
│    (provider/zhipu.rs)    │
└────────────┬──────────────┘
             ▼
┌───────────────────────────┐
│        Normalizer         │
│    (src/normalizer/*)     │
└────────────┬──────────────┘
             ▼
 Client receives OpenAI stream`}}),w=new Me({props:{language:"bash",code:`src/
├── 1. Entry & Config
│   ├── main.rs           # Application entry point & server startup
│   ├── cli/              # CLI argument parsing & command handling
│   ├── apps/             # App presets (Zed, Codex) configuration logic
│   └── settings.rs       # Global configuration structs
│
├── 2. Interfaces (Inbound)
│   └── api/              # Axum handlers for external protocols
│       ├── openai.rs     # /v1/chat/completions, /v1/models
│       ├── anthropic.rs  # /v1/messages
│       └── ollama.rs     # /api/generate, /api/chat
│
├── 3. Core Logic
│   ├── service.rs        # Shared AppState & service lifecycle management
│   ├── normalizer/       # Unified request/response shaping & streaming adapters
│   └── models/           # Internal unified data models
│
└── 4. Providers (Outbound)
    └── provider/         # Concrete adapter implementations
        ├── zhipu.rs      # Zhipu AI (GLM) client
        ├── aliyun.rs     # Aliyun (Qwen) client
        ├── volcengine.rs # Volcengine (Doubao) client
        └── ...`}}),{c(){o=s("div"),y=s("div"),y.innerHTML=He,ae=n(),R=s("div"),I=s("img"),ie=n(),x=s("section"),A=s("h2"),ee(_.$$.fragment),le=Q(`
			High-level Diagram`),de=n(),U=s("div"),ee(L.$$.fragment),ce=n(),T=s("section"),T.innerHTML=De,pe=n(),h=s("section"),P=s("h2"),P.textContent=Ne,ue=n(),k=s("p"),k.textContent=ze,me=n(),b=s("div"),J=s("div"),ee($.$$.fragment),he=n(),E=s("div"),E.innerHTML=Ve,fe=n(),u=s("section"),S=s("h2"),S.textContent=Ze,ve=n(),O=s("p"),O.textContent=Ge,ge=n(),ee(w.$$.fragment),xe=n(),M=s("div"),M.innerHTML=je,be=n(),H=s("section"),H.innerHTML=Re,Ce=n(),q=s("section"),q.innerHTML=Ue,ye=n(),f=s("section"),D=s("h2"),D.textContent=Je,Ie=n(),N=s("p"),N.textContent=Be,Ae=n(),p=s("div"),z=s("a"),_e=Q("Zed.dev integration"),Le=n(),V=s("a"),Te=Q("Codex CLI"),Pe=n(),Z=s("a"),ke=Q("Protocol configuration"),$e=n(),G=s("a"),Ee=Q("All providers"),Se=n(),j=s("a"),Oe=Q("API reference"),this.h()},l(c){o=r(c,"DIV",{class:!0});var i=d(o);y=r(i,"DIV",{class:!0,"data-svelte-h":!0}),m(y)!=="svelte-dgl5v1"&&(y.innerHTML=He),ae=a(i),R=r(i,"DIV",{class:!0});var Ke=d(R);I=r(Ke,"IMG",{src:!0,alt:!0,class:!0}),Ke.forEach(l),ie=a(i),x=r(i,"SECTION",{class:!0});var X=d(x);A=r(X,"H2",{class:!0});var we=d(A);te(_.$$.fragment,we),le=W(we,`
			High-level Diagram`),we.forEach(l),de=a(X),U=r(X,"DIV",{class:!0});var Qe=d(U);te(L.$$.fragment,Qe),Qe.forEach(l),X.forEach(l),ce=a(i),T=r(i,"SECTION",{class:!0,"data-svelte-h":!0}),m(T)!=="svelte-poby8f"&&(T.innerHTML=De),pe=a(i),h=r(i,"SECTION",{class:!0});var B=d(h);P=r(B,"H2",{class:!0,"data-svelte-h":!0}),m(P)!=="svelte-y2vn2n"&&(P.textContent=Ne),ue=a(B),k=r(B,"P",{class:!0,"data-svelte-h":!0}),m(k)!=="svelte-97h2y3"&&(k.textContent=ze),me=a(B),b=r(B,"DIV",{class:!0});var Y=d(b);J=r(Y,"DIV",{class:!0});var We=d(J);te($.$$.fragment,We),We.forEach(l),he=a(Y),E=r(Y,"DIV",{class:!0,"data-svelte-h":!0}),m(E)!=="svelte-1qch2l9"&&(E.innerHTML=Ve),Y.forEach(l),B.forEach(l),fe=a(i),u=r(i,"SECTION",{class:!0});var C=d(u);S=r(C,"H2",{class:!0,"data-svelte-h":!0}),m(S)!=="svelte-9yke0a"&&(S.textContent=Ze),ve=a(C),O=r(C,"P",{class:!0,"data-svelte-h":!0}),m(O)!=="svelte-1rbpbhr"&&(O.textContent=Ge),ge=a(C),te(w.$$.fragment,C),xe=a(C),M=r(C,"DIV",{class:!0,"data-svelte-h":!0}),m(M)!=="svelte-1boixq8"&&(M.innerHTML=je),C.forEach(l),be=a(i),H=r(i,"SECTION",{class:!0,"data-svelte-h":!0}),m(H)!=="svelte-1e8i07a"&&(H.innerHTML=Re),Ce=a(i),q=r(i,"SECTION",{class:!0,"data-svelte-h":!0}),m(q)!=="svelte-1qkf389"&&(q.innerHTML=Ue),ye=a(i),f=r(i,"SECTION",{class:!0});var K=d(f);D=r(K,"H2",{class:!0,"data-svelte-h":!0}),m(D)!=="svelte-1xo85fo"&&(D.textContent=Je),Ie=a(K),N=r(K,"P",{class:!0,"data-svelte-h":!0}),m(N)!=="svelte-qbc2ld"&&(N.textContent=Be),Ae=a(K),p=r(K,"DIV",{class:!0});var v=d(p);z=r(v,"A",{href:!0,class:!0});var Fe=d(z);_e=W(Fe,"Zed.dev integration"),Fe.forEach(l),Le=a(v),V=r(v,"A",{href:!0,class:!0});var Xe=d(V);Te=W(Xe,"Codex CLI"),Xe.forEach(l),Pe=a(v),Z=r(v,"A",{href:!0,class:!0});var Ye=d(Z);ke=W(Ye,"Protocol configuration"),Ye.forEach(l),$e=a(v),G=r(v,"A",{href:!0,class:!0});var et=d(G);Ee=W(et,"All providers"),et.forEach(l),Se=a(v),j=r(v,"A",{href:!0,class:!0});var tt=d(j);Oe=W(tt,"API reference"),tt.forEach(l),v.forEach(l),K.forEach(l),i.forEach(l),this.h()},h(){t(y,"class","space-y-3"),rt(I.src,qe=`${g[0]}/architecture.png`)||t(I,"src",qe),t(I,"alt","LLM Link Architecture Diagram"),t(I,"class","w-full h-auto"),t(R,"class","mb-8"),t(A,"class","text-2xl font-semibold flex items-center"),t(U,"class","rounded-lg border bg-card p-5 text-xs"),t(x,"class","space-y-8"),t(T,"class","space-y-6"),t(P,"class","text-2xl font-semibold"),t(k,"class","text-sm text-muted-foreground"),t(J,"class","rounded-lg border bg-card p-5 text-xs h-fit"),t(E,"class","space-y-4 text-sm text-muted-foreground"),t(b,"class","grid gap-6 lg:grid-cols-2"),t(h,"class","space-y-6"),t(S,"class","text-2xl font-semibold"),t(O,"class","text-sm text-muted-foreground"),t(M,"class","rounded-lg border bg-muted/40 p-4 space-y-3"),t(u,"class","space-y-6"),t(H,"class","space-y-6"),t(q,"class","space-y-6"),t(D,"class","text-2xl font-semibold"),t(N,"class","text-sm text-muted-foreground"),t(z,"href",g[0]+"/docs/apps/zed"),t(z,"class","text-primary hover:underline"),t(V,"href",g[0]+"/docs/apps/codex"),t(V,"class","block text-primary hover:underline"),t(Z,"href",g[0]+"/docs/protocols"),t(Z,"class","block text-primary hover:underline"),t(G,"href",g[0]+"/providers"),t(G,"class","block text-primary hover:underline"),t(j,"href",g[0]+"/api"),t(j,"class","block text-primary hover:underline"),t(p,"class","space-y-1 text-sm"),t(f,"class","space-y-6"),t(o,"class","max-w-3xl space-y-12")},m(c,i){it(c,o,i),e(o,y),e(o,ae),e(o,R),e(R,I),e(o,ie),e(o,x),e(x,A),se(_,A,null),e(A,le),e(x,de),e(x,U),se(L,U,null),e(o,ce),e(o,T),e(o,pe),e(o,h),e(h,P),e(h,ue),e(h,k),e(h,me),e(h,b),e(b,J),se($,J,null),e(b,he),e(b,E),e(o,fe),e(o,u),e(u,S),e(u,ve),e(u,O),e(u,ge),se(w,u,null),e(u,xe),e(u,M),e(o,be),e(o,H),e(o,Ce),e(o,q),e(o,ye),e(o,f),e(f,D),e(f,Ie),e(f,N),e(f,Ae),e(f,p),e(p,z),e(z,_e),e(p,Le),e(p,V),e(V,Te),e(p,Pe),e(p,Z),e(Z,ke),e(p,$e),e(p,G),e(G,Ee),e(p,Se),e(p,j),e(j,Oe),F=!0},p:ot,i(c){F||(re(_.$$.fragment,c),re(L.$$.fragment,c),re($.$$.fragment,c),re(w.$$.fragment,c),F=!0)},o(c){oe(_.$$.fragment,c),oe(L.$$.fragment,c),oe($.$$.fragment,c),oe(w.$$.fragment,c),F=!1},d(c){c&&l(o),ne(_),ne(L),ne($),ne(w)}}}function pt(g){return[lt]}class gt extends nt{constructor(o){super(),at(this,o,pt,ct,st,{})}}export{gt as component};

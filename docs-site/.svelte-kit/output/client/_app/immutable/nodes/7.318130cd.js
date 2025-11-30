import{s as ol,n as ll}from"../chunks/scheduler.2b9f022a.js";import{S as nl,i as sl,g as t,s as l,r as g,m as Qe,h as o,j as c,x as r,c as n,u as x,f as i,n as et,k as s,a as rl,y as e,v,d as y,t as _,w as k}from"../chunks/index.6ae5f468.js";import{C}from"../chunks/CodeBlock.fdbad5f1.js";import{b as al}from"../chunks/paths.e5c13239.js";function il(at){let d,R,fo=`<p class="text-sm text-muted-foreground uppercase tracking-[0.2em]">Applications · Codex</p> <h1 class="text-3xl font-bold tracking-tight">Codex CLI Integration</h1> <p class="text-base text-muted-foreground">Use llm-link as an OpenAI-compatible backend for Codex CLI, so you can route different
			providers and models without changing Codex configuration.</p>`,it,u,G,go="1. Start llm-link for Codex",dt,B,xo=`Start the proxy pointing to Aliyun&#39;s <strong>Qwen3 Coder Plus</strong>. The <code>--app codex</code>
			preset opens an OpenAI-compatible endpoint at <code>http://localhost:8088/v1</code>.`,ct,T,Ye,vo="<strong>Option 1: Use the startup script (Recommended)</strong>",pt,F,ut,j,yo="The script automatically handles macOS proxy issues and provides colored output.",mt,S,Ue,_o="<strong>Option 2: Manual startup</strong>",ht,X,ft,W,ko="You can also use <code>--provider zhipu --model glm-4.6</code> or others.",gt,D,J,Co="Command Line Options",xt,p,Se,$o="<strong>Basic Syntax:</strong>",vt,Q,yt,De,wo="<strong>Required Parameters:</strong>",_t,ee,kt,qe,Lo="<strong>Optional Parameters:</strong>",Ct,te,$t,ze,Io="<strong>Example Commands:</strong>",wt,oe,Lt,w,le,bo="2. Configure Codex CLI",It,ne,Mo="Update your <code>~/.codex/config.toml</code> to define LLM Link as a provider and create profiles for Zhipu GLM-4.6 (recommended) and Aliyun (alternative):",bt,se,Mt,P,re,Ho="Authentication",Ht,ae,Tt,Ne,To=`Codex will send the auth token as <code>Authorization: Bearer ...</code> when calling llm-link. If you start
				llm-link without <code>--auth-key</code>, you can omit <code>env_key</code> from the codex.toml configuration
				entirely (Codex will still be able to reach the proxy).`,Pt,L,ie,Po="3. Start Using Codex CLI",Et,de,Eo="Once llm-link is running and Codex CLI is configured, you can start using Codex with your chosen LLM provider.",At,ce,Ot,E,Ke,Ao="<strong>Available Commands:</strong>",Yt,pe,Ut,Ve,Oo=`Make sure llm-link is running in the background (http://localhost:8088) before using Codex CLI. 
				You'll see responses from your configured LLM provider (Zhipu, Aliyun, etc.) through the proxy.`,St,A,ue,Yo="4. Switching Providers",Dt,me,Uo=`You can switch to other coding models (like GLM-4.6) by simply restarting llm-link.
			No changes to <code>~/.codex/config.toml</code> are strictly necessary if you reuse the profile name,
			or you can add a new profile:`,qt,he,zt,m,fe,So="5. Troubleshooting",Nt,I,ge,Do="502 Bad Gateway Errors",Kt,xe,qo="If you encounter <code>502 Bad Gateway</code> errors when using Codex CLI, this is typically caused by proxy conflicts on macOS systems.",Vt,ve,zo='<p><strong>Symptoms:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li>Codex CLI shows: <code>stream error: exceeded retry limit, last status: 502 Bad Gateway</code></li> <li>Direct curl requests to llm-link work fine</li> <li>llm-link logs show proxy usage: <code>proxy(http://127.0.0.1:7890) intercepts</code></li></ul>',Zt,q,Ze,No="<strong>Solution:</strong>",Rt,ye,Gt,O,_e,Ko="Model Mismatch",Bt,ke,Vo="Ensure the model in your <code>~/.codex/config.toml</code> matches the model llm-link is running with.",Ft,Ce,jt,Y,$e,Zo="Authentication Issues",Xt,we,Ro="If you get <code>401 Unauthorized</code> errors, check that the authentication token matches between llm-link and Codex configuration.",Wt,Le,Jt,$,Ie,Go="Tool Calls Not Working",Qt,z,eo,be,to,Bo="{...}",oo,lo,no,so,Me,Fo='<p><strong>Symptoms:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li>Tool calls appear as text instead of being executed</li> <li>Functions like <code>apply_patch</code>, <code>shell</code> show as raw text</li> <li>Model returns explanations instead of calling tools</li></ul>',ro,He,jo='<p><strong>Affected Providers:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li><strong>Aliyun</strong>: qwen3-coder-plus returns text, qwen-max errors with tool_choice</li> <li><strong>Other providers</strong>: May have varying OpenAI tools API compatibility</li></ul>',ao,b,Re,Xo="<strong>Recommended Solution:</strong>",io,Te,Wo="For tool-heavy workflows, use providers with confirmed OpenAI tools API compatibility:",co,Pe,po,Ee,Jo="For simple text generation without tools, Aliyun providers work well.",uo,Ae,Qo='<h3 class="text-lg font-medium">Tool Calls Duplicating (Fixed)</h3> <p class="text-sm text-muted-foreground">Previous versions had streaming tool_calls duplication issues. This has been fixed in llm-connector 0.5.4+.</p> <div class="space-y-2"><p><strong>Fixed Issues:</strong></p> <ul class="list-disc list-inside text-sm space-y-1"><li>Streaming tool_calls delta accumulation now works properly</li> <li>No more repeated tool execution in streaming mode</li> <li>Compatible with providers that support OpenAI tools format</li></ul></div>',mo,Ge,Oe,ho,tt;return F=new C({props:{code:`# Set your API key as environment variable
export ALIYUN_API_KEY="your-aliyun-api-key"

# Run the startup script
./scripts/start-codex.sh`,language:"bash"}}),X=new C({props:{code:`# Required for macOS to avoid proxy conflicts
export NO_PROXY='*'

# Start llm-link manually (recommended for tools)
llm-link --app codex --provider zhipu --api-key <YOUR_ZHIPU_KEY> --model glm-4.6 --auth-key your-token

# Alternative for text-only workflows
llm-link --app codex --provider aliyun --api-key <YOUR_ALIYUN_KEY> --model qwen3-coder-plus --auth-key your-token`,language:"bash"}}),Q=new C({props:{code:"llm-link --app codex [options]",language:"bash"}}),ee=new C({props:{code:`--app codex          # Use Codex CLI preset configuration
--provider <provider> # LLM provider (aliyun, zhipu, openai, anthropic, etc.)
--api-key <key>       # Provider API key
--model <model>       # Model name`,language:"bash"}}),te=new C({props:{code:`--port 8088          # Custom port (default: 8088)
--host 0.0.0.0        # Bind address (default: 0.0.0.0)
--auth-key <token>    # Authentication token for client access
--log-level info      # Log level (debug, info, warn, error)
--config <file>       # Use configuration file instead of CLI args`,language:"bash"}}),oe=new C({props:{code:`# Start with Zhipu GLM-4.6
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6

# Start with custom port and auth
llm-link --app codex --provider aliyun --api-key <ALIYUN_KEY> --model qwen3-coder-plus --port 9999 --auth-key my-secret

# Start with debug logging
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6 --log-level debug

# Start without auth key (open access)
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6`,language:"bash"}}),se=new C({props:{code:`# 1. Define LLM Link as a model provider
[model_providers.llm_link]
name = "LLM Link (Zhipu GLM-4.6)"
base_url = "http://localhost:8088/v1"
env_key = "LLM_LINK_AUTH_TOKEN"

# 2. Define a profile using the Zhipu GLM-4.6 model (recommended for tools)
[profiles.zhipu_glm46]
model = "glm-4.6"
model_provider = "llm_link"

# 3. Alternative profile for Aliyun (text-only workflows)
[profiles.qwen3_coder]
model = "qwen3-coder-plus"
model_provider = "llm_link"`,language:"toml"}}),ae=new C({props:{code:`# llm-link without --auth-key (open access)
llm-link --app codex --provider zhipu --model glm-4.6 --api-key YOUR_ZHIPU_API_KEY

# llm-link with --auth-key (requires token)
llm-link --app codex --provider zhipu --model glm-4.6 --api-key YOUR_ZHIPU_API_KEY --auth-key my-secret

# Alternative for text-only workflows
llm-link --app codex --provider aliyun --model qwen3-coder-plus --api-key YOUR_ALIYUN_API_KEY --auth-key my-secret`,language:"bash"}}),ce=new C({props:{code:`# Verify Codex can connect to llm-link (recommended for tools)
codex --profile zhipu_glm46 "Hello, can you help me write a Python function?"

# Use Codex for coding assistance with tool support
codex --profile zhipu_glm46 "Write a function that sorts an array in JavaScript"

# Alternative for text-only workflows
codex --profile qwen3_coder "Explain how sorting algorithms work"

# Interactive mode (default, no flag needed)
codex --profile zhipu_glm46`,language:"bash"}}),pe=new C({props:{code:`# Use Zhipu GLM-4.6 profile (recommended for tools)
codex --profile zhipu_glm46 "your prompt"

# Use Aliyun profile (text-only workflows)
codex --profile qwen3_coder "your prompt"

# Interactive mode with Zhipu GLM-4.6
codex --profile zhipu_glm46

# Override model temporarily
codex --profile qwen3_coder --model "gpt-4" "your prompt"

# Get help
codex --help`,language:"bash"}}),he=new C({props:{code:`# Switch to Zhipu GLM-4.6
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6

# Switch to Volcengine Doubao
llm-link --app codex --provider volcengine --api-key <VOLC_KEY> --model doubao-seed-1.6`,language:"bash"}}),ye=new C({props:{code:`# Set NO_PROXY to disable automatic proxy detection
export NO_PROXY='*'

# Then restart llm-link
llm-link --app codex --provider aliyun --api-key <YOUR_KEY> --model qwen3-coder-plus --auth-key your-token

# Or use the startup script which handles this automatically
./scripts/start-codex.sh`,language:"bash"}}),Ce=new C({props:{code:`# Check current llm-link model
curl -s http://localhost:8088/api/config/current

# Update your ~/.codex/config.toml if needed
[profiles.qwen3_coder]
model = "qwen3-coder-plus"  # Must match llm-link model
model_provider = "llm_link"`,language:"bash"}}),Le=new C({props:{code:`# Set the same token in both places
export LLM_LINK_AUTH_TOKEN="123456"

# Start llm-link with Zhipu provider (recommended for Codex with tools)
llm-link --app codex --provider zhipu --api-key <ZHIPU_API_KEY> --model glm-4.6 --auth-key 123456

# Or use Aliyun for text-only workflows
llm-link --app codex --provider aliyun --api-key <ALIYUN_API_KEY> --model qwen3-coder-plus --auth-key 123456

# Or use the convenience script (Aliyun)
./scripts/start-codex.sh

# Your ~/.codex/config.toml should have:
[model_providers.llm_link]
env_key = "LLM_LINK_AUTH_TOKEN"`,language:"bash"}}),Pe=new C({props:{code:`# Confirmed working providers
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6
llm-link --app codex --provider openai --api-key <OPENAI_KEY> --model gpt-4
llm-link --app codex --provider anthropic --api-key <ANTHROPIC_KEY> --model claude-3-sonnet

# Note: Zhipu glm-4.6 has verified OpenAI tools API support
# Note: Aliyun has confirmed tools API incompatibility issues`,language:"bash"}}),{c(){d=t("div"),R=t("div"),R.innerHTML=fo,it=l(),u=t("section"),G=t("h2"),G.textContent=go,dt=l(),B=t("p"),B.innerHTML=xo,ct=l(),T=t("div"),Ye=t("p"),Ye.innerHTML=vo,pt=l(),g(F.$$.fragment),ut=l(),j=t("p"),j.textContent=yo,mt=l(),S=t("div"),Ue=t("p"),Ue.innerHTML=_o,ht=l(),g(X.$$.fragment),ft=l(),W=t("p"),W.innerHTML=ko,gt=l(),D=t("div"),J=t("h3"),J.textContent=Co,xt=l(),p=t("div"),Se=t("p"),Se.innerHTML=$o,vt=l(),g(Q.$$.fragment),yt=l(),De=t("p"),De.innerHTML=wo,_t=l(),g(ee.$$.fragment),kt=l(),qe=t("p"),qe.innerHTML=Lo,Ct=l(),g(te.$$.fragment),$t=l(),ze=t("p"),ze.innerHTML=Io,wt=l(),g(oe.$$.fragment),Lt=l(),w=t("section"),le=t("h2"),le.textContent=bo,It=l(),ne=t("p"),ne.innerHTML=Mo,bt=l(),g(se.$$.fragment),Mt=l(),P=t("div"),re=t("p"),re.textContent=Ho,Ht=l(),g(ae.$$.fragment),Tt=l(),Ne=t("p"),Ne.innerHTML=To,Pt=l(),L=t("section"),ie=t("h2"),ie.textContent=Po,Et=l(),de=t("p"),de.textContent=Eo,At=l(),g(ce.$$.fragment),Ot=l(),E=t("div"),Ke=t("p"),Ke.innerHTML=Ao,Yt=l(),g(pe.$$.fragment),Ut=l(),Ve=t("p"),Ve.textContent=Oo,St=l(),A=t("section"),ue=t("h2"),ue.textContent=Yo,Dt=l(),me=t("p"),me.innerHTML=Uo,qt=l(),g(he.$$.fragment),zt=l(),m=t("section"),fe=t("h2"),fe.textContent=So,Nt=l(),I=t("div"),ge=t("h3"),ge.textContent=Do,Kt=l(),xe=t("p"),xe.innerHTML=qo,Vt=l(),ve=t("div"),ve.innerHTML=zo,Zt=l(),q=t("div"),Ze=t("p"),Ze.innerHTML=No,Rt=l(),g(ye.$$.fragment),Gt=l(),O=t("div"),_e=t("h3"),_e.textContent=Ko,Bt=l(),ke=t("p"),ke.innerHTML=Vo,Ft=l(),g(Ce.$$.fragment),jt=l(),Y=t("div"),$e=t("h3"),$e.textContent=Zo,Xt=l(),we=t("p"),we.innerHTML=Ro,Wt=l(),g(Le.$$.fragment),Jt=l(),$=t("div"),Ie=t("h3"),Ie.textContent=Go,Qt=l(),z=t("p"),eo=Qe("If you notice Codex CLI showing tool calls as raw text (like "),be=t("code"),to=Qe("update_plan("),oo=Qe(Bo),lo=Qe(")"),no=Qe(") instead of executing them, this is due to API compatibility issues with certain providers."),so=l(),Me=t("div"),Me.innerHTML=Fo,ro=l(),He=t("div"),He.innerHTML=jo,ao=l(),b=t("div"),Re=t("p"),Re.innerHTML=Xo,io=l(),Te=t("p"),Te.textContent=Wo,co=l(),g(Pe.$$.fragment),po=l(),Ee=t("p"),Ee.textContent=Jo,uo=l(),Ae=t("div"),Ae.innerHTML=Qo,mo=l(),Ge=t("div"),Oe=t("a"),ho=Qe("← Back to Docs index"),this.h()},l(a){d=o(a,"DIV",{class:!0});var h=c(d);R=o(h,"DIV",{class:!0,"data-svelte-h":!0}),r(R)!=="svelte-96debx"&&(R.innerHTML=fo),it=n(h),u=o(h,"SECTION",{class:!0});var M=c(u);G=o(M,"H2",{class:!0,"data-svelte-h":!0}),r(G)!=="svelte-qa4ct5"&&(G.textContent=go),dt=n(M),B=o(M,"P",{class:!0,"data-svelte-h":!0}),r(B)!=="svelte-1oz24w6"&&(B.innerHTML=xo),ct=n(M),T=o(M,"DIV",{class:!0});var Be=c(T);Ye=o(Be,"P",{"data-svelte-h":!0}),r(Ye)!=="svelte-17hox4b"&&(Ye.innerHTML=vo),pt=n(Be),x(F.$$.fragment,Be),ut=n(Be),j=o(Be,"P",{class:!0,"data-svelte-h":!0}),r(j)!=="svelte-q4hgyd"&&(j.textContent=yo),Be.forEach(i),mt=n(M),S=o(M,"DIV",{class:!0});var ot=c(S);Ue=o(ot,"P",{"data-svelte-h":!0}),r(Ue)!=="svelte-1mi7ocn"&&(Ue.innerHTML=_o),ht=n(ot),x(X.$$.fragment,ot),ot.forEach(i),ft=n(M),W=o(M,"P",{class:!0,"data-svelte-h":!0}),r(W)!=="svelte-5r3oin"&&(W.innerHTML=ko),gt=n(M),D=o(M,"DIV",{class:!0});var lt=c(D);J=o(lt,"H3",{class:!0,"data-svelte-h":!0}),r(J)!=="svelte-gvmwpc"&&(J.textContent=Co),xt=n(lt),p=o(lt,"DIV",{class:!0});var f=c(p);Se=o(f,"P",{"data-svelte-h":!0}),r(Se)!=="svelte-nwivb0"&&(Se.innerHTML=$o),vt=n(f),x(Q.$$.fragment,f),yt=n(f),De=o(f,"P",{"data-svelte-h":!0}),r(De)!=="svelte-h9d4kk"&&(De.innerHTML=wo),_t=n(f),x(ee.$$.fragment,f),kt=n(f),qe=o(f,"P",{"data-svelte-h":!0}),r(qe)!=="svelte-w7xilr"&&(qe.innerHTML=Lo),Ct=n(f),x(te.$$.fragment,f),$t=n(f),ze=o(f,"P",{"data-svelte-h":!0}),r(ze)!=="svelte-1xrqalr"&&(ze.innerHTML=Io),wt=n(f),x(oe.$$.fragment,f),f.forEach(i),lt.forEach(i),M.forEach(i),Lt=n(h),w=o(h,"SECTION",{class:!0});var N=c(w);le=o(N,"H2",{class:!0,"data-svelte-h":!0}),r(le)!=="svelte-eksgn1"&&(le.textContent=bo),It=n(N),ne=o(N,"P",{class:!0,"data-svelte-h":!0}),r(ne)!=="svelte-1n7h2wy"&&(ne.innerHTML=Mo),bt=n(N),x(se.$$.fragment,N),Mt=n(N),P=o(N,"DIV",{class:!0});var Fe=c(P);re=o(Fe,"P",{class:!0,"data-svelte-h":!0}),r(re)!=="svelte-1mookk9"&&(re.textContent=Ho),Ht=n(Fe),x(ae.$$.fragment,Fe),Tt=n(Fe),Ne=o(Fe,"P",{"data-svelte-h":!0}),r(Ne)!=="svelte-1s6i7o4"&&(Ne.innerHTML=To),Fe.forEach(i),N.forEach(i),Pt=n(h),L=o(h,"SECTION",{class:!0});var K=c(L);ie=o(K,"H2",{class:!0,"data-svelte-h":!0}),r(ie)!=="svelte-1w9og2q"&&(ie.textContent=Po),Et=n(K),de=o(K,"P",{class:!0,"data-svelte-h":!0}),r(de)!=="svelte-6nmmzg"&&(de.textContent=Eo),At=n(K),x(ce.$$.fragment,K),Ot=n(K),E=o(K,"DIV",{class:!0});var je=c(E);Ke=o(je,"P",{"data-svelte-h":!0}),r(Ke)!=="svelte-181hvlm"&&(Ke.innerHTML=Ao),Yt=n(je),x(pe.$$.fragment,je),Ut=n(je),Ve=o(je,"P",{"data-svelte-h":!0}),r(Ve)!=="svelte-mp72fa"&&(Ve.textContent=Oo),je.forEach(i),K.forEach(i),St=n(h),A=o(h,"SECTION",{class:!0});var Xe=c(A);ue=o(Xe,"H2",{class:!0,"data-svelte-h":!0}),r(ue)!=="svelte-4u2l56"&&(ue.textContent=Yo),Dt=n(Xe),me=o(Xe,"P",{class:!0,"data-svelte-h":!0}),r(me)!=="svelte-1quega0"&&(me.innerHTML=Uo),qt=n(Xe),x(he.$$.fragment,Xe),Xe.forEach(i),zt=n(h),m=o(h,"SECTION",{class:!0});var H=c(m);fe=o(H,"H2",{class:!0,"data-svelte-h":!0}),r(fe)!=="svelte-4kyzhx"&&(fe.textContent=So),Nt=n(H),I=o(H,"DIV",{class:!0});var V=c(I);ge=o(V,"H3",{class:!0,"data-svelte-h":!0}),r(ge)!=="svelte-1gibymw"&&(ge.textContent=Do),Kt=n(V),xe=o(V,"P",{class:!0,"data-svelte-h":!0}),r(xe)!=="svelte-irkhij"&&(xe.innerHTML=qo),Vt=n(V),ve=o(V,"DIV",{class:!0,"data-svelte-h":!0}),r(ve)!=="svelte-1kdzauw"&&(ve.innerHTML=zo),Zt=n(V),q=o(V,"DIV",{class:!0});var nt=c(q);Ze=o(nt,"P",{"data-svelte-h":!0}),r(Ze)!=="svelte-lx7lp6"&&(Ze.innerHTML=No),Rt=n(nt),x(ye.$$.fragment,nt),nt.forEach(i),V.forEach(i),Gt=n(H),O=o(H,"DIV",{class:!0});var We=c(O);_e=o(We,"H3",{class:!0,"data-svelte-h":!0}),r(_e)!=="svelte-ml0vas"&&(_e.textContent=Ko),Bt=n(We),ke=o(We,"P",{class:!0,"data-svelte-h":!0}),r(ke)!=="svelte-1adq729"&&(ke.innerHTML=Vo),Ft=n(We),x(Ce.$$.fragment,We),We.forEach(i),jt=n(H),Y=o(H,"DIV",{class:!0});var Je=c(Y);$e=o(Je,"H3",{class:!0,"data-svelte-h":!0}),r($e)!=="svelte-xf85td"&&($e.textContent=Zo),Xt=n(Je),we=o(Je,"P",{class:!0,"data-svelte-h":!0}),r(we)!=="svelte-3zzqe2"&&(we.innerHTML=Ro),Wt=n(Je),x(Le.$$.fragment,Je),Je.forEach(i),Jt=n(H),$=o(H,"DIV",{class:!0});var U=c($);Ie=o(U,"H3",{class:!0,"data-svelte-h":!0}),r(Ie)!=="svelte-1ca4rji"&&(Ie.textContent=Go),Qt=n(U),z=o(U,"P",{class:!0});var st=c(z);eo=et(st,"If you notice Codex CLI showing tool calls as raw text (like "),be=o(st,"CODE",{});var rt=c(be);to=et(rt,"update_plan("),oo=et(rt,Bo),lo=et(rt,")"),rt.forEach(i),no=et(st,") instead of executing them, this is due to API compatibility issues with certain providers."),st.forEach(i),so=n(U),Me=o(U,"DIV",{class:!0,"data-svelte-h":!0}),r(Me)!=="svelte-10ne02v"&&(Me.innerHTML=Fo),ro=n(U),He=o(U,"DIV",{class:!0,"data-svelte-h":!0}),r(He)!=="svelte-cz63u2"&&(He.innerHTML=jo),ao=n(U),b=o(U,"DIV",{class:!0});var Z=c(b);Re=o(Z,"P",{"data-svelte-h":!0}),r(Re)!=="svelte-rktlrl"&&(Re.innerHTML=Xo),io=n(Z),Te=o(Z,"P",{class:!0,"data-svelte-h":!0}),r(Te)!=="svelte-16ft2hl"&&(Te.textContent=Wo),co=n(Z),x(Pe.$$.fragment,Z),po=n(Z),Ee=o(Z,"P",{class:!0,"data-svelte-h":!0}),r(Ee)!=="svelte-nxn961"&&(Ee.textContent=Jo),Z.forEach(i),U.forEach(i),uo=n(H),Ae=o(H,"DIV",{class:!0,"data-svelte-h":!0}),r(Ae)!=="svelte-9aac4h"&&(Ae.innerHTML=Qo),H.forEach(i),mo=n(h),Ge=o(h,"DIV",{class:!0});var el=c(Ge);Oe=o(el,"A",{href:!0,class:!0});var tl=c(Oe);ho=et(tl,"← Back to Docs index"),tl.forEach(i),el.forEach(i),h.forEach(i),this.h()},h(){s(R,"class","space-y-2"),s(G,"class","text-2xl font-semibold"),s(B,"class","text-sm text-muted-foreground"),s(j,"class","text-xs text-muted-foreground"),s(T,"class","space-y-2"),s(S,"class","space-y-2"),s(W,"class","text-xs text-muted-foreground"),s(J,"class","text-lg font-medium"),s(p,"class","space-y-2 text-sm"),s(D,"class","space-y-3 mt-4"),s(u,"class","space-y-4"),s(le,"class","text-2xl font-semibold"),s(ne,"class","text-sm text-muted-foreground"),s(re,"class","font-semibold text-foreground text-sm"),s(P,"class","space-y-2 text-xs text-muted-foreground"),s(w,"class","space-y-4"),s(ie,"class","text-2xl font-semibold"),s(de,"class","text-sm text-muted-foreground"),s(E,"class","space-y-2 text-xs text-muted-foreground"),s(L,"class","space-y-4"),s(ue,"class","text-2xl font-semibold"),s(me,"class","text-sm text-muted-foreground"),s(A,"class","space-y-4"),s(fe,"class","text-2xl font-semibold"),s(ge,"class","text-lg font-medium"),s(xe,"class","text-sm text-muted-foreground"),s(ve,"class","space-y-2"),s(q,"class","space-y-2"),s(I,"class","space-y-3"),s(_e,"class","text-lg font-medium"),s(ke,"class","text-sm text-muted-foreground"),s(O,"class","space-y-3"),s($e,"class","text-lg font-medium"),s(we,"class","text-sm text-muted-foreground"),s(Y,"class","space-y-3"),s(Ie,"class","text-lg font-medium"),s(z,"class","text-sm text-muted-foreground"),s(Me,"class","space-y-2"),s(He,"class","space-y-2"),s(Te,"class","text-sm text-muted-foreground"),s(Ee,"class","text-sm text-muted-foreground"),s(b,"class","space-y-2"),s($,"class","space-y-3"),s(Ae,"class","space-y-3"),s(m,"class","space-y-4"),s(Oe,"href",`${at[0]}/docs`),s(Oe,"class","hover:underline"),s(Ge,"class","pt-6 border-t text-sm text-muted-foreground"),s(d,"class","max-w-3xl space-y-8")},m(a,h){rl(a,d,h),e(d,R),e(d,it),e(d,u),e(u,G),e(u,dt),e(u,B),e(u,ct),e(u,T),e(T,Ye),e(T,pt),v(F,T,null),e(T,ut),e(T,j),e(u,mt),e(u,S),e(S,Ue),e(S,ht),v(X,S,null),e(u,ft),e(u,W),e(u,gt),e(u,D),e(D,J),e(D,xt),e(D,p),e(p,Se),e(p,vt),v(Q,p,null),e(p,yt),e(p,De),e(p,_t),v(ee,p,null),e(p,kt),e(p,qe),e(p,Ct),v(te,p,null),e(p,$t),e(p,ze),e(p,wt),v(oe,p,null),e(d,Lt),e(d,w),e(w,le),e(w,It),e(w,ne),e(w,bt),v(se,w,null),e(w,Mt),e(w,P),e(P,re),e(P,Ht),v(ae,P,null),e(P,Tt),e(P,Ne),e(d,Pt),e(d,L),e(L,ie),e(L,Et),e(L,de),e(L,At),v(ce,L,null),e(L,Ot),e(L,E),e(E,Ke),e(E,Yt),v(pe,E,null),e(E,Ut),e(E,Ve),e(d,St),e(d,A),e(A,ue),e(A,Dt),e(A,me),e(A,qt),v(he,A,null),e(d,zt),e(d,m),e(m,fe),e(m,Nt),e(m,I),e(I,ge),e(I,Kt),e(I,xe),e(I,Vt),e(I,ve),e(I,Zt),e(I,q),e(q,Ze),e(q,Rt),v(ye,q,null),e(m,Gt),e(m,O),e(O,_e),e(O,Bt),e(O,ke),e(O,Ft),v(Ce,O,null),e(m,jt),e(m,Y),e(Y,$e),e(Y,Xt),e(Y,we),e(Y,Wt),v(Le,Y,null),e(m,Jt),e(m,$),e($,Ie),e($,Qt),e($,z),e(z,eo),e(z,be),e(be,to),e(be,oo),e(be,lo),e(z,no),e($,so),e($,Me),e($,ro),e($,He),e($,ao),e($,b),e(b,Re),e(b,io),e(b,Te),e(b,co),v(Pe,b,null),e(b,po),e(b,Ee),e(m,uo),e(m,Ae),e(d,mo),e(d,Ge),e(Ge,Oe),e(Oe,ho),tt=!0},p:ll,i(a){tt||(y(F.$$.fragment,a),y(X.$$.fragment,a),y(Q.$$.fragment,a),y(ee.$$.fragment,a),y(te.$$.fragment,a),y(oe.$$.fragment,a),y(se.$$.fragment,a),y(ae.$$.fragment,a),y(ce.$$.fragment,a),y(pe.$$.fragment,a),y(he.$$.fragment,a),y(ye.$$.fragment,a),y(Ce.$$.fragment,a),y(Le.$$.fragment,a),y(Pe.$$.fragment,a),tt=!0)},o(a){_(F.$$.fragment,a),_(X.$$.fragment,a),_(Q.$$.fragment,a),_(ee.$$.fragment,a),_(te.$$.fragment,a),_(oe.$$.fragment,a),_(se.$$.fragment,a),_(ae.$$.fragment,a),_(ce.$$.fragment,a),_(pe.$$.fragment,a),_(he.$$.fragment,a),_(ye.$$.fragment,a),_(Ce.$$.fragment,a),_(Le.$$.fragment,a),_(Pe.$$.fragment,a),tt=!1},d(a){a&&i(d),k(F),k(X),k(Q),k(ee),k(te),k(oe),k(se),k(ae),k(ce),k(pe),k(he),k(ye),k(Ce),k(Le),k(Pe)}}}function dl(at){return[al]}class hl extends nl{constructor(d){super(),sl(this,d,dl,il,ol,{})}}export{hl as component};

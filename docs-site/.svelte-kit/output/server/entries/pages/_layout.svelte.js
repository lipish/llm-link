import { c as create_ssr_component, b as subscribe, d as add_attribute, v as validate_component, e as escape } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { b as base } from "../../chunks/paths.js";
import { c as cn, B as Button } from "../../chunks/button.js";
import { E as ExternalLink } from "../../chunks/external-link.js";
const app = "";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const basePath = base;
  $$unsubscribe_page();
  return `<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"><div class="container flex h-14 items-center"><div class="mr-4 hidden md:flex"><a${add_attribute("href", `${basePath}/`, 0)} class="mr-6 flex items-center space-x-2"><span class="hidden font-bold sm:inline-block text-xl" data-svelte-h="svelte-1b8f07s">LLM Link</span></a> <nav class="flex items-center space-x-6 text-sm font-medium"><a${add_attribute("href", `${basePath}/`, 0)}${add_attribute(
    "class",
    cn("border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground/80", $page.url.pathname === `${basePath}/` ? "text-foreground border-primary" : "text-foreground/60"),
    0
  )}>Home</a> <a${add_attribute("href", `${basePath}/docs`, 0)}${add_attribute(
    "class",
    cn("border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground/80", $page.url.pathname.startsWith(`${basePath}/docs`) ? "text-foreground border-primary" : "text-foreground/60"),
    0
  )}>Documentation</a> <a${add_attribute("href", `${basePath}/api`, 0)}${add_attribute(
    "class",
    cn("border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground/80", $page.url.pathname.startsWith(`${basePath}/api`) ? "text-foreground border-primary" : "text-foreground/60"),
    0
  )}>API Reference</a></nav></div> <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end"><div class="w-full flex-1 md:w-auto md:flex-none">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(ExternalLink, "ExternalLink").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
					Get Started`;
    }
  })}</div></div></div></header>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  return `<footer class="border-t bg-background"><div class="container py-8 md:py-12"><div class="grid grid-cols-1 gap-8 md:grid-cols-4"><div class="space-y-3" data-svelte-h="svelte-1pvo26g"><h3 class="text-lg font-semibold">LLM Link</h3> <p class="text-sm text-muted-foreground max-w-xs">Universal LLM proxy service providing zero-configuration access to multiple providers.</p></div> <div class="space-y-3"><h4 class="text-sm font-semibold" data-svelte-h="svelte-kzoimb">Product</h4> <ul class="space-y-2 text-sm"><li><a href="${escape(basePath, true) + "/docs"}" class="text-muted-foreground hover:text-foreground">Documentation</a></li> <li><a href="${escape(basePath, true) + "/api"}" class="text-muted-foreground hover:text-foreground">API Reference</a></li></ul></div> <div class="space-y-3" data-svelte-h="svelte-1m3u7jc"><h4 class="text-sm font-semibold">Resources</h4> <ul class="space-y-2 text-sm"><li><a href="https://github.com/lipish/llm-link" class="text-muted-foreground hover:text-foreground">GitHub</a></li> <li><a href="https://crates.io/crates/llm-link" class="text-muted-foreground hover:text-foreground">Crates.io</a></li> <li><a href="https://docs.rs/llm-link" class="text-muted-foreground hover:text-foreground">API Docs</a></li></ul></div> <div class="space-y-3" data-svelte-h="svelte-na3tfz"><h4 class="text-sm font-semibold">Community</h4> <ul class="space-y-2 text-sm"><li><a href="https://github.com/lipish/llm-link/issues" class="text-muted-foreground hover:text-foreground">Issues</a></li> <li><a href="https://github.com/lipish/llm-link/releases" class="text-muted-foreground hover:text-foreground">Releases</a></li></ul></div></div> <div class="mt-8 border-t pt-8 text-center text-sm text-muted-foreground" data-svelte-h="svelte-1cx9q7i"><p>© 2025 LLM Link. MIT License.</p></div></div></footer>`;
});
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "body{@apply bg-background text-foreground;}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="min-h-screen bg-background font-sans antialiased"><div class="relative flex min-h-screen flex-col">${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})} <main class="flex-1">${slots.default ? slots.default({}) : ``}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div> </div>`;
});
export {
  Layout as default
};

import { c as create_ssr_component, b as subscribe, d as add_attribute, v as validate_component } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { c as cn, B as Button, G as Github } from "../../chunks/github.js";
import { E as ExternalLink } from "../../chunks/external-link.js";
const app = "";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"><div class="container flex h-14 items-center"><div class="mr-4 hidden md:flex"><a href="/" class="mr-6 flex items-center space-x-2" data-svelte-h="svelte-2ijh31"><span class="hidden font-bold sm:inline-block text-xl">LLM Link</span></a> <nav class="flex items-center space-x-6 text-sm font-medium"><a href="/"${add_attribute(
    "class",
    cn("transition-colors hover:text-foreground/80", $page.url.pathname === "/" ? "text-foreground" : "text-foreground/60"),
    0
  )}>Home</a> <a href="/docs"${add_attribute(
    "class",
    cn("transition-colors hover:text-foreground/80", $page.url.pathname.startsWith("/docs") ? "text-foreground" : "text-foreground/60"),
    0
  )}>Documentation</a> <a href="/providers"${add_attribute(
    "class",
    cn("transition-colors hover:text-foreground/80", $page.url.pathname === "/providers" ? "text-foreground" : "text-foreground/60"),
    0
  )}>Providers</a></nav></div> <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end"><div class="w-full flex-1 md:w-auto md:flex-none">${validate_component(Button, "Button").$$render($$result, { variant: "outline", class: "mr-2" }, {}, {
    default: () => {
      return `${validate_component(Github, "Github").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
					GitHub`;
    }
  })} ${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(ExternalLink, "ExternalLink").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
					Get Started`;
    }
  })}</div></div></div></header>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer class="border-t bg-background"><div class="container py-8 md:py-12"><div class="grid grid-cols-2 gap-8 lg:grid-cols-4" data-svelte-h="svelte-165goiy"><div class="space-y-3"><h3 class="text-lg font-semibold">LLM Link</h3> <p class="text-sm text-muted-foreground max-w-xs">Universal LLM proxy service providing zero-configuration access to multiple providers.</p></div> <div class="space-y-3"><h4 class="text-sm font-semibold">Product</h4> <ul class="space-y-2 text-sm"><li><a href="/docs" class="text-muted-foreground hover:text-foreground">Documentation</a></li> <li><a href="/providers" class="text-muted-foreground hover:text-foreground">Providers</a></li></ul></div> <div class="space-y-3"><h4 class="text-sm font-semibold">Resources</h4> <ul class="space-y-2 text-sm"><li><a href="https://github.com/lipish/llm-link" class="text-muted-foreground hover:text-foreground">GitHub</a></li> <li><a href="https://crates.io/crates/llm-link" class="text-muted-foreground hover:text-foreground">Crates.io</a></li> <li><a href="https://docs.rs/llm-link" class="text-muted-foreground hover:text-foreground">API Docs</a></li></ul></div> <div class="space-y-3"><h4 class="text-sm font-semibold">Community</h4> <ul class="space-y-2 text-sm"><li><a href="https://github.com/lipish/llm-link/issues" class="text-muted-foreground hover:text-foreground">Issues</a></li> <li><a href="https://github.com/lipish/llm-link/discussions" class="text-muted-foreground hover:text-foreground">Discussions</a></li> <li><a href="https://github.com/lipish/llm-link/pulls" class="text-muted-foreground hover:text-foreground">Pull Requests</a></li></ul></div></div> <div class="mt-8 border-t pt-8"><div class="flex flex-col items-center justify-between gap-4 md:flex-row"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-1bxcd82">© 2024 LLM Link. Built with Svelte + Tailwind CSS.</p> <div class="flex items-center space-x-4"><a href="https://github.com/lipish/llm-link" class="text-muted-foreground hover:text-foreground">${validate_component(Github, "Github").$$render($$result, { class: "h-4 w-4" }, {}, {})}</a></div></div></div></div></footer>`;
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

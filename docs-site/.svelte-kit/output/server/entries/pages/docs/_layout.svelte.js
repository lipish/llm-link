import { c as create_ssr_component, b as subscribe, f as each, e as escape, d as add_attribute } from "../../../chunks/ssr.js";
import { p as page } from "../../../chunks/stores.js";
import { b as base } from "../../../chunks/paths.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "a.selected.svelte-1c8il44{color:hsl(var(--primary));font-weight:500;border-left:2px solid hsl(var(--primary));margin-left:-0.5rem;padding-left:calc(0.5rem - 2px);background-color:transparent}a.selected-pill.svelte-1c8il44{background-color:hsl(var(--muted));color:hsl(var(--primary));font-weight:500;border-color:hsl(var(--primary))}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const basePath = base;
  const navGroups = [
    {
      title: "Getting Started",
      items: [
        { label: "Introduction", href: "/docs" },
        {
          label: "Quick Start",
          href: "/docs/quick-start"
        },
        {
          label: "Architecture",
          href: "/docs/architecture"
        }
      ]
    },
    {
      title: "Applications",
      items: [
        { label: "Zed.dev", href: "/docs/apps/zed" },
        {
          label: "Codex CLI",
          href: "/docs/apps/codex"
        },
        { label: "Aider", href: "/docs/apps/aider" },
        {
          label: "OpenHands",
          href: "/docs/apps/openhands"
        }
      ]
    },
    {
      title: "Protocols",
      items: [
        {
          label: "Protocol mode",
          href: "/docs/protocols"
        }
      ]
    },
    {
      title: "Reference",
      items: [{ label: "API Reference", href: "/api" }]
    }
  ];
  const isActive = (path, current) => {
    if (path === "/docs") {
      return current === `${basePath}/docs`;
    }
    if (path.startsWith("/docs/")) {
      return current.startsWith(`${basePath}${path}`);
    }
    return current.startsWith(`${basePath}${path}`);
  };
  $$result.css.add(css);
  $$unsubscribe_page();
  return `<div class="mx-auto max-w-6xl px-6 py-8"> <div class="mb-4 md:hidden"><nav class="flex flex-wrap gap-2 text-sm">${each(navGroups, (group) => {
    return `<div class="flex flex-wrap gap-2 w-full"><p class="w-full text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">${escape(group.title)}</p> ${each(group.items, (item) => {
      return `<a${add_attribute("href", `${basePath}${item.href}`, 0)} class="${[
        "inline-flex items-center rounded-full border px-3 py-1 text-[13px] hover:bg-muted/70 svelte-1c8il44",
        isActive(item.href, $page.url.pathname) ? "selected-pill" : ""
      ].join(" ").trim()}">${escape(item.label)} </a>`;
    })} </div>`;
  })}</nav></div> <div class="flex gap-10"><aside class="hidden md:block w-60 shrink-0 pr-4 border-r"><nav class="space-y-6 text-sm">${each(navGroups, (group) => {
    return `<div class="space-y-2"><p class="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">${escape(group.title)}</p> <div class="space-y-0.5">${each(group.items, (item) => {
      return `<a${add_attribute("href", `${basePath}${item.href}`, 0)} class="${[
        "block px-2 py-1.5 text-[13px] text-muted-foreground hover:text-foreground svelte-1c8il44",
        isActive(item.href, $page.url.pathname) ? "selected" : ""
      ].join(" ").trim()}"><span>${escape(item.label)}</span> </a>`;
    })}</div> </div>`;
  })}</nav></aside> <main class="flex-1 min-w-0">${slots.default ? slots.default({}) : ``}</main></div> </div>`;
});
export {
  Layout as default
};

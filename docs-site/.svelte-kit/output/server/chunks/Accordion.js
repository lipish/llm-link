import { c as create_ssr_component, v as validate_component, d as add_attribute, e as escape } from "./ssr.js";
import { I as Icon } from "./Icon.js";
const Chevron_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-down" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ChevronDown = Chevron_down;
const Accordion_svelte_svelte_type_style_lang = "";
const css = {
  code: ".accordion.svelte-fp70zn{border:1px solid hsl(var(--border));border-radius:0.5rem;overflow:hidden;background:hsl(var(--card))}.accordion-header.svelte-fp70zn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;background:transparent;border:none;cursor:pointer;transition:background-color 0.2s}.accordion-header.svelte-fp70zn:hover{background:hsl(var(--muted) / 0.5)}.accordion-title.svelte-fp70zn{font-size:1rem;font-weight:600;text-align:left}.accordion-icon.svelte-fp70zn{width:1.25rem;height:1.25rem;transition:transform 0.2s;color:hsl(var(--muted-foreground))}.accordion-icon.open.svelte-fp70zn{transform:rotate(180deg)}.accordion-content.svelte-fp70zn{padding:0 1.5rem 1.5rem;animation:svelte-fp70zn-slideDown 0.2s ease-out}@keyframes svelte-fp70zn-slideDown{from{opacity:0;transform:translateY(-0.5rem)}to{opacity:1;transform:translateY(0)}}",
  map: null
};
const Accordion = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { open = false } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css);
  return `<div class="accordion svelte-fp70zn"><button class="accordion-header svelte-fp70zn"${add_attribute("aria-expanded", open, 0)}><span class="accordion-title svelte-fp70zn">${escape(title)}</span> <div class="${["accordion-icon svelte-fp70zn", open ? "open" : ""].join(" ").trim()}">${validate_component(ChevronDown, "ChevronDown").$$render($$result, { size: 20 }, {}, {})}</div></button> ${open ? `<div class="accordion-content svelte-fp70zn">${slots.default ? slots.default({}) : ``}</div>` : ``} </div>`;
});
export {
  Accordion as A
};

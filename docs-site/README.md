# LLM Link Documentation Site

Official documentation website for LLM Link - a universal proxy for multiple LLM providers.

## Features

- **Modern UI**: Built with SvelteKit and Tailwind CSS
- **Syntax Highlighting**: Code examples with highlight.js
- **Responsive Design**: Mobile-friendly layout
- **Interactive Components**: Accordion sections for better organization

## Development

Install dependencies and start the development server:

```bash
cd docs-site
npm install
npm run dev
```

The site will be available at http://localhost:5173

## Building

Build the static site for production:

```bash
npm run build
npm run preview
```

## Technology Stack

- **Framework**: SvelteKit with static adapter
- **Styling**: Tailwind CSS + custom components
- **Icons**: Lucide Svelte
- **Code Highlighting**: highlight.js
- **Deployment**: GitHub Pages (automatic)

## Project Structure

```
docs-site/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable UI components
│   │   └── data/          # Provider data and configurations
│   └── routes/            # Page routes
│       ├── +page.svelte   # Homepage
│       ├── docs/          # Documentation page
│       └── providers/     # Providers page
├── static/                # Static assets
└── package.json
```

## Contributing

Contributions are welcome! Please ensure:

- All content is in English
- Code examples use syntax highlighting
- Follow the existing component structure
- Test responsive design on mobile devices

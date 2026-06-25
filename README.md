<div align="center">

# Lookbook Studio

**Premium Fashion Color Intelligence Platform**

Transform outfit photography into stunning 4K editorial lookbooks with garment-isolated color analysis and luxury palette generation.

[![Version](https://img.shields.io/badge/version-1.0.0-C5A258?style=for-the-badge&label=Version)](https://github.com/hafizbilalakbar/lookbook-studio)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge&label=License)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](https://github.com/hafizbilalakbar/lookbook-studio)
[![PRs](https://img.shields.io/badge/PRs-welcome-C5A258?style=for-the-badge)](https://github.com/hafizbilalakbar/lookbook-studio/pulls)
[![Stars](https://img.shields.io/github/stars/hafizbilalakbar/lookbook-studio?style=for-the-badge&color=C5A258)](https://github.com/hafizbilalakbar/lookbook-studio/stargazers)
[![Issues](https://img.shields.io/github/issues/hafizbilalakbar/lookbook-studio?style=for-the-badge)](https://github.com/hafizbilalakbar/lookbook-studio/issues)
[![Last Commit](https://img.shields.io/github/last-commit/hafizbilalakbar/lookbook-studio?style=for-the-badge&color=C5A258)](https://github.com/hafizbilalakbar/lookbook-studio/commits/main)
[![Maintained](https://img.shields.io/badge/maintained-yes-brightgreen?style=for-the-badge)](https://github.com/hafizbilalakbar/lookbook-studio)

</div>

---

## Overview

Lookbook Studio is a professional-grade fashion design platform that transforms outfit photography into production-ready editorial lookbooks and campaign posters. The platform isolates garment colors from uploaded images, generates luxury color palettes, and exports high-resolution 4K posters suitable for Pinterest, e-commerce, social campaigns, and digital brand collateral.

### Key Use Cases

- **Fashion Brands** — Create cohesive lookbook campaigns from product photography
- **E-commerce** — Generate color-accurate catalog sheets for online stores
- **Social Media** — Export Pinterest, Instagram Story, and campaign-ready posters
- **Personal Stylists** — Build visual color harmony boards for clients
- **Fashion Students** — Study garment color relationships and editorial layouts
- **Digital Artists** — Create professional fashion mood boards and palettes

---

## UI/UX

### Desktop Preview

![Desktop Preview](docs/screenshots/desktop-preview.png)

### Mobile Responsiveness

![Mobile Preview](docs/screenshots/mobile-preview.png)

### Tablet View

![Tablet Preview](docs/screenshots/tablet-preview.png)

> **Note:** Screenshots can be updated by replacing the images inside `docs/screenshots/`.

### UI Behavior

- Responsive Design: Adapts seamlessly across desktop, tablet, and mobile devices
- Modern UI/UX with premium visual hierarchy
- Smooth transitions and micro-interactions via Motion (Framer Motion)
- Accessibility support with semantic HTML structure
- Performance optimized with client-side rendering

---

## Features

### Lookbook Studio

- Upload outfit photos via drag-and-drop, file picker, or live camera capture
- Interactive color pin system — drag pins over garments to sample colors in real-time
- Live 9:16 poster preview with instant updates

### Fabric Palette System

- Automatic garment color extraction from uploaded images
- Manual color override with HEX input and color picker
- RGB value monitoring for precise color matching
- Custom color naming with luxury fashion terminology
- Color name source indicator (Studio Match vs Standard Name)

### Color Intelligence

- 52-entry curated luxury fashion color database
- Lab-distance-based color name matching using Chroma.js
- AI-powered styling recommendations with dual provider support (Gemini + OpenRouter)
- One-click color combination application

### Typography Studio

- 6 premium font families (Playfair Display, Cormorant Garamond, Bodoni Moda, Libre Baskerville, Inter, JetBrains Mono)
- Font weight, size scale, and alignment controls
- Text position and contrast mode settings
- Custom label and title color pickers
- Toggle visibility for category labels, color names, HEX, and RGB values

### Brand Kit Management

- Upload and store brand logos (PNG/SVG)
- Logo positioning (top-left, top-right, bottom-center)
- Logo scale adjustment
- Brand kit persistence across sessions

### Export Features

- 4K UHD canvas export (2160 x 3840 pixels)
- PNG, JPEG, and WebP format support
- Batch export — export entire campaign as ZIP archive
- Client-side rendering for instant downloads

### Layout System

- 4 editorial templates: Pinterest Classic, Zara Editorial, Instagram Story, Massimo Dutti Catalog
- Palette left/right layout toggle
- Catalog template with white card overlays

### Theme System

- Light, Dark, and System theme modes
- Persistent theme preference
- Luxury gold accent color system

### Additional Features

- Undo/Redo with Ctrl+Z / Ctrl+Y keyboard shortcuts
- Project duplication and deletion
- LocalStorage persistence for all projects
- Responsive design for all screen sizes
- About, Contact, Privacy Policy, and Terms pages

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 19 |
| **Language** | TypeScript | 5.8 |
| **Styling** | Tailwind CSS | 4 |
| **Build Tool** | Vite | 6 |
| **Animation** | Motion (Framer Motion) | 12 |
| **Icons** | Lucide React | 0.546 |
| **Color Science** | Chroma.js | 3.2 |
| **File Export** | FileSaver.js, JSZip | 2.0 / 3.10 |
| **Server** | Express.js | 4.21 |
| **AI Providers** | Google Gemini, OpenRouter | — |

---

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/hafizbilalakbar/lookbook-studio.git

# Navigate to project directory
cd lookbook-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Optional: AI-Powered Analysis

Lookbook Studio supports two AI providers for enhanced fashion color naming:

**Option 1: Google Gemini**
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Option 2: OpenRouter (GPT-4.1 Mini)**
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Priority:** Gemini > OpenRouter > Local pixel sampling

You can configure both keys; the system will use Gemini first if available.
Without any API key, the application uses client-side pixel sampling for color detection.

You can select your preferred provider in the **Settings** tab within the Studio control panel.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server (with Express backend)
npm run dev

# Type check
npm run lint

# Build for production
npm run build

# Preview production build
npm run start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Express backend |
| `npm run build` | Build for production |
| `npm run start` | Preview production build |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove build artifacts |

---

## Folder Structure

```
lookbook-studio/
├── docs/
│   └── screenshots/           # Project screenshots
├── public/                    # Static assets
│   ├── favicon.svg            # Brand favicon
│   ├── robots.txt             # Search engine rules
│   └── sitemap.xml            # Sitemap
├── src/
│   ├── components/            # React components
│   │   ├── AboutPage.tsx      # About page
│   │   ├── CameraModal.tsx    # Webcam capture modal
│   │   ├── ColorSourceBadge.tsx # Color name source indicator
│   │   ├── ContactPage.tsx    # Contact page
│   │   ├── ControlPanel.tsx   # Studio control panel
│   │   ├── Footer.tsx         # Site footer
│   │   ├── LandingHero.tsx    # Landing page hero
│   │   ├── LookbookPreview.tsx # Live poster preview
│   │   ├── PrivacyPage.tsx    # Privacy policy
│   │   ├── TermsPage.tsx      # Terms & conditions
│   │   └── ThemeSwitcher.tsx  # Theme toggle
│   ├── utils/                 # Utility functions
│   │   ├── batchExporter.ts   # ZIP batch export
│   │   ├── canvasExporter.ts  # 4K canvas rendering
│   │   ├── colorUtils.ts      # Color naming & conversion
│   │   ├── imageSampler.ts    # Pixel color extraction
│   │   └── projectStore.ts    # LocalStorage persistence
│   ├── App.tsx                # Root application
│   ├── index.css              # Global styles & themes
│   ├── main.tsx               # Entry point
│   └── types.ts               # TypeScript definitions
├── server.ts                  # Express dev server (AI API proxy)
├── index.html                 # HTML entry point
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite configuration
└── vercel.json                # Vercel deployment config
```

---

## Deployment

### Recommended Hosting

| Platform | Type | Best For |
|----------|------|----------|
| Vercel | Free Serverless | React + Vite (recommended) |
| Netlify | Free Static + Functions | JAMstack |
| GitHub Pages | Free Static Hosting | Static sites, docs |
| Railway | Full Stack Hosting | Node.js apps |
| Render | Backend Hosting | APIs & services |
| Fly.io | Edge Deployment | Docker & global apps |

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly:

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New...** > **Project**
3. Select `lookbook-studio` repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables (optional):
   - `GEMINI_API_KEY` — Google Gemini API key
   - `OPENROUTER_API_KEY` — OpenRouter API key
6. Click **Deploy**

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Build the project
npm run build

# The dist/ folder can be served by any static host
# Or use GitHub Actions for automatic deployment
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## Contributing

Contributions are what make the open-source community an amazing place to learn and grow. Any contributions you make are greatly appreciated.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding style and all tests pass.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## License

This project is MIT licensed — see the [LICENSE](LICENSE) file for details.

---

## Author

**Hafiz Bilal Akbar**

[![GitHub](https://img.shields.io/badge/GitHub-hafizbilalakbar-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hafizbilalakbar)

Full-stack developer & open-source contributor

---

<div align="center">

If you find this project useful, please consider giving it a star on GitHub!

[![Star on GitHub](https://img.shields.io/github/stars/hafizbilalakbar/lookbook-studio?style=for-the-badge&color=C5A258&logo=github)](https://github.com/hafizbilalakbar/lookbook-studio/stargazers)

</div>

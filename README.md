# ABS Polymers — Premium Industrial Machinery & Granules Platform

Industrial website and administration management platform for **ABS Polymers**, a premier plastic recycling machinery manufacturer and granules specialist based in **Coimbatore, Tamil Nadu, India**.

---

## 1. Verified Business Facts & Technical Baseline

- **Headquarters & Manufacturing:** Coimbatore, Tamil Nadu, India
- **Granules Business Experience:** 35+ Years
- **Machinery Manufacturing Experience:** 6+ Years
- **Export Footprint:** Active exports to the **United Arab Emirates (UAE)**; strategic plans for GCC & international expansion.
- **Machinery Specifications Source:** Directly digitized and verified against the official ABS Polymers Engineering Datasheet PDF (`/public/docs/abs-polymers-machinery-specifications.pdf`).

---

## 2. Core Machinery Product Lines

| Series | Category | Capacity Range | Key Mechanical Specifications |
|---|---|---|---|
| **ABSW Series** (W250 – W5000) | Plastic Washing Plants | 250 kg/h – 5000 kg/h | **10 FT Compact Design**, Closed-loop water recycling, SS 302 stainless steel contact parts, Havells motors & starters, 60°C–80°C hot washing, 120°C–140°C extrusion prep. |
| **G Series** (G250 – G2000) | Plastic Crushers / Granulators | 250 kg/h – 2000 kg/h | **EN41 alloy steel blades**, 20 HP to 60 HP Havells motors, 480 RPM heavy shear drive, min 20 mm high-flow screen mesh. |
| **CR Series** (CR250 – CR2000) | Screw Conveyors | 250 kg/h – 2000 kg/h | Standardized **5400 mm length**, 152 mm to 300 mm screw OD, 55 to 105 RPM, 7 HP to 20 HP Havells motors. |
| **MTB Series** (MTB250 – MTB2000) | Material Transport Blowers | 250 kg/h – 2000 kg/h | Dynamically balanced MS impeller, **2880 RPM Havells drive**, 1800 to 6500 m³/h airflow, 250 to 450 mmWG static pressure. |

---

## 3. Technology Architecture & File Structure

Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

```text
abs-polymers/
├── public/
│   ├── images/
│   │   ├── logo.png           # Official ABS Polymers transparent high-res logo
│   │   └── hero-reference.jpg # Industrial machinery hero reference
│   └── docs/
│       └── abs-polymers-machinery-specifications.pdf # Source PDF brochure
├── src/
│   ├── app/
│   │   ├── page.tsx           # Premium homepage with replaceable hero, 10 FT banner, 6 category cards, process, global reach
│   │   ├── about/page.tsx     # Company background, verified history, UAE export focus
│   │   ├── machineries/
│   │   │   ├── page.tsx       # Machinery catalogue with search, filter, and sorting
│   │   │   └── [slug]/page.tsx# Reusable detail template with mobile-responsive variant tables & brochure download
│   │   ├── granules/
│   │   │   ├── page.tsx       # HDPE, LDPE, PP, ABS, HIPS, GPPS catalogue
│   │   │   └── [slug]/page.tsx# Granule grade detail with technical properties
│   │   ├── services/
│   │   │   ├── page.tsx       # Complete recycling plant solutions, custom engineering, commissioning, spare parts
│   │   │   └── [slug]/page.tsx# Reusable service scope and deliverables template
│   │   ├── blog/
│   │   │   ├── page.tsx       # Knowledge centre listing with category filters
│   │   │   └── [slug]/page.tsx# Full technical guides with reading time and author credentials
│   │   ├── contact/page.tsx   # Quotation flow with product preselection and factory contact channels
│   │   ├── sitemap.ts         # Dynamic XML sitemap generator
│   │   ├── robots.ts          # Search engine crawler directives
│   │   ├── api/
│   │   │   ├── inquiries/     # Lead intake and status updates
│   │   │   ├── db-health/     # Database diagnostic health check
│   │   │   └── mcp/           # Local tool adapter & external MCP integration gateway
│   │   └── admin/
│   │       ├── layout.tsx     # Clean admin sidebar layout with dev mode indicator
│   │       ├── page.tsx       # KPI overview dashboard
│   │       ├── inquiries/     # CRM inquiry workspace with CSV export & quick status updates
│   │       ├── machineries/   # Specification verifications & variant management
│   │       ├── granules/      # Polymer grades & availability
│   │       ├── services/      # Service delivery scopes
│   │       ├── cms/           # Live preview homepage hero and banner editor
│   │       ├── blogs/         # Blog management
│   │       │   └── editor/    # Real-time SEO writing assistant (keyword density, readability, headings)
│   │       ├── seo/           # Technical SEO engine & audit
│   │       ├── db-health/     # Database health monitor & migration plan
│   │       └── settings/      # MCP adapter tool registry & environment blueprint
│   ├── components/            # Modular UI components
│   ├── data/                  # Verified product, service, and blog datasets
│   ├── services/              # Abstraction layer for DB and MCP adapters
│   └── types/                 # TypeScript entity contracts
```

---

## 4. Running the Project

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
# Open http://localhost:3000 in your browser

# Build production bundle & SSG static pages
npm run build

# Start production server
npm run start
```

---

## 5. Environment Variables Blueprint

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Optional (Production) | PostgreSQL / Supabase connection string. Defaults to in-memory repository mode if omitted. |
| `DB_PROVIDER` | Optional | E.g. `PostgreSQL` or `Supabase`. |
| `MCP_SERVER_URL` | Optional | External Model Context Protocol HTTP/WS endpoint for AI agents. |
| `MCP_API_KEY` | Optional | Bearer authentication key for MCP server. |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 measurement ID. |

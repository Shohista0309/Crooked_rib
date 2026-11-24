# CROOKED RIB — AI-Powered Social Fashion Marketplace

> **Slogan:** Fashion. Tailoring. Your Rules.  
> **Brand Philosophy:** *Qolipga sig‘maydiganlar uchun.*  
> **Product Category:** AI-Powered Social Fashion Marketplace for Uzbekistan.

---

## 1. Brand Identity & Colors

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Burgundy** | `#651D32` | Primary brand luxury tone, editorial headers, and badges |
| **Hot Pink** | `#F04476` | Vibrant CTA elements, needle accents, and highlights |
| **Cream** | `#F3EBDD` | Warm editorial backgrounds and soft contrast surfaces |
| **Black (Charcoal)** | `#191719` | Deep text, editorial banners, and technical specifications |

### Logo
The CROOKED RIB emblem unites **C** and **R**:
- The vertical stem of the **R** forms a slender sewing needle with an eyelet and tapered point.
- The bowls and curves of the **C** and **R** represent flowing craft thread.

---

## 2. Core Social Mission & Problem Statement

**Main Social Goal:** To assist in poverty reduction and expand employment and independent income opportunities for women in Uzbekistan.

Platform focus groups:
1. **Home-based women tailors (*Uyda tikuvchilik qiluvchi ayollar*)** who face geographical constraints or family care responsibilities.
2. **Unemployed women skilled in sewing (*Tikuvchilikni biladigan, ammo ishsiz xotin-qizlar*)** lacking marketing channels and client acquisition networks.
3. **Small tailoring workshops (*Kichik tikuvchilik ustaxonalari*)** seeking predictable order streams and direct supplier connections.

### Main Value Proposition
**CROOKED RIB connects customers, women tailors, fashion designers, and fabric suppliers through an AI-powered marketplace, creating new opportunities for work, orders, and income.**  
*AI is not the goal; it is the bridge that clarifies technical tailoring instructions and aligns client expectations with artisan capabilities.*

---

## 3. Account Roles & Capabilities

### A. Customer (Mijoz)
- Browse and filter verified local tailors by region, specialty, experience, and pricing.
- Design custom garments using the **AI Fashion Design Studio**.
- Receive **Smart Material Recommendations** from active seller inventories (Margilan silk, cotton-adras, buttons, trims).
- Submit order requests with attached design specifications and body measurements.
- Receive tailored quotations (price in UZS, turnaround days, artisan notes).
- Approve or decline quotations.
- Track real-time progress through 8 discrete statuses.
- Chat directly with tailors and fabric sellers.

### B. Creator / Tailor (Tikuvchi / Dizayner)
- Public professional artisan profile (workshop name, region, city, specialties, starting price, bio).
- Portfolio management (photos, categories, techniques, fabric descriptions).
- Receive and review incoming client requests.
- Submit transparent quotations (price, turnaround days, technical notes).
- Manage execution stages (`IN_PROGRESS`, `READY`, `COMPLETED`, `CANCELLED`).
- Chat directly with customers.

### C. Seller (Mato va Aksessuar Sotuvchisi)
- Shop profile (name, region, city, address, phone, catalog description).
- Full product CRUD (fabrics, threads, buttons, zippers, trims, accessories).
- Set prices, currency (UZS), available quantity, and unit of measure.
- Receive and respond to direct customer and tailor inquiries.

### D. Administrator
- Protected admin dashboard (`/dashboard/admin`).
- User directory and role oversight.
- Platform order overview and data moderation.
- Live database impact analytics.

---

## 4. Internationalization (i18n)

Full native tri-lingual support without automated browser translation dependencies:
1. **Uzbek (`uz`)** — Default
2. **Russian (`ru`)**
3. **English (`en`)**

Persistent via `localStorage` and `cr_language` cookies.

---

## 5. Technology Stack & Architecture

- **Frontend & App Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React.
- **Database & ORM:** Prisma ORM, relational schema with foreign keys, indexes, cascades, and migrations.
  - *Development / Zero-dependency local testing:* SQLite (`prisma/schema.prisma`).
  - *Production deployment:* PostgreSQL (`prisma/schema.postgresql.prisma`).
- **Authentication & Security:**
  - Password hashing with **Bcrypt (12 rounds)**.
  - Standards-based session token signing and verification with **Jose (JWT HS256)**.
  - Secure, HTTP-only, SameSite cookies (`cr_session`).
  - Multi-tenant data isolation: User A cannot read or tamper with User B's orders, designs, or products.
- **AI Fashion Design Engine:**
  - Server-side integration supporting OpenAI / Gemini compatible endpoints.
  - Validated JSON structured output.
  - **Zero-fake policy:** When `AI_API_KEY` is not configured, fake hallucinations are never generated. Instead, the interface transparently informs the user and enables manual design specification or sketch upload.
- **Testing:** Vitest automated test suite covering auth, order lifecycle, security isolation, and analytics integrity.

---

## 6. Getting Started Locally

### Prerequisites
- Node.js v18+ (tested on Node v24.19.0)
- npm v10+

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env`:
```bash
# Database Connection (SQLite local out-of-the-box)
DATABASE_URL="file:./dev.db"

# JWT Secret
AUTH_SECRET="crooked-rib-secure-jwt-and-cookie-secret-key-32-chars-minimum-fashiontech"

# Optional External AI API Key (Leave empty to test manual/sketch fallback)
AI_API_KEY=""
AI_API_URL="https://api.openai.com/v1/chat/completions"
AI_MODEL="gpt-4o"

# Optional Decart Lucy VTON realtime try-on (server-side only)
DECART_API_KEY=""

NODE_ENV="development"
```

Virtual Try-On defaults to local MediaPipe pose tracking with a Three.js GLB garment. Camera frames
are processed in the browser and are not sent to CROOKED RIB or an AI provider. The MediaPipe WASM
runtime and Pose Landmarker Lite model are fetched from their official public hosts; pose inference
itself runs locally. A CC BY 3.0 unrigged T-shirt follows shoulder/torso position, scale and limited
rotation; it does not deform to the body, and full 360-degree fitting is not supported. Asset credit
is in `public/garments/3d/ASSET-LICENSES.md`.

The optional Decart Lucy VTON mode still requires a server-only `DECART_API_KEY`, explicit user
consent and provider credits. When the key is absent the paid mode is disabled; it does not block the
local fitting experience.

### Step 3: Database Migration & Seeding
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### Step 4: Run Automated Tests
```bash
npm test
```

### Step 5: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Demo Accounts for Immediate Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `laylo.customer@crookedrib.uz` | `CrookedRib2026!` |
| **Tailor** | `dilnoza.tailor@crookedrib.uz` | `CrookedRib2026!` |
| **Seller** | `shaxnoza.fabrics@crookedrib.uz` | `CrookedRib2026!` |
| **Admin** | `admin@crookedrib.uz` | `CrookedRib2026!` |

---

## 8. Automated Test Results

The test suite validates:
- [x] Password hashing & verification
- [x] JWT token signing & tampering protection
- [x] 8-stage order quotation and approval lifecycle
- [x] Cross-tenant security isolation (Customer A cannot access Customer B's orders; Seller A cannot edit Seller B's inventory)
- [x] Real database impact analytics calculation (verified gross volume without synthetic inflation)

---

## 9. Social Impact Transparency Statement

All metrics displayed on the **Social Impact** page (`/social-impact`) and Landing Page are computed directly from the live relational database. Gross order volume represents confirmed platform transaction amounts and is explicitly distinguished from individual net tailor profit to maintain scientific integrity for socio-economic research in Uzbekistan.

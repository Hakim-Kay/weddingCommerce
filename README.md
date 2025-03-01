# Wedding Photography E-commerce Platform

This is a wedding photography e-commerce platform built with Nuxt.js, similar to Adobe Stock or Pixieset. Users can browse, preview, purchase, and download wedding photographs with content protection features.

## Features

- Photo browsing and preview with playback controls and background music
- Content protection system to prevent unauthorized screenshots or recordings
- Favorites collection for users to save images
- Purchase flow with Stripe integration
- Download management with limited downloads per purchased image
- User authentication via Clerk
- Responsive, mobile-first approach

## Tech Stack

- Framework: Nuxt.js (v3) with TypeScript
- State Management: Pinia
- Styling: UnoCSS (implementing Client-First methodology)
- UI Components: shadcn UI-Vue
- Authentication: Clerk
- Payment Processing: Stripe
- Database: Supabase (PostgreSQL)
- Image Management: Uploadthing & TwicPics
- Deployment: Cloudflare

## Setup and Development

### Prerequisites

- Node.js (v20)
- pnpm (v8+)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wedding-photography-platform.git
cd wedding-photography-platform

# Install dependencies
pnpm install

# Create a .env file (copy from .env.example)
cp .env.example .env
```

---

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm dev

```

## Production

Build the application for production:

```bash
# pnpm
pnpm build

```

Locally preview production build:

```bash
# pnpm
pnpm preview

```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

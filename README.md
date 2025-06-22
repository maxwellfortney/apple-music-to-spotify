# Crossfade - Apple Music to Spotify Queue Manager

Crossfade is a web application that allows Apple Music users to manage a Spotify user's queue. This enables seamless music sharing and queue management across different music platforms.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Spotify Developer Account
- Apple Music API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <dir>
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

Create the following environment files with the required variables. See the `packages/env/src/` directory for the exact environment variables needed:

- `apps/nextjs/.env.local` - Next.js environment variables
- `apps/nestjs/.env` - NestJS environment variables

4. Start the development servers:
```bash
# Start both frontend and backend
pnpm dev

# Or start individually
cd apps/nextjs && pnpm dev
cd apps/nestjs && pnpm dev
```

## Project Structure

```
├── apps/
│   ├── nextjs/          # Frontend application
│   └── nestjs/          # Backend API
├── packages/
│   ├── ui/              # Shared UI components"
│   ├── types/           # Shared TypeScript types
│   ├── env/             # Environment configuration
│   └── typescript-config/ # TypeScript configurations
```
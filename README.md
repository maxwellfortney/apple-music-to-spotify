# Crossfade - Apple Music to Spotify Queue Manager

Crossfade is a web application that allows Apple Music users to manage a Spotify user's queue. This enables seamless music sharing and queue management across different music platforms.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Spotify Developer Account
- Apple Developer Account

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

## Hosting and Domain Configuration

Both the frontend and backend applications need to be hosted on separate domains/subdomains. These domains must be configured in the respective developer consoles:

### Required Domains

- **Frontend Domain**: `https://frontend.mydomain.com` (Next.js app)
- **Backend Domain**: `https://backend.mydomain.com` (NestJS API)

### Developer Console Configuration

Configure your domains in the following developer consoles:

- **Spotify Developer Console**: Add your frontend domain to redirect URIs
- **Apple Developer Console**: Configure associated domains and universal links
- **Google Console** (if using Google OAuth): Add authorized redirect URIs

### Environment Variables Update

After setting up your domains, update your environment files with the production URLs. See the `packages/env/src/` directory for the exact environment variables needed.

## iOS Shortcut Setup

To enable "Open in Crossfade" in your iOS share menu, create a custom shortcut:

### Creating the Shortcut

1. Open the **Shortcuts** app on your iOS device
2. Create a new shortcut with these actions:
   - **Get Input** (URL type)
   - **URL** action with your Crossfade base URL: `https://your-domain.com/share?songUrl=`
   - **Combine Text** to merge the base URL with the input
   - **Open URL** to launch the combined URL

### Adding to Share Menu

1. In the Shortcuts app, tap the shortcut you created
2. Tap the share button and select **"Add to Share Sheet"**
3. Customize when it appears (e.g., only for URLs)

### Usage

1. Open Apple Music and find a song you want to share
2. Tap the share button and select your "Open in Crossfade" shortcut
3. The song will open in Crossfade for queue management

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
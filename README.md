# Nexus

Nexus is a scalable, feature-rich collaboration and communication platform designed to bring teams together. Built with a modern tech stack (React, TypeScript, Vite, Tailwind CSS, and Zustand), it provides an experience akin to platforms like Microsoft Teams or Slack.

## Core Features

- 💬 **Messaging & Channels**: Robust text, image, file, and system messaging within organized channels.
- 📞 **Voice & Video Calls**: Real-time communication and conferencing capabilities.
- 👥 **Team & Workspace Management**: Manage users, roles (owner, admin, member, guest), and channel access.
- 📁 **File Sharing**: Centralized file uploads and attachments.
- 🔔 **Notifications**: Stay updated with mentions, replies, reactions, DMs, and calls.
- 🧭 **Keyboard Shortcuts**: Power user shortcuts (like \`⌘K\` for quick search and \`⌘\\\` for sidebar toggling).
- 🎨 **Modern Design System**: Beautiful and responsive UI built with Tailwind CSS, supporting dark/light mode seamlessly.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router

## Directory Structure

\`\`\`
src/
├── assets/           # Static assets, fonts, and images
├── components/       # Reusable components organized by domain (calls, channels, chat, layout)
├── constants/        # Application-wide constants & storage keys
├── hooks/            # Custom React hooks
├── mockData/         # Local stubs and placeholder data during development
├── pages/            # High-level views/routes (Chat, Teams, Calendar, etc.)
├── services/         # API wrappers and socket logic
├── store/            # Global state management (Zustand)
├── types/            # Centralized TypeScript definitions
└── utils/            # Shared utilities and helper functions
\`\`\`

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/gautam0222/Nexus.git
   cd Nexus
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open \`http://localhost:5173\` in your browser to view the application.

## Available Scripts

- \`npm run dev\` - Starts the development server.
- \`npm run build\` - Builds the app for production.
- \`npm run lint\` - Runs ESLint to catch code quality issues.
- \`npm run preview\` - Locally preview the production build.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`⌘\` + \`K\`  | Open Global Search |
| \`⌘\` + \`\\\`  | Toggle Sidebar |
| \`Esc\`    | Close Overlays / Search |

## License

This project is licensed under the MIT License.

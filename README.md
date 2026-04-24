# Nexus — Modern Team Communication

Nexus is a fast, responsive, and beautifully designed team communication platform. Inspired by modern chat apps like Slack and Discord, Nexus focuses on a clean, distraction-free UI, keyboard accessibility, and a premium user experience.

## ✨ Features

### 💬 Rich Messaging
*   **Rich Text Composer**: Format your messages with Bold, Italic, Strikethrough, Code, and Links using a contextual toolbar or keyboard shortcuts (`⌘B`, `⌘I`, `⌘E`).
*   **Markdown Support**: Full inline markdown rendering for messages, including code blocks, blockquotes, and links.
*   **Message Actions**: Edit your own messages inline, delete messages, and reply in threaded conversations.
*   **Smart Timeline**: Auto-scrolling, date dividers (Today, Yesterday), and an animated typing indicator.
*   **Reactions**: A fast popup reaction picker and standard emoji picker built from scratch.

### 📎 Media & Attachments
*   **Drag & Drop**: Seamlessly drag and drop files onto the composer to attach them.
*   **Inline Previews**: Image attachments display thumbnail previews directly inside the chat timeline.

### ⌨️ Power-User Navigation
*   **Command Palette (`⌘K`)**: A global command palette to instantly search channels, direct messages, or execute quick actions.
*   **Keyboard First**: Submit with `Enter`, newline with `Shift+Enter`, and navigate popups with arrow keys.

### 🎨 Premium UI/UX
*   **Tailwind 12-Color System**: Built on a highly constrained, cohesive, and custom token-based Tailwind CSS design system.
*   **Immersive Layout**: AppShell-based layout with collapsible sidebars, a sliding right-hand thread panel, and a member list panel.
*   **Micro-animations**: Smooth hover transitions, fade-ins, and layout snaps for a polished feel.

## 🚀 Tech Stack

*   **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) + CSS Variables
*   **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) (for Channels, Messages, UI state, and Auth)
*   **Routing**: [React Router v6](https://reactrouter.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gautam0222/Nexus.git
   cd Nexus
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` (or the port specified by Vite).

## 📁 Project Structure

```text
src/
├── components/
│   ├── chat/        # Message items, Composer, Thread panels
│   ├── layout/      # AppShell, Sidebar, Top Navigation
│   └── ui/          # Generic reusable UI (Toast, CommandPalette, EmojiPicker)
├── store/           # Zustand stores (messageStore, channelStore, uiStore)
├── pages/           # Route-level components (Activity, Chat, Teams)
├── utils/           # Helper functions (cn for Tailwind, formatters)
├── types/           # TypeScript interfaces and entity models
└── mockData/        # Seed data to run the app without a backend
```

## 📜 License
This project is open-source and available under the MIT License.

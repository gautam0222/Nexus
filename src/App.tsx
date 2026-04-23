import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import ChatPage from './pages/Chat'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AppShell is the root layout. It renders the Sidebar and NavRail. */}
        <Route element={<AppShell />}>
          
          {/* Main Chat Route */}
          <Route path="/chat" element={<ChatPage />} />

          {/* Placeholder routes mapped back to chat for now */}
          <Route path="/teams" element={<ChatPage />} />
          <Route path="/activity" element={<ChatPage />} />
          <Route path="/calendar" element={<ChatPage />} />
          <Route path="/files" element={<ChatPage />} />
          
          {/* Default redirect to /chat */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

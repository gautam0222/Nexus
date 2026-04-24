import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { lazy, Suspense } from 'react'

const RootRedirect = lazy(() => import('@/pages/Root'))
const ActivityPage = lazy(() => import('@/pages/Activity'))
const ChatPage     = lazy(() => import('@/pages/Chat'))
const DMPage       = lazy(() => import('@/pages/Chat/DMPage'))
const TeamsPage    = lazy(() => import('@/pages/Teams'))
const CalendarPage = lazy(() => import('@/pages/Calendar'))
const FilesPage    = lazy(() => import('@/pages/Files'))
const CallsPage    = lazy(() => import('@/pages/Calls'))
const CallRoom     = lazy(() => import('@/pages/Calls/CallRoom'))
const SettingsPage = lazy(() => import('@/pages/Settings'))

function PageLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-nx-indigo shadow-glow-sm">
          <span className="text-lg font-bold text-white">N</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-nx-indigo animate-pulse-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true,                         element: <S><RootRedirect /></S> },
      { path: 'activity',                    element: <S><ActivityPage /></S> },
      { path: 'chat',                        element: <S><ChatPage /></S> },
      { path: 'chat/:teamId/:channelId',     element: <S><ChatPage /></S> },
      { path: 'dm/:userId',                  element: <S><DMPage /></S> },
      { path: 'teams',                       element: <S><TeamsPage /></S> },
      { path: 'teams/:teamId',               element: <S><TeamsPage /></S> },
      { path: 'calendar',                    element: <S><CalendarPage /></S> },
      { path: 'files',                       element: <S><FilesPage /></S> },
      { path: 'calls',                       element: <S><CallsPage /></S> },
      { path: 'settings',                    element: <S><SettingsPage /></S> },
      { path: 'settings/:tab',               element: <S><SettingsPage /></S> },
    ],
  },
  // Call room is full-screen — outside AppShell
  { path: '/call/:callId', element: <S><CallRoom /></S> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

import { FolderOpen, Upload, Grid, List, Search, FileText, Image, Film, Archive } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_USERS } from '@/mockData'
import { formatBytes, cn } from '@/utils'

interface MockFile {
  id: string; name: string; size: number; type: string;
  uploadedBy: typeof MOCK_USERS[0]; uploadedAt: string; channel: string
}

const MOCK_FILES: MockFile[] = [
  { id: 'f1', name: 'Design_System_v2.fig', size: 4_200_000, type: 'figma', uploadedBy: MOCK_USERS[1], uploadedAt: '2 hours ago', channel: '#design-reviews' },
  { id: 'f2', name: 'Q3_Roadmap.pdf', size: 1_100_000, type: 'pdf', uploadedBy: MOCK_USERS[0], uploadedAt: '5 hours ago', channel: '#general' },
  { id: 'f3', name: 'auth_flow_diagram.png', size: 890_000, type: 'image', uploadedBy: MOCK_USERS[3], uploadedAt: 'Yesterday', channel: '#backend' },
  { id: 'f4', name: 'Nexus_Brand_Assets.zip', size: 23_000_000, type: 'archive', uploadedBy: MOCK_USERS[1], uploadedAt: '2 days ago', channel: '#general' },
  { id: 'f5', name: 'API_Schema.json', size: 42_000, type: 'code', uploadedBy: MOCK_USERS[3], uploadedAt: '3 days ago', channel: '#backend' },
  { id: 'f6', name: 'onboarding_video.mp4', size: 86_000_000, type: 'video', uploadedBy: MOCK_USERS[2], uploadedAt: 'Last week', channel: '#general' },
]

function FileIcon({ type }: { type: string }) {
  const base = 'flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0'
  if (type === 'image') return <div className={cn(base, 'bg-nx-mint/15 text-nx-mint')}><Image size={20} /></div>
  if (type === 'video') return <div className={cn(base, 'bg-nx-red/15 text-nx-red')}><Film size={20} /></div>
  if (type === 'archive') return <div className={cn(base, 'bg-nx-amber/15 text-nx-amber')}><Archive size={20} /></div>
  return <div className={cn(base, 'bg-nx-indigo/15 text-nx-indigo-l')}><FileText size={20} /></div>
}

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-nx-border px-6 py-3 pl-14">
        <div className="flex items-center gap-3">
          <FolderOpen size={18} className="text-nx-muted" />
          <h1 className="text-md font-semibold text-nx-cream">Files</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-nx-border overflow-hidden">
            <button onClick={() => setViewMode('list')} className={cn('p-1.5 transition-colors', viewMode === 'list' ? 'bg-nx-surface3 text-nx-cream' : 'text-nx-muted hover:bg-nx-surface2')}>
              <List size={14} />
            </button>
            <button onClick={() => setViewMode('grid')} className={cn('p-1.5 transition-colors', viewMode === 'grid' ? 'bg-nx-surface3 text-nx-cream' : 'text-nx-muted hover:bg-nx-surface2')}>
              <Grid size={14} />
            </button>
          </div>
          <Button variant="primary" size="sm" icon={<Upload size={14} />}>Upload</Button>
        </div>
      </header>

      {/* Search bar */}
      <div className="flex-shrink-0 border-b border-nx-border px-5 py-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-nx-border bg-nx-surface2 px-3 py-1.5">
          <Search size={14} className="text-nx-subtle" />
          <input className="flex-1 bg-transparent text-sm text-nx-cream placeholder-nx-subtle outline-none" placeholder="Search files…" />
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto p-5">
        {viewMode === 'list' ? (
          <div className="overflow-hidden rounded-xl border border-nx-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-nx-border bg-nx-surface2">
                  {['Name', 'Uploaded by', 'Channel', 'Size', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-nx-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_FILES.map((file) => (
                  <tr key={file.id} className="border-b border-nx-border/50 transition-colors hover:bg-nx-surface2 cursor-pointer last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileIcon type={file.type} />
                        <span className="font-medium text-nx-cream">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={file.uploadedBy.initials} size="xs" />
                        <span className="text-nx-muted">{file.uploadedBy.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-nx-indigo-l">{file.channel}</td>
                    <td className="px-4 py-3 text-nx-muted">{formatBytes(file.size)}</td>
                    <td className="px-4 py-3 text-nx-subtle">{file.uploadedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {MOCK_FILES.map((file) => (
              <div key={file.id} className="group flex flex-col gap-3 rounded-xl border border-nx-border bg-nx-surface2 p-4 cursor-pointer hover:border-nx-border2 hover:bg-nx-surface3 transition-all">
                <FileIcon type={file.type} />
                <div>
                  <p className="truncate text-sm font-medium text-nx-cream">{file.name}</p>
                  <p className="mt-0.5 text-xs text-nx-muted">{formatBytes(file.size)} · {file.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

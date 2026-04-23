// ─── Core entity types ────────────────────────────────────────────────────────

export type UserStatus = 'online' | 'away' | 'busy' | 'offline'
export type UserRole = 'owner' | 'admin' | 'member' | 'guest'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  initials: string
  status: UserStatus
  role: UserRole
  title?: string
  timezone?: string
  createdAt: string
}

export interface CurrentUser extends User {
  teams: string[]    // team IDs
}

// ─── Workspace / Team ─────────────────────────────────────────────────────────

export interface Team {
  id: string
  name: string
  slug: string
  description?: string
  avatar?: string
  color: string       // hex color for team avatar fallback
  memberCount: number
  isPrivate: boolean
  createdAt: string
}

// ─── Channels ─────────────────────────────────────────────────────────────────

export type ChannelType = 'text' | 'announcement' | 'voice'

export interface Channel {
  id: string
  teamId: string
  name: string
  description?: string
  type: ChannelType
  isPrivate: boolean
  memberCount: number
  unreadCount: number
  hasMention: boolean
  lastMessageAt?: string
  isPinned: boolean
  createdAt: string
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export type MessageType = 'text' | 'image' | 'file' | 'system' | 'call'

export interface Reaction {
  emoji: string
  count: number
  userIds: string[]
}

export interface FileAttachment {
  id: string
  name: string
  size: number      // bytes
  mimeType: string
  url: string
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  author: User
  content: string
  type: MessageType
  reactions: Reaction[]
  attachments: FileAttachment[]
  replyCount: number
  threadId?: string   // parent message ID if this is in a thread
  isEdited: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

// ─── Direct Messages ──────────────────────────────────────────────────────────

export interface DirectMessageThread {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
}

// ─── Calls ────────────────────────────────────────────────────────────────────

export type CallStatus = 'ringing' | 'active' | 'ended' | 'missed'

export interface Call {
  id: string
  channelId?: string
  participants: User[]
  status: CallStatus
  startedAt?: string
  endedAt?: string
  isVideo: boolean
}

// ─── Files ────────────────────────────────────────────────────────────────────

export interface SharedFile {
  id: string
  name: string
  size: number
  mimeType: string
  url: string
  uploadedBy: User
  channelId?: string
  createdAt: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'mention' | 'reply' | 'reaction' | 'dm' | 'call'

export interface Notification {
  id: string
  type: NotificationType
  message: Message
  isRead: boolean
  createdAt: string
}

// ─── UI / Navigation ──────────────────────────────────────────────────────────

export type NavSection = 'activity' | 'chat' | 'teams' | 'calendar' | 'files' | 'calls'

export interface BreadcrumbItem {
  label: string
  path?: string
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

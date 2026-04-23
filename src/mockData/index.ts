import type { User, Team, Channel, Message, DirectMessageThread, Notification } from '@/types'

// ─── Users ────────────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Carter',
    email: 'alex@nexus.app',
    initials: 'AC',
    status: 'online',
    role: 'owner',
    title: 'Engineering Lead',
    timezone: 'America/New_York',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'priya@nexus.app',
    initials: 'PS',
    status: 'online',
    role: 'admin',
    title: 'Product Designer',
    timezone: 'Asia/Kolkata',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'u3',
    name: 'Jordan Kim',
    email: 'jordan@nexus.app',
    initials: 'JK',
    status: 'busy',
    role: 'member',
    title: 'Frontend Engineer',
    timezone: 'America/Los_Angeles',
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 'u4',
    name: 'Sam Okafor',
    email: 'sam@nexus.app',
    initials: 'SO',
    status: 'away',
    role: 'member',
    title: 'Backend Engineer',
    timezone: 'Europe/London',
    createdAt: '2024-01-04T00:00:00Z',
  },
  {
    id: 'u5',
    name: 'Mia Thornton',
    email: 'mia@nexus.app',
    initials: 'MT',
    status: 'offline',
    role: 'member',
    title: 'Data Engineer',
    timezone: 'America/Chicago',
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'u6',
    name: 'Ryo Nakamura',
    email: 'ryo@nexus.app',
    initials: 'RN',
    status: 'online',
    role: 'member',
    title: 'DevOps Engineer',
    timezone: 'Asia/Tokyo',
    createdAt: '2024-01-06T00:00:00Z',
  },
]

export const CURRENT_USER: User = MOCK_USERS[0]

// ─── Teams ────────────────────────────────────────────────────────────────────

export const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Engineering',
    slug: 'engineering',
    description: 'All things code, infra, and architecture',
    color: '#6366F1',
    memberCount: 12,
    isPrivate: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't2',
    name: 'Design',
    slug: 'design',
    description: 'Product design, research, and brand',
    color: '#22D3A5',
    memberCount: 5,
    isPrivate: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't3',
    name: 'Product',
    slug: 'product',
    description: 'Roadmap, planning, and strategy',
    color: '#F59E0B',
    memberCount: 8,
    isPrivate: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't4',
    name: 'Leadership',
    slug: 'leadership',
    description: 'Executive team — private',
    color: '#F43F5E',
    memberCount: 3,
    isPrivate: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// ─── Channels ─────────────────────────────────────────────────────────────────

export const MOCK_CHANNELS: Channel[] = [
  // Engineering channels
  {
    id: 'ch1', teamId: 't1', name: 'general', type: 'text',
    description: 'General engineering chat and announcements',
    isPrivate: false, memberCount: 12, unreadCount: 3, hasMention: false,
    lastMessageAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isPinned: true, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ch2', teamId: 't1', name: 'frontend', type: 'text',
    description: 'React, TypeScript, UI/UX discussions',
    isPrivate: false, memberCount: 7, unreadCount: 0, hasMention: false,
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isPinned: false, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ch3', teamId: 't1', name: 'backend', type: 'text',
    description: 'APIs, databases, and services',
    isPrivate: false, memberCount: 6, unreadCount: 1, hasMention: true,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isPinned: false, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ch4', teamId: 't1', name: 'deployments', type: 'announcement',
    description: 'Automated deploy notifications',
    isPrivate: false, memberCount: 12, unreadCount: 2, hasMention: false,
    lastMessageAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isPinned: false, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ch5', teamId: 't1', name: 'standup', type: 'text',
    description: 'Daily async standups',
    isPrivate: false, memberCount: 12, unreadCount: 0, hasMention: false,
    lastMessageAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isPinned: false, createdAt: '2024-01-01T00:00:00Z',
  },
  // Design channels
  {
    id: 'ch6', teamId: 't2', name: 'general', type: 'text',
    description: 'Design team general chat',
    isPrivate: false, memberCount: 5, unreadCount: 0, hasMention: false,
    lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isPinned: true, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ch7', teamId: 't2', name: 'design-reviews', type: 'text',
    description: 'Share and review designs',
    isPrivate: false, memberCount: 5, unreadCount: 5, hasMention: true,
    lastMessageAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isPinned: false, createdAt: '2024-01-01T00:00:00Z',
  },
]

// ─── Messages ─────────────────────────────────────────────────────────────────

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1', channelId: 'ch1', authorId: 'u2', author: MOCK_USERS[1],
    content: 'Hey everyone! Just pushed the new design tokens to Figma. Can someone from frontend review the updated spacing scale?',
    type: 'text', reactions: [{ emoji: '👀', count: 2, userIds: ['u1', 'u3'] }],
    attachments: [], replyCount: 3, isEdited: false, isPinned: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'm2', channelId: 'ch1', authorId: 'u3', author: MOCK_USERS[2],
    content: "On it! Give me ~20 mins to go through it. The 4px base grid should map nicely to our Tailwind config.",
    type: 'text', reactions: [{ emoji: '✅', count: 1, userIds: ['u2'] }],
    attachments: [], replyCount: 0, isEdited: false, isPinned: false,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'm3', channelId: 'ch1', authorId: 'u4', author: MOCK_USERS[3],
    content: 'The new auth service is live in staging. Please test your flows and report anything weird in #backend.',
    type: 'text', reactions: [
      { emoji: '🚀', count: 4, userIds: ['u1', 'u2', 'u3', 'u5'] },
      { emoji: '🙌', count: 2, userIds: ['u1', 'u6'] },
    ],
    attachments: [], replyCount: 1, isEdited: false, isPinned: true,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'm4', channelId: 'ch1', authorId: 'u1', author: MOCK_USERS[0],
    content: 'Great work everyone. Ship it 🎉',
    type: 'text', reactions: [],
    attachments: [], replyCount: 0, isEdited: false, isPinned: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
]

// ─── Direct message threads ───────────────────────────────────────────────────

export const MOCK_DM_THREADS: DirectMessageThread[] = [
  {
    id: 'dm1',
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
    lastMessage: MOCK_MESSAGES[0],
    unreadCount: 2,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'dm2',
    participants: [MOCK_USERS[0], MOCK_USERS[2]],
    lastMessage: MOCK_MESSAGES[1],
    unreadCount: 0,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'dm3',
    participants: [MOCK_USERS[0], MOCK_USERS[3]],
    lastMessage: MOCK_MESSAGES[2],
    unreadCount: 0,
    createdAt: '2024-01-11T00:00:00Z',
  },
]

// ─── Notifications ────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', type: 'mention', message: MOCK_MESSAGES[0],
    isRead: false, createdAt: MOCK_MESSAGES[0].createdAt,
  },
  {
    id: 'n2', type: 'reply', message: MOCK_MESSAGES[1],
    isRead: false, createdAt: MOCK_MESSAGES[1].createdAt,
  },
  {
    id: 'n3', type: 'reaction', message: MOCK_MESSAGES[2],
    isRead: true, createdAt: MOCK_MESSAGES[2].createdAt,
  },
]
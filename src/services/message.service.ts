import type { Message, PaginatedResponse } from '@/types'

export const messageService = {
  list: (
    _channelId: string,
    _page: number,
  ): Promise<PaginatedResponse<Message>> => Promise.reject('stub'),
  send: (_channelId: string, _content: string): Promise<Message> =>
    Promise.reject('stub'),
  update: (_messageId: string, _content: string): Promise<Message> =>
    Promise.reject('stub'),
  delete: (_messageId: string): Promise<void> => Promise.reject('stub'),
  react: (_messageId: string, _emoji: string): Promise<void> =>
    Promise.reject('stub'),
}

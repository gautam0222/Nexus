type SocketEvent =
  | 'message:new'
  | 'message:update'
  | 'message:delete'
  | 'user:status'
  | 'channel:update'
  | 'typing:start'
  | 'typing:stop'

type EventHandler = (data: unknown) => void

class SocketService {
  private connected = false

  private handlers: Map<SocketEvent, EventHandler[]> = new Map()

  connect(_token: string): void {
    console.log('[Socket] connect stub')
    this.connected = false
  }

  disconnect(): void {
    console.log('[Socket] disconnect stub')
    this.connected = false
  }

  on(event: SocketEvent, handler: EventHandler): void {
    const existing = this.handlers.get(event) ?? []
    this.handlers.set(event, [...existing, handler])
  }

  off(event: SocketEvent, handler: EventHandler): void {
    const existing = this.handlers.get(event) ?? []
    this.handlers.set(
      event,
      existing.filter((h) => h !== handler),
    )
  }

  emit(_event: string, _data: unknown): void {
    console.log('[Socket] emit stub', { connected: this.connected })
  }
}

export const socket = new SocketService()

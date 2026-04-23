import { APP_CONFIG } from '@/constants'
import type { ApiResponse } from '@/types'

const BASE_URL = APP_CONFIG.api.baseUrl

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  console.log(`[API] ${method} ${BASE_URL}${path}`, body ?? '')
  throw new Error('API not implemented - backend coming in Phase 2')
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}

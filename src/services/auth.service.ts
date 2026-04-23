import type { User } from '@/types'

export const authService = {
  login: (_email: string, _password: string): Promise<User> =>
    Promise.reject('stub'),
  logout: (): Promise<void> => Promise.reject('stub'),
  refresh: (): Promise<string> => Promise.reject('stub'),
  me: (): Promise<User> => Promise.reject('stub'),
}

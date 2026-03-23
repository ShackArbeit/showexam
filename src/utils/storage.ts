import type { LoginResponse } from '../types/auth'

const ACCESS_TOKEN_KEY = 'showexam.accessToken'
const USER_KEY = 'showexam.user'

export function saveAuthSession(session: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as LoginResponse['user']
  } catch {
    clearAuthSession()
    return null
  }
}

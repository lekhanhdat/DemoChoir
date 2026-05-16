const AUTH_STORAGE_KEY = 'gia-phuoc-choir-authenticated'
const DEMO_USERNAME = 'demo'
const DEMO_PASSWORD = 'demo123'

export function loginWithDemoAccount(username: string, password: string): boolean {
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    return true
  }

  return false
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

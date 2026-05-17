const AUTH_SESSION_STORAGE_KEY = 'gia-phuoc-choir-auth-session'
const LEGACY_AUTH_STORAGE_KEY = 'gia-phuoc-choir-authenticated'

type LocalAccount = {
  username: string
  password: string
  displayName: string
}

export type AuthUser = {
  username: string
  displayName: string
}

/**
 * Danh sách tài khoản hardcode nội bộ.
 * Muốn thêm tài khoản mới, chỉ cần thêm object vào mảng này.
 */
const LOCAL_ACCOUNTS: readonly LocalAccount[] = [
  {
    username: 'demo',
    password: 'demo123',
    displayName: 'Ca trưởng',
  },
  {
    username: 'xuanvy',
    password: 'phaoloxuanvy',
    displayName: 'Phaolô Nguyễn Xuân Vỹ',
  },
  {
    username: 'joseph',
    password: 'Lekhanhdat09',
    displayName: 'Giuse Lê Khánh Đạt',
  },
  {
    username: 'aneanh',
    password: 'anengocanh',
    displayName: 'Anê Huỳnh Ngọc Ánh',
  },
  {
    username: 'tamtinh',
    password: 'tamtinh',
    displayName: 'Tâm Tình',
  },
]

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase()
}

function readCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>
    if (
      typeof parsed.username === 'string' &&
      parsed.username.trim() &&
      typeof parsed.displayName === 'string' &&
      parsed.displayName.trim()
    ) {
      return {
        username: parsed.username.trim(),
        displayName: parsed.displayName.trim(),
      }
    }
  } catch {
    // Ignore invalid legacy/corrupted localStorage format.
  }

  return null
}

export function loginWithLocalAccount(username: string, password: string): boolean {
  const normalizedUsername = normalizeUsername(username)
  const matchedAccount = LOCAL_ACCOUNTS.find(
    (account) =>
      normalizeUsername(account.username) === normalizedUsername && account.password === password,
  )

  if (!matchedAccount) {
    return false
  }

  const currentUser: AuthUser = {
    username: matchedAccount.username,
    displayName: matchedAccount.displayName,
  }
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(currentUser))
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY)
  return true
}

export function isLoggedIn(): boolean {
  if (readCurrentUser()) {
    return true
  }
  return localStorage.getItem(LEGACY_AUTH_STORAGE_KEY) === 'true'
}

export function getCurrentUser(): AuthUser | null {
  const currentUser = readCurrentUser()
  if (currentUser) {
    return currentUser
  }

  if (localStorage.getItem(LEGACY_AUTH_STORAGE_KEY) === 'true') {
    return {
      username: 'legacy-user',
      displayName: 'Thành viên',
    }
  }

  return null
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY)
}

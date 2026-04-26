import { readJson, writeJson, generateId } from './jsonStore'

export interface UserRecord {
  id: string
  username: string
  email: string
  full_name: string
  password: string
  role: 'user' | 'admin' | 'trainer'
  avatar: string
  friends?: string[]
  created_at?: string
}

const FILE = 'users.json'

export function getAll(): UserRecord[] {
  return readJson<UserRecord>(FILE)
}

export function getById(id: string): UserRecord | undefined {
  return getAll().find(u => u.id === id)
}

export function getByUsername(username: string): UserRecord | undefined {
  return getAll().find(u => u.username === username)
}

export function getByEmail(email: string): UserRecord | undefined {
  return getAll().find(u => u.email === email)
}

export function create(data: Omit<UserRecord, 'id' | 'created_at'>): UserRecord {
  const users = getAll()
  const user: UserRecord = { ...data, id: generateId(), created_at: new Date().toISOString() }
  users.push(user)
  writeJson(FILE, users)
  return user
}

export function update(id: string, data: Partial<UserRecord>): UserRecord | undefined {
  const users = getAll()
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return undefined
  users[index] = { ...users[index], ...data }
  writeJson(FILE, users)
  return users[index]
}

export function remove(id: string): boolean {
  const users = getAll()
  const filtered = users.filter(u => u.id !== id)
  if (filtered.length === users.length) return false
  writeJson(FILE, filtered)
  return true
}

export function enrichUser(user: UserRecord) {
  const friends = (user.friends || []).map(friendId => {
    const f = getById(friendId)
    if (f) {
      const { password, ...safeF } = f
      return safeF
    }
    return null
  }).filter(Boolean)
  
  const { password, ...safeUser } = user
  return { ...safeUser, friends }
}

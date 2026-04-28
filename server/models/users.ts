import { supabase, toCamelCase, toSnakeCase } from './supabase'

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

export async function getAll(): Promise<UserRecord[]> {
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data.map(toCamelCase) as UserRecord[]
}

export async function getById(id: string): Promise<UserRecord | undefined> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? toCamelCase(data) as UserRecord : undefined
}

export async function getByUsername(username: string): Promise<UserRecord | undefined> {
  const { data, error } = await supabase.from('users').select('*').eq('username', username).single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? toCamelCase(data) as UserRecord : undefined
}

export async function getByEmail(email: string): Promise<UserRecord | undefined> {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
  if (error && error.code !== 'PGRST116') throw error
  return data ? toCamelCase(data) as UserRecord : undefined
}

export async function create(data: Omit<UserRecord, 'id' | 'created_at'>): Promise<UserRecord> {
  const snakeCaseData = toSnakeCase(data)
  const { data: insertedData, error } = await supabase
    .from('users')
    .insert([snakeCaseData])
    .select()
    .single()
  if (error) throw error
  return toCamelCase(insertedData) as UserRecord
}

export async function update(id: string, data: Partial<UserRecord>): Promise<UserRecord | undefined> {
  const snakeCaseData = toSnakeCase(data)
  const { data: updatedData, error } = await supabase
    .from('users')
    .update(snakeCaseData)
    .eq('id', id)
    .select()
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return updatedData ? toCamelCase(updatedData) as UserRecord : undefined
}

export async function remove(id: string): Promise<boolean> {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function enrichUser(user: UserRecord) {
  const friends = await Promise.all((user.friends || []).map(async (friendId: string) => {
    const f = await getById(friendId)
    if (f) {
      const { password, ...safeF } = f
      return safeF
    }
    return null
  }))
  
  const { password, ...safeUser } = user
  return { ...safeUser, friends: friends.filter(Boolean) }
}

export async function seed() {
  const bcrypt = await import('bcryptjs')
  
  const seedUsers = [
    {
      username: 'menna',
      email: 'menna@example.com',
      full_name: 'Menna',
      password: 'password',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Menna&background=random'
    },
    {
      username: 'sara',
      email: 'sara@example.com',
      full_name: 'Sara',
      password: 'password',
      role: 'trainer',
      avatar: 'https://ui-avatars.com/api/?name=Sara&background=random'
    },
    {
      username: 'jessy',
      email: 'jessy@example.com',
      full_name: 'Jessy',
      password: 'password',
      role: 'user',
      avatar: 'https://ui-avatars.com/api/?name=Jessy&background=random'
    }
  ];

  for (const user of seedUsers) {
    const existing = await getByUsername(user.username)
    if (!existing) {
      const hashedPassword = await bcrypt.default.hash(user.password, 10)
      await create({ ...user, password: hashedPassword } as any)
      console.log(`Created user: ${user.username}`)
    } else {
      console.log(`User ${user.username} already exists, skipping...`)
    }
  }
}

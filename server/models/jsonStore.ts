import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function readJson<T>(filename: string): T[] {
  const filePath = path.join(__dirname, '../data', filename)
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T[]
}

export function writeJson<T>(filename: string, data: T[]): void {
  const filePath = path.join(__dirname, '../data', filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function generateId(): string {
  return crypto.randomUUID()
}

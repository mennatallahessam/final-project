import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

console.log('Testing connection to:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    if (error) {
      console.error('❌ Supabase error:', error)
    } else {
      console.log('✅ Success! Data count:', data)
    }
  } catch (err) {
    console.error('💥 Catch error:', err)
  }
}

test()

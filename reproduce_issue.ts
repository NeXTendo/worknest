
import { createClient } from '@supabase/supabase-js'
import { Database } from './lib/database.types'

const supabase = createClient<Database>('', '')

async function test() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (data) {
    console.log(data.company_id)
  }
}

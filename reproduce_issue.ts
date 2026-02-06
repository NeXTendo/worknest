
import { createClient } from '@supabase/supabase-js'
import { Database } from './lib/database.types'
import { fetchRecords } from './lib/supabase/rpc-helpers'

const supabase = createClient<Database>('', '')

async function test() {
  const { data: records } = await fetchRecords(
    supabase,
    'profiles',
    { limit: 1 }
  )
  const data = records?.[0]

  if (data) {
    console.log(data.company_id)
  }
}

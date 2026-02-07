import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { fn, params } = await request.json()
  
  console.log('\n\x1b[35m[DEBUG RPC CALL]\x1b[0m ------------------')
  console.log(`\x1b[36mFunction:\x1b[0m ${fn}`)
  console.log(`\x1b[36mTable:\x1b[0m    ${params.p_table_name}`)
  if (params.p_record_id || params.p_id) {
    console.log(`\x1b[36mID:\x1b[0m       ${params.p_record_id || params.p_id}`)
  }
  console.log(`\x1b[36mPayload:\x1b[0m`)
  console.dir(params.p_data || params.p_updates || params, { depth: null })
  console.log('\x1b[35m----------------------------------------\x1b[0m\n')

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.rpc(fn, params)

    if (error) {
      console.error('\x1b[31m[DATABASE ERROR]\x1b[0m', error.message)
      console.error('\x1b[31mDetails:\x1b[0m', error.details)
      console.error('\x1b[31mHint:\x1b[0m', error.hint)
      return NextResponse.json({ error }, { status: 400 })
    }

    console.log('\x1b[32m[SUCCESS]\x1b[0m Data returned:', data)
    return NextResponse.json({ data })
  } catch (err: any) {
    console.error('\x1b[31m[PROXY EXCEPTION]\x1b[0m', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

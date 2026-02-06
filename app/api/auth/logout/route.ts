// logout/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Sign out the user on the server (clears Supabase cookies)
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('[Logout] Supabase signOut error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Optional: reset browser client for good measure (client should also call resetBrowserClient)
 import('@/lib/supabase/client').then(mod => mod.resetBrowserClient())

    // Return success
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Logout] Exception:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

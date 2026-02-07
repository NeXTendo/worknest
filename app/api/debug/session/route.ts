import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Call the JWT helpers via RPC
    const { data: role, error: roleError } = await supabase.rpc('jwt_role')
    const { data: companyId, error: companyError } = await supabase.rpc('jwt_company_id')
    const { data: userId, error: userError } = await supabase.rpc('jwt_user_id')

    // Also check the profile directly
    let profile = null
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = data
    }

    return NextResponse.json({
      auth_user: user ? {
        id: user.id,
        email: user.email,
        aud: user.aud,
        role: user.role,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata
      } : null,
      rpc: {
        jwt_role: role,
        jwt_company_id: companyId,
        jwt_user_id: userId,
        errors: {
          role: roleError,
          company: companyError,
          user: userError
        }
      },
      profile
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/lib/database.types'


export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createServerSupabaseClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`)
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.redirect(`${origin}/auth/login?error=no_user`)
      }

type ProfileRow = Database['public']['Tables']['profiles']['Row']

const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single<ProfileRow>()



      if (profileError) {
        console.error('Profile fetch error:', profileError)
        return NextResponse.redirect(`${origin}/auth/login?error=profile_error`)
      }

      if (!profile || !profile.is_active) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/auth/login?error=account_inactive`)
      }

      if (profile.must_change_password) {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }

      return NextResponse.redirect(`${origin}/dashboard/dashboard`)
    } catch (error: any) {
      console.error('Callback processing error:', error)
      return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
}
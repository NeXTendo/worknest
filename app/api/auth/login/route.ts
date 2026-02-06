import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types' // <- import your DB types

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Identifier and password are required' }, { status: 400 })
    }

    const supabase = createClient()

    // Step 1: Map username / employee ID to email
    const { data: lookup, error: lookupError } = await supabase
      .from('login_identifiers')
      .select('email')
      .eq('identifier', identifier.trim())
      .single<{ email: string }>()

    if (lookupError || !lookup?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const loginEmail = lookup.email

    // Step 2: Sign in via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Login failed - no user returned' }, { status: 500 })
    }

    // Step 3: Fetch profile with correct typing
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id, role, must_change_password, is_active')
      .eq('id', authData.user.id)
      .single<Database['public']['Tables']['profiles']['Row']>() // <- explicitly type it

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Failed to load user profile' }, { status: 500 })
    }

    if (!profile.is_active) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'Account deactivated. Contact support.' }, { status: 403 })
    }

    // Step 4: Return result
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        company_id: profile.company_id,
        role: profile.role,
        must_change_password: profile.must_change_password,
      },
    })
  } catch (err: any) {
    console.error('Login route error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

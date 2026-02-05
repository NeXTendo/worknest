import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Allow public access to auth pages
  if (pathname.startsWith('/auth')) {
    if (!user) {
      return response
    }

    // User is logged in - check if they need to reset password
    const { data: profile } = await supabase
      .from('profiles')
      .select('must_change_password')
      .eq('id', user.id)
      .single()

    if (profile?.must_change_password) {
      // If they must reset password, only allow reset-password page
      if (pathname !== '/auth/reset-password') {
        return NextResponse.redirect(new URL('/auth/reset-password', request.url))
      }
      return response
    }

    // User is logged in and doesn't need password reset - redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect all other routes
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Check if user needs to reset password
  const { data: profile } = await supabase
    .from('profiles')
    .select('must_change_password')
    .eq('id', user.id)
    .single()

  if (profile?.must_change_password && pathname !== '/auth/reset-password') {
    return NextResponse.redirect(new URL('/auth/reset-password', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
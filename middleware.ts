import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log('No session detected, redirecting to /auth/signin');
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  console.log('Session detected:', session);
  return res;
}

export const config = {
  matcher: [
    "/((?!privacy|api|auth|public|_next/static|_next/image|favicon.ico).*)",
  ],
}
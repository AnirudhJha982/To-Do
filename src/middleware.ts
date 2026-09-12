import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We use client-side NextAuth session checks and server-side API validation
  // This proxy just ensures valid routing.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/quests/:path*", "/inventory/:path*", "/shop/:path*", "/profile/:path*", "/create-character"],
};

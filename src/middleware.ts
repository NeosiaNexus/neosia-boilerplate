import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import auth from './lib/auth/auth';

const unProtectedRoutes = ['/login', '/'];

const isProtectedRoute = (path: string) => {
  return !unProtectedRoutes.some(route => path.toLocaleLowerCase() === route.toLocaleLowerCase());
};

// TODO : utiliser les routes du fichier de route
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (isProtectedRoute(path) && !session) {
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${encodeURIComponent(path)}`, req.nextUrl),
    );
  }

  if (!isProtectedRoute(path) && session) {
    return NextResponse.redirect(new URL('/profile', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

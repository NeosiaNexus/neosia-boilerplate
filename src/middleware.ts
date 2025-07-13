import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import auth from './lib/auth/auth';
import { routes } from './lib/boiler-config';

const publicRoutes: string[] = [routes.auth.login, routes.home];

const uploadPaths: string[] = [];

const isAsset = /\.(jpg|jpeg|png|webp|svg|ico|woff2?|ttf|eot|css|js|map)$/i;

const safePaths: string[] = ['/images', '/_next', '/fonts', '/svg', '/image'];

const isSafePath = (path: string): boolean =>
  safePaths.some(p => path.startsWith(p)) || isAsset.test(path);

const isProtectedRoute = (path: string): boolean =>
  !publicRoutes.some(route => path.toLowerCase() === route.toLowerCase());

const redirectToLogin = (path: string, req: NextRequest): NextResponse =>
  NextResponse.redirect(
    new URL(`${routes.auth.login}?returnUrl=${encodeURIComponent(path)}`, req.nextUrl),
  );

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname.toLowerCase();

  if (isSafePath(path)) {
    return NextResponse.next();
  }

  if (
    (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') &&
    uploadPaths.some(p => path.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (path.startsWith('/admin')) {
    const userRoles = session?.user.role?.split(',') ?? [];

    if (!session) {
      return redirectToLogin(path, req);
    }

    if (!userRoles.includes('admin')) {
      return NextResponse.redirect(new URL(routes.home, req.nextUrl));
    }

    return NextResponse.next();
  }

  if (isProtectedRoute(path) && !session) {
    return redirectToLogin(path, req);
  }

  if (path === routes.auth.login.toLowerCase() && session) {
    return NextResponse.redirect(new URL(routes.home, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)'],
};

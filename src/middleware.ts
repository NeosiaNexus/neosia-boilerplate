import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import auth from './lib/auth/auth';
import { routes } from './lib/boiler-config';

const publicRoutes = [routes.auth.login, routes.home];

const isProtectedRoute = (path: string): boolean => {
  return !publicRoutes.some(route => path.toLowerCase() === route.toLowerCase());
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname.toLocaleLowerCase();

  // TODO : Enlever le commentaire si on veut vérifier les rôles avant de rediriger l'utilisateur
  // const userRoles = session?.user.role?.split(',');

  if (path.startsWith('/image') || path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (isProtectedRoute(path) && !session) {
    return NextResponse.redirect(
      new URL(`${routes.auth.login}?returnUrl=${encodeURIComponent(path)}`, req.nextUrl),
    );
  }

  if (path.toLowerCase() === routes.auth.login && session) {
    return NextResponse.redirect(new URL(routes.home, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

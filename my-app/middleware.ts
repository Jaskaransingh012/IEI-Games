import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
  '/games/quiz(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Parse admin IDs from environment variable
  const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(',') || [];

  // Protect routes that need authentication
  if (!userId && (isProtectedRoute(req) || isAdminRoute(req))) {
    return redirectToSignIn();
  }

  // Admin route protection
  if (isAdminRoute(req)) {
    const isAdmin = adminIds.includes(userId ?? '');

    if (!isAdmin) {
      console.log(`Unauthorized access attempt by user: ${userId}`);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

// Middleware config
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

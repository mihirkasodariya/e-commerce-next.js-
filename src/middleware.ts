import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import SendResponse from '@/lib/sendResponse';
import { decodeToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  console.log('Middleware executed', request);
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/register';

  const token = request.cookies.get('token')?.value || request.headers.get('authorization') || '';
  console.log('token : ', token)
  if (!token) {
    return SendResponse.error('No token provided!', 401, {});
  }
  const decodedToken = await decodeToken(token);
  console.log('Decoded Token - User ID : ', decodedToken?.userId);
  if (!decodedToken) {
    return SendResponse.error('Invalid or Expired Token!', 401, {});
  };
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  };
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  };

  const response = NextResponse.next();
  response.headers.set('userid', decodedToken?.userId as string);

  return response;
}

export const config = {
  matcher: ['/api/profile', '/api/cart', '/api/createOrder', '/api/orderHistory']
};
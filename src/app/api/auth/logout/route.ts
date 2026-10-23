import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'abs_admin_session';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0
  });

  return response;
}


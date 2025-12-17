import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ auth0: string | string[] }> }
) {
  const { auth0 } = await params;
  const pathArray = Array.isArray(auth0) ? auth0 : [auth0];
  const pathname = pathArray?.join('/') || 'login';
  const authDomain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';

  if (!authDomain || !clientId) {
    return new Response('Auth0 configuration missing', { status: 500 });
  }

  if (pathname === 'login') {
    const redirectUri = `${baseUrl}/api/auth/callback`;
    const searchParams = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      scope: 'openid profile email',
      redirect_uri: redirectUri,
      prompt: 'login', // Force Auth0 to show login form, don't auto-authenticate
    });
    redirect(`${authDomain}/authorize?${searchParams.toString()}`);
  }

  return new Response('Not found', { status: 404 });
}



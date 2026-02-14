import { redirect } from 'next/navigation';

export async function GET() {
  const authDomain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  
  // First logout from Auth0, then redirect to home
  const returnTo = `${baseUrl}/`;
  const auth0LogoutUrl = `${authDomain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;
  
  // Create response that redirects to Auth0 logout AND clears local cookies
  const response = new Response(null, {
    status: 302,
    headers: {
      'Location': auth0LogoutUrl,
      'Set-Cookie': [
        'auth_token=; Path=/; HttpOnly; Max-Age=0',
        'user_info=; Path=/; Max-Age=0',
      ].join(', '),
    },
  });
  
  return response;
}

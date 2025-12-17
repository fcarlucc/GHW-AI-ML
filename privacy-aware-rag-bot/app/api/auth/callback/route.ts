export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  console.log('Callback received with code:', code?.substring(0, 10), '...');
  console.log('AUTH0_ISSUER_BASE_URL:', process.env.AUTH0_ISSUER_BASE_URL);
  console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID?.substring(0, 5), '...');
  console.log('AUTH0_BASE_URL:', process.env.AUTH0_BASE_URL);

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  try {
    const tokenEndpoint = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`;
    console.log('Token endpoint:', tokenEndpoint);
    
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AUTH0_CLIENT_ID || '',
        client_secret: process.env.AUTH0_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
      }).toString(),
    });

    console.log('Token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      return new Response(`Failed to exchange code for token: ${errorText}`, { status: 500 });
    }

    const tokens = await tokenResponse.json();
    console.log('Tokens received, fetching user info...');
    
    // Get user info from /userinfo endpoint
    const userInfoResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` },
    });
    
    const userInfo = await userInfoResponse.json();
    console.log('User info:', userInfo);
    
    // Encode user info in a cookie
    const userCookie = Buffer.from(JSON.stringify(userInfo)).toString('base64');
    
    console.log('Redirecting to / with user cookie');
    
    const response = new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': [
          `auth_token=${tokens.access_token}; Path=/; HttpOnly; Max-Age=86400`,
          `user_info=${userCookie}; Path=/; Max-Age=86400`,
        ].join(', '),
      },
    });

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return new Response(`Authentication failed: ${error}`, { status: 500 });
  }
}

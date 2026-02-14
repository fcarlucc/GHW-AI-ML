import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { cookies } from 'next/headers';
import { retrieveAuthorizedDocuments, formatContextForLLM } from '@/lib/rag';
import { generateResponse } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    let session = await auth0.getSession();
    
    // Fallback: check for manual cookie if session not found
    if (!session) {
      const cookieStore = await cookies();
      const userInfoCookie = cookieStore.get('user_info')?.value;
      if (userInfoCookie) {
        try {
          const userInfo = JSON.parse(Buffer.from(userInfoCookie, 'base64').toString());
          session = {
            user: {
              sub: userInfo.sub,
              email: userInfo.email,
              name: userInfo.name || userInfo.nickname,
              picture: userInfo.picture,
            }
          };
        } catch (e) {
          console.error('Failed to parse user info:', e);
        }
      }
    }
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const userId = session.user.email || session.user.sub;
    console.log(`[API] Chat request from user: ${userId}`);

    // Step 2: Parse request
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log(`[API] Query: "${query}"`);

    // Step 3: Retrieve authorized documents (RAG with FGA filtering)
    const ragContext = await retrieveAuthorizedDocuments(query, userId);
    console.log(`[API] Retrieved ${ragContext.documents.length} authorized documents`);

    // Step 4: Format context for LLM
    const formattedContext = formatContextForLLM(ragContext);

    // Step 5: Generate response using Groq
    const response = await generateResponse(query, formattedContext);

    // Step 6: Return response with metadata
    return NextResponse.json({
      answer: response,
      metadata: {
        documentsUsed: ragContext.documents.map((doc: { id: string; title: string }) => ({
          id: doc.id,
          title: doc.title,
        })),
        documentsBlocked: ragContext.accessDeniedCount,
        totalDocuments: ragContext.totalDocumentsSearched,
      },
    });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

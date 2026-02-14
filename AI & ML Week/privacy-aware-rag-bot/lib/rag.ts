import { filterAccessibleDocuments } from './fga';
import { getAllDocumentIds, searchDocuments, getDocumentsByIds } from './documents';

/**
 * RAG (Retrieval-Augmented Generation) system with privacy controls
 * This ensures users can only retrieve documents they have permission to access
 */

export interface RAGContext {
  documents: Array<{
    id: string;
    title: string;
    content: string;
    excerpt: string;
  }>;
  accessDeniedCount: number;
  totalDocumentsSearched: number;
}

/**
 * Retrieve relevant documents for a query with FGA authorization checks
 * This is the critical privacy layer - filters out unauthorized documents BEFORE LLM sees them
 */
export async function retrieveAuthorizedDocuments(
  query: string,
  userId: string,
  maxDocuments: number = 3
): Promise<RAGContext> {
  console.log(`[RAG] Query: "${query}" for user: ${userId}`);

  // Step 1: Get all document IDs
  const allDocumentIds = getAllDocumentIds();
  console.log(`[RAG] Total documents in database: ${allDocumentIds.length}`);

  // Step 2: CRITICAL - Filter by FGA permissions BEFORE retrieval
  const accessibleDocumentIds = await filterAccessibleDocuments(userId, allDocumentIds);
  console.log(`[RAG] User ${userId} has access to ${accessibleDocumentIds.length} documents`);

  const accessDeniedCount = allDocumentIds.length - accessibleDocumentIds.length;
  if (accessDeniedCount > 0) {
    console.log(`[RAG] ⚠️  ${accessDeniedCount} documents blocked by FGA authorization`);
  }

  // Step 3: Search only within authorized documents
  const relevantDocuments = searchDocuments(query, accessibleDocumentIds);
  console.log(`[RAG] Found ${relevantDocuments.length} relevant documents after search`);

  // Step 4: Limit to top N most relevant
  const topDocuments = relevantDocuments.slice(0, maxDocuments);

  // Step 5: Prepare context for LLM
  const ragContext: RAGContext = {
    documents: topDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      excerpt: doc.content.substring(0, 200) + '...',
    })),
    accessDeniedCount,
    totalDocumentsSearched: allDocumentIds.length,
  };

  console.log(`[RAG] Returning ${ragContext.documents.length} documents to LLM`);
  return ragContext;
}

/**
 * Format RAG context for LLM prompt
 */
export function formatContextForLLM(ragContext: RAGContext): string {
  if (ragContext.documents.length === 0) {
    return 'No relevant documents found that you have permission to access.';
  }

  const contextParts = ragContext.documents.map((doc, index) => {
    return `
Document ${index + 1}: ${doc.title}
---
${doc.content}
---
`;
  });

  return `You have access to the following documents to answer the question:

${contextParts.join('\n')}

${ragContext.accessDeniedCount > 0 
  ? `\nNote: ${ragContext.accessDeniedCount} documents were excluded due to access restrictions.` 
  : ''}
`;
}

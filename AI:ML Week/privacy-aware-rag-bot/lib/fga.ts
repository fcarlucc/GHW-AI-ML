import { OpenFgaClient } from '@openfga/sdk';

// Types for better type safety
export type UserRole = 'manager' | 'employee';

// Initialize OpenFGA client
export function createFgaClient() {
  if (!process.env.FGA_API_URL || !process.env.FGA_STORE_ID) {
    console.warn('FGA not configured, using mock permissions');
    return null;
  }

  return new OpenFgaClient({
    apiUrl: process.env.FGA_API_URL,
    storeId: process.env.FGA_STORE_ID,
    authorizationModelId: process.env.FGA_MODEL_ID,
  });
}

/**
 * Check if user has permission to view a document
 * This is the core authorization check that gates document access
 */
export async function checkDocumentAccess(
  userId: string,
  documentId: string
): Promise<boolean> {
  const fgaClient = createFgaClient();

  // If FGA is not configured, use mock data based on user email
  if (!fgaClient) {
    return mockCheckDocumentAccess(userId, documentId);
  }

  try {
    const { allowed } = await fgaClient.check({
      user: `user:${userId}`,
      relation: 'viewer',
      object: `document:${documentId}`,
    });

    console.log(`[FGA] User ${userId} access to document ${documentId}: ${allowed}`);
    return allowed || false;
  } catch (error) {
    console.error('[FGA] Check error:', error);
    return false;
  }
}

/**
 * Get all documents a user can access from a list of document IDs
 */
export async function filterAccessibleDocuments(
  userId: string,
  documentIds: string[]
): Promise<string[]> {
  const accessibleDocs: string[] = [];

  for (const docId of documentIds) {
    const hasAccess = await checkDocumentAccess(userId, docId);
    if (hasAccess) {
      accessibleDocs.push(docId);
    }
  }

  console.log(`[FGA] User ${userId} can access ${accessibleDocs.length}/${documentIds.length} documents`);
  return accessibleDocs;
}

/**
 * Mock implementation when FGA is not configured
 * Managers can access all documents, employees only non-sensitive ones
 */
function mockCheckDocumentAccess(userId: string, documentId: string): boolean {
  // Determine role from email (simple demo logic)
  const isManager = userId.toLowerCase().includes('manager') || userId.toLowerCase().includes('admin');
  
  // Sensitive documents require manager role
  const sensitiveDocuments = ['salary_2024', 'compensation_policy', 'budget_q4_2024'];
  const isSensitive = sensitiveDocuments.includes(documentId);

  if (isSensitive && !isManager) {
    console.log(`[MOCK FGA] ❌ User ${userId} (employee) DENIED access to sensitive document ${documentId}`);
    return false;
  }

  console.log(`[MOCK FGA] ✅ User ${userId} (${isManager ? 'manager' : 'employee'}) GRANTED access to document ${documentId}`);
  return true;
}

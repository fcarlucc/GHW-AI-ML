// Document database with metadata and content
export interface Document {
  id: string;
  title: string;
  content: string;
  category: 'hr' | 'finance' | 'general';
  sensitive: boolean;
  tags: string[];
}

/**
 * Sample document database
 * In a real application, this would be stored in a database
 */
export const documents: Document[] = [
  // Public documents - accessible to all employees
  {
    id: 'company_handbook',
    title: 'Company Handbook 2024',
    content: `Our company handbook outlines the core values and policies that guide our workplace. 
    We believe in transparency, collaboration, and continuous improvement. 
    All employees are expected to adhere to our code of conduct and respect workplace diversity.
    Working hours are flexible from 9 AM to 6 PM with remote work options available.
    We offer comprehensive health insurance, dental coverage, and wellness programs.`,
    category: 'general',
    sensitive: false,
    tags: ['policies', 'general', 'onboarding'],
  },
  {
    id: 'benefits_overview',
    title: 'Employee Benefits Overview',
    content: `Our benefits package includes health insurance, dental and vision coverage, 401(k) matching up to 5%, 
    paid time off (20 days annually), parental leave (12 weeks), professional development budget ($2000/year),
    gym membership reimbursement, and flexible spending accounts. 
    We also provide mental health support through our EAP program and offer quarterly team building events.`,
    category: 'hr',
    sensitive: false,
    tags: ['benefits', 'hr', 'compensation'],
  },
  {
    id: 'vacation_policy',
    title: 'Vacation and Time Off Policy',
    content: `All full-time employees receive 20 days of paid vacation per year, plus 10 public holidays.
    Vacation days accrue monthly and can be carried over up to 5 days to the following year.
    Employees must request time off at least 2 weeks in advance for periods longer than 3 days.
    We also offer unlimited sick days and encourage employees to take time when needed for health.
    Parental leave is available for 12 weeks at full pay for primary caregivers.`,
    category: 'hr',
    sensitive: false,
    tags: ['time-off', 'vacation', 'hr'],
  },

  // Sensitive documents - only accessible to managers
  {
    id: 'salary_2024',
    title: 'Salary Bands and Compensation Structure 2024',
    content: `CONFIDENTIAL - Manager Access Only
    
    Software Engineer Levels:
    - Junior (L1): $70,000 - $90,000
    - Mid-Level (L2): $90,000 - $120,000
    - Senior (L3): $120,000 - $160,000
    - Staff (L4): $160,000 - $200,000
    - Principal (L5): $200,000 - $250,000
    
    Performance bonuses range from 5% to 20% based on individual and company performance.
    Equity grants are provided at hire and during annual reviews.
    Cost of living adjustments are reviewed quarterly.`,
    category: 'finance',
    sensitive: true,
    tags: ['salary', 'compensation', 'confidential'],
  },
  {
    id: 'compensation_policy',
    title: 'Compensation Philosophy and Pay Equity',
    content: `CONFIDENTIAL - Manager Access Only
    
    Our compensation philosophy is based on fair market value, internal equity, and performance.
    We conduct annual salary reviews in January and mid-year adjustments in July.
    Pay equity audits are performed quarterly to ensure no gender or racial pay gaps.
    
    Promotion criteria:
    - Consistent high performance over 12+ months
    - Demonstrated leadership and impact
    - Skill development aligned with next level
    
    Managers have discretion for spot bonuses up to $5,000 for exceptional contributions.
    Stock option refresh grants are evaluated during annual review cycles.`,
    category: 'finance',
    sensitive: true,
    tags: ['compensation', 'equity', 'confidential'],
  },
  {
    id: 'budget_q4_2024',
    title: 'Q4 2024 Budget and Financial Planning',
    content: `CONFIDENTIAL - Manager Access Only
    
    Q4 2024 Budget Allocation:
    - Engineering: $2.5M (salary, equipment, software licenses)
    - Sales & Marketing: $1.8M (headcount expansion, campaigns)
    - Operations: $800K (office space, IT infrastructure)
    - R&D: $1.2M (new product development)
    
    Expected Revenue: $12M
    Target Profit Margin: 25%
    
    Hiring plan: 15 new positions across all departments
    Capital expenditure: $500K for new office buildout
    Key risks: Market volatility, competitive pressure, talent retention`,
    category: 'finance',
    sensitive: true,
    tags: ['budget', 'finance', 'confidential', 'planning'],
  },
];

/**
 * Get all document IDs
 */
export function getAllDocumentIds(): string[] {
  return documents.map(doc => doc.id);
}

/**
 * Get document by ID
 */
export function getDocumentById(id: string): Document | undefined {
  return documents.find(doc => doc.id === id);
}

/**
 * Get multiple documents by IDs
 */
export function getDocumentsByIds(ids: string[]): Document[] {
  return documents.filter(doc => ids.includes(doc.id));
}

/**
 * Simple text similarity search (cosine similarity would be better in production)
 */
export function searchDocuments(query: string, documentIds: string[]): Document[] {
  const queryLower = query.toLowerCase();
  const searchableDocuments = getDocumentsByIds(documentIds);
  
  // Extract keywords from query (remove emoji, split by spaces)
  const keywords = queryLower
    .replace(/[^\w\s]/g, '') // Remove emoji and special chars
    .split(/\s+/)
    .filter(word => word.length > 2); // Only words longer than 2 chars
  
  return searchableDocuments
    .map(doc => {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();
      
      // Score based on individual keyword matches
      for (const keyword of keywords) {
        // Title matches (higher weight)
        if (titleLower.includes(keyword)) {
          score += 10;
        }
        
        // Content matches (lower weight per occurrence)
        const contentMatches = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
        score += contentMatches;
        
        // Tag matches (medium weight)
        if (doc.tags.some(tag => tag.toLowerCase().includes(keyword))) {
          score += 5;
        }
      }
      
      return {
        document: doc,
        score,
      };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.document);
}

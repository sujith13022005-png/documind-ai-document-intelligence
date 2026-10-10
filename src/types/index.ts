export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
}

export interface ExtractedEntity {
  name: string;
  type: string;
  value: string;
  page?: number;
  clause?: string;
  confidence?: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber?: string;
  vendorName?: string;
  customerName?: string;
  invoiceDate?: string;
  dueDate?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  currency?: string;
  paymentTerms?: string;
  verificationStatus?: 'verified' | 'needs_verification';
  notes?: string;
}

export interface CertificateData {
  recipientName?: string;
  institution?: string;
  courseTitle?: string;
  issueDate?: string;
  certificateId?: string;
  duration?: string;
  status?: 'Information Found' | 'Needs Review' | 'Potentially Suspicious';
  notes?: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeBytesText: string;
  storageUrl?: string;
  fileData?: string;
  mimeType: string;
  category: 'Finance' | 'Academic' | 'Certificates' | 'Bills' | 'Reports' | 'Personal' | 'Other';
  status: 'UPLOADING' | 'PROCESSING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  pageCount?: number;
  processingTimeMs?: number;
  confidenceScore?: number;
  summary?: string;
  executiveSummary?: string[];
  criticalInsight?: string;
  keywords?: string[];
  entities?: ExtractedEntity[];
  extractedData?: {
    invoice?: InvoiceData;
    certificate?: CertificateData;
    contractParties?: { name: string; role: string; details?: string }[];
    timeline?: { event: string; date: string; type?: string }[];
    governingLaw?: string;
    rawTextPreview?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatCitation {
  label: string;
  page?: number;
  clause?: string;
  excerpt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: ChatCitation[];
  suggestedFollowUps?: string[];
  extractedEntities?: { name: string; role: string; type: string }[];
}

export interface DocumentChat {
  id: string;
  userId: string;
  documentId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  totalDocuments: number;
  analyzedDocuments: number;
  totalQueriesRun: number;
  storageUsedBytes: number;
  storageMaxBytes: number;
  categories: Record<string, number>;
  recentActivity: {
    id: string;
    fileName: string;
    category: string;
    date: string;
    status: string;
  }[];
}

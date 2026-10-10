import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractedEntity {
  name: string;
  type: string; // 'PARTY' | 'DATE' | 'AMOUNT' | 'LOCATION' | 'ORGANIZATION' | 'CLAUSE' | 'OTHER'
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
  fileType: string; // 'PDF' | 'DOCX' | 'JPG' | 'PNG' | 'XLSX' | 'TXT'
  fileSize: number; // in bytes
  fileSizeBytesText: string;
  storageUrl?: string;
  fileData?: string; // base64 string
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: { label: string; page?: number; clause?: string; excerpt?: string }[];
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

export interface SharedDocument {
  token: string;
  documentId: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  allowDownload: boolean;
  viewCount: number;
}

interface DatabaseSchema {
  users: User[];
  documents: DocumentItem[];
  chats: DocumentChat[];
  shares: SharedDocument[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'documind_db.json');

// Initial seed documents to give the user immediate visual fidelity matching the Stitch designs if desired
const SEED_USER: User = {
  id: 'user_alex_chen',
  name: 'Alex Chen',
  email: 'alex.chen@documind.ai',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const SEED_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_msa_2024',
    userId: 'user_alex_chen',
    fileName: 'AcmeCorp_Master_Services_Agreement_2024.pdf',
    fileType: 'PDF',
    fileSize: 2400000,
    fileSizeBytesText: '2.4 MB',
    mimeType: 'application/pdf',
    category: 'Finance',
    status: 'COMPLETED',
    pageCount: 12,
    processingTimeMs: 1400,
    confidenceScore: 99.8,
    summary: 'Binding Master Services Agreement between Acme Corp and DocuMind Technologies establishing multi-tenant enterprise software provisioning terms, SLA guarantees, and annual licensing consideration.',
    executiveSummary: [
      'Binding SLA: Establishes multi-tenant cloud provision terms with 99.95% guaranteed uptime & quarterly compliance attestations.',
      'Jurisdiction: Controlled under Delaware State corporate code, requiring pre-litigation arbitration in Wilmington.',
      'Renewal Cycle: Multi-year operational term expiring Oct 15, 2025, automatically rolling for 12-month increments without explicit opt-out.'
    ],
    criticalInsight: 'Automatic renewal requires a 60-day written notice prior to Oct 15, 2025 (cutoff date: Aug 16, 2025).',
    keywords: ['#SaaS', '#Indemnity', '#Confidentiality', '#PaymentTerms', '#MutualNDA'],
    entities: [
      { name: 'Jan 1, 2024', type: 'DATE', value: 'Effective Date', page: 1, confidence: 99 },
      { name: 'Acme Corp', type: 'PARTY', value: 'Client (Delaware #74129)', page: 1, confidence: 100 },
      { name: 'DocuMind Technologies Inc.', type: 'PARTY', value: 'Vendor (California #99211)', page: 1, confidence: 100 },
      { name: '$184,500.00 / year', type: 'AMOUNT', value: 'Annual Subscription Fee', page: 1, clause: 'Clause 5.1', confidence: 99 },
      { name: 'Oct 15, 2025', type: 'DATE', value: 'Expiration Date', page: 1, confidence: 98 },
      { name: 'State of Delaware, US', type: 'LOCATION', value: 'Governing Law', page: 1, confidence: 99 }
    ],
    extractedData: {
      contractParties: [
        { name: 'Acme Corp', role: 'Buyer', details: 'Client • Delaware #74129' },
        { name: 'DocuMind Technologies Inc.', role: 'Provider', details: 'Vendor • California #99211' }
      ],
      timeline: [
        { event: 'Effective Date', date: 'Jan 1, 2024', type: 'Effective' },
        { event: 'Renewal Notice Deadline', date: 'Aug 16, 2025', type: 'Notice Deadline' },
        { event: 'Agreement Expiry', date: 'Oct 15, 2025', type: 'Expiry' }
      ],
      governingLaw: 'Delaware, United States (Arbitration Req.)',
      rawTextPreview: `MASTER SERVICES AGREEMENT\nThis Master Services Agreement ("Agreement") is executed and entered into effective as of Jan 1, 2024, by and between Acme Corp ("Client"), and DocuMind Technologies Inc. ("Vendor").\n\nSection 4.1 — Consideration & Compensation\nClient shall remit to Vendor a cumulative annual subscription fee totaling $184,500.00 / year payable net-30 days upon invoicing.\n\nSection 8.2 — Term & Termination\nThis agreement remains valid until Oct 15, 2025, subject to governing jurisdiction of State of Delaware, US. Automatic renewal occurs unless notice is submitted 60 days in advance.`
    },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'doc_stanford_cert',
    userId: 'user_alex_chen',
    fileName: 'Stanford_ML_Certificate_2024.pdf',
    fileType: 'PDF',
    fileSize: 1100000,
    fileSizeBytesText: '1.1 MB',
    mimeType: 'application/pdf',
    category: 'Certificates',
    status: 'COMPLETED',
    pageCount: 1,
    processingTimeMs: 980,
    confidenceScore: 99.4,
    summary: 'Executive Certificate of Achievement in Advanced Machine Learning and Neural Networks issued by Stanford Center for Professional Development.',
    executiveSummary: [
      'Recipient: Alex Chen successfully fulfilled curriculum requirements for Deep Generative Architectures.',
      'Institution: Stanford Center for Professional Development, School of Engineering.',
      'Verification: Digital cryptographic hash verified against university ledger.'
    ],
    criticalInsight: 'Certificate valid indefinitely; continuing education units (CEUs): 4.5 units recorded.',
    keywords: ['#MachineLearning', '#Stanford', '#DeepLearning', '#NeuralNetworks'],
    entities: [
      { name: 'Alex Chen', type: 'PARTY', value: 'Student / Recipient', page: 1 },
      { name: 'Stanford Center for Professional Development', type: 'ORGANIZATION', value: 'Issuing Institution', page: 1 },
      { name: 'Oct 18, 2024', type: 'DATE', value: 'Date of Completion', page: 1 },
      { name: 'STAN-ML-892401', type: 'OTHER', value: 'Credential ID', page: 1 }
    ],
    extractedData: {
      certificate: {
        recipientName: 'Alex Chen',
        institution: 'Stanford University (CPD)',
        courseTitle: 'Advanced Machine Learning & Neural Networks',
        issueDate: 'October 18, 2024',
        certificateId: 'STAN-ML-892401',
        duration: '12 Weeks (120 Hours)',
        status: 'Information Found',
        notes: 'Official academic signature and tamper-resistant checksum present.'
      }
    },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'doc_stripe_inv',
    userId: 'user_alex_chen',
    fileName: 'Stripe_Invoice_INV-8821.pdf',
    fileType: 'PDF',
    fileSize: 450000,
    fileSizeBytesText: '450 KB',
    mimeType: 'application/pdf',
    category: 'Finance',
    status: 'COMPLETED',
    pageCount: 2,
    processingTimeMs: 420,
    confidenceScore: 99.6,
    summary: 'Monthly cloud infrastructure and payment gateway processing invoice for corporate platform accounts.',
    executiveSummary: [
      'Total Amount: $14,850.00 with 15% VAT breakdown ($1,936.95).',
      'Vendor: Stripe Payments Technology Ltd.',
      'Settlement Status: Automatic ACH charge initiated, scheduled net-30.'
    ],
    keywords: ['#Invoice', '#Stripe', '#Gateway', '#Billing'],
    entities: [
      { name: 'Stripe Payments Ltd', type: 'ORGANIZATION', value: 'Vendor', page: 1 },
      { name: '$14,850.00', type: 'AMOUNT', value: 'Total Balance Due', page: 1 },
      { name: '$1,936.95', type: 'AMOUNT', value: 'Tax (VAT 15%)', page: 1 },
      { name: 'INV-2024-8841', type: 'OTHER', value: 'Invoice Number', page: 1 }
    ],
    extractedData: {
      invoice: {
        invoiceNumber: 'INV-2024-8841',
        vendorName: 'Apex Systems Ltd / Stripe',
        customerName: 'Globetech Enterprise Inc.',
        invoiceDate: 'Oct 24, 2024',
        dueDate: 'Nov 23, 2024',
        items: [
          { description: 'Enterprise Cloud Software Licenses (50 seats)', quantity: 50, unitPrice: 200, amount: 10000 },
          { description: 'Dedicated Neural Processing Cluster S3', quantity: 1, unitPrice: 2913.05, amount: 2913.05 }
        ],
        subtotal: 12913.05,
        tax: 1936.95,
        discount: 0,
        total: 14850.0,
        currency: 'USD',
        paymentTerms: 'Net 30 days',
        verificationStatus: 'verified'
      }
    },
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: 'doc_aws_inv',
    userId: 'user_alex_chen',
    fileName: 'AWS_Cloud_Invoice_Aug2024.pdf',
    fileType: 'PDF',
    fileSize: 1400000,
    fileSizeBytesText: '1.4 MB',
    mimeType: 'application/pdf',
    category: 'Finance',
    status: 'COMPLETED',
    pageCount: 3,
    processingTimeMs: 820,
    confidenceScore: 98.0,
    summary: 'Amazon Web Services monthly compute and storage consumption for US-East (N. Virginia) and S3 buckets.',
    executiveSummary: [
      'Total Infrastructure Spend: $3,842.50 paid on Aug 28, 2024 via Corporate Amex.',
      'Primary items: EC2 compute, ECS cluster runner, Aurora PostgreSQL replicas.'
    ],
    keywords: ['#AWS', '#Cloud', '#Hosting', '#EC2'],
    entities: [
      { name: 'Amazon Web Services Inc.', type: 'ORGANIZATION', value: 'Vendor', page: 1 },
      { name: '$3,842.50', type: 'AMOUNT', value: 'Total Expense', page: 1 },
      { name: 'Aug 28, 2024', type: 'DATE', value: 'Settlement Date', page: 1 }
    ],
    extractedData: {
      invoice: {
        invoiceNumber: 'AWS-9821-2024',
        vendorName: 'Amazon Web Services Inc.',
        customerName: 'DocuMind Lab',
        invoiceDate: 'Aug 28, 2024',
        dueDate: 'Aug 28, 2024',
        items: [
          { description: 'Amazon Elastic Compute Cloud (EC2)', quantity: 1, unitPrice: 2450.00, amount: 2450.00 },
          { description: 'Amazon Simple Storage Service (S3)', quantity: 1, unitPrice: 892.50, amount: 892.50 },
          { description: 'Data Transfer & NAT Gateway', quantity: 1, unitPrice: 500.00, amount: 500.00 }
        ],
        subtotal: 3842.50,
        tax: 0,
        total: 3842.50,
        currency: 'USD',
        paymentTerms: 'Paid by Card',
        verificationStatus: 'verified'
      }
    },
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 86400000).toISOString()
  }
];

const SEED_CHATS: DocumentChat[] = [
  {
    id: 'chat_msa_2024',
    userId: 'user_alex_chen',
    documentId: 'doc_msa_2024',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg_1',
        role: 'assistant',
        content: 'Hello Alex! I have analyzed AcmeCorp_Master_Services_Agreement_2024.pdf. All 12 pages, legal covenants, and pricing annexes are indexed. You can query contract liabilities, payment schedules, signatory verifications, or termination clauses anytime.',
        timestamp: '09:41 AM'
      },
      {
        id: 'msg_2',
        role: 'user',
        content: 'What is the total contract value and payment terms?',
        timestamp: '09:42 AM'
      },
      {
        id: 'msg_3',
        role: 'assistant',
        content: 'The total contract amount is **$184,500.00 billed annually**. Payment terms are strictly **Net 30 days** upon invoice receipt via ACH or wire.',
        timestamp: '09:42 AM',
        citations: [
          { label: 'Page 4, Clause 5.1', page: 4, clause: 'Clause 5.1', excerpt: 'Client shall remit annual subscription fees totaling US $184,500 within thirty (30) calendar days upon invoicing.' },
          { label: 'Page 8, Schedule B', page: 8, clause: 'Schedule B', excerpt: 'Schedule B lists enterprise SLA and tiered annual consideration.' }
        ],
        suggestedFollowUps: [
          'What is the penalty for late payment?',
          'When is the termination notice deadline?'
        ]
      },
      {
        id: 'msg_4',
        role: 'user',
        content: 'Find all names and parties mentioned in this agreement.',
        timestamp: '09:44 AM'
      },
      {
        id: 'msg_5',
        role: 'assistant',
        content: 'I extracted 4 key legal entities & signatories with verified signatures detected on page 12:',
        timestamp: '09:44 AM',
        extractedEntities: [
          { name: 'Eleanor Vance', role: 'SVP Global Operations • AcmeCorp LLC', type: 'Signatory' },
          { name: 'Marcus Chen, Esq.', role: 'General Counsel • Horizon Enterprises', type: 'Signatory' },
          { name: 'AcmeCorp Solutions Inc.', role: 'Primary Service Provider (Delaware Corp)', type: 'Party 1' },
          { name: 'Horizon Global Ltd.', role: 'Customer / Enterprise Licensee', type: 'Party 2' }
        ]
      }
    ]
  }
];

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing db file, initializing with seeds', err);
    }

    const initial: DatabaseSchema = {
      users: [SEED_USER],
      documents: SEED_DOCUMENTS,
      chats: SEED_CHATS,
      shares: []
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db file:', err);
    }
  }

  // User Operations
  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): User {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      createdAt: now,
      updatedAt: now
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.users[idx];
  }

  // Document Operations
  getDocuments(userId: string, category?: string, search?: string): DocumentItem[] {
    return this.data.documents.filter(doc => {
      if (doc.userId !== userId) return false;
      if (category && category !== 'All' && doc.category !== category) return false;
      if (search) {
        const query = search.toLowerCase();
        const matchesName = doc.fileName.toLowerCase().includes(query);
        const matchesSummary = doc.summary?.toLowerCase().includes(query);
        const matchesCategory = doc.category.toLowerCase().includes(query);
        const matchesKeyword = doc.keywords?.some(k => k.toLowerCase().includes(query));
        const matchesEntity = doc.entities?.some(e => e.name.toLowerCase().includes(query) || e.value.toLowerCase().includes(query));
        return matchesName || matchesSummary || matchesCategory || matchesKeyword || matchesEntity;
      }
      return true;
    });
  }

  getDocumentById(id: string, userId?: string): DocumentItem | undefined {
    return this.data.documents.find(doc => doc.id === id && (!userId || doc.userId === userId));
  }

  createDocument(doc: DocumentItem): DocumentItem {
    this.data.documents.unshift(doc);
    this.saveData(this.data);
    return doc;
  }

  updateDocument(id: string, userId: string, updates: Partial<DocumentItem>): DocumentItem | undefined {
    const idx = this.data.documents.findIndex(d => d.id === id && d.userId === userId);
    if (idx === -1) return undefined;
    this.data.documents[idx] = {
      ...this.data.documents[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.documents[idx];
  }

  deleteDocument(id: string, userId: string): boolean {
    const initialLen = this.data.documents.length;
    this.data.documents = this.data.documents.filter(d => !(d.id === id && d.userId === userId));
    // Also remove any chat for this doc
    this.data.chats = this.data.chats.filter(c => !(c.documentId === id && c.userId === userId));
    // Also remove any shares
    this.data.shares = this.data.shares.filter(s => !(s.documentId === id && s.userId === userId));

    const deleted = this.data.documents.length < initialLen;
    if (deleted) {
      this.saveData(this.data);
    }
    return deleted;
  }

  // Chat Operations
  getChat(userId: string, documentId: string): DocumentChat | undefined {
    return this.data.chats.find(c => c.userId === userId && c.documentId === documentId);
  }

  saveChatMessage(userId: string, documentId: string, message: ChatMessage): DocumentChat {
    let chat = this.getChat(userId, documentId);
    const now = new Date().toISOString();
    if (!chat) {
      chat = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        userId,
        documentId,
        messages: [message],
        createdAt: now,
        updatedAt: now
      };
      this.data.chats.push(chat);
    } else {
      chat.messages.push(message);
      chat.updatedAt = now;
    }
    this.saveData(this.data);
    return chat;
  }

  // Shares
  createShare(userId: string, documentId: string, hoursValid = 48, allowDownload = true): SharedDocument {
    const token = 'dm_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + hoursValid * 3600000).toISOString();

    const share: SharedDocument = {
      token,
      documentId,
      userId,
      createdAt: now.toISOString(),
      expiresAt,
      allowDownload,
      viewCount: 0
    };
    this.data.shares.push(share);
    this.saveData(this.data);
    return share;
  }

  getShare(token: string): SharedDocument | undefined {
    const share = this.data.shares.find(s => s.token === token);
    if (!share) return undefined;
    if (new Date() > new Date(share.expiresAt)) {
      return undefined;
    }
    share.viewCount += 1;
    this.saveData(this.data);
    return share;
  }

  revokeShare(token: string, userId: string): boolean {
    const initialLen = this.data.shares.length;
    this.data.shares = this.data.shares.filter(s => !(s.token === token && s.userId === userId));
    const revoked = this.data.shares.length < initialLen;
    if (revoked) this.saveData(this.data);
    return revoked;
  }

  // Analytics
  getAnalytics(userId: string) {
    const docs = this.data.documents.filter(d => d.userId === userId);
    const chats = this.data.chats.filter(c => c.userId === userId);

    let totalSizeBytes = 0;
    const categoryCount: Record<string, number> = {};
    let totalQueriesRun = 0;

    for (const d of docs) {
      totalSizeBytes += d.fileSize || 0;
      categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    }

    for (const c of chats) {
      totalQueriesRun += c.messages.filter(m => m.role === 'user').length;
    }

    const analyzedCount = docs.filter(d => d.status === 'COMPLETED').length;

    return {
      totalDocuments: docs.length,
      analyzedDocuments: analyzedCount,
      totalQueriesRun: totalQueriesRun + 520, // default baseline + active queries
      storageUsedBytes: totalSizeBytes + 1200000000, // baseline 1.2 GB vault
      storageMaxBytes: 5368709120, // 5 GB
      categories: categoryCount,
      recentActivity: docs.slice(0, 5).map(d => ({
        id: d.id,
        fileName: d.fileName,
        category: d.category,
        date: d.updatedAt,
        status: d.status
      }))
    };
  }
}

export const db = new DatabaseService();

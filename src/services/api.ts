import { DocumentItem, User, DocumentChat, AnalyticsData } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('documind_token') || 'user_alex_chen';
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export const api = {
  // Auth
  async signup(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to sign up');
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Invalid email or password');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      throw new Error('Not authenticated');
    }
    return res.json();
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Documents
  async getDocuments(category?: string, search?: string): Promise<{ documents: DocumentItem[] }> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/documents?${params.toString()}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async getDocumentById(id: string): Promise<{ document: DocumentItem }> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Document not found');
    return res.json();
  },

  async uploadDocument(data: {
    fileName: string;
    fileType?: string;
    fileSize?: number;
    mimeType?: string;
    fileData?: string;
    category?: string;
    rawText?: string;
  }): Promise<{ document: DocumentItem }> {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async updateDocument(id: string, updates: { fileName?: string; category?: string }): Promise<{ document: DocumentItem }> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update document');
    return res.json();
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },

  // Chat
  async getChat(documentId: string): Promise<{ chat: DocumentChat }> {
    const res = await fetch(`${API_BASE}/documents/${documentId}/chat`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch chat');
    return res.json();
  },

  async askDocument(documentId: string, question: string): Promise<{ message: any; chat: DocumentChat }> {
    const res = await fetch(`${API_BASE}/documents/${documentId}/chat`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ question }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to query document');
    }
    return res.json();
  },

  // Summarize
  async summarize(documentId: string, mode: string): Promise<{ mode: string; summary: string }> {
    const res = await fetch(`${API_BASE}/documents/${documentId}/summarize`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ mode }),
    });
    if (!res.ok) throw new Error('Failed to summarize document');
    return res.json();
  },

  // Invoice Analyzer
  async extractInvoice(data: { fileName?: string; fileData?: string; mimeType?: string; rawText?: string }) {
    const res = await fetch(`${API_BASE}/invoice/extract`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Invoice extraction failed');
    return res.json();
  },

  // Certificate Analyzer
  async analyzeCertificate(data: { fileName?: string; fileData?: string; mimeType?: string; rawText?: string }) {
    const res = await fetch(`${API_BASE}/certificate/extract`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Certificate analysis failed');
    return res.json();
  },

  // Compare
  async compareDocuments(data: { docAId?: string; docBId?: string; docAData?: any; docBData?: any }) {
    const res = await fetch(`${API_BASE}/documents/compare`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Comparison failed');
    return res.json();
  },

  // Search
  async search(query: string): Promise<{ query: string; results: DocumentItem[]; synthesis: any }> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<{ analytics: AnalyticsData }> {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  // Share
  async createShare(documentId: string, hoursValid = 48, allowDownload = true) {
    const res = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ documentId, hoursValid, allowDownload }),
    });
    if (!res.ok) throw new Error('Failed to generate share link');
    return res.json();
  },

  async getSharedDocument(token: string) {
    const res = await fetch(`${API_BASE}/share/${token}`);
    if (!res.ok) throw new Error('Shared document expired or not found');
    return res.json();
  },

  // Status
  async getSystemStatus() {
    const res = await fetch(`${API_BASE}/system/status`);
    return res.json();
  }
};

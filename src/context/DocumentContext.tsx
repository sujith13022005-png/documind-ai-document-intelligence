import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DocumentItem } from '../types';
import { api } from '../services/api';

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
  icon?: string;
}

interface DocumentContextType {
  documents: DocumentItem[];
  loading: boolean;
  activeDoc: DocumentItem | null;
  setActiveDoc: (doc: DocumentItem | null) => void;
  refreshDocuments: () => Promise<void>;
  uploadFile: (file: File, category?: string) => Promise<DocumentItem>;
  deleteDocument: (id: string) => Promise<void>;
  toasts: ToastItem[];
  showToast: (message: string, icon?: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, icon = 'info', type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, icon, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshDocuments = useCallback(async () => {
    try {
      const res = await api.getDocuments();
      setDocuments(res.documents);
      if (res.documents.length > 0 && !activeDoc) {
        setActiveDoc(res.documents[0]);
      }
    } catch (err) {
      console.warn('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }, [activeDoc]);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const uploadFile = async (file: File, category = 'Personal'): Promise<DocumentItem> => {
    showToast(`Uploading ${file.name}...`, 'cloud_upload', 'info');

    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // strip data:application/pdf;base64, prefix for raw base64 or keep
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await api.uploadDocument({
      fileName: file.name,
      fileType: file.name.split('.').pop()?.toUpperCase() || 'PDF',
      fileSize: file.size,
      mimeType: file.type || 'application/pdf',
      fileData: base64Data,
      category,
    });

    setDocuments(prev => [res.document, ...prev.filter(d => d.id !== res.document.id)]);
    setActiveDoc(res.document);
    showToast(`AI analysis completed for ${file.name}`, 'check_circle', 'success');
    return res.document;
  };

  const deleteDocument = async (id: string) => {
    await api.deleteDocument(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (activeDoc?.id === id) {
      const remaining = documents.filter(d => d.id !== id);
      setActiveDoc(remaining.length > 0 ? remaining[0] : null);
    }
    showToast('Document moved to trash', 'delete', 'info');
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        activeDoc,
        setActiveDoc,
        refreshDocuments,
        uploadFile,
        deleteDocument,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) throw new Error('useDocuments must be used within a DocumentProvider');
  return context;
};

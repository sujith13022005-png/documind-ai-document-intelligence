/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentProvider, useDocuments } from './context/DocumentContext';
import { Navbar } from './components/layout/Navbar';
import { SidebarDrawer } from './components/layout/SidebarDrawer';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { ToastContainer } from './components/common/ToastContainer';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentVaultPage } from './pages/DocumentVaultPage';
import { QuickUploadPage } from './pages/QuickUploadPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { AIChatPage } from './pages/AIChatPage';
import { SearchExplorePage } from './pages/SearchExplorePage';
import { ComparePage } from './pages/ComparePage';
import { InvoiceAnalyzerPage } from './pages/InvoiceAnalyzerPage';
import { CertificateAnalyzerPage } from './pages/CertificateAnalyzerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

import { ErrorBoundary } from './components/common/ErrorBoundary';

function AppContent() {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [activeDocId, setActiveDocId] = useState<string | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Handle Hash Routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '';
      if (!hash) {
        if (!user) setCurrentRoute('landing');
        else setCurrentRoute('dashboard');
        return;
      }

      if (hash.startsWith('document-detail/')) {
        const id = hash.split('/')[1];
        setActiveDocId(id);
        setCurrentRoute('document-detail');
        return;
      }

      if (hash.startsWith('ai-chat/')) {
        const id = hash.split('/')[1];
        setActiveDocId(id);
        setCurrentRoute('ai-chat');
        return;
      }

      setCurrentRoute(hash);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [user]);

  const navigateTo = (tab: string, docId?: string) => {
    setActiveDocId(docId);
    if (docId && tab === 'document-detail') {
      window.location.hash = `#document-detail/${docId}`;
    } else if (docId && tab === 'ai-chat') {
      window.location.hash = `#ai-chat/${docId}`;
    } else {
      window.location.hash = `#${tab}`;
    }
    setCurrentRoute(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route map titles for the header
  const getPageTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return { title: 'DocuMind', subtitle: 'Dashboard' };
      case 'documents':
        return { title: 'DocuMind', subtitle: 'Document Vault' };
      case 'quick-upload':
        return { title: 'Quick Upload', subtitle: 'Neural Ingestion' };
      case 'document-detail':
        return { title: 'Document Detail', subtitle: 'Inspection' };
      case 'ai-chat':
        return { title: 'DocuMind', subtitle: 'AI Copilot' };
      case 'search-explore':
        return { title: 'DocuMind', subtitle: 'Search Explore' };
      case 'compare':
      case 'document-compare':
        return { title: 'DocuMind', subtitle: 'Compare' };
      case 'invoice-parser':
        return { title: 'DocuMind', subtitle: 'Invoice Parser' };
      case 'compliance-verification':
        return { title: 'DocuMind', subtitle: 'Credential Verification' };
      case 'analytics':
        return { title: 'DocuMind', subtitle: 'Analytics' };
      case 'settings':
        return { title: 'DocuMind', subtitle: 'Settings' };
      default:
        return { title: 'DocuMind', subtitle: 'Workspace' };
    }
  };

  // 1. Unauthenticated or Landing Route
  if (currentRoute === 'landing') {
    return (
      <LandingPage
        onNavigateToAuth={(mode = 'signin') => {
          setAuthMode(mode);
          setCurrentRoute('auth');
        }}
        onNavigateToApp={(tab = 'dashboard') => navigateTo(tab)}
      />
    );
  }

  // 2. Auth Route
  if (currentRoute === 'auth' || currentRoute === 'login' || currentRoute === 'signup') {
    return (
      <AuthPage
        initialMode={authMode}
        onSuccess={() => navigateTo('dashboard')}
        onBackToLanding={() => setCurrentRoute('landing')}
      />
    );
  }

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        title={title}
        subtitle={subtitle}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => navigateTo('search-explore')}
        showBack={currentRoute === 'document-detail' || currentRoute === 'quick-upload'}
        onBack={() => navigateTo('dashboard')}
      />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activePath={currentRoute}
        onNavigate={navigateTo}
      />

      {/* Main Content Stage with padding for fixed header */}
      <main className="flex-1 flex flex-col pt-16">
        {currentRoute === 'dashboard' && <DashboardPage onNavigate={navigateTo} />}
        {currentRoute === 'documents' && <DocumentVaultPage onNavigate={navigateTo} />}
        {currentRoute === 'quick-upload' && <QuickUploadPage onNavigate={navigateTo} />}
        {currentRoute === 'document-detail' && (
          <DocumentDetailPage docId={activeDocId} onNavigate={navigateTo} onBack={() => navigateTo('documents')} />
        )}
        {currentRoute === 'ai-chat' && <AIChatPage initialDocId={activeDocId} onNavigate={navigateTo} />}
        {currentRoute === 'search-explore' && <SearchExplorePage onNavigate={navigateTo} />}
        {(currentRoute === 'compare' || currentRoute === 'document-compare') && <ComparePage />}
        {currentRoute === 'invoice-parser' && <InvoiceAnalyzerPage />}
        {currentRoute === 'compliance-verification' && <CertificateAnalyzerPage />}
        {currentRoute === 'analytics' && <AnalyticsPage />}
        {currentRoute === 'settings' && <SettingsPage />}
      </main>

      {/* Mobile Sticky Bottom Nav */}
      <BottomNavigation
        activeTab={currentRoute}
        onTabChange={tab => navigateTo(tab)}
      />

      {/* Global Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DocumentProvider>
          <AppContent />
        </DocumentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

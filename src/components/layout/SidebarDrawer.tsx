import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activePath = 'dashboard',
  onNavigate,
}) => {
  const { user, logout } = useAuth();

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
    else window.location.hash = `#${path}`;
    onClose();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'documents', label: 'Document Vault', icon: 'folder_open' },
    { id: 'quick-upload', label: 'Quick Upload', icon: 'cloud_upload' },
    { id: 'ai-chat', label: 'AI Copilot Chat', icon: 'auto_awesome' },
    { id: 'search-explore', label: 'Search & Explore', icon: 'manage_search' },
  ];

  const intelligenceSuites = [
    { id: 'analytics', label: 'Analytics & Insights', icon: 'insights' },
    { id: 'document-compare', label: 'Document Comparison', icon: 'difference' },
    { id: 'invoice-parser', label: 'Invoice & Bill Parser', icon: 'receipt_long' },
    { id: 'compliance-verification', label: 'Certificate Verification', icon: 'verified' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-[#283044]/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-76 max-w-[85vw] bg-white shadow-[0_20px_35px_-10px_rgba(15,23,42,0.15)] transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="h-16 px-5 border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3525cd] via-[#4f46e5] to-[#6b38d4] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <span className="font-headline text-[18px] font-bold text-[#3525cd] tracking-tight">
              DocuMind AI
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Drawer"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
          {/* Main Workspace Section */}
          <div className="px-3 py-1 text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
            Workspace
          </div>
          {menuItems.map(item => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-left font-medium text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#eaedff] text-[#3525cd] font-semibold'
                    : 'text-[#464555] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#3525cd]' : 'text-[#777587]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="my-3 h-[1px] bg-[#eaedff]" />

          {/* Intelligence Suites */}
          <div className="px-3 py-1 text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
            Intelligence Suites
          </div>
          {intelligenceSuites.map(item => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-left font-medium text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#eaedff] text-[#3525cd] font-semibold'
                    : 'text-[#464555] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#3525cd]' : 'text-[#777587]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="my-3 h-[1px] bg-[#eaedff]" />

          {/* System Section */}
          <div className="px-3 py-1 text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
            System
          </div>
          <button
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-left font-medium text-[13px] transition-colors ${
              activePath === 'settings'
                ? 'bg-[#eaedff] text-[#3525cd] font-semibold'
                : 'text-[#464555] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-[#777587]">settings</span>
            <span>Settings &amp; Keys</span>
          </button>
          <button
            onClick={() => {
              logout();
              handleNav('landing');
            }}
            className="w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-left font-medium text-[13px] text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>

        {/* User Card at Bottom */}
        <div className="p-4 bg-[#f2f3ff] border-t border-[#eaedff] flex items-center gap-3">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#3525cd]"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-[#131b2e] truncate">
              {user?.name || 'Enterprise Lead'}
            </span>
            <span className="text-[11px] text-[#464555] truncate">
              {user?.email || 'alex.chen@documind.ai'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

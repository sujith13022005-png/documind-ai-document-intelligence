import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  onOpenDrawer?: () => void;
  onOpenSearch?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = 'DocuMind',
  subtitle = 'Dashboard',
  onOpenDrawer,
  onOpenSearch,
  showBack = false,
  onBack,
}) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 w-full z-40 bg-[#faf8ff]/85 backdrop-blur-xl border-b border-[#c7c4d8]/20 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Hamburger or Back + Logo + Title */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack || (() => window.history.back())}
              aria-label="Back"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
          ) : (
            <button
              onClick={onOpenDrawer}
              aria-label="Open navigation drawer"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            {/* Logo Emblem */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3525cd] via-[#4f46e5] to-[#6b38d4] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[17px] font-bold text-[#3525cd] tracking-tight leading-none">
                {title}
              </span>
              <span className="text-[11px] font-medium text-[#464555] mt-0.5">
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-[#464555]">
          <button onClick={() => window.location.hash = '#dashboard'} className="hover:text-[#3525cd] transition-colors">
            Dashboard
          </button>
          <button onClick={() => window.location.hash = '#documents'} className="hover:text-[#3525cd] transition-colors">
            Vault
          </button>
          <button onClick={() => window.location.hash = '#ai-chat'} className="hover:text-[#3525cd] transition-colors">
            AI Copilot
          </button>
          <button onClick={() => window.location.hash = '#search-explore'} className="hover:text-[#3525cd] transition-colors">
            Search
          </button>
          <button onClick={() => window.location.hash = '#compare'} className="hover:text-[#3525cd] transition-colors">
            Compare
          </button>
          <button onClick={() => window.location.hash = '#invoice-parser'} className="hover:text-[#3525cd] transition-colors">
            Invoices
          </button>
        </nav>

        {/* Right: Search, Notifications, Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch || (() => window.location.hash = '#search-explore')}
            aria-label="Global Search"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <button
            aria-label="Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-[#464555] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#faf8ff]"></span>
          </button>

          {/* User Profile avatar */}
          <div
            onClick={() => window.location.hash = '#settings'}
            className="w-9 h-9 rounded-full ring-2 ring-[#e2dfff] overflow-hidden cursor-pointer hover:ring-[#3525cd] transition-all shrink-0 ml-1"
            title={user?.name || 'User Profile'}
          >
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

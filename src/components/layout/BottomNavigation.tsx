import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-40 bg-[#faf8ff]/90 backdrop-blur-xl border-t border-[#c7c4d8]/20 shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
      <div className="relative flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {/* Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center h-14 transition-colors ${
            activeTab === 'dashboard' ? 'text-[#3525cd] font-bold' : 'text-[#464555] hover:text-[#3525cd]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Dashboard</span>
        </button>

        {/* Documents Vault */}
        <button
          onClick={() => onTabChange('documents')}
          className={`flex-1 flex flex-col items-center justify-center h-14 transition-colors ${
            activeTab === 'documents' ? 'text-[#3525cd] font-bold' : 'text-[#464555] hover:text-[#3525cd]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">folder_open</span>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Documents</span>
        </button>

        {/* Center elevated (+) Quick Upload */}
        <div className="flex-1 flex justify-center items-center">
          <button
            onClick={() => onTabChange('quick-upload')}
            aria-label="Upload and quick extract"
            className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-[#3525cd] via-[#4f46e5] to-[#6b38d4] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(107,56,212,0.45)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>

        {/* AI Chat */}
        <button
          onClick={() => onTabChange('ai-chat')}
          className={`flex-1 flex flex-col items-center justify-center h-14 transition-colors ${
            activeTab === 'ai-chat' ? 'text-[#3525cd] font-bold' : 'text-[#464555] hover:text-[#3525cd]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">AI Chat</span>
        </button>

        {/* Explore / Search */}
        <button
          onClick={() => onTabChange('search-explore')}
          className={`flex-1 flex flex-col items-center justify-center h-14 transition-colors ${
            activeTab === 'search-explore' ? 'text-[#3525cd] font-bold' : 'text-[#464555] hover:text-[#3525cd]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">manage_search</span>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Explore</span>
        </button>
      </div>
    </nav>
  );
};

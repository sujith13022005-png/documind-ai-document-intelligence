import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
  onNavigate: (tab: string, docId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { documents, refreshDocuments, setActiveDoc, showToast } = useDocuments();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDocuments();
    showToast('Document vault synchronized', 'sync', 'success');
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleOpenDoc = (doc: any) => {
    setActiveDoc(doc);
    onNavigate('document-detail', doc.id);
  };

  // Compute live stats or sensible defaults
  const totalCount = documents.length > 0 ? documents.length : 148;
  const parsedCount = documents.filter(d => d.status === 'COMPLETED').length || 142;
  const recentDocs = documents.slice(0, 4);

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto">
      {/* Status & Greeting Banner */}
      <section className="px-4 md:px-6 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl text-[#131b2e] font-bold tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#6b38d4] animate-pulse" />
            <span className="text-[12px] text-[#464555] font-medium">
              All AI engines operational
            </span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          aria-label="Refresh Workspace"
          className="w-10 h-10 rounded-xl bg-white border border-[#eaedff] flex items-center justify-center text-[#3525cd] active:scale-95 transition-transform shadow-sm hover:bg-[#f2f3ff]"
        >
          <span className={`material-symbols-outlined text-[20px] ${isRefreshing ? 'animate-spin' : ''}`}>
            sync
          </span>
        </button>
      </section>

      {/* Key Metric Bento Grid (2x2) */}
      <section className="px-4 md:px-6 py-2.5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Metric 1: Total Documents */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3525cd]">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e2dfff] text-[#3323cc] font-semibold">
                +12
              </span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-2xl font-bold text-[#131b2e]">{totalCount}</div>
              <div className="text-[11px] text-[#464555] font-medium">Total Documents</div>
            </div>
          </div>

          {/* Metric 2: Documents Analyzed */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#e9ddff] flex items-center justify-center text-[#6b38d4]">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eaedff] text-[#3525cd] font-semibold">
                96%
              </span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-2xl font-bold text-[#131b2e]">{parsedCount}</div>
              <div className="text-[11px] text-[#464555] font-medium">Parsed &amp; Indexed</div>
            </div>
          </div>

          {/* Metric 3: AI Queries Run */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#e1e0ff] flex items-center justify-center text-[#3130c0]">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#464555] font-medium">
                Active
              </span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-2xl font-bold text-[#131b2e]">520</div>
              <div className="text-[11px] text-[#464555] font-medium">AI Queries Run</div>
            </div>
          </div>

          {/* Metric 4: Cloud Storage */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#464555]">
                <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
              </span>
              <span className="text-[11px] text-[#464555] font-medium">24%</span>
            </div>
            <div className="mt-3">
              <div className="font-headline text-[17px] font-bold text-[#131b2e]">1.2 / 5 GB</div>
              <div className="w-full bg-[#eaedff] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '24%' }} />
              </div>
              <div className="text-[11px] text-[#464555] mt-1">Cloud Vault</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Carousel */}
      <section className="py-2.5">
        <div className="px-4 md:px-6 mb-2 flex items-center justify-between">
          <span className="font-headline text-[15px] text-[#131b2e] font-semibold">Quick Actions</span>
          <span className="text-[11px] text-[#3525cd] font-semibold">Swipe for more</span>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto px-4 md:px-6 py-1 no-scrollbar">
          {/* Upload Document */}
          <button
            onClick={() => onNavigate('quick-upload')}
            className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-[#3525cd] to-[#6b38d4] text-white px-4 h-12 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            <span className="text-[13px] font-semibold whitespace-nowrap">Upload Doc</span>
          </button>

          {/* Scan Document */}
          <button
            onClick={() => {
              showToast('Opening instant scanner pipeline...', 'document_scanner');
              onNavigate('quick-upload');
            }}
            className="shrink-0 flex items-center gap-2 bg-white border border-[#eaedff] text-[#131b2e] px-4 h-12 rounded-xl shadow-sm hover:bg-[#f2f3ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#3525cd]">document_scanner</span>
            <span className="text-[13px] font-medium whitespace-nowrap">Scan Document</span>
          </button>

          {/* Ask Documents */}
          <button
            onClick={() => onNavigate('ai-chat')}
            className="shrink-0 flex items-center gap-2 bg-white border border-[#eaedff] text-[#131b2e] px-4 h-12 rounded-xl shadow-sm hover:bg-[#f2f3ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#6b38d4]">forum</span>
            <span className="text-[13px] font-medium whitespace-nowrap">Ask Documents</span>
          </button>

          {/* Generate Summary */}
          <button
            onClick={() => onNavigate('documents')}
            className="shrink-0 flex items-center gap-2 bg-white border border-[#eaedff] text-[#131b2e] px-4 h-12 rounded-xl shadow-sm hover:bg-[#f2f3ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#3130c0]">summarize</span>
            <span className="text-[13px] font-medium whitespace-nowrap">Summarize</span>
          </button>

          {/* Compare */}
          <button
            onClick={() => onNavigate('document-compare')}
            className="shrink-0 flex items-center gap-2 bg-white border border-[#eaedff] text-[#131b2e] px-4 h-12 rounded-xl shadow-sm hover:bg-[#f2f3ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#8455ef]">difference</span>
            <span className="text-[13px] font-medium whitespace-nowrap">Compare</span>
          </button>
        </div>
      </section>

      {/* Document Categories */}
      <section className="px-4 md:px-6 py-2.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-headline text-[15px] text-[#131b2e] font-semibold">Categories</span>
          <button
            onClick={() => onNavigate('documents')}
            className="text-[12px] text-[#3525cd] font-semibold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Finance & Bills */}
          <div
            onClick={() => onNavigate('documents')}
            className="bg-white border border-[#eaedff] rounded-xl p-3 shadow-sm flex items-start gap-2.5 cursor-pointer active:scale-98 transition-all hover:border-[#3525cd]/40"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#3525cd] shrink-0">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-[#131b2e] font-semibold truncate">Finance &amp; Bills</div>
              <div className="text-[11px] text-[#464555]">42 docs</div>
            </div>
          </div>

          {/* Academic */}
          <div
            onClick={() => onNavigate('documents')}
            className="bg-white border border-[#eaedff] rounded-xl p-3 shadow-sm flex items-start gap-2.5 cursor-pointer active:scale-98 transition-all hover:border-[#3525cd]/40"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#6b38d4] shrink-0">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-[#131b2e] font-semibold truncate">Academic</div>
              <div className="text-[11px] text-[#464555]">34 docs</div>
            </div>
          </div>

          {/* Legal & Deals */}
          <div
            onClick={() => onNavigate('documents')}
            className="bg-white border border-[#eaedff] rounded-xl p-3 shadow-sm flex items-start gap-2.5 cursor-pointer active:scale-98 transition-all hover:border-[#3525cd]/40"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#3130c0] shrink-0">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-[#131b2e] font-semibold truncate">Legal &amp; Deals</div>
              <div className="text-[11px] text-[#464555]">19 docs</div>
            </div>
          </div>

          {/* Certificates */}
          <div
            onClick={() => onNavigate('compliance-verification')}
            className="bg-white border border-[#eaedff] rounded-xl p-3 shadow-sm flex items-start gap-2.5 cursor-pointer active:scale-98 transition-all hover:border-[#3525cd]/40"
          >
            <div className="w-9 h-9 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#4f46e5] shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-[#131b2e] font-semibold truncate">Certificates</div>
              <div className="text-[11px] text-[#464555]">12 docs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent AI Discoveries */}
      <section className="px-4 md:px-6 py-2.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#6b38d4] text-[20px]">magic_button</span>
            <span className="font-headline text-[15px] text-[#131b2e] font-semibold">Recent AI Discoveries</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e9ddff] text-[#23005c] font-semibold">
            Live Q&amp;A
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Query Card 1 */}
          <div
            onClick={() => onNavigate('ai-chat')}
            className="bg-white border border-[#eaedff] rounded-2xl p-4 shadow-sm flex flex-col gap-1.5 cursor-pointer hover:border-[#3525cd]/40 transition-all active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-md bg-[#e2dfff] flex items-center justify-center text-[#3525cd] text-[14px] shrink-0">
                  <span className="material-symbols-outlined text-[16px]">help</span>
                </span>
                <span className="text-[13px] font-semibold text-[#131b2e] truncate">
                  Total Q3 marketing spend from invoices?
                </span>
              </div>
              <span className="text-[11px] text-[#464555] shrink-0">12m ago</span>
            </div>
            <div className="bg-[#f2f3ff] p-2.5 rounded-xl flex items-start gap-2 mt-1">
              <span className="material-symbols-outlined text-[#6b38d4] text-[18px] shrink-0 mt-0.5">
                auto_awesome
              </span>
              <p className="text-[12px] text-[#131b2e] leading-relaxed">
                Found <strong className="text-[#3525cd] font-bold">$42,850.00</strong> aggregated across 4 processed receipts and media invoices.
              </p>
            </div>
          </div>

          {/* Query Card 2 */}
          <div
            onClick={() => onNavigate('ai-chat')}
            className="bg-white border border-[#eaedff] rounded-2xl p-4 shadow-sm flex flex-col gap-1.5 cursor-pointer hover:border-[#3525cd]/40 transition-all active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-md bg-[#e9ddff] flex items-center justify-center text-[#6b38d4] text-[14px] shrink-0">
                  <span className="material-symbols-outlined text-[16px]">help</span>
                </span>
                <span className="text-[13px] font-semibold text-[#131b2e] truncate">
                  Renewal deadline for AWS enterprise agreement?
                </span>
              </div>
              <span className="text-[11px] text-[#464555] shrink-0">1h ago</span>
            </div>
            <div className="bg-[#f2f3ff] p-2.5 rounded-xl flex items-start gap-2 mt-1">
              <span className="material-symbols-outlined text-[#6b38d4] text-[18px] shrink-0 mt-0.5">
                auto_awesome
              </span>
              <p className="text-[12px] text-[#131b2e] leading-relaxed">
                Term renewal scheduled for <strong className="text-[#6b38d4] font-bold">October 15, 2025</strong> with a 60-day auto-notice clause.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Documents List */}
      <section className="px-4 md:px-6 py-2.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-headline text-[15px] text-[#131b2e] font-semibold">Recent Documents</span>
          <button
            onClick={() => onNavigate('documents')}
            className="text-[12px] text-[#3525cd] font-semibold hover:underline"
          >
            See All
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleOpenDoc(doc)}
              className="bg-white border border-[#eaedff] rounded-2xl p-3 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-[#3525cd]/40 transition-all active:bg-[#f2f3ff]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#3525cd] shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    {doc.category === 'Certificates' ? 'workspace_premium' : doc.category === 'Finance' ? 'receipt' : 'picture_as_pdf'}
                  </span>
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-[13px] font-semibold text-[#131b2e] truncate">
                    {doc.fileName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#464555] mt-0.5">
                    <span>{doc.fileType}</span>
                    <span>•</span>
                    <span>{doc.fileSizeBytesText}</span>
                    <span>•</span>
                    <span>{doc.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#e9ddff] text-[#23005c] font-semibold">
                  {doc.status === 'COMPLETED' ? 'Analyzed' : doc.status}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#777587]">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Synthesis Banner */}
      <section className="px-4 md:px-6 pt-3">
        <div className="bg-gradient-to-r from-[#4f46e5] via-[#3525cd] to-[#6b38d4] rounded-2xl p-4.5 text-white shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px] text-white">neurology</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-headline text-[15px] font-bold truncate leading-tight">
                Need smart synthesis?
              </h2>
              <p className="text-[12px] text-white/80 truncate">
                Ask questions across all {totalCount} documents in your vault
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-chat')}
            className="shrink-0 px-4 py-2 rounded-xl bg-white text-[#3525cd] font-headline text-[12px] font-bold shadow-sm active:scale-95 transition-transform"
          >
            Ask AI
          </button>
        </div>
      </section>
    </div>
  );
};

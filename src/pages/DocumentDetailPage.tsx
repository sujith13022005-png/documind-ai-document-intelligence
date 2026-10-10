import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { DocumentItem } from '../types';

interface DocumentDetailPageProps {
  docId?: string;
  onNavigate: (tab: string, docId?: string) => void;
  onBack: () => void;
}

export const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({ docId, onNavigate, onBack }) => {
  const { documents, activeDoc, showToast } = useDocuments();

  const doc: DocumentItem = (docId ? documents.find(d => d.id === docId) : activeDoc) || documents[0] || {
    id: 'doc_msa_default',
    userId: 'user_alex_chen',
    fileName: 'AcmeCorp_Master_Services_Agreement_2024.pdf',
    fileType: 'PDF',
    fileSize: 2400000,
    fileSizeBytesText: '2.4 MB',
    mimeType: 'application/pdf',
    category: 'Finance',
    status: 'COMPLETED',
    pageCount: 12,
    confidenceScore: 99.8,
    processingTimeMs: 1400,
    summary: 'Binding Master Services Agreement between Acme Corp and DocuMind Technologies Inc.',
    executiveSummary: [
      'Binding SLA: Establishes multi-tenant cloud provision terms with 99.95% guaranteed uptime & quarterly compliance attestations.',
      'Jurisdiction: Controlled under Delaware State corporate code, requiring pre-litigation arbitration in Wilmington.',
      'Renewal Cycle: Multi-year operational term expiring Oct 15, 2025, automatically rolling for 12-month increments without explicit opt-out.'
    ],
    criticalInsight: 'Automatic renewal requires a 60-day written notice prior to Oct 15, 2025 (cutoff: Aug 16, 2025).',
    keywords: ['#SaaS', '#Indemnity', '#Confidentiality', '#PaymentTerms', '#MutualNDA'],
    entities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [activeTab, setActiveTab] = useState<'preview' | 'entities'>('preview');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [askInput, setAskInput] = useState('');
  const [tags, setTags] = useState(doc.keywords || ['#SaaS', '#Indemnity', '#Confidentiality', '#PaymentTerms', '#MutualNDA']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    onNavigate('ai-chat', doc.id);
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Field,Value",
        `Document Name,${doc.fileName}`,
        `Document Type,${doc.fileType}`,
        `Effective Date,Jan 1 2024`,
        `Expiry Date,Oct 15 2025`,
        `Total Contract Value,$184500.00`,
        `Governing Law,Delaware USA`
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${doc.fileName.replace('.pdf', '')}_extracted_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported structured CSV data', 'download', 'success');
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const formatted = newTagInput.startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
      setTags([...tags, formatted]);
      setNewTagInput('');
      setShowAddTag(false);
      showToast(`Added tag ${formatted}`, 'tag', 'success');
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-4xl mx-auto">
      {/* Top Document Identity & Confidence Bar */}
      <div className="px-4 md:px-6 pt-3 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9ddff] text-[#23005c] text-[11px] font-semibold shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4] animate-pulse" />
            AI Analyzed ({doc.confidenceScore || 99.8}% confidence)
          </span>
          <span className="text-[11px] text-[#777587] flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            SOC-2 Certified
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#3525cd] shrink-0">
            <span className="material-symbols-outlined text-[22px]">description</span>
          </div>
          <h2 className="font-headline text-lg md:text-xl font-bold text-[#131b2e] truncate">
            {doc.fileName}
          </h2>
        </div>
        <p className="text-[12px] text-[#464555] mt-0.5 pl-11">
          {doc.pageCount || 12} pages • {doc.fileSizeBytesText} • Processed in {(doc.processingTimeMs ? (doc.processingTimeMs / 1000).toFixed(1) : '1.4')}s
        </p>
      </div>

      {/* Horizontal Sticky Quick Actions Carousel */}
      <div className="sticky top-16 z-30 bg-[#faf8ff]/95 backdrop-blur-md px-4 md:px-6 py-2.5 border-y border-[#eaedff]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => onNavigate('ai-chat', doc.id)}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#6b38d4] text-white text-[12px] font-semibold shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span>Ask Document</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('entities');
              showToast('Scrolled to executive brief', 'summarize');
            }}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#f2f3ff] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#3525cd]">summarize</span>
            <span>Summary</span>
          </button>
          <button
            onClick={handleExportData}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#f2f3ff] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">dataset</span>
            <span>Export Data</span>
          </button>
          <button
            onClick={() => showToast('Report generated for download', 'download', 'success')}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#f2f3ff] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#3130c0]">download</span>
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Segmented View Switcher */}
      <div className="px-4 md:px-6 pt-3 pb-2">
        <div className="p-1 rounded-xl bg-[#eaedff] flex items-center">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-[#131b2e] shadow-sm'
                : 'text-[#464555] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#3525cd]">visibility</span>
            <span>Document Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`flex-1 py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'entities'
                ? 'bg-white text-[#131b2e] shadow-sm'
                : 'text-[#464555] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#6b38d4]">psychology</span>
            <span>AI Intelligence</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Document Preview Panel */}
      {activeTab === 'preview' && (
        <div className="px-4 md:px-6 flex flex-col gap-3">
          <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff]">
            {/* Page Navigation Header */}
            <div className="flex items-center justify-between pb-2 mb-3 bg-[#f2f3ff] px-3 py-1.5 rounded-xl border border-[#eaedff]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#3525cd] text-[18px]">auto_stories</span>
                <span className="text-[12px] font-bold text-[#131b2e]">Page {currentPage} of {doc.pageCount || 12}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#eaedff] flex items-center justify-center text-[#464555] hover:text-[#131b2e]"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <span className="text-[11px] font-mono text-[#131b2e] px-1.5 font-semibold">{zoomLevel}%</span>
                <button
                  onClick={() => setCurrentPage(Math.min(doc.pageCount || 12, currentPage + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#eaedff] flex items-center justify-center text-[#464555] hover:text-[#131b2e]"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* OCR Visual Canvas with AI Entity Tags */}
            <div className="relative w-full rounded-xl p-4 bg-white border border-[#eaedff] select-none text-[12px] leading-relaxed text-[#131b2e] space-y-3 font-mono">
              <div className="text-center font-headline text-[15px] font-bold text-[#131b2e] tracking-tight mb-2">
                MASTER SERVICES AGREEMENT
              </div>

              <p className="text-[#464555] leading-6">
                This Master Services Agreement ("Agreement") is executed and entered into effective as of{' '}
                <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded bg-[#dae2fd] text-[#3525cd] font-bold text-[11px] shadow-xs cursor-pointer hover:bg-[#c3c0ff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] mr-1" />
                  Jan 1, 2024
                </span>
                , by and between{' '}
                <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded bg-[#e9ddff] text-[#23005c] font-bold text-[11px] shadow-xs cursor-pointer hover:bg-[#d0bcff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4] mr-1" />
                  Acme Corp
                </span>{' '}
                ("Client"), and{' '}
                <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded bg-[#e9ddff] text-[#23005c] font-bold text-[11px] shadow-xs cursor-pointer hover:bg-[#d0bcff]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4] mr-1" />
                  DocuMind Technologies Inc.
                </span>{' '}
                ("Vendor").
              </p>

              <div className="p-3 rounded-xl bg-[#f2f3ff] space-y-1 my-3 border border-[#eaedff]">
                <div className="text-[11px] font-bold text-[#131b2e] flex items-center justify-between">
                  <span>Section 4.1 — Consideration &amp; Compensation</span>
                  <span className="text-[10px] text-[#777587]">TOKEN_EXT_04</span>
                </div>
                <p className="text-[12px] text-[#464555] leading-relaxed">
                  Client shall remit to Vendor a cumulative annual subscription fee totaling{' '}
                  <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded bg-[#eaedff] text-[#3525cd] font-bold text-[11px] shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4b4dd8] mr-1" />
                    $184,500.00 / year
                  </span>{' '}
                  payable net-30 days upon invoicing.
                </p>
              </div>

              <p className="text-[#464555] leading-6">
                This agreement remains valid until{' '}
                <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded bg-[#dae2fd] text-[#3525cd] font-bold text-[11px] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] mr-1" />
                  Oct 15, 2025
                </span>
                , subject to governing jurisdiction of{' '}
                <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded bg-[#eaedff] text-[#131b2e] font-bold text-[11px] shadow-xs">
                  State of Delaware, US
                </span>.
              </p>

              {/* Bounding Box Legend */}
              <div className="mt-4 pt-3 border-t border-[#eaedff] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#464555]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#8455ef]" />
                  <span>Parties</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#464555]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#4f46e5]" />
                  <span>Dates</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#464555]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#4b4dd8]" />
                  <span>Financials</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#464555]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#dae2fd]" />
                  <span>Legal Cl.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Intelligence & Summary */}
      <div className={`px-4 md:px-6 flex flex-col gap-3 mt-3 ${activeTab === 'preview' ? 'mt-2' : ''}`}>
        {/* Executive Summary Card */}
        <div className="bg-white rounded-2xl p-4.5 shadow-sm border border-[#eaedff] space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </div>
              <h3 className="font-headline text-[15px] font-bold text-[#131b2e]">Executive Summary</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#464555] font-mono text-[10px] font-bold">
              v2.4 PARSED
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {(doc.executiveSummary || [
              'Binding SLA: Establishes multi-tenant cloud provision terms with 99.95% guaranteed uptime.',
              'Jurisdiction: Controlled under Delaware State corporate code, requiring pre-litigation arbitration in Wilmington.',
              'Renewal Cycle: Multi-year operational term expiring Oct 15, 2025.'
            ]).map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                <span className="material-symbols-outlined text-[#3525cd] text-[18px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <p className="text-[12px] text-[#131b2e] leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Critical Insight Callout Banner */}
          {doc.criticalInsight && (
            <div className="rounded-xl p-3 bg-[#e9ddff] text-[#23005c] flex items-start gap-2.5 border border-[#6b38d4]/20 shadow-xs">
              <span className="material-symbols-outlined text-[20px] text-[#6b38d4] shrink-0 mt-0.5">
                notification_important
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-[#5516be] block tracking-wide uppercase">
                  CRITICAL DEADLINE INSIGHT
                </span>
                <p className="text-[12px] text-[#23005c] mt-0.5 font-medium leading-relaxed">
                  {doc.criticalInsight}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Extracted Metadata Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e]">Extracted Metadata</h3>
            <span className="text-[11px] text-[#3525cd] font-semibold">
              View all 24 entities
            </span>
          </div>

          {/* Doc Type & Financials Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">DOCUMENT TYPE</span>
              <div className="mt-2">
                <span className="font-headline text-[15px] font-bold text-[#131b2e] block leading-tight">B2B MSA</span>
                <span className="text-[11px] text-[#464555]">Service Agreement</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#6b38d4] font-semibold">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span>100% matched</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">ANNUAL CONTRACT VALUE</span>
              <div className="mt-2">
                <span className="font-headline text-[16px] font-bold text-[#3525cd] block leading-tight">$184.5k</span>
                <span className="text-[11px] text-[#464555]">USD / year</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#464555]">
                <span>Net-30 Terms</span>
              </div>
            </div>
          </div>

          {/* Contracting Parties Card */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff] space-y-2">
            <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">CONTRACTING PARTIES</span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#e9ddff] text-[#23005c] flex items-center justify-center font-bold text-[12px]">
                    C
                  </div>
                  <div className="truncate">
                    <span className="text-[12px] font-bold text-[#131b2e] block truncate">Acme Corp</span>
                    <span className="text-[10px] text-[#464555]">Client • Delaware #74129</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white text-[#131b2e] font-mono text-[10px] font-bold border border-[#eaedff]">
                  BUYER
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#e2dfff] text-[#0f0069] flex items-center justify-center font-bold text-[12px]">
                    V
                  </div>
                  <div className="truncate">
                    <span className="text-[12px] font-bold text-[#131b2e] block truncate">DocuMind Technologies Inc.</span>
                    <span className="text-[10px] text-[#464555]">Vendor • California #99211</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white text-[#131b2e] font-mono text-[10px] font-bold border border-[#eaedff]">
                  PROVIDER
                </span>
              </div>
            </div>
          </div>

          {/* Timeline and Governing Law */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff] space-y-2">
              <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">TIMELINE</span>
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-[#464555] uppercase block font-semibold">Effective</span>
                  <span className="text-[12px] font-bold text-[#131b2e]">Jan 1, 2024</span>
                </div>
                <div className="pt-1">
                  <span className="text-[10px] text-[#ba1a1a] uppercase block font-semibold">Expiry</span>
                  <span className="text-[12px] font-bold text-[#ba1a1a]">Oct 15, 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff] space-y-2">
              <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">GOVERNING LAW</span>
              <div>
                <span className="font-headline text-[14px] font-bold text-[#131b2e] block">Delaware</span>
                <span className="text-[11px] text-[#464555] block">United States</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#eaedff] text-[10px] text-[#131b2e] font-semibold">
                  Arbitration Req.
                </span>
              </div>
            </div>
          </div>

          {/* Tags & Semantic Keywords */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff] space-y-2">
            <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">TAGS &amp; SEMANTIC KEYWORDS</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold hover:bg-[#e2dfff] cursor-pointer transition-colors"
                >
                  {t}
                </span>
              ))}

              {showAddTag ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    placeholder="#Tag"
                    className="w-24 px-2 py-0.5 text-[11px] border rounded-md"
                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                  />
                  <button onClick={handleAddTag} className="text-[11px] font-bold text-[#3525cd]">Add</button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddTag(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#e9ddff] text-[#23005c] text-[11px] font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">add</span> Add Tag
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Ask AI Dock */}
      <div className="fixed bottom-20 md:bottom-6 left-0 w-full px-4 md:px-6 z-40 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <form
            onSubmit={handleAskSubmit}
            className="bg-white/95 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl border border-[#eaedff] flex items-center gap-2"
          >
            <div className="pl-2.5 text-[#6b38d4] flex items-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <input
              type="text"
              value={askInput}
              onChange={e => setAskInput(e.target.value)}
              placeholder="Ask AI about this agreement..."
              className="flex-1 bg-transparent py-2.5 px-1 text-[13px] text-[#131b2e] placeholder:text-[#777587] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send query"
              className="h-9 w-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

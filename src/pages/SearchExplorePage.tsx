import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { api } from '../services/api';

interface SearchExplorePageProps {
  onNavigate: (tab: string, docId?: string) => void;
}

export const SearchExplorePage: React.FC<SearchExplorePageProps> = ({ onNavigate }) => {
  const { documents, setActiveDoc, showToast } = useDocuments();
  const [query, setQuery] = useState('What did we pay for cloud infrastructure in August?');
  const [semanticMode, setSemanticMode] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedDate, setSelectedDate] = useState('Past 30 days');

  // Synthesis answer
  const [synthesis, setSynthesis] = useState<any>({
    answer: 'According to AWS Invoice #9821, total infrastructure expense was $3,842.50 paid on Aug 28, 2024 via Primary Corporate Amex.',
    source: 'AWS_Cloud_Invoice_Aug2024.pdf (p.2)',
    confidence: 'Verified 99.4%'
  });

  const handleSearch = async (newQuery = query) => {
    if (!newQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.search(newQuery);
      if (res.synthesis) {
        setSynthesis({
          answer: res.synthesis.synthesis,
          source: res.synthesis.primarySource || 'Vault Document',
          confidence: `Verified ${res.synthesis.confidence || 98}%`
        });
      }
    } catch (err) {
      console.warn('Search API error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInspect = (doc: any) => {
    setActiveDoc(doc);
    onNavigate('document-detail', doc.id);
  };

  // Curated matching results
  const results = [
    {
      id: 'doc_aws_inv',
      name: 'AWS_Cloud_Invoice_Aug2024.pdf',
      date: 'Modified Aug 29, 2024 • 1.4 MB',
      matchScore: '98% Match',
      category: 'Finance & Bills',
      badge: 'Automated OCR',
      author: 'Alex Chen',
      snippet: '…Total Balance Due: $3,842.50 for US-East Data Centers and S3 Storage Services. Payment processed automatically on August 28…',
      highlight: '$3,842.50',
      matchType: 'Page 2 • Matches “cloud infrastructure spend”'
    },
    {
      id: 'doc_gcp_rcpt',
      name: 'GCP_Hosting_Receipt_Q3.pdf',
      date: 'Modified Sep 02, 2024 • 840 KB',
      matchScore: '91% Match',
      category: 'Finance',
      badge: 'Receipt',
      author: 'Alex Chen',
      snippet: '…Monthly server compute charges totaled $1,220.00 processed via auto-debit for cluster europe-west1 Kubernetes engine…',
      highlight: '$1,220.00',
      matchType: 'Page 1 • Direct entity extraction'
    },
    {
      id: 'doc_budget_forecast',
      name: 'Infrastructure_Budget_Forecast_2025.xlsx',
      date: 'Modified Aug 15, 2024 • 3.1 MB',
      matchScore: '85% Match',
      category: 'Reports',
      badge: 'Spreadsheet',
      author: 'Sarah Jenkins',
      snippet: '…Projected annual spend across AWS & GCP nodes estimated at $64,000, allocating Q3 budget reserves at 18.5%…',
      highlight: 'AWS & GCP nodes estimated at $64,000',
      matchType: 'Sheet 3: "Cloud Estimates"'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto">
      {/* Top Search & Filter Strip */}
      <section className="px-4 md:px-6 py-3 flex flex-col gap-3">
        {/* Search Bar with Elevation & Focus Glow */}
        <div className="relative w-full">
          <div className="flex items-center w-full h-12 bg-white rounded-2xl shadow-[0_4px_16px_rgba(79,70,229,0.08)] px-4 gap-3 border border-[#eaedff] focus-within:ring-2 focus-within:ring-[#3525cd]">
            <span className="material-symbols-outlined text-[#3525cd] text-[22px]">search</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Ask anything about your documents..."
              className="flex-1 bg-transparent text-[#131b2e] text-[13px] placeholder:text-[#777587] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#eaedff] text-[#464555] hover:text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Semantic Vector Search Pill Switch & Stats */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => {
              setSemanticMode(!semanticMode);
              showToast(semanticMode ? 'Switched to Keyword Search' : 'Switched to Semantic Vector Neural Search', 'auto_awesome');
            }}
            className="flex items-center gap-1.5 bg-[#eaedff] px-3 py-1 rounded-full shadow-xs text-left"
          >
            <span className="material-symbols-outlined text-[#6b38d4] text-[16px]">auto_awesome</span>
            <span className="text-[11px] text-[#131b2e] font-semibold tracking-wide">
              {semanticMode ? 'Semantic Vector Search' : 'Exact Keyword Search'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#8455ef] animate-ping ml-0.5" />
          </button>

          <div className="flex items-center gap-2 text-[#464555]">
            <span className="text-[11px] font-medium">3 found in {documents.length} docs</span>
            <button
              onClick={() => handleSearch()}
              className="p-1 hover:text-[#3525cd] text-[#777587]"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Horizontal Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 md:mx-0 md:px-0">
          <button className="shrink-0 flex items-center gap-1 h-8 px-3 rounded-full bg-[#3525cd] text-white text-[12px] font-semibold shadow-xs">
            <span>{selectedType}</span>
            <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
          </button>

          <button className="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#e2dfff]">
            <span className="material-symbols-outlined text-[16px] text-[#3525cd]">calendar_today</span>
            <span>{selectedDate}</span>
          </button>

          <button className="shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#e2dfff]">
            <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">label</span>
            <span>Finance, Legal</span>
          </button>

          <button className="shrink-0 flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-[#eaedff] text-[#131b2e] text-[12px] font-semibold">
            <div className="w-4 h-4 rounded-full bg-[#6b38d4] text-white flex items-center justify-center text-[9px] font-bold">
              AC
            </div>
            <span>Alex Chen</span>
          </button>
        </div>
      </section>

      {/* AI Instant Answer Synthesis Banner */}
      <section className="px-4 md:px-6 my-1">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3525cd] via-[#4f46e5] to-[#6b38d4] text-white p-4.5 shadow-lg">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20">
                  <span className="material-symbols-outlined text-[16px]">neurology</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#dad7ff] font-bold">
                  AI Synthesis Answer
                </span>
              </div>
              <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full text-white font-medium">
                {synthesis.confidence}
              </span>
            </div>

            <p className="text-[12px] text-[#dad7ff] italic">
              “{query}”
            </p>

            <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl mt-0.5">
              <p className="text-[13px] leading-relaxed text-white">
                {synthesis.answer}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 text-[#dad7ff] text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">link</span>
                <span>Source: {synthesis.source}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(synthesis.answer);
                  showToast('Copied synthesis to clipboard', 'content_copy', 'success');
                }}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg text-white font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[13px]">content_copy</span>
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ranked Search Results Feed */}
      <section className="px-4 md:px-6 flex flex-col gap-3 my-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-headline text-[15px] text-[#131b2e] font-bold tracking-tight">
            Ranked Results
          </h2>
          <span className="text-[11px] text-[#464555] font-medium">
            Ranked by Vector Proximity
          </span>
        </div>

        {results.map(item => (
          <article
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex flex-col gap-2.5 hover:shadow-md transition-all"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#3525cd] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-headline text-[14px] font-bold text-[#131b2e] truncate">
                    {item.name}
                  </h3>
                  <span className="text-[11px] text-[#464555]">{item.date}</span>
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#e9ddff] text-[#23005c] text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                {item.matchScore}
              </span>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#131b2e] font-semibold">
                {item.category}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#e1e0ff] text-[#2f2ebe]">
                {item.badge}
              </span>
              <span className="text-[#464555] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">person</span> {item.author}
              </span>
            </div>

            {/* Excerpt with highlight */}
            <div className="bg-[#f2f3ff] rounded-xl p-3 text-[12px] text-[#131b2e] leading-relaxed border border-[#eaedff]">
              {item.snippet}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-[11px] text-[#464555]">
                <span className="material-symbols-outlined text-[14px] text-[#3525cd]">find_in_page</span>
                <span>{item.matchType}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Bookmarked ${item.name}`, 'bookmark')}
                  className="w-8 h-8 rounded-lg bg-[#f2f3ff] text-[#131b2e] flex items-center justify-center hover:bg-[#eaedff]"
                >
                  <span className="material-symbols-outlined text-[16px]">bookmark_border</span>
                </button>
                <button
                  onClick={() => handleInspect(item)}
                  className="h-8 px-3 rounded-xl bg-[#3525cd] text-white text-[12px] font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                >
                  <span>Inspect</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Batch Compare Cloud Invoices Drawer Banner */}
      <aside className="mx-4 md:px-6 p-4 rounded-2xl bg-[#eaedff] border border-[#c7c4d8]/30 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#8455ef] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">compare</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#131b2e] truncate">
              Batch Compare Cloud Invoices
            </span>
            <span className="text-[11px] text-[#464555] truncate">
              Compare AWS vs GCP line items in single-view
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('document-compare')}
          className="h-8 px-3.5 rounded-xl bg-[#6b38d4] text-white text-[12px] font-semibold flex-shrink-0 active:scale-95 transition-transform"
        >
          Compare
        </button>
      </aside>
    </div>
  );
};

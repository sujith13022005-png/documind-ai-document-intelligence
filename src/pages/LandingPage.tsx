import React, { useState } from 'react';

interface LandingPageProps {
  onNavigateToAuth: (mode?: 'signin' | 'signup') => void;
  onNavigateToApp: (tab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth, onNavigateToApp }) => {
  const [demoActive, setDemoActive] = useState(false);

  const handleTryDemo = () => {
    setDemoActive(true);
    setTimeout(() => {
      onNavigateToApp('dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col selection:bg-[#4f46e5]/20 selection:text-[#3525cd]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#faf8ff]/85 backdrop-blur-md border-b border-[#c7c4d8]/20 h-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3525cd] via-[#4f46e5] to-[#6b38d4] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <span className="font-headline text-[18px] font-bold text-[#3525cd] tracking-tight">
              DocuMind AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToAuth('signin')}
              className="px-4 py-2 text-[13px] font-semibold text-[#464555] hover:text-[#131b2e] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigateToAuth('signup')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#6b38d4] text-white text-[13px] font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 md:px-8">
        {/* Ambient Glow Background Orb */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-[#c3c0ff]/40 via-[#8455ef]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#3525cd] shadow-sm mb-4">
            <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">auto_awesome</span>
            <span className="text-[11px] font-semibold tracking-wide uppercase">
              Next-Gen Document Intelligence
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-[#131b2e] tracking-tight max-w-2xl mb-4 leading-tight">
            Turn Documents into{' '}
            <span className="bg-gradient-to-r from-[#3525cd] via-[#6b38d4] to-[#8455ef] bg-clip-text text-transparent">
              Intelligent
            </span>{' '}
            Information
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] md:text-lg text-[#464555] max-w-xl mb-7 leading-relaxed">
            Upload PDFs, invoices, forms &amp; notes. DocuMind uses Gemini Generative AI to instantly extract key data, answer questions, and summarize content.
          </p>

          {/* CTA Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mb-10">
            <button
              onClick={() => onNavigateToApp('quick-upload')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#6b38d4] text-white font-headline font-semibold text-[15px] shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              <span>Upload Document</span>
            </button>
            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-[#131b2e] font-medium text-[14px] shadow-sm hover:bg-[#f2f3ff] active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#c7c4d8]/40"
            >
              <span className="material-symbols-outlined text-[#6b38d4] text-[18px]">play_circle</span>
              <span>{demoActive ? 'Opening Sandbox...' : 'Try AI Demo'}</span>
            </button>
          </div>

          {/* Live Interactive Demo Bento Card */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4.5 text-left relative overflow-hidden border border-[#c7c4d8]/20 transition-all duration-300">
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6b38d4] to-transparent animate-pulse opacity-75 top-0" />

            {/* Card Header Info */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3525cd]">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <div>
                  <p className="font-headline text-[14px] font-semibold text-[#131b2e] leading-tight">
                    INV-2024-8841.pdf
                  </p>
                  <p className="text-[11px] text-[#464555]">Parsed in 0.42 seconds</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaedff] text-[#6b38d4] text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                99.4% Match
              </span>
            </div>

            {/* Document Preview Miniature */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3.5 bg-[#f2f3ff] border border-[#eaedff]">
              <div className="p-3 bg-white h-full flex flex-col justify-between text-[11px]">
                <div className="flex justify-between border-b pb-1.5 border-slate-100 font-semibold text-slate-800">
                  <span>TAX INVOICE #8841</span>
                  <span className="text-[#3525cd]">APEX SYSTEMS LTD</span>
                </div>
                <div className="space-y-1 text-slate-500 text-[10px]">
                  <div className="flex justify-between">
                    <span>1. Enterprise Cloud Software</span>
                    <span className="font-medium text-slate-700">$10,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Neural Extraction Addon</span>
                    <span className="font-medium text-slate-700">$2,913.05</span>
                  </div>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 font-bold text-[#3525cd]">
                  <span>Total Amount</span>
                  <span>$14,850.00</span>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent flex items-end p-2.5">
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#6b38d4] animate-ping" />
                  <span className="text-[11px] text-[#131b2e] font-medium">Neural Extraction Active</span>
                </div>
              </div>
            </div>

            {/* Key Extracted Entities Bento Table */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                <p className="text-[11px] text-[#464555] mb-0.5">Vendor Name</p>
                <p className="font-headline text-[13px] font-semibold text-[#131b2e] truncate">
                  Apex Systems Ltd
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                <p className="text-[11px] text-[#464555] mb-0.5">Total Amount</p>
                <p className="font-headline text-[14px] font-bold text-[#3525cd]">
                  $14,850.00
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                <p className="text-[11px] text-[#464555] mb-0.5">Issue Date</p>
                <p className="text-[12px] text-[#131b2e]">Oct 24, 2024</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f2f3ff]">
                <p className="text-[11px] text-[#464555] mb-0.5">Tax (VAT 15%)</p>
                <p className="text-[12px] text-[#131b2e]">$1,936.95</p>
              </div>
            </div>

            {/* AI Assistant Mini Chat Prompt */}
            <div className="p-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#6b38d4] text-[18px] shrink-0">
                  neurology
                </span>
                <p className="text-[12px] text-[#131b2e] truncate">
                  "Payment terms are net 30 days due Nov 23."
                </p>
              </div>
              <button
                onClick={() => onNavigateToApp('ai-chat')}
                className="shrink-0 p-1.5 rounded-full bg-white text-[#3525cd] shadow-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Quick Stats */}
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-md md:max-w-2xl mx-auto bg-[#f2f3ff] rounded-2xl p-4 flex items-center justify-around text-center shadow-sm border border-[#eaedff]">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-[#6b38d4] mb-0.5">
              <span className="material-symbols-outlined text-[18px]">star</span>
              <span className="font-headline text-[16px] font-bold text-[#131b2e] ml-1">4.9/5</span>
            </div>
            <p className="text-[11px] text-[#464555]">Customer Rating</p>
          </div>
          <div className="w-px h-8 bg-[#c7c4d8]/40" />
          <div className="flex flex-col items-center">
            <div className="flex items-center text-[#3525cd] mb-0.5">
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span className="font-headline text-[16px] font-bold text-[#131b2e] ml-1">10M+</span>
            </div>
            <p className="text-[11px] text-[#464555]">Pages Analyzed</p>
          </div>
          <div className="w-px h-8 bg-[#c7c4d8]/40" />
          <div className="flex flex-col items-center">
            <div className="flex items-center text-[#8455ef] mb-0.5">
              <span className="material-symbols-outlined text-[18px]">speed</span>
              <span className="font-headline text-[16px] font-bold text-[#131b2e] ml-1">&lt; 1s</span>
            </div>
            <p className="text-[11px] text-[#464555]">Avg Inference</p>
          </div>
        </div>
      </section>

      {/* Supported Documents Types */}
      <section className="w-full flex flex-col mb-12 overflow-hidden px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-[12px] text-[#464555] uppercase tracking-wider font-semibold">
            Supported Document Types
          </h2>
          <span className="text-[11px] text-[#3525cd] font-semibold">9+ formats</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-white shadow-sm text-[13px] text-[#131b2e] flex items-center gap-1.5 border border-[#c7c4d8]/20">
            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">picture_as_pdf</span> PDF Docs
          </span>
          <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-white shadow-sm text-[13px] text-[#131b2e] flex items-center gap-1.5 border border-[#c7c4d8]/20">
            <span className="material-symbols-outlined text-[16px] text-[#3525cd]">receipt</span> Invoices &amp; Bills
          </span>
          <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-white shadow-sm text-[13px] text-[#131b2e] flex items-center gap-1.5 border border-[#c7c4d8]/20">
            <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">image</span> JPG / PNG
          </span>
          <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-white shadow-sm text-[13px] text-[#131b2e] flex items-center gap-1.5 border border-[#c7c4d8]/20">
            <span className="material-symbols-outlined text-[16px] text-[#4f46e5]">article</span> DOCX &amp; RTF
          </span>
          <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-white shadow-sm text-[13px] text-[#131b2e] flex items-center gap-1.5 border border-[#c7c4d8]/20">
            <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">workspace_premium</span> Certificates
          </span>
          <span className="shrink-0 px-3.5 py-1.5 rounded-full bg-white shadow-sm text-[13px] text-[#131b2e] flex items-center gap-1.5 border border-[#c7c4d8]/20">
            <span className="material-symbols-outlined text-[16px] text-[#3525cd]">school</span> Academic Papers
          </span>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 md:px-8 mb-14 max-w-4xl mx-auto w-full">
        <div className="mb-6 text-center md:text-left">
          <span className="px-2.5 py-1 rounded-lg bg-[#e2dfff] text-[#3323cc] text-[11px] font-semibold uppercase">
            Effortless Workflow
          </span>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#131b2e] mt-2">
            How DocuMind Works
          </h2>
          <p className="text-[13px] text-[#464555]">
            From messy document to conversational answers in 3 simple phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Step 1 */}
          <div className="bg-white p-4.5 rounded-2xl shadow-sm flex items-start gap-3.5 border border-[#eaedff]">
            <div className="w-10 h-10 rounded-xl bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">upload_file</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-[15px] font-semibold text-[#131b2e]">
                  1. Upload Any File
                </h3>
                <span className="text-[11px] font-bold text-[#777587]">01</span>
              </div>
              <p className="text-[12px] text-[#464555] leading-relaxed">
                Drag or drop scanned papers, camera snaps, multi-page PDFs, or spreadsheets effortlessly.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-4.5 rounded-2xl shadow-sm flex items-start gap-3.5 border border-[#eaedff]">
            <div className="w-10 h-10 rounded-xl bg-[#6b38d4]/10 text-[#6b38d4] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">cognition</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-[15px] font-semibold text-[#131b2e]">
                  2. AI Analyzes &amp; Indexes
                </h3>
                <span className="text-[11px] font-bold text-[#777587]">02</span>
              </div>
              <p className="text-[12px] text-[#464555] leading-relaxed">
                Our Gemini multimodal OCR reads dense tables, notes, and builds instant semantic summaries.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-4.5 rounded-2xl shadow-sm flex items-start gap-3.5 border border-[#eaedff]">
            <div className="w-10 h-10 rounded-xl bg-[#4f46e5]/10 text-[#4f46e5] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">forum</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-headline text-[15px] font-semibold text-[#131b2e]">
                  3. Chat, Extract &amp; Export
                </h3>
                <span className="text-[11px] font-bold text-[#777587]">03</span>
              </div>
              <p className="text-[12px] text-[#464555] leading-relaxed">
                Ask complex questions, extract structured JSON, or download concise executive briefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supercharged Capabilities Grid */}
      <section className="px-4 md:px-8 mb-14 max-w-4xl mx-auto w-full">
        <div className="mb-6 text-center md:text-left">
          <span className="px-2.5 py-1 rounded-lg bg-[#e9ddff] text-[#5516be] text-[11px] font-semibold uppercase">
            Capabilities
          </span>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#131b2e] mt-2">
            Supercharged Capabilities
          </h2>
          <p className="text-[13px] text-[#464555]">
            Enterprise accuracy packaged for frictionless modern use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 1 */}
          <div className="p-4.5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e2dfff] text-[#3323cc]">
                Multi-Modal
              </span>
            </div>
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-1">
              AI Document Analysis
            </h3>
            <p className="text-[12px] text-[#464555] leading-relaxed">
              Parses layout geometry, nested spreadsheets, charts, and diagrams with comprehensive visual intelligence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4.5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#6b38d4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">document_scanner</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e9ddff] text-[#5516be]">
                99.8% Precision
              </span>
            </div>
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-1">
              Smart OCR Engine
            </h3>
            <p className="text-[12px] text-[#464555] leading-relaxed">
              Deciphers faded scans, complex watermarks, rotated receipts, and multilingual handwriting cleanly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4.5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#4f46e5] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">data_object</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e1e0ff] text-[#2f2ebe]">
                Auto Entities
              </span>
            </div>
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-1">
              Information Extraction
            </h3>
            <p className="text-[12px] text-[#464555] leading-relaxed">
              Instantly recognizes names, IBANs, fiscal totals, dates, expiration flags, and addresses automatically.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-4.5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#6b38d4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">summarize</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e9ddff] text-[#5516be]">
                Executive Briefs
              </span>
            </div>
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-1">
              Document Summarization
            </h3>
            <p className="text-[12px] text-[#464555] leading-relaxed">
              Distills 100-page policy briefs or legal agreements into actionable bullet points in seconds.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-4.5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e2dfff] text-[#3323cc]">
                Natural Chat
              </span>
            </div>
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-1">
              Ask Your Documents
            </h3>
            <p className="text-[12px] text-[#464555] leading-relaxed">
              Converse directly with contracts. Ask "What is the termination clause?" and get cited page references.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-4.5 rounded-2xl bg-white shadow-sm border border-[#eaedff] flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#8455ef] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">saved_search</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e1e0ff] text-[#2f2ebe]">
                Vector Neural
              </span>
            </div>
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-1">
              Intelligent Search
            </h3>
            <p className="text-[12px] text-[#464555] leading-relaxed">
              Find concept overlaps across thousands of archives, even if your exact keywords are not written down.
            </p>
          </div>
        </div>
      </section>

      {/* Built for Every Role */}
      <section className="px-4 md:px-8 mb-14 max-w-4xl mx-auto w-full">
        <h2 className="font-headline text-2xl font-bold text-[#131b2e] mb-1">
          Built for Every Role
        </h2>
        <p className="text-[13px] text-[#464555] mb-5">
          Empowering workflows across academia, corporate, and finance.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white rounded-xl shadow-sm border border-[#eaedff] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3525cd]">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div>
              <p className="font-headline text-[13px] font-bold text-[#131b2e]">Students</p>
              <p className="text-[11px] text-[#464555]">Notes &amp; Research</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl shadow-sm border border-[#eaedff] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#6b38d4]">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div>
              <p className="font-headline text-[13px] font-bold text-[#131b2e]">Colleges</p>
              <p className="text-[11px] text-[#464555]">Thesis &amp; Archives</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl shadow-sm border border-[#eaedff] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#4f46e5]">
              <span className="material-symbols-outlined text-[20px]">business</span>
            </div>
            <div>
              <p className="font-headline text-[13px] font-bold text-[#131b2e]">Businesses</p>
              <p className="text-[11px] text-[#464555]">Operations &amp; Legal</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl shadow-sm border border-[#eaedff] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#8455ef]">
              <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
            </div>
            <div>
              <p className="font-headline text-[13px] font-bold text-[#131b2e]">Offices</p>
              <p className="text-[11px] text-[#464555]">Daily Records</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl shadow-sm border border-[#eaedff] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#6b38d4]">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div>
              <p className="font-headline text-[13px] font-bold text-[#131b2e]">HR Teams</p>
              <p className="text-[11px] text-[#464555]">Resume Screening</p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl shadow-sm border border-[#eaedff] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#3525cd]">
              <span className="material-symbols-outlined text-[20px]">savings</span>
            </div>
            <div>
              <p className="font-headline text-[13px] font-bold text-[#131b2e]">Finance</p>
              <p className="text-[11px] text-[#464555]">Audits &amp; Invoices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section className="px-4 md:px-8 mb-14 max-w-4xl mx-auto w-full">
        <div className="w-full bg-[#283044] text-[#eef0ff] rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#8455ef]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#e1e0ff]">
              <span className="material-symbols-outlined text-[18px]">security</span>
            </div>
            <span className="text-[11px] tracking-wider uppercase text-[#e1e0ff] font-semibold">
              Bank-Level Protection
            </span>
          </div>

          <h3 className="font-headline text-2xl md:text-3xl font-bold mb-2 text-white">
            Enterprise Grade Security
          </h3>
          <p className="text-[13px] text-[#eef0ff]/80 mb-6 max-w-xl leading-relaxed">
            Your data never trains public LLMs. Processed in isolated cryptographic containers with zero persistence retention.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">lock</span>
              <span className="text-[12px] text-white">End-to-End AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">verified_user</span>
              <span className="text-[12px] text-white">SOC-2 Type II &amp; GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">vpn_lock</span>
              <span className="text-[12px] text-white">Dedicated Private Instances</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 md:px-8 mb-12 max-w-2xl mx-auto w-full">
        <div className="bg-gradient-to-br from-white to-[#eaedff] p-7 md:p-9 rounded-2xl shadow-lg border border-[#eaedff] text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#e2dfff] text-[#3525cd] flex items-center justify-center mb-3.5 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-[#131b2e] mb-1.5">
            Start Parsing Free Today
          </h3>
          <p className="text-[13px] text-[#464555] max-w-sm mb-6">
            Experience zero-latency document analysis with Gemini. 50 free pages included, no credit card required.
          </p>
          <button
            onClick={() => onNavigateToApp('quick-upload')}
            className="w-full max-w-xs py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#6b38d4] text-white font-headline text-[15px] font-semibold shadow-md active:scale-95 transition-all"
          >
            Get Started Instantly
          </button>
          <p className="text-[11px] text-[#777587] mt-3">Takes less than 30 seconds to run</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#eaedff] py-8 px-4 text-center flex flex-col items-center bg-white/60">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-[#3525cd] flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[14px]">neurology</span>
          </div>
          <span className="font-headline text-[15px] font-bold text-[#131b2e] tracking-tight">
            DocuMind AI
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mb-3 text-[#464555] text-[12px]">
          <button onClick={() => onNavigateToApp('dashboard')} className="hover:text-[#3525cd]">Dashboard</button>
          <button onClick={() => onNavigateToApp('documents')} className="hover:text-[#3525cd]">Vault</button>
          <button onClick={() => onNavigateToApp('ai-chat')} className="hover:text-[#3525cd]">AI Chat</button>
          <button onClick={() => onNavigateToApp('search-explore')} className="hover:text-[#3525cd]">Search</button>
          <button onClick={() => onNavigateToApp('settings')} className="hover:text-[#3525cd]">Settings</button>
        </div>
        <p className="text-[11px] text-[#777587]">
          © 2025 DocuMind AI Technologies, Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

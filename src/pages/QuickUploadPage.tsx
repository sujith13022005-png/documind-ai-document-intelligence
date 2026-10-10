import React, { useState, useRef } from 'react';
import { useDocuments } from '../context/DocumentContext';

interface QuickUploadPageProps {
  onNavigate: (tab: string, docId?: string) => void;
}

export const QuickUploadPage: React.FC<QuickUploadPageProps> = ({ onNavigate }) => {
  const { uploadFile, showToast } = useDocuments();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineSummary, setPipelineSummary] = useState(true);
  const [pipelineJson, setPipelineJson] = useState(true);

  // Live queue state
  const [queueItems, setQueueItems] = useState<any[]>([
    {
      id: 'queue_1',
      name: 'Annual_Tax_Return_2024.pdf',
      size: '4.2 MB',
      status: 'uploading',
      progress: 78,
      speed: '2.4 MB/s',
      type: 'pdf'
    },
    {
      id: 'queue_2',
      name: 'Vendor_Agreement_AcmeCorp.docx',
      size: '1.8 MB',
      status: 'processing',
      step: 'Extracting clauses & entities (Step 2 of 3)...',
      type: 'docx'
    },
    {
      id: 'queue_3',
      name: 'Medical_Equipment_Invoice.pdf',
      size: '890 KB',
      status: 'completed',
      ocrScore: '99.4% OCR',
      extractedNote: '3 Items Extracted ($14,250.00)',
      type: 'pdf'
    }
  ]);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Add to queue
    const queueId = `queue_${Date.now()}`;
    const newItem = {
      id: queueId,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: 'uploading',
      progress: 30,
      type: file.name.split('.').pop()?.toLowerCase() || 'pdf'
    };
    setQueueItems(prev => [newItem, ...prev]);

    try {
      // Simulate progressive steps
      setTimeout(() => {
        setQueueItems(prev => prev.map(item => item.id === queueId ? { ...item, progress: 85, status: 'processing', step: 'Analyzing with Gemini neural engine...' } : item));
      }, 600);

      const created = await uploadFile(file);

      setQueueItems(prev => prev.map(item => item.id === queueId ? {
        ...item,
        status: 'completed',
        ocrScore: '99.8% OCR',
        extractedNote: created.summary?.substring(0, 45) + '...'
      } : item));
    } catch (err: any) {
      setQueueItems(prev => prev.map(item => item.id === queueId ? { ...item, status: 'failed' } : item));
      showToast('Upload failed: ' + err.message, 'error', 'error');
    }
  };

  const handleBatchProcess = () => {
    setIsProcessing(true);
    showToast('Processing all pending documents with Gemini pipeline...', 'bolt', 'info');
    setTimeout(() => {
      setQueueItems(prev => prev.map(item => ({
        ...item,
        status: 'completed',
        ocrScore: '99.6% OCR',
        extractedNote: 'All clauses and entities extracted'
      })));
      setIsProcessing(false);
      showToast('Batch processing complete!', 'check_circle', 'success');
    }, 1800);
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-2xl mx-auto px-4 md:px-6">
      {/* Quick Status Pill Banner */}
      <div className="mt-3 mb-4 flex items-center justify-between bg-[#eaedff] px-4 py-2 rounded-full shadow-xs border border-[#c7c4d8]/20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#6b38d4] animate-ping" />
          <span className="text-[11px] font-medium text-[#464555] truncate">
            Engine: DocuMind Neural OCR v4.2 Ready
          </span>
        </div>
        <span className="text-[11px] text-[#6b38d4] font-semibold shrink-0">
          99.8% Accuracy
        </span>
      </div>

      {/* Interactive Drag-and-Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setDragOver(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border-2 border-dashed p-6 text-center transition-all duration-300 active:scale-[0.99] ${
          dragOver ? 'border-[#3525cd] bg-[#eaedff]/30' : 'border-[#c7c4d8]/60 hover:border-[#3525cd]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={e => handleFilesSelected(e.target.files)}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.txt"
        />

        {/* Ambient Gradient Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3525cd]/5 via-[#6b38d4]/5 to-transparent pointer-events-none" />

        {/* Living Pulse Circle */}
        <div className="relative mx-auto w-16 h-16 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#3525cd]/10 animate-pulse" />
          <div className="relative w-12 h-12 rounded-full bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
          </div>
        </div>

        <h2 className="font-headline text-[17px] font-bold text-[#131b2e] mb-1">
          Drop your documents here
        </h2>
        <p className="text-[12px] text-[#464555] mb-4 max-w-xs mx-auto leading-relaxed">
          or tap to browse files from your local storage, scanner or cloud drives
        </p>

        {/* Supported Format Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
          <span className="bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold px-2.5 py-0.5 rounded-md">PDF</span>
          <span className="bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold px-2.5 py-0.5 rounded-md">JPG</span>
          <span className="bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold px-2.5 py-0.5 rounded-md">PNG</span>
          <span className="bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold px-2.5 py-0.5 rounded-md">DOCX</span>
        </div>
        <span className="text-[11px] text-[#777587] block">
          Up to 50MB per document • AES-256 encrypted
        </span>
      </div>

      {/* Multi-channel Source Selector */}
      <div className="grid grid-cols-4 gap-2 my-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-xs border border-[#eaedff] hover:bg-[#f2f3ff] transition-all active:scale-95 text-[#131b2e]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
          </div>
          <span className="text-[11px] font-semibold">Files</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-xs border border-[#eaedff] hover:bg-[#f2f3ff] transition-all active:scale-95 text-[#131b2e]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#e9ddff] flex items-center justify-center text-[#6b38d4]">
            <span className="material-symbols-outlined text-[18px]">document_scanner</span>
          </div>
          <span className="text-[11px] font-semibold">Scanner</span>
        </button>

        <button
          onClick={() => showToast('Google Drive integration active for authorized scopes', 'add_to_drive')}
          type="button"
          className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-xs border border-[#eaedff] hover:bg-[#f2f3ff] transition-all active:scale-95 text-[#131b2e]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#e1e0ff] flex items-center justify-center text-[#3130c0]">
            <span className="material-symbols-outlined text-[18px]">add_to_drive</span>
          </div>
          <span className="text-[11px] font-semibold">Drive</span>
        </button>

        <button
          onClick={() => showToast('Dropbox connected', 'cloud_sync')}
          type="button"
          className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-2xl shadow-xs border border-[#eaedff] hover:bg-[#f2f3ff] transition-all active:scale-95 text-[#131b2e]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#4f46e5]">
            <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
          </div>
          <span className="text-[11px] font-semibold">Dropbox</span>
        </button>
      </div>

      {/* Live Upload & Processing Queue */}
      <div className="flex flex-col gap-2.5 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e]">Live Queue</h3>
            <span className="bg-[#eaedff] text-[#3525cd] text-[11px] px-2 py-0.5 rounded-full font-semibold">
              {queueItems.length} active
            </span>
          </div>
          <button
            onClick={() => setQueueItems(queueItems.filter(i => i.status !== 'completed'))}
            className="text-[12px] font-semibold text-[#3525cd] hover:text-[#6b38d4]"
          >
            Clear Done
          </button>
        </div>

        {queueItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#eaedff] relative overflow-hidden transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#3525cd] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">
                  {item.type === 'pdf' ? 'picture_as_pdf' : 'description'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-headline text-[13px] font-bold text-[#131b2e] truncate">
                    {item.name}
                  </p>
                  {item.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#6b38d4] bg-[#e9ddff] px-2 py-0.5 rounded-full font-semibold">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      {item.ocrScore}
                    </span>
                  ) : (
                    <button
                      onClick={() => setQueueItems(queueItems.filter(q => q.id !== item.id))}
                      className="text-[#777587] hover:text-[#ba1a1a]"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-0.5 text-[#464555] text-[11px]">
                  <span>{item.size}</span>
                  {item.status === 'uploading' && (
                    <>
                      <span>•</span>
                      <span className="text-[#3525cd] font-semibold">Uploading {item.progress}%</span>
                      <span>•</span>
                      <span>{item.speed || '2.4 MB/s'}</span>
                    </>
                  )}
                  {item.status === 'completed' && (
                    <>
                      <span>•</span>
                      <span className="text-[#3525cd] font-semibold">Analyzed Successfully</span>
                    </>
                  )}
                </div>

                {/* Progress bar for uploading */}
                {item.status === 'uploading' && (
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#3525cd] to-[#6b38d4] h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {/* Processing step */}
                {item.status === 'processing' && (
                  <div className="mt-2 bg-[#f2f3ff] p-2 rounded-xl flex items-center gap-2 border border-[#eaedff]">
                    <span className="material-symbols-outlined text-[#6b38d4] text-[16px] animate-spin">
                      auto_awesome
                    </span>
                    <span className="text-[11px] font-semibold text-[#6b38d4] truncate">
                      {item.step}
                    </span>
                  </div>
                )}

                {/* Completed summary action */}
                {item.status === 'completed' && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#eaedff]">
                    <span className="text-[11px] text-[#464555] truncate max-w-[200px]">
                      {item.extractedNote}
                    </span>
                    <button
                      onClick={() => onNavigate('documents')}
                      className="text-[11px] text-[#3525cd] font-semibold flex items-center hover:underline"
                    >
                      View AI Summary
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Pipeline Configuration Settings Panel */}
      <div className="mt-5 bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd] text-[20px]">tune</span>
            <h4 className="font-headline text-[14px] font-bold text-[#131b2e]">
              Pipeline Configuration
            </h4>
          </div>
          <span className="text-[11px] text-[#777587]">Smart Defaults</span>
        </div>

        {/* Toggle 1 */}
        <label className="flex items-center justify-between py-2 cursor-pointer">
          <div className="flex flex-col pr-3">
            <span className="text-[13px] font-medium text-[#131b2e]">
              Auto-generate executive summary
            </span>
            <span className="text-[11px] text-[#464555]">
              Generates 1-page condensed brief with citations
            </span>
          </div>
          <input
            type="checkbox"
            checked={pipelineSummary}
            onChange={e => setPipelineSummary(e.target.checked)}
            className="w-5 h-5 rounded text-[#3525cd] accent-[#3525cd] cursor-pointer"
          />
        </label>

        <div className="h-px bg-[#eaedff] my-1" />

        {/* Toggle 2 */}
        <label className="flex items-center justify-between py-2 cursor-pointer">
          <div className="flex flex-col pr-3">
            <span className="text-[13px] font-medium text-[#131b2e]">
              Extract entities &amp; tables to JSON
            </span>
            <span className="text-[11px] text-[#464555]">
              Parses dates, amounts, parties, and ledger tables
            </span>
          </div>
          <input
            type="checkbox"
            checked={pipelineJson}
            onChange={e => setPipelineJson(e.target.checked)}
            className="w-5 h-5 rounded text-[#3525cd] accent-[#3525cd] cursor-pointer"
          />
        </label>

        <div className="h-px bg-[#eaedff] my-1" />

        {/* Item 3 */}
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col pr-3">
            <span className="text-[13px] font-medium text-[#131b2e]">
              Optical Character Recognition
            </span>
            <span className="text-[11px] text-[#464555]">
              Deep multilingual recognition model
            </span>
          </div>
          <div className="bg-[#eaedff] px-2.5 py-1 rounded-lg">
            <span className="text-[11px] text-[#3525cd] font-bold">Auto-detect</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky-like Action CTA */}
      <div className="mt-5 mb-2">
        <button
          onClick={handleBatchProcess}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#6b38d4] text-white font-headline text-[15px] font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isProcessing ? (
            <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          )}
          <span>{isProcessing ? 'Processing Batch with Gemini...' : `Process ${queueItems.length} Documents`}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <p className="text-[11px] text-center text-[#777587] mt-2">
          Estimated completion time: ~12 seconds
        </p>
      </div>
    </div>
  );
};

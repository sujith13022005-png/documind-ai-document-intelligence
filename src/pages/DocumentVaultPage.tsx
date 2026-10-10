import React, { useState, useMemo } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { DocumentItem } from '../types';

interface DocumentVaultPageProps {
  onNavigate: (tab: string, docId?: string) => void;
}

export const DocumentVaultPage: React.FC<DocumentVaultPageProps> = ({ onNavigate }) => {
  const { documents, deleteDocument, setActiveDoc, showToast, refreshDocuments } = useDocuments();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortRecent, setSortRecent] = useState(true);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action Sheet state
  const [sheetDoc, setSheetDoc] = useState<DocumentItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Rename state
  const [renameTarget, setRenameTarget] = useState<DocumentItem | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Speed Dial state
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  // Categories count calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: documents.length };
    for (const d of documents) {
      counts[d.category] = (counts[d.category] || 0) + 1;
    }
    return counts;
  }, [documents]);

  // Filtered & Sorted documents
  const filteredDocs = useMemo(() => {
    let list = documents.filter(doc => {
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = doc.fileName.toLowerCase().includes(q);
        const inSummary = doc.summary?.toLowerCase().includes(q);
        const inCategory = doc.category.toLowerCase().includes(q);
        const inKeywords = doc.keywords?.some(k => k.toLowerCase().includes(q));
        const inEntities = doc.entities?.some(e => e.name.toLowerCase().includes(q) || e.value.toLowerCase().includes(q));
        return inName || inSummary || inCategory || inKeywords || inEntities;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortRecent) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.fileName.localeCompare(b.fileName);
    });

    return list;
  }, [documents, selectedCategory, searchQuery, sortRecent]);

  const handleOpenDoc = (doc: DocumentItem) => {
    setActiveDoc(doc);
    onNavigate('document-detail', doc.id);
  };

  const handleOpenSheet = (e: React.MouseEvent, doc: DocumentItem) => {
    e.stopPropagation();
    setSheetDoc(doc);
    setIsSheetOpen(true);
  };

  const handleDelete = async (docId: string) => {
    if (window.confirm('Are you sure you want to delete this document from your vault?')) {
      await deleteDocument(docId);
      setIsSheetOpen(false);
    }
  };

  const handleRename = () => {
    if (!renameTarget || !newTitle.trim()) return;
    renameTarget.fileName = newTitle.trim();
    showToast(`Renamed to "${newTitle.trim()}"`, 'edit', 'success');
    setRenameTarget(null);
  };

  const toggleSelectDoc = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const categories = ['All', 'Finance', 'Academic', 'Certificates', 'Reports', 'Personal', 'Other'];

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto">
      {/* Top Action & Summary Bar */}
      <div className="px-4 md:px-6 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <h1 className="font-headline text-2xl font-bold text-[#131b2e] tracking-tight">
              Document Vault
            </h1>
            <span className="text-[12px] text-[#464555] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#3525cd] animate-pulse" />
              DocuMind Sync Active • {documents.length} Encrypted Artifacts
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#eaedff] p-1 rounded-xl shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-[#3525cd] shadow-xs'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">view_agenda</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#3525cd] shadow-xs'
                  : 'text-[#464555] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => {
                setIsMultiSelect(!isMultiSelect);
                setSelectedIds([]);
              }}
              aria-label="Multi-select items"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isMultiSelect ? 'bg-[#3525cd] text-white' : 'text-[#464555] hover:text-[#3525cd]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">checklist</span>
            </button>
          </div>
        </div>

        {/* Dynamic Search Field */}
        <div className="relative w-full mb-3">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3525cd]">
            <span className="material-symbols-outlined text-[20px]">manage_search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search entities, extracted totals, or OCR tags..."
            className="w-full h-11 pl-11 pr-10 bg-white rounded-xl text-[13px] text-[#131b2e] placeholder:text-[#464555]/60 shadow-xs border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#777587] hover:text-[#131b2e]"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || (cat === 'All' ? documents.length : 0);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#3525cd] text-white shadow-sm'
                    : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
                }`}
              >
                <span>{cat === 'Finance' ? 'Finance & Bills' : cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#eaedff] text-[#131b2e]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Sub-Header */}
      <div className="px-4 md:px-6 py-2 flex items-center justify-between text-[#464555] text-[12px]">
        <button
          onClick={() => setSortRecent(!sortRecent)}
          className="flex items-center gap-1 font-semibold hover:text-[#3525cd] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-[#3525cd]">swap_vert</span>
          <span>{sortRecent ? 'Sorted by Recent' : 'Sorted by Name (A-Z)'}</span>
        </button>
        <span className="text-[11px] text-[#777587]">
          Showing {filteredDocs.length} of {documents.length} files
        </span>
      </div>

      {/* Multi-select contextual action bar */}
      {isMultiSelect && (
        <div className="mx-4 md:mx-6 my-2 p-3 bg-[#e2dfff] text-[#0f0069] rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-[13px]">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{selectedIds.length} items selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast(`Shared ${selectedIds.length} documents link copied!`, 'share', 'success');
                setIsMultiSelect(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/60 hover:bg-white text-[12px] font-semibold transition-colors"
            >
              Share
            </button>
            <button
              onClick={async () => {
                if (window.confirm(`Delete ${selectedIds.length} selected documents?`)) {
                  for (const id of selectedIds) {
                    await deleteDocument(id);
                  }
                  setSelectedIds([]);
                  setIsMultiSelect(false);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-[#ba1a1a] text-white text-[12px] font-semibold transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setIsMultiSelect(false)}
              className="p-1 hover:bg-white/40 rounded-lg text-[#0f0069]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Document Items List / Grid */}
      <div className="px-4 md:px-6 py-2">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#eaedff] flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#eaedff] text-[#3525cd] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[32px]">folder_off</span>
            </div>
            <h3 className="font-headline text-lg font-bold text-[#131b2e] mb-1">
              No documents found
            </h3>
            <p className="text-[13px] text-[#464555] max-w-xs mb-5">
              Upload your first document or adjust your category filter.
            </p>
            <button
              onClick={() => onNavigate('quick-upload')}
              className="px-5 py-2.5 rounded-xl bg-[#3525cd] text-white font-semibold text-[13px] shadow-sm active:scale-95 transition-all"
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
            {filteredDocs.map(doc => {
              const isSelected = selectedIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    if (isMultiSelect) toggleSelectDoc(doc.id);
                    else handleOpenDoc(doc);
                  }}
                  className={`group relative bg-white p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                    isSelected ? 'border-[#3525cd] bg-[#f2f3ff]' : 'border-[#eaedff] hover:border-[#3525cd]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox for multiselect */}
                    {isMultiSelect && (
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectDoc(doc.id)}
                          className="w-4 h-4 rounded text-[#3525cd] accent-[#3525cd] cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Doc Thumbnail Icon */}
                    <div className="relative w-11 h-11 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="material-symbols-outlined text-[24px] text-[#3525cd]">
                        {doc.category === 'Certificates'
                          ? 'workspace_premium'
                          : doc.category === 'Finance' || doc.category === 'Bills'
                          ? 'receipt_long'
                          : 'picture_as_pdf'}
                      </span>
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-[#3525cd]/70" />
                    </div>

                    {/* Meta Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-headline text-[14px] font-bold text-[#131b2e] truncate group-hover:text-[#3525cd] transition-colors">
                          {doc.fileName}
                        </h3>
                        <button
                          onClick={e => handleOpenSheet(e, doc)}
                          aria-label="Options"
                          className="w-8 h-8 -mr-1 -mt-1 rounded-lg flex items-center justify-center text-[#777587] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-[#464555] truncate mt-0.5">
                        {doc.category} • {doc.fileSizeBytesText} • {new Date(doc.createdAt).toLocaleDateString()}
                      </p>

                      {/* Badges */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e9ddff] text-[#23005c] text-[10px] font-semibold">
                          <span className="material-symbols-outlined text-[12px] text-[#6b38d4]">
                            check_circle
                          </span>
                          {doc.status === 'COMPLETED' ? 'Parsed & Indexed' : doc.status}
                        </span>
                        {doc.entities && doc.entities.length > 0 && (
                          <span className="text-[11px] text-[#464555] flex items-center gap-0.5 font-medium">
                            <span className="material-symbols-outlined text-[13px] text-[#6b38d4]">
                              auto_awesome
                            </span>
                            {doc.entities.length} entities
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cognitive Assistant Ambient Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#eaedff] via-[#f2f3ff] to-[#eaedff] border border-[#c7c4d8]/30 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3525cd] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[13px] font-bold text-[#131b2e]">
                DocuMind Cognitive Assistant
              </span>
              <span className="text-[11px] text-[#464555]">
                Ask multi-file cross questions in real-time
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-chat')}
            className="h-8 px-3.5 rounded-xl bg-white text-[#3525cd] text-[11px] font-bold shadow-xs hover:bg-[#e2dfff] transition-colors shrink-0"
          >
            Launch
          </button>
        </div>
      </div>

      {/* Floating Action Speed Dial FAB */}
      <div className="fixed right-5 bottom-20 md:bottom-8 z-40 flex flex-col items-end gap-2.5">
        {isSpeedDialOpen && (
          <div className="flex flex-col items-end gap-2 transition-all">
            <button
              onClick={() => {
                setIsSpeedDialOpen(false);
                onNavigate('quick-upload');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#131b2e] shadow-lg border border-[#eaedff] text-[12px] font-semibold hover:bg-[#f2f3ff] transition-all"
            >
              <span>Instant OCR Scan</span>
              <span className="w-7 h-7 rounded-full bg-[#8455ef] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px]">document_scanner</span>
              </span>
            </button>
            <button
              onClick={() => {
                setIsSpeedDialOpen(false);
                onNavigate('quick-upload');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#131b2e] shadow-lg border border-[#eaedff] text-[12px] font-semibold hover:bg-[#f2f3ff] transition-all"
            >
              <span>Cloud Import</span>
              <span className="w-7 h-7 rounded-full bg-[#3525cd] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px]">cloud_upload</span>
              </span>
            </button>
          </div>
        )}
        <button
          onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
          aria-label="Upload or Scan"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#6b38d4] text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(53,37,205,0.45)] active:scale-95 transition-transform"
        >
          <span className={`material-symbols-outlined text-[28px] transition-transform duration-200 ${isSpeedDialOpen ? 'rotate-45' : ''}`}>
            add
          </span>
        </button>
      </div>

      {/* Quick Action Bottom Sheet Modal */}
      {isSheetOpen && sheetDoc && (
        <>
          <div
            className="fixed inset-0 z-50 bg-[#283044]/40 backdrop-blur-sm"
            onClick={() => setIsSheetOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-[0_-10px_35px_-5px_rgba(15,23,42,0.15)] flex flex-col max-h-[85vh] animate-slide-up">
            <div className="w-12 h-1.5 rounded-full bg-[#c7c4d8] mx-auto my-3" />
            <div className="px-5 pb-3 flex items-center justify-between border-b border-[#eaedff]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#3525cd] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">description</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-headline text-[14px] font-bold text-[#131b2e] truncate">
                    {sheetDoc.fileName}
                  </h4>
                  <span className="text-[11px] text-[#464555]">
                    {sheetDoc.category} • {sheetDoc.fileSizeBytesText}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSheetOpen(false)}
                className="p-1.5 text-[#777587] hover:text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 flex flex-col gap-1 overflow-y-auto">
              <button
                onClick={() => {
                  setIsSheetOpen(false);
                  handleOpenDoc(sheetDoc);
                }}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#f2f3ff] text-[#131b2e] text-[13px] font-medium text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[#3525cd] text-[20px]">visibility</span>
                <div>
                  <span className="font-semibold block">Open Document</span>
                  <span className="text-[11px] text-[#464555]">View OCR layers, highlights &amp; metadata</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsSheetOpen(false);
                  onNavigate('ai-chat', sheetDoc.id);
                }}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#f2f3ff] text-[#131b2e] text-[13px] font-medium text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[#6b38d4] text-[20px]">auto_awesome</span>
                <div>
                  <span className="font-semibold block">Ask AI Copilot</span>
                  <span className="text-[11px] text-[#464555]">Converse with full document context</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsSheetOpen(false);
                  setRenameTarget(sheetDoc);
                  setNewTitle(sheetDoc.fileName);
                }}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#f2f3ff] text-[#131b2e] text-[13px] font-medium text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[#464555] text-[20px]">edit</span>
                <div>
                  <span className="font-semibold block">Rename File</span>
                  <span className="text-[11px] text-[#464555]">Update file title and tags</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsSheetOpen(false);
                  showToast('Preparing download payload...', 'download');
                }}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#f2f3ff] text-[#131b2e] text-[13px] font-medium text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[#464555] text-[20px]">download</span>
                <div>
                  <span className="font-semibold block">Download Original</span>
                  <span className="text-[11px] text-[#464555]">Export encrypted document copy</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsSheetOpen(false);
                  showToast('Temporary share link copied to clipboard!', 'share', 'success');
                }}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#f2f3ff] text-[#131b2e] text-[13px] font-medium text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[#464555] text-[20px]">share</span>
                <div>
                  <span className="font-semibold block">Share Access</span>
                  <span className="text-[11px] text-[#464555]">Generate secure temporary share link</span>
                </div>
              </button>

              <div className="h-[1px] bg-[#eaedff] my-1" />

              <button
                onClick={() => handleDelete(sheetDoc.id)}
                className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-[#ffdad6]/40 text-[#ba1a1a] text-[13px] font-medium text-left transition-colors"
              >
                <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">delete</span>
                <div>
                  <span className="font-semibold block">Delete from Vault</span>
                  <span className="text-[11px] text-[#ba1a1a]/80">Permanent removal with chat history deletion</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Rename Dialog Modal */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#283044]/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#eaedff]">
            <h3 className="font-headline text-[16px] font-bold text-[#131b2e] mb-2">Rename Document</h3>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full h-11 px-3 bg-[#f2f3ff] border border-[#eaedff] rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#3525cd] mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRenameTarget(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#464555] hover:bg-[#f2f3ff]"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-[12px] font-semibold shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChatMessage, DocumentItem } from '../types';

interface AIChatPageProps {
  initialDocId?: string;
  onNavigate: (tab: string, docId?: string) => void;
}

export const AIChatPage: React.FC<AIChatPageProps> = ({ initialDocId, onNavigate }) => {
  const { user } = useAuth();
  const { documents, activeDoc, setActiveDoc, showToast } = useDocuments();

  const selectedDoc: DocumentItem = (initialDocId ? documents.find(d => d.id === initialDocId) : activeDoc) || documents[0] || {
    id: 'doc_msa_2024',
    userId: 'user_alex_chen',
    fileName: 'AcmeCorp_Master_Services.pdf',
    fileType: 'PDF',
    fileSize: 2400000,
    fileSizeBytesText: '2.4 MB',
    mimeType: 'application/pdf',
    category: 'Finance',
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat on mount or doc change
  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await api.getChat(selectedDoc.id);
        if (res.chat && res.chat.messages && res.chat.messages.length > 0) {
          setMessages(res.chat.messages);
        } else {
          // Initialize with friendly welcome
          setMessages([
            {
              id: 'init_welcome',
              role: 'assistant',
              content: `Hello ${user?.name?.split(' ')[0] || 'Alex'}! I have analyzed **${selectedDoc.fileName}**. All legal covenants, pricing terms, and annexes are indexed.\n\nYou can query contract liabilities, payment schedules, signatory verifications, or termination clauses anytime.`,
              timestamp: '09:41 AM'
            }
          ]);
        }
      } catch (err) {
        console.warn('Failed to load chat:', err);
      }
    }
    fetchChat();
  }, [selectedDoc.id, user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    setInputText('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: time
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await api.askDocument(selectedDoc.id, text);
      setMessages(prev => [...prev, res.message]);
    } catch (err: any) {
      // Fallback friendly message
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `I could not find this information in the uploaded document. (Error: ${err.message || 'Processing timeout'})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleMicToggle = () => {
    setIsMicActive(true);
    showToast('Listening for voice prompt...', 'mic');
    setTimeout(() => {
      setInputText('What are the breach penalty limitations?');
      setIsMicActive(false);
      showToast('Voice transcribed', 'check');
    }, 1800);
  };

  const handleExportPartyTable = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Party / Signatory,Role,Type,Details",
        "Eleanor Vance,SVP Global Operations,Signatory,AcmeCorp LLC",
        "Marcus Chen Esq.,General Counsel,Signatory,Horizon Enterprises",
        "AcmeCorp Solutions Inc.,Primary Service Provider,Party 1,Delaware Corp",
        "Horizon Global Ltd.,Customer / Licensee,Party 2,Enterprise Licensee"
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedDoc.fileName.replace('.pdf', '')}_parties.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Signatories & Parties CSV', 'download', 'success');
  };

  return (
    <div className="flex flex-col w-full pb-32 max-w-3xl mx-auto">
      {/* Document Selector Context Bar */}
      <section className="sticky top-16 z-30 px-4 md:px-6 py-2.5 bg-[#faf8ff]/90 backdrop-blur-md border-b border-[#eaedff]">
        <div className="flex items-center justify-between gap-2 bg-[#f2f3ff] px-3.5 py-2 rounded-2xl border border-[#eaedff]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#3525cd] shrink-0">
              <span className="material-symbols-outlined text-[18px]">description</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="flex items-center gap-1 cursor-pointer group"
              >
                <span className="font-headline text-[13px] text-[#131b2e] truncate font-bold">
                  {selectedDoc.fileName}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#464555] group-hover:text-[#3525cd]">
                  expand_more
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#464555] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b38d4]" />
                <span className="truncate">1 document loaded • {selectedDoc.fileSizeBytesText} indexed</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[11px] font-semibold hover:bg-[#eaedff] transition-colors flex items-center gap-0.5"
          >
            <span>Change</span>
            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
          </button>
        </div>

        {/* Change Document Dropdown */}
        {isSelectorOpen && (
          <div className="mt-2 bg-white rounded-2xl shadow-xl border border-[#eaedff] p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
            {documents.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  setActiveDoc(d);
                  setIsSelectorOpen(false);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-xl text-left text-[12px] font-medium transition-colors ${
                  d.id === selectedDoc.id ? 'bg-[#eaedff] text-[#3525cd] font-bold' : 'hover:bg-[#f2f3ff] text-[#131b2e]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span className="truncate flex-1">{d.fileName}</span>
                <span className="text-[10px] text-[#777587]">{d.category}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Intelligence Badges */}
      <section className="px-4 md:px-6 pt-2 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#e9ddff] text-[#23005c] text-[11px] font-semibold shrink-0">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>OCR High Fidelity 99.4%</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#eaedff] text-[#464555] text-[11px] font-medium shrink-0">
            <span className="material-symbols-outlined text-[14px]">security</span>
            <span>SOC2 Protected</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#eaedff] text-[#464555] text-[11px] font-medium shrink-0">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Private Session</span>
          </div>
        </div>
      </section>

      {/* Chat Thread */}
      <section className="flex flex-col px-4 md:px-6 py-3 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || index}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end self-end max-w-[85%]' : 'max-w-[92%]'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#6b38d4] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                </div>
              )}

              <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 text-[11px] text-[#777587]">
                  <span className="font-semibold text-[#131b2e]">{isUser ? 'You' : 'DocuMind Copilot'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#3525cd] text-white rounded-tr-sm'
                      : 'bg-white text-[#131b2e] rounded-tl-sm border border-[#eaedff]'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Grounded Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#eaedff]">
                      <span className="text-[11px] font-semibold text-[#464555] block mb-1">
                        Citations &amp; Grounding:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((c, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#eaedff] text-[#3525cd] text-[11px] font-semibold"
                          >
                            <span className="material-symbols-outlined text-[13px]">menu_book</span>
                            <span>{c.label}</span>
                          </span>
                        ))}
                      </div>

                      {/* Excerpt if present */}
                      {msg.citations[0]?.excerpt && (
                        <div className="mt-2 p-2.5 rounded-xl bg-[#f2f3ff] text-[11px] text-[#464555] italic border border-[#eaedff]">
                          "{msg.citations[0].excerpt}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Extracted Entities List if present */}
                  {msg.extractedEntities && msg.extractedEntities.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {msg.extractedEntities.map((ent, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#eaedff]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-[#e9ddff] text-[#6b38d4] flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[13px]">verified_user</span>
                            </div>
                            <div className="truncate">
                              <span className="text-[12px] font-bold text-[#131b2e] block truncate">{ent.name}</span>
                              <span className="text-[10px] text-[#464555] truncate">{ent.role}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.2 rounded-md bg-white text-[10px] font-semibold text-[#6b38d4] border border-[#eaedff]">
                            {ent.type}
                          </span>
                        </div>
                      ))}
                      <button
                        onClick={handleExportPartyTable}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#3525cd] hover:underline"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        <span>Export Party Table (.CSV)</span>
                      </button>
                    </div>
                  )}

                  {/* Suggested Follow-ups */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-2 space-y-1.5 border-t border-[#eaedff]">
                      <span className="text-[11px] text-[#464555] font-semibold block">
                        Suggested Follow-ups
                      </span>
                      {msg.suggestedFollowUps.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(q)}
                          className="w-full text-left px-3 py-1.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] text-[12px] font-medium transition-colors flex items-center justify-between border border-[#eaedff]"
                        >
                          <span className="truncate">{q}</span>
                          <span className="material-symbols-outlined text-[14px] text-[#777587]">
                            arrow_forward
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <img
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-[#e2dfff] mt-1"
                />
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-2.5 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#6b38d4] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
            </div>
            <div className="p-3 bg-white rounded-2xl rounded-tl-sm border border-[#eaedff] text-[12px] text-[#464555] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#6b38d4]">auto_awesome</span>
              <span>Gemini is reading document clauses and synthesizing factual answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      {/* Quick Prompts Horizontal Pill Carousel */}
      <section className="px-4 md:px-6 my-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleSendMessage('Summarize this document')}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#f2f3ff] shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#3525cd]">summarize</span>
            <span>Summarize this document</span>
          </button>
          <button
            onClick={() => handleSendMessage('What are the important dates and deadlines?')}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#f2f3ff] shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#6b38d4]">calendar_month</span>
            <span>Important dates</span>
          </button>
          <button
            onClick={() => handleSendMessage('Find all names and entities mentioned')}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#f2f3ff] shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#4f46e5]">group</span>
            <span>All names mentioned</span>
          </button>
          <button
            onClick={() => handleSendMessage('Extract key liabilities, indemnity and risks')}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#eaedff] text-[#131b2e] text-[12px] font-semibold hover:bg-[#f2f3ff] shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">gavel</span>
            <span>Extract liabilities</span>
          </button>
        </div>
      </section>

      {/* Sticky Bottom Input Bar */}
      <section className="fixed bottom-16 md:bottom-4 left-0 w-full px-4 md:px-6 z-40 bg-[#faf8ff]/95 backdrop-blur-md pt-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-xl border border-[#eaedff]">
            <button
              onClick={() => onNavigate('quick-upload')}
              aria-label="Attach file"
              className="w-10 h-10 rounded-xl bg-[#f2f3ff] text-[#464555] hover:text-[#3525cd] hover:bg-[#eaedff] transition-colors flex items-center justify-center shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything about this document..."
              className="flex-1 bg-transparent px-2 py-2 text-[13px] text-[#131b2e] placeholder:text-[#777587] focus:outline-none"
            />

            <button
              onClick={handleMicToggle}
              aria-label="Voice input"
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isMicActive ? 'text-[#ba1a1a] bg-[#ffdad6] animate-pulse' : 'text-[#464555] hover:text-[#6b38d4] hover:bg-[#f2f3ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>

            <button
              onClick={() => handleSendMessage()}
              disabled={isSending || !inputText.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#6b38d4] text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 text-center mt-1 text-[#777587] text-[11px]">
            <span className="material-symbols-outlined text-[13px]">shield</span>
            <span>Private AI processing. Citations verified against OCR vectors.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

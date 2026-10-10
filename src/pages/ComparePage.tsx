import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { api } from '../services/api';

export const ComparePage: React.FC = () => {
  const { documents, showToast } = useDocuments();

  const [docAId, setDocAId] = useState<string>(documents[0]?.id || '');
  const [docBId, setDocBId] = useState<string>(documents[1]?.id || documents[0]?.id || '');
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  const handleCompare = async () => {
    setIsComparing(true);
    showToast('Gemini is cross-referencing clauses and values...', 'difference', 'info');

    try {
      const res = await api.compareDocuments({ docAId, docBId });
      setComparisonResult(res.comparison);
      showToast('Comparison report ready', 'check_circle', 'success');
    } catch (err: any) {
      showToast('Comparison failed: ' + err.message, 'error', 'error');
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto px-4 md:px-6">
      <div className="pt-4 pb-2">
        <h1 className="font-headline text-2xl font-bold text-[#131b2e]">
          Document Comparison
        </h1>
        <p className="text-[13px] text-[#464555] mt-0.5">
          Select two documents to identify added clauses, modified pricing terms, and timeline differences.
        </p>
      </div>

      {/* Selectors Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-bold text-[#131b2e] block mb-1.5">
              Document A (Base Version)
            </label>
            <select
              value={docAId}
              onChange={e => setDocAId(e.target.value)}
              className="w-full h-11 px-3 bg-[#f2f3ff] rounded-xl text-[13px] font-medium border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>
                  {d.fileName} ({d.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#131b2e] block mb-1.5">
              Document B (Revised Version)
            </label>
            <select
              value={docBId}
              onChange={e => setDocBId(e.target.value)}
              className="w-full h-11 px-3 bg-[#f2f3ff] rounded-xl text-[13px] font-medium border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>
                  {d.fileName} ({d.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={isComparing}
          className="mt-4 w-full h-11 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#6b38d4] text-white font-headline text-[14px] font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isComparing ? (
            <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">difference</span>
          )}
          <span>{isComparing ? 'Analyzing Differences with Gemini...' : 'Run Differential Analysis'}</span>
        </button>
      </div>

      {/* Results */}
      {comparisonResult ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Summary Box */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff]">
            <div className="flex items-center gap-2 mb-2 text-[#3525cd]">
              <span className="material-symbols-outlined text-[22px]">insights</span>
              <h3 className="font-headline text-[16px] font-bold text-[#131b2e]">Executive Differential Summary</h3>
            </div>
            <p className="text-[13px] text-[#464555] leading-relaxed">
              {comparisonResult.summary}
            </p>
          </div>

          {/* Changed Values */}
          {comparisonResult.changedValues && comparisonResult.changedValues.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff]">
              <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6b38d4] text-[20px]">tune</span>
                <span>Changed Monetary &amp; Quantitative Values</span>
              </h3>
              <div className="flex flex-col gap-2">
                {comparisonResult.changedValues.map((cv: any, i: number) => (
                  <div key={i} className="p-3 bg-[#f2f3ff] rounded-xl flex items-center justify-between border border-[#eaedff]">
                    <div>
                      <span className="text-[12px] font-bold text-[#131b2e] block">{cv.field}</span>
                      <span className="text-[11px] text-[#464555]">
                        Before: <del className="text-[#ba1a1a]">{cv.before}</del> → After: <strong className="text-[#3525cd]">{cv.after}</strong>
                      </span>
                    </div>
                    {cv.changeType && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#e9ddff] text-[#23005c] text-[10px] font-semibold">
                        {cv.changeType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Added & Removed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4.5 shadow-sm border border-[#eaedff]">
              <h4 className="font-headline text-[14px] font-bold text-[#3525cd] mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Added Clauses (in Doc B)</span>
              </h4>
              <ul className="space-y-2">
                {(comparisonResult.addedInformation || []).map((item: string, i: number) => (
                  <li key={i} className="text-[12px] text-[#131b2e] flex items-start gap-2 bg-[#f2f3ff] p-2.5 rounded-xl border border-[#eaedff]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-4.5 shadow-sm border border-[#eaedff]">
              <h4 className="font-headline text-[14px] font-bold text-[#ba1a1a] mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                <span>Removed Clauses (from Doc A)</span>
              </h4>
              <ul className="space-y-2">
                {(comparisonResult.removedInformation || []).map((item: string, i: number) => (
                  <li key={i} className="text-[12px] text-[#131b2e] flex items-start gap-2 bg-[#ffdad6]/40 p-2.5 rounded-xl border border-[#ba1a1a]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#eaedff] flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-[#eaedff] text-[#3525cd] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[24px]">difference</span>
          </div>
          <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-1">
            Compare Revisions &amp; Contracts
          </h3>
          <p className="text-[12px] text-[#464555] max-w-sm mb-4">
            Select two versions above to detect changes in liabilities, payment schedules, and dates.
          </p>
          <button
            onClick={handleCompare}
            className="px-5 py-2.5 rounded-xl bg-[#3525cd] text-white text-[13px] font-semibold"
          >
            Run Demo Comparison
          </button>
        </div>
      )}
    </div>
  );
};

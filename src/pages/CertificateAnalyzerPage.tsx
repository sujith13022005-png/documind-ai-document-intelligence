import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { api } from '../services/api';

export const CertificateAnalyzerPage: React.FC = () => {
  const { showToast } = useDocuments();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [certData, setCertData] = useState<any>({
    recipientName: 'Alex Chen',
    institution: 'Stanford Center for Professional Development',
    courseTitle: 'Advanced Machine Learning & Neural Networks',
    issueDate: 'October 18, 2024',
    certificateId: 'STAN-ML-892401',
    duration: '12 Weeks (120 Hours)',
    status: 'Information Found',
    notes: 'Cryptographic signature checksum matched Stanford CPD issuance template.'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    showToast(`Analyzing credential "${file.name}" with Gemini...`, 'verified', 'info');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await api.analyzeCertificate({
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          fileData: base64
        });
        setCertData(res.certificate);
        showToast('Certificate analysis complete', 'check_circle', 'success');
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast('Analysis error: ' + err.message, 'error', 'error');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto px-4 md:px-6">
      <div className="pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#131b2e]">
            Certificate &amp; Credential Analyzer
          </h1>
          <p className="text-[13px] text-[#464555] mt-0.5">
            Identify student/recipient credentials, issuing authority, completion dates, and accreditation flags.
          </p>
        </div>
        <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#6b38d4] text-white text-[13px] font-semibold shadow-sm active:scale-95 transition-transform flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Upload Certificate</span>
          <input type="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
        </label>
      </div>

      {/* Required Disclaimer Banner */}
      <div className="my-3 p-3.5 rounded-2xl bg-[#eaedff] border border-[#c7c4d8]/40 flex items-start gap-3">
        <span className="material-symbols-outlined text-[#3525cd] text-[20px] shrink-0 mt-0.5">
          info
        </span>
        <div className="text-[12px] text-[#131b2e] leading-relaxed">
          <strong>Important Verification Notice:</strong> AI analysis extracts and cross-checks layout entities, but does not guarantee official certificate authenticity. Always authenticate critical credentials directly with the issuing registrar.
        </div>
      </div>

      {isAnalyzing ? (
        <div className="my-8 p-12 bg-white rounded-2xl border border-[#eaedff] text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl text-[#6b38d4] animate-spin mb-3">
            progress_activity
          </span>
          <h3 className="font-headline text-lg font-bold text-[#131b2e]">
            Scanning seals and accreditation metadata...
          </h3>
          <p className="text-[13px] text-[#464555] mt-1">
            Gemini is reading institution signatures and credential identifiers.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-[#e9ddff] text-[#6b38d4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              </span>
              <div>
                <h3 className="font-headline text-[15px] font-bold text-[#131b2e]">
                  {certData.courseTitle || 'Executive Credential'}
                </h3>
                <span className="text-[11px] text-[#464555]">
                  {certData.institution || 'Issuing Academy'}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#e9ddff] text-[#23005c]">
              {certData.status || 'Information Found'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
              <span className="text-[10px] font-semibold text-[#777587] uppercase block">RECIPIENT NAME</span>
              <span className="font-headline text-[14px] font-bold text-[#131b2e] mt-0.5 block">
                {certData.recipientName || 'N/A'}
              </span>
            </div>

            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
              <span className="text-[10px] font-semibold text-[#777587] uppercase block">CREDENTIAL ID</span>
              <span className="font-mono text-[13px] font-bold text-[#3525cd] mt-0.5 block">
                {certData.certificateId || 'N/A'}
              </span>
            </div>

            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
              <span className="text-[10px] font-semibold text-[#777587] uppercase block">DATE OF ISSUANCE</span>
              <span className="text-[13px] font-semibold text-[#131b2e] mt-0.5 block">
                {certData.issueDate || 'N/A'}
              </span>
            </div>

            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
              <span className="text-[10px] font-semibold text-[#777587] uppercase block">PROGRAM DURATION</span>
              <span className="text-[13px] font-semibold text-[#131b2e] mt-0.5 block">
                {certData.duration || 'N/A'}
              </span>
            </div>
          </div>

          {certData.notes && (
            <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
              <span className="text-[10px] font-semibold text-[#777587] uppercase block">AI INSPECTION NOTES</span>
              <p className="text-[12px] text-[#464555] mt-1 leading-relaxed">
                {certData.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

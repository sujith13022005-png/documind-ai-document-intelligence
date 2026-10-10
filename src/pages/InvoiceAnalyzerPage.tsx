import React, { useState } from 'react';
import { useDocuments } from '../context/DocumentContext';
import { api } from '../services/api';

export const InvoiceAnalyzerPage: React.FC = () => {
  const { showToast } = useDocuments();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>({
    invoiceNumber: 'INV-2024-8841',
    vendorName: 'Apex Systems Ltd',
    customerName: 'Globetech Enterprise Inc.',
    invoiceDate: 'Oct 24, 2024',
    dueDate: 'Nov 23, 2024',
    items: [
      { description: 'Enterprise Cloud Software Licenses (50 seats)', quantity: 50, unitPrice: 200, amount: 10000 },
      { description: 'Dedicated Neural Processing Cluster S3', quantity: 1, unitPrice: 2913.05, amount: 2913.05 }
    ],
    subtotal: 12913.05,
    tax: 1936.95,
    discount: 0,
    total: 14850.0,
    currency: 'USD',
    paymentTerms: 'Net 30 days',
    verificationStatus: 'verified'
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    showToast(`Parsing invoice "${file.name}" with Gemini...`, 'receipt_long', 'info');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await api.extractInvoice({
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          fileData: base64
        });
        setInvoiceData(res.invoice);
        showToast('Invoice parsed successfully', 'check_circle', 'success');
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast('Extraction failed: ' + err.message, 'error', 'error');
      setIsAnalyzing(false);
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ["Item Description", "Quantity", "Unit Price", "Amount"],
      ...(invoiceData.items || []).map((i: any) => [
        `"${i.description}"`, i.quantity, i.unitPrice, i.amount
      ]),
      ["", "", "Subtotal", invoiceData.subtotal],
      ["", "", "Tax (15%)", invoiceData.tax],
      ["", "", "Total Due", invoiceData.total]
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `${invoiceData.invoiceNumber || 'Invoice'}_line_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported invoice CSV', 'download', 'success');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto px-4 md:px-6">
      <div className="pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#131b2e]">
            Invoice &amp; Bill Analyzer
          </h1>
          <p className="text-[13px] text-[#464555] mt-0.5">
            Extract itemized ledger tables, tax calculations, and vendor metadata with neural OCR.
          </p>
        </div>
        <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#6b38d4] text-white text-[13px] font-semibold shadow-sm active:scale-95 transition-transform flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Upload Invoice</span>
          <input type="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
        </label>
      </div>

      {isAnalyzing ? (
        <div className="my-8 p-12 bg-white rounded-2xl border border-[#eaedff] text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl text-[#3525cd] animate-spin mb-3">
            progress_activity
          </span>
          <h3 className="font-headline text-lg font-bold text-[#131b2e]">
            Gemini is reading invoice lines...
          </h3>
          <p className="text-[13px] text-[#464555] mt-1">
            Reconciling item quantity, subtotal math, and VAT allocations.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-3">
          {/* Status & Export Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
              <span className="text-[13px] font-bold text-[#131b2e]">
                {invoiceData.verificationStatus === 'verified' ? 'Extraction Verified' : 'Needs Verification'}
              </span>
              <span className="text-[11px] text-[#464555]">
                (AI extraction does not substitute formal audits)
              </span>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-[#eaedff] text-[#3525cd] text-[12px] font-semibold hover:bg-[#e2dfff] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export CSV</span>
            </button>
          </div>

          {/* Invoice Header Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff]">
              <span className="text-[11px] font-semibold text-[#777587] block">INVOICE NUMBER</span>
              <span className="font-headline text-[15px] font-bold text-[#131b2e] mt-1 block">
                {invoiceData.invoiceNumber || 'N/A'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff]">
              <span className="text-[11px] font-semibold text-[#777587] block">VENDOR</span>
              <span className="font-headline text-[14px] font-bold text-[#131b2e] mt-1 block truncate">
                {invoiceData.vendorName || 'N/A'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff]">
              <span className="text-[11px] font-semibold text-[#777587] block">ISSUE DATE</span>
              <span className="font-headline text-[14px] font-bold text-[#131b2e] mt-1 block">
                {invoiceData.invoiceDate || 'N/A'}
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#eaedff]">
              <span className="text-[11px] font-semibold text-[#777587] block">PAYMENT DUE</span>
              <span className="font-headline text-[14px] font-bold text-[#ba1a1a] mt-1 block">
                {invoiceData.dueDate || 'N/A'}
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] overflow-hidden">
            <div className="p-4 border-b border-[#eaedff] flex items-center justify-between bg-[#f2f3ff]">
              <h3 className="font-headline text-[14px] font-bold text-[#131b2e]">
                Itemized Line Breakdown
              </h3>
              <span className="text-[11px] font-semibold text-[#464555]">
                {(invoiceData.items || []).length} items detected
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-white text-[#777587] border-b border-[#eaedff] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-center">Qty</th>
                    <th className="p-3.5 text-right">Unit Price</th>
                    <th className="p-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {(invoiceData.items || []).map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#f2f3ff]/50">
                      <td className="p-3.5 font-medium text-[#131b2e]">{item.description}</td>
                      <td className="p-3.5 text-center text-[#464555]">{item.quantity}</td>
                      <td className="p-3.5 text-right text-[#464555]">${Number(item.unitPrice).toFixed(2)}</td>
                      <td className="p-3.5 text-right font-bold text-[#131b2e]">${Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Footer */}
            <div className="p-4 bg-[#f2f3ff] border-t border-[#eaedff] flex justify-end">
              <div className="w-64 space-y-1.5 text-[12px]">
                <div className="flex justify-between text-[#464555]">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${Number(invoiceData.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#464555]">
                  <span>Tax / VAT:</span>
                  <span className="font-semibold">${Number(invoiceData.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#eaedff] font-headline text-[16px] font-bold text-[#3525cd]">
                  <span>Total Due:</span>
                  <span>${Number(invoiceData.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

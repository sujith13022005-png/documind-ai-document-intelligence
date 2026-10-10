import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useDocuments();

  const [name, setName] = useState(user?.name || 'Alex Chen');
  const [email, setEmail] = useState(user?.email || 'alex.chen@documind.ai');
  const [notifySummary, setNotifySummary] = useState(true);
  const [notifyDeadline, setNotifyDeadline] = useState(true);
  const [encryptionAudit, setEncryptionAudit] = useState(true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email });
      showToast('Profile settings saved successfully', 'check', 'success');
    } catch (err: any) {
      showToast('Failed to save profile: ' + err.message, 'error', 'error');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to permanently delete your DocuMind account? All encrypted documents will be destroyed.')) {
      logout();
      window.location.hash = '#landing';
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-3xl mx-auto px-4 md:px-6">
      <div className="pt-4 pb-2">
        <h1 className="font-headline text-2xl font-bold text-[#131b2e]">
          Settings &amp; Preferences
        </h1>
        <p className="text-[13px] text-[#464555] mt-0.5">
          Manage your workspace profile, security credentials, and AI engine preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] my-4">
        <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3525cd] text-[20px]">person</span>
          <span>Profile Information</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="text-[12px] font-semibold text-[#131b2e] block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-11 px-3 bg-[#f2f3ff] rounded-xl text-[13px] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#131b2e] block mb-1">Work Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-11 px-3 bg-[#f2f3ff] rounded-xl text-[13px] border border-[#eaedff] focus:outline-none focus:ring-2 focus:ring-[#3525cd]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-[12px] font-semibold shadow-xs hover:bg-[#4f46e5] transition-all"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] mb-4 space-y-3">
        <h3 className="font-headline text-[15px] font-bold text-[#131b2e] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#6b38d4] text-[20px]">notifications</span>
          <span>Notification Preferences</span>
        </h3>

        <label className="flex items-center justify-between py-1 cursor-pointer">
          <div>
            <span className="text-[13px] font-medium text-[#131b2e] block">Summary Ready Alerts</span>
            <span className="text-[11px] text-[#464555]">Notify when document analysis finishes</span>
          </div>
          <input
            type="checkbox"
            checked={notifySummary}
            onChange={e => setNotifySummary(e.target.checked)}
            className="w-5 h-5 rounded text-[#3525cd] accent-[#3525cd] cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between py-1 cursor-pointer">
          <div>
            <span className="text-[13px] font-medium text-[#131b2e] block">Critical Renewal Deadlines</span>
            <span className="text-[11px] text-[#464555]">Proactive alerts for 60-day notice windows</span>
          </div>
          <input
            type="checkbox"
            checked={notifyDeadline}
            onChange={e => setNotifyDeadline(e.target.checked)}
            className="w-5 h-5 rounded text-[#3525cd] accent-[#3525cd] cursor-pointer"
          />
        </label>
      </div>

      {/* Security & System Status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eaedff] mb-4 space-y-3">
        <h3 className="font-headline text-[15px] font-bold text-[#131b2e] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3130c0] text-[20px]">security</span>
          <span>Security &amp; Encryption</span>
        </h3>

        <div className="p-3 bg-[#f2f3ff] rounded-xl flex items-center justify-between border border-[#eaedff]">
          <div>
            <span className="text-[12px] font-bold text-[#131b2e] block">AES-256 Vault Encryption</span>
            <span className="text-[11px] text-[#464555]">Cryptographic retention active at rest and in transit</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#e9ddff] text-[#23005c] text-[10px] font-bold">
            Enforced
          </span>
        </div>

        <div className="p-3 bg-[#f2f3ff] rounded-xl flex items-center justify-between border border-[#eaedff]">
          <div>
            <span className="text-[12px] font-bold text-[#131b2e] block">Gemini AI Engine Status</span>
            <span className="text-[11px] text-[#464555]">Server-side gemini-3.8-flash integration</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#3525cd] text-[10px] font-bold">
            Active
          </span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ffdad6] space-y-3">
        <h3 className="font-headline text-[15px] font-bold text-[#ba1a1a] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">warning</span>
          <span>Danger Zone</span>
        </h3>
        <p className="text-[12px] text-[#464555]">
          Permanently delete your user profile, documents, OCR indexes, and conversation history.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white text-[12px] font-semibold hover:bg-[#93000a] transition-all"
        >
          Delete Account &amp; Vault
        </button>
      </div>
    </div>
  );
};

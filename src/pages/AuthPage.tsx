import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onSuccess,
  onBackToLanding,
}) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex.chen@documind.ai');
  const [password, setPassword] = useState('DocuMindSecure2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await login('alex.chen@documind.ai', 'google_sso_verified');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Decorative backdrop orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-[#e2dfff]/40 via-[#e9ddff]/30 to-[#4d44e3]/10 blur-3xl pointer-events-none -translate-y-24" />

      {/* Back to Home Button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-[13px] font-semibold text-[#464555] hover:text-[#3525cd] transition-colors bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#eaedff] shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to Home</span>
      </button>

      {/* Brand Emblem & Welcome Header */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2 mb-6">
        <div className="relative mb-3 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#4f46e5] via-[#6b38d4] to-[#4b4dd8] rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2.5 border border-[#eaedff]">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#3525cd] via-[#4f46e5] to-[#6b38d4] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
            </div>
          </div>
        </div>

        <h1 className="font-headline text-3xl font-bold text-[#131b2e] tracking-tight mb-1">
          DocuMind <span className="bg-gradient-to-r from-[#3525cd] to-[#6b38d4] bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="text-[14px] text-[#464555] max-w-xs transition-all duration-300">
          {mode === 'signin' ? 'Welcome back to your intelligent workspace' : 'Start extracting intelligence in seconds'}
        </p>
      </div>

      {/* Authentication Capsule Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-5 border border-[#eaedff] flex flex-col gap-4">
        {/* Segmented Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#eaedff] rounded-xl select-none">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white text-[#3525cd] shadow-sm'
                : 'text-[#464555] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-white text-[#3525cd] shadow-sm'
                : 'text-[#464555] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Create Account</span>
          </button>
        </div>

        {/* Google One-Tap Action */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full h-11 bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-3 px-4 shadow-sm border border-[#eaedff] group"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
            <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.4 7.34 24 12 24z" fill="#34A853" />
            <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
            <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.6 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
          </svg>
          <span className="text-[13px] font-semibold text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
            Continue with Google
          </span>
        </button>

        {/* Visual Semantic Divider */}
        <div className="relative flex items-center justify-center my-0.5">
          <div className="w-full h-px bg-[#eaedff]" />
          <span className="absolute px-3 bg-white text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
            or continue with email
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#ffdad6]/60 border border-[#ba1a1a]/20 rounded-xl text-[12px] text-[#ba1a1a] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credential Entry Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#131b2e]" htmlFor="fullname">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#777587] text-[18px] pointer-events-none">
                  badge
                </span>
                <input
                  id="fullname"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Chen"
                  className="w-full h-11 pl-10 pr-3 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all border border-transparent focus:border-[#3525cd]"
                />
              </div>
            </div>
          )}

          {/* Work Email Input */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-semibold text-[#131b2e]" htmlFor="email">
                Work Email
              </label>
              <span className="text-[10px] text-[#6b38d4] font-semibold">Domain Verified</span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#777587] text-[18px] pointer-events-none">
                mail
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex.chen@documind.ai"
                className="w-full h-11 pl-10 pr-3 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all border border-transparent focus:border-[#3525cd]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-semibold text-[#131b2e]" htmlFor="password">
                Password
              </label>
              {mode === 'signup' && (
                <span className="text-[10px] text-[#777587]">Min. 8 characters</span>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#777587] text-[18px] pointer-events-none">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all border border-transparent focus:border-[#3525cd]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-[#777587] hover:text-[#131b2e] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Recovery and Remember Me */}
          {mode === 'signin' && (
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3525cd] accent-[#3525cd] cursor-pointer"
                />
                <span className="text-[12px] text-[#464555]">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link dispatched to verified email address.')}
                className="text-[12px] font-semibold text-[#3525cd] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-11 rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#3525cd] to-[#6b38d4] text-white font-headline text-[14px] font-semibold tracking-wide shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Authenticating Session...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Free Workspace'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Multi-Factor Trust Badge */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-center text-[#777587]">
          <span className="material-symbols-outlined text-[15px] text-[#3525cd]">verified_user</span>
          <span className="text-[11px]">256-bit SSL encrypted • SSO &amp; MFA ready</span>
        </div>
      </div>

      {/* Footer Switcher */}
      <div className="relative z-10 mt-5 text-center">
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setErrorMsg('');
          }}
          className="inline-flex items-center gap-1 text-[13px] text-[#464555] hover:text-[#131b2e] transition-colors"
        >
          <span>{mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}</span>
          <span className="font-semibold text-[#3525cd] underline underline-offset-4">
            {mode === 'signin' ? 'Start 14-day free trial' : 'Sign in to workspace'}
          </span>
        </button>
      </div>

      {/* Cognitive Engine Teaser Pill */}
      <div className="relative z-10 mt-6 mx-auto w-full max-w-xs p-2.5 rounded-xl bg-[#eaedff]/70 backdrop-blur-md flex items-center justify-between border border-[#c7c4d8]/30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#e9ddff] flex items-center justify-center text-[#23005c]">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-semibold text-[#131b2e]">Cognitive Engine 4.2</span>
            <span className="text-[10px] text-[#464555]">99.8% Document Accuracy</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-semibold text-[#6b38d4] shadow-xs">
          Active
        </span>
      </div>
    </div>
  );
};

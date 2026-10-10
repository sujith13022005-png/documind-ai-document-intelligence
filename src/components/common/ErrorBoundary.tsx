import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DocuMind Uncaught Error:', error, errorInfo);
  }

  public handleClearError = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[32px]">warning</span>
          </div>
          <h2 className="font-headline text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-[14px] text-[#464555] max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected issue occurred while rendering the document interface. The system has safely recovered.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleClearError}
              className="px-5 py-2.5 rounded-xl bg-[#3525cd] text-white text-[13px] font-semibold shadow-md hover:bg-[#4f46e5] active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Clear Error &amp; Return to Dashboard</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('documind_token');
                window.location.reload();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#3525cd] text-[13px] font-semibold hover:bg-[#d0bcff] transition-all"
            >
              Reset Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

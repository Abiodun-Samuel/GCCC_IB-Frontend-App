import HomepageComponentCard from '@/components/common/HomepageComponentCard';
import $api from '@/lib/axios';
import { Toast } from '@/lib/toastify';
import { handleApiError } from '@/utils/helper';
import { Component } from 'react';

const BugIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.9 2 10 2.9 10 4V5H8C6.9 5 6 5.9 6 7V9H4V11H6V13H4V15H6V17C6 18.1 6.9 19 8 19H10V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V19H16C17.1 19 18 18.1 18 17V15H20V13H18V11H20V9H18V7C18 5.9 17.1 5 16 5H14V4C14 2.9 13.1 2 12 2ZM12 4C12.55 4 13 4.45 13 5H11C11 4.45 11.45 4 12 4ZM8 7H16V17H8V7ZM10 9V15H14V9H10Z" fill="currentColor" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C11.5 2.5 12.9 2.95 14 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 6L14 2L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 19V12H12V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
    }

    componentDidCatch(error, errorInfo) {
        const isDev = import.meta.env.DEV;

        this.setState({
            error,
            errorInfo
        });

        if (!isDev) {
            this.logErrorToService(error, errorInfo);
        }
    }

    logErrorToService = async (error, errorInfo) => {
        try {
            const { data } = await $api.post(`/client-errors`, {
                message: error.toString(),
                stack: error.stack,
                componentStack: errorInfo?.componentStack,
                errorId: this.state.errorId,
                url: window.location.href,
                userAgent: navigator.userAgent
            });
            Toast.success(data?.message)
        } catch (error) {
            const errorDetails = handleApiError(error);
            Toast.error(errorDetails.message || 'Error: unable to log error');
        }
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null
        });
    };

    handleRefresh = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            const isDev = import.meta.env.DEV;
            const { error, errorInfo, errorId } = this.state;

            return (
                <HomepageComponentCard>
                    <div className="flex items-center justify-center p-3 sm:p-4">
                        <div className="max-w-2xl w-full">
                            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">

                                {/* Compact Header */}
                                <div className="relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 opacity-90"></div>
                                    <div className="relative px-4 py-5 sm:p-6 text-white text-center">
                                        <h1 className="text-xl sm:text-2xl font-bold mb-1.5">
                                            {isDev ? 'Development Error' : 'Something Went Wrong'}
                                        </h1>
                                        <p className="text-white/90 text-xs sm:text-sm">
                                            {isDev
                                                ? 'Error details below'
                                                : "We've been notified and are looking into it"}
                                        </p>
                                    </div>
                                </div>

                                {/* Compact Content */}
                                <div className="p-4 sm:p-6">
                                    {isDev ? (
                                        // DEV MODE - Compact
                                        <div className="space-y-3">
                                            <div className="bg-red-500/10 rounded-xl p-3 sm:p-4 border border-red-500/30">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0 border border-red-500/30">
                                                        <BugIcon />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-red-300 mb-2 text-sm">Error Message</h3>
                                                        <p className="text-red-200 font-mono text-xs break-words bg-slate-900/50 p-2.5 rounded-lg border border-red-500/20">
                                                            {error?.toString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {error?.stack && (
                                                <details className="group bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600/50">
                                                    <summary className="cursor-pointer p-3 text-sm font-medium text-slate-200 hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                                                        <span>Stack Trace</span>
                                                        <span className="text-slate-400 group-open:rotate-90 transition-transform text-xs">▶</span>
                                                    </summary>
                                                    <div className="px-3 pb-3">
                                                        <pre className="p-2.5 text-[10px] sm:text-xs overflow-x-auto bg-slate-900/80 text-green-300 rounded-lg whitespace-pre-wrap break-words font-mono border border-slate-700 max-h-40 overflow-y-auto">
                                                            {error.stack}
                                                        </pre>
                                                    </div>
                                                </details>
                                            )}

                                            {errorInfo?.componentStack && (
                                                <details className="group bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600/50">
                                                    <summary className="cursor-pointer p-3 text-sm font-medium text-slate-200 hover:bg-slate-700/50 transition-colors flex items-center justify-between">
                                                        <span>Component Stack</span>
                                                        <span className="text-slate-400 group-open:rotate-90 transition-transform text-xs">▶</span>
                                                    </summary>
                                                    <div className="px-3 pb-3">
                                                        <pre className="p-2.5 text-[10px] sm:text-xs overflow-x-auto bg-slate-900/80 text-blue-300 rounded-lg whitespace-pre-wrap break-words font-mono border border-slate-700 max-h-40 overflow-y-auto">
                                                            {errorInfo.componentStack}
                                                        </pre>
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    ) : (
                                        // PROD MODE - Compact
                                        <div className="space-y-3">
                                            <div className="bg-slate-700/20 rounded-xl p-3 border border-slate-600/50">
                                                <div className="space-y-2">
                                                    {[
                                                        { icon: '🔄', text: 'Refresh and try again' },
                                                        { icon: '🧹', text: 'Clear browser cache' },
                                                        { icon: '🏠', text: 'Return to home' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2.5 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50 text-xs sm:text-sm">
                                                            <span className="text-lg">{item.icon}</span>
                                                            <span className="text-slate-200">{item.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-purple-500/10 rounded-xl p-3 text-center border border-purple-500/30">
                                                <p className="text-slate-300 text-xs mb-2">
                                                    Error ID for support:
                                                </p>
                                                <div className="inline-block bg-slate-800/80 px-3 py-1.5 rounded-lg border border-purple-500/30">
                                                    <code className="text-purple-300 font-mono text-[10px] sm:text-xs">{errorId}</code>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Compact Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-slate-700/50">
                                        {isDev && (
                                            <button
                                                onClick={this.handleReset}
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                <RefreshIcon />
                                                Try Again
                                            </button>
                                        )}
                                        <button
                                            onClick={this.handleRefresh}
                                            className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            <RefreshIcon />
                                            Reload
                                        </button>
                                        <button
                                            onClick={this.handleGoHome}
                                            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            <HomeIcon />
                                            Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </HomepageComponentCard>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
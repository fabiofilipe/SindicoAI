import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ErrorPageProps {
    error: Error | null
    errorInfo: React.ErrorInfo | null
    resetError?: () => void
}

const ErrorPage = ({ error, errorInfo, resetError }: ErrorPageProps) => {
    const navigate = useNavigate()
    const isDevelopment = import.meta.env.DEV

    const handleReload = () => {
        if (resetError) {
            resetError()
        }
        window.location.reload()
    }

    const handleGoHome = () => {
        if (resetError) {
            resetError()
        }
        navigate('/home')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Error Card */}
                <div className="bg-slate-800/80 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(251,146,60,0.15)]">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/60 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(251,146,60,0.3)]">
                            <AlertTriangle size={56} className="text-orange-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                        Ops! Algo deu errado
                    </h1>

                    {/* Message */}
                    <p className="text-center text-gray-300 text-lg mb-8 leading-relaxed">
                        Encontramos um problema inesperado. Não se preocupe, já estamos trabalhando para resolver.
                    </p>

                    {/* Error Details (Development Only) */}
                    {isDevelopment && error && (
                        <div className="mb-6 p-5 bg-slate-900/80 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
                            <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <AlertTriangle size={16} />
                                Detalhes do Erro (Modo Desenvolvimento)
                            </h3>
                            <p className="text-red-400 text-sm font-mono mb-3 break-words">{error.toString()}</p>
                            {errorInfo && (
                                <details className="mt-3">
                                    <summary className="cursor-pointer text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                                        Ver Stack Trace →
                                    </summary>
                                    <pre className="mt-3 text-xs text-gray-400 overflow-x-auto p-4 bg-slate-950/60 rounded-lg border border-cyan-500/10 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-slate-900">
                                        {errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleReload}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_25px_rgba(251,146,60,0.4)] hover:shadow-[0_0_35px_rgba(251,146,60,0.6)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <RefreshCw size={22} />
                            Recarregar Página
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-gray-200 border border-orange-500/30 hover:border-orange-500/50 active:scale-95 transition-all duration-300 py-4 px-8 rounded-xl flex items-center justify-center gap-3 font-semibold backdrop-blur-sm"
                        >
                            <Home size={22} />
                            Ir para Home
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                        <p className="text-center text-gray-500 text-sm">
                            Se o problema persistir, entre em contato com a administração do condomínio.
                        </p>
                    </div>
                </div>

                {/* Decorative Tech Elements */}
                <div className="mt-6 text-center space-y-2">
                    <div className="flex justify-center gap-2 text-orange-500/20 text-xs font-mono">
                        <span>■</span>
                        <span>▲</span>
                        <span>●</span>
                    </div>
                    <p className="text-gray-700 font-mono text-xs tracking-widest">
                        SISTEMA_RECUPERACAO_ATIVO
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage

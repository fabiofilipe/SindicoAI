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
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-coal via-coal-light to-coal flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Error Card */}
                <div className="bg-coal-light border border-red-500/30 rounded-xl p-8 shadow-[0_0_50px_rgba(255,0,85,0.15)]">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center animate-pulse">
                            <AlertTriangle size={48} className="text-red-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        Sistema Indisponível
                    </h1>

                    {/* Message */}
                    <p className="text-center text-metal-silver text-lg mb-8">
                        Ocorreu um erro inesperado no sistema. Nossa equipe foi notificada e está trabalhando para resolver o problema.
                    </p>

                    {/* Error Details (Development Only) */}
                    {isDevelopment && error && (
                        <div className="mb-6 p-4 bg-coal rounded-lg border border-cyan-glow/20">
                            <h3 className="text-cyan font-bold mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Detalhes do Erro (Dev Mode)
                            </h3>
                            <p className="text-red-400 text-sm font-mono mb-2">{error.toString()}</p>
                            {errorInfo && (
                                <details className="mt-3">
                                    <summary className="cursor-pointer text-metal-silver hover:text-cyan text-sm">
                                        Stack Trace
                                    </summary>
                                    <pre className="mt-2 text-xs text-metal-silver overflow-x-auto p-3 bg-coal-light rounded border border-cyan-glow/10">
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
                            className="flex-1 bg-gradient-cyber text-coal font-bold py-4 px-6 rounded-lg shadow-glow hover:shadow-glow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={20} />
                            Tentar Novamente
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="flex-1 bg-transparent text-cyan border border-cyan hover:bg-cyan/10 active:scale-95 transition-all duration-300 py-4 px-6 rounded-lg flex items-center justify-center gap-2 font-semibold"
                        >
                            <Home size={20} />
                            Voltar ao Dashboard
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-metal-silver/50 text-sm mt-6">
                        Se o problema persistir, entre em contato com o suporte técnico.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="mt-8 text-center">
                    <p className="text-cyan-glow/30 font-mono text-xs">
                        ERROR_BOUNDARY_ACTIVE :: SYSTEM_RECOVERY_MODE
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage

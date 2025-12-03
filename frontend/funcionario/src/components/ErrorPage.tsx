import { AlertTriangle, RefreshCcw, ArrowLeft } from 'lucide-react'
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

    const handleGoBack = () => {
        if (resetError) {
            resetError()
        }
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-coal via-coal-dark to-coal flex items-center justify-center p-6 font-mono">
            <div className="max-w-3xl w-full">
                {/* Terminal-style Error Card */}
                <div className="bg-coal-dark border-2 border-neon-cyan/40 rounded-sm shadow-[0_0_40px_rgba(0,240,255,0.2)]">
                    {/* Terminal Header */}
                    <div className="bg-coal-light border-b-2 border-neon-cyan/40 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <span className="text-neon-cyan text-sm uppercase tracking-wider">ERRO DO SISTEMA</span>
                        </div>
                        <span className="text-metal-silver/50 text-xs">
                            {new Date().toLocaleTimeString('pt-BR')}
                        </span>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-neon-cyan/50 rounded-sm flex items-center justify-center animate-pulse">
                                    <AlertTriangle size={48} className="text-neon-cyan" strokeWidth={1.5} />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-cyan rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Main Message */}
                        <div className="text-center mb-8">
                            <div className="text-neon-cyan text-xs mb-2 tracking-widest">{'>'} ERRO_DETECTADO</div>
                            <h1 className="text-3xl font-bold text-neon-cyan mb-3 uppercase tracking-wide">
                                SISTEMA INDISPONÍVEL
                            </h1>
                            <p className="text-metal-silver text-base max-w-xl mx-auto">
                                Uma falha crítica foi detectada no sistema. A operação foi interrompida para prevenir inconsistências.
                            </p>
                        </div>

                        {/* Error Details (Dev Mode) */}
                        {isDevelopment && error && (
                            <div className="mb-8 bg-coal/80 border border-neon-cyan/20 p-5 rounded-sm">
                                <div className="flex items-center gap-2 text-neon-cyan text-xs mb-3 uppercase tracking-widest">
                                    <span className="text-neon-cyan">{'>'}</span>
                                    <span>DEBUG_MODE</span>
                                </div>
                                <div className="text-red-400 text-sm font-mono mb-3 break-all">
                                    {error.toString()}
                                </div>
                                {errorInfo && (
                                    <details className="mt-3">
                                        <summary className="cursor-pointer text-metal-silver hover:text-neon-cyan text-sm uppercase tracking-wide transition-colors flex items-center gap-2">
                                            <span>{'>'}</span> STACK_TRACE
                                        </summary>
                                        <pre className="mt-3 text-xs text-metal-silver/70 overflow-x-auto p-4 bg-coal-dark rounded-sm border border-neon-cyan/10 leading-relaxed">
                                            {errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button
                                onClick={handleReload}
                                className="flex-1 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-coal font-bold py-4 px-6 rounded-sm transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-3 text-sm"
                            >
                                <RefreshCcw size={18} />
                                REINICIAR
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="flex-1 bg-transparent border-2 border-metal-silver/30 text-metal-silver hover:border-neon-cyan/50 hover:text-neon-cyan transition-all duration-300 py-4 px-6 rounded-sm uppercase tracking-wider flex items-center justify-center gap-3 text-sm"
                            >
                                <ArrowLeft size={18} />
                                VOLTAR
                            </button>
                        </div>

                        {/* Footer Info */}
                        <div className="text-center pt-6 border-t border-neon-cyan/20">
                            <p className="text-metal-silver/50 text-xs uppercase tracking-widest">
                                {'>'} CONTATE O ADMINISTRADOR SE O PROBLEMA PERSISTIR
                            </p>
                        </div>
                    </div>

                    {/* Terminal Footer */}
                    <div className="bg-coal-light border-t-2 border-neon-cyan/40 px-6 py-2 flex items-center justify-between text-xs">
                        <span className="text-neon-cyan/60 uppercase tracking-wide">STATUS: ERRO</span>
                        <div className="flex items-center gap-4">
                            <span className="text-metal-silver/40">■ ■ ■</span>
                            <span className="text-neon-cyan/60 animate-pulse">●</span>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="mt-6 text-center">
                    <p className="text-neon-cyan/20 text-xs font-mono uppercase tracking-widest">
                        ERROR_RECOVERY_MODE_ACTIVE :: 0x00FF00
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage

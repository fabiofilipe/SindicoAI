import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Bot, Eye, EyeOff, Loader2 } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store'
import { ParticleBackground } from '@/components'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await authService.login(data)
            login(response.access_token, response.refresh_token, response.user)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-coal relative flex items-center justify-center overflow-hidden">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 bg-tech-grid opacity-30" />

            {/* Particle Background */}
            <ParticleBackground density="low" className="opacity-40" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-industrial opacity-80" />

            {/* Login Container */}
            <div className="relative z-10 w-full max-w-6xl mx-4 grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:block"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-cyber flex items-center justify-center shadow-glow-lg">
                                <Bot className="w-10 h-10 text-coal" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold text-cyan text-glow-cyan font-tech">
                                    SindicoAI
                                </h1>
                                <p className="text-lg text-metal-silver">Admin Panel</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-metal-silver">
                                Gestão Inteligente de Condomínios
                            </h2>
                            <p className="text-metal-silver/80 text-lg leading-relaxed">
                                Plataforma premium com IA para administração completa do seu condomínio.
                                Dashboards em tempo real, assistente virtual e automação total.
                            </p>
                        </div>

                        {/* Animated Scan Line */}
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-coal-light/50 rounded-lg border border-cyan-glow/30">
                                <p className="text-2xl font-bold text-cyan font-mono">100%</p>
                                <p className="text-xs text-metal-silver/60">Automatizado</p>
                            </div>
                            <div className="p-4 bg-coal-light/50 rounded-lg border border-cyan-glow/30">
                                <p className="text-2xl font-bold text-cyan font-mono">24/7</p>
                                <p className="text-xs text-metal-silver/60">Disponível</p>
                            </div>
                            <div className="p-4 bg-coal-light/50 rounded-lg border border-cyan-glow/30">
                                <p className="text-2xl font-bold text-cyan font-mono">IA</p>
                                <p className="text-xs text-metal-silver/60">Assistente</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="card-holographic p-8 md:p-10 max-w-md mx-auto">
                        {/* Mobile Logo */}
                        <div className="md:hidden flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-cyber flex items-center justify-center">
                                <Bot className="w-7 h-7 text-coal" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-cyan text-glow-cyan">SindicoAI</h1>
                                <p className="text-sm text-metal-silver">Admin Panel</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-cyan mb-2">Bem-vindo de volta</h2>
                        <p className="text-metal-silver/60 mb-8">
                            Entre com suas credenciais para acessar o painel
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-metal-silver mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="input-neon w-full"
                                    placeholder="admin@sindicoai.com"
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-criticalred">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-metal-silver mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className="input-neon w-full pr-12"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-metal-silver hover:text-cyan transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-criticalred">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-criticalred/10 border border-criticalred/30 rounded-lg"
                                >
                                    <p className="text-sm text-criticalred">{error}</p>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-glow w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Entrando...
                                    </span>
                                ) : (
                                    'Entrar no Sistema'
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-6 text-center space-y-2">
                            <button className="text-sm text-metal-silver/60 hover:text-cyan transition-colors">
                                Esqueci minha senha
                            </button>
                        </div>

                        {/* Scan Line Effect */}
                        <div className="mt-8 scan-line-container h-px">
                            <div className="scan-line" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default LoginPage

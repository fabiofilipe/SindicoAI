import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'

const LoginPage = () => {
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true })
        }
    }, [isAuthenticated, navigate])

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {
            email: '',
            password: '',
        }

        if (!formData.email) {
            newErrors.email = 'Email é obrigatório'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória'
        }

        setErrors(newErrors)
        return !newErrors.email && !newErrors.password
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            await login(formData.email, formData.password)
        } catch (error: any) {
            console.error('Erro ao fazer login:', error)

            const errorMessage =
                error.message || error.response?.data?.detail || 'Email ou senha incorretos'

            setErrors({
                email: '',
                password: errorMessage,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coal via-coal-light to-coal p-4">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-tech-grid opacity-30" />

            {/* Glowing Orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple/20 rounded-full blur-3xl animate-pulse-glow delay-1000" />

            {/* Login Card */}
            <Card className="w-full max-w-md relative z-10">
                {/* Logo e Título */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-cyber rounded-2xl shadow-glow">
                            <Shield className="w-12 h-12 text-coal" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">
                        SindicoAI Admin
                    </h1>
                    <p className="text-metal-silver/80 text-sm">
                        Painel Administrativo
                    </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                            <Mail className="w-5 h-5 text-cyan/50" />
                        </div>
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="admin@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                            className="pl-12"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                            <Lock className="w-5 h-5 text-cyan/50" />
                        </div>
                        <Input
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                            className="pl-12 pr-12"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[52px] transform -translate-y-1/2 text-metal-silver hover:text-cyan transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Botão de Login */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-metal-silver/60">
                        Acesso restrito a administradores
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default LoginPage

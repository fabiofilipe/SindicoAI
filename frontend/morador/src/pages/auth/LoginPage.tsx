import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { Button, Input, HologramCard } from '@/components'

const LoginPage = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
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
        // Limpa erro do campo ao digitar
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
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres'
        }

        setErrors(newErrors)
        return !newErrors.email && !newErrors.password
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            // TODO: Integrar com API de autenticação
            // const response = await api.post('/auth/login', formData)
            // localStorage.setItem('token', response.data.token)

            // Simulação de login
            await new Promise((resolve) => setTimeout(resolve, 1500))

            navigate('/home')
        } catch (error) {
            console.error('Erro ao fazer login:', error)
            setErrors({
                email: '',
                password: 'Email ou senha incorretos',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coal via-coal-light to-coal p-4">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

            {/* Glowing Orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-techblue/20 rounded-full blur-3xl animate-pulse-glow delay-1000" />

            {/* Login Card */}
            <HologramCard className="w-full max-w-md p-8 relative z-10">
                {/* Logo e Título */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-cyber rounded-2xl shadow-glow">
                            <Building2 className="w-12 h-12 text-coal" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">
                        SindicoAI
                    </h1>
                    <p className="text-metal-silver/80 text-sm">
                        Portal do Morador
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
                            placeholder="seu@email.com"
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

                    {/* Esqueci minha senha */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-sm text-cyan hover:text-cyan/80 transition-colors"
                            onClick={() => {
                                // TODO: Implementar recuperação de senha
                                console.log('Recuperar senha')
                            }}
                        >
                            Esqueci minha senha
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

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-cyan-glow/30" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-coal-light text-metal-silver/60">
                            Primeiro acesso?
                        </span>
                    </div>
                </div>

                {/* Instruções */}
                <div className="text-center text-sm text-metal-silver/80 space-y-2">
                    <p>
                        Entre em contato com a administração do seu condomínio para obter suas credenciais de acesso.
                    </p>
                    <p className="text-xs text-metal-silver/60 mt-4">
                        Powered by SindicoAI • Industrial Tech
                    </p>
                </div>
            </HologramCard>
        </div>
    )
}

export default LoginPage

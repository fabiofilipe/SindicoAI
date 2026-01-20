import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
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
            toast.success('Login realizado com sucesso!')
        } catch (error: any) {
            const errorMessage =
                error.message || error.response?.data?.detail || 'Email ou senha incorretos'

            toast.error(errorMessage)
            setErrors({
                email: '',
                password: errorMessage,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-brass/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-brass/20 rounded-br-3xl" />

            {/* Login Card */}
            <Card variant="signature" className="w-full max-w-md relative z-10 !p-8" animate={true}>
                {/* Logo e Título */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-brass rounded-2xl flex items-center justify-center shadow-brass">
                            <Building2 className="w-8 h-8 text-cream" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-ink mb-2">
                        SindicoAI
                    </h1>
                    <p className="text-stone text-sm">
                        Painel Administrativo
                    </p>
                </div>

                {/* Decorative line */}
                <div className="w-12 h-0.5 bg-brass mx-auto mb-8 rounded-full" />

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                            <Mail className="w-5 h-5 text-stone" strokeWidth={1.5} />
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
                            <Lock className="w-5 h-5 text-stone" strokeWidth={1.5} />
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
                            className="absolute right-3 top-[52px] transform -translate-y-1/2 text-stone hover:text-brass transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                            ) : (
                                <Eye className="w-5 h-5" strokeWidth={1.5} />
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

                    {/* Forgot Password Link */}
                    <div className="text-center mt-4">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-brass hover:text-brass-light transition-colors"
                        >
                            Esqueci minha senha
                        </Link>
                    </div>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-stone">
                        Acesso restrito a administradores
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default LoginPage

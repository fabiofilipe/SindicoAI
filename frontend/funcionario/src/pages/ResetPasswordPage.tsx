import { useState, useEffect, type ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import api from '@/services/api'

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error('Token inválido ou ausente')
            navigate('/login')
        }
    }, [token, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!password) {
            toast.error('Digite uma nova senha')
            return
        }

        if (password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres')
            return
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem')
            return
        }

        setIsLoading(true)

        try {
            await api.post('/auth/reset-password', {
                token,
                new_password: password,
            })

            toast.success('Senha redefinida com sucesso!')
            navigate('/login')
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || 'Erro ao redefinir senha. Token pode estar expirado.'
            toast.error(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-brass/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-brass/20 rounded-br-3xl" />

            {/* Reset Password Card */}
            <Card variant="signature" className="w-full max-w-md relative z-10 !p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-brass rounded-2xl flex items-center justify-center shadow-brass">
                            <Building2 className="w-8 h-8 text-cream" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-ink mb-2">
                        Redefinir Senha
                    </h1>
                    <p className="text-stone">
                        Digite sua nova senha abaixo
                    </p>
                </div>

                {/* Decorative line */}
                <div className="w-12 h-0.5 bg-brass mx-auto mb-8 rounded-full" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            label="Nova Senha"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[42px] text-stone hover:text-brass transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                            ) : (
                                <Eye className="w-5 h-5" strokeWidth={1.5} />
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirmar Nova Senha"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-[42px] text-stone hover:text-brass transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                            ) : (
                                <Eye className="w-5 h-5" strokeWidth={1.5} />
                            )}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default ResetPasswordPage

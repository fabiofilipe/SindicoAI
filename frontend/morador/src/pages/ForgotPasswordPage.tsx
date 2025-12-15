import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import api from '@/services/api'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error('Digite seu email')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Email inválido')
            return
        }

        setIsLoading(true)

        try {
            await api.post('/auth/forgot-password', { email })
            setEmailSent(true)
            toast.success('Se o email existir, você receberá instruções em breve!')
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao enviar email')
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

            {/* Forgot Password Card */}
            <Card className="w-full max-w-md relative z-10">
                {!emailSent ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-gradient-cyber rounded-2xl shadow-glow">
                                    <Mail className="w-12 h-12 text-coal" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 text-gradient-cyber">
                                Recuperar Senha
                            </h1>
                            <p className="text-gray-400">
                                Digite seu email para receber o link de recuperação
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                type="email"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                icon={<Mail className="w-5 h-5 text-gray-400" />}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </Button>

                            <div className="text-center mt-4">
                                <Link
                                    to="/login"
                                    className="text-cyan hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Voltar para Login
                                </Link>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-green-500/20 rounded-2xl">
                                <Mail className="w-12 h-12 text-green-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gradient-cyber">
                            Email Enviado!
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Se o email <strong className="text-white">{email}</strong> estiver cadastrado,
                            você receberá um link para redefinir sua senha.
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Verifique sua caixa de entrada e spam.
                        </p>
                        <Link to="/login">
                            <Button variant="primary" fullWidth>
                                Voltar para Login
                            </Button>
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ForgotPasswordPage

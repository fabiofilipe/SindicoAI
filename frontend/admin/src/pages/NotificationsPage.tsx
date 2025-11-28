import { useState } from 'react'
import { Send, Bell, Users, MessageSquare } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import NotificationFormModal from '../components/notifications/NotificationFormModal'
import MainLayout from '../components/layout/MainLayout'

export default function NotificationsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleSuccess = () => {
        setShowCreateModal(false)
        setSuccessMessage('Notificação enviada com sucesso!')
        setTimeout(() => setSuccessMessage(''), 5000)
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan text-glow-cyan">Notificações em Massa</h1>
                        <p className="text-metal-silver/80 mt-1">Envie notificações para moradores do condomínio</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Notificação
                    </Button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Envio em Massa</p>
                                    <p className="text-lg font-bold text-cyan mt-2">Todos os Moradores</p>
                                </div>
                                <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                    <Users className="w-8 h-8 text-cyan" />
                                </div>
                            </div>
                            <p className="text-sm text-metal-silver/60 mt-3">
                                Envie notificações para todos os moradores do condomínio de uma vez
                            </p>
                        </div>
                    </Card>

                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Envio Segmentado</p>
                                    <p className="text-lg font-bold text-cyan mt-2">Por Unidades</p>
                                </div>
                                <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                    <Bell className="w-8 h-8 text-cyan" />
                                </div>
                            </div>
                            <p className="text-sm text-metal-silver/60 mt-3">
                                Selecione unidades específicas para receber a notificação
                            </p>
                        </div>
                    </Card>

                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Envio Individual</p>
                                    <p className="text-lg font-bold text-cyan mt-2">Por Usuários</p>
                                </div>
                                <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                    <MessageSquare className="w-8 h-8 text-cyan" />
                                </div>
                            </div>
                            <p className="text-sm text-metal-silver/60 mt-3">
                                Escolha moradores específicos para enviar a notificação
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Instructions */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-cyan mb-4">Como Funciona</h2>
                        <div className="space-y-3 text-metal-silver/80">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-cyan/20 text-cyan rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-cyan">Clique em "Enviar Notificação"</p>
                                    <p className="text-sm text-metal-silver/60">Abra o formulário de envio</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-cyan/20 text-cyan rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-cyan">Preencha o título e mensagem</p>
                                    <p className="text-sm text-metal-silver/60">Escreva o conteúdo da notificação</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-cyan/20 text-cyan rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-cyan">Escolha os destinatários</p>
                                    <p className="text-sm text-metal-silver/60">Selecione todos, unidades específicas ou usuários individuais</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-cyan/20 text-cyan rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </div>
                                <div>
                                    <p className="font-medium text-cyan">Confirme e envie</p>
                                    <p className="text-sm text-metal-silver/60">Revise o número de destinatários e clique em enviar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tips */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-cyan mb-4">Dicas de Uso</h2>
                        <ul className="space-y-2 text-metal-silver/80">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan mt-1">•</span>
                                <span>Use títulos curtos e descritivos para chamar atenção</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan mt-1">•</span>
                                <span>Seja claro e objetivo na mensagem</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan mt-1">•</span>
                                <span>Revise sempre antes de enviar para evitar erros</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan mt-1">•</span>
                                <span>Use o envio segmentado quando a mensagem for relevante apenas para alguns moradores</span>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>

            {/* Modal */}
            {showCreateModal && (
                <NotificationFormModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </MainLayout>
    )
}

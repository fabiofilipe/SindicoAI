import { useState, useEffect } from 'react'
import { Save, Building2, Clock, Bell } from 'lucide-react'
import { getSettings, updateSettings } from '../services/settingsService'
import type { SettingsUpdate, ReservationSettings, NotificationSettings } from '../types/settings'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SkeletonCard from '../components/ui/SkeletonCard'
import Input from '../components/ui/Input'
import MainLayout from '../components/layout/MainLayout'

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Form states
    const [condominiumData, setCondominiumData] = useState({
        name: '',
        address: '',
        phone: '',
        cnpj: '',
        city: '',
        state: '',
        zipcode: ''
    })

    const [reservationSettings, setReservationSettings] = useState<ReservationSettings>({
        min_hours_advance: 1,
        max_days_advance: 30,
        max_hours_duration: 4,
        cancellation_hours_advance: 24
    })

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        email_enabled: true,
        sms_enabled: false,
        push_enabled: true,
        notification_email: '',
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00'
    })

    const loadSettings = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await getSettings()

            // Populate form states
            setCondominiumData({
                name: data.name || '',
                address: data.address || '',
                phone: data.phone || '',
                cnpj: data.cnpj || '',
                city: data.city || '',
                state: data.state || '',
                zipcode: data.zipcode || ''
            })

            setReservationSettings(data.reservation_settings)
            setNotificationSettings(data.notification_settings)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao carregar configurações')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSettings()
    }, [])

    const handleSave = async () => {
        try {
            setSaving(true)
            setError('')
            setSuccessMessage('')

            const updateData: SettingsUpdate = {
                ...condominiumData,
                reservation_settings: reservationSettings,
                notification_settings: notificationSettings
            }

            await updateSettings(updateData)
            setSuccessMessage('Configurações salvas com sucesso!')
            await loadSettings()

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao salvar configurações')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <div className="h-16 bg-coal-light/80 rounded-xl animate-pulse" />
                    <SkeletonCard rows={8} height="300px" />
                    <SkeletonCard rows={6} height="200px" />
                    <SkeletonCard rows={10} height="350px" />
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan text-glow-cyan">Configurações do Sistema</h1>
                        <p className="text-metal-silver/80 mt-1">Configure os dados e regras do condomínio</p>
                    </div>
                    <Button onClick={handleSave} isLoading={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-criticalred/10 border border-criticalred/30 rounded-lg p-4">
                        <p className="text-criticalred">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-terminalgreen/10 border border-terminalgreen/30 rounded-lg p-4">
                        <p className="text-terminalgreen">{successMessage}</p>
                    </div>
                )}

                {/* Section 1: Dados do Condomínio */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan/10 border border-cyan/30 rounded-lg">
                                <Building2 className="w-6 h-6 text-cyan" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-cyan">Dados do Condomínio</h2>
                                <p className="text-sm text-metal-silver/70">Informações básicas do condomínio</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nome do Condomínio"
                                value={condominiumData.name}
                                onChange={(e) => setCondominiumData({ ...condominiumData, name: e.target.value })}
                                placeholder="Ex: Residencial Solar das Flores"
                            />
                            <Input
                                label="CNPJ"
                                value={condominiumData.cnpj}
                                onChange={(e) => setCondominiumData({ ...condominiumData, cnpj: e.target.value })}
                                placeholder="00.000.000/0000-00"
                            />
                            <Input
                                label="Telefone"
                                value={condominiumData.phone}
                                onChange={(e) => setCondominiumData({ ...condominiumData, phone: e.target.value })}
                                placeholder="(00) 00000-0000"
                            />
                            <Input
                                label="CEP"
                                value={condominiumData.zipcode}
                                onChange={(e) => setCondominiumData({ ...condominiumData, zipcode: e.target.value })}
                                placeholder="00000-000"
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Endereço"
                                    value={condominiumData.address}
                                    onChange={(e) => setCondominiumData({ ...condominiumData, address: e.target.value })}
                                    placeholder="Rua, Número, Bairro"
                                />
                            </div>
                            <Input
                                label="Cidade"
                                value={condominiumData.city}
                                onChange={(e) => setCondominiumData({ ...condominiumData, city: e.target.value })}
                                placeholder="Ex: São Paulo"
                            />
                            <Input
                                label="Estado"
                                value={condominiumData.state}
                                onChange={(e) => setCondominiumData({ ...condominiumData, state: e.target.value })}
                                placeholder="Ex: SP"
                            />
                        </div>
                    </div>
                </Card>

                {/* Section 2: Regras de Reserva */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple/10 border border-purple/30 rounded-lg">
                                <Clock className="w-6 h-6 text-purple" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-purple">Regras de Reserva</h2>
                                <p className="text-sm text-metal-silver/70">Configure as políticas de reserva de áreas comuns</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="number"
                                label="Antecedência Mínima (horas)"
                                value={reservationSettings.min_hours_advance}
                                onChange={(e) => setReservationSettings({
                                    ...reservationSettings,
                                    min_hours_advance: parseInt(e.target.value) || 0
                                })}
                                helperText="Horas mínimas de antecedência para fazer uma reserva"
                            />
                            <Input
                                type="number"
                                label="Antecedência Máxima (dias)"
                                value={reservationSettings.max_days_advance}
                                onChange={(e) => setReservationSettings({
                                    ...reservationSettings,
                                    max_days_advance: parseInt(e.target.value) || 0
                                })}
                                helperText="Dias máximos de antecedência para reservar"
                            />
                            <Input
                                type="number"
                                label="Duração Máxima (horas)"
                                value={reservationSettings.max_hours_duration}
                                onChange={(e) => setReservationSettings({
                                    ...reservationSettings,
                                    max_hours_duration: parseInt(e.target.value) || 0
                                })}
                                helperText="Tempo máximo de duração de uma reserva"
                            />
                            <Input
                                type="number"
                                label="Cancelamento com Antecedência (horas)"
                                value={reservationSettings.cancellation_hours_advance}
                                onChange={(e) => setReservationSettings({
                                    ...reservationSettings,
                                    cancellation_hours_advance: parseInt(e.target.value) || 0
                                })}
                                helperText="Horas de antecedência necessárias para cancelar"
                            />
                        </div>
                    </div>
                </Card>

                {/* Section 3: Configurações de Notificação */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-techblue/10 border border-techblue/30 rounded-lg">
                                <Bell className="w-6 h-6 text-techblue" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-techblue">Configurações de Notificação</h2>
                                <p className="text-sm text-metal-silver/70">Gerencie como as notificações são enviadas</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Notification Channels */}
                            <div>
                                <h3 className="text-sm font-semibold text-metal-silver mb-3">Canais de Notificação</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 bg-coal-light border border-cyan/20 rounded-lg cursor-pointer hover:border-cyan/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.email_enabled}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                email_enabled: e.target.checked
                                            })}
                                            className="w-5 h-5 rounded border-cyan/30 bg-coal text-cyan focus:ring-cyan focus:ring-offset-0"
                                        />
                                        <div>
                                            <p className="text-metal-silver font-medium">Email</p>
                                            <p className="text-xs text-metal-silver/60">Enviar notificações por email</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 bg-coal-light border border-cyan/20 rounded-lg cursor-pointer hover:border-cyan/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.sms_enabled}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                sms_enabled: e.target.checked
                                            })}
                                            className="w-5 h-5 rounded border-cyan/30 bg-coal text-cyan focus:ring-cyan focus:ring-offset-0"
                                        />
                                        <div>
                                            <p className="text-metal-silver font-medium">SMS</p>
                                            <p className="text-xs text-metal-silver/60">Enviar notificações por SMS</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 bg-coal-light border border-cyan/20 rounded-lg cursor-pointer hover:border-cyan/40 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={notificationSettings.push_enabled}
                                            onChange={(e) => setNotificationSettings({
                                                ...notificationSettings,
                                                push_enabled: e.target.checked
                                            })}
                                            className="w-5 h-5 rounded border-cyan/30 bg-coal text-cyan focus:ring-cyan focus:ring-offset-0"
                                        />
                                        <div>
                                            <p className="text-metal-silver font-medium">Push Notifications</p>
                                            <p className="text-xs text-metal-silver/60">Notificações push no navegador/app</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Email Configuration */}
                            <div>
                                <Input
                                    label="Email de Notificações"
                                    type="email"
                                    value={notificationSettings.notification_email}
                                    onChange={(e) => setNotificationSettings({
                                        ...notificationSettings,
                                        notification_email: e.target.value
                                    })}
                                    placeholder="contato@condominio.com.br"
                                    helperText="Email usado para enviar notificações aos moradores"
                                />
                            </div>

                            {/* Quiet Hours */}
                            <div>
                                <h3 className="text-sm font-semibold text-metal-silver mb-3">Horário de Silêncio</h3>
                                <p className="text-xs text-metal-silver/60 mb-3">Não enviar notificações nestes horários</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        type="time"
                                        label="Início"
                                        value={notificationSettings.quiet_hours_start}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            quiet_hours_start: e.target.value
                                        })}
                                    />
                                    <Input
                                        type="time"
                                        label="Fim"
                                        value={notificationSettings.quiet_hours_end}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            quiet_hours_end: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bottom Save Button */}
                <div className="flex justify-end">
                    <Button onClick={handleSave} isLoading={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </MainLayout>
    )
}

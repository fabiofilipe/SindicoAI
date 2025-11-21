import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    AlertCircle,
    Eye,
} from 'lucide-react'
import { HologramCard, Button, Modal, Select } from '@/components'
import { ImportJob, ImportType, ImportStatus } from '@/types/import.types'
import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/feedback/Toast'
import ProgressBar from '@/components/feedback/ProgressBar'

// Mock data
const mockImportJobs: ImportJob[] = [
    {
        id: '1',
        tenant_id: 'tenant1',
        user_id: 'user1',
        uploader_name: 'João Silva',
        type: 'units',
        filename: 'unidades-2024.csv',
        total_rows: 150,
        processed_rows: 150,
        successful_rows: 148,
        failed_rows: 2,
        status: 'completed',
        created_at: '2024-01-20T10:00:00Z',
        completed_at: '2024-01-20T10:05:00Z',
        errors: [
            { row: 15, field: 'area', message: 'Valor inválido para área' },
            { row: 42, field: 'number', message: 'Número de unidade duplicado' },
        ],
    },
    {
        id: '2',
        tenant_id: 'tenant1',
        user_id: 'user1',
        uploader_name: 'João Silva',
        type: 'users',
        filename: 'usuarios-novos.csv',
        total_rows: 50,
        processed_rows: 50,
        successful_rows: 50,
        failed_rows: 0,
        status: 'completed',
        created_at: '2024-01-19T14:30:00Z',
        completed_at: '2024-01-19T14:32:00Z',
    },
    {
        id: '3',
        tenant_id: 'tenant1',
        user_id: 'user2',
        uploader_name: 'Maria Santos',
        type: 'payments',
        filename: 'pagamentos-janeiro.csv',
        total_rows: 200,
        processed_rows: 85,
        successful_rows: 80,
        failed_rows: 5,
        status: 'processing',
        created_at: '2024-01-21T09:00:00Z',
    },
]

const importTypeLabels: Record<ImportType, string> = {
    units: 'Unidades',
    users: 'Usuários',
    payments: 'Pagamentos',
    meters: 'Medidores',
}

const statusIcons: Record<ImportStatus, React.ElementType> = {
    pending: Clock,
    processing: Clock,
    completed: CheckCircle,
    failed: XCircle,
}

const statusColors: Record<ImportStatus, string> = {
    pending: 'text-alertorange border-alertorange/30 bg-alertorange/10',
    processing: 'text-techblue border-techblue/30 bg-techblue/10',
    completed: 'text-terminalgreen border-terminalgreen/30 bg-terminalgreen/10',
    failed: 'text-criticalred border-criticalred/30 bg-criticalred/10',
}

const statusLabels: Record<ImportStatus, string> = {
    pending: 'Pendente',
    processing: 'Processando',
    completed: 'Concluído',
    failed: 'Falhou',
}

const ImportsPage = () => {
    const [importJobs, setImportJobs] = useState<ImportJob[]>(mockImportJobs)
    const [selectedJob, setSelectedJob] = useState<ImportJob | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedType, setSelectedType] = useState<ImportType>('units')
    const [isDragging, setIsDragging] = useState(false)

    const { isOpen: isUploadOpen, open: openUpload, close: closeUpload } = useModal()
    const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal()
    const { isOpen: isErrorsOpen, open: openErrors, close: closeErrors } = useModal()
    const { toast, hideToast, success, error } = useToast()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0 && files[0].name.endsWith('.csv')) {
            setSelectedFile(files[0])
            openUpload()
        } else {
            error('Por favor, selecione um arquivo CSV válido')
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setSelectedFile(files[0])
            openUpload()
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return

        try {
            // await importsService.upload(selectedFile, selectedType)
            success('Importação iniciada com sucesso!')
            closeUpload()
            setSelectedFile(null)
        } catch {
            error('Erro ao iniciar importação')
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedJob) return

        try {
            // await importsService.delete(selectedJob.id)
            setImportJobs(importJobs.filter((j) => j.id !== selectedJob.id))
            success('Importação removida com sucesso!')
            closeDelete()
        } catch {
            error('Erro ao remover importação')
        }
    }

    const handleViewErrors = (job: ImportJob) => {
        setSelectedJob(job)
        openErrors()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">Importações CSV</h1>
                    <p className="text-metal-silver">Importe dados em massa via arquivos CSV</p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <HologramCard
                    className={`relative overflow-hidden transition-all duration-300 ${
                        isDragging ? 'border-cyan shadow-glow scale-[1.02]' : ''
                    }`}
                >
                    {/* Scan Line Animation */}
                    {isDragging && (
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan to-transparent"
                            animate={{ y: [0, 200, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                    )}

                    <div className="p-12 text-center">
                        <motion.div
                            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-cyan/10 border border-cyan-glow/30"
                            animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                        >
                            <Upload className={`w-10 h-10 ${isDragging ? 'text-cyan' : 'text-cyan/60'}`} />
                        </motion.div>

                        <h3 className="text-xl font-bold text-cyan mb-2">
                            {isDragging ? 'Solte o arquivo CSV aqui' : 'Importar arquivo CSV'}
                        </h3>
                        <p className="text-metal-silver/60 mb-6">
                            Arraste e solte ou clique para selecionar
                        </p>

                        <input
                            type="file"
                            id="csv-upload"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="csv-upload">
                            <span className="btn-glow cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium">
                                <FileSpreadsheet className="w-5 h-5" />
                                Selecionar Arquivo CSV
                            </span>
                        </label>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                            <div className="p-4 bg-coal-light rounded-lg border border-cyan-glow/30">
                                <h4 className="text-sm font-bold text-cyan mb-2">Unidades</h4>
                                <p className="text-xs text-metal-silver/60">
                                    number, type, area, floor, block
                                </p>
                            </div>
                            <div className="p-4 bg-coal-light rounded-lg border border-cyan-glow/30">
                                <h4 className="text-sm font-bold text-cyan mb-2">Usuários</h4>
                                <p className="text-xs text-metal-silver/60">
                                    email, full_name, cpf, phone
                                </p>
                            </div>
                            <div className="p-4 bg-coal-light rounded-lg border border-cyan-glow/30">
                                <h4 className="text-sm font-bold text-cyan mb-2">Pagamentos</h4>
                                <p className="text-xs text-metal-silver/60">
                                    unit, amount, due_date, status
                                </p>
                            </div>
                            <div className="p-4 bg-coal-light rounded-lg border border-cyan-glow/30">
                                <h4 className="text-sm font-bold text-cyan mb-2">Medidores</h4>
                                <p className="text-xs text-metal-silver/60">
                                    unit, type, reading, date
                                </p>
                            </div>
                        </div>
                    </div>
                </HologramCard>
            </div>

            {/* Import History */}
            <div>
                <h2 className="text-xl font-bold text-cyan mb-4">Histórico de Importações</h2>

                {importJobs.length === 0 ? (
                    <HologramCard className="p-12 text-center">
                        <FileSpreadsheet className="w-16 h-16 text-cyan/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-metal-silver mb-2">
                            Nenhuma importação realizada
                        </h3>
                        <p className="text-metal-silver/60">
                            Faça upload de um arquivo CSV para começar
                        </p>
                    </HologramCard>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {importJobs.map((job, index) => {
                                const StatusIcon = statusIcons[job.status]
                                const progress = (job.processed_rows / job.total_rows) * 100

                                return (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <HologramCard className="p-6">
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className="w-14 h-14 rounded-lg bg-cyan/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0">
                                                    <FileSpreadsheet className="w-7 h-7 text-cyan" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-cyan mb-1">
                                                                {job.filename}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-sm text-metal-silver/60">
                                                                <span>{importTypeLabels[job.type]}</span>
                                                                <span>•</span>
                                                                <span>{job.total_rows} registros</span>
                                                                <span>•</span>
                                                                <span>
                                                                    {new Date(job.created_at).toLocaleString(
                                                                        'pt-BR'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Status Badge */}
                                                        <div
                                                            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${statusColors[job.status]}`}
                                                        >
                                                            <StatusIcon className="w-4 h-4" />
                                                            {statusLabels[job.status]}
                                                        </div>
                                                    </div>

                                                    {/* Progress */}
                                                    {job.status === 'processing' && (
                                                        <div className="mb-3">
                                                            <ProgressBar
                                                                value={progress}
                                                                showLabel
                                                                variant="cyber"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Stats */}
                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        <div className="p-3 bg-coal-light rounded-lg border border-cyan-glow/30">
                                                            <p className="text-xs text-metal-silver/60 mb-1">
                                                                Processados
                                                            </p>
                                                            <p className="text-lg font-bold text-metal-silver font-mono">
                                                                {job.processed_rows}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-coal-light rounded-lg border border-terminalgreen/30">
                                                            <p className="text-xs text-metal-silver/60 mb-1">
                                                                Sucessos
                                                            </p>
                                                            <p className="text-lg font-bold text-terminalgreen font-mono">
                                                                {job.successful_rows}
                                                            </p>
                                                        </div>
                                                        <div className="p-3 bg-coal-light rounded-lg border border-criticalred/30">
                                                            <p className="text-xs text-metal-silver/60 mb-1">
                                                                Erros
                                                            </p>
                                                            <p className="text-lg font-bold text-criticalred font-mono">
                                                                {job.failed_rows}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        {job.failed_rows > 0 && job.errors && (
                                                            <button
                                                                onClick={() => handleViewErrors(job)}
                                                                className="px-3 py-1.5 bg-alertorange/10 hover:bg-alertorange/20 border border-alertorange/30 rounded-lg text-alertorange text-sm transition-all flex items-center gap-2"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                Ver Erros ({job.failed_rows})
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedJob(job)
                                                                openDelete()
                                                            }}
                                                            className="px-3 py-1.5 bg-criticalred/10 hover:bg-criticalred/20 border border-criticalred/30 rounded-lg text-criticalred text-sm transition-all flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </HologramCard>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Modal isOpen={isUploadOpen} onClose={closeUpload} title="Confirmar Importação" size="md">
                <div className="space-y-4">
                    <div className="p-4 bg-coal-light rounded-lg border border-cyan-glow/30">
                        <div className="flex items-center gap-3 mb-3">
                            <FileSpreadsheet className="w-6 h-6 text-cyan" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-metal-silver truncate">
                                    {selectedFile?.name}
                                </h4>
                                <p className="text-xs text-metal-silver/60">
                                    {selectedFile && (selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                    </div>

                    <Select
                        label="Tipo de Importação"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as ImportType)}
                    >
                        <option value="units">Unidades</option>
                        <option value="users">Usuários</option>
                        <option value="payments">Pagamentos</option>
                        <option value="meters">Medidores</option>
                    </Select>

                    <div className="bg-techblue/10 border border-techblue/30 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-techblue flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-techblue">
                                <p className="font-bold mb-1">Importante:</p>
                                <ul className="list-disc list-inside space-y-1 text-xs">
                                    <li>O arquivo será processado em segundo plano</li>
                                    <li>Verifique se as colunas estão no formato correto</li>
                                    <li>Registros com erro serão listados ao final</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => {
                                closeUpload()
                                setSelectedFile(null)
                            }}
                            className="flex-1 bg-coal-light hover:bg-coal"
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleUpload} className="flex-1 btn-glow">
                            Iniciar Importação
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Errors Modal */}
            <Modal isOpen={isErrorsOpen} onClose={closeErrors} title="Erros de Importação" size="lg">
                <div className="space-y-4">
                    <div className="p-4 bg-coal-light rounded-lg border border-cyan-glow/30">
                        <h4 className="font-bold text-cyan mb-2">
                            {selectedJob?.filename}
                        </h4>
                        <p className="text-sm text-metal-silver/60">
                            {selectedJob?.failed_rows} erros encontrados
                        </p>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {selectedJob?.errors?.map((err, index) => (
                            <div
                                key={index}
                                className="p-4 bg-criticalred/10 border border-criticalred/30 rounded-lg"
                            >
                                <div className="flex items-start gap-3">
                                    <XCircle className="w-5 h-5 text-criticalred flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-criticalred mb-1">
                                            Linha {err.row}
                                            {err.field && ` - Campo: ${err.field}`}
                                        </p>
                                        <p className="text-sm text-metal-silver">{err.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={closeErrors} className="flex-1 bg-coal-light hover:bg-coal">
                            Fechar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={closeDelete} title="Confirmar Exclusão" size="md">
                <div className="space-y-4">
                    <p className="text-metal-silver">
                        Tem certeza que deseja remover o registro de importação{' '}
                        <span className="text-cyan font-bold">{selectedJob?.filename}</span>?
                    </p>
                    <div className="bg-criticalred/10 border border-criticalred/30 rounded-lg p-4">
                        <p className="text-sm text-criticalred">
                            Esta ação remove apenas o registro de importação. Os dados já importados não serão afetados.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={closeDelete} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button onClick={handleDeleteConfirm} className="flex-1 bg-gradient-alert">
                            Confirmar Exclusão
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast */}
            <Toast
                message={toast.message}
                variant={toast.variant}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    )
}

export default ImportsPage

import { useState, type ChangeEvent } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { importUnitsCSV } from '../../services/unitService'
import type { CSVImportResponse } from '../../types/unit'

interface CSVUploadModalProps {
    onClose: () => void
    onSuccess: () => void
}

export default function CSVUploadModal({ onClose, onSuccess }: CSVUploadModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<CSVImportResponse | null>(null)
    const [error, setError] = useState('')

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError('')
            setResult(null)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setError('Selecione um arquivo CSV')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await importUnitsCSV(file)
            setResult(response)

            if (response.created > 0) {
                setTimeout(() => {
                    onSuccess()
                }, 2000)
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao importar arquivo')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Importar Unidades via CSV"
            size="md"
        >
            {/* Instructions */}
            <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-purple-300 mb-2 font-medium">Formato do CSV:</p>
                <code className="text-xs text-purple-200 block bg-gray-900/50 p-2 rounded">
                    number,block,floor,type<br />
                    101,A,1,2-quartos<br />
                    102,A,1,3-quartos<br />
                    201,B,2,cobertura
                </code>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="mb-4 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Importação concluída!</span>
                    </div>
                    <ul className="text-sm space-y-1 ml-7">
                        <li>Total de linhas: {result.total_rows}</li>
                        <li>Criadas: {result.created}</li>
                        <li>Ignoradas (duplicadas): {result.skipped}</li>
                        {result.errors.length > 0 && (
                            <li className="text-red-400">
                                Erros: {result.errors.length}
                                <ul className="ml-4 mt-1">
                                    {result.errors.map((err, idx) => (
                                        <li key={idx}>• {err}</li>
                                    ))}
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* File input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Arquivo CSV
                </label>
                <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                            {file ? (
                                <div className="flex items-center justify-center text-purple-400">
                                    <FileText className="w-6 h-6 mr-2" />
                                    <span>{file.name}</span>
                                </div>
                            ) : (
                                <div className="text-gray-400">
                                    <Upload className="w-8 h-8 mx-auto mb-2" />
                                    <p>Clique para selecionar o arquivo CSV</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={loading}
                        />
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                >
                    {result ? 'Fechar' : 'Cancelar'}
                </Button>
                <Button
                    onClick={handleUpload}
                    className="flex-1"
                    disabled={loading || !file || !!result}
                >
                    {loading ? 'Importando...' : 'Importar'}
                </Button>
            </div>
        </Modal>
    )
}

"use client"
import { useEffect, useState } from "react"
import { Button } from "@/registry/new-york-v4/ui/button"
import { toast } from "sonner"
import { ScreenModel } from "../../examples/playground/page"
import { RotateCcw } from "lucide-react"
import { ScreenRenderer } from "../../examples/playground/ScreenRenderer"

// Importar os mesmos componentes de renderização do Playground
// (copie ou mova os componentes LoginScreen, FormScreen, etc. para um arquivo compartilhado se necessário)

export default function ApprovalPage() {
  const [files, setFiles] = useState<string[]>([])
  const [models, setModels] = useState<Record<string, ScreenModel | null>>({})
  const [contents, setContents] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Buscar arquivos pendentes
  async function fetchFiles() {
    setLoading(true)
    const res = await fetch("/api/approval/list")
    const data = await res.json()
    setFiles(data.files)
    setLoading(false)
    // Buscar conteúdo/modelo de cada arquivo
    for (const file of data.files) {
      const res2 = await fetch(`/api/approval/file?file=${encodeURIComponent(file)}`)
      const content = await res2.text()
      setContents(prev => ({ ...prev, [file]: content }))
      try {
        setModels(prev => ({ ...prev, [file]: JSON.parse(content) }))
      } catch {
        setModels(prev => ({ ...prev, [file]: null }))
      }
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  async function handleApprove(file: string) {
    const res = await fetch("/api/approval/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file })
    })
    if (res.ok) {
      toast.success("Aprovado!")
      fetchFiles()
    } else {
      const data = await res.json()
      toast.error("Erro ao aprovar", { description: data.error })
    }
  }

  async function handleReject(file: string) {
    const res = await fetch("/api/approval/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file })
    })
    if (res.ok) {
      toast.success("Rejeitado!")
      fetchFiles()
    } else {
      const data = await res.json()
      toast.error("Erro ao rejeitar", { description: data.error })
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Painel de Aprovação</h1>
      <Button onClick={fetchFiles} variant="secondary" className="mb-4"><RotateCcw className="w-4 h-4 mr-2" />Atualizar</Button>
      {loading ? (
        <p>Carregando...</p>
      ) : files.length === 0 ? (
        <p>Nenhum componente/tela pendente para aprovação.</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => {
            const content = contents[file]
            const model = models[file]
            return (
              <li key={file} className="border rounded p-4 bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm">{file}</span>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleApprove(file)}>Aprovar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleReject(file)}>Rejeitar</Button>
                  </div>
                </div>
                <div className="mb-2">
                  <pre className="bg-background p-2 rounded text-xs overflow-x-auto max-h-40">{content}</pre>
                </div>
                <div>
                  {model ? (
                    <div className="border rounded p-2 bg-background">
                      <ScreenRenderer model={model} />
                    </div>
                  ) : (
                    <span className="text-red-500 text-xs">Erro ao ler modelo</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
} 
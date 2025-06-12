"use client";
import { useEffect, useState } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { ScreenRenderer } from "../examples/playground/ScreenRenderer";

export default function ApprovedPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [models, setModels] = useState<Record<string, unknown>>({});
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function fetchFiles() {
    setLoading(true);
    const res = await fetch("/api/approved/list");
    const data = await res.json();
    setFiles(data.files);
    setLoading(false);
    for (const file of data.files) {
      const res2 = await fetch(`/api/approved/file?file=${encodeURIComponent(file)}`);
      const content = await res2.text();
      setContents((prev) => ({ ...prev, [file]: content }));
      try {
        setModels((prev) => ({ ...prev, [file]: JSON.parse(content) }));
      } catch {
        setModels((prev) => ({ ...prev, [file]: null }));
      }
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Telas Aprovadas</h1>
      <Button onClick={fetchFiles} variant="secondary" className="mb-4">Atualizar</Button>
      {loading ? (
        <p>Carregando...</p>
      ) : files.length === 0 ? (
        <p>Nenhuma tela aprovada encontrada.</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => {
            const content = contents[file];
            const model = models[file];
            return (
              <li key={file} className="border rounded p-4 bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm">{file}</span>
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
            );
          })}
        </ul>
      )}
    </div>
  );
} 
"use client"

import Image from "next/image"
import { RotateCcw } from "lucide-react"
import { useState } from "react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import { Toaster } from "@/registry/new-york-v4/ui/sonner"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york-v4/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/registry/new-york-v4/ui/pagination"
import { ScreenRenderer } from "./ScreenRenderer"

// Tipos para os modelos de tela suportados

type InputField = {
  type: "input"
  label: string
  inputType: string
  id: string
  placeholder?: string
  defaultValue?: string
}
type CheckboxField = {
  type: "checkbox"
  label: string
  id: string
}
type RadioGroupField = {
  type: "radio-group"
  label: string
  id: string
  options: { value: string; label: string }[]
  defaultValue?: string
}
type SelectField = {
  type: "select"
  label: string
  id: string
  options: { value: string; label: string }[]
}
type Field = InputField | CheckboxField | RadioGroupField | SelectField

type ActionButton = {
  type: "button"
  label: string
  variant?: string
}
type ActionLink = {
  type: "link"
  label: string
  href: string
}
type Action = ActionButton | ActionLink

export type ScreenModel =
  | {
      type: "login"
      title: string
      description: string
      fields: Field[]
      actions: Action[]
    }
  | {
      type: "form"
      title: string
      description: string
      fields: Field[]
      actions: Action[]
    }
  | {
      type: "dashboard"
      title: string
      cards: { title: string; value: string; description: string }[]
      table: {
        title: string
        description: string
        columns: string[]
        rows: string[][]
      }
    }
  | {
      type: "settings"
      title: string
      description: string
      switches: { label: string; description: string; id: string }[]
      slider: { label: string; id: string; defaultValue: number; max: number; step: number }
      select: { label: string; id: string; options: { value: string; label: string }[] }
    }
  | {
      type: "profile"
      title: string
      description: string
      avatar: string
      tabs: {
        value: string
        label: string
        fields?: Field[]
        switches?: { label: string; description: string; id: string }[]
      }[]
    }
  | {
      type: "table"
      title: string
      description: string
      columns: string[]
      rows: {
        user: { name: string; email: string; avatar: string }
        status: string
        role: string
      }[]
    }

// Função utilitária para garantir que o variant é válido
const allowedButtonVariants = ["default", "destructive", "outline", "secondary", "ghost", "link"] as const;
type ButtonVariant = typeof allowedButtonVariants[number];
function getButtonVariant(variant?: string): ButtonVariant | undefined {
  return allowedButtonVariants.includes(variant as ButtonVariant) ? (variant as ButtonVariant) : undefined;
}

export default function PlaygroundPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generatedScreen, setGeneratedScreen] = useState<React.ReactNode>(null)
  const [screenModel, setScreenModel] = useState<ScreenModel | null>(null)

  const handleGenerateScreen = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, descreva a tela que você deseja criar.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/playground/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar a requisição")
      }

      if (data.model) {
        setScreenModel(data.model as ScreenModel)
        setGeneratedScreen(null)
      } else if (data.component) {
        setGeneratedScreen(data.component)
        setScreenModel(null)
      }
      toast.success("Tela gerada com sucesso!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Algo deu errado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para salvar tela para aprovação
  async function handleSaveForApproval() {
    if (!screenModel) {
      toast.error("Gere uma tela antes de salvar para aprovação.")
      return
    }
    try {
      const response = await fetch("/api/playground/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: screenModel })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success("Tela salva para aprovação!", { description: data.file })
      } else {
        toast.error("Erro ao salvar tela.", { description: data.error })
      }
    } catch (err) {
      toast.error("Erro ao salvar tela.")
    }
  }

  return (
    <>
      <Toaster />
      <div className="md:hidden">
        <Image
          src="/examples/playground-light.png"
          width={1280}
          height={916}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/playground-dark.png"
          width={1280}
          height={916}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-1 flex-col md:flex">
        <Tabs defaultValue="screen" className="flex flex-1 flex-col">
          <div className="container flex flex-1 flex-col py-6">
            <div className="grid flex-1 items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="flex flex-1 flex-col *:data-[slot=tab-content]:flex-1 md:order-1">
                <TabsContent value="screen" className="mt-0 border-0 p-0">
                  <div className="flex h-full flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Descreva sua tela</h3>
                        <Textarea
                          placeholder="Ex: Crie uma tela de login com campos para email e senha, um botão de login e um link para recuperar senha"
                          className="min-h-[200px]"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Preview</h3>
                        <div className="bg-muted rounded-md border p-4 min-h-[400px]">
                          {screenModel ? (
                            <ScreenRenderer model={screenModel} />
                          ) : generatedScreen ? (
                            <div dangerouslySetInnerHTML={{ __html: generatedScreen }} />
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              A tela gerada aparecerá aqui.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={handleGenerateScreen}
                        disabled={isLoading}
                      >
                        {isLoading ? "Gerando..." : "Gerar Tela"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleSaveForApproval}
                        disabled={!screenModel || isLoading}
                      >
                        Salvar para aprovação
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={() => {
                          setPrompt("")
                          setGeneratedScreen(null)
                          setScreenModel(null)
                        }}
                        disabled={isLoading}
                      >
                        <span className="sr-only">Limpar</span>
                        <RotateCcw />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  )
}

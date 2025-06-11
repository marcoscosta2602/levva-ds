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
                            screenModel.type === "login" ? (
                              <LoginScreen model={screenModel} />
                            ) : screenModel.type === "form" ? (
                              <FormScreen model={screenModel} />
                            ) : screenModel.type === "dashboard" ? (
                              <DashboardScreen model={screenModel} />
                            ) : screenModel.type === "settings" ? (
                              <SettingsScreen model={screenModel} />
                            ) : screenModel.type === "profile" ? (
                              <ProfileScreen model={screenModel} />
                            ) : screenModel.type === "table" ? (
                              <TableScreen model={screenModel} />
                            ) : null
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
                        onClick={() => {
                          setPrompt("")
                          setGeneratedScreen(null)
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

// Componente para renderizar a tela de login a partir do modelo
function LoginScreen({ model }: { model: Extract<ScreenModel, { type: "login" }> }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{model.title}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {model.fields.map((field: Field) => {
            if (field.type === "input") {
              return (
                <div className="space-y-2" key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input id={field.id} type={field.inputType} placeholder={field.placeholder} />
                </div>
              )
            }
            if (field.type === "checkbox") {
              return (
                <div className="flex items-center space-x-2" key={field.id}>
                  <Checkbox id={field.id} />
                  <Label htmlFor={field.id}>{field.label}</Label>
                </div>
              )
            }
            return null
          })}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-stretch">
        {model.actions.map((action: Action, idx: number) => {
          if (action.type === "button") {
            return (
              <Button key={idx} variant={getButtonVariant(action.variant)} className="w-full">{action.label}</Button>
            )
          }
          if (action.type === "link") {
            return (
              <Button key={idx} variant="link" className="px-0 w-full" asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            )
          }
          return null
        })}
      </CardFooter>
    </Card>
  )
}

// Componente para renderizar tela de formulário
function FormScreen({ model }: { model: Extract<ScreenModel, { type: "form" }> }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{model.title}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {model.fields.map((field) => {
            if (field.type === "input") {
              return (
                <div className="space-y-2" key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input id={field.id} type={field.inputType} placeholder={field.placeholder} defaultValue={field.defaultValue} />
                </div>
              )
            }
            if (field.type === "checkbox") {
              return (
                <div className="flex items-center space-x-2" key={field.id}>
                  <Checkbox id={field.id} />
                  <Label htmlFor={field.id}>{field.label}</Label>
                </div>
              )
            }
            if (field.type === "radio-group") {
              return (
                <div className="space-y-2" key={field.id}>
                  <Label>{field.label}</Label>
                  <RadioGroup defaultValue={field.defaultValue}>
                    {field.options.map((opt) => (
                      <div className="flex items-center space-x-2" key={opt.value}>
                        <RadioGroupItem value={opt.value} id={opt.value} />
                        <Label htmlFor={opt.value}>{opt.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )
            }
            if (field.type === "select") {
              return (
                <div className="space-y-2" key={field.id}>
                  <Label>{field.label}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            }
            return null
          })}
        </form>
      </CardContent>
      <CardFooter>
        {model.actions.map((action, idx) => {
          if (action.type === "button") {
            return (
              <Button key={idx} variant={getButtonVariant(action.variant)} className="w-full">{action.label}</Button>
            )
          }
          if (action.type === "link") {
            return (
              <Button key={idx} variant="link" className="px-0 w-full" asChild>
                <a href={action.href}>{action.label}</a>
              </Button>
            )
          }
          return null
        })}
      </CardFooter>
    </Card>
  )
}

// Componente para renderizar tela de dashboard
function DashboardScreen({ model }: { model: Extract<ScreenModel, { type: "dashboard" }> }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {model.cards.map((card, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{model.table.title}</CardTitle>
          <CardDescription>{model.table.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {model.table.columns.map((col, idx) => (
                  <TableHead key={idx}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {model.table.rows.map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((cell, cidx) => (
                    <TableCell key={cidx}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para renderizar tela de configurações
function SettingsScreen({ model }: { model: Extract<ScreenModel, { type: "settings" }> }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{model.title}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {model.switches.map((sw) => (
          <div className="flex items-center justify-between" key={sw.id}>
            <div className="space-y-0.5">
              <Label>{sw.label}</Label>
              <p className="text-sm text-muted-foreground">{sw.description}</p>
            </div>
            <Switch />
          </div>
        ))}
        <div className="space-y-4">
          <Label>{model.slider.label}</Label>
          <Slider defaultValue={[model.slider.defaultValue]} max={model.slider.max} step={model.slider.step} />
        </div>
        <div className="space-y-2">
          <Label>{model.select.label}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {model.select.options.map((opt) => (
                <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Salvar</Button>
      </CardFooter>
    </Card>
  )
}

// Componente para renderizar tela de perfil
function ProfileScreen({ model }: { model: Extract<ScreenModel, { type: "profile" }> }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={model.avatar} />
            <AvatarFallback>{model.title[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{model.title}</CardTitle>
            <CardDescription>{model.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={model.tabs[0]?.value} className="w-full">
          <TabsList>
            {model.tabs.map((tab) => (
              <TabsTrigger value={tab.value} key={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {model.tabs.map((tab) => (
            <TabsContent value={tab.value} key={tab.value} className="space-y-4">
              {tab.fields && tab.fields.map((field) => {
                if (field.type === "input") {
                  return (
                    <div className="space-y-2" key={field.id}>
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input id={field.id} type={field.inputType} defaultValue={field.defaultValue} />
                    </div>
                  )
                }
                return null
              })}
              {tab.switches && tab.switches.map((sw) => (
                <div className="flex items-center justify-between" key={sw.id}>
                  <div className="space-y-0.5">
                    <Label>{sw.label}</Label>
                    <p className="text-sm text-muted-foreground">{sw.description}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button>Salvar</Button>
      </CardFooter>
    </Card>
  )
}

// Componente para renderizar tela de tabela/lista
function TableScreen({ model }: { model: Extract<ScreenModel, { type: "table" }> }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{model.title}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {model.columns.map((col, idx) => (
                <TableHead key={idx}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {model.rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={row.user.avatar} />
                      <AvatarFallback>{row.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{row.user.name}</p>
                      <p className="text-sm text-muted-foreground">{row.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge>{row.status}</Badge></TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}

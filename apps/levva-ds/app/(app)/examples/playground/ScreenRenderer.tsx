import { ScreenModel } from "./page"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york-v4/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/registry/new-york-v4/ui/pagination"
import { Button } from "@/registry/new-york-v4/ui/button"

export function ScreenRenderer({ model }: { model: ScreenModel }) {
  if (model.type === "login") return <LoginScreen model={model} />
  if (model.type === "form") return <FormScreen model={model} />
  if (model.type === "dashboard") return <DashboardScreen model={model} />
  if (model.type === "settings") return <SettingsScreen model={model} />
  if (model.type === "profile") return <ProfileScreen model={model} />
  if (model.type === "table") return <TableScreen model={model} />
  return <span className="text-muted-foreground">Tipo de tela não suportado.</span>
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
          {model.fields.map((field: any) => {
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
        {model.actions.map((action: any, idx: number) => {
          if (action.type === "button") {
            return (
              <Button key={idx} className="w-full">{action.label}</Button>
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

function FormScreen({ model }: { model: Extract<ScreenModel, { type: "form" }> }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{model.title}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {model.fields.map((field: any) => {
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
                    {field.options.map((opt: any) => (
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
                      {field.options.map((opt: any) => (
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
        {model.actions.map((action: any, idx: number) => {
          if (action.type === "button") {
            return (
              <Button key={idx} className="w-full">{action.label}</Button>
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

function DashboardScreen({ model }: { model: Extract<ScreenModel, { type: "dashboard" }> }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {model.cards.map((card: any, idx: number) => (
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
                {model.table.columns.map((col: string, idx: number) => (
                  <TableHead key={idx}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {model.table.rows.map((row: string[], idx: number) => (
                <TableRow key={idx}>
                  {row.map((cell: string, cidx: number) => (
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

function SettingsScreen({ model }: { model: Extract<ScreenModel, { type: "settings" }> }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{model.title}</CardTitle>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {model.switches.map((sw: any) => (
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
              {model.select.options.map((opt: any) => (
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
            {model.tabs.map((tab: any) => (
              <TabsTrigger value={tab.value} key={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {model.tabs.map((tab: any) => (
            <TabsContent value={tab.value} key={tab.value} className="space-y-4">
              {tab.fields && tab.fields.map((field: any) => {
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
              {tab.switches && tab.switches.map((sw: any) => (
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
              {model.columns.map((col: string, idx: number) => (
                <TableHead key={idx}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {model.rows.map((row: any, idx: number) => (
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
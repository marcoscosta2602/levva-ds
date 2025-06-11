import { NextRequest } from "next/server"


const COMPONENTS = [
  "Button", "Input", "Label", "Card", "CardContent", "CardDescription", "CardFooter", "CardHeader", "CardTitle", "Table", "TableBody", "TableCell", "TableHead", "TableHeader", "TableRow", "Tabs", "TabsContent", "TabsList", "TabsTrigger", "Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue", "Switch", "Checkbox", "RadioGroup", "RadioGroupItem", "Slider", "Progress", "Badge", "Avatar", "AvatarFallback", "AvatarImage", "Alert", "AlertDescription", "AlertTitle", "Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger", "Calendar", "Carousel", "CarouselContent", "CarouselItem", "CarouselNext", "CarouselPrevious", "Dialog", "DialogContent", "DialogDescription", "DialogFooter", "DialogHeader", "DialogTitle", "DialogTrigger", "Drawer", "DrawerClose", "DrawerContent", "DrawerDescription", "DrawerFooter", "DrawerHeader", "DrawerTitle", "DrawerTrigger", "NavigationMenu", "NavigationMenuContent", "NavigationMenuItem", "NavigationMenuLink", "NavigationMenuList", "NavigationMenuTrigger", "Pagination", "PaginationContent", "PaginationEllipsis", "PaginationItem", "PaginationLink", "PaginationNext", "PaginationPrevious", "Popover", "PopoverContent", "PopoverTrigger", "Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"
]

const SYSTEM_PROMPT = `Você é um gerador de telas para o Design System Levva. Use apenas os componentes da lista abaixo. Gere um JSON estruturado conforme o exemplo. Não use nenhum componente fora dessa lista.\nComponentes disponíveis: ${COMPONENTS.join(", ")}.\nExemplo de modelo JSON:\n{\n  "type": "form",\n  "title": "Cadastro de Produtos",\n  "fields": [\n    { "type": "input", "label": "Nome", "inputType": "text", "id": "nome" },\n    { "type": "input", "label": "Preço", "inputType": "number", "id": "preco" },\n    { "type": "select", "label": "Categoria", "id": "categoria", "options": [\n      { "value": "eletronicos", "label": "Eletrônicos" },\n      { "value": "roupas", "label": "Roupas" }\n    ]}\n  ],\n  "actions": [\n    { "type": "button", "label": "Salvar", "variant": "default" }\n  ]\n}`

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), { status: 500 })
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: prompt }
  ]

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0125",
      messages,
      temperature: 0.2,
      max_tokens: 1024
    })
  })

  if (!openaiRes.ok) {
    const errorText = await openaiRes.text();
    console.error("OpenAI error:", errorText);
    return new Response(JSON.stringify({ error: "Failed to contact OpenAI", details: errorText }), { status: 500 })
  }

  const openaiData = await openaiRes.json()
  const content = openaiData.choices?.[0]?.message?.content

  // Tenta fazer o parse do JSON retornado pela IA
  let model
  try {
    model = JSON.parse(content)
  } catch {
    return new Response(JSON.stringify({ error: "A resposta da IA não está em formato JSON válido." }), { status: 500 })
  }

  // Validação básica: deve ter pelo menos um type
  if (!model || !model.type) {
    return new Response(JSON.stringify({ error: "Modelo inválido retornado pela IA." }), { status: 500 })
  }

  return new Response(JSON.stringify({ model }), { status: 200, headers: { "Content-Type": "application/json" } })
}

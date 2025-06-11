/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { Switch } from "@/registry/new-york-v4/ui/switch"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/registry/new-york-v4/ui/radio-group"
import { Slider } from "@/registry/new-york-v4/ui/slider"
import { Progress } from "@/registry/new-york-v4/ui/progress"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york-v4/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/new-york-v4/ui/accordion"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/registry/new-york-v4/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york-v4/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/registry/new-york-v4/ui/drawer"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/registry/new-york-v4/ui/navigation-menu"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/registry/new-york-v4/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york-v4/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/registry/new-york-v4/ui/tooltip"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Convert prompt to lowercase for easier matching
    const promptLower = prompt.toLowerCase()

    // Dashboard template
    if (promptLower.includes("dashboard") || promptLower.includes("painel")) {
      return new Response(
        JSON.stringify({
          model: {
            type: "dashboard",
            title: "Dashboard",
            cards: [
              { title: "Total Revenue", value: "$45,231.89", description: "+20.1% from last month" },
              { title: "Subscriptions", value: "+2350", description: "+180.1% from last month" },
              { title: "Sales", value: "+12,234", description: "+19% from last month" },
              { title: "Active Now", value: "+573", description: "+201 since last hour" }
            ],
            table: {
              title: "Recent Activity",
              description: "You had 3 activities today.",
              columns: ["Activity", "Status", "Time"],
              rows: [
                ["Login", "Success", "2 minutes ago"],
                ["Update Profile", "Pending", "1 hour ago"],
                ["New Order", "Failed", "3 hours ago"]
              ]
            }
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Form template
    if (promptLower.includes("form") || promptLower.includes("formulário") || promptLower.includes("cadastro")) {
      return new Response(
        JSON.stringify({
          model: {
            type: "form",
            title: "Create Account",
            description: "Enter your information to create an account.",
            fields: [
              { type: "input", label: "Name", inputType: "text", id: "name", placeholder: "Enter your name" },
              { type: "input", label: "Email", inputType: "email", id: "email", placeholder: "Enter your email" },
              { type: "input", label: "Password", inputType: "password", id: "password", placeholder: "Enter your password" },
              { type: "checkbox", label: "Accept terms and conditions", id: "terms" },
              { type: "radio-group", label: "Gender", id: "gender", options: [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" }
              ], defaultValue: "male" }
            ],
            actions: [
              { type: "button", label: "Create Account", variant: "default" }
            ]
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Settings template
    if (promptLower.includes("settings") || promptLower.includes("configurações")) {
      return new Response(
        JSON.stringify({
          model: {
            type: "settings",
            title: "Settings",
            description: "Manage your account settings and preferences.",
            switches: [
              { label: "Email Notifications", description: "Receive emails about your account activity.", id: "emailNotifications" },
              { label: "Push Notifications", description: "Receive push notifications on your device.", id: "pushNotifications" }
            ],
            slider: { label: "Notification Volume", id: "volume", defaultValue: 50, max: 100, step: 1 },
            select: { label: "Language", id: "language", options: [
              { value: "en", label: "English" },
              { value: "pt", label: "Portuguese" },
              { value: "es", label: "Spanish" }
            ] }
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Profile template
    if (promptLower.includes("profile") || promptLower.includes("perfil")) {
      return new Response(
        JSON.stringify({
          model: {
            type: "profile",
            title: "John Doe",
            description: "john.doe@example.com",
            avatar: "https://github.com/shadcn.png",
            tabs: [
              {
                value: "account",
                label: "Account",
                fields: [
                  { type: "input", label: "Name", inputType: "text", id: "name", defaultValue: "John Doe" },
                  { type: "input", label: "Email", inputType: "email", id: "email", defaultValue: "john.doe@example.com" },
                  { type: "input", label: "Bio", inputType: "text", id: "bio", defaultValue: "Software Engineer" }
                ]
              },
              {
                value: "security",
                label: "Security",
                fields: [
                  { type: "input", label: "Current Password", inputType: "password", id: "currentPassword" },
                  { type: "input", label: "New Password", inputType: "password", id: "newPassword" },
                  { type: "input", label: "Confirm Password", inputType: "password", id: "confirmPassword" }
                ]
              },
              {
                value: "notifications",
                label: "Notifications",
                switches: [
                  { label: "Email Notifications", description: "Receive emails about your account activity.", id: "emailNotifications" },
                  { label: "Push Notifications", description: "Receive push notifications on your device.", id: "pushNotifications" }
                ]
              }
            ]
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Login template
    if (promptLower.includes("login")) {
      return new Response(
        JSON.stringify({
          model: {
            type: "login",
            title: "Login",
            description: "Enter your credentials to access your account.",
            fields: [
              { type: "input", label: "Email", inputType: "email", id: "email", placeholder: "Enter your email" },
              { type: "input", label: "Password", inputType: "password", id: "password", placeholder: "Enter your password" },
              { type: "checkbox", label: "Remember me", id: "remember" }
            ],
            actions: [
              { type: "button", label: "Sign In", variant: "default" },
              { type: "link", label: "Forgot password?", href: "#" }
            ]
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Table template
    if (promptLower.includes("table") || promptLower.includes("tabela") || promptLower.includes("lista")) {
      return new Response(
        JSON.stringify({
          model: {
            type: "table",
            title: "Users",
            description: "A list of all users in your account.",
            columns: ["User", "Status", "Role", "Actions"],
            rows: [
              {
                user: { name: "John Doe", email: "john.doe@example.com", avatar: "https://github.com/shadcn.png" },
                status: "Active",
                role: "Admin"
              },
              {
                user: { name: "Jane Smith", email: "jane.smith@example.com", avatar: "https://github.com/shadcn.png" },
                status: "Inactive",
                role: "User"
              }
            ]
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Default template
    return new Response(
      JSON.stringify({
        component: `
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Welcome to the Playground</CardTitle>
              <CardDescription>Try one of these prompts to generate a screen:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2">
                <li>Create a dashboard</li>
                <li>Create a form</li>
                <li>Create a settings page</li>
                <li>Create a profile page</li>
                <li>Create a login page</li>
                <li>Create a table</li>
              </ul>
            </CardContent>
          </Card>
        `,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
} 
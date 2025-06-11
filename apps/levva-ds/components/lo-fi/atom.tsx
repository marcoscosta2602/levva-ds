import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const atomVariants = cva(
  "inline-flex rounded-lg border-neutral-300 dark:border-neutral-600",
  {
    variants: {
      shade: {
        "50": "bg-primary dark:bg-primary",
        "100": "bg-primary dark:bg-primary",
        "200": "bg-primary dark:bg-primary",
        "300": "bg-primary dark:bg-primary",
        "400": "bg-primary dark:bg-primary",
        "500": "bg-primary dark:bg-primary",
        "600": "bg-primary dark:bg-primary",
        "700": "bg-primary dark:bg-primary",
        "800": "bg-primary dark:bg-primary",
        "900": "bg-primary dark:bg-primary",
      },
    },
    defaultVariants: {
      shade: "50",
    },
  }
)

function Atom({
  className,
  shade,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof atomVariants>) {
  return (
    <div
      data-slot="button"
      className={cn(atomVariants({ shade, className }))}
      {...props}
    />
  )
}

export { Atom }

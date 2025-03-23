import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-bold transition-all uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "neo-button bg-accent text-accent-foreground hover:bg-accent/90",
        destructive: "neo-button bg-destructive text-destructive-foreground",
        outline: "border-2 text-foreground border-input bg-background hover:bg-secondary hover:text-secondary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        brutalist: "neo-button bg-accent text-accent-foreground",
        pixel: "pixelated-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        subtle: "bg-muted text-foreground hover:bg-muted/80",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-black dark:border-white"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        xl: "h-12 px-10 text-base"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

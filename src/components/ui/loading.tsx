"use client"

import { cn } from "@/lib/utils"

interface LoadingProps {
  variant?: 'default' | 'overlay' | 'inline'
  className?: string
}

export function Loading({ variant = 'default', className }: LoadingProps) {
  const variants = {
    default: "flex items-center justify-center min-h-[200px]",
    overlay: "absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center",
    inline: "flex items-center justify-center"
  }

  return (
    <div className={cn(variants[variant], className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
} 
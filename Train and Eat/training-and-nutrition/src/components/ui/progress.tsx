"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const safeValue = Math.max(0, Math.min(100, value ?? 0))

  return (
    <ProgressPrimitive.Root
    data-slot="progress"
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-red-500",
      className
    )}
    value={safeValue}
    max={100}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
     className="h-full w-full bg-blue-600 transition-transform duration-300 dark:bg-blue-500"
     style={{
      backgroundColor: "#00ff66",
      transform: `translateX(-${100 - safeValue}%)`,
    }}
    />
  </ProgressPrimitive.Root>
  )
}

export { Progress }
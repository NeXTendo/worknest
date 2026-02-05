"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

// Note: import the default react-day-picker stylesheet from your global CSS
// (e.g. add `@import "react-day-picker/dist/style.css";` to app/globals.css)

type DayPickerProps = React.ComponentProps<typeof DayPicker>

export default function Calendar({ className, ...props }: DayPickerProps) {
  return (
    <div className={cn("rounded-md p-1", className)}>
      <DayPicker {...props} classNames={{ root: cn("rounded-md bg-background text-foreground w-full") }} />
    </div>
  )
}

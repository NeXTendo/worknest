"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"

const Command = (props: React.ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive {...props} className={cn("bg-background text-foreground") as string} />
)

const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-input px-3 py-2">
    <CommandPrimitive.Input
      ref={ref}
      className={cn("w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground", className)}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List ref={ref} className={cn("max-h-60 overflow-auto p-1", className)} {...props} />
  )
)
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = (props: React.ComponentProps<typeof CommandPrimitive.Empty>) => (
  <CommandPrimitive.Empty className="px-3 py-2 text-sm text-muted-foreground" {...props} />
)

const CommandGroup = (props: React.ComponentProps<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group className="px-1 py-1" {...props} />
)

const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandSeparator = (props: React.ComponentProps<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator className="my-1 h-px bg-border" {...props} />
)

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator }

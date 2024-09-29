"use client"

import * as React from "react"
import {
    ArrowUpCircle,
    CheckCircle2,
    Circle,
    HelpCircle,
    LucideIcon,
    XCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { PROPOSAL_STATUS, Status, statusColorsMap } from "@/constants/proposal-status"

type StatusInput = {
    key: string
    label: string
    color: string
    icon: LucideIcon
}


export function StatusPicker({ value }: { value?: Status }) {
    const [open, setOpen] = React.useState(false)
    const [selectedStatus, setSelectedStatus] = React.useState<StatusInput | null>(
        value ? PROPOSAL_STATUS[value] : PROPOSAL_STATUS['open']
    )

    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-[150px] justify-start"
                    >
                        {selectedStatus ? (
                            <>
                                <selectedStatus.icon className={cn("mr-2 h-4 w-4 shrink-0", statusColorsMap(selectedStatus.color))} />
                                {selectedStatus.label}
                            </>
                        ) : (
                            <>+ Set status</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="center">
                    <Command>
                        <CommandInput placeholder="Change status..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {Object.values(PROPOSAL_STATUS).map((status) => (
                                    <CommandItem
                                        key={status.key}
                                        value={status.key}
                                        onSelect={(value) => {
                                            setSelectedStatus(
                                                status ||
                                                null
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        <status.icon
                                            className={cn(
                                                "mr-2 h-4 w-4", statusColorsMap(status.color),
                                                status.key === selectedStatus?.key
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                            )}
                                        />
                                        <span>{status.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
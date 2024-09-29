"use client"

import * as React from "react"
import {
    LucideIcon,
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
import { PROPOSAL_STATUS, statusColorsMap } from "@/constants/proposal-status"
import { User } from "@prisma/client"
import Image from "next/image"
import { Avatar } from "../ui/avatar"

type Status = {
    key: string
    label: string
    color: string
    icon: LucideIcon
}


export function UserPicker({ users }: { users: Partial<User>[] }) {
    const [open, setOpen] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<Partial<User> | null>(
        users[1]
    )

    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                    >
                        {selectedUser ? (
                            <div className="flex gap-2 items-center">
                                <div>
                                    <Avatar
                                        name={selectedUser?.email}
                                        src={selectedUser?.avatar ?? ""}
                                        size={24}
                                        shape="circle"
                                        fallbackBackgroundColor="#FCBE1D"
                                        className="!text-base capitalize"
                                    />
                                </div>
                                <p>
                                    {selectedUser.name}
                                </p>
                            </div>
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
                                {users.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={String(user.name)}
                                        onSelect={(value) => {
                                            setSelectedUser(
                                                user
                                            )
                                            setOpen(false)
                                        }}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <div>
                                                <Avatar
                                                    name={user?.email}
                                                    src={user?.avatar ?? ""}
                                                    size={24}
                                                    shape="circle"
                                                    fallbackBackgroundColor="#FCBE1D"
                                                    className="!text-base capitalize"
                                                />
                                            </div>
                                            <span>{user.name}</span>
                                        </div>
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
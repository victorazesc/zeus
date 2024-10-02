"use client";

import * as React from "react";
import { LucideIcon, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User } from "@prisma/client";
import Image from "next/image";
import { Avatar } from "../ui/avatar";
import { useUser } from "@/hooks/stores/use-user";
import { Label } from "@/components/ui/label";

interface UserPickerProps {
    users: Partial<User>[]; // Lista de usuários a serem exibidos no picker
    value?: Partial<User>; // Usuário selecionado inicialmente
    label?: string; // Texto da label
    onChange?: (user: Partial<User>) => void; // Função de callback quando o usuário for selecionado
}

// Componente UserPicker atualizado com onChange
export function UserPicker({ users, label, value, onChange }: UserPickerProps) {
    const [open, setOpen] = React.useState(false);
    const { currentUser } = useUser();
    const [selectedUser, setSelectedUser] = React.useState<Partial<User> | null>(
        value ?? (users.find((user) => user.id === currentUser?.id) || null)
    );

    return (
        <div className="flex flex-col space-y-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start w-full">
                        {selectedUser ? (
                            <div className="flex gap-2 items-center">
                                {/* Avatar e nome do usuário selecionado */}
                                <Avatar
                                    name={selectedUser?.email}
                                    src={selectedUser?.avatar ?? ""}
                                    size={24}
                                    shape="circle"
                                    fallbackBackgroundColor="#FCBE1D"
                                    className="!text-base capitalize"
                                />
                                <p>{selectedUser.name}</p>
                            </div>
                        ) : (
                            <span className="flex gap-2">
                                <User2 size={16} />
                                {label}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[250px]" side="bottom" align="center">
                    <Command>
                        <CommandInput placeholder="Buscar usuário..." />
                        <CommandList>
                            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                            <CommandGroup>
                                {users.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={String(user.name)}
                                        onSelect={() => {
                                            setSelectedUser(user); // Atualiza o estado interno
                                            setOpen(false); // Fecha o popover

                                            if (onChange) {
                                                onChange(user); // Chama o onChange com o usuário selecionado
                                            }
                                        }}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <Avatar
                                                name={user?.email}
                                                src={user?.avatar ?? ""}
                                                size={24}
                                                shape="circle"
                                                fallbackBackgroundColor="#FCBE1D"
                                                className="!text-base capitalize"
                                            />
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
    );
}
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";


import { Plus } from "lucide-react";
import { useState } from "react";

export function AddProposalDialog() {
    const [addMore, setAddMore] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="items-center gap-1">
                    <Plus size={16} />
                    <span className="hidden sm:inline-block">Adicionar</span> Proposta
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar Proposta</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    {/* Linha 1: Nome e Preço */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="nome" placeholder="Nome" />
                        <Input id="preco" placeholder="Preço" />
                    </div>

                    {/* Linha 2: Descrição */}
                    <div className="grid grid-cols-1 gap-4">
                        <Input id="descricao" placeholder="Descrição" />
                    </div>
                </div>
                <DialogFooter>
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-custom-border-200 pt-5 w-full">
                        <div
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => { setAddMore(!addMore); }}
                        >
                            <Switch checked={addMore} onCheckedChange={() => setAddMore(!addMore)} />
                            <span className="text-xs">Cadastrar mais</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" size={"sm"}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button size="sm" type="submit" loading={false}>
                                Cadastrar Serviço
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
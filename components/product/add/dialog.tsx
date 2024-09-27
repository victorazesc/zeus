import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";


import { Plus } from "lucide-react";
import { useState } from "react";

export function AddProductDialog() {
    const [addMore, setAddMore] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="items-center gap-1">
                    <Plus size={16} />
                    <span className="hidden sm:inline-block">Adicionar</span> Produto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar produto</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="descricao" placeholder="Descrição" />
                        <Input id="preco-compra" placeholder="Preço compra" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <Input id="preco-venda" placeholder="Preço venda" />
                        <Input id="lucro" placeholder="Lucro" />
                        <Input id="margem-lucro" placeholder="Margem de Lucro" />
                        <Input id="unidade" placeholder="Unidade" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="sku" placeholder="SKU" />
                        <Input id="estoque" placeholder="Estoque" />
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
                                Cadastrar Produto
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
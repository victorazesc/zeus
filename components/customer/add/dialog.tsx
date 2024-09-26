import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function AddCustomerDialog() {
    const [addMore, setAddMore] = useState(false)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="items-center gap-1">
                    <Plus size={16} />
                    <span className="hidden sm:inline-block">Adicionar</span> Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar cliente</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="name" placeholder="Nome" />
                        <Input id="cpf-cnpj" placeholder="CPF/CNPJ*" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input id="telefone" placeholder="Telefone" />
                        <Input id="celular" placeholder="Celular" />
                        <Input id="email" placeholder="Email" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <Input id="cep" placeholder="CEP" />
                        <Input id="rua" placeholder="Rua" />
                        <Input id="numero" placeholder="Numero" />
                        <Input id="bairro" placeholder="Bairro" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input id="cidade" placeholder="Cidade" />
                        <Input id="estado" placeholder="Estado" />
                    </div>
                </div>
                <DialogFooter>
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-custom-border-200 pt-5 w-full">
                        <div
                            className="flex cursor-pointer items-center gap-2"
                            onClick={() => { }}
                        >
                            <Switch onCheckedChange={()=> {setAddMore(!addMore)}} />
                            <span className="text-xs">Adicionar mais</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" size={"sm"}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button size="sm" type="submit" loading={false}>
                                Adicionar Cliente
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
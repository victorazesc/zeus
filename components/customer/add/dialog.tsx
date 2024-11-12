import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formatDocument,
  formatPhone,
  formatCep,
} from "@/helpers/common.helper";
import { customerSchema } from "@/lib/validations/customer";
import { CustomerService } from "@/services/customer.service";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/hooks/stores/use-workspace";

type CustomerFormData = z.infer<typeof customerSchema>;
const customerService = new CustomerService();

interface AddCustomerDialogProps {
  onCustomerAdded?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  showTrigger?: boolean;
}
export function AddCustomerDialog({
  onCustomerAdded,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
  showTrigger = true,
}: AddCustomerDialogProps) {
  const [addMore, setAddMore] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { currentWorkspace } = useWorkspace();

  const isControlledExternally = typeof externalIsOpen !== "undefined";

  const initialMockData = {
    name: "",
    document: "",
    mobile: "",
    phone: "",
    email: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    contactPerson: "",
    additionalInfo: "",
    gender: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialMockData,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const fetchAddressByCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("CEP não encontrado");
      const data = await response.json();
      setValue("street", data.logradouro || "");
      setValue("neighborhood", data.bairro || "");
      setValue("city", data.localidade || "");
      setValue("state", data.uf || "");
    } catch (error) {
      toast.error("Erro ao buscar o endereço.");
    }
  };

  useEffect(() => {
    // Sincronizar o estado interno com o externo apenas se for controlado externamente
    if (isControlledExternally) {
      setInternalIsOpen(externalIsOpen || false);
    }
  }, [externalIsOpen, isControlledExternally]);

  const handleOpenChange = (open: boolean) => {
    // Atualiza o estado interno e chama o setIsOpen externo se estiver presente
    setInternalIsOpen(open);
    if (isControlledExternally && externalSetIsOpen) {
      externalSetIsOpen(open);
    }
  };

  const handleCepChange = (e: any) => {
    const formattedCep = formatCep(e.target.value);
    setValue("zipCode", formattedCep);
    if (formattedCep.replace(/\D/g, "").length === 8) {
      fetchAddressByCep(formattedCep.replace(/\D/g, ""));
    }
  };

  const onSubmit = async (data: CustomerFormData) => {
    if (isSubmitting) return;
    await customerService
      .createCustomer(data)
      .then(async () => {
        toast.success("Cliente adicionado com sucesso!");
        reset();
        if (onCustomerAdded) {
          onCustomerAdded();
        }
        handleOpenChange(addMore); // Reabre o diálogo se `addMore` estiver ativo
      })
      .catch((error) => {
        toast.error("Erro ao adicionar cliente", {
          description:
            error?.error ??
            "Houve um problema ao criar o cliente. Tente novamente.",
        });
      });
  };

  return (
    <Dialog open={internalIsOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button size="sm" className="items-center gap-1">
            <Plus size={16} />
            <span className="hidden sm:inline-block">Adicionar</span> Cliente
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[800px]">
        <form>
          <DialogHeader>
            <DialogTitle>Cadastrar cliente</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome" {...register("name")} />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cpf-cnpj">CPF/CNPJ</Label>
                <Input
                  id="cpf-cnpj"
                  placeholder="CPF/CNPJ*"
                  maxLength={18}
                  {...register("document")}
                  onChange={(e) =>
                    setValue("document", formatDocument(e.target.value))
                  }
                />
                {errors.document && (
                  <p className="text-red-600 text-sm">
                    {errors.document.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gender">Gênero</Label>
                <Select
                  onValueChange={(value) => setValue("gender", value)}
                  value={watch("gender")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-600 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="mobile">Celular</Label>
                <Input
                  id="mobile"
                  placeholder="Celular"
                  maxLength={15}
                  {...register("mobile")}
                  onChange={(e) =>
                    setValue("mobile", formatPhone(e.target.value))
                  }
                />
                {errors.mobile && (
                  <p className="text-red-600 text-sm">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  placeholder="CEP"
                  maxLength={9}
                  {...register("zipCode")}
                  onChange={handleCepChange}
                />
                {errors.zipCode && (
                  <p className="text-red-600 text-sm">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="street">Rua</Label>
                <Input id="street" placeholder="Rua" {...register("street")} />
              </div>
              <div>
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  placeholder="Número"
                  {...register("number")}
                />
              </div>
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  placeholder="Bairro"
                  {...register("neighborhood")}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="Cidade" {...register("city")} />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="Estado" {...register("state")} />
              </div>
              <div>
                <Label htmlFor="additionalInfo">Complemento</Label>
                <Input
                  id="additionalInfo"
                  placeholder="Complemento"
                  {...register("additionalInfo")}
                />
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <div className="mt-5 flex items-center justify-between gap-2 border-t border-custom-border-200 pt-5 w-full">
            <div className="flex cursor-pointer items-center gap-2">
              <Switch
                checked={addMore}
                onCheckedChange={() => setAddMore(!addMore)}
              />
              <span className="text-xs">Cadastrar mais</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !isValid}
              >
                Adicionar Cliente
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

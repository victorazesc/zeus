"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ServiceService } from "@/services/service.service"; // Importe o serviço correto
import { Spinner } from "../ui/circular-spinner";
import { useServiceStoreWithSWR } from "@/store/service";
import { useService } from "@/hooks/stores/use-service";
import { Service } from "@prisma/client";

interface ServiceMultiSelectProps {
  onServicesChange: (
    services: { service: Partial<Service>; quantity: number }[]
  ) => void;
  onTotalPriceChange: (total: number) => void;
  parentSelectedServices: { service: Partial<Service>; quantity: number }[];
}

const serviceService = new ServiceService();

export function ServiceMultiSelect({
  onServicesChange,
  onTotalPriceChange,
  parentSelectedServices,
}: ServiceMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { services, isLoading } = useServiceStoreWithSWR(useService(), false, false);

  const [selectedServices, setSelectedServices] = React.useState<
    { service: Partial<Service>; quantity: number }[]
  >(parentSelectedServices);

  // Atualizar o localStorage e informar o componente pai ao alterar os serviços
  React.useEffect(() => {
    localStorage.setItem("selectedServices", JSON.stringify(selectedServices));
    onServicesChange(selectedServices);
  }, [selectedServices, onServicesChange]);

  // Detalhes dos serviços selecionados
  const selectedServiceDetails = services.filter((service) =>
    selectedServices.some((selected) => selected.service.id === service.id)
  );

  // Calcula o total dos serviços selecionados
  const totalPrice = selectedServiceDetails.reduce((acc, service) => {
    const selectedService = selectedServices.find(
      (item) => item.service.id === service.id
    );
    return acc + service.price * (selectedService?.quantity || 1);
  }, 0);

  // Atualizar o valor total no componente pai
  React.useEffect(() => {
    onTotalPriceChange(totalPrice);
  }, [totalPrice, onTotalPriceChange]);

  // Função para adicionar ou remover um serviço selecionado
  const toggleServiceSelection = (serviceValue: number) => {
    setSelectedServices(
      (prev) =>
        prev.find((item) => item.service.id === serviceValue)
          ? prev.filter((item) => item.service.id !== serviceValue) // Remove se já estiver selecionado
          : [
              ...prev,
              {
                service: services.find((s) => s.id === serviceValue)!,
                quantity: 1,
              },
            ] // Adiciona com quantidade inicial 1 se não estiver
    );
  };

  // Atualiza a quantidade de um serviço selecionado
  const updateServiceQuantity = (serviceValue: number, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((item) =>
        item.service.id === serviceValue ? { ...item, quantity } : item
      )
    );
  };

  // Remove um serviço específico da lista
  const removeService = (serviceValue: number) => {
    setSelectedServices((prev) =>
      prev.filter((item) => item.service.id !== serviceValue)
    );
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between rounded-b-none"
          >
            {selectedServices.length > 0
              ? `${selectedServices.length} serviço(s) selecionado(s)`
              : "Selecione os serviços..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Buscar serviço..." />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Spinner height="20" width="20" />
                </div>
              ) : (
                <>
                  <CommandEmpty>Nenhum serviço encontrado</CommandEmpty>
                  <CommandGroup>
                    {services.map((service) => (
                      <CommandItem
                        key={service.id}
                        value={service.name}
                        onSelect={() => toggleServiceSelection(service.id)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedServices.some(
                              (selected) => selected.service.id === service.id
                            )
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {service.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Exibição dos serviços selecionados em formato de tabela */}

      {isLoading ? (
        <div
          className="border border-t-0 rounded shadow-sm -mt-1 border-custom-border-200"
          style={{
            height: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p className="m-auto text-custom-text-400">
            <Spinner />
          </p>
        </div>
      ) : (
        <>
          {selectedServices.length > 0 ? (
            <div
              className="border border-t-0 rounded shadow-sm -mt-1 border-custom-border-200"
              style={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flexGrow: 1, overflowY: "auto" }}>
                <table className="min-w-full text-sm">
                  <thead className="bg-custom-background-100 text-custom-text-200 sticky top-0">
                    <tr>
                      <th className="py-2 px-4 text-left">Qntd</th>
                      <th className="py-2 px-4 text-left">Descrição</th>
                      <th className="py-2 px-4 text-left">Valor</th>
                      <th className="py-2 px-4 text-left">Remover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServiceDetails.map((service: Service) => {
                      const selectedService = selectedServices.find(
                        (item) => item.service.id === service.id
                      );
                      return (
                        <tr
                          key={service.id}
                          className="border-b border-custom-border-200"
                        >
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              min={1}
                              value={selectedService?.quantity ?? 1}
                              onChange={(e) =>
                                updateServiceQuantity(
                                  service.id,
                                  parseInt(e.target.value, 10) || 1
                                )
                              }
                              className="w-16 border border-custom-border-200 rounded px-1 text-center bg-custom-background-100"
                            />
                          </td>
                          <td className="py-2 px-4">{service.name}</td>
                          <td className="py-2 px-4">
                            R${" "}
                            {(
                              service.price * (selectedService?.quantity || 1)
                            ).toFixed(2)}
                          </td>
                          <td className="py-2 px-4 text-center">
                            <button onClick={() => removeService(service.id)}>
                              <X className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Exibir o total geral fixo abaixo da tabela */}
              <div className="py-2 px-4 text-sm text-right bg-custom-background-100 flex justify-between">
                <p>Total:</p>
                <p>R$ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div
              className="border border-t-0 rounded shadow-sm -mt-1 border-custom-border-200"
              style={{
                height: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="m-auto text-custom-text-400">
                Nenhum serviço selecionado.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

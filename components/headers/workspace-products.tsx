import { Search, ShoppingCart, UsersIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { BreadcrumbLink } from "../shared/breadcrumb-link";
import { Breadcrumbs } from "../ui/breadcrumbs";
import { cn } from "@/lib/utils";
import { AddProductDialog } from "../product/add/dialog";

export const ProductsHeader = observer(({ searchValue, setSearchValue }:any) => {
  return (
    <div className="relative z-10 flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 p-4">
      <div className="flex flex-grow items-center gap-2 overflow-ellipsis whitespace-nowrap">
        <div>
          <Breadcrumbs>
            <Breadcrumbs.BreadcrumbItem
              type="text"
              link={
                <BreadcrumbLink
                  label="Produtos"
                  icon={<ShoppingCart className="h-4 w-4 text-custom-text-300" />}
                />
              }
            />
          </Breadcrumbs>
        </div>
      </div>

      <div className="flex w-full max-w-xs items-center justify-end gap-3 sm:max-w-md">
        <div
          className={cn(
            "ml-auto flex items-center justify-start gap-1 rounded-md border border-transparent bg-custom-background-100 text-custom-text-400 w-0 transition-[width] ease-linear overflow-hidden opacity-0",
            {
              "w-64 px-2.5 py-1.5 border-custom-border-200 opacity-100": true,
            }
          )}
        >
          <Search className="h-3.5 w-3.5" />
          <input
            className="w-full max-w-[234px] border-none bg-transparent text-sm text-custom-text-100 focus:outline-none"
            placeholder="Buscar Produto"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <AddProductDialog/>
      </div>
    </div>
  );
});
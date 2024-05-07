import { Plus, UsersIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { BreadcrumbLink } from "../shared/breadcrumb-link";
import { Breadcrumbs } from "../ui/breadcrumbs";
import { Button } from "../ui/button";


export const ClientsHeader = observer(() => {
  return (
    <div className="relative z-10 flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
      <div className="flex flex-grow items-center gap-2 overflow-ellipsis whitespace-nowrap">
        <div>
          <Breadcrumbs>
            <Breadcrumbs.BreadcrumbItem
              type="text"
              link={<BreadcrumbLink label="Clientes" icon={<UsersIcon className="h-4 w-4 text-custom-text-300" />} />}
            />
          </Breadcrumbs>
        </div>
      </div>
      <div className="w-full flex items-center justify-end gap-3">
        <Button
          size="sm"
          className="items-center gap-1"
        >
          <Plus size={16} /> <span className="hidden sm:inline-block"> Add</span> Cliente
        </Button>
      </div>
    </div>
  );
});

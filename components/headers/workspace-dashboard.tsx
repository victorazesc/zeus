import { Github, LayoutGrid } from "lucide-react";
import { BreadcrumbLink } from "../shared/breadcrumb-link";
import { Breadcrumbs } from "../ui/breadcrumbs";

export const WorkspaceDashboardHeader = () => {
  return (
    <div className="w-full">
      <div className="px-0 relative flex w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 bg-custom-sidebar-background-100 z-[18]">
        <div className="flex flex-wrap items-center gap-2 overflow-ellipsis whitespace-nowrap max-w-[80%]">
          <Breadcrumbs>
            <Breadcrumbs.BreadcrumbItem
              type="text"
              link={
                <BreadcrumbLink
                  label="Dashboard"
                  icon={<LayoutGrid className="h-4 w-4 text-custom-text-300" />}
                />
              }
            />
          </Breadcrumbs>
        </div>
        <div className="flex justify-end gap-3 w-auto items-start">
          <a
            className="flex flex-shrink-0 items-center gap-1.5 rounded bg-custom-background-80 px-3 py-1.5"
            href="https://github.com/makezeus/zeus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <span className="hidden text-xs font-medium sm:hidden md:block">
              Star us on GitHub
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

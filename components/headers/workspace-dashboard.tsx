import { Github, LayoutGrid } from "lucide-react";
import { BreadcrumbLink } from "../shared/breadcrumb-link";
import { Breadcrumbs } from "../ui/breadcrumbs";

export const WorkspaceDashboardHeader = () => {
  return (
    <>
      <div className="relative z-[15] flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-slate-900 p-4">
        <div className="flex items-center gap-2 overflow-ellipsis whitespace-nowrap">
          <div>
            <Breadcrumbs>
              <Breadcrumbs.BreadcrumbItem
                type="text"
                link={
                  <BreadcrumbLink label="Dashboard" icon={<LayoutGrid className="h-4 w-4 text-custom-text-300" />} />
                }
              />
            </Breadcrumbs>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3">
          <a
            className="flex flex-shrink-0 items-center gap-1.5 rounded bg-custom-background-80 px-3 py-1.5"
            href="https://github.com/makezeus/zeus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <span className="hidden text-xs font-medium sm:hidden md:block">Star us on GitHub</span>
          </a>
        </div>
      </div>
    </>
  );
};

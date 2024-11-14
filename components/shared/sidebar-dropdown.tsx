import { useUser } from "@/hooks/stores/use-user";
import { useWorkspace } from "@/hooks/stores/use-workspace";
import { IWorkspace } from "@/types/workspace";
import { Menu, Transition } from "@headlessui/react";
import { Check, ChevronDown, CircleUserRound, LoaderCircle, LogOut, Mails, PlusSquare, Settings, UserCircle2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { usePopper } from "react-popper";
import { toast } from "sonner";
import { mutate } from "swr";
import { Avatar } from "../ui/avatar";
import { Loader } from "../ui/loader";
import { Skeleton } from "../ui/skeleton";
import { AuthService } from "@/services/auth.service";
const userLinks = (workspaceSlug: string, userId: number | null) => [
  {
    key: "workspace_invites",
    name: "Convites",
    href: "/invitations",
    icon: Mails,
  },
  {
    key: "my_activity",
    name: "Minha Atividade",
    href: `/${workspaceSlug}/profile/${userId}`,
    icon: CircleUserRound,
  },
  {
    key: "settings",
    name: "Configurações",
    href: `/${workspaceSlug}/settings`,
    icon: Settings,
  },
];
const profileLinks = (workspaceSlug: string, userId: number | null) => [
  {
    name: "Minha Atividade",
    icon: UserCircle2,
    link: `/${workspaceSlug}/profile/${userId}`,
  },
  {
    name: "Configurações",
    icon: Settings,
    link: "/profile",
  },
];

const authService = new AuthService()

export const WorkspaceSidebarDropdown = observer(() => {
  const { workspaceSlug } = useParams()
  const router = useRouter()
  const { currentUser, isUserInstanceAdmin, updateCurrentUser } = useUser();
  const { currentWorkspace: activeWorkspace, workspaces } = useWorkspace();

  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          padding: 12,
        },
      },
    ],
  });
  const handleWorkspaceNavigation = (workspace: IWorkspace) =>
    updateCurrentUser({
      lastWorkspaceId: workspace.id
    });

  const workspacesList = Object.values(workspaces ?? {});

  const handleSignOut = async () => {
    await authService.signOut()
      .then(() => {
        mutate("CURRENT_USER_DETAILS", null)
        router.push("/");
      })
      .catch(() =>
        toast.error("Ah, não! algo deu errado.", {
          description: "Falha ao sair da conta. Por Favor tente novamente.",
        })
      );
  };

  return (
    <div className="flex items-center gap-x-3 gap-y-2 px-4 pt-4">
      <Menu as="div" className="relative h-full flex-grow truncate text-left">
        {({ open }) => (
          <>
            <Menu.Button className="group/menu-button h-full w-full truncate rounded-md text-sm font-medium text-custom-sidebar-text-200 hover:bg-custom-sidebar-background-80 focus:outline-none">
              <div
                className={`flex items-center  gap-x-2 truncate rounded p-1 justify-between`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className={`relative grid h-6 w-6 flex-shrink-0 place-items-center uppercase ${!activeWorkspace?.logo && "rounded bg-custom-primary-1000 text-white"
                      }`}
                  >
                    {activeWorkspace?.logo && activeWorkspace.logo !== "" ? (
                      <img
                        src={activeWorkspace.logo}
                        className="absolute left-0 top-0 h-full w-full rounded object-cover"
                        alt="Workspace Logo"
                      />
                    ) : (
                      activeWorkspace?.name?.charAt(0) ?? <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}
                  </div>

                  <h4 className="truncate text-base font-medium text-custom-text-100">
                    {activeWorkspace?.name ? activeWorkspace.name : <Skeleton className="w-36 h-6"></Skeleton>}
                  </h4>

                </div>

                <ChevronDown
                  className={`mx-1 hidden h-4 w-4 flex-shrink-0 group-hover/menu-button:block ${open ? "rotate-180" : ""
                    } text-custom-sidebar-text-400 duration-300`}
                />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items as={Fragment}>
                <div className="fixed left-4 z-20 mt-1 flex w-full max-w-[19rem] origin-top-left flex-col rounded-md border-[0.5px] border-custom-border-200 bg-custom-background-100 shadow-lg divide-y divide-custom-border-200 outline-none">
                  <div className="flex max-h-96 flex-col items-start justify-start gap-2 overflow-y-scroll mb-2 px-4 vertical-scrollbar scrollbar-sm">
                    <h6 className="sticky top-0 z-10 h-full w-full pt-3 pb-1 text-sm font-medium text-custom-sidebar-text-400">
                      {currentUser?.email}
                    </h6>
                    {workspacesList ? (
                      <div className="flex h-full w-full flex-col items-start justify-start gap-1.5">
                        {workspacesList.length > 0 &&
                          workspacesList.map((workspace) => (
                            <Link
                              key={workspace.id}
                              href={`/${workspace.slug}`}
                              onClick={() => {
                                handleWorkspaceNavigation(workspace);

                              }}
                              className="w-full"
                            >
                              <Menu.Item
                                as="div"
                                className="flex items-center justify-between gap-1 rounded p-1 text-sm text-custom-sidebar-text-100 hover:bg-custom-sidebar-background-80"
                              >
                                <div className="flex items-center justify-start gap-2.5 truncate">
                                  <span
                                    className={`relative flex h-6 w-6 flex-shrink-0 items-center  justify-center p-2 text-xs uppercase ${!workspace?.logo && "rounded bg-custom-primary-1000 text-white"
                                      }`}
                                  >
                                    {workspace?.logo && workspace.logo !== "" ? (
                                      <img
                                        src={workspace.logo}
                                        className="absolute left-0 top-0 h-full w-full rounded object-cover"
                                        alt="Workspace Logo"
                                      />
                                    ) : (
                                      workspace?.name?.charAt(0) ?? <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                  </span>
                                  <h5
                                    className={`truncate text-sm font-medium ${workspaceSlug === workspace.slug ? "" : "text-custom-text-200"
                                      }`}
                                  >
                                    {workspace.name}
                                  </h5>
                                </div>
                                {workspace.id === activeWorkspace?.id && (
                                  <span className="flex-shrink-0 p-1">
                                    <Check className="h-5 w-5 text-custom-sidebar-text-100" />
                                  </span>
                                )}
                              </Menu.Item>
                            </Link>
                          ))}
                      </div>
                    ) : (
                      <div className="w-full">
                        <Loader className="space-y-2">
                          <Loader.Item height="30px" />
                          <Loader.Item height="30px" />
                        </Loader>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col items-start justify-start gap-2 px-4 py-2 text-sm">
                    <Link href="/create-workspace" className="w-full">
                      <Menu.Item
                        as="div"
                        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-custom-sidebar-text-100 hover:bg-custom-sidebar-background-80 font-medium"
                      >
                        <PlusSquare strokeWidth={1.75} className="h-4 w-4 flex-shrink-0" />
                        Criar espaço de trabalho
                      </Menu.Item>
                    </Link>
                    {userLinks(workspaceSlug?.toString() ?? "", currentUser?.id ?? null).map((link, index) => (
                      <Link
                        key={link.key}
                        href={link.href}
                        className="w-full"
                      >
                        <Menu.Item
                          as="div"
                          className="flex items-center gap-2 rounded px-2 py-1 text-sm text-custom-sidebar-text-200 hover:bg-custom-sidebar-background-80 font-medium"
                        >
                          <link.icon className="h-4 w-4 flex-shrink-0" />
                          {link.name}
                        </Menu.Item>
                      </Link>
                    ))}
                  </div>
                  <div className="w-full px-4 py-2">
                    <Menu.Item
                      as="button"
                      type="button"
                      className="w-full flex items-center gap-2 rounded px-2 py-1 text-sm text-red-600 hover:bg-custom-sidebar-background-80 font-medium"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      Sair
                    </Menu.Item>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>

      <Menu as="div" className="relative flex-shrink-0">
        <Menu.Button className="grid place-items-center outline-none" ref={setReferenceElement}>
          <Avatar
            name={currentUser?.username ?? ''}
            src={currentUser?.avatar ?? ''}
            size={24}
            shape="square"
            className="!text-base"
          />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute left-0 z-20 mt-1 flex w-52 origin-top-left  flex-col divide-y
          divide-custom-border-200 rounded-md border border-custom-border-200 bg-custom-background-100 px-1 py-2 text-xs shadow-lg outline-none"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div className="flex flex-col gap-2.5 pb-2">
              <span className="px-2 text-custom-sidebar-text-200">{currentUser?.email}</span>
              {profileLinks(workspaceSlug?.toString() ?? "", currentUser?.id ?? null).map((link, index) => (
                <Link
                  key={index}
                  href={link.link}
                >
                  <Menu.Item key={index} as="div">
                    <span className="flex w-full items-center gap-2 rounded px-2 py-1 hover:bg-custom-sidebar-background-80">
                      <link.icon className="h-4 w-4 stroke-[1.5]" />
                      {link.name}
                    </span>
                  </Menu.Item>
                </Link>
              ))}
            </div>
            <div className={`pt-2 ${isUserInstanceAdmin ? "pb-2" : ""}`}>
              <Menu.Item
                as="button"
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1 hover:bg-custom-sidebar-background-80"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 stroke-[1.5]" />
                Sair
              </Menu.Item>
            </div>
            {isUserInstanceAdmin && (
              <div className="p-2 pb-0">
                <Link href="/god-mode">
                  <Menu.Item as="button" type="button" className="w-full">
                    <span className="flex w-full items-center justify-center rounded bg-custom-primary-100/20 px-2 py-1 text-sm font-medium text-custom-primary-100 hover:bg-custom-primary-100/30 hover:text-custom-primary-200">
                      Enter God Mode
                    </span>
                  </Menu.Item>
                </Link>
              </div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>

    </div>
  );
});

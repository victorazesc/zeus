import { CircleCheck, CircleCheckIcon, CircleDashed, CircleDot, CircleEllipsis, CircleX, Disc, LucideIcon } from "lucide-react";

export interface ProposalStatusType {
    key: Status,
    label: string,
    icon: LucideIcon;
    color: string;
}

export enum Status {
    OPEN = "open",
    SERVICE_ORDER = "service-order",
    BUDGET = "budget",
    IN_PROGRESS = "in-progress",
    INVOICED = "invoiced",
    CANCELLED = "canceled",
    FINISHED = "finished",
}





const proposalStatus = {
    [Status.OPEN]: {
        key: Status.OPEN,
        label: "Aberto",
        icon: CircleDashed,
        color: "green",
    },
    [Status.SERVICE_ORDER]: {
        key: Status.SERVICE_ORDER,
        label: "Orden de Serviço",
        icon: Disc,
        color: "purple",
    },
    [Status.BUDGET]: {
        key: Status.BUDGET,
        label: "Orçamento",
        icon: CircleDot,
        color: "yellow",
    },
    [Status.IN_PROGRESS]: {
        key: Status.IN_PROGRESS,
        label: "Em Andamento",
        icon: CircleEllipsis,
        color: "blue",
    },
    [Status.INVOICED]: {
        key: Status.INVOICED,
        label: "Faturado",
        icon: CircleCheck,
        color: "pink",
    },
    [Status.CANCELLED]: {
        key: Status.CANCELLED,
        label: "Cancelado",
        icon: CircleX,
        color: "red",
    },
    [Status.FINISHED]: {
        key: Status.FINISHED,
        label: "Finalizado",
        icon: CircleCheckIcon,
        color: "gray",
    },
} as const

export const PROPOSAL_STATUS: Record<Status, ProposalStatusType> = proposalStatus;
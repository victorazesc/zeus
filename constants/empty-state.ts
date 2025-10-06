export interface EmptyStateDetails {
  key: EmptyStateType;
  title?: string;
  description?: string;
  path?: string;
  primaryButton?: {
    icon?: React.ReactNode;
    text: string;
    comicBox?: {
      title?: string;
      description?: string;
    };
  };
  secondaryButton?: {
    icon?: React.ReactNode;
    text: string;
    comicBox?: {
      title?: string;
      description?: string;
    };
  };
  accessType?: "workspace" | "project";
}

export enum EmptyStateType {
  CUSTOMER = "customer",
  PRODUCT = "product",
  SERVICE = "service",
  PROPOSAL = "proposal",
}

const emptyStateDetails = {
  // customers
  [EmptyStateType.CUSTOMER]: {
    key: EmptyStateType.CUSTOMER,
    title: "Nenhum cliente foi encontrado",
    description:
      "você não possui nenhum cliente em sua base de dados, Adicione para começar a criar projetos.",
    path: "/empty-state/empty-customer",
    primaryButton: {
      text: "Adicionar um novo cliente",
    },

    accessType: "workspace",
  },
  [EmptyStateType.PRODUCT]: {
    key: EmptyStateType.PRODUCT,
    title: "Nenhum produto foi encontrado",
    description:
      "você não possui nenhum produto em sua base de dados, Adicione para começar a criar projetos.",
    path: "/empty-state/empty-product",
    primaryButton: {
      text: "Adicionar um novo produto",
    },

    accessType: "workspace",
  },
  [EmptyStateType.SERVICE]: {
    key: EmptyStateType.SERVICE,
    title: "Nenhum serviço foi encontrado",
    description:
      "você não possui nenhum serviço em sua base de dados, Adicione para começar a criar projetos.",
    path: "/empty-state/empty-service",
    primaryButton: {
      text: "Adicionar um novo serviço",
    },

    accessType: "workspace",
  },
  [EmptyStateType.PROPOSAL]: {
    key: EmptyStateType.PROPOSAL,
    title: "Nenhuma proposta foi encontrada",
    description: "você não possui nenhuma proposta em sua base de dados.",
    path: "/empty-state/empty-service",
    primaryButton: {
      text: "Adicionar uma nova proposta",
    },

    accessType: "workspace",
  },
} as const;

export const EMPTY_STATE_DETAILS: Record<EmptyStateType, EmptyStateDetails> =
  emptyStateDetails;

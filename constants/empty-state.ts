
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

} as const;

export const EMPTY_STATE_DETAILS: Record<EmptyStateType, EmptyStateDetails> = emptyStateDetails;

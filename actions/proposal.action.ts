const proposalsMock: Partial<Proposal>[] = [
  {
    id: 1,
    customer: {
      id: 1,
      name: "John Doe",
      email: "johndoe@gmail.com",
      username: "johndoe",
      avatar: "",
    },
    user: {
      id: 14,
      name: "Victor Henrique de Azevedo",
      email: "victorazesc@gmail.com",
      username: "victorazesc",
      avatar: "https://plane-ns-saks.s3.amazonaws.com/user-7e779a686a0c4b57b0bd2029f54d597f-6291E04A-E9D9-463E-AAEB-4E917166F658.jpeg",
    },
    description: "Proposta para instalação de sistema de segurança residencial.",
    technicalReport: "Laudo técnico detalhado para instalação de sistema de segurança.",
    discount: 200,
    products: [
      {
        quantity: 2,
        product: {
          id: 1,
          description: "Sirene Intelbras",
          category: "Segurança",
          brand: "Intelbras",
          sku: "SIR-INT-001",
          supplier: "Fornecedor A",
          stock: 9999,
          cost_price: 30.0,
          sell_price: 60.0,
          earn: 30.0,
          weight: "0.5 kg",
          dimensions: "10x10x5 cm",
        }
      },
    ],
    services: [
      {
        quantity: 2,
        service: {
          id: 1,
          name: "Instalação de Sirene",
          description: "Serviço de instalação de Sirene",
          price: 200,
          duration: "2 horas",
          category: "Instalação de Equipamentos",
        },
      }
    ],
    status: "open", // Status distribuído conforme os tipos fornecidos
    initialDate: new Date("2024-09-28"),
    finalDate: new Date("2024-10-10"),
    value: 25000,
    earn: 10000,
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: index + 2,
    customer: {
      id: index + 2,
      name: `Cliente ${index + 2}`,
      email: `cliente${index + 2}@email.com`,
      username: `cliente${index + 2}`,
      avatar: "",
    },
    user: {
      id: 14,
      name: "Victor Henrique de Azevedo",
      email: "victorazesc@gmail.com",
      username: "victorazesc",
      avatar: "https://plane-ns-saks.s3.amazonaws.com/user-7e779a686a0c4b57b0bd2029f54d597f-6291E04A-E9D9-463E-AAEB-4E917166F658.jpeg",
    },
    description: `Descrição da proposta ${index + 2}`,
    technicalReport: `Laudo técnico detalhado para proposta ${index + 2}`,
    discount: 100 + index * 10,
    products: [
      {
        quantity: 2,
        product: {
          id: 1,
          description: "Sirene Intelbras",
          category: "Segurança",
          brand: "Intelbras",
          sku: "SIR-INT-001",
          supplier: "Fornecedor A",
          stock: 9999,
          cost_price: 30.0,
          sell_price: 60.0,
          earn: 30.0,
          weight: "0.5 kg",
          dimensions: "10x10x5 cm",
        }
      },
    ],
    services: [
      {
        quantity: 2,
        service: {
          id: 1,
          name: "Instalação de Sirene",
          description: "Serviço de instalação de Sirene",
          price: 200,
          duration: "2 horas",
          category: "Instalação de Equipamentos",
        },
      }
    ],
    status: ["open", "service-order", "budget", "in-progress", "invoiced", "canceled", "finished"][
      index % 7
    ], // Alterna os status entre as propostas
    initialDate: new Date(`2024-09-2${index + 1}`),
    finalDate: new Date(`2024-10-${index + 10}`),
    value: 25000 + index * 1000,
    earn: 10000 + index * 500,
  })),
];

export async function getProposals(): Promise<Partial<Proposal>[] | null> {
  return proposalsMock
}
export async function createProposal(data: Partial<Proposal>): Promise<Partial<Proposal> | null> {
  proposalsMock.unshift({ ...data, id: proposalsMock.length + 1 })
  return data
}
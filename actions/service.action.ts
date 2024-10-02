const servicesMock: Partial<Service>[] = [
  {
    id: 1,
    name: 'Instalação de Sirene',
    description: 'Serviço de instalação de Sirene',
    price: 200,
    duration: '2 horas',
    category: 'Instalação de Equipamentos',
  },
  {
    id: 2,
    name: 'Manutenção de Câmera',
    description: 'Serviço de manutenção preventiva de câmera de segurança',
    price: 150,
    duration: '1 hora',
    category: 'Manutenção',
  },
  {
    id: 3,
    name: 'Instalação de Central de Alarme',
    description: 'Instalação completa de uma central de alarme residencial ou comercial',
    price: 300,
    duration: '3 horas',
    category: 'Instalação de Equipamentos',
  },
  {
    id: 4,
    name: 'Configuração de DVR',
    description: 'Serviço de configuração e ajustes de DVR para gravação de câmeras',
    price: 120,
    duration: '1.5 horas',
    category: 'Configuração',
  },
  {
    id: 5,
    name: 'Instalação de Câmeras',
    description: 'Instalação de até 4 câmeras de segurança',
    price: 500,
    duration: '5 horas',
    category: 'Instalação de Equipamentos',
  },
  {
    id: 6,
    name: 'Instalação de Fechadura Eletrônica',
    description: 'Serviço de instalação de fechaduras eletrônicas e configuração de senha',
    price: 250,
    duration: '2 horas',
    category: 'Instalação de Equipamentos',
  },
  {
    id: 7,
    name: 'Teste e Verificação de Equipamentos',
    description: 'Teste de equipamentos de segurança e verificação de funcionamento',
    price: 100,
    duration: '1 hora',
    category: 'Manutenção',
  },
  {
    id: 8,
    name: 'Consultoria de Segurança',
    description: 'Análise e consultoria de segurança para residências e empresas',
    price: 400,
    duration: '4 horas',
    category: 'Consultoria',
  },
  {
    id: 9,
    name: 'Instalação de Controle de Acesso',
    description: 'Instalação de sistemas de controle de acesso para portas e portões',
    price: 350,
    duration: '3 horas',
    category: 'Instalação de Equipamentos',
  },
  {
    id: 10,
    name: 'Reparo de Fiação',
    description: 'Reparo e manutenção de fiação para sistemas de segurança',
    price: 180,
    duration: '2 horas',
    category: 'Manutenção',
  }
];

export async function getServices(): Promise<Partial<Service>[] | null> {
  return servicesMock
}
export async function createService(data: Partial<Service>): Promise<Partial<Service> | null> {
  servicesMock.unshift({ ...data, id: servicesMock.length + 1 })
  return data
}
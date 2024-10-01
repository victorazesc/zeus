const productsMock: Partial<Product>[] = [
  {
    "id": 1,
    "description": "Sirene Intelbras",
    "category": "Segurança",
    "brand": "Intelbras",
    "sku": "SIR-INT-001",
    "supplier": "Fornecedor A",
    "stock": 9999,
    "cost_price": 30.0,
    "sell_price": 60.0,
    "earn": 30.0,
    "weight": "0.5 kg",
    "dimensions": "10x10x5 cm"
  },
  {
    "id": 2,
    "description": "Câmera de Segurança",
    "category": "Segurança",
    "brand": "Hikvision",
    "sku": "CAM-HIK-002",
    "supplier": "Fornecedor B",
    "stock": 500,
    "cost_price": 150.0,
    "sell_price": 300.0,
    "earn": 150.0,
    "weight": "1.2 kg",
    "dimensions": "15x15x10 cm"
  },
  {
    "id": 3,
    "description": "Sensor de Movimento",
    "category": "Segurança",
    "brand": "Intelbras",
    "sku": "SEN-INT-003",
    "supplier": "Fornecedor A",
    "stock": 1200,
    "cost_price": 50.0,
    "sell_price": 100.0,
    "earn": 50.0,
    "weight": "0.3 kg",
    "dimensions": "8x8x5 cm"
  },
  {
    "id": 4,
    "description": "Controle Remoto para Alarme",
    "category": "Acessórios",
    "brand": "JFL",
    "sku": "CON-JFL-004",
    "supplier": "Fornecedor C",
    "stock": 700,
    "cost_price": 20.0,
    "sell_price": 40.0,
    "earn": 20.0,
    "weight": "0.1 kg",
    "dimensions": "5x5x2 cm"
  },
  {
    "id": 5,
    "description": "Central de Alarme",
    "category": "Segurança",
    "brand": "Intelbras",
    "sku": "CEN-INT-005",
    "supplier": "Fornecedor A",
    "stock": 300,
    "cost_price": 200.0,
    "sell_price": 400.0,
    "earn": 200.0,
    "weight": "1.5 kg",
    "dimensions": "20x20x10 cm"
  },
  {
    "id": 6,
    "description": "Kit DVR com 4 Câmeras",
    "category": "Segurança",
    "brand": "Hikvision",
    "sku": "KIT-HIK-006",
    "supplier": "Fornecedor B",
    "stock": 150,
    "cost_price": 800.0,
    "sell_price": 1600.0,
    "earn": 800.0,
    "weight": "4 kg",
    "dimensions": "40x40x20 cm"
  },
  {
    "id": 7,
    "description": "Fechadura Eletrônica",
    "category": "Segurança",
    "brand": "Yale",
    "sku": "FECH-YAL-007",
    "supplier": "Fornecedor D",
    "stock": 80,
    "cost_price": 300.0,
    "sell_price": 600.0,
    "earn": 300.0,
    "weight": "2 kg",
    "dimensions": "25x15x5 cm"
  },
  {
    "id": 8,
    "description": "Fonte de Alimentação 12V",
    "category": "Acessórios",
    "brand": "Multilaser",
    "sku": "FON-MUL-008",
    "supplier": "Fornecedor E",
    "stock": 1000,
    "cost_price": 25.0,
    "sell_price": 50.0,
    "earn": 25.0,
    "weight": "0.2 kg",
    "dimensions": "10x8x5 cm"
  },
  {
    "id": 9,
    "description": "Cabo Coaxial 100m",
    "category": "Acessórios",
    "brand": "Condutti",
    "sku": "CAB-CON-009",
    "supplier": "Fornecedor F",
    "stock": 200,
    "cost_price": 100.0,
    "sell_price": 200.0,
    "earn": 100.0,
    "weight": "3 kg",
    "dimensions": "30x30x10 cm"
  },
  {
    "id": 10,
    "description": "Sirene de Emergência",
    "category": "Segurança",
    "brand": "JFL",
    "sku": "SIR-JFL-010",
    "supplier": "Fornecedor C",
    "stock": 500,
    "cost_price": 40.0,
    "sell_price": 80.0,
    "earn": 40.0,
    "weight": "0.7 kg",
    "dimensions": "12x12x8 cm"
  }
];

export async function getProducts(): Promise<Partial<Product>[] | null> {
  console.log(productsMock)
  return productsMock
}
export async function createProduct(data: Partial<Product>): Promise<Partial<Product> | null> {
  productsMock.unshift({ ...data, id: productsMock.length + 1 })
  return data
}
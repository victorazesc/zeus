interface Product {
    id: number;                // ID único do produto
    description: string;       // Descrição do produto
    category: string;          // Categoria do produto
    brand: string;             // Marca do produto
    sku: string;               // Código SKU do produto
    supplier: string;          // Fornecedor do produto
    stock: number;             // Quantidade em estoque
    cost_price: number;        // Preço de custo
    sell_price: number;        // Preço de venda
    earn: number;              // Lucro por unidade
    weight: string;            // Peso do produto
    dimensions: string;        // Dimensões do produto
}
const customersMock: Partial<Customer>[] = [
    {
        id: 1,
        name: "Jane Doe",
        email: "janedoe@gmail.com",
        document: "12345678901",
        phone: "11987654321",
        cep: "01001000",
        address: "Rua das Flores",
        number: "123",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        complement: "Apartamento 101",
    },
    {
        id: 2,
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "98765432100",
        phone: "21987654321",
        cep: "20040002",
        address: "Avenida Rio Branco",
        number: "456",
        neighborhood: "Centro",
        city: "Rio de Janeiro",
        state: "RJ",
        complement: "Sala 305",
    },
    {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@gmail.com",
        document: "45612378902",
        phone: "31987654321",
        cep: "30120040",
        address: "Rua da Bahia",
        number: "789",
        neighborhood: "Lourdes",
        city: "Belo Horizonte",
        state: "MG",
        complement: "Cobertura",
    },
    {
        id: 4,
        name: "Bob Smith",
        email: "bob.smith@gmail.com",
        document: "78945612300",
        phone: "41987654321",
        cep: "80010050",
        address: "Rua XV de Novembro",
        number: "321",
        neighborhood: "Centro",
        city: "Curitiba",
        state: "PR",
        complement: "Loja 12",
    },
    {
        id: 5,
        name: "Charlie Brown",
        email: "charlie.brown@gmail.com",
        document: "12378945601",
        phone: "51987654321",
        cep: "90040002",
        address: "Rua dos Andradas",
        number: "654",
        neighborhood: "Centro Histórico",
        city: "Porto Alegre",
        state: "RS",
        complement: "Prédio B",
    },
    {
        id: 6,
        name: "Daniel Anderson",
        email: "daniel.anderson@gmail.com",
        document: "98732165400",
        phone: "61987654321",
        cep: "70040902",
        address: "Esplanada dos Ministérios",
        number: "S/N",
        neighborhood: "Zona Cívico-Administrativa",
        city: "Brasília",
        state: "DF",
        complement: "Bloco C",
    },
];

export async function getCustomers(): Promise<Partial<Customer>[] | null> {
    return customersMock
}
export async function createCustomer(data: Partial<Customer>): Promise<Partial<Customer> | null> {
    customersMock.unshift({ ...data, id: customersMock.length + 1 })
    return data
}
export async function updateCustomer(data: Partial<Customer>, customerId: number): Promise<Partial<Customer> | null> {
    let customerIndex = customersMock.findIndex((customer) => customer.id === customerId);
    if (customerIndex !== -1) {
        customersMock[customerIndex] = { ...customersMock[customerIndex], ...data };
        console.log(customersMock[customerIndex]); // Mostra o cliente atualizado
    }
    return data
}
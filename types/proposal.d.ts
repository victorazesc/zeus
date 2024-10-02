interface Proposal {
    id: number
    customer: Partial<User>
    user: Partial<User>
    status: Status
    initialDate: Date
    finalDate: Date
    description: string
    technicalReport: string
    value: number
    earn: number
    products: {
        quantity: number,
        product: Partial<Product>
    }[]

    services: {
        quantity: number,
        service: Service
    }[]
    discount: number
}
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
        description?: string
        cost_price?: number
        sell_price?: number
        earn?: number
        profitMargin?: number
    }[]

    services: {
        quantity: number,
        service: Service
        description?: string
        price?: number
    }[]
    discount: number
}

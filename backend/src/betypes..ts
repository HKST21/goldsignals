export interface User {
    id?: number
    email: string,
    phone: string,
    password: string
}

export interface Signal {
    entryPrice: number,
    TP1: number,
    TP2: number,
    TP3: number,
    SL: number,
}
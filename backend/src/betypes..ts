export interface User {
    id?: number
    email: string,
    phone: string,
    password: string
}

export interface Signal {
    entryprice: number,
    direction: "buy" | "sell",
    tp1: number,
    tp2: number,
    tp3: number,
    sl: number,
}
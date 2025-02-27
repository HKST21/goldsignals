export interface User {
    id?: number
    email: string,
    phone: string,
    password: string
}

export interface Signal {
    timestamp: string,
    entryprice: number,
    direction: "buy" | "sell",
    tp1: number,
    tp2: number,
    tp3: number,
    sl: number,
}

export interface goldPriceObject { // interface based on data coming from API, property name gold, which has value another object, which has property usd and value number
    success: boolean,
    base: string,
    timestamp: number,
    rates: {
        USDXAU: number,
        XAU: number,
    }

}
export interface User {
    id?: number;
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

export interface tpResult {
[timestamp: string]: {
    tp1: boolean,
    tp2: boolean,
    tp3: boolean,
}

}

export interface signalResult {
    [timestamp: string]: number
}
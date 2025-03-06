// Deklarace pro moduly bez typových definic
declare module 'express';
declare module 'cors';
declare module 'pg';

// Deklarace pro globální objekty
declare namespace NodeJS {
    interface Timeout {}
    interface Process {
        env: {
            [key: string]: string | undefined;
            NODE_ENV?: string;
            DATABASE_URL?: string;
            METAL_PRICE_KEY_GOLD?: string;
            PORT?: string;
        }
    }
}

// Ujištění, že globální proměnné budou dostupné
declare var process: NodeJS.Process;
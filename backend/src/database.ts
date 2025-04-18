import {Pool} from "pg";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Vytvoření konfigurace pro připojení k databázi
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:Admin@localhost:5432/goldsignals",
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initDatabase = async () => {
    try {
        // níže vytvářím první tabulku, parametrem je SQL dotaz v stringu
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(25) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);

        await pool.query(`CREATE TABLE IF NOT EXISTS signals (
    timestamp VARCHAR(255) UNIQUE NOT NULL,
    id SERIAL PRIMARY KEY,
    entryprice INTEGER NOT NULL,
    direction VARCHAR(255) NOT NULL,
    TP1 INTEGER NOT NULL,
    TP2 INTEGER NOT NULL,
    TP3 INTEGER NOT NULL,
    SL INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`)

        await pool.query(`CREATE TABLE IF NOT EXISTS goldprice (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`)

        console.log('TABLE CREATED SUCCESFULLY');
    }

    catch (error) {
        console.error(error)
    }
}

if (process.env.NODE_ENV !== 'production') {
    initDatabase();
} // vytvořím databází včetně první tabulky

export default pool
import {Signal, User} from "./betypes.";
import pool from "./database";

export class beClass {



    async registerUser(user: User) {

        try {
            const registeredUser = await pool.query(
                `INSERT INTO users(email, phone, password) VALUES ($1, $2, $3) RETURNING *`,
                [user.email, user.phone, user.password]
            );
            console.log("reg user from table", registeredUser.rows[0]);
            return registeredUser.rows[0];


        } catch (error) {
            console.error('error creating user: ',error);

        }


    }

    async getGoldPrice(currency: string) {

        try {

            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=${currency.toLowerCase()}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const actualGoldPrice = await response.json();

            console.log("actualGold price", actualGoldPrice);

            return actualGoldPrice;
        }

        catch (error) {
            console.error(error);
        }


    }

    async testSignal() {

        const TestSignal: Signal = {
            entryPrice: 2900,
            TP1: 2902,
            TP2: 2904,
            TP3: 2908,
            SL: 2880,
        }

        return await TestSignal;
    }
}

export const GoldbeClass = new beClass();

export default GoldbeClass;
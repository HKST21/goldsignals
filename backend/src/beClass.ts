import {User} from "./betypes.";
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

    async getGoldPrice() {

        try {

            const response = await fetch('https://www.alphavantage.co/query?function=GOLD&apikey=BJ7FEOZ8K4KW4YAG')

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
}

export const GoldbeClass = new beClass();

export default GoldbeClass;
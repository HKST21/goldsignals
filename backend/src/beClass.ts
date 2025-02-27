import {Signal, User} from "./betypes.";
import pool from "./database";

export class beClass {


    async registerUser(user: User) {

        try {
            const registeredUser = await pool.query(
                `INSERT INTO users(email, phone, password)
                 VALUES ($1, $2, $3) RETURNING *`,
                [user.email, user.phone, user.password]
            );
            console.log("reg user from table", registeredUser.rows[0]);
            return registeredUser.rows[0];


        } catch (error) {
            console.error('error creating user: ', error);

        }


    }

    async getGoldPrice(currency: string) {

        try {

            const response = await fetch(`https://api.metalpriceapi.com/v1/latest?api_key=2b5804db68a17a8bb3030df1de828473&base=${currency}&currencies=XAU`)


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();



            return data
        } catch (error) {
            console.error(error);
        }


    }

    async createSignal(text: string, timestamp: string) {

        try {
            console.log('received this data for creating signal', text);

            const cleanedText = text.toLowerCase().replace(/\s+/g, '');

            console.log('corrected text', cleanedText);

            const entrypriceMatch = cleanedText.match(/entryprice(\d+)/)?.[1];
            const directionMatch = cleanedText.includes("buy") ? "buy" : "sell";
            const tp1Match = cleanedText.match(/tp1:(\d+)/)?.[1];
            const tp2Match = cleanedText.match(/tp2:(\d+)/)?.[1];
            const tp3Match = cleanedText.match(/tp3:(\d+)/)?.[1];
            const slMatch = cleanedText.match(/sl(\d+)/)?.[1];
            if(entrypriceMatch && directionMatch && tp1Match && tp2Match && tp3Match && slMatch) {

                const signal : Signal = {
                    timestamp: timestamp,
                    entryprice: parseInt(entrypriceMatch),
                    direction: directionMatch,
                    tp1: parseInt(tp1Match),
                    tp2: parseInt(tp2Match),
                    tp3: parseInt(tp3Match),
                    sl: parseInt(slMatch),
                }

                console.log("object Signal", signal);

                const response = pool.query(
                    `INSERT INTO signals(timestamp, entryprice, direction, tp1, tp2, tp3, sl)
                                               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                    [signal.timestamp, signal.entryprice, signal.direction, signal.tp1, signal.tp2, signal.tp3, signal.sl])

                return response;
            }



        }
        catch (error) {
            console.error('error creating Signal: ', error);
            throw new Error
        }
    }

    async getTestSignal() {

        try {

            const TestSignal: Signal = {
                timestamp: "1.1.2022",
                entryprice: 2900,
                direction: "buy",
                tp1: 2902,
                tp2: 2904,
                tp3: 2908,
                sl: 2880,
            }

            console.log("test signal před vstupe do databaze", TestSignal);

            const response = await pool.query(`INSERT INTO signals(entryprice, direction, tp1, tp2, tp3, sl)
                                               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [TestSignal.entryprice, TestSignal.direction, TestSignal.tp1, TestSignal.tp2, TestSignal.tp3, TestSignal.sl]);

            console.log("Signal přímo z databáze:", response.rows[0]);
            const result = response.rows.map((row) => ({
                ...row,
                entryprice: parseInt(row.entryprice),
            }));

            console.log('returned added signal to database: ', result);

            return result

        } catch (error) {
            console.error("unable to create ", error);
        }


    }

    async getAllSignals(): Promise<Signal[]> {
        try {
            const response = await pool.query('SELECT * FROM signals');


            const signalArray = response.rows.map((row) => ({
                ...row,
                entryprice: parseInt(row.entryprice),
            }))

            return signalArray;

        }
        catch (error) {
            console.error('error creating all signals', error);
            throw new Error;
        }
    }
}

export const GoldbeClass = new beClass();

export default GoldbeClass;
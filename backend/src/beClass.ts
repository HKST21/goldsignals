import {Signal, User} from "./betypes.";
import pool from "./database";

export class beClass {

    private goldPriceIntervalId: NodeJS.Timeout | null = null;


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

    async getGoldPriceFromDb () {

        try {
            const response = await pool.query(`SELECT * FROM goldprice ORDER BY created_at DESC LIMIT 1`);

                return response.rows[0] || null;

        }
        catch (error) {
            console.error('Error getting gold price from DB:', error);
            throw error;
        }
    }

    async addGoldPriceToDB(currency: string) {
        try {
            const response = await fetch(`https://api.metalpriceapi.com/v1/latest?api_key=2b5804db68a17a8bb3030df1de828473&base=${currency}&currencies=XAU`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Jednoduchý INSERT bez RETURNING
            await pool.query(
                `INSERT INTO goldprice(price) VALUES ($1)`,
                [data.rates.USDXAU]
            );

            // Nemusíme nic vracet, protože jde jen o vložení dat
        }
        catch (error) {
            console.error('Error adding gold price to DB:', error);
            throw error;
        }
    }

    async startGoldPriceUpdates(intervalMs: number) {
        // Vytvoříme wrapper funkci pro zpracování jedné aktualizace
        const updatePrice = async () => {
            try {
                await this.addGoldPriceToDB('USD');
                console.log('Gold price successfully updated');
            } catch (error) {
                // Tady zachytíme chyby z addGoldPriceToDB
                console.error('Failed to update gold price:', error);
                // Necháme interval běžet dál i při chybě
            }
        };

        // Spustíme první aktualizaci okamžitě
        await updatePrice();

        // Nastavíme pravidelné aktualizace
        const intervalId = setInterval(updatePrice, intervalMs);

        // Uložíme ID intervalu pro případné pozdější zastavení
        this.goldPriceIntervalId = intervalId;

        return intervalId;
    }

// Přidáme metodu pro zastavení aktualizací
    stopGoldPriceUpdates() {
        if (this.goldPriceIntervalId) {
            clearInterval(this.goldPriceIntervalId);
            this.goldPriceIntervalId = null;
            console.log('Gold price updates stopped');
        }
    }




    async getGoldPrice(currency: string) {

        try {

            const response = await fetch(`https://api.metalpriceapi.com/v1/latest?api_key=2b5804db68a17a8bb3030df1de828473&base=${currency}&currencies=XAU`);

            if (response.ok) {

                const data = await response.json();

                const goldPrices = await pool.query(`INSERT INTO goldprice(price) VALUES ($1) RETURNING *`, [data.rates.USDXAU] );

                const lastPriceOfGold = goldPrices.rows[0];

                return lastPriceOfGold;
            }



            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


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
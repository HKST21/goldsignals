import {User} from "../Types/types..ts";
import {feClass} from "../Class/FeClass.ts";
import {useState, useEffect} from "react";
import {Signal} from "../Types/types..ts";


interface signalsProps {
    loggedUser: User | null;
}

interface goldPriceObject { // interface based on data coming from API, property name gold, which has value another object, which has property usd and value number
    success: boolean,
    base: string,
    timestamp: number,
    rates: {
        USDXAU: number,
        XAU: number,
    }

}


export function Signals({loggedUser}: signalsProps) {

    const [goldPrice, setGoldPrice] = useState<goldPriceObject>({
        success: false,
        base: "",
        timestamp: 0,
        rates: {
            USDXAU: 0,
            XAU: 0,
        }
    });

    const [signals, setSignals] = useState<Signal[]>([])


    useEffect(() => {
        const fetchSignals = async () => {

            try {
                const signalsFromDb = await feClass.getSignal();

                if (signalsFromDb) {
                    setSignals(signalsFromDb);
                    console.log("prvni signal", signalsFromDb)
                }
            }

            catch (e) {
                console.error("unable to fetch signals", e);
            }
        }
        const fetchGoldPrice = async () => {

            try {
                const actualPrice = await feClass.getGoldPrice('USD');


                if (actualPrice) {
                    setGoldPrice(actualPrice);
                    console.log("from end point we get this price of gold", actualPrice);
                    console.log("datový typ", typeof actualPrice);
                }



            } catch (e) {
                console.error("unable to load gold price", e);
            }


        }
        //*fetchGoldPrice();*/
        fetchSignals()
        const intervalId = setInterval(fetchGoldPrice, 600000) // vracíme ID intervalu pro cleanup

        return () => {
            clearInterval(intervalId);
        } // cleanup


    }, [])


    return (
        <div>
            <div>
                Welcome ! {loggedUser?.email}
                this is actual price of gold {goldPrice.rates.USDXAU}
            </div>

            <div>
                we have for you first signal: {signals.map((signal, id) => (
                <div key={id}>
                    <p/>
                    ENTRY PRICE {signal.entryprice}
                    <p/>
                    DIRECTION {signal.direction}
                    <p/>
                    TP1 {signal.tp1}
                    <p/>
                    TP2 {signal.tp2}
                    <p/>
                    TP3 {signal.tp3}
                    <p/>
                    SL {signal.sl}
                    <p/>
                    Respect your lot size!

                </div>
            ))}
            </div>


        </div>
    );
};


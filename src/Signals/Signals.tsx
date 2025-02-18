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
        const fetchGoldPrice = async () => {

            try {
                const actualPrice = await feClass.getGoldPrice('USD');
                const signalsFromDb = await feClass.getSignal();

                if (actualPrice) {
                    setGoldPrice(actualPrice);
                    console.log("from end point we get this price of gold", actualPrice);
                    console.log("datový typ", typeof actualPrice);
                }

                if (signalsFromDb) {
                    setSignals(signalsFromDb);
                    console.log("prvni signal", signalsFromDb)
                }

            } catch (e) {
                console.error("unable to load gold price", e);
            }


        }
        fetchGoldPrice();

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
                    {signal.entryprice}
                    <p/>
                    {signal.direction}
                    <p/>
                    {signal.tp1}
                    <p/>
                    {signal.tp2}
                    <p/>
                    {signal.tp3}
                    <p/>
                    {signal.sl}
                    <p/>

                </div>
            ))}
            </div>


        </div>
    );
};


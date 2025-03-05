import {signalResult, User} from "../Types/types.ts";
import {feClass} from "../Class/FeClass.ts";
import {useState, useEffect} from "react";
import {Signal, tpResult} from "../Types/types.ts";
import "./Signals.css"


interface signalsProps {
    loggedUser: User | null;
}


interface goldPriceObject { // interface based on data coming from API, property name gold, which has value another object, which has property usd and value number
    id?: number,
    price: number,
    created_at?: string

}


export function Signals({loggedUser}: signalsProps) {

    const [goldPrice, setGoldPrice] = useState<goldPriceObject>({
        price: 0,
    });

    const [signals, setSignals] = useState<Signal[]>([]);

    const [signalResult, setSignalResult] = useState<signalResult>({});

    const [tpResult, setTplResult] = useState<tpResult>({});


    useEffect(() => {
        const fetchSignals = async () => {

            try {
                const signalsFromDb = await feClass.getSignal();

                if (signalsFromDb) {
                    setSignals(signalsFromDb);
                    console.log("prvni signal", signalsFromDb)
                }
            } catch (e) {
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
        fetchGoldPrice()
        fetchSignals()
        const intervalId = setInterval(fetchGoldPrice, 600000) // vracíme ID intervalu pro cleanup

        return () => {
            clearInterval(intervalId);
        } // cleanup


    }, []);

    const signalProfitability = async (signal: Signal) => {


        if (signal.direction === "buy") {
            const result = goldPrice.price - signal.entryprice;
            setSignalResult(prevState =>
                ({
                    ...prevState,
                    [signal.timestamp]: result
                }));

            setTplResult(prevState => ({
                ...prevState,
                [signal.timestamp]: {
                    tp1: goldPrice.price >= signal.tp1,
                    tp2: goldPrice.price >= signal.tp2,
                    tp3: goldPrice.price >= signal.tp3,
                }
            }))

            console.log(`Result buy pozice je rozdíl ${result}USD a TP1: ${tpResult.tp1}, TP2: ${tpResult.tp2}, TP3: ${tpResult.tp3}`)

            return signal;
        } else {
            const result = signal.entryprice - goldPrice.price;
            setSignalResult(prevState => ({
                ...prevState,
                [signal.timestamp]: result
            }));

            setTplResult(prevState => ({
                    ...prevState,
                    [signal.timestamp]: {
                        tp1: goldPrice.price <= signal.tp1,
                        tp2: goldPrice.price <= signal.tp2,
                        tp3: goldPrice.price <= signal.tp3,
                    }
                }
            ))


            console.log(`Result sell pozice je rozdíl ${tpResult[signal.timestamp]}USD a TP1: ${tpResult[signal.timestamp].tp1}, TP2: ${tpResult[signal.timestamp].tp2}, TP3: ${tpResult[signal.timestamp].tp3}`);
            return signal;
        }


    }

    useEffect(() => {

        if (signals.length > 0) {

            signals.forEach((signal) => {
                signalProfitability(signal)
            })


            const intervalId = setInterval(() => {
                signals.forEach((signal) => {
                    signalProfitability(signal)
                })

            }, 5000);

            return () => clearInterval(intervalId);

        }


    }, [goldPrice.price, signals]);


    return (
        <div className={"signals-page"}>
            <div className={"welcome-message"}>
                Welcome to our GOLD signals page ! {loggedUser?.email}
                <div>This is actual price of gold: <span className="gold-price">{goldPrice.price}</span></div>
            </div>

            <div className={"signal-section"}>

                {signals.map((signal, id) => (
                <div className={"each-signal"} key={id}>
                    <p/>
                    SIGNAL DATE: {
                    new Intl.DateTimeFormat('cs-CZ', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(new Date(signal.timestamp))
                }
                    <p/>
                    ENTRY PRICE {signal.entryprice}
                    <p/>
                    DIRECTION {signal.direction}
                    <p/>

                    <p/>
                    TP1 {signal.tp1} {tpResult[signal.timestamp]?.tp1 === false ? "❌" : "✅"}
                    <p/>
                    TP2 {signal.tp2} {tpResult[signal.timestamp]?.tp2 === false ? "❌" : "✅"}
                    <p/>
                    TP3 {signal.tp3} {tpResult[signal.timestamp]?.tp3 === false ? "❌" : "✅"}
                    <p/>
                    SL {signal.sl}
                    <p/>
                    Respect your lot size according to your trading account size‼️
                    <div>
                        <div> ACTUAL SIGNAL PROFIT/LOSS = {signalResult[signal.timestamp] ? signalResult[signal.timestamp].toFixed(4)  : "loading"}</div>
                    </div>

                </div>
            ))}
            </div>


        </div>
    );
};


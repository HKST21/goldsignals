import {User} from "../Types/types..ts";
import {feClass} from "../Class/FeClass.ts";
import {useState, useEffect} from "react";




interface signalsProps {
    loggedUser: User | null;
}

interface goldPriceObject { // interface based on data coming from API, property name gold, which has value another object, which has property usd and value number
    gold: {
        usd: number;
    }
}

export function Signals({loggedUser}: signalsProps) {

    const [goldPrice, setGoldPrice] = useState<goldPriceObject>({
        gold: {
            usd: 0,
        }
    });

    useEffect(() => {
        const fetchGoldPrice = async () => {

            try {
                const actualPrice = await feClass.getGoldPrice('usd');

                if (actualPrice) {
                    setGoldPrice(actualPrice);
                    console.log("from end point we get this price of gold",actualPrice);
                    console.log("datový typ", typeof actualPrice);
                }

            }

            catch (e) {
                console.error("unable to load gold price",e);
            }


        }
        fetchGoldPrice();

        const intervalId = setInterval(fetchGoldPrice, 600000) // vracíme ID intervalu pro cleanup

        return () => {clearInterval(intervalId);} // cleanup


    },[])




    return (
        <div>
            Welcome ! {loggedUser?.email}
            this is actual price of gold {goldPrice.gold.usd}

        </div>
    );
};


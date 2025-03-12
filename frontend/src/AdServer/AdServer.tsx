import {useEffect, useRef} from "react";


export default function () {

    const adContainerRef = useRef<HTMLDivElement>(null);
    // vytvoříme odkaz na div container, který je v returnu, uvnitř tohoto kontejneru se bude načítat script

    useEffect(() => {
        console.log("AdServer component mounted on", window.location.href);

        if (!adContainerRef.current) return; // když není k dispozici container ukončíme mount

        const insElement= document.createElement('ins'); // vytvořím insElement, který přijímá reklamní obsah z Revive
        console.log("Created ins element");

        insElement.setAttribute('data-revive-zoneid', '23527'); // nastavíme atribut zoneid podle kterého skript najde element kde má zobrazovat
        insElement.setAttribute('data-revive-id', '727bec5e09208690b050ccfc6a45d384'); // nastavíme id Revive účtu
        insElement.style.display = 'inline-block'; // nastavíme velikost elementu stylováním tak, aby fitnul s bannerem
        insElement.style.width = '16Opx';
        insElement.style.height = '600px';

        adContainerRef.current.appendChild(insElement);
        console.log("Ins element added to container");

        if (!window.reviveScriptLoaded) { // zkontrolujeme zda script nebyl už naloadovan v jine komponente, bylo by to zbytecne loadovane

            const script = document.createElement("script"); // vytvoříme skript element pro načtení asynchronní reklamy

            script.async = true; // nastavíme atributy elementu script
            script.src = "https://servedby.revive-adserver.net/asyncjs.php"; // spouštění kódu z Revive

            document.body.appendChild(script);
            // přidám <script> element do body stránky, tak aby se spustil kod na revive a začal hledat <ins> element podle revive id a spustil v něm bannery z Revive

            console.log("Script added to document.body");
            window.reviveScriptLoaded = true; // nastavíme, že byl loaded, aby ostatní komponenty neloadovali zbytečně
        }


        return () => {
            if (adContainerRef.current && adContainerRef.current.contains(insElement)) { // při unmountu odstraníme ins element
                adContainerRef.current.removeChild(insElement);
            }

        }


    }, []);


    return (
        <div className={'sidebar'}>
            <div
                className={'ad-content-container'}
                ref={adContainerRef}
                style={{
                    width: "120px",
                    height: "600px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >

            </div>
        </div>
    )
}

declare global {
    interface Window {
        reviveScriptLoaded?: boolean;
    }
}
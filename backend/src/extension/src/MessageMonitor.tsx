import React, {useEffect} from 'react';

interface Mutation {
    type: 'childList' | 'attributes' | 'characterData';  // Typ změny
    target: Node;                                        // Element, kde se změna stala
    addedNodes: NodeList;                                // Nově přidané elementy
    removedNodes: NodeList;                              // Odebrané elementy
    previousSibling: Node | null;                        // Předchozí sourozenecký element
    nextSibling: Node | null;                            // Následující sourozenecký element
    attributeName: string | null;                        // Jméno změněného atributu
    oldValue: string | null;                            // Předchozí hodnota
}

// Funkce pro odeslání zprávy na náš server, přijímáme message a pomocí http metody post jí posíláme na endpoint v stringifikovanem objektu v body
const sendToServer = async (message: string) => {
    try {
        const response = await fetch('http://localhost:8080/analyze-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: message,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Hlavní komponenta pro monitoring zpráv
const MessageMonitor: React.FC = () => {
    console.log('MessageMonitor komponenta se vytváří');

    useEffect(() => {
        console.log('MessageMonitor useEffect se spouští - zde začíná hlavní logika');

        /*VYTVOŘENÍ LOGIKY OBSERVERU CO MÁ DĚLAT S ELEMENTEM, KTERÝ JSME HO NECHALI HLÍDAT*/
        // Vytvoříme observer pro sledování nových zpráv, takový pozorovatel, je to web api, které sleduje změny v DOM. Tzn,
        // když se vytvoří nová zpráva na telegramu vytvoří se nový dom element. V parametru je callback funkce, která se spouští vždy když se stane změna ve sledované části DOM
        const observer = new MutationObserver((mutations) => { // do proměnné observer ukládáme vše abychom ho pak mohli disconnectnout jinak by to nešlo
            console.log("observer zachytil změnu, počet mutací", mutations.length);
            // mutations parametr je v syntaxy Mutation observer v rámci callback funkce. Je to pole změn, které se sbírají z elementu, který jsme určili.
            // je to pole objektů, kdy každá mutation/změna má vlastnosti, které obsahují důležité informace. o těchto změnách viz interface
            mutations.forEach((mutation: Mutation) => { // procházíme přes forEach všechny objekty změn.
                console.log("přidané nody v této mutaci", mutation.addedNodes.length);
                mutation.addedNodes.forEach((node: any) => { // na každé vlastnosti addedNodes což jsou nově přidané elementy procházíme všechny nodes na tomto nodelistu
                    if (node instanceof Element) {
                        console.log("datový typ nodu", typeof node);
                        console.log("Třídy elementu:", Array.from(node.classList));

                        // pokud tato změna obsahuje 'bubble-content' v className

                        const bubbleContents = node.querySelectorAll('.bubble-content');

                        bubbleContents.forEach((bubble) => {
                            const messageText = bubble.textContent; // vytáhneme z ní textová content

                            console.log("scrappnutý text zprávy", messageText);

                            if (messageText) {
                                sendToServer(messageText); // který pošleme funcki sendToServer viz výše, ta jí zpracuje
                            }
                        })


                    }
                });
            });
        });

        /*NASTAVENÍ ELEMENTU, KTERÝ MÁ OBSERVER HLÍDAT A JAKÉ ZMĚNY HLÍDAT*/
        // Funkce pro kontrolu a nastavení observeru
        const setupObserver = () => {
            const messagesContainer = document.querySelector('.bubbles-inner.has-rights');
            console.log('Pokus o nalezení containeru...');

            if (messagesContainer) {
                console.log('Container nalezen! Nastavuji observer...');
                observer.observe(messagesContainer, {
                    childList: true, // sledujeme přidávání/mazání elementů
                    subtree: true    // sledujeme změny i ve vnořených elementech
                });
                return true;
            }
            return false;
        };

        // Kontrolujeme každé 2 sekundy, zda je kontejner dostupný
        const intervalId = setInterval(() => {
            console.log('Kontroluji přítomnost chat containeru...');
            if (setupObserver()) {
                console.log('Container úspěšně nalezen a observer nastaven!');
                clearInterval(intervalId);
            } else {
                console.log('Container zatím nenalezen, zkusím to znovu za 2 sekundy...');
            }
        }, 2000);

        // Cleanup při unmount
        return () => {
            clearInterval(intervalId);
            observer.disconnect();
        };
    }, []);

    return null;  // Tato komponenta nerendoruje žádné UI
};

export default MessageMonitor;
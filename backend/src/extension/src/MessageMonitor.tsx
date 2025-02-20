import React, { useEffect } from 'react';

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
        // Vytvoříme observer pro sledování nových zpráv, takový pozorovatel, je to web api, které sleduje změny v DOM. Tzn,
        // když se vytvoří nová zpráva na telegramu vytvoří se nový dom element. V parametru je callback funkce, která se spouští vždy když se stane změna ve sledované části DOM
        const observer = new MutationObserver((mutations) => {
            // mutations parametr je v syntaxy Mutation observer v rámci callback funkce. Je to pole změn, které se sbírají z elementu, který jsme určili.
            // je to pole objektů, kdy každá mutation/změna má vlastnosti, které obsahují důležité informace. o těchto změnách viz interface
            mutations.forEach((mutation: Mutation) => { // procházíme přes forEach všechny objekty změn.
                mutation.addedNodes.forEach((node: any) => { // na každé vlastnosti addedNodes což jsou nově přidané elementy procházíme všechny nodes na tomto nodelistu
                    console.log("datový typ nodu", typeof node);

                    if (node.classList?.contains('message')) { // pokud tato změna obsahuje 'message' v className
                        const messageText = node.textContent; // vytáhneme z ní textová content
                        console.log("scrappnutý text zprávy", messageText);
                        sendToServer(messageText); // který pošleme funcki sendToServer viz výše, ta jí zpracuje
                    }
                });
            });
        });

        // Najdeme nejprve element, kterého chceme sledovat změny. Při každé této změně se zavolá callback funkce
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            observer.observe(messagesContainer, { // zde funkcí observe() hlídáme element v prvním parametru, který jsme definovali výše,
                // druhým parametrem je objekt, kdy první vlastnost childList: true říká, že pozorujeme přidávání nových elementů,
                // druhá vlastnost je subtree: true, to znamená, že hlídáme změny i v zanořených elementech
                childList: true,
                subtree: true
            });
        }

        // Cleanup při unmount
        return () => observer.disconnect();
    }, []);

    return null;  // Tato komponenta nerendoruje žádné UI
};

export default MessageMonitor;
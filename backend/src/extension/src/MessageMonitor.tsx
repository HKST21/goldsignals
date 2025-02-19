import React, { useEffect } from 'react';

// Funkce pro odeslání zprávy na náš server
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
    useEffect(() => {
        // Vytvoříme observer pro sledování nových zpráv
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node: any) => {
                    if (node.classList?.contains('message')) {
                        const messageText = node.textContent;
                        sendToServer(messageText);
                    }
                });
            });
        });

        // Najdeme kontejner se zprávami
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            observer.observe(messagesContainer, {
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
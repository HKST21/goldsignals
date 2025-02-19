import React from 'react';
import { createRoot } from 'react-dom/client';
import MessageMonitor from './MessageMonitor';

// Vytvoříme div pro naši aplikaci
const app = document.createElement('div');
app.id = 'telegram-monitor-root';
document.body.appendChild(app);

// Inicializujeme React aplikaci
const root = createRoot(app);
root.render(<MessageMonitor />);
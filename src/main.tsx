import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/itim/latin-400.css';
import '@fontsource/itim/latin-ext-400.css';
import '@fontsource/itim/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/latin-ext-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-600.css';
import '@fontsource/be-vietnam-pro/latin-ext-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';
import './index.css';
import { App } from './app/App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

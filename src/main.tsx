import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-ext-700.css';
import '@fontsource/baloo-2/vietnamese-700.css';
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

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SeasonProvider } from './context/SeasonContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SeasonProvider>
      <App />
    </SeasonProvider>
  </StrictMode>,
);

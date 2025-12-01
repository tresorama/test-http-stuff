import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './components/ds/tw.css';
import { TanstackRouterProvider } from './lib/tanstack/router/router.provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackRouterProvider />
  </StrictMode>,
);

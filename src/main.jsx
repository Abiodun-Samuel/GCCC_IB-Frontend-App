import React from 'react';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import 'nprogress/nprogress.css';
import 'aos/dist/aos.css';

import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import { AppWrapper } from './components/common/PageMeta.jsx';
import { QueryProvider } from './providers/QueryProvider.jsx';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <AppWrapper>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <Toaster />
        </AppWrapper>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);

// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Container from './components/layout/Container';

const container = document.getElementById('root');
if (!container) throw new Error('루트 요소를 찾을 수 없습니다.');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Container className="mx-auto" maxWidth="1440px" maxHeight="1024px">
      <App />
    </Container>
  </React.StrictMode>
);
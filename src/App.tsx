import React, { useState, useEffect } from 'react';
import { PaperHub } from './portal/PaperHub.js';
import DecisionRagApp from '../papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/src/App.js';
import { ViewMode } from '../papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/src/components/Header.js';

export default function App() {
  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [initialView, setInitialView] = useState<ViewMode>('beginner');

  // Handle URL hash changes for easy routing and browser history
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/paper/')) {
        const parts = hash.replace('#/paper/', '').split('?');
        const paperId = parts[0];
        const params = new URLSearchParams(parts[1] || '');
        const view = (params.get('view') as ViewMode) || 'beginner';
        setActivePaperId(paperId);
        setInitialView(view);
      } else if (hash.includes('decisionrag')) {
        setActivePaperId('decisionrag');
      } else {
        setActivePaperId(null);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const handleSelectPaper = (paperId: string, view: string = 'beginner') => {
    setActivePaperId(paperId);
    setInitialView(view as ViewMode);
    window.location.hash = `#/paper/${paperId}?view=${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setActivePaperId(null);
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activePaperId === 'decisionrag') {
    return (
      <DecisionRagApp
        onBackToHub={handleBackToHub}
        initialView={initialView}
      />
    );
  }

  return (
    <PaperHub onSelectPaper={handleSelectPaper} />
  );
}

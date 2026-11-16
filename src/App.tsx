import React, { useState, useEffect, useMemo } from 'react';
import { PaperHub } from './portal/PaperHub.js';
import { REGISTERED_PAPERS } from '../papers/registry.js';
import { ThemeProvider } from './shared/theme/ThemeContext.js';
import { ApkExporterStudio } from './modules/apk-exporter/ApkExporterStudio.js';

export default function App() {
  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [initialView, setInitialView] = useState<string>('beginner');
  const [isApkExporterOpen, setIsApkExporterOpen] = useState<boolean>(false);

  // Handle URL hash routing for deep-linking and browser history
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/apk-exporter')) {
        setIsApkExporterOpen(true);
        setActivePaperId(null);
        window.scrollTo(0, 0);
      } else if (hash.startsWith('#/paper/')) {
        setIsApkExporterOpen(false);
        const parts = hash.replace('#/paper/', '').split('?');
        const paperId = parts[0];
        const params = new URLSearchParams(parts[1] || '');
        const view = params.get('view') || 'beginner';
        setActivePaperId(paperId);
        setInitialView(view);
        window.scrollTo(0, 0);
      } else if (hash.includes('decisionrag')) {
        setIsApkExporterOpen(false);
        setActivePaperId('decisionrag');
        window.scrollTo(0, 0);
      } else {
        setIsApkExporterOpen(false);
        setActivePaperId(null);
        window.scrollTo(0, 0);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const handleSelectPaper = (paperId: string, view: string = 'beginner') => {
    setIsApkExporterOpen(false);
    setActivePaperId(paperId);
    setInitialView(view);
    window.location.hash = `#/paper/${paperId}?view=${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApkExporter = () => {
    setActivePaperId(null);
    setIsApkExporterOpen(true);
    window.location.hash = '#/apk-exporter';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setIsApkExporterOpen(false);
    setActivePaperId(null);
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamically resolve the active paper module from the registry
  const activePaper = useMemo(() => {
    if (!activePaperId) return null;
    return REGISTERED_PAPERS.find(
      (p) => (p.id === activePaperId || p.folderName === activePaperId) && p.status === 'active'
    );
  }, [activePaperId]);

  const ActivePaperComponent = activePaper?.component;

  return (
    <ThemeProvider>
      {isApkExporterOpen ? (
        <ApkExporterStudio
          onBackToHub={handleBackToHub}
          onSelectPaper={handleSelectPaper}
        />
      ) : ActivePaperComponent ? (
        <ActivePaperComponent
          onBackToHub={handleBackToHub}
          initialView={initialView}
        />
      ) : (
        <PaperHub
          onSelectPaper={handleSelectPaper}
          onOpenApkExporter={handleOpenApkExporter}
        />
      )}
    </ThemeProvider>
  );
}

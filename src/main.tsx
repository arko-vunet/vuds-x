import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-mono/400.css'
import './index.css'
import App from './App.tsx'
import ChangelogPage from './pages/changelog.tsx'
import SkillsPage from './pages/skills.tsx'
import TrialPage from './pages/trial.tsx'
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/trial" element={<TrialPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/skills" element={<SkillsPage />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </StrictMode>,
)

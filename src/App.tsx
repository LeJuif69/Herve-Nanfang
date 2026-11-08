import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { AudioProvider } from './lib/audio-context'
import { CommandMenuProvider } from './lib/command-menu-context'

import { captureTrafficAttribution } from './lib/utm-tracker'
import { initAdPixels } from './lib/ad-pixels'

// Gestion de la compatibilité des URLs avec hash (#/admin), redirections d'alias et capture des UTM/pixels
function HashAdminRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    captureTrafficAttribution()
    initAdPixels()
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#/admin' || hash === '#admin' || hash.startsWith('#/admin')) {
        navigate('/admin', { replace: true })
      }
    }
  }, [navigate])

  useEffect(() => {
    const normalized = location.pathname.replace(/\/+$/, '').toLowerCase()
    if (normalized === '/a-laiz-academy' || normalized === '/racines-musicales-academy') {
      navigate(`/rma${location.search}${location.hash}`, { replace: true })
    } else if (normalized === '/epk') {
      navigate(`/presse${location.search}${location.hash}`, { replace: true })
    }
  }, [location, navigate])

  return null
}

// Lazy load des pages secondaires
const About = lazy(() => import('./pages/About'))
const Music = lazy(() => import('./pages/Music'))
const AI = lazy(() => import('./pages/AI'))
const Pedagogy = lazy(() => import('./pages/Pedagogy'))
const Services = lazy(() => import('./pages/Services'))
const RMA = lazy(() => import('./pages/RMA'))
const Culture = lazy(() => import('./pages/Culture'))
const Projects = lazy(() => import('./pages/Projects'))
const Journal = lazy(() => import('./pages/Journal'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Conferences = lazy(() => import('./pages/Conferences'))
const Press = lazy(() => import('./pages/Press'))
const Contact = lazy(() => import('./pages/Contact'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Admin = lazy(() => import('./pages/Admin'))
const Videos = lazy(() => import('./pages/Videos'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <HashAdminRedirect />
      <AudioProvider>
        <CommandMenuProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/musique" element={<Music />} />
              <Route path="/ia-technologie" element={<AI />} />
              <Route path="/pedagogie" element={<Pedagogy />} />
              <Route path="/services" element={<Services />} />
              <Route path="/rma" element={<RMA />} />
              <Route path="/culture-recherche" element={<Culture />} />
              <Route path="/projets" element={<Projects />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<ArticleDetail />} />
              <Route path="/conferences" element={<Conferences />} />
              <Route path="/presse" element={<Press />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/mentions-legales" element={<Legal kind="mentions" />} />
              <Route path="/confidentialite" element={<Legal kind="confidentialite" />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CommandMenuProvider>
      </AudioProvider>
    </Suspense>
  )
}

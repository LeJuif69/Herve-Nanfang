import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import { AudioProvider } from './lib/audio-context'
import { CommandMenuProvider } from './lib/command-menu-context'

// Gestion de la compatibilité des URLs avec hash (#/admin)
function HashAdminRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#/admin' || hash === '#admin' || hash.startsWith('#/admin')) {
        navigate('/admin', { replace: true })
      }
    }
  }, [navigate])
  return null
}

// Lazy load des pages
const Home = lazy(() => import('./pages/Home'))
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
const Contact = lazy(() => import('./pages/Contact'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Admin = lazy(() => import('./pages/Admin'))

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
              <Route path="/contact" element={<Contact />} />
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

import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AudioPlayer from './AudioPlayer'
import FloatingNavControls from './FloatingNavControls'
import { useCommandMenu } from '../lib/command-menu-context'

const CommandMenu = lazy(() => import('./CommandMenu'))

/** Remet la page en haut à chaque changement de route (sauf ancres). */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  const { isOpen } = useCommandMenu()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-ink">
        <ScrollManager />
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <ScrollManager />
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingNavControls />
      <AudioPlayer />
      {isOpen && (
        <Suspense fallback={null}>
          <CommandMenu />
        </Suspense>
      )}
    </div>
  )
}

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface CommandMenuContextType {
  isOpen: boolean
  openCommandMenu: () => void
  closeCommandMenu: () => void
  toggleCommandMenu: () => void
}

const CommandMenuContext = createContext<CommandMenuContextType | null>(null)

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCommandMenu = () => setIsOpen(true)
  const closeCommandMenu = () => setIsOpen(false)
  const toggleCommandMenu = () => setIsOpen((prev) => !prev)

  // Écouteur global pour ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <CommandMenuContext.Provider
      value={{
        isOpen,
        openCommandMenu,
        closeCommandMenu,
        toggleCommandMenu,
      }}
    >
      {children}
    </CommandMenuContext.Provider>
  )
}

export function useCommandMenu() {
  const context = useContext(CommandMenuContext)
  if (!context) {
    throw new Error('useCommandMenu doit être utilisé à l’intérieur d’un CommandMenuProvider')
  }
  return context
}

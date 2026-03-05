import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import CharacterSelectPage from './pages/CharacterSelectPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import './App.css'

const pathToPage = (path) => {
  if (path === '/character-select') return 'select'
  if (path.startsWith('/character/')) return 'detail'
  return 'landing'
}

const nameFromPath = (path) => {
  if (path.startsWith('/character/')) {
    return decodeURIComponent(path.slice('/character/'.length))
  }
  return null
}

function App() {
  const [page, setPage] = useState(() => pathToPage(window.location.pathname))
  const [characterName, setCharacterName] = useState(
    () => nameFromPath(window.location.pathname)
  )

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname
      setPage(pathToPage(path))
      setCharacterName(nameFromPath(path))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPage(pathToPage(path))
    setCharacterName(nameFromPath(path))
  }

  return (
    <div className="app">
      {page === 'landing' && (
        <LandingPage onStart={() => navigate('/character-select')} />
      )}
      {page === 'select' && (
        <CharacterSelectPage
          onSelectCharacter={(char) => navigate(`/character/${encodeURIComponent(char.name)}`)}
          onBack={() => navigate('/welcome')}
        />
      )}
      {page === 'detail' && (
        <CharacterDetailPage
          key={characterName}
          characterName={characterName}
          onBack={() => navigate('/character-select')}
          onStart={() => navigate('/welcome')}
          onSelectCharacter={(name) => navigate(`/character/${encodeURIComponent(name)}`)}
        />
      )}
    </div>
  )
}

export default App

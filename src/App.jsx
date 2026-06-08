import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import CharacterSelectPage from './pages/CharacterSelectPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import { fetchAllRecords } from './lib/airtable'
import './App.css'

const COLS = 5

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
  const [characters, setCharacters] = useState([])
  const [charsLoading, setCharsLoading] = useState(true)
  const [charsError, setCharsError] = useState(null)

  useEffect(() => {
    fetchAllRecords()
      .then((records) =>
        setCharacters(
          records.map((r) => ({
            id: r.id,
            name: r.fields.Name ?? '—',
            biography: r.fields.Biography ?? '',
            headshot: r.fields.Headshot?.[0]?.url ?? null,
            fullBody: r.fields['Full Body']?.[0]?.url ?? null,
            illustration: r.fields['Illustration']?.[0]?.url ?? null,
          }))
        )
      )
      .catch((err) => setCharsError(err.message))
      .finally(() => setCharsLoading(false))
  }, [])

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

  const getNextCharacterName = (currentName) => {
    if (characters.length === 0) return null
    const idx = characters.findIndex((c) => c.name === currentName)
    if (idx === -1) return null
    const nextDown = idx + COLS
    if (nextDown < characters.length) return characters[nextDown].name
    const nextCol = (idx % COLS) + 1
    return characters[nextCol % COLS]?.name ?? null
  }

  return (
    <div className="app">
      <div className="rotate-overlay">
        <div className="rotate-overlay__content">
          <div className="rotate-overlay__icon">⟳</div>
          <p>Please rotate your device to landscape mode</p>
        </div>
      </div>
      {page === 'landing' && (
        <LandingPage onStart={() => navigate('/character-select')} />
      )}
      {page === 'select' && (
        <CharacterSelectPage
          characters={characters}
          loading={charsLoading}
          error={charsError}
          onSelectCharacter={(char) => navigate(`/character/${encodeURIComponent(char.name)}`)}
          onBack={() => navigate('/welcome')}
        />
      )}
      {page === 'detail' && (
        <CharacterDetailPage
          key={characterName}
          characterName={characterName}
          onBack={() => navigate('/character-select')}
          onNextCharacter={() => {
            const next = getNextCharacterName(characterName)
            if (next) navigate(`/character/${encodeURIComponent(next)}`)
          }}
          onSelectCharacter={(name) => navigate(`/character/${encodeURIComponent(name)}`)}
        />
      )}
    </div>
  )
}

export default App

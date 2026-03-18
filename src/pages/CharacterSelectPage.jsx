import { useState, useEffect, useRef } from 'react'
import CharacterCard from '../components/characterSelect/CharacterCard'
import { fetchAllRecords } from '../lib/airtable'

const COLS = 5

export default function CharacterSelectPage({ onSelectCharacter, onBack }) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const activeIndexRef = useRef(activeIndex)
  const onSelectRef = useRef(onSelectCharacter)
  useEffect(() => { activeIndexRef.current = activeIndex }, [activeIndex])
  useEffect(() => { onSelectRef.current = onSelectCharacter }, [onSelectCharacter])

  useEffect(() => {
    fetchAllRecords()
      .then((records) => {
        const mapped = records.map((r) => ({
          id: r.id,
          name: r.fields.Name ?? '—',
          biography: r.fields.Biography ?? '',
          headshot: r.fields.Headshot?.[0]?.url ?? null,
          fullBody: r.fields['Full Body']?.[0]?.url ?? null,
          illustration: r.fields['Illustration']?.[0]?.url ?? null,
        }))
        setCharacters(mapped)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (characters.length === 0) return
    const onKeyDown = (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) return
      e.preventDefault()

      if (e.key === 'Enter') {
        onSelectRef.current(characters[activeIndexRef.current])
        return
      }

      setActiveIndex((cur) => {
        const last = characters.length - 1
        if (e.key === 'ArrowRight') return Math.min(cur + 1, last)
        if (e.key === 'ArrowLeft')  return Math.max(cur - 1, 0)
        if (e.key === 'ArrowDown')  return Math.min(cur + COLS, last)
        if (e.key === 'ArrowUp')    return Math.max(cur - COLS, 0)
        return cur
      })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [characters])

  const numRows = Math.ceil(characters.length / COLS)
  const activeChar = characters[activeIndex]

  if (loading) return <div className="spinner-overlay"><div className="spinner" /></div>

  if (error) return (
    <div className="select-page select-page--centered">
      <p>Error: {error}</p>
    </div>
  )

  return (
    <div className="select-page">
      <div className="select-topbar">
        <button className="back-btn-sm" onClick={onBack}>Back</button>
      </div>

      <div className="select-main">
        <div className="preview-panel">
          {activeChar && (
            <>
              {activeChar.illustration
                ? <img className="preview-fullbody" src={activeChar.illustration} alt={activeChar.name} />
                : <span className="preview-placeholder">No image</span>
              }
              <p className="preview-name">{activeChar.name}</p>
            </>
          )}
        </div>

        <div className="character-grid-section">
          <h2 className="choose-title">Choose A Party Member</h2>
          <div className="char-rows">
            {Array.from({ length: numRows }, (_, rowIdx) => (
              <div key={rowIdx} className="char-row">
                {characters.slice(rowIdx * COLS, (rowIdx + 1) * COLS).map((char, colIdx) => {
                  const flatIdx = rowIdx * COLS + colIdx
                  return (
                    <CharacterCard
                      key={char.id}
                      char={char}
                      isActive={flatIdx === activeIndex}
                      flatIdx={flatIdx}
                      setActiveIndex={setActiveIndex}
                      onSelectCharacter={onSelectCharacter}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

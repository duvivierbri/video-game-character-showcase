export default function CharacterCard({ char, isActive, flatIdx, setActiveIndex, onSelectCharacter }) {
  return (
    <div className="char-card-wrapper">
      {isActive && <div className="focus-indicator">▼</div>}
      <div
        className={`character-card${isActive ? ' character-card--focused' : ''}`}
        onMouseEnter={() => setActiveIndex(flatIdx)}
        onClick={() => onSelectCharacter(char)}
      >
        {char.headshot
          ? <img className="card-headshot" src={char.headshot} alt={char.name} />
          : <span>{char.name}</span>
        }
      </div>
    </div>
  )
}

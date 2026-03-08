export default function Vitals({ character, panel }) {
  return (
    <div className={`char-vitals${panel === 1 ? " char-vitals--hidden" : ""}`}>
      <div className="vitals-row">
        <span className="vital">
          <strong>HP:</strong> {character.hp} / 100
        </span>
        <span className="vital">
          <strong>SP:</strong> {character.sp} / 100
        </span>
        <span className="vital">
          <strong>Lvl:</strong> {character.level}
        </span>
        <span className="vital">
          <strong>Exp:</strong> {character.exp}
        </span>
      </div>

      <div className="next-level-row">
        <span className="next-level-label">Next Level:</span>
        <div className="next-level-bar-container">
          <div
            className="next-level-bar"
            style={{ width: `${character.nextLevel}%` }}
          />
        </div>
      </div>
    </div>
  );
}

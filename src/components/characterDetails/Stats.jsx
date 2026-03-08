export default function Stats({ character }) {
  return (
    <>
      <div className="ap-row">
        <span className="ap-label">
          AP: <strong>{character.ap}</strong>
        </span>
        <div className="stat-bar-container">
          <div
            className="stat-bar"
            style={{ width: `${character.ap}%` }}
          />
        </div>
      </div>
      <h4 className="col-title">Stats</h4>
      <div className="stats-bars">
        {Object.entries(character.stats).map(([label, value]) => (
          <div key={label} className="stat-row">
            <span className="stat-label">{label}</span>
            <div className="stat-bar-container">
              <div className="stat-bar" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

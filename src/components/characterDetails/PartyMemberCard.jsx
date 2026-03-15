export default function PartyMemberCard({ member, onSelectCharacter }) {
  return (
    <div
      key={member.id}
      className="party-card"
      onClick={() => onSelectCharacter(member.name)}
    >
      <span className="party-card-name">{member.name}</span>
      <div className="party-card-body">
        <div className="party-card-left">
          <div className="party-card-image">
            {member.headshot ? (
              <img
                src={member.headshot}
                alt={member.name}
                className="party-slot-img"
              />
            ) : null}
            <div className="party-type-box">
              <span className="party-type-label">Type</span>
              <span className="party-type-value">{member.type ?? "—"}</span>
            </div>
          </div>
        </div>
        <div className="party-card-right">
          <div className="party-card-stats">
            {Object.entries(member.stats).map(([label, value]) => (
              <div key={label} className="party-stat-row">
                <span className="stat-label">{label}</span>
                <div className="stat-bar-container">
                  <div className="stat-bar" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="party-level-box">
            <span className="party-level-label">Level</span>
            <span className="party-level-value"><b>{member.level}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}

import PartyMemberCard from "./PartyMemberCard";

export default function Biography({ character, partyMembers, onSelectCharacter }) {
  return (
    <div className="detail-col detail-col--bio">
      <h3 className="col-title">Biography</h3>
      <div className="character-bio-box">
        {character.biography || "No biography available."}
      </div>
      <div className="party-section">
        <h4 className="party-heading">Party Members</h4>
        <div className="party-members-row">
          {partyMembers.map((member, i) => (
            <PartyMemberCard
              key={member.id ?? i}
              member={member}
              onSelectCharacter={onSelectCharacter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

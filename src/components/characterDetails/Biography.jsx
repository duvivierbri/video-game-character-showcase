import PartyMemberCard from "./PartyMemberCard";

export default function Biography({ character, partyMembers, onSelectCharacter }) {
  return (
    <div className="detail-col detail-col--bio">
      <div className="character-bio-box">
        <div className="desc-box-title">Biography</div>
        <div className="desc-box-body">
          {character.biography || "No biography available."}
        </div>
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

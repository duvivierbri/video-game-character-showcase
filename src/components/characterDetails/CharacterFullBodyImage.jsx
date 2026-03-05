import GearCard from "./GearCard";

export default function CharacterFullBodyImage({
  character,
  panel,
  activeGear,
  setActiveGear,
}) {
  return (
    <div className="char-body">
      <div
        className={`character-image-box${
          panel === 0 ? " character-image-box--small" : ""
        }`}
      >
        {character.fullBody ? (
          <img
            src={character.fullBody}
            alt={character.name}
            className="character-fullbody-img"
          />
        ) : (
          <span>No image</span>
        )}
        {(character.type || character.range) && (
          <div className="type-range-row">
            {character.type && (
              <div className="character-image-type-box">
                <span className="type-range-label">Type</span>
                <span className="type-range-value">{character.type}</span>
              </div>
            )}
            {character.range && (
              <div className="character-image-range-box">
                <span className="type-range-label">Range</span>
                <span className="type-range-value">{character.range}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`gear-column${panel === 1 ? " gear-column--visible" : ""}`}
      >
        {(character.gear ?? [null, null, null]).map((g, i) => (
          <GearCard
            gearObject={g}
            keyValue={i}
            activeGear={activeGear}
            setActiveGear={setActiveGear}
          />
        ))}
      </div>
    </div>
  );
}

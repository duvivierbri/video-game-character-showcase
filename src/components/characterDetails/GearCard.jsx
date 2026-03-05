export default function GearCard({
  keyValue,
  gearObject,
  activeGear,
  setActiveGear,
}) {
  return (
    <div
      key={keyValue}
      className="gear-slot-wrapper"
      onMouseEnter={() => setActiveGear(gearObject)}
      onMouseLeave={() => setActiveGear(null)}
    >
      <div className="gear-slot">
        {gearObject?.image && (
          <img
            src={gearObject.image}
            alt={gearObject.name}
            className="gear-slot-img"
          />
        )}
      </div>
      <span className="basic-image-label gear-label">
        {gearObject?.name ?? `Gear ${keyValue + 1}`}
      </span>
      {activeGear?.id === gearObject?.id && gearObject?.description && (
        <div className="gear-tooltip">{gearObject.description}</div>
      )}
    </div>
  );
}

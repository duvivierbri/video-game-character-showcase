export default function GearCard({
  gearObject,
  activeGear,
  setActiveGear,
  panel,
}) {
  return (
    <div className="gear-slot-wrapper" onMouseEnter={() => setActiveGear(gearObject)} onMouseLeave={() => setActiveGear(null)}>
      <div
        className={`gear-slot${
          gearObject && activeGear?.id === gearObject?.id ? " gear-slot--active" : ""
        }`}
      >
        <div className="gear-slot-main">
          {gearObject?.image && (
            <img src={gearObject.image} alt={gearObject.name} className="gear-slot-img" />
          )}
        </div>
        <div className="gear-slot-footer">
          <span className="gear-slot-count">{gearObject ? (gearObject.quantity ?? 1) : ''}</span>
          <span className="gear-slot-name">{gearObject?.name ?? ''}</span>
        </div>
      </div>
      {activeGear?.id === gearObject?.id && gearObject?.description && (
        <div className={`gear-tooltip${panel === 0 ? " gear-tooltip--left" : ""}`}>
          {gearObject.description}
        </div>
      )}
    </div>
  );
}

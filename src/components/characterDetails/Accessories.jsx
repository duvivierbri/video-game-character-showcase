const TOTAL_SLOTS = 6;

export default function Accessories({ character, activeAccessory, setActiveAccessory }) {
  const accessories = character.accessories ?? [];
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => accessories[i] ?? null);

  return (
    <>
      <h4 className="col-title">Accessories</h4>
      <div className="accessories-grid">
        {slots.map((acc, i) => (
          <div
            key={acc?.id ?? `empty-${i}`}
            className={`acc-slot${
              acc && activeAccessory?.id === acc.id ? " acc-slot--active" : ""
            }`}
            onMouseEnter={() => acc && setActiveAccessory(acc)}
          >
            {acc?.image ? (
              <img
                src={acc.image}
                alt={acc.name}
                className="acc-slot-img"
              />
            ) : acc ? (
              <span className="acc-slot-name">{acc.name}</span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="acc-description-box">
        {activeAccessory && (
          <>
            <strong>{activeAccessory.name}</strong>
            {activeAccessory.description && <p>{activeAccessory.description}</p>}
          </>
        )}
      </div>
    </>
  );
}

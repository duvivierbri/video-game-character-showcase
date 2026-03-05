export default function Accessories({ character, activeAccessory, setActiveAccessory }) {
  return (
    <>
      <h4>Accessories</h4>
      <div className="accessories-grid">
        {(character.accessories ?? []).map((acc) => (
          <div
            key={acc.id}
            className={`acc-slot${
              activeAccessory?.id === acc.id ? " acc-slot--active" : ""
            }`}
            onMouseEnter={() => setActiveAccessory(acc)}
            onMouseLeave={() => setActiveAccessory(null)}
          >
            {acc.image ? (
              <img
                src={acc.image}
                alt={acc.name}
                className="acc-slot-img"
              />
            ) : (
              <span className="acc-slot-name">{acc.name}</span>
            )}
          </div>
        ))}
      </div>
      <div className="acc-description-box">
        {activeAccessory?.description}
      </div>
    </>
  );
}

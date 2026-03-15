import pointerFinger from '../../assets/art/PointerFinger.png'

const TOTAL_SLOTS = 6;

export default function Accessories({ character, activeAccessory, setActiveAccessory }) {
  const accessories = character.accessories ?? [];
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => accessories[i] ?? null);

  return (
    <>
      <h4 className="col-title">Accessories</h4>
      <div className="accessories-grid">
        {slots.map((acc, i) => (
          <div key={acc?.id ?? `empty-${i}`} className="acc-slot-wrapper">
            {acc && <img src={pointerFinger} className="focus-indicator slot-hover-indicator" alt="" />}
            <div
              className={`acc-slot${
                acc && activeAccessory?.id === acc.id ? " acc-slot--active" : ""
              }`}
              onMouseEnter={() => acc && setActiveAccessory(acc)}
            >
              <div className="acc-slot-main">
                {acc?.image && (
                  <img src={acc.image} alt={acc.name} className="acc-slot-img" />
                )}
              </div>
              <div className="acc-slot-footer">
                <span className="acc-slot-count">{acc ? (acc.quantity ?? 1) : ''}</span>
                <span className="acc-slot-name">{acc?.name ?? ''}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="acc-description-box">
        <div className="desc-box-title">{activeAccessory?.name ?? ''}</div>
        <div className="desc-box-body">
          {activeAccessory?.description && <p>{activeAccessory.description}</p>}
        </div>
      </div>
    </>
  );
}

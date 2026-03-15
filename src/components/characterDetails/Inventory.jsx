import pointerFinger from '../../assets/art/PointerFinger.png'

export const ITEM_CATEGORIES = [
  { name: "Items", filter: "Item" },
  { name: "Equipment", filter: "Equipment" },
  { name: "Special", filter: "Special" },
];

const TOTAL_SLOTS = 9;

function getSlots(inventory, filter) {
  const items = inventory.filter((item) => item.category === filter);
  const remainder = items.length % 3;
  const padCount = remainder === 0 ? 0 : 3 - remainder;
  const total = Math.max(items.length + padCount, TOTAL_SLOTS);
  return Array.from({ length: total }, (_, i) => items[i] ?? null);
}

export default function Inventory({
  character,
  categoryIndex,
  prevCategoryIndex,
  slideDir,
  activeItem,
  setActiveItem,
  onPrevCategory,
  onNextCategory,
}) {
  const equippedIds = new Set([
    ...(character.gear ?? []).filter(Boolean).map((g) => g.id),
    ...(character.accessories ?? []).map((a) => a.id),
  ])

  return (
    <div className="detail-col detail-col--items">
      <h3 className="col-title">Inventory</h3>
      <div className="items-box">
        <div className="items-header">
          <button className="items-arrow" onClick={onPrevCategory}>
            ‹
          </button>
          <h4>{ITEM_CATEGORIES[categoryIndex].name}</h4>
          <button className="items-arrow" onClick={onNextCategory}>
            ›
          </button>
        </div>
        <div className="items-grid-wrapper">
          {prevCategoryIndex !== null && (
            <div
              className={`items-grid items-grid--slide-out-${slideDir}`}
            >
              {getSlots(character.inventory, ITEM_CATEGORIES[prevCategoryIndex].filter).map((item, i) => (
                <div key={item?.id ?? `empty-${i}`} className="item-slot">
                  {item?.name}
                </div>
              ))}
            </div>
          )}
          <div
            key={categoryIndex}
            className={`items-grid items-grid--slide-in-${slideDir}`}
          >
            {getSlots(character.inventory, ITEM_CATEGORIES[categoryIndex].filter).map((item, i) => (
              <div key={item?.id ?? `empty-${i}`} className="item-slot-wrapper">
                {item && <img src={pointerFinger} className="focus-indicator slot-hover-indicator" alt="" />}
                <div
                  className={`item-slot${
                    item && activeItem?.id === item.id ? " item-slot--active" : ""
                  }`}
                  onMouseEnter={() => item && setActiveItem(item)}
                >
                  {item && equippedIds.has(item.id) && (
                    <span className="equipped-badge">Equipped</span>
                  )}
                  {item?.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-slot-img"
                    />
                  ) : item ? (
                    <span>{item.name}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="item-description-box">
          <div className="desc-box-title">{activeItem?.name ?? ''}</div>
          <div className="desc-box-body">
            {activeItem?.description && <p>{activeItem.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

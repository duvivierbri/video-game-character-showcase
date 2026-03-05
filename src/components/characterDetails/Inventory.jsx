const ITEM_CATEGORIES = [
  { name: "Items", filter: "Item" },
  { name: "Equipment", filter: "Equipment" },
  { name: "Special", filter: "Special" },
];

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
              {character.inventory
                .filter(
                  (item) =>
                    item.category ===
                    ITEM_CATEGORIES[prevCategoryIndex].filter
                )
                .map((item) => (
                  <div key={item.id} className="item-slot">
                    {item.name}
                  </div>
                ))}
            </div>
          )}
          <div
            key={categoryIndex}
            className={`items-grid items-grid--slide-in-${slideDir}`}
          >
            {character.inventory
              .filter(
                (item) =>
                  item.category === ITEM_CATEGORIES[categoryIndex].filter
              )
              .map((item) => (
                <div
                  key={item.id}
                  className={`item-slot${
                    activeItem?.id === item.id ? " item-slot--active" : ""
                  }`}
                  onMouseEnter={() => setActiveItem(item)}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-slot-img"
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className="item-description-box">
          {activeItem?.description}
        </div>
      </div>
    </div>
  );
}

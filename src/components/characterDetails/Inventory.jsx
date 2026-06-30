import { useState } from 'react'

export const ITEM_CATEGORIES = [
  { name: "All Items", filter: null },
  { name: "Equipment", filter: "Equipment" },
  { name: "Key Items", filter: "Special" },
  { name: "Consumables", filter: "Consumable" },
];

const TOTAL_SLOTS = 9;

function getSlots(inventory, filter, equippedIds = null) {
  let items = filter === null ? [...inventory] : inventory.filter((item) => item.category === filter);
  if (equippedIds) {
    items = [
      ...items.filter((i) => equippedIds.has(i.id)),
      ...items.filter((i) => !equippedIds.has(i.id)),
    ];
  }
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
  const [sortEquippedFirst, setSortEquippedFirst] = useState(false);

  const equippedIds = new Set([
    ...(character.gear ?? []).filter(Boolean).map((g) => g.id),
    ...(character.accessories ?? []).map((a) => a.id),
  ]);

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
        <button
          className={`equipped-sort-toggle${sortEquippedFirst ? " equipped-sort-toggle--active" : ""}`}
          onClick={() => setSortEquippedFirst((v) => !v)}
        >
          Equipped First
        </button>
        <div className="items-grid-wrapper" onMouseLeave={() => setActiveItem(null)}>
          {prevCategoryIndex !== null && (
            <div className={`items-grid items-grid--slide-out-${slideDir}`}>
              {getSlots(character.inventory, ITEM_CATEGORIES[prevCategoryIndex].filter, sortEquippedFirst ? equippedIds : null).map((item, i) => (
                <div key={item?.id ?? `empty-${i}`} className="item-slot">
                  <div className="item-slot-main">
                    {item?.image && <img src={item.image} alt={item.name} className="item-slot-img" />}
                  </div>
                  <div className="item-slot-footer">
                    <span className="item-slot-count">{item ? (item.quantity ?? 1) : ''}</span>
                    <span className="item-slot-name">{item?.name ?? ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            key={categoryIndex}
            className={`items-grid items-grid--slide-in-${slideDir}`}
          >
            {getSlots(character.inventory, ITEM_CATEGORIES[categoryIndex].filter, sortEquippedFirst ? equippedIds : null).map((item, i) => (
              <div key={item?.id ?? `empty-${i}`} className="item-slot-wrapper">
                <div
                  className={`item-slot${
                    item && activeItem?.id === item.id ? " item-slot--active" : ""
                  }`}
                  onMouseEnter={() => item && setActiveItem(item)}
                >
                  {item && equippedIds.has(item.id) && (
                    <span className="equipped-badge">Equipped</span>
                  )}
                  {item && item.category === "Special" && item.rarity && (
                    <span className={`rarity-star rarity-star--${item.rarity.toLowerCase()}`}>★</span>
                  )}
                  <div className="item-slot-main">
                    {item?.image && <img src={item.image} alt={item.name} className="item-slot-img" />}
                  </div>
                  <div className="item-slot-footer">
                    <span className="item-slot-count">{item ? (item.quantity ?? 1) : ''}</span>
                    <span className="item-slot-name">{item?.name ?? ''}</span>
                  </div>
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

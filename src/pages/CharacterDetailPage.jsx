import { useEffect, useRef, useState } from "react";
import { fetchRecordByName, fetchRecord } from "../lib/airtable";

const ITEM_CATEGORIES = [
  { name: "Items",     filter: "Item"      },
  { name: "Equipment", filter: "Equipment" },
  { name: "Special",   filter: "Special"   },
];

const SLIDE_DURATION = 300;

export default function CharacterDetailPage({
  characterName,
  onStart,
  onSelectCharacter,
}) {
  const [character, setCharacter] = useState(null);
  const [partyMembers, setPartyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [panel, setPanel] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [prevCategoryIndex, setPrevCategoryIndex] = useState(null);
  const [slideDir, setSlideDir] = useState("next");
  const [activeItem, setActiveItem] = useState(null);
  const [activeAccessory, setActiveAccessory] = useState(null);
  const [activeGear, setActiveGear] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!characterName) return;
    fetchRecordByName(characterName)
      .then(async (r) => {
        const names    = r.fields["Name (from Inventory)"]        ?? [];
        const descs    = r.fields["Description (from Inventory)"] ?? [];
        const cats     = r.fields["Category (from Inventory)"]    ?? [];
        const imgs     = r.fields["Image (from Inventory)"]       ?? [];
        const ids      = r.fields["Inventory"]                    ?? [];
        const inventory = ids.map((id, i) => ({
          id,
          name:        names[i]  ?? "—",
          description: descs[i]  ?? "",
          category:    cats[i]   ?? "",
          image:       imgs[i]?.thumbnails?.large?.url ?? null,
        }));
        setCharacter({
          id: r.id,
          name: r.fields.Name ?? "—",
          biography: r.fields.Biography ?? "",
          type: r.fields.Type ?? null,
          range: Array.isArray(r.fields.Range)
            ? r.fields.Range.join(" / ")
            : r.fields.Range ?? null,
          headshot: r.fields.Headshot?.[0]?.url ?? null,
          fullBody: r.fields["Full Body"]?.[0]?.url ?? null,
          inventory,
          stats: {
            STA: r.fields.Stamina   ?? 0,
            STR: r.fields.Strength  ?? 0,
            DEF: r.fields.Defense   ?? 0,
            AGL: r.fields.Agility   ?? 0,
            JMP: r.fields.Jump      ?? 0,
            SPD: r.fields.Speed     ?? 0,
            INT: r.fields.Intellect ?? 0,
          },
          ap:        r.fields["Ability Points"]  ?? 0,
          hp:        r.fields["Health Points"]  ?? 0,
          sp:        r.fields["Special Points"] ?? 0,
          level:     r.fields.Level             ?? 0,
          exp:       r.fields.Experience        ?? 0,
          nextLevel: r.fields["Next Level"]     ?? 0,
        });

        const accessoryIds = r.fields["Accessories"] ?? [];
        const partyIds     = r.fields["PartyMembers"] ?? [];
        const gearSlotIds  = [
          r.fields["Gear1"]?.[0] ?? null,
          r.fields["Gear2"]?.[0] ?? null,
          r.fields["Gear3"]?.[0] ?? null,
        ];

        const [accRecords, partyRecords, ...gearRecords] = await Promise.all([
          accessoryIds.length > 0
            ? Promise.all(accessoryIds.map((id) => fetchRecord(id)))
            : Promise.resolve([]),
          partyIds.length > 0
            ? Promise.all(partyIds.map((id) => fetchRecord(id)))
            : Promise.resolve([]),
          ...gearSlotIds.map((id) => id ? fetchRecord(id) : Promise.resolve(null)),
        ]);

        setCharacter((prev) => ({
          ...prev,
          accessories: accRecords.map((ar) => ({
            id:          ar.id,
            name:        ar.fields.Name        ?? "—",
            description: ar.fields.Description ?? "",
            image:       ar.fields.Image?.[0]?.thumbnails?.large?.url ?? null,
          })),
          gear: gearRecords.map((gr) => gr ? ({
            id:          gr.id,
            name:        gr.fields.Name        ?? "—",
            description: gr.fields.Description ?? "",
            image:       gr.fields.Image?.[0]?.thumbnails?.large?.url
                      ?? gr.fields.Image?.[0]?.url
                      ?? null,
          }) : null),
        }));

        setPartyMembers(
          partyRecords.map((pr) => ({
            id: pr.id,
            name: pr.fields.Name ?? "—",
            headshot: pr.fields.Headshot?.[0]?.url ?? null,
            type: pr.fields.Type ?? null,
            level: pr.fields.Level ?? 0,
            stats: {
              STA: pr.fields.Stamina   ?? 0,
              STR: pr.fields.Strength  ?? 0,
              DEF: pr.fields.Defense   ?? 0,
              AGL: pr.fields.Agility   ?? 0,
              JMP: pr.fields.Jump      ?? 0,
              SPD: pr.fields.Speed     ?? 0,
              INT: pr.fields.Intellect ?? 0,
            },
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [characterName]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") setPanel(1);
      if (e.key === "ArrowLeft") setPanel(0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (loading)
    return (
      <div className="detail-page detail-page--centered">
        <p>Loading…</p>
      </div>
    );

  if (error)
    return (
      <div className="detail-page detail-page--centered">
        <p>Error: {error}</p>
      </div>
    );

  const changeCategory = (newIndex, dir) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPrevCategoryIndex(categoryIndex);
    setSlideDir(dir);
    setCategoryIndex(newIndex);
    timeoutRef.current = setTimeout(
      () => setPrevCategoryIndex(null),
      SLIDE_DURATION
    );
  };

  const prevCategory = () =>
    changeCategory(
      (categoryIndex - 1 + ITEM_CATEGORIES.length) % ITEM_CATEGORIES.length,
      "prev"
    );

  const nextCategory = () =>
    changeCategory((categoryIndex + 1) % ITEM_CATEGORIES.length, "next");

  return (
    <div className="detail-page">
      <div className="detail-topbar">
        <button className="start-btn" onClick={onStart}>
          Start
        </button>
      </div>

      <div className="detail-scroll-container">
        <div
          className="detail-panels"
          style={{
            transform: panel === 1 ? "translateX(-60vw)" : "translateX(0)",
          }}
        >
          {/* Inventory — left column */}
          <div className="detail-col detail-col--items">
            <h3 className="col-title">Inventory</h3>
            <div className="items-box">
              <div className="items-header">
                <button className="items-arrow" onClick={prevCategory}>
                  ‹
                </button>
                <h4>{ITEM_CATEGORIES[categoryIndex].name}</h4>
                <button className="items-arrow" onClick={nextCategory}>
                  ›
                </button>
              </div>
              <div className="items-grid-wrapper">
                {prevCategoryIndex !== null && (
                  <div className={`items-grid items-grid--slide-out-${slideDir}`}>
                    {character.inventory
                      .filter(item => item.category === ITEM_CATEGORIES[prevCategoryIndex].filter)
                      .map(item => (
                        <div key={item.id} className="item-slot">{item.name}</div>
                      ))}
                  </div>
                )}
                <div
                  key={categoryIndex}
                  className={`items-grid items-grid--slide-in-${slideDir}`}
                >
                  {character.inventory
                    .filter(item => item.category === ITEM_CATEGORIES[categoryIndex].filter)
                    .map(item => (
                      <div
                        key={item.id}
                        className={`item-slot${activeItem?.id === item.id ? " item-slot--active" : ""}`}
                        onMouseEnter={() => setActiveItem(item)}
                      >
                        {item.image
                          ? <img src={item.image} alt={item.name} className="item-slot-img" />
                          : <span>{item.name}</span>
                        }
                      </div>
                    ))}
                </div>
              </div>
              <div className="item-description-box">
                {activeItem?.description}
              </div>
            </div>
          </div>

          {/* Stats & Accessories — middle column */}
          <div className="detail-col detail-col--stats">
            <div className="ap-row">
              <span className="ap-label">AP: <strong>{character.ap}</strong></span>
              <div className="stat-bar-container">
                <div className="stat-bar" style={{ width: `${character.ap}%` }} />
              </div>
            </div>
            <h4>Stats</h4>
            <div className="stats-bars">
              {Object.entries(character.stats).map(([label, value]) => (
                <div key={label} className="stat-row">
                  <span className="stat-label">{label}</span>
                  <div className="stat-bar-container">
                    <div className="stat-bar" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <h4>Accessories</h4>
            <div className="accessories-grid">
              {(character.accessories ?? []).map((acc) => (
                <div
                  key={acc.id}
                  className={`acc-slot${activeAccessory?.id === acc.id ? " acc-slot--active" : ""}`}
                  onMouseEnter={() => setActiveAccessory(acc)}
                  onMouseLeave={() => setActiveAccessory(null)}
                >
                  {acc.image
                    ? <img src={acc.image} alt={acc.name} className="acc-slot-img" />
                    : <span className="acc-slot-name">{acc.name}</span>
                  }
                </div>
              ))}
            </div>
            <div className="acc-description-box">
              {activeAccessory?.description}
            </div>
          </div>

          {/* Character — 50vw (shared between both panels) */}
          <div className="detail-col detail-col--character">
            <h2 className="character-name">{character.name}</h2>
            <div className={`char-vitals${panel === 1 ? " char-vitals--hidden" : ""}`}>
              <div className="vitals-row">
                <span className="vital"><strong>HP:</strong> {character.hp} / 100</span>
                <span className="vital"><strong>SP:</strong> {character.sp} / 100</span>
              </div>
              <div className="vitals-row">
                <span className="vital"><strong>Lvl:</strong> {character.level}</span>
                <span className="vital"><strong>Exp:</strong> {character.exp}</span>
              </div>
              <div className="next-level-row">
                <span className="next-level-label">Next Level:</span>
                <div className="next-level-bar-container">
                  <div className="next-level-bar" style={{ width: `${character.nextLevel}%` }} />
                </div>
              </div>
            </div>
            <div className="char-body">
              <div className={`character-image-box${panel === 0 ? " character-image-box--small" : ""}`}>
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
                      <div className="type-range-box">
                        <span className="type-range-label">Type</span>
                        <span className="type-range-value">{character.type}</span>
                      </div>
                    )}
                    {character.range && (
                      <div className="type-range-box">
                        <span className="type-range-label">Range</span>
                        <span className="type-range-value">{character.range}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={`gear-column${panel === 1 ? " gear-column--visible" : ""}`}>
                {(character.gear ?? [null, null, null]).map((g, i) => (
                  <div
                    key={i}
                    className="gear-slot-wrapper"
                    onMouseEnter={() => setActiveGear(g)}
                    onMouseLeave={() => setActiveGear(null)}
                  >
                    <div className="gear-slot">
                      {g?.image && (
                        <img src={g.image} alt={g.name} className="gear-slot-img" />
                      )}
                    </div>
                    <span className="gear-label">{g?.name ?? `Gear ${i + 1}`}</span>
                    {activeGear?.id === g?.id && g?.description && (
                      <div className="gear-tooltip">{g.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio — right 50vw (panel 2) */}
          <div className="detail-col detail-col--bio">
            <h3 className="col-title">Biography</h3>
            <div className="character-bio-box">
              {character.biography || "No biography available."}
            </div>
            <div className="party-section">
              <h4 className="party-heading">Party Members</h4>
              <div className="party-members-row">
                {partyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="party-card"
                    onClick={() => onSelectCharacter(member.name)}
                  >
                    <span className="party-card-name">{member.name}</span>
                    <div className="party-card-body">
                      <div className="party-card-left">
                        <div className="party-card-image">
                          {member.headshot
                            ? <img src={member.headshot} alt={member.name} className="party-slot-img" />
                            : null
                          }
                        </div>
                        <div className="type-range-box party-card-label">
                          <span className="type-range-label">Type</span>
                          <span className="type-range-value">{member.type ?? "—"}</span>
                        </div>
                      </div>
                      <div className="party-card-right">
                        <div className="party-card-stats">
                          {Object.entries(member.stats).map(([label, value]) => (
                            <div key={label} className="party-stat-row">
                              <span className="stat-label">{label}</span>
                              <div className="stat-bar-container">
                                <div className="stat-bar" style={{ width: `${value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="type-range-box party-card-label">
                          <span className="type-range-label">Level</span>
                          <span className="type-range-value">{member.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {panel === 0 && (
          <button
            className="panel-nav-btn panel-nav-btn--next"
            onClick={() => setPanel(1)}
          >
            Gear and Bio →
          </button>
        )}
        {panel === 1 && (
          <button
            className="panel-nav-btn panel-nav-btn--prev"
            onClick={() => setPanel(0)}
          >
            ← Stats and Inventory
          </button>
        )}
      </div>
    </div>
  );
}

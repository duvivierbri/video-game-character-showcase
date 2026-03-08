import { useEffect, useRef, useState } from "react";
import Accessories from "../components/characterDetails/Accessories";
import Biography from "../components/characterDetails/Biography";
import CharacterFullBodyImage from "../components/characterDetails/CharacterFullBodyImage";
import Inventory from "../components/characterDetails/Inventory";
import Stats from "../components/characterDetails/Stats";
import Vitals from "../components/characterDetails/Vitals";
import { fetchRecord, fetchRecordByName } from "../lib/airtable";

const ITEM_CATEGORIES_LENGTH = 3;
const SLIDE_DURATION = 300;

export default function CharacterDetailPage({
  characterName,
  onStart,
  onBack,
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
        const names = r.fields["Name (from Inventory)"] ?? [];
        const descs = r.fields["Description (from Inventory)"] ?? [];
        const cats = r.fields["Category (from Inventory)"] ?? [];
        const imgs = r.fields["Image (from Inventory)"] ?? [];
        const ids = r.fields["Inventory"] ?? [];
        const inventory = ids.map((id, i) => ({
          id,
          name: names[i] ?? "—",
          description: descs[i] ?? "",
          category: cats[i] ?? "",
          image: imgs[i]?.thumbnails?.large?.url ?? null,
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
            STA: r.fields.Stamina ?? 0,
            STR: r.fields.Strength ?? 0,
            DEF: r.fields.Defense ?? 0,
            AGL: r.fields.Agility ?? 0,
            JMP: r.fields.Jump ?? 0,
            SPD: r.fields.Speed ?? 0,
            INT: r.fields.Intellect ?? 0,
          },
          ap: r.fields["Ability Points"] ?? 0,
          hp: r.fields["Health Points"] ?? 0,
          sp: r.fields["Special Points"] ?? 0,
          level: r.fields.Level ?? 0,
          exp: r.fields.Experience ?? 0,
          nextLevel: r.fields["Next Level"] ?? 0,
        });

        const accessoryIds = r.fields["Accessories"] ?? [];
        const partyIds = r.fields["PartyMembers"] ?? [];
        const gearSlotIds = [
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
          ...gearSlotIds.map((id) =>
            id ? fetchRecord(id) : Promise.resolve(null)
          ),
        ]);

        setCharacter((prev) => ({
          ...prev,
          accessories: accRecords.map((ar) => ({
            id: ar.id,
            name: ar.fields.Name ?? "—",
            description: ar.fields.Description ?? "",
            image: ar.fields.Image?.[0]?.thumbnails?.large?.url ?? null,
          })),
          gear: gearRecords.map((gr) =>
            gr
              ? {
                  id: gr.id,
                  name: gr.fields.Name ?? "—",
                  description: gr.fields.Description ?? "",
                  image:
                    gr.fields.Image?.[0]?.thumbnails?.large?.url ??
                    gr.fields.Image?.[0]?.url ??
                    null,
                }
              : null
          ),
        }));

        setPartyMembers(
          partyRecords.map((pr) => ({
            id: pr.id,
            name: pr.fields.Name ?? "—",
            headshot: pr.fields.Headshot?.[0]?.url ?? null,
            type: pr.fields.Type ?? null,
            level: pr.fields.Level ?? 0,
            stats: {
              STA: pr.fields.Stamina ?? 0,
              STR: pr.fields.Strength ?? 0,
              DEF: pr.fields.Defense ?? 0,
              AGL: pr.fields.Agility ?? 0,
              JMP: pr.fields.Jump ?? 0,
              SPD: pr.fields.Speed ?? 0,
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

  if (loading) return <div className="spinner-overlay"><div className="spinner" /></div>;

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
      (categoryIndex - 1 + ITEM_CATEGORIES_LENGTH) % ITEM_CATEGORIES_LENGTH,
      "prev"
    );

  const nextCategory = () =>
    changeCategory((categoryIndex + 1) % ITEM_CATEGORIES_LENGTH, "next");

  return (
    <div className="detail-page">
      <div className="detail-topbar">
        <button className="back-btn" onClick={onBack}>
          Back
        </button>
        <button className="nav-btn" onClick={onStart}>
          Welcome Page
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
          <Inventory
            character={character}
            categoryIndex={categoryIndex}
            prevCategoryIndex={prevCategoryIndex}
            slideDir={slideDir}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            onPrevCategory={prevCategory}
            onNextCategory={nextCategory}
          />

          {/* Stats & Accessories — middle column */}
          <div className="detail-col detail-col--stats">
            <Stats character={character} />
            <Accessories
              character={character}
              activeAccessory={activeAccessory}
              setActiveAccessory={setActiveAccessory}
            />
          </div>

          {/* Character — 50vw (shared between both panels) */}
          <div className="detail-col detail-col--character">
            <h2 className="character-name">{character.name}</h2>
            <Vitals character={character} panel={panel} />
            <CharacterFullBodyImage
              character={character}
              panel={panel}
              activeGear={activeGear}
              setActiveGear={setActiveGear}
            />
          </div>

          {/* Bio — right 50vw (panel 2) */}
          <Biography
            character={character}
            partyMembers={partyMembers}
            onSelectCharacter={onSelectCharacter}
          />
        </div>

        {panel === 0 && (
          <button
            className="panel-nav-btn panel-nav-btn--next"
            onClick={() => setPanel(1)}
          >
            Gear and Bio
          </button>
        )}
        {panel === 1 && (
          <button
            className="panel-nav-btn panel-nav-btn--prev"
            onClick={() => setPanel(0)}
          >
            Stats and Inventory
          </button>
        )}
      </div>
    </div>
  );
}

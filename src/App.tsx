import { useMemo, useState } from "react";
import {
  Activity,
  Box,
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  EyeOff,
  Focus,
  Gauge,
  Languages,
  Layers3,
  MapPin,
  Maximize2,
  Menu,
  MousePointer2,
  Move3d,
  PanelLeftClose,
  Rotate3d,
  Ruler,
  Search,
  Settings2,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Split,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type SystemItem = {
  id: string;
  name: string;
  detail: string;
  color: string;
  children: string[];
};

const systems: SystemItem[] = [
  { id: "skeletal", name: "Esquelético", detail: "206 estruturas", color: "#DED8C8", children: ["Esqueleto axial", "Esqueleto apendicular"] },
  { id: "muscular", name: "Muscular", detail: "752 estruturas", color: "#D87866", children: ["Músculos da cabeça", "Músculos do tronco", "Membros"] },
  { id: "cardio", name: "Cardiovascular", detail: "1.834 estruturas", color: "#E45757", children: ["Coração", "Artérias", "Veias"] },
  { id: "nervous", name: "Nervoso", detail: "642 estruturas", color: "#E2B65B", children: ["Sistema central", "Sistema periférico"] },
  { id: "respiratory", name: "Respiratório", detail: "118 estruturas", color: "#87BFC7", children: ["Vias aéreas", "Pulmões"] },
  { id: "digestive", name: "Digestório", detail: "184 estruturas", color: "#B78EC7", children: ["Trato gastrointestinal", "Órgãos anexos"] },
  { id: "lymphatic", name: "Linfático", detail: "276 estruturas", color: "#7CB79A", children: ["Vasos linfáticos", "Linfonodos"] },
  { id: "urinary", name: "Urinário", detail: "86 estruturas", color: "#C79662", children: ["Rins", "Vias excretoras"] },
  { id: "reproductive", name: "Reprodutor", detail: "164 estruturas", color: "#D18EAC", children: ["Órgãos internos", "Órgãos externos"] },
  { id: "senses", name: "Órgãos dos sentidos", detail: "94 estruturas", color: "#8FA9D8", children: ["Olho", "Ouvido interno"] },
  { id: "endocrine", name: "Endócrino", detail: "58 estruturas", color: "#D6A767", children: ["Hipófise", "Tireoide", "Suprarrenais"] },
];

const searchResults = [
  { name: "Coração", system: "Cardiovascular", fma: "FMA:7088" },
  { name: "Aorta ascendente", system: "Cardiovascular", fma: "FMA:3736" },
  { name: "Pulmão direito", system: "Respiratório", fma: "FMA:7311" },
  { name: "Rim esquerdo", system: "Urinário", fma: "FMA:7203" },
  { name: "Nervo óptico", system: "Nervoso", fma: "FMA:50863" },
];

const copy = {
  PT: { atlas: "Atlas humano", systems: "Sistemas", search: "Buscar estrutura...", selected: "Estrutura selecionada", about: "Sobre" },
  EN: { atlas: "Human atlas", systems: "Systems", search: "Search structure...", selected: "Selected structure", about: "About" },
  ES: { atlas: "Atlas humano", systems: "Sistemas", search: "Buscar estructura...", selected: "Estructura seleccionada", about: "Acerca de" },
} as const;

const onboardingSteps = [
  { title: "Explore o modelo", text: "Arraste para rotacionar, use o scroll para aproximar e clique em uma estrutura para selecioná-la.", icon: Rotate3d },
  { title: "Busque qualquer estrutura", text: "Use a omnibox para localizar instantaneamente órgãos, vasos, ossos e termos da ontologia FMA.", icon: Search },
  { title: "Anote e mensure", text: "Adicione marcadores clínicos ou meça distâncias diretamente sobre a superfície anatômica.", icon: Ruler },
];

const Button = ({
  children,
  label,
  active = false,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className={`icon-button ${active ? "is-active" : ""} ${className}`}
  >
    {children}
  </button>
);

function AnatomyFigure({
  selected,
  exploded,
  model,
  opacity,
}: {
  selected: boolean;
  exploded: boolean;
  model: "masculino" | "feminino";
  opacity: number;
}) {
  return (
    <svg
      className={`anatomy-figure ${exploded ? "is-exploded" : ""} model-${model}`}
      style={{ "--system-opacity": opacity / 100 } as React.CSSProperties}
      viewBox="0 0 430 760"
      role="img"
      aria-label={`Modelo anatômico ${model} anterior do sistema cardiovascular`}
    >
      <g className="body-outline">
        <ellipse cx="215" cy="63" rx="48" ry="57" />
        <path d="M173 106 C149 126 142 163 143 212 L154 340 C160 399 169 460 175 505 L169 716 C168 744 191 750 199 720 L215 524 L231 720 C239 750 262 744 261 716 L255 505 C261 460 270 399 276 340 L287 212 C288 163 281 126 257 106 C238 118 192 118 173 106Z" />
        <path d="M151 152 C122 178 103 229 93 280 L60 418 C55 441 76 448 86 426 L133 310 L163 224Z" />
        <path d="M279 152 C308 178 327 229 337 280 L370 418 C375 441 354 448 344 426 L297 310 L267 224Z" />
      </g>

      <g className="skeleton anatomy-layer layer-skeleton">
        <path className="bone" d="M190 119 Q215 139 240 119" />
        <path className="bone" d="M215 120 L215 499" />
        {[154, 178, 202, 226, 250, 274, 298].map((y, index) => (
          <g key={y} opacity={1 - index * 0.055}>
            <path className="rib" d={`M212 ${y} Q171 ${y - 8} 164 ${y + 22} Q180 ${y + 35} 210 ${y + 34}`} />
            <path className="rib" d={`M218 ${y} Q259 ${y - 8} 266 ${y + 22} Q250 ${y + 35} 220 ${y + 34}`} />
          </g>
        ))}
        <path className="bone" d="M177 463 Q215 487 253 463" />
        <path className="bone subtle" d="M181 483 L185 711 M249 483 L245 711" />
        <path className="bone subtle" d="M146 170 L77 414 M284 170 L353 414" />
      </g>

      <g className="organs anatomy-layer layer-organs">
        <path className="lung" d="M204 158 C182 147 160 176 158 232 C157 281 174 319 205 299Z" />
        <path className="lung" d="M226 158 C248 147 270 176 272 232 C273 281 256 319 225 299Z" />
        <path className={`heart ${selected ? "selected" : ""}`} d="M214 220 C194 189 164 216 176 250 C186 279 214 300 215 301 C216 300 245 278 254 250 C266 213 232 190 214 220Z" />
        <path className="vessel artery" d="M215 224 C216 190 240 182 246 153 C253 122 243 104 243 104" />
        <path className="vessel artery" d="M220 205 C255 189 275 174 292 151" />
        <path className="vessel artery" d="M210 202 C183 181 160 165 143 145" />
        <path className="vessel artery" d="M216 292 C221 358 226 417 225 500 L244 701" />
        <path className="vessel artery" d="M219 466 L186 701" />
        <path className="vessel vein" d="M205 286 C197 361 204 438 207 497 L192 702" />
        <path className="vessel vein" d="M208 460 L249 702" />
        <path className="vessel vein" d="M206 210 C191 179 175 166 154 150" />
        <path className="vessel vein" d="M224 209 C250 181 267 165 285 148" />
        <path className="kidney" d="M179 321 C160 317 155 344 165 365 C176 376 190 361 189 339 C188 328 185 323 179 321Z" />
        <path className="kidney" d="M251 321 C270 317 275 344 265 365 C254 376 240 361 241 339 C242 328 245 323 251 321Z" />
        <path className="urinary-path" d="M179 360 C181 405 194 431 207 451 M251 360 C249 405 236 431 223 451" />
        <path
          className="reproductive-organ"
          d={model === "feminino"
            ? "M215 431 C200 415 187 425 191 443 C197 456 207 459 215 466 C223 459 233 456 239 443 C243 425 230 415 215 431Z"
            : "M207 438 Q215 425 223 438 L221 468 Q215 478 209 468Z"}
        />
      </g>

      <g className="lymphatic anatomy-layer layer-lymphatic">
        <path d="M215 128 C201 190 204 270 215 340 C226 404 220 468 215 520" />
        {[145, 190, 235, 281, 338, 395, 455].map((y, index) => (
          <g key={y}>
            <circle cx={index % 2 ? 204 : 210} cy={y} r="4" />
            <circle cx={index % 2 ? 226 : 220} cy={y + 8} r="4" />
          </g>
        ))}
      </g>

      <g className="endocrine anatomy-layer layer-endocrine">
        <circle cx="215" cy="74" r="4" />
        <path d="M204 141 Q215 132 226 141 Q215 151 204 141Z" />
        <circle cx="215" cy="329" r="5" />
      </g>

      <g className="anatomy-markers">
        <circle cx="240" cy="236" r="5" />
        <path d="M245 236 L322 236" />
        <rect x="322" y="218" width="92" height="36" rx="7" />
        <text x="338" y="241">Coração</text>
      </g>
    </svg>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("cardio");
  const [expandedSystems, setExpandedSystems] = useState(() => new Set(["cardio"]));
  const [visibleSystems, setVisibleSystems] = useState(() => new Set(systems.map((item) => item.id)));
  const [selectedStructure, setSelectedStructure] = useState(true);
  const [selectedName, setSelectedName] = useState("Coração");
  const [opacity, setOpacity] = useState(78);
  const [view, setView] = useState("3D");
  const [tab, setTab] = useState("Visão geral");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [model, setModel] = useState<"masculino" | "feminino">("masculino");
  const [exploded, setExploded] = useState(false);
  const [activeTool, setActiveTool] = useState<"select" | "pin" | "measure">("select");
  const [pins, setPins] = useState<{ id: number; label: string }[]>([]);
  const [editingPin, setEditingPin] = useState<number | null>(null);
  const [measurement, setMeasurement] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showHud, setShowHud] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<keyof typeof copy>("PT");
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const [focusMessage, setFocusMessage] = useState("");

  const filteredSystems = useMemo(
    () => systems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const suggestions = query.length > 1
    ? searchResults.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];
  const t = copy[language];

  const toggleVisibility = (id: string) => {
    setVisibleSystems((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectSearchResult = (result: (typeof searchResults)[number]) => {
    setQuery("");
    setSelectedName(result.name);
    setSelectedStructure(true);
    setRightOpen(true);
    setFocusMessage(`${result.name} focado na câmera`);
  };

  const handleModelClick = (clickCount: number) => {
    setContextMenu(null);
    if (activeTool === "pin") {
      const id = Date.now();
      setPins((current) => [...current, { id, label: `Nota clínica ${current.length + 1}` }]);
      setEditingPin(id);
      setFocusMessage("Marcador adicionado à superfície");
      return;
    }
    if (activeTool === "measure") {
      if (clickCount > 1) {
        setMeasurement(true);
        setFocusMessage("Distância medida: 124,6 mm");
      } else {
        setFocusMessage("Clique novamente para definir o segundo ponto");
      }
      return;
    }
    setSelectedStructure((current) => !current);
  };

  return (
    <main className={`app-shell theme-${theme}`} onClick={() => contextMenu && setContextMenu(null)}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Activity size={20} strokeWidth={1.8} />
          </div>
          <div>
            <p className="brand-name">QUIMERA</p>
            <p className="brand-subtitle">ANATOMY LABS</p>
          </div>
        </div>

        <div className="study-context">
          <span className="status-dot" />
          <span>{t.atlas}</span>
          <span className="context-divider">/</span>
          <div className="model-selector" role="group" aria-label="Modelo anatômico">
            {(["masculino", "feminino"] as const).map((option) => (
              <button
                type="button"
                key={option}
                className={model === option ? "active" : ""}
                aria-pressed={model === option}
                onClick={() => setModel(option)}
              >
                {option === "masculino" ? "Masculino" : "Feminino"}
              </button>
            ))}
          </div>
        </div>

        <div className="top-actions">
          <button className={`performance-chip ${showHud ? "active" : ""}`} type="button" onClick={() => setShowHud((current) => !current)}>
            <span>GPU</span>
            <strong>60 FPS</strong>
          </button>
          <div className="language-switcher" aria-label="Idioma">
            <Languages size={14} />
            {(["PT", "EN", "ES"] as const).map((item) => (
              <button type="button" className={language === item ? "active" : ""} onClick={() => setLanguage(item)} key={item}>{item}</button>
            ))}
          </div>
          <Button label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"} onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}>
            <Sun size={18} />
          </Button>
          <Button label="Compartilhar"><Share2 size={18} /></Button>
          <Button label="Configurações"><Settings2 size={18} /></Button>
          <button className="profile" type="button" aria-label="Abrir perfil">ML</button>
        </div>
      </header>

      <div className={`workspace ${leftOpen ? "" : "left-collapsed"} ${rightOpen ? "" : "right-collapsed"}`}>
        <aside className="systems-panel" aria-label="Sistemas anatômicos">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">BIBLIOTECA FMA</span>
              <h1>{t.systems}</h1>
            </div>
            <Button label="Recolher painel" onClick={() => setLeftOpen(false)}><PanelLeftClose size={18} /></Button>
          </div>
          <label className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              aria-label="Buscar estrutura anatômica"
            />
            <kbd>⌘ K</kbd>
            {suggestions.length > 0 && (
              <div className="search-suggestions" role="listbox">
                {suggestions.map((result) => (
                  <button type="button" role="option" key={result.fma} onClick={() => selectSearchResult(result)}>
                    <Focus size={15} />
                    <span><strong>{result.name}</strong><small>{result.system} · {result.fma}</small></span>
                    <span className="focus-label">Focar</span>
                  </button>
                ))}
              </div>
            )}
          </label>
          <div className="system-summary">
            <span>{systems.length} sistemas</span>
            <button type="button" onClick={() => setVisibleSystems(new Set(systems.map((item) => item.id)))}>
              Mostrar todos
            </button>
          </div>
          <div className="system-list">
            {filteredSystems.map((item) => {
              const isSelected = selectedSystem === item.id;
              const isVisible = visibleSystems.has(item.id);
              return (
                <div className={`system-branch ${isSelected ? "selected" : ""}`} key={item.id}>
                  <div className="system-row">
                    <button
                      className="system-main"
                      type="button"
                      onClick={() => {
                        setSelectedSystem(item.id);
                        setExpandedSystems((current) => {
                          const next = new Set(current);
                          next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                          return next;
                        });
                      }}
                      aria-expanded={expandedSystems.has(item.id)}
                    >
                      <ChevronRight className={expandedSystems.has(item.id) ? "expanded" : ""} size={14} />
                      <span className="system-color" style={{ backgroundColor: item.color }} />
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.detail}</small>
                      </span>
                    </button>
                    <button
                      className="visibility-button"
                      type="button"
                      onClick={() => toggleVisibility(item.id)}
                      aria-label={`${isVisible ? "Ocultar" : "Mostrar"} sistema ${item.name}`}
                    >
                      {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {expandedSystems.has(item.id) && (
                    <div className="tree-children">
                      {item.children.map((child) => (
                        <button type="button" key={child} onClick={() => setSelectedName(child)}>
                          <span />
                          {child}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="panel-footnote">
            <Box size={16} />
            <span><strong>4.750</strong> estruturas carregadas</span>
          </div>
        </aside>

        <section className="viewport" aria-label="Visualizador anatômico tridimensional">
          {!leftOpen && (
            <Button label="Abrir sistemas" className="open-left" onClick={() => setLeftOpen(true)}>
              <Menu size={19} />
            </Button>
          )}
          <div className="viewport-header">
            <div className="view-switcher" role="group" aria-label="Modo de visualização">
              {["3D", "RX", "TC"].map((mode) => (
                <button
                  type="button"
                  className={view === mode ? "active" : ""}
                  onClick={() => setView(mode)}
                  aria-pressed={view === mode}
                  key={mode}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="view-tools">
              <Button label="Selecionar" active={activeTool === "select"} onClick={() => setActiveTool("select")}><MousePointer2 size={18} /></Button>
              <Button label="Adicionar marcador" active={activeTool === "pin"} onClick={() => setActiveTool("pin")}><MapPin size={18} /></Button>
              <Button label="Medir distância" active={activeTool === "measure"} onClick={() => setActiveTool("measure")}><Ruler size={18} /></Button>
              <Button label="Mover"><Move3d size={18} /></Button>
              <Button label="Rotacionar"><Rotate3d size={18} /></Button>
              <span className="tool-divider" />
              <Button label="Vista explodida" active={exploded} onClick={() => setExploded((current) => !current)}>
                <Split size={18} />
              </Button>
              <Button label="Enquadrar modelo"><Focus size={18} /></Button>
              <Button label="Tela cheia"><Maximize2 size={18} /></Button>
            </div>
          </div>

          <div className={`scene scene-${view.toLowerCase()} tool-${activeTool}`}>
            <div className="axis-label axis-top">SUPERIOR</div>
            <div className="axis-label axis-left">DIREITA</div>
            <div className="axis-label axis-right">ESQUERDA</div>
            <div className="scan-line" />
            {exploded && <div className="explode-badge"><Layers3 size={14} /> Vista explodida</div>}
            <button
              type="button"
              className="anatomy-button"
              aria-label={`${activeTool === "pin" ? "Adicionar marcador ao" : activeTool === "measure" ? "Medir" : "Selecionar"} coração no modelo`}
              onClick={(event) => {
                event.stopPropagation();
                handleModelClick(event.detail);
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setContextMenu({ x: event.clientX, y: event.clientY });
              }}
            >
              <AnatomyFigure selected={selectedStructure} exploded={exploded} model={model} opacity={opacity} />
            </button>
            {pins.map((pin, index) => (
              <button
                type="button"
                className="scene-pin"
                style={{ left: `${52 + (index % 3) * 4}%`, top: `${37 + (index % 4) * 7}%` }}
                aria-label={pin.label}
                title={pin.label}
                key={pin.id}
              >
                <MapPin size={18} fill="currentColor" />
                <span>{index + 1}</span>
              </button>
            ))}
            {editingPin !== null && (
              <div className="pin-editor">
                <label htmlFor="pin-note">Anotação do marcador</label>
                <div>
                  <input
                    id="pin-note"
                    autoFocus
                    value={pins.find((pin) => pin.id === editingPin)?.label ?? ""}
                    onChange={(event) => setPins((current) => current.map((pin) => pin.id === editingPin ? { ...pin, label: event.target.value } : pin))}
                  />
                  <button type="button" onClick={() => setEditingPin(null)} aria-label="Salvar anotação"><Check size={15} /></button>
                </div>
              </div>
            )}
            {measurement && (
              <div className="measurement-line">
                <i />
                <span>124,6 mm</span>
                <i />
              </div>
            )}
            {focusMessage && (
              <button type="button" className="focus-toast" onClick={() => setFocusMessage("")}>
                <Check size={14} /> {focusMessage}<X size={13} />
              </button>
            )}
            {showHud && (
              <div className="performance-hud">
                <div><Gauge size={15} /><strong>RENDER HUD</strong></div>
                <dl>
                  <div><dt>Framerate</dt><dd>60 FPS</dd></div>
                  <div><dt>Triângulos</dt><dd>12,4M</dd></div>
                  <div><dt>GPU</dt><dd>1,8 GB</dd></div>
                  <div><dt>Frame</dt><dd>8,2 ms</dd></div>
                </dl>
              </div>
            )}
            <div className="orientation-cube" aria-label="Orientação anterior">
              <svg viewBox="0 0 24 48" aria-hidden="true">
                <circle cx="12" cy="5" r="4" />
                <path d="M8 10 L5 28 L9 29 L8 45 M16 10 L19 28 L15 29 L16 45 M8 11 Q12 14 16 11 L15 30 L9 30Z" />
              </svg>
              <span>ANT</span>
              <div><i>X</i><i>Y</i><i>Z</i></div>
            </div>
          </div>

          <div className="viewport-bottom">
            <div className="selection-breadcrumb">
              <span className="live-indicator" />
              <span>Corpo humano</span>
              <ChevronRight size={13} />
              <span>Cardiovascular</span>
              <ChevronRight size={13} />
              <strong>{selectedName}</strong>
            </div>
            <div className="zoom-controls">
              <Button label="Reduzir zoom"><ZoomOut size={17} /></Button>
              <span>100%</span>
              <Button label="Aumentar zoom"><ZoomIn size={17} /></Button>
            </div>
          </div>
        </section>

        {contextMenu && (
          <div
            className="context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            role="menu"
            onClick={(event) => event.stopPropagation()}
          >
            <span>CORAÇÃO · AÇÕES</span>
            <button type="button" role="menuitem" onClick={() => setContextMenu(null)}><EyeOff size={15} /> Ocultar isto</button>
            <button type="button" role="menuitem" onClick={() => { setFocusMessage("Coração focado na câmera"); setContextMenu(null); }}><Focus size={15} /> Focar</button>
            <button type="button" role="menuitem" onClick={() => { setOpacity(42); setContextMenu(null); }}><Layers3 size={15} /> Tornar translúcido</button>
            <button type="button" role="menuitem" onClick={() => { setTab("Histologia"); setRightOpen(true); setContextMenu(null); }}><Sparkles size={15} /> Ver histologia</button>
          </div>
        )}

        <aside className="detail-panel" aria-label="Detalhes da estrutura selecionada">
          <div className="detail-title-row">
            <div>
              <span className="eyebrow accent">{t.selected.toUpperCase()}</span>
              <h2>{selectedName}</h2>
              <p>Cor · FMA:7088</p>
            </div>
            <button className="close-detail" type="button" onClick={() => setRightOpen(false)} aria-label="Fechar detalhes">×</button>
          </div>

          <div className="selection-preview">
            <div className="heart-mini" aria-hidden="true">♥</div>
            <div>
              <span>Cardiovascular</span>
              <strong>Órgão muscular oco</strong>
            </div>
            <Sparkles size={17} />
          </div>

          <div className="tabs" role="tablist">
            {["Visão geral", "Relações", "Histologia"].map((item) => (
              <button
                type="button"
                role="tab"
                aria-selected={tab === item}
                className={tab === item ? "active" : ""}
                onClick={() => setTab(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "Visão geral" ? (
            <div className="detail-content">
              <section>
                <h3>{t.about}</h3>
                <p>
                  Órgão central do sistema circulatório, responsável por bombear sangue através das circulações pulmonar e sistêmica.
                </p>
              </section>
              <section>
                <h3>Propriedades</h3>
                <dl>
                  <div><dt>Sistema</dt><dd>Cardiovascular</dd></div>
                  <div><dt>Região</dt><dd>Mediastino médio</dd></div>
                  <div><dt>Origem / inserção</dt><dd>Não aplicável</dd></div>
                  <div><dt>Irrigação</dt><dd>Artérias coronárias</dd></div>
                  <div><dt>Inervação</dt><dd>Plexo cardíaco</dd></div>
                  <div><dt>Volume médio</dt><dd>280–340 cm³</dd></div>
                  <div><dt>Ontologia</dt><dd className="fma-link">FMA:7088</dd></div>
                </dl>
              </section>
            </div>
          ) : tab === "Relações" ? (
            <div className="relations-list">
              {["Aorta ascendente", "Tronco pulmonar", "Veia cava superior", "Pericárdio"].map((relation) => (
                <button type="button" key={relation}><span>{relation}</span><ChevronRight size={15} /></button>
              ))}
            </div>
          ) : (
            <div className="histology-card">
              <div className="histology-sample" aria-label="Amostra histológica simulada">
                {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
              </div>
              <span>TECIDO CARDÍACO · H&E</span>
              <h3>Miocárdio</h3>
              <p>Fibras musculares estriadas com núcleos centrais e discos intercalares.</p>
            </div>
          )}

          <div className="display-controls">
            <div className="display-title"><SlidersHorizontal size={16} /><strong>Exibição</strong></div>
            <label>
              <span>Opacidade</span>
              <output>{opacity}%</output>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(event) => setOpacity(Number(event.target.value))}
                style={{ "--range-value": `${opacity}%` } as React.CSSProperties}
              />
            </label>
            <div className="control-buttons">
              <button type="button" className="primary-action"><Focus size={16} /> Isolar</button>
              <button type="button"><EyeOff size={16} /> Ocultar</button>
            </div>
          </div>
        </aside>

        {!rightOpen && (
          <Button label="Abrir detalhes" className="open-right" onClick={() => setRightOpen(true)}>
            <Layers3 size={19} />
          </Button>
        )}
      </div>

      <footer className="statusbar">
        <div><span className="status-dot" /> WebGPU ativo</div>
        <div className="status-metrics">
          <span>12,4M triângulos</span><span>LOD 2</span><span>1,8 GB</span>
        </div>
        <button className="help-link" type="button" onClick={() => setOnboardingStep(0)}><CircleHelp size={14} /> Tour guiado</button>
      </footer>

      {onboardingStep !== null && (() => {
        const step = onboardingSteps[onboardingStep];
        const StepIcon = step.icon;
        return (
          <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="tour-title">
            <div className="onboarding-card">
              <div className="tour-topline">
                <span>PRIMEIROS PASSOS · {onboardingStep + 1}/{onboardingSteps.length}</span>
                <button type="button" onClick={() => setOnboardingStep(null)} aria-label="Fechar tutorial"><X size={18} /></button>
              </div>
              <div className="tour-icon"><StepIcon size={25} /></div>
              <h2 id="tour-title">{step.title}</h2>
              <p>{step.text}</p>
              <div className="tour-progress">
                {onboardingSteps.map((_, index) => <i className={index <= onboardingStep ? "active" : ""} key={index} />)}
              </div>
              <div className="tour-actions">
                <button type="button" onClick={() => setOnboardingStep(null)}>Pular tour</button>
                <button
                  type="button"
                  className="tour-next"
                  onClick={() => onboardingStep === onboardingSteps.length - 1 ? setOnboardingStep(null) : setOnboardingStep(onboardingStep + 1)}
                >
                  {onboardingStep === onboardingSteps.length - 1 ? "Concluir" : "Próximo"}
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}

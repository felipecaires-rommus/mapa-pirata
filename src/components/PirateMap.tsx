import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import pirateMap from "@/assets/real-map.jpg";
import pirateShip from "@/assets/pirate-ship.png";

type Treasure = {
  id: string;
  name: string;
  location: string;
  description: string;
  x: number;
  y: number;
};

// Rota da expedição: Curitiba → Praia do Mel → Chile → Costa Rica → Curitiba
const TREASURES: Treasure[] = [
  {
    id: "curitiba",
    name: "1. Curitiba (Partida)",
    location: "Paraná, Brasil",
    description:
      "Ponto de partida da expedição! Apesar de ser no interior, Curitiba era passagem das rotas dos tropeiros que levavam ouro e mercadorias rumo ao litoral, alvo cobiçado por piratas que rondavam o sul do Brasil.",
    x: 65,
    y: 62,
  },
  {
    id: "praia-do-mel",
    name: "2. Ilha do Mel 🇧🇷",
    location: "Litoral do Paraná, Brasil — entrada da Baía de Paranaguá",
    description:
      "🌿 SANTUÁRIO ECOLÓGICO DO PARANÁ\n\nA cerca de 4 km do continente (Pontal do Sul), a Ilha do Mel tem 2.762 hectares e 35 km de perímetro, formada por duas áreas unidas por um istmo de apenas 150 m. Ao norte, planícies com restingas e mangues; ao sul, morros que chegam a 160 m. Clima superúmido de transição entre tropical e subtropical, água do mar a ~21°C no verão.\n\n🛡️ PRESERVAÇÃO: 95% do território é área de preservação (Estação Ecológica + Parque Estadual). Só 5% é liberado para turismo — não há carros nem ruas asfaltadas.\n\n👥 POPULAÇÃO: ~1.200 nativos (ilhéus), distribuídos em 5 vilarejos: Encantadas (o maior, chega a 5 mil na alta temporada), Nova Brasília, Farol, Fortaleza e Ponta Oeste. Vivem da pesca artesanal e do turismo, com tradições como a pesca da tainha, a dança do fandango e a lenda das sereias de Encantadas.\n\n🏰 HISTÓRIA PIRATA: A Fortaleza Nossa Senhora dos Prazeres (1767) foi erguida para proteger a Baía de Paranaguá dos ataques de piratas e corsários. O Farol das Conchas (1872), feito de ferro na Inglaterra, ainda guia navegantes hoje.\n\n📜 CURIOSIDADE: Sambaquis comprovam ocupação humana pré-cabralina. O nome \"Ilha do Mel\" aparece em mapas de 1666 — entre as teorias estão a cor mel da água vista do alto, a produção de mel silvestre, ou a palavra alemã \"Mehl\" (farinha) de um antigo morador.",
    x: 68.5,
    y: 62,
  },
  {
    id: "chile",
    name: "3. La Cueva del Pirata 🇨🇱",
    location: "Quintero, Região de Valparaíso, Chile",
    description:
      "🏴‍☠️ A LENDA CORSÁRIA DE QUINTERO\n\n📍 LOCALIZAÇÃO: Comuna de Quintero, Região de Valparaíso, ~40 km ao norte de Viña del Mar. É uma formação geológica — uma caverna esculpida pela natureza nos acantilados (falésias) costeiros de rocha. A paisagem tem grandes praias de areia fina, como a Playa Los Enamorados, e fortes ondas do Oceano Pacífico.\n\n👥 POPULAÇÃO: Quintero tem cerca de 25.000 habitantes. Fundada no século XIX como pequeno assentamento de pescadores, hoje vive de pesca, indústria portuária e turismo. É um destino mais tranquilo que Viña del Mar, com frutos do mar frescos, observação de lobos marinhos e aves costeiras.\n\n⚔️ A LENDA DO PIRATA: A fama da caverna vem das histórias de que teria servido de esconderijo para corsários que navegavam pela costa chilena no século XVI. O nome mais associado é o do lendário pirata inglês Sir Francis Drake, que teria explorado a região em 1578. Não há comprovação histórica definitiva — mas o mistério é parte do charme do local!",
    x: 34,
    y: 71,
  },
  {
    id: "costa-rica",
    name: "4. Bahía de los Piratas 🇨🇷",
    location: "Península de Nicoya, Costa do Pacífico, Costa Rica",
    description:
      "🌴 REFÚGIO NA PENÍNSULA DE NICOYA\n\n📍 LOCALIZAÇÃO: Península de Nicoya, costa do Pacífico da Costa Rica, próximo às cidades de Tambor e Cóbano. Uma das zonas de maior biodiversidade do país.\n\n🏝️ CARACTERÍSTICAS: Região de praias isoladas e de difícil acesso, cercadas por exuberante floresta tropical. A baía é abrigada, com águas mornas — ideal para quem busca tranquilidade e contato com a natureza intocada.\n\n⚔️ REFÚGIO HISTÓRICO: Nos séculos XVI e XVII, a costa da Costa Rica era rota frequente dos navios que levavam ouro e prata do Novo Mundo para a Espanha. Piratas e corsários a serviço de outras coroas europeias usavam as baías isoladas da Península de Nicoya para se esconder, descansar, consertar seus navios e emboscar os galeões espanhóis. Baías como esta eram um \"ponto de apoio\" perfeito.\n\n🧭 HOJE: O nome \"Bahía de los Piratas\" é chamariz para o turismo de aventura. Visitantes chegam por barco, fazem caminhadas e exploram cavernas e praias desertas, imaginando a vida dos antigos corsários. O acesso difícil por estrada ajuda a manter o local preservado.",
    x: 19,
    y: 18,
  },
  {
    id: "curitiba-retorno",
    name: "5. Curitiba (Retorno)",
    location: "Paraná, Brasil",
    description:
      "Fim da grande expedição! Você completou a volta pela América, passando pelos pontos mais cobiçados pelos piratas dos séculos XVI e XVII. Tesouros recuperados e história desvendada! ⚓",
    x: 65,
    y: 62,
  },
];

const SHIP_OFFSET_Y = -10;

export function PirateMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const [shipPos, setShipPos] = useState<{ x: number; y: number } | null>(null);
  const [shipRotation, setShipRotation] = useState(0);
  const [pathD, setPathD] = useState("");
  const [activeTreasure, setActiveTreasure] = useState<Treasure | null>(null);
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set());
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 5;

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastPos.current) {
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      if (Math.hypot(dx, dy) > 4) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        setShipRotation(angle);
      }
    }
    lastPos.current = { x, y };

    setShipPos({ x, y });

    const now = performance.now();
    trailRef.current.push({ x, y, t: now });
    trailRef.current = trailRef.current.filter((p) => now - p.t < 1200);

    if (trailRef.current.length > 1) {
      const pts = trailRef.current;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        d += ` L ${pts[i].x} ${pts[i].y}`;
      }
      setPathD(d);
    }
  }, []);

  const handleLeave = useCallback(() => {
    setShipPos(null);
    trailRef.current = [];
    setPathD("");
    lastPos.current = null;
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const now = performance.now();
      trailRef.current = trailRef.current.filter((p) => now - p.t < 1200);
      if (trailRef.current.length > 1) {
        const pts = trailRef.current;
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
        setPathD(d);
      } else {
        setPathD("");
      }
    }, 80);
    return () => clearInterval(id);
  }, []);

  // Ctrl + wheel to zoom, anchored at cursor
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      setZoom((prevZoom) => {
        const delta = -e.deltaY * 0.0025;
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom * (1 + delta)));
        if (next === prevZoom) return prevZoom;
        setPan((prevPan) => {
          // Keep cursor point stable: world = (cursor - pan)/zoom; new pan = cursor - world*next
          const worldX = (cx - prevPan.x) / prevZoom;
          const worldY = (cy - prevPan.y) / prevZoom;
          let nx = cx - worldX * next;
          let ny = cy - worldY * next;
          // Clamp so we never expose outside of map
          const w = rect.width;
          const h = rect.height;
          nx = Math.min(0, Math.max(w - w * next, nx));
          ny = Math.min(0, Math.max(h - h * next, ny));
          return { x: nx, y: ny };
        });
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleTreasureClick = (t: Treasure) => {
    setActiveTreasure(t);
    setFoundIds((prev) => new Set(prev).add(t.id));
  };

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="w-full">
      <div
        ref={mapRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="relative w-full mx-auto aspect-square max-h-[88vh] overflow-hidden rounded-xl border-4 border-parchment-dark shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] select-none"
        style={{ cursor: "none", maxWidth: "min(100%, 88vh)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            transition: "transform 0.08s ease-out",
          }}
        >
        <img
          src={pirateMap}
          alt="Mapa político real da América do Sul e Central com fronteiras e nomes dos países"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ filter: "sepia(0.35) saturate(1.05) contrast(0.98)" }}
          draggable={false}
        />

        {/* Parchment overlay tint (subtle to keep country names readable) */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.85 0.08 75 / 0.15) 0%, oklch(0.55 0.1 50 / 0.25) 100%)",
          }}
        />

        {/* Animated ocean shimmer */}
        <div
          className="absolute inset-0 pointer-events-none animate-ocean-shimmer mix-blend-overlay opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 8px, oklch(0.55 0.08 220 / 0.25) 8px 9px)",
          }}
        />

        {/* Drifting clouds (One Piece style) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[6]">
          <div className="pirate-cloud pirate-cloud-1" />
          <div className="pirate-cloud pirate-cloud-2" />
          <div className="pirate-cloud pirate-cloud-3" />
        </div>

        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(40,20,10,0.5)_100%)]" />

        {TREASURES.map((t) => {
          const found = foundIds.has(t.id);
          return (
            <button
              key={t.id}
              onClick={() => handleTreasureClick(t)}
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
              aria-label={`Tesouro: ${t.name}`}
            >
              <span
                className={`relative block text-3xl md:text-4xl font-bold leading-none transition-transform group-hover:scale-125 animate-treasure-pulse ${
                  found ? "text-treasure-gold-glow" : "text-blood-red"
                }`}
                style={{
                  fontFamily: "var(--font-pirate)",
                  textShadow: "2px 2px 0 oklch(0.25 0.08 40), -1px -1px 0 oklch(0.25 0.08 40)",
                  cursor: "none",
                }}
              >
                ✕
              </span>
              <span className="absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] md:text-xs px-2 py-0.5 rounded bg-ink-brown/90 text-parchment opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {t.name}
              </span>
            </button>
          );
        })}

        {/* Official route between treasures (gold dashed) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={`M ${TREASURES.map((t) => `${t.x} ${t.y}`).join(" L ")}`}
            fill="none"
            stroke="oklch(0.78 0.17 80)"
            strokeDasharray="1.5 1.5"
            strokeLinecap="round"
            opacity={0.8}
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 2.5 }}
          />
        </svg>

        </div>
        {/* end zoomed wrapper */}

        {/* Live mouse trail (red dotted) — in screen space, above zoom */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="oklch(0.5 0.22 25)"
              strokeWidth={3}
              strokeDasharray="2 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.85}
            />
          )}
        </svg>

        {shipPos && (
          <img
            src={pirateShip}
            alt=""
            aria-hidden
            className="absolute pointer-events-none z-30 w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            style={{
              left: shipPos.x,
              top: shipPos.y + SHIP_OFFSET_Y,
              transform: `translate(-50%, -50%) rotate(${shipRotation}deg)`,
              transition: "transform 0.15s ease-out",
            }}
          />
        )}

        <div className="absolute top-4 right-4 z-20 bg-ink-brown/85 text-treasure-gold px-3 py-1.5 rounded-md border border-treasure-gold/40 text-sm font-bold backdrop-blur">
          🏴‍☠️ {foundIds.size} / {TREASURES.length} tesouros
        </div>

        {/* Zoom indicator + reset */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="bg-ink-brown/85 text-treasure-gold px-3 py-1.5 rounded-md border border-treasure-gold/40 text-xs font-bold backdrop-blur">
            🔍 {zoom.toFixed(1)}x
          </div>
          {zoom > 1 && (
            <button
              onClick={resetZoom}
              className="bg-ink-brown/85 text-treasure-gold px-3 py-1.5 rounded-md border border-treasure-gold/40 text-xs font-bold backdrop-blur hover:bg-ink-brown transition-colors"
              style={{ cursor: "none" }}
            >
              Resetar
            </button>
          )}
        </div>

        {/* Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-ink-brown/75 text-parchment px-3 py-1 rounded-md text-[11px] backdrop-blur pointer-events-none">
          Segure <kbd className="px-1 rounded bg-treasure-gold/30 text-treasure-gold-glow">Ctrl</kbd> + scroll para dar zoom
        </div>
      </div>

      <Dialog open={!!activeTreasure} onOpenChange={(open) => !open && setActiveTreasure(null)}>
        <DialogContent className="bg-parchment border-4 border-parchment-dark text-ink-brown max-w-2xl shadow-[var(--shadow-treasure)]">
          {activeTreasure && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl md:text-4xl text-blood-red font-normal text-left" style={{ fontFamily: "var(--font-pirate)" }}>
                  ✕ {activeTreasure.name}
                </DialogTitle>
                <DialogDescription className="text-ink-brown italic text-base md:text-lg text-left font-semibold">
                  📍 {activeTreasure.location}
                </DialogDescription>
              </DialogHeader>
              <div
                className="mt-2 text-base md:text-lg leading-relaxed text-ink-brown whitespace-pre-line max-h-[60vh] overflow-y-auto pr-3"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {activeTreasure.description}
              </div>
              <div className="mt-4 pt-4 border-t border-parchment-dark/40 text-center text-sm text-ink-brown/70 italic">
                ⚓ Tesouro adicionado ao seu diário de bordo ⚓
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

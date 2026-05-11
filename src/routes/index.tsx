import { createFileRoute } from "@tanstack/react-router";
import { PirateMap } from "@/components/PirateMap";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Caça ao Tesouro Pirata — Mapa Interativo" },
      {
        name: "description",
        content:
          "Explore um mapa interativo de piratas! Encontre lugares históricos com X de caça ao tesouro e siga a trilha do seu navio pirata.",
      },
      { property: "og:title", content: "Caça ao Tesouro Pirata — Mapa Interativo" },
      {
        property: "og:description",
        content:
          "Mapa pirata interativo para adolescentes. Descubra a história dos piratas em lugares lendários!",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground py-3 px-3 md:py-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-3 md:mb-4">
          <h1 className="text-3xl md:text-5xl text-treasure-gold drop-shadow-[0_3px_0_oklch(0.25_0.08_40)]">
            ☠ Caça ao Tesouro Pirata ☠
          </h1>
          <p className="mt-1 text-[11px] md:text-xs text-treasure-gold/90 font-bold tracking-wide">
            8º ano A — Grupo:
            <span className="text-foreground/80 font-normal">
              {" "}Ana Laura (web designer & vibe coder) · Bianca (informações & construção do guia) · Isadora G. (informações & construção do guia)
            </span>
          </p>
          <p className="mt-1 text-xs md:text-sm text-foreground/75">
            <span className="text-treasure-gold font-bold">
              Curitiba → Ilha do Mel → Chile → Costa Rica → Curitiba
            </span>
            {" "}— mova o mouse e clique nos{" "}
            <span className="text-blood-red font-bold">✕</span> para descobrir cada porto.
          </p>
        </header>

        <PirateMap />
      </div>
    </main>
  );
}

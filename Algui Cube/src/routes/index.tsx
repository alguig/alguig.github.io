import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, animate } from "motion/react";
import cubeClosed from "@/assets/cube-closed.webp";
import cubeCracked from "@/assets/cube-cracked.webp";
import cubeOpen from "@/assets/cube-open.webp";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALGUI G" },
      { name: "description", content: "ALGUI G" },
      { property: "og:title", content: "ALGUI G" },
      { property: "og:description", content: "ALGUI G" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

const SONG_URL = "https://open.spotify.com/intl-es/artist/42eAlM4aJco4N5socXHWnM";

const LINKS = [
  { label: "spotify", url: "https://open.spotify.com/intl-es/artist/42eAlM4aJco4N5socXHWnM?si=JlD0Xj4zQ_Cep-QMTzQE3A" },
  { label: "apple music", url: "https://music.apple.com/es/artist/algui-g/1773858514" },
  { label: "instagram", url: "https://www.instagram.com/_alguig/?hl=es" },
  { label: "tiktok", url: "https://www.tiktok.com/@_alguig" },
  { label: "youtube", url: "https://www.youtube.com/@AlguiG" },
];

const EMAIL = "alguireply@gmail.com";

function Index() {
  return (
    <main className="bg-void text-foreground">
      <CubeScene />
      <LinksScene />
      <ContactScene />
    </main>
  );
}

/* ---------------- Cube scene ---------------- */

const ease = (t: number) => t * t * (3 - 2 * t);

function CubeScene() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [openLevel, setOpenLevel] = useState(reduce ? 0.6 : 0);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduce) setOpenLevel(0.6);
  }, [reduce]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const STEPS = [0.5, 0.8];
  const stepRef = useRef(0);
  const onCubeClick = () => {
    if (stepRef.current >= STEPS.length) {
      window.open(SONG_URL, "_blank", "noopener,noreferrer");
      return;
    }
    const target = STEPS[stepRef.current];
    stepRef.current += 1;
    animate(openLevel, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v: number) => setOpenLevel(v),
    });
  };

  const o = openLevel;
  const auraOpacity = Math.min(1, Math.pow(o, 0.72) * 1.15);
  const emberScale = 0.85 + o * 0.5;

  const SIZE = isMobile ? "min(78vmin, 420px)" : "min(82vmin, 580px)";
  const emberBlur = isMobile ? "16px" : "26px";

  const crackedOpacity = Math.max(0, Math.min(1, (o - 0.35) * 4)) * (1 - Math.max(0, (o - 0.78) * 2.5));
  const openOpacity = Math.max(0, Math.min(1, (o - 0.62) * 3.5));

  return (
    <section
      ref={sectionRef}
      className="relative h-[200svh] w-full"
      aria-label="cube"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-void">
        {/* atmospheric field (static gradients, cheap) */}
        <div className="atmos" />

        {/* single static smoke layer (desktop only) */}
        {!isMobile && <div aria-hidden className="smoke smoke-1" />}

        {/* static burgundy haze behind cube, opacity driven by openLevel only */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "110vmin",
            height: "130vmin",
            borderRadius: "9999px",
            background:
              "radial-gradient(ellipse, color-mix(in oklab, var(--aura) 55%, transparent) 0%, color-mix(in oklab, var(--ember-deep) 45%, transparent) 25%, transparent 65%)",
            opacity: 0.08 + auraOpacity * 0.32,
            transition: "opacity 600ms ease-out",
          }}
        />

        {/* contact shadow under cube (static) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: "22%",
            width: "48vmin",
            height: "12vmin",
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 70%)",
          }}
        />

        <div className="vignette" />


        {/* cube */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1600px", perspectiveOrigin: "50% 45%" }}
        >
          <motion.button
            type="button"
            onClick={onCubeClick}
            aria-label="open"
            className="relative cursor-pointer outline-none"
            style={{
              width: SIZE,
              height: SIZE,
              willChange: "transform",
            }}
            animate={reduce ? undefined : { y: isMobile ? [-3, 3, -3] : [-6, 6, -6] }}
            transition={{
              y: { duration: isMobile ? 8 : 7, repeat: Infinity, ease: [0.45, 0, 0.55, 1] },
            }}
          >
            <div className="absolute inset-0">
            {/* closed cube — always visible base */}
            <img
              src={cubeClosed}
              alt=""
              draggable={false}
              loading="eager"
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
            />

            {/* cracked state */}
            {crackedOpacity > 0.01 && (
              <img
                src={cubeCracked}
                alt=""
                draggable={false}
                decoding="async"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                style={{ opacity: crackedOpacity }}
              />
            )}

            {/* opened cube */}
            {openOpacity > 0.01 && (
              <img
                src={cubeOpen}
                alt=""
                draggable={false}
                decoding="async"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
                style={{ opacity: openOpacity }}
              />
            )}

            {/* warm light bleeding from fracture */}
            {auraOpacity > 0.02 && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "70%",
                  height: `${20 + o * 80}%`,
                  background:
                    "radial-gradient(ellipse at center, color-mix(in oklab, var(--aura) 70%, white 10%) 0%, var(--ember) 30%, color-mix(in oklab, var(--ember-deep) 70%, transparent) 60%, transparent 80%)",
                  opacity: auraOpacity * 0.55,
                  filter: `blur(${emberBlur})`,
                  mixBlendMode: "screen",
                  willChange: "transform, opacity",
                }}
                animate={
                  reduce || isMobile
                    ? { scale: emberScale }
                    : { scale: [emberScale * 0.98, emberScale * 1.03, emberScale * 0.98] }
                }
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            </div>
          </motion.button>




        </div>

        {/* scroll cue */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 transition-opacity duration-700"
          style={{
            bottom: "7%",
            opacity: scrolled ? 0 : 1,
          }}
        >
          <div className="scroll-cue" />
        </div>

        <div className="grain" />
      </div>
    </section>
  );
}





/* ---------------- Links scene ---------------- */

function LinksScene() {
  return (
    <section
      aria-label="links"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-6 py-32"
    >
      {/* atmospheric continuation from cube scene (static, cheap) */}
      <div className="atmos opacity-80" />
      <div className="vignette" />
      <div className="grain" />


      <ul className="relative flex flex-col items-center gap-10 md:gap-12">
        {LINKS.map((l, i) => (
          <li
            key={l.label}
            className="link-rise"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-block px-1 py-1 text-[clamp(1.25rem,2.8vw,1.9rem)] font-extralight uppercase tracking-[0.42em] text-foreground/55 transition-all duration-700 ease-out hover:tracking-[0.5em] hover:text-foreground"
              style={{ fontFeatureSettings: '"ss01", "ss02"' }}
            >
              <span className="relative z-10">{l.label}</span>
              {/* hairline base rule */}
              <span
                aria-hidden
                className="absolute -bottom-2 left-1/2 h-px w-8 -translate-x-1/2 bg-foreground/15 transition-all duration-700 ease-out group-hover:w-full group-hover:bg-foreground/0"
              />
              {/* full sweep underline on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-2 left-0 h-px w-full origin-center scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in oklab, var(--aura) 70%, var(--chrome-3)) 50%, transparent)",
                }}
              />
              {/* subtle ember glow on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse at center, color-mix(in oklab, var(--aura) 40%, transparent) 0%, transparent 70%)",
                }}
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}


/* ---------------- Contact scene ---------------- */

function ContactScene() {
  return (
    <section
      aria-label="contact"
      className="relative flex min-h-svh w-full items-center justify-center px-6 py-32"
    >
      <div className="vignette" />
      <div className="grain" />
      <a
        href={`mailto:${EMAIL}`}
        className="relative text-[clamp(1.1rem,2.4vw,1.6rem)] font-light tracking-[0.04em]"
        style={{
          background:
            "linear-gradient(120deg, var(--chrome-3) 0%, var(--chrome-2) 40%, var(--chrome-1) 60%, var(--chrome-3) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {EMAIL}
      </a>
    </section>
  );
}

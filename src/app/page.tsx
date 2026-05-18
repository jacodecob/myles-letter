"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Stage =
  | "hidden"
  | "float-in"
  | "idle"
  | "flap-open"
  | "letter-rise"
  | "envelope-away"
  | "done";

function PinchZoomImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const gestureRef = useRef({
    startScale: 1,
    startDist: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isPinching: false,
    isPanning: false,
  });

  const clampTranslate = useCallback(
    (x: number, y: number, s: number) => {
      if (s <= 1) return { x: 0, y: 0 };
      const el = containerRef.current;
      if (!el) return { x, y };
      const rect = el.getBoundingClientRect();
      const maxX = (rect.width * (s - 1)) / 2;
      const maxY = (rect.height * (s - 1)) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    []
  );

  const getTouchDist = (t1: React.Touch, t2: React.Touch) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const g = gestureRef.current;
        g.isPinching = true;
        g.isPanning = false;
        g.startDist = getTouchDist(e.touches[0], e.touches[1]);
        g.startScale = scale;
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        g.startX = cx;
        g.startY = cy;
        g.lastX = translate.x;
        g.lastY = translate.y;
      } else if (e.touches.length === 1 && scale > 1) {
        const g = gestureRef.current;
        g.isPanning = true;
        g.startX = e.touches[0].clientX;
        g.startY = e.touches[0].clientY;
        g.lastX = translate.x;
        g.lastY = translate.y;
      }
    },
    [scale, translate]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const g = gestureRef.current;
      if (g.isPinching && e.touches.length === 2) {
        e.preventDefault();
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        const newScale = Math.max(1, Math.min(4, g.startScale * (dist / g.startDist)));
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const dx = cx - g.startX;
        const dy = cy - g.startY;
        setScale(newScale);
        setTranslate(clampTranslate(g.lastX + dx, g.lastY + dy, newScale));
      } else if (g.isPanning && e.touches.length === 1 && scale > 1) {
        const dx = e.touches[0].clientX - g.startX;
        const dy = e.touches[0].clientY - g.startY;
        setTranslate(clampTranslate(g.lastX + dx, g.lastY + dy, scale));
      }
    },
    [scale, clampTranslate]
  );

  const handleTouchEnd = useCallback(() => {
    gestureRef.current.isPinching = false;
    gestureRef.current.isPanning = false;
    if (scale <= 1.05) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        const newScale = Math.max(1, Math.min(4, scale + delta));
        if (newScale <= 1.05) {
          setScale(1);
          setTranslate({ x: 0, y: 0 });
        } else {
          setScale(newScale);
          setTranslate(clampTranslate(translate.x, translate.y, newScale));
        }
      }
    },
    [scale, translate, clampTranslate]
  );

  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  }, [scale]);

  const isGesturing = gestureRef.current.isPinching || gestureRef.current.isPanning;

  return (
    <div
      ref={containerRef}
      className="rounded-lg overflow-hidden"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        touchAction: scale > 1 ? "none" : "pan-y",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto block"
        draggable={false}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: isGesturing ? "none" : "transform 0.3s ease",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("hidden");

  useEffect(() => {
    const t = setTimeout(() => setStage("float-in"), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stage === "float-in") {
      const t = setTimeout(() => setStage("idle"), 1200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleOpen = useCallback(() => {
    if (stage !== "idle") return;
    setStage("flap-open");
    setTimeout(() => setStage("letter-rise"), 800);
    setTimeout(() => setStage("envelope-away"), 2400);
    setTimeout(() => setStage("done"), 3400);
  }, [stage]);

  const pastFlap =
    stage === "flap-open" ||
    stage === "letter-rise" ||
    stage === "envelope-away" ||
    stage === "done";
  const pastRise =
    stage === "letter-rise" || stage === "envelope-away" || stage === "done";
  const envelopeFalling = stage === "envelope-away" || stage === "done";
  const done = stage === "done";
  const showEnvelope = !done;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 overflow-hidden">
      {/* Envelope scene — removed from DOM when done */}
      {showEnvelope && (
        <div
          className="relative select-none"
          style={{
            perspective: "1000px",
            cursor: stage === "idle" ? "pointer" : "default",
            width: "min(420px, 90vw)",
            height: "min(280px, 60vw)",
          }}
          onClick={handleOpen}
        >
          {/* Letter peeking out behind envelope */}
          <div
            className="absolute left-1/2 overflow-hidden rounded-md"
            style={{
              width: "min(380px, 82vw)",
              aspectRatio: "3 / 2",
              bottom: pastRise ? "100%" : "20%",
              transform: "translateX(-50%)",
              transition: pastRise
                ? "bottom 1.6s cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
              zIndex: 1,
              opacity: pastFlap ? 1 : 0,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }}
          >
            <img
              src="/card/page-1.jpg"
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Envelope body */}
          <div
            className="relative"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 2,
              transform:
                stage === "hidden"
                  ? "translateY(80px) scale(0.9)"
                  : envelopeFalling
                    ? "translateY(120vh) rotate(6deg)"
                    : "translateY(0) scale(1)",
              opacity: stage === "hidden" ? 0 : envelopeFalling ? 0 : 1,
              transition:
                stage === "float-in"
                  ? "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease"
                  : envelopeFalling
                    ? "transform 1s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.5s ease 0.2s"
                    : "transform 0.6s ease, opacity 0.6s ease",
            }}
          >
            {/* Back */}
            <div
              className="absolute inset-0 rounded-md"
              style={{
                background:
                  "linear-gradient(180deg, #d4a96a 0%, #c99a55 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
            />
            {/* Inner V */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                height: "55%",
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                background:
                  "linear-gradient(180deg, #b8853e 0%, #c49250 60%)",
              }}
            />
            {/* Front face */}
            <div
              className="absolute inset-0 rounded-md overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, #e8c882 0%, #d4a96a 100%)",
                clipPath:
                  "polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 40%)",
              }}
            />
            {/* "To: Myles" */}
            <div
              className="absolute inset-0 flex items-end justify-center"
              style={{ paddingBottom: "15%" }}
            >
              <span
                className="text-3xl sm:text-4xl italic font-light"
                style={{
                  color: "#4a3520",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                To: Myles
              </span>
            </div>
            {/* Flap */}
            <div
              className="absolute left-0 right-0 top-0 origin-top"
              style={{
                height: "55%",
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                background: pastFlap
                  ? "linear-gradient(180deg, #c49a50 0%, #dbb66e 100%)"
                  : "linear-gradient(180deg, #dbb66e 0%, #d1a45e 100%)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transform: pastFlap ? "rotateX(180deg)" : "rotateX(0deg)",
                transition:
                  "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                transformStyle: "preserve-3d",
                zIndex: pastFlap ? 0 : 3,
              }}
            />
            {/* Texture */}
            <div
              className="absolute inset-0 rounded-md pointer-events-none opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.03) 8px, rgba(0,0,0,0.03) 9px)",
              }}
            />
          </div>

          {/* Tap hint */}
          {stage === "idle" && (
            <p
              className="text-center mt-6 text-sm tracking-wide animate-pulse"
              style={{ color: "#8a7560" }}
            >
              tap to open
            </p>
          )}
        </div>
      )}

      {/* Final cards */}
      {done && (
        <div
          className="flex flex-col items-center gap-8 animate-fade-up"
          style={{ maxWidth: "min(600px, 95vw)", width: "100%" }}
        >
          <PinchZoomImage
            src="/card/page-1.jpg"
            alt="Groomsman proposal card - front"
          />
          <PinchZoomImage
            src="/card/page-2.jpg"
            alt="Groomsman proposal card - back"
          />
          <p
            className="text-xs tracking-wide pb-4"
            style={{ color: "#8a7560" }}
          >
            pinch or double-tap to zoom
          </p>
        </div>
      )}
    </div>
  );
}

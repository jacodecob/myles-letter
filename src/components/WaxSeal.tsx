"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SealParticle {
  id: number;
  tx: number;
  ty: number;
  rotation: number;
  size: number;
  delay: number;
}

interface WaxSealProps {
  onBreak: () => void;
}

export default function WaxSeal({ onBreak }: WaxSealProps) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [particles, setParticles] = useState<SealParticle[]>([]);
  const [cracks, setCracks] = useState(0);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const cracksRef = useRef(0);
  const brokenRef = useRef(false);
  const holdingRef = useRef(false);
  const lastTimeRef = useRef(0);
  const onBreakRef = useRef(onBreak);
  onBreakRef.current = onBreak;

  const tick = useCallback((time: number) => {
    if (!holdingRef.current || brokenRef.current) return;

    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // ~1.5s to fill (progress from 0 to 100 over 1500ms)
    const increment = (delta / 1500) * 100;
    progressRef.current = Math.min(progressRef.current + increment, 100);
    setHoldProgress(Math.round(progressRef.current));

    if (progressRef.current >= 33 && cracksRef.current < 1) {
      cracksRef.current = 1;
      setCracks(1);
    }
    if (progressRef.current >= 66 && cracksRef.current < 2) {
      cracksRef.current = 2;
      setCracks(2);
    }

    if (progressRef.current >= 100) {
      cracksRef.current = 3;
      setCracks(3);
      brokenRef.current = true;
      setIsBroken(true);
      setParticles(
        Array.from({ length: 20 }, (_, i) => ({
          id: i,
          tx: (Math.random() - 0.5) * 200,
          ty: (Math.random() - 0.5) * 200,
          rotation: Math.random() * 360,
          size: 3 + Math.random() * 8,
          delay: Math.random() * 0.2,
        }))
      );
      setTimeout(() => onBreakRef.current(), 600);
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startHold = useCallback(() => {
    if (brokenRef.current) return;
    holdingRef.current = true;
    lastTimeRef.current = 0;
    setIsHolding(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stopHold = useCallback(() => {
    holdingRef.current = false;
    setIsHolding(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const crackLines = [
    "M 50 50 L 20 25",
    "M 50 50 L 80 30",
    "M 50 50 L 40 85",
    "M 50 50 L 75 70",
    "M 50 50 L 15 60",
  ];

  return (
    <div className="relative flex items-center justify-center">
      {/* Hint text */}
      <AnimatePresence>
        {!isBroken && holdProgress === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-12 text-amber-200/70 text-sm tracking-widest uppercase whitespace-nowrap"
          >
            Press &amp; hold to break the seal
          </motion.p>
        )}
      </AnimatePresence>

      {/* Progress ring */}
      {!isBroken && holdProgress > 0 && (
        <svg className="absolute w-28 h-28" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(255,180,60,0.15)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(255,180,60,0.8)"
            strokeWidth="2.5"
            strokeDasharray={`${holdProgress * 2.89} 289`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dasharray 0.05s linear" }}
          />
        </svg>
      )}

      {/* The seal */}
      <motion.button
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={startHold}
        onTouchEnd={stopHold}
        className={`relative w-24 h-24 rounded-full cursor-pointer select-none touch-none focus:outline-none ${
          !isBroken ? "seal-hover-hint" : ""
        }`}
        style={{
          background: isBroken
            ? "transparent"
            : `radial-gradient(circle at 35% 35%, #c0524a, #8b2020 60%, #5a1010)`,
        }}
        whileHover={!isBroken ? { scale: 1.05 } : undefined}
        whileTap={!isBroken ? { scale: 0.95 } : undefined}
        animate={
          isBroken
            ? { scale: 0, opacity: 0, rotate: 15 }
            : isHolding
            ? {
                rotate: [0, -1, 1, -1, 0],
                transition: { duration: 0.3, repeat: Infinity },
              }
            : {}
        }
        transition={isBroken ? { duration: 0.4 } : undefined}
      >
        {/* Wax texture overlay */}
        {!isBroken && (
          <>
            <div
              className="absolute inset-1 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 60% 60%, transparent 30%, rgba(0,0,0,0.3))",
              }}
            />
            {/* Embossed letter */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-3xl font-bold select-none"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  color: "rgba(200, 130, 130, 0.6)",
                  textShadow:
                    "1px 1px 1px rgba(0,0,0,0.4), -1px -1px 1px rgba(255,200,200,0.2)",
                }}
              >
                JM
              </span>
            </div>

            {/* Crack SVG overlay */}
            {cracks > 0 && (
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                {crackLines.slice(0, cracks * 2).map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    stroke="rgba(30,10,10,0.8)"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </svg>
            )}
          </>
        )}
      </motion.button>

      {/* Shatter particles */}
      <AnimatePresence>
        {isBroken &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-sm"
              style={{
                width: p.size,
                height: p.size,
                background: `linear-gradient(135deg, #c0524a, #8b2020)`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: p.tx,
                y: p.ty,
                opacity: 0,
                scale: 0,
                rotate: p.rotation,
              }}
              transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Envelope from "@/components/Envelope";
import Letter from "@/components/Letter";
import GoldenDust from "@/components/GoldenDust";

export default function Home() {
  const [phase, setPhase] = useState<"envelope" | "opening" | "letter">("envelope");

  const handleSealBroken = () => {
    setPhase("opening");
    setTimeout(() => setPhase("letter"), 1000);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #2a2035 0%, #1a1520 50%, #0f0d14 100%)",
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(180, 140, 80, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(100, 60, 120, 0.04) 0%, transparent 50%)",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <GoldenDust active={phase === "letter"} />

      <AnimatePresence mode="wait">
        {(phase === "envelope" || phase === "opening") && (
          <motion.div
            key="envelope"
            className="flex flex-col items-center z-10"
            exit={{ y: -80, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeIn" }}
          >
            <Envelope
              onSealBroken={handleSealBroken}
              sealBroken={phase === "opening"}
            />
          </motion.div>
        )}

        {phase === "letter" && (
          <motion.div
            key="letter"
            className="z-10 w-full flex justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Letter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom attribution */}
      <motion.p
        className="absolute bottom-4 text-amber-200/20 text-xs tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        MMXXVI
      </motion.p>
    </div>
  );
}

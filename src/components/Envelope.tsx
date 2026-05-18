"use client";

import { motion } from "framer-motion";
import WaxSeal from "./WaxSeal";

interface EnvelopeProps {
  onSealBroken: () => void;
  sealBroken: boolean;
}

export default function Envelope({ onSealBroken, sealBroken }: EnvelopeProps) {
  return (
    <motion.div
      className="relative"
      initial={{ y: 600, rotate: -5, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 80,
        duration: 1.5,
      }}
    >
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 rounded-[50%] bg-black/20 blur-xl"
        animate={
          !sealBroken
            ? {
                scaleX: [1, 1.03, 1],
                opacity: [0.2, 0.25, 0.2],
              }
            : {}
        }
        transition={
          !sealBroken
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      />

      <motion.div
        className="relative w-[min(480px,90vw)] aspect-[4/2.8] rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #f5e6c8 0%, #e8d5a8 40%, #d4c090 100%)",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.05)",
        }}
        animate={
          !sealBroken
            ? { y: [0, -4, 0] }
            : {}
        }
        transition={
          !sealBroken
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          className="absolute top-0 left-0 w-full h-1/2"
          style={{
            background: "linear-gradient(to bottom, #eedcb4, #e2cc98)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(0,0,0,0.1) 30.5%, transparent 31%), linear-gradient(225deg, transparent 30%, rgba(0,0,0,0.1) 30.5%, transparent 31%)",
          }}
        />

        <div
          className="absolute bottom-0 left-0 w-full h-[45%]"
          style={{
            background: "linear-gradient(to top, #dcc48a, transparent)",
            clipPath: "polygon(0 100%, 100% 100%, 50% 0%)",
            opacity: 0.5,
          }}
        />

        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 text-center">
          <p
            className="letter-body text-[#5a4a30] text-lg italic opacity-60"
          >
            To: Myles
          </p>
        </div>

        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 z-10">
          <WaxSeal onBreak={onSealBroken} />
        </div>
      </motion.div>
    </motion.div>
  );
}

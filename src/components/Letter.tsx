"use client";

import { motion } from "framer-motion";

export default function Letter() {
  return (
    <motion.div
      className="relative w-[min(560px,92vw)] mx-auto"
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[95%] h-6 bg-black/15 blur-2xl rounded-full" />

      <motion.div
        className="relative rounded-sm overflow-hidden letter-scroll"
        style={{
          background: "linear-gradient(175deg, #fdf8f0 0%, #f8f0e0 30%, #f5ebd5 100%)",
          boxShadow:
            "0 4px 30px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.5) inset, -2px 0 8px rgba(0,0,0,0.03) inset",
          maxHeight: "78vh",
          overflowY: "auto",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          className="absolute left-0 right-0 top-1/2 h-px opacity-[0.06]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)",
          }}
        />

        <div className="relative p-8 sm:p-12">
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-800/20" />
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-amber-800/30">
              <path
                d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
                fill="currentColor"
              />
            </svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-800/20" />
          </motion.div>

          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1
              className="letter-heading text-3xl sm:text-4xl font-bold text-amber-900/90 mb-2"
              style={{ letterSpacing: "0.04em" }}
            >
              A Formal Request
            </h1>
            <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-700/40 to-transparent" />
          </motion.div>

          <motion.div
            className="letter-body text-amber-950/80 space-y-5 text-lg sm:text-xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <p className="text-amber-900/50 text-base tracking-wider uppercase">
              To: Myles, Esq.
            </p>

            <p>Dear Myles,</p>

            <p>
              I&apos;m really glad you decided to check out the music club at GCU!
              I appreciate the friendship that we have built and maintained over
              the years. Now, I&apos;d love for you to check out being by my side
              at my wedding.
            </p>

            <p className="font-semibold text-amber-900/90 text-center text-2xl sm:text-3xl py-4 letter-heading">
              Will you be my Groomsman?
            </p>

            <p className="italic text-amber-800/70 pt-2">
              With all seriousness and love,
            </p>

            <div className="pt-2">
              <p className="letter-heading text-2xl text-amber-900/80 font-semibold">
                Jacob
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-800/20" />
            <svg width="14" height="14" viewBox="0 0 20 20" className="text-amber-800/25">
              <path
                d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
                fill="currentColor"
              />
            </svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-800/20" />
          </motion.div>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-amber-800/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-amber-800/30 flex items-center justify-center">
                <span
                  className="letter-heading text-amber-800/80 text-lg font-bold"
                  style={{ letterSpacing: "0.1em" }}
                >
                  JM
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
